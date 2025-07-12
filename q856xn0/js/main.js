import { levelData } from './data.js';
import { getLightPolygon, drawScene } from './engine.js';
import { player } from './player.js';
import { isPointInPolygon } from './utils.js';
import { Sentinel } from './enemy.js';
import { LightSwitch } from './interactables.js';
import { loadSounds, playBackgroundMusic, playFootstep, playSwitchClick, playAlert } from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const statusUI = document.getElementById('status-ui');
const detectionUI = document.getElementById('detection-ui');

player.x = levelData.playerStart.x;
player.y = levelData.playerStart.y;

const lightSources = levelData.lightSources;
let light = lightSources.length > 0 ? lightSources[0] : null;

const sentinels = levelData.sentinels.map(s =>
    new Sentinel(s.x, s.y, s.direction, s.fov, s.radius)
);

const lightSwitch = new LightSwitch(
    levelData.lightSwitch.x,
    levelData.lightSwitch.y,
    levelData.lightSwitch.width,
    levelData.lightSwitch.height,
    levelData.lightSwitch.isOn
);

const keysPressed = {};
const interactionKeyState = { e: false };
let boundaries = [];
let wasDetectedLastFrame = false;
const INTERACTION_RADIUS = 40;
let hasInteracted = false;

function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = document.body.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const { width, height } = canvas.getBoundingClientRect();
    boundaries = [
        ...levelData.walls,
        { a: { x: 0, y: 0 }, b: { x: width, y: 0 } },
        { a: { x: width, y: 0 }, b: { x: width, y: height } },
        { a: { x: width, y: height }, b: { x: 0, y: height } },
        { a: { x: 0, y: height }, b: { x: 0, y: 0 } },
    ];
}

window.addEventListener('keydown', (e) => {
    if (!hasInteracted) {
        playBackgroundMusic();
        hasInteracted = true;
    }

    const key = e.key.toLowerCase();
    keysPressed[key] = true;

    if (key === 'e' && !interactionKeyState.e) {
        interactionKeyState.e = true;
        const dx = player.x - (lightSwitch.x + lightSwitch.width / 2);
        const dy = player.y - (lightSwitch.y + lightSwitch.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INTERACTION_RADIUS) {
            lightSwitch.toggle();
            playSwitchClick();
        }
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keysPressed[key] = false;

    if (key === 'e') {
        interactionKeyState.e = false;
    }
});

function checkPlayerMovement() {
    if (keysPressed['w'] || keysPressed['a'] || keysPressed['s'] || keysPressed['d']) {
        playFootstep();
    }
}

function updateUI(isPlayerVisible, isPlayerDetected) {
    if (isPlayerVisible) {
        statusUI.textContent = 'EXPOSED';
        statusUI.className = 'status-exposed';
    } else {
        statusUI.textContent = 'HIDDEN';
        statusUI.className = 'status-hidden';
    }

    if (isPlayerDetected) {
        detectionUI.classList.remove('hidden');
    } else {
        detectionUI.classList.add('hidden');
    }
}

function gameLoop() {
    player.update(boundaries, keysPressed);

    checkPlayerMovement();

    const activeLight = lightSwitch.isOn ? light : null;
    const lightPolygon = activeLight ? getLightPolygon(activeLight, boundaries) : [];

    const playerPos = { x: player.x, y: player.y };
    player.isVisible = activeLight ? isPointInPolygon(playerPos, lightPolygon) : false;

    let isPlayerDetected = false;
    for (const sentinel of sentinels) {
        if (sentinel.detect(player)) {
            isPlayerDetected = true;
            break;
        }
    }

    if (isPlayerDetected && !wasDetectedLastFrame) {
        playAlert();
    }
    wasDetectedLastFrame = isPlayerDetected;

    updateUI(player.isVisible, isPlayerDetected);

    drawScene(ctx, activeLight, levelData.walls, lightPolygon, player, sentinels, isPlayerDetected, [lightSwitch]);
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', setupCanvas);

const rootStyles = getComputedStyle(document.documentElement);
ctx.canvas.style.setProperty('--color-primary-base', rootStyles.getPropertyValue('--color-primary-base').trim());
ctx.canvas.style.setProperty('--color-shadow', rootStyles.getPropertyValue('--color-shadow').trim());
ctx.canvas.style.setProperty('--color-accent-cyan', rootStyles.getPropertyValue('--color-accent-cyan').trim());
ctx.canvas.style.setProperty('--color-wall', rootStyles.getPropertyValue('--color-wall').trim());
ctx.canvas.style.setProperty('--color-wall-stroke', rootStyles.getPropertyValue('--color-wall-stroke').trim());

loadSounds();
setupCanvas();
gameLoop();
