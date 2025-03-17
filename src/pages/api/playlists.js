import axios from "axios";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[randomIndex]
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

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
    try {
        const { query } = req.query;
        const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is missing' });
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

        if (!playlistSongs.data.items || playlistSongs.data.items.length === 0) {
            return res.status(404).json({ error: 'No songs found in this playlist' });
        }

        // Using Promise.all for better performance
        const songs = await Promise.all(playlistSongs.data.items.map(async (item) => {
            try {
                const videoDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        key: apiKey,
                        part: 'contentDetails',
                        id: item.snippet.resourceId.videoId,
                    }
                });

                const imageDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        key: apiKey,
                        part: 'snippet',
                        id: item.snippet.resourceId.videoId,
                    }
                });

                return {
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    duration: iso8601ToSeconds(videoDetails.data.items[0].contentDetails.duration),
                    author: item.snippet.videoOwnerChannelTitle,
                    image: imageDetails.data.items[0].snippet.thumbnails.maxres.url,
                };
            } catch (error) {
                console.error('Error fetching details for video ID', item.snippet.resourceId.videoId, error);
                return null; // Return null for any video where details cannot be fetched
            }
        }));

        // Filter out any null results (in case of failed API calls)
        const validSongs = songs.filter(song => song !== null);
        const shuffledSongs = shuffleArray(validSongs);
        res.status(200).json({ songs: shuffledSongs });
    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
