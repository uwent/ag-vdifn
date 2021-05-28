require "spec_helper"

today = Date.today

RSpec.describe Insect, type: :model do
  pest = Insect.create!(
    name: "bug",
    biofix_mm: 1, biofix_dd: 1,
    risk_start: 100, risk_peak: 200, risk_end: 300
  )

  it "returns 0 when freezing" do
    expect(pest.total_to_severity(100, true, today)).to eq(0)
  end

  it "creates severity levels from risk points" do
    expect(pest.total_to_severity(50, false, today)).to eq(0)
    expect(pest.total_to_severity(101, false, today)).to eq(1)
    expect(pest.total_to_severity(200, false, today)).to eq(4)
    expect(pest.total_to_severity(299, false, today)).to eq(1)
    expect(pest.total_to_severity(350, false, today)).to eq(0)
  end
end