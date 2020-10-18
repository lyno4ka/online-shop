import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../shared/product.service';
import {switchMap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../shared/interfaces';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  form: FormGroup;
  product: Product;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.productService.getById(params['id'])),
      untilDestroyed(this)
    ).subscribe((product) => {
      this.product = product;
      this.form = new FormGroup({
        type: new FormControl(this.product.type, [Validators.required]),
        title: new FormControl(this.product.title, [Validators.required]),
        photo: new FormControl(this.product.photo, [Validators.required]),
        info: new FormControl(this.product.info, [Validators.required]),
        price: new FormControl(this.product.price, [Validators.required]),
      });
    });
  }

  submit() {
    if (this.form.invalid) { return; }

    this.submitted = true;

    this.productService.update({
      ...this.product,
      type: this.form.get('type').value,
      title: this.form.get('title').value,
      photo: this.form.get('photo').value,
      info: this.form.get('info').value,
      price: this.form.get('price').value,
      date: new Date()
    }).pipe(untilDestroyed(this))
      .subscribe(() => {
      this.submitted = false;
      this.router.navigate(['/admin', 'dashboard']);
    });
  }

}
