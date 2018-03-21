import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { arPage } from '../pages/ar/ar';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { CameraPage } from '../pages/camera/camera';
import { UsersPage } from '../pages/users/users';
import { ListsPage } from '../pages/lists/lists';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    arPage,
    ContactPage,
    HomePage,
    ListsPage,
    UsersPage,
    TabsPage,
    CameraPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    arPage,
    ContactPage,
    HomePage,
    UsersPage,
    ListsPage,
    TabsPage,
    CameraPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
