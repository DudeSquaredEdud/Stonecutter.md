import { Component, HostBinding, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionComponent } from './section/section.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Stonecutter.md';
  entry_number = "0005";
  sections = [{id: 1}]

  @HostListener('document:keydown.control.enter', ['$event'])
  new_section(event: KeyboardEvent){
    if (event.ctrlKey){
      this.sections = this.sections.concat({id: (this.sections[this.sections.length-1].id + 1)})
      console.log("New Section")
    }
  }
}
