import { NextResponse } from 'next/server';
import { Users } from '../../models/userModel';

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
    const user = await Users.findById(userId).select([
      "email",
      "username",
      "avatarImage",
      "role"
    ]);

    if (!user) {
      return NextResponse.json({ 
        msg: "User not found.", 
        status: false 
      });
    }

    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = params.id;
    const { username, email } = await request.json();

    const usernameCheck = await Users.findOne({ 
      username, 
      _id: { $ne: userId } 
    });
    if (usernameCheck) {
      return NextResponse.json({ 
        msg: "Username already used.", 
        status: false 
      });
    }

    const emailCheck = await Users.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    if (emailCheck) {
      return NextResponse.json({ 
        msg: "Email already used.", 
        status: false 
      });
    }

    const userData = await Users.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    );

    return NextResponse.json({ 
      status: true, 
      user: userData, 
      msg: 'Profile successfully updated' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}