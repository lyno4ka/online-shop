import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../shared/product.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Product} from '../../shared/interfaces';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  productName;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAll()
      .pipe(untilDestroyed(this))
      .subscribe((products) => this.products = products);
  }

  remove(id: string) {
    this.productService.remove(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.products = this.products.filter(product => product.id !== id));
  }
}
