const Imap = require('imap')
const imapOpts = {
  user: 'mac.paw.test.bot',
  password: 'qweqweqwe',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
}

const fromOpts = ['FROM', 'info@cleverbot.com']

let prefix = ''
let resolver

var imap = new Imap(imapOpts)

imap.on('ready', () => {
  imap.openBox('INBOX', true, (err, box) => {
    if (err) throw err
    imap.search(['UNSEEN', fromOpts, ['TO', `${imapOpts.user}+${prefix}`]], (err, results) => {
      if (err) throw err
      if (results.length === 0) {
        imap.end()
        return resolver(null)
      }
      var f = imap.fetch(results, {
        bodies: ['TEXT'],
        struct: true,
        markSeen: true
      })
      f.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
          let buffer = ''
          stream.on('data', chunk => { buffer += chunk.toString('utf8') })
          stream.once('end', () => {
            resolver(getUrl(buffer))
          })
        })
      })
      f.once('error', err => console.log(err))
      f.once('end', () => imap.end())
    })
  })
})
imap.on('error', err => console.log(err))

function getUrl (str) {
  const re = /<a href="([\s\S]*?)">/g
  let match
  // todo: handle newline
  while (match = re.exec(str)) {
    return match[1]
  }
}

function waitForUrl () {
  // todo: handle errors
  return new Promise(resolve => {
    resolver = resolve
    imap.connect()
  })
}

async function waitForEmail (_prefix, delay, attempts) {
  prefix = _prefix
  let url = null
  url = await waitForUrl()
  while (url === null && attempts > 0) {
    console.log('no mail, attempts left:', attempts)
    attempts--
    await sleep(delay)
    url = await waitForUrl()
  }
  console.log('url:', url)
  return url
}

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
}

module.exports.waitForEmail = waitForEmail
