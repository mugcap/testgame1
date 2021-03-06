console.log("Hello");

var die = false;
var leafman = false;
var fury = false;

//アイテムデータ格納クラス
class Itemdata {
    constructor(name, type, status) {
        this.name = name;
        //0無所属,1食べれる,2武器,3レアアイテム,4装備や道具
        this.type = type;
        this.status = status;
    }

    get thisname() { return this.name; }
    get thistype() { return this.type; }
    get thisstatus() { return this.status; }
}

const items =
    [
        new Itemdata("バナナ", 1, 15),
        new Itemdata("木の枝", 0, 0),
        new Itemdata("木のつる", 0, 0),
        new Itemdata("木の葉", 0, 0),
        new Itemdata("石", 0, 0),
        new Itemdata("尖った石", 0, 0),
        new Itemdata("石の槍", 2,
            function () {
                var x = Math.random() * 3 + 3;
                x = Math.floor(x) * 10;
                var br = Math.random() * 100;
                if (br < 20) { x *= -1; }
                return x;
            }),
        new Itemdata("骸の槍", 2,
            function () {
                var x = Math.random() * 3 + Math.random() * 3 + 4;
                x = Math.floor(x) * 10;
                var br = Math.random() * 100;
                if (br < 10) { x *= -1; }
                return x;
            }),
        new Itemdata("三玉槍", 2,
            function () {
                var x = Math.random() * 5 + Math.random() * 5 + 10;
                x = Math.floor(x) * 10;
                return x;
            }),
        new Itemdata("釣竿", 4, 0),
        new Itemdata("かまど", 4, 0),
        new Itemdata("生魚", 0, 0),
        new Itemdata("焼き魚", 1, 50),
        new Itemdata("生肉", 0, 0),
        new Itemdata("毛皮", 0, 0),
        new Itemdata("鋭利な骨", 0, 0),
        new Itemdata("丈夫な骨", 0, 0),
        new Itemdata("焼き肉", 1, 100),
        new Itemdata("葉っぱマント", 4, 0),
        new Itemdata("毛皮の鎧", 4, 0),
        new Itemdata("常盤色の玉髄", 3, 0),
        new Itemdata("葡萄茶色の玉髄", 3, 0),
        new Itemdata("瑠璃色の玉髄", 3, 0)
    ];

const itemnames = items.map(x => x.thisname);
//各種便利関数
//アイテム名>インデックス
function si(name) {
    return itemnames.indexOf(name);
}
//イベント配列実行
function doev(max, ar) {
    var v = Math.random() * max;
    for (var i = 0; i < ar.length; i++) {
        v -= ar[i].thiskaku;
        if (v <= 0) {
            ar[i].does();
            break;
        }
    }
}
//HTML表示切り替え
function onoff(classname, boola) {
    const tags = document.getElementsByClassName(classname);
    const array = Array.prototype.slice.call(tags);
    console.log(tags);
    if (boola) {
        array.forEach(element => {
            element.style.display = "block";
            if (element.tagName.toLowerCase() == "button") {
                element.style.display = "inline-block";
            }
        });
    } else {
        array.forEach(element => {
            element.style.display = "none";
        });
    }
}

//敵ターゲット
var target;
//武器コマンド選択
var selwp = -1;

//戦闘情報更新
function btkousin(who) {
    console.log(who);
    document.getElementById("btname").innerText = target.name;
    document.getElementById("bthp").innerText = "敵体力：" + target.hp;

    //武器コマンド更新
    var sl = document.getElementById("btcom");
    while (sl.firstChild) {
        sl.removeChild(sl.firstChild);
    }

    var com = document.createElement("option");
    com.innerText = "素手";
    com.setAttribute("value", -1);
    if (-1 == selwp) {
        com.selected = true;
    }
    sl.appendChild(com);
    for (var i = 0; i < items.length; i++) {
        if (items[i].thistype == 2 && who.have[i] != 0) {
            var com = document.createElement("option");
            com.innerText = items[i].thisname;
            com.setAttribute("value", i);
            if (i == selwp) {
                com.selected = true;
            }
            sl.appendChild(com);
        }
    }

}
//戦闘処理
function sento() {
    selwp = document.getElementById("btcom").value;
    var at;
    if (selwp == -1) {
        at = Math.random() * 3 + 1;
        at = Math.floor(at) * 10;
    }
    else {
        at = items[selwp].status();
    }
    document.getElementById("log").innerText = "";
    if (at < 0) {
        at *= -1;
        document.getElementById("log").innerText = items[selwp].thisname + "が壊れた。\n";
        target.usr.have[selwp] -= 1;
    }
    target.damage(at);
}

//敵モンスタークラス
class enemy {
    constructor(name, hp, attack, usr, dro, drols) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.usr = usr;
        this.pok = new Array(items.length).fill(0);
        this.dro = dro;
        this.drols = drols;
        target = this;
        onoff("ob", false);
        onoff("sento", true);
        document.getElementById("log").innerText = this.name + "が現れた。";
        btkousin(usr);
    }

    damage(a) {
        this.hp -= a;
        document.getElementById("log").innerText += "あなたの攻撃。" + this.name + "に" + a + "のダメージ。\n";
        if (this.hp > 0) {
            var b = this.attack();
            var c = this.usr.Hdamage(b);
            document.getElementById("log").innerText += this.name + "の攻撃。あなたに" + c + "のダメージ。\n";

        }
        else {
            document.getElementById("log").innerText += this.name + "を倒した。";
            this.beat();
        }
        kousin();
        btkousin(this.usr);
    }

    beat() {
        for (var i = 0; i < this.dro; i++) {
            doev(100, this.drols);
        }
        //獲得処理
        var logs = "アイテムを手に入れた。\n";
        for (var i = 0; i < this.pok.length; i++) {
            if (this.pok[i] != 0) {
                this.usr.have[i] += this.pok[i];
                logs += items[i].thisname + "：" + this.pok[i] + "\n";
            }
        }
        document.getElementById("log").innerText += logs;
        onoff("sento", false);
        onoff("ob", true);
    }

    escape() {
        document.getElementById("log").innerText = "戦闘から逃げ出した。";
        onoff("sento", false);
        onoff("ob", true);
    }
}

//ゲームオーバークラス
function gameover() {
    document.getElementById("log").innerText += "あなたは力尽きた。";
    onoff("koudo", false);
}

//イベントデータ格納クラス
class events {
    constructor(kakuritu, does) {
        this.kakuritu = kakuritu;
        this.does = does;
    }
    get thiskaku() { return this.kakuritu; }
}

//消費素材クラス
class sozai {
    constructor(type, kosuu) {
        this.type = si(type);
        this.kosuu = kosuu;
    }
    get thistype() { return this.type; }
    get thiskosuu() { return this.kosuu; }
}

//制作メニュークラス
class seisaku {
    constructor(does, type, sozais) {
        this.does = does;
        this.type = si(type);
        this.sozais = sozais;
    }

    get thistype() { return this.type; }

    tukuru(targUser) {
        for (var i = 0; i < this.sozais.length; i++) {
            if (targUser.have[this.sozais[i].thistype] < this.sozais[i].thiskosuu) {
                return false;
            }
        }
        for (var i = 0; i < this.sozais.length; i++) {
            targUser.have[this.sozais[i].thistype] -= this.sozais[i].thiskosuu;
        }
        this.does(targUser);
        return true;
    }
}

//制作メニュー
const menu =
    [
        new seisaku(function (tag) { tag.have[si("尖った石")]++; }, "尖った石",
            [new sozai("石", 2)]),
        new seisaku(function (tag) { tag.have[si("石の槍")]++; }, "石の槍",
            [
                new sozai("尖った石", 1),
                new sozai("木のつる", 2),
                new sozai("木の枝", 3)
            ]),
        new seisaku(function (tag) { tag.have[si("骸の槍")]++; }, "骸の槍",
            [
                new sozai("鋭利な骨", 2),
                new sozai("丈夫な骨", 1)
            ]),
        new seisaku(function (tag) {
            tag.have[si("釣竿")]++;
            document.getElementById("tr").style.display = "inline-block";
        }, "釣竿",
            [
                new sozai("木の枝", 3),
                new sozai("木のつる", 2),
                new sozai("鋭利な骨", 1)
            ]),
        new seisaku(function (tag) {
            tag.have[si("かまど")]++;
            document.getElementById("box4").style.display = "block";
        }, "かまど",
            [
                new sozai("石", 8)
            ]),
        new seisaku(function (tag) {
            tag.have[si("葉っぱマント")]++;
            leafman = true;
        }, "葉っぱマント",
            [
                new sozai("木の葉", 10)
            ]),
        new seisaku(function (tag) {
            tag.have[si("毛皮の鎧")]++;
            fury = true;
        }, "毛皮の鎧",
            [
                new sozai("毛皮", 5)
            ]),
        new seisaku(function (tag) { tag.have[si("三玉槍")]++; }, "三玉槍",
            [
                new sozai("常盤色の玉髄", 1),
                new sozai("葡萄茶色の玉髄", 1),
                new sozai("瑠璃色の玉髄", 1)
            ]),
    ]
//かまどメニュー
const bikemenu =
    [
        new seisaku(function (tag) { tag.have[si("焼き肉")]++; }, "焼き肉",
            [new sozai("生肉", 1),
            new sozai("木の葉", 2)]),
        new seisaku(function (tag) { tag.have[si("焼き魚")]++; }, "焼き魚",
            [new sozai("生魚", 1),
            new sozai("木の葉", 1)])
    ]

//プレイヤーステータスクラス
class User {
    constructor() {
        this.HP = 100;
        this.FP = 50;
        this.have = new Array(items.length).fill(0);
    }

    get myHP() { return this.HP; }
    get myFP() { return this.FP; }

    Hsyouhi(volue) {
        this.HP -= volue;
        if (this.HP <= 0) {
            die = true;
        }
    }

    Hdamage(volue) {
        var dame = volue;
        if (leafman) {
            dame = Math.max(0, dame - 10);
        }
        if (fury) {
            dame = Math.max(0, dame - 20);
        }
        this.Hsyouhi(dame);
        return dame;
    }

    Fsyouhi(volue) {
        this.FP -= volue;
        if (this.FP <= 0) {
            die = true;
        }
    }

    syokuzi(volue) {
        this.FP += volue;
        this.FP = Math.min(this.FP, 500);
    }

    kaihuku(volue) {
        this.HP += volue;
        this.HP = Math.min(this.HP, 500);
    }

    //制作
    dossk(nmb) {
        var that = this;
        if (items[menu[nmb].thistype].thistype == 4 && this.have[menu[nmb].thistype] > 0) {
            document.getElementById("log").innerText = "もう必要ない。";
            return;
        }
        var boola = menu[nmb].tukuru(that);
        if (boola) {
            document.getElementById("log").innerText = items[menu[nmb].thistype].thisname + "を作った。";
            this.Hsyouhi(20);
            this.Fsyouhi(10);
            kousin();
        }
        else {
            document.getElementById("log").innerText = "素材が足りない。";
        }
    }

    //かまど使用
    dokmd(nmb) {
        var that = this;
        var boola = bikemenu[nmb].tukuru(that);
        if (boola) {
            document.getElementById("log").innerText = items[bikemenu[nmb].thistype].thisname + "を作った。";
            kousin();
        }
        else {
            document.getElementById("log").innerText = "素材が足りない。";
        }
    }

    //睡眠
    slp() {
        if (this.FP > 20) {
            var a = Math.max(Math.floor(this.FP / 2), 20);
            this.FP -= a;
            this.kaihuku(2 * (a - 10));
            document.getElementById("log").innerText = "休息して体力を回復した。";
        }
        else {
            document.getElementById("log").innerText = "空腹で寝付けない。";
        }
        kousin();
    }

    //釣り
    turi() {
        //入手したアイテム
        var that = this;
        var get = new Array(items.length).fill(0);
        //探索確率配列
        var findtr =
            [
                new events(1, function () {
                    get[si("瑠璃色の玉髄")] += 1;
                }),
                new events(10, function () {
                    get[si("生魚")] += 3;
                }),
                new events(20, function () {
                    get[si("生魚")] += 2;
                }),
                new events(30, function () {
                    get[si("生魚")] += 1;
                }),
                new events(40, function () {
                })
            ];
        doev(100, findtr);
        //獲得処理
        var getany = false;
        var logs = "アイテムを手に入れた。\n";
        for (var i = 0; i < get.length; i++) {
            if (get[i] != 0) {
                getany = true;
                that.have[i] += get[i];
                logs += items[i].thisname + "：" + get[i] + "\n";
            }
        }
        document.getElementById("log").innerText = logs;
        if (!getany) {
            document.getElementById("log").innerText = "何も釣れなかった。";
        }
        this.Hsyouhi(20);
        this.Fsyouhi(10);
        kousin();

    }

    //探索
    tansa() {
        var that = this;
        //入手したアイテム
        var get = new Array(items.length).fill(0);
        const tanev =
            [
                new events(85,
                    function () {
                        //探索確率配列
                        var findeve =
                            [
                                new events(0.3, function () {
                                    get[si("常盤色の玉髄")] += 1;
                                }),
                                new events(20, function () {
                                    get[si("木の葉")] += 1;
                                }),
                                new events(10, function () {
                                    get[si("バナナ")] += 2;
                                }),
                                new events(15, function () {
                                    get[si("バナナ")] += 1;
                                }),
                                new events(20, function () {
                                    get[si("木の枝")] += 1;
                                }),
                                new events(10, function () {
                                    get[si("木のつる")] += 1;
                                }),
                                new events(20, function () {
                                    get[si("石")] += 1;
                                }),
                                new events(5, function () {
                                    get[si("バナナ")] += 3;
                                })
                            ];
                        //３回実行
                        doev(100, findeve);
                        doev(100, findeve);
                        doev(100, findeve);
                        //獲得処理
                        var logs = "アイテムを手に入れた。\n";
                        for (var i = 0; i < get.length; i++) {
                            if (get[i] != 0) {
                                that.have[i] += get[i];
                                logs += items[i].thisname + "：" + get[i] + "\n";
                            }
                        }
                        document.getElementById("log").innerText = logs;
                    }
                ),
                new events(7,
                    function () {
                        new enemy("うさぎ", 50, function () {
                            var at = Math.random() * 2 + 1;
                            at = Math.floor(at) * 10;
                            return at;
                        }, that,
                            2,
                            [new events(40, function () {
                                target.pok[si("生肉")] += 1;
                            }),
                            new events(30, function () {
                                target.pok[si("毛皮")] += 1;
                            }),
                            new events(30, function () {
                                target.pok[si("鋭利な骨")] += 1;
                            })]
                        );
                    }
                ),
                new events(5,
                    function () {
                        new enemy("鹿", 80, function () {
                            var at = Math.random() * 4 + 2;
                            at = Math.floor(at) * 10;
                            return at;
                        }, that,
                            3,
                            [new events(30, function () {
                                target.pok[si("生肉")] += 1;
                            }),
                            new events(25, function () {
                                target.pok[si("毛皮")] += 1;
                            }),
                            new events(25, function () {
                                target.pok[si("丈夫な骨")] += 1;
                            }),
                            new events(20, function () {
                                target.pok[si("鋭利な骨")] += 1;
                            })]
                        );
                    }
                ),
                new events(3,
                    function () {
                        new enemy("熊", 150, function () {
                            var at = Math.random() * 5 + 5;
                            at = Math.floor(at) * 10;
                            return at;
                        }, that,
                            5,
                            [
                                new events(3, function () {
                                    target.pok[si("葡萄茶色の玉髄")] += 1;
                                }),
                                new events(40, function () {
                                    target.pok[si("生肉")] += 1;
                                }),
                                new events(40, function () {
                                    target.pok[si("毛皮")] += 1;
                                }),
                                new events(20, function () {
                                    target.pok[si("丈夫な骨")] += 1;
                                })]
                        );
                    }
                )
            ];
        doev(100, tanev);
        this.Hsyouhi(20);
        this.Fsyouhi(10);
        kousin();
    }
}

var me = new User();



//画面の更新
function kousin() {
    document.getElementById("hp").innerText = me.myHP;
    document.getElementById("fp").innerText = me.myFP;
    //持ち物更新
    var menuList =
        [
            document.getElementById("item"),
            document.getElementById("food"),
            document.getElementById("weapon"),
            document.getElementById("item"),
            document.getElementById("snt")
        ];
    for (var i = 0; i < menuList.length; i++) {
        while (menuList[i].firstChild) {
            menuList[i].removeChild(menuList[i].firstChild);
        }
    }
    for (var i = 0; i < items.length; i++) {
        var itemdoc = document.createElement("li");
        itemdoc.setAttribute("class", 'narabi')
        var itemdoc1 = document.createElement("div");
        itemdoc1.textContent = items[i].thisname + "：" + me.have[i];
        itemdoc.appendChild(itemdoc1);
        if (items[i].type == 1) {
            var itemdoc2 = document.createElement("button");
            itemdoc2.setAttribute("class", 'koudo ob');
            itemdoc2.setAttribute("value", i);
            itemdoc2.addEventListener("click",
                //食べるボタン処理
                function () {
                    var a = parseInt(this.value);
                    console.log(a);
                    me.have[a] -= 1;
                    me.syokuzi(items[a].thisstatus);
                    kousin();
                }
            )
            itemdoc2.innerText = "食べる";
            itemdoc.appendChild(itemdoc2);
        }
        if (me.have[i] != 0) {
            menuList[items[i].thistype].appendChild(itemdoc);
        }
    }
    if (die) {
        gameover();
    }
}


kousin();
document.getElementById("tns").onclick = function () { me.tansa(); };
document.getElementById("slp").onclick = function () { me.slp(); };
document.getElementById("tr").onclick = function () { me.turi(); };

document.getElementById("btat").onclick = function () { sento(); };
document.getElementById("btes").onclick = function () { target.escape(); }
//制作メニュー展開！
var box3doc = document.getElementById("box3");
for (var i = 0; i < menu.length; i++) {
    var menudoc1 = document.createElement("p");
    menudoc1.setAttribute("class", 'narabi')
    var menudoc2 = document.createElement("div");
    menudoc2.innerText = items[menu[i].thistype].thisname;
    var menudoc3 = document.createElement("button");
    menudoc3.innerText = "作る";
    menudoc3.setAttribute("value", i);
    menudoc3.setAttribute("class", "koudo ob");
    menudoc3.addEventListener("click", function () {
        var a = parseInt(this.value);
        me.dossk(a);
    });
    var menudoc4 = document.createElement("ul");
    for (var j = 0; j < menu[i].sozais.length; j++) {
        var menudoc5 = document.createElement("li");
        menudoc5.innerText = items[menu[i].sozais[j].thistype].thisname + "：" + menu[i].sozais[j].thiskosuu;
        menudoc4.appendChild(menudoc5);
    }
    menudoc1.appendChild(menudoc2);
    menudoc1.appendChild(menudoc3);
    menudoc1.appendChild(menudoc4);
    box3doc.appendChild(menudoc1);
}

//かまどメニュー展開！
var box3doc = document.getElementById("box4");
for (var i = 0; i < bikemenu.length; i++) {
    var menudoc1 = document.createElement("p");
    menudoc1.setAttribute("class", 'narabi')
    var menudoc2 = document.createElement("div");
    menudoc2.innerText = items[bikemenu[i].thistype].thisname;
    var menudoc3 = document.createElement("button");
    menudoc3.innerText = "作る";
    menudoc3.setAttribute("value", i);
    menudoc3.setAttribute("class", "koudo ob");
    menudoc3.addEventListener("click", function () {
        var a = parseInt(this.value);
        me.dokmd(a);
    });
    var menudoc4 = document.createElement("ul");
    for (var j = 0; j < bikemenu[i].sozais.length; j++) {
        var menudoc5 = document.createElement("li");
        menudoc5.innerText = items[bikemenu[i].sozais[j].thistype].thisname + "：" + bikemenu[i].sozais[j].thiskosuu;
        menudoc4.appendChild(menudoc5);
    }
    menudoc1.appendChild(menudoc2);
    menudoc1.appendChild(menudoc3);
    menudoc1.appendChild(menudoc4);
    box3doc.appendChild(menudoc1);
}