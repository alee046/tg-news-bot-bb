const TelegramBot = require( 'node-telegram-bot-api' );
const got = require( 'got' );
const parser = require( 'parse-rss' );
const tokens = require( './config.js' );
const _ = require('lodash');

const newsUrl = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=';
const rssUrl = 'http://feed.informer.com/digests/I2GGLAVR70/feeder.rss';
const herokuUrl = ' https://pct-news-bot.herokuapp.com/;'
const idnum = '-1001228605946';
const testnum = '453845092';
const prophet = '-310959734';

const feedList = [
    'http://icopartners.com/feed/',
    'http://feed.informer.com/digests/I2GGLAVR70/feeder.rss',
    'https://www.blockchaindailynews.com/xml/syndication.rss',
    'https://www.reddit.com/r/icocrypto/.rss',
    'http://themerkle.com/feed/',
    'https://www.smithandcrown.com/feed/',
    'https://youmeandbtc.com/feed/',
    'http://feeds.feedburner.com/CoinDesk',
    'https://epicenterbitcoin.com/feed/',
    'https://bitsonline.com/feed/',
    'https://cointelegraph.com/rss',
    'https://www.finextra.com/rss/channel.aspx?channel=blockchain',
    'https://www.ethnews.com/rss.xml',
    'http://bitcoinist.net/feed/',
    'https://medium.com/feed/tag/blockchain',
    'http://allcoinsnews.com/feed/',
    'http://www.coinspectator.com/feed/'
];

parser( 'http://icopartners.com/feed/', ( err , rss) => {

    let response = '';
    let res = rss;
console.log(rss[1].meta.title)
        // for ( let i = 0; i < 9; i++ ) {
        //         response +=  "[" + res[ i ].title + "](" + res[ i ].link + ")\n\n";
        // };
        // bot.sendMessage( prophet,
        //     response, {
        //         disable_web_page_preview : true,
        //         parse_mode : 'markdown'
        //     }
        // );  
    }, ( err ) => {
        console.log( err );
    }); 
