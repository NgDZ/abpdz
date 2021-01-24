using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace AbpDz.Core
{
    public class SummaryPagedResultDto<T> : PagedResultDto<T>
    {
        public SummaryPagedResultDto()
        {

        }
        public SummaryPagedResultDto(
            long totalCount,
            IReadOnlyList<T> items,
            double sum = 0,
            double avg = 0
            )
            : base(totalCount, items)
        {
            TotalCount = totalCount;
            Sum = sum;
            Avg = avg;
        }
        public Double Sum { get; set; }
        public Double Avg { get; set; }
    }
}
