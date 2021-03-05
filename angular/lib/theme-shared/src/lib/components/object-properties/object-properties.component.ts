import {
  Component,
  OnInit,
  Optional,
  Input,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'object-properties',
  templateUrl: './object-properties.component.html',
  styleUrls: [],
})
export class ObjectPropertiesComponent implements OnInit {
  @Input()
  title;
  @Input()
  displayMap;
  private _data: any;
  public get data(): any {
    return this._data;
  }
  @Input()
  public set data(v: any) {
    this._data = v;
    if (v == null) {
      this.map = [];
    } else {
      this.map = [];
      Object.keys(v).forEach((key) => {
        this.map.push({ key: key, value: v[key] });
      });
    }
    this.cd.markForCheck();
  }
  map: { key: any; value: string }[];
  isObj(o) {
    if (o == null) {
      return false;
    }
    return typeof o == 'object';
  }

  constructor(
    public cd: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<ObjectPropertiesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data?.value;
    this.title = data?.title;
    this.displayMap = data?.displayMap;
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
    this.cd.markForCheck();
  }
}
