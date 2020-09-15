/* eslint no-console:0 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import '../../assets/stylesheets/application.scss'

require('@rails/ujs').start()
require("turbolinks").start()

var qtip = require("qtip2")
global.qtip = global.qtip = qtip;

var jQuery = require("jquery")
global.$ = global.jQuery = jQuery;
window.$ = window.jQuery = jQuery;

var moment = require('moment')
global.moment = moment;
window.moment = moment;

import * as coffeScripts from '../coffeescripts/index.js'
