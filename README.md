<div align="center">
</div>
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1>Export Project Structure</h1>
  <a href="https://github.com/Erik-42">
    <img src="assets/img/EPS.jpeg" alt="Logo Export Project Stucture" width="150" height="150">
  </a>
</div>


<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
Repo: [![wakatime](https://wakatime.com/badge/github/Erik-42/export-file-structure.svg)](https://wakatime.com/badge/github/Erik-42/export-file-structure)
Project: [![wakatime](https://wakatime.com/badge/user/f84d00d8-fee3-4ca3-803d-3daa3c7053a5/project/9f40ffc6-b660-481b-8f1e-46fa60ade704.svg)](https://wakatime.com/badge/user/f84d00d8-fee3-4ca3-803d-3daa3c7053a5/project/9f40ffc6-b660-481b-8f1e-46fa60ade704)

</div>

Ce script à pour but d'exporter la structure d'un projet au format '.json' afin d'avoir un meilleur aperçu de celui-ci
<p></p>


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Utilisation
Copiez le fichier qui correspond à votre OS, à la racine de votre projet et double-cliquez dessus ou entrez dans le terminal.

```bash
./export-project-structure-"VOTRE-OS" 
```
Un fichier 'project-structure.json' va être créer à la racine de votre projet, dans lequel vous trouverez la structure de votre projet.

## Utilisation alternative

### Avec Node.js

#### Placez le script à la racine de votre projet !

Dans le terminal entrez: 

```bash
node export -file - project-structure.json
```
### Partie du projet
si vous souhaitez exporter une partie de votre projet vous devez entrez le chemin du répertoire à exporter ici 

```js
const dirPath = path.join('./'); // Change this to your desired directory
```
### Utilisation autonome
si vous ne souhaitez pas utilisez Node.js vous devez rendre le script autonome, il faut créer un exécutable unique à partir du projet Node.js:

N'oubliez pas de modifier le chemin du répertoire dans le script, si vous voulez exporter une seule partie de votre projet.

###### Utiliser pkg : 
Cet outil permet de compiler le projet en un fichier exécutable. 

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
./export-file-structure-"VOTRE-OS"" 
```
ou double-cliquez directement sur l'exécutable que vous aurez mis à la racine de votre projet.

<div>
<a href=https://nodejs.org>Node.js</a>
</div>

## Testez le projet

Github: [https://github.com/Erik-42/export-file-structure](https://https://github.com/Erik-42/export-file-structure)

<a href=#>Export-File-Structure</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the GNU GENERAL PUBLIC LICENSE
Version 3.<br>
See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

<div align="center">

[![GitHub followers][github followers-shield]][github followers-url]
[![Stargazers][stars-shield]][stars-url]
[![GitHub repo][github repo-shield]][github repo-url]
[![wakatime](https://wakatime.com/badge/user/f84d00d8-fee3-4ca3-803d-3daa3c7053a5.svg)](https://wakatime.com/@f84d00d8-fee3-4ca3-803d-3daa3c7053a5)

[![Github Badge][github badge-shield]][github badge-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<a href = 'https://basillecorp.dev'> <img width = '32px' align= 'center' src="https://raw.githubusercontent.com/rahulbanerjee26/githubAboutMeGenerator/main/icons/portfolio.png"/> basillecorp.dev</a>

mesen.erik@gmail.com

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[wakatime-shield]: https://wakatime.com/badge/user/f84d00d8-fee3-4ca3-803d-3daa3c7053a5.svg
[wakatime-url]: https://wakatime.com/@f84d00d8-fee3-4ca3-803d-3daa3c7053a5
[github badge-shield]: https://img.shields.io/badge/Github-Erik--42-155?style=for-the-badge&logo=github
[github badge-url]: https://github.com/Erik-42
[github repo-shield]: https://img.shields.io/badge/Repositories-68-blue
[github repo-url]: https://github.com/Erik-42/Erik-42?tab=repositories
[github followers-shield]: https://img.shields.io/github/followers/Erik-42
[github followers-url]: https://github.com/followers/Erik-42
[contributors-shield]: https://img.shields.io/github/contributors/Erik-42/export-project-structure
[contributors-url]: https://github.com/Erik-42/export-project-structure/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Erik-42/export-file-structure
[forks-url]: https://github.com/Erik-42/export-file-structure/forks
[issues-shield]: https://img.shields.io/github/issues-raw/Erik-42/export-file-structure
[issues-url]: https://github.com/Erik-42/export-file-structure/issues
[stars-shield]: https://img.shields.io/github/stars/Erik-42
[stars-url]: https://github.com/Erik-42?tab=stars
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/erik-mesen/
[html-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[html-url]: https://html.spec.whatwg.org/
[css-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[css-url]: https://www.w3.org/TR/CSS/#css
[javascript-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
