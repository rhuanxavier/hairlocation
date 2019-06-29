import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CanActivate } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';


import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


// const adminOnly = hasCustomClaim('admin');
// const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
// const redirectLoggedInToItems = redirectLoggedInTo(['items']);
// const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

const routes: Routes = [
  {
    path: '',
    component: MapaPage,
    canActivate: [AngularFireAuthGuard] ,
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MapaPage]
})
export class MapaPageModule { }