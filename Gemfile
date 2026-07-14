source "https://rubygems.org"

gem "rails", "~> 8.0"
gem "railties", "~> 8.0"
gem "activesupport", "~> 8.0"
gem "pg"
gem "httparty"
gem "vite_rails"
gem "sassc-rails"
gem "jsbundling-rails"
gem "terser"
gem "csv" # no longer default gem, but it's being loaded by a gem and throwing a warning
gem "ostruct" # no longer a default gem as of 3.3.6
gem "rack-attack" # rate limiting
gem "redis", "~> 5.0" # caching

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
  gem "ed25519" # for ssh keys
  gem "bcrypt_pbkdf" # for ssh keys
end

group :development, :test do
  gem "dotenv-rails"
  gem "pry-rails"
  gem "rspec-rails"
  gem "shoulda-matchers"
  gem "foreman"
end

group :test do
  gem "simplecov"
  gem "net-pop" # temporarily require to fix gem installation on circleci?
  gem "net-protocol" # temporarily require to fix gem installation on circleci?
  gem "webmock"
end
