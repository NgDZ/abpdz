using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace AbpDz.Models
{
    public class AbpDzNotificationInfo : CreationAuditedAggregateRoot<Guid>, IMultiTenant
    {
        public AbpDzNotificationInfo() { }
        public virtual Guid? TenantId { get; protected set; }

        /// <summary>
        /// Application code for the notification.
        /// </summary>
        public int Code { get; set; }
        public virtual Guid? SenderId
        {
            get;
            set;
        }

        public virtual Guid? RecipientId
        {
            get;
            set;
        }
        public virtual Guid? RecipientRoleId
        {
            get;
            set;
        }

        [StringLength(AbpDzConsts.MaxNotificationNameLength)]
        public virtual string DetailUrl
        {
            get;
            set;
        }
        public byte? DetailUrlType { get; set; }
        [StringLength(AbpDzConsts.MaxNotificationNameLength)]
        public virtual string RecipientPermission
        {
            get;
            set;
        }

        /// <summary>
        /// Unique notification name.
        /// </summary>
        [Required]
        [StringLength(AbpDzConsts.MaxNotificationNameLength)]
        public virtual string NotificationName { get; set; }

        /// <summary>
        /// Notification data as JSON string.
        /// </summary>
        [StringLength(AbpDzConsts.MaxDataLength)]
        public virtual string Data { get; set; }

        /// <summary>
        /// Notification content string.
        /// </summary>
        [StringLength(AbpDzConsts.MaxDataLength)]
        public virtual string Content { get; set; }

        /// <summary>
        /// Type of the JSON serialized <see cref="Data"/>.
        /// It's AssemblyQualifiedName of the type.
        /// </summary>
        [StringLength(AbpDzConsts.MaxDataTypeNameLength)]
        public virtual string DataTypeName { get; set; }

        /// <summary>
        /// Gets/sets entity type name, if this is an entity level notification.
        /// It's FullName of the entity type.
        /// </summary>
        [StringLength(AbpDzConsts.MaxEntityTypeNameLength)]
        public virtual string EntityTypeName { get; set; }

        /// <summary>
        /// AssemblyQualifiedName of the entity type.
        /// </summary>
        [StringLength(AbpDzConsts.MaxEntityTypeAssemblyQualifiedNameLength)]
        public virtual string EntityTypeAssemblyQualifiedName { get; set; }

        /// <summary>
        /// Gets/sets primary key of the entity, if this is an entity level notification.
        /// </summary>
        [StringLength(AbpDzConsts.MaxEntityIdLength)]
        public virtual string EntityId { get; set; }


        /// <summary>
        /// Gets/sets primary key of the entity, if this is an entity level notification.
        /// </summary>
        [StringLength(AbpDzConsts.MaxEntityIdLength)]
        public virtual string ExternalId { get; set; }

        /// <summary>
        /// Notification severity.
        /// </summary>
        public virtual AbpDzSeverity Severity { get; set; }

        /// <summary>
        /// Notification state.
        /// </summary>
        public virtual AbpDzMessageState State { get; set; }


    }
}

