class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
    begin
      model = params[:model]
      Rails.logger.debug ">> Application#index ==> Launching with model: #{model}"
      pest = Pest.where(local_name: model).first
      if pest
        Rails.logger.debug ">> Pest found! ID: #{pest.id}, Name: #{pest.name}"
      else
        Rails.logger.debug ">> No matching pest found for model: #{model}"
      end
    end
  end
  
end
