export function applyCors(response: Response) {
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? "https://next-mini-blog-6zdo.vercel.app"
      : "http://localhost:3000";

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
