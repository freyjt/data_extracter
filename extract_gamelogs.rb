
def extract_player_id line
  espn_info = line.split(',')[0]
  espn_info = espn_info.split '-'
  espn_info.last
end

if __FILE__ == $PROGRAM_NAME
  require 'fileutils'
  require 'json'
  require 'thread'
  table_name = 'tablehead'
  usage if ARGV.length < 1
  roster_dir = ARGV[0] 
  out_dir = ARGV.length > 1 ? ARGV[1] : ''
  FileUtils.mkdir_p out_dir unless out_dir.length == 0
  year = ARGV.length > 2 ? "year/#{ARGV[2]}" : ''
  files = Dir.entries(roster_dir).reject { |f| File.directory? f }
  threads = []
  files.each do |file|
    path = "#{roster_dir}/#{file}"
    f = File.read path
    f.each_line do |line|
      next unless /^evenrow/ =~ line || /^oddrow/ =~ line
      player_id = extract_player_id line      
      league = file.split('_')[0]
      url = "http://www.espn.com/#{league}/player/gamelog/_/id/#{player_id}/#{year}"
      out_path = "#{out_dir}/#{player_id}_#{Time.now.to_i}.player"
      head = { league: league,
               table_name: table_name, 
               name: player_id,
               url: url } 
      head = JSON.generate(head).gsub('"', '\\"')
      threads << Thread.new {
        `phantomjs getTable.js #{url} #{table_name} "#{head}" #{out_path}`
        puts "thread finished"
      }

      puts head, url, out_path
    end
  end 
  threads.each(&:join)
end 

def usage
  puts 'call with: ruby extract_gamelogs.rb <roster_directory>'
  puts '  <roster_directory> should contain rosters extracted with extract_rosters'
  exit 0
end
