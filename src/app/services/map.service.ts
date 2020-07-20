import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';
const API_URL = 'https://api.tomtom.com';
const API_KEY = 'xhSLlv6eLXVggB5hbMeTK87voMmu2LV3'
const PROJECT_ID = 'c669e2a6-bb95-4986-8341-b8f4312adb51';
const ADMIN_KEY = '2dhUQXB09HvX7UlNWZ8M41NHyGwIiV5mGcmGFPQ0TvWcvUkJ'

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient, private firestoreService: FirestoreService) { }

  changePositions(objList, posList){
    var num = posList.length
    for(var x =0; x < objList.length; x++){
      var rando = Math.floor(Math.random()* Math.floor(num))
      if(objList[x].id != "29017b68-dc6f-431c-aaaa-09e81400d956"){
        console.log(objList[x].id)
        console.log(posList[rando][0], posList[rando][1])
       this.setObjectPosition(objList[x].id,posList[rando][0], posList[rando][1]).subscribe(data =>{
         console.log("Position Set")
       })
       console.log(posList[rando][0], posList[rando][1])
        this.postObjectReport(objList[x].id,posList[rando][0], posList[rando][1]).subscribe(data =>{
          console.log("Position Posted")
         })
      }
    }
    };
  
  getObjects(){
    return this.http.get(`https://api.tomtom.com/geofencing/1/objects?key=${API_KEY}`)
  }

  setObjectPosition(object_id, long, lat){ // sets the user position for location history + hotspot
    var data = `{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          ${long},
          ${lat}
        ]
      },
      "object": "${object_id}"
    }`
    const headers = { 'Content-type': 'application/json'}  
    const body=JSON.parse(data);

    
    return this.http.post(`https://api.tomtom.com/locationHistory/1/history/positions?key=${API_KEY}`, body,{'headers':headers})
  }

  postObjectReport(object_id, long, lat){
    var data = `{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          ${long},
          ${lat}
        ]
      }
    }`
    const body=JSON.parse(data);
    return this.http.post(`https://api.tomtom.com/geofencing/1/report/${PROJECT_ID}?key=${API_KEY}&point=${long},${lat},0.0&object=${object_id}`, body)

  }

  createObject(user_uid, date){ //create a new object under current user id
    var data = `{
      "name": "location_object",
      "properties": {
        "user": "${user_uid}",
        "creationTime": "${date}"
       }
    }`
    const headers = { 'Content-type': 'application/json'}  
    const body=JSON.parse(data);
    return this.http.post(`https://api.tomtom.com/locationHistory/1/objects/object?key=${API_KEY}&adminKey=${ADMIN_KEY}`, body,{'headers':headers})
  }

  deleteObject(object_id){ //delete object and all of it's data as well as connection to user
    this.http.delete(`https://api.tomtom.com/locationHistory/1/objects/${object_id}?key=${API_KEY}&adminKey=${ADMIN_KEY}`)
  }
  getObjectLastPosition(object_id){ //gets the last known position of user
    return this.http.get(`https://api.tomtom.com/locationHistory/1/history/position/${object_id}?key=${API_KEY}`);
  }
  getLocationHistory(object_id,previous, current){ //gets the location history for 2 weeks for user
    return this.http.get(`https://api.tomtom.com/locationHistory/1/history/positions/${object_id}?key=${API_KEY}&from${previous}=&to=${current}`);
  }

  getFenceHeadCount(fence_id,previous,current){ // gets a headcount of how many objects are in the fence
    var sum = 0;
    var transList;
    var time;
    var population: Array<any>= [];
    return this.getFenceTransitions(fence_id, previous,current).pipe(map((res: Response) =>{
      transList = res
      transList.transitions.features.map(item =>{
        population.push(item.transitionType)
        var add = 0;
        var sub = 0;
       for(var x = 0; x <population.length; x++){
          if(population[x] == "ENTER"){
            add++;
          }
        else if (population[x] == "EXIT"){
          sub++;
        }}
       //adds a randomized factor for demo uses only
       var rando = Math.floor(Math.random()* Math.floor(50))
       add = add*rando
       sum = add - sub
       if(sum < 0){
         sum = sum + 100
       }
       /////////////////////////////////////////

       time = item.recordedTransitionTime
      })
      this.firestoreService.updateFence("valpo_fences", fence_id,current, sum)
      return sum
    }))
}
  getFences(){
    return this.http.get(`https://api.tomtom.com/geofencing/1/projects/${PROJECT_ID}/fences?key=${API_KEY}`)
  }
  getFenceTransitions(fence_id, previous, current){
    return this.http.get(`https://api.tomtom.com/geofencing/1/transitions/fences/${fence_id}?key=${API_KEY}&from=${previous}&to=${current}`)
  }
}
