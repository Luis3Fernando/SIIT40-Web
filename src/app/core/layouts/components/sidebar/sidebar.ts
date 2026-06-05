import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarItem } from '../sidebar-item/sidebar-item';
import { Modal } from '../../../../shared/components/modal/modal';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, SidebarItem, Modal],
  templateUrl: './sidebar.html',})
export class Sidebar {
  logoPath = 'assets/icons/logo.png';
  isCollapsed = false;
  isLogoutModalOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  get currentUser() {
    return this.authService.currentUser();
  }

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
    this.authService.clearTokens();
    this.router.navigate(['/']);
  }
}