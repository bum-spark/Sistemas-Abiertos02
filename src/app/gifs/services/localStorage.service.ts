import { Injectable, signal, effect, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly HISTORY_KEY = 'giphy_search_history';
  private readonly MAX_HISTORY_ITEMS = 10;

  private _history = signal<string[]>([]);

  public readonly history = this._history.asReadonly();

  public readonly currentSearchTerm = computed(() => {
    const hist = this._history();
    return hist.length > 0 ? hist[0] : '';
  });

  public readonly hasHistory = computed(() => this._history().length > 0);

  public readonly historyCount = computed(() => this._history().length);

  constructor() {
    this.loadHistoryFromStorage();

    effect(() => {
      const currentHistory = this._history();
      this.saveHistoryToStorage(currentHistory);
    });
  }

  addToHistory(searchTerm: string): void {
    if (!searchTerm) return;

    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) return;

    this._history.update(history => {
      const filteredHistory = history.filter(term => term !== normalizedTerm);

      const newHistory = [normalizedTerm, ...filteredHistory];

      return newHistory.slice(0, this.MAX_HISTORY_ITEMS);
    });
  }

  removeFromHistory(searchTerm: string): void {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    this._history.update(history =>
      history.filter(term => term !== normalizedTerm)
    );
  }

  clearHistory(): void {
    this._history.set([]);
  }

  private loadHistoryFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored) as string[];

        if (Array.isArray(parsedHistory)) {
          this._history.set(parsedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      this._history.set([]);
    }
  }

  private saveHistoryToStorage(history: string[]): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  isInHistory(searchTerm: string): boolean {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return this._history().includes(normalizedTerm);
  }

  getHistorySnapshot(): string[] {
    return [...this._history()];
  }
}
