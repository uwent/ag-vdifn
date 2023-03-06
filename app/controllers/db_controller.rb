class DbController < ApplicationController
  def severity_legend
    pest = Pest.find(params[:pest_id])
    @severities = pest.severity_legend
    render json: @severities
  end

  def severity_legend_info
    pest_info = Pest.find(params[:pest_id]).severity_info
    render json: pest_info
  end

  def pest_info
    pest = Pest.find(params[:pest_id])
    in_f = params[:in_fahrenheit]
    info = pest.info
    info.prepend(ActionController::Base.helpers.image_tag(pest.photo, width: "100px")) unless pest.photo.blank?
    info += " <a href=https://#{pest.link} target='_blank'>More information…</a>" unless pest.link.blank?

    tmin = in_f ? pest.t_min : f_to_c(pest.t_min)
    tmax = if pest.t_max.nil?
      ""
    else
      in_f ? pest.t_max : f_to_c(pest.t_max)
    end

    render json: {
      info: info,
      name: pest.name,
      pest_link: pest.link,
      biofix: pest.biofix_date,
      biofix_label: pest.biofix_label,
      end_date_enabled: pest.end_date_enabled,
      tmin:,
      tmax:
    }
  end

  def disease_panel
    @crops = create_crops_for_disease_panel.unshift(create_any_option(Disease))
    render json: @crops, include: {diseases: {methods: [:end_date_enabled, :biofix_date, :biofix_label]}}
  end

  def insect_panel
    @crops = create_crops_for_insect_panel.unshift(create_any_option(Insect))
    render json: @crops, include: {insects: {methods: [:end_date_enabled, :biofix_date, :biofix_label]}}
  end

  def dd_models
    @models = DegreeDay.all.order(:id).select(:id, :name, :remote_name, :t_min, :t_max)
    render json: @models, methods: :name_c
  end

  private

  def create_crops_for_disease_panel
    Crop.includes(:pests).references(:pests).all.select { |crop| crop.diseases.count > 0 }
  end

  def create_crops_for_insect_panel
    Crop.includes(:pests).references(:pests).all.select { |crop| crop.insects }
  end

  def create_any_option(pest_type)
    any_crop = Crop.new(id: 0, name: "Any")
    any_crop.pests = Pest.all.select { |pest| pest.is_a? pest_type }.sort { |x, y| x.name.to_s <=> y.name.to_s }
    any_crop
  end
end
