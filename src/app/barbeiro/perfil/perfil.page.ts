import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Barbearia } from '../barbearia';
import { BarbeariaService } from '../barbearia.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private barbearia: Barbearia;
  private uid: string = null;

  constructor(
    private barbeariaService: BarbeariaService,
    private activeRouter: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.barbearia = new Barbearia;
    this.uid = this.activeRouter.snapshot.paramMap.get("ID");
    if (this.uid) {
      this.barbeariaService.get(this.uid)
        .subscribe(
          res => {
            this.barbearia = res;
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}