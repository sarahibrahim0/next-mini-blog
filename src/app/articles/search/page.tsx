import { getArticlesBySearch } from '@/apiCalls/articleApiCall';
import { Article } from '@/generated/prisma';
import ArticleItem from '@/components/articles/ArticleItem';

interface SearchArticlePageProps {
  searchParams: { searchText: string };
}

const SearchArticlePage = async ({ searchParams} : SearchArticlePageProps) => {

  const {searchText} = searchParams;

  let articles: Article[];

  articles  = await getArticlesBySearch(searchText);

  return (
    <section className="fix-height container m-auto px-5">
      {articles.length === 0 ? (
        <h2 className='text-gray-800 text-2xl font-bold p-5'>
          Articles based on
          <span className='text-red-500 mx-1'>{searchText}</span>
          not found
        </h2>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2 mt-7 text-gray-800">
            Articles based on
            <span className='ms-1 text-green-700 text-3xl font-bold'>{searchText}</span>
          </h1>
{
                          articles.length > 0 ? 
                             <div className='flex items-center justify-center flex-wrap gap-7'>
            {
            articles.map(item => (
              <ArticleItem key={item.id} article={item} />
            ))}
          </div> : (
            <>
            <h3> No Articles Found </h3>
             </>
            
          )

}

       
        </>
      )}
    </section>
  )
}

export default SearchArticlePage