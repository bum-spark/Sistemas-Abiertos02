import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap, of } from 'rxjs';

import { LocalStorageService } from './localStorage.service';
import { SearchParams, TrendingParams } from '../interfaces/search.interface';
import { Gif, GiphyResponse } from '../interfaces/giphy-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiGiphyService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly API_KEY = 'GIrYAj6G2i0aC5HRnFYMa9aOy3BKTZMU';
  private readonly BASE_URL = 'https://api.giphy.com/v1/gifs';

  private readonly ENDPOINTS = {
    search: `${this.BASE_URL}/search`,
    trending: `${this.BASE_URL}/trending`,
    random: `${this.BASE_URL}/random`,
    getById: `${this.BASE_URL}` 
  } as const;

  private _gifs = signal<Gif[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _currentSearchTerm = signal<string>('');
  private _totalCount = signal<number>(0);

  public readonly gifs = this._gifs.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly currentSearchTerm = this._currentSearchTerm.asReadonly();
  public readonly totalCount = this._totalCount.asReadonly();

  public readonly hasGifs = computed(() => this._gifs().length > 0);
  public readonly hasError = computed(() => this._error() !== null);
  public readonly gifsCount = computed(() => this._gifs().length);

  public readonly searchHistory = this.localStorageService.history;
  public readonly hasHistory = this.localStorageService.hasHistory;

  constructor() {
    
  }

  searchGifs(searchTerm: string, params?: SearchParams): Observable<Gif[]> {
    const normalizedTerm = this.normalizeSearchTerm(searchTerm);

    if (!normalizedTerm) {
      console.warn('Search term is empty after normalization');
      return of([]);
    }

    this._isLoading.set(true);
    this._error.set(null);
    this._currentSearchTerm.set(normalizedTerm);

    this.localStorageService.addToHistory(normalizedTerm);

    const httpParams = this.buildSearchParams(normalizedTerm, params);

    return this.http.get<GiphyResponse>(this.ENDPOINTS.search, { params: httpParams })
      .pipe(
        map(response => {
          this._totalCount.set(response.pagination.total_count);
          return response.data;
        }),
        tap(gifs => {
          this._gifs.set([...gifs]);
          this._isLoading.set(false);
          console.log(`✅ API Service - Search completed: ${gifs.length} GIFs for "${normalizedTerm}"`);
        }),
        catchError(error => this.handleError(error))
      );
  }

  getTrendingGifs(params?: TrendingParams): Observable<Gif[]> {
    this._isLoading.set(true);
    this._error.set(null);
    this._currentSearchTerm.set('trending');

    const httpParams = this.buildTrendingParams(params);

    return this.http.get<GiphyResponse>(this.ENDPOINTS.trending, { params: httpParams })
      .pipe(
        map(response => {
          this._totalCount.set(response.pagination.total_count);
          return response.data;
        }),
        tap(gifs => {
          this._gifs.set([...gifs]);
          this._isLoading.set(false);
          console.log(`✅ API Service - Trending completed: ${gifs.length} GIFs`);
        }),
        catchError(error => this.handleError(error))
      );
  }

  getRandomGif(tag?: string): Observable<Gif> {
    this._isLoading.set(true);
    this._error.set(null);

    let httpParams = new HttpParams().set('api_key', this.API_KEY);

    if (tag) {
      const normalizedTag = this.normalizeSearchTerm(tag);
      httpParams = httpParams.set('tag', normalizedTag);
    }

    return this.http.get<{ data: Gif }>(this.ENDPOINTS.random, { params: httpParams })
      .pipe(
        map(response => response.data),
        tap(gif => {
          this._gifs.set([gif]);
          this._isLoading.set(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  clearGifs(): void {
    this._gifs.set([]);
    this._currentSearchTerm.set('');
    this._totalCount.set(0);
    this._error.set(null);
  }

  clearHistory(): void {
    this.localStorageService.clearHistory();
  }

  removeFromHistory(searchTerm: string): void {
    this.localStorageService.removeFromHistory(searchTerm);
  }

  searchFromHistory(searchTerm: string): Observable<Gif[]> {
    return this.searchGifs(searchTerm);
  }

  private normalizeSearchTerm(term: string): string {
    return term
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  private buildSearchParams(searchTerm: string, params?: SearchParams): HttpParams {
    let httpParams = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('q', searchTerm)
      .set('limit', params?.limit?.toString() || '25');

    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    if (params?.rating) {
      httpParams = httpParams.set('rating', params.rating);
    }

    if (params?.lang) {
      httpParams = httpParams.set('lang', params.lang);
    }

    return httpParams;
  }

  private buildTrendingParams(params?: TrendingParams): HttpParams {
    let httpParams = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('limit', params?.limit?.toString() || '25');

    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    if (params?.rating) {
      httpParams = httpParams.set('rating', params.rating);
    }

    return httpParams;
  }
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);

    let errorMessage = 'An error occurred while fetching GIFs';

    if (error.status === 0) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.status === 403) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this._error.set(errorMessage);
    this._isLoading.set(false);
    this._gifs.set([]);

    throw error;
  }
}
