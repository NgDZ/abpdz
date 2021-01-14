using System;
using System.Linq;
using System.Threading.Tasks;
using AbpDz.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore.Modeling;


namespace AbpDz.Notifications
{

    [RemoteService]
    [ApiExplorerSettings(GroupName = "Notification")]
    public class AbpDzNotificationController : AbpController, Volo.Abp.DependencyInjection.ITransientDependency
    {
        public AbpDzNotificationController(
             AbpDzNotificationService notificationService
             )
        {
            NotificationService = notificationService;
        }

        public AbpDzNotificationService NotificationService { get; }

        [HttpGet("/api/abpdz-notification/register")]
        public async Task RegisterClient()
        {

            await this.NotificationService.RegisterClient();

        }

        [HttpGet("/api/abpdz-notification/ping")]
        public async Task Ping()
        {

            await this.NotificationService.Notify("Ping data", "Ping");

        }

    }
}