import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="furigana"
export default class extends Controller {

  hebonTransliteration = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'kya', 'kyi', 'kyu', 'kye', 'kyo', 'ga', 'gi', 'gu', 'ge', 'go', 'gya', 'gyi', 'gyu', 'gye', 'gyo', 'sa', 'shi', 'su', 'se', 'so', 'sha', 'shi', 'shu', 'she', 'sho', 'za', 'ji', 'zu', 'ze', 'zo', 'ja', 'ji', 'ju', 'je', 'jo', 'ta', 'chi', 'tsu', 'te', 'to', 'cha', 'chi', 'chu', 'che', 'cho', 'da', 'ji', 'zu', 'de', 'do', 'dya', 'dyi', 'dyu', 'dye', 'dyo', 'na', 'ni', 'nu', 'ne', 'no', 'nya', 'nyi', 'nyu', 'nye', 'nyo', 'ha', 'hi', 'fu', 'he', 'ho', 'hya', 'hyi', 'hyu', 'hye', 'hyo', 'ba', 'bi', 'bu', 'be', 'bo', 'bya', 'byi', 'byu', 'bye', 'byo', 'pa', 'pi', 'pu', 'pe', 'po', 'pya', 'pyi', 'pyu', 'pye', 'pyo', 'ma', 'mi', 'mu', 'me', 'mo', 'mya', 'myi', 'myu', 'mye', 'myo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'rya', 'ryi', 'ryu', 'rye', 'ryo', 'wa', 'i', 'e', 'o', 'vu', 'n'];
  hiraganaCombinations = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'きゃ', 'きぃ', 'きゅ', 'きぇ', 'きょ', 'が', 'ぎ', 'ぐ', 'げ', 'ご', 'ぎゃ', 'ぎぃ', 'ぎゅ', 'ぎぇ', 'ぎょ', 'さ', 'し', 'す', 'せ', 'そ', 'しゃ', 'しぃ', 'しゅ', 'しぇ', 'しょ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'じゃ', 'じぃ', 'じゅ', 'じぇ', 'じょ', 'た', 'ち', 'つ', 'て', 'と', 'ちゃ', 'ちぃ', 'ちゅ', 'ちぇ', 'ちょ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ぢゃ', 'ぢぃ', 'ぢゅ', 'ぢぇ', 'ぢょ', 'な', 'に', 'ぬ', 'ね', 'の', 'にゃ', 'にぃ', 'にゅ', 'にぇ', 'にょ', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ひゃ', 'ひぃ', 'ひゅ', 'ひぇ', 'ひょ', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'びゃ', 'びぃ', 'びゅ', 'びぇ', 'びょ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ぴゃ', 'ぴぃ', 'ぴゅ', 'ぴぇ', 'ぴょ', 'ま', 'み', 'む', 'め', 'も', 'みゃ', 'みぃ', 'みゅ', 'みぇ', 'みょ', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'りゃ', 'りぃ', 'りゅ', 'りぇ', 'りょ', 'わ', 'ゐ', 'ゑ', 'を', 'ゔ', 'ん'];
  hiragana = ['ぁ','あ','ぃ','い','ぅ','う','ぇ','え','ぉ','お','か','が','き','ぎ','く','ぐ','け','げ','こ','ご','さ','ざ','し','じ','す','ず','せ','ぜ','そ','ぞ','た','だ','ち','ぢ','っ','つ','づ','て','で','と','ど','な','に','ぬ','ね','の','は','ば','ぱ','ひ','び','ぴ','ふ','ぶ','ぷ','へ','べ','ぺ','ほ','ぼ','ぽ','ま','み','む','め','も','ゃ','や','ゅ','ゆ','ょ','よ','ら','り','る','れ','ろ','ゎ','わ','ゐ','ゑ','を','ん','ゔ'];
  katakana = ['ァ','ア','ィ','イ','ゥ','ウ','ェ','エ','ォ','オ','カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ','ゴ','サ','ザ','シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ','タ','ダ','チ','ヂ','ッ','ツ','ヅ','テ','デ','ト','ド','ナ','ニ','ヌ','ネ','ノ','ハ','バ','パ','ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ','マ','ミ','ム','メ','モ','ャ','ヤ','ュ','ユ','ョ','ヨ','ラ','リ','ル','レ','ロ','ヮ','ワ','ヰ','ヱ','ヲ','ン','ヴ'];

  tiny_hira = ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'っ', 'ゃ', 'ゅ', 'ょ', 'ゎ'];
  tiny_kata = ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ッ', 'ャ', 'ュ', 'ョ', 'ヮ'];
  all_tiny_kana = this.tiny_hira.concat(this.tiny_kata);

  tiny_hira_vowels = ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'];
  tiny_kata_vowels = ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ'];
  all_tiny_kana_vowels = this.tiny_hira_vowels.concat(this.tiny_kata_vowels);

  // ぁ-ゖァ-ヺ all kana glyphs
  // ぁ-ぢつ-ゔァ-ヂツ-ヴ <== all kana glyphs (excluding tiny tsu)
  unifiedKanaPattern = /[っッ]{1}[ぁ-ぢつ-ゔァ-ヂツ-ヴ]{1}|[ぁ-ぢつ-ゔァ-ヂツ-ヴ]{1}[ぁぃぅぇぉゃゅょァィゥェォャュョ]{1}|[ぁ-ぢつ-ゔァ-ヂツ-ヴ]{1}/;


  connect() {
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(event) {
    if (event.target.matches(".sound-icon")) {
      const parentElement = event.target.parentNode;
      this.checkChildren(parentElement);
    }
  }


  getMatchingItem = (item, list1, list2) => { return list1.includes(item) ? list2[list1.indexOf(item)] : item; };

  replaceAtIndex(str, index, length, newSubstring) {
    if (index < 0 || index >= str.length) { return str; }
    const stringWithoutChar = str.substring(0, index) + str.substring(index + length);

    return stringWithoutChar.substring(0, index) + newSubstring + stringWithoutChar.substring(index);
  }

  getMatches(str, regex) {
    // Ensure the regex has the global flag set
    const regexWithGlobal = new RegExp(regex, 'g');
    const matches = [];
    let match;
    while ((match = regexWithGlobal.exec(str)) !== null) {
      matches.push(match);
    }

    return matches;
  }

  kata2hira(text) {
    const hira = []
    text.split("").forEach(ch => {
      hira.push(this.getMatchingItem(ch, this.katakana, this.hiragana))
    });
    return hira.join("")
  }

  romajiForTsuPair(hiraString) {
    const nonTsu = this.getMatchingItem(hiraString[1], this.hiraganaCombinations, this.hebonTransliteration);
    return nonTsu[0] + nonTsu;
  }

  romajiForVowelPair(hiraString) {
    let consonant = this.getMatchingItem(hiraString[0], this.hiraganaCombinations, this.hebonTransliteration)[0]
    if (consonant === "u") { consonant = "w" }
    const tiny_romaji_vowels = ['a', 'i', 'u', 'e', 'o']
    return consonant + this.getMatchingItem(hiraString[1], this.tiny_hira_vowels, tiny_romaji_vowels)
  }

  determineRomaji(hiraString) {
    if (hiraString.length === 2) {
      if (this.tiny_hira_vowels.includes(hiraString[1])) {
        return this.romajiForVowelPair(hiraString);
      }
      if (hiraString.includes("っ")) {
        return this.romajiForTsuPair(hiraString);
      }
    }

    return this.getMatchingItem(hiraString, this.hiraganaCombinations, this.hebonTransliteration);
  }

  wrapAllMatchingChars(text, regex_pattern) {
    const matches = this.getMatches(text, regex_pattern)

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const matchObj = matches[i]
      const matchObjLastIndex = matchObj.length - 1;
      const matchString = matchObj[matchObjLastIndex];
      /** Some variation of these lines might be needed
       * for matches with capture groups: **/
                // const fullMatch = matchObj[0]
                // const offSet = fullMatch.indexOf(matchString);
                // const matchIndex = matchObj.index + offset;
      const matchIndex = matchObj.index;
      const matchLength = matchString.length;

      const hiraString = this.kata2hira(matchString);

      const romaji = this.determineRomaji(hiraString);

      const replacement = `<ruby>${matchString}<rt>${romaji}</rt></ruby>`;

      text = this.replaceAtIndex(text, matchIndex, matchLength, replacement);
    }

    return text;
  }

  addTagsToNodeText(node, regex_patterns) {
    if (node.nodeType !== Node.TEXT_NODE || node.parentNode.nodeName.toLowerCase() === 'ruby') {
      return;
    }

    let nodeText = node.nodeValue;
    regex_patterns.forEach(pattern => {
      nodeText = this.wrapAllMatchingChars(nodeText, pattern);
    });

    const tempSpan = document.createElement('span');
    tempSpan.innerHTML = nodeText;

    while (tempSpan.firstChild) {
      node.parentNode.insertBefore(tempSpan.firstChild, node);
    }

    node.parentNode.removeChild(node);
  }

  checkChildren(node) {

    const childNodes = node.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      this.checkChildren(childNode);
    }

    this.addTagsToNodeText(node, [this.unifiedKanaPattern]);
  }

}
