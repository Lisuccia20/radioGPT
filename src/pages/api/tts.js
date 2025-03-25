import { gTTS } from "simple-gtts";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        const { text, language } = req.body;

        if (!text || !language) {
            return res.status(400).json({ error: "Text and language are required." });
        }

        const filePath = path.join(process.cwd(), 'gpt.mp3');

        // Generate the speech and save it to a file
        await gTTS(text, {
            lang: language,
            path: filePath,
        });

        // Set headers to indicate the response contains an MP3 file
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", "attachment; filename=gpt.mp3");

        // Read the file and send it as a response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error("Error streaming file:", err);
            res.status(500).json({ error: 'Error streaming file' });
        });

    } catch (error) {
        console.error("Error during the text-to-speech process:", error);
        res.status(500).json({ error: "Failed to generate speech" });
    }
}
