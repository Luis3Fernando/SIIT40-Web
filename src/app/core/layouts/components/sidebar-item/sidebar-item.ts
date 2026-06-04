import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar-item',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-item.html',
})
export class SidebarItem {
  @Input() route: string = '';
  @Input() label: string = '';
  @Input() badge?: number;
  @Input() isCollapsed: boolean = false;
}