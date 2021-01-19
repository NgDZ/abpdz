import { Type } from '@angular/core';
import { ApplicationConfiguration } from './application-configuration';
import { ABP } from './common';
export declare class AuthConfig {
  skipIssuerCheck?: boolean;
  issuer?: string;
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  tokenUrl?: string;
  loginUrl?: string;
}

// tslint:disable-next-line: no-namespace
export namespace Config {
  export type State = ApplicationConfiguration.Response &
    ABP.Root & { environment: Environment };

  export interface Environment {
    apis: Apis;
    application: Application;
    idleTime?: number;
    hmr?: boolean;
    test?: boolean;
    localization?: { defaultResourceName?: string };
    oAuthConfig: AuthConfig;
    production: boolean;
    remoteEnv?: RemoteEnv;

    notifications?: {
      useSignalr?: boolean;
      signalrUrl?: string;
      notificationUrl?: string;
    };
  }

  export interface Application {
    name: string;
    display?: string;
    abrivation?: string;
    baseUrl?: string;
    logoUrl?: string;
  }

  export type ApiConfig = {
    [key: string]: string;
    url: string;
  } & Partial<{
    rootNamespace: string;
  }>;

  export interface Apis {
    [key: string]: ApiConfig;
    default: ApiConfig;
  }

  export interface Requirements {
    layouts: Type<any>[];
  }

  export interface LocalizationWithDefault {
    key: string;
    defaultValue: string;
  }

  export type LocalizationParam = string | LocalizationWithDefault;
  export type customMergeFn = (
    localEnv: Partial<Config.Environment>,
    remoteEnv: any
  ) => Config.Environment;

  export interface RemoteEnv {
    url: string;
    mergeStrategy: 'deepmerge' | 'overwrite' | customMergeFn;
    method?: string;
    headers?: ABP.Dictionary<string>;
  }
}
