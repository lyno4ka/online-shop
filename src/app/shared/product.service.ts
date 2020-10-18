import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {FbResponse, Product} from './interfaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  type = 'Phone';
  cartProducts: Product[] = [];

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Product> {
    return this.http.post(`${environment.fbDbUrl}/products.json`, product)
      .pipe(
        map((res: FbResponse) => {
          return {
            ...product,
            id: res.name,
            date: new Date(product.date)
          };
        })
      );
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.fbDbUrl}/products.json`)
      .pipe(
        map(res => {
          return Object.keys(res)
            .map(key => ({
              ...res[key],
              id: key,
              date: new Date(res[key].date)
            }));
        })
      );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.fbDbUrl}/products/${id}.json`)
      .pipe(
        map((res: Product) => {
          return {
            ...res,
            id,
            date: new Date(res.date)
          };
        })
      );
  }

  remove(id: string) {
    return this.http.delete(`${environment.fbDbUrl}/products/${id}.json`);
  }

  update(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${environment.fbDbUrl}/products/${product.id}.json`, product);
  }

  setType(type: string) {
    this.type = type;
  }

  addProduct(product: Product) {
    this.cartProducts.push(product);
  }
}
