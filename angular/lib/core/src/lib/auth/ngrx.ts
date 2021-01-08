import { createAction, props } from '@ngrx/store';
import { AuthTokenModel } from './tokens';

export const readOldToken = createAction('[Auth] Read old token');

export const refreshTokenFirstTimeStart = createAction(
  '[Auth] Refresh Token First Time'
);
export const refreshTokenFirstTimeEnd = createAction(
  '[Auth] Refresh Token First Time end'
);
export const newUserToken = createAction(
  '[Auth] New User Token',
  props<{ token: AuthTokenModel; text?: string }>()
);
