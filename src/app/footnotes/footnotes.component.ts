import { Component } from '@angular/core';

@Component({
  selector: 'app-footnotes',
  imports: [],
  templateUrl: './footnotes.component.html',
  styleUrl: './footnotes.component.css'
})
export class FootnotesComponent {
  section_title = "Footnotes";
  // I need to put at least one in here. ugh.
  notes: [{ id: number; content: string; }] = [{id: 0, content:""}];

  add_footnote(){
    this.notes.push({id: this.notes.length, content: ""})
  }

  updateFootnotes(){
    // if there are any new footnotes
    // (sort the incoming list of footnotes, )
  }
}