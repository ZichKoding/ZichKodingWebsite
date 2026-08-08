import { type NextRequest, NextResponse } from 'next/server';

// Static-first migration (PR-A): the Supabase backend is gone, so the previous
// per-request session refresh + admin gate would hit a dead host on every request.
// This file is deleted entirely in PR-B along with the admin surface.
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
