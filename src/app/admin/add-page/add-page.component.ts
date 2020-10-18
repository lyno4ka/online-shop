import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../shared/product.service';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      photo: new FormControl(null, [Validators.required]),
      info: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
    });
  }

  submit() {
    if (this.form.invalid) { return; }

    this.submitted = true;

    const product = {
      type: this.form.get('type').value,
      title: this.form.get('title').value,
      photo: this.form.get('photo').value,
      info: this.form.get('info').value,
      price: this.form.get('price').value,
      date: new Date()
    };

    this.productService.create(product)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
      this.form.reset();
      this.submitted = false;
      this.router.navigate(['/']);
    });
  }
}
