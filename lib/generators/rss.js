const { baseGenerator } = require('./base');

const generator = (hexo) => ({ posts }) => baseGenerator('RSS', hexo, 'rss', 'rss.ejs', posts);

module.exports = generator;
