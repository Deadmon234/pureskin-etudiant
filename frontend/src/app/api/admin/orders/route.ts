import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/pureskin',
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware de vérification du token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérification du token
    const decoded = verifyToken(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupération du paramètre limit
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Connexion à la base de données
    const client = await pool.connect();

    try {
      // Récupération des commandes récentes
      const ordersQuery = `
        SELECT 
          o.id,
          o.order_number,
          o.total_amount,
          o.status,
          o.created_at,
          o.customer_email,
          COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') as customer_name,
          COUNT(oi.id) as items_count
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, o.order_number, o.total_amount, o.status, o.created_at, o.customer_email, c.first_name, c.last_name
        ORDER BY o.created_at DESC
        LIMIT $1
      `;

      const result = await client.query(ordersQuery, [limit]);

      const orders = result.rows.map((order: any) => ({
        id: order.order_number || order.id.toString(),
        customerName: order.customer_name.trim() || order.customer_email,
        email: order.customer_email,
        total: parseFloat(order.total_amount),
        status: order.status,
        date: order.created_at,
        items: parseInt(order.items_count)
      }));

      return NextResponse.json({
        success: true,
        orders: orders
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
