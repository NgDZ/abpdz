using System;

namespace AbpDz.IdentityServer
{
    public class CodeSendDetails
    {
        public string Email { get; set; }
        public string UserCode { get; set; }
        public int Attempts { get; set; }
        public DateTime SendTime { get; set; }

        public Guid Id { get; set; }

        public string DeviceCode { get; set; }


        public string SubjectId { get; set; }

        public string SessionId { get; set; }

        public string ClientId { get; set; }

        public string Description { get; set; }

        public DateTime? Expiration { get; set; }

        public string Data { get; set; }
    }
}
