// --- JUST CHANGE THESE TWO SETTINGS ---
const totalNumberOfImages = 10;  // Put your total number of images here!
const imageExtension = '.jpg';   
// --------------------------------------

// 1. Let the computer build the image list AND preload them instantly
const allImages = [];
for (let i = 1; i <= totalNumberOfImages; i++) {
    const imagePath = 'images/' + i + imageExtension;
    allImages.push(imagePath);
    
    // PRELOAD TRICK: This silently downloads the image in the background
    const preload = new Image();
    preload.src = imagePath;
}

// 2. The 64 Fonts List
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

// 3. Make copies of the lists that we will pull from
let availableImages = [...allImages];
let availableFonts = [...allFonts];

const imgElement = document.getElementById('displayImage');
const textElement = document.getElementById('authorText');

function showRandomImage() {
    
    // --- IMAGE LOGIC (Never repeats until empty) ---
    if (availableImages.length === 0) {
        availableImages = [...allImages]; 
    }
    const randomImageIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages.splice(randomImageIndex, 1)[0];
    
    // Because of our preload trick above, this will now happen instantly!
    imgElement.src = selectedImage;

    // --- FONT LOGIC (Never repeats until empty) ---
    if (availableFonts.length === 0) {
        availableFonts = [...allFonts]; 
    }
    const randomFontIndex = Math.floor(Math.random() * availableFonts.length);
    const selectedFont = availableFonts.splice(randomFontIndex, 1)[0];
    
    // Apply the random font to your name
    textElement.style.fontFamily = selectedFont;
}

// Make the screen clickable
window.addEventListener('click', showRandomImage);

// Run once right away when the page loads
showRandomImage();
