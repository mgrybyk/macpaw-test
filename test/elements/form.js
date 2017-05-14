
function Form (xpath) {
  let form = this
  browser.waitForExist(xpath)
  form.rootElement = browser.element(xpath)

  form.fill = formData => {
    Object.keys(formData).forEach(name => {
      let value = formData[name]
      let element = form.rootElement.element(`./*[@name = '${name}']`)
      let tagName = element.getTagName()

      if (tagName === 'input') {
        let inputType = element.getAttribute('type')
        if (inputType === 'password') {
          // password
          form.rootElement.element("./input[@class = 'passwordclear']").click()
          element.setValue(value)
        } else if (inputType === 'text') {
          // text
          element.setValue(value)
        } else {
          throw Error('Form: unsupported input type')
        }
      } else if (tagName === 'select') {
        // select
        element.selectByVisibleText(value)
      } else {
        throw Error('Form: unsupported element tag')
      }
    })
  }

  form.getMessage = xpath => {
    form.rootElement.waitForExist(xpath)
    return form.rootElement.element(xpath).getText()
  }

  form.submit = xpath => form.rootElement.element(xpath).click()

  return form
}

module.exports.init = xpath => new Form(xpath)
