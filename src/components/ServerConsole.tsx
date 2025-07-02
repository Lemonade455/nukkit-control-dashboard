import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Trash2, Download } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
}

interface ServerConsoleProps {
  logs: LogEntry[];
  onSendCommand: (command: string) => void;
  onClearLogs: () => void;
}

export const ServerConsole = ({ logs, onSendCommand, onClearLogs }: ServerConsoleProps) => {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs]);

  const handleSendCommand = () => {
    if (command.trim()) {
      onSendCommand(command);
      setCommandHistory(prev => [...prev.slice(-49), command]); // Keep last 50 commands
      setCommand("");
      setHistoryIndex(-1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setCommand("");
        }
      }
    }
  };

  const getLevelBadge = (level: LogEntry["level"]) => {
    switch (level) {
      case "ERROR":
        return <Badge variant="destructive" className="text-xs">ERROR</Badge>;
      case "WARN":
        return <Badge className="bg-warning text-warning-foreground text-xs">WARN</Badge>;
      case "INFO":
        return <Badge className="bg-success text-success-foreground text-xs">INFO</Badge>;
      case "DEBUG":
        return <Badge variant="secondary" className="text-xs">DEBUG</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const exportLogs = () => {
    const logContent = logs.map(log => 
      `[${log.timestamp}] [${log.level}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `server-logs-${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Server Console</span>
            <Badge variant="secondary">{logs.length} logs</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={exportLogs}
              disabled={logs.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onClearLogs}
              disabled={logs.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Console Output */}
        <div className="flex-1 min-h-0">
          <ScrollArea 
            ref={scrollAreaRef}
            className="h-full bg-console-bg rounded-lg border shadow-console"
          >
            <div className="p-4 space-y-1 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">
                  <p>No logs yet. Connect to your server to see console output.</p>
                  <p className="text-xs mt-2">Commands and server events will appear here in real-time.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 hover:bg-muted/10 p-1 rounded">
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {log.timestamp}
                    </span>
                    {getLevelBadge(log.level)}
                    <span className="flex-1 break-words">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Command Input */}
        <div className="flex-shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Enter command... (Use ↑/↓ for history)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 font-mono bg-console-bg border-border"
            />
            <Button 
              onClick={handleSendCommand}
              disabled={!command.trim()}
              variant="console"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {commandHistory.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Command history: {commandHistory.length} commands
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};