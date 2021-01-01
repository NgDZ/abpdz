import { Observable } from 'rxjs';
import { orderBy } from 'lodash-es';

export class ColumnDisplay {
  name: string;
  display: string;
  order = 0;
  allwaysOn = false;
  priority = 0;
  _show = true;
  public get show(): boolean {
    return this._show;
  }
  public set show(v: boolean) {
    this._show = v;
    this.parent.resetColmuns();
  }

  parent: TableColumns;
}

export class TableColumns {
  columns: string[];

  all: ColumnDisplay[];
  select: ColumnDisplay[];
  resetColmuns() {
    this.columns = orderBy(
      this.all.filter((k) => k.allwaysOn || k.show),
      (o) => o.order
    ).map((k) => k.name);
  }
  add(
    name,
    display = null,
    allwaysOn = false,
    order = -1,
    priority = 0
  ): ColumnDisplay {
    const ret = this.addNoRest(name, display, allwaysOn, order, priority);
    this.resetColmuns();
    this.resetSelected();
    return ret;
  }
  resetSelected() {
    this.select = orderBy(
      this.all.filter((k) => !k.allwaysOn),
      (o) => o.order
    );
  }

  addNoRest(
    name,
    display = null,
    allwaysOn = false,
    order = -1,
    priority = 0
  ): ColumnDisplay {
    const c = new ColumnDisplay();
    c.name = name;
    c.display = display || name;
    c.parent = this;
    c.allwaysOn = allwaysOn;
    c.priority = priority;
    c.order = order !== -1 ? order : this.all.length;
    this.all.push(c);
    return c;
  }
  constructor(rows?: string[], public id?: string) {
    this.columns = [];
    this.all = [];
    if (rows != null && rows.length > 0) {
      rows.forEach((element) => {
        this.addNoRest(element);
      });
      this.resetColmuns();
      this.resetSelected();
    }
  }
}
