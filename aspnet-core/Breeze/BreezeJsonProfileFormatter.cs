using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using Breeze.Core;
using System.Buffers;
using Microsoft.Net.Http.Headers;

namespace AbpDz.Breeze
{
    public class BreezeJsonProfileFormatter : NewtonsoftJsonOutputFormatter
    {
        public BreezeJsonProfileFormatter(MvcOptions mvcOptions) : base(
            new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver()
            }, ArrayPool<char>.Shared, mvcOptions)
        {
            SupportedMediaTypes.Clear();
            var ss = JsonSerializationFns.UpdateWithDefaults(this.SerializerSettings);
            var resolver = ss.ContractResolver;
            if (resolver != null)
            {
                var res = resolver as DefaultContractResolver;
                res.NamingStrategy = null;  // <<!-- this removes the camelcasing
            };
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("breeze/json"));
        }

    }
}
