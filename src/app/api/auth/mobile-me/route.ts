import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../data/entities/index';
import { verifyMobileToken } from '../../../../utils/mobile-auth';

// Force dynamic rendering since we use request.headers
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Verify token and get user info
    const payload = verifyMobileToken(req);
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized. Please provide a valid access token.' 
        },
        { status: 401 }
      );
    }

    // Get fresh user data from database
    const user = await User.findOne({ where: { id: payload.id } });
    
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
    const { password: _, ...userWithoutPassword } = userData;

    return NextResponse.json({
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username,
        fullname: userWithoutPassword.fullname,
        role: userWithoutPassword.role,
        verified: userWithoutPassword.verified,
        authStrategy: userWithoutPassword.authStrategy,
        createdAt: userWithoutPassword.createdAt,
        updatedAt: userWithoutPassword.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);
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

export async function PUT(req: NextRequest) {
  try {
    // Verify token and get user info
    const payload = verifyMobileToken(req);
    
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized. Please provide a valid access token.' 
        },
        { status: 401 }
      );
    }

    const { fullname, username } = await req.json();

    // Get user from database
    const user = await User.findOne({ where: { id: payload.id } });
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Check if username is taken by another user
    if (username && username !== user.toJSON().username) {
      const existingUsername = await User.findOne({ 
        where: { username } 
      });
      
      if (existingUsername && existingUsername.toJSON().id !== payload.id) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Username is already taken' 
          },
          { status: 409 }
        );
      }
    }

    // Update user
    await user.update({
      ...(fullname && { fullname }),
      ...(username && { username }),
      updatedAt: new Date(),
    });

    const userData = user.toJSON();
    const { password: _, ...userWithoutPassword } = userData;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username,
        fullname: userWithoutPassword.fullname,
        role: userWithoutPassword.role,
        verified: userWithoutPassword.verified,
        authStrategy: userWithoutPassword.authStrategy,
        createdAt: userWithoutPassword.createdAt,
        updatedAt: userWithoutPassword.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
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

