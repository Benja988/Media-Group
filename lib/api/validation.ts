// lib/api/validation.ts

import { Types } from 'mongoose';

export interface ValidationRule {
  required?: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date';
  enum?: any[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  url?: boolean;
  mongoId?: boolean;
  items?: ValidationRule;
  schema?: Record<string, ValidationRule>;
}

export interface ValidationResult {
  valid: boolean;
  data: any;
  errors: Record<string, string[]>;
}

export function validateRequest(data: any, schema: Record<string, ValidationRule>): ValidationResult {
  const errors: Record<string, string[]> = {};
  const validatedData: any = {};

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];
    const fieldErrors: string[] = [];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field} is required`);
      continue;
    }

    // Skip validation if value is undefined and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type checking
    if (rule.type === 'string' && typeof value !== 'string') {
      fieldErrors.push(`${field} must be a string`);
    } else if (rule.type === 'number' && typeof value !== 'number') {
      fieldErrors.push(`${field} must be a number`);
    } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
      fieldErrors.push(`${field} must be a boolean`);
    } else if (rule.type === 'array' && !Array.isArray(value)) {
      fieldErrors.push(`${field} must be an array`);
    } else if (rule.type === 'object' && (typeof value !== 'object' || Array.isArray(value) || value === null)) {
      fieldErrors.push(`${field} must be an object`);
    } else if (rule.type === 'date' && !(value instanceof Date) && isNaN(Date.parse(value))) {
      fieldErrors.push(`${field} must be a valid date`);
    }

    // Additional validations for strings
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        fieldErrors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        fieldErrors.push(`${field} must be at most ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(`${field} has invalid format`);
      }
      if (rule.url && !isValidUrl(value)) {
        fieldErrors.push(`${field} must be a valid URL`);
      }
      if (rule.mongoId && !Types.ObjectId.isValid(value)) {
        fieldErrors.push(`${field} must be a valid MongoDB ObjectId`);
      }
    }

    // Additional validations for numbers
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        fieldErrors.push(`${field} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        fieldErrors.push(`${field} must be at most ${rule.max}`);
      }
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      fieldErrors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
    }

    // Array validation
    if (rule.type === 'array' && Array.isArray(value) && rule.items) {
      for (let i = 0; i < value.length; i++) {
        const itemResult = validateRequest({ item: value[i] }, { item: rule.items });
        if (!itemResult.valid) {
          fieldErrors.push(`${field}[${i}] ${Object.values(itemResult.errors)[0]}`);
        }
      }
    }

    // Object validation
    if (rule.type === 'object' && typeof value === 'object' && rule.schema) {
      const nestedResult = validateRequest(value, rule.schema);
      if (!nestedResult.valid) {
        for (const [nestedField, nestedErrors] of Object.entries(nestedResult.errors)) {
          fieldErrors.push(`${field}.${nestedField}: ${nestedErrors.join(', ')}`);
        }
      }
    }

    // If no errors, add to validated data
    if (fieldErrors.length === 0) {
      validatedData[field] = value;
    } else {
      errors[field] = fieldErrors;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    data: validatedData,
    errors
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Common validation schemas
export const contentValidationSchema: Record<string, ValidationRule> = {
  type: { required: true, type: 'string', enum: ['news', 'podcast', 'video', 'show'] },
  title: { required: true, type: 'string', minLength: 3, maxLength: 200 },
  slug: { type: 'string', pattern: /^[a-z0-9-]+$/ },
  description: { type: 'string', maxLength: 2000 },
  mediaUrl: { type: 'string', url: true },
  thumbnailUrl: { type: 'string', url: true },
  duration: { type: 'number', min: 0 },
  stationId: { type: 'string', mongoId: true },
  channelId: { type: 'string', mongoId: true },
  authorId: { type: 'string', mongoId: true },
  categoryIds: { type: 'array', items: { type: 'string', mongoId: true } },
  tagIds: { type: 'array', items: { type: 'string', mongoId: true } },
  status: { type: 'string', enum: ['draft', 'scheduled', 'published'] },
  publishedAt: { type: 'date' },
  scheduledFor: { type: 'date' }
};


export const engagementValidationSchema: Record<string, ValidationRule> = {
  contentId: { required: true, type: 'string', mongoId: true },
  userId: { type: 'string', mongoId: true },
  type: { required: true, type: 'string', enum: ['view', 'like', 'comment', 'share'] },
  value: { type: 'string', maxLength: 1000 }
};

export const categoryValidationSchema: Record<string, ValidationRule> = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 100,
  },
  slug: {
    required: true,
    type: "string",
    pattern: /^[a-z0-9-]+$/,
  },
  type: {
    required: true,
    type: "string",
    enum: ["news", "podcast", "video", "show"],
  },
  description: {
    type: "string",
    maxLength: 1000,
  },
  parentId: {
    type: "string",
    mongoId: true,
  },
  order: {
    type: "number",
    min: 0,
  },
  isActive: {
    type: "boolean",
  },
};

