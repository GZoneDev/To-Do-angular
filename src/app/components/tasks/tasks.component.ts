import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TaskService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, OnDestroy {

  public createTaskVisible: boolean = false;
  public taskTitle: string = '';
  public taskDescription: string = '';

  public dashboardName: string = "Dashboard";

  public addTaskButtonHideName: string = "Hide Create Task";
  public addTaskButtonVisibleName: string = "Create Task";

  public formCreateTaskName: string = "Create Task";
  public addTaskTitleName: string = "Task title";
  public addTaskDescriptionName: string = "Task Description";
  public addTaskButtonName: string = "Create Task";

  public editTaskButtonName: string = "Edit";
  public deleteTaskButtonName: string = "Delete";
  public saveTaskButtonName: string = "Save";
  public cancelTaskButtonName: string = "Cancel";

  protected tasks: Task[] = [];
  protected editIndex: number | null = null;
  protected editTask: Task | null = null;
  protected taskName: string = '';
  protected taskCategoryId: string = '';

  private taskSubscription!: Subscription;

  private pageIndex: number = 0;
  private pageSize: number = 10;

  constructor(private taskService: TaskService) { }

  public ngOnInit(): void {
    this.taskSubscription = this.taskService.tasks$.subscribe(data => this.tasks = data);
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.taskService.getTasks(this.pageIndex, this.pageSize).subscribe();
  }

  public ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }
  
  public currentPage(): string {
    return this.pageIndex.toString();
  }

  public prevPage(): void {
    if (this.pageIndex > 0) {
      --this.pageIndex;
      this.loadTasks();
    }
  }

  public nextPage(): void {
    ++this.pageIndex;
    this.loadTasks();
  }

  protected getaddTaskButtonName(): string{
    return this.createTaskVisible ? this.addTaskButtonHideName : this.addTaskButtonVisibleName;
  }

  protected toggleCreateTask(): void {
    this.createTaskVisible = !this.createTaskVisible;
  }
  
  protected startEdit(index: number): void {
    this.editIndex = index;
    this.editTask = { ...this.tasks[index] };
  }

  protected saveEdit(): void {
    const index = this.editIndex;
    const task = this.editTask;

    if (index !== null &&
        task !== null &&
        task.name.trim() &&
        task.description.trim()) {

      this.taskService.update(this.tasks[index].id, task.name, task.description).subscribe( {
        next: () => {
          this.tasks[index].id = task.id;
          this.tasks[index].name = task.name;
          this.tasks[index].description= task.description;
        }
      });
      this.editIndex = null;
      this.editTask = null;
    }
  }

  protected deleteTask(index: number): void {
    this.taskService.delete(this.tasks[index].id).subscribe({
      next: () => {
        this.tasks.splice(index, 0);
        this.loadTasks();
      }
    });
  }

  protected cancelEdit(): void {
    this.editIndex = null;
    this.editTask = null;
  }

  protected createTask(): void {
    if (this.taskName && this.taskDescription) {
      this.taskService.create(this.taskName, this.taskDescription).subscribe({
        next: () => this.loadTasks()
      });
      this.taskName = '';
      this.taskDescription = '';
    }
  }
}