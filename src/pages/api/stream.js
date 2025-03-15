import { YtdlCore, toPipeableStream } from '@ybd-project/ytdl-core';
export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const ytdl = new YtdlCore({
            hl: 'en',
            gl: 'US',
            streamType: 'nodejs',
        });
        const url = `https://www.youtube.com/watch?v=${id}`;
        ytdl.download(url, { filter: "audioonly"}).then((stream) => toPipeableStream(stream).pipe(res));
    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
