import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gif } from '../../../interfaces/giphy-response.interface';

@Component({
  selector: 'gif-card-component',
  imports: [CommonModule],
  templateUrl: './gif-card-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifCardComponentComponent {
  @Input({ required: true }) gif!: Gif;

  imageError = signal(false);

  get imageUrl(): string {
    if (this.imageError()) {
      return this.gif.images.original?.url || this.fallbackImageUrl;
    }

    return this.gif.images.fixed_width_downsampled?.url ||
           this.gif.images.fixed_width?.url ||
           this.gif.images.downsized_medium?.url ||
           this.gif.images.original?.url ||
           this.fallbackImageUrl;
  }

  get fallbackImageUrl(): string {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f1f5f9" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2394a3b8" font-size="16" font-family="Arial"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
  }

  get gifTitle(): string {
    if (this.gif.title && this.gif.title.trim() !== '') {
      return this.gif.title;
    }
    return this.gif.slug?.replace(/-/g, ' ') || 'GIF animado';
  }

  get altText(): string {
    const title = this.gifTitle;
    const user = this.username !== 'Anónimo' ? ` por ${this.username}` : '';
    return `GIF: ${title}${user}`;
  }

  get username(): string {
    return this.gif.username || 'Anónimo';
  }

  onImageError(): void {
    console.warn(`Image load error for GIF: ${this.gif.id}`);
    this.imageError.set(true);
  }

  openInGiphy(): void {
    window.open(this.gif.url, '_blank', 'noopener,noreferrer');
  }
}
