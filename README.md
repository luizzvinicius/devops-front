# DevOps Frontend - Dev Container Tutorial

This tutorial will guide you through setting up and running this Next.js banking frontend application using Visual Studio Code Dev Containers

> The backend container must be created before front-end container because it will create the frontend network.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Ensure Docker is running before proceeding

2. **Visual Studio Code**
   - [Download VS Code](https://code.visualstudio.com/)

3. **Dev Containers Extension**
   - Install the "Dev Containers" extension by Microsoft
   - Extension ID: `ms-vscode-remote.remote-containers`

## Project Overview

This project is a **Next.js Banking Frontend Application** with the following components:

- **Frontend**: Next.js 15 with React 19
- **Runtime**: Node.js 22
- **Package Manager**: Yarn (with support for npm, pnpm, bun)
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn UI 
- **State Management**: TanStack Query

### Key Features:
- Modern React application with Next.js App Router
- TailwindCSS for responsive styling
- Radix UI for accessible components
- TanStack Query for server state management
- Form handling with TanStack Form
- TypeScript for type safety
- Biome for code formatting and linting

## Getting Started

### Step 1: Clone and Open the Repository

1. Clone this repository to your local machine:
   ```bash
   git clone <your-repo-url>
   cd devops-front
   ```

2. Open the project in Visual Studio Code:
   ```bash
   code .
   ```

3. Ensure the backend container is running to access the `frontend-network`

### Step 2: Open in Dev Container

1. **Method 1 - Command Palette:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Type "Dev Containers: Reopen in Container"
   - Select the option and press Enter

2. **Method 2 - Notification:**
   - VS Code should show a notification asking if you want to reopen in container
   - Click "Reopen in Container"

3. **Method 3 - Status Bar:**
   - Click the green remote connection indicator in the bottom-left corner
   - Select "Reopen in Container"

### Step 3: Container Initialization

The dev container will automatically:

1. **Pull the base image** (`mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm`)
2. **Install Node.js features** and development tools
3. **Install dependencies** using `yarn install`
4. **Start the development server** on port `3000` with `yarn dev`
5. **Configure VS Code** with extensions and settings

This process may take 3-5 minutes on the first run.

## Dev Container Configuration

### Container Setup

The dev container uses a single service configuration:

#### Application Container
- **Base Image**: `mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm`
- **Runtime**: Node.js 22 with TypeScript support
- **Package Manager**: Yarn (primary), with npm, pnpm, bun support
- **Port**: 3000 (Next.js development server)
- **Container Name**: `bank-frontend`

### VS Code Extensions

The dev container automatically installs:
- **Dracula Theme** - Dark theme for VS Code
- **Biome** - Code formatter and linter
- **TypeScript** - Enhanced TypeScript support
- **React Snippets** - ES7+ React/Redux/React-Native snippets
- **TailwindCSS IntelliSense** - Autocomplete and linting for TailwindCSS
- **Material Icon Theme** - File and folder icons
- **GitLens** - Git supercharged
- **Pretty TypeScript Errors** - Better error formatting
- **Auto Backticks** - Automatic template literal conversion
- **Color Highlight** - Highlight colors in code
- **npm IntelliSense** - Autocomplete npm modules

### VS Code Settings

Pre-configured settings include:
- **Format on save**: Enabled with Biome formatter
- **Font**: JetBrains Mono
- **Theme**: Dracula
- **Word wrap**: Enabled
- **Minimap**: Disabled for cleaner interface
- **File nesting**: Enabled for better organization
- **Auto import updates**: When files are moved

### Port Forwarding

The following port is automatically forwarded:
- `3000` - Next.js development server

## Running the Application

### Automatic Startup

The application starts automatically when the container is created via the `postCreateCommand`:
```bash
yarn install && yarn dev
```

### Manual Control

If you need to restart or control the application manually:

#### Stop the Development Server
```bash
# Press Ctrl+C in the terminal where the app is running
```

#### Start the Development Server
```bash
yarn dev
```

#### Build for Production
```bash
yarn build
```

#### Start Production Server
```bash
yarn start
```

#### Run Linting
```bash
yarn lint
```

## Accessing the Application

Once the application is running, you can access:

### Frontend Application
- **Development URL**: http://localhost:3000
- **Default Route**: Redirects from `/` to `/pessoa`

### Development Features
- **Hot Reload**: Changes are automatically reflected in the browser
- **Error Overlay**: Development errors displayed in the browser
- **Fast Refresh**: React Fast Refresh for instant updates

## Environment Configuration

### Environment Variables

Create a `.env.local` file in the project root for local development:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/v1
```

### Backend Integration

The application is configured to connect to the backend API:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Network**: Uses `frontend-network` (created by backend container)

## Docker Production Setup

### Production Build

The project includes production Docker configuration:

#### Multi-stage Dockerfile
```bash
# Build production image
docker build -t devops-front .

# Run production container
docker run -p 3000:3000 devops-front
```

#### Docker Compose Production
```bash
# Start with docker-compose
docker-compose up
```

The production setup includes:
- **Optimized build**: Standalone output for smaller images
- **Multi-stage build**: Separate build and runtime stages
- **Security**: Non-root user (nextjs)
- **Performance**: Static asset optimization

## Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
**Problem**: Port 3000 is already in use
**Solutions**:
- Stop other applications using port 3000
- Check for other Next.js development servers
- Modify port in `devcontainer.json` if needed

#### Network Connection Issues
**Problem**: Cannot connect to backend API
**Solutions**:
- Ensure backend container is running first
- Verify `frontend-network` exists: `docker network ls`
- Check backend is accessible at `http://localhost:8080`
- Verify environment variables in `.env.local`

