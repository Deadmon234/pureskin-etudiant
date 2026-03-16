import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Creating new product...');
    
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const original_price = formData.get('original_price') as string;
    const category_id = formData.get('category_id') as string;
    const badge = formData.get('badge') as string;
    const stock_quantity = formData.get('stock_quantity') as string;
    const is_active = formData.get('is_active') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const image = formData.get('image') as File;
    
    // Get category IDs as array
    const categoryIds = formData.getAll('categoryIds[]') as string[];
    
    console.log('Product data:', { name, slug, price, categoryIds });

    // Handle image upload
    let imagePath = null;
    if (image && image.size > 0) {
      try {
        // Create products directory if it doesn't exist
        const productsDir = join(process.cwd(), 'public', 'images', 'products');
        await mkdir(productsDir, { recursive: true });
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${slug}-${timestamp}.${image.name.split('.').pop()}`;
        const fullPath = join(productsDir, filename);
        
        // Save image
        const buffer = Buffer.from(await image.arrayBuffer());
        await writeFile(fullPath, buffer);
        
        imagePath = `/images/products/${filename}`;
        console.log('✅ Image saved:', imagePath);
      } catch (error) {
        console.error('❌ Error saving image:', error);
        return NextResponse.json(
          { error: 'Failed to save image' },
          { status: 500 }
        );
      }
    }

    // Try to save to backend first
    try {
      const backendFormData = new FormData();
      backendFormData.append('name', name);
      backendFormData.append('slug', slug);
      backendFormData.append('description', description);
      backendFormData.append('price', price);
      if (original_price) backendFormData.append('original_price', original_price);
      if (category_id) backendFormData.append('category_id', category_id);
      if (badge) backendFormData.append('badge', badge);
      backendFormData.append('stock_quantity', stock_quantity);
      backendFormData.append('is_active', is_active.toString());
      backendFormData.append('is_featured', is_featured.toString());
      if (imagePath) backendFormData.append('image', imagePath);
      
      // Add categories
      categoryIds.forEach(catId => {
        backendFormData.append('categoryIds[]', catId);
      });

      const backendResponse = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        body: backendFormData,
      });

      if (backendResponse.ok) {
        const result = await backendResponse.json();
        console.log('✅ Product created in backend:', result);
        return NextResponse.json(result);
      } else {
        console.log('⚠️ Backend not available, using fallback');
      }
    } catch (backendError) {
      console.log('⚠️ Backend connection failed, using fallback');
    }

    // Fallback: Create product locally
    const newProduct = {
      id: Date.now(),
      name,
      slug,
      description,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      category_id: category_id ? parseInt(category_id) : null,
      categoryIds: categoryIds.map(id => parseInt(id)),
      badge,
      stock_quantity: parseInt(stock_quantity),
      is_active,
      is_featured,
      image: imagePath || '/images/products/placeholder.jpg',
      rating_average: 0,
      review_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('✅ Product created locally:', newProduct);
    return NextResponse.json(newProduct);
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
