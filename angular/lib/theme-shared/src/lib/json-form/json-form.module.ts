import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { StringJsonFormComponent } from './components';

@NgModule({
  declarations: [StringJsonFormComponent],
  exports: [StringJsonFormComponent],
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      extras: {
        immutable: true,
      },
    }),
    FormlyMaterialModule,
  ],
})
export class JsonFormModule {}
