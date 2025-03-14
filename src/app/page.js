'use client'
import {useEffect, useRef, useState} from 'react';
import styles from "./page.module.css";
import OpenAI from 'openai';
import axios from 'axios';

export default function Home() {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
    const [playlist, setPlaylist] = useState('');
    const [fileName, setFileName] = useState('');
    const [duration, setDuration] = useState(0);
    const [playState, setPlayState] = useState(0)
    const [isFirstPlay, setIsFirstPlay] = useState(true);
    const [canPlay, setCanPlay] = useState(false)

    // Ref to store the audio object
    const audioRef = useRef(null);
    const gptRef = useRef(null);


    useEffect(() => {
        const play = async () => {
            if (!canPlay) {
                return;
            }
            try {
                setCanPlay(false)
                audioRef.current = new Audio();
                gptRef.current = new Audio();
                const metadataSong = await axios.get(`/api/playlists?query=${playlist}`);
                console.log(metadataSong.data.filename);
                setFileName(metadataSong.data.filename);
                let id = metadataSong.data.id;
                setDuration(metadataSong.data.duration);
                await Stream(id);
            } catch (error) {
                console.log('Error fetching song data:', error);
            }
        };

        play()
    }, [canPlay]);


    useEffect(() => {
        console.log(`duration ${duration}`)
        if (duration === 0) return;
        const gptResponse = async () => {
            const startTime = Date.now();
            try {
                console.log('trying to get response')
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini-audio-preview",
                    modalities: ["text", "audio"],
                    audio: {voice: "onyx", format: "mp3"},
                    messages: [
                        {
                            role: "system",
                            content: "you are an italian dj from the station radiogpt, you should talk about the song you just played in the text delimited by the triple apostrophe (remove topic from the artist name if there is any), tell the news from time to time, only speak in italian"
                        },
                        {
                            role: "user",
                            content: `""" in: ${fileName}"""`
                        }
                    ],
                    store: true,
                });
                console.log(response);
                gptRef.current.src = `data:audio/mp3;base64,${response.choices[0].message.audio.data}`
                if(gptRef.current) {
                    gptRef.current.addEventListener('canplaythrough', () => {
                        console.log(gptRef.current);
                        const durationGpt = gptRef.current.duration;
                        console.log('GPT Audio Duration:', durationGpt);
                        const requestTime = Date.now() - startTime;
                        console.log('requestTime:', requestTime);
                        const delay = duration - durationGpt / 2;
                        console.log('GPT Audio Delay:', delay);
                        setTimeout(() => {
                            fadeAudio(audioRef.current, 0.1, 1, gptRef.current);
                            gptRef.current.addEventListener('ended', () => {
                                fadeAudio(audioRef.current, 1, 1);
                            });
                        }, (delay * 1000) - requestTime);

                    });
                }

            } catch (error) {
                console.log('Error generating GPT response:', error);
            }
        }

        gptResponse()
    }, [duration]);

    const Stream = async (id) => {
        console.log(`Start stream for ID: ${id}`);
        try {

            audioRef.current.src = `/api/stream?id=${id}`

            if (isFirstPlay) {
                audioRef.current.volume = 1; // Full volume for the first playback
                setIsFirstPlay(false); // Update the flag after the first playback
            } else {
                audioRef.current.volume = 0.2; // Lower volume for subsequent playbacks
            }



            const loadTimeout = setTimeout(() => {
                if (audioRef.current != null){
                    console.log('Audio took too long to load, retrying...');
                    setCanPlay(true)
                }

            }, 20000);

            audioRef.current.addEventListener('canplaythrough', () => {
                audioRef.current.play();
                clearTimeout(loadTimeout);
                console.log('Audio can play through.');
            });

            audioRef.current.addEventListener('ended', () => {
                setCanPlay(true)
            });

        } catch (error) {
            console.log('Error initializing audio stream:', error);
        }
    };

    // Fade-in or fade-out effect function
    const fadeAudio = (audio, targetVolume, durationInSeconds, audioToPlay = null) => {
        if (!audio || targetVolume < 0 || targetVolume > 1) return; // Safety checks

        const startVolume = audio.volume;
        const volumeChangePerStep = (targetVolume - startVolume) / (durationInSeconds * 10); // Adjust volume every 100ms

        let intervalId = setInterval(() => {
            if (Math.abs(audio.volume - targetVolume) < 0.01) {
                clearInterval(intervalId);
                if(audioToPlay){
                    audioToPlay.play();
                    audioToPlay.volume = 1;
                }
            } else {
                audio.volume += volumeChangePerStep;
                // Ensure volume stays within bounds
                if (audio.volume < 0) audio.volume = 0;
                if (audio.volume > 1) audio.volume = 1;
            }
        }, 100); // Adjust volume every 100 milliseconds
    };

    return (
        <div className={styles.page}>
            <h1>RadioGPT</h1>
            <h2>{fileName}</h2>
            <input
                type="text"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
            />
            <button onClick={() => setCanPlay(true)}>Play</button>
        </div>
    );
}
