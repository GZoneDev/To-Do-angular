import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  providers: [UserService, Router],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public logoName: string = 'To-Do';

  public constructor(private userService: UserService, private router: Router) {}

  protected logout(): void {
    this.userService.logoutUser()        
      .subscribe({
      next: (response) => {
        console.log('Logout success:', response);
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });;
    
  }
}
