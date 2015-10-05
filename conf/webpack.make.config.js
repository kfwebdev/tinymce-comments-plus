module.exports = function( options ) {
    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass',
        babelLoader = 'babel-loader',
        ExtractTextPlugin = require("extract-text-webpack-plugin");

    function extractLoaders( loaders ) {
      return ExtractTextPlugin.extract( 'style', loaders.substr( loaders.indexOf( '!' ) ) );
    }

    if ( options.production ) {
        cssLoaders = extractLoaders( cssLoaders );
        scssLoaders = extractLoaders( scssLoaders );
    }

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
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: babelLoader
                },
                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    loader: babelLoader
                }
            ]
        },
        resolve: {
            extensions: [ '', '.js', '.jsx', '.sass', '.scss', '.css' ]
        },
        plugins: [
            new ExtractTextPlugin( './css/[name].css' )
        ]
    };
}
