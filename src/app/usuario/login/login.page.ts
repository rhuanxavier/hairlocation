import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private uid: string;
  private email: string;
  private pws: string;

  private user: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private router: Router,
    private googlePlus: GooglePlus,
    private platform: Platform
  ) {
    this.user = this.afAuth.authState
  }

  ngOnInit() {
  }

  onSubmit(form) {
    //console.log(form);
    this.login();
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.pws)
      .then(
        res => {
          //console.log(res);
          //this.uid = res.user.uid;
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
          this.presentAlert("Opss!", "Usuário não encontrado!");
        }
      ).catch(
        erros => {
          this.presentAlert("Erro no Sistema!", "Não foi possivel conectar!");
        }
      )
  }

  logout() {
    //this.uid = null;
    this.usuarioService.logout();
  }

  addUser() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.pws)
      .then(
        ok => {
          this.presentAlert("OK!", "Usuário cadastrado!");
        },
        err => {
          this.presentAlert("Opss!", "E-mail ou senhas invalidas para autenticação! Tente novamente.");
        }
      )
  }

  loginG3() {
    this.googlePlus.login({})
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  async loginG() {
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': 'webClientId.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(
        user => {
          console.log(user)
        },
        err => {
          console.log(err)
        }
      );
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  loginG2() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(
        res => {
          console.log(res);
          //this.uid = res.user.uid;
          this.router.navigate(['/']);
        }
      );
  }

  //----------------------------------------------
  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<any> {
    try {
      const googlePlus = await this.googlePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': 'webClientId.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(googlePlus.idToken)
      )
    } catch (err) {
      console.log(err);
    }
  }


  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credencial = await this.afAuth.auth.signInWithPopup(provider);
    } catch (err) {
      console.log(err);
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.googlePlus.logout();
    }
  }

  //Alerts---------------------------------
  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }
}
