module Scraper
  class NBA
    attr_writer :log_str, :player_query
    # Should inject the connection object, you know
    def initialize(user, pass, location, player_query = nil, log_query = nil)
      @conn = OCI8.new(user, pass, location)
      @log_query = log_query
      @player_query = player_query
    end

    def player(obj)
      raise UnsetVarError, "player query string must be set" if @player_str.nil?
      @conn.exec(@player_query, espn_id, full_name)
    end

    def exec_input(obj)
      @conn.exec(@log_str, *set_variables(@log_str, obj))
    end

    # Assumes that substitution variables have the exact keys as the object
    #  and that they are of the form ':var_name' or '<sub>varname
    def set_variables(string, obj, sub = ':')
      key_chain = string.split(' ').flat_map { |k| k.split ',' }.select{ |k| /^#{sub}/ =~ k }.map { |k| obj[k[1...1000].to_sym] }
      raise UnsetVarError, "Must provide all values in exec string" if key_chain.include? nil 
      key_chain
    end

    def exec_without_input(str)
      str.gsub("\n", ' ').split(';', "\n").each { |l| @conn.exec l }
    end
  end
end
