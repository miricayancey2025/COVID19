import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';
import { MapService } from '../services/map.service';



@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  private timestamp;

  constructor(public zone: NgZone, private backgroundGeolocation : BackgroundGeolocation, private geolocation : Geolocation,private mapService : MapService,) { }


startTracking() {

    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10, 
      debug: true,
      interval: 120000
    };

    this.backgroundGeolocation.configure(config).then((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
            // this.mapService.setObjectPosition(this.object_id, this.lat,this.lng).subscribe(data => {
      //   console.log(data);
      // })

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

  let options = {
    frequency: 120000, 
    enableHighAccuracy: true
  };

  this.watch = this.geolocation.watchPosition(options).pipe(
    filter((p) => p.coords !== undefined)).subscribe((position: Geoposition) => {

    console.log("Foreground Geolocation" + position);


    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      
    });
  });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }
}