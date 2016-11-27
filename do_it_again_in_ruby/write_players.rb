#!/bin/ruby

require 'oci8'
require 'yaml'


def convert_date(date, year)
  months = %w{jan feb mar apr may jun jul aug sep oct nov dec}
  d = date.split ' '
  month, day = d[1].split '/'
  year = year.to_i
  year = month.to_i < 7 ? year : year - 1
  day = day.rjust(2, '0')
  "#{day}-#{months[month.to_i - 1]}-#{year}"
end

def convert_goals(goal_str)
  s = goal_str.split '-'
  [s[0].to_i, s[1].to_i]
end

def convert_against(agg_str)
  return ['home', agg_str[2...5]] if /^vs/ =~ agg_str
  return ['away', agg_str[2...5]]
end

if __FILE__ == $PROGRAM_NAME
  conf = YAML.load File.read('./conf/nba_info.yml')
  conn = OCI8.new(conf['name'], conf['pass'], conf['db'])
  in_p = ARGV[0]
  # use uri to append path?
  paths = Dir.entries(in_p).reject { |f| File.directory? f }.map { |f| "#{in_p}/#{f}" }
  paths.each do |p|
    # Hay, don't bother making this general at all, you're awesome.
    year = p.split('/')[1].split('_')[1]
    id = p.split('/')[1].split('_')[0]
    File.read(p).each_line do |q|
      # @todo, revisit these, some of them (3) imply more information
      #  you might like to have
      next unless /^evenrow/ =~ q || /^oddrow/ =~ q
      next if q.split(';')[1] == 'Averages' || q.split(';')[1] == 'Totals'
      next if /^Prev/ =~ q.split(';')[1]

      arr = q.split(';')
      home, against = convert_against arr[2]
      date = convert_date(arr[1], year)
      minutes = arr[4].to_i
      fg_made, fg_att = convert_goals arr[5]
      three_made, three_att = convert_goals arr[7]
      ft_made, ft_att = convert_goals arr[9]
      rebounds = arr[11].to_i
      assists = arr[12].to_i
      blocks = arr[13].to_i
      steals = arr[14].to_i
      fouls = arr[15].to_i
      turnovers = arr[16].to_i
      points = arr[17].to_i
      puts "#{home} #{against} #{date} #{fg_made} #{fg_att} #{three_made} #{three_att} #{ft_made} #{ft_att} #{rebounds} #{assists} #{blocks} #{steals} #{fouls} #{turnovers} #{points}"
      conn.exec('INSERT INTO game_log(game_date, espn_id, home, opponent, minutes, fg_made, fg_attempted, three_made, three_attempted, ft_made, ft_attempted, rebounds, assists, bloks, steals, fouls, turnovers, points) VALUES (:dat, :id, :homey, :opponent, :minutes, :fg_m, :fg_a, :three_m, :three_a, :ft_m, :ft_a, :rebounds, :assists, :bloks, :steals, :fouls, :turnovers, :points)', date, id, home, against, minutes, fg_made, fg_att, three_made, three_att, ft_made, ft_att, rebounds, assists, blocks, steals, fouls, turnovers, points)
    end
  end
  conn.commit
  conn.logoff
end

