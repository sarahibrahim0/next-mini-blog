import { NextResponse, NextRequest } from "next/server";
import { RegisterUserDto } from "./../../../../utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { JWTPayload } from '@/utils/types';
import { generateJWT, setCookie } from "@/utils/generateToken";
export async function POST(req: NextRequest ) {
  try {
    const body = (await req.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation?.error.issues
            .map((issue) => issue.message)
            .join(", "),
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      return NextResponse.json(
        { message: "user is already registered" },
        { status: 400 }
      );
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

    return NextResponse.json({...newUser , token} , { status: 201  ,headers: {"Set-cookie" : cookie}} );
  } catch (err) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
