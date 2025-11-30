
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

    // Initialize Peer with the user's ID
    // We use a clean ID string (alphanumeric only)
    const cleanId = userId.replace(/[^a-zA-Z0-9]/g, '');
    
    this.peer = new Peer(cleanId, {
      debug: 1,
    });

    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
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
      console.log('Connected to: ', conn.peer);
      this.connections.set(conn.peer, conn);
      
      // Send handshake (my profile)
      if (this.myProfile) {
        this.sendToPeer(conn.peer, {
          type: 'CONNECTION_REQUEST',
          payload: { status: 'online' },
          senderProfile: this.myProfile
        });
      }

      if (this.onConnectionOpened) {
        this.onConnectionOpened(conn.peer);
      }
    });

    conn.on('data', (data) => {
      if (this.onDataReceived) {
        this.onDataReceived(data as P2PDataPacket, conn.peer);
      }
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });
  }

  connectToPeer(peerId: string) {
    if (!this.peer) return;
    const cleanId = peerId.replace(/[^a-zA-Z0-9]/g, '');
    if (this.connections.has(cleanId)) return; // Already connected

    const conn = this.peer.connect(cleanId);
    this.handleConnection(conn);
  }

  sendToPeer(peerId: string, data: P2PDataPacket) {
    const cleanId = peerId.replace(/[^a-zA-Z0-9]/g, '');
    const conn = this.connections.get(cleanId);
    if (conn && conn.open) {
      conn.send(data);
    } else {
      // Try to reconnect and send
      this.connectToPeer(cleanId);
      // Note: Data might be lost if immediate reconnection fails. 
      // In a full app, we would queue messages here.
      console.warn(`Connection to ${peerId} is not open. Attempting to reconnect.`);
    }
  }

  disconnect() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
      this.connections.clear();
    }
  }
}

export const p2pService = new P2PService();
