import { Component, computed, HostBinding, HostListener, viewChildren, ChangeDetectorRef, viewChild } from '@angular/core';
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
  title = 'Stonecutter.md, Part 2';
  entry_number = "0006";

  // Sections
  section_count = 1;
  section_count_range = new Array(this.section_count).fill(0).map((n, index) => index + 1);
  
  childSectionsSignal = viewChildren(SectionComponent);
  childSections = computed(() => {
    let sections: {id: number, sect: SectionComponent}[] = [];
    let id: number = this.section_count;
    this.childSectionsSignal().forEach((childSection: SectionComponent) => {
      sections.push({id: id, sect: childSection});
      id++;
    })
    return sections;
  });

  childFootnoteSignal = viewChild(FootnotesComponent);

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
    let target_section = document.querySelectorAll('section[sec_id="'+this.selected_section+'"]');
     target_section.forEach(target => {
      if (target.classList.contains("deleted")){
        target.classList.remove("deleted");
      }
      else{
        target.classList.add("deleted");
      }
      
      });
  }

  // Find what the current section is
  @HostListener('document:click', ['$event'])
  select_section(event: MouseEvent){
    if (event.target instanceof Element) {
      let target_id = event.target.getAttribute("sec_id");
        this.selected_section = target_id!; 
     }
  }

  // Footnote generation
  @HostListener('document:keyup.code.BracketRight', ['$event'])
  collectFootnotes(){
    let document_footnotes: string[]=[];
    let section_footnotes = [];
    for (let i=0; i < this.childSections().length; i++){
      this.childSections().forEach(element => {
        section_footnotes = element.sect.getFootnoteCount();
        // Ugh.
        section_footnotes.forEach(fakeElement => {
          fakeElement.forEach(actualElement => {
            if(!document_footnotes.includes(actualElement)){
              document_footnotes.push(actualElement);
            }
          })
        })
      });
    }
    // create a list without duplicates
    this.childFootnoteSignal()?.updateFootnotes(document_footnotes);
  }


  @HostListener('document:keydown.control.s', ['$event'])
  export_text(e: any){
    e.preventDefault();
    let section_texts = "";
    this.childSections().forEach(element => {
      section_texts = section_texts.concat(`***${element.sect.getTitle()}*** ${element.sect.section_date}\n\n${element.sect.getText()}\n\n`);
      } 
    );



    let footnote_text = "";
    this.childFootnoteSignal()?.getText().forEach(element => {
      footnote_text = footnote_text.concat(`#### Fn ${element.id}: ${element.content}\n\n`);
      } 
    );

    console.log(
      `## ${this.entry_number}: ${this.title}\n---\n`
      +"\n"+
      section_texts
      +"\n"+
      "### Footnotes"
      +"\n"+
      footnote_text
    )
    }
}
