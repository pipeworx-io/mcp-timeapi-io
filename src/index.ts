interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * TimeAPI.io MCP.
 */


const BASE = 'https://timeapi.io/api';
const UA = 'pipeworx-mcp-timeapi-io/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'current_time', description: 'Current time in a zone.', inputSchema: { type: 'object', properties: { timeZone: { type: 'string' } }, required: ['timeZone'] } },
  {
    name: 'current_time_coordinate',
    description: 'Current time at lat/lon.',
    inputSchema: { type: 'object', properties: { latitude: { type: 'number' }, longitude: { type: 'number' } }, required: ['latitude', 'longitude'] },
  },
  { name: 'current_time_ip', description: 'Current time at IP.', inputSchema: { type: 'object', properties: { ipAddress: { type: 'string' } }, required: ['ipAddress'] } },
  { name: 'current_iso_zoned_date_time', description: 'ISO zoned datetime.', inputSchema: { type: 'object', properties: { timeZone: { type: 'string' } }, required: ['timeZone'] } },
  { name: 'current_zone_info', description: 'Zone info.', inputSchema: { type: 'object', properties: { timeZone: { type: 'string' } }, required: ['timeZone'] } },
  {
    name: 'convert_time_zone',
    description: 'Convert datetime between zones.',
    inputSchema: {
      type: 'object',
      properties: { fromTimeZone: { type: 'string' }, dateTime: { type: 'string' }, toTimeZone: { type: 'string' }, dstAmbiguity: { type: 'string' } },
      required: ['fromTimeZone', 'dateTime', 'toTimeZone'],
    },
  },
  { name: 'day_of_the_week', description: 'Day of week for a date.', inputSchema: { type: 'object', properties: { date: { type: 'string' } }, required: ['date'] } },
  { name: 'list_zones', description: 'Supported zones.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'translate_to_iso',
    description: 'Parse custom-format date to ISO.',
    inputSchema: { type: 'object', properties: { date: { type: 'string' }, format: { type: 'string' } }, required: ['date', 'format'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`TimeAPI: ${res.status}`);
    return res.json();
  };
  const post = async (path: string, body: unknown) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`TimeAPI: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'current_time':
      return get('/Time/current/zone', { timeZone: reqStr('timeZone', '"Europe/Amsterdam"') });
    case 'current_time_coordinate':
      return get('/Time/current/coordinate', { latitude: args.latitude, longitude: args.longitude });
    case 'current_time_ip':
      return get('/Time/current/ip', { ipAddress: reqStr('ipAddress', '"1.1.1.1"') });
    case 'current_iso_zoned_date_time':
      return get('/Time/current/zone/iso', { timeZone: reqStr('timeZone', '"Europe/Amsterdam"') });
    case 'current_zone_info':
      return get('/TimeZone/zone', { timeZone: reqStr('timeZone', '"Europe/Amsterdam"') });
    case 'convert_time_zone':
      return post('/Conversion/ConvertTimeZone', {
        fromTimeZone: reqStr('fromTimeZone', '"America/New_York"'),
        dateTime: reqStr('dateTime', '"2026-01-01 12:00:00"'),
        toTimeZone: reqStr('toTimeZone', '"Asia/Tokyo"'),
        dstAmbiguity: args.dstAmbiguity ?? '',
      });
    case 'day_of_the_week':
      return get(`/Conversion/DayOfTheWeek/${encodeURIComponent(reqStr('date', '"2026-05-19"'))}`);
    case 'list_zones':
      return get('/TimeZone/AvailableTimeZones');
    case 'translate_to_iso':
      return post('/Conversion/Translate', { date: reqStr('date', '"19/05/2026"'), format: reqStr('format', '"dd/MM/yyyy"') });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
