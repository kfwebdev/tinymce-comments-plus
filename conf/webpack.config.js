module.exports = function( options ) {
    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass';

    return {
        entry: './bundle.js',
        output: {
            path: __dirname + '/dist',
            publicPath: '',
            filename: 'bundle.js'
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
