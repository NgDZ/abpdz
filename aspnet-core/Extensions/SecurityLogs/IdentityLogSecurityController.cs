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

namespace AbpDz.Notifications
{

    [RemoteService]
    [Authorize]
    [ApiExplorerSettings(GroupName = "Notification")]
    [Route("/api/[controller]/[action]")]
    public class IdentityLogSecurityController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public IRepository<IdentitySecurityLog, Guid> Repository { get; }


        public IdentityLogSecurityController(
            IRepository<IdentitySecurityLog, Guid> repository
            )
        {
            Repository = repository;
        }
        [HttpGet]
        public async Task<PagedResultDto<IdentitySecurityLog>> GetAll(EventFilterDto filter)
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
                query = query.Where(k => k.CreationTime >= filter.StartDate);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(k => k.CreationTime <= filter.EndDate);
            }
            return new PagedResultDto<IdentitySecurityLog>(
                await query.CountAsync(),
                await query.ToListAsync()
            );
        }
    }
}