import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';

export default async function handler(req, res) {
    const { id } = req.query;
    const cookiesPath = path.resolve(__dirname, 'cookies.firefox-private.txt');
    try{
        const ytDlp = new YTDlpWrap('ytp-dlp-stream/binary');
        let readableStream = ytDlp.execStream([
            `https://www.youtube.com/watch?v=${id}`,
            '-f',
            'best[ext=mp4]',
            `--cookies=${cookiesPath}`
        ]);
        readableStream.pipe(res);
    }catch(e){
        console.log(e)
        res.status(500).json({e})
    }
}

