import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  line_total: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number | null = null;
  grandTotal: number = 0;
  orderPlaced: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
    }
    this.fetchCartItems();
  }

  fetchCartItems() {
    if (!this.userId) return;
    this.http.get<{cart: CartItem[], grand_total: number}>(`http://localhost:5000/carts?userId=${this.userId}`)
      .subscribe(res => {
        this.cartItems = res.cart;
        this.grandTotal = parseFloat(res.grand_total as any);
      });
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1 || !this.userId) return;
    this.http.put<{message: string}>(`http://localhost:5000/carts/${item.id}`, { quantity: newQuantity })
      .subscribe(() => {
        this.fetchCartItems();
      });
  }

  removeItem(item: CartItem) {
    if (!this.userId) return;
    this.http.delete<{message: string}>(`http://localhost:5000/carts/${item.id}`)
      .subscribe(() => {
        this.fetchCartItems();
      });
  }

  calculateGrandTotal() {
    this.grandTotal = this.cartItems.reduce((sum, item) => sum + item.line_total, 0);
  }

  placeOrder() {
    if (!this.userId) return;
    this.http.post<{message: string, order_id: number}>(`http://localhost:5000/orders?userId=${this.userId}`, {})
      .subscribe(res => {
        this.orderPlaced = true;
        this.cartItems = [];
        this.grandTotal = 0;
      });
  }
}
