hexo.config.feed = Object.assign(
    {
        order_by: '-date',
        limit: 0,
        tag_dir: 'tag',
        category_dir: 'category',
        rss: {
            enable: true,
            output: 'rss.xml',
            order_by: '-date',
            limit: 0
        },
        atom: {
            enable: true,
            output: 'atom.xml',
            order_by: '-date',
            limit: 0
        },
        jsonFeed: {
            enable: true,
            output: 'feed.json',
            order_by: '-date',
            limit: 0
        }
    },
    hexo.config.feed
);

if (hexo.config.feed.rss.enable) {
    hexo.extend.generator.register('rss', require('./lib/generators/rss')(hexo));
}

if (hexo.config.feed.atom.enable) {
    hexo.extend.generator.register('atom', require('./lib/generators/atom')(hexo));
}

if (hexo.config.feed.jsonFeed.enable) {
    hexo.extend.generator.register('jsonFeed', require('./lib/generators/jsonFeed')(hexo));
}
