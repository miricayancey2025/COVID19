import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../providers/location-tracker.service'
import { DatePipe } from '@angular/common';
import { IonRefresher } from '@ionic/angular';
import { range } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';

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
  object_id = "29017b68-dc6f-431c-aaaa-09e81400d956"
  timestamp;
  today = new Date()
  date =this.datePipe.transform(this.today, 'short')
  fence_id ="2e42f48d-ec1a-4f59-8947-0c5279aaa34b";
  sum;
  fences
  interval;
  timeLeft: number = 60;

  public fenceList;

  
  constructor(private firestoreService: FirestoreService,  private mapService : MapService, private datePipe: DatePipe, private loc : LocationTrackerService) { }


  startTimer(fences) {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        console.log(fences)
        fences.forEach(element => {
          element.forEach(f => {
              this.mapService.getFenceHeadCount(f.fence_id).subscribe(data =>{
                console.log("Successful Fence Update!")
              })
          });
        });
        this.timeLeft = 60;

      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }



  setPosition(){
    this.mapService.setObjectPosition(this.object_id, this.long,this.lat).subscribe(data => {
      console.log(data);
    })
    console.log('Tried Position')
  }
  reportObj(){
    this.mapService.postObjectReport(this.object_id, this.long,this.lat).subscribe(data => {
      console.log(data);
    })
    console.log('Tried Report')
  }


  deleteObj(obj){
    this.mapService.deleteObject(obj)
  }


  ngOnInit() {
    this.fenceList = this.firestoreService.getAllFences("valpo_fences").valueChanges()
    //this.startTimer(this.fenceList)

     this.mapService.getObjectLastPosition(this.object_id).subscribe(dat => {
          console.log(dat);
          this.data = dat;
          this.timestamp  = this.datePipe.transform(this.data.objectState.timestamp, 'short');
     });

     this.mapService.getFences().subscribe(fence =>{
       console.log(fence)
       this.fences = fence;
       this.fences = Object.keys(this.fences).map(it => this.fences[it])
       this.fences = this.fences[0]
       this.fences.forEach(element => { 
         element.populaton = 0
        this.mapService.getFenceHeadCount(element.id).subscribe(data =>{
          element.population = data
        })
       });
       console.log(this.fences[0])

     })
     
        //this.sum = this.mapService.getFenceHeadCount(this.fence_id)


    // const f_db = this.db.collection("valpo_fences")

    // const snapshot = await f_db.get();
    //   snapshot.forEach(doc => {
    //     this.mapService.getFenceHeadCount(doc.id)
    //     //this.firestoreService.updateFence("valpo_fences",doc.id, 0)
    //   });
    //this.fences = this.firestoreService.getListAll("valpo_fences").valueChanges()

    // this.mapService.getData(this.object_id).subscribe(data => {
    //   console.log(data);
    //   this.data = data;
    //     });


     //this.data = this.mapService.getObjectLastPosition(this.object_id).valueChanges()

        this.long =  -80.040241;
        this.lat = 41.464114;
      // 41.464114, -87.040241
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
