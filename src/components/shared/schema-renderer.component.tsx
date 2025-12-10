import React from 'react';
import { JsonLdScript } from './json-ld-script.component';
import { getDefaultSchemas } from '@utils/schema-extractor';

interface SchemaRendererProps {
  schemas?: any | any[];
  includeDefaults?: boolean;
}

export function SchemaRenderer({ 
  schemas, 
  includeDefaults = true 
}: SchemaRendererProps) {
  let finalSchemas: any[] = [];

  if (includeDefaults) {
    finalSchemas = [...getDefaultSchemas()];
  }

  if (schemas) {
    if (Array.isArray(schemas)) {
      finalSchemas = [...finalSchemas, ...schemas.filter(Boolean)];
    } else {
      finalSchemas.push(schemas);
    }
  }

  const uniqueSchemas = finalSchemas.filter((schema, index, self) => {
    if (!schema) return false;
    
    const typeKey = `${schema['@type'] || 'unknown'}-${schema['@id'] || schema.url || schema.name || index}`;
    return index === self.findIndex(s => {
      const sTypeKey = `${s?.['@type'] || 'unknown'}-${s?.['@id'] || s?.url || s?.name || ''}`;
      return sTypeKey === typeKey;
    });
  });

  if (uniqueSchemas.length === 0) {
    return null;
  }

  return <JsonLdScript schema={uniqueSchemas.length === 1 ? uniqueSchemas[0] : uniqueSchemas} />;
}

export default SchemaRenderer;

