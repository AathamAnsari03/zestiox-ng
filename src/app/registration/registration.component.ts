import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  apiError: string | null = null;
  apiValidationDetails: any = null;
  registrationSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get f() { return this.registerForm.controls; }

  onBlur(field: string) {
    this.registerForm.get(field)?.markAsTouched();
  }

  onInput(field: string) {
    this.apiError = null;
    this.apiValidationDetails = null;
    this.registerForm.get(field)?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    this.apiError = null;
    this.apiValidationDetails = null;
    if (this.registerForm.invalid) return;
    const { name, mobile, password } = this.registerForm.value;
    this.http.post<any>(`${environment.apiUrl}/register`, { name, mobile, password }).subscribe({
      next: (res) => {
        this.registrationSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.apiError = err.error.error || 'Invalid input';
          this.apiValidationDetails = err.error.details || null;
        } else {
          this.apiError = 'An unexpected error occurred.';
        }
      }
    });
  }
}
