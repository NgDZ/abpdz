using System;
using System.Linq;
using System.Threading.Tasks;
using AbpDz.Models;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Data;
using AbpDz.Core;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Auditing;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging;
using Microsoft.AspNetCore.Authorization;
using System.Linq.Dynamic.Core;
namespace AbpDz.Notifications
{

    [RemoteService]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Notification")]
    [Route("/api/audit-logging/")]
    public class AuditLogController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public IRepository<AuditLog, Guid> Repository { get; }


        public AuditLogController(
            IRepository<AuditLog, Guid> repository
            )
        {
            Repository = repository;
        }
        [HttpGet("audit-logs")]
        public async Task<PagedResultDto<AuditLog>> GetAll(EventFilterDto filter)
        {
            var query = Repository.AsQueryable();
            if (string.IsNullOrWhiteSpace(filter.Sorting))
            {
                filter.Sorting = nameof(AuditLog.ExecutionTime) + " desc";
            }
            if (CurrentUser.Id != filter.UserId && !await AuthorizationService.IsGrantedAsync("AbpIdentity.Users.Create"))
            {
                filter.UserId = CurrentUser.Id;
            }

            if (filter.UserId.HasValue)
            {
                query = query.Where(k => k.UserId == filter.UserId);
            }
            if (filter.StartDate.HasValue)
            {
                query = query.Where(k => k.ExecutionTime >= filter.StartDate);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(k => k.ExecutionTime <= filter.EndDate);
            }
            return new PagedResultDto<AuditLog>(
                await query.CountAsync(),
                await query.OrderBy(d => d.ExecutionTime)
                .Skip(filter.SkipCount)
                .Take(filter.MaxResultCount).ToListAsync()
            );
        }
    }
}