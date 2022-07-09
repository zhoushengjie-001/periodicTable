let oUl = document.getElementById("list");
let oStyle = document.getElementById("style");
let aLi = oUl.children;

//生产125个li
(function(){
    let f = document.createDocumentFragment();
    let styleText = "";
    for (let i=0;i<125;i++){
        let oLi = document.createElement("li");
        let thisData = data[i] || {order: "118",name: "Uno",mass:""};
        oLi.innerHTML = `
            <p>${thisData.name}</p>
            <p>${thisData.order}</p>
            <p>${thisData.mass}</p>
        `;
        f.appendChild(oLi);

        //计算四种变化所需要的的样式
        styleText += `
            #wrap ul#list.Init li:nth-child(${i+1}){transform:${Init(i)}}
            #wrap ul#list.Grid li:nth-child(${i+1}){transform:${Grid(i)}}
            #wrap ul#list.Table li:nth-child(${i+1}){transform:${Table(i)}}
            #wrap ul#list.Sphere li:nth-child(${i+1}){transform:${Sphere(i)}}
            #wrap ul#list.Helix li:nth-child(${i+1}){transform:${Helix(i)}}
        `;

    }
    oStyle.innerHTML = styleText;
    oUl.appendChild(f);

    //强制渲染一次
    oUl.offsetLeft;
    //初始布局
    oUl.className = "Grid";
})();

//拖拽 滚动
(function(){
    /*
    * 鼠标水平方向的拖拽，改变ul的 rotateY
    * ....垂直................ rotateX
    * */

    //提前定义出ul的变换初始值
    let tZ = -3000,
        rX = 0,
        rY = 0;

    let ifDown = false;
    let dX,dY,mX,mY,x_,y_;

    //拖拽事件
    document.addEventListener("mousedown",downFn);
    document.addEventListener("mousemove",moveFn);
    document.addEventListener("mouseup",upFn);
    function downFn(e){
        ifDown = true;
        dX = mX = e.pageX;
        dY = mY = e.pageY;
    }
    function moveFn(e){
        if(!ifDown)return;
        x_ = e.pageX - mX;
        y_ = e.pageY - mY;

        //存储当前坐标，用于下一次的计算
        mX = e.pageX;
        mY = e.pageY;

        //x的变化量等于 rY 的变化量
        //y的变化量等于 rX 的变化量
        rX -= y_*0.1;
        rY += x_*0.1;

        //改变样式
        oUl.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    }
    function upFn(e){
        ifDown = false;
    }

    //滚动事件
    mousewheel(document,function(e,d){
        // d为1，说明 向上推滚轮。d为-1，说明向下拉滚轮
        tZ += d*200;

        //限制一下tZ的范围
        tZ = Math.min(tZ,600);
        tZ = Math.max(tZ,-9000);

        //改变样式
        oUl.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    });
    function mousewheel(DOM,FN){
        //兼容非FireFo
        DOM.addEventListener("mousewheel",function(e){
            let d = e.wheelDelta;
            FN(e,d/Math.abs(d));
        });
        //兼容FireFox
        DOM.addEventListener("DOMMouseScroll",function(e){
            let d = e.detail;
            FN(e,-d/Math.abs(d));
        });
    }
})();

//tab的点击
(function () {
    let aTabLi = document.querySelectorAll("#wrap ul#tab li");
    // let classList = ["Table","Sphere","Helix","Grid"];
    aTabLi.forEach((node,index)=>{
        node.addEventListener("click",function () {
            oUl.className = this.innerHTML;
        });
    });
})();

//Init初始布局函数
function Init(){
    //初始li随机位置
    let tX = (Math.random()*10000-5000) | 0,
        tY = (Math.random()*10000-5000) | 0,
        tZ = (Math.random()*10000-5000) | 0;
   return `translate3D(${tX}px,${tY}px,${tZ}px)`;
}

//Grid布局函数
function Grid(index){
    //根据序号index求坐标
    let x = index%5,
        y = (index/5 |0)%5,// |0 在这里是取整的意思
        z = index/25 |0
    ;
    // node.innerHTML = `${x},${y},${z}`; //测试

    //中心点是 2,2,2，也就是说不需要移动的那个li的坐标是2,2
    let tX = (x - 2)*300,
        tY = (y - 2)*300,
        tZ = (2 - z)*1000
    ;

    //设置样式
    return `translate3D(${tX}px,${tY}px,${tZ}px)`;
}

//Helix布局函数
function Helix(index){
    let rY = 360/(125/ 3.8 ); //3.8为你想要摆成几个环
    let tY = (index-125/2)* 10 ; //10为两个li之间的高低差
    return `rotateY(${index*rY}deg) translateZ(800px) translateY(${tY}px)`;
}

//Table布局函数
function Table(index) {
    //中心坐标（8.5 ， 4）

    //前18个没有按照规律排布的坐标手动整理出来
    let coor = [
        {x:0,y:0},
        {x:17,y:0},
        {x:0,y:1},
        {x:1,y:1},
        {x:12,y:1},
        {x:13,y:1},
        {x:14,y:1},
        {x:15,y:1},
        {x:16,y:1},
        {x:17,y:1},
        {x:0,y:2},
        {x:1,y:2},
        {x:12,y:2},
        {x:13,y:2},
        {x:14,y:2},
        {x:15,y:2},
        {x:16,y:2},
        {x:17,y:2}
    ];

    //根据元素周期表的特性，来得到第index个元素的坐标
    let x,y;
    if (index<18){
        x = coor[index].x;
        y = coor[index].y;
    }else if (index<90){
        x = index%18;
        y = (index/18|0) + 2;
    }else if (index<120){
        x = (index-90)%15 + 1.5;
        y = ((index-90)/15|0) + 7;
    }else{
        x = 17;
        y = 6;
    }
    let tX = (x-8.5)*160,
        tY = (y-4)*200;
    return `translate(${tX}px,${tY}px)`;
}

//Sphere布局函数
function Sphere(index) {
    //手动制定出一个排列方案（也可以通过计算来进行制定，但是特别有规律的排列会导致视觉效果不美观，所以我们手动制定出没有规律的排布）
    let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];
    

    //根据index，得到当前的li处于哪一圈
    index = 124-index;
    let sum = 0;
    let quan,ge;
    for(let i=0;i<arr.length;i++){
        sum += arr[i];
        if (sum>=(index+1)){
            //说明，当前的node处在第 i 圈
            quan = i;
            ge = sum - index;
            break; //第一次大于的时候，就是node所处的圈，所以不需要往后继续计算了
        }
    }

    //y的中心为 arr.length/2
    // let tY = 200*(quan-arr.length/2);

    //rotateX的变化范围 90 ~ -90
    let rX = 90 - 180*(quan/(arr.length-1));
    //rotateY的变化，由第几圈第几个来决定
    let rY = 360/arr[quan] * ge + arr[quan]*100;

   return ` rotateY(${rY}deg) rotateX(${rX}deg) translateZ(800px)`;
}





