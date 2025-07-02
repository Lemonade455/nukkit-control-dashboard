import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star, Send, Search } from "lucide-react";

interface Command {
  name: string;
  description: string;
  syntax: string;
  category: string;
  isFavorite?: boolean;
}

const NUKKIT_COMMANDS: Command[] = [
  { name: "gamemode", description: "Change game mode", syntax: "/gamemode <mode> [player]", category: "server" },
  { name: "tp", description: "Teleport player", syntax: "/tp <player> [target]", category: "server" },
  { name: "give", description: "Give items to player", syntax: "/give <player> <item> [amount]", category: "server" },
  { name: "kick", description: "Kick a player", syntax: "/kick <player> [reason]", category: "moderation" },
  { name: "ban", description: "Ban a player", syntax: "/ban <player> [reason]", category: "moderation" },
  { name: "whitelist", description: "Manage whitelist", syntax: "/whitelist <add|remove|list> [player]", category: "server" },
  { name: "weather", description: "Change weather", syntax: "/weather <clear|rain|thunder>", category: "world" },
  { name: "time", description: "Change time", syntax: "/time set <time>", category: "world" },
  { name: "difficulty", description: "Change difficulty", syntax: "/difficulty <peaceful|easy|normal|hard>", category: "world" },
  { name: "save-all", description: "Save the world", syntax: "/save-all", category: "server" },
  { name: "stop", description: "Stop the server", syntax: "/stop", category: "server" },
];

interface CommandPanelProps {
  onExecuteCommand: (command: string) => void;
  favorites: string[];
  onToggleFavorite: (commandName: string) => void;
}

export const CommandPanel = ({ onExecuteCommand, favorites, onToggleFavorite }: CommandPanelProps) => {
  const [customCommand, setCustomCommand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const favoriteCommands = NUKKIT_COMMANDS.filter(cmd => favorites.includes(cmd.name));
  const filteredCommands = NUKKIT_COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecuteCommand = (command: string) => {
    onExecuteCommand(command);
  };

  const handleCustomCommand = () => {
    if (customCommand.trim()) {
      handleExecuteCommand(customCommand);
      setCustomCommand("");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Server Commands</span>
          <Badge variant="secondary">{NUKKIT_COMMANDS.length} commands</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Command Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom command..."
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCustomCommand()}
            className="flex-1"
          />
          <Button 
            onClick={handleCustomCommand}
            disabled={!customCommand.trim()}
            variant="minecraft"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredCommands.map((command) => (
                  <CommandItem
                    key={command.name}
                    command={command}
                    isFavorite={favorites.includes(command.name)}
                    onExecute={handleExecuteCommand}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {favoriteCommands.length > 0 ? (
                  favoriteCommands.map((command) => (
                    <CommandItem
                      key={command.name}
                      command={command}
                      isFavorite={true}
                      onExecute={handleExecuteCommand}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No favorite commands yet. Click the star icon to add favorites.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="server">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredCommands.filter(cmd => cmd.category === "server").map((command) => (
                  <CommandItem
                    key={command.name}
                    command={command}
                    isFavorite={favorites.includes(command.name)}
                    onExecute={handleExecuteCommand}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="plugins">
            <ScrollArea className="h-[400px]">
              <div className="text-center py-8 text-muted-foreground">
                <p>Plugin commands will appear here when plugins are detected.</p>
                <p className="text-sm mt-2">Connect to your server to auto-discover plugin commands.</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface CommandItemProps {
  command: Command;
  isFavorite: boolean;
  onExecute: (command: string) => void;
  onToggleFavorite: (commandName: string) => void;
}

const CommandItem = ({ command, isFavorite, onExecute, onToggleFavorite }: CommandItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {command.name}
          </code>
          <Badge variant="outline" className="text-xs">
            {command.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{command.description}</p>
        <code className="text-xs text-muted-foreground">{command.syntax}</code>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          size="sm"
          variant={isFavorite ? "favorite" : "outline"}
          onClick={() => onToggleFavorite(command.name)}
        >
          <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <Button
          size="sm"
          variant="minecraft"
          onClick={() => onExecute(command.syntax)}
        >
          Execute
        </Button>
      </div>
    </div>
  );
};