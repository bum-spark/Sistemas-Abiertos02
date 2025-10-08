import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
    {
        path: 'navbar',
        component: NavbarComponent
    },
    {
        path: '**',
        redirectTo: 'navbar'
    }
];
