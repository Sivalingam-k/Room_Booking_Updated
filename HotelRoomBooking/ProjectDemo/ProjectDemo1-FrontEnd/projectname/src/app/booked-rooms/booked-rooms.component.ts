import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-booked-rooms',
  templateUrl: './booked-rooms.component.html',
  styleUrls: ['./booked-rooms.component.css']
})
export class BookedRoomsComponent implements OnInit {
  bookedRooms: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  userEmail: string | null = null;

  private apiUrl = 'http://localhost:5046/api/Payment'; // Update with your API base URL
  private cancelUrl = 'http://localhost:5046/api/Payment/CancelBooking';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail'); // Retrieve user email from sessionStorage

    if (this.userEmail) {
      this.loadBookedRooms();
    } else {
      this.error = 'User email is not available. Please log in.';
      this.loading = false;
    }
  }

  loadBookedRooms(): void {
    if (!this.userEmail) {
      this.error = 'User email is not available. Please log in.';
      this.loading = false;
      return;
    }

    // Create HTTP parameters with user email
    const params = new HttpParams().set('email', this.userEmail);
console.log(params)
    this.http.get<any[]>(`${this.apiUrl}/GetBookedRoomsByUserEmail`, { params })
      .subscribe({
        next: (data) => {
          this.bookedRooms = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching booked rooms:', err); // Log detailed error
          this.error = 'No Records!! Not Booked!!';
          this.loading = false;
        }
      });
  }
  cancelBooking(roomNumber: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.http.delete(`${this.cancelUrl}?roomNumber=${roomNumber}`)
        .subscribe({
          next: () => {
            this.loadBookedRooms(); // Reload the bookings to reflect the cancellation
          },
          error: (err) => {
            console.error('Error canceling booking:', err);
            this.error = 'Failed to cancel booking. Please try again later.';
          }
        });
    }
  }
}
