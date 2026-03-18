// Animal Evolution Mapping
const EVOLUTION_MAP = {
    2: { emoji: '🐣', name: '雛雞' },
    4: { emoji: '🐰', name: '兔子' },
    8: { emoji: '🦊', name: '狐狸' },
    16: { emoji: '🦌', name: '馴鹿' },
    32: { emoji: '🐼', name: '熊貓' },
    64: { emoji: '🦓', name: '斑馬' },
    128: { emoji: '🐊', name: '鱷魚' },
    256: { emoji: '🦏', name: '犀牛' },
    512: { emoji: '🐘', name: '大象' },
    1024: { emoji: '🦁', name: '獅子' },
    2048: { emoji: '🐉', name: '巨龍' },
    4096: { emoji: '🦄', name: '獨角獸' },
    8192: { emoji: '🦅', name: '鳳凰' },
    16384: { emoji: '🐺', name: '芬里爾' },
    32768: { emoji: '🐋', name: '鯤平' },
    65536: { emoji: '🧞', name: '燈神' },
    131072: { emoji: '🧚', name: '靈魂' },
    262144: { emoji: '🪐', name: '星球' },
    524288: { emoji: '☀️', name: '恆星' },
    1048576: { emoji: '💎', name: '奇點' }
};

const FOREST_FACTS = {
    2: "雛雞在蛋裡就能聽到媽媽的叫聲！",
    4: "兔子的牙齒會不停地生長。",
    8: "狐狸是獨居動物，除了繁殖季節。",
    16: "馴鹿是唯一雌性也會長角的鹿。",
    32: "熊貓一天要花 12 小時來吃竹子。",
    64: "每隻斑馬的條紋都是獨一無二的。",
    128: "鱷魚無法伸出牠們的舌頭。",
    256: "犀牛的角是由角蛋白構成的，和我們的指甲一樣。",
    512: "大象能用腳來『聽』到遠方的震動。",
    1024: "獅子的吼聲在 8 公里外都能聽到。",
    2048: "在許多文化中，龍是力量與智慧的象徵。",
    4096: "傳說獨角獸的角能淨化水源。",
    8192: "鳳凰能從灰燼中重生，象徵著不朽。",
    16384: "芬里爾是北歐神話中足以吞噬世界的巨狼。",
    32768: "鯤平象徵著在無盡海洋與天際之間自由穿梭。",
    65536: "燈神能實現願望，但真正的命運掌握在自己手中。",
    131072: "靈魂是生命的本質，超越了物質的界限。",
    262144: "星球是宇宙中的綠洲，孕育著無限可能。",
    524288: "恆星是宇宙的光源，燃燒自己照亮虛空。",
    1048576: "奇點是一切的開始，也是進化最純粹的終點。"
};

const COLOR_MAP = {
    2: { bg: '#eee4da', text: '#776e65' },      // 🐣
    4: { bg: '#ede0c8', text: '#776e65' },      // 🐰
    8: { bg: '#f2b179', text: '#f9f6f2' },      // 🦊
    16: { bg: '#f59563', text: '#f9f6f2' },     // 🦌
    32: { bg: '#f67c5f', text: '#f9f6f2' },     // 🐼
    64: { bg: '#f65e3b', text: '#f9f6f2' },     // 🦓
    128: { bg: '#edcf72', text: '#f9f6f2' },    // 🐊
    256: { bg: '#edcc61', text: '#f9f6f2' },    // 🦏
    512: { bg: '#edc850', text: '#f9f6f2' },    // 🐘
    1024: { bg: '#edc53f', text: '#f9f6f2' },   // 🦁
    2048: { bg: '#edc22e', text: '#f9f6f2' },   // 🐉
    4096: { bg: '#3c3a32', text: '#f9f6f2' },   // 🦄
    8192: { bg: '#242320', text: '#f9f6f2' },   // 🦅
    16384: { bg: '#4a5568', text: '#f9f6f2' },  // 🐺 芬里爾 (灰藍)
    32768: { bg: '#3182ce', text: '#f9f6f2' },  // 🐋 鯤平 (海洋藍)
    65536: { bg: '#805ad5', text: '#f9f6f2' },  // 🧞 燈神 (紫色)
    131072: { bg: '#f687b3', text: '#f9f6f2' }, // 🧚 靈魂 (粉色)
    262144: { bg: '#dd6b20', text: '#f9f6f2' }, // 🪐 星球 (土橙)
    524288: { bg: '#ecc94b', text: '#776e65' }, // ☀️ 恆星 (明黃)
    1048576: { bg: '#ebf8ff', text: '#2b6cb0' } // 💎 奇點 (鑽石白藍)
};

let gridSize = 4;
let grid = [];
let score = 0;
let bestAnimal = 2;
let moveCount = 0;
let magicWands = 2;
let isWandMode = false;
let switchToolCount = 1;
let isSwitchMode = false;
let firstSwitchTile = null;
let unlockedAnimals = new Set();
let eggPosition = null; // {row, col}

// 
let soundEnabled = true;
let animationsEnabled = true;

// Audio Context for sound synthesis
let audioCtx = null;
let hasWon2048 = false;
let hasWonSingularity = false;

// Initialize the game
function initGame() {
    // A. 先嘗試從本地讀取存檔
    const dataString = localStorage.getItem("2048_save");
    const savedData = dataString ? JSON.parse(dataString) : null;

    // B. 判斷是否有「還沒結束」的存檔
    if (savedData && !savedData.over) {
        // 載入存檔數據
        gridSize = savedData.gridSize || 4;
        grid = savedData.grid;
        score = savedData.score;
        bestAnimal = savedData.bestAnimal || 0;
        moveCount = savedData.moveCount || 0;
        magicWands = savedData.magicWands ?? 2;
        switchToolCount = savedData.switchToolCount ?? 1;
        unlockedAnimals = new Set(savedData.unlockedAnimals || [2]);
        hasWon2048 = savedData.hasWon2048 || false;
        hasWonSingularity = savedData.hasWonSingularity || false;
        
        // 這些狀態通常不跨存檔，重置為預設
        isWandMode = false;
        isSwitchMode = false;
        firstSwitchTile = null;
        eggPosition = savedData.eggPosition || null;

        updateUI();
        renderBoard([]); // 直接渲染存好的棋盤，不加新方塊
    } else {
        // C. 如果沒有存檔，執行你原本的「開新局」邏輯
        gridSize = 4;
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        score = 0;
        bestAnimal = 0; 
        document.getElementById('best-animal').textContent = EVOLUTION_MAP[2].emoji;
        moveCount = 0;
        magicWands = 2;
        switchToolCount = 1;
        isSwitchMode = false;
        firstSwitchTile = null;
        eggPosition = null;
        if (savedData && savedData.unlockedAnimals) {
            unlockedAnimals = new Set(savedData.unlockedAnimals);
        } else {
            unlockedAnimals = new Set([2]); // 完全的新玩家
        }
        hasWon2048 = false;
        hasWonSingularity = false;
        updateUI();
        const t1 = addRandomTile();
        const t2 = addRandomTile();
        renderBoard([t1, t2].filter(Boolean));
        saveGame(false);
    }

  renderEncyclopedia();
}

// Add a random tile to an empty cell with Floor Shift and Leap Spawning
function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // 1. 階梯式保底提升 (The Floor Shift) - 動態隨 gridSize 擴張
        let floorValue = 2;
        if (gridSize >= 8) floorValue = 32;       // 16384+ 時 8x8
        else if (gridSize >= 7) floorValue = 16;  // 8192+ 時 7x7
        else if (gridSize >= 6) floorValue = 8;   // 4096+ 時 6x6
        else if (gridSize >= 5) floorValue = 4;   // 2048+ 時 5x5

        // 2. 動態掉落池：機率性「跨階」 (Leap Spawning)
        let newValue;
        const rand = Math.random();
        
        // 隨著網格變大，稍微增加跨階機率以維持進度
        const leapBonus = (gridSize - 4) * 0.005; // 每多一格網格，增加 0.5% 跨階機率
        
        if (rand < 0.01 + leapBonus) newValue = floorValue * 8;      
        else if (rand < 0.04 + leapBonus) newValue = floorValue * 4; 
        else if (rand < 0.15 + leapBonus) newValue = floorValue * 2; 
        else newValue = floorValue;                      

        // Ensure newValue doesn't exceed 1048576 or limits
        if (!EVOLUTION_MAP[newValue]) {
            newValue = floorValue;
        }

        grid[r][c] = newValue;
        unlockedAnimals.add(grid[r][c]);
        return { r, c };
    }
    return null;
}

// Render the game board
function renderBoard(newTiles = [], mergedTiles = []) {
    const board = document.getElementById('game-board');
    board.style.setProperty('--grid-size', gridSize);
    board.innerHTML = '';
    
    // Dynamic font size based on grid size - Improved for progressive expansion
    let fontSize = '2.5rem';
    if (gridSize === 5) fontSize = '2rem';
    else if (gridSize === 6) fontSize = '1.6rem';
    else if (gridSize === 7) fontSize = '1.3rem';
    else if (gridSize >= 8) fontSize = '1.1rem';

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const value = grid[r][c];
            const tile = document.createElement('div');
            tile.className = 'tile' + (value > 0 ? ' filled' : '');
            tile.style.fontSize = fontSize;
            
            if (value > 0) {
                // Determine color based on value
                const tileStyle = COLOR_MAP[value] || { bg: '#343a40', text: '#FFFFFF' }; 
                tile.style.background = tileStyle.bg;
                tile.style.color = tileStyle.text;

                tile.textContent = EVOLUTION_MAP[value].emoji;
                
                // Add tool interaction classes
                if (isWandMode) {
                    tile.classList.add('targetable');
                } else if (isSwitchMode) {
                    if (firstSwitchTile && firstSwitchTile.r === r && firstSwitchTile.c === c) {
                        tile.classList.add('selected');
                    } else if (firstSwitchTile) {
                        const dist = Math.abs(firstSwitchTile.r - r) + Math.abs(firstSwitchTile.c - c);
                        if (dist === 1) tile.classList.add('targetable');
                    } else {
                        tile.classList.add('targetable');
                    }
                }

                // Add pop animation for new or merged tiles
                if (animationsEnabled && (newTiles.some(t => t.r === r && t.c === c) || 
                    mergedTiles.some(t => t.r === r && t.c === c))) {
                    tile.classList.add('pop-animation');
                }

                // Add special effects for mythical creatures
                if (animationsEnabled && value === 4096) tile.classList.add('rainbow-glow');
                if (animationsEnabled && mergedTiles.some(t => t.r === r && t.c === c && t.value === 8192)) {
                    tile.classList.add('fire-flash');
                }

                // Check if this is the egg position
                if (animationsEnabled && eggPosition && eggPosition.r === r && eggPosition.c === c) {
                    tile.classList.add('flashing-egg');
                }

                tile.addEventListener('click', () => handleTileClick(r, c));
            }
            board.appendChild(tile);
        }
    }
}

function handleTileClick(r, c) {
    if (isWandMode) {
        const clickedValue = grid[r][c];
        if (clickedValue > 0) {
            // Find the maximum value currently on the board
            let maxVal = 0;
            grid.flat().forEach(v => {
                if (v > maxVal) maxVal = v;
            });

            // If the user is trying to eliminate the highest level animal, show a confirmation
            if (clickedValue === maxVal) {
                const confirmEliminate = confirm(`你正在消除目前最高等級的動物 ${EVOLUTION_MAP[clickedValue].emoji}，確定要繼續嗎？`);
                if (!confirmEliminate) return;
            }

            grid[r][c] = 0;
            magicWands--;
            isWandMode = false;
            document.body.style.cursor = 'default';
            playMagicSound();
            renderBoard();
            updateUI();
        }
    } else if (isSwitchMode) {
        if (!firstSwitchTile) {
            if (grid[r][c] > 0) {
                firstSwitchTile = { r, c };
                renderBoard(); // Update to show selection
            }
        } else {
            const dist = Math.abs(firstSwitchTile.r - r) + Math.abs(firstSwitchTile.c - c);
            if (dist === 1) { // Tiles are adjacent
                const temp = grid[r][c];
                grid[r][c] = grid[firstSwitchTile.r][firstSwitchTile.c];
                grid[firstSwitchTile.r][firstSwitchTile.c] = temp;

                switchToolCount--;
                isSwitchMode = false;
                firstSwitchTile = null;
                document.body.style.cursor = 'default';
                renderBoard();
                updateUI();
            } else if (r === firstSwitchTile.r && c === firstSwitchTile.c) {
                // Clicked the same tile again, deselect
                firstSwitchTile = null;
                renderBoard();
            } else if (grid[r][c] > 0) {
                // Clicked another tile, switch selection
                firstSwitchTile = { r, c };
                renderBoard();
            }
        }
    }
}

// Render the Encyclopedia
function renderEncyclopedia() {
    const container = document.getElementById('encyclopedia');
    container.innerHTML = '';
    const maxUnlocked = Math.max(...unlockedAnimals);

    Object.keys(EVOLUTION_MAP).forEach(value => {
        const numValue = parseInt(value);
        const data = EVOLUTION_MAP[value];
        const isUnlocked = unlockedAnimals.has(numValue);

        // Progressive reveal: show unlocked and the next 2-3
        if (isUnlocked || numValue <= maxUnlocked * 4) {
            const item = document.createElement('div');
            item.className = 'encyclopedia-item' + (isUnlocked ? ' unlocked' : '');
            
            const icon = document.createElement('div');
            icon.className = 'encyclopedia-icon' + (isUnlocked ? ' unlocked' : '');
            icon.textContent = isUnlocked ? data.emoji : '❓';
            
            const name = document.createElement('div');
            name.className = 'encyclopedia-name';
            name.textContent = data.name;

            if (isUnlocked) {
                item.addEventListener('click', () => {
                    showFactPopup(data.name, FOREST_FACTS[numValue]);
                });
            }
            
            item.appendChild(icon);
            item.appendChild(name);
            container.appendChild(item);
        }
    });
}

function showFactPopup(title, fact) {
    // Logic to show a popup/modal with the fact
    alert(`${title}\n\n森林小知識：${fact}`);
}

// Update UI elements
function updateUI() {
    document.getElementById('current-score').textContent = score;
    const wandBtn = document.getElementById('magic-wand-btn');
    const switchBtn = document.getElementById('switch-tool-btn');
    
    document.getElementById('magic-wand-count').textContent = magicWands;
    document.getElementById('switch-tool-count').textContent = switchToolCount;
    
    // Update active states
    if (isWandMode) wandBtn.classList.add('active');
    else wandBtn.classList.remove('active');
    
    if (isSwitchMode) switchBtn.classList.add('active');
    else switchBtn.classList.remove('active');
    
    // Disable if no charges
    wandBtn.disabled = (magicWands <= 0);
    switchBtn.disabled = (switchToolCount <= 0);
    
    // Update best animal
    let max = 0;
    grid.forEach(row => row.forEach(val => { if (val > max) max = val; }));
    if (max > bestAnimal) {
        const oldBest = bestAnimal;
        bestAnimal = max;
        if (EVOLUTION_MAP[bestAnimal]) {
            document.getElementById('best-animal').textContent = EVOLUTION_MAP[bestAnimal].emoji;
        }

        // Progressive Expansion Logic: 每升一階 (從 2048 開始) 擴張一格
        if (bestAnimal >= 2048) {
            // 計算理論上應該有的網格大小
            // 2048 (2^11) -> 5
            // 4096 (2^12) -> 6
            // 8192 (2^13) -> 7 ...
            const exponent = Math.log2(bestAnimal);
            const targetSize = Math.floor(exponent - 11 + 5);
            
            if (gridSize < targetSize) {
                const animalData = EVOLUTION_MAP[bestAnimal];
                expandGrid(targetSize, `✨ 進化至 ${animalData.name}！ ✨`, animalData.emoji);
            }
        }

        if (bestAnimal >= 1048576) {
            showOverlay('ultimate-win-overlay');
        }
    }
}

// Expansion Logic
function expandGrid(newSize, customTitle, customEmoji) {
    const oldGrid = grid;
    const oldSize = gridSize;
    gridSize = newSize;
    
    // Create a new grid with newSize
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    // Migrate existing tiles to the center of the new grid
    const offset = Math.floor((newSize - oldSize) / 2);
    for (let r = 0; r < oldSize; r++) {
        for (let c = 0; c < oldSize; c++) {
            grid[r + offset][c + offset] = oldGrid[r][c];
        }
    }
    
    // Update UI and show notification
    const overlay = document.getElementById('expansion-overlay');
    const h2 = overlay.querySelector('h2');
    const emoji = overlay.querySelector('.celebration-emoji');
    const p = document.getElementById('expansion-message');

    h2.textContent = customTitle || "🌍 空間擴張！ 🌍";
    emoji.textContent = customEmoji || "🌱";
    p.textContent = `世界擴張為 ${gridSize}x${gridSize}！空間變得更開闊了，你正在創造一個壯麗的宇宙。`;

    showOverlay('expansion-overlay');
    playExpansionSound();
    
    console.log(`空間擴張！當前棋盤大小：${gridSize}x${gridSize}`);
    renderBoard();
}

function playExpansionSound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.8);
}

// Movement Logic
function move(direction) {
    let moved = false;
    let newGrid = JSON.parse(JSON.stringify(grid));
    let pointsGained = 0;
    let mergedTilesNormalized = []; // Track merged tiles in normalized grid

    const rotate = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    const reverse = (matrix) => matrix.map(row => [...row].reverse());

    // Normalize direction to "Left" by rotating/reversing
    if (direction === 'ArrowUp') {
        newGrid = rotate(rotate(rotate(newGrid)));
    } else if (direction === 'ArrowRight') {
        newGrid = reverse(newGrid);
    } else if (direction === 'ArrowDown') {
        newGrid = rotate(newGrid);
    } else if (direction === 'ArrowLeft') {
        // Already in Left orientation
    }

    // Process rows (always leftwards after normalization)
    for (let r = 0; r < gridSize; r++) {
        let row = newGrid[r].filter(v => v !== 0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                const newValue = row[i] * 2;
                row[i] = newValue;
                row.splice(i + 1, 1);
                pointsGained += newValue;
                mergedTilesNormalized.push({ r, c: i });
                if (EVOLUTION_MAP[newValue]) {
                    unlockedAnimals.add(newValue);
                }
                playMergeSound(newValue);
            }
        }
        while (row.length < gridSize) row.push(0);
        if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
        newGrid[r] = row;
    }

    // Restore original orientation and map merged tiles back
    let finalMergedTiles = [];
    if (direction === 'ArrowUp') {
        newGrid = rotate(newGrid);
        finalMergedTiles = mergedTilesNormalized.map(t => ({ r: t.c, c: gridSize - 1 - t.r }));
    } else if (direction === 'ArrowRight') {
        newGrid = reverse(newGrid);
        finalMergedTiles = mergedTilesNormalized.map(t => ({ r: t.r, c: gridSize - 1 - t.c }));
    } else if (direction === 'ArrowDown') {
        newGrid = rotate(rotate(rotate(newGrid)));
        finalMergedTiles = mergedTilesNormalized.map(t => ({ r: gridSize - 1 - t.c, c: t.r }));
    } else {
        finalMergedTiles = mergedTilesNormalized;
    }

    if (moved) {
        // Special check for egg merging if egg exists
        if (eggPosition && mergedTilesNormalized.length > 0) {
            const oldValAtEgg = grid[eggPosition.r][eggPosition.c];
            const newValAtEgg = newGrid[eggPosition.r][eggPosition.c];
            if (oldValAtEgg !== 0 && (oldValAtEgg !== newValAtEgg || newValAtEgg === 0)) {
                pointsGained *= 2; 
            }
        }
        
        grid = newGrid;
        score += pointsGained;
        moveCount++;
        eggPosition = null; 
        
        handleRandomEvents();
        const newTile = addRandomTile();
        renderBoard([newTile].filter(Boolean), finalMergedTiles);
        updateUI();
        saveGame();
        renderEncyclopedia();
        playSwipeSound();
        
        if (isGameOver()) {
            showOverlay('game-over-overlay');
        }
    }
}

// Random Events: Escaping Bird
function handleRandomEvents() {
    if (moveCount % 20 === 0 && moveCount > 0) {
        if (Math.random() < 0.5) { // 50% chance
            const filledCells = [];
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    if (grid[r][c] !== 0) filledCells.push({ r, c });
                }
            }
            if (filledCells.length > 0) {
                eggPosition = filledCells[Math.floor(Math.random() * filledCells.length)];
            }
        }
    }
}

// Magic Wand logic
function useMagicWand() {
    const animalCount = grid.flat().filter(v => v > 0).length;
    if (magicWands <= 0 || animalCount <= 2) {
        console.log("Cannot use Magic Wand now.");
        return;
    }

    isWandMode = !isWandMode;
    isSwitchMode = false; // Deactivate other tools
    firstSwitchTile = null;
    document.body.style.cursor = isWandMode ? 'crosshair' : 'default';
    renderBoard();
    updateUI();
}

function useSwitchTool() {
    if (switchToolCount <= 0) return;
    
    isSwitchMode = !isSwitchMode;
    isWandMode = false; // Deactivate other tools
    firstSwitchTile = null;
    document.body.style.cursor = isSwitchMode ? 'pointer' : 'default';
    renderBoard();
    updateUI();
}

// Game Over check
function isGameOver() {
    // Check for empty cells
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) return false;
        }
    }
    // Check for possible merges
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const val = grid[r][c];
            if (r < gridSize - 1 && grid[r + 1][c] === val) return false;
            if (c < gridSize - 1 && grid[r][c + 1] === val) return false;
        }
    }
    return true;
}

function saveGame(isOver = false) {
    const gameState = {
        grid: grid,
        gridSize: gridSize,
        score: score,
        moveCount: moveCount,
        magicWands: magicWands,
        switchToolCount: switchToolCount,
        unlockedAnimals: Array.from(unlockedAnimals), // Set 必須轉成 Array
        hasWon2048: hasWon2048,
        hasWonSingularity: hasWonSingularity,
        eggPosition: eggPosition,
        over: isOver
    };
    localStorage.setItem("2048_save", JSON.stringify(gameState));
}

// Sound Synthesis
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSwipeSound() {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.1);
}

// Play merge sound with varied synthesis based on animal level
function playMergeSound(value) {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    
    if (value <= 8) { // 🐣, 🐰, 🦊 - Higher pitched "peep/squeak"
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + (Math.random() * 200), now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 0.1);
    } else if (value < 128) { // 🦌, 🐼, 🦓 - Mid range
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 0.2);
    } else if (value <= 2048) { // 🐊, 🦏, 🐘, 🦁, 🐉 - 128以上「溫暖音效」
        // 溫暖的合成音：使用多個 Sine/Triangle 疊加
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        // 基礎頻率隨等級略微降低，呈現厚實感
        const baseFreq = 220 * Math.pow(0.95, Math.log2(value / 128));
        
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // 五度音程增加豐富度
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    } else { // Mythical creatures - Warm & Ethereal
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine'; // 從 square 改為 sine 讓音色更溫暖
        
        const baseFreq = 110 * (Math.log2(value / 2048) + 1);
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.5); // 向上滑動增加神聖感
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);
    }
}

function playMagicSound() {
    if (!soundEnabled) return;
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// Overlay management
function showOverlay(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideOverlays() {
    document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
    }
});

// Swipe support
let touchStartX = 0;
let touchStartY = 0;
let isTouchInEncyclopedia = false;
let isTouchInBoard = false;

function isEncyclopediaExpanded() {
    const container = document.getElementById('encyclopedia-container');
    if (!container) return false;
    return !container.classList.contains('collapsed');
}

document.addEventListener('touchstart', (e) => {
    isTouchInEncyclopedia = isEncyclopediaExpanded() && !!e.target.closest('.encyclopedia-section');
    isTouchInBoard = !isTouchInEncyclopedia && !!e.target.closest('#game-board');
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (isTouchInBoard) e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (isTouchInEncyclopedia) {
        isTouchInEncyclopedia = false;
        isTouchInBoard = false;
        return;
    }
    isTouchInBoard = false;

    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
            move(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
        } else {
            move(dy > 0 ? 'ArrowDown' : 'ArrowUp');
        }
    }
}, { passive: false });

document.addEventListener('pointerdown', () => {
    const o = screen.orientation;
    if (o && typeof o.lock === 'function') {
        o.lock('portrait').catch(() => {});
    }
}, { once: true });


document.getElementById('restart-btn').addEventListener('click', () => {
    // 1. 先讀取現有的存檔
    const savedData = JSON.parse(localStorage.getItem("2048_save"));
    
    if (savedData) {
        // 2. 只把「遊戲結束」標記設為 true，並保留 unlockedAnimals
        savedData.over = true; 
        // 重新存回去，這樣 initGame 就不會讀取舊棋盤，但能讀到解鎖紀錄
        localStorage.setItem("2048_save", JSON.stringify(savedData));
    }

    // 3. 執行初始化
    initGame();
});
document.getElementById('retry-btn').addEventListener('click', () => {
    // 1. 先讀取現有的存檔
    const savedData = JSON.parse(localStorage.getItem("2048_save"));
    
    if (savedData) {
        // 2. 只把「遊戲結束」標記設為 true，並保留 unlockedAnimals
        savedData.over = true; 
        // 重新存回去，這樣 initGame 就不會讀取舊棋盤，但能讀到解鎖紀錄
        localStorage.setItem("2048_save", JSON.stringify(savedData));
    }

    // 3. 執行初始化
    hideOverlays();
    initGame();
});
document.getElementById('continue-btn').addEventListener('click', hideOverlays);
document.getElementById('expansion-continue-btn').addEventListener('click', hideOverlays);
document.getElementById('magic-wand-btn').addEventListener('click', useMagicWand);
document.getElementById('switch-tool-btn').addEventListener('click', useSwitchTool);
document.getElementById('restart-singularity-btn').addEventListener('click', () => {
    // 1. 先讀取現有的存檔
    const savedData = JSON.parse(localStorage.getItem("2048_save"));
    
    if (savedData) {
        // 2. 只把「遊戲結束」標記設為 true，並保留 unlockedAnimals
        savedData.over = true; 
        // 重新存回去，這樣 initGame 就不會讀取舊棋盤，但能讀到解鎖紀錄
        localStorage.setItem("2048_save", JSON.stringify(savedData));
    }

    // 3. 執行初始化
    initGame();
});
document.getElementById('restart-ultimate-btn').addEventListener('click', () => {
    localStorage.removeItem("2048_save");
    hideOverlays();
    initGame();
});

// Encyclopedia Toggle Logic
document.getElementById('encyclopedia-toggle').addEventListener('click', () => {
    const container = document.getElementById('encyclopedia-container');
    const header = document.getElementById('encyclopedia-toggle');
    container.classList.toggle('collapsed');
    header.classList.toggle('active');
});

// Settings Logic
function initSettings() {
    // Load saved settings
    const savedSound = localStorage.getItem('2048-sound');
    const savedAnim = localStorage.getItem('2048-animation');
    
    if (savedSound !== null) soundEnabled = savedSound === 'true';
    if (savedAnim !== null) animationsEnabled = savedAnim === 'true';
    
    // Update UI toggles
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('animation-toggle').checked = animationsEnabled;
    
    // Event Listeners
    document.getElementById('settings-btn').addEventListener('click', () => {
        showOverlay('settings-overlay');
    });
    
    document.getElementById('close-settings-btn').addEventListener('click', () => {
        hideOverlays();
    });

    const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
    if (backToLobbyBtn) {
        backToLobbyBtn.addEventListener('click', () => {
            location.href = 'index.html';
        });
    }
    
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        localStorage.setItem('2048-sound', soundEnabled);
    });
    
    document.getElementById('animation-toggle').addEventListener('change', (e) => {
        animationsEnabled = e.target.checked;
        localStorage.setItem('2048-animation', animationsEnabled);
        renderBoard(); // Re-render to apply/remove animation classes
    });
    
    document.getElementById('reset-current-game-btn').addEventListener('click', () => {
    if (confirm('確定要重置當局進度嗎？這將會重新開始目前這局遊戲。')) {
        // 1. 取得現有存檔
        const savedData = JSON.parse(localStorage.getItem("2048_save"));
        
        if (savedData) {
            // 2. 關鍵：標記這局已結束，但保留 unlockedAnimals (解鎖動物)
            savedData.over = true; 
            localStorage.setItem("2048_save", JSON.stringify(savedData));
        }

        // 3. 執行初始化
        hideOverlays();
        initGame(); // 這次進去後，因為 over 為 true，會自動跑「開新局」邏輯
    }
    });

    document.getElementById('reset-progress-btn').addEventListener('click', () => {
        if (confirm('確定要重置所有遊戲進度嗎？這將清除您的最高分、解鎖圖鑑與當前遊戲狀態，且無法復原。')) {
            localStorage.clear();
            location.reload();
        }
    });
}

// Start the game
initSettings();
initGame();
