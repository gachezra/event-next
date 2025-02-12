import { NextResponse } from 'next/server';
import dbConnect from '../db/db';
import { Event } from '../models/eventsModel';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request) {
  try {dimentiosn
    await dbConnect();
    const body = await request.json();
    
    const event = new Event({
      title: body.title,
      description: body.description,
      date: body.date,
      location: body.location,
      user: body.user,
      image: body.image,
      isPaid: body.isPaid,
      ticketPrice: body.isPaid ? body.ticketPrice : 0,
    });

    const newEvent = await event.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 400 });
  }
}