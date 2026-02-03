// lib/api/middleware.ts

import { NextRequest } from 'next/server';
import { JWTPayload } from '@/types/auth';
import { verifyToken } from '@/lib/auth/token';
import { ApiResponse } from './response';
import { logger } from '@/lib/logger';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function withAuth(
  request: AuthenticatedRequest,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return ApiResponse.unauthorized();
    }

    try {
      const user = verifyToken(token);
      request.user = user;
      return await handler(request);
    } catch (error) {
      logger.error('Token verification failed', { error });
      return ApiResponse.unauthorized('Invalid or expired token');
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return ApiResponse.error('Authentication error', 500);
  }
}

export function withRoles(requiredRoles: string[]) {
  return async function(
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<Response>
  ): Promise<Response> {
    const authResult = await withAuth(request, async (req) => {
      const user = req.user;
      
      if (!user) {
        return ApiResponse.unauthorized();
      }

      if (user.role === 'super_admin') {
        return await handler(req);
      }

      const hasRequiredRole = requiredRoles.some(role => 
        user.role === role || 
        (user.role && user.role.includes(role))
      );

      if (!hasRequiredRole) {
        return ApiResponse.forbidden();
      }

      return await handler(req);
    });

    return authResult;
  };
}

export function withPermissions(requiredPermissions: string[]) {
  return async function(
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<Response>
  ): Promise<Response> {
    const authResult = await withAuth(request, async (req) => {
      const user = req.user;
      
      if (!user) {
        return ApiResponse.unauthorized();
      }

      if (user.role === 'super_admin') {
        return await handler(req);
      }

      const hasRequiredPermission = true; 

      if (!hasRequiredPermission) {
        return ApiResponse.forbidden();
      }

      return await handler(req);
    });

    return authResult;
  };
}