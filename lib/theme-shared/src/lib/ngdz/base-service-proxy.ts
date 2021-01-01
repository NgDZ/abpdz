// tslint:disable:triple-equals
import { Injector } from '@angular/core';
import { of as _of, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
// import { RequestOptionsArgs } from '@angular/http';

export class BaseServiceProxy {
  getBaseUrl(url: string): string {
    return url;
  }
  constructor(private injector: Injector) {}

  ParseJson(_responseText: string, jsonParseReviver?): any {
    let ret;
    if (jsonParseReviver != null) {
      ret = JSON.parse(_responseText, jsonParseReviver);
    } else {
      ret = JSON.parse(_responseText);
    }
    const abp = ret;
    if (abp.__abp == true) {
      // handle abp error
      ret = abp.result;
    }
    return ret;
  }
  protected transformOptions(options: any) {
    return Promise.resolve(options);
  }
  transformResult(url, response, process): Observable<any> {
    return process(response).map((v: any) => {
      const abp = v;
      if (abp.__abp == true) {
        v = abp.result;
      }
      return v;
      // return _of(process);
    });
  }
}

export class SwaggerException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isSwaggerException = true;

  static isSwaggerException(obj: any): obj is SwaggerException {
    return obj.isSwaggerException === true;
  }
}
