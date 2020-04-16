const { magenta } = require('chalk');

const path = require('path');

const baseGenerator = (type, hexo, generatorConfig, packageTemplateName, { posts, tags, categories }) => {
    const { config, render, log } = hexo;
    const { template, output, order_by, limit } = config.feed[generatorConfig];

    const helpers = Object.keys(hexo.extend.helper.store).reduce((result, name) => {
        result[name] = hexo.extend.helper.get(name).bind({ ...hexo, page: {} });
        return result;
    }, {});

    log.debug(`Generating ${type}: %s`, magenta(output));

    let items = posts
        .sort(order_by || config.feed.order_by || '-date')
        .filter((post) => post.draft !== true)
        .filter((post) => post.published === undefined || post.published === true);

    const itemCount = limit || config.feed.limit;
    if (itemCount) {
        items = items.limit(itemCount);
    }

    const lastPublishedPost = posts
        .sort('-date')
        .filter((post) => post.draft !== true)
        .filter((post) => post.published === undefined || post.published === true)
        .first();

    const lastPublishedPostDate = lastPublishedPost ? lastPublishedPost.date : helpers.moment();

    return render
        .render(
            template
                ? {
                      path: template
                  }
                : {
                      path: path.resolve(__dirname, '../templates', packageTemplateName)
                  },
            {
                ...helpers,
                lastBuildDate: lastPublishedPostDate,
                posts: items.toArray(),
                tags: tags.toArray(),
                categories: categories.toArray(),
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
