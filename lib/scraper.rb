require 'nokogiri'
require 'open-uri'

class Scraper
  def initialize(kanji)
    encoded_kanji = URI.encode_www_form_component(kanji)
    @url = "https://www.kanshudo.com/searcht?q=#{encoded_kanji}"
  end

  def list_include_any?(list1, list2)
    list2.each { |item| return true if list1.include?(item) }

    return false
  end

  def check_child_nodes(node)

    node.children.each { |child_node| check_child_nodes(child_node) }

    target_text = list_include_any?(node.parent.classes, ["f_kanji", "furigana", "tatvoc-stop", "noflip"])
    if target_text and node.classes.empty? #or node.classes.empty?
      text_type = "plain"
      text_type = "kanji" if node.parent.classes.include?("f_kanji")
      text_type = "furigana" if node.parent.classes.include?("furigana")
      $text_segments << { "type" => text_type, "text" => node.text}
    end
  end

  def assemble_text(segments)
    output = []
    prev_seg = {"type" => nil}
    segments.each do |segment|

      output << "</span>" if segment["type"] != "plain" and prev_seg["type"] == "plain"

      output << "<ruby>" if segment["type"] == "furigana"

      output << "#{segment["text"]}<rt>#{prev_seg["text"]}</rt></ruby>" if segment["type"] == "kanji"

      output << "<span>" if prev_seg["type"] != "plain" and segment["type"] == "plain"

      output << segment["text"] if segment["type"] == "plain"

      prev_seg = segment
    end

    output << "</span>" if prev_seg["type"] == "plain"

    return output.join
  end

  def scrape
    html_file = URI.open(@url).read
    html_doc = Nokogiri::HTML.parse(html_file)

    jpn_sentences = []
    eng_sentences = []

    all_tatoeba = html_doc.css(".tatoeba")

    all_tatoeba.each do |tatoeba|

      $text_segments = []

      check_child_nodes(tatoeba)

      jpn_sentences << assemble_text($text_segments)

      eng_sentences << "<span>#{tatoeba.css(".tat_eng .text").text}</span>"

    end

    return jpn_sentences, eng_sentences
  end
end
