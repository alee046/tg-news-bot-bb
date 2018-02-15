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
const feed = [];
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

const bot = new TelegramBot( tokens.botToken, { polling: true } );

bot.setWebHook( 'https://pct-news-bot.herokuapp.com/' + bot.token );

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
// _(10).times((n)=>{ url.push(_.sample( feedList ))});
// // var url = _.sample( feedList );
function getRss( url ) {
    return new Promise( ( resolve, reject ) => {
        parser( url, ( err, rss ) => {
            if ( err ) {
                reject( err );
            }
            if ( rss ) {
            // console.log(rss[0])
                feed.push( rss[ 0 ] );
                // console.log(feed);
                resolve( ( rss[ 0 ] ) )
            }
        });
    })
}
    
async function pullHellaFeeds( ) {

    await Promise.all( feedList.map( async( url ) => {
        feed.push(await getRss(url))
        await getRss(url);
    }))
    .then( ( data ) => {
        console.log( data )
        console.log( feed.length )
    })
}
    // pullHellaFeeds();
const interval = setInterval( () => {
    // bot.sendMessage( prophet, 
    //     '----News for the hour----', 
    //     { disable_web_page_preview : true }
    // );

    var url = _.sample( feedList );
    parser( url, ( err, rss ) => {
        let response = '';
        let res = rss;
        response += '----News----\n\n'
            for ( let i = 0; i < 9; i++ ) {
                    response +=  "[" + res[ i ].title + "](" + res[ i ].link + ") \nSource: [" + res[i].meta.title + "](" + res[i].meta.link + ")\n\n";
            };
            bot.sendMessage( prophet,
                response, {
                    disable_web_page_preview : true,
                    parse_mode : 'markdown'
                }
            );  
        }, ( err ) => {
            console.log( err );
        }); 
}, 7200000 );

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