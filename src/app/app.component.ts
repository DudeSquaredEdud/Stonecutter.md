import { Component, computed, HostBinding, HostListener, viewChildren, ChangeDetectorRef, viewChild, OnInit, Signal, signal, WritableSignal, QueryList, ViewChildren} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionComponent } from './section/section.component';
import { FootnotesComponent } from './footnotes/footnotes.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SectionComponent, FootnotesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChildren(SectionComponent) childSections: QueryList<SectionComponent> = {} as QueryList<SectionComponent>;
  
  saveState = {
    post_number:  "",
    title:        "",
    sections_component:     "",
    footnotes_component:    ""
  };

  // save!
  ngOnInit(){
    this.saveState = JSON.parse(localStorage.getItem('saveState')!);
    console.log("State Retrieved!");
    this.title = this.saveState.title ?? "New Post";
    this.entry_number = this.saveState.post_number ?? "0000";
    // hydrate the sections
    JSON.parse(this.saveState.sections_component).forEach((element: { sect: SectionComponent; }) => {
      let sec = element.sect;
      this.new_section(null, sec.section_title, sec.section_textcontent, sec.section_date);
    });
  }

  // Title & footnotes
  title = "New Post";
  entry_number = "0000";

  // Sections
  section_count = 0;
  section_count_range = new Array(this.section_count).fill(0).map((n, index) => index + 1);

  childSectionsComputed = computed(() => {
    let sections: {id: number, sect: SectionComponent}[] = [];
    let id: number = this.section_count;
    this.childSections.forEach((childSection: SectionComponent) => {
      sections.push({id: id, sect: childSection});
      id++;
    });
    return sections;
  });

  childFootnoteSignal = viewChild(FootnotesComponent);

  selected_section: string | null = "0";

  @HostListener('document:keydown.control.s', ['$event'])
  getSaveState(e:any){
    e.preventDefault();
    console.log("Saved!");
    this.entry_number = document.getElementById("entry_number")?.innerHTML!;
    this.title = document.getElementById("postTitle")?.innerHTML!;
    this.childSectionsComputed().forEach(element => {
      element.sect.updateText();
      console.log(<SectionComponent> element.sect);
    });
    this.saveState = {
      post_number:  this.entry_number,
      title:        this.title,
      sections_component:      JSON.stringify(this.childSectionsComputed()),
      footnotes_component:    JSON.stringify(this.childFootnoteSignal())
    };
    console.log(this.saveState);
    localStorage.setItem('saveState', JSON.stringify(this.saveState));
  }

  // grab a section and its components
  grab_section(sec_id: number){
    return {
      section: (<HTMLElement>document.querySelector('section[sec_id="'+sec_id+'"]')),
      title:   (<HTMLInputElement>document.querySelector('h2[sec_id="'+sec_id+'"]')),
      date:    (<HTMLElement>document.querySelector(".date[sec_id=\""+sec_id+"\"]")),
      text:    (<HTMLInputElement>document.querySelector("p.contentText[sec_id=\""+sec_id+"\"]")),
    };
  }

  // Create a new section
  @HostListener('document:keydown.control.enter', ['$event'])
  new_section(e: any, title: string = "null", content: string = "null", date: string = "null"){
    this.section_count_range = Array(this.section_count).fill(0).map((n, index) => index + 1);
    this.section_count++;
    setTimeout(() => {
      if (title != "null"){
        let sec = this.grab_section(this.section_count);
        // console.log(sec.date.innerHTML);
      sec.title.innerHTML = title;
      sec.date.innerHTML = date;
      sec.text.innerHTML = content;
    }},  10);
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
    for (let i=0; i < this.childSectionsComputed().length; i++){
      this.childSectionsComputed().forEach(element => {
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


  @HostListener('document:keydown.control.e', ['$event'])
  export_text(e: any){
    e.preventDefault();
    this.entry_number = document.getElementById("entry_number")?.innerHTML!;
    this.title = document.getElementById("postTitle")?.innerHTML!;
    let section_texts = "";
    let re = new RegExp("(\[[0-9]+\])", "g");
    this.childSectionsComputed().forEach(element => {
      // this is an abomination. 
      section_texts = section_texts.concat(`***${element.sect.getTitle()}*** ${element.sect.section_date}\n\n${element.sect.getText().replaceAll(re, ("[$1(####_"+ this.entry_number + "_fn_>>$1<<)]"))}\n\n`).replaceAll(">>[", "").replaceAll("]<<", "");
      } 
    );

    let footnote_text = "";
    this.childFootnoteSignal()?.getText().forEach(element => {
      footnote_text = footnote_text.concat(`#### ${this.entry_number} Fn ${element.id}\n\n${element.content}\n\n`);
      } 
    );

    let copy_text = `## ${this.entry_number}: ${this.title}\n---\n`
    +"\n"+
    section_texts
    +"\n";
    
    if (footnote_text.trim() != "")
      copy_text.concat( 
        "### Footnotes"
        +"\n"+
        footnote_text);

  navigator.clipboard.writeText(copy_text);
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
