using System;
using Volo.Abp.Application.Dtos;

namespace AbpDz.Core
{
    public class EventFilterDto : PagedAndSortedResultRequestDto
    {

#pragma warning disable  0114
        public int MaxResultCount { get; set; }

        public string Filter { get; set; }

        public string Id { get; set; }
        public string Type { get; set; }
        public Guid? Source { get; set; }
        public Guid? Creator { get; set; }
        public Guid? UserId { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Code { get; set; }
        public int? State { get; set; }
        public int? Severity { get; set; }
        public bool? Checked { get; set; }
    }
}
