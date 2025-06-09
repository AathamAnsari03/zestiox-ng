import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  name: string;
  mobile: string;
  password: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: any = null;
  loading = true;
  error: string | null = null;



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
     const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      console.log(this.user.id)   
    }

    this.http.get<User>(`${environment.apiUrl}/users/${this.user.id}`).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}