import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServerProperty {
  key: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
  description: string;
  category: string;
}

const SERVER_PROPERTIES: ServerProperty[] = [
  // Server Settings
  { key: "server-name", value: "Nukkit Server", type: "string", description: "Server name displayed in server list", category: "server" },
  { key: "server-port", value: 19132, type: "number", description: "Server port", category: "server" },
  { key: "server-ip", value: "0.0.0.0", type: "string", description: "Server IP address", category: "server" },
  { key: "max-players", value: 20, type: "number", description: "Maximum number of players", category: "server" },
  { key: "white-list", value: false, type: "boolean", description: "Enable whitelist", category: "server" },
  { key: "announce-player-achievements", value: true, type: "boolean", description: "Announce player achievements", category: "server" },
  
  // World Settings
  { key: "level-name", value: "world", type: "string", description: "World folder name", category: "world" },
  { key: "level-type", value: "DEFAULT", type: "select", options: ["DEFAULT", "FLAT", "NORMAL"], description: "World generation type", category: "world" },
  { key: "level-seed", value: "", type: "string", description: "World seed", category: "world" },
  { key: "generate-structures", value: true, type: "boolean", description: "Generate structures", category: "world" },
  { key: "spawn-protection", value: 16, type: "number", description: "Spawn protection radius", category: "world" },
  
  // Gameplay
  { key: "gamemode", value: "survival", type: "select", options: ["survival", "creative", "adventure", "spectator"], description: "Default game mode", category: "gameplay" },
  { key: "difficulty", value: "easy", type: "select", options: ["peaceful", "easy", "normal", "hard"], description: "Difficulty level", category: "gameplay" },
  { key: "allow-cheats", value: false, type: "boolean", description: "Allow cheats", category: "gameplay" },
  { key: "allow-flight", value: false, type: "boolean", description: "Allow flight in survival", category: "gameplay" },
  
  // Performance
  { key: "view-distance", value: 10, type: "number", description: "View distance in chunks", category: "performance" },
  { key: "max-threads", value: 8, type: "number", description: "Maximum threads", category: "performance" },
  { key: "auto-save", value: true, type: "boolean", description: "Enable auto-save", category: "performance" },
];

interface ServerPropertiesEditorProps {
  properties: Record<string, any>;
  onSave: (properties: Record<string, any>) => void;
  onExecuteCommand: (command: string) => void;
}

export const ServerPropertiesEditor = ({ 
  properties: initialProperties, 
  onSave,
  onExecuteCommand 
}: ServerPropertiesEditorProps) => {
  const [properties, setProperties] = useState<Record<string, any>>(initialProperties);
  const [hasChanges, setHasChanges] = useState(false);
  const [rawConfig, setRawConfig] = useState("");
  const { toast } = useToast();

  const updateProperty = (key: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(properties);
    setHasChanges(false);
    toast({
      title: "Properties Saved",
      description: "Server properties have been updated successfully.",
    });
  };

  const handleReset = () => {
    setProperties(initialProperties);
    setHasChanges(false);
  };

  const exportConfig = () => {
    const configText = Object.entries(properties)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const blob = new Blob([configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'server.properties';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPropertyInput = (property: ServerProperty) => {
    const value = properties[property.key] ?? property.value;

    switch (property.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={property.key}
              checked={Boolean(value)}
              onCheckedChange={(checked) => updateProperty(property.key, checked)}
            />
            <Label htmlFor={property.key} className="text-sm font-normal">
              {property.description}
            </Label>
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={property.key} className="text-sm font-medium">
              {property.key}
            </Label>
            <Select value={String(value)} onValueChange={(newValue) => updateProperty(property.key, newValue)}>
              <SelectTrigger id={property.key}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {property.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{property.description}</p>
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={property.key} className="text-sm font-medium">
              {property.key}
            </Label>
            <Input
              id={property.key}
              type="number"
              value={value}
              onChange={(e) => updateProperty(property.key, parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">{property.description}</p>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={property.key} className="text-sm font-medium">
              {property.key}
            </Label>
            <Input
              id={property.key}
              value={value}
              onChange={(e) => updateProperty(property.key, e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{property.description}</p>
          </div>
        );
    }
  };

  const categories = [...new Set(SERVER_PROPERTIES.map(p => p.category))];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Server Properties</CardTitle>
            {hasChanges && (
              <Badge className="bg-warning text-warning-foreground mt-2">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportConfig}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button size="sm" variant="minecraft" onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="visual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="raw">Raw Config</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                  {category}
                  <Badge variant="secondary" className="text-xs">
                    {SERVER_PROPERTIES.filter(p => p.category === category).length} settings
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVER_PROPERTIES
                    .filter(property => property.category === category)
                    .map((property) => (
                      <div key={property.key} className="p-4 border rounded-lg space-y-2">
                        {renderPropertyInput(property)}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="raw-config">Raw server.properties</Label>
              <Textarea
                id="raw-config"
                value={Object.entries(properties)
                  .map(([key, value]) => `${key}=${value}`)
                  .join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  const newProperties: Record<string, any> = {};
                  lines.forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value !== undefined) {
                      newProperties[key.trim()] = value.trim();
                    }
                  });
                  setProperties(newProperties);
                  setHasChanges(true);
                }}
                className="min-h-[400px] font-mono text-sm"
                placeholder="key=value"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4" />
                Import File
              </Button>
              <Button size="sm" variant="minecraft" onClick={handleSave} disabled={!hasChanges}>
                <Save className="w-4 h-4" />
                Apply Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {hasChanges && (
          <div className="mt-6 p-4 bg-warning/10 border border-warning rounded-lg">
            <p className="text-sm text-warning-foreground">
              ⚠️ Changes require server restart to take effect. Make sure to restart the server after saving.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};