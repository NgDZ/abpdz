using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace AbpDz.Models
{
    public class AbpDzCollection : CreationAuditedAggregateRoot<Guid>, IMultiTenant
    {

        public Guid? TenantId { get; set; }
        [StringLength(AbpDzConsts.MaxEntityIdLength)]
        public string ChildId { get; set; }
        [StringLength(AbpDzConsts.MaxEntityIdLength)]
        public string ParrentId { get; set; }
        [StringLength(62)]
        public string CollectionCode { get; set; }
        /// <summary>
        /// Notification Value as JSON string.
        /// </summary>
        [StringLength(AbpDzConsts.MaxDataLength)]
        public virtual string Value { get; set; }
        /// <summary>
        /// Notification data as JSON string.
        /// </summary>
        [StringLength(AbpDzConsts.MaxDataLength)]
        public virtual string Data { get; set; }

    }
}

