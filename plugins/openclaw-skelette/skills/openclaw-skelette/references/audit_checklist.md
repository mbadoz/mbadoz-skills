# Grille d'Audit d'Agent OpenClaw (Zéro Sous-entendu)

Lorsqu'on te demande d'auditer un agent OpenClaw, tu dois analyser tous ses fichiers squelettes (IDENTITY, SOUL, AGENTS, etc.) avec une extrême rigueur. Ton but est de t'assurer que **si l'agent subit un crash et est redémarré avec zéro contexte (total reset), il comprend exactement et instantanément ce qu'il a à faire sans qu'un humain n'ait à lui expliquer les "non-dits".**

Utilise cette check-list pour auditer l'agent :

## 1. Audit du But Réel (The "Real Goal" Check)
- [ ] Le `SOUL.md` et le `IDENTITY.md` expriment-ils de manière *non-ambiguë* la finalité de cet agent ?
- [ ] L'agent pourrait-il se tromper de priorité ? (Ex: un agent Dev pourrait croire que sa priorité est la rapidité alors que c'est la sécurité). Si oui, le but réel n'est pas assez clair.
- [ ] Les KPI ou mesures de succès de l'agent sont-ils définis factuellement ?

## 2. Audit du Contexte Autonome (Zéro Sous-entendu Formatif)
- [ ] **Détection des informations implicites :** Y a-t-il des termes comme "notre CRM habituel" ou "le projet principal" ? -> *Échec.* Cela doit être : "Le CRM Google Sheets (ID: 13A5QsHKvsHquSXfW...)" ou "Le backend Python Dver".
- [ ] **Dépendances temporelles :** Y a-t-il des indications du type "comme nous en avons convenu" ? -> *Échec.* Réécrire en dur la consigne convenue.
- [ ] **Amnésie Tst :** Si je prends ce `SKILL`/`SOUL` et que je le donne à un tout nouveau modèle Anthropic n'ayant jamais parlé à l'utilisateur, pourra-t-il exécuter la tâche sans poser de question de clarification sur le domaine ?

## 3. Dissociation des Tâches (Separation of Concerns)
- [ ] Le `IDENTITY.md` est-il pollué par des instructions procédurales (ex: "Fais des requêtes API...") ? -> *Échec.* Déplacer dans les Skills ou la Memory Procédurale.
- [ ] Le `MEMORY.md` contient-il les logs réels ? -> *Échec.* Il ne doit contenir que le mode d'emploi de la mémoire, les logs vont dans `memory/`.
- [ ] Les alias techniques (SSH, Caméras, Configs) sont-ils bien isolés dans `TOOLS.md` et non éparpillés dans `AGENTS.md` ou `SOUL.md` ?

## 4. Audit des Flux de Communication
- [ ] Le fichier `AGENTS.md` décrit-il une boucle infinie de communication ou un deadlock ?
- [ ] Les "Session Keys" pour router les commandes aux autres agents sont-elles strictement définies avec leur syntaxe exacte ?

**Méthode de Restitution de l'Audit :**
Lorsque tu as fini ton audit, présente toujours tes retours à l'utilisateur sous la forme d'un markdown comportant :
1. **Le diagnostic global** (L'agent a-t-il compris sa mission ?).
2. **Les failles d'implicite** (Les sous-entendus détectés qui casseront lors d'un reset).
3. **Les erreurs de dissociation de fichiers** (Ce qui est placé au mauvais endroit).
4. **Le code corrigé (Diffs)** suggérant les fusions ou déplacements de contenu.
