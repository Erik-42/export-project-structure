// Si vous souhaitez exporter la structure du projet
// Entrez dans le terminal: node export -file - project-structure.json

// si vous ne souhaitez pas installez Node.js suivez les instructions suivantes:
// sudo npm install -g pkg
// sudo pkg export-project-structure.js
// ./export-project-structure-linux 

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import express from 'express';

const app = express();
const port = 3000;

// Obtenir le chemin du répertoire actuel en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration par défaut
const CONFIG = {
    ignoreDirs: ['node_modules', '.git', '.idea', '.vscode'],
    ignoreFiles: ['.DS_Store', 'Thumbs.db'],
    includeStats: true,
    includeHidden: false  // Nouvelle option pour les fichiers/dossiers cachés
};

async function getFileStats(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        };
    } catch (error) {
        console.error(`Erreur lors de la lecture des stats pour ${filePath}:`, error);
        return null;
    }
}

async function isHidden(filePath) {
    try {
        // Vérifier si le nom commence par un point
        const fileName = path.basename(filePath);
        if (fileName.startsWith('.')) {
            return true;
        }

        // Vérifier l'attribut caché sur Windows
        if (process.platform === 'win32') {
            try {
                const result = execSync(`attrib "${filePath}"`, { encoding: 'utf8' });
                return result.includes('H');
            } catch (error) {
                return false;
            }
        }

        // Vérifier l'attribut caché sur Unix/MacOS
        const stats = await fs.lstat(filePath);
        return (stats.mode & 0o0001) === 0 || fileName.startsWith('.');
        
    } catch (error) {
        console.error(`Erreur lors de la vérification de l'attribut caché pour ${filePath}:`, error);
        return false;
    }
}

async function scanDirectory(dirPath, config) {
    // Normaliser le chemin pour éviter les problèmes d'URI
    const normalizedPath = path.normalize(dirPath);
    const entries = await fs.readdir(normalizedPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
        // Utiliser path.join avec le chemin normalisé
        const fullPath = path.join(normalizedPath, entry.name);
        
        // Convertir le chemin en format URI compatible
        const relativePath = path.relative(process.cwd(), fullPath);
        const uriPath = '/' + relativePath.split(path.sep).join('/');

        // Vérifier si le fichier/dossier doit être ignoré
        if (config.ignoreDirs.includes(entry.name) || 
            config.ignoreFiles.includes(entry.name)) {
            continue;
        }

        // Vérifier si on doit ignorer les fichiers cachés
        if (!config.includeHidden && await isHidden(fullPath)) {
            continue;
        }

        const item = {
            name: entry.name,
            path: uriPath, // Utiliser le chemin URI normalisé
            type: entry.isDirectory() ? 'directory' : 'file'
        };

        if (config.includeStats) {
            const stats = await fs.stat(fullPath);
            item.stats = {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                accessed: stats.atime
            };
        }

        if (entry.isDirectory()) {
            item.children = await scanDirectory(fullPath, config);
        }

        result.push(item);
    }

    return result;
}

async function exportProjectStructure(options = {}) {
    try {
        const config = { ...CONFIG, ...options };
        const dirPath = path.join('./');
        
        updateStatus('🔍 Analyse de la structure du projet...', 'info');
        if (config.includeHidden) {
            updateStatus('ℹ️ Les fichiers et dossiers cachés seront inclus', 'info');
        }
        
        const structure = await scanDirectory(dirPath, config);
        
        await fs.writeFile(
            'your-export-project-structure.json', 
            JSON.stringify(structure, null, 2)
        );
        
        updateStatus('✅ Structure exportée avec succès dans project-structure.json', 'success');
    } catch (error) {
        updateStatus(`❌ Erreur: ${error.message}`, 'error');
    }
}

// Fonction pour mettre à jour le statut dans l'interface
function updateStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = type;
}

// Fonction pour formater la taille des fichiers
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Fonction pour générer l'arborescence HTML
function generateTreeView(structure, level = 0) {
    let html = '';
    const indent = '│  '.repeat(level);

    structure.forEach((item, index) => {
        const isLast = index === structure.length - 1;
        const prefix = isLast ? '└─ ' : '├─ ';
        
        if (item.type === 'directory') {
            html += `<div class="tree-item directory">${indent}${prefix}📁 ${item.name}</div>`;
            if (item.children && item.children.length > 0) {
                html += generateTreeView(item.children, level + 1);
            }
        } else {
            let fileInfo = item.name;
            if (item.stats) {
                fileInfo += ` (${formatFileSize(item.stats.size)})`;
            }
            html += `<div class="tree-item file">${indent}${prefix}📄 ${fileInfo}</div>`;
        }
    });

    return html;
}

// Fonction pour prévisualiser la structure
async function previewProjectStructure(options = {}) {
    try {
        const config = { ...CONFIG, ...options };
        const dirPath = path.join('./');
        
        updateStatus('🔍 Génération de la prévisualisation...', 'info');
        
        const structure = await scanDirectory(dirPath, config);
        const previewContainer = document.getElementById('preview');
        const treeView = previewContainer.querySelector('.tree-view');
        
        treeView.innerHTML = generateTreeView(structure);
        previewContainer.classList.add('visible');
        
        updateStatus('✅ Prévisualisation générée avec succès', 'success');
    } catch (error) {
        updateStatus(`❌ Erreur de prévisualisation: ${error.message}`, 'error');
    }
}

// Configurer express pour servir les fichiers statiques
app.use(express.static('public'));
app.use(express.json());

// Route pour la prévisualisation
app.post('/preview', async (req, res) => {
    try {
        const config = { ...CONFIG, ...req.body };
        const structure = await scanDirectory('./', config);
        res.json(structure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour l'export
app.post('/export', async (req, res) => {
    try {
        const config = { ...CONFIG, ...req.body };
        const structure = await scanDirectory('./', config);
        await fs.writeFile('project-structure.json', JSON.stringify(structure, null, 2));
        res.json({ success: true, message: 'Structure exportée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`
    🚀 Serveur démarré sur http://localhost:${port}
    📂 Ouvrez votre navigateur pour utiliser l'application
    `);
});

// Supprimer ou remplacer le code qui utilise document
// Au lieu d'utiliser addEventListener, exportons directement la fonction
export async function generateProjectStructure(rootPath = process.cwd(), config = {}) {
    const mergedConfig = { ...CONFIG, ...config };
    try {
        const structure = await scanDirectory(rootPath, mergedConfig);
        return structure;
    } catch (error) {
        console.error('Erreur lors de la génération de la structure :', error);
        throw error;
    }
}

// La remplacer par un appel direct
try {
    const structure = await generateProjectStructure();
    console.log(JSON.stringify(structure, null, 2));
} catch (error) {
    console.error('Erreur :', error);
}
