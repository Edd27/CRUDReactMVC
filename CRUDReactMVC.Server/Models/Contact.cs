using System;
using System.Collections.Generic;

namespace CRUDReactMVC.Server.Models;

public partial class Contact
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }
}
