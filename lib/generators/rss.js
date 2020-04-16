const { baseGenerator } = require('./base');

const generator = (hexo) => (locals) => baseGenerator('RSS', hexo, 'rss', 'rss.ejs', locals);

module.exports = generator;
