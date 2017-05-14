const assert = require('assert')
const shortid = require('shortid')
const imap = require('../check-mail/imap')
const landingPage = require('../pageObjects/landing.page')

const id = shortid.generate()
const auth = {
  username: `mptb-${id}`,
  password: 'qweqweqwe'
}

describe('task #1', function () {
  it('should be possible to create account', function () {
    browser.url('/')

    landingPage.openTab('sign in')

    landingPage.tabSignIn.fillRegisterForm(Object.assign({}, auth, {
      fullname: 'mac.paw.test.bot',
      email: `mac.paw.test.bot+${id}@gmail.com`,
      terms: 'yes'
    }))
    landingPage.tabSignIn.signUp()
    assert.ok(landingPage.tabSignIn.getSignUpMessage().includes('We have sent you an email'), 'No signup message')
  })

  it('verification link should be sent', function () {
    let url = null
    browser.call(async function () {
      url = await imap.waitForEmail(id, 5000, 2)
    })
    assert.notEqual(url, null, 'No verification email was sent!')

    browser.url(url)
    landingPage.waitForTab('sign in', true)
    assert.equal(landingPage.tabSignIn.getSignInMessage(), 'account verified, please sign in')
  })

  it('should be possible to sign in', function () {
    landingPage.tabSignIn.fillSigninForm(auth)
    landingPage.tabSignIn.signIn()

    landingPage.waitForTab(auth.username, false)
  })

  it('should be possible to chat with a bot', function () {
    let botMsgs = ['When are you there?', 'Tell me your story!', 'More!']

    botMsgs.forEach(msg => {
      landingPage.bot.sendMsg(msg)
      assert.equal(landingPage.bot.getAnswer().length > 1, true, 'Got no answer from bot.')
    })

    // todo: assert full conversation
  })
})
