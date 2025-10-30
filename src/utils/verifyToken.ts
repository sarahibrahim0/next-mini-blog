import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { JWTPayload } from "@/utils/types";

/**
 * ✅ Verify token in API Routes
 * يقرأ التوكن من الكوكيز باستخدام NextRequest
 */
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get("jwtToken")?.value;
    if (!token) return null;

    const privateKey = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, privateKey) as JWTPayload;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * ✅ Verify token for server components / pages
 * يقرأ التوكن اللي تم تمريره (عادة من cookies() في الـ server)
 */
export function verifyTokenForPage(token: string | undefined): JWTPayload | null {
  try {
    if (!token) return null;

    const privateKey = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, privateKey) as JWTPayload;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * ✅ Helper: Get token easily inside Server Components
 * (اختياري) تستخدمه في الصفحات بدل ما تمرري التوكن يدوي
 */
export async function getUserFromCookies(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;
    if (!token) return null;

    const privateKey = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, privateKey) as JWTPayload;

    return decoded;
  } catch {
    return null;
  }
}
