import { Component } from '@angular/core';

import { CategoriesComponent } from '../categories/categories.component';
import { TasksComponent } from '../tasks/tasks.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [
    CategoriesComponent,
    HeaderComponent,
    TasksComponent,
    FooterComponent
  ],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.css'
})
export class ToDoComponent {

}
