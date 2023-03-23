class DbController < ApplicationController
  def severity_legend
    legend = Pest.find(params[:pest_id]).severity_legend
    render json: legend
  end

  def severity_legend_info
    info = Pest.find(params[:pest_id]).severity_info
    render json: info
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
    Crop.includes(:pests).references(:pests).all.select { |crop| crop.insects.count > 0 }
  end

  def create_any_option(pest_type)
    any_crop = Crop.new(id: 0, name: "Any")
    any_crop.pests = Pest.all.select { |pest| pest.is_a? pest_type }.sort { |x, y| x.name.to_s <=> y.name.to_s }
    any_crop
  end
end
