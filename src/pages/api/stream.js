import YTDlpWrap from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const ytDlpWrap = new YTDlpWrap('ytp-dlp-stream/binary');
        const url = `https://www.youtube.com/watch?v=${id}`;

        // Path to the cookies file
        const cookiesPath = path.resolve('www.youtube.com_cookies.txt');

        // Verify the cookies file exists
        if (!fs.existsSync(cookiesPath)) {
            throw new Error('Cookies file not found');
        }

        // Path to the custom headers file
        const headersPath = path.resolve('custom_headers.txt');

        // Create a custom headers file
        const customHeaders = 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:112.0) Gecko/20100101 Chrome/112.0.5615.49 Safari/537.36';

        // Execute the stream with yt-dlp
        let readableStream = ytDlpWrap.execStream([
            url,
            '-f', 'best[ext=mp4]',  // Get the best mp4 format
            '--cookies', cookiesPath,
            '--add-headers', customHeaders  // Use custom headers file
        ]);

        // Set response headers
        res.setHeader('Content-Type', 'video/mp4');

        // Pipe the stream to the response
        readableStream.pipe(res);

        // Handle stream errors
        readableStream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(500).json({ error: 'Stream error' });
        });

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}