const { baseGenerator } = require('./base');

const generator = (hexo) => (locals) => baseGenerator('Atom', hexo, 'atom', 'atom.ejs', locals);

module.exports = generator;
