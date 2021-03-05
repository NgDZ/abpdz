import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'abpdz-import-button',
  templateUrl: './abpdz-import-button.component.html',
  styleUrls: ['./abpdz-import-button.component.scss'],
})
export class NgdzImportButtonComponent implements OnInit {
  @Output()
  data = new EventEmitter();
  @Input()
  text;
  @ViewChild('fileLoader', { static: true })
  fileLoader: ElementRef;
  @Input()
  disabled = false;
  constructor(protected http: HttpClient, private _elementRef: ElementRef) {}
  ngOnInit() {}

  loadImportData() {
    (<any>document).inputFile = this.fileLoader;

    (<any>(
      document
    )).inputFileQuery = this._elementRef.nativeElement.querySelector(
      'fileLoader'
    );
    (<any>this.fileLoader.nativeElement).click();
    // this._elementRef.nativeElement.querySelector('input').click();
  }

  importFileData(event: any) {
    const input = event.target;
    const file = input.files[0];
    if (file == null || file.length === 0) {
      return;
    }

    (<any>document).currentFile = file;
    const fileName = (file.name || '').toLowerCase();
    if (fileName.endsWith('.xlsx')) {
      const formData = new FormData();
      formData.append(file.name, file);
      const uploadReq = new HttpRequest(
        'POST',
        `api/AppTools/ImportExcel`,
        formData,
        {
          reportProgress: true,
        }
      );
      this.http.request(uploadReq).subscribe((eventProgress) => {
        this.cleanImportFile();
        if (eventProgress.type === HttpEventType.UploadProgress) {
          // this.progress = Math.round(
          //   (100 * eventProgress.loaded) / eventProgress.total
          // );
        } else if (eventProgress.type === HttpEventType.Response) {
          this.data.emit({
            type: 'excel',
            data: eventProgress.body,
            filename: file.name,
          });
        }
      });
    }
    if (fileName.endsWith('.json') || fileName.endsWith('.crjson')) {
      const reader = new FileReader();
      const self = this;
      reader.onload = function () {
        self.cleanImportFile();
        const text = <any>reader.result;

        self.data.emit({
          type: 'json',
          data: text,
          filename: file.name,
        });
      };
      reader.readAsText(input.files[0], 'utf-8');
    }
  }

  cleanImportFile() {
    (<any>this.fileLoader.nativeElement).value = null;
  }
}
