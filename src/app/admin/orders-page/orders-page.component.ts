import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../shared/order.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit {
  orders = []; // toDo interfaces

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getAll()
      .pipe(untilDestroyed(this))
      .subscribe(orders => this.orders = orders);
  }

  remove(id) {
    this.orderService.remove(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.orders = this.orders.filter(order => order.id !== id));
  }

}
