import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { User } from '../../../../data/entities/index';
import { emptyUser } from '../../../../domain/models/user';

const JWT_SECRET = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, fullname } = await req.json();

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email, password, and username are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ where: { username } });
    
    if (existingUsername) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Username is already taken' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      ...emptyUser,
      id: nanoid(20),
      username,
      email,
      password: hashedPassword,
      authStrategy: 'credentials',
      role: 'user',
      verified: false,
      fullname: fullname || username,
      // Fix foreign key constraint issues by overriding empty strings with null
      referredBy: null,
      deletedBy: null,
      registrationIp: req.ip || null,
      emailVerificationToken: null,
      passwordResetToken: null,
      twoFactorSecret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userData = newUser.toJSON();
    const { password: _, ...userWithoutPassword } = userData;

    // Generate access token (7 days)
    const accessToken = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role,
        username: userData.username,
        fullname: userData.fullname
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate refresh token (30 days)
    const refreshToken = jwt.sign(
      { 
        id: userData.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username,
        fullname: userWithoutPassword.fullname,
        role: userWithoutPassword.role,
        verified: userWithoutPassword.verified,
        authStrategy: userWithoutPassword.authStrategy,
      },
      accessToken,
      refreshToken,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Mobile registration error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

