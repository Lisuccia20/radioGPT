import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';

export default async function handler(req, res) {
    const { id } = req.query;
    const cookiesPath = 'chrome';
    try{
        const ytDlp = new YTDlpWrap('ytp-dlp-stream/binary');
        let readableStream = ytDlp.execStream([
            `https://www.youtube.com/watch?v=${id}`,
            '-f',
            'best[ext=mp4]',
            `--cookies-from-browser=${cookiesPath}`
        ]);
        readableStream.pipe(res);
    }catch(e){
        console.log(e)
        res.status(500).json({e})
    }
}

