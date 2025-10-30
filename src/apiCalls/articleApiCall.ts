import { Article } from "@/generated/prisma";
import { SingleArticle } from "@/utils/types";

interface GetArticlesRes {
    articles : Article[],
    totalPages : number,
    currentPage : number
}

export async function getArticles(pageNum: string | undefined): Promise<GetArticlesRes> {
    const page = pageNum ?? "1"; // 👈 هنا بنخليها 1 افتراضيًا لو undefined

    const res = await fetch(
    `/api/articles?pageNum=${page}`,{
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

 const response =  await res.json();

  return response;

};


export async function getArticlesBySearch(searchText : string)  : Promise<Article[]>
{

  const res =await fetch(`/api/articles/search?searchText=${encodeURIComponent(searchText)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch searched articles");
    }
  const articles = await res.json();
  return articles

}
interface Props {
  params :{ id : string}
}
interface Param {
   id : string
}

export async function getArticleById({id} : Param)  : Promise<SingleArticle>
{

  const res =await fetch(`/api/articles/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch searched articles");
    }
  const article = await res.json();
  return article

}