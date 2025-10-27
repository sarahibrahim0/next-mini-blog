import { getArticleById} from '@/apiCalls/articleApiCall';
import { Article } from '@/generated/prisma';
import EditArticleForm from './EditArticleFrom';
import { cookies } from 'next/headers';
import { verifyTokenForPage } from '@/utils/verifyToken';
import { redirect } from "next/navigation";
interface EditArticlePageProps {
    params: { id: string };
}

const EditArticlePage = async ({ params } : EditArticlePageProps) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  if(!payload?.isAdmin) redirect("/");

  const article: Article = await getArticleById(params);

  return (
    <section className='fix-height flex items-center justify-center px-5 lg:px-20'>
      <div className='shadow p-4 bg-purple-200 rounded w-full'>
        <h2 className='text-2xl text-green-700 font-semibold mb-4'>
            Edit Article
        </h2>
        <EditArticleForm article={article} />
      </div>
    </section>
  )
}

export default EditArticlePage