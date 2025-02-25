// Si vous souhaitez exporter la structure du projet
// Entrez dans le terminal: node export-project-structure-v1.1.cjs

const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

const ig = ignore();
const gitignorePath = path.join(process.cwd(), ".gitignore");

if (fs.existsSync(gitignorePath)) {
	const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
	ig.add(gitignoreContent);
}

function readDirRecursive(dir) {
	let results = [];
	try {
		const list = fs.readdirSync(dir);

		list.forEach(function (file) {
			const filePath = path.join(dir, file);
			const relativePath = path.relative(process.cwd(), filePath);

			// Ignorer les fichiers et dossiers cachés et ceux spécifiés dans .gitignore
			if (file.startsWith(".") || ig.ignores(relativePath)) {
				console.log(`Ignoré: ${relativePath}`);
				return;
			}

			const stat = fs.statSync(filePath);

			if (stat && stat.isDirectory()) {
				results.push({
					name: file,
					type: "directory",
					children: readDirRecursive(filePath),
				});
			} else {
				results.push({
					name: file,
					type: "file",
				});
			}
		});
	} catch (err) {
		console.error(`Erreur lors de la lecture du répertoire ${dir}:`, err);
	}
	return results;
}

const dirPath = process.argv[2] || path.join(process.cwd()); // Utiliser le répertoire courant par défaut

console.log(`Lecture du répertoire: ${dirPath}`);
const structure = readDirRecursive(dirPath);

// Créer le dossier export s'il n'existe pas
const exportDir = path.join(process.cwd(), "export");
if (!fs.existsSync(exportDir)) {
	fs.mkdirSync(exportDir);
}

const outputPath = path.join(exportDir, "project-structure-extraction.json");

try {
	fs.writeFileSync(outputPath, JSON.stringify(structure, null, 2));
	console.log(`Structure exportée vers ${outputPath}`);
} catch (err) {
	console.error("Erreur lors de l'écriture du fichier:", err);
}
