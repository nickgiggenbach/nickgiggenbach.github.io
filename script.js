// --- JUST CHANGE THIS ONE SETTING ---
const maxImageNumber = 90;  
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

let firstImageShown = false;

// THE DETECTIVE PRELOADER
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


// --- THE NEW MATH-BASED COLLISION ENGINE ---
// This runs the EXACT microsecond the new image is ready to show
imgElement.onload = function() {
    
    // Grab the exact dimensions of everything right now
    const textRect = textElement.getBoundingClientRect();
    const imgW = imgElement.getBoundingClientRect().width;
    const imgH = imgElement.getBoundingClientRect().height;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    // The "Do Not Touch The Edge" Padding Buffer
    const padding = 40; 
    
    // Calculate the absolute furthest the image can go before hitting the padding
    let maxLeft = Math.max(padding, screenW - imgW - padding);
    let maxTop = Math.max(padding, screenH - imgH - padding);
    
    let validPosition = false;
    let attempts = 0;
    
    // Default safe spot just in case
    let finalLeft = padding;
    let finalTop = padding;

    // Roll random coordinates behind the scenes
    while (!validPosition && attempts < 100) {
        
        // Pick a random pixel coordinate within our safe borders
        let rLeft = padding + (Math.random() * (maxLeft - padding));
        let rTop = padding + (Math.random() * (maxTop - padding));
        
        // RULE 1: AVOID THE CENTER
        let imgCenterX = rLeft + (imgW / 2);
        let imgCenterY = rTop + (imgH / 2);
        let isCentered = (
            imgCenterX > screenW * 0.35 && imgCenterX < screenW * 0.65 &&
            imgCenterY > screenH * 0.35 && imgCenterY < screenH * 0.65
        );
        
        if (isCentered) {
            attempts++;
            continue;
        }

        // RULE 2: AVOID THE TEXT
        let imgRight = rLeft + imgW;
        let imgBottom = rTop + imgH;
        
        let isOverlappingText = !(
            imgRight < textRect.left - 20 || 
            rLeft > textRect.right + 20 || 
            imgBottom < textRect.top - 20 || 
            rTop > textRect.bottom + 20
        );
        
        // If it passes both rules, save the coordinates!
        if (!isOverlappingText) {
            validPosition = true;
            finalLeft = rLeft;
            finalTop = rTop;
        }
        
        attempts++;
    }

    // Apply the winning coordinates to the image ONLY ONCE
    imgElement.style.left = finalLeft + 'px';
    imgElement.style.top = finalTop + 'px';
    
    // The math is done, make the image visible!
    imgElement.style.opacity = '1';
};


// THE DISPLAY LOGIC
function showRandomImage() {
    if (allImages.length === 0) return;
    
    // Instantly hide the old image to prevent glitches while doing the math
    imgElement.style.opacity = '0';
    
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
    
    // Changing the src automatically triggers the 'onload' math function above!
    imgElement.src = availableImages.splice(randomImageIndex, 1)[0];
}

// Instant Mobile Tapping
window.addEventListener('pointerdown', showRandomImage);
