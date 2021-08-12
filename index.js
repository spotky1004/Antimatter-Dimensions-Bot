import * as Upgrades from "./src/upgrades/_init.js";
console.log(Upgrades);

import Discord from "discord.js";

import * as AntimatterDimension from "./src/index.js";
import Config from "./config.js";

const bot = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const Cache = {};

bot.on("messageCreate", async (message) => {
    if (message.content.startsWith("startAntimatter")) {
        let messageSent;
        await message.channel.send("Initializing Game")
            .then(msg => messageSent = msg);
        
        const override = typeof Cache[messageSent.channel.id] !== "undefined";
        Cache[messageSent.channel.id] = {};
        Cache[messageSent.channel.id].message = messageSent;
        Cache[messageSent.channel.id].buttonFunc = [];
        if (!override) UpdateMessage(messageSent.channel.id);
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

    bot.user.setPresence({
        status: 'online',
        activities: [{
            name: "Original game: https://ivark.github.io/ by Ivark(Hevipelle)",
            type: "WATCHING",
        }]
    });
});

async function UpdateMessage(channelId) {
    /** @type { {message: Discord.Message, buttonFunc: string[]} } */
    const _Cache = Cache[channelId];
    if (_Cache.message.deleted) return;
    await _Cache.message.edit(AntimatterDimension.tick(channelId, _Cache.buttonFunc))
        .catch(err => console.error(err));
    _Cache.buttonFunc = [];
    await timer(2000);

    UpdateMessage(channelId);
}
const timer = ms => new Promise(
    res => {
        setTimeout(res, ms);
    }
)



//bot.login(Config.token);