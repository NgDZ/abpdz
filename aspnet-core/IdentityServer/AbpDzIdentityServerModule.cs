using System;
using IdentityServer4.Validation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Account;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.IdentityServer;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;

namespace AbpDz.IdentityServer
{
    [DependsOn(
    typeof(AbpAccountApplicationModule),
    typeof(AbpIdentityServerDomainModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule)
    )]
    public class AbpDzIdentityServerModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<AbpDzIdentityServerModule>();
            });

            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(AbpDzIdentityServerModule).Assembly);

            });
            context.Services.Replace(ServiceDescriptor.Transient<Volo.Abp.IdentityServer.AspNetIdentity.AbpResourceOwnerPasswordValidator, TwoFactorAbpResourceOwnerPasswordValidator>());
            context.Services.Add(ServiceDescriptor.Transient<IResourceOwnerPasswordValidator, TwoFactorAbpResourceOwnerPasswordValidator>());

        }
    }
}
