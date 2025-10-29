// Load demos from JSON configuration
async function loadDemos() {
    const demosGrid = document.getElementById('demos-grid');
    
    try {
        const response = await fetch('demos.json');
        const data = await response.json();
        
        if (data.demos && data.demos.length > 0) {
            demosGrid.innerHTML = '';
            data.demos.forEach(demo => {
                demosGrid.appendChild(createDemoCard(demo));
            });
        } else {
            demosGrid.innerHTML = '<p class="loading">No demos available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading demos:', error);
        demosGrid.innerHTML = '<p class="loading">Error loading demos. Please check demos.json file.</p>';
    }
}

// Create a demo card element
function createDemoCard(demo) {
    const card = document.createElement('div');
    card.className = 'demo-card';
    
    const thumbnailContent = demo.thumbnail 
        ? `<img src="${demo.folder}/${demo.thumbnail}" alt="${demo.title}">`
        : '<span class="demo-thumbnail-placeholder">🎮</span>';
    
    card.innerHTML = `
        <div class="demo-thumbnail">
            ${thumbnailContent}
        </div>
        <div class="demo-info">
            <h2 class="demo-title">${demo.title}</h2>
            <p class="demo-description">${demo.description}</p>
            <div class="demo-meta">
                <span>Version: ${demo.version || '1.0'}</span>
                <span>${demo.date || 'Recent'}</span>
            </div>
            <div class="demo-buttons">
                <a href="${demo.folder}/index.html" class="demo-button play-button" target="_blank">Play Demo</a>
                <a href="${demo.folder}/embed.html" class="demo-button embed-button" target="_blank">Embed View</a>
            </div>
        </div>
    `;
    
    return card;
}

// Load demos when page loads
document.addEventListener('DOMContentLoaded', loadDemos);

