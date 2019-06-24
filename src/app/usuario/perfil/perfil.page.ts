import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private usuario: Usuario;
  private uid: string = null;

  constructor(
    private usuarioService: UsuarioService,
    private activeRouter: ActivatedRoute,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usuario = new Usuario;
    this.uid = this.activeRouter.snapshot.paramMap.get("ID");
    if (this.uid) {
      this.usuarioService.get(this.uid)
        .subscribe(
          res => {
            this.usuario = res;
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}