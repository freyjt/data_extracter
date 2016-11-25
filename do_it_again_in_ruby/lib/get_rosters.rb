#!/bin/ruby

require 'fileutils'
require 'json'
require_relative './get_table.rb'

if __FILE__ == $PROGRAM_NAME
  
   usage if ARGV.include? '--help'
   league = ARGV[0]
   out_dir = ARGV[1]
   info = JSON.parse(File.read('../conf/teamList.json'))[league]
   puts info
   te = TableExtraction.new(:firefox, {class: 'tablehead'}, ';')
   FileUtils.mkdir_p out_dir  

   info['name_list'].each do |name|
     url = info['url'].sub('<league>', league).sub('<name>', name)
     out_path = "#{out_dir}/#{name}_#{Time.now.to_i}.txt"
     te.navigate url 
     te.record_table out_path
   end

end

def usage
  puts "League is first argument, using its standard abbreviation."
  puts "Out Directory is second argument."
  puts "Gets active players only."
  puts "Requires teamList.json to be present in the directory."
  exit
end
