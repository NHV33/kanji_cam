require 'nokogiri'
require 'open-uri'

class Scraper

  def initialize(url)
    @url = url
  end

  def scrape
  html_file = URI.open(@url).read
  html_doc = Nokogiri::HTML.parse(html_file)


  # find all the div nodes/elements with classname "tatoeba"
  all_tatoeba = html_doc.css(".tatoeba")
  # Declare an array to store texts
  japanese_sentence = []

  all_tatoeba.each do |tatoeba|

    # Iterate through each node/element of the "tatoeba" div.
    # This is necessary because the "tatoeba" div contains many different types of nodes/elements
    # Each node/element needs to be handled differently based on its content.
    tatoeba.children.each do |node|

      if node.classes.include?("tatvoc")
        # Search inside the node/element for a tag with classname "furigana"
        furigana_text = node.css(".furigana").text

        # Search inside the node/element for a tag with classname "f_kanji"
        # kanji_text = node.css(".f_kanji").text

        # Look for text inside tag with classname "furigana"
        # Blank ("") means there was no furigana.
        if furigana_text == ""

          # Because there is no furigana, just grab all the text.
          japanese_sentence.push(node.text)
        else

          # Because there was furigana, remove the furigana text from the node text with .gsub().
          # Node text includes the text from all sub-nodes (e.g., the nodes with class "f_kanji" and "furigana")
          # The okurigana is actually plaintext inside the <a> tag.

          # Before: node.text == "たい平らな"
          # _After: node.text == "平らな"
          japanese_sentence.push(node.text.gsub(furigana_text, ""))
        end
      elsif node.classes.include?("tatvoc-stop")

        # Nodes with classname "tatvoc-stop" never have furigana, so grab all text.
        japanese_sentence.push(node.text)
      end
    end
  end

  # change a line after either "。" or "」"
  return japanese_sentence.join.split(/(?<=[。」])/).join("\n")
end
end
