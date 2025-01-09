// Si vous souhaitez exporter la structure du projet
// Entrez dans le terminal: node export -file - project-structure.json

// si vous souhaitez ne pas installez Node.js suivez les instructions suivantes:
// sudo npm install -g pkg
// sudo pkg export-file-structure.js
// ./export-file-structure-linux 

const fs = require('fs');
const path = require('path');

function readDirRecursive(dir) {
	let results = [];
	const list = fs.readdirSync(dir);

	list.forEach(function (file) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat && stat.isDirectory()) {
			results.push({
				name: file,
				type: 'directory',
				children: readDirRecursive(filePath)
			});
		} else {
			results.push({
				name: file,
				type: 'file'
			});
		}
	});

	return results;
}

const dirPath = path.join('./'); // Change this to your desired directory
const structure = readDirRecursive(dirPath);

fs.writeFileSync('project-structure.json', JSON.stringify(structure, null, 2));
console.log('Structure exported to project-structure.json');
