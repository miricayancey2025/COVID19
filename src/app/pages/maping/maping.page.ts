import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-maping',
  templateUrl: './maping.page.html',
  styleUrls: ['./maping.page.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class MapingPage implements OnInit {
  data:any;
  constructor(private mapService : MapService,) { }

  ngOnInit() {

    this.mapService.getData("370ee789-fc49-46e3-9783-093b004e0d59").subscribe(data => {
      console.log(data);
      this.data = data;
        })
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
