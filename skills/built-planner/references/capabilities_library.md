# Capabilities Library

This library acts as the central intelligence for the `built-planner` skill. It explains **when** to use each reference (Agent, Skill, Rule) and **what** purpose it serves.

## 🤖 Agents
Use these sub-agents for specialized tasks. Read the full agent definition in `references/agents/[agent-name].md` for details.

- **architect**: Software architecture specialist. Use for system design, scalability planning, and high-level technical decisions.
- **planner**: Expert planning specialist. Use for breaking down complex features or refactoring tasks into manageable steps.
- **code-reviewer**: Expert code reviewer. Use PROACTIVELY after writing code to check for quality, security, and maintainability.
- **security-reviewer**: Security specialist. Use PROACTIVELY when handling user input, auth, or sensitive data. Checks for vulnerabilities.
- **tdd-guide**: TDD specialist. Use PROACTIVELY to enforce write-tests-first methodology.
- **python-reviewer**: Python expert. Use for all Python code changes (PEP 8, type hints, performance).
- **go-reviewer**: Go expert. Use for all Go code changes (idioms, concurrency, error handling).
- **database-reviewer**: PostgreSQL/Supabase specialist. Use for SQL optimizations, schema design, and migrations.
- **e2e-runner**: End-to-end testing specialist. Use for generating and running critical user flow tests (Playwright).
- **build-error-resolver**: Build fix specialist. Use when build or type errors occur.
- **refactor-cleaner**: Cleanup specialist. Use for removing dead code and consolidation.
- **doc-updater**: Documentation specialist. Use for updating codemaps and READMEs.

## 🛠️ Skills
Use these skills for specific workflows and patterns. Read `references/skills/[skill-name]/SKILL.md` for execution steps.

### Development Workflows
- **tdd-workflow**: Test-Driven Development workflow (Red-Green-Refactor).
- **verification-loop**: Comprehensive verification system for sessions.
- **iterative-retrieval**: Progressive context refinement for subagents.
- **strategic-compact**: Manual context compaction strategies.
- **continuous-learning-v2**: Instinct-based learning system.

### Language & Framework Patterns
- **backend-patterns**: Node.js/Express/Next.js API patterns.
- **frontend-patterns**: React/Next.js UI patterns and state management.
- **python-patterns**: Python idioms and best practices.
- **golang-patterns**: Go idioms and best practices.
- **django-patterns**: Django architecture and DRF patterns.
- **springboot-patterns**: Spring Boot architecture patterns.
- **clickhouse-io**: ClickHouse analytics patterns.

### Testing & Quality
- **python-testing**: Pytest strategies and fixtures.
- **golang-testing**: Go testing table-driven patterns.
- **django-tdd**: Django testing with pytest-django.
- **springboot-tdd**: Spring Boot TDD workflow.
- **e2e-testing**: Playwright E2E testing patterns.

### Security & DevOps
- **security-review**: Security checklist for auth/sensitive features.
- **security-scan**: Scan configuration for vulnerabilities.
- **django-security**: Django security best practices.
- **springboot-security**: Spring Boot security best practices.
- **deployment-patterns**: CI/CD, Docker, and rollout strategies.
- **docker-patterns**: Docker Compose and container security.
- **database-migrations**: Migration best practices (Postgres, Django, etc.).

### Specialized
- **api-design**: REST API design standards.
- **content-hash-cache-pattern**: Caching expensive results via SHA-256.
- **regex-vs-llm-structured-text**: Decision framework for parsing.
- **nutrient-document-processing**: Document processing (PDF, DOCX) API.

## 📏 Rules
Refer to `references/rules/[language]/` for specific guidelines.

- **Common**: Universal principles (Coding Style, Git Workflow, Testing, Performance, Security). Apply to ALL projects.
- **TypeScript**: TS/JS specific patterns and tools.
- **Python**: Python specific patterns and tools.
- **Golang**: Go specific patterns and tools.

---
**Instruction**: When creating a plan, identify the relevant agents, skills, and rules from this list. Then, read the specific reference files to get the full instructions to include in the `task.md`.
