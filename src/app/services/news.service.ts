import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'
const API_URL = environment.news_apiUrl;
const API_KEY = environment.news_apiKey;
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getData(url){
    return this.http.get(`${API_URL}/${url}&apiKey=${API_KEY}`);
  }
}
