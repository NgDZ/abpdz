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
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Identity;
using System.Linq.Dynamic.Core;
namespace AbpDz.Notifications
{

    [RemoteService]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Notification")]
    [Route("/api/identity/security-logs/[action]")]
    public class IdentitySecurityLogController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public IIdentitySecurityLogRepository Repository { get; }


        public IdentitySecurityLogController(
            IIdentitySecurityLogRepository repository
            )
        {
            Repository = repository;
        }
        [HttpGet]
        public async Task<PagedResultDto<IdentitySecurityLog>> GetAll(EventFilterDto filter)
        {
            var query = Repository.GetDbSet().AsQueryable();
            if (string.IsNullOrWhiteSpace(filter.Sorting))
            {
                filter.Sorting = nameof(IdentitySecurityLog.CreationTime) + " desc";
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
                query = query.Where(k => k.CreationTime >= filter.StartDate);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(k => k.CreationTime <= filter.EndDate);
            }
            return new PagedResultDto<IdentitySecurityLog>(
                await query.CountAsync(),
                await query.OrderBy(filter.Sorting).Skip(filter.SkipCount).Take(filter.MaxResultCount).ToListAsync()
            );
        }
    }
}