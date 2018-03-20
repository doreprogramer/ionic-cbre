import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsersPage } from '../users/users';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {
lista:any[]=[];

  constructor(public navCtrl: NavController) {
    this.lista.push({
      name: 'nicolas'
    });
    this.lista.push({
      name: 'nicolas 1'
    });
    this.lista.push({
      name: 'nicolas 2'
    });
  }
  goToUsersPage(){
    this.navCtrl.push( UsersPage );
  }
}
