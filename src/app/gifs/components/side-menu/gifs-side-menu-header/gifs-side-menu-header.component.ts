import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGiphyService } from '../../../services/apiGiphy.service';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [CommonModule],
  templateUrl: './gifs-side-menu-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GifsSideMenuHeaderComponent {
  public readonly api = inject(ApiGiphyService);

  searchFromHistory = output<string>();

  onHistoryClick(term: string): void {
    this.searchFromHistory.emit(term);
  }

  onRemoveFromHistory(event: Event, term: string): void {
    event.stopPropagation(); 
    this.api.removeFromHistory(term);
  }

  onClearHistory(): void {
    this.api.clearHistory();
  }
}
