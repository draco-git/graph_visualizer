import { Injectable } from '@angular/core';
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getNodesByLabel () {
    return axios.get(
      'https://faux-api.com/api/v1/getnodebylabel_4821682262955632/1'
    );
  }
}
