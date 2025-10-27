import { NextRequest, NextResponse } from "next/server";
import { createArticleSchema } from "@/utils/validationSchemas";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(request: NextRequest) {
  try {
    const pageNum = request.nextUrl.searchParams.get("pageNum") || "1";
    const skip = (parseInt(pageNum) - 1) * 6;

    // 1️⃣ احسبي إجمالي عدد المقالات
    const totalCount = await prisma.article.count();

    // 2️⃣ جيبي المقالات
    const articles = await prisma.article.findMany({
      skip: skip,
      take: 6,
      include: {
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc", // الأفضل تضيفي ترتيب واضح
      },
    });

    // 3️⃣ احسبي عدد الصفحات الكلي
    const totalPages = Math.ceil(totalCount / 6);

    return NextResponse.json(
      {
        articles,
        totalPages,
        currentPage: parseInt(pageNum),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { message: "you must register first" },
        { status: 403 }
      );
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { message: "only admin can post" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.issues
            .map((issue) => issue.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    const newArticle = await prisma.article.create({
      data: {
        title: String(body.title),
        description: body.description,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
