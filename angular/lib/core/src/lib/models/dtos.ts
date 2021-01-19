import { ABP } from './common';

export class ListResultDto<T> {
  items?: T[];

  constructor(initialValues: Partial<ListResultDto<T>> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class PagedResultDto<T> extends ListResultDto<T> {
  totalCount?: number;

  constructor(initialValues: Partial<PagedResultDto<T>> = {}) {
    super(initialValues);
  }
}

export class LimitedResultRequestDto {
  maxResultCount = 10;

  constructor(initialValues: Partial<LimitedResultRequestDto> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class PagedResultRequestDto extends LimitedResultRequestDto {
  skipCount?: number;

  constructor(initialValues: Partial<PagedResultRequestDto> = {}) {
    super(initialValues);
  }
}

export class PagedAndSortedResultRequestDto extends PagedResultRequestDto {
  sorting?: string;

  constructor(initialValues: Partial<PagedAndSortedResultRequestDto> = {}) {
    super(initialValues);
  }
}

export class EntityDto<TKey = string> {
  id?: TKey;

  constructor(initialValues: Partial<EntityDto<TKey>> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class CreationAuditedEntityDto<
  TPrimaryKey = string
> extends EntityDto<TPrimaryKey> {
  creationTime?: string | Date;
  creatorId?: string;

  constructor(
    initialValues: Partial<CreationAuditedEntityDto<TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class CreationAuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends CreationAuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;

  constructor(
    initialValues: Partial<
      CreationAuditedEntityWithUserDto<TUserDto, TPrimaryKey>
    > = {}
  ) {
    super(initialValues);
  }
}

export class AuditedEntityDto<
  TPrimaryKey = string
> extends CreationAuditedEntityDto<TPrimaryKey> {
  lastModificationTime?: string | Date;
  lastModifierId?: string;

  constructor(initialValues: Partial<AuditedEntityDto<TPrimaryKey>> = {}) {
    super(initialValues);
  }
}

export class AuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends AuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;
  lastModifier?: TUserDto;

  constructor(
    initialValues: Partial<AuditedEntityWithUserDto<TUserDto, TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class FullAuditedEntityDto<
  TPrimaryKey = string
> extends AuditedEntityDto<TPrimaryKey> {
  isDeleted?: boolean;
  deleterId?: string;
  deletionTime?: Date | string;

  constructor(initialValues: Partial<FullAuditedEntityDto<TPrimaryKey>> = {}) {
    super(initialValues);
  }
}

export class FullAuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends FullAuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;
  lastModifier?: TUserDto;
  deleter?: TUserDto;

  constructor(
    initialValues: Partial<
      FullAuditedEntityWithUserDto<TUserDto, TPrimaryKey>
    > = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleObject {
  extraProperties: ABP.Dictionary<any>;

  constructor(initialValues: Partial<ExtensibleObject> = {}) {
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        this[key] = initialValues[key];
      }
    }
  }
}

export class ExtensibleEntityDto<TKey = string> extends ExtensibleObject {
  id: TKey;

  constructor(initialValues: Partial<ExtensibleEntityDto<TKey>> = {}) {
    super(initialValues);
  }
}

export class ExtensibleCreationAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleEntityDto<TPrimaryKey> {
  creationTime: Date | string;
  creatorId?: string;

  constructor(
    initialValues: Partial<ExtensibleCreationAuditedEntityDto<TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleCreationAuditedEntityDto<TPrimaryKey> {
  lastModificationTime?: Date | string;
  lastModifierId?: string;

  constructor(
    initialValues: Partial<ExtensibleAuditedEntityDto<TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleAuditedEntityDto<TPrimaryKey> {
  creator: TUserDto;
  lastModifier: TUserDto;

  constructor(
    initialValues: Partial<ExtensibleAuditedEntityWithUserDto<TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleCreationAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleCreationAuditedEntityDto<TPrimaryKey> {
  creator: TUserDto;

  constructor(
    initialValues: Partial<
      ExtensibleCreationAuditedEntityWithUserDto<TPrimaryKey>
    > = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleFullAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleAuditedEntityDto<TPrimaryKey> {
  isDeleted: boolean;
  deleterId?: string;
  deletionTime: Date | string;

  constructor(
    initialValues: Partial<ExtensibleFullAuditedEntityDto<TPrimaryKey>> = {}
  ) {
    super(initialValues);
  }
}

export class ExtensibleFullAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleFullAuditedEntityDto<TPrimaryKey> {
  creator: TUserDto;
  lastModifier: TUserDto;
  deleter: TUserDto;

  constructor(
    initialValues: Partial<
      ExtensibleFullAuditedEntityWithUserDto<TPrimaryKey>
    > = {}
  ) {
    super(initialValues);
  }
}

export enum AbpDzSeverity {
  /// <summary>
  /// Info.
  /// </summary>
  Info = 0,

  /// <summary>
  /// Success.
  /// </summary>
  Success = 1,

  /// <summary>
  /// Warn.
  /// </summary>
  Warn = 2,

  /// <summary>
  /// Error.
  /// </summary>
  Error = 3,

  /// <summary>
  /// Fatal.
  /// </summary>
  Fatal = 4,
}

export enum AbpDzMessageState {
  /// <summary>
  /// Info.
  /// </summary>
  Unread = 0,

  /// <summary>
  /// Info.
  /// </summary>
  Read = 64,
}

export interface AbpDzNotificationInfo {
  readonly id?: string;
  readonly extraProperties?: { [key: string]: any } | undefined;
  concurrencyStamp?: string | undefined;
  creationTime?: Date;
  creatorId?: string | undefined;
  readonly tenantId?: string | undefined;
  code?: number;
  senderId?: string | undefined;
  recipientId?: string | undefined;
  recipientRoleId?: string | undefined;
  expireAt?: Date | undefined;
  detailUrl?: string | undefined;
  detailUrlType?: number | undefined;
  recipientPermission?: string | undefined;
  notificationName: string;
  data?: string | undefined;
  content?: string | undefined;
  dataTypeName?: string | undefined;
  entityTypeName?: string | undefined;
  entityTypeAssemblyQualifiedName?: string | undefined;
  entityId?: string | undefined;
  externalId?: string | undefined;
  severity?: AbpDzSeverity;
  state?: AbpDzMessageState;
}

export enum EntityChangeType {
  Created = 0,
  Updated = 1,
  Deleted = 2,
}

export interface EntityPropertyChange {
  readonly id?: string;
  readonly tenantId?: string | undefined;
  readonly entityChangeId?: string;
  readonly newValue?: string | undefined;
  readonly originalValue?: string | undefined;
  readonly propertyName?: string | undefined;
  readonly propertyTypeFullName?: string | undefined;
}

export interface EntityChange {
  readonly id?: string;
  readonly auditLogId?: string;
  readonly tenantId?: string | undefined;
  readonly changeTime?: Date;
  changeType?: EntityChangeType;
  readonly entityTenantId?: string | undefined;
  readonly entityId?: string | undefined;
  readonly entityTypeFullName?: string | undefined;
  readonly propertyChanges?: EntityPropertyChange[] | undefined;
  readonly extraProperties?: { [key: string]: any } | undefined;
}

export interface AuditLogAction {
  readonly id?: string;
  readonly tenantId?: string | undefined;
  readonly auditLogId?: string;
  readonly serviceName?: string | undefined;
  readonly methodName?: string | undefined;
  readonly parameters?: string | undefined;
  readonly executionTime?: Date;
  readonly executionDuration?: number;
  readonly extraProperties?: { [key: string]: any } | undefined;
}

export interface AuditLog {
  readonly id?: string;
  readonly extraProperties?: { [key: string]: any } | undefined;
  concurrencyStamp?: string | undefined;
  applicationName?: string | undefined;
  readonly userId?: string | undefined;
  readonly userName?: string | undefined;
  readonly tenantId?: string | undefined;
  readonly tenantName?: string | undefined;
  readonly impersonatorUserId?: string | undefined;
  readonly impersonatorTenantId?: string | undefined;
  readonly executionTime?: Date;
  readonly executionDuration?: number;
  readonly clientIpAddress?: string | undefined;
  readonly clientName?: string | undefined;
  clientId?: string | undefined;
  correlationId?: string | undefined;
  readonly browserInfo?: string | undefined;
  readonly httpMethod?: string | undefined;
  readonly url?: string | undefined;
  readonly exceptions?: string | undefined;
  readonly comments?: string | undefined;
  httpStatusCode?: number | undefined;
  readonly entityChanges?: EntityChange[] | undefined;
  readonly actions?: AuditLogAction[] | undefined;
}

export interface IdentitySecurityLog {
  readonly id?: string;
  readonly extraProperties?: { [key: string]: any } | undefined;
  concurrencyStamp?: string | undefined;
  readonly tenantId?: string | undefined;
  readonly applicationName?: string | undefined;
  readonly identity?: string | undefined;
  readonly action?: string | undefined;
  readonly userId?: string | undefined;
  readonly userName?: string | undefined;
  readonly tenantName?: string | undefined;
  readonly clientId?: string | undefined;
  readonly correlationId?: string | undefined;
  readonly clientIpAddress?: string | undefined;
  readonly browserInfo?: string | undefined;
  readonly creationTime?: Date;
}
export interface EventFilterDto {
  maxResultCount?: number;
  filter?: string;
  id?: string;
  type?: number;
  source?: string;
  creator?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  code?: string;
  state?: string;
  severity?: number;
  checked?: boolean;
  sorting?: number;
  skipCount?: number;
}
