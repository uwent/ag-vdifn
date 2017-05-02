class DegreeDayPest < Pest

  def severities(start_date, end_date)
    url = "#{REMOTE_HOST}/degree_days/totals?start_date=#{start_date}&end_date=#{end_date}&pest=#{remote_name}"

    puts url
    begin
      response = HTTParty.get(url, { timeout: 10 })
      return severities_from_totals(JSON.parse(response.body))
    rescue Exception => e
      logger.error(e.backtrace.join("\n"))
      return []
    end

  end

  def biofix_date
    Date.current.beginning_of_year
  end

  private
  def total_to_severity(total)
    return 5 if (total >= critical_value * 0.95 && total <= critical_value * 1.05)
    return 4 if (total >= critical_value * 0.90 && total <= critical_value * 1.1)
    return 3 if (total >= critical_value * 0.85 && total <= critical_value * 1.15)
    return 2 if (total >= critical_value * 0.80 && total <= critical_value * 1.2)
    return 1
  end

  def severities_from_totals(totals)
    totals.map do | measurement |
      { latitude: measurement['latitude'],
        longitude: measurement['longitude'],
        severity: total_to_severity(measurement['total'].to_f)
      }
    end
  end
end
