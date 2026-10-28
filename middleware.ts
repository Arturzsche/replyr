import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  // Database sessions need Prisma, which only runs on the Node.js runtime.
  runtime: "nodejs",
  matcher: ["/dashboard/:path*"],
}
