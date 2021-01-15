using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AbpDz.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Users;

namespace AbpDz.Notifications
{
    public class AbpDzNotificationService : Volo.Abp.DependencyInjection.ITransientDependency
    {
        private readonly IAuthorizationService authorizationService;

        public AbpDzNotificationService(
            IHubContext<AbpDzNotificationHub> _hub,
            AbpDzNotificationServiceConfig config,
            ICurrentUser currentUser,
            IAuthorizationService _authorizationService,
            IHttpContextAccessor contextAccessor
            )
        {
            Hub = _hub;
            Config = config;
            CurrentUser = currentUser;
            authorizationService = _authorizationService;
            ContextAccessor = contextAccessor;
        }
        protected IHubContext<AbpDzNotificationHub> Hub { get; }
        public AbpDzNotificationServiceConfig Config { get; }
        public ICurrentUser CurrentUser { get; }

        public IHttpContextAccessor ContextAccessor { get; }
        public async Task RegisterClient()
        {

            if (CurrentUser.Id != null)
            {
                ContextAccessor.HttpContext.Request.Headers.TryGetValue("__signalr", out StringValues v);
                var f = v.FirstOrDefault();
                await Hub.Groups.AddToGroupAsync(f, "U:" + CurrentUser.Id.ToString());

                foreach (var item in Config.NotifyPermissions)
                {
                    if (await this.authorizationService.IsGrantedAsync(item.Key))
                    {
                        await Hub.Groups.AddToGroupAsync(f, "P:" + item.Key);
                    }
                }
            }

        }

        public async Task Notify(object data, string src, object type = null, object action = null, string id = null, List<string> groups = null, Guid? userId = null, string group = null, string permission = null)
        {
            if (groups == null) groups = new List<string>();

            if (userId != null)
            {
                groups.Add("U:" + userId.ToString());
            }
            if (!string.IsNullOrWhiteSpace(group))
            {
                groups.Add("G:" + group);
            }
            if (!string.IsNullOrWhiteSpace(permission))
            {
                groups.Add("P:" + permission);
            }
            string signalRId = null;

            ContextAccessor.HttpContext.Request.Headers.TryGetValue("__signalr", out StringValues v);
            signalRId = v.FirstOrDefault();


            await Hub.Clients.Groups(groups).SendAsync("Notify", src, type, action, id, data, DateTime.Now, signalRId, CurrentUser.Id);
        }

    }
}