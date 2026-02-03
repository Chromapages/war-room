export interface AgentLog {
  id: string;
  timestamp: string;
  agent: 'Chroma' | 'ClientOps' | 'BizOps' | 'System';
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  contextData?: any;
}

export interface InfraStatus {
  vps: 'healthy' | 'degraded' | 'down';
  domain: 'active' | 'expiring' | 'issues';
  quota: {
    claude: number;
    gemini: number;
    openai: number;
  };
}

export const MOCK_LOGS: AgentLog[] = [
  { id: '1', timestamp: '10:42:01', agent: 'Chroma', level: 'info', message: 'Checked emails - Inbox Zero' },
  { id: '2', timestamp: '10:42:05', agent: 'BizOps', level: 'success', message: 'Deployed Quote Calculator v1' },
  { id: '3', timestamp: '10:43:12', agent: 'System', level: 'warning', message: 'Gemini Quota < 20%' },
  { id: '4', timestamp: '10:44:00', agent: 'ClientOps', level: 'error', message: 'Union National Tax site Unreachable' },
  { id: '5', timestamp: '10:45:30', agent: 'Chroma', level: 'info', message: 'Analyzing lead sources from yesterday' },
  { id: '6', timestamp: '10:46:15', agent: 'ClientOps', level: 'success', message: 'Scheduled 3 follow-up calls' },
  { id: '7', timestamp: '10:47:00', agent: 'System', level: 'info', message: 'Daily backup completed (45MB)' },
  { id: '8', timestamp: '10:47:45', agent: 'BizOps', level: 'info', message: 'Detected new competitor pricing update' },
  { id: '9', timestamp: '10:48:22', agent: 'Chroma', level: 'success', message: 'Resolved user inquiry #4492 via KB' },
  { id: '10', timestamp: '10:49:10', agent: 'System', level: 'warning', message: 'API Latency spike (OpenAI) > 2s' },
];

export const MOCK_BLOCKERS: ActionItem[] = [
  { id: 'a1', title: 'Approve Invoice #1024', description: 'Vendor: L. Denise. Amount: $450.00', status: 'pending' },
  { id: 'a2', title: 'Server Disk Space Low', description: 'Clean up temp files on VPS-01? (Recover 4GB)', status: 'pending' },
];

export const MOCK_INFRA: InfraStatus = {
  vps: 'healthy',
  domain: 'active',
  quota: {
    claude: 85,
    gemini: 18,
    openai: 92
  }
};
