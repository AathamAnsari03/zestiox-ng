import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = `${environment.apiUrl}/authenticate`;

  constructor(private http: HttpClient) {}

  login(mobile: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { mobile, password });
  }
}
