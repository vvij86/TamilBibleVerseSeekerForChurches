import { Component, ElementRef, HostListener, OnInit, ViewChild,AfterViewChecked  } from '@angular/core';
import { ChapterNames } from './data/ChapterNames';
import tamilBible from '../assets/tamilBible.json';
import englishBible from '../assets/englishBible.json';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { ListboxModule } from 'primeng/listbox';
import { AutoFocusModule } from 'primeng/autofocus';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    SplitterModule,
    ListboxModule,
    AutoFocusModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewChecked  {
  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;
  @ViewChild('chapterInput') chapterInputRef!: InputNumber;
  @ViewChild('verseText') verseTextRef!: ElementRef;

  currentFontSize = 6; // initial large font size in vh units
  adjustingFontSize = false;
  languages = [
    { label: 'English', value: 'English' },
    { label: 'Tamil', value: 'Tamil' }
  ];

  selectedLanguage = { label: 'English', value: 'English' };
  bookName = '';
  chapterNumber: number = 1;
  verseNumber: number = 1;

  bibleData: any = {};
  currentVerseText = '';
  currentBook = '';
  currentChapter = 1;
  currentVerse = 1;
  fullscreenMode = false;

  // Arrays for dropdown options
  bookOptions: { label: string }[] = [];

  // Arrays for listbox options
  oldTestamentBooks1: string[] = [];
  oldTestamentBooks2: string[] = [];
  oldTestamentBooks3: string[] = [];
  newTestamentBooks1: string[] = [];
  newTestamentBooks2: string[] = [];
  newTestamentBooks3: string[] = [];
  oldTestamentBookOptions1: { label: string }[] = [];
  oldTestamentBookOptions2: { label: string }[] = [];
  oldTestamentBookOptions3: { label: string }[] = [];
  newTestamentBookOptions1: { label: string }[] = [];
  newTestamentBookOptions2: { label: string }[] = [];
  newTestamentBookOptions3: { label: string }[] = [];

  ngOnInit(): void {
    this.loadBibleData();
    this.splitBooks();
    this.initializeBookOptions();
    if (this.selectedLanguage['value'] === 'Tamil')
    {
      this.bookName = 'ஆதியாகமம்';
    }
    else {
      this.bookName = 'Genesis';
    }
    
  }

  focusChapterInput() {
    const inputElement = this.chapterInputRef.el.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }

  
  ngAfterViewChecked(): void {
    if (this.fullscreenMode && !this.adjustingFontSize) {
      this.adjustFontSizeToFit();
    }
  }

  onLanguageChange() {
    this.loadBibleData();
    this.splitBooks();
    this.initializeBookOptions();
    if (this.selectedLanguage['value'] === 'Tamil')
    {
      this.bookName = 'ஆதியாகமம்';
    }
    else {
      this.bookName = 'Genesis';
    }
  }

  loadBibleData() {
    this.bibleData = this.selectedLanguage['value'] === 'Tamil' ? tamilBible : englishBible;
  }

  splitBooks() {
    const chapterNames = this.selectedLanguage['value'] === 'Tamil'
      ? ChapterNames.chapNamesInTamil
      : ChapterNames.chapNamesInEnglish;
    // First 39 books as Old Testament, rest as New Testament
    this.oldTestamentBooks1 = chapterNames.slice(0, 13);
    this.oldTestamentBooks2 = chapterNames.slice(14, 27);
    this.oldTestamentBooks3 = chapterNames.slice(28, 39);
    this.newTestamentBooks1 = chapterNames.slice(39,49);
    this.newTestamentBooks2 = chapterNames.slice(50,59);
    this.newTestamentBooks3 = chapterNames.slice(60);

    console.log(this.oldTestamentBooks1)
    // Convert to listbox option format
    this.oldTestamentBookOptions1 = this.oldTestamentBooks1.map(book => ({ label: book, value:book }));
    this.oldTestamentBookOptions2 = this.oldTestamentBooks2.map(book => ({ label: book, value:book }));
    this.oldTestamentBookOptions3 = this.oldTestamentBooks3.map(book => ({ label: book, value:book }));
    this.newTestamentBookOptions1 = this.newTestamentBooks1.map(book => ({ label: book, value:book }));
    this.newTestamentBookOptions2 = this.newTestamentBooks2.map(book => ({ label: book, value:book }));
    this.newTestamentBookOptions3 = this.newTestamentBooks3.map(book => ({ label: book, value:book }));
    console.log(this.oldTestamentBookOptions1)
  }

  initializeBookOptions() {
    const chapterNames = this.selectedLanguage['value'] === 'Tamil'
      ? ChapterNames.chapNamesInTamil
      : ChapterNames.chapNamesInEnglish;
    this.bookOptions = chapterNames.map(book => ({ label: book }));
  }

  onBookNameChange(event: any) {
    this.bookName = event.value ? event.value.label : '';
  }

  // Called when a book is selected from either listbox
  onListboxSelect(event: any) {
    const selected = event.value;
    console.log(selected.label)
    if (selected && selected.label) {
      this.bookName = selected.label;
    }
    setTimeout(() => {
      const inputEl = this.chapterInputRef?.input?.nativeElement;
      if (inputEl) {
        inputEl.focus();
      }
    }, 0);
  }

  submitVerse() {
    this.currentFontSize = 6;
    const chapterNames = this.selectedLanguage['value'] === 'Tamil'
      ? ChapterNames.chapNamesInTamil
      : ChapterNames.chapNamesInEnglish;
    const bookIndex = chapterNames.indexOf(this.bookName);
    if (bookIndex === -1) {
      this.currentVerseText = 'Book not found';
      return;
    }

    try {
      const verseObj = this.bibleData.Book[bookIndex].Chapter[this.chapterNumber - 1].Verse[this.verseNumber - 1];
      this.currentVerseText = verseObj.Verse;
      this.currentBook = this.bookName;
      this.currentChapter = this.chapterNumber;
      this.currentVerse = this.verseNumber;
      this.fullscreenMode = true;
      // Request browser fullscreen after view updates
      setTimeout(() => {
        this.requestFullscreen();
      });
    } catch (e) {
      this.currentVerseText = 'Verse not found';
    }
  }

  requestFullscreen() {
    if (this.fullscreenContainer && this.fullscreenContainer.nativeElement.requestFullscreen) {
      this.fullscreenContainer.nativeElement.requestFullscreen();
    } else if (this.fullscreenContainer && (this.fullscreenContainer.nativeElement as any).mozRequestFullScreen) {
      (this.fullscreenContainer.nativeElement as any).mozRequestFullScreen();
    } else if (this.fullscreenContainer && (this.fullscreenContainer.nativeElement as any).webkitRequestFullscreen) {
      (this.fullscreenContainer.nativeElement as any).webkitRequestFullscreen();
    } else if (this.fullscreenContainer && (this.fullscreenContainer.nativeElement as any).msRequestFullscreen) {
      (this.fullscreenContainer.nativeElement as any).msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
    this.fullscreenMode = false;
  }

  previousVerse() {
    if (this.currentVerse > 1) {
      this.currentVerse--;
    } else {
      if (this.currentChapter > 1) {
        this.currentChapter--;
        const chapterNames = this.selectedLanguage['value'] === 'Tamil'
          ? ChapterNames.chapNamesInTamil
          : ChapterNames.chapNamesInEnglish;
        const bookIndex = chapterNames.indexOf(this.currentBook);
        this.currentVerse = this.bibleData.Book[bookIndex].Chapter[this.currentChapter - 1].Verse.length;
      } else {
        return;
      }
    }
    this.updateVerseText();
  }

  nextVerse() {
    const chapterNames = this.selectedLanguage['value'] === 'Tamil'
      ? ChapterNames.chapNamesInTamil
      : ChapterNames.chapNamesInEnglish;
    const bookIndex = chapterNames.indexOf(this.currentBook);
    const currentChapterVerses = this.bibleData.Book[bookIndex].Chapter[this.currentChapter - 1].Verse.length;

    if (this.currentVerse < currentChapterVerses) {
      this.currentVerse++;
    } else {
      const totalChapters = this.bibleData.Book[bookIndex].Chapter.length;
      if (this.currentChapter < totalChapters) {
        this.currentChapter++;
        this.currentVerse = 1;
      } else {
        return;
      }
    }
    this.updateVerseText();
  }

  private adjustFontSizeToFit(): void {
    this.adjustingFontSize = true;
    const verseEl = this.verseTextRef.nativeElement as HTMLElement;
    const parentHeight = verseEl.parentElement?.clientHeight ?? 0;
    const parentWidth = verseEl.parentElement?.clientWidth ?? 0;

    const reduceFontSize = () => {
      const hasOverflow = verseEl.scrollHeight > verseEl.clientHeight || verseEl.scrollWidth > verseEl.clientWidth;

      if (hasOverflow && this.currentFontSize > 1) {
        this.currentFontSize -= 0.1; // decrement slowly to find optimal size
        verseEl.style.fontSize = `calc(${this.currentFontSize}vw + ${this.currentFontSize}vh)`;
        requestAnimationFrame(reduceFontSize);
      } else {
        this.adjustingFontSize = false;
      }
    };

    // set initial font size before checking
    verseEl.style.fontSize = `calc(${this.currentFontSize}vw + ${this.currentFontSize}vh)`;
    requestAnimationFrame(reduceFontSize);
  }

  updateVerseText() {
    this.currentFontSize = 6;
    const chapterNames = this.selectedLanguage['value'] === 'Tamil'
      ? ChapterNames.chapNamesInTamil
      : ChapterNames.chapNamesInEnglish;
    const bookIndex = chapterNames.indexOf(this.currentBook);
    const verseObj = this.bibleData.Book[bookIndex].Chapter[this.currentChapter - 1].Verse[this.currentVerse - 1];
    this.currentVerseText = verseObj.Verse;
  }

  @HostListener('document:keydown.arrowup')
  handleArrowUp() {
    if (this.fullscreenMode) this.previousVerse();
  }

  @HostListener('document:keydown.arrowdown')
  handleArrowDown() {
    if (this.fullscreenMode) this.nextVerse();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.fullscreenMode) {
      this.exitFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', [])
  onFullScreenChange() {
    if (!document.fullscreenElement) {
      this.fullscreenMode = false;
    }
  }
}