Rails.application.routes.draw do
  get "/", to: redirect('maps')
  resources :db, only: [:index], export: true do
    collection do
      post 'severities'
      post 'point_details'
      post 'severity_legend'
      post 'pest_info'
      post 'stations'
      post 'station_details'
      get 'disease_panel'
      get 'insect_panel'
    end
  end

  get "maps", to: "application#maps"
end
