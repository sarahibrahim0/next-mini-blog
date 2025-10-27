import { Metadata } from "next";
import ArticleItem from "../../components/articles/ArticleItem";
import SearchArticleInput from "@/components/articles/SearchArticlesInput";
import Pagination from "../../components/articles/Pagination";
import { Article } from "@/generated/prisma";
import { getArticles } from "@/apiCalls/articleApiCall";

interface ArticlesPageProps {
  searchParams: { pageNum: string };
}

const ArticlesPage = async ({ searchParams: { pageNum } }: ArticlesPageProps) => {

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // const res = await fetch(`http://localhost:3000/api/articles?pageNum=${pageNum}`);

  //       const res = await fetch(`https://jsonplaceholder.typicode.com/posts`
  //       ,{ next: { revalidate: 10 } }
  //    );

  //      const res = await fetch(`https://jsonplaceholder.typicode.com/posts`
  //       ,{ cache: 'force-cache' } // default
  //    );
  // const res = await fetch(`https://jsonplaceholder.typicode.com/posts` ,{
  // cache: 'no-store'
  // });

  const { articles, totalPages, currentPage } = await getArticles(pageNum);

  return (
    <section className="container m-auto px-5">
      <SearchArticleInput />
      <div className="flex flex-wrap justify-center items-center gap-7 my-10 ">
        {
        articles.map((ar) => (
          <ArticleItem key={ar.id} article={ar} />
        ))}
      </div>
      <Pagination pageNumber={currentPage} pages={totalPages} route="/articles" />
    </section>
  );
};
export default ArticlesPage;

export const metadata: Metadata = {
  title: "Articles",
  description: "Articles Page",
};
