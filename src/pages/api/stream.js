import ytdl from '@distube/ytdl-core';
export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const url = `https://www.youtube.com/watch?v=${id}`;
        ytdl(url).pipe(res);
    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
