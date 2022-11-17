const canvas = document.querySelector("#canvas");

const ctx = canvas.getContext("2d");

let vw = (canvas.width = window.innerWidth);
let vh = (canvas.height = window.innerHeight);

let Ball = function () {
  // 初始位置為各解析度畫面正中間
  (this.位置 = {
    x: vw / 2,
    y: vh / 2,
  }),
    // 初始速度為上下左右每秒 5px
    (this.速度 = {
      x: 1,
      y: 1,
    }),
    // 初始加速度為上下每秒 5px
    (this.加速度 = {
      x: 0,
      y: 1,
    });
  // 初始圓球大小，以半徑 r 繪製
  this.半徑 = 70;
  // 初始化圓球拖曳狀態
  this.dragging = false;
};

// !新增圓球在畫出情況下的方法
Ball.prototype.draw = function () {
  // 整張畫布的背景色
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, vw, vh);

  //球體顏色
  ctx.beginPath();
  ctx.save();
  ctx.translate(this.位置.x, this.位置.y);
  ctx.arc(0, 0, this.半徑, 0, Math.PI * 2);
  ctx.fillStyle = control.顏色;
  ctx.fill();
  ctx.restore();

  // 呼叫速度線
  this.drawLine()
};

// !新增圓球在更新物理屬性情況下的方法
Ball.prototype.update = function () {
  //假如圓球不是拖曳狀態，則執行更新函式
  if (this.dragging === false) {
    // 物件Ball的位置為初始位置加上速度的位置，讓他會移動
    this.位置.x += this.速度.x;
    this.位置.y += this.速度.y;

    // 物件Ball的速度為初始速度加上初始加速度，讓他會快速移動
    this.速度.x += this.加速度.x;
    this.速度.y += this.加速度.y;

    // 物件Ball的摩擦力為初始速度乘上值，讓他移動幅度減少
    this.速度.x *= control.摩擦力;
    this.速度.y *= control.摩擦力;

    //呼叫檢查邊界函式
    this.checkSide();

    //gui dashboard導入最新的圓球速度
    control.速度x = this.速度.x;
    control.速度y = this.速度.y;
    control.加速度y = this.加速度.y;
  }
};

// !新增圓球的速度線
Ball.prototype.drawLine = function () {
  // 運動軌跡線
  ctx.beginPath()
  ctx.save()
  ctx.translate(this.位置.x, this.位置.y)
  ctx.scale(3,3)
  ctx.moveTo(0,0)
  ctx.lineTo(this.速度.x, this.速度.y)
  ctx.strokeStyle = 'blue'
  ctx.stroke()
  ctx.restore()

  // 水平移動線
  ctx.beginPath()
  ctx.save()
  ctx.translate(this.位置.x, this.位置.y)
  ctx.scale(3,3)
  ctx.moveTo(0,0)
  ctx.lineTo(this.速度.x,0)
  ctx.strokeStyle = 'red'
  ctx.stroke()
  ctx.restore()

    // 垂直移動線
    ctx.beginPath()
    ctx.save()
    ctx.translate(this.位置.x, this.位置.y)
    ctx.scale(3,3)
    ctx.moveTo(0,0)
    ctx.lineTo(0, this.速度.y)
    ctx.strokeStyle = 'green'
    ctx.stroke()
    ctx.restore()
}

// !檢查圓球是否超出邊界
Ball.prototype.checkSide = function () {
  // 球的圓心 + 球的半徑，如果大於畫面右邊的值（畫面寬度）
  if (this.位置.x + this.半徑 > vw) {
    // 給球加上原本速度的絕對值加上負號，使他往畫面左邊跑
    this.速度.x = -Math.abs(this.速度.x);
  }
  // 球的圓心 - 球的半徑，如果小於畫面左邊的值（畫面寬度）
  if (this.位置.x - this.半徑 < 0) {
    // 給球加上原本負值的速度加上絕對值，使他往畫面右邊跑
    this.速度.x = Math.abs(this.速度.x);
  }
  // 球的圓心 + 球的半徑，如果大於畫面下邊的值（畫面高度）
  if (this.位置.y + this.半徑 > vh) {
    // 給球加上原本速度的絕對值，使他往畫面上邊跑
    this.速度.y = -Math.abs(this.速度.y);
  }
  // 球的圓心 - 球的半徑，如果小於畫面上邊的值（畫面高度）
  if (this.位置.y - this.半徑 < 0) {
    // 給球加上原本負值的速度加上絕對值，使他往畫面下邊跑
    this.速度.y = Math.abs(this.速度.y);
  }
};



let control = {
  速度x: 0,
  速度y: 0,
  加速度y: 0.6,
  摩擦力: 0.99,
  update: true,
  顏色: "#fff",
  step: () => {
    ball.update();
  },
  FPS: 30,
};

// 新增GUI控制面板
let gui = new dat.GUI();
// 新增GUI控制項
// gui.add(控制項預設物件, 控制項物件名稱, 預設起使值, 預設結束值)
// .listen() => 拿來監聽控制項物件的值並反應在面板上
// .onChange((value) => {}) => 監聽物件的值被改變時，回傳value
// .step(值) => 可帶入定義的控制最小值

gui
  .add(control, "速度x", -50, 50)
  .listen()
  .onChange((value) => {
    ball.速度.x = value;
  });
gui
  .add(control, "速度y", -50, 50)
  .listen()
  .onChange((value) => {
    ball.速度.y = value;
  });
gui
  .add(control, "加速度y", -1, 1)
  .step(0.001)
  .listen()
  .onChange((value) => {
    ball.加速度.y = value;
  });
gui.add(control, "摩擦力", -1, 1).step(0.001).listen();
gui.add(control, "update").listen();
gui.addColor(control, "顏色").listen();
gui.add(control, "step").listen();
gui.add(control, "FPS", 1, 120).listen();

let ball;
// !初始化圓球設定
function init() {
  ball = new Ball();
  bgDraw();
}
init();

// !更新圓球物理屬性
function update() {
  if (control.update == true) {
    ball.update();
  }
}
// 每隔 1秒 執行30次指定的函式
setInterval(update, 1000 / 30);

// !畫出圓球
function bgDraw() {
  ball.draw();
  setTimeout(bgDraw, 1000 / control.FPS);
}

// 定義滑鼠拖曳圓球
let 滑鼠位置 = {
  x: 0,
  y: 0,
};

// !監聽滑鼠按著事件
canvas.addEventListener("mousedown", (e) => {
  // 賦於滑鼠點擊時的位置
  滑鼠位置 = {
    x: e.x,
    y: e.y,
  };
  // 用距離函式判斷滑鼠點擊時距離圓球半徑的距離
  let 判斷距離 = 取得距離(滑鼠位置, ball.位置);
  // 如果滑鼠點擊時位置小於圓球半徑，更改拖曳狀態
  if (判斷距離 <= ball.半徑) {
    ball.dragging = true;
  }
});

// !監聽滑鼠放開事件
canvas.addEventListener("mouseup", (e) => {
  ball.dragging = false;
});

// !監聽滑鼠移動事件
canvas.addEventListener("mousemove", (e) => {
  // 紀錄滑鼠移動後最新的位置
  let 滑鼠最新位置 = {
    x: e.x,
    y: e.y,
  };

  //假如圓球拖曳狀態開啟
  if (ball.dragging === true) {
    // 計算滑鼠位置與滑鼠最新位置的距離
    let 滑鼠距離x = 滑鼠最新位置.x - 滑鼠位置.x;
    let 滑鼠距離y = 滑鼠最新位置.y - 滑鼠位置.y;

    //將滑鼠距離差加到圓球位置上，產生同步偏移
    ball.位置.x += 滑鼠距離x;
    ball.位置.y += 滑鼠距離y;

    // 將圓球的最後加速度等於滑鼠距離的值，產生丟出去的感覺
    ball.速度.x = 滑鼠距離x;
    ball.速度.y = 滑鼠距離y;
  }

  //滑鼠移到圓球內時，鼠標改變
  let 滑鼠距離 = 取得距離(滑鼠最新位置, ball.位置);
  滑鼠距離 <= ball.半徑
    ? (canvas.style.cursor = "move")
    : (canvas.style.cursor = "initial");

  滑鼠位置 = 滑鼠最新位置;
});

// !監聽觸控按著事件
canvas.addEventListener("touchstart", (e) => {
  // 賦於滑鼠點擊時的位置
  滑鼠位置 = {
    x: e.x,
    y: e.y,
  };
  // 用距離函式判斷滑鼠點擊時距離圓球半徑的距離
  let 判斷距離 = 取得距離(滑鼠位置, ball.位置);
  // 如果滑鼠點擊時位置小於圓球半徑，更改拖曳狀態
  if (判斷距離 <= ball.半徑) {
    ball.dragging = true;
  }
});

// !監聽觸控放開事件
canvas.addEventListener("touchend", (e) => {
  ball.dragging = false;
});

// !監聽觸控移動事件
canvas.addEventListener("touchmove", (e) => {
  // 紀錄滑鼠移動後最新的位置
  let 滑鼠最新位置 = {
    x: e.x,
    y: e.y,
  };

  //假如圓球拖曳狀態開啟
  if (ball.dragging === true) {
    // 計算滑鼠位置與滑鼠最新位置的距離
    let 滑鼠距離x = 滑鼠最新位置.x - 滑鼠位置.x;
    let 滑鼠距離y = 滑鼠最新位置.y - 滑鼠位置.y;

    //將滑鼠距離差加到圓球位置上，產生同步偏移
    ball.位置.x += 滑鼠距離x;
    ball.位置.y += 滑鼠距離y;

    // 將圓球的最後加速度等於滑鼠距離的值，產生丟出去的感覺
    ball.速度.x = 滑鼠距離x;
    ball.速度.y = 滑鼠距離y;
  }

  //滑鼠移到圓球內時，鼠標改變
  let 滑鼠距離 = 取得距離(滑鼠最新位置, ball.位置);
  滑鼠距離 <= ball.半徑
    ? (canvas.style.cursor = "move")
    : (canvas.style.cursor = "initial");

  滑鼠位置 = 滑鼠最新位置;
});

// 取得兩點距離
function 取得距離(位置1, 位置2) {
  let x軸距離 = Math.abs(位置1.x - 位置2.x);
  let y軸距離 = Math.abs(位置1.y - 位置2.y);
  let 距離平方 = Math.pow(x軸距離, 2) + Math.pow(y軸距離, 2);
  return Math.sqrt(距離平方);
}
