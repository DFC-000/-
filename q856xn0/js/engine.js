import { getIntersection, getAngle } from './utils.js';

function getLightPolygon(light, boundaries) {
    const uniquePoints = [];
    const seenPoints = new Set();

    boundaries.forEach(wall => {
        const p1Key = `${wall.a.x},${wall.a.y}`;
        const p2Key = `${wall.b.x},${wall.b.y}`;
        if (!seenPoints.has(p1Key)) {
            uniquePoints.push(wall.a);
            seenPoints.add(p1Key);
        }
        if (!seenPoints.has(p2Key)) {
            uniquePoints.push(wall.b);
            seenPoints.add(p2Key);
        }
    });

    const rays = [];
    uniquePoints.forEach(point => {
        const angle = getAngle(light, point);
        rays.push({ angle: angle - 0.0001, point });
        rays.push({ angle: angle, point });
        rays.push({ angle: angle + 0.0001, point });
    });

    const intersectionPoints = [];
    rays.forEach(ray => {
        const dirX = Math.cos(ray.angle);
        const dirY = Math.sin(ray.angle);

        let closestIntersection = null;
        let minDistance = Infinity;

        boundaries.forEach(wall => {
            const intersection = getIntersection(
                light,
                { x: light.x + dirX, y: light.y + dirY },
                wall.a,
                wall.b
            );

            if (intersection) {
                const dx = light.x - intersection.x;
                const dy = light.y - intersection.y;
                const distance = dx * dx + dy * dy;

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIntersection = intersection;
                }
            }
        });

        if (closestIntersection) {
            closestIntersection.angle = ray.angle;
            intersectionPoints.push(closestIntersection);
        }
    });

    intersectionPoints.sort((a, b) => a.angle - b.angle);

    return intersectionPoints;
}

function drawScene(ctx, light, walls, lightPolygon, player, sentinels, isPlayerDetected, interactables = []) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    if (light && lightPolygon.length > 0) {
        ctx.beginPath();
        ctx.moveTo(lightPolygon[0].x, lightPolygon[0].y);
        for (let i = 1; i < lightPolygon.length; i++) {
            ctx.lineTo(lightPolygon[i].x, lightPolygon[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 254, 255, 0.9)';
        ctx.fill();
    }
    
    if (sentinels) {
        sentinels.forEach(s => s.draw(ctx));
    }
    
    if (interactables) {
        interactables.forEach(item => item.draw(ctx));
    }

    if (player) {
        player.draw(ctx);
    }

    ctx.strokeStyle = 'var(--color-wall-stroke)';
    ctx.fillStyle = 'var(--color-wall)';
    ctx.lineWidth = 2;
    walls.forEach(wall => {
        ctx.beginPath();
        ctx.moveTo(wall.a.x, wall.a.y);
        ctx.lineTo(wall.b.x, wall.b.y);
    });

    const drawnBoxes = new Set();
    walls.forEach(wall => {

        const key = `${Math.min(wall.a.x, wall.b.x)},${Math.min(wall.a.y, wall.b.y)}`;
        if(!drawnBoxes.has(key)) {
             const x = Math.min(wall.a.x, wall.b.x);
             const y = Math.min(wall.a.y, wall.b.y);
             const w = Math.abs(wall.a.x - wall.b.x);
             const h = Math.abs(wall.a.y - wall.b.y);

             const width = w > h ? w : Math.abs(walls.find(w_ => w_.a.x === x && w_.b.x === x).a.y - walls.find(w_ => w_.a.x === x && w_.b.x === x).b.y);
             const height = h > w ? h : Math.abs(walls.find(w_ => w_.a.y === y && w_.b.y === y).a.x - walls.find(w_ => w_.a.y === y && w_.b.y === y).b.x);
             
             ctx.fillRect(x, y, w, h);
             ctx.strokeRect(x,y,w,h);
             drawnBoxes.add(key);
        }
    });


    const boxSet = new Set();
    walls.forEach(wall => {
        boxSet.add(JSON.stringify([wall.a, wall.b].sort()));
    });
    

    ctx.strokeStyle = 'var(--color-wall)';
    ctx.lineWidth = 5;
    walls.forEach(wall => {
        ctx.beginPath();
        ctx.moveTo(wall.a.x, wall.a.y);
        ctx.lineTo(wall.b.x, wall.b.y);
        ctx.stroke();
    });

    if (isPlayerDetected) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
    }
}

export { getLightPolygon, drawScene };
