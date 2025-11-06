import { IMetaData } from "@domain/models/meta-data.model";
import {
  IsArray,
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from "class-validator";

export class MetaDataRequestDto {
  @IsOptional()
  @IsString()
  readonly id!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly page!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  readonly title!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  readonly description!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly keywords?: string[];

  @IsNotEmpty()
  @IsUrl({ require_tld: false, require_protocol: true })
  @MaxLength(500)
  readonly canonical!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly ogTitle?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  readonly ogDescription?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  @MaxLength(500)
  readonly ogImage?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  @MaxLength(500)
  readonly ogUrl?: string;

  @IsOptional()
  @IsIn(['website', 'article', 'blog', 'product', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'video.movie', 'video.episode', 'video.tv_show', 'video.other'])
  readonly ogType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly twitterTitle?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  readonly twitterDescription?: string;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  @MaxLength(500)
  readonly twitterImage?: string;

  @IsOptional()
  @IsIn(['summary', 'summary_large_image', 'app', 'player'])
  readonly twitterCard?: string;

  @IsNotEmpty()
  @IsIn(['WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'Course', 'Event', 'Organization', 'Person', 'FAQPage', 'HowTo', 'Review', 'Recipe', 'VideoObject', 'AudioObject'])
  readonly schemaType!: string;

  @IsOptional()
  readonly customSchema?: any;

  @IsNotEmpty()
  @IsIn(['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow', 'noindex, nofollow, noarchive, nosnippet', 'index, follow, noarchive', 'index, follow, nosnippet'])
  readonly robots!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly author?: string;

  @IsOptional()
  @IsDateString()
  readonly publishedTime?: string;

  @IsOptional()
  @IsDateString()
  readonly modifiedTime?: string;

  @IsOptional()
  @IsDate()
  readonly createdAt?: Date;

  @IsOptional()
  @IsDate()
  readonly updatedAt?: Date;

  constructor(data?: Partial<MetaDataRequestDto>) {
    if (data) {
      Object.assign(this, data);

      // Normalize keywords to array if provided as comma-separated string
      const anySelf: any = this as any;
      if (typeof anySelf.keywords === 'string') {
        const parts = (anySelf.keywords as string)
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        (this as any).keywords = parts;
      }
    }
  }

  toData(): IMetaData {
    return {
      id: this.id || "",
      page: this.page,
      title: this.title,
      description: this.description,
      keywords: this.keywords || [],
      canonical: this.canonical,
      ogTitle: this.ogTitle,
      ogDescription: this.ogDescription,
      ogImage: this.ogImage,
      ogUrl: this.ogUrl,
      ogType: (this.ogType || 'website') as any,
      twitterTitle: this.twitterTitle,
      twitterDescription: this.twitterDescription,
      twitterImage: this.twitterImage,
      twitterCard: (this.twitterCard || 'summary_large_image') as any,
      schemaType: (this.schemaType || 'WebPage') as any,
      customSchema: this.customSchema,
      robots: (this.robots || 'index, follow') as any,
      author: this.author,
      publishedTime: this.publishedTime ? new Date(this.publishedTime) : undefined,
      modifiedTime: this.modifiedTime ? new Date(this.modifiedTime) : undefined,
      createdAt: this.createdAt || new Date(),
      updatedAt: this.updatedAt || new Date(),
    };
  }
}

