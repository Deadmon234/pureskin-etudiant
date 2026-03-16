import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend
    const backendResponse = await fetch('http://localhost:8080/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await backendResponse.text();
    
    console.log('Backend response status:', backendResponse.status);
    console.log('Backend response:', responseText);
    
    // Try to parse as JSON, fallback to text if it fails
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }
    
    // Return the response from the backend
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur de connexion au serveur', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
