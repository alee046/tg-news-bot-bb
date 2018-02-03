const TelegramBot = require( 'node-telegram-bot-api' );
const got = require( 'got' );
const FeedMe = require( 'feedme' );
const parser = require( 'parse-rss' );
const _ = require( 'lodash' );
// const tokens = require('config.js)'
const tokens = require( './config.js' );

const newsUrl = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=';
const rssUrl = 'http://feed.informer.com/digests/I2GGLAVR70/feeder.rss';

const bot = new TelegramBot( tokens.botToken, { polling: true } );

bot.onText( /\/news/, ( msg, match ) => {
    const chatId = msg.chat.id;
    bot.sendMessage( chatId, '-----Todays news----:' );
    got( newsUrl + tokens.newsToken ).then( (result, error) => {
        let match = JSON.parse( result.body ); 
        for ( let i in match.articles ) {
            bot.sendMessage( chatId, 
                `${match.articles[i].title} : ${match.articles[i].url}`, 
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
    let res = rss,
        num = match[1];
        for ( let i = 0; i < num; i++ ) {
            bot.sendMessage( chatId, 
                `${res[i].title} : ${res[i].link}`, 
                { disable_web_page_preview : true }
            );
        };
    }, ( err ) => {
        console.log( err );
    }); 
});

bot.onText( /\/spamdeezy ([0-9]+)/, ( msg, match ) => {
    const chatId = msg.chat.id;
    const num = match[1]; 

    for ( let i = 0; i < num; i++ ) {
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
        { disable_web_page_preview : true });
    }
});

bot.on( 'message', ( msg ) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
});