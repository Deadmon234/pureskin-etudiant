import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create products directory if it doesn't exist
    const productsDir = join(process.cwd(), 'public', 'images', 'products');
    await mkdir(productsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${slug || 'product'}-${timestamp}-${uuidv4()}.${fileExtension}`;
    const fullPath = join(productsDir, filename);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    // Return the file path
    const filePath = `/images/products/${filename}`;
    
    return NextResponse.json({
      success: true,
      filePath: filePath,
      filename: filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
