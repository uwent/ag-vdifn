class @Temperature
  @to_c: (in_f) ->
    Temperature.to_tenths((in_f - 32) * 5.0/9.0)

  @to_f: (in_c) ->
    Temperature.to_tenths((in_c * 9.0/5.0) + 32.0)

  @to_tenths: (num) ->
    new_num = Math.round(num * 10)
    if new_num % 10 == 0
      new_num/10 + ".0"
    else
      new_num/10
      
