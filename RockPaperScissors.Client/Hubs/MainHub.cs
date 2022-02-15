using Microsoft.AspNetCore.SignalR;

namespace RockPaperScissors.Client.Hubs;

public class MainHub : Hub
{
    public async Task SelectPaper()
    {
        this.Clients.All.SendAsync("ShowResult");
    }
    
    public async Task SelectRock()
    {
        this.Clients.All.SendAsync("ShowResult");
    }
    
    public async Task SelectScissors()
    {
        this.Clients.All.SendAsync("ShowResult");
    }
}