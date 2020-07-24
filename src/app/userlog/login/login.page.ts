import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import 'firebase/app'
import 'firebase/auth'
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { LocationTrackerService } from '../../services/location-tracker.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  db = firebase.firestore();
  


  constructor(
    public authService: AuthService,
    private router: Router,
    private locationTracker : LocationTrackerService,
    private alertCtrl: AlertController) { }

    trackLocation(){
      this.locationTracker.startTracking();
    }
  
    stopLocation(){
      this.locationTracker.stopTracking();
    }
  ngOnInit() {
  }

  async login(): Promise<void> {
    const { email, password } = this;
    
    this.authService.loginUser(email,password).then(
      ()=>{

          //only allows pass if email is verified
        if(this.authService.isEmailVerified) {
                  
        //Takes a snapshot of user data to determine what time of user is signing in and routes to their pages
        //Currently unecessary but set up for future use.

        let self = this;
        var documentReference = this.db.collection('users').doc(this.authService.getUserId());
        
        documentReference.get().then(function(documentSnapshot) {
                                  if (documentSnapshot.exists) {

                                      self.locationTracker.startTracking();
                                      self.router.navigateByUrl('app');
                                      self.authService.setLocalPersist();
                                    /* }
                                  else if(documentSnapshot.data().userType == "Admin"){
                                    self.router.navigateByUrl('/tabs-admin');
                                    self.authService.setLocalPersist();
                                  } */}
                                    else {
                                    console.log('document not found');
                                  }
                            }) 
           } else {
          window.alert('Email is not verified');
          return false;
        }

      },
      async error => {
        const alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{text:'Ok', role:'cancel'}]
        });
        (await alert).present();
      }
    );
  }
}
