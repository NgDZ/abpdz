import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const mqAliases = ['xs', 'sx', 'md', 'lg', 'xl'];
@Injectable({
  providedIn: 'root'
})
export class ResponsiveColumnsService {
  _aliases$: Subject<string> = new ReplaySubject<string>(1);
  constructor(media: MediaObserver) {
    mqAliases.forEach(element => {
      if (media.isActive(element)) {
        this._aliases$.next(element);
      }
    });
    media.asObservable().subscribe(
      res => this._aliases$.next(res[0].mqAlias),
      err => this._aliases$.error(err),
      () => this._aliases$.complete()
    );
  }
  ColumnByMedia(alias: string): number {
    switch (alias) {
      case 'xs':
        return 3;
      case 'sm':
        return 5;
      case 'md':
        return 7;
      case 'lg':
        return 9;
      case 'xl':
        return 11;
      default:
        return 13;
    }
  }
  Responsive(collumns: string[], end_collumns?: string[]) {
    return this._aliases$.pipe(
      map(alias => {
        let number = this.ColumnByMedia(alias);
        number = number > collumns.length ? collumns.length : number;
        const colmns = collumns.slice(0);
        return [...collumns.slice(0, number), ...end_collumns];
      })
    );
  }
  colmuns$(): Observable<number> {
    return this._aliases$.pipe(map(alias => this.ColumnByMedia(alias)));
  }
}
