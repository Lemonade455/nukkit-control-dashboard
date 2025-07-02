import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, FolderOpen, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface World {
  name: string;
  type: "normal" | "nether" | "end" | "flat";
  size: string;
  lastPlayed: string;
  isActive: boolean;
}

interface WorldManagerProps {
  worlds: World[];
  activeWorld: string;
  onChangeWorld: (worldName: string) => void;
  onCreateWorld: (worldConfig: any) => void;
  onExecuteCommand: (command: string) => void;
}

const WORLD_TYPES = [
  { value: "normal", label: "Normal", description: "Standard overworld generation" },
  { value: "flat", label: "Flat", description: "Superflat world" },
  { value: "nether", label: "Nether", description: "Nether dimension" },
  { value: "end", label: "End", description: "End dimension" },
];

export const WorldManager = ({
  worlds,
  activeWorld,
  onChangeWorld,
  onCreateWorld,
  onExecuteCommand,
}: WorldManagerProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorldConfig, setNewWorldConfig] = useState({
    name: "",
    type: "normal",
    seed: "",
    generateStructures: true,
  });

  const handleCreateWorld = () => {
    if (newWorldConfig.name) {
      onCreateWorld(newWorldConfig);
      setIsCreateDialogOpen(false);
      setNewWorldConfig({ name: "", type: "normal", seed: "", generateStructures: true });
    }
  };

  const handleWorldChange = (worldName: string) => {
    onChangeWorld(worldName);
    onExecuteCommand(`/mv tp ${worldName}`); // Multiverse command
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            World Management
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="minecraft" size="sm">
                <Plus className="w-4 h-4" />
                Create World
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New World</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="world-name">World Name</Label>
                  <Input
                    id="world-name"
                    value={newWorldConfig.name}
                    onChange={(e) => setNewWorldConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Amazing World"
                  />
                </div>
                
                <div>
                  <Label htmlFor="world-type">World Type</Label>
                  <Select 
                    value={newWorldConfig.type} 
                    onValueChange={(value) => setNewWorldConfig(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="world-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORLD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="world-seed">Seed (Optional)</Label>
                  <Input
                    id="world-seed"
                    value={newWorldConfig.seed}
                    onChange={(e) => setNewWorldConfig(prev => ({ ...prev, seed: e.target.value }))}
                    placeholder="Leave empty for random"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWorld} disabled={!newWorldConfig.name}>
                    Create World
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active World Info */}
        <div className="p-4 bg-gradient-gaming rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Active World</h3>
              <p className="text-sm text-muted-foreground">{activeWorld || "No world selected"}</p>
            </div>
            <Badge className="bg-success text-success-foreground">
              ACTIVE
            </Badge>
          </div>
        </div>

        <Separator />

        {/* World List */}
        <div className="space-y-3">
          <h4 className="font-medium">Available Worlds</h4>
          {worlds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No worlds found</p>
              <p className="text-sm">Create a new world or load existing ones</p>
            </div>
          ) : (
            worlds.map((world) => (
              <div
                key={world.name}
                className={`p-3 border rounded-lg transition-colors ${
                  world.isActive ? "bg-success/10 border-success" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{world.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {world.type}
                      </Badge>
                      {world.isActive && (
                        <Badge className="bg-success text-success-foreground text-xs">
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Size: {world.size} • Last played: {world.lastPlayed}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!world.isActive && (
                      <Button
                        size="sm"
                        variant="minecraft"
                        onClick={() => handleWorldChange(world.name)}
                      >
                        Load
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* World Actions */}
        <div className="space-y-3">
          <h4 className="font-medium">World Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onExecuteCommand("/save-all")}
            >
              Save World
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand("/mv list")}
            >
              List Worlds
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand("/mv info")}
            >
              World Info
            </Button>
            <Button
              variant="outline"
              onClick={() => onExecuteCommand("/backup")}
            >
              <Download className="w-4 h-4" />
              Backup
            </Button>
          </div>
        </div>

        {/* Quick World Settings */}
        <div className="space-y-3">
          <h4 className="font-medium">Quick Settings</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExecuteCommand("/gamerule keepInventory true")}
            >
              Enable Keep Inventory
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExecuteCommand("/gamerule doMobSpawning false")}
            >
              Disable Mob Spawning
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExecuteCommand("/gamerule doDaylightCycle false")}
            >
              Stop Day/Night Cycle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};