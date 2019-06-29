import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore

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
    return this.db.list('usuario').snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
  }

  save(usuario: Usuario) {
    return this.db.list("usuario").push(usuario)
    // .then(
    //   res => {
    //     cliente.id = res.key;
    //     res.set(cliente);
    //   }
    // );
  }

  remove(key) {
    return this.db.list("usuario").remove(key);
  }

  update(key, usuario: Usuario) {
    return this.db.list("usuario").update(key, usuario);
  }

  get(key) {
    return this.db.object<Usuario>("usuario/" + key).valueChanges();
  }

  saveAuth(usuario: Usuario) {
    this.afAuth.auth.createUserWithEmailAndPassword(usuario.email,usuario.pws);
  }
 
  AddUser(uid: string, usuario) {
    return this.afs.collection('usuario').doc(uid).set(usuario);
  }

  getUser(uid: string) {
    return this.afs.collection<Usuario>('usuario').doc(uid).valueChanges();
  }
  editUser(uid: string, usuario) {
    return this.afs.doc('usuario/' + uid).update(usuario);
  }
}
