// 搭建服务器先
const http=require('http')
const templiate=require('art-template');
const server=http.createServer();
const fs=require('fs')
// 用于解析Url
const url=require('url')
// 绑定串口
server.listen(8888,()=>{
  console.log('服务器已经开启 http://127.0.0.1:8888');
})
server.on('request',(req,res)=>{
  // 收到请求后就开始准备渲染动态页面
  // 当地址栏串口开始的数据有/assets就执行,引入css js img等资源
  if(req.url.startsWith('/assets')){
    // 先处理css的抬头问题
    if(req.url.endsWith('.css')){
      res.setHeader('Content-Type','text/css');
    }
    // 用fs读取模板并返回
    fs.readFile('.'+req.url,(err,data)=>{
      if (err) console.log(err);
      res.end(data);
    })

  }else{
    // 使用url核心api方法把收到的url地址分割
    let gg=url.parse(req.url,true)
    // 要求访问英雄列表页面时
    if(req.url==='/views/index.html'){
      // 读取json数据库
      fs.readFile(__dirname+'/data/heros.json','utf-8',(err,data)=>{
        if (err)console.log(err);
        // 吧数据组转成数组
        let arr=JSON.parse(data);
        // 使用模板代码渲染 
        let html=templiate(__dirname+'/views/index.html',{arr:arr})
        res.end(html);
      })

    }
    // 要求访问添加英雄页面时
    if (req.url==='/views/add.html'){
      fs.readFile('./views/add.html',(err,data)=>{
        if (err)console.log(err);
        res.end(data);
      })
    }
    
    // 当页面发来添加英雄信息的请求时
    // 判断发过来的api是不是get方法和相关的地址
    if(req.method==='GET'&&gg.pathname==='/views/add.html/setuser'){
      // 先分析获取通过get方法发送过来的信息
      // console.log(gg.query);已经是被分割好的一个对象，可以直接插进去
      // 按道理是应该进行数据库的修改的，但是这里用的是json文件充当数据库
      // 所以先获取json文件数据库
      fs.readFile('./data/heros.json',(err,data)=>{
        if(err)console(err);
        let datajson=JSON.parse(data)
        let id=0;
        // 获取的数组里缺少id，就要遍历原有数据库，
        datajson.forEach(e=>{
         if (e.id>id){
           id=e.id
         } 
        });
        // 然后比最大的id加一
        gg.query.id=id+1;
        datajson.push(gg.query)
        // 然后把数组变回数据库类型的字符串
      let sum=JSON.stringify(datajson)
        // console.log(sum);
        fs.writeFile('./data/heros.json',sum,'utf-8',(err)=>{
          if (err)console.log(err);
          res.end({code:200,msg:'添加成功'})
        })

      })
    }




  }

})