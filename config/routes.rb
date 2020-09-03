Rails.application.routes.draw do
  resources :maps, only: [:index] do
    collection do
      post 'sidebar'
    end
  end

  resources :db, only: [:index], export: true do
    collection do
      post 'severities'
      post 'point_details'
      post 'severity_legend'
      post 'pest_info'
      post 'stations'
      post 'station_details'
    end
  end
end
