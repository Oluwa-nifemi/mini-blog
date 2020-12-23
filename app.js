const {promisify} = require('util')
const fs = require('fs')
const Handlebars = require("handlebars")

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

readFile('blog-template.hbs', 'utf8').then(async (file) => {
  const template = Handlebars.compile(file)

  const html = template({
    title: 'Cat',
    author: 'nifmei',
    date: '20th',
    content: '<p>Every single fight</p>'
  })

  await writeFile('pages/posts/1.html', html)
})
