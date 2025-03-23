import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fullscreen-verse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fullscreen-verse.component.html',
  styleUrls: ['./fullscreen-verse.component.scss']
})
export class FullscreenVerseComponent {
  @Input() verseText: string = '';
  @Input() book: string = '';
  @Input() chapter: number = 0;
  @Input() verse: number = 0;
}
