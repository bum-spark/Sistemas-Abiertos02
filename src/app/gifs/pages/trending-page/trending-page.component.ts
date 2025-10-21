import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { ResultComponentComponent } from '../../components/result-component/result-component.component';
import { ApiGiphyService } from '../../services/apiGiphy.service';

@Component({
  selector: 'app-trending-page',
  imports: [ResultComponentComponent],
  templateUrl: './trending-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TrendingPageComponent implements OnInit {
  public readonly api = inject(ApiGiphyService);
  private readonly cdr = inject(ChangeDetectorRef);

  private previousGifsLength = 0;

  constructor() {
    effect(() => {
      const gifs = this.api.gifs();
      const count = gifs.length;
      const term = this.api.currentSearchTerm();
      
      if (term === 'trending') {
        if (count !== this.previousGifsLength) {
          this.previousGifsLength = count;
        }
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.loadTrendingGifs();
  }

  private loadTrendingGifs(): void {
    console.log('Se estan cargando los gifs trending');
    
    this.api.getTrendingGifs({ limit: 50 }).subscribe({
      next: (gifs) => {
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading trending GIFs:', error);
        this.cdr.markForCheck();
      }
    });
  }
}
