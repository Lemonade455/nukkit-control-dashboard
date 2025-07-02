import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gamepad2, Users, Settings as SettingsIcon } from "lucide-react";

interface GameModePanelProps {
  currentGameMode: string;
  cheatsEnabled: boolean;
  onGameModeChange: (mode: string) => void;
  onCheatsToggle: (enabled: boolean) => void;
  onExecuteCommand: (command: string) => void;
}

const GAME_MODES = [
  { value: "survival", label: "Survival", description: "Default survival experience", color: "minecraft-green" },
  { value: "creative", label: "Creative", description: "Unlimited resources and flight", color: "minecraft-blue" },
  { value: "adventure", label: "Adventure", description: "Exploration focused gameplay", color: "minecraft-gold" },
  { value: "spectator", label: "Spectator", description: "Observe without interaction", color: "muted" },
];

const QUICK_COMMANDS = [
  { name: "Give Diamond Sword", command: "/give @p diamond_sword 1", category: "items" },
  { name: "Give Elytra", command: "/give @p elytra 1", category: "items" },
  { name: "Set Day", command: "/time set day", category: "world" },
  { name: "Set Night", command: "/time set night", category: "world" },
  { name: "Clear Weather", command: "/weather clear", category: "world" },
  { name: "Rain", command: "/weather rain", category: "world" },
  { name: "Teleport Spawn", command: "/tp @p ~ ~100 ~", category: "teleport" },
  { name: "Heal Player", command: "/effect @p instant_health 1 255", category: "effects" },
];

export const GameModePanel = ({
  currentGameMode,
  cheatsEnabled,
  onGameModeChange,
  onCheatsToggle,
  onExecuteCommand,
}: GameModePanelProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState("@p");

  const handleGameModeChange = (newMode: string) => {
    onGameModeChange(newMode);
    onExecuteCommand(`/gamemode ${newMode} ${selectedPlayer}`);
  };

  const getCurrentModeInfo = () => {
    return GAME_MODES.find(mode => mode.value === currentGameMode) || GAME_MODES[0];
  };

  return (
    <div className="space-y-6">
      {/* Game Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Game Mode Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="gamemode-select">Current Game Mode</Label>
              <Select value={currentGameMode} onValueChange={handleGameModeChange}>
                <SelectTrigger id="gamemode-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GAME_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-${mode.color}`}>{mode.label}</Badge>
                        <span className="text-sm text-muted-foreground">{mode.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cheats"
                checked={cheatsEnabled}
                onCheckedChange={onCheatsToggle}
              />
              <Label htmlFor="cheats">Enable Cheats</Label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="player-select">Target Player</Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger id="player-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="@p">Nearest Player</SelectItem>
                <SelectItem value="@a">All Players</SelectItem>
                <SelectItem value="@s">Self</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current:</span>
            <Badge className={`bg-${getCurrentModeInfo().color}`}>
              {getCurrentModeInfo().label}
            </Badge>
            <Badge variant={cheatsEnabled ? "default" : "secondary"}>
              {cheatsEnabled ? "Cheats ON" : "Cheats OFF"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Quick Commands
            {!cheatsEnabled && (
              <Badge variant="destructive" className="text-xs">
                Requires Cheats
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_COMMANDS.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onExecuteCommand(cmd.command)}
                disabled={!cheatsEnabled && cmd.category !== "world"}
                className="justify-start h-auto p-3"
              >
                <div className="text-left">
                  <div className="font-medium text-sm">{cmd.name}</div>
                  <code className="text-xs text-muted-foreground">{cmd.command}</code>
                </div>
              </Button>
            ))}
          </div>
          
          {!cheatsEnabled && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ⚠️ Most quick commands require cheats to be enabled. 
                Enable cheats above to use item giving, effects, and teleportation commands.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Player Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="server"
              onClick={() => onExecuteCommand("/list")}
            >
              List Players
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand("/whitelist list")}
            >
              Show Whitelist
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onExecuteCommand(`/difficulty peaceful`)}
            >
              Peaceful Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand(`/difficulty easy`)}
            >
              Easy Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand(`/difficulty normal`)}
            >
              Normal Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand(`/difficulty hard`)}
            >
              Hard Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};