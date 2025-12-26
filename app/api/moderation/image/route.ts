import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiUtils';

/**
 * Sightengine moderation for images
 */
async function moderateWithSightengine(image: string, apiUser: string, apiSecret: string) {
  // Convert base64 data URL to Blob
  const base64Data = image.split(',')[1]; // Remove data:image/...;base64, prefix
  const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
  
  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });

  // Create FormData and append the file
  const formData = new FormData();
  formData.append('media', blob, 'image.jpg');
  formData.append('models', 'nudity-2.1');
  formData.append('api_user', apiUser);
  formData.append('api_secret', apiSecret);

  const response = await fetch('https://api.sightengine.com/1.0/check.json', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sightengine API error response:', errorText);
    throw new Error(`Sightengine API error: ${response.status}`);
  }

  const data = await response.json();

  // Map Sightengine response to our format
  const flagged = 
    (data.nudity?.sexual_activity > 0.5) ||
    (data.nudity?.sexual_display > 0.5) ||
    (data.nudity?.very_suggestive > 0.5) ||
    (data.nudity?.erotica > 0.5);

  return {
    flagged,
    categories: {
      sexual: (data.nudity?.sexual_activity > 0.5) || (data.nudity?.sexual_display > 0.5),
    },
    category_scores: {
      sexual: Math.max(data.nudity?.sexual_activity || 0, data.nudity?.sexual_display || 0),
    },
    provider: 'sightengine',
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userProfile, errorResponse } = await verifyAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Check if Sightengine is configured
    const sightengineUser = process.env.SIGHTENGINE_API_USER;
    const sightengineSecret = process.env.SIGHTENGINE_API_SECRET;

    if (!sightengineUser || !sightengineSecret) {
      console.error('Sightengine credentials not configured');
      return NextResponse.json(
        { error: 'Moderation service not configured' },
        { status: 500 }
      );
    }

    let result;

    try {
      console.log('Moderating image with Sightengine...');
      result = await moderateWithSightengine(image, sightengineUser, sightengineSecret);
      console.log('✅ Sightengine moderation successful');
    } catch (error: any) {
      console.error('❌ Sightengine moderation failed:', error.message);
      return NextResponse.json(
        { error: 'Moderation service unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores,
      provider: result.provider,
    });

  } catch (error: any) {
    console.error('Error in image moderation:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

