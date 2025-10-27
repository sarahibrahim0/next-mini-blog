import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

/**
 *  @method  GET
 *  @route   ~/api/articles/search?searchText=value
 *  @desc    Search Articles By Title
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");

    // ✅ لو المستخدم ما كتبش أي كلمة بحث
    if (!searchText || searchText.trim() === "") {
      return NextResponse.json(
        { message: "Please provide a search text" },
        { status: 400 }
      );
    }

    // ✅ البحث الجزئي عن المقالات
    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: searchText,
          mode: "insensitive",
        },
      },
    });  

    // ✅ لو مفيش نتائج
    if (articles.length === 0) {
      return NextResponse.json(
        { articles: [], message: "No results found" },
        { status: 200 } // 200 لأن العملية نجحت، بس مفيش بيانات
      );
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
