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


  public usuario: Usuario;
  private uid: string = null;
  private loading: any;
  public verdade: any = true;


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
    this.afa.user.subscribe((id => {
      this.usuarioService.getUser(id.uid).subscribe(
        res => {
          this.usuario = res[0];
          this.usuario.uid = id.uid;
        });
    }));

  }



  onChanged(event: any) {
    this.verdade = event.detail.checked;
    if (this.verdade === true) {
      this.ngOnInit();
    }
  }

  async editUser() {
    try {
      await this.usuarioService.editUser(this.usuario.uid, this.usuario);
      this.verdade = true;
      this.presentToast("Dados atualizados com sucesso!");
      this.router.navigate(["home"]);
    } catch (error) {
      console.error(error);
    }
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000 });
    toast.present();
  }
}