import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models/userModel';
import dbConnect from '../db/db';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, password } = await request.json();
    
    const user = await Users.findOne({ username });
    if (!user) {
      return NextResponse.json({
        msg: "Incorrect username or password.",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        msg: "Incorrect username or password.",
        status: false,
      });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json({
        msg: "Please verify your email before logging in.",
        status: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '168h',
    });

    return NextResponse.json({ 
      status: true, 
      token, 
      user: { 
        username: user.username, 
        email: user.email, 
        avatarImage: user.avatarImage, 
        _id: user._id 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}