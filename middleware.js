import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  // Log the request path
  console.log("Request path:", request.cookies.get("adminAccessToken"));
  // Example: Redirect unauthenticated users
  request.cookies.set(
    "adminAccessToken",
    request.cookies.get("adminAccessToken"),
    {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: "None", // Required for cross-origin cookies
      path: "/",
      maxAge: 3600, // 1 hour
    }
  ); 
  const response = NextResponse.json({ message: "Cookie set successfully!" });

  // Set cookie
  response.headers.set(
    "Set-Cookie",
    `adminAccessToken=${request.cookies.get("adminAccessToken")}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`
  );


  // Continue with the request
  return NextResponse.next();
}
export const config = {
  matcher: ["/crimes"],
};
