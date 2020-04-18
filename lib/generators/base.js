const { magenta } = require('chalk');

const path = require('path');

const generateFeed = (render, type, posts, tags, categories, config, renderOptions, context, output, order_by, limit, helpers, log) => {
    log.debug(`Generating ${type}: %s`, magenta(output));

    const publishedPosts = posts
        .filter((post) => post.draft !== true)
        .filter((post) => post.published === undefined || post.published === true);

    const lastPublishedPost = publishedPosts.sort('-date').first();
    const lastPublishedPostDate = lastPublishedPost ? lastPublishedPost.date : helpers.moment();

    let postsToRender = publishedPosts.sort(order_by || config.feed.order_by || '-date');

    if (limit) {
        postsToRender = postsToRender.limit(limit);
    }

    return render
        .render(renderOptions, {
            ...helpers,
            ...{
                tag: undefined,
                category: undefined,
                ...context
            },
            lastBuildDate: lastPublishedPostDate,
            posts: postsToRender.toArray(),
            tags: tags.toArray(),
            categories: categories.toArray(),
            config: config
        })
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

const baseGenerator = (type, hexo, generatorConfig, packageTemplateName, { posts, tags, categories }) => {
    const { config, render, log } = hexo;
    const { template, output, order_by, limit } = config.feed[generatorConfig];
    const { tag_dir, category_dir } = config.feed;

    const isTagGeneratingEnabled = Boolean(tag_dir);
    const isCategoryGeneratingEnabled = Boolean(category_dir);

    const helpers = Object.keys(hexo.extend.helper.store).reduce((result, name) => {
        result[name] = hexo.extend.helper.get(name).bind({ ...hexo, page: {} });
        return result;
    }, {});

    const itemCount = limit || config.feed.limit;

    const renderOptions = template ? { path: template } : { path: path.resolve(__dirname, '../templates', packageTemplateName) };

    const postsByTag = isTagGeneratingEnabled
        ? tags
              .toArray()
              .map(({ name }) =>
                  String(name || '')
                      .trim()
                      .toLowerCase()
              )
              .map((tagName) => ({
                  type: `${type} (tag: ${tagName})`,
                  context: {
                      tag: tagName
                  },
                  posts: posts.filter(
                      (post) =>
                          post.tags
                              .toArray()
                              .map(({ name }) =>
                                  String(name || '')
                                      .trim()
                                      .toLowerCase()
                              )
                              .indexOf(tagName) !== -1
                  ),
                  output: path.join(tag_dir, tagName, output)
              }))
        : [];

    const postsByCategory = isCategoryGeneratingEnabled
        ? categories
              .toArray()
              .map(({ name }) =>
                  String(name || '')
                      .trim()
                      .toLowerCase()
              )
              .map((categoryName) => ({
                  type: `${type} (category: ${categoryName})`,
                  context: {
                      category: categoryName
                  },
                  posts: posts.filter(
                      (post) =>
                          post.categories
                              .toArray()
                              .map(({ name }) =>
                                  String(name || '')
                                      .trim()
                                      .toLowerCase()
                              )
                              .indexOf(categoryName) !== -1
                  ),
                  output: path.join(category_dir, categoryName, output)
              }))
        : [];

    return Promise.all([
        generateFeed(render, type, posts, tags, categories, config, renderOptions, {}, output, order_by, itemCount, helpers, log),
        ...postsByTag.map(({ type, context, posts, output }) =>
            generateFeed(render, type, posts, tags, categories, config, renderOptions, context, output, order_by, itemCount, helpers, log)
        ),
        ...postsByCategory.map(({ type, context, posts, output }) =>
            generateFeed(render, type, posts, tags, categories, config, renderOptions, context, output, order_by, itemCount, helpers, log)
        )
    ]).then((results) => results.reduce((result, current) => [...result, ...current], []));
};

module.exports = { baseGenerator };
