using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServices.Interfaces
{
    public interface IIdentityUser
    {
        public string DisplayName { get; set; }
    }
}
