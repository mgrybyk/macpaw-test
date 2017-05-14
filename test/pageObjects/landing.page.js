const Page = require('./page')
const TabSignIn = require('./tabs/sign.in')
const Bot = require('../elements/bot')

var LandingPage = Object.create(Page, {
  getTab: {
    value: function (tabName) {
      let xpath = `//div[@id='cbsocial']//li/span[text() = '${tabName}']`
      browser.waitForExist(xpath, 10000)
      return browser.element(xpath)
    }
  },
  isTabActive: {
    value: function (tab) {
      let className = tab.element('./ancestor::li').getAttribute('class')
      return className.includes('stuck') && className.includes('show')
    }
  },

  openTab: {
    value: function (tabName) {
      let tab = this.getTab(tabName)
      browser.waitUntil(() => {
        tab.click()
        return this.isTabActive(tab)
      }, `Unable to open tab: ${tab}`)
    }
  },
  waitForTab: {
    value: function (tabName, active) {
      let tab = this.getTab(tabName)
      browser.waitUntil(() => {
        return active ? this.isTabActive(tab) : !this.isTabActive(tab)
      }, `Tab is ${active ? 'not' : ''} opened: ${tab}`)
    }
  },

  bot: {
    get: function () {
      let bot = Bot.init()
      return {
        sendMsg (text) { bot.sendMsg(text) },
        getAnswer () { return bot.getLastResponse() }
      }
    }
  },

  tabSignIn: { get: () => TabSignIn }
})
module.exports = LandingPage
