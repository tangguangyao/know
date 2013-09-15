know
====

nodejs
开篇：
关于作者：本人是属于比较纯的前端，做的js开发比较多，对于后端语言了解很少（了解一些php的开发，在实践中做过简单的php网页），这个实战系列属于从零开始自己琢磨，顺带着学习了很多后端知识。如果你和我一样属于前端开发，对js比较熟悉，对后端比较生疏，个人觉得这个系列很适合你，因为我会把我在从零开始遇到的各种问题都展示出来。
另外，这个实例我分别在mac和window下开发，两个系统的差别我也会详解出来。

感谢：
这个实战我完全是在网上找各种资料学习，总结的
最直接的帮助 http://cnodejs.org/topic/519e01c563e9f8a542fa68f9 
我是完整的学习了一边这个教程，才开始我自己的这个实战练习的。
http://www.nodebeginner.org/index-zh-cn.html
这篇文章我看了好几遍，推荐


我用到的框架，数据库和插件：
数据库存储用的mongodb
框架express
前端框架：jquery和bootstrap，以及underscore
摸版ejs
功能：异步ajax-不跨越，然后扩展跨域的方法；
socket 结合html5实时通信；
图片上传，以及扩展gm对图片进行处理
nodejs对mongodb的增删改查，以及2两表联查

系列目录：
<p><a href="http://hi.baidu.com/tang_guangyao/item/a3c4cdd1b41c776edcf9be18" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（1）——前言">nodejs实战案例（Express框架+mongoDB）——（1）——前言</a></p>
<p><span style=""><a href="http://hi.baidu.com/tang_guangyao/item/2faed3fa16ae2a0c753c4cef" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（2）——安装框架，数据库，插件以及数据库连接">nodejs实战案例（Express框架+mongoDB）——（2）——安装框架，数据库，插件以及数据库连接</a></span></p>
<p><a href="http://hi.baidu.com/tang_guangyao/item/1e7818293132461295f62b35" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（3）——路由，摸版引擎基础知识">nodejs实战案例（Express框架+mongoDB）——（3）——路由，摸版引擎基础知识</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/3294b70057df5ab1a2df4325" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（4）——路由配置,ejs引擎">nodejs实战案例（Express框架+mongoDB）——（4）——路由配置,ejs引擎</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/47f1ba54600a44eed2e10c40" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（5）——用户注册，登陆">nodejs实战案例（Express框架+mongoDB）——（5）——用户注册，登陆</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/f16a2d1972fab5dc746a84e7" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（6）——ajax实现提交问题功能">nodejs实战案例（Express框架+mongoDB）——（6）——ajax实现提交问题功能</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/80876b7c810a2231d1dcb3ec" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（7）——内容展示页面">nodejs实战案例（Express框架+mongoDB）——（7）——内容展示页面</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/12864e89d51798ffd1f8cd89" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（8）——异步查询数据库">nodejs实战案例（Express框架+mongoDB）——（8）——异步查询数据库</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/5eecffb35c83d9632aebe38a" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（9）——webapp+nodejs">nodejs实战案例（Express框架+mongoDB）——（9）——webapp+nodejs</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/44426e1773e01f636826bb4c" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（10）——提问页面，回答问题">nodejs实战案例（Express框架+mongoDB）——（10）——提问页面，回答问题</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/c017634560415f2fc016134d" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（11）——用户中心页面">nodejs实战案例（Express框架+mongoDB）——（11）——用户中心页面</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/a4c8cfe7c53788e2baf37d7b" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（12）——修改个人信息，上传图片">nodejs实战案例（Express框架+mongoDB）——（12）——修改个人信息，上传图片</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/0dd0a80141d5a7e22f4c6bc8" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（13）——处理上传图片">nodejs实战案例（Express框架+mongoDB）——（13）——处理上传图片</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/506a9233d597ec9f124b14e1" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（14）——socket通信，聊天功能">nodejs实战案例（Express框架+mongoDB）——（14）——socket通信，聊天功能</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/c872e724810d88e3ef10f1fe" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（15）——爬虫功能">nodejs实战案例（Express框架+mongoDB）——（15）——爬虫功能</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/6ca7d227cd1406d851fd8762" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（16）——管理后台">nodejs实战案例（Express框架+mongoDB）——（16）——管理后台</a></p><p><a href="http://hi.baidu.com/tang_guangyao/item/050a74c00154031c45941624" target="_blank" title="nodejs实战案例（Express框架+mongoDB）——（17）——404页面">nodejs实战案例（Express框架+mongoDB）——（17）——404页面</a></p>
