const { baseGenerator } = require('./base');

const generator = (hexo) => ({ posts }) => baseGenerator('JSON Feed', hexo, 'jsonFeed', 'json.ejs', posts);

module.exports = generator;
