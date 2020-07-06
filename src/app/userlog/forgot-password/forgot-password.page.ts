import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string = "";

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  passwordReset(){
    const email = this;
    this.authService.resetPassword(this.email);
  }
}
