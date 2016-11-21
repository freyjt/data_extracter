require 'yaml'
require 'pp'
require 'oci8'

if __FILE__ == $PROGRAM_NAME
  # short of documentation, these two lines imply use for config
  info = YAML.load File.read('../conf/connection_info.yml')
  ox = OCI8.new(info['user'], info['pass'], info['db'])

  ox.exec 'select * from sales' do |r|
    r.each { |s| puts s.class }
    puts r.join '|'
  end

  ox.logoff

end
