import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Login, Logout } from '../../auth.actions';
import { from, noop } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit() {
    this.auth.retreiveAppUser()
    .pipe(
      tap(user => {
        if (user) {
          console.log('Dispatching Login to store');
          this.store.dispatch(new Login({user}));
        }
        // This redirects the user to their original destination
        this.auth.redirectIfAuthorized(() => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            if (returnUrl) {
              console.log('navigating to return url: ', returnUrl);
              this.router.navigate([returnUrl]);
            } else {
              this.router.navigate(['/login']);
            }
        });
      })
    )
    .subscribe(
      noop,
      () => alert('Login Failed')
    );
  }

  signIn() {
    this.auth.googleLogin();
  }
}
