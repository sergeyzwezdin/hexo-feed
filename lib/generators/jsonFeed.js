const { baseGenerator } = require('./base');

const generator = (hexo) => (locals) => baseGenerator('JSON Feed', hexo, 'jsonFeed', 'json.ejs', locals);

module.exports = generator;
