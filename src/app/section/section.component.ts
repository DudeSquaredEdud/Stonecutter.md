import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section',
  imports: [],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css',
})
export class SectionComponent{
  section_title = "New Section";
  section_textcontent = "Your thoughts go here."
  __creationdate = new Date();
  section_date = "";
  @Input() unique_id = 0;
  new_id = 0;

  constructor(){
    this.section_date = "On " + (this.__creationdate).toDateString() + ", at " + (this.__creationdate).toTimeString().toString().split(" ")[0]
  }

  getFootnoteCount() {
    // put a regex find for every [n] in the text
    let re = new RegExp("\[[0-9]+\]");
    // return the [n]'s in there as a list.
    return this.section_textcontent.matchAll(re);
  }

  // setId(new_id: number) {
  //   this.unique_id.arguments = new_id;
  // }
}