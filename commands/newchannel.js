exports.run = (client, message, args) => {
  const [catergoryName, channelName] = args;
  const reason = args[2] ? args.slice(2).join(" ") : null;

  const category = message.guild.channels.cache.find(
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

  const canCreateChannel =
    category.permissionsFor(message.member).has("SEND_MESSAGES") &&
    message.member.roles.cache.some(
      role => role.name === client.config.channelCreationRoleName
    );

  if (!canCreateChannel) {
    return message.reply(
      "you currently do not have the necessary permissions to create this channel"
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
      } catch (err) {
        console.error(err);
      }

      if (!channel.parent) {
        channel.delete();
        return message.reply(
          "There has been an error in the creation of the channel. Please try again!"
        );
      }

      try {
        await channel.lockPermissions();
      } catch (err) {
        console.error(err);
      }

      message.reply(`The channel ${newChannelName} has been created`);
    })
    .catch(console.error);
};
