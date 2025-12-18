import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { PostService } from '@/lib/services/PostService';

const postService = new PostService();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const postId = searchParams.get('postId');
    const cnpj = searchParams.get('cnpj');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const religion = searchParams.get('religion');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Case 1: Get single post by ID
    if (postId) {
      const post = await postService.getPostById(postId);
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json(post);
    }

    // Case 2: Get posts by CNPJ
    if (cnpj) {
      const result = await postService.getFeedPosts(
        { cnpj },
        { page, limit }
      );

      return NextResponse.json(result);
    }

    // Case 3: Get posts by geolocation
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { error: 'Invalid latitude or longitude' },
          { status: 400 }
        );
      }

      const radiusKm = radius ? parseFloat(radius) : 5;

      const result = await postService.getFeedPosts(
        {
          lat: latitude,
          lng: longitude,
          radius: radiusKm,
          religion: religion || undefined
        },
        { page, limit }
      );

      return NextResponse.json(result);
    }

    // No valid parameters provided
    return NextResponse.json(
      { error: 'Please provide either postId, cnpj, or lat/lng parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
