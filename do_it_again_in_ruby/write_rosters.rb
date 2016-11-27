#!/bin/ruby

require 'oci8'
require 'yaml'

if __FILE__ == $PROGRAM_NAME
  rost_path = ARGV[0]
  paths = Dir.entries(rost_path).reject { |f| File.directory? f }.map { |f| "#{rost_path}/#{f}" }
  info = YAML.load File.read './conf/nba_info.yml'
  conn = OCI8.new(info['name'], info['pass'], info['db'])
  paths.each do |p|
    File.read(p).each_line do |l|
      next unless /^oddrow/ =~ l || /^evenrow/ =~ l
      line = l.split(';')
      espn_id = line[0].split('-')[-1]
      number = line[1]
      name = line[2]
      conn.exec("INSERT INTO player(espn_id, full_name) values (:id, :name)",
               espn_id,
               name);
    end
  end
  conn.commit
  conn.logoff
end
