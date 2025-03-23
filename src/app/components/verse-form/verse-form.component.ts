import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-verse-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, InputNumberModule, ButtonModule],
  templateUrl: './verse-form.component.html'
})
export class VerseFormComponent {
  @Input() bookName = '';
  @Input() chapterNumber = 1;
  @Input() verseNumber = 1;
  @Output() verseSubmit = new EventEmitter<{ book: string, chapter: number, verse: number }>();

  submit() {
    this.verseSubmit.emit({
      book: this.bookName,
      chapter: this.chapterNumber,
      verse: this.verseNumber
    });
  }
}
