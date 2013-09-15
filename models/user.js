var mongodb = require('./db');
function User(user){ 
  this.name = user.name; 
  this.password = user.password; 
  this.email = user.email; 
  this.address = user.address; 
  this.company=user.company; 
  this.school=user.school; 
  this.info=user.info; 
  this.imgUrl=user.imgUrl; 
}; 
module.exports = User; 
User.prototype.save=function(callback){ 
 //callback 是执行玩保存后的回调函数
  var user = { 
      name: this.name, 
      password: this.password, 
      //下面内容在注册时不用填，在个人首页可以修改，所以先设置默认值和默认头像
      address:"暂无",
      company:"暂无",
      school:"暂无",
      info:"暂无",
      imgUrl:"./public/images/11.jpg"
  }; 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('user',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
       //插入新的数据
      collection.insert(user,{safe: true},function(err,result){ 
        //不管是否成功都关闭数据库
        mongodb.close(); 
        //如果错误err有错误信息，将err和user返回给回调函数
        callback(err, user);//成功！返回插入的用户信息 
      }); 
    }); 
  }) 
}
//读取用户信息 
User.get = function(name, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 users 集合 
    db.collection('user', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 
      collection.findOne({name: name},function(err, doc){ 
        mongodb.close(); 
        if(doc){ 
          var user = new User(doc); 
          callback(err, user);//成功！返回查询的用户信息 
        } else { 
          callback(err, null);//失败！返回null 
        } 
      }); 
    }); 
  }); 
};

User.ask = function(ask, callback){
  mongodb.open(function(err,db){ 
    if(err){ 
      return callback(err); 
    } 
    var date = new Date(); //获取当前时间，在存入问题时，我们给问题添加一个时间属性
    var time = { 
      date: date, 
      year : date.getFullYear(), 
      month : date.getFullYear() + "-" + (date.getMonth()+1), 
      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(), 
      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() 
    } 
    ask.time=time; 
    ask.hide=true; //这样用于未来后台管理，控制是否显示还是屏蔽问题
  
    db.collection('question',function(err,collection){ //存入question表中
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //下面这段是一个知识点，我们的网站可以显示每个问题，这样就需要一个唯一的id，而mongodb不支持自增益，所以我们需要处理一下，mongodb默认的是自动生成一个id，但是我们暂时不知道规律，所以我们将这个id值设置为自增益。
      collection.find().sort({time:-1}).toArray(function(err,items){//按照添加时间查找，查找最近的一个
        if(items.length==0){ //如果没有，就从0 开始
          ids=0; 
        }else{ 
          ids=items[0]._id;  //如果有，就获取到最近一个的id值，然后+1
          ids++; 
        } 
        ask._id=ids; //这个_id是我们自己定义的
        collection.insert(ask,{safe: true},function(err,result){ 
          mongodb.close(); 
          callback(err, ask);//成功！返回插入的用户信息 
        }); 
      }); 
    }); 
  }) 
}; 

User.getQuestion=function(callback){ 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 question 集合 
    db.collection('question', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 ,并且hide为true
      collection.find({hide:{$ne:false}}).limit(5).sort({time:-1}).toArray(function(err,items){ 
        if(err) throw err; 
        //因为question中没有用户的图片，所以需要二次查询
        var open=0 
        db.collection('user', function(err, collection){ 
          if(items.length!=0){
            for(var i=0,l=items.length;i<l;i++){
              collection.findOne({name: items[i].name},function(err, doc){
                items[open].imgUrl=doc.imgUrl;
                open++;
                if(open==l){
                  mongodb.close();
                  return callback(items);
                }
              });
            }
          }else{//如果数据库没有内容
            mongodb.close();
            return callback(items);
          } 
        }); 
      }); 
    }); 
  }); 
};

User.getQuestionPage=function(page,callback){
  //打开数据库
  var num=page*5;
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('question', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 
      collection.find({hide:{$ne:false}}).skip(num).limit(5).sort({time:-1}).toArray(function(err,items){ 
        if(err) throw err; 
        //二次查询 
        var open=0 
        db.collection('user', function(err, collection){ 
          for(var i=0,l=items.length;i<l;i++){ 
            collection.findOne({name: items[i].name},function(err, doc){ 
              items[open].imgUrl=doc.imgUrl; 
              open++; 
              if(open==l){ 
                mongodb.close(); 
                return callback(items); 
              } 
            }); 
          } 
        }); 
      }); 
    });  
  }); 
};

User.findQuestion=function(id,callback){
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('question', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.find({_id:Number(id)}).toArray(function(err,items){
        if(err) throw err;
        mongodb.close();
        return callback(err,items);
      });
    });
  });
};

User.answer=function(questionId,answer,callback){
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('question', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //这里可以暂停一下进度，阅读下mongodb的一些操作方法，本文的最下面有一个还不错的pdf讲解mongodb的增删改查的
      collection.update({_id:Number(questionId)},{$push:{answer:answer}},function(err,items){
        if(err) throw err;
        mongodb.close();
        return callback(items);
      });
    });
  });
};
User.getQuestionUser=function(user,callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    db.collection('question', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 
      collection.find({name:user}).sort({time:-1}).toArray(function(err,items){ 
        if(err) throw err; 
        mongodb.close(); 
        //遍历数据 
        return callback(items); 
      }); 
    }); 
  }); 
}; 
User.prototype.updataEdit=function(callback){
  var user = {
      name: this.name,
      address:this.address,
      company:this.company,
      school:this.school,
      info:this.info,
      imgUrl:this.imgUrl
  };
  mongodb.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('user',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      var upUser={};
      //下面判断信息是否需要更新
      if(user.address!=""){
        upUser.address=user.address;
      }
      if(user.company!=""){
        upUser.company=user.company;
      }
      if(user.school!=""){
        upUser.school=user.school;
      }
      if(user.info!=""){
        upUser.info=user.info;
      }
      if(!!user.imgUrl){
        upUser.imgUrl=user.imgUrl;
      }
      collection.update({'name':user.name},{$set:upUser},function(err,result){
        mongodb.close();
        callback(err, user);//成功！返回插入的用户信息
      });
    });
  });
};

User.superAdmin=function(name,psd,callback){
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('user', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //判断是否为超级管理员
      if(name=="admin"){
        //查找用户名 name 值为 name文档
        collection.find({ name : 'admin' }).toArray(function(err,items){
          if(err) throw err;
          mongodb.close();
          if(psd==items[0].password){
            return callback({admin:1});
          }else{
            return callback({admin:0});
          }
        });
      }else{
        collection.find({ name : name }).toArray(function(err,items){
          if(err) throw err;
          mongodb.close();
          if(psd==items[0].password){
            if(items.admin&&items.admin==2){
              return callback({admin:2});
            }
          }else{
            return callback({admin:0});
          }
        });
      }
    });
  });
};

User.superAdmin=function(name,psd,callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('user', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //判断是否是超级管理
      if(name=="admin"){
        collection.find({ name : 'admin' }).toArray(function(err,items){
          if(err) throw err;
          mongodb.close();
          if(psd==items[0].password){
            return callback({admin:"1"});
          }else{
            return callback({admin:"3"});
          }
        });
      }else{
        mongodb.close();
        return callback({admin:"3"});
      }
    });
  });
};

User.getQuestionAdmin=function(callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('question', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //这里我们仅仅查找10个出来，作为示范，
      collection.find().limit(10).sort({time:-1}).toArray(function(err,items){
        if(err) throw err;
        mongodb.close();
        return callback(items);
      });
    });
  });
};

User.adminChange=function(change,id,childId,delAndRe,callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('question', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      
      if(delAndRe=="del"){//del表示屏蔽用户
        if(childId==""){//表示这个问题没有被回答
          collection.update({'_id':Number(id)},{$set:{hide:false}},function(err,info){
            //给这个问题加了一个hide字段false表示隐藏，true表示显示
            if(err) throw err;
            mongodb.close();
            callback(info);//成功！返回插入的用户信息
          });
        }else{
        //表示这个问题被回答了，我这里的逻辑其实有的问题，因为在mongodb存储时没有规划好，所以导致的，我这里当我需要屏蔽一个回答时，把整个提问都屏蔽了，这里大家可以在后面改改，这样就只用屏蔽回复，不影响提问
          collection.update({"answer.answer":childId},{$set:{hide:false}},function(err,info){
            if(err) throw err;
            mongodb.close();
            callback(info);//成功！返回插入的用户信息
          });
        }
      }else{
        if(childId==""){
          collection.update({'_id':Number(id)},{$set:{hide:true}},function(err,info){
            if(err) throw err;
            mongodb.close();
            callback(info);//成功！返回插入的用户信息
          });
        }else{
          collection.update({"answer.answer":childId},{$set:{hide:true}},function(err,info){
            if(err) throw err;
            mongodb.close();
            callback(info);//成功！返回插入的用户信息
          });
        }
      } 
    });
  });
}