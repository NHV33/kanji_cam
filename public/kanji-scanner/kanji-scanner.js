const videoElement = document.getElementById('camera-feed');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture-button');
const retakeButton = document.getElementById('retake-button');
const alertText = document.getElementById('alert-text');

const navBar = document.getElementById("navbar");

document.body.style.backgroundColor = "black";

navBar.style.visibility = "hidden";

let captureImage = null;

function updateCanvasDimensions() {
  /** TODO: try adjusting the canvas dimentions
   * may require centering both the canvas and video stream in
   * a div together. Overlap posible? Maybe put in
   * separate pos:fixed divs.
   */
  // canvas.width = video.videoWidth;
  // canvas.height = video.videoHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

updateCanvasDimensions();

function turnElement(element_id, onOff) {
  const visibilitySetting = (onOff.toLowerCase() === "on") ? "visible" : "hidden";
  document.getElementById(element_id).style.visibility = visibilitySetting;
}

const captureInstruction = "Take a picture of some kanji."
const selectionInstruction = "Drag to select kanji."

function updateAlertText(message) {
  if (message === "") {
    turnElement("alert-text", "off");
  } else {
    turnElement("alert-text", "on");
    alertText.innerText = message;
  }
}

updateAlertText(captureInstruction);

// Check if the browser supports the MediaDevices API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Define constraints to request the rear camera
  var constraints = {
      video: {
          facingMode: 'environment' // 'environment' value is used to request the rear camera
      }
  };

  // Request access to the camera with the specified constraints
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    // Success callback: stream contains the media stream from the camera
    // You can assign this stream to a <video> element to display the camera feed
    videoElement.srcObject = stream;
    videoElement.play();

    // Get information about the tracks in the stream
    stream.getVideoTracks().forEach(function(track) {
        // Check the constraints of each track to determine the camera used
        const facingMode = track.getSettings().facingMode;
        // console.log('Camera used:', facingMode);
    });
  })
  .catch(function(error) {
      // Error callback: handle errors when accessing the camera
      console.error('Error accessing the camera:', error);
  });
} else {
  // Browser does not support getUserMedia
  console.error('getUserMedia not supported in this browser');
}


// Capture image
captureButton.addEventListener('click', () => {

  turnElement("button-bar", "off");
  updateAlertText(selectionInstruction);

  updateCanvasDimensions();
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert the captured image to a data URL
  // const imageUrl = canvas.toDataURL('image/png');
  captureImage = canvas.toDataURL('image/png');


    // Get the Data URL representing the current state of the canvas
  var imageDataURL = canvas.toDataURL('image/png');

  // Create a new Image object
  var img = new Image();

  // Set the 'src' attribute of the Image object to the Data URL
  img.src = imageDataURL;

  // When the image is fully loaded, the 'onload' event will be triggered
  img.onload = function() {
    // At this point, the image is loaded and ready to be used
    // You can draw it onto the canvas to restore the saved state
    // context.drawImage(img, 0, 0);
    captureImage = img;
  };

});


// Segmentation Modes
// OSD_ONLY: '0',
// AUTO_OSD: '1',
// AUTO_ONLY: '2',
// AUTO: '3',
// SINGLE_COLUMN: '4',
// SINGLE_BLOCK_VERT_TEXT: '5',
// SINGLE_BLOCK: '6',
// SINGLE_LINE: '7',
// SINGLE_WORD: '8',
// CIRCLE_WORD: '9',
// SINGLE_CHAR: '10',
// SPARSE_TEXT: '11',
// SPARSE_TEXT_OSD: '12',
// RAW_LINE: '13',

// all_kanji = "亜哀挨愛曖悪握圧扱宛嵐安案暗以衣位囲医依委威為畏胃尉異移萎偉椅彙意違維慰遺緯域育一壱逸茨芋引印因咽姻員院淫陰飲隠韻右宇羽雨唄鬱畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎怨宴媛援園煙猿遠鉛塩演縁艶汚王凹央応往押旺欧殴桜翁奥横岡屋億憶臆虞乙俺卸音恩温穏下化火加可仮何花佳価果河苛科架夏家荷華菓貨渦過嫁暇禍靴寡歌箇稼課蚊牙瓦我画芽賀雅餓介回灰会快戒改怪拐悔海界皆械絵開階塊楷解潰壊懐諧貝外劾害崖涯街慨蓋該概骸垣柿各角拡革格核殻郭覚較隔閣確獲嚇穫学岳楽額顎掛潟括活喝渇割葛滑褐轄且株釜鎌刈干刊甘汗缶完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡観韓艦鑑丸含岸岩玩眼頑顔願企伎危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規亀喜幾揮期棋貴棄毀旗器畿輝機騎技宜偽欺義疑儀戯擬犠議菊吉喫詰却客脚逆虐九久及弓丘旧休吸朽臼求究泣急級糾宮救球給嗅窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供協況峡挟狭恐恭胸脅強教郷境橋矯鏡競響驚仰暁業凝曲局極玉巾斤均近金菌勤琴筋僅禁緊錦謹襟吟銀区句苦駆具惧愚空偶遇隅串屈掘窟熊繰君訓勲薫軍郡群兄刑形系径茎係型契計恵啓掲渓経蛍敬景軽傾携継詣慶憬稽憩警鶏芸迎鯨隙劇撃激桁欠穴血決結傑潔月犬件見券肩建研県倹兼剣拳軒健険圏堅検嫌献絹遣権憲賢謙鍵繭顕験懸元幻玄言弦限原現舷減源厳己戸古呼固股虎孤弧故枯個庫湖雇誇鼓錮顧五互午呉後娯悟碁語誤護口工公勾孔功巧広甲交光向后好江考行坑孝抗攻更効幸拘肯侯厚恒洪皇紅荒郊香候校耕航貢降高康控梗黄喉慌港硬絞項溝鉱構綱酵稿興衡鋼講購乞号合拷剛傲豪克告谷刻国黒穀酷獄骨駒込頃今困昆恨根婚混痕紺魂墾懇左佐沙査砂唆差詐鎖座挫才再災妻采砕宰栽彩採済祭斎細菜最裁債催塞歳載際埼在材剤財罪崎作削昨柵索策酢搾錯咲冊札刷刹拶殺察撮擦雑皿三山参桟蚕惨産傘散算酸賛残斬暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉肢姿思指施師恣紙脂視紫詞歯嗣試詩資飼誌雌摯賜諮示字寺次耳自似児事侍治持時滋慈辞磁餌璽鹿式識軸七叱失室疾執湿嫉漆質実芝写社車舎者射捨赦斜煮遮謝邪蛇尺借酌釈爵若弱寂手主守朱取狩首殊珠酒腫種趣寿受呪授需儒樹収囚州舟秀周宗拾秋臭修袖終羞習週就衆集愁酬醜蹴襲十汁充住柔重従渋銃獣縦叔祝宿淑粛縮塾熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署緒諸女如助序叙徐除小升少召匠床抄肖尚招承昇松沼昭宵将消症祥称笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照詳彰障憧衝賞償礁鐘上丈冗条状乗城浄剰常情場畳蒸縄壌嬢錠譲醸色拭食植殖飾触嘱織職辱尻心申伸臣芯身辛侵信津神唇娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅甚陣尋腎須図水吹垂炊帥粋衰推酔遂睡穂随髄枢崇数据杉裾寸瀬是井世正生成西声制姓征性青斉政星牲省凄逝清盛婿晴勢聖誠精製誓静請整醒税夕斥石赤昔析席脊隻惜戚責跡積績籍切折拙窃接設雪摂節説舌絶千川仙占先宣専泉浅洗染扇栓旋船戦煎羨腺詮践箋銭潜線遷選薦繊鮮全前善然禅漸膳繕狙阻祖租素措粗組疎訴塑遡礎双壮早争走奏相荘草送倉捜挿桑巣掃曹曽爽窓創喪痩葬装僧想層総遭槽踪操燥霜騒藻造像増憎蔵贈臓即束足促則息捉速側測俗族属賊続卒率存村孫尊損遜他多汰打妥唾堕惰駄太対体耐待怠胎退帯泰堆袋逮替貸隊滞態戴大代台第題滝宅択沢卓拓託濯諾濁但達脱奪棚誰丹旦担単炭胆探淡短嘆端綻誕鍛団男段断弾暖談壇地池知値恥致遅痴稚置緻竹畜逐蓄築秩窒茶着嫡中仲虫沖宙忠抽注昼柱衷酎鋳駐著貯丁弔庁兆町長挑帳張彫眺釣頂鳥朝貼超腸跳徴嘲潮澄調聴懲直勅捗沈珍朕陳賃鎮追椎墜通痛塚漬坪爪鶴低呈廷弟定底抵邸亭貞帝訂庭逓停偵堤提程艇締諦泥的笛摘滴適敵溺迭哲鉄徹撤天典店点展添転塡田伝殿電斗吐妬徒途都渡塗賭土奴努度怒刀冬灯当投豆東到逃倒凍唐島桃討透党悼盗陶塔搭棟湯痘登答等筒統稲踏糖頭謄藤闘騰同洞胴動堂童道働銅導瞳峠匿特得督徳篤毒独読栃凸突届屯豚頓貪鈍曇丼那奈内梨謎鍋南軟難二尼弐匂肉虹日入乳尿任妊忍認寧熱年念捻粘燃悩納能脳農濃把波派破覇馬婆罵拝杯背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫剝舶博薄麦漠縛爆箱箸畑肌八鉢発髪伐抜罰閥反半氾犯帆汎伴判坂阪板版班畔般販斑飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼披肥非卑飛疲秘被悲扉費碑罷避尾眉美備微鼻膝肘匹必泌筆姫百氷表俵票評漂標苗秒病描猫品浜貧賓頻敏瓶不夫父付布扶府怖阜附訃負赴浮婦符富普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛雰噴墳憤奮分文聞丙平兵併並柄陛閉塀幣弊蔽餅米壁璧癖別蔑片辺返変偏遍編弁便勉歩保哺捕補舗母募墓慕暮簿方包芳邦奉宝抱放法泡胞俸倣峰砲崩訪報蜂豊飽褒縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿貌暴膨謀頰北木朴牧睦僕墨撲没勃堀本奔翻凡盆麻摩磨魔毎妹枚昧埋幕膜枕又末抹万満慢漫未味魅岬密蜜脈妙民眠矛務無夢霧娘名命明迷冥盟銘鳴滅免面綿麺茂模毛妄盲耗猛網目黙門紋問冶夜野弥厄役約訳薬躍闇由油喩愉諭輸癒唯友有勇幽悠郵湧猶裕遊雄誘憂融優与予余誉預幼用羊妖洋要容庸揚揺葉陽溶腰様瘍踊窯養擁謡曜抑沃浴欲翌翼拉裸羅来雷頼絡落酪辣乱卵覧濫藍欄吏利里理痢裏履璃離陸立律慄略柳流留竜粒隆硫侶旅虜慮了両良料涼猟陵量僚領寮療瞭糧力緑林厘倫輪隣臨瑠涙累塁類令礼冷励戻例鈴零霊隷齢麗暦歴列劣烈裂恋連廉練錬呂炉賂路露老労弄郎朗浪廊楼漏籠六録麓論和話賄脇惑枠湾腕";

// const recognizedKanjiBox = document.getElementById("recognized-kanji");
let recognizedKanji = [];

function stripKanji(text) {
  const matches = text.match(/[一-龯]{1}/g);
  return (matches === null) ? ["?"] : matches;
}

const extractText = async () => {
  console.log('ocr scanning');
  updateAlertText("Scanning...");
  const worker = await Tesseract.createWorker('jpn');
  await worker.setParameters({
    // tessedit_char_whitelist: all_kanji,
    // segsearch_max_char_wh_ratio: 10,
    // PSM_SINGLE_CHAR
    // tessedit_pageseg_mode: "1", // best setting so far
    tessedit_pageseg_mode: "9", //circle_word also effective
    preserve_interword_spaces: 0,

  });

  const ret = await worker.recognize(canvas.toDataURL("image/png"), "jpn");
  console.log(ret.data.text);
  recognizedKanji = stripKanji(ret.data.text);
  // recognizedKanjiBox.innerText = ret.data.text;

  displayKanji(recognizedKanji);

  await worker.terminate();
};

const modal = document.querySelector("dialog");
const kanjiSelectionBox = document.getElementById("kanji-selection-box")

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

cancelButton.addEventListener('click', () => {
  modal.close();
});

const imageField = document.getElementById('image-data');
const kanjiField = document.getElementById('kanji-data');

confirmButton.addEventListener('click', () => {

  const kanjiText = document.querySelector('.selected').innerText;
  console.log("kanjiText: ", kanjiText);
  // const newDataURL = canvas.toDataURL('image/png'); // Adjust format as needed
  // imageField.value = newDataURL;
  kanjiField.value = kanjiText;
  console.log("kanjiField: ", kanjiField);

  // submitFormWithImageData();
  if (kanjiField !== "") {
    document.getElementById('kanji-form').submit();
    // document.getElementById("submit-button").click();
  }
});

function displayKanji(kanjiList) {
  updateAlertText("Select a kanji.")

  confirmButton.style.visibility = "hidden";

  kanjiSelectionBox.textContent = "";

  kanjiList.forEach(kanji => {
    let newDiv;
    if (kanji === "?") {
      newDiv = `<div class="kanji-not-found">${kanji}<div>`;
    } else {
      newDiv = `<div class="kanji-choice">${kanji}<div>`;
    }
    kanjiSelectionBox.innerHTML += newDiv;
  });

  const kanjiChoices = document.querySelectorAll(".kanji-choice");

  kanjiChoices.forEach(kanjiChoice => {
    kanjiChoice.addEventListener('click', (event) => {
      const siblings = document.querySelectorAll(".kanji-choice");
        siblings.forEach(sib => {
          sib.classList.remove("selected");
        });
        event.target.classList.add("selected");
        confirmButton.style.visibility = "visible";
    });
  });

  modal.showModal();
}


const topEdge = 0;
const leftEdge = 0;
const rightEdge = canvas.width;
const bottomEdge = canvas.height;

let prevX;
let prevY;
let x;
let y;

function calcBounds(x1, y1, x2, y2) {

  return {
    left:   Math.min(x1, x2),
    top:    Math.min(y1, y2),
    right:  Math.max(x1, x2),
    bottom: Math.max(y1, y2)
  }
}

function drawBorder(context, prevX, prevY, x, y, strokeColor="black", borderColor="white") {

  const inner = calcBounds(prevX, prevY, x, y);

  context.fillStyle = borderColor;
  context.fillRect(leftEdge, topEdge, inner.left, inner.bottom); // Left
  context.fillRect(inner.left, topEdge, rightEdge, inner.top); // Top
  context.fillRect(inner.right, inner.top, rightEdge - inner.right, bottomEdge); // Right
  context.fillRect(leftEdge, inner.bottom, inner.right, bottomEdge - inner.bottom); // Bottom

  context.strokeStyle = strokeColor;
  context.lineWidth = "5px";
  // context.strokeRect(prevX, prevY, x-prevX, y-prevY);
  // context.strokeRect(leftEdge, topEdge, inner.left, inner.bottom); // Left
  // context.strokeRect(inner.left, topEdge, rightEdge, inner.top); // Top
  // context.strokeRect(inner.right, inner.top, rightEdge - inner.right, bottomEdge); // Right
  // context.strokeRect(leftEdge, inner.bottom, inner.right, bottomEdge - inner.bottom); // Bottom
  context.strokeRect(inner.left, topEdge, 0, bottomEdge); // TopLeft
  context.strokeRect(inner.right, topEdge, 0, bottomEdge); // TopRight
  context.strokeRect(leftEdge, inner.top, rightEdge, 0); // LeftTop
  context.strokeRect(leftEdge, inner.bottom, rightEdge, 0); // LeftBottom
}

function clearCanvas() {
  context.clearRect(leftEdge, topEdge, rightEdge, bottomEdge);
}

function renderImage() {
  clearCanvas();
  if (captureImage !== null) {
    context.drawImage(captureImage, 0, 0, canvas.width, canvas.height);
  }
}

function updateMousePos(event, newTouch=false) {
  const rect = canvas.getBoundingClientRect();
  x = event.clientX - rect.left;
  y = event.clientY - rect.top;
  if (newTouch) {
    prevX = x;
    prevY = y;
  }
}

function updateTouchPos(event, newTouch=false) {
  // Example touch event:
  // Touch { identifier: 1815, target: canvas#canvas.full-screen, screenX: 880, screenY: 174, clientX: 712, clientY: 133, pageX: 712, pageY: 133, radiusX: 1, radiusY: 1 }
  if (event.touches[0] === undefined) { return; }
  const rect = canvas.getBoundingClientRect();
  x = event.touches[0].clientX - rect.left;
  y = event.touches[0].clientY - rect.top;
  if (newTouch) {
    prevX = x;
    prevY = y;
  }
}

function startTouchCanvas() {
  if (captureImage === null) { return; }
  updateCanvasDimensions();
  renderImage();
}

function dragCanvas() {
  if (captureImage === null) { return; }
  if (prevX === null || prevY === null) { return; }

  const bounds = calcBounds(prevX, prevY, x, y);
  const boxWidth = bounds.right - bounds.left;
  const boxHeight = bounds.bottom - bounds.top;

  renderImage();
  if (boxHeight > 3 && boxWidth > 3) {
    drawBorder(context, prevX, prevY, x, y, strokeColor="#000000ff", borderColor="#ffffffcc");
  }

}

function endTouchCanvas() {
  if (captureImage === null) { return; }

  updateAlertText("");

  const bounds = calcBounds(prevX, prevY, x, y);
  const boxWidth = bounds.right - bounds.left;
  const boxHeight = bounds.bottom - bounds.top;

  if (boxHeight > 10 && boxWidth > 10) {
    drawBorder(context, prevX, prevY, x, y, strokeColor="#ffffff", borderColor="#ffffff");
    extractText(canvas);
  } else {
    renderImage();
  }
  prevX = null;
  prevY = null;

}

canvas.addEventListener('mousedown', function(event) { updateMousePos(event, newTouch=true); startTouchCanvas(); });
canvas.addEventListener('mousemove', function(event) { updateMousePos(event); dragCanvas(); });
canvas.addEventListener('mouseup',   function(event) { updateMousePos(event); endTouchCanvas(); });

canvas.addEventListener('touchstart', function(event) { updateTouchPos(event, newTouch=true); startTouchCanvas(event); });
canvas.addEventListener('touchmove',  function(event) { updateTouchPos(event); dragCanvas(event); });
canvas.addEventListener('touchend',   function(event) { updateTouchPos(event); endTouchCanvas(event); });

retakeButton.addEventListener('mouseup', () => {
  captureImage = null;
  clearCanvas();
  turnElement("button-bar", "on");
  updateAlertText(captureInstruction);
});

// Prevent pull-to-refresh
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
      e.preventDefault();
  }
}, { passive: false });

// Prevent swipe-back
window.onbeforeunload = function() {
  window.history.forward();
};



// Listen for form submission
document.getElementById('kanji-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Convert image to data URL
  // const canvas = document.createElement('canvas');
  // const context = canvas.getContext('2d');
  // canvas.width = imageElement.width;
  // canvas.height = imageElement.height;
  // context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);


  // Set hidden input value to the data URL


  // Now you can submit the form with the image data
  // submitFormWithImageData();
});

function submitFormWithImageData() {
  const formData = new FormData(document.getElementById('kanji-form')); // Create FormData object from form

  fetch('/cards/new', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // assuming response is JSON
  })
  .then(data => {
    console.log('Success:', data);
    // Do something with the response data if needed
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle error
  });
}
