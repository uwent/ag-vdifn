require "spec_helper"

RSpec.describe DegreeDay, type: :model do
  let(:today) { Date.today }
  let(:dd1) { DegreeDay.new(remote_name: "dd_50_none", t_min: 50, t_max: nil) }
  let(:dd2) { DegreeDay.new(remote_name: "dd_50_86", t_min: 50, t_max: 86) }

  it "creates a formatted name in Fahrenheit" do
    expect(dd1.name).to eq "Base 50°F"
    expect(dd2.name).to eq "Base 50°F, Upper 86°F"
  end

  it "creates a formatted name in Celsius" do
    expect(dd1.name_c).to eq "Base 10°C"
    expect(dd2.name_c).to eq "Base 10°C, Upper 30°C"
  end
end
