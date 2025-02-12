import { NextResponse } from 'next/server';
import { Event } from '../models/eventsModel';
import { Comment } from '../models/commentModel';
import dbConnect from '../db/db';

export async function POST(request) {
  try {
    await dbConnect();

    const { content, eventId, userId } = await request.json();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ msg: "Event not found.", status: false });
    }

    const newComment = await Comment.create({
      content,
      user: userId,
      event: eventId,
    });

    await newComment.populate('user', 'username avatarImage');

    return NextResponse.json({ status: true, comment: newComment });
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
};

export async function GET(request) {
  try {
    await dbConnect();

    const { eventId } = await request.json();

    const comments = await Comment.find({ event: eventId })
      .populate('user', 'username avatarImage')
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: true, comments });
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
};

export async function DELETE(request) {
  try {
    await dbConnect();

    const { commentId, userId } = await request.json();

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json({ msg: "Comment not found.", status: false });
    }

    if (comment.user.toString() !== userId) {
      return NextResponse.json({ msg: "Unauthorized to delete this comment.", status: false });
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ status: true, msg: "Comment deleted successfully." });
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
};