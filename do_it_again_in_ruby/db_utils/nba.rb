module SCRAPER
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

    def gamelog(obj)
      @conn.exec( @log_str,
             obj[:espn_id],
             obj[:game_date],
             obj[:home],
             obj[:opponent],
             obj[:fg_made],
             obj[:fg_attempted],
             obj[:three_made],
             obj[:three_attempted],
             obj[:ft_made],
             obj[:ft_attempted],
             obj[:rebounds],
             obj[:assists],
             obj[:bloks],
             obj[:steals],
             obj[:fouls],
             obj[:turnovers],
             obj[:points] )
    end

    # Assumes that substitution variables have the exact keys as the object
    #  and that they are of the form ':var_name' or '<sub>varname
    def set_variables(string, obj, sub = ':')
      string.split(' ').flat_map { |k| k.split ',' }.select{ |k| /^#{sub}/ =~ k }.map { |k| obj[k[1...1000].to_sym] }
    end

    def setup_table
      File.read('./define_logs.sql')
          .gsub("\n", ' ')
          .split(';', "\n")
          .each { |l| @conn.exec l }
    end
  end
end
