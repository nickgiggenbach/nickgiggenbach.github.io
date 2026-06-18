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
const wrapperElement = document.getElementById('imageWrapper'); // Grab the wrapper!

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
    const selectedImage = availableImages.splice(randomImageIndex, 1)[0];
    
    imgElement.src = selectedImage;

    // --- FONT LOGIC ---
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    const selectedFont = availableFonts.splice(randomFontIndex, 1)[0];
    
    textElement.style.fontFamily = selectedFont;

    // --- POSITION LOGIC ---
    // Pick a random spot between 0% and 100% of the screen
    let randomX = Math.random() * 100;
    let randomY = Math.random() * 100;

    // This loop checks: "Did it land in the middle 30% of the screen?"
    // If yes, it rerolls the numbers until it lands somewhere else!
    while (randomX > 35 && randomX < 65 && randomY > 35 && randomY < 65) {
        randomX = Math.random() * 100;
        randomY = Math.random() * 100;
    }

    // A Magic Developer Trick:
    // By setting the Left position to X%, and then translating backward by X% of the image's OWN width,
    // we guarantee the image never bleeds off the edge of the screen, no matter its size!
    wrapperElement.style.left = randomX + 'vw';
    wrapperElement.style.top = randomY + 'dvh';
    wrapperElement.style.transform = `translate(-${randomX}%, -${randomY}%)`;
}

// Mobile-responsive click listener
window.addEventListener('pointerdown', showRandomImage);
