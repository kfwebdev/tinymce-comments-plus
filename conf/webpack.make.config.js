module.exports = function( options ) {

    var cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass',
        babelLoader = 'react-hot!babel-loader',
        //webpack = require( 'webpack' ),
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
            filename: 'tinymce-comments-plus-bundle.js',
            hot: true,
            headers: { 'Access-Control-Allow-Origin': '*' }
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
            new ExtractTextPlugin( './css/[name].css' ),
            //new webpack.HotModuleReplacementPlugin()
        ]
    };
}
