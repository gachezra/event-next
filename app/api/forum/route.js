import { NextResponse } from 'next/server';
import { ForumThread } from '../models/forumThreadModel';
import { Event } from '../models/eventsModel';
import { User } from '../models/userModel';
import dbConnect from '../db/db';

export async function POST(request) {
  try {
    await dbConnect();

    const { eventId, userId, title } = await request.json();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ msg: "Event not found.", status: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ msg: "User not found.", status: false });
    }

    const isRegistered = user.registeredEvents.includes(eventId);
    if (!isRegistered) {
      return NextResponse.json({ msg: "You must be registered for the event to start a thread.", status: false });
    }

    const newThread = await ForumThread.create({ title, event: eventId, user: userId });
    await newThread.populate('user', 'username avatarImage');

    return NextResponse.json({ status: true, thread: newThread });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
