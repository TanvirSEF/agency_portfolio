import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';

export async function POST(req: NextRequest) {
  try {
    const expectedToken = process.env.ADMIN_SESSION_TOKEN;

    if (!expectedToken) {
      return NextResponse.json(
        { error: 'ADMIN_SESSION_TOKEN is not configured.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const providedToken = typeof body?.token === 'string' ? body.token : '';

    if (!providedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, expectedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Admin session POST error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
