import AddCommentForm from '@/components/comments/AddCommentForm';
import React from 'react';
import CommentItem from '@/components/comments/CommentItem';
import { getArticleById } from '@/apiCalls/articleApiCall';
import { SingleArticle } from '@/utils/types';
import {  redirect } from 'next/navigation';

interface Props {
  params : Promise<{ id : string}>
}

const SingleArticlePage = async ({params} : Props) => {
  const { id } = await params;

const article : SingleArticle =  await getArticleById(id);
if(!article){
 redirect('/not-found')
}
  
  return (
    <section className="fix-height container m-auto w-full px-5 pt-8 md:w-3/4 ">
            <div className="bg-white p-7 rounded-lg mb-7">
                <h1 className="text-3xl font-bold text-gray-700 mb-2">
                    {article.title}
                </h1>
                <div className="text-gray-400">
                    {/* {new Date(article.createdAt).toDateString()} */} 16-17-2025
                </div>
                <p className="text-gray-800 text-xl mt-5">{article.description}</p>
            </div>
            <AddCommentForm articleId={article.id}/>
            {article?.comments.length > 0 &&
            article?.comments.map((comment, index)=>{
              return (
                <CommentItem key={comment.id} comment={comment} userId={1}/>
              )
            })
             }

        </section>
  ) 
}

export default SingleArticlePage;
