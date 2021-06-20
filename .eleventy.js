module.exports = function (config) {
    config.addPassthroughCopy("./assets");
    return {
        dir: {
            output: "docs"
          }
    };
};