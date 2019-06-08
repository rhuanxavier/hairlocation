import { Injectable } from '@angular/core';
import { Barbearia } from './barbearia';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class BarbeariaService {

  public barbearia: Barbearia;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.validar();
  }

  public validar(): Barbearia {
    this.barbearia = new Barbearia;

    this.barbearia.foto = "assets/user.jpg";
    this.barbearia.nome = "Barbearia";

    this.afAuth.user.subscribe(
      res => {
        if (res) {
          this.barbearia.uid = res.uid;
          this.barbearia.nome = res.displayName;
          this.barbearia.email = res.email;
          this.barbearia.foto = res.photoURL;
          this.barbearia.ativo = res.emailVerified;
          this.barbearia.pws = null;
        }
      }
    );
    return this.barbearia;
  }

  public logout(): Barbearia {
    this.afAuth.auth.signOut();

    this.barbearia = new Barbearia;

    this.barbearia.foto = "assets/user.jpg";
    this.barbearia.nome = "Barbearia";

    this.router.navigate(['/']);
    return this.barbearia;
  }

  getAll() {
    return this.db.list('barbearia').snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
  }

  save(barbearia: Barbearia) {
    return this.db.list("barbearia").push(barbearia)
    // .then(
    //   res => {
    //     cliente.id = res.key;
    //     res.set(cliente);
    //   }
    // );
  }

  remove(key) {
    return this.db.list("barbearia").remove(key);
  }

  update(key, barbearia: Barbearia) {
    return this.db.list("barbearia").update(key, barbearia);
  }

  get(key) {
    return this.db.object<Barbearia>("barbearia/" + key).valueChanges();
  }

  saveAuth(barbearia: Barbearia) {
    this.afAuth.auth.createUserWithEmailAndPassword(barbearia.email, barbearia.pws);
  }
  
}
