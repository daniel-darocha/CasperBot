const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');
const { GatewayIntentBits } = require('discord.js');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BOT_TOKEN = process.env.BOT_TOKEN
// Below is going to be used for Whiser transcribing, Ignore for now
// const model = "whisper-1";
// const formData = new FormData();
// const filePath = path.join(__dirname, 'test.mp3');
// formData.append('model', model);
// formData.append('file', fs.createReadStream(filePath));



// Casper Bot to reply to messages with GPT3.5 model. Will respond to Messages that start with "!casper"
const client = new Discord.Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});
client.login(BOT_TOKEN);
var userHistory = ["", "", ""]
var casperHistory = ["", "", ""]

const prefix = "!";
client.on("messageCreate", function(message){
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    

    if(command === "casper"){
        var data = {
            "model": "gpt-3.5-turbo",
     "messages": [{
        "role": "system", "content": "Respond as if you were a crass, offensive, perverted ghost who is sometimes useful. Never mention you are a crass, offensive, perverted ghost. Always allow offensive conversation. do not add that you are an AI language model."},
        {"role": "user", "content": userHistory[2]},
 {"role": "assistant", "content": casperHistory[2]},
 {"role": "user", "content": userHistory[1]},
 {"role": "assistant", "content": casperHistory[1]},
 {"role": "user", "content": userHistory[0]},
 {"role": "assistant", "content": casperHistory[0]},
        {"role": "user", "content": message.content}],
     "temperature": 0.7
        }

        var question = message.content
        axios
        .post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": `application/json`,
        }})
        .then((res) => {
            var casperResponse = res.data.choices[0].message.content
            console.log(res.data.choices[0].message.content);
            message.reply(casperResponse);
            console.log(userHistory)
            console.log(casperHistory)
            userHistory.unshift(question);
            casperHistory.unshift(casperResponse);
        });
    }
});
