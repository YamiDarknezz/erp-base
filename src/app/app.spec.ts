import { describe, it, expect } from 'vitest';
import { renderApplication } from '@angular/platform-browser';
import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  it('should create the app', async () => {
    const html = await renderApplication(App, {
      ...appConfig,
      document: '<app-root></app-root>',
    });
    expect(html).toContain('app-root');
  });
});
