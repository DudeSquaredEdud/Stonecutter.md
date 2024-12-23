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
  title = 'New Post';
  entry_number = "0000";

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
      document.querySelector("section.current")?.classList.remove("current");
      let target_id = event.target.getAttribute("sec_id");
        this.selected_section = target_id!; 
        document.querySelector("section[sec_id=\"" + target_id! + "\"]")?.classList.add("current");
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
    let re = new RegExp("(\[[0-9]+\])", "g");
    this.childSections().forEach(element => {
      // this is an abomination. 
      section_texts = section_texts.concat(`***${element.sect.getTitle()}*** ${element.sect.section_date}\n\n${element.sect.getText().replaceAll(re, ("[$1(####_"+ this.entry_number + "_fn_>>$1<<)"))}\n\n`).replaceAll(">>[", "").replaceAll("]<<", "");
      } 
    );

    let footnote_text = "";
    this.childFootnoteSignal()?.getText().forEach(element => {
      footnote_text = footnote_text.concat(`#### ${this.entry_number} Fn ${element.id}\n\n${element.content}\n\n`);
      } 
    );

    
  navigator.clipboard.writeText(
      `## ${document.getElementById("entry_number")?.innerHTML}: ${document.getElementById("postTitle")?.innerHTML}\n---\n`
      +"\n"+
      section_texts
      +"\n"+
      "### Footnotes"
      +"\n"+
      footnote_text
    )
    }

  theme = 0;
  @HostListener('document:keydown.control.d', ['$event'])
  toggle_dark(e:any){
    e.preventDefault();
    let bodyclasses = document.getElementsByTagName("body")[0].classList;
    this.theme = (this.theme+1)%3;
    bodyclasses.remove("dark");
    bodyclasses.remove("bloody");

    switch(this.theme){
      case 1: 
      bodyclasses.add("dark");
      console.log("Theme is dark.");
      break;

      case 2:
      bodyclasses.add("bloody");
      console.log("Theme is bloody.");
      break;

      default:
      console.log("Theme is light.");
      break;
    }
  }
}
