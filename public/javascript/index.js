(function ($) {
    function WaterFull() {
        return new WaterFull.prototype.init();
    }

    WaterFull.prototype = {
        init: function () {
            this.flag = true;
            this.initDom();
            this.box = $('.box');
            this.firstAjax('getInfo', 1);
            this.initEvent();
        },
        initEvent: function () {
            let self = this, page = 2;
            $(window).on('scroll', async function () {
                // 最短的li出现，加载数据
                let minBoxHeight = $(self.box[self.findMinBox()]).height();
                let scrollTop = $(window).scrollTop();
                let delta = minBoxHeight - scrollTop;
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (delta < clientHeight) {
                    if (self.flag) { //防止一直滚动，发出请求
                        self.flag = false; //在请求数据未到达之前不允许滚动发出请求
                        let data = await self.requestAjax('getInfo', page++);
                        data && self.render(data);
                    }
                }
            })
        },

        firstAjax: async function (req, page) {
            let dataList = await this.requestAjax(req, page);
            dataList && this.render(dataList);
        },

        render: function (dataList) {
            if (dataList.length > 0) {
                for (let data of dataList) {
                    let oItem = $('<div class="item"></div>'), oImg = new Image(), oP = $('<p></p>');
                    oImg.src = data.preview;
                    oImg.height = 200 * data.height / data.width;
                    oImg.onerror = function () { //设置图片加载异常时的图片的长宽，将图片坐上移1px，图片宽度和高度分别增大2px
                        $(this).css({
                            margin: -1,
                            width: 202,
                            height: 200 * data.height / data.width + 2
                        })
                    };
                    //tempDiv 是为了隐藏图片没加载出来时的边框（样式设置超出部分隐藏）
                    let tempDiv = $('<div class="cont"></div>');
                    tempDiv.css({
                        height: 200 * data.height / data.width
                    });
                    tempDiv.append(oImg);
                    oP.text(data.title);
                    let minBox = $(this.box[this.findMinBox()]);
                    oItem.append(tempDiv).append(oP);
                    minBox.append(oItem);
                }
                this.flag = true; //渲染完毕才能重新发出请求
            }
        },

        initDom: function () {
            let templates = `<li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li>`;
            $('.wrapper ul').append($(templates));
        },

        findMinBox: function () {
            //假设第一列最短，通过冒泡排序，得到最短的那一列的index值
            let minBoxHeight = $(this.box[0]).height(), len = this.box.length, index = 0;
            for (let i = 1; i < len; i++) {
                const tempBoxHeight = $(this.box[i]).height();
                if (tempBoxHeight < minBoxHeight) {
                    minBoxHeight = tempBoxHeight;
                    index = i;
                }
            }
            return index;
        },

        requestAjax: function (url, cpage) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://127.0.0.1:3000/' + url,
                    dataType: 'jsonp',
                    callback: 'cb',
                    data: {
                        cpage,
                        time: +new Date()
                    },
                    success: function (data) {
                        resolve(data)
                    },
                    error: function () {
                        reject();
                    }
                })
            })
        },

    };
    WaterFull.prototype.init.prototype = WaterFull.prototype;
    window.WaterFull = WaterFull;
})($);