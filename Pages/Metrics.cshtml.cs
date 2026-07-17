using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CloudPulse.Pages;

public class MetricsModel : PageModel
{
    private readonly ILogger<MetricsModel> _logger;

    public MetricsModel(ILogger<MetricsModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
    }
}
