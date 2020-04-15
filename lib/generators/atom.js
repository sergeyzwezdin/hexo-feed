const { baseGenerator } = require('./base');

const generator = (hexo) => ({ posts }) => baseGenerator('Atom', hexo, 'atom', 'atom.ejs', posts);

module.exports = generator;
