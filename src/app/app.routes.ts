import { Routes } from '@angular/router';
import { NavbarComponent } from './gifs/pages/navbar/navbar.component';


export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page.component'),
        children: [
            {
                path:'search',
                loadComponent: () => import('./gifs/pages/search-page/search-page.component')
            },
            {
                path: 'trending',
                loadComponent: () => import('./gifs/pages/trending-page/trending-page.component')
            },
            {
                path: '**',
                redirectTo: 'search'
            }
            
        ]
    },
    /*{
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page.component')
    },
    {
        path:'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page.component')
    },
    {
        path: 'navbar',
        component: NavbarComponent
    },*/
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
