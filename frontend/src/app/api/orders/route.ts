import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const { items, customerInfo } = orderData;
    
    console.log('📦 Processing order:', { items: items.length, customerInfo });
    
    // Update stock for each ordered item (with fallback)
    const stockUpdates = items.map(async (item: any) => {
      try {
        console.log(`🔄 Updating stock for product ${item.id}...`);
        
        // Call backend to update stock
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/products/${item.id}/quantity`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            quantity: item.quantity,
            operation: 'decrease' 
          }),
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });

        if (backendResponse.ok) {
          const result = await backendResponse.json();
          console.log(`✅ Stock updated for product ${item.id}:`, result);
          return { productId: item.id, success: true, newStock: result.data.stock_quantity };
        } else {
          const errorText = await backendResponse.text();
          console.error(`❌ Backend error for product ${item.id}:`, backendResponse.status, errorText);
          return { productId: item.id, success: false, error: `Backend error: ${backendResponse.status}` };
        }
      } catch (error) {
        console.warn(`⚠️ Backend unavailable for product ${item.id}, using fallback:`, error instanceof Error ? error.message : error);
        // Fallback: allow order to proceed but mark stock update as failed
        return { productId: item.id, success: false, error: 'Backend unavailable - using fallback' };
      }
    });

    // Wait for all stock updates to complete
    const results = await Promise.all(stockUpdates);
    
    // Check if any stock updates failed
    const failedUpdates = results.filter(result => !result.success);
    
    if (failedUpdates.length > 0) {
      console.error('⚠️ Some stock updates failed:', failedUpdates);
      // Continue with order creation but note the stock issues
      // This is more user-friendly than blocking the entire order
    }

    // Create order record
    const successfulUpdates = results.filter(result => result.success);
    
    const order = {
      id: Date.now(),
      items,
      customerInfo,
      total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      status: failedUpdates.length === 0 ? 'confirmed' : 'pending_stock_update',
      createdAt: new Date().toISOString(),
      stockUpdates: {
        successful: successfulUpdates,
        failed: failedUpdates,
        total: results.length,
        successCount: successfulUpdates.length,
        failedCount: failedUpdates.length
      }
    };

    console.log('✅ Order processed successfully:', order);

    return NextResponse.json({
      success: true,
      message: 'Commande confirmée avec succès',
      order
    });

  } catch (error) {
    console.error('❌ Error processing order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors du traitement de la commande' 
      },
      { status: 500 }
    );
  }
}
