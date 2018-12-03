import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  appUser$: Observable<AppUser>;

  constructor(
    private authService: AuthService,
    ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login();
  }
}
