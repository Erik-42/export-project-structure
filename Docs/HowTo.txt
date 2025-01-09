# EPS (Export Project Structure)
Ce script à pour but d'exporter la structure d'un projet au format '.json' afin d'avoir un meilleur aperçu de celui-ci

-- Copier le fichier 'export-file-structure-"VOTRE-OS"' à la racine de votre projet.
-- Double-cliquez dessus.
-- Un fichier project-structue.json est créer à la racine de votre projet.

##Utilisation avec Node.js

### placez le script à la racine de votre projet !

Entrez dans le terminal: 
```bash
node export -file - project-structure.json
```
si vous souhaitez exporter une partie de votre projet vous devez entrez le chemin du répertoire à exporter ici 
```js
const dirPath = path.join('./'); // Change this to your desired directory
```
## Utilisation autonome
si vous ne souhaitez pas utilisez Node.js vous devez rendre le script autonome, il faut créer un exécutable unique à partir du projet Node.js:

N'oubliez pas de modifier le chemin du répertoire dans le script, si vous voulez exporter une seule partie de votre projet.

Utiliser pkg : 
Cet outil permet de compiler le projet Node.js en un fichier exécutable autonome. 
Une fois créé, ce fichier peut être exécuté sur une machine même si Node.js n'y est pas installé.

Installez pkg :
```bash
npm install -g pkg
```

Ensuite, compilez votre projet :
```bash
pkg export-file-project-structure.js
```
Exportez votre structure:
placez le fichier créer à la racine de votre projet et entrez dans le terminal
```bash
./export-file-structure-linux 
```
ou double-cliquez directement sur l'exécutable que vous aurez mis à la racine de votre projet.
