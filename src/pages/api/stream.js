import YTDlpWrap from 'yt-dlp-wrap';

export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const ytDlpWrap = new YTDlpWrap('ytp-dlp-stream/binary');
        const url = `https://www.youtube.com/watch?v=${id}`;

        // Custom headers (User-Agent for Chrome on Ubuntu)
        const customHeaders = 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:112.0) Gecko/20100101 Chrome/112.0.5615.49 Safari/537.36';

        // Path to the exported cookies file (change this to the correct path)
        const cookiesPath = 'youtube_cookies.txt';

        // Execute the stream with yt-dlp and pass the custom headers and cookies
        let readableStream = ytDlpWrap.execStream([
            url,
            '-f', 'best[ext=mp4]',  // Get the best mp4 format
            '--cookies-from-browser', 'chrome',
            '--cookies', 'cookies.txt',// Specify the cookies file
            '--add-headers', customHeaders  // Use custom User-Agent header
        ]);

        // Pipe the stream to the response
        readableStream.pipe(res);
    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
