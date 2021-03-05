import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsiveColumnsService } from '../../services/responsive-columns.service';

@Component({
  selector: 'abpdz-select-columns',
  templateUrl: './abpdz-select-columns.component.html',
  styleUrls: ['./abpdz-select-columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgdzSelectColumnsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input()
  columns: string[] = [];

  open: { [key: string]: boolean } = {};
  visible: { [key: string]: boolean } = {};
  @Input()
  count = 0;

  @Input()
  id: string;

  @Input()
  include: string;
  @Input()
  displayPrefix: string;
  @Input()
  displays: string[];
  @Input()
  displayMap: { [key: string]: string } = {};
  @Input()
  selected: string[] = [];
  @Output()
  selectedChange = new EventEmitter<string[]>();
  sub$: Subscription[] = [];
  reactiveColumnsCount = 0;
  constructor(r: ResponsiveColumnsService, cd: ChangeDetectorRef) {
    this.sub$.push(
      r.colmuns$().subscribe((k) => {
        this.reactiveColumnsCount = k;
        this.calculateOpenColumns();
        cd.markForCheck();
      })
    );
  }
  ngOnDestroy(): void {
    this.sub$.forEach((k) => k.unsubscribe());
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns || changes.count) {
      this.resetOpenColumns();
    }

    if (changes.columns || changes.displays || changes.displayPrefix) {
      this.resetDisplays();
    }
  }
  resetDisplays() {
    if (this.displays?.length) {
      for (let i = 0; i < this.columns.length; i++) {
        this.displayMap[this.columns[i]] = this.displays[i] ?? this.columns[i];
      }
    } else if (this.displayPrefix) {
      for (let i = 0; i < this.columns.length; i++) {
        this.displayMap[this.columns[i]] =
          this.displayPrefix + '' + this.columns[i];
      }
    } else {
      for (let i = 0; i < this.columns.length; i++) {
        this.displayMap[this.columns[i]] = this.columns[i];
      }
    }
  }
  resetOpenColumns() {
    this.open = {};
    this.visible = {};
    for (let index = 0; index < this.columns?.length; index++) {
      this.open[this.columns[index]] = index < this.count;
    }
    this.calculateOpenColumns();
  }
  calculateOpenColumns() {
    if (this.reactiveColumnsCount === 0) {
      return;
    }
    const ret = this.columns
      .filter((c) => this.open[c])
      .slice(0, this.reactiveColumnsCount);

    for (const iterator of this.columns) {
      this.visible[iterator] = ret.indexOf(iterator) >= 0;
    }

    if (this.id) {
      localStorage.setItem('columns-' + this.id, JSON.stringify(ret));
    }
    this.selected = ['Actions', ...ret];
    this.selectedChange.next(this.selected);
  }
  ngOnInit(): void {}
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.calculateOpenColumns();
  }
}
