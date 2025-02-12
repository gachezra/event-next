import { NextResponse } from 'next/server';
import { ForumPost } from '../../models/forumPostModel';
import { ForumThread } from '../../models/forumThreadModel';
import dbConnect from '../../db/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id: threadId } = params;

    const thread = await ForumThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ msg: "Thread not found.", status: false });
    }

    let posts = await ForumPost.find({ thread: threadId, parent: null })
      .populate('user', 'username avatarImage')
      .sort({ createdAt: -1 });

    const populateRepliesRecursively = async (posts) => {
      for (const post of posts) {
        if (post.replies && post.replies.length > 0) {
          post.replies = await ForumPost.find({ _id: { $in: post.replies } }).populate('user', 'username avatarImage');
          await populateRepliesRecursively(post.replies);
        }
      }
      return posts;
    };

    posts = await populateRepliesRecursively(posts);

    return NextResponse.json({ status: true, thread: { ...thread.toObject(), posts } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { content, userId, parentId } = await request.json();
    const { id: threadId } = params;

    const thread = await ForumThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ msg: "Thread not found.", status: false });
    }

    const newPost = await ForumPost.create({ content, user: userId, thread: threadId, parent: parentId || null });

    if (parentId) {
      await ForumPost.findByIdAndUpdate(parentId, { $push: { replies: newPost._id } });
    } else {
      thread.posts.push(newPost._id);
      await thread.save();
    }

    await newPost.populate('user', 'username avatarImage');

    return NextResponse.json({ status: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id: postId } = params;
    const { userId } = await request.json();

    const post = await ForumPost.findById(postId);
    if (!post) {
      return NextResponse.json({ msg: "Post not found.", status: false });
    }

    if (post.user.toString() !== userId) {
      return NextResponse.json({ msg: "Unauthorized to delete this post.", status: false });
    }

    await ForumPost.findByIdAndDelete(postId);
    await ForumThread.updateOne({ posts: postId }, { $pull: { posts: postId } });

    return NextResponse.json({ status: true, msg: "Post deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 