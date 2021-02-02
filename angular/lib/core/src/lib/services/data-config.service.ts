import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataConfigService {
  data: any = {};
  lists: { [key: string]: any[] } = {};
  setData(data, key1, key2?) {
    if (this.data[key1] == null) {
      this.data[key1] = key2 == null ? data : {};
    }
    if (key2 != null) {
      this.data[key1][key2] = data;
    }
  }
  getDate(key1, key2?) {
    if (key1 != null) {
      if (key2) {
        return this.data[key1][key2];
      } else {
        return this.data[key1];
      }
    } else {
      return {};
    }
  }
  addToList(key, item) {
    if (this.lists[key] == null) {
      this.lists[key] = [item];
    } else {
      this.lists[key].push(item);
    }
  }
  getList(key) {
    if (this.lists[key] == null) {
      this.lists[key] = [];
    }
    return this.lists[key];
  }
}
