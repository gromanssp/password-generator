import { Injectable, inject } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    this.title.setTitle(this.formatTitle(title));
  }

  formatTitle(routeTitle: string | undefined | null): string {
    return routeTitle
      ? `${routeTitle} | SecureGen — Password Security Platform`
      : 'SecureGen — Password Security Platform';
  }
}
