import YTDlpWrap from 'yt-dlp-wrap';
import { Readable } from 'stream';
import stream from 'youtube-audio-stream'

export default async function handler(req, res) {
    const { id } = req.query;

    try{
        let githubReleasesData = await YTDlpWrap.getGithubReleases(1, 5);

        await YTDlpWrap.downloadFromGithub(
            'ytp-dlp-stream/binary',
            '2025.02.19',
            'linux'
        );


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

