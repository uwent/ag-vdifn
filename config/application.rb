require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module RailsApp
  class Application < Rails::Application
    config.load_defaults "6.0"
    config.eager_load_paths += %W(#{Rails.root}/app/models/dsv_pests)
    config.eager_load_paths += %W(#{Rails.root}/app/models/degree_day_pests)
  end
end
