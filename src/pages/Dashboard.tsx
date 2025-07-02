import { useState, useEffect } from "react";
import { ServerHeader } from "@/components/ServerHeader";
import { CommandPanel } from "@/components/CommandPanel";
import { ServerConsole } from "@/components/ServerConsole";
import { GameModePanel } from "@/components/GameModePanel";
import { WorldManager } from "@/components/WorldManager";
import { ServerPropertiesEditor } from "@/components/ServerPropertiesEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
}

export default function Dashboard() {
  const [serverUrl, setServerUrl] = useState("ws://localhost:19132");
  const [isConnected, setIsConnected] = useState(false);
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "starting" | "stopping">("offline");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentGameMode, setCurrentGameMode] = useState("survival");
  const [cheatsEnabled, setCheatsEnabled] = useState(false);
  const [serverProperties, setServerProperties] = useState<Record<string, any>>({
    "server-name": "Nukkit Server",
    "server-port": 19132,
    "max-players": 20,
    "gamemode": "survival",
    "difficulty": "easy",
    "level-name": "world",
  });

  const [worlds] = useState([
    { name: "world", type: "normal" as const, size: "125 MB", lastPlayed: "2 hours ago", isActive: true },
    { name: "creative_world", type: "flat" as const, size: "45 MB", lastPlayed: "1 day ago", isActive: false },
    { name: "adventure_map", type: "normal" as const, size: "89 MB", lastPlayed: "3 days ago", isActive: false },
  ]);

  const { toast } = useToast();

  // Simulate connection to server
  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Connected to Server",
      description: `Successfully connected to ${serverUrl}`,
    });
    // Add some sample logs
    addLog("INFO", "Dashboard connected to Nukkit server");
    addLog("INFO", "Server version: Nukkit 1.0.0");
  };

  const handleStartServer = () => {
    setServerStatus("starting");
    setTimeout(() => {
      setServerStatus("online");
      addLog("INFO", "Server started successfully on port 19132");
      addLog("INFO", "Done! For help, type \"help\" or \"?\"");
    }, 2000);
  };

  const handleStopServer = () => {
    setServerStatus("stopping");
    setTimeout(() => {
      setServerStatus("offline");
      addLog("INFO", "Stopping server...");
      addLog("INFO", "Server stopped");
    }, 1500);
  };

  const addLog = (level: LogEntry["level"], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleExecuteCommand = (command: string) => {
    addLog("INFO", `> ${command}`);
    
    // Simulate command responses
    setTimeout(() => {
      if (command.includes("/gamemode")) {
        addLog("INFO", "Game mode updated for player");
      } else if (command.includes("/give")) {
        addLog("INFO", "Given item to player");
      } else if (command.includes("/tp")) {
        addLog("INFO", "Teleported player");
      } else if (command.includes("/list")) {
        addLog("INFO", "There are 3/20 players online: Player1, Player2, Player3");
      } else if (command.includes("/weather")) {
        addLog("INFO", "Weather changed");
      } else if (command.includes("/time")) {
        addLog("INFO", "Time set");
      } else {
        addLog("INFO", "Command executed successfully");
      }
    }, 100);
  };

  const handleToggleFavorite = (commandName: string) => {
    setFavorites(prev => 
      prev.includes(commandName) 
        ? prev.filter(name => name !== commandName)
        : [...prev, commandName]
    );
  };

  const handleGameModeChange = (mode: string) => {
    setCurrentGameMode(mode);
    toast({
      title: "Game Mode Changed",
      description: `Game mode set to ${mode}`,
    });
  };

  const handleCheatsToggle = (enabled: boolean) => {
    setCheatsEnabled(enabled);
    toast({
      title: enabled ? "Cheats Enabled" : "Cheats Disabled",
      description: enabled ? "Cheats are now enabled on the server" : "Cheats have been disabled",
    });
  };

  const handleChangeWorld = (worldName: string) => {
    toast({
      title: "World Changed",
      description: `Switching to world: ${worldName}`,
    });
    addLog("INFO", `Loading world: ${worldName}`);
  };

  const handleCreateWorld = (worldConfig: any) => {
    toast({
      title: "World Created",
      description: `Created new world: ${worldConfig.name}`,
    });
    addLog("INFO", `Created world "${worldConfig.name}" with type: ${worldConfig.type}`);
  };

  const handleSaveProperties = (properties: Record<string, any>) => {
    setServerProperties(properties);
    toast({
      title: "Properties Saved",
      description: "Server properties updated. Restart server to apply changes.",
    });
    addLog("INFO", "Server properties updated");
  };

  const clearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs Cleared",
      description: "Console logs have been cleared",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Server Header */}
      <ServerHeader
        serverUrl={serverUrl}
        setServerUrl={setServerUrl}
        isConnected={isConnected}
        serverStatus={serverStatus}
        onConnect={handleConnect}
        onStartServer={handleStartServer}
        onStopServer={handleStopServer}
      />

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="console" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="console">Console</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="gamemode">Game Settings</TabsTrigger>
          <TabsTrigger value="worlds">World Manager</TabsTrigger>
          <TabsTrigger value="properties">Server Config</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <div className="lg:col-span-2">
              <ServerConsole
                logs={logs}
                onSendCommand={handleExecuteCommand}
                onClearLogs={clearLogs}
              />
            </div>
            <div>
              <CommandPanel
                onExecuteCommand={handleExecuteCommand}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commands" className="space-y-0">
          <div className="h-[600px]">
            <CommandPanel
              onExecuteCommand={handleExecuteCommand}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </TabsContent>

        <TabsContent value="gamemode" className="space-y-0">
          <div className="h-[600px] overflow-y-auto">
            <GameModePanel
              currentGameMode={currentGameMode}
              cheatsEnabled={cheatsEnabled}
              onGameModeChange={handleGameModeChange}
              onCheatsToggle={handleCheatsToggle}
              onExecuteCommand={handleExecuteCommand}
            />
          </div>
        </TabsContent>

        <TabsContent value="worlds" className="space-y-0">
          <div className="h-[600px]">
            <WorldManager
              worlds={worlds}
              activeWorld="world"
              onChangeWorld={handleChangeWorld}
              onCreateWorld={handleCreateWorld}
              onExecuteCommand={handleExecuteCommand}
            />
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-0">
          <div className="h-[600px]">
            <ServerPropertiesEditor
              properties={serverProperties}
              onSave={handleSaveProperties}
              onExecuteCommand={handleExecuteCommand}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}