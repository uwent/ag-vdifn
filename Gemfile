source "https://rubygems.org"

gem "rails", "~> 7.1"
gem "railties", "~> 7.1"
gem "activesupport", "~> 7.1"
gem "pg"
gem "httparty"
gem "vite_rails"
gem "sassc-rails"
gem "jsbundling-rails"
gem "terser"
gem "csv" # no longer default gem, but it's being loaded by a gem and throwing a warning

group :development do
  gem "puma"
  gem "capistrano"
  gem "capistrano-bundler"
  gem "capistrano-rails"
  gem "capistrano-rbenv"
  gem "web-console"
  gem "standard" # linter
  gem "brakeman" # security analysis https://brakemanscanner.org/
  gem "bundler-audit" # patch-level verification
end

group :development, :test do
  gem "byebug"
  gem "dotenv-rails"
  gem "guard-rspec"
  gem "pry-rails"
  gem "rspec-rails"
  gem "shoulda-matchers"
  gem "spring"
  gem "spring-commands-rspec"
  gem "foreman"
end

group :test do
  gem "simplecov"
  gem "webmock"
end
