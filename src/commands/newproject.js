exports.run = async (client, message, args) => {
  const [categoryName] = args

  // Change the input to match the category name standarts
  const lowercaseCategory = categoryName.toLowerCase()
  const formatedCategoryName =
    lowercaseCategory.charAt(0).toUpperCase() + lowercaseCategory.slice(1)

  let category
  try {
    // Create the category
    category = await message.guild.channels.create(formatedCategoryName, {
      type: 'category',
    })
  } catch (err) {
    console.error(err)
  }

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
