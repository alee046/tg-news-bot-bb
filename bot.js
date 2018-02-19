const TelegramBot = require( 'node-telegram-bot-api' );
const parser = require( 'parse-rss' );
const tokens = require( './config.js' );
const _ = require('lodash');
const moment = require('moment');
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
    'https://www.finextra.com/rss/channel.aspx?channel=blockchain',
    'https://www.ethnews.com/rss.xml',
    'http://bitcoinist.net/feed/',
    'https://medium.com/feed/tag/blockchain',
    'http://allcoinsnews.com/feed/',
    'http://www.coinspectator.com/feed/'
];
var feed = [];
const bot = new TelegramBot( tokens.botToken, { polling: true } );


// HELPER METHODS
function getRss( url ) {
    return new Promise( ( resolve, reject ) => {
        parser( url, ( err, rss ) => {
            if ( err ) {
                reject( err );
            }
            if ( rss ) {
                resolve( ( feed.push( rss[ _.random( 0, rss.length - 1 ) ] ) ) )
            }
        });
    });
};
// Returns date difference information eg. Published 5 days ago..
function getDateDiff( feed ) {
    let now  = moment();
    let then = feed.pubDate;
    let ms = moment( now, "DD/MM/YYYY HH:mm:ss" ).diff( moment( then, "DD/MM/YYYY HH:mm:ss" ) );
    let d = moment.duration( ms );
    feed.days = d.days();
    // Outputs pertinent date info 
    feed.publicationStr = d.days() === 0 && d.hours() === 0 ? `Published ${d.minutes()} minutes ago.` :  d.days() === 0 ? `Published ${d.hours()} hours,  ${d.minutes()} minutes ago.` : `Published ${d.days()} days,  ${d.hours()} hours ago.`;
};

function truncateString( feed ) {
    feed.shortTitle = _.truncate( feed.title, {
        'length': 60,
        'separator': ' '
    });
};

bot.onText( /\/news/, ( msg, match ) => {

    const chatId = msg.chat.id;
    bot.sendMessage( chatId, '-----Todays news----:' );
    got( newsUrl + tokens.newsToken ).then( (result, error ) => {
        let match = JSON.parse( result.body ); 
        for ( let i in match.articles ) {
            bot.sendMessage( chatId, 
                `${match.articles[i].title} : ${match.articles[i].url}
                `, 
                { disable_web_page_preview : true }
            );
        };
    }, ( err ) => {
        console.log( err );
    });
});

bot.onText( /\/spamdeezy/, ( msg, match ) => {
    const chatId = msg.chat.id;
    const num = match[ 1 ]; 

    for ( let i = 0; i < 10; i++ ) {
        bot.sendMessage( chatId,
            `
        ░░░░░░░█▐▓▓░████▄▄▄█▀▄▓▓▓▌█
        ░░░░░▄█▌▀▄▓▓▄▄▄▄▀▀▀▄▓▓▓▓▓▌█
        ░░░▄█▀▀▄▓█▓▓▓▓▓▓▓▓▓▓▓▓▀░▓▌█
        ░░█▀▄▓▓▓███▓▓▓███▓▓▓▄░░▄▓▐█▌ 
        ░█▌▓▓▓▀▀▓▓▓▓███▓▓▓▓▓▓▓▄▀▓▓▐█
        ▐█▐██▐░▄▓▓▓▓▓▀▄░▀▓▓▓▓▓▓▓▓▓▌█▌
        █▌███▓▓▓▓▓▓▓▓▐░░▄▓▓███▓▓▓▄▀▐█ 
        █▐█▓▀░░▀▓▓▓▓▓▓▓▓▓██████▓▓▓▓▐█ 
        ▌▓▄▌▀░▀░▐▀█▄▓▓██████████▓▓▓▌█▌
        ▌▓▓▓▄▄▀▀▓▓▓▀▓▓▓▓▓▓▓▓█▓█▓█▓▓▌█▌
        █▐▓▓▓▓▓▓▄▄▄▓▓▓▓▓▓█▓█▓█▓█▓▓▓▐
            `, 
        { disable_web_page_preview : true } );
    };
});

bot.onText( /\/rss ([0-9]+)/, ( msg, match ) => {
    const chatId = msg.chat.id;
    parser( rssUrl, ( err, rss ) => {
        let response = '';
        let res = rss,
        
        num = match[ 1 ];
        for ( let i = 0; i < num; i++ ) {
            response += `
            ${res[i].title} : ${res[i].link}
            ` ;
        };
        bot.sendMessage( prophet, 
            response, 
            { disable_web_page_preview : true }
        );
    }, ( err ) => {
        console.log( err );
    }); 
});


async function pullMultiFeeds( ) {

    await Promise.all( feedList.map( async( url ) => {
        await getRss( url );
    }))
    .then( ( data ) => {

        for ( let i = 0; i < feed.length; i++ ) {
            if ( feed[ i ] ) {
                getDateDiff( feed[ i ] );
                truncateString( feed[ i ] );
            }
        };
    })
    .then( () => {
        let response = '';
            response += '----News----\n\n';

        for ( let i = 0; i < feed.length; i++ ) {
            if ( feed[ i ] ) {
                feed[ i ].days <= 7 ? response +=  "[" + feed[ i ].shortTitle + "](" + feed[ i ].link + ") \n" + feed[i].publicationStr + "\n\n": '';
            }
        };
        bot.sendMessage( prophet,
            response, {
                disable_web_page_preview : true,
                parse_mode : 'markdown'
            }
        );  
        feed = [];
    });
};

// 2 hour timer
const interval = setInterval( () => {
    pullMultiFeeds();    
}, 10000 );

