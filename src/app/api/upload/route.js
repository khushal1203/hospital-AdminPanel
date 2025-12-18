import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Create a unique filename
        const timestamp = Date.now();
        const randomNum = Math.round(Math.random() * 1E9);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomNum}.${extension}`;
        
        // Save file to public/uploads/donors
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const fs = require('fs');
        const path = require('path');
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'donors');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, buffer);
        
        // Return the file path
        const fileUrl = `/uploads/donors/${filename}`;
        
        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            filePath: fileUrl
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Upload failed', error: error.message },
            { status: 500 }
        );
    }
}