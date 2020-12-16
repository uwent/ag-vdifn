Rails.application.routes.draw do
  resources :db, only: [:index], export: true do
    collection do
      post 'severities'
      post 'point_details'
      post 'severity_legend'
      post 'severity_legend_info'
      post 'pest_info'
      post 'stations'
      post 'station_details'
      get 'disease_panel'
      get 'insect_panel'
    end
  end

  # get 'service-worker.js', to: 'service_worker#index'

  get '/maps', to: "application#index"
  root to: "application#index"
end
