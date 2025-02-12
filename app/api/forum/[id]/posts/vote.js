import { NextResponse } from 'next/server';
import { ForumPost } from '../../models/forumPostModel';
import dbConnect from '../../db/db';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { id: postId } = params;
    const { userId, vote } = await request.json();

    if (!userId || !vote) {
      return NextResponse.json({ status: false, msg: "User ID and vote are required." });
    }

    if (!["up", "down"].includes(vote)) {
      return NextResponse.json({ status: false, msg: "Vote must be 'up' or 'down'." });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return NextResponse.json({ status: false, msg: "Post not found." });
    }

    if (vote === "up") {
      if (post.upvotedBy.includes(userId)) {
        return NextResponse.json({ status: true, msg: "Already upvoted.", upvotes: post.upvotes });
      }

      if (post.downvotedBy.includes(userId)) {
        post.downvotedBy.pull(userId);
        post.upvotes += 1;
      }

      post.upvotedBy.push(userId);
      post.upvotes += 1;
    }

    if (vote === "down") {
      if (post.downvotedBy.includes(userId)) {
        return NextResponse.json({ status: true, msg: "Already downvoted.", upvotes: post.upvotes });
      }

      if (post.upvotedBy.includes(userId)) {
        post.upvotedBy.pull(userId);
        post.upvotes -= 1;
      }

      post.downvotedBy.push(userId);
      post.upvotes -= 1;
    }

    await post.save();

    return NextResponse.json({
      status: true,
      msg: `Post ${vote}voted successfully.`,
      upvotes: post.upvotes,
    });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}
