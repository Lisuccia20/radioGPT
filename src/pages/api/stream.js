import ytdl from '@distube/ytdl-core'

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        ytdl(`https://www.youtube.com/watch?v=${id}`).pipe(res);

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
