import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@Component({
  selector: 'gifs-side-menu-option',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GifsSideMenuOptionComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() router!: string;
}
