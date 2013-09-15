var crypto = require('crypto'), //密码加密模块
    User = require('../models/user.js'); //引入用户登录函数
// 移动文件需要使用fs模块
var fs = require('fs');

//国外插件
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
//引用国内插件
var images = require("node-images");

module.exports = function(app){
  //http://localhost:3000/ 请求地址  
	app.get('/',function(req,res){ 
     //因为登陆成功会将信息记录到session中，所有如果不存在就到登陆注册页面，如果存在就表示用户已经登陆，直接跳转到展示页面
      if(!req.session.user){ 
          res.render('index', {  
              title:"知道", 
              name:"问答平台", 
              user:req.session.user, //这里可以用ejs摸版的locals.user 访问到
              error: req.flash('error').toString(),  //这里可以用ejs摸版的locals.error 访问到
              success: req.flash('success').toString()  //这里可以用ejs摸版的locals.success 访问到
          }); 
      }else{ 
          res.redirect('/show'); 
      } 
  });
  //http://localhost:3000/loginout  登出请求地址
  app.get('/loginout',function(req,res){ 
      req.session.user = null; 
      req.flash('success','登出成功!'); 
      res.redirect('/'); 
  }); 
  //发送登陆信息接受地址http://localhost:3000/login
  app.post('/login',function(req,res){ 
     //post过来的密码加密
      var md5 = crypto.createHash('md5'), 
        password = md5.update(req.body.password).digest('hex'); 
      var newUser = new User({ 
        name: req.body.name, 
        password: password 
      }); 
      //查找用户
      User.get(newUser.name, function(err, user){ 
          if(user){ 
              //如果存在，就返回用户的所有信息，取出password来和post过来的password比较
              if(user.password != password){ 
                  req.flash('error','密码不正确'); 
                  res.redirect('/'); 
              }else{ 
                  req.session.user = user; 
                  res.redirect('/show'); 
              } 
          }else{ 
              req.flash('error','用户不存在'); 
              res.redirect('/'); 
          } 
      }); 
  }); 
  //发送注册信息接受地址http://localhost:3000/reg
  app.post('/reg',function(req,res){
   //在post请求后的反应
   //post信息中发送过来的name,password和repassword,用req.body获取
    var name = req.body.name, 
          password = req.body.password, 
          password_re = req.body['repassword']; 
        //后端判断两次注册的密码是否相等
        if(password_re != password){
            //如果密码不相等，将信息记录到页面通知flash,然后跳转到http://localhost:3000/
            req.flash('error','两次输入的密码不一致!');  
            return res.redirect('/'); 
        }
        //对密码进行加密操作 
        var md5 = crypto.createHash('md5'), 
          password = md5.update(req.body.password).digest('hex'); 
        var newUser = new User({ 
          name: req.body.name, 
          password: password 
        }); 
       //使用user.js中的user.get() 函数来读取用户信息
        User.get(newUser.name, function(err, user){ 
            //如果有返回值，表示存在用户
            if(user){ 
              err = '用户已存在!'; 
            } 
            if(err){
              //如果报错，记录错误信息和页面跳转
              req.flash('error', err); 
              return res.redirect('/'); 
            } 
            //使用user.js的user.save() 保存信息函数
            newUser.save(function(err,user){ 
              if(err){ 
                req.flash('error',err); 
                return res.redirect('/'); 
              } 
              //成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
              req.session.user = user; 
              req.flash('success','注册成功!'); 
              res.redirect('/show'); 
            }); 
        });  
  });
  //http://localhost:3000/show  网站登陆后内容展示页
  app.get('/show',function(req,res){ 
      User.getQuestion(function(data){  //使用User.getQuestion()获取问题
        if(data.length==0){//数据库没有内容
          res.render('show',{
            lists:data,
            user:req.session.user
          });
          return;
        }
        for(var i=0,l=data.length;i<l;i++){ 
            data[i].url="/people/"+data[i].name; 
            data[i].imgUrl=data[i].imgUrl.replace("./public/",""); 
        }    
        res.render('show',{ 
            lists:data, 
            user:req.session.user 
        }); 
      });  
  });
  //ajax异步的get请求获取地址http://localhost:3000/getQuestion
  app.get('/getQuestion',function(req,res){ 
      User.getQuestionPage(req.query.page,function(data){ 
         //对返回的数据做些处理
          for(var i=0,l=data.length;i<l;i++){
              data[i].imgUrl=data[i].imgUrl.replace("./public/","");
          }
          res.send(data) 
      });  
  });
  //http://localhost:3000/people/tang  tang这个用户的展示页面
  app.get('/people/:user',function(req,res){ 
      User.get(req.params.user, function(err, user){
        user.imgUrl=user.imgUrl.replace("./public/","");
         //先查询到用户信息，然后查询用户的提问
          User.getQuestionUser(user.name,function(question){ 
              res.render('people',{ 
                address: user.address, 
                company: user.company, 
                school : user.school, 
                info : user.info, 
                name:req.params.user, 
                user:req.session.user, 
                question:question, 
                imgUrl:user.imgUrl 
              }); 
          });         
      }); 
  }); 
  //发生编辑和修改个人信息的请求地址http://localhost:3000/people
  app.post('/people',function(req,res){
      //头像地址
      var tmp_path,target_path;
      if(req.files.thumbnail.size>0){ //表示有图片文件上传
          tmp_path = req.files.thumbnail.path;
          // 指定文件上传后的目录 - 示例为"images"目录。
          // 重命名图片名字
          var picType=req.files.thumbnail.name.split(".");
          picType=picType[1];
          target_path = './public/images/user/pic_' + req.session.user.name+"."+picType;
          // 移动文件
          fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
           //程序执行到这里，user文件下面就会有一个你上传的图片
            imageMagick(target_path)
            .resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
            .autoOrient()
            .write(target_path, function(err){
              if (err) {
                console.log(err);
              }
            });
          });
      }    
      var newUser = new User({
        name: req.session.user.name,
        address: req.body.address,
        company:req.body.company,
        school:req.body.school,
        info:req.body.info,
        imgUrl:target_path,
      });
      //更新
      newUser.updataEdit(function(err){
          if(err){
              req.flash('error',err);
              return res.redirect('/');
          }
          req.session.user = newUser;//用户信息存入session
          //req.flash('success','注册成功!');
          res.redirect('/people/'+newUser.name);
      });
  }); 
  //http://localhost:3000/question/1 具体问题展示页
  app.get('/question/:id',function(req,res){
	    User.findQuestion(req.params.id, function(err, items){
	         res.render('question',{
	             items:items[0],
	             user:req.session.user,
	             id:req.params.id,
	        });
	    });
	});
  //ajax异步提问发生问题地址http://localhost:3000/ask
	app.post('/ask',function(req,res){
		var ask={}; 
		ask.title=req.body.title; //post发送的问题标题
		ask.askText=req.body.askText; //post发送的问题内容
		ask.answer=[]; //先设置一个空数组，这个数组以后push问题的回答
		ask.name=req.session.user.name; //提问者的名字
		//调用ask函数，存入用户提问
		User.ask(ask,function(err, doc){
		     if(err){
		          req.flash('error',err);
		         return res.redirect('/');
		     }
		     //如果成功存入，返回{"status": 1}给客户端
		     res.send({"status": 1});
		})
	 }); 
  //ajax异步回答问题地址http://localhost:3000/answer
  app.post('/answer',function(req,res){
	    var answer={};
	    answer.answer=req.body.answer;
	    answer.user=req.session.user;
	    questionId=req.body.questionId;
	    User.answer(questionId,answer,function(info){
	         res.redirect('/question/'+questionId);
	    })
	});
  //百度百科爬虫获取地址
  app.get('/baike',function(req,res){
    var request = require('request'),
        cheerio = require('cheerio'),
        http = require('http'),
        url = require('url');
    var host = 'http://baike.baidu.com/view/39744.htm';//可修改为其他的百科地址

    var html = [];
      request(host, function (error, response, data) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(data);
          var title = $('.title').first().text(),
              header = [],
              nav = [],
              body = [];
          //删除无用数据
          $('.title').remove();
          $('.pic-info').remove();
          $('.count').remove();
          $('sup').remove();
          //筛选有用数据
          $('#lemmaContent-0 .headline-1').each(function (i) {
            var str = '',
                $next = $(this).next();
            while (!$next.hasClass('headline-1')&&(!$next.next().hasClass('clear'))) {
              if ($next.hasClass('headline-2')) {
                str += "<p><strong>" + $next.text() + "</strong></p>";
              } else {
                str += "<p>" + $next.text() + "</p>";
              }
              $next = $next.next();
            }
            header.push($(this).find('.headline-content').text());
            nav.push("<span><a href='/" + i + "'>" + header[i] + "</a></span>");
            body.push(str);
          });

          var len = $('#catalog-holder-0 .catalog-item').length;//获取 “目录” 条文数
          for (var i = 0; i < len;  i++) {
            html[i] = "" +
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset='UTF-8' />" +
            "<title>" + title + "</title>" +
            "<style type='text/css'>" +
            "body{width:600px;margin:2em auto;font-family:'Microsoft YaHei';}" +
            "p{line-height:24px;margin:1em 0;}" +
            "header{border-bottom:1px solid #cccccc;font-size:2em;font-weight:bold;padding-bottom:.2em;}" +
            "nav{float:left;font-family:'Microsoft YaHei';margin-left:-12em;width:9em;text-align:right;}" +
            "nav a{display:block;text-decoration:none;padding:.7em 1em;color:#000000;}" +
            "nav a:hover{background-color:#003f00;color:#f9f9f9;-webkit-transition:color .2s linear;}" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<header>" + header[i] + "</header>" +
            "<nav>" + nav.join('') + "</nav>" +
            "<article>" + body[i] + "</article>" +
            "</body>" +
            "</html>";
          }
          // res.writeHead(200, {"Content-Type":"text/html"});
        // res.write(html[0]);
        // res.end();
        res.send(html[1]);

        }
      });
  });
    
  //后台管理
  app.get('/admin',function(req,res){
    res.render('adminlogin', { 
     user:req.session.user,
     error: req.flash('error').toString()
     });
  });
  //管理员登陆发送信息地址
  app.post('/adminLogin',function(req,res){
    var adminName=req.body.name;
    var md5 = crypto.createHash('md5'),
        adminPwd = md5.update(req.body.password).digest('hex');
    User.superAdmin(adminName,adminPwd,function(info){
      if(info.admin=="1"){//超级管理员
        //获取管理内容
        User.getQuestionAdmin(function(data){
          res.render('admincon',{
            lists:data,
            user:req.session.user,
          });
        });
      }else if(info.admin=="2"){//普通管理员
        User.getQuestionAdmin(function(data){
          res.render('admincon',{
            lists:data,
            user:req.session.user,
          });
        });
      }else{
        res.redirect('/show');
      }
    });   
  });
  //信息管理页面地址
  app.get('/admincon',function(req,res){
    res.redirect('/admin'); 
  });
  //发生修改信息地址
  app.post('/adminchange',function(req,res){
    //获取表单提交的信息
    var change=req.body.change,
      id=req.body.id,
      childId=req.body.childId,
      delAndRe=req.body.delAndRe
    //在数据库中处理
    User.adminChange(change,id,childId,delAndRe,function(data){
      if(data==1){
        User.getQuestionAdmin(function(data){
          res.render('admincon',{
            lists:data,
            user:req.session.user,
          });
        });
      }
    });
  });
  //http://localhost:3000/error 404和错误页面展示地址
  app.get('*',function(req,res){
    res.render('404', { 
      title:"知道",
      name:"问答平台",
      user:req.session.user,
      error: req.flash('error').toString()
    });
  });
};