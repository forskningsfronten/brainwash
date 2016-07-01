import {
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS, TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
}                               from '@angular/platform-browser-dynamic/testing';
import { setBaseTestProviders } from '@angular/core/testing';
import { beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { MyApp } from './app';
import { StartPage } from './pages/start-page/start-page';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

let myApp: MyApp = null;

class MockClass {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public close(): any {
    return true;
  }

  public setRoot(): any {
    return true;
  }
}

describe('BRAINWASH', () => {

  beforeEach(() => {
    let mockClass: any = (<any>new MockClass());
    myApp = new MyApp(mockClass);
  });

  it('initialises with a root page', () => {
    expect(myApp['rootPage']).not.toBe(null);
  });

  it('first rootPage is StartPage', () => {
    expect(myApp['rootPage']).toBe(StartPage);
  });

  it('initialises with an app', () => {
    expect(myApp['app']).not.toBe(null);
  });
});
