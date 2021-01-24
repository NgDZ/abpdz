using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AbpDz.Core;
using AbpDz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore.Modeling;


namespace AbpDz.Notifications
{

    [RemoteService]
    [ApiExplorerSettings(GroupName = "Notification")]
    [Route("api/abpdz-notification/[action]")]
    public class AbpDzNotificationController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public AbpDzNotificationController(
             AbpDzNotificationService notificationService
             )
        {
            NotificationService = notificationService;
        }

        public AbpDzNotificationService NotificationService { get; }

        [HttpGet()]
        public async Task Register()
        {

            await this.NotificationService.RegisterClient();

        }

        [HttpGet]
        public async Task<PagedResultDto<AbpDzNotificationInfo>> GetAll(EventFilterDto filter)
        {
            if (!CurrentUser.IsAuthenticated)
            {
                return new PagedResultDto<AbpDzNotificationInfo>(0, Array.Empty<AbpDzNotificationInfo>());
            }
            var repo = GetRepository();

            var Config = this.ServiceProvider.GetService(typeof(AbpDzNotificationServiceConfig)) as AbpDzNotificationServiceConfig;
            var query = repo.AsQueryable();
            var permissions = new List<string>();
            if (filter.Checked == true)
            {
                await this.Register();
            }


            if (CurrentUser.Id != filter.UserId && !await AuthorizationService.IsGrantedAsync("AbpIdentity.Users.Create"))
            {
                filter.UserId = CurrentUser.Id;
            }
            foreach (var item in Config.NotifyPermissions)
            {
                if (await this.AuthorizationService.IsGrantedAsync(item.Key))
                {
                    permissions.Add(item.Key);
                }
            }

            if (permissions.Count > 0)
            {
                query = query.Where(k => permissions.Contains(k.RecipientPermission));
            }
            if (filter.UserId.HasValue)
            {
                query = query.Where(k => k.RecipientId == filter.UserId);
            }
            if (filter.StartDate.HasValue)
            {
                query = query.Where(k => k.CreationTime >= filter.StartDate);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(k => k.CreationTime <= filter.EndDate);
            }
            return new SummaryPagedResultDto<AbpDzNotificationInfo>(
                await query.CountAsync(),
                await query.OrderByDescending(k=>k.CreationTime).Skip(filter.SkipCount).Take(filter.MaxResultCount).ToListAsync()
            // await query.Where(k => k.State == AbpDzMessageState.Unread).CountAsync()

            );
        }

        private IRepository<AbpDzNotificationInfo, Guid> GetRepository()
        {
            return this.ServiceProvider.GetService(typeof(IRepository<AbpDzNotificationInfo, Guid>)) as IRepository<AbpDzNotificationInfo, Guid>;
        }

        [HttpGet()]
        public async Task Ping(bool persiste = false)
        {

            await this.NotificationService.CreateNotification(new AbpDzNotificationInfo()
            {
                // Id = Guid.NewGuid(),
                CreationTime = DateTime.Now,
                NotificationName = "Bonjour:" + DateTime.Now.ToFileTime().ToString(),
                RecipientId = CurrentUser.Id,

            }, persiste);

        }

        [HttpPost()]
        public async Task Dismiss(HashSet<Guid> ids)
        {
            var repo = GetRepository();
            var items = await repo.Where(k => ids.Contains(k.Id)).ToListAsync();

            foreach (var item in items)
            {
                item.State = AbpDzMessageState.Read;
            }
            foreach (var id in ids)
            {
                await this.NotificationService.Notify(
                      new
                      {
                          State = AbpDzMessageState.Read
                      },
                      nameof(AbpDzNotificationService),
                      nameof(AbpDzNotificationInfo),
                      CrudOperation.Update,
                      id.ToString(),
                      null,
                      this.CurrentUser.Id);
            }
        }

    }
}