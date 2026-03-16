import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, statSync } from 'fs';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

export async function GET() {
  try {
    const productsDir = join(process.cwd(), 'public', 'images', 'products');
    
    // Check if directory exists
    if (!existsSync(productsDir)) {
      return NextResponse.json({ videos: [] });
    }

    // Read directory and filter video files
    const files = await readdir(productsDir);
    const videoFiles = files.filter(file => {
      const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
      return VIDEO_EXTENSIONS.includes(ext);
    });

    // Create video objects with file stats
    const videos = [];
    for (const file of videoFiles) {
      const filePath = join(productsDir, file);
      const stats = statSync(filePath);
      
      videos.push({
        id: file.replace(/\.[^/.]+$/, ''), // Remove extension for ID
        name: file,
        url: `/images/products/${file}`,
        size: stats.size,
        uploadedAt: stats.mtime.toISOString()
      });
    }

    // Sort by upload date (newest first)
    videos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Video file too large (max 50MB)' },
        { status: 400 }
      );
    }

    // Create products directory if it doesn't exist
    const productsDir = join(process.cwd(), 'public', 'images', 'products');
    if (!existsSync(productsDir)) {
      await mkdir(productsDir, { recursive: true });
    }

    // Sanitize filename - preserve spaces and valid characters, remove dangerous ones
    let filename = file.name.replace(/[^a-zA-Z0-9\s\-_.]/g, '_');
    
    // Handle duplicate filenames
    let finalFilename = filename;
    let counter = 1;
    while (existsSync(join(productsDir, finalFilename))) {
      const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
      const extension = filename.substring(filename.lastIndexOf('.'));
      finalFilename = `${nameWithoutExt}_${counter}${extension}`;
      counter++;
    }
    
    const filepath = join(productsDir, finalFilename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: 'Video uploaded successfully',
      filename: finalFilename,
      url: `/images/products/${finalFilename}`,
      size: file.size
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
