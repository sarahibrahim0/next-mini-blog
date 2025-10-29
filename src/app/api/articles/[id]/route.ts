import { NextRequest, NextResponse } from "next/server";
import { UpdateArticleDto } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";
import { applyCors } from '@/lib/cors'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  applyCors(response);
  return response;
}

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *  @method  GET
 *  @route   ~/api/articles/:id
 *  @desc    Get Single Article By Id
 *  @access  public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      const response = NextResponse.json(
        { message: "invalid article id" },
        { status: 400 }
      );
      applyCors(response);
      return response;
    }

    const article = await prisma.article.findUnique({
      where: { id: parsedId },
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
    });

    if (!article) {
      const response = NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
      applyCors(response);
      return response;
    }

    const response = NextResponse.json(article, { status: 200 });
    applyCors(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
    applyCors(response);
    return response;
  }
}

/**
 *  @method  PUT
 *  @route   ~/api/articles/:id
 *  @desc    Update Article
 *  @access  private (only admin can update article)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      const response = NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
      applyCors(response);
      return response;
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
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
    });

    if (!article) {
      const response = NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
      applyCors(response);
      return response;
    }

    const body = (await request.json()) as UpdateArticleDto;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    const response = NextResponse.json(updatedArticle, { status: 200 });
    applyCors(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
    applyCors(response);
    return response;
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/articles/:id
 *  @desc    Delete Article
 *  @access  private (only admin can delete article)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      const response = NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
      applyCors(response);
      return response;
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) }    });
    if (!article) {
      const response = NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
      applyCors(response);
      return response;
    }

    // deleting the article
    await prisma.article.delete({ where: { id: parseInt(id) } });

    const response = NextResponse.json({ message: "article deleted" }, { status: 200 });
    applyCors(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
    applyCors(response);
    return response;
  }
}
