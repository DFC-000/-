function createBox(x, y, width, height) {
    return [
        { a: { x, y }, b: { x: x + width, y } },
        { a: { x: x + width, y }, b: { x: x + width, y: y + height } },
        { a: { x: x + width, y: y + height }, b: { x, y: y + height } },
        { a: { x, y: y + height }, b: { x, y } },
    ];
}

const walls = [];

walls.push(...createBox(400, 400, 1120, 50)); 
walls.push(...createBox(400, 690, 1120, 50)); 

walls.push(...createBox(100, 800, 50, 150)); 
walls.push(...createBox(100, 800, 200, 50));

const levelData = {
    playerStart: { x: 200, y: 950 },
    lightSources: [
        { x: 960, y: 250 }
    ],
    lightSwitch: {
        x: 160, 
        y: 900, 
        width: 15, 
        height: 25, 
        isOn: true
    },
    sentinels: [
        { x: 960, y: 540, direction: Math.PI / 2, fov: Math.PI / 2.5, radius: 500 }
    ],
    walls: walls
};

export { levelData };
