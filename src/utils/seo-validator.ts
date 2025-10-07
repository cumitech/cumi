/**
 * SEO Validation Utility
 * Validates SEO elements across the application
 */

export interface SEOValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number;
}

export interface PageSEOData {
  title: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  keywords: string[];
}

export class SEOValidator {
  private static readonly TITLE_MAX_LENGTH = 60;
  private static readonly DESCRIPTION_MAX_LENGTH = 160;
  private static readonly DESCRIPTION_MIN_LENGTH = 120;
  private static readonly KEYWORDS_MAX_COUNT = 20;

  static validatePageSEO(data: PageSEOData): SEOValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Title validation
    if (!data.title || data.title.trim().length === 0) {
      issues.push('Page title is missing');
      score -= 20;
    } else {
      if (data.title.length > SEOValidator.TITLE_MAX_LENGTH) {
        warnings.push(`Title is too long (${data.title.length} chars, max ${SEOValidator.TITLE_MAX_LENGTH})`);
        score -= 5;
      }
      if (data.title.length < 30) {
        warnings.push(`Title is too short (${data.title.length} chars, min 30)`);
        score -= 3;
      }
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      issues.push('Meta description is missing');
      score -= 15;
    } else {
      if (data.description.length > SEOValidator.DESCRIPTION_MAX_LENGTH) {
        warnings.push(`Description is too long (${data.description.length} chars, max ${SEOValidator.DESCRIPTION_MAX_LENGTH})`);
        score -= 5;
      }
      if (data.description.length < SEOValidator.DESCRIPTION_MIN_LENGTH) {
        warnings.push(`Description is too short (${data.description.length} chars, min ${SEOValidator.DESCRIPTION_MIN_LENGTH})`);
        score -= 3;
      }
    }

    // Keywords validation
    if (!data.keywords || data.keywords.length === 0) {
      warnings.push('No keywords specified');
      score -= 5;
    } else if (data.keywords.length > SEOValidator.KEYWORDS_MAX_COUNT) {
      warnings.push(`Too many keywords (${data.keywords.length}, max ${SEOValidator.KEYWORDS_MAX_COUNT})`);
      score -= 3;
    }

    // Images validation
    if (!data.images || data.images.length === 0) {
      warnings.push('No images specified for social sharing');
      score -= 5;
    } else {
      data.images.forEach((image, index) => {
        if (!image.alt || image.alt.trim().length === 0) {
          issues.push(`Image ${index + 1} is missing alt text`);
          score -= 10;
        }
      });
    }

    // URL validation
    if (!data.url || data.url.trim().length === 0) {
      issues.push('URL is missing');
      score -= 10;
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      score: Math.max(0, score)
    };
  }

  static validateImageAltText(images: Array<{ src: string; alt?: string }>): SEOValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    images.forEach((image, index) => {
      if (!image.alt || image.alt.trim().length === 0) {
        issues.push(`Image ${index + 1} (${image.src}) is missing alt text`);
        score -= 20;
      } else if (image.alt.length < 10) {
        warnings.push(`Image ${index + 1} alt text is too short (${image.alt.length} chars)`);
        score -= 5;
      } else if (image.alt.length > 125) {
        warnings.push(`Image ${index + 1} alt text is too long (${image.alt.length} chars)`);
        score -= 3;
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      score: Math.max(0, score)
    };
  }

  static generateSEOTips(result: SEOValidationResult): string[] {
    const tips: string[] = [];

    if (result.score < 80) {
      tips.push('🔧 SEO Score needs improvement - focus on fixing critical issues first');
    }

    if (result.issues.some(issue => issue.includes('missing alt text'))) {
      tips.push('🖼️ Add descriptive alt text to all images for better accessibility and SEO');
    }

    if (result.issues.some(issue => issue.includes('title is missing'))) {
      tips.push('📝 Add unique, descriptive page titles (30-60 characters)');
    }

    if (result.issues.some(issue => issue.includes('Meta description is missing'))) {
      tips.push('📄 Add compelling meta descriptions (120-160 characters)');
    }

    if (result.warnings.some(warning => warning.includes('too long'))) {
      tips.push('✂️ Shorten titles and descriptions to optimal lengths');
    }

    if (result.warnings.some(warning => warning.includes('too short'))) {
      tips.push('📏 Expand titles and descriptions to provide more value');
    }

    return tips;
  }
}

export default SEOValidator;
