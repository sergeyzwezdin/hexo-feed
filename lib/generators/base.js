const { magenta } = require('chalk');

const fs = require('fs');
const path = require('path');

const baseGenerator = (type, hexo, generatorConfig, packageTemplateName, posts) => {
    const { config, render, log } = hexo;
    const { template, output, order_by, limit } = config.feed[generatorConfig];

    log.debug(`Generating ${type}: %s`, magenta(output));

    let items = posts
        .sort(order_by || config.feed.order_by || '-date')
        .filter((post) => post.draft !== true)
        .filter((post) => post.published === undefined || post.published === true);

    const itemCount = limit || config.feed.limit;
    if (itemCount) {
        items = items.limit(itemCount);
    }

    return render
        .render(
            template
                ? {
                      path: template
                  }
                : {
                      text: fs.readFileSync(path.resolve(__dirname, '../templates', packageTemplateName), 'utf-8'),
                      engine: 'ejs'
                  },
            {
                posts: items.toArray(),
                config: config
            }
        )
        .then((content) => {
            log.debug(`${type} generated: %s`, magenta(output));
            return [
                {
                    path: output,
                    data: content
                }
            ];
        });
};

module.exports = { baseGenerator };
