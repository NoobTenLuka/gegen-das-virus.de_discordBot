exports.run = (client, message, args) => {
  let [catergoryName, channelName] = args;
  let reason = args[2] ? args.slice(2).join(" ") : null;

  let category = message.guild.channels.cache.find(
    c => c.name === catergoryName && c.type === "category"
  );

  // Check if the category exists
  if (!category) {
    const lowercaseCategory = catergoryName.toLowerCase();
    const firstLetterUppercase =
      lowercaseCategory.charAt(0).toUpperCase() + lowercaseCategory.slice(1);
    return message.reply(
      `I can't find ${catergoryName}. Did you mean ${firstLetterUppercase}`
    );
  }

  const newChannelName = `${catergoryName}-${channelName}`;

  message.guild.channels
    .create(newChannelName, {
      type: "text",
      reason: `The User ${message.member.displayName} wanted a new channel ${
        reason ? `with the reason being: ${reason}` : ""
      }`
    })
    .then(async channel => {
      try {
        await channel.setParent(category.id);
        await channel.lockPermissions();
      } catch (err) {
        console.error(err);
      }

      message.reply(`The channel ${newChannelName} has been created`);
    })
    .catch(console.error);
};