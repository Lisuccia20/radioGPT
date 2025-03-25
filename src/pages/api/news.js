import { XMLParser} from "fast-xml-parser";
import axios from "axios";


export default async function handler(req, res) {
    const news = await axios.get(`https://www.ansa.it/sito/ansait_rss.xml`);
    const rss = news.data;
    const parser = new XMLParser();
    const jsonData = parser.parse(rss);
    const items = jsonData.rss.channel.item;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    res.status(200).json(randomItem)
}
