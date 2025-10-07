import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '../../../../data/entities/index';

const JWT_SECRET = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

// Force dynamic rendering since we use request data
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Refresh token is required' 
        },
        { status: 400 }
      );
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid or expired refresh token' 
        },
        { status: 401 }
      );
    }

    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid token type' 
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findOne({ where: { id: decoded.id } });
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    const userData = user.toJSON();

    // Generate new access token (7 days)
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

    // Optionally generate new refresh token (30 days)
    const newRefreshToken = jwt.sign(
      { 
        id: userData.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
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

