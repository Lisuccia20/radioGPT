import ytdl from '@distube/ytdl-core';
import axios from "axios";

export default async function handler(req, res) {
    const { id } = req.query;

    try{
        const audio = ytdl(`http://www.youtube.com/watch?v=${id}`, {
            quality: 'highestaudio',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        audio.pipe(res)
    }catch(e){
        res.status(500).json(e)
    }




}

