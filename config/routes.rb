Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :db, only: :none do
    collection do
      get "disease_panel"
      get "insect_panel"
      get "dd_models"
      post "severity_legend"
      post "severity_legend_info"
      post "pest_info"
    end
  end

  match "/point_details", to: "point_details#index", via: [:get, :post]
  match "/severities", to: "severities#index", via: :post

  get "/?model=:local_name", to: "application#index"
  get "/maps?model=:local_name", to: "application#index"

  # redirect all wayward routes to home
  get "*path", to: redirect("/") unless Rails.env.development?

  root to: "application#index"
end
