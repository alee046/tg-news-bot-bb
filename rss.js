const TelegramBot = require('node-telegram-bot-api');
const got = require('got');
const FeedMe = require('feedme');
// replace the value below with the Telegram token you receive from @BotFather
const botToken = '452863682:AAFvRxV2tJZ9S_rhZ3F2oxn-e3RShwHXZhU';
const newsToken = 'bb18fc4ffcf046589b0b8a743d72a314';
const newsUrl = 'https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=';
const finder = require('find-rss');
const parser = require('parse-rss');
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, {polling: true});
parser("http://feed.informer.com/digests/I2GGLAVR70/feeder.rss", function(err,rss){
   let match =  rss ;  
match.forEach((s)=>{
console.log(s.title, s.link)
   })
}) 

// bot.onText(/\/echo (.+)/, (msg, match) => {

//   const chatId = msg.chat.id;
//   const resp = match[ 1 ];
//   bot.sendMessage(chatId, resp);
// });

// bot.onText(/\/news/, (msg, match) => {
//     // got('http://feed.informer.com/digests/I2GGLAVR70/feeder.rss').then((res, err)=>{
//     //     var parser = new FeedMe();
//     //     parser.on('channel', (title) => {
//     //     console.log('title of feed is', title);
//     //     });
//     //     parser.on('item', (item) => {
//     //     console.log();
//     //     console.log('news:', item.title);
//     //     console.log(item.description);
//     //     });
//     //     res.pipe(parser);
//     // },
//     // function(err) {
//         //         console.log(err);
//         //     });)
//     got('https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=bb18fc4ffcf046589b0b8a743d72a314').then(function(result, error) {
//         match = JSON.parse( result.body ); 
//         const chatId = msg.chat.id;
//         bot.sendMessage(chatId, '-----Todays news----');
//         for ( i in match.articles ) {
//             bot.sendMessage(chatId, 
//                 `
//                 ${match.articles[i].title}
//                 ${match.articles[i].description} 
//                 ${match.articles[i].url}
//                 `
//             );
//         }
//         // bot.sendMessage(chatId, 
//         //     `/doge
//         //     `
//         // );
//     }, function(err) {
//         console.log(err);
//     });
// });

// bot.onText(/\/yodog/, (msg, match) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 
//         `/doge
//         `
//     );
// });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, '-----Todays news----');
// });