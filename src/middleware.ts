import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // 🌍 إعدادات CORS العامة
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 🟡 التعامل مع preflight requests (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // 🔐 منطق التحقق من التوكن
  const jwtToken = request.cookies.get('jwtToken')
  const token = jwtToken?.value as string

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/users/profile/')) {
      return NextResponse.json(
        { message: 'no token provided, access denied' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }
  } else {
    if (
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register'
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return res
}

// 📍 طبّقي الميدل وير على كل المسارات اللي فيها API
export const config = {
  matcher: ['/api/:path*', '/login', '/register'],
}
