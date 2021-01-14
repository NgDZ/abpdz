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
    public class AbpDzNotificationServiceConfig : Volo.Abp.DependencyInjection.ISingletonDependency
    {
        // register only permission that need to listned for signalr 
        public System.Collections.Concurrent.ConcurrentDictionary<string, int> NotifyPermissions { get; set; } = new System.Collections.Concurrent.ConcurrentDictionary<string, int>();

        // register permission for notification 
        public void RegisterPermission(string key)
        {
            this.NotifyPermissions.TryAdd(key, 1);
        }
    }
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
            }

        }

     
    }
}