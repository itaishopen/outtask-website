import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

interface NavLink {
  label: string;
  href?: string;
  children?: NavLink[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  readonly isScrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly servicesOpen = signal(false);

  readonly navLinks: NavLink[] = [
    {
      label: 'Services',
      children: [
        { label: 'IT Staffing', href: '/en/services/staffing' },
        { label: 'Nearshoring', href: '/en/services/nearshoring' },
      ],
    },
    { label: 'Working at Outtask', href: '/en/working-at-outtask' },
    { label: 'Expats', href: '/en/expats' },
    { label: 'Happy People', href: '/en/happy-people' },
    { label: 'Hire a Developer', href: '/en/hire-a-developer' },
    { label: 'Vacancies', href: '/en/vacancies' },
    { label: 'Blog', href: '/en/blog' },
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 10);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
    if (!this.mobileOpen()) {
      this.servicesOpen.set(false);
    }
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.servicesOpen.set(false);
  }

  toggleServices(event: Event): void {
    event.preventDefault();
    this.servicesOpen.update((v) => !v);
  }
}
