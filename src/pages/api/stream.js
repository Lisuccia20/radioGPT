import ytstream from 'yt-stream';

export default async function handler(req, res) {
    const { id } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
    ytstream.setApiKey(apiKey);
    ytstream.setPreference('api');

    const agent = new ytstream.YTStreamAgent([], {
        localAddress: '127.0.0.53',
        keepAlive: true,
        keepAliveMsecs: 5000
    });

    agent.syncFile('./cookies.json');  // Ensure cookies.json exists and is valid
    ytstream.setGlobalAgent(agent);

    try {
        const stream = await ytstream.stream(`https://www.youtube.com/watch?v=${id}`, {
            quality: 'high',
            type: 'audio',  // Ensure 'audio' type is supported for your needs
            highWaterMark: 1048576 * 32,
            download: true
        });

        // Set the correct headers for audio streaming
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'inline');

        // Handle stream errors
        stream.stream.on('error', (err) => {
            console.error("Stream error:", err);
            res.status(500).json({ error: "Stream failed" });
        });

        // Pipe the stream to the response
        stream.stream.pipe(res);

    } catch (e) {
        console.error("Error streaming the video:", e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
}
