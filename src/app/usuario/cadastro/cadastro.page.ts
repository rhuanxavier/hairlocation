import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  private usuario: Usuario;
  private uid = null;
  private pws: string;

  private user: Observable<firebase.User>;


  constructor(
    
    public alertController: AlertController,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private googlePlus: GooglePlus,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.usuario = new Usuario;
    this.uid = this.activeRouter.snapshot.paramMap.get("id");
    if (this.uid != null) {
      this.edit(this.uid);
    } else {
      this.uid = null;
    }
  }


  onSubmit(form) {
    if (this.uid == null) {
      this.usuarioService.save(this.usuario)
        .then(
          res => {
            this.presentAlert("Aviso", this.usuario.nome + ". Já tá salvo!");
            this.usuarioService.saveAuth(this.usuario);
            form.reset();
            this.usuario = new Usuario;
            this.router.navigate(['/home']);
          },
          err => {
            this.presentAlert("Erro!!!", "Ops!! Deu erro ao salvar!" + err);
          }
        )
    } else {
      this.usuarioService.update(this.uid, this.usuario)
        .then(
          res => {
            this.uid = null;
            this.presentAlert("Aviso", this.usuario.nome + ". Foi atualizado!");
            form.reset();
            this.usuario = new Usuario;
            this.router.navigate(['/home']);
          },
          err => {
            this.presentAlert("Erro!!!", "Ops!! Deu erro na atualização!" + err);
          }
        );
    }
  }


  edit(key) {
    this.usuarioService.get(key)
      .subscribe(
        res => {
          this.usuario = res;
          //console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }


  //Alertas ----------------------------------------------
  async presentAlert(titulo: string, texto: string) {
    const alert = await this.alertController.create({
      header: titulo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }

}