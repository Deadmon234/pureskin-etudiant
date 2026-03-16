import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend
    const backendResponse = await fetch('http://localhost:8080/api/admin/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    
    // Return the response from the backend
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}
