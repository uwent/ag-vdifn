class @Database
  @fetchSeverities: (start_date, end_date, type, callback) =>
    $.ajax
      url: Routes.severities_db_index_path()
      data:
        start_date: start_date
        end_date: end_date
        pest_id: type
      type: 'POST'
      dataType: 'json'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)

  @fetchSeverityLegend: (type) =>
    $.ajax
      url: Routes.severity_legend_db_index_path()
      data:
        pest_id: type
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        $('#severity-legend').html(data)
        $("#severity-legend").find(".more-information").tooltip(
          content: ->
            $(this).data("tooltip")
        )


  @fetchPointDetails: (lat, long, start_date, end_date, pest, callback) =>
    $.ajax
      url: Routes.point_details_db_index_path()
      data:
        latitude: lat
        longitude: long
        start_date: start_date
        end_date: end_date
        pest_id: pest
      type: 'POST'
      dataType: 'html'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)

  @fetchPestInfo: (pest, callback) =>
    $.ajax
      url: Routes.pest_info_db_index_path()
      data:
        pest_id: pest
      type: 'POST'
      dataType: 'json'
      error: (jqxhr, textstatus, errorthrown) ->
        $('body').append "ajax error: #{textstatus}"
      success: (data, textStatus, jqXHR) =>
        callback(data)
