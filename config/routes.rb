Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  resources :cards

  resources :kanjis, only: [:index, :show]
  resources :decks
  # Defines the root path route ("/")
  # root "posts#index"
  get 'dashboard', to: 'dashboard#index', as: :dashboard

  get 'maps', to: 'maps#index', as: :maps
  get 'maps/all_kanji_map', to: 'maps#all_kanji_map', as: :all_kanji_map

  get "capture" => 'cards#capture', as: :capture
  post "capture" => 'cards#new_capture', as: :new_capture
  # maybe we don't need the line below?
  post "/new_capture", to: "cards#new_capture"
end
