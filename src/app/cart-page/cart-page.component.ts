import { Component, OnInit } from '@angular/core';
import {ProductService} from '../shared/product.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../shared/order.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {

  cartProducts = [];
  totalPrice = 0;
  added = '';

  form: FormGroup;
  submitted = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.cartProducts = this.productService.cartProducts;

    for (let i = 0; i < this.cartProducts.length; i++) {
      this.totalPrice += +this.cartProducts[i].price;
    }

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      payment: new FormControl('Cash'),
    });
  }

  submit() {
    if (this.form.invalid) { return; }

    this.submitted = true;

    const order = {
      name: this.form.get('name').value,
      phone: this.form.get('phone').value,
      address: this.form.get('address').value,
      payment: this.form.get('payment').value,
      orders: this.cartProducts,
      price: this.totalPrice,
      date: new Date()
    };

    this.orderService.create(order).subscribe(res => {
      this.form.reset();
      this.added = 'Delivery is framed';
      this.submitted = false;
    });
  }

  delete(product) {
    this.totalPrice -= +product.price;
    this.cartProducts.splice(this.cartProducts.indexOf(product), 1);
  }
}
