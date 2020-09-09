process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.WEBPACKER_ASSET_HOST = '/vdifn/'
const environment = require('./environment')

module.exports = environment.toWebpackConfig()
