import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import express from 'express';

const app = express();
const port = 3000;

// Obtenir le chemin absolu du répertoire public
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, 'public');

// Configuration par défaut
const CONFIG = {
    ignoreDirs: ['node_modules', '.git', '.idea', '.vscode'],
    ignoreFiles: ['.DS_Store', 'Thumbs.db'],
    includeStats: true,
    includeHidden: false
};

// Vérifier les permissions d'écriture
const rootDir = process.cwd();
try {
    await fs.access(rootDir, fs.constants.W_OK);
} catch (error) {
    console.error(`⚠️ Attention: Pas de permission d'écriture dans ${rootDir}`);
    process.exit(1);
}

// Fonctions utilitaires
async function getFileStats(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        };
    } catch (error) {
        return null;
    }
}

async function isHidden(filePath) {
    try {
        const fileName = path.basename(filePath);
        if (fileName.startsWith('.')) {
            return true;
        }

        if (process.platform === 'win32') {
            try {
                const result = execSync(`attrib "${filePath}"`, { encoding: 'utf8' });
                return result.includes('H');
            } catch (error) {
                return false;
            }
        }

        const stats = await fs.lstat(filePath);
        return (stats.mode & 0o0001) === 0;
    } catch (error) {
        return false;
    }
}

async function scanDirectory(dirPath, config) {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const result = [];

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative('./', fullPath);

            if (config.ignoreDirs.includes(entry.name) || 
                config.ignoreFiles.includes(entry.name)) {
                continue;
            }

            if (!config.includeHidden && await isHidden(fullPath)) {
                continue;
            }

            const item = {
                name: entry.name,
                path: relativePath,
                type: entry.isDirectory() ? 'directory' : 'file'
            };

            if (config.includeStats && !entry.isDirectory()) {
                item.stats = await getFileStats(fullPath);
            }

            if (entry.isDirectory()) {
                item.children = await scanDirectory(fullPath, config);
            }

            result.push(item);
        }

        return result;
    } catch (error) {
        console.error(`Erreur lors du scan de ${dirPath}:`, error);
        return [];
    }
}

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.static(publicPath));

// Route par défaut avec log
app.get('/', (req, res) => {
    console.log('Serving index.html from:', path.join(publicPath, 'index.html'));
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Routes API
app.post('/preview', async (req, res) => {
    console.log('Requête de prévisualisation reçue:', req.body);
    try {
        const config = { ...CONFIG, ...req.body };
        const structure = await scanDirectory('./', config);
        console.log('Structure générée avec succès');
        res.json(structure);
    } catch (error) {
        console.error('Erreur de prévisualisation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Modifier la fonction getProjectName pour qu'elle soit plus robuste
async function getProjectName() {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageData = await fs.readFile(packageJsonPath, 'utf8');
        const { name } = JSON.parse(packageData);
        return name || path.basename(process.cwd());
    } catch (error) {
        console.log('Impossible de lire package.json, utilisation du nom du dossier');
        return path.basename(process.cwd());
    }
}

// Modifier la route d'export
app.post('/export', async (req, res) => {
    console.log('Requête d\'export reçue:', req.body);
    try {
        // Récupérer la structure
        const config = { ...CONFIG, ...req.body };
        const structure = await scanDirectory('./', config);
        
        // Obtenir le nom du projet
        const projectName = await getProjectName();
        console.log('Nom du projet:', projectName);
        
        // Construire les chemins
        const fileName = `${projectName}-EPS.json`;
        const directory = process.cwd();
        const exportPath = path.join(directory, fileName);
        
        // Écrire le fichier
        await fs.writeFile(exportPath, JSON.stringify(structure, null, 2), 'utf8');
        
        // Vérifier que le fichier a été créé
        await fs.access(exportPath, fs.constants.F_OK);
        
        // Préparer la réponse
        const responseData = {
            success: true,
            message: 'Structure exportée avec succès',
            fileName: fileName,
            directory: directory
        };
        
        // Log pour déboguer
        console.log('Envoi de la réponse:', responseData);
        
        // Envoyer la réponse
        return res.json(responseData);
    } catch (error) {
        console.error('Erreur d\'export:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`
    🚀 Serveur démarré sur http://localhost:${port}
    📂 Ouvrez votre navigateur pour utiliser l'application
    `);
}); 