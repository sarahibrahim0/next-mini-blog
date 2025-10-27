import { NextResponse, NextRequest } from "next/server";
import { LoginUserDto } from "./../../../../utils/dtos";
import { loginSchema } from "@/utils/validationSchemas";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { generateJWT, setCookie } from "@/utils/generateToken";
import { JWTPayload } from "@/utils/types";

export async function POST(req: NextRequest ) {
  try {
    const body = (await req.json()) as LoginUserDto;
    const validation = loginSchema.safeParse(body);
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
    if (!user) {
      return NextResponse.json(
        { message: "user isn't registered" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const isUser = await bcrypt.compare(body.password , user.password);
   
    if(!isUser){
          return NextResponse.json(
        { message: "wrong email or password " },
        { status: 400 }
      );
    };
   
    const jwtPayload : JWTPayload = {
        id: user.id,
        username: user.username,
        isAdmin : user.isAdmin
    }
    const token = generateJWT(jwtPayload);
    const cookie = setCookie(jwtPayload);
    return NextResponse.json({message: "user logged successfully", token} , { status: 200 , headers:{ "Set-cookie" : cookie}  } );
  } catch (err) {
    return NextResponse.json(
      { message: "internal server error"  },
      { status: 500 }
    );
  }
}
