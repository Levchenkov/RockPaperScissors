using Microsoft.AspNetCore.SignalR;

namespace RockPaperScissors.Client.Hubs;

public record PlayerState(string Name, string Selection, bool IsReady);

public class MainHub : Hub
{
    public const string Rock = "rock";
    public const string Paper = "paper";
    public const string Scissors = "scissors";
    
    private static readonly Dictionary<string, int> _score = new();
    private static readonly Dictionary<string, PlayerState> _state = new();

    public async Task Join(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return;
        }
        
        if (!_score.ContainsKey(name))
        {
            _score[name] = 0;
        }
        _state[name] = new PlayerState(name, Rock, false);
        await Clients.All.SendAsync("ReceiveScore", _score);
    }
    
    public async Task Ready(string name)
    {
        _state[name] = _state[name] with { IsReady = true };
        if (IsAllReady())
        {
            UpdateScore();
            await Clients.All.SendAsync("ReceiveState", _state);
        }
    }

    private void UpdateScore()
    {
        if (_state.Count != 2)
        {
            throw new NotSupportedException();
        }

        var winner = GetWinner();

        if (string.IsNullOrEmpty(winner))
        {
            return;
        }

        _score[winner] += 1;
    }
    
    public async Task SelectPaper(string name)
    {
        if (IsAllReady())
        {
            return;
        }
        _state[name] = _state[name] with { Selection = Paper };
    }
    
    public async Task SelectRock(string name)
    {
        if (IsAllReady())
        {
            return;
        }
        _state[name] = _state[name] with { Selection = Rock };
    }
    
    public async Task SelectScissors(string name)
    {
        if (IsAllReady())
        {
            return;
        }
        _state[name] = _state[name] with { Selection = Scissors };
    }
    
    private bool IsAllReady() => _state.Count > 1 && _state.All(x => x.Value.IsReady);

    private string GetWinner()
    {
        var first = _state.Values.First();
        var second = _state.Values.Last();

        if (first.Selection == Paper)
        {
            if (second.Selection == Paper)
            {
                return string.Empty; // draw
            }
            
            if (second.Selection == Rock)
            {
                return first.Name;
            }
            
            if (second.Selection == Scissors)
            {
                return second.Name;
            }
        }

        if (first.Selection == Rock)
        {
            if (second.Selection == Paper)
            {
                return second.Name;
            }
            
            if (second.Selection == Rock)
            {
                return string.Empty;
            }
            
            if (second.Selection == Scissors)
            {
                return first.Name;
            }
        }

        if (first.Selection == Scissors)
        {
            if (second.Selection == Paper)
            {
                return first.Name;
            }
            
            if (second.Selection == Rock)
            {
                return second.Name;
            }
            
            if (second.Selection == Scissors)
            {
                return string.Empty;
            }
        }

        return string.Empty;
    }
}