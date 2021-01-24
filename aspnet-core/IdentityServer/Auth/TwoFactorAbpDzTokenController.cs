using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace AbpDz.IdentityServer
{
    public class SetCodeDto
    {
        public string UserName { get; set; }
    }
    [ApiExplorerSettings(IgnoreApi=true)] 
    public class TwoFactorAbpDzTokenController : Controller
    {
        public TwoFactorAbpDzTokenController(TwoFactorAbpTokenGenerator TwoFactorAbpTokenGenerator)
        {
            this.TwoFactorAbpTokenGenerator = TwoFactorAbpTokenGenerator;
        }

        public TwoFactorAbpTokenGenerator TwoFactorAbpTokenGenerator { get; }

        [HttpPost("/connect/token_code")]
        public async Task SetCode([FromBody] SetCodeDto body)
        {
            await TwoFactorAbpTokenGenerator.SendToken(body.UserName);
        }
    }
}
