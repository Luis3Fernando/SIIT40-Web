import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarItem } from '../sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, SidebarItem],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  logoPath = 'assets/icons/logo.png';
  username = 'Luis Chumbes';
  email = 'admin@sysari.com';
}