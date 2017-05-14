const botAnswerXpath = ".//p[@id = 'line1']//span[@class='bot']"

function Bot () {
  let bot = this
  bot.rootElement = browser.element("//div[@id='conversationcontainer']")

  bot.sendMsg = function (text) {
    let input = bot.rootElement.element(".//form[@id='avatarform']//input[@name='stimulus']")
    input.setValue(text)
    input.keys('Enter')

    browser.waitUntil(() => !input.getAttribute('readonly'), 'Bot is still loading')
  }

  bot.getLastResponse = function () {
    bot.rootElement.waitForExist(botAnswerXpath)
    bot.rootElement.waitForExist(".//p[@id = 'line1']//span[@id='snipTextIcon' and contains(@style, 'opacity: 1')]", 20000)
    return bot.rootElement.element(botAnswerXpath).getText() || ''
  }

  return bot
}

module.exports.init = function () {
  return new Bot()
}
