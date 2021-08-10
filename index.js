import Discord from "discord.js";
import Decimal from "decimal.js";

import Config from "./config.js";

const bot = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

import * as AntimatterDimension from "./Game/AntimatterDimensions.js";

const Cache = {

};

bot.on("messageCreate", async (message) => {
    if (message.content.startsWith("startAntimatter")) {
        let messageSent;
        await message.channel.send("Initialization Game")
            .then(msg => messageSent = msg);
        
        Cache[messageSent.channel.id] = {};
        Cache[messageSent.channel.id].message = messageSent;
        Cache[messageSent.channel.id].buttonFunc = [];
    }
});

bot.on("interactionCreate", async (interaction) => {
    const channel = interaction.channel.id;
    if (typeof Cache[channel] === "undefined") return;

    Cache[channel].buttonFunc.push(interaction.customId);
    Cache[channel].buttonFunc = [...new Set(Cache[channel].buttonFunc)];

    interaction.deferUpdate()
        .catch(err => console.error(err));
});

bot.on("ready", function() {
    console.log("Bot ready!");
});

setInterval(() => {
    for (const channelId in Cache) {
        /** @type { {message: Discord.Message, buttonFunc: string[]} } */
        const _Cache = Cache[channelId];
        try {
            _Cache.message.edit(AntimatterDimension.tick(channelId, _Cache.buttonFunc));
        } catch (err) {
            
        }
        _Cache.buttonFunc = [];
    }
}, 2000);


bot.login(Config.token);