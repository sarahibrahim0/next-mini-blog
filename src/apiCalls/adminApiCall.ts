import { Comment } from "@/generated/prisma";

// ✅ Get all comments (server-safe)
export async function getAllComments(token: string): Promise<Comment[]> {
  const response = await fetch(`/api/comments`, {
    headers: {
      Cookie: `jwtToken=${token}`,
    },
    cache: "no-store", // عشان يمنع الكاش خصوصًا في البيانات المتغيرة
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}
