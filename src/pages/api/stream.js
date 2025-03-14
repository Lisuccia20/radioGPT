import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';

export default async function handler(req, res) {
    const { id } = req.query;
    const cookiesPath = path.resolve('./cookies.firefox-private.txt');
    try{
        const ytDlp = new YTDlpWrap('ytp-dlp-stream/binary');
        let readableStream = ytDlp.execStream([
            `https://www.youtube.com/watch?v=${id}`,
            '-f',
            'best[ext=mp4]',
            `--cookies=AFmmF2swRQIhAOGfUjIVqkZO_WbushB8M1GwZEh686fD2eTaXzhLAaZDAiAwm8JxD2kWCeECFTlou0YQY6iaOHMzNj6O8gTCPnKmow:QUQ3MjNmeHkxMzBnSmdPZGZXRXNnOEhSRWFTM2Q2M3ZXR1RaYllOZm0xSUcwOHVId1kyejg4OFRxZ3BfQ3RYaU4tQUhQSmpMSmVNd3QwTWxkdkZwU1BjN2gzblNEN295Uzl4MUZUZFZpVjZCME9JWk1EdFIzYm1PNEpwYlRVRDUtcDRnYVZwc1RKWW9ySjh0SXhtNXpCMEY2d3VKbFBETkFB`
        ]);
        readableStream.pipe(res);
    }catch(e){
        console.log(e)
        res.status(500).json({e})
    }
}

