import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Effacer les tokens de l'admin
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    // Supprimer les cookies et headers d'authentification
    response.cookies.delete('admin_token');
    response.cookies.delete('admin_refresh_token');
    response.cookies.delete('admin_payment_token');
    response.cookies.delete('admin_payment_refresh_token');

    return response;

  } catch (error) {
    console.error('Erreur lors de la déconnexion admin:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la déconnexion'
    }, { status: 500 });
  }
}
