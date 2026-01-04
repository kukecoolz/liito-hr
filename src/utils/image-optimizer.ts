/**
 * Optimizes an image by resizing it and converting it to a compressed JPEG.
 * @param dataUrl The original image DataURL
 * @param maxWidth The maximum width of the optimized image
 * @param quality The JPEG quality (0 to 1)
 * @returns A promise that resolves to the optimized DataURL
 */
export async function optimizeImage(dataUrl: string, maxWidth = 300, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG with compression
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(optimizedDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = dataUrl;
    });
}
