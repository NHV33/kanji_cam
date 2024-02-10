const randFloat = (min, max) => { return (Math.random() * max) - min };
const randInt = (min, max) => { return Math.floor((Math.random() * max) - min) };
const sampleFromList = (list) => { return list[randInt(0, list.length)] };

function newItemFromList(currentItem, list) {
    const filteredList = list.filter(function(e) { return e !== currentItem })
    return sampleFromList(filteredList)
}

function deleteByIndexes(list, indexes) {
    for (let i = list.length - 1; i >= 0; i -= 1) {
        if (indexes.includes(i))
            list.splice(i, 1);
    }
    return list
}

const deleteByValues = (list, values) => { return list.filter((item) => !values.includes(item)) };

function objValuesByKey(objList, key) {
    let values = [];
    objList.forEach(obj => {
        values.push(obj[key])
    });
    return values
}

// end parameter is inclusive
function uniquePos(activeList, key, start, increment, end, offset=0) {
    const valuesWithKey = objValuesByKey(activeList, key);
    let available = [];
    for (let i = start; i <= end; i += increment) {
        available.push(i + offset)
    }
    const remaining = deleteByValues(available, valuesWithKey);
    if (remaining.length > 0) {
        return sampleFromList(remaining)
    } else {
        return sampleFromList(available)
    }
}

const kanjiChars = "一引右羽雨雲円園遠王音下火何花科夏家歌画回会海絵貝外角学楽活間丸岩顔気汽記帰九弓休牛魚京強教玉近金空兄形計月犬見元言原戸古五午後語口工公広交光考行校高黄合谷国黒今左才細作三山算子止四市矢糸姉思紙字寺耳自時七室社車弱手首秋週十出春書女小少上場色食心森新親人図水数正生西声青星晴夕石赤切雪千川先船線前組早走草足村多太体大台男地池知竹茶中虫昼町長鳥朝直通弟天店点田電土刀冬当東答頭同道読内南二肉日入年馬売買白麦八半番百父風分文聞米歩母方北木本毎妹万名明鳴毛目門夜野友用曜来里理立力林六話".split("");

const rainBox = document.getElementById("rain-box");

function spawnNewKanji(activeList) {
    const newKanji = document.createElement("div");
    newKanji.className = "kanji-rain fall";
    // startX = (randInt(0,10) *10) - 3;
    // startY = (randInt(0,7) - 4) * 15;
    startX = (uniquePos(activeList, "startX", 0, 10, 90));
    startY = (uniquePos(activeList, "startY", 0, 1, 10));
    newKanji.style.left = (`${startX}%`)
    newKanji.style.top = (`${startY}%`)
    newKanji.innerText = newItemFromList("", kanjiChars);
    // newKanji.innerText = startX;
    rainBox.append(newKanji);
    let kanjiObject = {
        domElement: newKanji,
        ticks: 0,
        startX: startX,
        startY: startY
    }
    activeList.push(kanjiObject)
    return kanjiObject;
}

function updateTicks(activeList){
    let index = 0;
    let objs2delete = [];
    activeList.forEach(obj => {
        obj.ticks += 1;
        // obj.domElement.innerText = newItemFromList(obj.domElement.innerText, kanjiChars)
        if (obj.ticks > 10) {
            obj.domElement.remove()
            objs2delete.push(index)
        }
        index += 1;
    });
    deleteByIndexes(activeList, objs2delete)
}

let activeKanji = [];

setInterval(() => {
    if (activeKanji.length < 10) {
        spawnNewKanji(activeKanji);
    }
    // for (let i = 0; i < 1; i++) {
    // }
    updateTicks(activeKanji);
    // console.log(activeKanji.length);
}, 1000)
