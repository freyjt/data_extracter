require 'fileutils'
require 'json'
require_relative './get_table.rb'

if __FILE__ == $PROGRAM_NAME
  usage if ARGV.include? '--help'
  roster_dir = ARGV[0]
  out_dir = ARGV[1]
  year = ARGV[2]
  dirs = Dir.entries(roster_dir).reject {|k| File.directory?(k) }.map { |k| "#{roster_dir}/#{k}" }
  te = TableExtraction.new(:firefox, {class: 'tablehead'}, ';')
  FileUtils.mkdir_p out_dir
  base_url = 'http://www.espn.com/nba/player/gamelog/_/id/'
  dirs.each do |d|
    File.read(d).each_line do |l|
      next unless /^evenrow/ =~ l || /^oddrow/ =~ l
      arr = l.split ';'
      id = arr[0].split('-')[-1]
      url = base_url + id.to_s
      url << "/year/#{year}" unless year.nil?
      out_path = "#{out_dir}/#{id}_#{year}_#{Time.now.to_i}.txt"
      te.navigate url
      te.record_table out_path
    end
  end
end

def usage
  puts "Directory where we'll find the rosters is first argument"
  puts "Output directory is the second argument"
  puts "Year is the third argument"
  exit
end
