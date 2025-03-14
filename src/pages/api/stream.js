import YTDlpWrap from 'yt-dlp-wrap';
import { Readable } from 'stream';
import stream from 'youtube-audio-stream'

export default async function handler(req, res) {
    const { id } = req.query;

    try{
        const ytDlp = new YTDlpWrap('ytp-dlp-stream/binary');
        let readableStream = ytDlp.execStream([
            `https://www.youtube.com/watch?v=${id}`,
            '-f',
            'best[ext=mp4]',
        ]);
        readableStream.pipe(res);
    }catch(e){
        console.log(e)
        res.status(500).json({e})
    }




}

