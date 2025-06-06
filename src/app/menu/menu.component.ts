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
  categoryOrder: { id: number, name: string, items: MenuItem[] }[] = [];
  menuData: { [key: string]: MenuItem[] } = {};
  user: any = null;

  // Cart count
  cartCount = 0;


  // Message for item added
  itemAddedMessage = '';
  showItemAdded = false;
  itemAddedTimeout: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load user info from localStorage FIRST
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Now you can use this.user.id, this.user.name, etc.
      console.log(this.user.id); // Log user id for debugging
    }
    // Now fetch menu items
    this.http.get<any>(`${environment.apiUrl}/menu-items`).subscribe(data => {
      console.log('Menu API response:', data); // Debug log
      // Try to assign correctly based on response structure
      if (Array.isArray(data)) {
        this.categoryOrder = data;
      } else if (data && Array.isArray(data.categories)) {
        this.categoryOrder = data.categories;
      } else {
        this.categoryOrder = [];
      }
    });
    // Now fetch cart count (user is set)
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
        this.getCartCount(); // Fetch the real cart count from backend after adding
        // Show item added message
        this.itemAddedMessage = `${item.name} added`;
        this.showItemAdded = true;
        if (this.itemAddedTimeout) {
          clearTimeout(this.itemAddedTimeout);
        }
        this.itemAddedTimeout = setTimeout(() => {
          this.showItemAdded = false;
        }, 1500);
      },
      error: (err: any) => {
        alert('Failed to add to cart. Please try again.');
      }
    });
  }

  getCartCount() {
    this.http.get<any>(`${environment.apiUrl}/cart/count?user_id=${this.user?.id || ''}`).subscribe({
      next: (res: any) => {
        this.cartCount = res && res.count !== undefined ? res.count : 0;
      },
      error: (err: any) => {
        this.cartCount = 0;
      }
    });
  }

  // Helper to split categories into rows of n
  getCategoryRows(categories: any[], perRow: number): any[][] {
    const rows = [];
    for (let i = 0; i < categories.length; i += perRow) {
      const row = categories.slice(i, i + perRow);
      while (row.length < perRow) {
        row.push(null); // pad with nulls for alignment
      }
      rows.push(row);
    }
    return rows;
  }

  // Helper to split categories into columns for vertical fill (column-major order)
  getCategoryColumns(categories: any[], perCol: number): any[][] {
    const columns: any[][] = Array.from({ length: perCol }, () => []);
    categories.forEach((cat, idx) => {
      columns[idx % perCol].push(cat);
    });
    return columns;
  }
}
