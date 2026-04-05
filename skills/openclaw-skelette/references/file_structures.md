# Structure et Rôle des Fichiers Squelette (Skeleton Files)

Lorsqu'un agent OpenClaw est conçu ou audité, chaque fichier de son dossier racine a un rôle précis, unique et ne doit jamais déborder sur les autres. La dissociation des tâches est primordiale. Voici le périmètre strict de chaque fichier :

## 1. IDENTITY.md (L'Identité et le Persona)
**Rôle :** Définit *qui* est l'agent, son nom, son rôle exact dans l'organisation, sa personnalité (vibe), et ses "quirks" (ex: utilisation d'un emoji spécifique).
**À ne pas inclure :** Des instructions procédurales ou des règles sur la manière d'utiliser des outils. Pas de règles de gestion de la mémoire.
**Critère de validation :** Devons-nous savoir comment l'agent s'exprime et quelle est sa posture professionnelle ? C'est ici.

## 2. SOUL.md (Les Vérités Fondamentales & La Vision)
**Rôle :** Définit le "Pourquoi" (La Raison d'Être) de l'agent. Ce sont ses valeurs clés (ex: "Culture du Résultat", "Transparence par défaut"). Le SOUL garantit que même après 1000 interactions, l'agent garde le cap sur sa mission première (ex: *Croissance des ventes* ou *Stabilité de l'infrastructure*).
**À ne pas inclure :** Des instructions de code ou des workflows.
**Critère de validation :** Est-ce une règle éthique ou stratégique indéfectible ? C'est ici.

## 3. AGENTS.md (La Hiérarchie et l'Écosystème)
**Rôle :** Documente l'environnement inter-agents. Qui est son supérieur direct ? Qui sont ses subordonnés ? Quelles sont les `Session Keys` pour router un message vers l'agent 'Nora' ou 'Zozo' ?
**À ne pas inclure :** La personnalité des autres agents. Seulement la cartographie et les flux de communication.
**Critère de validation :** Si l'agent doit escalader un problème ou déléguer, il doit lire ce fichier pour savoir à qui s'adresser.

## 4. MEMORY.md (La Règle Zéro Amnésie)
**Rôle :** Définit les protocoles obligatoires de mise à jour de la mémoire. Explique à l'agent *quand* et *comment* écrire dans `memory/episodic/`, `memory/semantic/`, ou `memory/procedural/`, et comment créer des "snapshots d'urgence" pour éviter la perte de contexte en cas de reset.
**À ne pas inclure :** L'historique en lui-même (qui se trouve dans le dossier `memory/`), seulement les instructions sur comment utiliser la mémoire.

## 5. TOOLS.md (Les Outils Locaux et Spécificités)
**Rôle :** Contient la configuration locale spécifique aux outils (identifiants, URL d'API, aliases SSH, répertoires de travail, clés de configuration). "Comment utiliser tel outil dans CET environnement précis."
**À ne pas inclure :** Les scripts en dur (qui vont dans les `skills/` ou un dossier `scripts/`).

## 6. HEARTBEAT.md (Les Routines et Tâches de Fond)
**Rôle :** Définit ce que l'agent doit faire "quand il n'a rien à faire" ou à intervalles réguliers. Ce sont ses routines (ex: "Tous les soirs à 18h, audite le CRM et envoie un récapitulatif").
**À ne pas inclure :** Des processus déclenchés par un utilisateur en live.
**Critère de validation :** Concerne uniquement les actions récurrentes et les tâches de fond.

## 7. USER.md (Le Contexte Utilisateur)
**Rôle :** Documente qui est l'utilisateur principal (souvent le CEO ou l'Orchestrateur humain), ses préférences de communication, ses objectifs globaux, ses contraintes.
**À ne pas inclure :** Les informations sur les autres agents IA.

---
**Attention absolue au contexte implicite :**
Chaque fichier doit être lisible par un LLM "neuf" venant d'être instancié. **Aucun sous-entendu n'est toléré.** Si un processus nécessite de savoir que "le fichier Dver est un backend en Python", cela doit être écrit explicitement, pas supposé.
