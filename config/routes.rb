Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :db, only: [:index], export: true do
    collection do
      post "point_details"
      post "severity_legend"
      post "severity_legend_info"
      post "pest_info"
      # post "stations"
      # post "station_details"
      get "disease_panel"
      get "insect_panel"
      get "dd_models"
    end
  end

  # resources :severities, only: :index, via: :post, export: true

  match "/severities", to: "severities#index", via: :post, export: true

  # get 'service-worker.js', to: 'service_worker#index'

  get "/?model=:local_name", to: "application#index"
  get "/maps?model=:local_name", to: "application#index"

  root to: "application#index"

  # redirect all wayward routes to home
  get "*path", to: redirect("/")
end
