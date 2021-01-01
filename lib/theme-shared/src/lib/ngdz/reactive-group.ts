import { Observable } from 'rxjs';

export interface NgdzReactiveGroup<T> {
  Childs: NgdzReactiveGroup<T>[];
  Items: T[];
  SearchFilter: (f: T) => boolean;
  Id: any;
  Parent: NgdzReactiveGroup<T>;
  Display;
  Expanded: boolean;
  Search$: Observable<T[]>;
  Search: T[];
}
