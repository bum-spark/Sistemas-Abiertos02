// Interfaz para manejar el historial de búsquedas
export interface SearchHistory {
  term: string;
  timestamp: number;
}

// Parámetros de búsqueda para la API
export interface SearchParams {
  q?: string;        // Término de búsqueda
  limit?: number;    // Cantidad de resultados (default: 25, max: 50)
  offset?: number;   // Offset para paginación
  rating?: 'g' | 'pg' | 'pg-13' | 'r'; // Rating del contenido
  lang?: string;     // Idioma (ej: 'es', 'en')
}

// Parámetros para trending GIFs
export interface TrendingParams {
  limit?: number;
  offset?: number;
  rating?: 'g' | 'pg' | 'pg-13' | 'r';
}
