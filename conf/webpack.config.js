module.exports = function( options ) {
    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass';

    return {
        entry: "./entry.js",
        output: {
            path: __dirname + '/dist',
            filename: "bundle.js"
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: cssLoaders
                },
                {
                    test: /\.scss$/,
                    loaders: scssloaders
                }
            ]
        }
    };
}
