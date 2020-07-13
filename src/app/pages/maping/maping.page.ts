import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../providers/location-tracker.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maping',
  templateUrl: './maping.page.html',
  styleUrls: ['./maping.page.scss'],
  providers: [DatePipe],
  //encapsulation: ViewEncapsulation.None
})
export class MapingPage implements OnInit {
  data:any;
  lat;
  long;
  object_id = "370ee789-fc49-46e3-9783-093b004e0d59"
  timestamp
  constructor(private mapService : MapService, private datePipe: DatePipe, private loc : LocationTrackerService) { }

  setPosition(){
    this.mapService.setObjectPosition(this.object_id, this.lat,this.long)
    console.log('Set Position')
  }
  ngOnInit() {

    // this.mapService.getData(this.object_id).subscribe(data => {
    //   console.log(data);
    //   this.data = data;
    //     });
     this.mapService.getObjectLastPosition(this.object_id).subscribe(data => {
          console.log(data);
          this.data = data;
          this.timestamp  = this.datePipe.transform(this.data.objectState.timestamp, 'short');
     });

        this.lat = this.loc.lat;
        this.long = this.loc.lng;
      
  //   const cent = new tt.LngLat(-87.044285,41.462802);
  //   const map = tt.map({
      
  //     key: 'xhSLlv6eLXVggB5hbMeTK87voMmu2LV3',
      
  //     container: 'map',
      
  //     style: 'tomtom://vector/1/basic-main',

  //     //minZoom: 10,
      
  //     center: new tt.LngLat(-87.044285,41.462802),

  //     zoom: 15,


      
  //   });
    
      
  //   map.addControl(new tt.NavigationControl());
   }
}
