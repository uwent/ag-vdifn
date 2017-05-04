class FoliarDisease < DsvPest

  def severities(start_date, end_date)
    url = "#{REMOTE_HOST}/degree_days/totals?start_date=#{start_date}&end_date=#{end_date}&pest=#{remote_name}"


  end

end
