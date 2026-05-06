// 1. Your images
const allImages = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/1.png',
'images/2.png',
'images/3.png',
'images/4.png',
'images/5.png',
'images/6.png',
'images/7.png',
'images/8.png',
'images/9.png',
'images/10.png',
'images/11.png',
'images/12.png'
];

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