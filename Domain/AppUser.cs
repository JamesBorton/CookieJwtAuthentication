using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser, IUser
    {
        public int? ExternalID { get; set; }
        public string? DisplayName { get; set; }

    }
}
