import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarItem } from '../sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  logoPath = 'assets/icons/logo.png';

  menuItems = [
    { route: '/dashboard/home', label: 'Inicio / Resumen' },
    { route: '/dashboard/about', label: 'Acerca de' },
    { route: '/dashboard/contact', label: 'Soporte / Contacto' },
  ];
}
