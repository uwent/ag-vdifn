class DbController < ApplicationController
  
  def severities
    severities = ["#00c957", ""]

    (42.4..47.3).step(0.1) do |lat| 
      (-92.8..-86.3).step(0.1) do |long| 
        severities << {
          lat: lat.round(1),
          long: long.round(1),
          severity: Random.rand(5) 
        }
      end
    end

    render json: severities
  end
end
