import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.validar();
  }

  public validar(): Usuario {
    this.usuario = new Usuario;

    this.usuario.foto = "assets/user.jpg";
    this.usuario.nome = "Usuário";

    this.afAuth.user.subscribe(
      res => {
        if (res) {
          this.usuario.uid = res.uid;
          this.usuario.nome = res.displayName;
          this.usuario.email = res.email;
          this.usuario.foto = res.photoURL;
          this.usuario.ativo = res.emailVerified;
          this.usuario.pws = null;
        }
      }
    );
    return this.usuario;
  }

  public logout(): Usuario {
    this.afAuth.auth.signOut();

    this.usuario = new Usuario;

    this.usuario.foto = "assets/user.jpg";
    this.usuario.nome = "Usuário";

    this.router.navigate(['/']);
    return this.usuario;
  }

  getAll() {
    return this.db.list('clientes').snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
  }

  save(cliente: Usuario) {
    return this.db.list("clientes").push(cliente)
    // .then(
    //   res => {
    //     cliente.id = res.key;
    //     res.set(cliente);
    //   }
    // );
  }

  remove(key) {
    return this.db.list("clientes").remove(key);
  }

  update(key, cliente: Usuario) {
    return this.db.list("clientes").update(key, cliente);
  }

  get(key) {
    return this.db.object<Usuario>("clientes/" + key).valueChanges();
  }

  saveAuth(cliente: Usuario) {
    this.afAuth.auth.createUserWithEmailAndPassword(cliente.email, cliente.pws);
  }
  
}
