import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { Logout } from '../../auth.actions';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>) { }

  ngOnInit() {
  }

  logout() {
    console.log('Dispatching Logout to store');
    this.store.dispatch(new Logout());
  }

}
