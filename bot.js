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
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

// });

const insertDocuments = function( db, feed, callback ) {
    // Get the documents collection
    const collection = db.collection('Users');
    // Insert some documents

    // db.collection.createIndex( {"link": 1}, { unique: true } )
    _.each( feed, function( yes ) {
        //    console.log(yes.link)
        //    console.log(yes.title)
        collection.update( { link: yes.link} , { $set: yes }, { upsert: true }, ( err, result ) => {

            callback( result );
        });
    });
};
var inc = 0
const sendArticles = (db, callback) => {
    return new Promise( ( resolve, reject ) => {
    const collection = db.collection( 'Users' );
        collection.find( { } ).sort( { pubdate: -1 } ).limit( 3 ).skip( yo ).toArray( ( err, docs ) => {
            if ( err ) {
                reject( err );
            }
            // console.log(docs)
            inc += 3;
            resolve( docs)
        });
    });
}

// HELPER METHODS
function getRss( url ) {
    return new Promise( ( resolve, reject ) => {
        parser( url, ( err, rss ) => {
            if ( err ) {
                reject( err );
            }
            if ( rss ) {
                resolve( ( feed.push( ...rss ) ) )
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

        // for ( let i = 0; i < feed.length; i++ ) {
        //     if ( feed[ i ] ) {
        //         feed[ i ].days <= 7 ? response +=  "[" + feed[ i ].shortTitle + "](" + feed[ i ].link + ") \n" + feed[i].publicationStr + "\n\n": '';
        //     }
        // };
        // insertDocuments(db, feed, function() {
        //     client.close();
        //   });
        MongoClient.connect( url, function( err, client ) {
           
            const db = client.db( dbName );
            let yo = sendArticles( db ).then( ( data ) => {
                // let response = '';
                // response += '----News----\n\n';
            for ( let i = 0; i <3; i++ ) {
                if ( data[ i ] ) {
                    data[ i ].days <= 7 ? bot.sendMessage( prophet,
                        "[" + data[ i ].shortTitle + "](" + data[ i ].link + ")\n", {
                            parse_mode : 'markdown'
                        }
                    ) : null;
                    // data[ i ].days <= 7 ? response +=  "[" + data[ i ].shortTitle + "](" + data[ i ].link + ")\n":null;
                }
            };
            // console.log(response);            
            // bot.sendMessage( prophet,
            //     response, {
            //         parse_mode : 'markdown'
            //     }
            // );  
            })
            // insertDocuments( db, feed, function() {
            //     // console.log( 'success' );
            //     //   findDocuments(db, function() {, 
            //     //     client.close();
            //     //   });

            // });
            // for ( let i = 0; i < yo.length; i++ ) {
            //     if ( yo[ i ] ) {
            //         yo[ i ].days <= 7 ? response +=  "[" + yo[ i ].shortTitle + "](" + yo[ i ].link + ") \n" + yo[i].publicationStr + "\n\n": '';
            //     }
            // };
            // bot.sendMessage( prophet,
            //     response, {
            //         disable_web_page_preview : true,
            //         parse_mode : 'markdown'
            //     }
            // );  
        });


        // feed = [];
    });
};

// 2 hour timer
const interval = setInterval( () => {
    pullMultiFeeds();    
}, 10000 );

