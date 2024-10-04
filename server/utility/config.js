import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

function createAccessLogStream(logsFolderPath) {
    const accessLogFilePath = path.join(logsFolderPath, 'access.log');
    return fs.createWriteStream(accessLogFilePath, { flags: 'a' });
}

const imageGenerationFolder = path.join(__dirname, '..', 'image-generation'); // Go one step back
createFolderIfNotExists(imageGenerationFolder);

const logsFolderPath = path.join(__dirname, '..', 'logs'); // Go one step back
createFolderIfNotExists(logsFolderPath);

const accessLogStream = createAccessLogStream(logsFolderPath);

export { accessLogStream };
