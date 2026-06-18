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

// Setup for Zoom & Pan State
let currentZoom = 1;
let panX = 0;
let panY = 0;
let firstImageShown = false;

// Helper function to apply Zoom & Pan to the image
// 'smooth' is true for desktop scroll wheel, false for mobile fingers (so it doesn't lag)
function updateTransform(smooth = false) {
    if (smooth) {
        imgElement.style.transition = 'transform 0.15s ease-out, opacity 0s';
    } else {
        imgElement.style.transition = 'opacity 0s';
    }
    imgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
}


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
    
    // Reset zoom and pan when a new image loads
    currentZoom = 1;
    panX = 0;
    panY = 0;
    updateTransform(false);
    
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


// --- EVENT LISTENERS: ZOOM & PAN ENGINE ---

let isZooming = false;
let initialPinchDistance = null;

// Panning variables
let startX = 0;
let startY = 0;
let initialPanX = 0;
let initialPanY = 0;
let hasDragged = false;
let ignoreNextClick = false;

// 1. MOBILE TOUCH (Pinch to Zoom & 1-Finger Pan)
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        // Prepare for a potential 1-finger pan
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPanX = panX;
        initialPanY = panY;
        hasDragged = false;
        
    } else if (e.touches.length === 2) {
        // Start 2-finger pinch
        isZooming = true;
        hasDragged = true; // Pinching shouldn't trigger an image change
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
});

window.addEventListener('touchmove', (e) => {
    // ONE FINGER PANNING
    if (e.touches.length === 1 && currentZoom > 1 && !isZooming) {
        e.preventDefault(); 
        
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        // You have to move your finger at least 5 pixels for it to count as a "drag" 
        // (This prevents accidental microscopic finger shifts from canceling your click!)
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            hasDragged = true;
        }
        
        if (hasDragged) {
            panX = initialPanX + dx;
            panY = initialPanY + dy;
            updateTransform(false); // false = instant tracking, no lag
        }
        
    // TWO FINGER ZOOMING
    } else if (e.touches.length === 2 && isZooming) {
        e.preventDefault(); 
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        const distanceDelta = currentDistance - initialPinchDistance;
        currentZoom += distanceDelta * 0.01; 
        currentZoom = Math.min(Math.max(1, currentZoom), 6);
        
        // Auto-center the image if you zoom all the way back out!
        if (currentZoom === 1) {
            panX = 0;
            panY = 0;
        }
        
        updateTransform(false);
        initialPinchDistance = currentDistance;
    }
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
        setTimeout(() => {
            isZooming = false;
        }, 100);
    }
    
    // If you lift all fingers off the screen, remember if it was a drag or a tap!
    if (e.touches.length === 0) {
        ignoreNextClick = hasDragged;
    }
});


// 2. DESKTOP SCROLL WHEEL (Zooming)
window.addEventListener('wheel', function(event) {
    event.preventDefault(); 

    if (event.deltaY < 0) {
        currentZoom += 0.15; 
    } else {
        currentZoom -= 0.15; 
    }

    currentZoom = Math.min(Math.max(1, currentZoom), 6);
    
    // Auto-center the image if you zoom all the way back out!
    if (currentZoom === 1) {
        panX = 0;
        panY = 0;
    }
    
    updateTransform(true); // true = smooth scrolling animation
}, { passive: false });


// 3. CLICK / TAP TO CHANGE IMAGE
window.addEventListener('pointerup', function(event) {
    // We only change the image if they didn't just pinch, and they didn't just drag!
    if (!isZooming && !ignoreNextClick) {
        showRandomImage();
    }
    // Reset the click block for the next time you touch the screen
    ignoreNextClick = false; 
});
