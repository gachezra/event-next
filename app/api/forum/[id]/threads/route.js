import { NextResponse } from 'next/server';
import { ForumThread } from '../../../models/forumThreadModel';
import dbConnect from '../../../db/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id: eventId } = params;

    const threads = await ForumThread.find({ event: eventId })
      .populate('user', 'username avatarImage')
      .populate('event', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: true, threads });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id: threadId } = params;
    const { userId } = await request.json();

    const thread = await ForumThread.findById(threadId);
    if (!thread) {
      return NextResponse.json({ msg: "Thread not found.", status: false });
    }

    if (thread.user.toString() !== userId) {
      return NextResponse.json({ msg: "Unauthorized to delete this thread.", status: false });
    }

    await ForumThread.findByIdAndDelete(threadId);

    return NextResponse.json({ status: true, msg: "Thread deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}