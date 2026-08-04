# @pipeworx/timeapi-io

[TimeAPI.io](https://timeapi.io/swagger/index.html) MCP — keyless current time, zone conversion, DST queries.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `current_time(timeZone)` — current time in a zone
- `current_time_coordinate(latitude, longitude)` — current time at lat/lon
- `current_time_ip(ipAddress)` — current time at an IP
- `current_iso_zoned_date_time(timeZone)` — ISO zoned datetime
- `current_zone_info(timeZone)` — zone info (DST flag, UTC offset)
- `convert_time_zone(fromTimeZone, dateTime, toTimeZone, dstAmbiguity?)` — convert between zones
- `day_of_the_week(date)` — day of week for a date
- `list_zones()` — supported zones
- `translate_to_iso(date, format)` — parse a custom-format date to ISO

## Data source

`https://timeapi.io/api`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "timeapi-io": {
      "url": "https://gateway.pipeworx.io/timeapi-io/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Timeapi Io data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
