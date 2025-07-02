# Nukkit Server Dashboard

A comprehensive web-based dashboard for managing Nukkit Minecraft servers, built with React and designed to run in Docker containers.

## 🚀 Features

### Core Dashboard Features
- **Real-time Server Console** - View live server logs and execute commands
- **Server Control** - Start/stop server with status monitoring
- **Command Management** - Comprehensive command library with favorites
- **Game Mode Control** - Easy gamemode switching and cheat management
- **World Management** - Create, load, and manage multiple worlds
- **Server Configuration** - Visual editor for server.properties

### Advanced Features
- **Plugin Support** - Auto-discovery and management of plugin commands
- **Live Log Monitoring** - Real-time console output with filtering
- **Command History** - Navigate through previously executed commands
- **Favorites System** - Quick access to frequently used commands
- **Export/Import** - Backup and restore server configurations

## 📁 Project Structure

```
nukkit-dashboard/
├── src/
│   ├── components/
│   │   ├── ServerHeader.tsx          # Server connection and status
│   │   ├── CommandPanel.tsx          # Command library and execution
│   │   ├── ServerConsole.tsx         # Live console with command input
│   │   ├── GameModePanel.tsx         # Game settings and quick commands
│   │   ├── WorldManager.tsx          # World management interface
│   │   ├── ServerPropertiesEditor.tsx # Server config editor
│   │   └── ui/                       # Reusable UI components
│   ├── pages/
│   │   ├── Dashboard.tsx             # Main dashboard page
│   │   └── Index.tsx                 # App entry point
│   └── hooks/
│       └── use-toast.ts              # Toast notifications
├── docker-compose.yml               # Docker setup
├── Dockerfile                       # Container configuration
├── server-data/                     # Server worlds and data (volume)
├── logs/                            # Application logs (volume)
└── README-NUKKIT.md                 # This file
```

## 🐳 Docker Setup

### Quick Start

1. **Clone and build**:
```bash
git clone <your-repo>
cd nukkit-dashboard
```

2. **Run with Docker Compose**:
```bash
docker-compose up -d
```

3. **Access the dashboard**:
- Open http://localhost:3000 in your browser
- Connect to your Nukkit server using the connection form

### Manual Docker Build

```bash
# Build the image
docker build -t nukkit-dashboard .

# Run the container
docker run -d \
  --name nukkit-dashboard \
  -p 3000:3000 \
  -v $(pwd)/server-data:/app/server-data \
  -v $(pwd)/logs:/app/logs \
  nukkit-dashboard
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):
```env
NODE_ENV=production
NUKKIT_SERVER_HOST=localhost
NUKKIT_SERVER_PORT=19132
LOG_LEVEL=info
```

### Server Connection

The dashboard connects to your Nukkit server via WebSocket. Configure the connection:

1. **Default Connection**: `ws://localhost:19132`
2. **Remote Server**: `ws://your-server-ip:19132`
3. **Custom Port**: Adjust port in server.properties

## 📋 Command Categories

### Server Commands
- `/gamemode` - Change player game modes
- `/tp` - Teleport players
- `/give` - Give items to players
- `/kick` / `/ban` - Player moderation
- `/whitelist` - Whitelist management
- `/save-all` - Save server data
- `/stop` - Stop the server

### World Commands
- `/weather` - Change weather conditions
- `/time` - Set time of day
- `/difficulty` - Adjust difficulty level
- `/gamerule` - Modify game rules

### Plugin Commands
- Auto-detected from connected server
- Organized by plugin category
- Quick access to plugin-specific features

## 🎮 Game Mode Management

### Supported Modes
- **Survival** - Default survival gameplay
- **Creative** - Unlimited resources and flight
- **Adventure** - Limited block interaction
- **Spectator** - Observation mode

### Quick Settings
- Enable/disable cheats server-wide
- Toggle individual game rules
- Player-specific mode changes
- Bulk player management

## 🌍 World Management

### Features
- **Multi-world Support** - Manage multiple worlds
- **World Creation** - Create new worlds with custom settings
- **World Types**: Normal, Flat, Nether, End
- **Backup System** - Export and backup world data
- **Quick Settings** - Common world configuration

### World Configuration
```properties
# Example world settings
level-name=world
level-type=DEFAULT
level-seed=
generate-structures=true
spawn-protection=16
```

## ⚙️ Server Properties Editor

### Visual Editor Features
- **Categorized Settings** - Organized by function
- **Real-time Validation** - Prevent invalid configurations
- **Export/Import** - Backup and restore configs
- **Raw Editor** - Direct file editing capability

### Key Settings Categories
1. **Server** - Port, IP, player limits
2. **World** - Generation and spawn settings
3. **Gameplay** - Game modes and difficulty
4. **Performance** - View distance and optimization

## 🔌 Plugin Integration

### Auto-Discovery
- Automatically detects installed plugins
- Imports plugin-specific commands
- Organizes commands by plugin category

### Plugin Categories
- **Economy** - Economic system commands
- **Protection** - Land protection and claims
- **Teleportation** - Advanced teleport features
- **Administration** - Server management tools

## 📊 Monitoring & Logs

### Console Features
- **Live Streaming** - Real-time log updates
- **Log Filtering** - Filter by log level (INFO, WARN, ERROR)
- **Command History** - Navigate previous commands with arrow keys
- **Export Logs** - Download logs for analysis
- **Search** - Find specific log entries

### Log Levels
- `INFO` - General server information
- `WARN` - Warning messages
- `ERROR` - Error conditions
- `DEBUG` - Debug information

## 🔐 Security Considerations

### Access Control
- Dashboard runs on isolated network (Docker)
- No direct file system access from web interface
- Command execution through secure WebSocket connection

### Best Practices
1. **Firewall** - Restrict dashboard access to trusted IPs
2. **SSL/TLS** - Use HTTPS in production
3. **Authentication** - Implement user authentication if needed
4. **Regular Updates** - Keep dependencies updated

## 🚀 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Adding New Features

1. **Commands** - Add to `CommandPanel.tsx`
2. **UI Components** - Extend component library
3. **Server Integration** - Modify WebSocket handlers
4. **Configuration** - Update properties editor

## 🐛 Troubleshooting

### Common Issues

**Connection Failed**
- Verify Nukkit server is running
- Check server.properties for correct port
- Ensure WebSocket support is enabled

**Commands Not Working**
- Check server permissions
- Verify command syntax
- Review server console for errors

**Docker Issues**
- Ensure ports are not in use
- Check Docker daemon status
- Verify volume permissions

### Debug Mode

Enable debug logging:
```bash
docker-compose logs -f nukkit-dashboard
```

## 📈 Performance Optimization

### Server Settings
```properties
# Recommended performance settings
view-distance=8
max-threads=4
auto-save=true
save-interval=300
```

### Dashboard Settings
- Enable log rotation to prevent disk space issues
- Limit console history to improve performance
- Use command favorites to reduce typing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Maintain component modularity
- Document new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Nukkit Team for the amazing Minecraft server
- React and TypeScript communities
- Docker for containerization support
- All contributors and users

---

For issues and feature requests, please open an issue on GitHub.