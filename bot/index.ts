// Tokens and stuff.
import 'json5/lib/require'
import { testPilots } from '../config.json5'
import { version } from '../package.json'
import * as ms from 'ms'
// Commands.
import { handleRequest, handleSay, handleAvatar } from './commands/utilities'
import {
  handleChoose,
  handleReverse,
  handle8Ball,
  handleRepeat,
  handleZalgo
} from './commands/games'
import {
  handleUrban, handleCat, handleDog, handleRobohash, handleApod
} from './commands/api'
import { handleGunfight, handleAccept } from './commands/gunfight'
import {
  handleKick, handleBan, handleUnban, handleMute, handleUnmute, handleWarn,
  handleAddrole, handleRemoverole,
  handleTogglepublicroles
} from './commands/admin'

// We need types.
import { client, event, DB } from './imports/types'

// When client recieves a message, it will callback.
export default (client: client, tempDB: DB, onlineSince: number) => (
  user: string,
  userID: string,
  channelID: string,
  message: string,
  event: event
) => {
  // Disable bots from responding.
  if (client.users[userID].bot) return
  // Helper variables and functions.
  // Convert message to lowercase to ensure it works.
  const command = message.toLocaleLowerCase()
  // Helper command to send message to same channel.
  const sendResponse = (m: string, cb?: (error: {}, response: { id: string }) => void) => client.sendMessage({
    to: channelID, message: m
  }, cb)
  // Is the person a test pilot.
  const testPilot: string = testPilots.find((user: string) => user === userID)

  // Commands from on forth.
  // Help command.
  if (command.startsWith('/help') || command.startsWith('/halp')) {
    sendResponse(`
    **Jony Ive can do many commands 📡**
    \`/halp\` and \`/help\` - The most innovative help.
**Games.**
    \`/gunfight\` - For that good ol' fight bro.
    \`/choose\` - Choose between multiple options.
    \`/reverse\` - Reverse a sentence.
    \`/8ball\` - Random answers to random questions.
    \`/repeat\` - Repeat a string.
**Random searches.**
    \`/urban\` - Get an Urban Dictionary definition ;)
    \`/cat\` and \`/dog\` - Random cats and dogs from <https://random.cat> and <https://dog.ceo>
    \`/robohash\` - Take some text, make it a robot/monster/head/cat.
    \`/zalgo\` - The zalgo demon's handwriting.
    \`/astronomy-picture-of-the-day\` or \`/apod\`
**Utilities.**
    TP \`/request\` - Request a specific feature.
    \`/say\` - Say something, even in another channel.
    \`/avatar\` - Avatar of a user.
    \`/about\`, \`/ping\`, \`/uptime\` and \`/version\` - About the running instance of IveBot.
    \`/addrole\` and \`/removerole\`
    AD \`/ban\`, \`/unban\`, \`/kick\`, \`/mute\` and \`/unmute\`
    AD \`/togglepublicroles\` - Enable public roles.

**There are some easter egg auto responses.**
**Commands with TP are test pilot only.**
**Commands with AD are admin/helper only.**
    `)

    // Auto responses and easter eggs.
  } else if (command.startsWith('is dot a good boy')) sendResponse('Shame on you. He\'s undefined.')
  else if (command.startsWith('iphone x')) sendResponse(`You don't deserve it. 😎`)
  else if (command.startsWith('triggered')) sendResponse('Ah, pathetic people again.')
  else if (command.startsWith('ayy')) sendResponse('lmao')

  // Request something.
  else if (command.startsWith('/request') && testPilot) handleRequest(client, userID, sendResponse, message)
  // Gunfight.
  else if (command.startsWith('/gunfight')) handleGunfight(command, userID, sendResponse, tempDB, channelID)
  // Accept gunfight.
  else if (command.startsWith('/accept')) handleAccept(tempDB, userID, sendResponse, channelID)
  // Handle answers to gunfight.
  // else if (command in ['fire', 'water', 'gun', 'dot']) return
  // Choose.
  else if (command.startsWith('/choose')) handleChoose(message, sendResponse)
  // Reverse.
  else if (command.startsWith('/reverse')) handleReverse(message, sendResponse)
  // 8ball.
  else if (command.startsWith('/8ball')) handle8Ball(message, sendResponse)
  // Repeat.
  else if (command.startsWith('/repeat')) handleRepeat(message, sendResponse)
  // Urban.
  else if (command.startsWith('/urban')) handleUrban(message, sendResponse)
  // Cats.
  else if (command.startsWith('/cat')) handleCat(message, sendResponse)
  // Dogs.
  else if (command.startsWith('/dog')) handleDog(message, sendResponse)
  // Zalgo.
  else if (command.startsWith('/zalgo')) handleZalgo(message, sendResponse)
  // Robohash.
  else if (command.startsWith('/robohash')) handleRobohash(message, sendResponse)
  // Astronomy picture of the day.
  else if (command.startsWith('/apod') || command.startsWith('/astronomy-picture-of-the-day')) {
    handleApod(message, sendResponse)
  // Say.
  } else if (command.startsWith('/say')) handleSay(message, sendResponse, client, event, testPilot)
  // Avatar.
  else if (command.startsWith('/avatar')) handleAvatar(message, sendResponse, client)
  // Ban.
  else if (command.startsWith('/ban')) handleBan(client, event, sendResponse, message)
  // Unban.
  else if (command.startsWith('/unban')) handleUnban(client, event, sendResponse, message)
  // Kick.
  else if (command.startsWith('/kick')) handleKick(client, event, sendResponse, message)
  // Mute.
  else if (command.startsWith('/mute')) handleMute(client, event, sendResponse, message)
  // Unmute.
  else if (command.startsWith('/unmute')) handleUnmute(client, event, sendResponse, message)
  // Warn.
  else if (command.startsWith('/warn')) handleWarn(client, event, sendResponse, message)
  // Add role.
  else if (command.startsWith('/addrole')) handleAddrole(client, event, sendResponse, message)
  // Remove role.
  else if (command.startsWith('/removerole')) handleRemoverole(client, event, sendResponse, message)
  // Toggle public role system.
  else if (command.startsWith('/togglepublicroles')) handleTogglepublicroles(client, event, sendResponse, message)
  // Version and about.
  else if (command.startsWith('/version')) sendResponse(`**IveBot ${version}**`)
  else if (command.startsWith('/about')) {
    sendResponse(`**IveBot ${version}**
IveBot is a Discord bot written with discord.io and care.
Unlike most other dumb bots, IveBot was not written with discord.js and has 0% copied code.
Built with community feedback mainly, IveBot does a lot of random stuff and fun.
IveBot 2.0 is planned to be built complete with music, administrative commands and a web dashboard.
For information on what IveBot can do, type **/help** or **/halp**.
The source code can be found here: <https://github.com/retrixe/IveBot>
For noobs, this bot is licensed and protected by law. Copy code and I will sue you for a KitKat.`)
  } else if (command.startsWith('/ping')) {
    // Get current time.
    const startTime = new Date().getTime()
    // Then send a message.
    sendResponse('Ping?', (err, { id }) => {
      // Latency (unrealistic, this can be negative or positive)
      const fl = startTime - new Date().getTime()
      // Divide latency by 2 to get more realistic latency and get absolute value (positive)
      const l = Math.abs(fl) / 2
      // Get latency.
      const e = l < 200 ? `latency of **${l}ms** 🚅🔃` : `latency of **${l}ms** 🔃`
      if (err) sendResponse('IveBot has experienced an internal error.')
      client.editMessage({
        channelID,
        messageID: id,
        message: `Aha! IveBot ${version} is connected to your server with a ${e}`
      })
    })
  } else if (command.startsWith('/uptime')) sendResponse(ms(Math.abs(new Date().getTime()) - onlineSince, { long: true }))
}
