// --- JUST CHANGE THIS ONE SETTING ---
// Put the highest number image you have here. 
// It's okay if you guess a little high (e.g. putting 50 when you only have 42).
const maxImageNumber = 20;  
// ------------------------------------

const extensionsToTry = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.webp'];

const allImages = [];
let availableImages = [];

// The 64 Fonts List
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

// 1. THE DETECTIVE PRELOADER
// This checks every number and guesses the extension until it finds your file
for (let i = 1; i <= maxImageNumber; i++) {
    findAndPreloadImage(i, 0);
}

function findAndPreloadImage(imageNumber, extIndex) {
    // If we tried every extension and none worked, stop checking this number
    if (extIndex >= extensionsToTry.length) return; 

    const testPath = 'images/' + imageNumber + extensionsToTry[extIndex];
    const tester = new Image();
    
    // If it successfully finds the image:
    tester.onload = function() {
        allImages.push(testPath);
        availableImages.push(testPath);
        
        // If this is the very first image it found, show it on screen immediately!
        if (!firstImageShown) {
            firstImageShown = true;
            showRandomImage();
        }
    };
    
    // If it fails (e.g. 1.jpg doesn't exist):
    tester.onerror = function() {
        // Try again with the next extension in the list (e.g. 1.png)
        findAndPreloadImage(imageNumber, extIndex + 1);
    };
    
    // This line tells the detective to actually test the path
    tester.src = testPath; 
}


// 2. THE DISPLAY LOGIC
function showRandomImage() {
    
    // If no images have finished loading yet, do nothing.
    if (allImages.length === 0) return;
    
    // --- IMAGE LOGIC ---
    if (availableImages.length === 0) {
        availableImages = [...allImages]; 
    }
    const randomImageIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages.splice(randomImageIndex, 1)[0];
    
    imgElement.src = selectedImage;

    // --- FONT LOGIC ---
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    const selectedFont = availableFonts.splice(randomFontIndex, 1)[0];
    
    textElement.style.fontFamily = selectedFont;
}

// Make the screen clickable
window.addEventListener('click', showRandomImage);
