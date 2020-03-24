const fs = require('fs')

module.exports = (client, member) => {
  try {
    // console.log(member.client.user.locale);
    let localeCode = member.user.locale
    if (!localeCode) {
      localeCode = 'en-GB'
    }
    const languageJSON = JSON.parse(
      fs.readFileSync('../assets/i18n/' + localeCode + '.json'),
    )
    member.send({
      embed: { color: 3447003, fields: languageJSON.welcome },
    })
    client.welcomeChannel.send(
      `Ein neuer Benutzer hat den Discord betreten: <@${member.id}>`,
    )
  } catch (e) {
    console.error(e)
  }
}
