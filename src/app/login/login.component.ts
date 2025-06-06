import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  mobile = '';
  password = '';
  error = '';
  success = '';

  constructor(private loginService: LoginService) {}

  onSubmit() {
    this.loginService.login(this.mobile, this.password).subscribe({
      next: (res: any) => {
        this.success = 'Login successful!';
        this.error = '';
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
        // Example: Redirect to menu after 1 second
        setTimeout(() => {
          window.location.href = '/menu';
        }, 1000);
      },
      error: (err: any) => {
        this.error = err.error.error || 'Login failed';
        this.success = '';
      }
    });
  }
}
