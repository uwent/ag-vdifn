class Pest < ActiveRecord::Base
  REMOTE_HOST = ENV['AG_WEATHER_BASE_URL'] || 'http://localhost:3000'

  has_many :crop_pests, dependent: :destroy
  has_many :crops, through: :crop_pests

  def get_remote_totals(start_date, end_date)
    url = "#{REMOTE_HOST}/pest_forecasts?start_date=#{start_date}&end_date=#{end_date}&pest=#{remote_name}"

    puts url
    begin
      response = HTTParty.get(url, { timeout: 10 })
      return JSON.parse(response.body)
    rescue Exception => e
      logger.error(e.backtrace.join("\n"))
      return []
    end
  end

  def severities(start_date, end_date)
    response = get_remote_totals(start_date, end_date)
    return severities_from_totals(response)
  end

  def severities_from_totals(totals)
    totals.map do | measurement |
      { lat: measurement['lat'],
        long: measurement['long'],
        severity: total_to_severity(measurement['total'].to_f)
        #severity: rand(5)
      }
    end
  end

  def total_to_severity(total)
    return 0
  end
end
