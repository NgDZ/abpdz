
using IdentityServer4.AspNetIdentity;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.IdentityServer.Localization;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Volo.Abp.IdentityServer.AspNetIdentity;
using DependencyAttribute = Volo.Abp.DependencyInjection.DependencyAttribute;
using Microsoft.AspNetCore.Http;
using IdentityServer4.Models;
using System;
using Volo.Abp.Settings;

namespace AbpDz.IdentityServer
{
    [Dependency(ReplaceServices = true)]

    public class TwoFactorAbpResourceOwnerPasswordValidator : AbpResourceOwnerPasswordValidator
    {
        private readonly ISettingProvider settingProvider;

        public TwoFactorAbpResourceOwnerPasswordValidator(
            UserManager<Volo.Abp.Identity.IdentityUser> userManager,
            SignInManager<Volo.Abp.Identity.IdentityUser> signInManager,
            IdentitySecurityLogManager identitySecurityLogManager,
            ILogger<ResourceOwnerPasswordValidator<Volo.Abp.Identity.IdentityUser>> logger,
            IStringLocalizer<AbpIdentityServerResource> localizer,
            IOptions<AbpIdentityOptions> abpIdentityOptions,
            IHybridServiceScopeFactory serviceScopeFactory,
            ISettingProvider settingProvider,
            IServiceProvider serviceProvider,
            IOptions<IdentityOptions> identityOptions) :
            base(userManager, signInManager, identitySecurityLogManager, logger, localizer, abpIdentityOptions, serviceScopeFactory, identityOptions)
        {
            this.settingProvider = settingProvider;
            ServiceProvider = serviceProvider;
        }

        public IHttpContextAccessor ContextAccessor { get; }
        public IServiceProvider ServiceProvider { get; }

        [UnitOfWork]
        public async override Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            if (await settingProvider.GetOrNullAsync("Abp.Identity.TwoFactor.Behaviour") == "Forced")
            {

                var form = ((IHttpContextAccessor)this.ServiceProvider.GetService(typeof(IHttpContextAccessor))).HttpContext.Request.Form;

                if (!(form.ContainsKey("2F_CODE") && await ((TwoFactorAbpTokenGenerator)this.ServiceProvider.GetService(typeof(TwoFactorAbpTokenGenerator))).CheckToken(context.UserName, form["2F_CODE"], context)))
                {
                    // context.Result = new GrantValidationResult(TokenRequestErrors.InvalidRequest, "Invalid two factor code");
                    return;
                }
            }

            await base.ValidateAsync(context);

        }
    }
}
