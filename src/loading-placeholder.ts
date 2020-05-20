function pointyHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(175, 18, 98, 0.25)'
    for (let i = 0; i < 6; i++) {
        const angleRad = ((60 * i - 30) * Math.PI) / 180
        ctx.lineTo(cx + size * Math.cos(angleRad), cy + size * Math.sin(angleRad))
    }
    ctx.closePath()
    ctx.stroke()
}

const loadingPlaceholder = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(100, 100, 100, 1)'
    const size = width / 10
    ctx.font = `${size}px Roboto, sans-serif`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Loading...', width / 2, height / 2)
    ctx.lineWidth = size / 10
    pointyHex(ctx, width / 2, height / 2, size / 2)
}

export default loadingPlaceholder
