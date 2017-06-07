class @Options
  constructor: (map) ->
    @map = map
    @startPicker = Options.createDatePicker(
      defaultDate: moment().subtract(7,'d').toDate()
      minDate: new Date(2014, 4, 16)
      field: $('#datepicker-start')[0]
      onSelect: =>
        this.change_end_date(@startPicker.getDate())
    )

    @endPicker = Options.createDatePicker(
      defaultDate: new Date()
      minDate: @startPicker.getDate()
      field: $('#datepicker-end')[0]
    )
    init_crop_id = $('#crop-select')[0].value
    pest = $('#pest-select-' + init_crop_id)[0]
    this.change_pest(pest)
    start_date = moment((new Date()).getFullYear() + "0101", "YYYYMMDD").toDate()
    this.reload_map()

    $('#crop-select').on 'change', (event) =>
      console.log("In change crop-select")
      crop_id = $(event.target).val()
      crop_select_wrapper = "#select-" + crop_id
      $(".infliction").hide()
      $(crop_select_wrapper).show()
      this.change_pest($('#pest-select-' + crop_id)[0])

    $(".infliction-select").on 'change', (event) =>
      this.change_pest($(event.target))

    $('#change-params').on 'click', =>
      this.reload_map()

  change_end_date: (start_date) ->
    maxDate = new Date()

    @endPicker.setMinDate(start_date)
    @endPicker.setMaxDate(maxDate)

    if $('#datepicker-end').prop('disabled')
      @endPicker.setDate(moment(start_date).add(7, 'd').toDate())

    if (@endPicker.getDate() < start_date)
      @endPicker.setDate(start_date)

    if (@endPicker.getDate() > maxDate)
      @endPicker.setDate(maxDate)
    
  reload_map: ->
    crop = $('#crop-select')[0].value
    pest = $('#pest-select-' + crop)[0].value
    @map.reload(@startPicker.getMoment().format('YYYY-MM-DD'),
      @endPicker.getMoment().format('YYYY-MM-DD'),
      pest)
  
  change_pest_info: (pest, new_info) ->
    $(pest).parent()
      .find('span')
      .remove()
    $(pest).parent()
      .append('<span class="more-information" title="" id="infliction-select-information">?</span>')
      .tooltip(content: new_info)

  change_pest: (pest) ->
    console.log("In change_pest")
    pest_id = $(pest).val()
    Database.fetchPestInfo(pest_id, (pest_info) =>
      this.change_pest_info(pest, pest_info.info)
      this.change_pest_info_link(pest_info.pest_link)
      this.change_start_date(new Date(moment(pest_info.biofix)))
      this.toggle_end_date(pest_info.end_date_enabled)
    )
  
  change_pest_info_link: (new_link) ->
    $('#more-information-link').attr('href', "http://" + new_link)

  toggle_end_date: (enabled) ->
    if enabled
      $('#datepicker-end').prop('disabled', false)
    else
      $('#datepicker-end').prop('disabled', true)

  @createDatePicker: (options) ->
    defaultOptions =
      setDefaultDate: true
      maxDate: new Date()
      format: 'MMMM D, YYYY'
      onClose: () ->
        this.config().field.blur()
    return new Pikaday($.extend({}, options || {}, defaultOptions), false, false)

  change_start_date: (new_date) ->
    if new_date > new Date()
      @startPicker.setDate(moment().subtract(7,'d').toDate())
    else
      @startPicker.setDate(new_date)
