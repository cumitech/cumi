import { IBaseState } from "./base-state.model";

export interface IMetaData {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'blog' | 'product' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  schemaType: 'WebPage' | 'Article' | 'BlogPosting' | 'Product' | 'Service' | 'Course' | 'Event' | 'Organization' | 'Person' | 'FAQPage' | 'HowTo' | 'Review' | 'Recipe' | 'VideoObject' | 'AudioObject';
  customSchema?: any;
  robots: 'index, follow' | 'index, nofollow' | 'noindex, follow' | 'noindex, nofollow' | 'noindex, nofollow, noarchive, nosnippet' | 'index, follow, noarchive' | 'index, follow, nosnippet';
  author?: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMetaDataState extends IBaseState {
  metaData: IMetaData[];
  selectedMetaData: IMetaData | null;
  loading: boolean;
  error: string | null;
}

export interface IMetaDataFilter {
  page?: string;
  schemaType?: string;
  robots?: string;
  author?: string;
  search?: string;
}

export interface IMetaDataCreateRequest {
  page: string;
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  schemaType?: string;
  customSchema?: any;
  robots?: string;
  author?: string;
  publishedTime?: Date;
}

export interface IMetaDataUpdateRequest extends Partial<IMetaDataCreateRequest> {
  id: string;
}

export interface IMetaDataResponse {
  success: boolean;
  data: IMetaData | IMetaData[];
  message?: string;
  total?: number;
}
