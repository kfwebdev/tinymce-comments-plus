module.exports = function( options ) {

    var path = require( 'path' ),
        cssLoaders = 'style!css',
        scssLoaders = cssLoaders + '!sass',
        babelLoader = 'react-hot!babel-loader',
        webpack = require( 'webpack' ),
        ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

    function extractLoaders( extract, loaders ) {
      return ExtractTextPlugin.extract( extract, loaders.substr( loaders.indexOf( '!' ) ) );
    }

    if ( options.build ) {
        cssLoaders = extractLoaders( 'style', cssLoaders );
        scssLoaders = extractLoaders( 'style', scssLoaders );
        //babelLoader = extractLoaders( 'react-hot', babelLoader );
    }


    return {
        entry: [ './js/tinymce-comments-plus.js' ],
        output: {
            path: __dirname + '/../js',
            publicPath: options.build ? '' : 'http://localhost:8080/',
            filename: 'tinymce-comments-plus-bundle.js',
            // hot: true,
            // headers: { 'Access-Control-Allow-Origin': '*' }
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: cssLoaders
                },
                {
                    test: /\.scss$/,
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
            root: [
                path.join( __dirname, '..', 'components' ),
                path.join( __dirname, '..', 'js' ),
                path.join( __dirname, '..', 'sass' ),
            ],
            extensions: [ '', '.js', '.jsx', '.sass', '.scss', '.css' ],
        },
        plugins: options.build ? [
            // build plugins
            new ExtractTextPlugin( './css/[name].css' ),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            //new webpack.HotModuleReplacementPlugin()
        ] : [
            // dev plugins
            new ExtractTextPlugin( './css/[name].css' ),
            //new webpack.HotModuleReplacementPlugin()
        ]
    };
}
