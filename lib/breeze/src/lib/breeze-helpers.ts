import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DataService,
  EntityManager,
  EntityQuery,
  EntityType,
  MetadataStore,
  NamingConvention,
  Validator,
} from 'breeze-client';

import { from as fromPromise, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EntityManagerProvider {
  protected masterManager: { [key: string]: EntityManager } = {};
  protected masterMetaData: { [key: string]: any } = {};

  constructor(private http: HttpClient) {
    NamingConvention.defaultInstance.setAsDefault();
    NamingConvention.camelCase.setAsDefault();
  }

  registerManager(
    lookupsLoadOptions: { [key: string]: boolean },
    loadLookups: boolean,
    registerHelper?: (n: MetadataStore) => any,
    apiUrl = 'breeze/Api',
    contextName = null
  ): Observable<EntityManager> {
    apiUrl = apiUrl + (apiUrl.endsWith('/') ? '' : '/');
    if (this.masterManager[apiUrl]) {
      return of(this.createCopy(apiUrl));
    }
    contextName = contextName || apiUrl;
    if (this.masterMetaData[contextName] == null) {
      this.masterMetaData[contextName] = this.http
        .get(apiUrl + 'metadata')
        .pipe(shareReplay());
      this.masterMetaData[apiUrl] = this.masterMetaData[contextName];
    }

    return this.masterMetaData[contextName].pipe(
      map((r) => {
        if (this.masterManager[apiUrl]) {
          return this.createCopy(apiUrl);
        }
        const dataService = new DataService({
          serviceName: apiUrl,
          hasServerMetadata: false,
        });
        if (this.masterManager[apiUrl]) {
          return this.createCopy(apiUrl);
        }
        const data = new EntityManager({ dataService });

        const metadataStore = data.metadataStore;
        metadataStore.importMetadata(r);
        registerHelper(metadataStore);
        this.registerAnnotations(metadataStore, contextName);
        this.masterManager[apiUrl] = data;
        this.masterManager[contextName] = data;
        (data as any).lookupsLoadOptions = lookupsLoadOptions;
        (data as any).loadLookups = loadLookups;

        return this.createCopy(apiUrl);
      })
    );
  }
  protected createCopy(apiUrl) {
    const newEntityManager = this.masterManager[apiUrl].createEmptyCopy();
    (newEntityManager as any).lookupsLoadOptions = (this.masterManager[
      apiUrl
    ] as any).lookupsLoadOptions;
    (newEntityManager as any).loadLookups = (this.masterManager[
      apiUrl
    ] as any).lookupsLoadOptions;

    newEntityManager.importEntities(
      this.masterManager[apiUrl].exportEntities(null, {
        asString: false,
        includeMetadata: false,
      })
    );
    return newEntityManager;
  }

  reset(manager: EntityManager, ContextName?): void {
    ContextName = ContextName || (manager as any).ContextName;
    if (manager) {
      manager.clear();
      this.seedManager(manager, ContextName);
    }
  }

  newManager(ContextName?): EntityManager {
    let key = Object.keys(this.masterManager)[0];
    if (this.masterManager[ContextName || key]) {
      key = ContextName || key;
    }
    const manager = this.masterManager[key].createEmptyCopy();
    // this.seedManager(manager);
    return manager;
  }

  private seedManager(manager: EntityManager, ContextName) {
    const key = Object.keys(this.masterManager)[0];
    manager.importEntities(
      this.masterManager[key].exportEntities(null, {
        asString: false,
        includeMetadata: false,
      })
    );
  }
  public seedManagerContext(manager: EntityManager, ContextName?) {
    this.masterManager[
      ContextName || Object.keys(this.masterManager)[0]
    ]?.importEntities(
      manager.exportEntities(null, {
        asString: false,
        includeMetadata: false,
      })
    );
  }
  private registerAnnotations(metadataStore: MetadataStore, contextName?) {
    metadataStore.getEntityTypes().forEach((t: EntityType) => {
      const et = <EntityType>t;
      const ctor = <any>et.getCtor();
      if (ctor && ctor.getEntityTypeAnnotation) {
        const etAnnotation = ctor.getEntityTypeAnnotation() as any;
        et.validators.push(...etAnnotation.validators);
        etAnnotation.propertyAnnotations.forEach((pa) => {
          const prop = et.getProperty(pa.propertyName);
          prop.validators.push(...pa.validators);
          prop.displayName = pa.displayName;
        });
      }
    });
  }
}
export function executeLookupsQuery<lookupType>(
  em,
  loadOptions
): Observable<lookupType> {
  if (loadOptions == null) {
    return of({} as any);
  }
  const query = EntityQuery.from('lookups').withParameters(loadOptions);
  return fromPromise((em.context || em).executeQuery(query)).pipe(
    map((res) => (res as any).results[0] as lookupType)
  );
}
export function executeObservableQuery<type>(
  em,
  uri,
  loadOptions?,
  queryCustomizationAction?: (EntityQuery) => EntityQuery
): Observable<{ results?: type; inlineCount?: number }> {
  let query = loadOptions
    ? EntityQuery.from(uri).withParameters(loadOptions)
    : EntityQuery.from(uri);
  if (queryCustomizationAction) {
    query = queryCustomizationAction(query);
  }
  return fromPromise((em.context || em).executeQuery(query));
}
