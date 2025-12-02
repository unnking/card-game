<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Gelişmiş Hafıza Oyunu — Başlangıçta İsim</title>
<style>
    :root{
        --bg:#071426;
        --card-back:linear-gradient(135deg,#1e293b,#0f172a);
        --accent:#ffcc00;
        --text:#e6eef8;
        --glass: rgba(255,255,255,0.04);
    }
    *{box-sizing:border-box;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif}
    body{
        margin:0;
        min-height:100vh;
        background:
          radial-gradient(circle at 10% 10%, rgba(255,255,255,0.02), transparent 10%),
          linear-gradient(180deg,#071021 0%, #081428 60%);
        color:var(--text);
        padding:20px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
    }
    header{width:100%;max-width:1100px;display:flex;gap:16px;align-items:center;justify-content:space-between}
    h1{margin:0;font-size:20px;letter-spacing:0.6px}
    .controls{
        display:flex;
        gap:10px;
        align-items:center;
        flex-wrap:wrap;
    }
    select,input,button{padding:8px 12px;border-radius:10px;border:0;background:var(--glass);color:var(--text)}
    #dashboard{width:100%;max-width:1100px;background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:space-between}
    .left, .right{display:flex;gap:8px;align-items:center}
    .badge{background:rgba(0,0,0,0.25);padding:8px 10px;border-radius:10px;font-weight:600}
    #game-container{width:100%;max-width:1100px;background:rgba(255,255,255,0.02);border-radius:14px;padding:18px;box-shadow:0 6px 30px rgba(2,6,23,0.6)}
    #info-row{display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
    #player-name{width:200px}
    #game-board{
        display:grid;
        gap:10px;
        justify-items:center;
    }
    /* card */
    .card{
        width:100%;
        height:100%;
        max-width:120px;
        aspect-ratio: 3/4;
        perspective:1000px;
        position:relative;
    }
    .card .inner{
        width:100%;height:100%;position:absolute;left:0;top:0;border-radius:12px;transform-style:preserve-3d;transition:transform .45s;
    }
    .card.flipped .inner{transform:rotateY(180deg)}
    .card .front, .card .back{
        position:absolute;left:0;top:0;width:100%;height:100%;backface-visibility:hidden;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:38px;
        box-shadow: 0 6px 18px rgba(2,6,23,0.6);
    }
    .card .back{background:var(--card-back);color:var(--text);transform:rotateY(0deg);font-size:30px}
    .card .front{background:linear-gradient(180deg,#ffffff06,#ffffff02);transform:rotateY(180deg);font-size:36px}
    .hidden{visibility:hidden;transform:scale(0.9);opacity:0}
    .shake{animation:shake .4s}
    @keyframes shake{0%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)}}
    .pop{animation:pop .35s ease}
    @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}
    footer{width:100%;max-width:1100px;text-align:center;color:#9fb1c8;font-size:13px}
    .modal{
        position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.6);
        z-index:50;
    }
    .modal .card{
        width:100%;max-width:560px;background:#071426;padding:20px;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.6)
    }
    .stat-list{display:flex;flex-direction:column;gap:8px}
    .stat-item{display:flex;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:8px}
    .toolbar{display:flex;gap:8px;align-items:center}
    .hint-btn{background:linear-gradient(90deg,#1f2937,#0b1220);border:1px solid rgba(255,255,255,0.03)}
    @media (max-width:600px){
        header{flex-direction:column;align-items:flex-start}
        .controls{width:100%;justify-content:flex-start}
    }
    /* ensure images inside front keep same size */
    .card .front img { width: 80%; height: auto; object-fit: cover; border-radius:8px }
    /* responsive column sizes will be set by JS but ensure min widths */
</style>
</head>
<body>
<header>
    <h1>Gelişmiş Hafıza Oyunu</h1>
    <div class="controls">
        <label><input id="sound-toggle" type="checkbox" checked> Ses</label>
        <label><input id="countdown-toggle" type="checkbox" checked> Geri Sayım</label>
        <button id="show-stats">İstatistikler</button>
    </div>
</header>

<div id="dashboard">
    <div class="left">
        <div class="badge">Oyuncu: <strong id="display-player">Misafir</strong></div>
        <div class="badge">Puan: <strong id="score">0</strong></div>
        <div class="badge">Hamle: <strong id="moves">0</strong></div>
        <div class="badge">Kalan Süre: <strong id="timer">--</strong></div>
    </div>
    <div class="right">
        <div class="toolbar">
            <!-- hidden input, filled from start modal -->
            <input id="player-name" placeholder="Adını gir (isteğe bağlı)" />
            <select id="theme-select" title="Tema">
                <option value="batman">Batman</option>
                <option value="marvel">Marvel</option>
                <option value="animals">Hayvanlar</option>
                <option value="space">Uzay</option>
            </select>
            <select id="difficulty">
                <option value="easy">Kolay (6 kart)</option>
                <option value="medium" selected>Orta (12 kart)</option>
                <option value="hard">Zor (18 kart)</option>
            </select>
            <button id="start-game">Başlat</button>
            <button id="restart-game">Yeniden Başlat</button>
            <button class="hint-btn" id="hint">HINT (-20 puan)</button>
        </div>
    </div>
</div>

<div id="game-container">
    <div id="info-row">
        <div class="badge">Tema: <span id="current-theme">Batman</span></div>
        <div class="badge">En İyi Skor: <span id="best-score">--</span></div>
        <div class="badge">En İyi Süre: <span id="best-time">--</span></div>
    </div>

    <div id="game-board" aria-live="polite"></div>
</div>

<footer>Her şey tarayıcıda çalışır — kaydetmek için en iyi skoru bitirdiğinde localStorage'e kaydeder.</footer>

<!-- Başlangıç modalı: kullanıcı adı girme -->
<div id="start-modal" class="modal" role="dialog" aria-modal="true" style="display:flex">
    <div class="card">
        <h2>Hoş geldin! 🎮</h2>
        <p>Lütfen oyun için bir kullanıcı adı gir (veya "Misafir" ile devam et).</p>
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
            <input id="start-player-name" placeholder="Örn: Furkan" style="flex:1;padding:10px;border-radius:8px;background:var(--glass);border:0;color:var(--text)" />
            <button id="start-with-name">Başla</button>
            <button id="start-as-guest">Misafir Olarak Başla</button>
        </div>
        <p style="margin-top:10px;color:#9fb1c8;font-size:13px">Ayarları daha sonra değiştirebilirsin.</p>
    </div>
</div>

<!-- İstatistik modal -->
<div id="stats-modal" style="display:none" class="modal" role="dialog" aria-modal="true">
    <div class="card">
        <h3>Oyun İstatistikleri</h3>
        <div class="stat-list" id="stat-list"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
            <button id="close-stats">Kapat</button>
        </div>
    </div>
</div>

<script>
/* ----------- OYUN AYARLARI VE DURUMLAR ---------- */
const themes = {
    batman: ['🃏','🦇','🦹‍♂️','🦹‍♀️','🧨','👨‍🦲','⚙️','🛡️','🧥','👓'],
    marvel: ['🕷️','🦸‍♂️','🦸‍♀️','🛡️','🔨','🧠','⚡','👑','🌪️','🪄'],
    animals: ['🐶','🐱','🦊','🐼','🦁','🐵','🐸','🦉','🦄','🐢'],
    space: ['🚀','🪐','🌌','🌠','👽','🔭','🛰️','☄️','🛸','🛑']
};
let difficultyMap = { easy:6, medium:12, hard:18 };

let cardCount = 12;
let deck = [];
let firstPick = null;
let secondPick = null;
let lockBoard = false;
let matchedPairs = 0;
let score = 0;
let moves = 0;
let startTime = null;
let timerInterval = null;
let timeLeft = null;
let soundOn = true;
let playerName = 'Misafir';
let bestScore = Number(localStorage.getItem('bestScore')) || null;
let bestTime = Number(localStorage.getItem('bestTime')) || null;
let totalGames = Number(localStorage.getItem('totalGames')) || 0;

/* ----------- AUDIO (WebAudio) ---------- */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudio(){ if(!audioCtx) audioCtx = new AudioCtx(); }
function playTone(freq=440, type='sine', duration=0.08, gain=0.06){
    if(!soundOn) return;
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + duration);
}
function playFlip(){ playTone(780,'sine',0.06,0.03) }
function playMatch(){ playTone(520,'triangle',0.12,0.06); setTimeout(()=>playTone(660,'sine',0.08,0.04),90) }
function playWrong(){ playTone(220,'sawtooth',0.18,0.05) }
function playVictory(){ playTone(880,'sine',0.25,0.08); setTimeout(()=>playTone(1100,'triangle',0.25,0.08),220) }
function playJoker(){ playTone(150,'sine',0.18,0.05); setTimeout(()=>playTone(420,'sine',0.12,0.06),120) }

/* ----------- DOM ---------- */
const boardEl = document.getElementById('game-board');
const startBtn = document.getElementById('start-game');
const restartBtn = document.getElementById('restart-game');
const hintBtn = document.getElementById('hint');
const themeSelect = document.getElementById('theme-select');
const difficultySelect = document.getElementById('difficulty');
const playerInput = document.getElementById('player-name');
const displayPlayer = document.getElementById('display-player');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const currentThemeEl = document.getElementById('current-theme');
const bestScoreEl = document.getElementById('best-score');
const bestTimeEl = document.getElementById('best-time');
const soundToggle = document.getElementById('sound-toggle');
const countdownToggle = document.getElementById('countdown-toggle');
const statsModal = document.getElementById('stats-modal');
const showStatsBtn = document.getElementById('show-stats');
const closeStatsBtn = document.getElementById('close-stats');
const statList = document.getElementById('stat-list');

/* start modal elements */
const startModal = document.getElementById('start-modal');
const startNameInput = document.getElementById('start-player-name');
const startWithNameBtn = document.getElementById('start-with-name');
const startAsGuestBtn = document.getElementById('start-as-guest');

/* ----------- YARDIMCI FONKSİYONLAR ---------- */

function saveStats() {
    if(bestScore === null || score > bestScore){ bestScore = score; localStorage.setItem('bestScore', bestScore); }
    if(bestTime === null || elapsedSeconds < bestTime){ localStorage.setItem('bestTime', elapsedSeconds); bestTime = elapsedSeconds; }
    totalGames++;
    localStorage.setItem('totalGames', totalGames);
    updateHeaderStats();
}

function updateHeaderStats(){
    bestScoreEl.textContent = bestScore === null ? '--' : bestScore;
    bestTimeEl.textContent = bestTime === null ? '--' : formatTime(bestTime);
}

function formatTime(s){
    if(s === null || s === undefined) return '--';
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = Math.floor(s%60).toString().padStart(2,'0');
    return mm + ':' + ss;
}

function shuffle(array) {
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

/* ----------- OYUN OLUŞTURMA ---------- */
function buildDeck(){
    const theme = themeSelect.value;
    const icons = themes[theme].slice(); // copy
    const pairsCount = cardCount/2;
    // ensure we have enough icons
    while(icons.length < pairsCount){
        icons.push(...icons); // duplicate if needed
    }
    shuffle(icons);
    const chosen = icons.slice(0,pairsCount);

    // create pairs
    let temp = [];
    chosen.forEach((icon, idx) => {
        temp.push({id:`p${idx}-a`, val:icon, joker:false});
        temp.push({id:`p${idx}-b`, val:icon, joker:false});
    });

    // include one Joker if cardCount >=8
    if(cardCount >= 8){
        const randIndex = Math.floor(Math.random()*temp.length);
        temp[randIndex].joker = true;
        temp[randIndex].val = '🃏';
    }

    shuffle(temp);
    deck = temp;
}

/* ----------- UI RENDER ---------- */
function renderBoard(){
    boardEl.innerHTML = '';
    // set grid columns based on cardCount
    const cols = cardCount <= 6 ? 3 : (cardCount <= 12 ? 4 : 6);
    boardEl.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`;

    deck.forEach((c, idx) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('card');
        wrapper.style.maxWidth = (cardCount<=6? '100px' : cardCount<=12? '110px':'90px');
        wrapper.setAttribute('data-index', idx);

        const inner = document.createElement('div');
        inner.className = 'inner';

        const back = document.createElement('div');
        back.className = 'back';
        back.innerHTML = '<span style="font-size:18px">?</span>';

        const front = document.createElement('div');
        front.className = 'front';
        // if value looks like an emoji, show text; otherwise assume image path
        if(typeof c.val === 'string' && c.val.length < 3 && c.val.match(/[^\w\s]/)){ 
            front.textContent = c.val;
        } else {
            // in case of image paths (if you switch to images later)
            const img = document.createElement('img');
            img.src = c.val;
            front.appendChild(img);
        }

        inner.appendChild(back);
        inner.appendChild(front);
        wrapper.appendChild(inner);

        // events
        wrapper.addEventListener('click', () => flipCard(wrapper, idx));
        boardEl.appendChild(wrapper);
    });
}

/* ----------- OYUN MEKANİĞİ ---------- */
let elapsedSeconds = 0;
function startTimer(){
    clearInterval(timerInterval);
    startTime = Date.now();
    elapsedSeconds = 0;
    const useCountdown = countdownToggle.checked;
    if(useCountdown){
        const base = difficultySelect.value === 'easy' ? 60 : difficultySelect.value === 'medium' ? 90 : 120;
        timeLeft = base;
        timerEl.textContent = formatTime(timeLeft);
        timerInterval = setInterval(()=>{
            timeLeft--;
            timerEl.textContent = formatTime(timeLeft);
            if(timeLeft <= 0){
                clearInterval(timerInterval);
                endGame(false, 'Süre doldu! Kaybettin.');
            }
        },1000);
    } else {
        timerEl.textContent = '00:00';
        timerInterval = setInterval(()=>{
            elapsedSeconds = Math.floor((Date.now()-startTime)/1000);
            timerEl.textContent = formatTime(elapsedSeconds);
        },1000);
    }
}

function stopTimer(){
    clearInterval(timerInterval);
}

function flipCard(cardEl, index){
    if(lockBoard) return;
    if(cardEl.classList.contains('matched')) return;

    // prevent clicking same card twice
    if(firstPick && firstPick.index === index) return;

    // flip visual
    cardEl.classList.add('flipped','pop');
    setTimeout(()=>cardEl.classList.remove('pop'),350);
    playFlip();

    const cardObj = deck[index];

    if(!firstPick){
        firstPick = {index, cardEl, cardObj};
    } else if(!secondPick){
        secondPick = {index, cardEl, cardObj};
        lockBoard = true;
        moves++;
        movesEl.textContent = moves;
        // check match or special joker
        setTimeout(()=>checkForMatch(), 400);
    }
}

function checkForMatch(){
    if(!firstPick || !secondPick) return;
    // Joker logic
    if(firstPick.cardObj.joker || secondPick.cardObj.joker){
        playJoker();
        const unmatchedIndices = deck.map((d,i)=>({d,i}))
            .filter(x => !document.querySelector(`.card[data-index="${x.i}"]`).classList.contains('matched') && !x.d.joker)
            .map(x=>x.i);

        if(unmatchedIndices.length >= 2){
            shuffle(unmatchedIndices);
            const a = unmatchedIndices[0];
            const val = deck[a].val;
            const pairIndex = deck.findIndex((d,idx) => idx !== a && d.val === val && !document.querySelector(`.card[data-index="${idx}"]`).classList.contains('matched'));
            if(pairIndex !== -1){
                const elA = document.querySelector(`.card[data-index="${a}"]`);
                const elB = document.querySelector(`.card[data-index="${pairIndex}"]`);
                elA.classList.add('flipped','matched'); elB.classList.add('flipped','matched');
                elA.classList.add('pop'); elB.classList.add('pop');
                setTimeout(()=>{ elA.classList.remove('pop'); elB.classList.remove('pop'); },350);
                matchedPairs++;
                score += 50; score = Math.max(0,score);
                scoreEl.textContent = score;
            }
        } else {
            revealAll(800);
        }

        if(firstPick.cardObj.joker) document.querySelector(`.card[data-index="${firstPick.index}"]`).classList.add('matched','hidden');
        if(secondPick.cardObj.joker) document.querySelector(`.card[data-index="${secondPick.index}"]`).classList.add('matched','hidden');

        matchedPairs = document.querySelectorAll('.card.matched').length / 2;
        resetPicks();
        unlockBoard();
        checkWinCondition();
        return;
    }

    // Normal compare
    if(firstPick.cardObj.val === secondPick.cardObj.val){
        firstPick.cardEl.classList.add('matched');
        secondPick.cardEl.classList.add('matched');
        matchedPairs++;
        score += 50;
        playMatch();
    } else {
        score -= 10; if(score < 0) score = 0;
        playWrong();
        firstPick.cardEl.classList.add('shake');
        secondPick.cardEl.classList.add('shake');
        setTimeout(()=>{
            firstPick.cardEl.classList.remove('flipped','shake');
            secondPick.cardEl.classList.remove('flipped','shake');
        },500);
    }
    scoreEl.textContent = score;
    resetPicks();
    unlockBoard();
    checkWinCondition();
}

function revealAll(ms=800){
    const cards = document.querySelectorAll('.card');
    cards.forEach(c=>c.classList.add('flipped'));
    setTimeout(()=>cards.forEach(c=>{
        if(!c.classList.contains('matched')) c.classList.remove('flipped');
    }), ms);
}

function resetPicks(){
    firstPick = null;
    secondPick = null;
}

function unlockBoard(){
    lockBoard = false;
}

function checkWinCondition(){
    const totalPairs = cardCount/2;
    const matched = document.querySelectorAll('.card.matched').length/2;
    if(matched >= totalPairs){
        stopTimer();
        playVictory();
        if(countdownToggle.checked){
            const base = difficultySelect.value === 'easy' ? 60 : difficultySelect.value === 'medium' ? 90 : 120;
            elapsedSeconds = base - (timeLeft || 0);
        } else {
            elapsedSeconds = Math.floor((Date.now()-startTime)/1000);
        }
        if(countdownToggle.checked && timeLeft > 0) score += Math.max(0, Math.floor(timeLeft/2));
        saveStats();
        setTimeout(()=> showEndModal(true), 300);
    }
}

/* ----------- OYUN BAŞLAT/YENİDEN ---------- */
function startGame(){
    // read UI
    playerName = playerInput.value.trim() || playerName || 'Misafir';
    displayPlayer.textContent = playerName;
    soundOn = soundToggle.checked;
    currentThemeEl.textContent = themeSelect.options[themeSelect.selectedIndex].text;
    cardCount = difficultyMap[difficultySelect.value] || 12;

    // reset state
    score = 0; moves = 0; matchedPairs = 0; elapsedSeconds = 0;
    scoreEl.textContent = score; movesEl.textContent = moves; timerEl.textContent = '--';
    firstPick = null; secondPick = null; lockBoard = false;

    // build deck and render
    buildDeck();
    renderBoard();

    // start timer
    startTimer();
}

function restartGame(){
    stopTimer();
    boardEl.querySelectorAll('.card').forEach(c=>c.remove());
    startGame();
}

/* ----------- HINT ---------- */
hintBtn.addEventListener('click', () => {
    if(lockBoard) return;
    score -= 20; if(score < 0) score = 0; scoreEl.textContent = score;
    revealAll(900);
    playFlip();
});

/* ----------- EVENT LISTENERS ---------- */
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
soundToggle.addEventListener('change', ()=> soundOn = soundToggle.checked);
themeSelect.addEventListener('change', ()=> currentThemeEl.textContent = themeSelect.options[themeSelect.selectedIndex].text);
difficultySelect.addEventListener('change', ()=> {/* grid updates on start */});
playerInput.addEventListener('change', ()=> displayPlayer.textContent = playerInput.value || 'Misafir');

/* stats modal */
showStatsBtn.addEventListener('click', ()=> {
    populateStatsModal();
    statsModal.style.display = 'flex';
});
closeStatsBtn.addEventListener('click', ()=> statsModal.style.display = 'none');
document.getElementById('close-stats').addEventListener('click', ()=> statsModal.style.display = 'none');

function populateStatsModal(){
    const stats = [
        {k:'Oyuncu', v:playerName},
        {k:'Toplam Oyun', v: totalGames},
        {k:'En İyi Skor', v: bestScore === null ? '--' : bestScore},
        {k:'En İyi Süre', v: bestTime === null ? '--' : formatTime(bestTime)},
        {k:'Son Puan', v: score},
        {k:'Son Hamle', v: moves},
        {k:'Son Süre', v: elapsedSeconds ? formatTime(elapsedSeconds) : '--'}
    ];
    statList.innerHTML = '';
    stats.forEach(s=>{
        const el = document.createElement('div');
        el.className = 'stat-item';
        el.innerHTML = `<div>${s.k}</div><div><strong>${s.v}</strong></div>`;
        statList.appendChild(el);
    });
}

/* ----------- END GAME MODAL ---------- */
function showEndModal(won){
    const modal = document.createElement('div');
    modal.className = 'modal';
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = won ? 'Tebrikler! Kazandın 🎉' : 'Oyun Bitti';
    const body = document.createElement('div');
    body.className = 'stat-list';
    const timeText = countdownToggle.checked ? (formatTime( (difficultySelect.value==='easy'?60:difficultySelect.value==='medium'?90:120) - (timeLeft||0) )) : formatTime(elapsedSeconds || 0);
    body.innerHTML = `
        <div class="stat-item"><div>Oyuncu</div><div><strong>${playerName}</strong></div></div>
        <div class="stat-item"><div>Puan</div><div><strong>${score}</strong></div></div>
        <div class="stat-item"><div>Hamle</div><div><strong>${moves}</strong></div></div>
        <div class="stat-item"><div>Süre</div><div><strong>${timeText}</strong></div></div>
    `;
    const btnRow = document.createElement('div');
    btnRow.style.display='flex'; btnRow.style.gap='8px'; btnRow.style.justifyContent='flex-end'; btnRow.style.marginTop='10px';
    const close = document.createElement('button'); close.textContent='Kapat';
    const again = document.createElement('button'); again.textContent='Yeniden Oyna';
    close.addEventListener('click', ()=> { document.body.removeChild(modal); });
    again.addEventListener('click', ()=> { document.body.removeChild(modal); restartGame(); });

    btnRow.appendChild(close); btnRow.appendChild(again);
    card.appendChild(title); card.appendChild(body); card.appendChild(btnRow);
    modal.appendChild(card);
    document.body.appendChild(modal);
}

/* ----------- START MODAL HANDLING ---------- */
function openStartModal(){
    startModal.style.display = 'flex';
    startNameInput.focus();
    // prevent background interaction
    document.body.style.overflow = 'hidden';
}
function closeStartModal(){
    startModal.style.display = 'none';
    document.body.style.overflow = '';
}

startWithNameBtn.addEventListener('click', ()=>{
    const name = startNameInput.value.trim();
    if(name.length === 0) return alert('Lütfen bir isim gir veya Misafir ile başla.');
    playerName = name;
    document.getElementById('player-name').value = playerName;
    displayPlayer.textContent = playerName;
    closeStartModal();
    // auto-start the game
    startGame();
});
startAsGuestBtn.addEventListener('click', ()=>{
    playerName = 'Misafir';
    document.getElementById('player-name').value = playerName;
    displayPlayer.textContent = playerName;
    closeStartModal();
    startGame();
});

/* ----------- İLK YÜKLEME (HEADER GÜNCELLE) ---------- */
updateHeaderStats();
timerEl.textContent = '--';
scoreEl.textContent = score;
movesEl.textContent = moves;

/* show the start modal on load */
window.addEventListener('DOMContentLoaded', openStartModal);

</script>
</body>
</html>
