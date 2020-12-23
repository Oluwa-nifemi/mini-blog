require('dotenv').config();

const {promisify} = require('util');
const fs = require('fs');

const Handlebars = require('handlebars');
const axios = require('axios');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

Promise.all([
  readFile('blog-posts-template.hbs', 'utf8'),
  readFile('post-template.hbs', 'utf8'),
]).then(async ([listPostsFile, postFile ]) => {
  const response = await axios(`${process.env.GHOST_API_URL}/api/v3/content/posts?key=${process.env.GHOST_API_KEY}`);

  const posts = response.data.posts;

  const template = Handlebars.compile(postFile);
  const listPostsTemplate = Handlebars.compile(listPostsFile);

  const postsHtml = listPostsTemplate({
    posts
  })

  await writeFile('pages/posts.html', postsHtml)

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
