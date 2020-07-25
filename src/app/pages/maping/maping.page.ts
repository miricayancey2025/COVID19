import { Component, OnInit, ViewEncapsulation, DoBootstrap } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../services/location-tracker.service'
import { DatePipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';


@Component({
  selector: 'app-maping',
  templateUrl: './maping.page.html',
  styleUrls: ['./maping.page.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class MapingPage implements OnInit {

  //user's object string, hard coded for demo purposes so that no matter who logs in they are movng the same object (prevents api overload)
  object_id ="29017b68-dc6f-431c-aaaa-09e81400d956";
  data;
  infos;
  public db;

  //time/date variables
  timestamp;
  interval;
  previous;
  current;
  timeLeft: number = 300
  today = new Date();
  date =this.datePipe.transform(this.today, 'short');

  
  //list variables (object list pertains to the "student" objects and fence list pertains to the buildings)
  objList;
  fenceList;
  fence_inside;
  current_fence;

  //map variables
  map: any;
  lat;
  long;
  positions = [
    [-87.042634, 41.464394],  //Union    
    [-87.040241, 41.464114], //VUCA
    [-87.043458,41.462703], //Library
    [-87.041720, 41.463089], //Chapel
    [-87.041009, 41.461265], //Welcome Center
  ];
  pos_names =[
    "The Union",
    "The VUCA",
    "The Library",
    "The Chapel",
    "The Welcome Center"
  ]

  constructor(public alertController: AlertController, private firestoreService: FirestoreService,  private mapService : MapService,     public authService: AuthService, private datePipe: DatePipe, private loc : LocationTrackerService) { }

  async presentAlert(header, message) { //presents an alert message
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  move() { //sets a timer that automatically moves objects through fences and updates fence transitions. Every 5 mins for demo purposes
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.movePositions()
        this.timeLeft = 300;
      }},1000)}



  getCount(){ //gets initial fence headcount
    //Gets Current Time and Time from 10 minutes ago
    var d_1 = new Date()
    this.current = d_1.toISOString().substring(0, d_1.toISOString().length - 5)
    var d_2 = new Date()
    d_2.setMinutes(d_2.getMinutes() -10)
    this.previous= d_2.toISOString().substring(0, d_2.toISOString().length - 5)
    var list
    this.mapService.getFences().subscribe(data =>{
      list = data
      list = list.fences
      for(var x = 0; x < list.length; x++){
        this.mapService.getFenceHeadCount(list[x].id, this.previous, this.current).subscribe(data =>{
          console.log("Successful Fence Update!")
        })}})}


  refresh(){ //Refreshes Fence Count and displays alert
    //Randomized object (student) movement for demo purposes
    this.getCount()
    this.presentAlert("Page Refreshed", "Page has been Refreshed!")
  }

  getObjects() { //gets all the objects from the mapService
      return new Promise((resolve) =>{
        this.mapService.getObjects().subscribe(obj =>{
          this.objList = obj;
           this.objList = Object.keys(this.objList).map(it => this.objList[it])
           this.objList = this.objList[0]
           resolve()
          })})}


  movePositions(){ //gets all objects and calls a random position change
        this.getObjects().then(() =>{
        this.mapService.changePositions(this.objList, this.positions)
      })}


  hotspotDetection(){ //gets the current population of the fence the user is in gives orange or red warning
    this.mapService.getObjectReport(this.object_id, this.long, this.lat).subscribe(data =>{
      var ins: any = data
      console.log(ins)
      var id = ins.inside.features[0].id
      this.firestoreService.getDetail("valpo_fences", id).valueChanges().subscribe(res =>{
        this.fence_inside = res
        var pop = this.fence_inside.population
        if(pop> 100 && pop < 300){
          this.presentAlert("Caution!", "You are enterning an Orange Zone! Please take the proper precautions!")
        }
        else if(pop >= 300){
          this.presentAlert("WARNING!", "You are enterning a hotspot! Please take the proper precautions!")
        }
      else if(pop <=100){
        this.presentAlert("Green!", "You're entering a green zone! Remember to wear your mask :)")
      }
    })
  })
}

  colorExposure(){ //Colors the Cards according to Exposure Risk Level
      var classList = document.getElementsByClassName("card")
      for(var x = 0; x <classList.length; x++){
        var childs = (classList[x].childNodes)[0].childNodes
        var num : number =+(childs[2].textContent.split(" "))[2]
        if(num > 100 && num < 300){
          classList[x].setAttribute("style", "background-color: orange")
          childs[3].textContent = "Exposure Risk: Orange"}

        else if(num >= 300){
          classList[x].setAttribute("style", "background-color: red")
          childs[3].textContent = "Exposure Risk: Red"}

        else{
          classList[x].setAttribute("style", "background-color: green")
          childs[3].textContent = "Exposure Risk: Green"}
}}

getLast(){ // get's the user's last known position and sets local user lat long variables
var data;
return new Promise((resolve) =>{
  this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
    data = dat;
    this.timestamp  = this.datePipe.transform(data.objectState.timestamp, 'short');
    this.long = data.objectState.geometry.coordinates[0]
    this.lat = data.objectState.geometry.coordinates[1]
    resolve()
  })
});}

checkIn(){ //checks user into a building and out of the last building
  this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
    this.infos = dat;
  var d_2 = new Date(this.infos.objectState.timestamp)
  var last = d_2.toISOString().substring(0, d_2.toISOString().length - 5)
  d_2.setHours(d_2.getHours() + 10)
  var range= d_2.toISOString().substring(0, d_2.toISOString().length - 5)

  //Get's User's last Fence Transition and subtracts 1 from populationcount
  this.mapService.getObjectTransitions(this.object_id, last, range ).subscribe(async info =>{
    this.data = info
    var fence = this.data.transitions.features[0].fenceId
    this.db = firebase.firestore();
    const fenceRef = this.db.collection('valpo_fences').doc(fence);
    const doc = await fenceRef.get();
    const val = doc.data()
    var pop = val.population -1
    this.firestoreService.updateFence("valpo_fences", fence, this.timestamp, pop)
  })
})

//Sets object position for location history
this.mapService.setObjectPosition(this.object_id ,this.long,this.lat).subscribe(data =>{
console.log("User Position Set!")
})

//Posts User Position for Fence Transitions and adds 1 to the population count
this.mapService.postObjectReport(this.object_id,this.long,this.lat).subscribe(async da =>{
  this.current_fence = da
  var id = this.current_fence.inside.features[0].id
  this.db = firebase.firestore();
  const fenceRef = this.db.collection('valpo_fences').doc(id);
  const doc = await fenceRef.get();
  const val = doc.data()
  var pop = val.population +1
  this.firestoreService.updateFence("valpo_fences", id, this.date, pop)
  console.log("User Position Posted!")
})
this.getLast()
this.hotspotDetection()
}

  ngOnInit() {
    let that = this
    //variables set to update user location thorugh background location services. Disabled for demo
    // this.long =  this.loc.lng;
    // this.lat = this.loc.lat;


    //displays fence values from a seperate database to insure user always has the last fence values if there was a disconnect with API
    this.fenceList = this.firestoreService.getAllFences("valpo_fences").valueChanges()


    //Sets up preemptive fence + user values
    this.movePositions()
    this.getCount()
    this.move() //Without manual refresh, it simulates moving students every 5 minutes

    this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
      this.data = dat;
      this.timestamp  = this.datePipe.transform(this.data.objectState.timestamp, 'short');
 });
    //Creates Map, user marker, and the marker for the fences (buildings)
    var center =[-87.0422993571512, 41.463217639900876]
    this.map = tt.map({
      key: 'xhSLlv6eLXVggB5hbMeTK87voMmu2LV3',
      container: 'map',
      style: 'tomtom://vector/1/basic-main',
      center: center,
      zoom: 15,
      minZoom: 15,
    });

    //creates building markers
    for(var x=0; x < this.positions.length; x++){
      const el = document.createElement('div');
      el.innerHTML = "<img src='assets/img/user.png' style='width: 45px; height: 45px; border-radius: 15px;'>";
      var marker = new tt.Marker({element: el}).setLngLat(this.positions[x]).setPopup(new tt.Popup({offset: 30}).setText(this.pos_names[x]))
      marker.addTo(this.map)
      }

    //creates user marker usnig User's Last Know Position
    const el = document.createElement('div');
    el.innerHTML = "<img src='assets/img/pin.png' style='width: 45px; height: 45px; border-radius: 15px;'>";
    this.getLast().then(() =>{
      var userMarker =  new tt.Marker({element: el, draggable: true}).setLngLat([this.long, this.lat]).setPopup(new tt.Popup({offset: 30}).setText("Drag to Check in")).addTo(this.map)
     
      //sets the users new location based on end drag location
      userMarker.on('dragend',function(){
        that.long = userMarker.getLngLat().lng
        that.lat = userMarker.getLngLat().lat
            });})
 }

}