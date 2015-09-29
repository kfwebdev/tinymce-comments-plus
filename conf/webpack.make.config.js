module.exports = function( options ) {
    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass';

    return {
        entry: './js/tinymce-comments-plus.js',
        output: {
            path: __dirname + '/../js',
            publicPath: 'http://localhost:8080/',
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    loader: cssLoaders
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    loader: scssLoaders
                }
            ]
        },
        resolve: {
            extensions: [ '', '.js', '.jsx', '.sass', '.scss', '.css' ]
        }
    };
}