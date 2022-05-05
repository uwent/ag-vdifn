require "spec_helper"

RSpec.describe Insect, type: :model do
  let(:today) { Date.today }
  let(:pest) {
    Insect.new(
      name: "bug",
      biofix_mm: 1, biofix_dd: 15,
      risk_array: [[100, 200, 300]]
    )
  }

  let(:pest2) {
    Insect.new(
      name: "beetle",
      biofix_mm: 2, biofix_dd: 15,
      risk_array: [
        [100, 200, 300],
        [500, 600, 700]
      ]
    )
  }

  let(:grid1) {
    [
      {lat: 1, long: 1, total: rand(500), freeze: 0},
      {lat: 1, long: 1, total: rand(500), freeze: 0},
      {lat: 1, long: 1, total: rand(500), freeze: 0},
      {lat: 1, long: 1, total: rand(500), freeze: 0}
    ]
  }

  let(:grid2) {
    [
      {lat: 1, long: 1, total: rand(500), freeze: 1},
      {lat: 1, long: 1, total: rand(500), freeze: 0},
      {lat: 1, long: 1, total: rand(500), freeze: 2},
      {lat: 1, long: 1, total: rand(500), freeze: 0}
    ]
  }

  it "has a severity legend with 5 levels" do
    legend = pest.severity_legend
    expect(legend).not_to be_empty
    expect(legend.length).to eq(5)
  end

  it "creates severity levels from risk points" do
    expect(pest.total_to_severity(50, 0)).to eq 0
    expect(pest.total_to_severity(125, 0)).to eq 1
    expect(pest.total_to_severity(200, 0)).to eq 4
    expect(pest.total_to_severity(275, 0)).to eq 1
    expect(pest.total_to_severity(350, 0)).to eq 0
  end

  it "creates severity levels for multiple generations" do
    expect(pest2.total_to_severity(50, 0)).to eq 0
    expect(pest2.total_to_severity(200, 0)).to eq 4
    expect(pest2.total_to_severity(400, 0)).to eq 0
    expect(pest2.total_to_severity(600, 0)).to eq 4
    expect(pest2.total_to_severity(800, 0)).to eq 0
  end

  it "generates severities from grid" do
    expect(pest).to receive(:total_to_severity).exactly(4).times
    pest.severities_from_totals(grid1, today)
  end

  it "reduces severity by amount of freezing days" do
    expect(pest.total_to_severity(200, 0)).to eq 4
    expect(pest.total_to_severity(200, 1)).to eq 3
    expect(pest.total_to_severity(200, 2)).to eq 2
    expect(pest.total_to_severity(200, 10)).to eq 0
  end

  it "creates biofix dates" do
    expect(pest.biofix_date).to eq(Date.new(Date.current.year, 1, 15))
    expect(pest2.biofix_date).to eq(Date.new(Date.current.year, 2, 15))
  end
end
