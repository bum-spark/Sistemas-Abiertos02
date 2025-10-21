import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { SearchComponentComponent } from '../../components/search-component/search-component.component';
import { ApiGiphyService } from '../../services/apiGiphy.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, SideMenuComponent, SearchComponentComponent],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardPageComponent {
  private readonly api = inject(ApiGiphyService);
  private readonly router = inject(Router);

  onSearch(term: string | unknown): void {
    this.executeSearch(term);
  }

  onSearchFromHistory(term: string | unknown): void {
    this.executeSearch(term);
  }

  private executeSearch(term: string | unknown): void {
    let searchTerm: string;

    if (typeof term === 'string') {
      searchTerm = term;
    } else if (term && typeof term === 'object' && 'target' in term) {
      const target = (term as Event).target as HTMLInputElement;
      searchTerm = target?.value || '';
    } else {
      searchTerm = String(term || '');
    }

    if (!searchTerm || !searchTerm.trim()) {
      console.warn('Search term is empty');
      return;
    }
    window.location.href = `/dashboard/search/${searchTerm.trim()}`;
  }
}
