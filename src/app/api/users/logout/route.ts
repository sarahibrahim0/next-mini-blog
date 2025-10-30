import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { applyCors } from '@/lib/cors'

/**
 *  @method  GET
 *  @route   ~/api/users/logout
 *  @desc    Logout User
 *  @access  public
 */
export async function GET(request: NextRequest ) {
    try {
         const response = NextResponse.json(
    { message: "logout success" },
    { status: 200 }
  );

  // هنا بتحذفي الكوكي فعليًا
  response.cookies.set("jwtToken", "", { maxAge: 0 });

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
