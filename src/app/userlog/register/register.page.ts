import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MapService } from '../../services/map.service';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [DatePipe],

})

export class RegisterPage implements OnInit {
  email: string = ""
  number: string = ""
  school: string = ""
  password: string = ""
  cpassword: string = ""

  today = new Date()
  date =this.datePipe.transform(this.today, 'short')

  constructor(
    public authService: AuthService,
    private router: Router,
    public AlertCtrl: AlertController,
    private mapService : MapService,
    private datePipe: DatePipe,

    ) { }

  ngOnInit() {
  }

 // try {
    // const res = await this.authService.auth.createUserWithEmailAndPassword(email,password).then(
    //     ()=>{
    //     this.router.navigateByUrl('/tabs/tab2');
    //   }
    //   );
    // } catch (error) {
    //   console.dir(error)
    // }

  async register(): Promise<void> {
    const { number, email,school, password, cpassword} = this;
    if(password !== cpassword){
      return console.error("Passwords don't match")
    }
    
    this.authService.registerUser(email,password).then(
      ()=>{
        this.authService.sendVerificationMail();

      const user = this.authService.createUser(school, email, false, number, 5, "Student")
      this.mapService.createObject(user, this.date).subscribe(data => {
        console.log(data);
      })
        this.router.navigateByUrl('/login');
      },
      async error => {
        const alert = this.AlertCtrl.create({
          message: error.message,
          buttons: [{text: 'Ok', role:'cancel'}]
        });
        (await alert).present();
      }
    );
  }
}
