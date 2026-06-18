// --- JUST CHANGE THIS ONE SETTING ---
const maxImageNumber = 90;  // Change this to your highest numbered image
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
let lastPinchCenterX = null;
let lastPinchCenterY = null;

let startX = 0;
let startY = 0;
let initialPanX = 0;
let initialPanY = 0;
let hasDragged = false;

// 1. MOBILE TOUCH (Tap, Pan, and Pinch)
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPanX = panX;
        initialPanY = panY;
        hasDragged = false; // Reset drag status on new touch
        
    } else if (e.touches.length === 2) {
        isZooming = true;
        hasDragged = true; // Pinching counts as a drag so it doesn't trigger a tap
        
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        
        lastPinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        lastPinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    }
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && currentZoom > 1 && !isZooming) {
        e.preventDefault(); 
        
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            hasDragged = true;
        }
        
        if (hasDragged) {
            panX = initialPanX + dx;
            panY = initialPanY + dy;
            updateTransform(false);
        }
        
    } else if (e.touches.length === 2 && isZooming) {
        e.preventDefault(); 
        
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        const pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        panX += (pinchCenterX - lastPinchCenterX);
        panY += (pinchCenterY - lastPinchCenterY);

        const distanceDelta = currentDistance - initialPinchDistance;
        const oldZoom = currentZoom;
        currentZoom += distanceDelta * 0.01; 
        currentZoom = Math.min(Math.max(1, currentZoom), 6);
        
        if (oldZoom !== currentZoom) {
            const pointerX = pinchCenterX - window.innerWidth / 2;
            const pointerY = pinchCenterY - window.innerHeight / 2;
            
            const imageX = (pointerX - panX) / oldZoom;
            const imageY = (pointerY - panY) / oldZoom;
            
            panX = pointerX - imageX * currentZoom;
            panY = pointerY - imageY * currentZoom;
        }

        if (currentZoom === 1) {
            panX = 0;
            panY = 0;
        }
        
        updateTransform(false);
        
        initialPinchDistance = currentDistance;
        lastPinchCenterX = pinchCenterX;
        lastPinchCenterY = pinchCenterY;
    }
}, { passive: false });

window.addEventListener('touchend', (e) => {
    // We only care when the LAST finger leaves the screen
    if (e.touches.length === 0) {
        
        // If they just tapped the screen quickly without dragging or zooming, change the image!
        if (!hasDragged && !isZooming) {
            showRandomImage();
        }
        
        // Reset states for the next time they touch the screen
        hasDragged = false;
        setTimeout(() => {
            isZooming = false;
        }, 100);
    }
});


// 2. DESKTOP SCROLL WHEEL (Target Zooming)
window.addEventListener('wheel', function(event) {
    event.preventDefault(); 

    const oldZoom = currentZoom;

    if (event.deltaY < 0) {
        currentZoom += 0.15; 
    } else {
        currentZoom -= 0.15; 
    }

    currentZoom = Math.min(Math.max(1, currentZoom), 6);
    
    if (oldZoom !== currentZoom) {
        const pointerX = event.clientX - window.innerWidth / 2;
        const pointerY = event.clientY - window.innerHeight / 2;
        
        const imageX = (pointerX - panX) / oldZoom;
        const imageY = (pointerY - panY) / oldZoom;
        
        panX = pointerX - imageX * currentZoom;
        panY = pointerY - imageY * currentZoom;
    }

    if (currentZoom === 1) {
        panX = 0;
        panY = 0;
    }
    
    updateTransform(true);
}, { passive: false });


// 3. DESKTOP MOUSE CLICK TO CHANGE IMAGE
window.addEventListener('pointerup', function(event) {
    // Only fire this on computers (mice). Mobile tapping is now fully handled in 'touchend' above!
    if (event.pointerType === 'mouse') {
        showRandomImage();
    }
});
