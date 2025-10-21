import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultComponentComponent } from '../../components/result-component/result-component.component';
import { ApiGiphyService } from '../../services/apiGiphy.service';
import { Gif } from '../../interfaces/giphy-response.interface';

@Component({
  selector: 'app-search-page',
  imports: [ResultComponentComponent],
  templateUrl: './search-page.component.html'
})
export default class SearchPageComponent implements OnInit {
  public readonly api = inject(ApiGiphyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  private routeSubscription?: any;

  ngOnInit(): void {
    console.log('🎯 Search page initialized');
    
    this.routeSubscription = this.route.params.subscribe(params => {
      const searchTerm = params['term'];  
      if (searchTerm) {
        this.api.searchGifs(searchTerm, { limit: 50 }).subscribe({
          next: (gifs) => {
            console.log(`se enoctarron ${gifs.length} gis para "${searchTerm}"`);
          },
          error: (error) => {
            console.error('error:', error);
          }
        });
      } else {
        console.log('No hay busqueda en etsa ruta');
        this.loadRandomGifs();
      }
    });
  }

  private loadRandomGifs(): void {
    this.api.getTrendingGifs({ limit: 30 }).subscribe({
      next: () => {
        console.log('se cargaron lso randoms');
      },
      error: (error) => {
        console.error('error:', error);
      }
    });
  }

  searchFromHistory(term: string): void {
    window.location.href = `/dashboard/search/${term}`;
  }

  removeFromHistory(event: Event, term: string): void {
    event.stopPropagation();
    this.api.removeFromHistory(term);
  }

  clearHistory(): void {
    this.api.clearHistory();
  }
}
