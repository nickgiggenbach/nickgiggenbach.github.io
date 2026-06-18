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
imgElement.onload = function() {
    const shrinkWidth = imgElement.naturalWidth * 0.8;
    const shrinkHeight = imgElement.naturalHeight * 0.8;

    imgElement.style.maxWidth = `min(${shrinkWidth}px, 85vw)`;
    imgElement.style.maxHeight = `min(${shrinkHeight}px, 80dvh)`;
    
    imgElement.style.opacity = '1';
};


// --- THE DISPLAY LOGIC ---
function showRandomImage() {
    if (allImages.length === 0) return;
    
    imgElement.style.opacity = '0';
    
    // Reset zoom when a new image loads
    currentZoom = 1;
    imgElement.style.transform = `scale(1)`;
    
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    textElement.style.fontFamily = availableFonts.splice(randomFontIndex, 1)[0];

    if (availableImages.length === 0) {
        availableImages = [...allImages]; 
    }
    const randomImageIndex = Math.floor(Math.random() * availableImages.length);
    
    imgElement.src = availableImages.splice(randomImageIndex, 1)[0];
}


// --- EVENT LISTENERS & ZOOM ENGINE ---

let isZooming = false;
let initialPinchDistance = null;

// 1. PINCH-TO-ZOOM (Mobile)
window.addEventListener('touchstart', (e) => {
    // If two fingers touch the screen, start the pinch!
    if (e.touches.length === 2) {
        isZooming = true;
        // Calculate the distance between the two fingers
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && isZooming) {
        e.preventDefault(); 
        
        // Calculate new distance as fingers move
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        // Find the difference and apply it to the zoom
        const distanceDelta = currentDistance - initialPinchDistance;
        currentZoom += distanceDelta * 0.01; // 0.01 is the sensitivity speed
        
        // Lock zoom limits (1x to 6x)
        currentZoom = Math.min(Math.max(1, currentZoom), 6);
        imgElement.style.transform = `scale(${currentZoom})`;
        
        // Reset base distance for continuous smooth zooming
        initialPinchDistance = currentDistance;
    }
}, { passive: false });

window.addEventListener('touchend', (e) => {
    // If a finger lifts up, stop the pinch
    if (e.touches.length < 2) {
        // We set a tiny delay so the phone doesn't accidentally think 
        // lifting your finger is a "click" to change the image
        setTimeout(() => {
            isZooming = false;
        }, 100);
    }
});


// 2. SCROLL WHEEL ZOOM (Desktop)
window.addEventListener('wheel', function(event) {
    event.preventDefault(); 

    if (event.deltaY < 0) {
        currentZoom += 0.15; 
    } else {
        currentZoom -= 0.15; 
    }

    currentZoom = Math.min(Math.max(1, currentZoom), 6);
    imgElement.style.transform = `scale(${currentZoom})`;
}, { passive: false });


// 3. CLICK / TAP TO CHANGE IMAGE
window.addEventListener('pointerup', function(event) {
    // Only change the image if they are NOT currently pinching/zooming
    if (!isZooming) {
        showRandomImage();
    }
});
