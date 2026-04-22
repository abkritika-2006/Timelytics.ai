import { supabase } from './client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database, Tables } from './client';

// Real-time event types
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

// Subscription callback type
export type SubscriptionCallback<T = any> = (
  payload: RealtimePostgresChangesPayload<T>
) => void;

// Real-time subscription options
export interface SubscriptionOptions {
  event?: RealtimeEvent | '*';
  schema?: string;
  table?: string;
  filter?: string;
}

// Real-time service class
export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to table changes
  static subscribeToTable<T extends keyof Database['public']['Tables']>(
    table: T,
    callback: SubscriptionCallback<Tables<T>>,
    options: {
      event?: RealtimeEvent | '*';
      filter?: string;
      channelName?: string;
    } = {}
  ): string {
    const channelName = options.channelName || `${table}_${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: 'public',
          table: table as string,
          filter: options.filter
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channelName;
  }

  // Subscribe to specific record changes
  static subscribeToRecord<T extends keyof Database['public']['Tables']>(
    table: T,
    recordId: string,
    callback: SubscriptionCallback<Tables<T>>,
    options: {
      event?: RealtimeEvent | '*';
      channelName?: string;
    } = {}
  ): string {
    return this.subscribeToTable(
      table,
      callback,
      {
        ...options,
        filter: `id=eq.${recordId}`
      }
    );
  }

  // Subscribe to user-specific changes
  static subscribeToUserData(
    userId: string,
    callback: SubscriptionCallback,
    options: {
      channelName?: string;
    } = {}
  ): string {
    const channelName = options.channelName || `user_${userId}_${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faculty',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channelName;
  }

  // Subscribe to institution-specific changes
  static subscribeToInstitutionData(
    institutionId: string,
    callback: SubscriptionCallback,
    options: {
      tables?: string[];
      channelName?: string;
    } = {}
  ): string {
    const channelName = options.channelName || `institution_${institutionId}_${Date.now()}`;
    const tables = options.tables || ['users', 'courses', 'rooms', 'timetables'];
    
    let channel = supabase.channel(channelName);

    // Subscribe to each table with institution filter
    tables.forEach(table => {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `institution_id=eq.${institutionId}`
        },
        callback
      );
    });

    channel.subscribe();
    this.channels.set(channelName, channel);
    return channelName;
  }

  // Subscribe to timetable collaboration
  static subscribeToTimetableCollaboration(
    timetableId: string,
    callbacks: {
      onTimetableUpdate?: SubscriptionCallback<Tables<'timetables'>>;
      onUserJoin?: (user: any) => void;
      onUserLeave?: (user: any) => void;
      onCursorMove?: (data: { userId: string; x: number; y: number }) => void;
      onSelection?: (data: { userId: string; selection: any }) => void;
    },
    options: {
      channelName?: string;
    } = {}
  ): string {
    const channelName = options.channelName || `timetable_collab_${timetableId}_${Date.now()}`;
    
    let channel = supabase.channel(channelName);

    // Subscribe to timetable changes
    if (callbacks.onTimetableUpdate) {
      channel = channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timetables',
          filter: `id=eq.${timetableId}`
        },
        callbacks.onTimetableUpdate
      );
    }

    // Subscribe to presence events for collaboration
    if (callbacks.onUserJoin || callbacks.onUserLeave) {
      channel = channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Handle presence state changes
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.event === 'join' && callbacks.onUserJoin) {
              callbacks.onUserJoin(presence.user);
            } else if (presence.event === 'leave' && callbacks.onUserLeave) {
              callbacks.onUserLeave(presence.user);
            }
          });
        });
      });
    }

    // Subscribe to broadcast events for real-time collaboration
    if (callbacks.onCursorMove) {
      channel = channel.on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
        callbacks.onCursorMove!(payload);
      });
    }

    if (callbacks.onSelection) {
      channel = channel.on('broadcast', { event: 'selection_change' }, ({ payload }) => {
        callbacks.onSelection!(payload);
      });
    }

    channel.subscribe();
    this.channels.set(channelName, channel);
    return channelName;
  }

  // Broadcast cursor movement for collaboration
  static broadcastCursorMove(channelName: string, x: number, y: number, userId: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: { userId, x, y }
      });
    }
  }

  // Broadcast selection change for collaboration
  static broadcastSelectionChange(channelName: string, selection: any, userId: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'selection_change',
        payload: { userId, selection }
      });
    }
  }

  // Track user presence in collaboration
  static trackPresence(channelName: string, user: any) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.track({
        user,
        online_at: new Date().toISOString()
      });
    }
  }

  // Untrack user presence
  static untrackPresence(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.untrack();
    }
  }

  // Unsubscribe from channel
  static unsubscribe(channelName: string): boolean {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      return true;
    }
    return false;
  }

  // Unsubscribe from all channels
  static unsubscribeAll(): void {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  // Get active channels
  static getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  // Check if channel is active
  static isChannelActive(channelName: string): boolean {
    return this.channels.has(channelName);
  }

  // Get channel status
  static getChannelStatus(channelName: string): string | null {
    const channel = this.channels.get(channelName);
    return channel ? channel.state : null;
  }
}

// Utility hooks for React components
export const useRealtimeSubscription = <T extends keyof Database['public']['Tables']>(
  table: T,
  callback: SubscriptionCallback<Tables<T>>,
  options: {
    event?: RealtimeEvent | '*';
    filter?: string;
    enabled?: boolean;
  } = {}
) => {
  const { enabled = true } = options;
  
  if (typeof window !== 'undefined' && enabled) {
    const channelName = RealtimeService.subscribeToTable(table, callback, options);
    
    // Cleanup function
    return () => {
      RealtimeService.unsubscribe(channelName);
    };
  }
  
  return () => {};
};

export const useRealtimeRecord = <T extends keyof Database['public']['Tables']>(
  table: T,
  recordId: string,
  callback: SubscriptionCallback<Tables<T>>,
  options: {
    event?: RealtimeEvent | '*';
    enabled?: boolean;
  } = {}
) => {
  const { enabled = true } = options;
  
  if (typeof window !== 'undefined' && enabled && recordId) {
    const channelName = RealtimeService.subscribeToRecord(table, recordId, callback, options);
    
    // Cleanup function
    return () => {
      RealtimeService.unsubscribe(channelName);
    };
  }
  
  return () => {};
};

// Export realtime service as default
export default RealtimeService;