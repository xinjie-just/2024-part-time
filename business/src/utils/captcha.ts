interface ImageTextOptions {
  source: string
  charCount: number
  spacing: number
  textFont: string
  textColor: string
  bgColor: string
}

function generateRandomString(source: string, charCount: number): string {
  const chars = Array.from({ length: charCount }, () => {
    const index = Math.floor(Math.random() * source.length)
    return source[index]
  })
  return chars.join('')
}

export const drawTextOnCanvas = (canvas: HTMLCanvasElement, options: ImageTextOptions) => {
  console.log('canvas', canvas)
  console.log('options', options)

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // 填充背景色
  ctx.fillStyle = options.bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 文本字体和颜色
  ctx.font = options.textFont
  ctx.fillStyle = options.textColor

  // 计算文本起始位置和间隔
  const textWidth = ctx.measureText(options.source.charAt(0)).width
  let x =
    (canvas.width - (textWidth * options.charCount + options.spacing * (options.charCount - 1))) / 2
  let y = canvas.height / 1.4

  let randomText = ''

  // 绘制每个字符并应用随机旋转
  for (let i = 0; i < options.charCount; i++) {
    const angle = Math.random() * 60 - 30 // -45deg 到 45deg
    ctx.save() // 保存当前画布状态
    ctx.translate(x + i * (textWidth + options.spacing), y) // 移动到字符位置
    ctx.rotate((angle * Math.PI) / 180) // 旋转画布
    const char = options.source.charAt(Math.floor(Math.random() * options.source.length))
    randomText += char
    ctx.fillText(char, 0, 0) // 绘制字符
    ctx.restore() // 恢复画布状态
  }
  return randomText
}
