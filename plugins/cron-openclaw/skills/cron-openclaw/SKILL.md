---
name: cron-openclaw
description: Guide for creating and managing cron jobs and scheduled tasks in OpenClaw. Use this skill when the user wants to schedule periodic tasks, set up reminders, batch automated checks, configure the OpenClaw Gateway scheduler, or decide between using a cron job versus a heartbeat. Triggers include "create a cron job", "schedule a task", "remind me in", "run every", "automate this check", "cron vs heartbeat".
---

# OpenClaw Cron Jobs

This skill provides instructions for configuring, managing, and reasoning about the OpenClaw Gateway scheduler for cron jobs.

## Core Concepts: Cron vs. Heartbeat

OpenClaw has two primary ways to run automated tasks: **Cron** and **Heartbeat**. It's important to choose the right one for the job.

### When to Use Cron
- **Exact timing required:** Tasks that must run at a specific time (e.g., "Send this at 9:00 AM").
- **One-shot reminders:** Using the `--at` flag (e.g., "Remind me in 20 minutes").
- **Standalone tasks:** Tasks that don't need conversational context.
- **Heavy analysis:** Tasks requiring a different model (e.g., Opus) or high thinking mode.
- **Noisy/frequent tasks:** Tasks that would clutter the main session history.

### When to Use Heartbeat
- **Multiple periodic checks:** Batching inbox, calendar, notifications, and weather checks instead of multiple crons.
- **Context-aware decisions:** The agent knows what the user is working on and can prioritize.
- **Conversational continuity:** Runs share the same main session.

## Session Targets

- **Main Session (`--session main`)**: Enqueues a system event (using `--system-event`), which the agent handles during the next heartbeat (or immediately if `--wake now`) with full conversational context.
- **Isolated Session (`--session isolated`)**: Runs with a clean slate, without prior context. Use `--message` instead of `--system-event`. Ideal for independent tasks that announce directly to a channel without cluttering main history.
- **Current Session (`--session current`)**: Binds to the session where the cron is created.
- **Custom Session (`--session session:<custom-id>`)**: Maintains persistent context across runs.

## Important CLI Commands

### Adding a Cron Job (Examples)

**Isolated Recurring Job (e.g., Morning Briefing):**
```bash
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing: weather, calendar, top emails, news summary." \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"
```

**Main Session One-Shot Reminder:**
```bash
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Reminder: standup meeting starts in 10 minutes." \
  --wake now \
  --delete-after-run
```

### Other Useful Options
- **Load spreading**: Recurring top-of-hour schedules are staggered by up to 5 minutes by default. Override with `--stagger <duration>` (e.g., `--stagger 30s`) or completely disable staggering for precise execution with `--exact`.
- **Delivery control**:
  - `--announce`: Posts directly without waiting for a heartbeat.
  - `--no-deliver`: Suppresses any delivery.
- **Context optimization**: `--light-context` reduces context overhead for simple queries.
- **Specific Agent**: `--agent <name>` pins the job to a specific agent (e.g., `--agent ops`).

### Managing Cron Jobs

- **List jobs**: `openclaw cron list`
- **Run immediately**: `openclaw cron run <jobId>`
- **View job runs**: `openclaw cron runs --id <jobId>` (Use `--limit 50` for more history)
- **Edit an existing job**: 
  ```bash
  openclaw cron edit <jobId> --model "opus" --thinking low
  openclaw cron edit <jobId> --announce --channel telegram --to "123456789"
  openclaw cron edit <jobId> --no-deliver
  ```
- **Clear an agent pin**: `openclaw cron edit <jobId> --clear-agent`

## API & Storage details
- **Storage Path**: Jobs are persistently stored in `~/.openclaw/cron/jobs.json`.
- **JSON Schema (Tool Equivalents `cron.add`)**:
  - `schedule.kind`: `'at'`, `'every'` (uses `everyMs`), or `'cron'` (uses `expr` and optional `tz`).
  - `wakeMode`: Defaults to `'now'`. Can be `'next-heartbeat'`.
  - `payload`: Use `{ "kind": "systemEvent", "text": "..." }` for main session, or `{ "kind": "agentTurn", "message": "..." }` for isolated.
  - `deleteAfterRun`: Automatically set to `true` for `at` schedules if omitted.

## Best Practices
1. **Reminders**: If the user asks for a simple quick reminder, always use `--session main`, `--system-event`, and `--delete-after-run`.
2. **Alerts**: To send an announcement directly to WhatsApp/Telegram/Slack, use `--session isolated`, `--message`, `--announce`, `--channel`, and `--to`.
3. **Migration**: For older legacy cron jobs that use `notify: true` with a `cron.webhook`, migrate them to the new delivery webhook configuration using:
   ```bash
   openclaw doctor --fix
   ```
