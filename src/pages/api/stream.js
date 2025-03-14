import ytdl from '@distube/ytdl-core'
import fs from 'fs';
export default async function handler(req, res) {
    const { id } = req.query;

    const options = {
        filter: 'audioonly',
        quality: 'highestaudio',
        dl_priority: 1,
        highWaterMark: 1 << 25, // 32MB
        // You can add custom headers to simulate a legitimate user (optional)
        requestOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }
    };

    try {
        const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json")));
        ytdl(`https://www.youtube.com/watch?v=${id}`,options).pipe(res);

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
