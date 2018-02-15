const TelegramBot = require( 'node-telegram-bot-api' );
const parser = require( 'parse-rss' );
const tokens = require( './config.js' );
const _ = require('lodash');
const moment = require('moment');
// const idnum = '-1001228605946';
// const testnum = '453845092';
const prophet = '-310959734';
var feed = [];
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
    // 'https://cointelegraph.com/rss',
    'https://www.finextra.com/rss/channel.aspx?channel=blockchain',
    'https://www.ethnews.com/rss.xml',
    'http://bitcoinist.net/feed/',
    'https://medium.com/feed/tag/blockchain',
    'http://allcoinsnews.com/feed/',
    'http://www.coinspectator.com/feed/'
];

const bot = new TelegramBot( tokens.botToken, { polling: true } );


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

function getRss( url ) {
    return new Promise( ( resolve, reject ) => {
        parser( url, ( err, rss ) => {
            if ( err ) {
                reject( err );
            }
            if ( rss ) {
                feed.push( rss[ _.random( 0, rss.length - 1 ) ] );
                // console.log(feed);
                resolve( ( rss[ 0 ] ) )
            }
        });
    })
};

function getDateDiff( feed ) {
    let now  = moment();
    let then = feed.pubDate;
    let ms = moment( now, "DD/MM/YYYY HH:mm:ss" ).diff( moment( then, "DD/MM/YYYY HH:mm:ss" ) );
    let d = moment.duration( ms );
    feed.days = d.days();
    feed.publicationStr = d.days() === 0 && d.hours() === 0 ? `Published ${d.minutes()} minutes ago.` :  d.days() === 0 ? `Published ${d.hours()} hours,  ${d.minutes()} minutes ago.` : `Published ${d.days()} days,  ${d.hours()} hours ago.`;
};

function truncateString( feed ) {
    feed.shortTitle = _.truncate( feed.title, {
        'length': 60,
        'separator': ' '
      });
};

async function pullMultiFeeds( ) {

    await Promise.all( feedList.map( async( url ) => {
        await getRss( url );
    }))
    .then( ( data ) => {

        let response = '';
            response += '----News----\n\n';

        for ( let i = 0; i < feed.length; i++ ) {
            if (feed[i]){
                getDateDiff(feed[i]);
                truncateString(feed[i]);
            }
         
        };

    }).then( () => {
        let response = '';
            response += '----News----\n\n';

        for ( let i = 0; i < feed.length; i++ ) {
            if ( feed[ i ] ) {
                // getDateDiff(feed[i]);
                feed[ i ].days <= 7 ? response +=  "[" + feed[ i ].shortTitle + "](" + feed[ i ].link + ") \n" + feed[i].publicationStr + "\n\n": '';
            }
        }
        bot.sendMessage( prophet,
            response, {
                disable_web_page_preview : true,
                parse_mode : 'markdown'
            }
        );  
        feed = [];
    })
};

const interval = setInterval( () => {
    pullMultiFeeds();    
}, 10000 );
// const interval = setInterval( () => {
//     // bot.sendMessage( prophet, 
//     //     '----News for the hour----', 
//     //     { disable_web_page_preview : true }
//     // );

//     var url = _.sample( feedList );
//     parser( url, ( err, rss ) => {
//         let response = '';
//         let res = rss;
//         response += '----News----\n\n'
//             for ( let i = 0; i < 9; i++ ) {
//                     response +=  "[" + res[ i ].title + "](" + res[ i ].link + ") \nSource: [" + res[i].meta.title + "](" + res[i].meta.link + ")\n\n";
//             };
//             bot.sendMessage( prophet,
//                 response, {
//                     disable_web_page_preview : true,
//                     parse_mode : 'markdown'
//                 }
//             );  
//         }, ( err ) => {
//             console.log( err );
//         }); 
// }, 10000 );

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
    }
});


// bot.on( 'message' ( msg ) => {
//     console.log(msg);
//     const chatId = msg.chat.id;
//     // send a message to the chat acknowledging receipt of their message
//   });