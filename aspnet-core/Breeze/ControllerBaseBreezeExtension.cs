using System.IO;
using System.Threading.Tasks;
using Breeze.Persistence;
using Microsoft.AspNetCore.Http;

namespace Microsoft.AspNetCore.Mvc
{
    public static class ControllerBaseBreezeExtension
    {
        public static async Task<SaveResult> BreezeSaveChanges(this ControllerBase controller, PersistenceManager persistenceManager)
        {
            var bodyStr = "";
            var req = controller.HttpContext.Request;
            req.EnableBuffering();

            using (var stream = new StreamReader(req.Body))
            {
                bodyStr = await stream.ReadToEndAsync();
                var body = Newtonsoft.Json.Linq.JObject.Parse(bodyStr);
                return persistenceManager.SaveChanges(body);
            }

        }
        public static async Task<SaveResult> BreezeSaveChanges(this ControllerBase controller, PersistenceManager persistenceManager, object obj)
        {
            var bodyStr = System.Text.Json.JsonSerializer.Serialize(obj);
            var body = Newtonsoft.Json.Linq.JObject.Parse(bodyStr);
            return persistenceManager.SaveChanges(body);
        }
    }
}