---
name: openclaw-skelette
description: "Expert en création, audit et optimisation des squelettes d'agents OpenClaw (IDENTITY, SOUL, AGENTS, MEMORY, TOOLS, HEARTBEAT, USER). Spécialiste de la dissociation stricte des rôles par fichier, la gestion de mémoires persistantes sans perte de contexte, et de la détection de 'sous-entendus' humains (zero-implicit context). À utiliser lorsque l'utilisateur demande : de créer ou configurer un nouvel agent OpenClaw, d'auditer l'architecture d'un agent, de s'assurer qu'un sous-agent ne perd aucun contexte lors d'un reset, ou d'optimiser le SOUL/IDENTITY d'un agent."
---

# Création & Audit de Squelette OpenClaw

Cette compétence (skill) te donne les règles strictes pour agir en tant qu'Architecte Organigramme et Concepteur de sous-agents OpenClaw. OpenClaw structure ses agents via une architecture de fichiers modulaires très précise.

## Périmètre et Dissociation des Fichiers

Lorsqu'on te demande de créer un agent, tu dois générer ou modifier une structure de fichiers bien précise où chaque fichier a un périmètre exclusif. 
**Ne mélange jamais les responsabilités des fichiers.** 

**Lecture préalable obligatoire :**
Avant de rédiger ou d'auditer quoi que ce soit, **lis impérativement** le fichier `references/file_structures.md`. Il te donnera le rôle exact de : `IDENTITY.md`, `SOUL.md`, `AGENTS.md`, `MEMORY.md`, `TOOLS.md`, `HEARTBEAT.md`, `USER.md`.

## Procédure de Création d'Agent

1. **Analyser le Rôle :** Demande à l'utilisateur ou déduis-le du contexte.
2. **Génération stricte :** Rédige les fichiers sans le moindre contexte implicite ou « sous-entendu » humain. L'agent doit tout comprendre, même s'il vient d'être reset à zéro.
3. **Livraison :** Fournis le contenu des fichiers isolés en Markdown (ou écris-les directement si le dossier de l'agent est précisé).

## Procédure d'Audit d'Agent (Zero-Amnesia & Zero-Implicit)

Lorsqu'on te demande de vérifier ou d'auditer les règles / "skeleton" d'un agent existant :
1. **Lis le fichier `references/audit_checklist.md`** pour connaître la méthodologie d'audit.
2. Traque impitoyablement tout terme flou ("fais comme d'habitude", "le projet principal", "notre base de données").
3. Vérifie que l'agent a une consigne stricte sur la façon d'imprimer l'état de sa mémoire avant reset (`MEMORY.md`).
4. Propose les refactorisations sous forme de blocs de fichiers revus et corrigés.
