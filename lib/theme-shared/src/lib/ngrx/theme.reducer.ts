import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { setLayoutSize, setThemeConfig } from './theme.actions';

export const themeFeatureKey = 'theme';
export interface ThemeState {
  breakpoints?: {
    Small?: boolean;
    Large?: boolean;
    Medium?: boolean;
    XLarge?: boolean;
    XSmall?: boolean;
  };
  menu?: boolean;
  code?: boolean;
  state?: any;
  config?: any;
  themeConfig?: any;
}
export const initialLaoutState: ThemeState = {
  breakpoints: {},
  menu: true,
  config: {},
  state: {},
  theme: {},
} as any;

const _themeReducer = createReducer(
  initialLaoutState,
  on(setLayoutSize, (state, action) => ({
    ...state,
    breakpoints: action.payloadType,
  })),

  on(setThemeConfig, (state, action) => ({
    ...state,
    themeConfig: action.data,
  }))
);

export function themeReducer(state, action) {
  return _themeReducer(state, action);
}
export const selectTheme = createFeatureSelector<any, ThemeState>(
  themeFeatureKey
);

export const selectBreakPoints = createSelector(
  selectTheme,
  (k) => k.breakpoints
);
export const selectConfig = createSelector(selectTheme, (k) => k.config);

export const selectMenu = createSelector(selectTheme, (k) => k.menu);
