using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;

namespace AbpDz.Models
{
    public class AbpDzTask : CreationAuditedAggregateRoot<Guid>
    {


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

        public Guid? ParrentId { get; set; }
        public int Priority { get; set; }
        public int? SecurityLevel { get; set; }
        public int? PublicLevel { get; set; }
        public int Status { get; set; }
        public int? TypeId { get; set; }

        public int? ToRoleId { get; set; }
        public long? ToUserId { get; set; }
        public long? Raiting { get; set; }
        public long? OrganizationUnitId { get; set; }
        public DateTime? EstimatedStart { get; set; }
        public DateTime? EstimatedCompletion { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Completion { get; set; }
        public long EstimatedTime { get; set; }
        public DateTime? DueDate { get; set; }
        [StringLength(128)]
        public string Title { get; set; }

        [StringLength(254)]
        public string Tags { get; set; }
        [StringLength(254)]
        public string Location { get; set; }
        [StringLength(254)]
        public string Sender { get; set; }
        [StringLength(254)]
        public string Description { get; set; }

    }
}

