import { Metadata } from 'next';
import { generateStructuredData } from '../lib/seo';

export function extractSchemaFromMetadata(metadata: Metadata): any[] | null {
  if (!metadata || !metadata.other) {
    return null;
  }

  const jsonLdData = metadata.other['application/ld+json'];
  
  if (!jsonLdData) {
    return null;
  }

  if (typeof jsonLdData === 'string') {
    try {
      const parsed = JSON.parse(jsonLdData);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Error parsing JSON-LD from metadata:', error);
      return null;
    }
  }

  if (typeof jsonLdData === 'object') {
    return Array.isArray(jsonLdData) ? jsonLdData : [jsonLdData];
  }

  return null;
}

export function getDefaultSchemas(): any[] {
  return [
    generateStructuredData('organization', {}),
    generateStructuredData('website', {})
  ].filter(Boolean);
}

export function mergeSchemas(...schemas: (any[] | null)[]): any[] {
  const merged: any[] = [];
  const seenTypes = new Set<string>();

  schemas.forEach(schemaArray => {
    if (!schemaArray) return;
    
    schemaArray.forEach(schema => {
      if (!schema) return;
      
      if (schema['@type']) {
        const typeKey = `${schema['@type']}-${schema['@id'] || schema.url || schema.name || ''}`;
        if (seenTypes.has(typeKey)) {
          return;
        }
        seenTypes.add(typeKey);
      }
      
      merged.push(schema);
    });
  });

  return merged;
}

