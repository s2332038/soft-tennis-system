//------------------------------------
// 初期データ作成
//------------------------------------

function createDefaultData() {

    return {

        setup: {},

        score: {

            myGame: 0,
            opGame: 0,

            myPoint: 0,
            opPoint: 0

        },

        records: [],

        history: []

    };

}

//------------------------------------
// 初期化
//------------------------------------

if (!localStorage.getItem("matchData")) {

    localStorage.setItem(
        "matchData",
        JSON.stringify(createDefaultData())
    );

}

//------------------------------------
// データ取得
//------------------------------------

function getData() {

    return JSON.parse(
        localStorage.getItem("matchData")
    );

}

//------------------------------------
// データ保存
//------------------------------------

function saveData(data) {

    localStorage.setItem(
        "matchData",
        JSON.stringify(data)
    );

}

//------------------------------------
// スコア表示
//------------------------------------

function updateScoreBoard() {

    const data = getData();

    const game =
        document.getElementById("gameCount");

    const point =
        document.getElementById("pointCount");

    if (game) {

        game.innerText =
            `${data.score.myGame} : ${data.score.opGame}`;

    }

    if (point) {

        point.innerText =
            `${data.score.myPoint} : ${data.score.opPoint}`;

    }

}

//------------------------------------
// record → win
//------------------------------------

function goWinPage() {

    const position =
        sessionStorage.getItem(
            "startPosition"
        );

    const serve =
        sessionStorage.getItem(
            "startServe"
        );

    if (!position) {

        alert("後衛・前衛を選択してください");
        return;

    }

    if (!serve) {

        alert("開始状況を選択してください");
        return;

    }

    sessionStorage.setItem(

        "rallyCount",

        document.getElementById(
            "rallyCount"
        ).value

    );

    location.href = "win.html";

}

//------------------------------------
// record → lose
//------------------------------------

function goLosePage() {

    const position =
        sessionStorage.getItem(
            "startPosition"
        );

    const serve =
        sessionStorage.getItem(
            "startServe"
        );

    if (!position) {

        alert("後衛・前衛を選択してください");
        return;

    }

    if (!serve) {

        alert("開始状況を選択してください");
        return;

    }

    sessionStorage.setItem(

        "rallyCount",

        document.getElementById(
            "rallyCount"
        ).value

    );

    location.href = "lose.html";

}

//------------------------------------
// ファイナルゲーム判定
//------------------------------------

function isFinalGame(data) {

    const gameType =
        Number(
            data.setup.gameType
        );

    if (gameType === 5) {

        return (
            data.score.myGame === 2 &&
            data.score.opGame === 2
        );

    }

    if (gameType === 7) {

        return (
            data.score.myGame === 3 &&
            data.score.opGame === 3
        );

    }

    return false;

}

//------------------------------------
// ゲーム取得判定
//------------------------------------

function checkGameWinner(data) {

    const my = data.score.myPoint;
    const op = data.score.opPoint;

    //--------------------------------
    // ファイナルゲーム
    //--------------------------------

    if (isFinalGame(data)) {

        if (
            (my >= 7 || op >= 7) &&
            Math.abs(my - op) >= 2
        ) {

            if (my > op) {

                data.score.myGame++;

            } else {

                data.score.opGame++;

            }

            data.score.myPoint = 0;
            data.score.opPoint = 0;

        }

        return;
    }

    //--------------------------------
    // 通常ゲーム
    //--------------------------------

    if (
        (my >= 4 || op >= 4) &&
        Math.abs(my - op) >= 2
    ) {

        if (my > op) {

            data.score.myGame++;

        } else {

            data.score.opGame++;

        }

        data.score.myPoint = 0;
        data.score.opPoint = 0;

    }

}

//------------------------------------
// 試合終了判定
//------------------------------------

function checkMatchWinner(data) {

    const target =

        data.setup.gameType === "5"
            ? 3
            : 4;

    if (

        data.score.myGame >= target ||

        data.score.opGame >= target

    ) {

        saveData(data);

        location.href =
            "result.html";

        return true;

    }

    return false;

}
//------------------------------------
// 得点保存
//------------------------------------

function saveWinPoint() {

    const data = getData();

    const winner =
        sessionStorage.getItem(
            "winner"
        );

    let reason =
        sessionStorage.getItem(
            "winReason"
        );

    const other =
        document.getElementById(
            "otherReason"
        )?.value;

    if (
        other &&
        other.trim() !== ""
    ) {

        reason = other;

    }

    if (!winner) {

        alert(
            "得点した人を選択してください"
        );

        return;

    }

    if (!reason) {

        alert(
            "得点要因を選択してください"
        );

        return;

    }

    //--------------------------------
    // 戻る用履歴保存
    //--------------------------------

    data.history.push(

        JSON.parse(
            JSON.stringify(
                data.score
            )
        )

    );

    //--------------------------------
    // ポイント加算
    //--------------------------------

    data.score.myPoint++;

    //--------------------------------
    // 記録保存
    //--------------------------------

    data.records.push({

        type: "win",

        player: winner,

        reason: reason,

        startPosition:
            sessionStorage.getItem(
                "startPosition"
            ),

        startServe:
            sessionStorage.getItem(
                "startServe"
            ),

        rallyCount:
            sessionStorage.getItem(
                "rallyCount"
            ),

        game:
            `${data.score.myGame}:${data.score.opGame}`,

        point:
            `${data.score.myPoint}:${data.score.opPoint}`

    });

    //--------------------------------
    // ゲーム判定
    //--------------------------------

    checkGameWinner(data);

    saveData(data);

    //--------------------------------
    // 試合終了判定
    //--------------------------------

    if (
        checkMatchWinner(data)
    ) {

        return;

    }

    location.href =
        "record.html";

}

//------------------------------------
// 失点保存
//------------------------------------

function saveLosePoint() {

    const data = getData();

    const loser =
        sessionStorage.getItem(
            "loser"
        );

    let reason =
        sessionStorage.getItem(
            "loseReason"
        );

    const other =
        document.getElementById(
            "otherReason"
        )?.value;

    if (
        other &&
        other.trim() !== ""
    ) {

        reason = other;

    }

    if (!loser) {

        alert(
            "失点した人を選択してください"
        );

        return;

    }

    if (!reason) {

        alert(
            "失点要因を選択してください"
        );

        return;

    }

    //--------------------------------
    // 履歴保存
    //--------------------------------

    data.history.push(

        JSON.parse(
            JSON.stringify(
                data.score
            )
        )

    );

    //--------------------------------
    // 相手ポイント加算
    //--------------------------------

    data.score.opPoint++;

    //--------------------------------
    // 記録保存
    //--------------------------------

    data.records.push({

        type: "lose",

        player: loser,

        reason: reason,

        startPosition:
            sessionStorage.getItem(
                "startPosition"
            ),

        startServe:
            sessionStorage.getItem(
                "startServe"
            ),

        rallyCount:
            sessionStorage.getItem(
                "rallyCount"
            ),

        game:
            `${data.score.myGame}:${data.score.opGame}`,

        point:
            `${data.score.myPoint}:${data.score.opPoint}`

    });

    //--------------------------------
    // ゲーム判定
    //--------------------------------

    checkGameWinner(data);

    saveData(data);

    //--------------------------------
    // 試合終了判定
    //--------------------------------

    if (
        checkMatchWinner(data)
    ) {

        return;

    }

    location.href =
        "record.html";

}

//------------------------------------
// 1ポイント戻る
//------------------------------------

//------------------------------------
// １つ前のポイントへ戻る
//------------------------------------

function undoPoint() {

    const data = getData();

    if (
        data.history.length === 0
    ) {

        alert(
            "戻れるポイントがありません"
        );

        return;

    }

    const ok = confirm(
        "１つ前のポイントに戻しますか？"
    );

    if (!ok) {

        return;

    }

    //--------------------------------
    // スコア復元
    //--------------------------------

    const prevScore =
        data.history.pop();

    data.score = prevScore;

    //--------------------------------
    // 記録削除
    //--------------------------------

    if (
        data.records.length > 0
    ) {

        data.records.pop();

    }

    saveData(data);

    updateScoreBoard();

    alert(
        "１つ前のポイントへ戻しました"
    );

}
//------------------------------------
// 記録中断
//------------------------------------

function abortMatch() {

    const ok = confirm(

        "記録をリセットしてよろしいですか？\n\n記録内容は削除されます。"

    );

    if (!ok) {

        return;

    }

    //--------------------------------
    // LocalStorage削除
    //--------------------------------

    localStorage.removeItem(
        "matchData"
    );

    //--------------------------------
    // SessionStorage削除
    //--------------------------------

    sessionStorage.clear();

    //--------------------------------
    // トップへ戻る
    //--------------------------------

    location.href =
        "../index.html";

}
//------------------------------------
// 結果画面表示
//------------------------------------

function showResult() {

    const data = getData();

    const area =
        document.getElementById(
            "resultInfo"
        );

    if (!area) return;

    let html = "";

    html += `
    <p><strong>日付：</strong>${data.setup.date}</p>

    <p><strong>タイトル：</strong>${data.setup.title}</p>

    <p><strong>対戦相手：</strong>${data.setup.opponent}</p>

    <p><strong>コート：</strong>${data.setup.court}</p>

    <p><strong>天気：</strong>${data.setup.weather}</p>

    <p><strong>風：</strong>${data.setup.wind}</p>

    <p><strong>ゲーム数：</strong>${data.setup.gameType}ゲームマッチ</p>

    <hr>
    `;

    html += `
    <h2>

    最終ゲームカウント

    ${data.score.myGame}
    :
    ${data.score.opGame}

    </h2>
    `;

    html += `
    <table border="1"
           style="
           width:100%;
           border-collapse:collapse;
           ">

    <tr>

    <th>結果</th>

    <th>ゲーム</th>

    <th>ポイント</th>

    <th>開始</th>

    <th>ラリー</th>

    <th>担当</th>

    <th>要因</th>

    </tr>
    `;

    data.records.forEach(r => {

        html += `
        <tr>

        <td style="
            background:${r.type === "win" ? "#dbeafe" : "#fee2e2"};
            color:${r.type === "win" ? "#00cc22" : "#cc0000"};
            font-weight:bold;
            text-align:center;
        ">

        ${r.type === "win"
            ? "得点"
            : "失点"}

        </td>

        <td>

        ${r.game}

        </td>

        <td>

        ${r.point}

        </td>

        <td>

        ${r.startPosition}
        ${r.startServe}

        </td>

        <td>

        ${r.rallyCount}

        </td>

        <td>

        ${r.player === "なし"
            ? ""
            : r.player}

        </td>

        <td>

        ${r.reason}

        </td>

        </tr>
        `;

    });

    html += `</table>`;

    area.innerHTML = html;

}

//------------------------------------
// 分析画面表示
//------------------------------------

function showAnalysis() {

    const data = getData();

    const serveArea =
        document.getElementById(
            "serveAnalysis"
        );

    const winArea =
        document.getElementById(
            "winAnalysis"
        );

    const loseArea =
        document.getElementById(
            "loseAnalysis"
        );

    if (!serveArea) return;

    //--------------------------------
    // 集計
    //--------------------------------

    const serveCount = {};

    const winCount = {};

    const loseCount = {};

    data.records.forEach(r => {

        const serveKey =
            `${r.startPosition}-${r.startServe}`;

        serveCount[serveKey] =
            (serveCount[serveKey] || 0) + 1;

        if (r.type === "win") {

            const key =
                `${r.player}-${r.reason}`;

            winCount[key] =
                (winCount[key] || 0) + 1;

        }

        if (r.type === "lose") {

            const key =
                `${r.player}-${r.reason}`;

            loseCount[key] =
                (loseCount[key] || 0) + 1;

        }

    });

    //--------------------------------
    // サーブ確率集計
    //--------------------------------

    const serveStats = {
        前衛: {
            first: 0,
            second: 0,
            doubleFault: 0
        },
        後衛: {
            first: 0,
            second: 0,
            doubleFault: 0
        }
    };

    data.records.forEach(r => {

        const pos = r.startPosition;

        if (!serveStats[pos]) return;

        if (r.startServe === "1サーブ") {
            serveStats[pos].first++;
        }

        if (r.startServe === "2サーブ") {
            serveStats[pos].second++;
        }

        // ダブルフォルト
        if (r.reason === "ダブルフォルト") {
            serveStats[pos].doubleFault++;
        }

    });

    //--------------------------------
    // サーブ分析
    //--------------------------------

    let serveHtml = `
    <h3>サーブ開始回数</h3>

    <table border="1">
    <tr>
    <th>開始状況</th>
    <th>回数</th>
    </tr>
    `;

    for (let key in serveCount) {

        serveHtml += `
        <tr>
        <td>${key}</td>
        <td>${serveCount[key]}</td>
        </tr>
        `;
    }

    serveHtml += `
    </table>

    <br>

    <h3>サーブ確率</h3>

    <table border="1">
    <tr>
    <th>ポジション</th>
    <th>1サーブ%</th>
    <th>2サーブ%</th>
    <th>ダブルフォルト%</th>
    </tr>
    `;

    ["前衛","後衛"].forEach(pos => {

        const first =
            serveStats[pos].first;

        const second =
            serveStats[pos].second;

        const df =
            serveStats[pos].doubleFault;

        const total =
            first + second;

        let firstRate = 0;
        let dfRate = 0;
        let secondRate = 0;

        if(total > 0){

            firstRate =
                first / total * 100;

            dfRate =
                df / total * 100;

            secondRate =
                100 -
                firstRate -
                dfRate;
        }

        serveHtml += `
        <tr>
            <td>${pos}</td>
            <td>${firstRate.toFixed(1)}%</td>
            <td>${secondRate.toFixed(1)}%</td>
            <td>${dfRate.toFixed(1)}%</td>
        </tr>
        `;
    });

    serveHtml += `
    </table>
    `;

    serveArea.innerHTML = serveHtml;

    //--------------------------------
    // 得点分析
    //--------------------------------

    let winHtml = `
    <table border="1">

    <tr>

    <th>得点要因</th>

    <th>回数</th>

    </tr>
    `;

    for (let key in winCount) {

        winHtml += `
        <tr>

        <td>${key}</td>

        <td>${winCount[key]}</td>

        </tr>
        `;

    }

    winHtml += `</table>`;

    winArea.innerHTML = winHtml;

    //--------------------------------
    // 失点分析
    //--------------------------------

    let loseHtml = `
    <table border="1">

    <tr>

    <th>失点要因</th>

    <th>回数</th>

    </tr>
    `;

    for (let key in loseCount) {

        loseHtml += `
        <tr>

        <td>${key}</td>

        <td>${loseCount[key]}</td>

        </tr>
        `;

    }

    loseHtml += `</table>`;

    loseArea.innerHTML = loseHtml;
    //--------------------------------
    // 得点・失点推移グラフ
    //--------------------------------

    const scoreLabels = [];

    const scoreData = [];

    data.records.forEach((r,index) => {

        scoreLabels.push(index + 1);

        if(r.type === "win"){

            scoreData.push(1);

        }else{

            scoreData.push(0);

        }

    });

    const scoreCanvas =
        document.getElementById(
            "scoreChart"
        );

    if(scoreCanvas){

        new Chart(
            scoreCanvas,
            {

                type:"line",

                data:{

                    labels:scoreLabels,

                    datasets:[{

                        label:
                        "得点=1 失点=0",

                        data:scoreData,

                        tension:0.2

                    }]

                },

                options:{

                    responsive:true,

                    scales:{

                        y:{

                            min:0,

                            max:1,

                            ticks:{

                                stepSize:1

                            }

                        }

                    }

                }

            }
        );

    }

    //--------------------------------
    // 得点要因棒グラフ
    //--------------------------------

    const winLabels = [];

    const winData = [];

    for(let key in winCount){

        winLabels.push(key);

        winData.push(
            winCount[key]
        );

    }

    const winCanvas =
        document.getElementById(
            "winChart"
        );

    if(winCanvas){

        new Chart(
            winCanvas,
            {

                type:"bar",

                data:{

                    labels:winLabels,

                    datasets:[{

                        label:"得点回数",

                        data:winData

                    }]

                },

                options:{

                    responsive:true,

                    plugins:{

                        legend:{
                            display:false
                        }

                    },

                    scales:{

                        y:{
                            beginAtZero:true
                        }

                    }

                }

            }
        );

    }

    //--------------------------------
    // 失点要因棒グラフ
    //--------------------------------

    const loseLabels = [];

    const loseData = [];

    for(let key in loseCount){

        loseLabels.push(key);

        loseData.push(
            loseCount[key]
        );

    }

    const loseCanvas =
        document.getElementById(
            "loseChart"
        );

    if(loseCanvas){

        new Chart(
            loseCanvas,
            {

                type:"bar",

                data:{

                    labels:loseLabels,

                    datasets:[{

                        label:"失点回数",

                        data:loseData

                    }]

                },

                options:{

                    responsive:true,

                    plugins:{

                        legend:{
                            display:false
                        }

                    },

                    scales:{

                        y:{
                            beginAtZero:true
                        }

                    }

                }

            }
        );

    }

}

//------------------------------------
// 試合記録結果＋分析結果 PDF保存
//------------------------------------

function saveMatchPDF() {

    if (typeof html2pdf === "undefined") {

        alert(
            "html2pdfライブラリが読み込まれていません"
        );

        return;

    }

    const data = getData();

    //--------------------------------
    // 集計
    //--------------------------------

    const serveCount = {};
    const winCount = {};
    const loseCount = {};

    const serveStats = {
        前衛:{
            first:0,
            second:0,
            doubleFault:0
        },
        後衛:{
            first:0,
            second:0,
            doubleFault:0
        }
    };

    data.records.forEach(r => {

        const serveKey =
            `${r.startPosition}-${r.startServe}`;

        serveCount[serveKey] =
            (serveCount[serveKey] || 0) + 1;

        if (r.type === "win") {

            const key =
                `${r.player === "なし" ? "" : r.player} ${r.reason}`;

            winCount[key] =
                (winCount[key] || 0) + 1;

        }

        if (r.type === "lose") {

            const key =
                `${r.player === "なし" ? "" : r.player} ${r.reason}`;

            loseCount[key] =
                (loseCount[key] || 0) + 1;

        }

        const pos = r.startPosition;

        if (serveStats[pos]) {

            if (r.startServe === "1サーブ") {
                serveStats[pos].first++;
            }

            if (r.startServe === "2サーブ") {
                serveStats[pos].second++;
            }

            if (r.reason === "ダブルフォルト") {
                serveStats[pos].doubleFault++;
            }

        }

    });

    //--------------------------------
    // PDF作成用HTML
    //--------------------------------

    let html = `

    <div style="
    font-family:Yu Gothic;
    padding:20px;
    ">

    <h1>
    ソフトテニス試合記録
    </h1>

    <hr>

    <h2>
    試合情報
    </h2>

    <p>日付：${data.setup.date}</p>

    <p>タイトル：${data.setup.title}</p>

    <p>対戦相手：${data.setup.opponent}</p>

    <p>コート：${data.setup.court}</p>

    <p>天気：${data.setup.weather}</p>

    <p>風：${data.setup.wind}</p>

    <p>ゲーム数：${data.setup.gameType}ゲームマッチ</p>

    <h2>
    最終スコア
    </h2>

    <h3>
    ${data.score.myGame}
    :
    ${data.score.opGame}
    </h3>

    <hr>

    <h2>
    試合記録結果
    </h2>

    <table border="1"
    style="
    width:100%;
    border-collapse:collapse;
    ">

    <tr>

    <th>結果</th>

    <th>ゲーム</th>

    <th>ポイント</th>

    <th>開始</th>

    <th>ラリー</th>

    <th>担当</th>

    <th>要因</th>

    </tr>
    `;

    //--------------------------------
    // 記録結果
    //--------------------------------

    data.records.forEach(r => {

        html += `

        <tr>

        <td style="
            color:${r.type === "win" ? "green" : "red"};
            font-weight:bold;
        ">
        ${r.type === "win"
            ? "得点"
            : "失点"}
        </td>

        <td>
        ${r.game}
        </td>

        <td>
        ${r.point}
        </td>

        <td>
        ${r.startPosition}
        ${r.startServe}
        </td>

        <td>
        ${r.rallyCount}
        </td>

        <td>
        ${r.player === "なし"
            ? ""
            : r.player}
        </td>

        <td>
        ${r.reason}
        </td>

        </tr>
        `;

    });

    html += `
    </table>

    <br><br>

    <h2>
    分析結果
    </h2>

    <h3>
    サーブ開始分析
    </h3>

    <table border="1"
    style="
    width:100%;
    border-collapse:collapse;
    ">

    <tr>

    <th>開始状況</th>

    <th>回数</th>

    </tr>
    `;

    //--------------------------------
    // サーブ分析
    //--------------------------------

    for (let key in serveCount) {

        html += `
        <tr>

        <td>${key}</td>

        <td>${serveCount[key]}</td>

        </tr>
        `;

    }

        html += `
        <br>

        <h3>
        サーブ確率
        </h3>

        <table border="1"
        style="
        width:100%;
        border-collapse:collapse;
        ">

        <tr>
        <th>ポジション</th>
        <th>1サーブ%</th>
        <th>2サーブ%</th>
        <th>ダブルフォルト%</th>
        </tr>
        `;

        ["前衛","後衛"].forEach(pos=>{

        const first =
            serveStats[pos].first;

        const second =
            serveStats[pos].second;

        const df =
            serveStats[pos].doubleFault;

        const total =
            first + second;

        let firstRate = 0;
        let secondRate = 0;
        let dfRate = 0;

        if(total > 0){

            firstRate =
                first / total * 100;

            dfRate =
                df / total * 100;

            secondRate =
                100 -
                firstRate -
                dfRate;
        }

        html += `
        <tr>
            <td>${pos}</td>
            <td>${firstRate.toFixed(1)}%</td>
            <td>${secondRate.toFixed(1)}%</td>
            <td>${dfRate.toFixed(1)}%</td>
        </tr>
        `;
    });

    html += `
    </table>
    <br>
    `;

    html += `
    </table>

    <br>

    <h3>
    得点要因分析
    </h3>

    <table border="1"
    style="
    width:100%;
    border-collapse:collapse;
    ">

    <tr>

    <th>要因</th>

    <th>回数</th>

    </tr>
    `;

    //--------------------------------
    // 得点分析
    //--------------------------------

    for (let key in winCount) {

        html += `
        <tr>

        <td>${key}</td>

        <td>${winCount[key]}</td>

        </tr>
        `;

    }

    html += `
    </table>

    <br>

    <h3>
    失点要因分析
    </h3>

    <table border="1"
    style="
    width:100%;
    border-collapse:collapse;
    ">

    <tr>

    <th>要因</th>

    <th>回数</th>

    </tr>
    `;

    //--------------------------------
    // 失点分析
    //--------------------------------

    for (let key in loseCount) {

        html += `
        <tr>

        <td>${key}</td>

        <td>${loseCount[key]}</td>

        </tr>
        `;

    }

    html += `
    </table>

    </div>
    `;

    //--------------------------------
    // PDF生成
    //--------------------------------

    const element =
        document.createElement("div");

    element.innerHTML = html;

    html2pdf()

        .set({

            margin: 10,

            filename:
            `試合記録_${data.setup.date}.pdf`,

            image: {
                type: "jpeg",
                quality: 1
            },

            html2canvas: {
                scale: 2,
                scrollY: 0
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }

        })

        .from(element)

        .save();

}

//------------------------------------
// 終了
//------------------------------------

function finishMatch() {

    const ok = confirm(

        "試合記録を終了しますか？"

    );

    if (!ok) {

        return;

    }

    localStorage.removeItem(
        "matchData"
    );

    sessionStorage.clear();

    location.href =
        "../index.html";

}