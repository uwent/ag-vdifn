require "spec_helper"

today = Date.today

RSpec.describe Insect, type: :model do
  pest = Insect.create!(
    name: "bug",
    biofix_mm: 1, biofix_dd: 15,
    risk_array: [[100, 200, 300]]
  )

  pest2 = Insect.create!(
    name: "long bug",
    biofix_mm: 2, biofix_dd: 15,
    risk_array: [
      [100, 200, 300],
      [500, 600, 700]
    ]
  )

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "returns 0 when freezing" do
    expect(pest.total_to_severity(100, true, today)).to eq(0)
  end

  it "creates severity levels from risk points" do
    expect(pest.total_to_severity(50, false, today)).to eq(0)
    expect(pest.total_to_severity(125, false, today)).to eq(1)
    expect(pest.total_to_severity(200, false, today)).to eq(4)
    expect(pest.total_to_severity(275, false, today)).to eq(1)
    expect(pest.total_to_severity(350, false, today)).to eq(0)
  end

  it "creates severity levels for multiple generations" do
    expect(pest2.total_to_severity(50, false, today)).to eq(0)
    expect(pest2.total_to_severity(200, false, today)).to eq(4)
    expect(pest2.total_to_severity(400, false, today)).to eq(0)
    expect(pest2.total_to_severity(600, false, today)).to eq(4)
    expect(pest2.total_to_severity(800, false, today)).to eq(0)
  end

  it "creates biofix dates" do
    expect(pest.biofix_date).to eq(Date.new(Date.current.year, 1, 15))
    expect(pest2.biofix_date).to eq(Date.new(Date.current.year, 2, 15))
  end
end
