import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[autoResizeText]'
})
export class AutoResizeTextDirective implements AfterViewInit {
  // These values can be adjusted as needed.
  private maxFontSize = 190;
  private minFontSize = 10;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Delay to allow layout to settle before measuring.
    setTimeout(() => this.adjustFontSize(), 100);
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustFontSize();
  }

  private adjustFontSize() {
    const element: HTMLElement = this.el.nativeElement;
    const container = element.parentElement;
    if (!container) {
      return;
    }

    // Determine the available dimensions from the parent container.
    const availableWidth = container.clientWidth;
    const availableHeight = container.clientHeight;
    
    // Use a baseline font-size for measurement.
    const baseline = 100;
    element.style.fontSize = baseline + 'px';
    
    // Force reflow and measure the natural size of the text at baseline.
    const naturalWidth = element.scrollWidth;
    const naturalHeight = element.scrollHeight;
    
    // Compute the scale factor required to fit both width and height.
    const scaleFactor = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight);
    
    // Compute the new font size.
    let newFontSize = baseline * scaleFactor;
    // Clamp the new font size between min and max values.
    newFontSize = Math.max(this.minFontSize, Math.min(newFontSize, this.maxFontSize));
    
    // Set the font size.
    element.style.fontSize = newFontSize + 'px';

    // Iteratively reduce font size if any part is still overflowing.
    let iterations = 0;
    while ((element.scrollWidth > availableWidth || element.scrollHeight > availableHeight) && iterations < 10) {
      newFontSize *= 0.95; // reduce by 5%
      element.style.fontSize = newFontSize + 'px';
      iterations++;
    }
  }
}
