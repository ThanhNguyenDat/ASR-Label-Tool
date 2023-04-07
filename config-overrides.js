const { override, useBabelRc, addWebpackAlias } = require('customize-cra')
const path = require('path');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    addWebpackAlias({
        '@components': path.resolve(__dirname, 'src/components/'),
        '@containers': path.resolve(__dirname, 'src/containers/'),
        '@redux': path.resolve(__dirname, 'src/redux/'),
        '@services': path.resolve(__dirname, 'src/services/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
        '@constants': path.resolve(__dirname, 'src/constants/'),
        '@helpers': path.resolve(__dirname, 'src/helpers/'),
        '@resources': path.resolve(__dirname, 'src/resources/'),
    })
)