import axios from "axios";




function iso8601ToSeconds(isoDuration) {
    const regex = /P(?:([\d.]+)Y)?(?:([\d.]+)M)?(?:([\d.]+)D)?(?:T(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?)?/;
    const matches = regex.exec(isoDuration);

    const years = parseFloat(matches[1] || 0);
    const months = parseFloat(matches[2] || 0);
    const days = parseFloat(matches[3] || 0);
    const hours = parseFloat(matches[4] || 0);
    const minutes = parseFloat(matches[5] || 0);
    const seconds = parseFloat(matches[6] || 0);

    // Convert everything to seconds
    const totalSeconds =
        seconds +
        minutes * 60 +
        hours * 3600 +
        days * 86400 +
        months * 2628000 + // approx. 30.44 days per month
        years * 31536000;  // approx. 365.25 days per year

    return totalSeconds;
}



export default async function handler(req, res) {
    const { query } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const url = new URL(query);
    const playlistId = url.searchParams.get("list");

    // Fetch playlist songs
    const playlistSongs = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
            key: apiKey,
            part: 'snippet',
            playlistId: playlistId,
            maxResults: 100,
        }
    });

    const songsIds = [];
    const songsNames = [];
    playlistSongs.data.items.forEach((item) => {
        songsIds.push(item.snippet.resourceId.videoId);
        songsNames.push(`${item.snippet.title} - ${item.snippet.videoOwnerChannelTitle}`);
    });

    const randomIndex = Math.floor(Math.random() * songsIds.length);
    const randomSongId = songsIds[randomIndex];

    const data = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
            key: apiKey,
            part: 'contentDetails',
            id: randomSongId,
        }
    })
    console.log(data)

    res.status(200).json({
        id: randomSongId,
        filename: songsNames[randomIndex],
        duration: iso8601ToSeconds(data.data.items[0].contentDetails.duration),
        data: data.data.items[0]
    })
}

