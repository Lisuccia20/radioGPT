
import ytstream from 'yt-stream';


export default async function handler(req, res) {
    const { id } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
    ytstream.setApiKey(apiKey);
    ytstream.setPreference('api', 'ANDROID');

    const agent = new ytstream.YTStreamAgent([], {
        localAddress: '127.0.0.1',
        keepAlive: true,
        keepAliveMsecs: 5e3
    });

    agent.syncFile('./cookies.json')

    ytstream.setGlobalAgent(agent);



    try{
        const stream = await ytstream.stream(`http://www.youtube.com/watch?v=${id}`, {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        });
        stream.stream.pipe(res);
    }catch(e){
        console.log(e)
        res.status(500).json({e})
    }
}

