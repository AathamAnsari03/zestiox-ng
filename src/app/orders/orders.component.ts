// ...existing imports...
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
     const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      console.log(this.user.id)   
    }
    this.fetchOrders();
    
  }

  fetchOrders(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:5000/orders/1').subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  getItemNames(order: any): string {
    return order.items.map((item: any) => item.name).join(', ');
  }

  cancelOrder(orderId: number): void {
    this.http.post(`http://localhost:5000/orders/cancel/${orderId}`, {}).subscribe({
      next: () => {
        // Refresh orders after cancellation
        this.fetchOrders();
      },
      error: () => {
        alert('Unable to cancel this order.');
      }
    });
  }
}