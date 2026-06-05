import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarItem } from '../sidebar-item/sidebar-item';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-sidebar',
  imports: [ NgClass, SidebarItem, Modal],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  logoPath = 'assets/icons/logo.png';
  username = 'Luis Chumbes';
  email = 'admin@sysari.com';
  isCollapsed = false;
  isLogoutModalOpen = false;

  constructor(private router: Router) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  openLogoutModal() {
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal() {
    this.isLogoutModalOpen = false;
  }

  confirmLogout() {
    this.closeLogoutModal();
    this.router.navigate(['/']);
  }
}