// Respuesta completa de la API de Giphy
export interface GiphyResponse {
  data: Gif[];
  pagination: Pagination;
  meta: Meta;
}

// Estructura de un GIF individual
export interface Gif {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: Images;
  user?: User;
  analytics_response_payload: string;
  analytics: Analytics;
}

// URLs de las diferentes versiones de imagen
export interface Images {
  original: ImageFormat;
  downsized: ImageFormat;
  downsized_large: ImageFormat;
  downsized_medium: ImageFormat;
  downsized_small: ImageFormat;
  downsized_still: ImageFormat;
  fixed_height: ImageFormat;
  fixed_height_downsampled: ImageFormat;
  fixed_height_small: ImageFormat;
  fixed_height_small_still: ImageFormat;
  fixed_height_still: ImageFormat;
  fixed_width: ImageFormat;
  fixed_width_downsampled: ImageFormat;
  fixed_width_small: ImageFormat;
  fixed_width_small_still: ImageFormat;
  fixed_width_still: ImageFormat;
  looping: ImageFormat;
  original_still: ImageFormat;
  original_mp4: ImageFormat;
  preview: ImageFormat;
  preview_gif: ImageFormat;
  preview_webp: ImageFormat;
}

// Formato de cada versión de imagen
export interface ImageFormat {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size?: string;
  mp4?: string;
  webp_size?: string;
  webp?: string;
  frames?: string;
  hash?: string;
}

// Información del usuario que subió el GIF
export interface User {
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
}

// Paginación de resultados
export interface Pagination {
  total_count: number;
  count: number;
  offset: number;
}

// Metadata de la respuesta
export interface Meta {
  status: number;
  msg: string;
  response_id: string;
}

// Analytics 
export interface Analytics {
  onload: Onload;
  onclick: Onclick;
  onsent: Onsent;
}

export interface Onload {
  url: string;
}

export interface Onclick {
  url: string;
}

export interface Onsent {
  url: string;
}
