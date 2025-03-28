import play from 'play-dl';
import ytstream from 'yt-stream';
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[randomIndex]
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

export default async function handler(req, res) {
    try {
        const { query } = req.query;

        const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing' });
        }

        if (query.includes('spotify')) {
            try {

                if (play.is_expired()) {
                    await play.refreshToken() // This will check if access token has expired or not. If yes, then refresh the token.
                }


                const sp_data = await play.spotify(query);
                const tracks = await sp_data.all_tracks();
                const details = []
                for (const song of tracks) {
                    details.push({
                        title: song.name,
                        id: `spotify:${song.url}`,
                        duration: song.durationInSec,
                        author: song.artists[0].name,
                        image: {
                            url: song.thumbnail.url
                        },
                    })
                }
                const shuffledDetails = shuffleArray(details);
                res.status(200).json(shuffledDetails);

                //
                // const playlistSongs = await getData(query, {
                //     headers: {
                //         'user-agent': 'googlebot'
                //     }
                // });
                //
                // const trackList = playlistSongs.trackList;


            } catch (error) {
                console.error('Error fetching playlist songs:', error);
                res.status(500).json({ error: error.message });
            }
        }

        // const url = new URL(query);
        // const playlistId = url.searchParams.get("list");
        ytstream.setPreference('scrape');
        const playlistSongs = await ytstream.getPlaylist(query);
        // Fetch playlist songs
        const songs = playlistSongs.videos;
        const details = []
        songs.forEach(song => {
            details.push({
                title: song.title,
                id: song.video_id,
                duration: song.length,
                author: song.channel.author,
                image: song.thumbnails[3],
            })
        })
        const shuffledDetails = shuffleArray(details);
        res.status(200).json(shuffledDetails);

        //
        //
        // console.log(playlistSongs);
        //
        // if (!playlistSongs.data.items || playlistSongs.data.items.length === 0) {
        //     return res.status(404).json({ error: 'No songs found in this playlist' });
        // }
        //
        // // Using Promise.all for better performance
        // const songs = await Promise.all(playlistSongs.data.items.map(async (item) => {
        //     try {
        //         const videoDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        //             params: {
        //                 key: apiKey,
        //                 part: 'contentDetails',
        //                 id: item.snippet.resourceId.videoId,
        //             }
        //         });
        //
        //         const imageDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        //             params: {
        //                 key: apiKey,
        //                 part: 'snippet',
        //                 id: item.snippet.resourceId.videoId,
        //             }
        //         });
        //
        //         return {
        //             id: item.snippet.resourceId.videoId,
        //             title: item.snippet.title,
        //             duration: iso8601ToSeconds(videoDetails.data.items[0].contentDetails.duration),
        //             author: item.snippet.videoOwnerChannelTitle,
        //             image: imageDetails.data.items[0].snippet.thumbnails.maxres.url,
        //         };
        //     } catch (error) {
        //         console.error('Error fetching details for video ID', item.snippet.resourceId.videoId, error);
        //         return null; // Return null for any video where details cannot be fetched
        //     }
        // }));
        //
        // // Filter out any null results (in case of failed API calls)
        // const validSongs = songs.filter(song => song !== null);
        // const shuffledSongs = shuffleArray(validSongs);
        // res.status(200).json({ songs: shuffledSongs });
    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({ error: 'ciao' + error });
    }
}
