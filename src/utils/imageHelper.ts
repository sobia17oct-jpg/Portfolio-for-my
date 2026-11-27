export interface CompressedImageResult {
  dataUrl: string;
  wasCompressed: boolean;
  sizeKB: number;
}

const MAX_DIMENSION = 1200;
const MAX_DATA_URL_BYTES = 950_000; // ~950 KB ceiling per image for safe localStorage persistence

export async function processUploadedImage(
  file: File
): Promise<CompressedImageResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (PNG, JPG, or WebP).');
  }

  const rawDataUrl = await readFileAsDataUrl(file);

  // If it's a small SVG or already lightweight image (< 220 KB), keep crisp original
  if (file.type === 'image/svg+xml' || rawDataUrl.length < 280_000) {
    return {
      dataUrl: rawDataUrl,
      wasCompressed: false,
      sizeKB: Math.round((rawDataUrl.length * 0.75) / 1024),
    };
  }

  const img = await loadImage(rawDataUrl);
  const { width, height } = fitDimensions(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    MAX_DIMENSION
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Image processing is not supported in this browser.');
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Try progressive JPEG qualities to stay comfortably within localStorage limits
  const qualities = [0.82, 0.68, 0.54, 0.42];
  let bestUrl = canvas.toDataURL('image/jpeg', qualities[0]);

  for (const q of qualities) {
    bestUrl = canvas.toDataURL('image/jpeg', q);
    if (bestUrl.length <= MAX_DATA_URL_BYTES) {
      break;
    }
  }

  if (bestUrl.length > MAX_DATA_URL_BYTES) {
    // Final downscale pass if image is extraordinarily dense
    const smallCanvas = document.createElement('canvas');
    const smallDims = fitDimensions(width, height, 800);
    smallCanvas.width = smallDims.width;
    smallCanvas.height = smallDims.height;
    const smallCtx = smallCanvas.getContext('2d');
    if (smallCtx) {
      smallCtx.fillStyle = '#FFFFFF';
      smallCtx.fillRect(0, 0, smallDims.width, smallDims.height);
      smallCtx.drawImage(canvas, 0, 0, smallDims.width, smallDims.height);
      bestUrl = smallCanvas.toDataURL('image/jpeg', 0.65);
    }
  }

  if (bestUrl.length > 1_400_000) {
    throw new Error(
      'Even after compression this image is too large for browser localStorage. Try a smaller image or paste an image URL.'
    );
  }

  return {
    dataUrl: bestUrl,
    wasCompressed: true,
    sizeKB: Math.round((bestUrl.length * 0.75) / 1024),
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read the selected image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode the selected image.'));
    img.src = src;
  });
}

function fitDimensions(
  srcWidth: number,
  srcHeight: number,
  maxDim: number
): { width: number; height: number } {
  if (srcWidth <= maxDim && srcHeight <= maxDim) {
    return { width: srcWidth, height: srcHeight };
  }
  const ratio = Math.min(maxDim / srcWidth, maxDim / srcHeight);
  return {
    width: Math.max(1, Math.round(srcWidth * ratio)),
    height: Math.max(1, Math.round(srcHeight * ratio)),
  };
}
