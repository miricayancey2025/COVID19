import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import 'firebase/app'
import 'firebase/auth'
import { AlertController } from '@ionic/angular';
import {DataService} from '../../services/data.service'
import { MapService } from '../../services/map.service';
import * as firebase from 'firebase';
import { LocationTrackerService } from '../../providers/location-tracker.service';


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
    private mapService : MapService,
    public authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private locationTracker : LocationTrackerService,
    private alertCtrl: AlertController) { }

    trackLocation(){
      this.locationTracker.startTracking();
    }
  
    stopLocation(){
      this.locationTracker.stopTracking();
    }
    setFences(val){
      this.dataService.fenceList = val
    }
  ngOnInit() {
  }

  async login(): Promise<void> {
    const { email, password } = this;
    
    this.authService.loginUser(email,password).then(
      ()=>{

          //only allows pass if email is verified
        ///if(this.authService.isEmailVerified) {
          /* } else {
          window.alert('Email is not verified');
          return false;
        }*/




        //TAKES A SNAPSHOT OF USER DATA TO FIND OUT WHAT TYPE OF USER IS SIGNING IN
        //AFTER WHICH SETS THE DATA SERVICE VARIABLES AND ROUTES

          let self = this;
          var documentReference = this.db.collection('users').doc(this.authService.getUserId());
          
          documentReference.get().then(function(documentSnapshot) {
                                    if (documentSnapshot.exists) {


               ///AGENT TEMPORARILY ROUTES TO THE ADMIN SIDE 
                                      

                                    /*   if(documentSnapshot.data().userType == "Agent"){
                                      self.setAgent(documentSnapshot.data().userUID)
                                      self.router.navigateByUrl('/agent-tabs');
                                      self.authService.setLocalPersist();

                                    } */
                                      // else if(documentSnapshot.data().userType == "Client"){
                                        // self.setClient(documentSnapshot.data().userUID)
                                        self.locationTracker.startTracking();
                                        self.router.navigateByUrl('app');
                                        self.authService.setLocalPersist();

                                        // // self.mapService.getFences().subscribe(fence =>{
                                        // //   // self.fences = fence;
                                        // //   // self.fences = Object.keys(self.fences).map(it => self.fences[it])
                                        // //   // self.fences = self.fences[0]
                                        // //   // self.setFences(self.fences)
                                   
                                        // })

      
                                      /* }
                                    else if(documentSnapshot.data().userType == "Admin"){
                                      self.router.navigateByUrl('/tabs-admin');
                                      self.authService.setLocalPersist();
                                    } */}
                                      else {
                                      console.log('document not found');
                                    }
                              }) 
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
