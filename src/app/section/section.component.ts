import { Component } from '@angular/core';


@Component({
  selector: 'app-section',
  imports: [],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css',
})
export class SectionComponent {
  section_title = "New Section";
  section_textcontent = "Your thoughts go here."
  __creationdate = new Date();
  section_date = "";

  constructor(){
    this.section_date = "On " + (this.__creationdate).toDateString() + ", at " + (this.__creationdate).toTimeString().toString().split(" ")[0]
  }

}