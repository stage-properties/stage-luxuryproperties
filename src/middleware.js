import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const nextIntlMiddleware = createMiddleware({
  ...routing,
  redirect: true, // Ensure redirect to default locale is enabled
});

export default function middleware(request) {
  // First, call the next-intl middleware
  let response = nextIntlMiddleware(request);

  // Modify headers as needed
  const headers = new Headers(response?.headers || request.headers);
  headers.set('x-current-path', request.nextUrl.pathname);
  headers.set(
    'x-current-url',
    request.nextUrl
      .toString()
      .replace('https://localhost:3000', process.env.NEXT_PUBLIC_WEBSITE_URL)
      .replace('http://localhost:3000', process.env.NEXT_PUBLIC_WEBSITE_URL)
  );

  // If the next-intl middleware returned a response (e.g., a redirect), return it
  if (response) {
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // If no response from next-intl middleware, proceed with your custom logic
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};