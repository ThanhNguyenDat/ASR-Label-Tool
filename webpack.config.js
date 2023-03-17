const path = require('path');

module.exports = (env) => {
    // use env.<YOUR VARIABLE> hear:
    console.log('Goal: ', env.goal); // 'local'
    console.log('Production: ', env.production); // true

    return {
        // entry: './src/index.js',
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'index.bundle.js',
        },
        devServer: {
            port: 3010,
            contentBase: "./dist",
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ]
                }
            ]
        }
    };
}