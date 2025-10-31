// Get DOM elements
var container = document.querySelector(".game-container") || document.querySelector(".game-container-embed");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#loading-bar");
var progressBarFull = document.querySelector("#loading-bar-fill");
var fullscreenButton = document.querySelector("#fullscreen-button");
var embedButton = document.querySelector("#embed-button");
var embedModal = document.querySelector("#embed-modal");
var embedCodeTextarea = document.querySelector("#embed-code");

// Unity instance variable
var unityInstance;

// Build configuration
var buildUrl = unityConfig.buildUrl;
var loaderUrl = buildUrl + "/" + unityConfig.loaderFilename;
var config = {
    dataUrl: buildUrl + "/" + unityConfig.dataFilename,
    frameworkUrl: buildUrl + "/" + unityConfig.frameworkFilename,
    codeUrl: buildUrl + "/" + unityConfig.codeFilename,
    streamingAssetsUrl: "StreamingAssets",
    companyName: unityConfig.companyName,
    productName: unityConfig.productName,
    productVersion: unityConfig.productVersion,
};

// Add memory URL if it exists
if (unityConfig.memoryFilename) {
    config.memoryUrl = buildUrl + "/" + unityConfig.memoryFilename;
}

// Add symbols URL if it exists
if (unityConfig.symbolsFilename) {
    config.symbolsUrl = buildUrl + "/" + unityConfig.symbolsFilename;
}

// Load Unity WebGL
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = function() {
    createUnityInstance(canvas, config, function(progress) {
        progressBarFull.style.width = 100 * progress + "%";
    }).then(function(instance) {
        unityInstance = instance;
        loadingBar.style.display = "none";
        
        // Setup fullscreen button (works for both main and embed pages)
        fullscreenButton.onclick = function() {
            unityInstance.SetFullscreen(1);
        };
    }).catch(function(message) {
        alert("Error loading Unity: " + message);
    });
};
document.body.appendChild(script);

// Embed functionality (only for main page)
if (embedButton) {
    embedButton.onclick = function() {
        var baseUrl = window.location.href.replace('index.html', '');
        var embedUrl = baseUrl + 'embed.html';
        var embedCode = '<iframe src="' + embedUrl + '" width="' + unityConfig.canvasWidth + '" height="' + (unityConfig.canvasHeight + 60) + '" frameborder="0" allowfullscreen></iframe>';
        embedCodeTextarea.value = embedCode;
        embedModal.style.display = "block";
    };
}

// Close embed modal
function closeEmbedModal() {
    if (embedModal) {
        embedModal.style.display = "none";
    }
}

// Copy embed code to clipboard
function copyEmbedCode() {
    embedCodeTextarea.select();
    embedCodeTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        alert('Embed code copied to clipboard!');
    } catch (err) {
        alert('Failed to copy. Please copy manually.');
    }
}

// Close modal when clicking outside
if (embedModal) {
    window.onclick = function(event) {
        if (event.target == embedModal) {
            embedModal.style.display = "none";
        }
    };
}

// Handle ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && embedModal && embedModal.style.display === 'block') {
        closeEmbedModal();
    }
});

