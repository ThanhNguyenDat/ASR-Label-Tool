const { override, useBabelRc, addWebpackAlias } = require('customize-cra')
const path = require('path');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    addWebpackAlias({
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@routes': path.resolve(__dirname, 'src/routes'),
        '@utils': path.resolve(__dirname, 'src/utils'),
    })
)
