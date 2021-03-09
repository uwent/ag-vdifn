require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module AgVDIFN
  class Application < Rails::Application
    config.load_defaults 6.0
    config.time_zone = 'Central Time (US & Canada)'
    config.eager_load_paths += %W(#{Rails.root}/app/models/dsv_pests)
    config.eager_load_paths += %W(#{Rails.root}/app/models/degree_day_pests)
  end
end
