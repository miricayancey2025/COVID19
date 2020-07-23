import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { MapService } from '../../services/map.service';
import { LocationTrackerService} from '../../services/location-tracker.service'
import { DatePipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';



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

  //time/date variables
  timestamp;
  interval;
  previous;
  current;
  timeLeft: number = 30
  today = new Date();
  date =this.datePipe.transform(this.today, 'short');

  
  //list variables (object list pertains to the "student" objects and fence list pertains to the buildings)
  objList;
  fenceList;
  fence_inside;


  //map variables
  map: any;
  lat = -87.044086
  long = 41.462898
  positions = [
    [-87.042634, 41.464394],  //Union    
    [-87.040241, 41.464114], //VUCA
    [-87.044086,41.462898], //Library
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

  move() { //sets a timer that automatically moves objects through fences and updates fence transitions. Every 30 seconds for demo purposes
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.movePositions()
        this.timeLeft = 30;
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
    this.getCount()
    this.presentAlert("Page Refreshed", "Page has been Refreshed!")
  }

  getObjects() { //gets all the objects from the mapService
      return new Promise((resolve) =>{
        this.mapService.getObjects().subscribe(obj =>{
          this.objList = obj;
           this.objList = Object.keys(this.objList).map(it => this.objList[it])
           this.objList = this.objList[0]
           //console.log(this.objList)
           resolve()
          })})}

  movePositions(){ //gets all objects and calls a random position change
        this.getObjects().then(() =>{
        this.mapService.changePositions(this.objList, this.positions)
      })}

    checkIn(){ //checks in user's current position and updates last pin value + gets current population
      console.log(this.long, this.lat)
      this.mapService.setObjectPosition(this.object_id ,this.long,this.lat).subscribe(data =>{
      console.log("User Position Set!")
    })
     this.mapService.postObjectReport(this.object_id,this.long,this.lat).subscribe(data =>{
       console.log("User Position Posted!")
      })
      this.presentAlert("You have checked in!", "You have checked in! Remember to wear your mask :)")
      this.getCount() // change to false
      this.getLast()
      this.hotspotDetection()
    }

  hotspotDetection(){ //gets the current population of the fence the user is in gives orange or red warning
    this.mapService.getObjectReport(this.object_id, this.long, this.lat).subscribe(data =>{
      var ins: any = data
      var id = ins.inside.features[0].id
      this.firestoreService.getDetail("valpo_fences", id).valueChanges().subscribe(res =>{
        this.fence_inside = res
        console.log(this.fence_inside.name)
        var pop = this.fence_inside.population
        if(pop> 100 && pop < 300){
          this.presentAlert("Caution!", "You are enterning an Orange Zone! Please take the proper precautions!")
        }
        else if(pop >= 300){
          this.presentAlert("WARNING!", "You are enterning a hotspot! Please take the proper precautions!")
        }})})}


    getLast(){ // get's the user's last known position
    var data;
      this.mapService.getObjectLastPosition("29017b68-dc6f-431c-aaaa-09e81400d956").subscribe(dat => {
        data = dat;
        this.timestamp  = this.datePipe.transform(data.objectState.timestamp, 'short');
   });}

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

setLongLat(longo, lato){
  this.long = longo
  this.lat = lato
  console.log(this.long, this.lat)
}

  ngOnInit() {
    
    //variables set to update user location thorugh background location services. Disabled for demo
    // this.long =  this.loc.lng;
    // this.lat = this.loc.lat;


    //displays fence values from a seperate database to insure user always has the last fence values if there was a disconnect with API
    this.fenceList = this.firestoreService.getAllFences("valpo_fences").valueChanges()


    //Sets up preemptive fence + user values
    this.movePositions()
    //this.move()

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
    //creates user marker
    const el = document.createElement('div');
    el.innerHTML = "<img src='assets/img/pin.png' style='width: 45px; height: 45px; border-radius: 15px;'>";
    var userMarker =  new tt.Marker({element: el, draggable: true}).setLngLat([-87.04294308731171, 41.46308899999883]).setPopup(new tt.Popup({offset: 30}).setText("Drag to Check in")).addTo(this.map)
    var ll;
    console.log("Pre Drag", userMarker.getLngLat())
    
    //sets the users new location based on end drag location
   userMarker.on('dragend',function(){
      var pos = userMarker.getLngLat();
      this.setLongLat(pos.lng, pos.lat)
        });
 }

}