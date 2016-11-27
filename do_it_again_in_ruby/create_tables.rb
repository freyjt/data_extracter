#!/bin/ruby

require 'oci8'
require 'yaml'

if __FILE__ == $PROGRAM_NAME
  table_str = File.read './db_utils/define_tables.sql'
  queries = table_str.gsub("\n", '').split(';')
  info = YAML.load File.read './conf/nba_info.yml'
  conn = OCI8.new(info['name'], info['pass'], info['db'])
  queries.each do |query|
    conn.exec query
  end
end
