// Fonctions UI
function updateStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.innerHTML = message.replace(/\n/g, '<br>');
    statusElement.className = type;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation des gestionnaires...');
    
    const previewBtn = document.getElementById('previewBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (!previewBtn || !exportBtn) {
        console.error('Boutons non trouvés !');
        return;
    }
    
    // Charger les options sauvegardées
    const savedOptions = localStorage.getItem('exportOptions');
    if (savedOptions) {
        const options = JSON.parse(savedOptions);
        document.getElementById('includeHidden').checked = options.includeHidden;
        document.getElementById('includeStats').checked = options.includeStats;
    }
    
    // Gestionnaire pour le bouton de prévisualisation
    previewBtn.addEventListener('click', async () => {
        console.log('Clic sur le bouton de prévisualisation');
        const options = {
            includeHidden: document.getElementById('includeHidden').checked,
            includeStats: document.getElementById('includeStats').checked
        };
        
        try {
            updateStatus('🔍 Génération de la prévisualisation...', 'info');
            
            const response = await fetch('/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options)
            });
            
            if (!response.ok) throw new Error('Erreur serveur');
            
            const structure = await response.json();
            const previewContainer = document.getElementById('preview');
            const treeView = previewContainer.querySelector('.tree-view');
            
            treeView.innerHTML = generateTreeView(structure);
            previewContainer.classList.add('visible');
            
            updateStatus('✅ Prévisualisation générée avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la prévisualisation:', error);
            updateStatus(`❌ Erreur: ${error.message}`, 'error');
        }
    });
    
    // Gestionnaire pour le bouton d'export
    exportBtn.addEventListener('click', async () => {
        console.log('Clic sur le bouton d\'export');
        const options = {
            includeHidden: document.getElementById('includeHidden').checked,
            includeStats: document.getElementById('includeStats').checked
        };
        
        try {
            updateStatus('🔍 Export en cours...', 'info');
            
            const response = await fetch('/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(options)
            });
            
            const result = await response.json();
            console.log('Réponse du serveur:', result);
            
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Erreur serveur');
            }
            
            localStorage.setItem('exportOptions', JSON.stringify(options));
            
            // Construire le message avec les informations disponibles
            const successMessage = [
                `✅ ${result.message}`,
                `📄 Fichier: ${result.fileName}`,
                `📂 Dossier: ${result.directory}`
            ].join('\n');
            
            updateStatus(successMessage, 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            updateStatus(`❌ Erreur: ${error.message}`, 'error');
        }
    });
    
    console.log('Gestionnaires d\'événements initialisés');
}); 