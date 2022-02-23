#!/usr/bin/env node
'use strict';

const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');
const path = require('path');
const fs = require('fs');
 
const parser = new ArgumentParser({
    description: 'Photo Classifier'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-p', '--photo-dir', { type: 'str', help: 'photo directory', required: true });

const args = parser.parse_args();

if (!fs.existsSync(args.photo_dir) || !fs.lstatSync(args.photo_dir).isDirectory()) {
    console.error('Please enter folder name in Pictures');
    return;
}

const classifiedSubDirs = ['video', 'captured', 'duplicated'];
for (const classifiedSubDir of classifiedSubDirs) {
    const subDir = path.join(args.photo_dir, classifiedSubDir);
    if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir);
    }
}

fs.promises.readdir(args.photo_dir)
    .then(processFiles)
    .catch(console.error);

function processFiles(files) {
    files.forEach((file) => {
        let subDir = null;
        if (file.endsWith('.mp4') || file.endsWith('.mov')) {
            subDir = 'video';
        }
        else if (file.endsWith('.png') || file.endsWith('.aae')) {
            subDir = 'captured';
        }
        else if (isDuplicatedFile(files, file)) {
            subDir = 'duplicated';
        }

        if (subDir) {
            console.info(`move ${file} to ${subDir}`);
            const oldPath = path.join(args.photo_dir, file);
            const newPath = path.join(args.photo_dir, subDir, file);
            fs.promises.rename(oldPath, newPath)
                .catch(console.error);        
        }
    })
}

function isDuplicatedFile(files, file) {
    // IMG_XXXX  -> IMG_EXXX
    if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
        return false;
    }    
    
    const edited = `IMG_E${file.split('_')[1]}`;
    const found = files.find((f) => f.includes(edited));
    return !!found;
}    
