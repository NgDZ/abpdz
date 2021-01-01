import { createAction, props } from '@ngrx/store';

export const setLayoutSize = createAction(
  '[theme] set Layout Size',
  props<{ payloadType }>()
);

export const setThemeConfig = createAction(
  '[theme] set Theme Config',
  props<{ data: any }>()
);
