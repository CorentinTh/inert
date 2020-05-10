const drawRoundedSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, sides: number, radius: number) => {
    const factor = 2 * Math.PI / sides;

    ctx.beginPath();
    ctx.moveTo(x + radius * Math.cos(0), y);

    for (let i = 1; i <= sides; ++i) {
        ctx.lineTo(x + radius * Math.cos(i * factor), y + radius * Math.sin(i * factor));
    }

    ctx.closePath();

}

export {
    drawRoundedSquare,
    drawPolygon
}