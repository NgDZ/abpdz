using System;
using AbpDz.Models;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore.Modeling;


namespace Volo.Docs.EntityFrameworkCore
{
    public static class NotificationsDbContextModelBuilderExtensions
    {
        public static void ConfigureDocs(
          this ModelBuilder builder,
            Action<AbpModelBuilderConfigurationOptions> optionsAction = null)
        {
            Check.NotNull(builder, nameof(builder));

            var options = new AbpModelBuilderConfigurationOptions(
                AbpCommonDbProperties.DbTablePrefix,
                AbpCommonDbProperties.DbSchema
            );

            optionsAction?.Invoke(options);

            builder.Entity<AbpDzNotificationInfo>(b =>
            {
                b.ToTable(nameof(AbpDzNotificationInfo), options.Schema);
                b.HasIndex(k => k.SenderId);
                b.HasIndex(k => k.RecipientId);
                b.HasIndex(k => k.RecipientRoleId);
                b.HasIndex(k => k.Code);
                b.HasIndex(k => k.RecipientPermission);
                b.HasIndex(k => k.DataTypeName);
                b.HasIndex(k => k.EntityId);
                b.HasIndex(k => k.Severity);
                b.HasIndex(k => k.State);
                b.ConfigureByConvention();


            });


        }
    }
}