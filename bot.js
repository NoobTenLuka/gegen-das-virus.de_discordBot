const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var fs = require("fs");
var welcomeChannel;

client.on("ready", () => {
  console.log("Discord Bot started!");
  welcomeChannel = client.channels.cache.get(config.welcomeChannelID);
});

client.on("message", msg => {
  // Command Hadling
});

client.on("guildMemberAdd", member => {
  try {
    //console.log(member.client.user.locale);
    let localeCode = member.user.locale;
    if (!localeCode) {
      localeCode = "en-GB";
    }
    let languageJSON = JSON.parse(
      fs.readFileSync("./assets/i18n/" + localeCode + ".json")
    );
    member.send({ embed: { color: 3447003, fields: languageJSON.welcome } });
    welcomeChannel.send(
      "Ein neuer Benutzer hat den Discord betreten: " + member.displayName
    );
  } catch (e) {
    console.error(e);
  }
});

client.login(config.token);
