import { Component, computed, HostBinding, HostListener, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionComponent } from './section/section.component';
import { FootnotesComponent } from './footnotes/footnotes.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SectionComponent, FootnotesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Title & footnotes
  title = 'Stonecutter.md';
  entry_number = "0005";
  footnotes = new FootnotesComponent();

  // Sections
  section_count = 1;
  section_count_range = new Array(this.section_count).fill(0).map((n, index) => index + 1);
  
  childSectionsSignal = viewChildren(SectionComponent);
  childSections = computed(() => {
    let sections: {id: number, sect: SectionComponent}[] = [];
    let id: number = 1;
    this.childSectionsSignal().forEach((childSection: SectionComponent) => {
      sections.push({id: id, sect: childSection});
      id++;
    })
    return sections;
  });

  selected_section: string | null = "0";

  // Create a new section
  @HostListener('document:keydown.control.enter', ['$event'])
  new_section(event: KeyboardEvent){
    this.section_count++;
    this.section_count_range = Array(this.section_count).fill(0).map((n, index) => index + 1);
      console.log("New Section");
  }

  // Delete a section
  @HostListener('document:keydown.control.delete', ['$event'])
  delete_section(event: KeyboardEvent){
    if (typeof this.selected_section == "string"){
      let target_id = this.selected_section;
      this.section_count_range = this.section_count_range.filter(function(item) {
        let target_section = document.querySelectorAll('section[sec_id="'+target_id+'"]');
        target_section.forEach((thing) => {thing.remove()})
        return item.toString() != target_id;
      }) 
      this.section_count--;
      let new_id = 1;
      this.childSections();
      this.childSections().forEach(element => {
          element.id = new_id;
          element.sect.unique_id = new_id;
          console.log(element.id + " " + element.sect.unique_id);
          new_id++;  
      });
        console.log("Deleted Section");  
    }
      this.selected_section = null;
  }

  // Find what the current section is
  @HostListener('document:click', ['$event'])
  select_section(event: MouseEvent){
    if (event.target instanceof Element) {
      let target_id = event.target.getAttribute("sec_id");
        this.selected_section = target_id!; 
     }
  }

  collectFootnotes(){
    // future ashton: this is broken.
    // footnotes: [""];
    // for (let i=0; i < this.childSections.length; i++){
    //   this.childSections.array.forEach(element => {
    //     element.getFootnoteCount();
    //   });
    // }
    // This gets called every few seconds
    // getFootnoteCount from all sections

      // Ah frick, how do I reference the sections?

    // create a list without duplicates
    // send to updateFootnotes()  
  }
}
