import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {

  constructor(private httpClient: HttpClient) { 

  }

  GET(apiURL: any){
    return this.httpClient.get(apiURL);
  }

  POST(apiURL: any, reqObj: any){
    return this.httpClient.post(apiURL, reqObj);
  }

  
  
}
