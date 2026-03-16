import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('📂 Fetching categories...');
    
    // Try to get from backend first
    try {
      const backendResponse = await fetch('http://localhost:8080/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log('✅ Categories from backend:', data);
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('⚠️ Backend not available, using fallback categories');
    }

    // Fallback categories
    const categories = [
      {
        id: 1,
        name: 'Soins du visage',
        slug: 'soins-visage',
        description: 'Produits pour le soin quotidien du visage',
        image: '/images/categories/soins-visage.jpg',
        productCount: 15
      },
      {
        id: 2,
        name: 'Sérums',
        slug: 'serums',
        description: 'Sérums concentrés pour traitement ciblé',
        image: '/images/categories/serums.jpg',
        productCount: 8
      },
      {
        id: 3,
        name: 'Hydratation',
        slug: 'hydratation',
        description: 'Crèmes et lotions hydratantes',
        image: '/images/categories/hydratation.jpg',
        productCount: 12
      },
      {
        id: 4,
        name: 'Solaire',
        slug: 'solaire',
        description: 'Protection solaire pour tous types de peau',
        image: '/images/categories/solaire.jpg',
        productCount: 6
      },
      {
        id: 5,
        name: 'Corps',
        slug: 'corps',
        description: 'Soins pour le corps',
        image: '/images/categories/corps.jpg',
        productCount: 10
      }
    ];

    console.log('✅ Returning fallback categories');
    return NextResponse.json(categories);
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
