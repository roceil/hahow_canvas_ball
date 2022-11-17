/** @type {HTMLCanvasElement} */
// !抓取canvas元素
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// !設定canvas的寬高＆顯示（2d）
const vw = (canvas.width = window.innerWidth);
const vh = (canvas.height = window.innerHeight);

// !設定圓球的初始狀態 => 只要呼叫Ball()就會得到預設設定及prototype
let Ball = function () {
  // 設定球的預設中間位置
  (this.position = {
    x: vw / 2,
    y: vh / 2,
  }),
    // 設定球的初始加速度
    (this.addSpeed = {
      x: 1,
      y: 1,
    }),
    // 設定垂直重力
    (this.gravity = {
      x: 0,
      y: 1,
    }),
    // 設定球的半徑
    (this.r = 50);

  // 設定球的初始拖曳狀態
  this.dragging = false;
};

// !設定圓球的draw方法
Ball.prototype.draw = function () {
  // 設定canvas背景色
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, vw, vh);

  // 設定球體顏色
  ctx.beginPath();
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.arc(0, 0, this.r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.restore();
};

// !設定圓球的update方法
Ball.prototype.update = function () {
  if (this.dragging == false) {
    // 設定球的移動位置
    this.position.x += this.addSpeed.x;
    this.position.y += this.addSpeed.y;

    // 設定球的重力
    this.addSpeed.x += this.gravity.x;
    this.addSpeed.y += this.gravity.y;

    // 設定球的摩擦力
    this.addSpeed.x *= 0.99;
    this.addSpeed.y *= 0.99;

    // 檢查球有無碰到邊框
    ball.checkSide();
  }
};

// !設定圓球碰到外框時的反作用力
Ball.prototype.checkSide = function () {
  // 圓心 + 半徑的值，如果大於畫面寬度(碰到畫面右邊)，則給他一個相同的反向速度
  if (this.position.x + this.r > vw) {
    this.addSpeed.x = -Math.abs(this.addSpeed.x);
  }
  // 圓心 - 半徑的值，如果小於畫面寬度(碰到畫面左邊)，則給他一個相同的正向速度
  if (this.position.x - this.r < 0) {
    this.addSpeed.x = Math.abs(this.addSpeed.x);
  }
  // 圓心 + 半徑的值，如果大於畫面高度(碰到畫面下邊)，則給他一個相同的反向速度
  if (this.position.y + this.r > vh) {
    this.addSpeed.y = -Math.abs(this.addSpeed.y);
  }
  // 圓心 - 半徑的值，如果小於畫面高度(碰到畫面上邊)，則給他一個相同的正向速度
  if (this.position.y - this.r < 0) {
    this.addSpeed.y = Math.abs(this.addSpeed.y);
  }
};

// !初始化指定的圓球
let ball;
function ballInit() {
  ball = new Ball();
}
ballInit();

// !初始化滑鼠位置
let mousePos = {
  x: 0,
  y: 0,
};

// !設定更新圓球的速度
function FPSUpdate() {
  ball.update();
}

// !畫出圓球＆背景
function AllDraw() {
  ball.draw();
  requestAnimationFrame(AllDraw);
}

// !監聽滑鼠是否按著
canvas.addEventListener("mousedown", (e) => {
  // 記錄滑鼠點擊時的位置
  let newMousePos = {
    x: e.clientX,
    y: e.clientY,
  };
  // 取得滑鼠點擊時的位置與圓心的距離
  let mouseDist = getDist(newMousePos, ball.position);
  console.log(mouseDist);

  // 如果點擊時的距離小於球的半徑，則判定為點擊到球
  if (mouseDist <= ball.r) {
    console.log("點到球了");
    ball.dragging = true;
  }
});
// !監聽滑鼠是否鬆開
canvas.addEventListener("mouseup", (e) => {
  // 滑鼠鬆開時必定初始化球的拖曳狀態
  ball.dragging = false;
});
// !監聽滑鼠是否拖曳
canvas.addEventListener("mousemove", (e) => {
  // 記錄滑鼠點擊時的位置
  let newMousePos = {
    x: e.clientX,
    y: e.clientY,
  };

  // 記錄新舊滑鼠記錄點的距離
  let mouseDistX = newMousePos.x - mousePos.x;
  let mouseDistY = newMousePos.y - mousePos.y;

  if (ball.dragging === true) {
    // 圓球x軸跟隨滑鼠
    ball.position.x += mouseDistX;
    // 圓球y軸跟隨滑鼠
    ball.position.y += mouseDistY;
    // 圓球x軸的加速度
    ball.addSpeed.x = mouseDistX;
    // 圓球y軸的加速度
    ball.addSpeed.y = mouseDistY;
  }

  mousePos = newMousePos;
});

// !計算距離函示
function getDist(pos1, pos2) {
  // 距離分為 X 軸距離 ＆ Y 軸距離
  let xDist = Math.abs(pos1.x - pos2.x);
  let YDist = Math.abs(pos1.y - pos2.y);
  let countDist = Math.pow(xDist, 2) + Math.pow(YDist, 2);
  let result = Math.sqrt(countDist);
  return result;
}
// !指定函示在時間內要執行幾次
setInterval(FPSUpdate, 1000 / 60);
// !盡可能的去執行指定函示
requestAnimationFrame(AllDraw);
