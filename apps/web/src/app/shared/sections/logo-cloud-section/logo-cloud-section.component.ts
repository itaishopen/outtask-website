import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { LogoCloudSectionConfig } from '../../models/api.models';

@Component({
  selector: 'app-logo-cloud-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './logo-cloud-section.component.html',
  styleUrl: './logo-cloud-section.component.scss',
})
export class LogoCloudSectionComponent {
  readonly config = input.required<LogoCloudSectionConfig>();
}
