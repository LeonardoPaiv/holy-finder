import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services/PostService';
import dbConnect from '@/lib/dbConnect';
import { verifyAuth } from '@/lib/apiUtils';
import { UserType } from '@/lib/models/common';

/**
 * DELETE /api/posts/[id]
 * Delete a post (only for institution admin or owner)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    // Verify authentication - only institution admin or owner can delete posts
    const { errorResponse, userProfile } = await verifyAuth(
      request,
      [UserType.INSTITUTION_ADMIN, UserType.INSTITUTION_OWNER]
    );

    if (errorResponse) {
      return errorResponse;
    }

    const postId = params.postId;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const service = new PostService();
    
    // Get the post first to verify ownership
    const post = await service.getPostById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Verify that the user belongs to the same institution as the post
    if (post.cnpj._id !== userProfile!.institution) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete posts from your institution' },
        { status: 403 }
      );
    }

    // Delete the post
    const result = await service.deletePost(postId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

