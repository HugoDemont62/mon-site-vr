# mon-site-vr

Un petit projet React + Vite qui sert de portfolio 3D avec Three.js et support VR.

Ce README explique rapidement comment installer, lancer et dépanner le projet localement.

## Prérequis

- Node.js (>=16 recommandé) et npm
- Navigateur moderne (Chrome/Edge/Firefox récent) avec support WebXR si vous voulez tester la VR

## Installation

Ouvrez PowerShell à la racine du projet (`C:\wamp64\www\mon-site-vr`) puis :

```powershell
npm install
```

> Remarque : le projet utilise quelques dépendances natives et WebAssembly (rapier3d / loaders). Un plugin Vite a été ajouté pour gérer correctement les `.wasm` en développement.

## Démarrer le serveur de développement

```powershell
npm run dev
```

Par défaut Vite propose le serveur sur le port 3000 ; si ce port est pris, Vite choisira un port alternatif (ex. 3001). Ouvrez l'une des URLs indiquées dans la console.

## Compilation pour la production

```powershell
npm run build
```

Le résultat est dans le dossier `dist/`.

## Changements importants apportés (résolution d'erreurs)

Pendant le développement, une erreur Vite liée à WebAssembly est apparue :

> "ESM integration proposal for Wasm" is not supported currently. Use vite-plugin-wasm or other community plugins to handle this. Alternatively, you can use `.wasm?init` or `.wasm?url`.

Pour corriger cela j'ai :

- installé et activé `vite-plugin-wasm` dans `vite.config.js`.
- ajusté quelques types TypeScript et imports pour harmoniser l'API Three.js/VR :
  - `vite.config.js` : ajout de `import wasm from 'vite-plugin-wasm'` et `wasm()` dans `plugins`
  - `src/main.tsx` : suppression de l'extension `.tsx` dans l'import d'`App`
  - corrections de types dans `src/lib/Engine.ts`, `src/lib/VRManager.ts`, `src/lib/VRControls.ts`

Ces changements permettent au serveur de développement de démarrer sans l'erreur Wasm (dans la grande majorité des cas). Si vous voyez encore une erreur liée à un import `.wasm`, il est possible qu'une dépendance fasse un import direct ; il faudra alors modifier cet import en `.wasm?url` ou `.wasm?init` ou créer un wrapper qui charge le binaire via `fetch`.

## Commandes utiles (PowerShell)

Installer le plugin manuellement (si nécessaire) :

```powershell
npm install --save-dev vite-plugin-wasm
```

Relancer le serveur de développement :

```powershell
npm run dev
```

Nettoyer le cache Vite (optionnel) :

```powershell
Remove-Item -Recurse -Force .\node_modules\.vite
```

## Dépannage rapide

- Si vous avez une erreur TypeScript à propos d'import avec extension `.tsx`, supprimez l'extension dans l'import ou activez `allowImportingTsExtensions` dans `tsconfig.json` (non recommandé).
- Si le navigateur affiche toujours un problème lié au chargement d'un `.wasm`, vérifiez dans l'onglet Réseau (DevTools) si le `.wasm` est bien servi ; sinon essayez l'approche `.wasm?url`/`.wasm?init`.

## Fichiers modifiés récemment

- `vite.config.js` (ajout de `vite-plugin-wasm`)
- `src/main.tsx` (import `App` sans extension)
- `src/lib/Engine.ts` (types et signature `enableVR`)
- `src/lib/VRManager.ts` (acceptation de `Scene`)
- `src/lib/VRControls.ts` (utilise `WebGLRenderer` et accès XR adapté)
