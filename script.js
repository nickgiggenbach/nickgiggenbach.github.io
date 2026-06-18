// --- JUST CHANGE THIS ONE SETTING ---
const maxImageNumber = 20;  // Change this to your highest numbered image
// ------------------------------------

const extensionsToTry = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.webp'];

const allImages = [];
let availableImages = [];

const allFonts = [
    'Arial', '"Arial Black"', '"Arial Narrow"', 'Helvetica', 'sans-serif',
    '"Times New Roman"', 'Times', 'serif', 'Georgia', 'Palatino',
    '"Palatino Linotype"', '"Book Antiqua"', 'Garamond', 'Baskerville',
    '"Courier New"', 'Courier', 'monospace', 'Verdana', 'Geneva',
    '"Comic Sans MS"', '"Trebuchet MS"', '"Lucida Grande"', '"Lucida Sans Unicode"',
    'Impact', 'Tahoma', '"Century Gothic"', '"MS Sans Serif"', '"MS Serif"',
    'Optima', 'Didot', 'Perpetua', 'Monaco', '"Brush Script MT"', 'cursive',
    'Copperplate', 'Papyrus', 'fantasy', 'Luminari', '"Marker Felt"',
    'Trattatello', '"Bauhaus 93"', 'Calibri', 'Candara', 'Cambria',
    'Consolas', 'Constantia', 'Corbel', '"Franklin Gothic Medium"',
    '"Gill Sans"', '"Segoe UI"', 'Rockwell', '"Apple Chancery"',
    '"Bradley Hand"', 'Chalkduster', 'Herculanum', '"Hoefler Text"',
    'Krungthep', '"Plantagenet Cherokee"', 'Skia', '"Snell Roundhand"',
    'Zapfino', 'Sylfaen', '"Bodoni MT"', 'system-ui'
];

let availableFonts = [...allFonts];

const imgElement = document.getElementById('displayImage');
const textElement = document.getElementById('authorText');

// Setup for smooth zooming
let currentZoom = 1;
imgElement.style.transition = 'transform 0.15s ease-out, opacity 0s';

let firstImageShown = false;

// --- THE DETECTIVE PRELOADER ---
for (let i = 1; i <= maxImageNumber; i++) {
    findAndPreloadImage(i, 0);
}

function findAndPreloadImage(imageNumber, extIndex) {
    if (extIndex >= extensionsToTry.length) return; 

    const testPath = 'images/' + imageNumber + extensionsToTry[extIndex];
    const tester = new Image();
    
    tester.onload = function() {
        allImages.push(testPath);
        availableImages.push(testPath);
        
        if (!firstImageShown) {
            firstImageShown = true;
            showRandomImage();
        }
    };
    
    tester.onerror = function() {
        findAndPreloadImage(imageNumber, extIndex + 1);
    };
    
    tester.src = testPath; 
}


// --- RESOLUTION PROTECTION ---
// Shows the image once loaded, and enforces the 80% natural size rule
imgElement.onload = function() {
    // Calculate 80% of the image's true file resolution
    const shrinkWidth = imgElement.naturalWidth * 0.8;
    const shrinkHeight = imgElement.naturalHeight * 0.8;

    // Set the new 80% max sizes, but keep the screen borders (85vw/80dvh) intact 
    // so high-resolution images still shrink to fit the screen perfectly!
    imgElement.style.maxWidth = `min(${shrinkWidth}px, 85vw)`;
    imgElement.style.maxHeight = `min(${shrinkHeight}px, 80dvh)`;
    
    // Reveal the image
    imgElement.style.opacity = '1';
};


// --- THE DISPLAY LOGIC ---
function showRandomImage() {
    if (allImages.length === 0) return;
    
    // Hide the image instantly while we swap it
    imgElement.style.opacity = '0';
    
    // Reset zoom when a new image loads
    currentZoom = 1;
    imgElement.style.transform = `scale(1)`;
    
    // --- FONT LOGIC ---
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    textElement.style.fontFamily = availableFonts.splice(randomFontIndex, 1)[0];

    // --- IMAGE LOGIC ---
    if (availableImages.length === 0) {
        availableImages = [...allImages]; 
    }
    const randomImageIndex = Math.floor(Math.random() * availableImages.length);
    
    // Changing the source triggers the 'onload' function above to reveal it!
    imgElement.src = availableImages.splice(randomImageIndex, 1)[0];
}


// --- EVENT LISTENERS ---

// 1. Instant Mobile Tapping & Mouse Clicking
window.addEventListener('pointerdown', showRandomImage);

// 2. Scroll Wheel Zoom Engine
window.addEventListener('wheel', function(event) {
    // Stops the entire webpage from accidentally scrolling
    event.preventDefault(); 

    // Scroll up = Zoom in. Scroll down = Zoom out.
    if (event.deltaY < 0) {
        currentZoom += 0.15; // Speed of zooming in
    } else {
        currentZoom -= 0.15; // Speed of zooming out
    }

    // Lock the zoom limits! 
    // 1 = Cannot zoom out further than standard size
    // 6 = Cannot zoom in more than 6x magnification
    currentZoom = Math.min(Math.max(1, currentZoom), 6);

    // Apply the zoom size to the image
    imgElement.style.transform = `scale(${currentZoom})`;
    
}, { passive: false });
