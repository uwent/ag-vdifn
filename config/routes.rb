Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :db, only: :none do
    collection do
      get "disease_panel"
      get "insect_panel"
      get "dd_models"
      get "severity_legend"
      get "severity_legend_info"
    end
  end

  get "/point_details" => "point_details#index"
  post "/severities" => "severities#index"

  # redirect all wayward routes to home
  get "*path" => redirect("/vdifn") unless Rails.env.development?

  root to: "application#index"
end
