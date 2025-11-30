
import { Peer, DataConnection } from 'peerjs';
import { P2PDataPacket, UserProfile } from '../types';

class P2PService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private onDataReceived: ((data: P2PDataPacket, peerId: string) => void) | null = null;
  private onConnectionOpened: ((peerId: string) => void) | null = null;
  private myProfile: UserProfile | null = null;

  initialize(userId: string, profile: UserProfile, onData: (data: P2PDataPacket, peerId: string) => void, onOpen: (peerId: string) => void) {
    if (this.peer) return;

    this.myProfile = profile;
    this.onDataReceived = onData;
    this.onConnectionOpened = onOpen;

    // Use a simpler ID for PeerJS compatibility (alphanumeric only recommended)
    // We assume userId is the username which we control to be simple in Auth
    const cleanId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    
    this.peer = new Peer(cleanId, {
      debug: 1,
    });

    this.peer.on('open', (id) => {
      console.log('My P2P ID is:', id);
    });

    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Error:', err);
    });
  }

  private handleConnection(conn: DataConnection) {
    conn.on('open', () => {
      console.log('Connected to:', conn.peer);
      this.connections.set(conn.peer, conn);
      
      if (this.onConnectionOpened) {
          this.onConnectionOpened(conn.peer);
      }

      // Send immediate handshake with my profile
      if (this.myProfile) {
          const handshake: P2PDataPacket = {
              type: 'CONNECTION_REQUEST',
              payload: {},
              senderProfile: this.myProfile
          };
          conn.send(handshake);
      }
    });

    conn.on('data', (data) => {
      if (this.onDataReceived) {
        this.onDataReceived(data as P2PDataPacket, conn.peer);
      }
    });

    conn.on('close', () => {
      console.log('Connection closed:', conn.peer);
      this.connections.delete(conn.peer);
    });
    
    conn.on('error', (err) => {
        console.error("Connection error:", err);
        this.connections.delete(conn.peer);
    });
  }

  connectToPeer(peerId: string) {
    if (!this.peer || this.connections.has(peerId)) return;

    console.log('Attempting to connect to:', peerId);
    const conn = this.peer.connect(peerId);
    this.handleConnection(conn);
  }

  sendToPeer(peerId: string, data: P2PDataPacket) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(data);
    } else {
      console.warn(`No active connection to ${peerId}. Attempting reconnect...`);
      this.connectToPeer(peerId);
      // Simple retry logic could go here, but for now we rely on UI to show offline
    }
  }

  disconnect() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
      this.connections.clear();
    }
  }

  isPeerConnected(peerId: string): boolean {
      const conn = this.connections.get(peerId);
      return !!(conn && conn.open);
  }
}

export const p2pService = new P2PService();
