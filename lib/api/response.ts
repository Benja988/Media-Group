// lib/api/response.ts

import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T = any>(data: T, message?: string, status = 200) {
    return NextResponse.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }, { status });
  }

  static error(message: string, status = 500, details?: any) {
    return NextResponse.json({
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString()
    }, { status });
  }

  static validationError(errors: Record<string, string[]>) {
    return this.error('Validation failed', 400, { errors });
  }

  static unauthorized(message = 'Authentication required') {
    return this.error(message, 401);
  }

  static forbidden(message = 'Insufficient permissions') {
    return this.error(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, 404);
  }

  static conflict(message = 'Resource already exists') {
    return this.error(message, 409);
  }
}