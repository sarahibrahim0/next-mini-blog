import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { verifyToken } from "@/utils/verifyToken";
import { CreateCommentDto } from '@/utils/dtos';
import { createCommentSchema } from '@/utils/validationSchemas';
import { applyCors } from '@/lib/cors'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  applyCors(response);
  console.log(response)
  return response;
}


/**
 *  @method  POST
 *  @route   ~/api/comments
 *  @desc    Create New Comment
 *  @access  private (only logged in user)
 */
export async function POST(request: NextRequest) {
    try {
        const user =  verifyToken(request);
        if(!user) {
            const response = NextResponse.json(
                { message: 'only logged in user, access denied' },
                { status: 401 }
            );
            applyCors(response);
            return response;
        }
        
        const body = await request.json() as CreateCommentDto;

        const validation = createCommentSchema.safeParse(body);
        if(!validation.success) {
    const response = NextResponse.json(
        {
          message: validation?.error.issues
            .map((issue) => issue.message)
            .join(", "),
        },
        { status: 400 }
      );
      applyCors(response);
      return response;
        }

        const newComment = await prisma.comment.create({
            data: {
                text: body.text,
                articleId: body.articleId,
                userId: user.id
            }
        });
        const response = NextResponse.json(newComment, { status: 201 });
        applyCors(response);
        return response;

    } catch (error) {
        const response = NextResponse.json(
            { message: 'internal server error' },
            { status: 500 }
        );
        applyCors(response);
        return response;
    }
}

/**
 *  @method  GET
 *  @route   ~/api/comments
 *  @desc    Get All Comments
 *  @access  private (only admin)
 */
export async function GET(request: NextRequest) {
    try {
        const user = verifyToken(request);
        if(user === null || user.isAdmin === false) {
           const response = NextResponse.json(
            { message: 'only admin, access denied' },
            { status: 403 }
           );
           applyCors(response);
           return response;
        }

        const comments = await prisma.comment.findMany();
        const response = NextResponse.json(comments, { status: 200 });
        applyCors(response);
        return response;

    } catch (error) {
        const response = NextResponse.json(
            { message: 'internal server error' },
            { status: 500 }
        );
        applyCors(response);
        return response;
    }
}