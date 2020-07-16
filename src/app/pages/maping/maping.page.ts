import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../providers/location-tracker.service'
import { DatePipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-maping',
  templateUrl: './maping.page.html',
  styleUrls: ['./maping.page.scss'],
  providers: [DatePipe],
  //encapsulation: ViewEncapsulation.None
})
export class MapingPage implements OnInit {
  data:any;
  lat;long;
  timestamp;
  interval;
  public objList;
  public fenceList;
  timeLeft: number = 30
  switch: number = 10
  today = new Date();
  date =this.datePipe.transform(this.today, 'short');
  object_id = "29017b68-dc6f-431c-aaaa-09e81400d956";
  positions = [
    [-87.042634, 41.464394],  //Union
        
    [-87.040241, 41.464114], //VUCA

    [-87.044086,41.462898], //Library

    [-87.041720, 41.463089], //Chapel

    [-87.041009, 41.461265], //Welcome Center

  ];
  
  constructor(private firestoreService: FirestoreService,  private mapService : MapService, private datePipe: DatePipe, private loc : LocationTrackerService) { }


  startTimer(fences) {
    
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        //console.log(fences)
        //this.movePositions()
        fences.forEach(element => {
          element.forEach(f => {
              this.mapService.getFenceHeadCount(f.fence_id).subscribe(data =>{
                console.log("Successful Fence Update!")
              })});});
        this.timeLeft = 30;
      }
    },1000)}

    getCount(fences){
      fences.forEach(element => {
        element.forEach(f => {
            this.mapService.getFenceHeadCount(f.fence_id).subscribe(data =>{
              console.log("Successful Fence!")
            })});});
      this.timeLeft = 30;
    }
    

    getObjects() {
      return new Promise((resolve) =>{
        this.mapService.getObjects().subscribe(obj =>{
          this.objList = obj;
           this.objList = Object.keys(this.objList).map(it => this.objList[it])
           this.objList = this.objList[0]
           console.log(this.objList)
           resolve()
          })
      })
    }
      movePositions(){
        this.getObjects().then(() =>{
        this.mapService.changePositions(this.objList, this.positions)
      })}

    
    
    
  



  pauseTimer() {
    clearInterval(this.interval);
  }

  setPosition(){
    this.mapService.setObjectPosition(this.object_id, this.long,this.lat).subscribe(data =>{
      console.log('Tried Position')
    })
  }

  reportObj(){
    this.mapService.postObjectReport(this.object_id, this.long,this.lat).subscribe(data =>{
      console.log('Tried Report')
    })
  }


  deleteObj(obj){
    this.mapService.deleteObject(obj)
  }


  ngOnInit() {
    this.long =  this.loc.lng;
    this.lat = this.loc.lat;
    this.fenceList = this.firestoreService.getAllFences("valpo_fences").valueChanges()
    this.getCount(this.fenceList)
    this.startTimer(this.fenceList)  
     this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
         // console.log(dat);
          this.data = dat;
          this.timestamp  = this.datePipe.transform(this.data.objectState.timestamp, 'short');
     });

    //  this.mapService.getFences().subscribe(fence =>{
    //    console.log(fence)
    //    this.fences = fence;
    //    this.fences = Object.keys(this.fences).map(it => this.fences[it])
    //    this.fences = this.fences[0]
    //    this.fences.forEach(element => { 
    //      element.populaton = 0
    //     this.mapService.getFenceHeadCount(element.id).subscribe(data =>{
    //       element.population = data
    //     })
    //    });
    //    console.log(this.fences[0])

    //  })
     
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
