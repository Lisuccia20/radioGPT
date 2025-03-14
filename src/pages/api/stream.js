import ytdl from '@distube/ytdl-core'
import {HttpsProxyAgent} from 'https-proxy-agent';
import * as fs from "node:fs";
export default async function handler(req, res) {
    const { id } = req.query;
    const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json", 'utf8')));
    try {


        ytdl(`https://www.youtube.com/watch?v=${id}`, {
            agent: agent
        }).pipe(res);

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
