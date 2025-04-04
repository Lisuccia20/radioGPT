import YTDlpWrap from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';
import spotiyt from 'spotify-to-ytmusic'

export default async function handler(req, res) {

    const { id } = req.query;

    try {
        let url = ''
        if(id.includes('spotify:')){
            const cleanId = id.replace('spotify:', '');
            const spoti = await spotiyt({
                clientID: '081ca37fe4774c3e9b62383103833991',
                clientSecret: process.env.CLIENT_SECRET,
            });

            url = await spoti(cleanId)

        }else{
            url = `https://www.youtube.com/watch?v=${id}`;
        }
        const ytDlpWrap = new YTDlpWrap('./yt-dlp');


        // Path to the original cookies file
        const originalCookiesPath = path.resolve('www.youtube.com_cookies.txt');

        // Verify the cookies file exists
        if (!fs.existsSync(originalCookiesPath)) {
            throw new Error('Cookies file not found');
        }

        // Create a copy of the cookies file
        const cookiesCopyPath = path.resolve('cookies_copy.txt');
        try {
            fs.copyFileSync(originalCookiesPath, cookiesCopyPath);
        } catch (err) {
            throw new Error(`Failed to copy cookies file: ${err.message}`);
        }

        // Path to the custom headers file
        const headersPath = path.resolve('custom_headers.txt');

        // Create a custom headers file
        const customHeaders = 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:112.0) Gecko/20100101 Chrome/112.0.5615.49 Safari/537.36';
        try {
            fs.writeFileSync(headersPath, customHeaders);
        } catch (err) {
            throw new Error(`Failed to write headers file: ${err.message}`);
        }

        // Execute the stream with yt-dlp
        let readableStream = ytDlpWrap.execStream([
            url,
            '--cookies-from-browser', 'chrome',
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
