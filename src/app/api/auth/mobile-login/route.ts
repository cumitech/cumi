import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../../data/entities/index';

const JWT_SECRET = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    const userData = user.toJSON();
    
    // Check if user has a password (credentials auth)
    if (!userData.password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'This account uses social login. Please use social authentication.' 
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, userData.password);
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Remove password from user data
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
      message: 'Login successful',
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
    });
  } catch (error: any) {
    console.error('Mobile login error:', error);
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

