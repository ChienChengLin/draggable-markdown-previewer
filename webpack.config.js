const path = require('path');
const webpack = require('webpack');

const htmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPluginConfig = new htmlWebpackPlugin({
	template: `${__dirname}/src/index.html`,
	filename: 'index.html',
	inject: 'body',
});

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',
	output: {
		filename: 'index.bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env', '@babel/preset-react'],
                    }
                }
            },
			{
				test: /\.css$/,
				use: [
				  {
				    loader: 'style-loader'
				  },
				  {
				    loader: 'css-loader'
				  }
				]
			},
			{
				test: /\.(scss|sass)$/,
				use: [
				  {
				    loader: 'style-loader'
				  },
				  {
				    loader: 'css-loader'
				  },
				  {
					loader: 'postcss-loader', // Run post css actions
					options: {
						plugins: function () { // post css plugins, can be exported to postcss.config.js
						  return [
						    require('precss'),
						    require('autoprefixer')
						  ];
						}
					}
				  },
				  {
				    loader: 'sass-loader'
				  }
				]
			}
        ]
    },
    devServer: {
    	inline: true,
    	port: 8080,
    },
    plugins: [
    	htmlWebpackPluginConfig,
    	new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ]
}