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
    [Route("/api/identity/organization-units/")]
    public class OrganizationUnitsController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public IRepository<OrganizationUnit> Repository { get; }


        public OrganizationUnitsController(
            IRepository<OrganizationUnit> repository
            )
        {
            Repository = repository;
        } 
        
        [HttpGet("all")]
        public async Task<PagedResultDto<OrganizationUnit>> All(EventFilterDto filter)
        {
            var query = Repository.GetDbSet().AsQueryable();

            if (CurrentUser.Id != filter.UserId && !await AuthorizationService.IsGrantedAsync("AbpIdentity.Users.Create"))
            {
                filter.UserId = CurrentUser.Id;
            }
            if (!string.IsNullOrWhiteSpace(filter.Filter))
            {
                query = query.Where(k => k.DisplayName.ToLower().Contains(filter.Filter.ToLower()));
            }

            if (filter.StartDate.HasValue)
            {
                query = query.Where(k => k.CreationTime >= filter.StartDate);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(k => k.CreationTime <= filter.EndDate);
            }
            var r = await query.ToListAsync();
            return new PagedResultDto<OrganizationUnit>(r.Count, r);
        }
    }
}