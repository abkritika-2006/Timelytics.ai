import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users,
  MessageSquare,
  Video,
  Phone,
  Share2,
  Edit3,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  Crown,
  Shield,
  Clock,
  Activity,
  Bell,
  Settings,
  ArrowLeft,
  Sun,
  Moon,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Calendar,
  FileText,
  Download,
  Upload,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Plus,
  Minus,
  Copy,
  Link,
  Globe,
  Lock,
  Unlock,
  Zap,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  History,
  GitBranch,
  Merge,
  BookOpen,
  GraduationCap,
  Award
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../contexts/AppContext';

interface CollaborationHubProps {
  onBack: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  permissions: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
  lastActive: string;
  cursor?: { x: number; y: number };
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'file' | 'timetable_update';
  attachments?: Array<{ name: string; type: string; url: string }>;
  reactions?: Array<{ emoji: string; users: string[] }>;
}

interface ChangeLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'create' | 'edit' | 'delete' | 'move' | 'comment';
  description: string;
  details: any;
  reverted?: boolean;
}

interface Version {
  id: string;
  name: string;
  timestamp: string;
  author: string;
  description: string;
  changes: number;
  current: boolean;
}

export function CollaborationHub({ onBack, onToggleDarkMode, darkMode }: CollaborationHubProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'focus' | 'overlay'>('split');

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'faculty',
      avatar: 'SJ',
      status: 'online',
      permissions: 'owner',
      joinedAt: '2024-01-10T09:00:00Z',
      lastActive: '2024-01-10T14:30:00Z'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      content: 'Collaboration session started',
      timestamp: '2024-01-10T09:00:00Z',
      type: 'system'
    },
    {
      id: '2',
      sender: 'Dr. Sarah Johnson',
      content: 'Welcome everyone! Let\'s work on optimizing the timetable for the new semester.',
      timestamp: '2024-01-10T09:05:00Z',
      type: 'text'
    }
  ]);

  const [changeLog, setChangeLog] = useState<ChangeLog[]>([
    {
      id: '1',
      timestamp: '2024-01-10T09:15:00Z',
      user: 'Dr. Sarah Johnson',
      action: 'edit',
      description: 'Modified Data Structures class time',
      details: { from: '09:00-10:00', to: '10:00-11:00', day: 'Monday' }
    },
    {
      id: '2',
      timestamp: '2024-01-10T09:20:00Z',
      user: 'Prof. Mike Wilson',
      action: 'create',
      description: 'Added new lab session',
      details: { subject: 'Machine Learning Lab', time: '14:00-17:00', day: 'Friday' }
    }
  ]);

  const [versions, setVersions] = useState<Version[]>([
    {
      id: '1',
      name: 'Initial Draft',
      timestamp: '2024-01-10T08:00:00Z',
      author: 'Dr. Sarah Johnson',
      description: 'First version of the timetable',
      changes: 0,
      current: false
    },
    {
      id: '2',
      name: 'Conflict Resolution',
      timestamp: '2024-01-10T10:30:00Z',
      author: 'Prof. Mike Wilson',
      description: 'Resolved room allocation conflicts',
      changes: 8,
      current: false
    },
    {
      id: '3',
      name: 'Faculty Optimization',
      timestamp: '2024-01-10T14:00:00Z',
      author: 'Dr. Alice Brown',
      description: 'Optimized faculty workload distribution',
      changes: 12,
      current: true
    }
  ]);

  const startSession = useCallback(() => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    setIsSessionActive(true);
    
    // Simulate other users joining
    setTimeout(() => {
      const newCollaborator: Collaborator = {
        id: '2',
        name: 'Prof. Mike Wilson',
        role: 'faculty',
        avatar: 'MW',
        status: 'online',
        permissions: 'editor',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'System',
        content: `${newCollaborator.name} joined the session`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }]);
      
      toast.success(`${newCollaborator.name} joined the collaboration session`);
    }, 3000);
    
    toast.success('Collaboration session started');
  }, []);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
    setSessionId('');
    setCollaborators(prev => prev.filter(c => c.permissions === 'owner'));
    toast.info('Collaboration session ended');
  }, []);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;
    
    const currentUser = state.currentUser;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.name || 'You',
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  }, [message, state.currentUser]);

  const inviteUser = useCallback((email: string, permission: 'editor' | 'viewer') => {
    // Simulate sending invitation
    toast.success(`Invitation sent to ${email} with ${permission} permissions`);
    setShowInviteDialog(false);
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'faculty': return GraduationCap;
      case 'student': return BookOpen;
      default: return Users;
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-slate-100">
                    Collaboration Hub
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Real-time timetable collaboration
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Session Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {isSessionActive ? `Active Session (${collaborators.length})` : 'No Active Session'}
                </span>
              </div>

              {/* Session Controls */}
              {!isSessionActive ? (
                <Button onClick={startSession} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={() => setShowInviteDialog(true)} variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                  <Button onClick={endSession} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                </div>
              )}

              <Separator orientation="vertical" className="h-6" />
              <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="changes">Change Log</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {!isSessionActive ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Start Collaborative Session
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                    Begin a real-time collaboration session to work on timetables together with your team members.
                  </p>
                  <Button onClick={startSession} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Play className="h-5 w-5 mr-2" />
                    Start Collaboration Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Session Info */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        Active Collaboration Session
                      </CardTitle>
                      <CardDescription>
                        Session ID: {sessionId} • Started {formatTime(collaborators[0]?.joinedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {collaborators.length}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            Active Users
                          </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Edit3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                            {changeLog.length}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            Changes Made
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                            {messages.filter(m => m.type === 'text').length}
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">
                            Messages
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <GitBranch className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                          <div className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                            {versions.length}
                          </div>
                          <div className="text-sm text-orange-600 dark:text-orange-400">
                            Versions
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {changeLog.slice(0, 5).map((change) => {
                          const IconComponent = 
                            change.action === 'create' ? Plus :
                            change.action === 'edit' ? Edit3 :
                            change.action === 'delete' ? Minus :
                            change.action === 'move' ? ArrowLeft :
                            MessageSquare;

                          return (
                            <div key={change.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                  {change.description}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                  by {change.user} • {formatDate(change.timestamp)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Collaborators */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Active Collaborators
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {collaborators.map((collaborator) => {
                          const RoleIcon = getRoleIcon(collaborator.role);
                          return (
                            <div key={collaborator.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{collaborator.avatar}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(collaborator.status)} rounded-full border-2 border-white dark:border-slate-800`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {collaborator.name}
                                  </div>
                                  {collaborator.permissions === 'owner' && (
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                  <RoleIcon className="h-3 w-3" />
                                  <span className="capitalize">{collaborator.role}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {collaborator.permissions}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Collaborators Tab */}
          <TabsContent value="collaborators" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Team Members
              </h2>
              <Button onClick={() => setShowInviteDialog(true)} size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="grid gap-4">
              {collaborators.map((collaborator) => {
                const RoleIcon = getRoleIcon(collaborator.role);
                return (
                  <Card key={collaborator.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{collaborator.avatar}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(collaborator.status)} rounded-full border-2 border-white dark:border-slate-800`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {collaborator.name}
                              </div>
                              {collaborator.permissions === 'owner' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                              <div className="flex items-center gap-1">
                                <RoleIcon className="h-3 w-3" />
                                <span className="capitalize">{collaborator.role}</span>
                              </div>
                              <Badge variant="outline">
                                {collaborator.permissions}
                              </Badge>
                              <span className="capitalize text-green-600 dark:text-green-400">
                                {collaborator.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            Joined {formatDate(collaborator.joinedAt)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Last active {formatTime(collaborator.lastActive)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${
                        msg.type === 'system' ? 'justify-center' : ''
                      }`}>
                        {msg.type === 'system' ? (
                          <div className="text-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                            {msg.content}
                          </div>
                        ) : (
                          <>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {msg.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                  {msg.sender}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                              <div className="text-sm text-slate-700 dark:text-slate-300">
                                {msg.content}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Changes Tab */}
          <TabsContent value="changes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Change History
                </CardTitle>
                <CardDescription>
                  Track all modifications made during the collaboration session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changeLog.map((change) => {
                    const IconComponent = 
                      change.action === 'create' ? Plus :
                      change.action === 'edit' ? Edit3 :
                      change.action === 'delete' ? Minus :
                      change.action === 'move' ? ArrowLeft :
                      MessageSquare;

                    return (
                      <div key={change.id} className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {change.description}
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {change.action}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                            by {change.user} • {formatDate(change.timestamp)}
                          </div>
                          {change.details && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                              {JSON.stringify(change.details, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Versions Tab */}
          <TabsContent value="versions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Version History
                </CardTitle>
                <CardDescription>
                  Manage different versions of your timetable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {versions.map((version) => (
                    <div key={version.id} className={`p-4 border rounded-lg ${
                      version.current 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {version.name}
                          </div>
                          {version.current && (
                            <Badge variant="default" className="bg-green-600">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {!version.current && (
                            <Button variant="outline" size="sm">
                              <Merge className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {version.description}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>by {version.author}</span>
                        <span>{formatDate(version.timestamp)}</span>
                        <span>{version.changes} changes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this timetable
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="colleague@institution.edu" />
            </div>
            <div>
              <Label htmlFor="permission">Permission Level</Label>
              <Select defaultValue="editor">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor - Can modify the timetable</SelectItem>
                  <SelectItem value="viewer">Viewer - Can only view the timetable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => inviteUser('example@email.com', 'editor')} 
                className="flex-1"
              >
                Send Invitation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Play = ({ className, ...props }: { className?: string }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);