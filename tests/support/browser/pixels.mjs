// Decode browser screenshots in a page, without adding a Node PNG decoder.
// Points use fractional coordinates so device pixel ratio does not affect sampling.
export async function samplePixels(page, png, points) {
    return page.evaluate(async ({base64, points}) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);
        const context = canvas.getContext("2d", {willReadFrequently: true});
        context.drawImage(image, 0, 0);

        return points.map(([x, y]) => Array.from(context.getImageData(
            Math.floor(x * canvas.width), Math.floor(y * canvas.height), 1, 1
        ).data));
    }, {base64: png.toString("base64"), points});
}
