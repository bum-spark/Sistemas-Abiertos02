import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GifsSideMenuOptionComponent } from './gifs-side-menu-option/gifs-side-menu-option.component';
import { CommonModule } from '@angular/common';

interface MenuOption {
  icon: string;
  title: string;
  subtitle: string;
  router: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [CommonModule, FontAwesomeModule,GifsSideMenuOptionComponent],
  templateUrl: './gifs-side-menu-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GifsSideMenuOptionsComponent {

  @Output() optionClick = new EventEmitter<void>();

  menuOptions: MenuOption[] = [
    // {
    //   icon: 'fa-solid fa-house',
    //   title: 'Dashboard',
    //   subtitle: 'Data Overview',
    //   router: '/dashboard'
    // },
    {
      icon: 'fa-solid fa-fire',
      title: 'Trending',
      subtitle: 'The best gifs',
      router: '/dashboard/trending'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      title: 'Search',
      subtitle: 'Find your gifs',
      router: '/dashboard/search/trending'
    },
  ];

  onOptionSelected(): void {
    this.optionClick.emit();
  }

}
