exports.run = async (client, message, args) => {
  // Save the args into different variables
  const [categoryName] = args

  // Change the input to match the category name standarts
  const lowercaseCategory = categoryName.toLowerCase()
  const formatedCategoryName =
    lowercaseCategory.charAt(0).toUpperCase() + lowercaseCategory.slice(1)

  // Check permissions
  let canCreateProject
  try {
    canCreateProject = await message.member.roles.cache.some(
      (role) => role.name === client.config.channelCreationRoleName,
    )
  } catch (err) {
    console.error(err)
  }

  if (!canCreateProject) {
    return message.reply(
      'you currently do not have the necessary permissions to create a project',
    )
  }

  // Create the roles
  let role
  try {
    role = await message.guild.roles.create({
      data: {
        name: `${formatedCategoryName} Team`,
        permissions: [],
        hoist: true,
        mentionable: true,
      },
    })

    await message.member.roles.add(role)
  } catch (err) {
    console.error(err)
  }

  // Create the category
  let category
  try {
    category = await message.guild.channels.create(formatedCategoryName, {
      type: 'category',
      permissionOverwrites: [
        {
          id: role.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
      ],
    })
  } catch (err) {
    console.error(err)
  }

  // Create all channels inside the array
  const defaultChannels = ['allgemein', 'dev', 'ideen']

  defaultChannels.forEach(async (channelName) => {
    try {
      await createChannel(
        message,
        'text',
        `${formatedCategoryName}-${channelName}`,
        category,
      )
      await createChannel(
        message,
        'voice',
        `${formatedCategoryName}-${channelName}`,
        category,
      )
    } catch (err) {
      console.error(err)
    }
  })
}

// Function to create a channel and add it to a category
const createChannel = async (message, type, name, category) => {
  try {
    const channel = await message.guild.channels.create(name, {
      type,
    })

    await channel.setParent(category.id)

    while (!channel.parent) {
      try {
        await channel.setParent(category.id)
      } catch (err) {
        console.error(err)
      }
    }

    await channel.lockPermissions()
  } catch (err) {
    console.error(err)
  }
}
