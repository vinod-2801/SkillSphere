const express = require('express');
const multer = require('multer');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'));
        }
    }
});

router.post('/parse', upload.single('resume'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF resume.'
            });
        }

        console.log('Resume received:', req.file.originalname);

        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(req.file.buffer)
        }).promise;

        let text = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();

            const pageText = content.items
                .map(item => item.str)
                .join(' ');

            text += pageText + '\n';
        }

        text = text.trim();

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'PDF uploaded, but no readable text was found.'
            });
        }

        console.log('Resume parsed successfully.');
        console.log('Pages:', pdf.numPages);
        console.log('Characters:', text.length);

        res.status(200).json({
            success: true,
            message: 'Resume PDF parsed successfully.',
            data: {
                text: text,
                fileName: req.file.originalname,
                pageCount: pdf.numPages
            }
        });

    } catch (error) {
        console.error('PDF parsing failed:', error);
        next(error);
    }
});

module.exports = router;