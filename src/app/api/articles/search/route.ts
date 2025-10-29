import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { applyCors } from '@/lib/cors'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  applyCors(response);
  return response;
}

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
      const response = NextResponse.json(
        { message: "Please provide a search text" },
        { status: 400 }
      );
      applyCors(response);
      return response;
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
      const response = NextResponse.json(
        { articles: [], message: "No results found" },
        { status: 200 } // 200 لأن العملية نجحت، بس مفيش بيانات
      );
      applyCors(response);
      return response;
    }

    const response = NextResponse.json(articles, { status: 200 });
    applyCors(response);
    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
    applyCors(response);
    return response;
  }
}
