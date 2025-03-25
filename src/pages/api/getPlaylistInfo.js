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
                const playlistDetails = {
                    url: sp_data.url,
                    name: sp_data.name,
                    author: sp_data.owner.name,
                    image: sp_data.thumbnail.url,
                }
                res.status(200).json(sp_data);
            } catch (error) {
                console.error('Error fetching playlist songs:', error);
                res.status(500).json({ error: error.message });
            }
        }

        // const url = new URL(query);
        // const playlistId = url.searchParams.get("list");
        ytstream.setPreference('scrape');
        const playlistSongs = await play.playlist_info(query);
        res.status(200).json(playlistSongs);
        const playlistDetails = {
            url: playlistSongs.url,
            title: playlistSongs.title,
            author: playlistSongs.channel.name,
            image: playlistSongs.thumbnail.url,
        }
        // Fetch playlist songs
        res.status(200).json(playlistDetails);

    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({ error: 'ciao' + error });
    }
}
