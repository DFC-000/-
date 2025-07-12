function lineCircleCollision(p1, p2, circle) {
    const len_sq = (p2.x - p1.x)**2 + (p2.y - p1.y)**2;
    if (len_sq === 0.0) return false;

    let t = ((circle.x - p1.x) * (p2.x - p1.x) + (circle.y - p1.y) * (p2.y - p1.y)) / len_sq;
    t = Math.max(0, Math.min(1, t));

    const closestX = p1.x + t * (p2.x - p1.x);
    const closestY = p1.y + t * (p2.y - p1.y);

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance_sq = dx**2 + dy**2;

    return distance_sq < circle.radius**2;
}

const player = {
    x: 300,
    y: 300,
    radius: 8,
    speed: 3,
    isVisible: false,

    draw(ctx) {
        ctx.fillStyle = this.isVisible ? '#FFFFFF' : '#555555';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    },

    update(walls, keys) {
        let dx = 0;
        let dy = 0;

        if (keys['w'] || keys['ArrowUp']) dy = -1;
        if (keys['s'] || keys['ArrowDown']) dy = 1;
        if (keys['a'] || keys['ArrowLeft']) dx = -1;
        if (keys['d'] || keys['ArrowRight']) dx = 1;

        let moveX = 0;
        let moveY = 0;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            moveX = (dx / length) * this.speed;
            moveY = (dy / length) * this.speed;
        } else {
            moveX = dx * this.speed;
            moveY = dy * this.speed;
        }
        
        const potentialX = this.x + moveX;
        const projectedCircleX = { x: potentialX, y: this.y, radius: this.radius };
        let canMoveX = true;
        for (const wall of walls) {
            if (lineCircleCollision(wall.a, wall.b, projectedCircleX)) {
                canMoveX = false;
                break;
            }
        }
        if (canMoveX) {
            this.x = potentialX;
        }
        
        const potentialY = this.y + moveY;
        const projectedCircleY = { x: this.x, y: potentialY, radius: this.radius };
        let canMoveY = true;
        for (const wall of walls) {
            if (lineCircleCollision(wall.a, wall.b, projectedCircleY)) {
                canMoveY = false;
                break;
            }
        }
        if (canMoveY) {
            this.y = potentialY;
        }
    }
};

export { player };
