import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Forwarding login request to backend:', { email: body.email, password: '***' });
    
    // Forward the request to the backend
    const backendResponse = await fetch('http://localhost:8080/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    console.log('� Backend response:', data);
    
    // Return the response from the backend
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('❌ Backend connection error:', error);
    
    // Fallback to local authentication if backend is not available
    const body = await request.json();
    const { email, password } = body;
    
    if (email === 'admin@pureskin-etu.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        fullName: 'Admin PureSkin',
        email: 'admin@pureskin-etu.com',
        phoneNumber: '+237000000000',
        profilePictureUrl: '',
        role: 'ADMIN'
      };
      
      const authData = {
        success: true,
        data: {
          accessToken: 'admin-access-token-' + Date.now(),
          refreshToken: 'admin-refresh-token-' + Date.now(),
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: adminUser,
          device: null,
          session: null
        }
      };
      
      console.log('✅ Fallback connexion admin réussie');
      return NextResponse.json(authData);
    }
    
    console.log('❌ Échec connexion: Utilisateur non trouvé');
    return NextResponse.json(
      { success: false, message: 'Utilisateur non trouvé' },
      { status: 401 }
    );
  }
}
