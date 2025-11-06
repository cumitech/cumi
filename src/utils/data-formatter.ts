// Helper to safely parse JSON fields
function safeJSONParse(value: any): any {
    if (value == null) return {};
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }
    return {};
}

// Map database row to form values (snake_case -> camelCase)
export function mapDatabaseToForm(dbRecord: any): any {
    if (!dbRecord) return {};

    return {
        name: dbRecord.name,
        description: dbRecord.description,
        category: dbRecord.category,
        company: dbRecord.company,
        referralUrl: dbRecord.referral_url || dbRecord.referralUrl,
        originalUrl: dbRecord.original_url || dbRecord.originalUrl,
        discount: dbRecord.discount,
        bonus: dbRecord.bonus,
        imageUrl: dbRecord.image_url || dbRecord.imageUrl,
        logoUrl: dbRecord.logo_url || dbRecord.logoUrl,
        features: safeJSONParse(dbRecord.features),
        pros: safeJSONParse(dbRecord.pros),
        cons: safeJSONParse(dbRecord.cons),
        rating: dbRecord.rating,
        priceRange: dbRecord.price_range || dbRecord.priceRange,
        targetAudience: safeJSONParse(dbRecord.target_audience || dbRecord.targetAudience),
        useCase: dbRecord.use_case || dbRecord.useCase,
        personalExperience: dbRecord.personal_experience || dbRecord.personalExperience,
        isActive: dbRecord.is_active ?? dbRecord.isActive ?? true,
        isFeatured: dbRecord.is_featured ?? dbRecord.isFeatured ?? false,
        priority: dbRecord.priority ?? 0,
    };
}

// Map form values to database format (camelCase -> snake_case)
export function mapFormToDatabase(formValues: any): any {
    return {
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        company: formValues.company,
        referral_url: formValues.referralUrl,
        original_url: formValues.originalUrl,
        discount: formValues.discount,
        bonus: formValues.bonus,
        image_url: formValues.imageUrl,
        logo_url: formValues.logoUrl,
        features: JSON.stringify(formValues.features || {}),
        pros: JSON.stringify(formValues.pros || {}),
        cons: JSON.stringify(formValues.cons || {}),
        rating: formValues.rating,
        price_range: formValues.priceRange,
        target_audience: JSON.stringify(formValues.targetAudience || {}),
        use_case: formValues.useCase,
        personal_experience: formValues.personalExperience,
        is_active: formValues.isActive ?? true,
        is_featured: formValues.isFeatured ?? false,
        priority: formValues.priority ?? 0,
    };
}

// Display helpers for read-only views
export function formatFeaturesForDisplay(features: any): string[] {
    const obj = safeJSONParse(features);
    return Object.entries(obj).map(([key, value]) => `${key}: ${value}`);
}

export function formatProsForDisplay(pros: any): string[] {
    const obj = safeJSONParse(pros);
    return Object.entries(obj).map(([key, value]) => `${key}: ${value}`);
}

export function formatConsForDisplay(cons: any): string[] {
    const obj = safeJSONParse(cons);
    return Object.entries(obj).map(([key, value]) => `${key}: ${value}`);
}

export function formatTargetAudienceForDisplay(targetAudience: any): string[] {
    const obj = safeJSONParse(targetAudience);
    return Object.entries(obj)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
}

// Transformer for object-based data (Features, Pros, Cons)
function toKeyValueObject(value: any): Record<string, string> | undefined {
    if (value == null) return undefined;

    // Already an object with string values
    if (typeof value === 'object' && !Array.isArray(value)) {
        const result: Record<string, string> = {};
        for (const [k, v] of Object.entries(value)) {
            result[k] = String(v);
        }
        return result;
    }

    // Parse JSON string
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return toKeyValueObject(parsed);
        } catch {
            // Invalid JSON, return empty object
            return {};
        }
    }

    // Array format: convert to object with indexed keys
    if (Array.isArray(value)) {
        const result: Record<string, string> = {};
        value.forEach((item, idx) => {
            if (typeof item === 'string') {
                // Check if it's a "key: value" format
                const match = item.match(/^([^:]+):\s*(.+)$/);
                if (match) {
                    result[match[1].trim()] = match[2].trim();
                } else {
                    result[`item_${idx}`] = item;
                }
            } else if (typeof item === 'object' && item !== null) {
                Object.assign(result, item);
            }
        });
        return result;
    }

    return {};
}

// Transformer for boolean-based data (Target Audience)
function toBooleanObject(value: any): Record<string, boolean> | undefined {
    if (value == null) return undefined;

    // Already an object with boolean values
    if (typeof value === 'object' && !Array.isArray(value)) {
        const result: Record<string, boolean> = {};
        for (const [k, v] of Object.entries(value)) {
            result[k] = Boolean(v);
        }
        return result;
    }

    // Parse JSON string
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return toBooleanObject(parsed);
        } catch {
            // Invalid JSON, return empty object
            return {};
        }
    }

    // Array format: convert to object with all true values
    if (Array.isArray(value)) {
        const result: Record<string, boolean> = {};
        value.forEach((item) => {
            if (typeof item === 'string') {
                result[item.toLowerCase()] = true;
            }
        });
        return result;
    }

    return {};
}

// Normalize the entire referral payload
export function normalizeReferralPayload(body: any) {
    const normalized: any = { ...body };

    // Coerce numeric fields
    if (normalized.rating !== undefined) {
        normalized.rating = parseFloat(normalized.rating as any);
    }
    if (normalized.priority !== undefined) {
        normalized.priority = parseInt(normalized.priority as any, 10);
    }

    // Coerce boolean-ish strings
    if (typeof normalized.isActive === 'string') {
        normalized.isActive = normalized.isActive === 'true';
    }
    if (typeof normalized.isFeatured === 'string') {
        normalized.isFeatured = normalized.isFeatured === 'true';
    }

    // Coerce key-value objects (Features, Pros, Cons)
    if (normalized.features !== undefined) {
        normalized.features = toKeyValueObject(normalized.features) || {};
    }
    if (normalized.pros !== undefined) {
        normalized.pros = toKeyValueObject(normalized.pros) || {};
    }
    if (normalized.cons !== undefined) {
        normalized.cons = toKeyValueObject(normalized.cons) || {};
    }

    // Coerce boolean object (Target Audience)
    if (normalized.targetAudience !== undefined) {
        normalized.targetAudience = toBooleanObject(normalized.targetAudience) || {};
    }

    return normalized;
}

// Helper for form initialization (when loading existing data)
export function prepareFormData(referral: any) {
    const parseField = (field: any): any => {
        if (field == null) return {};
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch {
                return {};
            }
        }
        if (typeof field === 'object') return field;
        return {};
    };

    return {
        ...referral,
        features: parseField(referral.features),
        pros: parseField(referral.pros),
        cons: parseField(referral.cons),
        targetAudience: parseField(referral.targetAudience),
    };
}

// Helper to convert database format to display format
export function formatForDisplay(referral: any) {
    const parseField = (field: any): Record<string, any> => {
        if (field == null) return {};
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch {
                return {};
            }
        }
        if (typeof field === 'object') return field;
        return {};
    };

    return {
        ...referral,
        features: parseField(referral.features),
        pros: parseField(referral.pros),
        cons: parseField(referral.cons),
        targetAudience: parseField(referral.targetAudience),
    };
}
