import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Settings } from "lucide-react";

interface ServerHeaderProps {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  isConnected: boolean;
  serverStatus: "online" | "offline" | "starting" | "stopping";
  onConnect: () => void;
  onStartServer: () => void;
  onStopServer: () => void;
}

export const ServerHeader = ({
  serverUrl,
  setServerUrl,
  isConnected,
  serverStatus,
  onConnect,
  onStartServer,
  onStopServer,
}: ServerHeaderProps) => {
  const [tempUrl, setTempUrl] = useState(serverUrl);

  const getStatusBadge = () => {
    switch (serverStatus) {
      case "online":
        return <Badge className="bg-success text-success-foreground">Online</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "starting":
        return <Badge className="bg-warning text-warning-foreground animate-pulse">Starting...</Badge>;
      case "stopping":
        return <Badge className="bg-warning text-warning-foreground animate-pulse">Stopping...</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-gradient-gaming border-minecraft-green/20">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Nukkit Server Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="ws://localhost:19132"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-64 bg-background/50 border-border"
              />
              <Button
                onClick={() => {
                  setServerUrl(tempUrl);
                  onConnect();
                }}
                variant="minecraft"
                disabled={!tempUrl}
              >
                Connect
              </Button>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onStartServer}
            variant="server"
            size="lg"
            disabled={serverStatus === "starting" || serverStatus === "online"}
          >
            <Play className="w-4 h-4" />
            Start Server
          </Button>
          <Button
            onClick={onStopServer}
            variant="destructive"
            size="lg"
            disabled={serverStatus === "stopping" || serverStatus === "offline"}
          >
            <Square className="w-4 h-4" />
            Stop Server
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};