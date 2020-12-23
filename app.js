require('dotenv').config();

const {promisify} = require('util');
const fs = require('fs');

const Handlebars = require('handlebars');
const axios = require('axios');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

readFile('blog-template.hbs', 'utf8').then(async (file) => {
  console.log(`${process.env.GHOST_API_URL}/api/v3/content/posts?key=${process.env.GHOST_API_KEY}`);
  const response = await axios(`${process.env.GHOST_API_URL}/api/v3/content/posts?key=${process.env.GHOST_API_KEY}`);

  const posts = response.data.posts;

  const template = Handlebars.compile(file);

  await Promise.all(
    posts.map(async post => {
      const html = template({
        title: post.title,
        author: 'Nifemi',
        date: post.published_at,
        content: post.html
      });

      await writeFile(`pages/posts/${post.slug}.html`, html);
    })
  );
});
