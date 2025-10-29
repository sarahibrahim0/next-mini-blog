import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/utils/db';
import { verifyToken } from '@/utils/verifyToken';
import { UpdateUserDto } from '@/utils/dtos';
import bcrypt from 'bcryptjs';
import { updateUserSchema } from '@/utils/validationSchemas';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/utils/types';
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
 *  @method  DELETE
 *  @route   ~/api/users/profile/:id
 *  @desc    Delete Profile
 *  @access  private (only user himself can delete his account)
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const resolvedParams = await params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(resolvedParams.id) },
            include: { comments: true }
        });
        if (!user) {
            const response = NextResponse.json(
                { message: 'user not found' },
                { status: 404 }
            );
            applyCors(response);
            return response;
        };



         const userFromToken = verifyToken(request);

        // const userFromToken = verifyToken(request);
        if (userFromToken !== null && userFromToken.id === user.id) {
            // deleting the user
            await prisma.user.delete({ where: { id: parseInt(resolvedParams.id) } });
            const response = NextResponse.json(
                { message: 'your profile (account) has been deleted' },
                { status: 200 }
            );
            applyCors(response);
            return response;
        }

        const response = NextResponse.json(
            { message: 'only user himself can delete his profile, forbidden' },
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


/**
 *  @method  GET
 *  @route   ~/api/users/profile/:id
 *  @desc    Get Profile By Id
 *  @access  private (only user himself can get his account/profile)
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
        where:{ id: parseInt(resolvedParams.id) },
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            isAdmin: true,
        }
    });

    if(!user) {
        const response = NextResponse.json({ message: 'user not found' }, { status: 404 });
        applyCors(response);
        return response;
    }

    const userFromToken = verifyToken(request);
    if(userFromToken === null || userFromToken.id !== user.id){
        const response = NextResponse.json(
            { message: 'you are not allowed, access denied' },
            { status: 403 }
        );
        applyCors(response);
        return response;
    }

    const response = NextResponse.json(user, { status: 200 });
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
 *  @method  PUT
 *  @route   ~/api/users/profile/:id
 *  @desc    Update Profile
 *  @access  private (only user himself can update his account/profile)
 */
export async function PUT(request: NextRequest, { params } : Props) {
    try {
        const resolvedParams = await params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(resolvedParams.id) }});
        if(!user) {
            const response = NextResponse.json({ message: 'user not found' }, { status: 404 });
            applyCors(response);
            return response;
        }

        const userFromToken = verifyToken(request);
        if(userFromToken === null || userFromToken.id !== user.id) {
            const response = NextResponse.json(
                { message: 'you are not allowed, access denied' },
                { status: 403 }
            );
            applyCors(response);
            return response;
        }

        const body = await request.json() as UpdateUserDto;
        const validation = updateUserSchema.safeParse(body);
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

        if(body.password) {
           const salt = await bcrypt.genSalt(10);
           body.password = await bcrypt.hash(body.password, salt);
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(resolvedParams.id) },
            data: {
                username: body.username,
                email: body.email,
                password: body.password
            }
        });

        const { password, ...other } = updatedUser;
        const response = NextResponse.json({ ...other }, { status: 200 });
        applyCors(response);
        return response;

    } catch (error) {
        return NextResponse.json(
            { message: 'internal server error' },
            { status: 500 }
        )
    }
}
