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
      // Récupération des témoignages récents
      const testimonialsQuery = `
        SELECT 
          t.id,
          t.customer_name,
          t.customer_email,
          t.rating,
          t.comment,
          t.product_name,
          t.is_approved,
          t.created_at
        FROM testimonials t
        ORDER BY t.created_at DESC
        LIMIT $1
      `;

      const result = await client.query(testimonialsQuery, [limit]);

      const testimonials = result.rows.map((testimonial: any) => ({
        id: testimonial.id.toString(),
        customerName: testimonial.customer_name,
        rating: parseInt(testimonial.rating),
        comment: testimonial.comment,
        productName: testimonial.product_name,
        isApproved: testimonial.is_approved,
        date: testimonial.created_at
      }));

      return NextResponse.json({
        success: true,
        testimonials: testimonials
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
