import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Créer le client Supabase côté serveur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // --- Protection /admin ---
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login?redirect=/admin", request.url));
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || user.email !== adminEmail) {
      // Connecté mais pas admin → page d'accueil
      return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
    }
  }

  // --- Protection /seller/dashboard, /seller/messages, /seller/stats ---
  const sellerProtected = ["/seller/dashboard", "/seller/messages", "/seller/stats", "/seller/add-product"];
  if (sellerProtected.some((path) => pathname.startsWith(path))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${pathname}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/seller/dashboard/:path*", "/seller/messages/:path*", "/seller/stats/:path*", "/seller/add-product/:path*"],
};
