import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { validateCompanyRequest } from '@/lib/apiUtils';
import { PostService } from '@/lib/services/PostService';
import { CompanyService } from '@/lib/services/CompanyService';
import { UserType } from '@/lib/models/common';

const postService = new PostService();
const companyService = new CompanyService();

export async function POST(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;
    const body = await request.json();

    // 1. Verify Authentication & Permissions
    const { errorResponse, userProfile } = await validateCompanyRequest(request, cnpj, [UserType.COMUM, UserType.INSTITUTION_ADMIN]);
    if (errorResponse) return errorResponse;

    // 2. Validate Body
    const { description, photo } = body;
    if (!description || !photo) {
      return NextResponse.json({ error: 'Missing description or photo' }, { status: 400 });
    }

    // 3. Get Company to retrieve geo and type
    const company = await companyService.getCompanyByCnpj(cnpj);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // 4. Create Post using service
    const newPost = await postService.createPost({
      cnpj,
      creator: userProfile!._id,
      type: company.type,
      description,
      photo,
      geo: company.geo
    });

    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    await dbConnect();
    const { cnpj } = params;
    const { searchParams } = new URL(request.url);

    // 1. Verify Authentication & Permissions
    const { errorResponse } = await validateCompanyRequest(request, cnpj, [UserType.COMUM, UserType.INSTITUTION_ADMIN]);
    if (errorResponse) return errorResponse;

    // 2. Parse Query Parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const creatorId = searchParams.get('creatorId');
    const postId = searchParams.get('postId');

    // 3. Build Filters
    const filters: any = { cnpj };
    if (postId) filters.postId = postId;
    if (creatorId) filters.creatorId = creatorId;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    // 4. Fetch Posts using service
    const result = await postService.getPostsPaginated(filters, { page, limit });

    return NextResponse.json({
      posts: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

