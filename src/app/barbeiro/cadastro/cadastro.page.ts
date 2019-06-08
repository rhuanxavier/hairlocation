import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Barbearia } from '../barbearia';
import { BarbeariaService } from '../barbearia.service';
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

  private barbearia: Barbearia;
  private uid = null;
  private pws: string;

  private user: Observable<firebase.User>;


  constructor(
    
    public alertController: AlertController,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private barbeariaService: BarbeariaService,
    private googlePlus: GooglePlus,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.barbearia = new Barbearia;
    this.uid = this.activeRouter.snapshot.paramMap.get("id");
    if (this.uid != null) {
      this.edit(this.uid);
    } else {
      this.uid = null;
    }
  }


  onSubmit(form) {
    if (this.uid == null) {
      this.barbeariaService.save(this.barbearia)
        .then(
          res => {
            this.presentAlert("Aviso", this.barbearia.nome + ". Já tá salvo!");
            this.barbeariaService.saveAuth(this.barbearia);
            form.reset();
            this.barbearia = new Barbearia;
            this.router.navigate(['/home']);
          },
          err => {
            this.presentAlert("Erro!!!", "Ops!! Deu erro ao salvar!" + err);
          }
        )
    } else {
      this.barbeariaService.update(this.uid, this.barbearia)
        .then(
          res => {
            this.uid = null;
            this.presentAlert("Aviso", this.barbearia.nome + ". Foi atualizado!");
            form.reset();
            this.barbearia = new Barbearia;
            this.router.navigate(['/home']);
          },
          err => {
            this.presentAlert("Erro!!!", "Ops!! Deu erro na atualização!" + err);
          }
        );
    }
  }


  edit(key) {
    this.barbeariaService.get(key)
      .subscribe(
        res => {
          this.barbearia = res;
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