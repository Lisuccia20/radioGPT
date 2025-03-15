import YTDlpWrap from 'yt-dlp-wrap';
export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const ytDlpWrap = new YTDlpWrap('ytp-dlp-stream/binary');
        const url = `https://www.youtube.com/watch?v=${id}`;
        let readableStream = ytDlpWrap.execStream([
            url,
            '-f',
            'best[ext=mp4]',
            '--cookies-from-browser',
            'chrome'
        ]);
        readableStream.pipe(res);
    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
