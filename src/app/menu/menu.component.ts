import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface MenuItem {
  id?: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  user: any = null;
  starters: MenuItem[] = [];
  breads: MenuItem[] = [];
  mainCourse: MenuItem[] = [];
  riceNoodles: MenuItem[] = [];
  desserts: MenuItem[] = [];
  beverages: MenuItem[] = [];
  cartCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Now you can use this.user.id, this.user.name, etc.
      console.log(this.user.id); // Log user id for debugging
  }
    }
    // Load menu data from assets/menu.json
    this.http.get<any>('assets/menu.json').subscribe(data => {
      this.starters = data['Starters'] || [];
      this.breads = data['Indian Breads'] || [];
      this.mainCourse = data['Main Course'] || [];
      this.riceNoodles = data['Rice & Biryani'] || [];
      this.desserts = data['Desserts'] || [];
      this.beverages = data['Beverages'] || [];
    });
    this.getCartCount();
  }

  addToCart(item: MenuItem) {
    const payload = {
      user_id: this.user?.id, // Use actual user id
      menu_item_id: item.id,
      quantity: 1
    };
    this.http.post<any>(`${environment.apiUrl}/cart/add`, payload).subscribe({
      next: response => {
        this.getCartCount();
      },
      error: err => {
        alert('Failed to add to cart. Please try again.');
      }
    });
  }

  getCartCount() {
    this.http.get<any>(`${environment.apiUrl}/cart/count?user_id=${this.user?.id || ''}`).subscribe({
      next: res => {
        this.cartCount = res.count;
      },
      error: err => {
        this.cartCount = 0;
      }
    });
  }
}
