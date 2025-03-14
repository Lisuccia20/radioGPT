import ytdl from '@distube/ytdl-core'
import fs from 'fs';
export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json")));
        ytdl(`https://www.youtube.com/watch?v=${id}`,{agent}).pipe(res);

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
