---
name: adaptive-learner
description: |
  Meta-skill for continuous AI self-improvement through structured feedback analysis.
  Creates domain-specific learning skills that accumulate actionable principles over time.
  Use this skill when:
  (1) The user wants the AI to learn and improve on a specific domain (e.g., VSL creation, sales coaching, content curation, code review).
  (2) The user provides examples of good vs bad outputs and wants the AI to extract reusable principles.
  (3) The user says things like "learn from this", "improve based on feedback", "remember this for next time", "analyze what works", "create a learning profile", "get better at X".
  (4) The user wants to create structured knowledge from repeated feedback loops.
  This skill does NOT replace domain expertise — it provides the methodology for extracting and storing transferable principles from user feedback.
---

# Adaptive Learner

A meta-skill that enables continuous self-improvement by creating domain-specific learning skills. Each domain skill accumulates validated, actionable principles from user feedback.

## How It Works

```
META-SKILL (this file)              DOMAIN SKILLS (generated)
Contains the METHODOLOGY    --->    Contains ACCUMULATED KNOWLEDGE
  - Discovery questions               - Domain profile
  - Analysis framework                 - Validated principles
  - Skill generation                   - Learning history
```

## Workflow Decision Tree

1. Determine the operation type:
   **Creating a new domain skill?** --> Follow "Phase 1: Discovery" below
   **Receiving feedback on existing domain?** --> Follow "Phase 2: Feedback Analysis" below
   **Producing a deliverable in a learned domain?** --> Follow "Phase 3: Apply Principles" below

---

## Phase 1: Discovery (New Domain Skill Creation)

When the user wants to improve on a new domain, run this structured interview.
Ask questions in batches of 2-3 MAX to avoid overwhelming the user.

### Step 1 — Understand the Domain

Ask:
- "What domain do you want me to continuously improve on?"
- "What is the business context? Who is the target audience?"

Goal: Identify the domain name and its context.

### Step 2 — Understand the Deliverable

Ask:
- "What exactly do I produce in this domain?" (video, text, code, recommendations...)
- "What are the format constraints?" (resolution, duration, file type, structure...)
- "What tools/stack do I use?" (Remotion, React, Python, plain text...)

Goal: Identify the deliverable type, format, and technical stack.
The technical stack is critical — every principle must have an implementation in this stack.

### Step 3 — Define Success

Ask:
- "How do we know if the output is successful or not?" (metrics, subjective score, client feedback...)
- "Who judges?" (user directly, metrics, both?)
- "How will you give me feedback?" (global score, annotations on specific parts, comparison of examples...)

Goal: Establish clear success criteria and feedback format.

### Step 4 — Define Analysis Categories

Based on the domain, PROPOSE a list of analysis categories and ask the user to validate, reorder, add, or remove.

Example categories by domain:
- **Video/VSL**: Hook, Timing & Rhythm, Visual Composition, Copywriting, Effects & Animations, Audio, Narrative Structure
- **Content curation**: Relevance, Presentation format, Depth, Source quality, Actionability
- **Sales coaching**: Opening, Objection handling, Closing technique, Tone, Personalization
- **Code review**: Architecture, Readability, Performance, Error handling, Testing

Ask the user to prioritize them (priority #1 = most important for success).

### Step 5 — Recap & Generate

Summarize all answers and ask for validation. Then generate the domain skill.
See `references/domain-skill-template.md` for the exact structure to generate.

The domain skill must be placed in the current workspace or the user's skills directory.

---

## Phase 2: Feedback Analysis (Core Learning Loop)

When the user provides feedback (examples, scores, comments), follow this process:

### Step 1 — Collect

Gather all feedback: scores, comments, comparisons, specific annotations.

### Step 2 — Extract Observations

List every raw observation from the feedback. Be exhaustive.

### Step 3 — Apply the 3-Level Filter (MANDATORY)

For EACH observation, apply these 3 filters in order:

```
Observation --> "Winning video uses red"
  |
  +- FILTER 1: CONTEXTUAL?
  |  "Would this change if the product/subject changed?"
  |   YES --> REJECT (color depends on product)
  |   NO  --> Continue
  |
  +- FILTER 2: GENERALIZABLE?
  |  "Can this be expressed as a rule WITHOUT referencing
  |   specific content?"
  |   NO  --> REJECT (too specific)
  |   YES --> Continue
  |
  +- FILTER 3: STRUCTURAL?
     "Is this about HOW (structure, timing, hierarchy)
      rather than WHAT (subject, color, specific image)?"
      NO  --> REJECT
      YES --> ACCEPT as principle
```

### Step 4 — Formulate Validated Principles

For each accepted observation, create a principle with TWO LEVELS:

1. **Conceptual level**: The rule in plain language
   - Example: "No shot should remain static for more than 2 seconds"

2. **Implementation level**: The concrete code/config in the domain's tech stack
   - Example: `<Sequence durationInFrames={60}>` (2 sec at 30fps)
   - Include an **anti-pattern** when relevant (what NOT to do)

### Step 5 — Evaluate Confidence

For each principle:
- How many positive examples confirm it?
- How many negative examples confirm it?
- Are there counter-examples?
- Assign confidence: 1 to 5 stars

### Step 6 — Update the Domain Skill

Update `references/principles.md` in the domain skill:
- New principles: Add with initial confidence
- Existing principles: Increase/decrease confidence based on new evidence
- Contradicted principles: Add counter-example, lower confidence
- Log the session in `references/learning-log.md`

---

## Phase 3: Apply Principles (Producing a Deliverable)

When producing output in a domain where a learning skill exists:

1. Read `references/principles.md` from the domain skill
2. Apply all principles with confidence >= 3 stars
3. Prioritize by category order (as defined in domain-profile.md)
4. If a principle conflicts with the current context, flag it to the user
5. After delivery, remind the user they can provide feedback to improve future outputs

---

## Important Rules

- **NEVER confuse contextual with structural**: Colors, specific images, and subjects depend on the product. Timing, composition, hierarchy, and proportions are structural.
- **Every principle needs BOTH levels**: A conceptual understanding without implementation leads to bad code. Implementation without understanding leads to blind copy-paste.
- **Anti-patterns are as valuable as patterns**: Knowing what NOT to do prevents regression.
- **Confidence is dynamic**: A 5-star principle can drop if new evidence contradicts it.
- **The domain profile is the source of truth**: Always refer to domain-profile.md before analyzing feedback.
