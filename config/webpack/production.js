process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.WEBPACKER_ASSET_HOST = '/vdifn/'

const webpackConfig = require('./base')

module.exports = webpackConfig
