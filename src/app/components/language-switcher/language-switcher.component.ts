import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
  @Input() selected: string = 'en';
  @Input() languages = [
    { label: 'English', value: 'en' },
    { label: 'Tamil', value: 'ta' }
  ];
  @Output() languageChanged = new EventEmitter<string>();
}
