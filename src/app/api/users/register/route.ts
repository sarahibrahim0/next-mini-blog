import { NextResponse, NextRequest } from "next/server";
import { RegisterUserDto } from "./../../../../utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { JWTPayload } from '@/utils/types';
import { generateJWT, setCookie } from "@/utils/generateToken";
import { applyCors } from '@/lib/cors'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  applyCors(response);
  return response;
}
export async function POST(req: NextRequest ) {
  try {
    const body = (await req.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
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
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      const response = NextResponse.json(
        { message: "user is already registered" },
        { status: 400 }
      );
      applyCors(response);
      return response;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password , salt);
    const newUser = await prisma.user.create({
       data :{
         username: body.username,
        email : body.email,
        password: hashedPassword
       },
       select :{
        username : true,
        id: true,
        isAdmin: true
       }
    });

    const jwtPayload : JWTPayload = {id: newUser.id, username : newUser.username  , isAdmin: newUser.isAdmin}
    const token = generateJWT(jwtPayload);
    const cookie = setCookie(jwtPayload);

    const response = NextResponse.json({...newUser , token} , { status: 201  ,headers: {"Set-cookie" : cookie}} );
    applyCors(response);
    return response;
  } catch (err) {
    const response = NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
    applyCors(response);
    return response;
  }
}
