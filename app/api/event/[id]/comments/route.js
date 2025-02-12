import { NextResponse } from 'next/server';
import { Comment } from '../../../models/commentModel';
import { Event } from '../../../models/eventsModel';

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, eventId, userId } = body;

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
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ status: false, error: error.message });
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const comments = await Comment.find({ event: id })
      .populate('user', 'username avatarImage')
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ status: false, error: error.message });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { commentId, userId } = params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ msg: "Comment not found.", status: false });
    }

    if (comment.user.toString() !== userId) {
      return NextResponse.json({ msg: "Unauthorized to delete this comment.", status: false });
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ status: true, msg: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ status: false, error: error.message });
  }
}
