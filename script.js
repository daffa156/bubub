// === 1. GALLERY FILTER LOGIC ===
function filterGallery(category) {
    const items = document.querySelectorAll('.grid-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'inline-block';
        } else {
            if (item.classList.contains(category)) {
                item.style.display = 'inline-block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// === 2. IMAGE MODAL ===
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close-btn');

function openModal(el) { modal.style.display = 'flex'; modalImg.src = el.src; }
closeBtn.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; }

// === 3. GAME SWITCHER ===
function switchGame(gameName) {
    document.getElementById('memory-game').classList.add('hidden');
    document.getElementById('quiz-game').classList.add('hidden');
    document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
    
    if(gameName === 'memory') {
        document.querySelector('.game-tab:nth-child(1)').classList.add('active');
        document.getElementById('memory-game').classList.remove('hidden');
    }
    if(gameName === 'quiz') {
        document.querySelector('.game-tab:nth-child(2)').classList.add('active');
        document.getElementById('quiz-game').classList.remove('hidden');
    }
}

// === 4. MEMORY GAME ===
const gameBoard = document.getElementById('board');
const icons = ['🍕', '🚀', '🐱', '🎵', '🍕', '🚀', '🐱', '🎵'];
let flipped = [], matched = 0;

function initMemory() {
    gameBoard.innerHTML = ''; matched = 0;
    document.getElementById('win-msg').classList.add('hidden');
    let shuffled = icons.sort(() => 0.5 - Math.random());
    shuffled.forEach(icon => {
        let card = document.createElement('div');
        card.className = 'card'; card.dataset.icon = icon;
        card.onclick = () => flipCard(card);
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped'); card.innerText = card.dataset.icon;
        flipped.push(card);
        if (flipped.length === 2) setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    let [c1, c2] = flipped;
    if (c1.dataset.icon === c2.dataset.icon) {
        c1.classList.add('matched'); c2.classList.add('matched');
        matched++;
        if (matched === icons.length / 2) document.getElementById('win-msg').classList.remove('hidden');
    } else {
        c1.classList.remove('flipped'); c1.innerText = '';
        c2.classList.remove('flipped'); c2.innerText = '';
    }
    flipped = [];
}

// === 5. QUIZ GAME ===
const questions = [
    { q: "Apa makanan favorit aku kalau lagi bingung mau makan apa?", options: ["Seblak", "Batagor", "Nasi Goreng", "Es Krim"], answer: 1 },
    { q: "Tempat pertama kali kita ngedate setelah sekian lama tidak bertemu?", options: ["Mall", "Indomaret", "Pecel lele", "Taman"], answer: 2 },
    { q: "Siapa yang paling sering ketiduran pas lagi Video Call/Chattingan?", options: ["Aku", "Kamu", "Kita berdua", "Sinyalnya yang tidur"], answer: 0 }
];

let currentQ = 0;
const quizBox = document.getElementById('quiz-box');
const resultText = document.getElementById('quiz-result');
const questionText = document.getElementById('question-text');
const optionsArea = document.getElementById('options-area');

function loadQuiz() {
    optionsArea.innerHTML = '';
    if (currentQ >= questions.length) {
        questionText.innerHTML = "Yey! Kuis Selesai! 🎉";
        resultText.innerText = "Bebe hebat sayaangkuu cintaakuu, yang paling cantiiiik sedunia dan seisinya mwaah mwaahh😚❤️!";
        resultText.style.color = "var(--primary)"; return;
    }
    const data = questions[currentQ];
    questionText.innerText = data.q; resultText.innerText = "";
    data.options.forEach((opt, index) => {
        let btn = document.createElement('button');
        btn.className = 'quiz-btn'; btn.innerText = opt;
        btn.onclick = () => checkAnswer(index);
        optionsArea.appendChild(btn);
    });
}

function checkAnswer(idx) {
    if (idx === questions[currentQ].answer) {
        resultText.style.color = "#27ae60"; resultText.innerText = "Benar! 😍 Lanjut...";
        setTimeout(() => { currentQ++; loadQuiz(); }, 1000);
    } else {
        resultText.style.color = "#e74c3c"; resultText.innerText = "Salah wlee 😝 Coba lagi!";
    }
}

// === 6. MAGIC UPLOAD (SAVE + KATEGORI) ===
function saveToStorage(imgSrc, category) {
    let photos = JSON.parse(localStorage.getItem('myMemories')) || [];
    photos.push({ src: imgSrc, category: category });
    localStorage.setItem('myMemories', JSON.stringify(photos));
}

function loadStoredImages() {
    let photos = JSON.parse(localStorage.getItem('myMemories')) || [];
    const grid = document.querySelector('.masonry-grid');
    if (photos.length > 0) {
        photos.reverse().forEach(item => {
            let imgSrc = item.src || item;
            let cat = item.category || 'fav';
            let stickerIcon = cat === 'fav' ? '❤️' : '😚';

            const newDiv = document.createElement('div');
            newDiv.className = `grid-item ${cat}`;
            newDiv.style.display = 'inline-block';
            newDiv.innerHTML = `
                <img src="${imgSrc}" onclick="openModal(this)">
                <div class="sticker">${stickerIcon}</div>
                <button class="delete-btn" onclick="deletePhoto(this)">❌</button>
            `;
            grid.insertBefore(newDiv, grid.firstChild);
        });
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const categorySelect = document.getElementById('uploadCategory');
    const selectedCategory = categorySelect.value;
    
    if (file) {
        if (file.size > 2 * 1024 * 1024) { alert("File terlalu besar! Maksimal 2MB ya."); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const result = e.target.result;
            const stickerIcon = selectedCategory === 'fav' ? '❤️' : '😚';
            
            const newDiv = document.createElement('div');
            newDiv.className = `grid-item ${selectedCategory}`;
            newDiv.style.display = 'inline-block';
            newDiv.innerHTML = `
                <img src="${result}" onclick="openModal(this)">
                <div class="sticker">${stickerIcon}</div>
                <button class="delete-btn" onclick="deletePhoto(this)">❌</button>
            `;
            const grid = document.querySelector('.masonry-grid');
            grid.insertBefore(newDiv, grid.firstChild);
            
            saveToStorage(result, selectedCategory);
            newDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            event.target.value = '';
        }
        reader.readAsDataURL(file);
    }
}

function deletePhoto(btn) {
    if(confirm("Yakin mau hapus kenangan ini?")) {
        const itemDiv = btn.parentElement;
        const img = itemDiv.querySelector('img').src;
        itemDiv.remove();
        let photos = JSON.parse(localStorage.getItem('myMemories')) || [];
        photos = photos.filter(p => (p.src || p) !== img);
        localStorage.setItem('myMemories', JSON.stringify(photos));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMemory();
    loadQuiz();
    loadStoredImages();
});