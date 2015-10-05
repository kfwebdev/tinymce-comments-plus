module.exports = function( options ) {
    var excludePath = '/node_modules/',
        cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass',
        babelLoader = 'babel-loader',
        ExtractTextPlugin = require("extract-text-webpack-plugin");

    function extractLoaders( loaders ) {
      return ExtractTextPlugin.extract( 'style', loaders.substr( loaders.indexOf( '!' ) ) );
    }

    if ( options.build ) {
        cssLoaders = extractLoaders( cssLoaders );
        scssLoaders = extractLoaders( scssLoaders );
    }

    return {
        entry: './js/tinymce-comments-plus.js',
        output: {
            path: __dirname + '/../js',
            publicPath: 'http://localhost:8080/',
            filename: 'tinymce-comments-plus-bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    exclude: excludePath,
                    loader: cssLoaders
                },
                {
                    test: /\.scss$/,
                    exclude: excludePath,
                    loader: scssLoaders
                },
                {
                    test: /\.js$/,
                    exclude: excludePath,
                    loader: babelLoader
                },
                {
                    test: /\.jsx$/,
                    exclude: excludePath,
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
