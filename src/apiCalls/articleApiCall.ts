import { Article } from "@/generated/prisma";
import { SingleArticle } from "@/utils/types";
import { DOMAIN } from "@/utils/constants"; // 👈 هنعتمد عليه لتحديد الـ URL الكامل

interface GetArticlesRes {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

// 📰 Get all articles (server-safe)
export async function getArticles(pageNum: string | undefined): Promise<GetArticlesRes> {
  const page = pageNum ?? "1";

  const res = await fetch(`${DOMAIN}/api/articles?pageNum=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}

// 🔍 Get articles by search text
export async function getArticlesBySearch(searchText: string): Promise<Article[]> {
  const res = await fetch(`${DOMAIN}/api/articles/search?searchText=${encodeURIComponent(searchText)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch searched articles");
  }

  return res.json();
}

// 📰 Get single article by ID
export async function getArticleById(id: string): Promise<SingleArticle> {
  const res = await fetch(`${DOMAIN}/api/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }

  return res.json();
}
