import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gif } from '../../interfaces/giphy-response.interface';
import { GifCardComponentComponent } from './gif-card-component/gif-card-component.component';

@Component({
  selector: 'result-component',
  standalone: true,
  imports: [CommonModule, GifCardComponentComponent],
  templateUrl: './result-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponentComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() gifs: Gif[] = [];

  @Input() isLoading: boolean = false;

  @Input() error: string | null = null;

  @Input() searchTerm: string = '';

  @Input() pageSize: number = 15;

  private _currentPage = signal<number>(1);
  public readonly currentPage = this._currentPage.asReadonly();


  public readonly totalPages = computed(() => {
    return Math.ceil(this.gifs.length / this.pageSize);
  });

  public readonly paginatedGifs = computed(() => {
    const startIndex = (this._currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.gifs.slice(startIndex, endIndex);
  });

  public readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this._currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  });

  public readonly currentRange = computed(() => {
    const start = (this._currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this._currentPage() * this.pageSize, this.gifs.length);
    return { start, end, total: this.gifs.length };
  });

  public readonly hasPagination = computed(() => {
    return this.totalPages() > 1;
  });
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
      this.scrollToTop();
    }
  }

  previousPage(): void {
    const current = this._currentPage();
    if (current > 1) {
      this._currentPage.set(current - 1);
      this.scrollToTop();
    }
  }

  nextPage(): void {
    const current = this._currentPage();
    if (current < this.totalPages()) {
      this._currentPage.set(current + 1);
      this.scrollToTop();
    }
  }

  firstPage(): void {
    this._currentPage.set(1);
    this.scrollToTop();
  }

  lastPage(): void {
    this._currentPage.set(this.totalPages());
    this.scrollToTop();
  }

  get isFirstPage(): boolean {
    return this._currentPage() === 1;
  }

  get isLastPage(): boolean {
    return this._currentPage() === this.totalPages();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en GIFs
    if (changes['gifs']) {
      const prev = changes['gifs'].previousValue?.length || 0;
      const curr = changes['gifs'].currentValue?.length || 0;
      
      if (!changes['gifs'].firstChange) {
        this._currentPage.set(1);
        console.log('🔄 Pagination reset to page 1');
      }
      
      this.cdr.markForCheck();
    }

    if (changes['isLoading']) {
      this.cdr.markForCheck();
    }

    if (changes['error']) {
      if (changes['error'].currentValue) {
        console.log(`Error: ${changes['error'].currentValue}`);
      }
      this.cdr.markForCheck();
    }

    if (changes['searchTerm']) {
      console.log(`🔍 Search term: "${changes['searchTerm'].currentValue}"`);
      this.cdr.markForCheck();
    }
  }

  get hasGifs(): boolean {
    return this.gifs.length > 0;
  }

  get noResultsMessage(): string {
    if (this.searchTerm) {
      return `No se encontraron resultados para "${this.searchTerm}"`;
    }
    return 'No hay GIFs para mostrar';
  }

  trackByGifId(index: number, gif: Gif): string {
    return gif.id;
  }
}
