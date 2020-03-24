module.exports = (client) => {
  console.log('Discord Bot started!')
  client.welcomeChannel = client.channels.cache.get(
    client.config.welcomeChannelID,
  )
}
