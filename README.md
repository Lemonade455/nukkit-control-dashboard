**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Lemonade455/nukkit-command-center-dashboard.git

# Step 2: Navigate to the project directory.
cd nukkit-dashboard

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

🚀 To Deploy:
Build and run:

docker-compose up -d
Access dashboard:
Open http://localhost:3000
Connect to your Nukkit server (ws://your-server:19132)
```
nukkit-command-center-dashboard

🎮 Complete Nukkit Dashboard Features
Core Components:
Server Header - Connection management, server start/stop controls
Live Console - Real-time server logs with command input and history
Command Panel - Complete command library with favorites system
Game Mode Control - Easy gamemode switching, cheat toggles, quick commands
World Manager - Multi-world support with creation tools
Server Properties Editor - Visual config editor with raw text mode
Key Features Implemented:
✅ Server Connection - Connect via WebSocket URL
✅ Command Library - All Nukkit commands with descriptions
✅ Favorites System - Star commands for quick access
✅ Live Console - Real-time logs with command history (↑/↓ keys)
✅ Game Mode Control - Survival/Creative/Adventure/Spectator switching
✅ Cheat Management - Enable/disable cheats server-wide
✅ World Management - Create new worlds, change active world
✅ Server Properties - Visual editor for server.properties file
✅ Plugin Support - Auto-import plugin commands (ready for integration)

Beautiful Gaming Design:
Dark theme with Minecraft-inspired colors (green, gold, blue)
Glowing effects and smooth animations
Responsive layout that works on all devices
Professional UI with shadcn components
📁 Complete Project Structure:
nukkit-dashboard/
├── src/
│   ├── components/
│   │   ├── ServerHeader.tsx          # Connection & server controls
│   │   ├── CommandPanel.tsx          # Command library with favorites
│   │   ├── ServerConsole.tsx         # Live console with history
│   │   ├── GameModePanel.tsx         # Game settings & quick commands
│   │   ├── WorldManager.tsx          # Multi-world management
│   │   ├── ServerPropertiesEditor.tsx # Server config editor
│   │   └── ui/                       # Enhanced UI components
│   ├── pages/
│   │   ├── Dashboard.tsx             # Main dashboard
│   │   └── Index.tsx                 # Entry point
├── docker-compose.yml               # Complete Docker setup
├── Dockerfile                       # Optimized container build
└── README-NUKKIT.md                 # Comprehensive documentation
🐳 Docker Setup Ready:
The dashboard is fully containerized with:

Dockerfile - Multi-stage build for production
docker-compose.yml - Complete orchestration
Volume mounts - Persistent server data and logs
Health checks - Container monitoring
Network isolation - Secure container networking
🚀 To Deploy:
Build and run:

docker-compose up -d
Access dashboard:
Open http://localhost:3000
Connect to your Nukkit server (ws://your-server:19132)


**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/883b7e6f-7c7f-401d-a05c-3bcfef5fc303) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
