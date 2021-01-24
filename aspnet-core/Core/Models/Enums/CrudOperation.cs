namespace AbpDz.Models
{
    public enum CrudOperation
    {
        Read = 1,
        Create = 2,
        Update = 4,
        Delete = 8,
        None = 0,
    }
}

