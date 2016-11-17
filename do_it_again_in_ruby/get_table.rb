# This class uses selenium to _quickly_ extract
#  a table(s) from a webpage
require 'selenium-webdriver'
require 'oga'
require 'fileutils'

class TableExtraction
  attr_writer :table_selctor, :xpath_to_td, :separator

  def initialize(browser = :firefox, table_selector = {},  separator = ',') 
    @driver = Selenium::Webdriver.for browser
    @table_selector = table_selector 
    @separator = separator
    @xpath_to_td = '/tbody/tr'
  end

  def navigate adress
    @driver.navigate.to address
  end

  def record_table out_path, header = {}
    write_str = ''  
    header.each { |k, v| write_str << "#{k}#{@separator}#{v}" }
    tableaus = driver.find_elements(class: 'tablehead')
    tableaus.each do |t|
      xml = Oga.parse_xml t.attribute('innerHTML')
      xml.xpath(@path_to_td).each do |n|
        set = n.xpath 'td'
        # very roster specific
        write_str << n.attribute('class').to_s
        write_str << @separator 
        set.each do |m|
          write_str << m.text
          write_str << @separator
        end
        write_str = line[0...-1] 
        write_str << "\n"
      end
    end 
    FileUtils.mkdir_p File.path(out_path)
    File.write(out_path, write_str)
  end
  
  def quit_driver
    @driver.quit
  end
end
