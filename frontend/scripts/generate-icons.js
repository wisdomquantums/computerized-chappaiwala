import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const logoPath = path.join(publicDir, 'logo.png');
const iconsDir = path.join(publicDir, 'icons');

async function ensureSourceExists() {
    try {
        await fs.access(logoPath);
    } catch {
        throw new Error(`Logo not found at ${logoPath}. Add logo.png to the public directory.`);
    }
}

async function buildFavicons() {
    const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];

    await fs.mkdir(iconsDir, { recursive: true });

    const tasks = sizes.map((size) => {
        const fileName = `favicon-${size}x${size}.png`;
        const outputPath = path.join(iconsDir, fileName);
        return sharp(logoPath)
            .resize(size, size)
            .png({ compressionLevel: 9, adaptiveFiltering: true })
            .toFile(outputPath);
    });

    await Promise.all(tasks);
}

async function buildAppleTouchIcon() {
    const outputPath = path.join(publicDir, 'apple-touch-icon.png');
    await sharp(logoPath)
        .resize(180, 180)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
}

async function main() {
    try {
        await ensureSourceExists();
        await Promise.all([buildFavicons(), buildAppleTouchIcon()]);
        console.log('Favicon and touch icon set generated successfully.');
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}

main();
