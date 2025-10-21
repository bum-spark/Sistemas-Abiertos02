import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import GifsSideMenuHeaderComponent from './gifs-side-menu-header/gifs-side-menu-header.component';
import GifsSideMenuOptionsComponent from './gifs-side-menu-options/gifs-side-menu-options.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'side-menu',
  imports: [CommonModule, GifsSideMenuHeaderComponent, GifsSideMenuOptionsComponent],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  isMenuOpen = signal(false);
  searchFromHistory = output<string>();

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onSearchFromHistory(term: string): void {
    this.closeMenu(); 
    this.searchFromHistory.emit(term); 
  }
}
