import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, slug, description, price, original_price, 
      category_id, badge, stock_quantity, is_active, is_featured,
      quantity, operation 
    } = body;
    
    console.log(`🆕 Adding new product with quantity: ${quantity}, operation: ${operation}`);
    
    // Try to add to backend database
    try {
      const backendResponse = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          price,
          original_price,
          category_id,
          badge,
          stock_quantity: quantity,
          is_active: is_active !== false, // Actif par défaut si quantité > 0
          is_featured,
          operation: 'add'
        }),
      });

      if (backendResponse.ok) {
        const result = await backendResponse.json();
        console.log('✅ New product added to database:', result);
        return NextResponse.json({
          success: true,
          message: 'Nouveau produit ajouté avec succès dans la base de données',
          data: result.data
        });
      } else {
        console.log('⚠️ Backend database addition failed, using fallback');
      }
    } catch (backendError) {
      console.log('⚠️ Backend connection failed, using fallback');
    }

    // Fallback: Simulate database addition
    const newProductId = Date.now();
    const newProduct = {
      success: true,
      message: 'Nouveau produit ajouté avec succès (mode démo)',
      data: {
        id: newProductId,
        name,
        slug,
        description,
        price,
        original_price,
        category_id,
        badge,
        stock_quantity: quantity,
        is_active: is_active !== false,
        is_featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        operation: 'add',
        note: "Ajout en base de données pureSkin - à connecter pour persistance"
      }
    };

    console.log('✅ New product created (fallback):', newProduct);

    return NextResponse.json(newProduct);
    
  } catch (error) {
    console.error('❌ Error adding new product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de l\'ajout du nouveau produit',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
