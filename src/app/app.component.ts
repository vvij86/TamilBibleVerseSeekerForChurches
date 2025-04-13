import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import tamilBible from '../assets/tamilBible.json';
import englishBible from '../assets/englishBible.json';
import teluguBible from '../assets/teluguBible.json';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { ListboxModule } from 'primeng/listbox';
import { AutoFocusModule } from 'primeng/autofocus';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChapterNames } from './constants/ChapterNames';

interface HistoryItem {
  label: string;  // Display label for the listbox
  book: string;
  chapter: number;
  verse: number;
}

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
    AutoFocusModule,
    TabMenuModule,
    ToggleButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;
  @ViewChild('chapterInput') chapterInputRef!: InputNumber;
  @ViewChild('verseText') verseTextRef!: ElementRef;

  navItems: MenuItem[] = [
    { label: 'Home', routerLink: '/home' },
    { label: 'About', routerLink: '/about' },
  ];
  currentFontSize = 6; // initial large font size in vh units
  adjustingFontSize = false;
  languages = [
    { label: 'English', value: 'English' },
    { label: 'Tamil', value: 'Tamil' },
    { label: 'Telugu', value: 'Telugu' }
  ];

  tamilTransliterationMap: { [key: string]: string } = {
    "aadiyagamam": "ஆதியாகமம்",
    "aadhiyagamam": "ஆதியாகமம்",
    "adhiyagamam": "ஆதியாகமம்",
    "athiyagamam": "ஆதியாகமம்",
    "aathiyagamam": "ஆதியாகமம்",
    "yaathiraagamam": "யாத்திராகமம்",
    "yathraagamam": "யாத்திராகமம்",
    "leviyinraagamam": "லேவியராகமம்",
    "ennagamm": "எண்ணாகமம்",
    "yennagamm": "எண்ணாகமம்",
    "ubaagamam": "உபாகமம்",
    "obaagamam": "உபாகமம்",
    "oobaagamam": "உபாகமம்",
    "yosuva": "யோசுவா",
    "niyaayaadhipathigal": "நியாயாதிபதிகள்",
    "nyaayaadhipathigal": "நியாயாதிபதிகள்",
    "nyayaadhipathigal": "நியாயாதிபதிகள்",
    "rooth": "ரூத்",
    "1saamuvel": "1 சாமுவேல்",
    "2saamuvel": "2 சாமுவேல்",
    "1rajaakkal": "1 இராஜாக்கள்",
    "2rajaakkal": "2 இராஜாக்கள்",
    "1nalaagamam": "1 நாளாகமம்",
    "2nalaagamam": "2 நாளாகமம்",
    "1 samuvel": "1 சாமுவேல்",
    "2 samuvel": "2 சாமுவேல்",
    "1 rajaakkal": "1 இராஜாக்கள்",
    "2 rajaakkal": "2 இராஜாக்கள்",
    "1 nalaagamam": "1 நாளாகமம்",
    "2 nalaagamam": "2 நாளாகமம்",
    "esra": "எஸ்றா",
    "yesra": "எஸ்றா",
    "nehemiya": "நெகேமியா",
    "esther": "எஸ்தர்",
    "yobu": "யோபு",
    "sangeetham": "சங்கீதம்",
    "needhimozhigal": "நீதிமொழிகள்",
    "pirachangi": "பிரசங்கி",
    "unnathappaattu": "உன்னதப்பாட்டு",
    "esaaya": "ஏசாயா",
    "eremiya": "எரேமியா",
    "yesaaya": "ஏசாயா",
    "yeremiya": "எரேமியா",
    "pulambal": "புலம்பல்",
    "esekiyel": "எசேக்கியேல்",
    "yesekiyel": "எசேக்கியேல்",
    "dhaaniyel": "தானியேல்",
    "daniel": "தானியேல்",
    "daniyel": "தானியேல்",
    "osiyaa": "ஓசியா",
    "yovell": "யோவேல்",
    "aamos": "ஆமோஸ்",
    "amos": "ஆமோஸ்",
    "obathiya": "ஒபதியா",
    "yonah": "யோனா",
    "meekaa": "மீகா",
    "naakoom": "நாகூம்",
    "aabakook": "ஆபகூக்",
    "seppaniya": "செப்பனியா",
    "aagai": "ஆகாய்",
    "agai": "ஆகாய்",
    "sagariya": "சகரியா",
    "malkiya": "மல்கியா",
    "matheyu": "மத்தேயு",
    "maarku": "மாற்கு",
    "luukka": "லுூக்கா",
    "yovaan": "யோவான்",
    "apposthalar": "அப்போஸ்தலர்",
    "romar": "ரோமர்",
    "1korinthiyar": "1 கொரிந்தியர்",
    "2korinthiyar": "2 கொரிந்தியர்",
    "1corinthiyar": "1 கொரிந்தியர்",
    "2corinthiyar": "2 கொரிந்தியர்",
    "1 korinthiyar": "1 கொரிந்தியர்",
    "2 korinthiyar": "2 கொரிந்தியர்",
    "1 corinthiyar": "1 கொரிந்தியர்",
    "2 corinthiyar": "2 கொரிந்தியர்",
    "kalaththiyar": "கலாத்தியர்",
    "ebesiyar": "எபேசியர்",
    "pilippiyar": "பிலிப்பியர்",
    "philippiyar": "பிலிப்பியர்",
    "koloseyar": "கொலோசெயர்",
    "1thesalonikkaiyar": "1 தெசலோனிக்கேயர்",
    "2thesalonikkaiyar": "2 தெசலோனிக்கேயர்",
    "1 thesalonikkaiyar": "1 தெசலோனிக்கேயர்",
    "2 thesalonikkaiyar": "2 தெசலோனிக்கேயர்",
    "1theemothai": "1 தீமோத்தேயு",
    "2theemothai": "2 தீமோத்தேயு",
    "1timothy": "1 தீமோத்தேயு",
    "2timothy": "2 தீமோத்தேயு",
    "1 theemothai": "1 தீமோத்தேயு",
    "2 theemothai": "2 தீமோத்தேயு",
    "1 timothy": "1 தீமோத்தேயு",
    "2 timothy": "2 தீமோத்தேயு",
    "theethu": "தீத்து",
    "pilemon": "பிலேமோன்",
    "ebireyar": "எபிரெயர்",
    "yaakkobu": "யாக்கோபு",
    "1pethuru": "1 பேதுரு",
    "2pethuru": "2 பேதுரு",
    "1 pethuru": "1 பேதுரு",
    "2 pethuru": "2 பேதுரு",
    "1 peter": "1 பேதுரு",
    "2 peter": "2 பேதுரு",
    "1yovaan": "1 யோவான்",
    "2yovaan": "2 யோவான்",
    "3yovaan": "3 யோவான்",
    "1 yovaan": "1 யோவான்",
    "2 yovaan": "2 யோவான்",
    "3 yovaan": "3 யோவான்",
    "yoodhaa": "யூதா",
    "yudhaa": "யூதா",
    "velippaadhu": "வெளி"
  };
  
  
  teluguTransliterationMap: { [key: string]: string } = {
    "aadikaandamu": "ఆదికాండము",
    "nirgamakandamu": "నిర్గమకాండము",
    "leviyakandamu": "లేవీయకాండము",
    "sankhyaakandamu": "సంఖ్యాకాండము",
    "dhviteeyopadesha": "ద్వితీయోపదేశకాండమ",
    "yehoshuva": "యెహొషువ",
    "nyaayaadhipathulu": "న్యాయాధిపతులు",
    "ruthu": "రూతు",
    "1samuyelu": "సమూయేలు మొదటి గ్రంథము",
    "2samuyelu": "సమూయేలు రెండవ గ్రంథము",
    "1raajulu": "రాజులు మొదటి గ్రంథము",
    "2raajulu": "రాజులు రెండవ గ్రంథము",
    "1dhinavrutthaanthamu": "దినవృత్తాంతములు మొదటి గ్రంథము",
    "2dhinavrutthaanthamu": "దినవృత్తాంతములు రెండవ గ్రంథము",
    "ezra": "ఎజ్రా",
    "nehemiya": "నెహెమ్యా",
    "esther": "ఎస్తేరు",
    "yobu": "యోబు గ్రంథము",
    "keerthanalu": "కీర్తనల గ్రంథము",
    "saamethalu": "సామెతలు",
    "prasangi": "ప్రసంగి",
    "paramageethamu": "పరమగీతము",
    "yeshaaya": "యెషయా గ్రంథము",
    "yirimiya": "యిర్మీయా",
    "vilaapavaakyamulu": "విలాపవాక్యములు",
    "yehezkiel": "యెహెజ్కేలు",
    "daniyel": "దానియేలు",
    "hosheya": "హొషేయ",
    "yovelu": "యోవేలు",
    "aamosu": "ఆమోసు",
    "obadhya": "ఓబద్యా",
    "yonah": "యోనా",
    "meeka": "మీకా",
    "nahoomu": "నహూము",
    "habakkukku": "హబక్కూకు",
    "jepaniya": "జెఫన్యా",
    "haggayi": "హగ్గయి",
    "jekarya": "జెకర్యా",
    "malaaki": "మలాకీ",
    "matthayi": "మత్తయి సువార్త",
    "marku": "మార్కు సువార్త",
    "lukka": "లూకా సువార్త",
    "yohanu": "యోహాను సువార్త",
    "apostolula": "అపొస్తలుల కార్యములు",
    "romiyulaku": "రోమీయులకు",
    "1korinthiyulaku": "1 కొరింథీయులకు",
    "2korinthiyulaku": "2 కొరింథీయులకు",
    "galathiyulaku": "గలతీయులకు",
    "efesiyulaku": "ఎఫెసీయులకు",
    "philippiyulaku": "ఫిలిప్పీయులకు",
    "kolossayulaku": "కొలొస్సయులకు",
    "1thessalonika": "1 థెస్సలొనీకయులకు",
    "2thessalonika": "2 థెస్సలొనీకయులకు",
    "1thimothi": "1 తిమోతికి",
    "2thimothi": "2 తిమోతికి",
    "theethu": "తీతుకు",
    "philemon": "ఫిలేమోనుకు",
    "hebreeyulaku": "హెబ్రీయులకు",
    "yaakobu": "యాకోబు",
    "1pethuru": "1 పేతురు",
    "2pethuru": "2 పేతురు",
    "1yohanu": "1 యోహాను",
    "2yohanu": "2 యోహాను",
    "3yohanu": "3 యోహాను",
    "yoodha": "యూదా",
    "prakatana": "ప్రకటన గ్రంథము"
  };
  

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

  // History options for the history listbox
  historyOptions: HistoryItem[] = [];

  isEnglish: boolean = false; // Default to English

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }
  
  ngOnInit(): void {
    this.loadBibleData();
    this.splitBooks();
    this.initializeBookOptions();
    if (this.selectedLanguage['value'] === 'Tamil') {
      this.bookName = 'ஆதியாகமம்';
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      this.bookName = 'ఆదికాండము';
    }else {
      this.bookName = 'Genesis';
    }
  }

  ngAfterViewChecked(): void {
    if (this.fullscreenMode && !this.adjustingFontSize) {
      this.adjustFontSizeToFit();
    }
  }

  toggleLanguage() {
    const ind = ChapterNames.getChapterIndex(this.bookName);
    console.log("Vijay Vignesh", ind);
    this.isEnglish = !this.isEnglish;
    console.log("Vijay Vignesh" + this.isEnglish);
    this.selectedLanguage = this.isEnglish
      ? { label: 'English', value: 'English' }
      : { label: 'Tamil', value: 'Tamil' };
    console.log(this.selectedLanguage);
    this.onLanguageChange();
    console.log(this.chapterNumber);
    const bookNam = ChapterNames.getChapterName(ind, this.selectedLanguage.value);
    this.bookName = bookNam;
    this.submitVerse();
  }

  focusChapterInput() {
    const inputElement = this.chapterInputRef.el.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }

  onLanguageChange() {
    this.loadBibleData();
    this.splitBooks();
    this.initializeBookOptions();
    if (this.selectedLanguage['value'] === 'Tamil') {
      this.bookName = 'ஆதியாகமம்';
      this.isEnglish = true; 
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      this.bookName = 'ఆదికాండము';
      this.isEnglish = false; 
    }else {
      this.bookName = 'Genesis';
      this.isEnglish = false;
    }
  }

  loadBibleData() {
    //this.bibleData = this.selectedLanguage['value'] === 'Tamil' ? tamilBible : englishBible;
    if(this.selectedLanguage['value'] === 'Tamil')
    {
      this.bibleData = tamilBible;
    }else if(this.selectedLanguage['value'] === 'Telugu'){
      this.bibleData = teluguBible;
    }else {
      this.bibleData = englishBible
    }
  }

  splitBooks() {
    // const chapterNames = this.selectedLanguage['value'] === 'Tamil'
    //   ? ChapterNames.chapNamesInTamil
    //   : ChapterNames.chapNamesInEnglish;
    var chapterNames = []
    if (this.selectedLanguage['value'] === 'Tamil') {
      chapterNames = ChapterNames.chapNamesInTamil;
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      chapterNames = ChapterNames.chapNamesInTelugu;
    }else {
      chapterNames = ChapterNames.chapNamesInEnglish;
    }

    // First 39 books as Old Testament, rest as New Testament
    this.oldTestamentBooks1 = chapterNames.slice(0, 13);
    this.oldTestamentBooks2 = chapterNames.slice(13, 26);
    this.oldTestamentBooks3 = chapterNames.slice(26, 39);
    this.newTestamentBooks1 = chapterNames.slice(39, 50);
    this.newTestamentBooks2 = chapterNames.slice(50, 60);
    this.newTestamentBooks3 = chapterNames.slice(60);

    // Convert to listbox option format
    this.oldTestamentBookOptions1 = this.oldTestamentBooks1.map(book => ({ label: book, value: book }));
    this.oldTestamentBookOptions2 = this.oldTestamentBooks2.map(book => ({ label: book, value: book }));
    this.oldTestamentBookOptions3 = this.oldTestamentBooks3.map(book => ({ label: book, value: book }));
    this.newTestamentBookOptions1 = this.newTestamentBooks1.map(book => ({ label: book, value: book }));
    this.newTestamentBookOptions2 = this.newTestamentBooks2.map(book => ({ label: book, value: book }));
    this.newTestamentBookOptions3 = this.newTestamentBooks3.map(book => ({ label: book, value: book }));
  }

  initializeBookOptions() {
    // Determine chapterNames based on language
    let chapterNames: string[] = [];
    if (this.selectedLanguage.value === 'Tamil') {
      chapterNames = ChapterNames.chapNamesInTamil;
    } else if (this.selectedLanguage.value === 'Telugu') {
      chapterNames = ChapterNames.chapNamesInTelugu;
    } else {
      chapterNames = ChapterNames.chapNamesInEnglish;
    }
  
    // Build bookOptions with an extra property for filtering
    this.bookOptions = chapterNames.map(book => {
      let searchText = book.toLowerCase();
      if (this.selectedLanguage.value === 'Tamil') {
        // Look up matching English key from the transliteration map
        for (const key in this.tamilTransliterationMap) {
          if (this.tamilTransliterationMap[key] === book) {
            searchText = key.toLowerCase();
            break;
          }
        }
      } else if (this.selectedLanguage.value === 'Telugu') {
        for (const key in this.teluguTransliterationMap) {
          if (this.teluguTransliterationMap[key] === book) {
            searchText = key.toLowerCase();
            break;
          }
        }
      }
      return { label: book, searchText }; 
    });
  }
  
  onBookNameChange(event: any) {
    this.bookName = event.value ? event.value.label : '';
  }

  selectAllText(inputNumberComponent: InputNumber): void {
    setTimeout(() => {
      const inputEl = inputNumberComponent.input.nativeElement as HTMLInputElement;
      if (inputEl) {
        inputEl.select();
      }
    });
  }
  
  // Called when a book is selected from any listbox
  onListboxSelect(event: any) {
    const selected = event.value;
    console.log(selected.label);
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
    // const chapterNames = this.selectedLanguage['value'] === 'Tamil'
    //   ? ChapterNames.chapNamesInTamil
    //   : ChapterNames.chapNamesInEnglish;
    var chapterNames = []
    if (this.selectedLanguage['value'] === 'Tamil') {
      chapterNames = ChapterNames.chapNamesInTamil;
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      chapterNames = ChapterNames.chapNamesInTelugu;
    }else {
      chapterNames = ChapterNames.chapNamesInEnglish;
    }
    const bookIndex = chapterNames.indexOf(this.bookName);
    if (bookIndex === -1) {
      this.currentVerseText = 'Book not found';
      return;
    }

    try {
      const verseObj = this.bibleData.Book[bookIndex].Chapter[this.chapterNumber - 1].Verse[this.verseNumber - 1];
      //this.currentVerseText = verseObj.Verse;
      this.currentVerseText = `${this.verseNumber}. ${verseObj.Verse}`;

      this.currentBook = this.bookName;
      this.currentChapter = this.chapterNumber;
      this.currentVerse = this.verseNumber;
      this.fullscreenMode = true;

      // Build the history item
      const historyLabel = `${this.bookName} ${this.chapterNumber}:${this.verseNumber}`;
      const newHistoryItem: HistoryItem = {
        label: historyLabel,
        book: this.bookName,
        chapter: this.chapterNumber,
        verse: this.verseNumber
      };

      // Update history immutably and force change detection
      if (!this.historyOptions.find(item => item.label === historyLabel)) {
        this.zone.run(() => {
          // Insert the new history item at the beginning
          this.historyOptions = [newHistoryItem, ...this.historyOptions];
          this.cdr.detectChanges();
        });
      }

      // Request browser fullscreen after view updates
      setTimeout(() => {
        this.requestFullscreen();
      });
    } catch (e) {
      this.currentVerseText = 'Verse not found';
    }
  }

  onHistorySelect(event: any) {
    const selected: HistoryItem = event.value;
    if (selected) {
      console.log("Book Name: " + selected.book);
      console.log("Chapter Number: " + selected.chapter);
      console.log("Verse Number: " + selected.verse);

      const lang = ChapterNames.getChapterLanguage(selected.book);
      this.selectedLanguage = { label: lang, value: lang };
      this.onLanguageChange();
      this.bookName = selected.book;
      this.chapterNumber = selected.chapter;
      this.verseNumber = selected.verse;
      // Optionally, automatically display the selected verse:
      this.submitVerse();
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
        // const chapterNames = this.selectedLanguage.value === 'Tamil'
        //   ? ChapterNames.chapNamesInTamil
        //   : ChapterNames.chapNamesInEnglish;
        var chapterNames = []
        if (this.selectedLanguage['value'] === 'Tamil') {
          chapterNames = ChapterNames.chapNamesInTamil;
        } else if (this.selectedLanguage['value'] === 'Telugu') {
          chapterNames = ChapterNames.chapNamesInTelugu;
        }else {
          chapterNames = ChapterNames.chapNamesInEnglish;
        }
        const bookIndex = chapterNames.indexOf(this.currentBook);
        this.currentVerse = this.bibleData.Book[bookIndex].Chapter[this.currentChapter - 1].Verse.length;
      } else {
        return;
      }
    }
    this.chapterNumber = this.currentChapter;
    this.verseNumber = this.currentVerse;
    this.updateVerseText();
  }
  
  nextVerse() {
    // const chapterNames = this.selectedLanguage.value === 'Tamil'
    //   ? ChapterNames.chapNamesInTamil
    //   : ChapterNames.chapNamesInEnglish;
    var chapterNames = []
    if (this.selectedLanguage['value'] === 'Tamil') {
      chapterNames = ChapterNames.chapNamesInTamil;
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      chapterNames = ChapterNames.chapNamesInTelugu;
    }else {
      chapterNames = ChapterNames.chapNamesInEnglish;
    }
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
    this.chapterNumber = this.currentChapter;
    this.verseNumber = this.currentVerse;
    this.updateVerseText();
  }
  
  private adjustFontSizeToFit(): void {
    this.adjustingFontSize = true;
    const verseEl = this.verseTextRef.nativeElement as HTMLElement;
    const reduceFontSize = () => {
      const hasOverflow = verseEl.scrollHeight > verseEl.clientHeight || verseEl.scrollWidth > verseEl.clientWidth;
      if (hasOverflow && this.currentFontSize > 1) {
        this.currentFontSize -= 0.1;
        verseEl.style.fontSize = `calc(${this.currentFontSize}vw + ${this.currentFontSize}vh)`;
        requestAnimationFrame(reduceFontSize);
      } else {
        this.adjustingFontSize = false;
      }
    };
    verseEl.style.fontSize = `calc(${this.currentFontSize}vw + ${this.currentFontSize}vh)`;
    requestAnimationFrame(reduceFontSize);
  }

  updateVerseText() {
    this.currentFontSize = 6;
    // const chapterNames = this.selectedLanguage['value'] === 'Tamil'
    //   ? ChapterNames.chapNamesInTamil
    //   : ChapterNames.chapNamesInEnglish;
    var chapterNames = []
    if (this.selectedLanguage['value'] === 'Tamil') {
      chapterNames = ChapterNames.chapNamesInTamil;
    } else if (this.selectedLanguage['value'] === 'Telugu') {
      chapterNames = ChapterNames.chapNamesInTelugu;
    }else {
      chapterNames = ChapterNames.chapNamesInEnglish;
    }
    const bookIndex = chapterNames.indexOf(this.currentBook);
    const verseObj = this.bibleData.Book[bookIndex].Chapter[this.currentChapter - 1].Verse[this.currentVerse - 1];
    //this.currentVerseText = verseObj.Verse;
    this.currentVerseText = `${this.verseNumber}. ${verseObj.Verse}`;

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
