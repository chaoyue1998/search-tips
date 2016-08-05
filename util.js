if (typeof gp123 != 'object') {
  var gp123 = {};
}
gp123.ready = function (cb) {
	  if (!gp123.readyListener) {
	    gp123.readyListener = [];
	  }
	  gp123.readyListener.push(cb);
};
gp123.addClass = function (dom, name) {
  if (gp123.isClass(dom, name)) return;
  if (!!dom.className ) {
      dom.className += ' ' + name;
  } else {
      dom.className = name;
  }
};
gp123.removeClass = function (dom, name) {
  var reg = new RegExp('^' + name + '(\\s|$)|\\s' + name, 'g');
  dom.className = dom.className.replace(reg, '');
};
gp123.isClass = function (dom, name) {
  return (new RegExp('(^' + name + '(\\s|$))|(\\s' + name + '(\\s|$))')).test(dom.className);
};
gp123.addEvent = function(obj,event,func){
  if(obj.addEventListener){
    obj.addEventListener(event, func, false);
  } else {
    obj.attachEvent('on'+event, function(){
      func.apply(obj, arguments);
    });
  }
}

document.body.ontouchstart = function() {};//active伪类hack

/*header expand*/
(function(){
  var navTrigger = document.getElementById('navTrigger'),
  menuTrigger = document.getElementById('menuTrigger'),
  packUp = document.getElementById('packUp'),
  subExpand = document.getElementById('subExpand'),
  clk = function (el, classN){
    if (gp123.isClass(el, classN)) {
      if (el == packUp) {
        gp123.removeClass(subExpand, 'subExpand');
      }
      gp123.removeClass(el, classN);
    } else {
      gp123.addClass(el, classN);
    }
  };
  var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";
  if (isOperaMini) {//如果是operamini，默认展开一级
    gp123.addClass(packUp, 'packUp');
  }
  if (navTrigger) {
    if(window.addEventListener){
      navTrigger.addEventListener("click", function () {
        clk(packUp, 'packUp');
      }, false);
    } else {
      navTrigger.attachEvent("onclick",  function () {
        clk(packUp, 'packUp');
      });
    }
  }
  if (menuTrigger) {
    if(window.addEventListener){
      menuTrigger.addEventListener("click", function () {
        clk(subExpand, 'subExpand');
      }, false);
    } else {
      menuTrigger.attachEvent("onclick",  function () {
        clk(subExpand, 'subExpand');
      });
    }
  }
})();
/**
 * 股票123通用ajax方法，目前支持get和post demo：
 * var opt = {
 *    method:'POST', data:{a:'1'},
 *    url:'/Page_User_News.php?page=1&ajax=true', returnType:'json',
 *    callback:function(resp){ alert(resp); } };
 *
 * @param opt
 */
gp123.ajax = function (opt) {
  var method = opt.method || 'GET',
    url = opt.url,
    data = opt.data,
    xhr = gp123._creatajax(),
    ds = '',
    key;
  method = method.toUpperCase();
  if (typeof opt.callback != 'function') {
    opt.callback = function () {};
  }

  if (typeof data == 'object') {
    for (key in opt.data) {
      ds += key + "=" + encodeURI(opt.data[key]) + "&";
    }
    ds = ds.substr(0, ds.length - 1);
    if (method == 'GET') {
      if (url.indexOf('?') != -1) {
        url += '&' + ds;
      } else {
        url += '?' + ds;
      }
    } else {
      data = ds;
    }
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status != 200) {
        if (opt.onError) {
          opt.onError({
            error: "请求错误",
            status: xhr.status
          });
        }
        return;
      }

      var resp = xhr.responseText, func;
      if (opt.returnType == 'json') {
        if (typeof(JSON) == 'undefined'){  //兼容ie6、7；黑莓8
             resp = eval("("+resp+")");  
        }else{  
             resp = JSON.parse(resp);  
        }  
      }
      opt.callback(resp);
    }
  };

  xhr.open(method, url, true);
  if (opt.method == 'POST') {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.send(data);
  } else {
    xhr.send(null);
  }
};
gp123._creatajax = function () {
    var ajax=null;
    if (window.XMLHttpRequest){
        //对于Mozilla、Netscape、Safari等浏览器，创建XMLHttpRequest对象
        ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject){
        // 对于Internet Explorer浏览器，创建XMLHttpRequest
        try{
            ajax = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e){
            try{
                ajax = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){}
        }
    }
    return ajax;
};
gp123.floating = function (el, scrollTop, className) {//传入el, 滚动长度， 添加类
  var winHeight = window.innerHeight || document.documentElement.clientHeight,
    positionbottom;
  el.offsetHeight > winHeight ? positionbottom = 50 + el.offsetHeight - winHeight : positionbottom = 50;
  if (scrollTop >= positionbottom) {
    gp123.addClass(el, className);
    el.style.marginTop = - positionbottom + 'px';
  } else {
    gp123.removeClass(el, className);
    el.style.marginTop = 0;
  }
};

gp123.SetPopTips = function(text, time){}//顶部弹出下拉框



gp123.SetPopTips.prototype = {
  _creatDiv: function () {//创建窗口
    this.mark = document.createElement('div');
    this.mark.id ='tipsPop';
    this.mark.className = 'tipsPop';
    this.mark.style.top = 0;
    document.body.appendChild(this.mark);
  },
  _close: function (_this) {//关闭
    gp123.removeClass(_this.mark, 'popshow');
  },
  init: function (text, time) {
    var _this = this;
    if (!this.mark) {
      this._creatDiv();
      setTimeout(function () {
        gp123.addClass(_this.mark, 'popshow');
      }, 0);
    } else {
      gp123.addClass(this.mark, 'popshow');
    };
    this.mark.innerHTML = '<div class="nor_text">' + text + '</div>';
    clearTimeout(this.setClose);
    this.setClose = setTimeout(function () {
      _this._close(_this);
    }, time);
  }
};
(function(){
	  var wk = document.getElementById("wklogo"),
	  advert = document.getElementById("advert");
	  if (wk && window.devicePixelRatio >= 2 ) {
		  wk.src = 'http://image.gupiao123.com.cn/images/ipad/logo_new@2.png';
	  }
	  if (advert && window.devicePixelRatio >= 2 ) {
		  advert.src = 'http://image.gupiao123.com.cn/images/temp/ad@2.png';
	  }
})();