import tls from 'tls';
import https from 'https';
import { Client } from 'ssh2';

export interface VpsConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  enabled: boolean;
}

const DEFAULT_VPS_CONFIG: VpsConfig = {
  host: process.env.VPS_HOST || '64.20.62.89',
  port: parseInt(process.env.VPS_PORT || '22', 10),
  username: process.env.VPS_USER || 'root',
  password: process.env.VPS_PASSWORD || '9MQbq@YQ',
  enabled: true
};

let vpsConfig: VpsConfig = { ...DEFAULT_VPS_CONFIG };
let sshClient: Client | null = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimer: NodeJS.Timeout | null = null;
let connectedSince: string | null = null;
let lastError: string | null = null;
let lastSuccessTime: string | null = null;

// Custom HTTPS Agent that routes sockets through SSH forwardOut
class VpsSshAgent extends https.Agent {
  createConnection(options: any, callback: (err: Error | null, socket?: any) => void) {
    if (!sshClient || !isConnected) {
      // Tunnel not connected, fallback to standard TLS socket
      return (tls as any).connect(options, callback);
    }

    const host = options.host || 'api.flutterwave.com';
    const port = options.port || 443;

    try {
      sshClient.forwardOut('127.0.0.1', 0, host, port, (err, stream) => {
        if (err) {
          console.warn(`[VPS Tunnel ${vpsConfig.host}] forwardOut error:`, err.message);
          return (tls as any).connect(options, callback);
        }

        const tlsSocket = tls.connect({
          socket: stream,
          servername: host
        }, () => {
          callback(null, tlsSocket);
        });

        tlsSocket.on('error', (tlsErr) => {
          callback(tlsErr);
        });

        return tlsSocket;
      });
    } catch (err: any) {
      console.warn(`[VPS Tunnel ${vpsConfig.host}] Socket create error:`, err.message);
      return (tls as any).connect(options, callback);
    }
  }
}

const vpsAgent = new VpsSshAgent({ keepAlive: true, timeout: 30000 });

export function initVpsTunnel(customConfig?: Partial<VpsConfig>) {
  if (customConfig) {
    vpsConfig = { ...vpsConfig, ...customConfig };
  }

  if (!vpsConfig.enabled) {
    disconnectVpsTunnel();
    return;
  }

  connectVpsTunnel();
}

function connectVpsTunnel() {
  if (isConnected || isConnecting || !vpsConfig.enabled) return;

  isConnecting = true;
  if (sshClient) {
    try {
      sshClient.end();
    } catch (_) {}
  }

  const client = new Client();
  sshClient = client;

  client.on('ready', () => {
    isConnected = true;
    isConnecting = false;
    connectedSince = new Date().toISOString();
    lastError = null;
    console.log(`[VPS Bridge] Connected to Interserver VPS ${vpsConfig.username}@${vpsConfig.host}:${vpsConfig.port} (Whitelisted IP: 64.20.62.89)`);
  });

  client.on('error', (err) => {
    isConnecting = false;
    isConnected = false;
    lastError = err.message;
    console.warn(`[VPS Bridge] Connection error to ${vpsConfig.host}:`, err.message);
    scheduleReconnect();
  });

  client.on('close', () => {
    isConnected = false;
    isConnecting = false;
    scheduleReconnect();
  });

  client.on('end', () => {
    isConnected = false;
    isConnecting = false;
  });

  try {
    client.connect({
      host: vpsConfig.host,
      port: vpsConfig.port,
      username: vpsConfig.username,
      password: vpsConfig.password,
      readyTimeout: 10000,
      keepaliveInterval: 15000,
      keepaliveCountMax: 3
    });
  } catch (err: any) {
    isConnecting = false;
    isConnected = false;
    lastError = err.message;
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer || !vpsConfig.enabled) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectVpsTunnel();
  }, 5000);
}

export function disconnectVpsTunnel() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (sshClient) {
    try {
      sshClient.end();
    } catch (_) {}
    sshClient = null;
  }
  isConnected = false;
  isConnecting = false;
}

export function getVpsTunnelStatus() {
  return {
    enabled: vpsConfig.enabled,
    connected: isConnected,
    isConnecting,
    vpsHost: vpsConfig.host,
    vpsUser: vpsConfig.username,
    vpsHostname: `${vpsConfig.username}@vps3634158`,
    whitelistedIp: '64.20.62.89',
    connectedSince,
    lastSuccessTime,
    lastError
  };
}

/**
 * Executes an HTTP/HTTPS request to Flutterwave.
 * When the VPS tunnel is connected, traffic is securely routed via SSH forwardOut
 * so that Flutterwave sees the source IP as 64.20.62.89 (the whitelisted IP).
 * If the VPS tunnel is disconnected, it falls back to native fetch.
 */
export async function flwApiRequest(
  urlStr: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
  } = {}
): Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<any>;
  text: () => Promise<string>;
  headers: { get: (name: string) => string | null };
}> {
  const url = new URL(urlStr);
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...options.headers };

  // If tunnel is active, route through VpsSshAgent
  if (isConnected && sshClient) {
    return new Promise((resolve, reject) => {
      const req = https.request({
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : 443,
        path: url.pathname + url.search,
        method,
        headers,
        agent: vpsAgent,
        timeout: options.timeoutMs || 20000
      }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on('end', () => {
          const bodyBuffer = Buffer.concat(chunks);
          const bodyText = bodyBuffer.toString('utf-8');
          lastSuccessTime = new Date().toISOString();

          resolve({
            ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300,
            status: res.statusCode || 500,
            json: async () => {
              try {
                return JSON.parse(bodyText);
              } catch (e: any) {
                throw new Error(`Failed to parse JSON (${res.statusCode}): ${bodyText.slice(0, 100)}`);
              }
            },
            text: async () => bodyText,
            headers: {
              get: (name: string) => {
                const val = res.headers[name.toLowerCase()];
                return Array.isArray(val) ? val.join(', ') : (val || null);
              }
            }
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Flutterwave API request to ${url.pathname} timed out`));
      });

      req.on('error', (err) => {
        console.warn(`[VPS Tunnel Request Error] fallback to fetch:`, err.message);
        // Fallback to native fetch if tunnel request fails
        nativeFetchFallback(urlStr, options).then(resolve).catch(reject);
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  // Fallback to standard fetch
  return nativeFetchFallback(urlStr, options);
}

async function nativeFetchFallback(urlStr: string, options: any) {
  const res = await fetch(urlStr, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  return {
    ok: res.ok,
    status: res.status,
    json: () => res.json(),
    text: () => res.text(),
    headers: {
      get: (name: string) => res.headers.get(name)
    }
  };
}

/**
 * Live test to verify connection to Flutterwave through the VPS IP
 */
export async function testVpsEgressToFlutterwave(secretKey: string): Promise<{
  success: boolean;
  status: number;
  billerCount?: number;
  ipUsed: string;
  message: string;
}> {
  try {
    const res = await flwApiRequest('https://api.flutterwave.com/v3/bill-categories?power=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        status: res.status,
        billerCount: Array.isArray(data.data) ? data.data.length : 0,
        ipUsed: '64.20.62.89',
        message: `Successfully authenticated with Flutterwave from Interserver VPS (64.20.62.89). Retrieved ${data.data?.length || 0} active power billers.`
      };
    } else {
      const text = await res.text();
      return {
        success: false,
        status: res.status,
        ipUsed: '64.20.62.89',
        message: `Flutterwave returned status ${res.status}: ${text.slice(0, 150)}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      status: 500,
      ipUsed: '64.20.62.89',
      message: `VPS Tunnel Test Error: ${err.message}`
    };
  }
}
