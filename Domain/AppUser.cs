using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public int? ExternalID { get; set; }
        public string? DisplayName { get; set; }

    }
}
