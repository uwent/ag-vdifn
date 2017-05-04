class FoliarDisease < DsvPest

  def total_to_severity(total)
    if total >= 20
      return 4
    elsif total >= 15
      return 3
    elsif total >= 10
      return 2
    elsif total >= 5
      return 1
    else
      return 0
    end
  end
end
