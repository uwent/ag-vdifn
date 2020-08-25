require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module RailsApp
  class Application < Rails::Application
    config.load_defaults "6.0"
    # config.autoload_paths += Dir[Rails.root.join('app', 'models', 'degree_day_pests')]
    # config.autoload_paths += Dir[Rails.root.join('app', 'models', 'dsv_pests')]
  end
end
