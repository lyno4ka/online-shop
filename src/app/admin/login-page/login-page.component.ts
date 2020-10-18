import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
        email: new FormControl(null, [Validators.email, Validators.required]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.form.invalid) { return; }

    this.submitted = true;
    const user = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      returnSecureToken: true
    };

    this.auth.login(user)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin/dashboard']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    });
  }
}

