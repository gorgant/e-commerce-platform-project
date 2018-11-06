import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.auth.redirectIfAuthorized(() => {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.router.navigate([returnUrl]);
    });
  }

  signIn() {
    this.auth.googleLogin();
  }

}
