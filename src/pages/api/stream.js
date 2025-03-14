import YTDlpWrap from 'yt-dlp-wrap';
import { Readable } from 'stream';
import stream from 'youtube-audio-stream'

export default async function handler(req, res) {
    const { id } = req.query;
    const cookiesPath = '__Secure-1PSIDTS=sidts-CjIBEJ3XV6xfLCmWIVMMr9jpWKKnTITzTo62xacAd6peYvD37m9Jrud8ME4FnMgjE4uy8xAA; __Secure-3PSIDTS=sidts-CjIBEJ3XV6xfLCmWIVMMr9jpWKKnTITzTo62xacAd6peYvD37m9Jrud8ME4FnMgjE4uy8xAA; HSID=ApNJJqgUxBmXOvQrU; SSID=A0cW6Glts37Rd3Thq; APISID=vo9EpKS_vr3soy1n/AHF7PqMLOiZsRTiXN; SAPISID=-LDOuV65BaeguQ-T/ArN4v6MeK3-hqAmEX; __Secure-1PAPISID=-LDOuV65BaeguQ-T/ArN4v6MeK3-hqAmEX; __Secure-3PAPISID=-LDOuV65BaeguQ-T/ArN4v6MeK3-hqAmEX; SID=g.a000uggWnDpaKhsvhUFbj3_k7PEd5O6ssJNvwdXpxHx7-Ph2Q-h4WuKErRAd8IBtPOuTy7ShyAACgYKAQUSARUSFQHGX2MijwbNRz3caCz58IKxmLWKgRoVAUF8yKqPd8NHj5kYTj2KLShA82jO0076; __Secure-1PSID=g.a000uggWnDpaKhsvhUFbj3_k7PEd5O6ssJNvwdXpxHx7-Ph2Q-h4FQu4NiTPfAzMXeqDBXAvfQACgYKAdESARUSFQHGX2MiuE6sOeqLpaxT4_n1zYg8dRoVAUF8yKr0BMd07H4MOLfbgrTJEvwI0076; __Secure-3PSID=g.a000uggWnDpaKhsvhUFbj3_k7PEd5O6ssJNvwdXpxHx7-Ph2Q-h4a43OQCVp7MJkmY4DO7BLgQACgYKAYsSARUSFQHGX2MiEbCk9b7afO2GXP2EwidXuRoVAUF8yKo95jt5s7U9pYxd-nXTNfSS0076; PREF=f6=40000080&tz=Europe.Rome&f5=30000&f7=100&repeat=NONE; __Secure-ROLLOUT_TOKEN=CJG0nZLZgZrrThDgsf-Epv2LAxjThNT9nImMAw%3D%3D; LOGIN_INFO=AFmmF2swRgIhAPPbygNPjOFC2nU7MflA3s7KI5WB_lr9FzmiLHCT8a41AiEAmAQ9W_WcH9_ShDWB_8JDkQ-zT7CTEs0JxT5ZnoDUCbI:QUQ3MjNmd3Z6RDN4YzNBSzJYeHdSUTAyd3Y0V2xhcENyWFhlZkhWVERSVWdEd1VBcnJaOFBSdGpIaVI2MHQ5OGVfMm5QUUg1OUJ5ZGFvSGRBMDFjSEJkSzB1RGg0R041RmhndC1ieEt2VVlXdEtTUUxwTW1hRXBlZU4yU3FiOU5oRjBkaTdabmc5c3JaZDM5WmhGTDB4TjVWSXl4bU9DelJB; __Secure-YEC=CgstbVI4dks4ZUhlMCiv6c--BjIiCgJJVBIcEhgSFhMLFBUWFwwYGRobHB0eHw4PIBAREiEgSg%3D%3D; VISITOR_PRIVACY_METADATA=CgJJVBIcEhgSFhMLFBUWFwwYGRobHB0eHw4PIBAREiEgSg%3D%3D; SIDCC=AKEyXzXt33ehbnSiVAMo2vUy2RkZK34QgsKpM8KgPskDEg0kapke_9JvQl3E3eeu6dnZSfV92nQ; __Secure-1PSIDCC=AKEyXzVHINMND81CKBd17b-CbFAfH8WI7udMUz7pLsu1TcIbuiuySdFyO1-DzMlGszHp_GCSQqk; __Secure-3PSIDCC=AKEyXzV2Fz13ZP5vW6BmzbEs2g-uve3xZIiHKiPfoctbWxWXCKO-f9u2typjGankzhZCrrg_1TM; _gcl_au=1.1.1258703584.1741725645; YSC=KOeysbnhF90; CONSISTENCY=AKreu9vQsdeN483EP43Hvydd4k4_JRrZcmJ56UGxKqjZXGCdOrlVOT6idXCsjRlzGzVcX0yacRa8QsIfxU0HqH0mqtqVpksihVlRDsvk0YQRoj7OOnR6CjWq-wDr-RIxEF6tDQ-0bvLEcSgiXJ4NnXlo'

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

