import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: '', loadChildren: './usuario/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './usuario/login/login.module#LoginPageModule' },
  { path: 'perfil', loadChildren: './usuario/perfil/perfil.module#PerfilPageModule' },
  { path: 'cadastro', loadChildren: './usuario/cadastro/cadastro.module#CadastroPageModule' },
  { path: 'cadastrobarbeiro', loadChildren: './barbeiro/cadastro/cadastro.module#CadastroPageModule' },
  { path: 'loginbarbeiro', loadChildren: './barbeiro/login/login.module#LoginPageModule' },
  { path: 'perfilbarbeiro', loadChildren: './barbeiro/perfil/perfil.module#PerfilPageModule' },
  { path: 'mapa', loadChildren: './mapa/mapa.module#MapaPageModule' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
