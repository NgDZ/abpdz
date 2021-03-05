import { Injectable } from '@angular/core';
import { orderBy } from 'lodash-es';
import { Store } from '@ngrx/store';
import { AbpEnum } from '../models/dtos';
import { ConfigStateService } from '../services/config-state.service';
// import * as countries from 'ngdz-countries/data/fr/countries.json';
@Injectable({
  providedIn: 'root',
})
export class EnumsService {
  keys: {
    [key: string]: AbpEnum;
  } = {};
  displays: {
    [key: string]: any;
  };
  root: AbpEnum[];
  constructor(private config: ConfigStateService) {
    this.displays = {};
    // this.loadRoot(JSON.parse(JSON.stringify(abp.abp.enums)));
    this.config.abp$.subscribe((k: any) => {
      var data = k?.objectExtensions?.enums?.abpEnums?.fields?.find(
        (e) => e.name == 'Enums'
      );
      if (data) {
        this.loadRoot(JSON.parse(JSON.stringify(data)).value);
      }
    });
  }

  private loadRoot(k: AbpEnum[]) {
    const v = {};
    k = orderBy(k, (z) => (z.display || '').toUpperCase());
    k.forEach((z) => {
      z.childs = [];
      v[z.id] = z;
    });
    k.forEach((z) => {
      if (z.parrentId) {
        v[z.parrentId].childs.push(z);
      }
    });
    this.root = k.filter((e) => e.parrentId == null);
    // const ctries = JSON.parse(JSON.stringify(countries)).default;

    // this.root.push({
    //   code: 'Pays',
    //   display: 'Pays',
    //   value: 'Pays',
    //   childs: ctries.map(
    //     f =>
    //       <AbpEnum>{
    //         code: f.alpha2,
    //         value: f.alpha2,
    //         display: f.name
    //       }
    //   )
    // });
    this.setType(this.root, null);
    this.root.forEach((ki) => {
      this.keys[ki.code] = ki;
    });
    this.keys['Enums'] = { childs: this.root };
    this.getDisplays(this.root, this.displays);
  }
  setType(root: AbpEnum[], tup: string) {
    root.forEach((ki) => {
      if (ki.entityType == null) {
        ki.entityType = tup;
      }
      if (ki.value !== null) {
        if (ki.entityType === 'number') {
          ki.value = <any>Number.parseInt(ki.value, 36);
        }
      }
      if (ki.childs != null && ki.childs.length > 0) {
        this.setType(ki.childs, ki.entityType);
      }
    });
  }
  getDisplays(root: AbpEnum[], displays: { [key: string]: any }) {
    root.forEach((ki) => {
      if (ki.childs && ki.childs.length > 0) {
        displays[ki.value || ki.code] = {};
        this.getDisplays(ki.childs, displays[ki.value || ki.code]);
      } else {
        displays[ki.value || ki.code] = ki.display;
      }
    });
  }
}
