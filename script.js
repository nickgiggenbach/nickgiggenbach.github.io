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


// THE DISPLAY LOGIC
function showRandomImage() {
    if (allImages.length === 0) return;
    
    // --- IMAGE LOGIC ---
    if (availableImages.length === 0) {
        availableImages = [...allImages]; 
    }
    const randomImageIndex = Math.floor(Math.random() * availableImages.length);
    imgElement.src = availableImages.splice(randomImageIndex, 1)[0];

    // --- FONT LOGIC ---
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    textElement.style.fontFamily = availableFonts.splice(randomFontIndex, 1)[0];

    // --- COLLISION ENGINE & POSITIONING ---
    // Grab the mathematical box of where the text is sitting right now
    const textRect = textElement.getBoundingClientRect();
    
    let validPosition = false;
    let attempts = 0;

    // It gets 50 tries to find a safe spot for the image
    while (!validPosition && attempts < 50) {
        let randX = Math.random() * 100;
        let randY = Math.random() * 100;

        // RULE 1: Do not center the image!
        // If the anchor lands in the middle 40% of the screen, skip and reroll.
        if (randX > 30 && randX < 70 && randY > 30 && randY < 70) {
            attempts++;
            continue;
        }

        // Apply the random coordinates to test them out
        imgElement.style.left = randX + 'vw';
        imgElement.style.top = randY + 'dvh';
        imgElement.style.transform = `translate(-${randX}%, -${randY}%)`;

        // Grab the mathematical box of where the image landed
        const imgRect = imgElement.getBoundingClientRect();

        // RULE 2: Do not touch the text!
        // (We add a 20px padding bumper around the text just to be safe)
        const isOverlappingText = !(
            imgRect.right < textRect.left - 20 || 
            imgRect.left > textRect.right + 20 || 
            imgRect.bottom < textRect.top - 20 || 
            imgRect.top > textRect.bottom + 20
        );

        // If it isn't touching the text, approve the placement!
        if (!isOverlappingText) {
            validPosition = true; 
        }
        
        attempts++;
    }

    // Failsafe: If the image is incredibly massive and physically can't avoid the text,
    // force it to sit in the top right corner out of the way.
    if (!validPosition) {
        imgElement.style.left = '95vw';
        imgElement.style.top = '5dvh';
        imgElement.style.transform = `translate(-95%, -5%)`;
    }
}

// Instant Mobile Tapping
window.addEventListener('pointerdown', showRandomImage);
