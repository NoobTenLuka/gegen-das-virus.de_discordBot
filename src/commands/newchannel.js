exports.run = (client, message, args) => {
    const [categoryName, channelName] = args;
    const reason = args[2] ? args.slice(2).join(" ") : null;

    let category;
    if (categoryName === "here") {
        category = message.channel.parent;
    } else {
        category = message.guild.channels.cache.find(
            c => c.name === categoryName && c.type === "category"
        );
    }
    // Check if the category exists
    if (!category) {
        const lowercaseCategory = category.name.toLowerCase();
        const firstLetterUppercase =
            lowercaseCategory.charAt(0).toUpperCase() +
            lowercaseCategory.slice(1);
        return message.reply(
            `I can't find ${category.name}. Did you mean ${firstLetterUppercase}`
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

    const newChannelName = `${category.name}-${channelName}`;

    message.guild.channels
        .create(newChannelName, {
            type: "text",
            reason: `The User ${
                message.member.displayName
            } wanted a new channel ${
                reason ? `with the reason being: ${reason}` : ""
            }`,
        })
        .then(async channel => {
            try {
                await channel.setParent(category.id);
            } catch (err) {
                console.error(err);
            }

            while (!channel.parent) {
                try {
                    await channel.setParent(category.id);
                } catch (err) {
                    console.error(err);
                }
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
