import { Component } from '@angular/core';

import { arPage } from '../ar/ar';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CameraPage } from '../camera/camera';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = arPage;
  tab3Root = ContactPage;
  tab4Root = CameraPage;

  constructor() {

  }
}
