import { Metadata } from 'next';
import { extractSchemaFromMetadata } from './schema-extractor';
import { generateStructuredData } from '../lib/seo';

export async function getSchemaFromPageMetadata(metadata: Metadata): Promise<any[] | null> {
  return extractSchemaFromMetadata(metadata);
}

export function generatePageSchema(type: string, data: any): any {
  return generateStructuredData(type, data);
}

export function normalizeSchema(schema: any | any[]): any[] {
  if (!schema) return [];
  if (Array.isArray(schema)) return schema.filter(Boolean);
  return [schema];
}

