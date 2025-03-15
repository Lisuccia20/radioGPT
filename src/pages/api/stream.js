import youtubedl from 'youtube-dl-exec'
export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const url = `https://www.youtube.com/watch?v=${id}`;
        const process = await youtubedl(url, {
            format: 'bestaudio/best',
            output: '-', // Output to stdout
            extractAudio: true,
            audioFormat: 'mp3',
        }, { stdio: ['ignore', 'pipe', 'pipe'] });
        process.pipe(res);
    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
