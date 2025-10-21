import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'search-component',
  imports: [],
  templateUrl: './search-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponentComponent { 
 
  @Output() search = new EventEmitter<string>();

  @ViewChild('txtQuery') txtQuery!: ElementRef<HTMLInputElement>;

  onSearch(event: Event, searchTerm: string): void {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) {
      return; 
    }
    this.search.emit(trimmedTerm);
    this.txtQuery.nativeElement.value = '';
  }
}
