module.exports = function( options ) {
    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass';

    return {
        entry: './js/tinymce-comments-plus.js',
        output: {
            path: './js',
            publicPath: 'http://localhost:8080/',
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
                    loaders: scssLoaders
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.sass', '.scss', '.css'],
        }
    };
}
