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

namespace AbpDz.Notifications
{

    [RemoteService]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Notification")]
    [Route("/api/[controller]/[action]")]
    public class AuditLogController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public IRepository<AuditLog, Guid> Repository { get; }


        public AuditLogController(
            IRepository<AuditLog, Guid> repository
            )
        {
            Repository = repository;
        }
        [HttpGet]
        public async Task<PagedResultDto<AuditLog>> GetAll(EventFilterDto filter)
        {
            var query = Repository.AsQueryable();

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
                await query.ToListAsync()
            );
        }
    }
}