import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  API_URL = 'https://gnews.io/api/v3/search?q='
  API_KEY = 'efe041c70fc4d988c25e7357166cb21e'
  constructor(private http: HttpClient) { }

  //API gets back 10 news articles and allows 100 requests a day
  getData(date){ //gets the news articles '${this.API_URL)covid-19&token=${this.API_KEY}'
    return this.http.get(this.API_URL + "covid-19&mindate=" + date + "&image=required&token="+ this.API_KEY);
  }
}
