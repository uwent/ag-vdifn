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
    pest = $('#pest-select-' + init_crop_id)
    this.change_pest(pest, (pest_info) =>
      start_date = moment((new Date()).getFullYear() + "0101", "YYYYMMDD").toDate()
      this.reload_map()
      this.add_date_tooltip()
    )

    $('#crop-select').on 'change', (event) =>
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

  change_pest_info: (pest, title, new_info) ->
    $(pest).parent()
      .find('span')
      .remove()
    $(pest).parent()
      .append('<span class="more-information" title="" id="infliction-select-information">?</span>')
      .qtip(
        content:
          text: new_info
          title: title
        hide:
          fixed: true
        style:
          classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'
        position:
          my: 'left center'
          at: 'bottom right'
      )

  change_pest: (pest, callback) ->
    pest_id = $(pest).val()
    Database.fetchPestInfo(pest_id, !@in_fahrenheit, (pest_info) =>
      this.change_pest_info(pest, pest_info.name, pest_info.info)
      this.change_start_date(new Date(moment(pest_info.biofix)))
      this.toggle_end_date(pest_info.end_date_enabled)
      if callback
        callback(pest_info)
    )

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

  add_date_tooltip: ->
    $('#datepicker').find('.more-information').qtip(
      content: ->
        $(this).data("tooltip")
      style:
        classes: 'qtip-light qtip-rounded qtip-shadow qtip-vdifn'
    )

class @InsectOptions extends Options
  constructor: (map) ->
    @in_fahrenheit = true
    super
    $('#in-fahren').change (evt) =>
      @in_fahrenheit = $(evt.target).is(':checked')
      this.change_tmin($('#tmin').val())
      this.change_tmax($('#tmax').val())

  change_pest: (pest, callback) ->
    super(pest, (pest_info) =>
      this.change_tmin(pest_info.tmin)
      this.change_tmax(pest_info.tmax)
      if callback
        callback(pest_info)
    )

  change_tmin: (new_tmin) ->
    $('#tmin').val(this.convert_temp(new_tmin))

  change_tmax: (new_tmax) ->
    $('#tmax').val(this.convert_temp(new_tmax))

  convert_temp: (value) ->
    if value != '' && value != 'None'
      if @in_fahrenheit
        Temperature.to_f(value)
      else
        Temperature.to_c(value)
    else
      'None'
