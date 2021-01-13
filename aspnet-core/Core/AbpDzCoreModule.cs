using System;
using AbpDz.Localization;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;
using Volo.Abp.VirtualFileSystem;

namespace AbpDz.Core
{
    [DependsOn(

    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule)
    )]
    public class AbpDzCoreModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<AbpDzCoreModule>();
            });

            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<AbpDzCoreModule>("AbpDz","/AbpDzUI");
            });

            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<AbpDzResource>("en")
                    // .AddBaseTypes(typeof(AbpValidationResource))
                    .AddVirtualJson("/AbpDzUI");

                options.DefaultResourceType = typeof(AbpDzResource);
            });

            Configure<AbpExceptionLocalizationOptions>(options =>
            {
                options.MapCodeNamespace("AbpDz", typeof(AbpDzResource));
            });
        }
        // public override void OnPostApplicationInitialization(Volo.Abp.ApplicationInitializationContext context)
        // {
        //     var ser = context.ServiceProvider.GetService(typeof(IVirtualFileProvider)) as IVirtualFileProvider;
        //     var d = ser.GetDirectoryContents("/AbpDzUI");
          
        //     Console.WriteLine(d.ToString());
        //     base.OnPostApplicationInitialization(context);
        // }
    }
}
