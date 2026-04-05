---
name: built-planner
description: Comprehensive task planning using the `everything-claude-code` ecosystem. Use this skill when the user has provided detailed specifications or after a specification phase is complete. It spontaneously proposes a detailed execution plan (`task.md`) by consulting the `capabilities_library.md` to select the most appropriate Agents, Skills, and Rules for each step of the task.
---

# Built Planner

This skill helps you create a detailed execution plan by leveraging the specialized capabilities of the `everything-claude-code` ecosystem.

## When to Use

- **Trigger**: Spontaneously propose this skill after a specification phase is complete (e.g., `requirements.md`, `design.md`, or `implementation_plan.md` are finalized).
- **Trigger**: When the user explicitly asks for a detailed plan or task breakdown.
- **Goal**: Transform high-level requirements into a granular, actionable `task.md` file.

## Execution Steps

### 1. Analyze Context
Read the completed specifications or requirements provided by the user. Understand the scope, technologies involved, and critical constraints.

### 2. Consult Capabilities Library
Read `references/capabilities_library.md` to identify the relevant tools for the job.
- **Agents**: Which specialized sub-agents (e.g., `architect`, `security-reviewer`) should be involved?
- **Skills**: Which workflows (e.g., `tdd-workflow`, `backend-patterns`) apply to the tasks?
- **Rules**: Which language-specific rules (e.g., `typescript`, `python`) must be followed?

### 3. Generate `task.md`
Create or update a `task.md` file with a detailed breakdown. For each main task or sub-task, explicitly state the **Recommended Capability** (Agent, Skill, or Rule).

#### Task Format Example

```markdown
# Task: Implement User Authentication

- [ ] Design Authentication Flow <!-- id: 1 -->
    - **Agent**: `architect` (to review the flow against security standards)
    - **Skill**: `security-review` (to ensure all checklist items are covered)
- [ ] Implement Backend Logic <!-- id: 2 -->
    - **Skill**: `backend-patterns` (for API structure)
    - **Rule**: `typescript` (for coding standards)
    - [ ] Create User Model <!-- id: 3 -->
    - [ ] Implement Login Endpoint <!-- id: 4 -->
- [ ] Verify Implementation <!-- id: 5 -->
    - **Agent**: `security-reviewer` (to scan for vulnerabilities)
    - **Skill**: `tdd-workflow` (ensure tests are written first)
```

### 4. Detailed Instructions
For complex steps, read the specific reference file (e.g., `references/skills/tdd-workflow/SKILL.md`) to provide granular instructions in the checklist or accompanying comments.
