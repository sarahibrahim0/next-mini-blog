import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { verifyToken } from "@/utils/verifyToken";
import { UpdateCommentDto } from '@/utils/dtos';
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
 *  @method  PUT
 *  @route   ~/api/comments/:id
 *  @desc    Update Comment
 *  @access  private (only owner of the comment)
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
        if (!comment) {
            const response = NextResponse.json({ message: 'comment not found' }, { status: 404 });
            applyCors(response);
            return response;
        }

        const user = verifyToken(request);
        if (user === null || user.id !== comment.userId) {
            const response = NextResponse.json(
                { message: 'you are not allowed, access denied' },
                { status: 403 }
            );
            applyCors(response);
            return response;
        }

        const body = await request.json() as UpdateCommentDto;
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { text: body.text }
        });

        const response = NextResponse.json(updatedComment, { status: 200 });
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
 *  @method  DELETE
 *  @route   ~/api/comments/:id
 *  @desc    Delete Comment
 *  @access  private (only admin OR owner of the comment)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
        if (!comment) {
            const response = NextResponse.json({ message: 'comment not found' }, { status: 404 });
            applyCors(response);
            return response;
        }

        const user = verifyToken(request);
        if (user === null) {
            const response = NextResponse.json(
                { message: 'no token provided, access denied' },
                { status: 401 }
            );
            applyCors(response);
            return response;
        }

        if (user.isAdmin || user.id === comment.userId) {
            await prisma.comment.delete({ where: { id: parseInt(id) } });
            const response = NextResponse.json(
                { message: 'comment deleted' },
                { status: 200 }
            );
            applyCors(response);
            return response;
        }

        const response = NextResponse.json(
            { message: 'you are not allowed, access denied' },
            { status: 403 }
        );
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