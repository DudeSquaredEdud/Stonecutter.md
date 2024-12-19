import { NonNullAssert } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footnotes',
  imports: [],
  templateUrl: './footnotes.component.html',
  styleUrl: './footnotes.component.css'
})
export class FootnotesComponent {
  section_title = "Footnotes";
  notes: { id: number, content: string }[] = [];

  add_footnote(note_id: string){
    let is_present = false;
    this.notes.forEach(element => {
      is_present = is_present || (element.id == Number(note_id))
    })
    if (!is_present){
      this.notes.push({id: Number(note_id), content: ""});
    }
    setTimeout(() => {
      let on_page_note: HTMLInputElement = <HTMLInputElement>document.querySelector("p.footnoteText[fnid=\"" + note_id + "\"]");
      on_page_note?.focus();
      
    }, 200);

  }
  
  updateFootnotes(document_footnotes: string[]){
    document_footnotes.forEach(element => {
      this.add_footnote(element.split("]")[0].split("[")[1]);
    })
    console.log(this.notes);
  }

  updateText(){
    this.notes.forEach(element => {
        element.content = document.querySelector(`p.footnoteText[fnid="${element.id}"]`)?.innerHTML!;
    })
  }

  getText(){
    this.updateText();
    return this.notes;
  }
}