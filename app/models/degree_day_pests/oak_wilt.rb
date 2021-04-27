# The oak wilt model tracks the combined abundance of two beetle vectors
# See Jagemann et al 2018

class OakWilt < DegreeDayPest

  def total_to_severity(total, freezing)
    return 0 if freezing
    return 4 if total.between?(215.8, 1461.8) # 25-75% emergence
    return 3 if total.between?(157.4, 1789.7) # 10-90% emergence
    return 2 if total.between?(128.3, 2343.5) # 5-95% emergence
    return 1 if total > 50
    return 0
  end

  def severity_legend
    [
      {name: "Very High", slug: "very_high", description: "Very high risk of oak wilt (25-75% beetle flight)"},
      {name: "High", slug: "high", description: "High risk of oak wilt (10-25% or 75-90% beetle flight)"},
      {name: "Medium", slug: "medium", description: "Medium risk of oak wilt (5-10% or 90-95% beetle flight)"},
      {name: "Low", slug: "low", description: "Low risk of oak wilt (<5% or >95% beetle flight)"},
      {name: "Very Low", slug: "very_low", description: "Very low risk of oak wilt"}
    ]
  end

end
