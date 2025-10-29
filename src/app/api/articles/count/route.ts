import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { applyCors } from '@/lib/cors'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  applyCors(response);
  return response;
}


/**
 *  @method  GET
 *  @route   ~/api/articles/count
 *  @desc    Get Articles Count
 *  @access  public
 */
export async function GET(request: NextRequest) {
    try {
        const count = await prisma.article.count();
        const response = NextResponse.json({ count }, { status: 200 });
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