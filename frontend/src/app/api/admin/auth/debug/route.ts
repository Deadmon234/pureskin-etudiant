import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;
    
    // Test direct to backend to check if user exists
    const backendResponse = await fetch('http://localhost:8080/api/admin/users/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: 'Backend error', status: backendResponse.status },
        { status: backendResponse.status }
      );
    }
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur de connexion au serveur', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
