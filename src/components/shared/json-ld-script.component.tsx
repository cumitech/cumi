import React from 'react';

interface JsonLdScriptProps {
  schema: any | any[];
  id?: string;
}

export const JsonLdScript: React.FC<JsonLdScriptProps> = ({ schema, id }) => {
  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((item, index) => {
          if (!item) return null;
          
          return (
            <script
              key={id ? `${id}-${index}` : `json-ld-${index}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(item, null, 0)
              }}
            />
          );
        })}
      </>
    );
  }

  if (!schema) return null;

  return (
    <script
      id={id || 'json-ld-schema'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0)
      }}
    />
  );
};

export default JsonLdScript;

