

/**
 * Expects a color in rgb/rgba format and returns either "black" or "white" depending on the luminance of the color.
 * Note: for transparent colors (100% transparent), this function assumes that the background is white.
 **/
export function getContrastColor(color) {
    const rgbValues = color.match(/\d+/g) // Extract RGB values
    const r = parseInt(rgbValues[0])
    const g = parseInt(rgbValues[1])
    const b = parseInt(rgbValues[2])
    const a = rgbValues[3] && parseInt(rgbValues[3])
    
    // This assumes that the background is always white if this background is transparent
    if (a === 0)
        return "black"
    
    // Calculate luminance
    const luminance = ((0.299 * r + 0.587 * g + 0.114 * b) / 255)

    // Set the font color based on the luminance
    if (luminance > 0.5) {
        return "black" // Use black for lighter backgrounds
    } else {
        return "white" // Use white for dark backgrounds
    }
}
