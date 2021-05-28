require "spec_helper"

today = Date.today

RSpec.describe Insect2, type: :model do
  pest = Insect2.create!(
    name: "bug",
    biofix_mm: 1, biofix_dd: 1,
    risk_start: 100, risk_peak: 200, risk_end: 300,
    risk_start2: 400, risk_peak2: 500, risk_end2: 600
  )

  it "returns 0 when freezing" do
    expect(pest.total_to_severity(100, true, today)).to eq(0)
  end

  it "creates severity levels from first risk points" do
    expect(pest.total_to_severity(50, false, today)).to eq(0)
    expect(pest.total_to_severity(110, false, today)).to eq(1)
    expect(pest.total_to_severity(200, false, today)).to eq(4)
    expect(pest.total_to_severity(290, false, today)).to eq(1)
    expect(pest.total_to_severity(350, false, today)).to eq(0)
  end

  it "creates severity levels from second risk points" do
    expect(pest.total_to_severity(350, false, today)).to eq(0)
    expect(pest.total_to_severity(410, false, today)).to eq(1)
    expect(pest.total_to_severity(500, false, today)).to eq(4)
    expect(pest.total_to_severity(590, false, today)).to eq(1)
    expect(pest.total_to_severity(650, false, today)).to eq(0)
  end
end