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

    // Connexion à la base de données
    const client = await pool.connect();

    try {
      // Statistiques des commandes
      const ordersStats = await client.query(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_orders,
          COALESCE(SUM(total_amount) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0) as monthly_revenue,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_orders
        FROM orders
      `);

      // Statistiques des utilisateurs
      const usersStats = await client.query(`
        SELECT COUNT(*) as total_users
        FROM users 
        WHERE role = 'user' AND is_active = true
      `);

      // Statistiques des produits
      const productsStats = await client.query(`
        SELECT COUNT(*) as total_products
        FROM products 
        WHERE is_active = true
      `);

      // Note moyenne des témoignages
      const ratingStats = await client.query(`
        SELECT COALESCE(AVG(rating), 0) as average_rating
        FROM testimonials 
        WHERE is_approved = true
      `);

      const stats = {
        totalOrders: parseInt(ordersStats.rows[0].total_orders),
        totalRevenue: parseFloat(ordersStats.rows[0].total_revenue),
        totalUsers: parseInt(usersStats.rows[0].total_users),
        totalProducts: parseInt(productsStats.rows[0].total_products),
        pendingOrders: parseInt(ordersStats.rows[0].pending_orders),
        averageRating: parseFloat(ratingStats.rows[0].average_rating),
        monthlyOrders: parseInt(ordersStats.rows[0].monthly_orders),
        monthlyRevenue: parseFloat(ordersStats.rows[0].monthly_revenue)
      };

      return NextResponse.json(stats);

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
