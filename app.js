 // node遵循commendJS规范，如果要用import则要引入babel插件
const express = require('express');
const mysql = require('mysql');
const constant = require('./const');
const cors = require('cors');

const app = express();
app.use(cors());

 // app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的get方法，为我们的`/`路径指定一个回调函数。
 // 这个handler函数会接收req和res两个对象，他们分别是请求的 request 和 response。
 // request中包含了浏览器传来的各种信息，比如 query，body，headers之类的，都可以通过req对象访问到。
 // res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息
 
  // 连接数据库方法
 function connect () {
     return mysql.createConnection({
         host: `${constant.dbHost}`,
         user: `${constant.dbUser}`,
         password: `${constant.dbPwd}`,
         database: 'book'
     })
 }

 // 生成一定数量的随机数,第一个参数为想要挑选出的数量，第二个参数为数据库中的数量
 function randomBook (n, l) {
    let rnd = [];
    for (let i = 0; i < n; i++) {
        rnd.push(Math.floor(Math.random() * l))
    }
    return rnd
 }
 // 生成图书数据.第一个参数为一个对象数组，第二个参数为选中的id.返回的data还是一个对象
 function createData (result, key) {
    return handleData(result[key])
 }
 // 对有封面连接的数据做处理,传入的参数为对象
 function handleData (data) {
    if (!data.cover.startsWith('http://')) { // 数据库中封面项的路径是一个相对路径，前端接收后找不到
        data['cover'] = `${constant.resUrl}/img${data.cover}`
    }
    return data
 }
  // 获取图片链接地址数组
  function getImage () {
      return [`${constant.resUrl}/home_banner.jpg`, `${constant.resUrl}/home_banner2.jpg`]
  }
 // 生成猜你喜欢图书数据,里面增添一些新的自定义属性
 function createGuessYouLike (data) {
    const n = parseInt(randomBook(1, 3)) + 1;
    data['type'] = n;
    switch (n) {
        case 1:
          data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements of Robotics》';
        break;
        case 2:
          data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》';
        break;
        case 3:
          data['result'] = '《Living with Disfigurement》';
          data['percentage'] = data.id % 2 === 0 ? '92%' : '97%';
        break;
    }
    return data
 }
 // 生成随机推荐图书数据
 function createRecommendData (data) {
    data['readers'] = Math.floor(data.id / 2 * randomBook(1, 100));
    return data
 }
  // 获取随机分类序号,参数为生成的序号个数
 function createCategoryIds (n) {
     let arr = [];
     constant.category.forEach((item, index) => {
         arr.push(index + 1)
     });
     const result = [];
     for (let i = 0; i < n; i++) {
         // 获取的序号不能重复,arr实际上就是一个1~22的数组,长度也为22
         const ran = Math.floor(Math.random() * (arr.length - i));
         result.push(arr[ran]);
         // 将已经获得的随机数用数组中最后一个数取代
         arr[ran] = arr[arr.length - i - 1]
     }
     return result
 }
 // 生成随机分类数据
 function createCategoryList (data) {
    const categoryId = createCategoryIds(6);
    const result = [];
    categoryId.forEach(categoryId => {
      // 在全部的图书数据中查找分类序列与随机生成的id相同的图书,取前面四本书生成一个新的数组
      const subList = data.filter(item => item.category === categoryId).slice(0, 4);
      subList.map(item => {
        return handleData(item) // 对封面处理
      });
      result.push({
        category: categoryId,
        list: subList
      })
    });
    return result.filter(item => item.list.length === 4) // 过滤掉数目不足4的分类
 }
  // 匹配首页路由
 app.get('/book/home', function (req, res) {
    const conn = connect();
    conn.query('select * from book where cover != \"/"',
        function (err, result) {
            const length = result.length;
            const guessYouLike = [];
            // const banner = `${constant.resUrl}/home_banner2.jpg`;
            const  banner = getImage();
            const recommend = [];
            const featured = [];
            const random = [];
            const categoryList = createCategoryList(result);
            const categories = [
                {
                    category: 1,
                    num: 56,
                    img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
                },
                {
                    category: 2,
                    num: 51,
                    img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
                },
                {
                    category: 3,
                    num: 32,
                    img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
                },
                {
                    category: 4,
                    num: 60,
                    img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
                },
                {
                    category: 5,
                    num: 23,
                    img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
                },
                {
                    category: 6,
                    num: 42,
                    img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
                },
                {
                    category: 7,
                    num: 7,
                    img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
                },
                {
                    category: 8,
                    num: 18,
                    img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
                },
                {
                    category: 9,
                    num: 13,
                    img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
                    img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
                },
                {
                    category: 10,
                    num: 24,
                    img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
                    img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
                },
                {
                    category: 11,
                    num: 6,
                    img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
                    img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
                },
                {
                    category: 12,
                    num: 14,
                    img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
                    img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
                },
                {
                    category: 13,
                    num: 16,
                    img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
                    img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
                },
                {
                    category: 14,
                    num: 16,
                    img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
                    img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
                },
                {
                    category: 15,
                    num: 2,
                    img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
                    img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
                },
                {
                    category: 16,
                    num: 9,
                    img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
                    img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
                },
                {
                    category: 17,
                    num: 20,
                    img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
                    img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
                },
                {
                    category: 18,
                    num: 16,
                    img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
                    img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
                },
                {
                    category: 19,
                    num: 10,
                    img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
                    img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
                },
                {
                    category: 20,
                    num: 26,
                    img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
                    img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
                },
                {
                    category: 21,
                    num: 3,
                    img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
                    img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
                },
                {
                    category: 22,
                    num: 1,
                    img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
                    img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
                }
            ];
            randomBook(9, length).forEach(key => {
               guessYouLike.push(createGuessYouLike(createData(result, key)))
            });
            randomBook(3, length).forEach(key => {
               recommend.push(createRecommendData(createData(result, key)))
            });
            randomBook(6, length).forEach(key => {
               featured.push(createData(result, key))
            });
            randomBook(1, length).forEach(key => {
               random.push(createData(result, key))
            });
            res.json({
               guessYouLike,
               banner,
               recommend,
               featured,
               random,
               categoryList,
               categories,
            });
            conn.end()
        })
 });
 // 匹配详情页路由
 app.get('/book/detail', (req, res) => {
     const conn = connect();
     const fileName = req.query.fileName; // 接收前端路由传过来的参数
     const sql = `select * from book where fileName = '${fileName}'`; // 这里fileName必须要加引号
     conn.query(sql, (err, result) => {
        if (err || (result && result.length === 0)) {
            res.json({
                error_code: 1,
                msg: '详情页面获取失败'
            })
        } else {
            res.json({
                error_code: 0,
                msg: '详情页面获取成功',
                data: handleData(result[0])
            })
        }
        conn.end()
     })
 });
 // 匹配列表页面路由,这里获取到的是所有图书数据，是一个树状结构，前端进行二次处理
 app.get('/book/list', (req, res) => {
    const coon =connect();
    coon.query(`select * from book where cover != \'/'`, (err, result) => {
        if (err) {
            res.json({
                error_code: 1,
                msg: '列表获取失败'
            })
        } else {
            // 注意map 与foreach的区别
            result.map(item => handleData(item));
            const data = {};
            constant.category.forEach(categoryText => {
                data[categoryText] = result.filter(item => item.categoryText === categoryText)
            });
            res.json({
                error_code: 0,
                msg: '列表页面获取成功',
                data: data,
                total: result.length
            })
        }
        coon.end()
    })
 });
 // 监听3000端口
 app.listen(3000, function () {
     console.log('listening port 3000!')
 });
