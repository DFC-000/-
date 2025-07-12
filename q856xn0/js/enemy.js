class Sentinel {
    constructor(x, y, orientation, coneAngle, range) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.coneAngle = coneAngle;
        this.range = range;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const startAngle = this.orientation - this.coneAngle / 2;
        const endAngle = this.orientation + this.coneAngle / 2;
        ctx.arc(this.x, this.y, this.range, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

    detect(player) {
        if (!player.isVisible) {
            return false;
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.range || distance === 0) {
            return false;
        }

        const orientationVecX = Math.cos(this.orientation);
        const orientationVecY = Math.sin(this.orientation);

        const toPlayerVecX = dx / distance;
        const toPlayerVecY = dy / distance;

        const dotProduct = orientationVecX * toPlayerVecX + orientationVecY * toPlayerVecY;

        const halfConeAngle = this.coneAngle / 2;

        if (dotProduct > Math.cos(halfConeAngle)) {
            return true;
        }

        return false;
    }
}

export { Sentinel };
