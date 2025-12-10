import React from 'react';
import SchemaRenderer from './schema-renderer.component';
import { getPageMetaData, generateSchemaFromMetaData } from '@utils/meta-data-utils';

interface DynamicSchemaRendererProps {
  pagePath?: string;
  additionalSchemas?: any | any[];
  includeDefaults?: boolean;
}

export async function DynamicSchemaRenderer({ 
  pagePath,
  additionalSchemas,
  includeDefaults = false
}: DynamicSchemaRendererProps) {
  let schemas: any[] = [];

  if (pagePath) {
    try {
      const metaData = await getPageMetaData(pagePath);
      if (metaData) {
        const generatedSchema = generateSchemaFromMetaData(metaData);
        if (generatedSchema) {
          schemas.push(generatedSchema);
        }
      }
    } catch (error) {
      console.error(`Error fetching metadata for ${pagePath}:`, error);
    }
  }

  if (additionalSchemas) {
    if (Array.isArray(additionalSchemas)) {
      schemas = [...schemas, ...additionalSchemas.filter(Boolean)];
    } else {
      schemas.push(additionalSchemas);
    }
  }

  if (schemas.length === 0 && !includeDefaults) {
    return null;
  }

  return (
    <SchemaRenderer 
      schemas={schemas.length > 0 ? schemas : undefined}
      includeDefaults={includeDefaults}
    />
  );
}

export default DynamicSchemaRenderer;

