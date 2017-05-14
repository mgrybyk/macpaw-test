const formElement = require('../../elements/form')

const signUpFormXpath = "//form[@id = 'cbsocialsignupform']"
const signUpXpath = ".//input[@type = 'submit' and @value = 'sign up to Cleverbot']"
const signUpFormMessage = ".//p[@id = 'cbsocialmessagesignup']/span"

const signInFormXpath = "//li[@id = 'cbsocialsigninup']//form[contains(@onsubmit, 'signin')]"
const signInXpath = ".//input[@type = 'submit' and @value = 'sign in']"
const signInFormMessage = ".//p[@id = 'cbsocialmessagesignin']/span"

module.exports = {
  fillRegisterForm: function (formData) {
    let form = formElement.init(signUpFormXpath)
    form.fill(formData)
  },
  signUp: function (formData) {
    let form = formElement.init(signUpFormXpath)
    form.submit(signUpXpath)
  },
  getSignUpMessage: function () {
    let form = formElement.init(signUpFormXpath)
    return form.getMessage(signUpFormMessage)
  },

  fillSigninForm: function (formData) {
    let form = formElement.init(signInFormXpath)
    form.fill(formData)
  },
  signIn: function (formData) {
    let form = formElement.init(signInFormXpath)
    form.submit(signInXpath)
  },
  getSignInMessage: function () {
    let form = formElement.init(signInFormXpath)
    return form.getMessage(signInFormMessage)
  }
}
