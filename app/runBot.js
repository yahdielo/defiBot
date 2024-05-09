const TelegramBot = require('node-telegram-bot-api');
const {Telegraf, markup} = require('telegraf');
const { BOT } = require('./scripts/Bot')
require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const provider = process.env.BASE_RPC;

const action = new BOT(provider)

// Matches "/echo [whatever]"
bot.onText(/\/trade/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
   let resp = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'BUY',
             // we shall check for this value when we listen
             // for "callback_query"
            callback_data: 'edit'
          },{
            text: 'SELL',
            callback_data: 'moreedit'
          }

        ]
      ]
    }
  };
  
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId,'what you want to do?' ,resp);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});

// Listen for any kind of message. There are different kinds of
// messages.
/** */
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  let userMsg = msg.text
  if (!userMsg.startsWith('/')){

    let response = await handeler(userMsg)

    //let response = await handeler(userMsg)
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, response);
  }
});


async function handeler(userMsg){

  userMsg.toLowerCase()

  if (userMsg == 'ethbalance'){
    let balance = await action.ethBalance()
    return `your ETH balance is ${balance}`
  }

  else {
    return 'please read the intructions on bot commands'
  }
}
