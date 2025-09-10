import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { ChildProcess, spawn } from 'child_process';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let mainWindow: BrowserWindow | null = null;
let languageClient: LanguageClient | null = null;
let serverProcess: ChildProcess | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Start language server when window is created
  startLanguageServer();
}

function startLanguageServer() {
  try {
    // Start the language server as a separate process
    const serverModule = join(__dirname, '../language-server/server.js');
    serverProcess = spawn('node', [serverModule]);

    // Server options
    const serverOptions: ServerOptions = {
      run: {
        module: serverModule,
        transport: TransportKind.ipc
      },
      debug: {
        module: serverModule,
        transport: TransportKind.ipc,
        options: { execArgv: ['--nolazy', '--inspect=6009'] }
      }
    };

    // Client options
    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { scheme: 'file', language: 'json' },
        { scheme: 'file', language: 'yaml' }
      ],
      synchronize: {
        fileEvents: workspace.createFileSystemWatcher('**/.openapi-*')
      }
    };

    // Create and start the language client
    languageClient = new LanguageClient(
      'openapi-language-server',
      'OpenAPI Language Server',
      serverOptions,
      clientOptions
    );

    languageClient.start().catch(error => {
      console.error('Failed to start language client:', error);
    });

    // Handle server process events
    if (serverProcess) {
      serverProcess.stdout?.on('data', (data) => {
        console.log('Language server output:', data.toString());
      });

      serverProcess.stderr?.on('data', (data) => {
        console.error('Language server error:', data.toString());
      });

      serverProcess.on('close', (code) => {
        console.log(`Language server process exited with code ${code}`);
      });
    }
  } catch (error) {
    console.error('Error starting language server:', error);
  }
}

// Example IPC handlers for editor integration
ipcMain.handle('parse-openapi', async (_event, content: string) => {
  try {
    const { OpenAPIParser } = require('../parser/OpenAPIParser');
    const parser = new OpenAPIParser();
    return await parser.parse(content);
  } catch (error) {
    console.error('Error parsing OpenAPI:', error);
    throw error;
  }
});

ipcMain.handle('get-components', async (_event, content: string) => {
  try {
    const { OpenAPIParser } = require('../parser/OpenAPIParser');
    const parser = new OpenAPIParser();
    const result = await parser.parse(content);
    if (result.isValid && result.document) {
      return parser.getComponents(result.document);
    }
    return [];
  } catch (error) {
    console.error('Error getting components:', error);
    throw error;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', async () => {
  // Stop the language client
  if (languageClient) {
    await languageClient.stop();
  }

  // Kill the language server process
  if (serverProcess) {
    serverProcess.kill();
  }
});
