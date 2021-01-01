import { createAction, props } from '@ngrx/store';
import { Config } from '../models';
import { ApplicationConfiguration } from '../models/application-configuration';
export const startLoadingAbpApplicationData = createAction(
  '[abp] start loading Abp Application Data'
);
export const setAbpApplicationData = createAction(
  '[abp] Set Abp Application Data',
  props<{ data: ApplicationConfiguration.Response }>()
);
export const setMenuAction = createAction(
  '[abp] Set menu',
  props<{ data: any }>()
);

export const addMenuAction = createAction(
  '[abp] Add menu items',
  props<{ data: any }>()
);

export const removeMenuAction = createAction(
  '[abp] Remove menu',
  props<{ data: any }>()
);

export const setFuseAction = createAction(
  '[abp] setFuse',
  props<{ data: any }>()
);
export const setEnvirement = createAction(
  '[abp] set Envirement',
  props<{ data: Config.Environment }>()
);

export const RestOccurError = createAction(
  '[API] rest error occured',
  props<{ data: any }>()
);
export const setLanguage = createAction(
  '[Abp] set language',
  props<{ culture: any }>()
);

export const updateCurrentUser = createAction(
  '[Abp] Update current user',
  props<{ data: any }>()
);

export const setExtraLocalization = createAction(
  '[Abp] set Extra Localization',
  props<{ data: any }>()
);

export const setProfile = createAction(
  '[Abp] set profile',
  props<{ data: any }>()
);
