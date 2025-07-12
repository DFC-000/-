class LightSwitch {
    constructor(x, y, width, height, isOn = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isOn = isOn;
    }

    draw(ctx) {
        if (this.isOn) {
            ctx.fillStyle = 'rgba(255, 255, 0, 1)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        } else {
            ctx.fillStyle = 'rgba(100, 100, 100, 1)';
            ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
        }
        ctx.lineWidth = 2;
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    toggle() {
        this.isOn = !this.isOn;
    }
}

export { LightSwitch };
