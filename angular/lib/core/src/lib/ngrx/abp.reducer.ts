import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Config } from '../models/config';
import { ApplicationConfiguration } from '../models/application-configuration';
import {
  setAbpApplicationData,
  setFuseAction,
  setMenuAction,
  setEnvirement,
  setExtraLocalization,
  startLoadingAbpApplicationData,
  addMenuAction,
  updateCurrentUser,
} from './abp.actions';
import { ABP } from '../models/common';
import { CheckPolicy } from '../utils';
import { eLayoutType } from '../enums';
import { sortBy } from 'lodash-es';
export const abpFeatureKey = 'abp';
export interface AbpState {
  ready: boolean;
  fuse: any;
  menu: ABP.Nav[];
  conf: ApplicationConfiguration.Response;
  environment: Config.Environment;
  extraLocalization: any;
}
export const initialState: AbpState = {
  ready: false,
  fuse: {},
  menu: [],
  conf: {},
} as any;

const _abpReducer = createReducer(
  initialState,
  on(setAbpApplicationData, (state, action) => ({
    ...state,
    conf: action.data,
    ready: true,
  })),
  on(startLoadingAbpApplicationData, (state, action) => ({
    ...state,
    ready: false,
  })),

  on(updateCurrentUser, (state, action) => {
    const ret = {
      ...state,
      conf: {
        ...state.conf,
        currentUser: action.data,
      },
    };
    // ret.conf.currentUser = { ...ret.conf.currentUser, ...action.data };
    return ret;
  }),
  on(setFuseAction, (state, action) => ({
    ...state,
    fuse: action.data,
  })),
  on(setMenuAction, (state, action) => ({
    ...state,
    menu: action.data,
  })),
  on(setEnvirement, (state, action) => ({
    ...state,
    environment: action.data,
  })),
  on(setExtraLocalization, (state, action) => ({
    ...state,
    extraLocalization: action.data,
  })),
  on(addMenuAction, (state, action) => ({
    ...state,
    menu: [...state.menu, ...action.data],
  }))
);

export function abpReducer(state, action) {
  return _abpReducer(state, action);
}

export const selectAbpFeatureKey = createFeatureSelector<any, AbpState>(
  abpFeatureKey
);

export const selectAppConfig = createSelector(
  selectAbpFeatureKey,
  (k) => k?.conf
);
export const selectMenu = createSelector(selectAbpFeatureKey, (k) => k.menu);
export const selectAppFuse = createSelector(selectAbpFeatureKey, (k) => k.fuse);
export const selectAppReady = createSelector(
  selectAbpFeatureKey,
  (k) => k?.ready
);
export const selectEnvironment = createSelector(
  selectAbpFeatureKey,
  (k) => k?.environment
);
export const selectCurrentUser = createSelector(
  selectAppConfig,
  (k) => k?.currentUser
);

export const selectSettings = createSelector(
  selectAppConfig,
  (k) => k?.setting?.values
);

export const selectAuth = createSelector(selectAppConfig, (k) => k?.auth);
export const selectGrantedPolicies = createSelector(
  selectAuth,
  (k) => k?.grantedPolicies
);
export const selectCurrentTenant = createSelector(
  selectAppConfig,
  (k) => k?.currentTenant
);
export const selectLocalization = createSelector(
  selectAppConfig,
  (k) => k?.localization
);

export const selectCurrentCulture = createSelector(
  selectLocalization,
  (k) => k?.currentCulture
);
export const selectCurrentLanguage = createSelector(
  selectCurrentCulture,
  (k) => k?.name
);
export const selectLanguages = createSelector(
  selectLocalization,
  (k) => k?.languages
);

export const selectLocalizationData = createSelector(
  selectLocalization,
  (k) => k?.values
);

export const selectExtraLocalizationData = createSelector(
  selectAbpFeatureKey,
  (k) => k?.extraLocalization
);

export const selectVisibleMenu = createSelector(
  selectMenu,
  selectGrantedPolicies,
  selectCurrentUser,
  (menus, grantedPolicies, user) => {
    if (!menus || menus.length === 0) {
      const m = {};
      m[eLayoutType.application] = [];
      return {
        map: m,
        menu: [],
      };
    }
    menus = sortBy(
      menus.map((m) => Object.assign({}, m)),
      (k) => k.order
    );
    // if (!grantedPolicies) {
    //   return menus;
    // }
    const ret = [];
    const map: { [key: string]: ABP.Nav } = {};
    const mapName: { [key: string]: ABP.Nav } = {};

    const groupLayout: { [key: string]: ABP.Nav[] } = {};
    const groupLayoutRoots: { [key: string]: ABP.Nav[] } = {};
    menus.forEach((menu) => {
      menu.id = menu.id ?? menu.name ?? menu.path;
      if (menu.id) {
        map[menu.id] = menu;
      }
      if (menu.name) {
        mapName[menu.name] = menu;
      }
      menu.invisible = !CheckPolicy(menu.requiredPolicy, grantedPolicies);
      if (menu.invisible) {
        menu.path = null;
      } else if (menu.path == null) {
        menu.invisible = true;
      }
      if (menu.layout == null) {
        menu.layout = eLayoutType.application;
      }
      menu.children = [];
      if (groupLayout[menu.layout] == null) {
        groupLayout[menu.layout] = [menu];
      } else {
        groupLayout[menu.layout].push(menu);
      }
    });
    menus.forEach((menu) => {
      if (menu.parentName) {
        let parrent = map[menu.parentName] ?? mapName[menu.parentName];
        if (parrent == null) {
          parrent = {
            name: menu.parentName,
            layout: menu.layout,
            order: 999,
            children: [],
          };
          map[menu.parentName] = parrent;

          groupLayout[menu.layout].push(parrent);
        }
        menu.parent = parrent;
        parrent.children.push(menu);
      }
    });
    const showOnlyAuthroizedChilds = (
      lmenus: ABP.Nav[],
      level = 0,
      maxLevel = 10
    ) => {
      const retLst = [];
      if (level >= maxLevel) {
        // protect from stackoverflow when circular tree is detected
        return retLst;
      }
      for (const menu of lmenus) {
        if (menu.children?.length > 0) {
          menu.children = sortBy(
            showOnlyAuthroizedChilds(menu.children, level + 1, maxLevel),
            (m) => m?.order || 99999
          );
        }
        if (menu.children.length > 0 && menu.invisible) {
          menu.invisible = false;
        }
        if (menu.children.length == 0 && menu.path == null) {
          menu.invisible = true;
        }
        if (!menu.invisible) {
          retLst.push(menu);
        }
      }
      return retLst;
    };
    // tslint:disable-next-line: forin
    for (const key in groupLayout) {
      const gmenus = groupLayout[key];

      groupLayoutRoots[key] = gmenus.filter((k) => k.parent == null);
      groupLayoutRoots[key] = showOnlyAuthroizedChilds(
        groupLayoutRoots[key],
        0,
        groupLayout[key].length
      );
    }

    return {
      map,
      menu: groupLayoutRoots,
    };
  }
);
