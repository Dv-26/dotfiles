(function (global, factory) {
      // 重写factory方法.让factory有独立的作用域
      var _factory = factory; factory = function(arkWeb, wasmoon) { return function(options) { return _factory(arkWeb, wasmoon)(options); }};
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tencent/ark-web'), require('wasmoon')) :
  typeof define === 'function' && define.amd ? define(['@tencent/ark-web', 'wasmoon'], factory) :
  (global.Ark = factory(global.WebArk, global.wasmoon));
})(this, (function (arkWeb, wasmoon) {
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var arkWeb__namespace = /*#__PURE__*/_interopNamespace(arkWeb);

  /**
   * @fileoverview 前置脚本注入
   * @author alawnxu
   * @date 2022-04-09 23:26:29
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   */

  /**
   * 暴露出局部变量.方便后续的模块挂载
   */
  let GlobalAppTemplates = {};
  const ArkGlobalContext = {
    /**
     * @private
     * @param {string} id 视图ID
     * @param {string} template 视图模板
     */
    _setViewTemplate(id, template) {
      GlobalAppTemplates[id] = template;
    },
    /**
     * 获取所有的模板
     * @public
     * @returns
     */
    getViewTemplates() {
      return GlobalAppTemplates;
    },
    /**
     * 释放所有模板
     * @date 2022-08-08 11:14:36
     */
    clearTemplates() {
      GlobalAppTemplates = {};
    }
  };

  const ArkWindow = Object.create({});
      const apis = [];
      apis.forEach(api => {
        let val;
        Object.defineProperty(ArkWindow, api, {
          get() {
            return val;
          },
          set(value) {
            val = value;
          }
        });
      });

  /**
   * @fileoverview 前置脚本注入(UI模块)
   * @author alawnxu
   * @date 2022-04-09 23:26:29
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   */

  const UI = new Proxy(arkWeb.UI, {
    get(target, propKey) {
      const func = target[propKey];
      if (typeof func === 'function') {

        /**
         * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
         * @update 2022年07月30日22:48:18
         * @author alawnxu
         */
        return function (...params) {
          return target[propKey](...params, ArkWindow);
        };
      }
      return target[propKey];
    },
  });

  /**
   * @fileoverview 前置脚本注入(Net模块)
   * @author alawnxu
   * @date 2022-04-09 23:26:29
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   */

  const Net = new Proxy(arkWeb.Net, {
    get(target, propKey) {
      const func = target[propKey];
      if (typeof func === 'function') {

        /**
         * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
         * @update 2022年07月30日22:48:18
         * @author alawnxu
         */
        return function (...params) {
          return target[propKey](...params, ArkWindow);
        };
      }
      return target[propKey];
    },
  });

  /**
   * @fileoverview 前置脚本注入(Net模块)
   * @author alawnxu
   * @date 2022-04-09 23:26:29
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   */

  const QQ = new Proxy(arkWeb.QQ, {
    get(target, propKey) {
      const func = target[propKey];
      // 这里只DataRequest需要代理，其它key暂不需要，需要再加入即可
      if (typeof func === 'function' && propKey === 'DataRequest') {

        /**
         * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
         * @update 2022年07月30日22:48:18
         * @author alawnxu
         */
        return function (...params) {
          return target[propKey](...params, ArkWindow);
        };
      }
      return target[propKey];
    },
  });

  /**
   * @fileoverview 前置脚本注入
   * @author alawnxu
   * @date 2022-04-09 23:26:29
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   */

  const GlobalApplicationApis = {};
  ["CreateView","CreateRootView","GetRootView","GetTemplate","GetApplicationVersion","GetBizsrc"].forEach((method) => {
    GlobalApplicationApis[method] = function (...params) {
      const templates = ArkGlobalContext.getViewTemplates();

      /**
       * @description 这里之前传入global.app, 后面发现不太可行, 因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
       * @update 2022年07月30日22:48:18
       * @author alawnxu
       */
      const application = new arkWeb.Application(ArkWindow, templates);
      if (typeof application[method] === 'function') {
        return application[method](...params);
      }

      console.warn('Application not implement method:', method);
    };
  });

  const { CreateView,CreateRootView,GetRootView,GetTemplate,GetApplicationVersion,GetBizsrc } = GlobalApplicationApis;

  /**
   * @fileoverview 前置脚本注入(polyfill)
   * @author alawnxu
   * @date 2022-07-30 22:20:00
   * @version 1.0.0
   * @description 这个是一个模块文件. 变量请采用: __VAR__ 方式命名
   * 
   * 在Ark引擎中默认支持了 JSON.Stringify 和 JSON.Parse @see {@link /Users/alawnxu/workspace/qq/Ark/src/libs/net/httpwrapper.cpp}
   * 其实同 Net.JSONToTable 和 Net.TableToJSON
   * 
   * 在这里就通过注入的方式注册进去吧
   * 
   * 涉及到这个Api的Ark. 游戏中心所有的Ark因为走了单独的构建,所以都会使用到这个Api
   * @see {@link https://git.woa.com/sq-gamecenter-frontend-team/gc-ark-hub/tree/master/com_tencent_gamecenter_game_download}
   * @see {@link https://git.woa.com/group-pro/bot-frontend/bot-ark/tree/master/com_tencent_bot_groupbot}
   */
  (function() {
      JSON.Stringify = JSON.Stringify || JSON.stringify;
      JSON.Parse = JSON.Parse || JSON.parse;
  })();

  ArkGlobalContext._setViewTemplate('operationItem', `<View id="operationItem" metadatatype="operationItem" style="operation-item">
	<Event>
		<OnResize value="app.OnResize" name="OnResize"></OnResize>
		<OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
	</Event>
  <View id="seperator" style="seperator-operation">
      <Texture id="seperatorColor" color="0x7FE6E6E6"></Texture>
  </View>
  <View style="operation-item-value">
      <Text id="labelText" textcolor="0xFF000000" style="label-text" value="&#x67E5;&#x770B;&#x8BE6;&#x60C5;" font="app.14.weight.400" lineheight="20"></Text>
      <Image style="arrow-icon" value="res/image/arrow-right.png"></Image>
  </View>
</View>
`);

  ArkGlobalContext._setViewTemplate('detailItem', `<View style="detail-item" metadatatype="detailItem">
	<Event>
        <OnResize value="app.OnResize" name="OnResize"></OnResize>
        <OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
	</Event>
    <Text id="labelText" textcolor="0xFF8C8C8C" style="detail-item-label-text" font="app.16.weight.400" multiline="false" autosize="true"></Text>
    <View id="valueText" style="detail-item-value-text">
    </View>
</View>`);

  ArkGlobalContext._setViewTemplate('singlePicItem', `<View id="singlePicItem" metadatatype="singlePicItem" style="singlepic-item">
	<Event>
		<OnResize value="app.OnResize" name="OnResize"></OnResize>
		<OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
	</Event>
  <View style="single-pic-item-top">
      <Text id="topText" textcolor="0xFF000000" style="top-text" value="&#x67E5;&#x770B;&#x8BE6;&#x60C5;" font="app.17.weight.500" multiline="true" lineheight="24"></Text>
  </View>
  <View style="single-pic-item-bottom">
      <Text id="bottomText" textcolor="0xFF000000" style="bottom-text" value="&#x67E5;&#x770B;&#x8BE6;&#x60C5;" font="app.16.weight.400" multiline="true" lineheight="22"></Text>
  </View>
</View>`);

  ArkGlobalContext._setViewTemplate('multiPicItem', `<View id="multiPicItem" metadatatype="multiPicItem" style="multipic-item">
  <Event>
    <OnResize value="app.OnResize" name="OnResize"></OnResize>
    <OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
  </Event>
  <View style="multi-pic-item">
    <Text id="text" textcolor="0xFF000000" style="text" value="&#x67E5;&#x770B;&#x8BE6;&#x60C5;" font="app.17.weight.500" multiline="true" lineheight="24"></Text>
    <Image id="multiPicImage" style="multi-pic-image" radius="4,4,4,4"></Image>
  </View>
</View>`);

  ArkGlobalContext._setViewTemplate('plainText', `<View id="plainText" metadatatype="plainText" style="plainText">
	<Event>
		<OnResize value="app.OnResize" name="OnResize"></OnResize>
		<OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
	</Event>
  <Texture id="bgColor" color="0xFFFFFFFF"></Texture>
  <View style="wrapper" id="wrapper">
      <View style="header" id="header">
          <Image id="titleIcon" style="title-icon"></Image> 
          <Text id="title" style="title-text" multiline="false" font="app.17.weight.500" ellipsis="true" lineheight="24"></Text>
      </View>
      <View style="content" id="content">
          <Text id="summary" style="summary-text" multiline="true" font="app.16.weight.400" lineheight="22"></Text>
          <View style="details" id="details"></View>
          <View style="append" id="append">
            <Text id="appendText" style="append-text" value="" font="app.16" lineheight="22" multiline="true"></Text>
          </View>
      </View>
      <View style="operations" id="operations"></View>
  </View>
</View>
`);

  ArkGlobalContext._setViewTemplate('singlePic', `<View id="singlePic" metadatatype="singlePic" style="single-pic">
  <Event>
    <OnResize value="app.OnResize" name="OnResize"></OnResize>
    <OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
  </Event>
  <Texture id="bgColor" color="0xFFFFFFFF"></Texture>
  <View id="singlePicBannerWrap" style="single-pic-banner-wrap">
    <Event>
      <OnClick value="app.OnClick" name="OnClick"></OnClick>
    </Event>
    <Image id="singlePicBanner" style="single-pic-banner"></Image>
  </View>
  <View id="singlePicItemWrap" style="single-pic-item-wrap"></View>
</View>`);

  ArkGlobalContext._setViewTemplate('multiPic', `<View id="multiPic" metadatatype="multiPic" style="multi-pic">
  <Event>
    <OnResize value="app.OnResize" name="OnResize"></OnResize>
    <OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
  </Event>
  <Texture id="bgColor" color="0xFFFFFFFF"></Texture>
  <View id="multiPicBannerWrap" style="multi-pic-banner-wrap">
    <Event>
      <OnClick value="app.OnClick" name="OnClick"></OnClick>
    </Event>
    <Image id="multiPicBanner" style="multi-pic-banner"></Image>
    <View style="multi-pic-banner-text-wrap" id="multiText">
      <Text id="bannerText" style="banner-text" value="" font="app.17.weight.500" lineheight="24" multiline="true"></Text>
    </View>
  </View>
  <View id="multiPicItemWrap" style="multi-pic-item-wrap"></View>
</View>`);

  ArkGlobalContext._setViewTemplate('mail', `<View id="mail" metadatatype="mail" style="mail" radius="8,8,8,8">
  <Event>
    <OnResize value="app.OnResize" name="OnResize"></OnResize>
    <OnSetValue value="app.OnSetMetadata" name="OnSetValue"></OnSetValue>
    <OnClick value="app.OnClick" name="OnClick"></OnClick>
  </Event>
  <Texture id="bgColor" color="0xFFFFFFFF"></Texture>
  <Text id="title" style="mail-title" multiline="true" ellipsis="true" font="app.17.weight.500" value="" lineheight="24"></Text>
  <Text id="subtitle" style="mail-subtitle" multiline="false" ellipsis="true" font="app.16.weight.400" lineheight="22"></Text>
  <Text id="content" style="mail-content" multiline="true" ellipsis="true" font="app.16.weight.400" lineheight="22"></Text>
  <View id="seperator" style="seperator">
    <Texture id="seperatorColor" color="0x7FE6E6E6"></Texture>
  </View>
  <View style="bottom" id="bottom">
    <View style="left">
      <Text id="leftText" value="" style="left-text" multiline="false" font="app.14.weight.400" lineheight="20"></Text>
    </View>
    <View style="right">
      <Image style="attach-icon" value="res/image/attach.png" id="attachIcon"></Image>
      <Text id="attachNumber" style="attach-number" multiline="false" font="app.14.weight.400" lineheight="20"></Text>
      <Image style="arrow-icon" value="res/image/arrow-right.png"></Image>
    </View>
  </View>
</View>
`);

  const code$f = `
          TouchState={
}

function TouchState:New(view)
	local obj = {}
    setmetatable(obj, self)
    self.__index = self
    obj:Initialize(view)
	return obj
end

function TouchState:New(view, textureID, oldValue, newValue)
	local obj = {}
    setmetatable(obj, self)
    self.__index = self
    obj:Initialize(view)
    self.oldValue = oldValue;
    self.newValue = newValue;
    self.textureID = textureID;
	return obj
end

function TouchState:Initialize(view)
    self.view = view
    self.touch_icon = self.view:GetUIObject("touch_layer_icon")
    self.touch_layer_container = self.view:GetUIObject("touch_layer_container")
    self.buttonview = view:GetUIObject("button_view")
end

function TouchState:ShowPressState(texture, oldColor, newColor, texture1, oldColor1, newColor1)
    if self.timer~= nil then
        self.timer:Stop()
        self.timer = nil
    end
    
    self.timer = Timer()
    self.timer:SetInterval(300)
    texture:SetValue(newColor)
    texture1:SetValue(newColor1)
    self.timer:AttachEvent("OnTimer", function()
        
        texture:SetValue(oldColor)
        texture1:SetValue(oldColor1)
        self.timer:Stop()
        self.timer = nil
    end)
    self.timer:Start()
end


function OnTouchStart(sender,data)
    local obj = app.GetModel(sender)
    if obj == nil or obj.touch then 
        utils.log("touch.OnTouchStart, obj not found")
        return 
    end
    
    if sender ~= sender:GetRoot() then
        return
    end
    
    if obj.touch.textureID ~= nil then
        obj.touch.texture = obj.touch.view:GetTexture(obj.touch.textureID)
    end

    if obj.touch.texture ~= nil then
        obj.touch.texture:SetValue(obj.touch.newValue)
    end
    if(obj.touch.touch_icon~=nil) then
        obj.touch.touch_icon:SetVisible(true) 
    end  
end



function OnTouchEnd(sender)
    local obj = app.GetModel(sender)
    if obj == nil or obj.touch == nil then 
        utils.log("touch.OnTouchEnd, obj not found")
        return 
    end
    
    if(obj.pressed == true) then return end 
    
    
    if (obj.timer == nil) then
        obj.timer = Timer()
        obj.timer:SetInterval(100)
     end
     obj.timer:AttachEvent("OnTimer", function()
        if obj.touch.texture ~= nil then
            obj.touch.texture:SetValue(obj.touch.oldValue)
        end
        if(obj.touch.touch_icon~=nil) then
           obj.touch.touch_icon:SetVisible(false) 
        end
        obj.timer:Stop()
        obj.timer = nil
     end)
     obj.timer:Start()
end


function OnTouchCancel(sender)
    
    local obj = app.GetModel(sender)
    if obj == nil or obj.touch == nil then 
        utils.log("touch.OnTouchCancel, obj not found")
        return 
    end
    
    if(obj.pressed == true) then return end 
    
    if (obj.timerTouch == nil) then
         obj.timerTouch = Timer()
         obj.timerTouch:SetInterval(100)
    end
    obj.timerTouch:AttachEvent("OnTimer", function()
    

        if obj.touch.texture ~= nil then
            obj.touch.texture:SetValue(obj.touch.oldValue)
        end
            if(obj.touch.touch_icon~=nil) then
            obj.touch.touch_icon:SetVisible(false) 
        end
            obj.timerTouch:Stop()
            obj.timerTouch = nil
    end)
    obj.timerTouch:Start()
end


function setPressed(sender,pressed)
    local obj = app.GetModel(sender)
    if(obj==nil) then return end
    
    if sender ~= sender:GetRoot() then
        return
    end
   
    if obj.touch.textureID ~= nil then
        obj.touch.texture = obj.touch.view:GetTexture(obj.touch.textureID)
    end

    if pressed == true then
        if obj.touch.texture ~= nil then
            obj.touch.texture:SetValue(obj.touch.newValue)
        end
        if(obj.touch.touch_icon~=nil) then
            obj.touch.touch_icon:SetVisible(true) 
        end
    else
        if obj.touch.texture ~= nil then
            obj.touch.texture:SetValue(obj.touch.oldValue)
        end
        if(obj.touch.touch_icon~=nil) then
           obj.touch.touch_icon:SetVisible(false) 
        end
    end
end


function OnViewEvent(sender, eventName, data)
    local obj = app.GetModel(sender)
    utils.log("OnViewEvent : eventName".. tostring(eventName))
    if(obj==nil) then return end
    
    if eventName == "ViewPressed" and data["pressed"] ~= nil then
        if data["pressed"] == true then
            obj.pressed = true
            setPressed(sender, true)
        else
            obj.pressed = false
            setPressed(sender, false)
        end
    end
end
          _G['touch'] = {
            TouchState = TouchState,OnTouchStart = OnTouchStart,OnTouchEnd = OnTouchEnd,OnTouchCancel = OnTouchCancel,setPressed = setPressed,OnViewEvent = OnViewEvent
          }
        `;

  const code$e = `
          local urlchecklist= {}

function fixurl(url, oldValue, isHttps)
    
    if url == "local" or url == nil or string.len(url) == 0 then
        return oldValue
    end

    
    if string.find(url, "miniapp://") == 1 or 
        string.find(url, "mqqapi://") == 1 or
        string.find(url, "res:") == 1 then
        return url
    end

    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    if isHttps ~= nil and isHttps == true then
        return "https://" .. url
    end

    
    return "http://" .. url
end

function getFontHeightDelta(fontsize)
    local delta = 0
    if fontsize < 20 then
        delta = 5
    elseif fontsize < 30 then
        delta = 8
    elseif fontsize < 40 then
        delta = 11
    elseif fontsize < 50 then
        delta = 14
    end

    if utils.getArkVersion() <= 7 then
        return delta
    end
    return 0
end

function getArkVersion()
    return Platform.GetVersion()
end

function loadUrl(url, view)
    if QQ and QQ.OpenUrl then
        if isWin() then
            QQ.OpenUrl(url)
        else
            QQ.OpenUrl(url, view)
        end
        return true
    end
    return false
end

ReportIndex = {
    INDEX_MUSIC = 0,
    INDEX_VIDEO = 1,
    INDEX_NEWS = 2,
    INDEX_CONTACT = 3,
    INDEX_MESSAGES = 4
}

function report()

end

function asyncCallback(time, func)
    local timer = Timer()
    timer:SetInterval(time)
    timer:AttachEvent("OnTimer", function()
       func()
       timer:Stop()
       timer = nil
    end)
    timer:Start()
end

local function createHttpRequest()
    if Net ~= nil and Net.HttpRequest ~= nil then
        return Net.HttpRequest()
    end
    return Http.CreateHttpRequest()
end

function isIOS()
    local str = System.GetOS()
    if str ~= nil and str == "iOS" then
        return true
    end
    return false 
end

function isWin()
    local str = System.GetOS()
    if str ~= nil and str == "Windows" then
        return true
    end
    return false 
end

function isAndroid()
    local str = System.GetOS()
    if str ~= nil and str == "Android" then
        return true
    end
    return false 
end

function UpdateImage(imageObj, imageUrl, default)
    if imageObj == nil then
        return
    end

    local cgi = "https://cgi.connect.qq.com/qqconnectopen/openapi/change_image_url?url=".. imageUrl
    local httpGet = createHttpRequest()
    httpGet:SetTimeout(15000)
    httpGet:AttachEvent("OnComplete", function(http)
        
        local temp = httpGet
        httpGet = nil

        if not http:IsSuccess() then
            utils.log("update webp fail : ".. tostring(http:GetStatusCode()))
            imageObj:SetValue(default)
            return
        end
        local data = http:GetData("text/json")
        if data == nil or type(data)~="table" then
            app.debug("data is nil")
            imageObj:SetValue(default)
            return
        end

        local result = data["result"]
        if result == nil or type(result)~="table" then
            app.debug("result is nil")
            imageObj:SetValue(default)
            return
        end

        local url = result["url"]
        app.debug("url "..imageUrl.." is webp and translated to ".. url)
        if url ~= nil then
            Storage.Save(imageUrl, url)
            if imageUrl == url then
                utils.log("same url")
            end
            imageObj:SetValue(url)
        else
            app.debug("url is nil")
            imageObj:SetValue(default)
        end
    end)
    app.debug("webp translation: "..cgi)
    httpGet:Get(cgi, true)
end


function SetImageValue(imageObj, imageUrl, default, onSetValue)
    if imageObj == nil then
        return
    end

    if string.find(imageUrl, "res:") == 1 and imageUrl ~= nil then
        imageObj:SetValue(imageUrl)
        return
    end
    
    local setImageValue = function(value, success)
        imageObj:SetValue(value)
        if onSetValue ~= nil then
            onSetValue(success)
        end
    end

    local originUrl = imageUrl
    local storedUrl = Storage.Load(imageUrl, "")
    if storedUrl ~= nil then
        if string.find(storedUrl, "cache:") == 1 then
            app.debug("SetImageValue find a cache")
            setImageValue(storedUrl, true)
            return
        end
        imageUrl = storedUrl
    end

    local httpGet = createHttpRequest()
    httpGet:SetTimeout(5000)
    httpGet:AttachEvent("OnComplete", function(http)
        
        local temp = httpGet
        httpGet = nil

        if not http:IsSuccess() then
            
            setImageValue(default, false)
            return
        end
        local cachePath = http:GetCachePath()
        if cachePath ~= nil then
            Storage.Save(originUrl, cachePath)
            setImageValue(cachePath, true)
        else
            app.debug("cachePath is nil")
            setImageValue(default, false)
        end
    end)
    httpGet:Get(imageUrl, true)
end


CacheHelper = {}
function CacheHelper:GetInstance()
    if self.obj then
        return self.obj
    else
        local obj = {}
        setmetatable(obj, self)
        self.__index = self
        self.obj = obj
        return obj
    end
end

function CacheHelper:GetCache(key, maxAge)
    if not key then return nil end
    local cache = nil
    cache = Storage.Load(key)
    if cache ~= nil and cache ~= ""  and cache.time then
        if type(maxAge)=="number" and (maxAge<0 or os.time() - cache.time < maxAge) then
            return cache.value
        else
            self:RemoveCache(key)
        end
    end
    return nil
end

function CacheHelper:SetCache(key, value)
    if not key then return end
    local cache = {
        value = value,
        time = os.time(),
    }
    local ret = Storage.Save(key, cache)
    if not ret then
        modapi.Log(string.format("%s.Storage.Save.Failed: key=%s", app.GetAppName(), key))
    end
    return ret
end

function CacheHelper:RemoveCache()
    if not key then return end
    return Storage.Save(key, "")
end

--%E7%BD%91%E7%BB%9C
local NetHelper = {
    TIMEOUT = 30000,
}
function NetHelper:GetInstance()
    if self.obj then
        return self.obj
    else
        local obj = {}
        setmetatable(obj, self)
        self.__index = self
        self.obj = obj
        return obj
    end
end

local function GetByte(str, count)
    if type(str)~="string" then return "" end
    local len = #str
    if count > len then count = len end
    local st = {}
    for i = 1, count do
        table.insert(st, string.byte(str, i))
    end
    return table.concat(st, " ")
end

function NetHelper:AsycGetNetImage(url, onLoading, onSuccess, onFailed)
    if not url or not onSuccess then 
        if onFailed then onFailed() end 
        return
    end
    local httpReturned = false
    local http = Net.HttpRequest()
    http:AttachEvent("OnComplete", function()
        httpReturned = true
        local path = http:GetCachePath()
        modapi.Log(string.format("%s.AsycGetNetImage.status: %s, url: %s, data: %s", app.GetAppName(), tostring(http:GetStatusCode()), url, GetByte(http:GetData("text/plain"), 8)))
        if not http:IsSuccess() or path == nil then
            modapi.Log(string.format("%s.AsycGetNetImage.CompleteAndFailed.%s", app.GetAppName(), url))
            if onFailed then onFailed() end 
            return
        end
          onSuccess(path)
    end)
    if type(http.SetTimeout)=="function" then
        http:SetTimeout(NetHelper.TIMEOUT)
    else
        local timer = Timer()
        timer:SetInterval(NetHelper.TIMEOUT)
        timer:AttachEvent("OnTimer", function()
            timer:Stop()
            if httpReturned then return end
            http:Abort()
            modapi.Log(string.format("%s.AsycGetNetImage.Timer.%s", app.GetAppName(), url))
            if onFailed then onFailed() end 
        end)
        timer:Start()
    end
    http:Get(url, true)
    if onLoading then onLoading() end
end

function NetHelper:AsycHttpGetJson(url, onLoading, onSuccess, onFailed)
    if not url or not onSuccess then 
        if onFailed then onFailed() end 
        return
    end
    local httpReturned = false
    local http = Net.HttpRequest()
    http:AttachEvent("OnComplete", function() 
        httpReturned = true
        local json = http:GetData("application/json")
        modapi.Log(string.format("%s.AsycHttpGetJson.status: %s, url: %s", app.GetAppName(), tostring(http:GetStatusCode()), url))
        if not http:IsSuccess() or json==nil then 
            modapi.Log(string.format("%s.AsycHttpGetJson.CompleteAndFailed.%s", app.GetAppName(), url))
            if onFailed then onFailed() end 
            return
        end
        onSuccess(json)
    end)
    if type(http.SetTimeout)=="function" then
        http:SetTimeout(NetHelper.TIMEOUT)
    else
        local timer = Timer()
        timer:SetInterval(NetHelper.TIMEOUT)
        timer:AttachEvent("OnTimer", function()
            timer:Stop()
            if httpReturned then return end
            http:Abort()
            modapi.Log(string.format("%s.AsycHttpGetJson.Timer.%s", app.GetAppName(), url))
            if onFailed then onFailed() end 
        end)
        timer:Start()
    end
    http:Get(url)
    if onLoading then onLoading() end
end

function NetHelper:SSOParamsToStr(params)
    if type(params)~= "table" then return "" end
    local rest = {}
    for k, v in pairs(params) do
        if type(v)=="table" then
            table.insert(rest, string.format("%s={%s}", tostring(k), tostring(self:SSOParamsToStr(v))))
        else
            table.insert(rest, string.format("%s=%s", tostring(k), tostring(v)))
        end
    end
    return table.concat(rest, ", ")
end

function NetHelper:SSORequest(svccmd, params, onLoading, onSuccess, onFailed)
    if onLoading then onLoading() end
    if not svccmd or type(params)~="table" or not onSuccess then 
        if onFailed then onFailed() end 
        return
    end
    local request = QQ.DataRequest()
    request:AttachEvent("OnComplete", function() 
        local ret = request:GetData("json")
        modapi.Log(string.format("%s.SSORequest.return.%s, %s", app.GetAppName(), tostring(svccmd), tostring(self:SSOParamsToStr(params))))
        if request:IsSuccess() and ret and ret.data then 
            onSuccess(ret.data)
        else
            modapi.Log(string.format("%s.SSORequest.Failed.%s, %s, %s", app.GetAppName(), tostring(svccmd), tostring(self:SSOParamsToStr(params)), tostring(ret)))
            if onFailed then onFailed() end
        end
    end)
    if not request:Open(svccmd) then
        modapi.Log(string.format("%s.SSORequest.OpenFailed.%s.%s", app.GetAppName(), svccmd, self:SSOParamsToStr(params)))
        if onFailed then onFailed() end 
        return
    end
    
    request:SetTimeout(NetHelper.TIMEOUT)
    if not request:Send(params) then
        modapi.Log(string.format("%s.SSORequest.SendFailed.%s.%s", app.GetAppName(), svccmd, self:SSOParamsToStr(params)))
        if onFailed then onFailed() end 
        return
    end
end


function setMaskLayer(view)
     local touch_icon = view:GetUIObject("touch_layer_icon")
     local touchTexture = touch_icon:GetTexture("touchTexture")
     if touchTexture ~= nil then
         touchTexture:SetValue(0x50000000) 
         Console.Log("%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%EF%BC%8C%E8%AE%BE%E7%BD%AE%E8%92%99%E5%B1%82%E9%80%8F%E6%98%8E%E5%BA%A6")
     end
end

function setBackground(view, themeConfig)

    if view == nil then
        utils.log("setBackground, return, view is nil")
        return 
    end
    
    local root = view:GetRoot()
    local colorConfig = theme.getThemeColorConfig(root)
    
    local border = view:GetUIObject("border")
    local texture = view:GetTexture("bgColor")
    local bottom = view:GetUIObject("bottom")
    local seperator = view:GetUIObject("seperator")
    local bottomTexture = bottom:GetTexture("bottomBg")
    local seperatorTexture = nil
    if seperator ~= nil then
        seperatorTexture = seperator:GetTexture("seperatorColor")
    end
   
    
    if texture ~= nil then
        texture:SetValue(colorConfig[theme.THEME_COLOR_BACKGROUND])
    end
    if bottomTexture ~= nil then
        bottomTexture:SetValue(colorConfig[theme.THEME_COLOR_BOTTOM])
    end
    if seperatorTexture ~= nil then
        seperatorTexture:SetValue(colorConfig[theme.THEME_COLOR_SEPERATOR])
    end

    
    setThemeTextColor(view, "title", colorConfig[theme.THEME_COLOR_TITLE])
    setThemeTextColor(view, "desc", colorConfig[theme.THEME_COLOR_SUMMARY])
    setThemeTextColor(view, "tag", colorConfig[theme.THEME_COLOR_SOURCE])
    
    
    
    if border then
        border:SetVisible(theme.shouldShowLeftBorder(view:GetRoot()))
        local borderTexture = border:GetTexture("borderBg")
        if borderTexture ~= nil then
            borderTexture:SetValue(colorConfig[theme.THEME_COLOR_BORDER])
        end
    end
    
    
    if theme.shouldSetMaskLayer(themeConfig) then
        setMaskLayer(view)
    end
end


function setThemeTextColor(view, textID, color)
    if color == nil or color == 0 then
        return
    end
    
    local text = view:GetUIObject(textID)
    if not text or not text.SetTextColor then
        return
    end
       
    text:SetTextColor(color)
end 



function getSafeUtf8String(s)
    if System.GetOS and System.GetOS() == 'Android' then
        return s,false
    end
    local ss = {}
    local findReverse = false
    local k = 1
    while true do
        if k > #s then
            break 
        end
        local c = string.byte(s,k)
        if not c then
            break 
        end
        if c < 192 then 
            k = k + 1
            table.insert(ss, string.char(c))
        elseif c < 224 then 
            local c1 = string.byte(s,k+1)
            table.insert(ss, string.char(c,c1))
            k = k + 2
        elseif c < 240 then 
            local c1 = string.byte(s,k+1)
            local c2 = string.byte(s,k+2)
            
            
            if c == 226 and c1 == 129 and c2 == 167 then
                findReverse = true
                table.insert(ss, string.char(32))
            else
                table.insert(ss, string.char(c,c1,c2))
            end
            k = k + 3
        elseif c < 248 then 
            local c1 = string.byte(s,k+1)
            local c2 = string.byte(s,k+2)
            local c3 = string.byte(s,k+3)
            table.insert(ss, string.char(c,c1,c2,c3))
            k = k + 4
        elseif c < 252 then 
            local c1 = string.byte(s,k+1)
            local c2 = string.byte(s,k+2)
            local c3 = string.byte(s,k+3)
            local c4 = string.byte(s,k+4)
            table.insert(ss, string.char(c,c1,c2,c3,c4))
            k = k + 5
        elseif c < 254 then 
            local c1 = string.byte(s,k+1)
            local c2 = string.byte(s,k+2)
            local c3 = string.byte(s,k+3)
            local c4 = string.byte(s,k+4)
            local c5 = string.byte(s,k+5)
            table.insert(ss, string.char(c,c1,c2,c3,c4,c5))
            k = k + 6
        end
    end
    
    local safeStr = s
    if findReverse then
        safeStr = table.concat(ss)
    end
    return safeStr,findReverse
end

function setSafeText(view,content)
   if view == nil or content == nil then
       return
   end
   local safeContent,findReverse = utils.getSafeUtf8String(content)
   view:SetValue(safeContent)
   if findReverse then
       QQ.Report(view:GetRoot():GetID(), 0, "FindReverse")
       Console.Log("report find reverse string content:"..content)
   end
end

function log(text)
    Console.Log(tostring(text))
    if QQ and QQ.Log then
        QQ.Log(tostring(text))
    end
end


          _G['utils'] = {
            urlchecklist = urlchecklist,fixurl = fixurl,getFontHeightDelta = getFontHeightDelta,getArkVersion = getArkVersion,loadUrl = loadUrl,ReportIndex = ReportIndex,report = report,asyncCallback = asyncCallback,createHttpRequest = createHttpRequest,isIOS = isIOS,isWin = isWin,isAndroid = isAndroid,UpdateImage = UpdateImage,SetImageValue = SetImageValue,CacheHelper = CacheHelper,NetHelper = NetHelper,GetByte = GetByte,setMaskLayer = setMaskLayer,setBackground = setBackground,setThemeTextColor = setThemeTextColor,getSafeUtf8String = getSafeUtf8String,setSafeText = setSafeText,log = log
          }
        `;

  const code$d = `
          
THEME = {
    COLOR_BACKGROUND = 'bg_bottom_light',
    COLOR_TITLE = "text_primary",
    COLOR_SUMMARY = "text_secondary",
    COLOR_SOURCE = "text_secondary",
    COLOR_SEPERATOR = "border_standard",
    COLOR_WHIHE = 'text_white'
}


COLOR_SCHEME_DEFAULT = {
    [THEME.COLOR_BACKGROUND] = 0xFFFFFFFF,
    [THEME.COLOR_TITLE] = 0xFF000000,
    [THEME.COLOR_SUMMARY] = 0xFF8C8C8C,
    [THEME.COLOR_SOURCE] = 0xFF8C8C8C,
    [THEME.COLOR_SEPERATOR] = 0x1A000000,
    [THEME.COLOR_WHIHE] = 0xFFFFFFFF,
}


COLOR_SCHEME_DEFAULT_NIGHT = {
    [THEME.COLOR_BACKGROUND] = 0xFF262626,
    [THEME.COLOR_TITLE] = 0xFFFFFFFF,
    [THEME.COLOR_SUMMARY] = 0xFF999999,
    [THEME.COLOR_SOURCE] = 0xFF999999,
    [THEME.COLOR_SEPERATOR] = 0x1AFFFFFF,
    [THEME.COLOR_WHIHE] = 0xFFFFFFFF,
}


          _G['constant'] = {
            THEME = THEME,COLOR_SCHEME_DEFAULT = COLOR_SCHEME_DEFAULT,COLOR_SCHEME_DEFAULT_NIGHT = COLOR_SCHEME_DEFAULT_NIGHT
          }
        `;

  const code$c = `
          
local COLOR_SCHEME_DEFAULT = constant.COLOR_SCHEME_DEFAULT

function getThemeColorConfig()    
    local theme = app.getThemeConfig()
    local token = app.getAppConfig('token')
    if theme == nil then 
        utils.log("theme config is nil")
        return nil
    end

    if token == nil then
        utils.log("token config is nil")
        return nil
    end
    return token 
end

function format(colorStr)
    if colorStr == nil then
        
        return nil
    end 
    if string.find(colorStr, '^#%x%x%x%x%x%x%x%x$') == nil and 
       string.find(colorStr, '^#%x%x%x%x%x%x$') == nil and 
       string.find(colorStr, '^#%x%x%x$') == nil then
        
        return nil
    end
    local str = string.sub(colorStr,2,string.len(colorStr)) 
    local len = string.len(str)
    if(len==3) then
        
        local strIndex1 = string.sub(str,1,1) 
        local strIndex2 = string.sub(str,2,2) 
        local strIndex3 = string.sub(str,3,3) 
        str = strIndex1..strIndex1..strIndex2..strIndex2..strIndex3..strIndex3
    end
    if len==6 then
        str = 'FF'..str
    end
    
    
    local num = tonumber(str,16)
    return num
end

function getThemeColorValue(keyName,colorConfig)
    if colorConfig == nil then
        return COLOR_SCHEME_DEFAULT[keyName]
    end
    
    
    local formatColorVal = format(colorConfig[keyName])
    local res = formatColorVal or COLOR_SCHEME_DEFAULT[keyName]
    return res
end
          _G['theme'] = {
            COLOR_SCHEME_DEFAULT = COLOR_SCHEME_DEFAULT,getThemeColorConfig = getThemeColorConfig,format = format,getThemeColorValue = getThemeColorValue
          }
        `;

  const code$b = `
          

function GetQQVer()
    if not QQ or not QQ.GetVersion then
        return 0
    end

    local verString = QQ.GetVersion()
    local it = string.gmatch(verString, "(%d+)%.(%d+)%.(%d+)")
    if not it then
        return 0
    end
    local v1, v2, v3 = it()
    return tonumber(v1) * 10000 + tonumber(v2) * 100 + tonumber(v3)
end

function getAvatarUrl(uin) 
    return string.format("https://q.qlogo.cn/g?b=qq&nk=%s&s=100", uin)
end

function IsInAIO(view) 
    
    

if (QQ  == nil or QQ.GetContainerInfo == nil) then
        return false
    end
    local info = QQ.GetContainerInfo(view) 
    if not info then
        return false
    end
    
    local chatType = info["ChatType"]
    if chatType == nil or chatType == 0 or chatType == -1 or
        chatType == "0" or chatType == "-1" then
        return false
    end
    return true
end
          _G['qqutil'] = {
            GetQQVer = GetQQVer,getAvatarUrl = getAvatarUrl,IsInAIO = IsInAIO
          }
        `;

  const code$a = `
          

function GetImageSize(url, callback) 
    if callback == nil then
        return
    end
    
    local image = UI.Image()
    image:AttachEvent("OnLoad", function()
        image:DetachEvent("OnLoad")
        local w, h = image:GetSize()
        callback(url, w, h)
    end)
    
end
          _G['picutil'] = {
            GetImageSize = GetImageSize
          }
        `;

  const code$9 = `
          


function SetColor(elem, color)
    if elem == nil then
        return
    end

    local elemType = elem:GetType()
    if elemType == "Texture" then
        elem:SetValue(color)
    elseif elemType == "Text" then
        elem:SetTextColor(color)
    else
        utils.log("unknown element type: " .. elemType)
    end
end


function AdjustViewWidth(width)
    Console.Log('aaa AdjustViewWidth', width)
    return math.floor(width * 96 / 100)
end


function SetRootSize(view, width, height)
    local root = view:GetRoot()
    root:SetSize(width, height)
end



          _G['uiutil'] = {
            SetColor = SetColor,AdjustViewWidth = AdjustViewWidth,SetRootSize = SetRootSize
          }
        `;

  const code$8 = `
          local viewModels = { }


local appConfig = nil

function getAppConfig(key)
    if appConfig == nil then 
        return nil
    end
    return appConfig[key]
end
function getThemeConfig()
    
    if appConfig == nil then 
        return nil
    end
    return appConfig["theme"]
end

function getDarkColorModel() 
    local themeConfig = getAppConfig('theme')
    if (themeConfig) then
        local themeId = themeConfig.themeId
        if(themeId == '1102' or themeId == '2920' or themeId == '1103' or themeId == 1102 or themeId == 2920 or themeId == 1103) then
            return true
        end
        return false
    end
    return false
end

function getViewModels()
    return viewModels
end

function GetModel(view)
    while(view~=view:GetRoot())
    do
        if viewModels[view] then
            break
        else
            view = view:GetParent()
        end
    end
    
    local model = viewModels[view]
    if model and model.GetModel then 
        return model:GetModel()
    end
    return model
end

function OnCreateView(view, template)
    utils.log("app.OnCreateView template=" .. template .. ", view=" .. tostring(view))
    
    if type(_G[template])=="table" then
        local model = _G[template].ViewModel:New(view)
        viewModels[view] = model
        model:Initialize(view)
    else
        app.log("OnCreateView.FatalError: No View Model for "..template)
    end
end

function OnSetMetadata(sender, value)
    utils.log("app.OnSetMetadata.sender=" .. tostring(sender))
    
    local obj = app.GetModel(sender)
    if obj == nil then
        return
    end

    obj:OnSetMetadata(value)
end

function OnDestroyView(view, template)
    while(view~=view:GetRoot())
    do
        if viewModels[view] then
            break
        else
            view = view:GetParent()
        end
    end
    viewModels[view]:Deinitialize()
    viewModels[view] = nil
end

function OnActivate(view, active)
    local model = app.GetModel(sender)
    if model == nil or model.OnActivate == nil then return end
    model:OnActivate(view, active)
end

function OnShare(view)
end

function OnResize(sender, srcWidth, srcHeight, dstWidth, dstHeight)
    local model = app.GetModel(sender)
    if model == nil or model.OnResize == nil then return end
    model:OnResize(dstWidth, dstHeight)
end

function OnClick(sender, x, y, button, keyState)
    local model = app.GetModel(sender)
    if model == nil or model.OnClick == nil then
        utils.log("app.OnClick, model not found, sender=" .. tostring(sender))
        return 
    end
    utils.log("app.OnClick, sender=" .. tostring(sender) 
        .. ", model=" .. tostring(model))
    model:OnClick(sender)
end

function OnTouchStart(sender, x, y, button, keyState)
    local model = app.GetModel(sender)
    if model == nil or model.OnClick == nil then
        return 
    end
    model:OnTouchStart(sender, x)
end

function OnCustomEvent(sender, event, data)
    local model = app.GetModel(sender)
    if model == nil then return end
    model:OnCustomEvent(sender, event, data)
end

function GetAppName()
    return "notice"
end

local debugEnable = true
function debug(msg)
    if debugEnable == true then
        Console.Log("ark_notice: "..msg)
    end
end

function log(msg)
    Console.Log("ark_notice: "..msg)
end

function OnConfigChange(config)
    
    if config then
        appConfig = config
    else
        utils.log("app.OnConfigChange, config is nil")
    end
    for view, model in pairs(viewModels) do
        if model ~= nil and model.OnConfigChange ~= nil then
            utils.log("app.OnConfigChange, view=" .. tostring(view) .. ", model=" .. tostring(model))
            model:OnConfigChange(config)
        else
            
        end
    end
end 

function OnStartup(config)
    
    if config then
        appConfig = config
    else
        utils.log("app.OnStartup, config is nil")
    end
    for _, model in pairs(viewModels) do
        if model ~= nil and model.OnStartup ~= nil then
            model:OnStartup(config)
        end
    end
end

          _G['app'] = {
            viewModels = viewModels,appConfig = appConfig,getAppConfig = getAppConfig,getThemeConfig = getThemeConfig,getDarkColorModel = getDarkColorModel,getViewModels = getViewModels,GetModel = GetModel,OnCreateView = OnCreateView,OnSetMetadata = OnSetMetadata,OnDestroyView = OnDestroyView,OnActivate = OnActivate,OnShare = OnShare,OnResize = OnResize,OnClick = OnClick,OnTouchStart = OnTouchStart,OnCustomEvent = OnCustomEvent,GetAppName = GetAppName,debugEnable = debugEnable,debug = debug,log = log,OnConfigChange = OnConfigChange,OnStartup = OnStartup
          }
        `;

  const code$7 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    utils.log("operationItem Initialize ")
    self.view = view
    self.labelText = self.view:GetUIObject("labelText")
    self.seperatorView = self.view:GetUIObject("seperator")
    self.seperator = self.seperatorView:GetTexture("seperatorColor")
end

function ViewModel:OnResize(width,height)
    utils.log("operationItem onResize: size=" .. width .. "," .. height)
    self:UpdateStyle()
end

function ViewModel:OnClick()
    utils.log("%E5%BD%93%E5%89%8Ditem" .. Net.TableToJSON(self.metadata))

    local oldurl = self.metadata['jumpUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end

    local url = self:prefix(oldurl)
    local res = utils.loadUrl(url, self.view:GetRoot())
    utils.log(res)
end

function ViewModel:OnSetMetadata(value)
    utils.log("operationItem set meta: " .. Net.TableToJSON(value))
    self.metadata = value["operationItem"]
    self:UpdateValue(self.metadata)
    self:UpdateStyle()
end

function ViewModel:UpdateValue(data)
    self.labelText:SetValue(data["label"])
    self:ApplyTheme()
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    if(self.labelText ~=nil) then
        self.labelText:SetTextColor(textPrimary)
    end

    if(self.seperator ~=nil) then
        self.seperator:SetValue(border)
    end


end


function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:UpdateStyle()
    local _, itemheight = self.labelText:GetSize()
    local _, sizeHeight = self.view:GetSize()

    if (sizeHeight > 0) then
        local defaultValueTextStyle = "display:flex;height:" ..sizeHeight..";width:100%;flexDirection:column"
        self.view:SetStyle(defaultValueTextStyle)
        utils.log("operationItem UpdateStyle  " ..self.view:GetStyle()..","..sizeHeight..","..itemheight);
    end
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end
function ViewModel:prefix(url)
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end

          _G['operationItem'] = {
            ViewModel = ViewModel
          }
        `;

  const code$6 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    utils.log("detailItem Initialize ")
    self.view = view
    self.labelText = self.view:GetUIObject("labelText")
    self.valueText = self.view:GetUIObject("valueText")
    self.finishText = false
    self.isCaclute = false
    self.isUpdate = false
    self.commonView = {}
    self.lightHeighTextView = {}
end

function ViewModel:OnResize(width,height)
    utils.log("detailItem onResize: size=" .. width .. "," .. height)
    Console.Log('aaa OnResize meta', self.metadata, width, height)
    if self.metadata == nil then
        return
    end
    self:UpdateStyle()
end

function ViewModel:OnSetMetadata(value)
    utils.log("detailItem set meta: " .. Net.TableToJSON(value))
    self.metadata = value["detailItem"]
    self:UpdateValue(self.metadata)
    Console.Log('aaa OnSetMetadata meta', self.metadata, value)
end

function ViewModel:UpdateValue(data)
    self.labelText:SetValue(data["label"])
end

function ViewModel:UpdateStyle()

    if (self.render == true) then
        return
    end
    
    local sizeWidth, sizeHeight = self.view:GetSize()
    local labelSize, _ = self.labelText:GetSize()

    local valueWidth = sizeWidth - labelSize

    Console.Log('aaa UpdateStyle isUpdate self.finishText == false and valueWidth > 0 and labelSize > 0', self.isUpdate, self.finishText, valueWidth, labelSize)

    if (self.isUpdate) then
        return
    end

    if (self.finishText == false and valueWidth > 0 and labelSize > 0) then
        utils.log("detailItem valueWidth "..valueWidth)
        local x,y = self.valueText:GetSize();
        self.valueText:SetStyle("display:flex;flex: 1;flexDirection: row;flexWrap: wrap;alignItems: flex-start;alignContent: flex-start;justifyContent: flex-start;width: "..x..";height:auto;flexShrink:0")
        local x1,y1 = self.view:GetRoot():GetSize();
        self.isUpdate = true
        Console.Log('aaa valueText metadata valueWidth, valueWidth', self.valueText, self.metadata, valueWidth, valueWidth)
        local contentWidth = self:updateMuliteLine(self.valueText, self.metadata['value'], valueWidth, valueWidth)
        self:updateMuliteLineHeigh(self.valueText, self.metadata['lightHeighText'], valueWidth, contentWidth)
        self.finishText = true
        self.isUpdate = false
        local w,h = self.valueText:GetSize()
        utils.log("detailItem valueText "..w..h..x..y)
        self:ApplyTheme()
        return 
    end

    if (self.finishText == false) then
        return
    end
    
    
    if (sizeHeight > 0) then
        local defaultValueTextStyle = "display:flex;marginBottom:8;height:"..sizeHeight..";width:100%;alignItems:flex-start;justifyContent:space-between"
        self.view:SetStyle(defaultValueTextStyle)
        self.render = true
    end
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then 
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then 
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then 
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then 
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    if (self.labelText ~=nil) then
        self.labelText:SetTextColor(textSecondary)
    end

    local color = textPrimary

    if (isDark == false and self.metadata["lightHeighTextColor"] ~= nil) then
        color = self.metadata["lightHeighTextColor"]
    end

    if (isDark == true and self.metadata["lightHeighTextColorDark"] ~= nil) then
        color = self.metadata["lightHeighTextColorDark"]
    end

    for i, v in pairs(self.commonView) do
        
        if (type(v) == 'number') then
            break;
        end 
        v:SetTextColor(textPrimary)
    end

    local colorType = type(color)
    if (colorType ~= 'number') then
        utils.log("detailItem color "..color)
        color = tonumber(color)
    end

    colorType = type(color)
    if (colorType ~= 'number') then
        color = textPrimary
    end

    for i, v in pairs(self.lightHeighTextView) do
        
        if (type(v) == 'number') then
            break;
        end 
        v:SetTextColor(color)
    end

end

function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end

function ViewModel:updateMuliteLine(view, content, subWidth, startWidth) 
    local contentWidth = startWidth
    local temContent = content
    local textWidth = self:measureText(temContent, "app.16.weight.400")
    local font = 'app.16.weight.400'
    local targetFont = 'app.16.weight.400'
    local viewIndex = 1
    
    while(self:len(temContent)> 0)
    do
        if (textWidth >= contentWidth) then
            local maxRenderWidth = self:getMaxRenderLength(temContent, contentWidth, font)
            if (maxRenderWidth <= 0) then
               contentWidth = subWidth
               maxRenderWidth = self:getMaxRenderLength(temContent, contentWidth, font)
            end

            local newText = self:sub(temContent, 1, maxRenderWidth)

            local length = self:len(temContent);

            temContent = self:sub(temContent, maxRenderWidth+1, length - maxRenderWidth)


            local textView = self:getTextView(newText, targetFont, 0xFFA2A5AC)
            contentWidth = contentWidth - self:measureText(newText, targetFont)

            self.commonView[viewIndex] = textView
            viewIndex = viewIndex+1
            view:AddChild(textView)
        else
            local textView = self:getTextView(temContent, targetFont, 0xFFA2A5AC)
            contentWidth = contentWidth - textWidth
            temContent = ""
            self.commonView[viewIndex] = textView
            viewIndex = viewIndex+1
            view:AddChild(textView)
        end
    end
    utils.log("detailItem temContent end"..contentWidth)
    return contentWidth
end

function ViewModel:updateMuliteLineHeigh(view, content, subWidth, startWidth) 
    local contentWidth = startWidth
    local temContent = content
    local textWidth = self:measureText(temContent, "app.16.weight.400")
    local font = 'app.16.weight.400'
    local targetFont = 'app.16.weight.400'
    local viewIndex  = 1

    

    while(self:len(temContent)> 0)
    do
        if (textWidth >= contentWidth) then
            local maxRenderWidth = self:getMaxRenderLength(temContent, contentWidth, font)
            if (maxRenderWidth <= 0) then
               contentWidth = subWidth
               maxRenderWidth = self:getMaxRenderLength(temContent, contentWidth, font)
            end

            local newText = self:sub(temContent, 1, maxRenderWidth)

            local length = self:len(temContent);

            temContent = self:sub(temContent, maxRenderWidth+1, length - maxRenderWidth)

            local textView = self:getTextView(newText, targetFont, 0xFFA2A5AC)
            contentWidth = contentWidth - self:measureText(newText, targetFont)

            utils.log("detailItem temContent "..newText..self:measureText(newText, targetFont))

            self.lightHeighTextView[viewIndex] = textView
            viewIndex = viewIndex+1

            view:AddChild(textView)
        else
            local textView = self:getTextView(temContent, targetFont, 0xFFA2A5AC)
            contentWidth = contentWidth - textWidth
            temContent = ""
            self.lightHeighTextView[viewIndex] = textView
            viewIndex = viewIndex+1
            view:AddChild(textView)
        end
    end
    utils.log("detailItem temContent end"..contentWidth)
    return contentWidth
end

function ViewModel:getMaxRenderLength(text, width, fontSize)
    local mid = 1
    local l = 1
    local r = self:len(text)
    local c = 1
    while(r - l > 1)
    do
        mid = math.floor((l + r) / 2)
        local newStr = self:sub(text, 1, mid)
        local newWidth = self:measureText(newStr, fontSize)
        c = c+1
        if (width < newWidth) then
            r = mid
        else 
            l = mid
        end
    end

    local newStrL = self:sub(text, 1, l)
    local newWidthL = self:measureText(newStrL, fontSize)

    local newStrR = self:sub(text, 1, r)
    local newWidthR = self:measureText(newStrR, fontSize)

    if (newWidthR <= width) then
        return r
    end

    if (newWidthL <= width) then
        return l
    end


    return 0
end

function ViewModel:measureText(textStr, size)
    local text = UI.Text()
    text:SetValue(textStr)
    text:SetFont(size)
    local x, y = text:GetSize()
    return x
end

function ViewModel:getTextView(textStr, size, color) 
    local textView = UI.Text()
    textView:SetValue(textStr)
    textView:SetFont(size)
    if (color) then
        textView:SetTextColor(color)
    else
        textView:SetTextColor(0xFFA2A5AC)
    end
    return textView
end

function ViewModel:sub( str, startChar, numChars )
	local startIndex = 1
    while startChar > 1 do
        local char = string.byte(str, startIndex)
        startIndex = startIndex + self:chsize(char)
        startChar = startChar - 1
    end
 
    local currentIndex = startIndex
 
    while numChars > 0 and currentIndex <= #str do
        local char = string.byte(str, currentIndex)
        currentIndex = currentIndex + self:chsize(char)
        numChars = numChars -1
    end
    return str:sub(startIndex, currentIndex - 1), numChars
end

function ViewModel:len( str )
    local len = 0
    local currentIndex = 1
    while currentIndex <= #str do
        local char = string.byte(str, currentIndex)
        currentIndex = currentIndex + self:chsize(char)
        len = len +1
    end
    return len
end

function ViewModel:chsize( char )
    if not char then
       
       return 0
    elseif char > 240 then
       return 4
    elseif char > 225 then
       return 3
    elseif char > 192 then
       return 2
    else
       return 1
    end
 end
 
 function ViewModel:prefix(url)
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end
          _G['detailItem'] = {
            ViewModel = ViewModel
          }
        `;

  const code$5 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    utils.log("singlePicItem Initialize ")
    self.view = view
    self.topText = self.view:GetUIObject("topText")
    self.bottomText = self.view:GetUIObject("bottomText")
end

function ViewModel:OnResize(width,height)
    utils.log("singlePicItem onResize: size=" .. width .. "," .. height)
    self:UpdateStyle()
end

function ViewModel:OnClick()
    utils.log("%E5%BD%93%E5%89%8Ditem" .. Net.TableToJSON(self.metadata))

    local oldurl = self.metadata['jumpUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end

    utils.log("%E5%BD%93%E5%89%8Ditemoldurl" .. oldurl)

    local url = self:prefix(oldurl)
    local res = utils.loadUrl(url, self.view:GetRoot())
    utils.log(res)
end

function ViewModel:OnSetMetadata(value)
    utils.log("singlePicItem set meta: " .. Net.TableToJSON(value))
    self.metadata = value["singlePicItem"]
    self:UpdateValue(self.metadata)
    self:UpdateStyle()
end

function ViewModel:UpdateValue(data)
    self.topText:SetValue(data["label"])
    self.bottomText:SetValue(data["text"])
end

function ViewModel:UpdateStyle()
    local _, itemheight = self.topText:GetSize()
    local _, sizeHeight = self.view:GetSize()
    self:ApplyTheme()
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then 
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then 
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then 
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then 
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    if(self.topText ~=nil) then
        self.topText:SetTextColor(textPrimary)
    end

    if(self.bottomText ~=nil) then
        self.bottomText:SetTextColor(textSecondary)
    end

end


function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end
function ViewModel:prefix(url)
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end
          _G['singlePicItem'] = {
            ViewModel = ViewModel
          }
        `;

  const code$4 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    utils.log("multiPicItem Initialize ")
    self.view = view
    self.text = self.view:GetUIObject("text")
    self.img = self.view:GetUIObject("multiPicImage")
end

function ViewModel:OnResize(width,height)
    utils.log("multiPicItem onResize: size=" .. width .. "," .. height)
    self:UpdateStyle()
end

function ViewModel:OnClick()
    utils.log("%E5%BD%93%E5%89%8Ditem" .. Net.TableToJSON(self.metadata))
    local oldurl = self.metadata['jumpUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end

    local url = self:prefix(oldurl)
    local res = utils.loadUrl(url, self.view:GetRoot())
    utils.log(res)
end

function ViewModel:OnSetMetadata(value)
    utils.log("multiPicItem set meta: " .. Net.TableToJSON(value))
    self.metadata = value["multiPicItem"]
    self:UpdateValue(self.metadata)
    self:UpdateStyle()
end

function ViewModel:UpdateValue(data)

    if (data["label"] ~= nil) then
        self.text:SetValue(data["label"])
    end
    
    if (data["image"] ~= nil) then
        local url = data["image"]
        utils.SetImageValue(self.img, url, url, function(success)
            
        end)
    end
    self:ApplyTheme()
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then 
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then 
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then 
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then 
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end
    


    utils.log("ViewModel Appconfig"..textPrimary)

    if (self.text ~=nil) then
        self.text:SetTextColor(textPrimary)
    end

end


function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:UpdateStyle()
    local width,height = self.view:GetSize()
    if (width >0) then
        local textWidth = width - 60
        self.text:SetStyle("display:flex;height:auto;width:"..textWidth)
    end
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end

function ViewModel:prefix(url)
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end
          _G['multiPicItem'] = {
            ViewModel = ViewModel
          }
        `;

  const code$3 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    self.view = view
    self.header = self.view:GetUIObject("header")
    self.wrapper = self.view:GetUIObject("wrapper")
    self.header = self.view:GetUIObject("header")
    self.titleIcon = self.view:GetUIObject("titleIcon")
    self.title = self.view:GetUIObject("title")
    self.summary = self.view:GetUIObject("summary")
    self.appendText =  self.view:GetUIObject("appendText")
    self.content =  self.view:GetUIObject("content")
    self.append =  self.view:GetUIObject("append")
    self.details = self.view:GetUIObject("details")
    self.operations = self.view:GetUIObject("operations")
    self.bgTexture = self.view:GetTexture("bgColor")

    self.hasSetMetaData = false
    self.isUpdate = false

end

function ViewModel:OnResize(width,height)
    local resizeWidth
    local resizeHeight
    local resizeWidth, resizeHeight = self.wrapper:GetSize()
end

function ViewModel:OnClick()
    
end

function ViewModel:OnSetMetadata(value)
    utils.log("plainText set meta: " .. Net.TableToJSON(value))
    self.metaData = value["plainText"]
    self:UpdateValue(self.metaData)
    self.hasSetMetaData = true
end

function ViewModel:UpdateValue(data)
    if data["status"] then
        self.titleIcon:SetValue('res/image/icon-'..data["status"]..'.png')
    else
        self.header:DeleteChild(self.titleIcon)
    end
    self.title:SetValue(data["title"])
    self.summary:SetValue(data["summary"])
    if (data["appendMsg"] == '' or data["appendMsg"] == nil) then
        self.content:DeleteChild(self.append)
        self.details:SetStyle("display:flex;flexDirection: column;marginBottom: 16;width: 100%")
    end
    self.appendText:SetValue(data["appendMsg"])
    self:CreateDetails(data)
    self:CreateOperations(data)
    self:ApplyTheme()
end

function ViewModel:CreateDetails(data)
    utils.log('CreateDetails')
    self.details:ClearChildren()
    local details = data["details"]
    local useSameDetailsKey = data["useSameDetailsKey"]

    Console.Log('aaa CreateDetails', data)

    if (details == nil) then
        return
    end

    for i, v in pairs(details) do
        
        if (type(v) == 'number') then
            break;
        end

        Console.Log('aaa CreateDetails v', v)
        self:CreateDetailItem(v, i, useSameDetailsKey)
    end
    Console.Log('CreateDetails details CreateDetailItem success')
end

function ViewModel:CreateDetailItem(data, index, useSameDetailsKey)

    local subFix = ""

    Console.Log('aaa CreateDetailItem data index useSameDetailsKey', data, index, useSameDetailsKey)

    if (useSameDetailsKey == false or useSameDetailsKey == "false") then
        
        subFix = ""..(index+1)..""
    end

    Console.Log('aaa CreateDetailItem subFix', subFix)

    if (type(data) ~= 'userdata') then
      return
    end

    local detailItemData ={
        ["detailItem"] = {
            label=data["title"..subFix],
            value=data["desc"..subFix],
            lightHeighText=data["lightHeighText"..subFix],
            lightHeighTextColor=data["lightHeighTextColor"..subFix],
            lightHeighTextColorDark=data["lightHeighTextColorDark"..subFix]
        }
    }
    utils.log('CreateDetailItem'..Net.TableToJSON(detailItemData))
    Console.Log('aaa CreateDetails detailItemData', detailItemData)
    local detailItem = self:GenerateView("detailItem",detailItemData)
    self.details:AddChild(detailItem)
end

function ViewModel:CreateOperations(data)
    utils.log('CreateOperations')
    self.operations:ClearChildren()
    local useSameOperationsKey = data["useSameOperationsKey"]
    local operations = data["operations"]
    if (operations == nil) then
        return
    end
    for i, v in pairs(operations) do
        
        if (type(v) == 'number') then
            break;
        end
        i = i+1
        self:CreateOperationItem(v, i, useSameOperationsKey)
    end
end

function ViewModel:CreateOperationItem(data, index, useSameOperationsKey)
    local subFix = ""

    -- paris js 0 %E5%BC%80%E5%A4%B4 lua 1%E5%BC%80%E5%A4%B4%E5%BE%85%E4%BF%AE%E5%A4%8D
    if ((useSameOperationsKey == false or useSameOperationsKey == "false")) then
        subFix = ""..(index)..""
    end

    Console.Log('CreateOperationItem data', data, type(data), index, useSameOperationsKey, subFix)

    -- paris %E4%BC%9A%E8%A7%A3%E6%9E%90%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%BE%85%E5%85%BC%E5%AE%B9%E4%BF%AE%E5%A4%8D
    if (type(data) ~= 'userdata') then
      return
    end

    local operationItemData = {
        ["operationItem"] = {
            label=data["label"..subFix],
            jumpUrl=data["jumpUrl"..subFix]
        }
    }

    utils.log('CreateOperationItem'..Net.TableToJSON(operationItemData))
    local operationItem = self:GenerateView("operationItem",operationItemData)
    self.operations:AddChild(operationItem)
end

function ViewModel:GenerateView(template,data)
    local view = CreateView(template)
    if type(_G[template])=="table" then
        local model = _G[template].ViewModel:New(view)
        app.getViewModels()[view] = model
        model:Initialize(view)
        model:test(model)
    end
    view.jsUIObject:SetMetadata(data)
    return view
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    if(self.summary ~=nil) then
        self.summary:SetTextColor(textPrimary)
    end

    if(self.appendText ~=nil) then
        self.appendText:SetTextColor(textPrimary)
    end

    if(self.title ~=nil) then
        self.title:SetTextColor(textPrimary)
    end

    if(self.bgTexture ~=nil) then
        self.bgTexture:SetValue(bgColor)
    end


    if(self.appendText ~=nil) then
        self.appendText:SetTextColor(textPrimary)
    end

    utils.log("ViewModel ApplyTheme  "..tostring(isDark).."   "..tostring(useDefault)..textPrimary)

end

function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end

          _G['plainText'] = {
            ViewModel = ViewModel
          }
        `;

  const code$2 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    self.view = view
    self.singlepicBanner = self.view:GetUIObject("singlePicBanner")
    self.singlePicBannerWrap = self.view:GetUIObject("singlePicBannerWrap")
    self.singlepicItemWrap = self.view:GetUIObject("singlePicItemWrap")
    self.bgTexture = self.view:GetTexture("bgColor")
    self.hasSetMetaData = false
    self.metaData = nil

    utils.log('tonumber'..tostring(tonumber("0xFFFFFF00")))
    
end

function ViewModel:OnResize(width,height)
    Console.Log('aaa OnResize singlePic', width, height)
    local resizeWidth, resizeHeight = self.view:GetSize()

    if (resizeWidth > 0) then
        self:setImage()
    end 
end

function ViewModel:OnClick(view)
    local oldurl = self.metaData['bannerUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end
    
    local url = self:prefix(oldurl)
    if (view == self.singlePicBannerWrap and url ~=nil) then
        utils.log("singlePic onclick: "..url)
        utils.loadUrl(url, self.view:GetRoot())
    end
end

function ViewModel:setImage()
    Console.Log('aaa setImage singlePic', self.metaData)
    local me = self
    if (self.metaData ~= nil and self.metaData["banner"] ~= nil) then
        local url = self.metaData["banner"]
        utils.SetImageValue(self.singlepicBanner, url, url, function(success)
            utils.log("singlepicBanner set banner: " ..tostring(success))
        end)
    end
    local resizeWidth, _ = self.view:GetSize()
    local picHeight = resizeWidth * (5 / 9)
    self.singlepicBanner:SetStyle("display:flex;width:"..resizeWidth..";height:"..picHeight)
end



function ViewModel:OnSetMetadata(value)
    utils.log("singlePic set meta: " .. Net.TableToJSON(value))
    self.metaData = value["singlePic"]
    Console.Log('aaa metaData', self.metaData, self)
    self:UpdateValue(self.metaData)
    self:ApplyTheme()
    local width, height = self.view:GetSize()
    self.OnResize(self, width, height)
end

function ViewModel:UpdateValue(data)
    self:CreateSinglePic(data)
end

function ViewModel:CreateSinglePic(data)
    utils.log('CreateSinglePic')
    self.singlepicItemWrap:ClearChildren()
    local details = data["singlePicItems"]
    local useSameSinglePicItemsKey = data["useSameSinglePicItemsKey"]
    
    for i, v in pairs(details) do 
        if (type(v) == 'number') then
            break;
        end
        
        i = i + 1;
        self:CreateSinglePicItem(v, i, useSameSinglePicItemsKey)
    end
end

function ViewModel:CreateSinglePicItem(data, index, useSameSinglePicItemsKey)

    local subFix = ""

    if (useSameSinglePicItemsKey == false or useSameSinglePicItemsKey == "false") then
        subFix = ""..index..""
    end

    local label=data["label"..subFix]
    local jumpUrl=data["jumpUrl"..subFix]
    local text=data["text"..subFix]
    local count = 0
    if ( label == nil or label == '') then
        count = count +1
        label = ""
    end

    if ( jumpUrl == nil or jumpUrl == '') then
        count = count +1
        jumpUrl = ""
    end

    if ( text == nil or text == '') then
        count = count +1
        text = ""
    end
    
    local singlePicItem = {
        ["singlePicItem"] = {
            label=label,
            jumpUrl=jumpUrl,
            text=text,
        }
    }

    if (count == 3) then
        return 
    end

    utils.log('CreateSinglePicItem'..Net.TableToJSON(singlePicItem))
    local singlePicItemView = self:GenerateView("singlePicItem",singlePicItem)
    self.singlepicItemWrap:AddChild(singlePicItemView)
end


function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then 
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then 
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then 
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then 
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    self.bgTexture = self.view:GetTexture("bgColor")

    if (self.bgTexture ~= nil) then
        self.bgTexture:SetValue(bgColor)
    end

end


function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:GenerateView(template,data)
    local view = CreateView(template)
    if type(_G[template])=="table" then
        local model = _G[template].ViewModel:New(view)
        app.getViewModels()[view] = model
        model:Initialize(view)
        model:test(model)
    end
    
    if (System and System.GetOS and (System.GetOS() == 'Mac' or System.GetOS() == 'Windows')) then
        view.jsUIObject:SetMetadata(data)
        return view
    end
    view:SetMetadata(data)
    return view
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end

function ViewModel:prefix(url)
    if (url == '' or url == nil) then
        return ""
    end
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end
          _G['singlePic'] = {
            ViewModel = ViewModel
          }
        `;

  const code$1 = `
          ViewModel={}


function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    self.view = view
    self.multipicBanner = self.view:GetUIObject("multiPicBanner")
    self.multipicItemWrap = self.view:GetUIObject("multiPicItemWrap")
    self.multiPicBannerWrap = self.view:GetUIObject("multiPicBannerWrap")
    self.bgColorView = self.view:GetTexture("bgColor")
    self.multiText = self.view:GetUIObject("multiText")
    self.bannerText = self.view:GetUIObject("bannerText")
    self.hasSetMetaData = false

    utils.log("multiPic set banner: " ..tostring(self.bgColorView)..tostring(self.multipicItemWrap))
    
end

function ViewModel:OnResize(width,height)
    Console.Log('aaa OnResize multiPic', width,height)
    local resizeWidth, resizeHeight = self.view:GetSize()

    utils.log("multiPic OnResize: " ..resizeWidth)
    
    if (resizeWidth > 0) then
        self:setImage()
        self:setText()
    end
    
    local imgW, imgH = self.multipicBanner:GetSize()
    local itemW, itemH = self.multipicItemWrap:GetSize()

   local w,_ = self.view:GetSize()
   self.view:SetSize(w, itemW+itemH+32)
end

function ViewModel:OnClick(view)
    local oldurl = self.metaData['bannerUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end
    
    local url = self:prefix(oldurl)

    if (view == self.multiPicBannerWrap and url ~=nil) then
        utils.log("multiPic onclick: "..url)
        utils.loadUrl(url, self.view:GetRoot())
    end
end

function ViewModel:setImage()
    Console.Log('aaa setImage multiPic', self.metaData)
    local me = self
    if (self.metaData ~= nil and self.metaData["banner"] ~= nil) then
        local url = self.metaData["banner"]
        utils.SetImageValue(self.multipicBanner, url, url, function(success)
            utils.log("multiPic set banner: " ..tostring(success))
        end)
    end
    local resizeWidth, _ = self.view:GetSize()
    local picHeight = math.ceil(resizeWidth * (5 / 9))

    utils.log("multiPic setImage: " ..picHeight)
    self.multipicBanner:SetStyle("display:flex;width:"..resizeWidth..";height:"..picHeight)
end

function ViewModel:setText()
    local resizeWidth, _ = self.view:GetSize()
    local realWidth = resizeWidth - 32
    utils.log("multiPic setText: " ..realWidth)
    self.multiText:SetStyle("display:flex;width:"..realWidth..";height:auto;position:absolute;left:16;bottom:16;flexDirection:column")
end


function ViewModel:OnSetMetadata(value)
    utils.log("multiPic set meta: " .. Net.TableToJSON(value))
    self.metaData = value["multiPic"]
    self:UpdateValue(self.metaData)
    self:ApplyTheme()
end

function ViewModel:ApplyTheme()
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then 
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then 
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then 
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then 
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end

    local colorwhite = Appconfig[constant.THEME.COLOR_WHIHE]
    if (useDefault == false) then 
        colorwhite = theme.getThemeColorValue(constant.THEME.COLOR_WHIHE, Appconfig)
    end

    if (self.bgColorView ~=nil) then
        self.bgColorView:SetValue(bgColor)
    end

    utils.log("ViewModel ApplyTheme"..tostring(self.bgColorView)..colorwhite)

    if (self.bannerText ~=nil) then
        self.bannerText:SetTextColor(colorwhite)
    end

end

function ViewModel:OnConfigChange()
    self:ApplyTheme()
end

function ViewModel:UpdateValue(data)
    if (data["bannerText"] ~=nil) then
        self.bannerText:SetValue(data['bannerText']);
    end
    self:CreatemultiPic(data)
end

function ViewModel:CreatemultiPic(data)
    utils.log('CreatemultiPic')
    self.multipicItemWrap:ClearChildren()
    local details = data["multiPicItems"]
    local useSameMultiPicItemsKey = data["useSameMultiPicItemsKey"]
    for i, v in pairs(details) do 
        utils.log('CreatemultiPic'..i)
        
        if (type(v) == 'number') then
            break;
        end
        
        i = i + 1
        self:CreatemultiPicItem(v,i, useSameMultiPicItemsKey)
    end
end

function ViewModel:CreatemultiPicItem(data, index, useSameMultiPicItemsKey)

    local subFix = ""

    if (useSameMultiPicItemsKey == false or useSameMultiPicItemsKey == "false" ) then
        subFix = ""..index..""
    end

    local label=data["label"..subFix]
    local jumpUrl=data["jumpUrl"..subFix]
    local image=data["image"..subFix]
    local count = 0
    if ( label == nil or label == '') then
        count = count +1
        label = ""
    end

    if ( jumpUrl == nil or jumpUrl == '') then
        count = count +1
        jumpUrl = ""
    end

    if ( image == nil or image == '') then
        count = count +1
        image = ""
    end

    local multiPicItem ={
        ["multiPicItem"] = {
            label=label,
            jumpUrl=jumpUrl,
            image=image,
        }
    }
    utils.log('CreatemultiPicItem'..Net.TableToJSON(multiPicItem))

    if (count == 3) then
        return 
    end

    local multiPicItemView = self:GenerateView("multiPicItem",multiPicItem)
    self.multipicItemWrap:AddChild(multiPicItemView)
end

function ViewModel:GenerateView(template,data)
    local view = CreateView(template)
    if type(_G[template])=="table" then
        local model = _G[template].ViewModel:New(view)
        app.getViewModels()[view] = model
        model:Initialize(view)
        model:test(model)
    end
    
    if (System and System.GetOS and (System.GetOS() == 'Mac' or System.GetOS() == 'Windows')) then
        view.jsUIObject:SetMetadata(data)
        return view
    end
    view:SetMetadata(data)
    return view
end

function ViewModel:test(mode)
    local isModel = mode == self
    utils.log("ViewModel test  "..tostring(isModel))
end

function ViewModel:prefix(url)
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end
          _G['multiPic'] = {
            ViewModel = ViewModel
          }
        `;

  const code = `
          

ViewModel={}

function ViewModel:New(view)
	local obj = {}
    setmetatable(obj,self)
    self.__index=self
	return obj
end

function ViewModel:Initialize(view)
    utils.log("mail: Initialize")

    self.view = view

    self.titleView = view:GetUIObject('title')

    self.subTitleView = view:GetUIObject('subtitle')

    self.contentView = view:GetUIObject('content')

    self.attachView = view:GetUIObject('attachNumber')

    self.bgTexture = view:GetTexture('bgColor')

    self.seperator = view:GetUIObject('seperator')

    self.seperatorTexture = self.seperator:GetTexture('seperatorColor')

    self.leftTextView = view:GetUIObject('leftText')

    self.bottomView = view:GetUIObject('bottom')

    self.attachIcon = view:GetUIObject('attachIcon')

    self.hasSetMetaData = false

end

function ViewModel:UpdateStyle(width)
   Console.Log('aaa UpdateStyle', width, self.isUpdatingStyle)
   if self.isUpdatingStyle then
       utils.log("is updating style")
       return
   end
   self.isUpdatingStyle = true
   self:DoUpdateStyle(width)
   self.isUpdatingStyle = false
end

function ViewModel:DoUpdateStyle(width)
    Console.Log('aaa UpdateStyle DoUpdateStyle', width)
    local titleTextWidth, titleTextHeight = self.contentView:MeasureTextSize()

    local realTextHeight = titleTextHeight
    Console.Log('aaa UpdateStyle DoUpdateStyle titleTextHeight', titleTextHeight)
    if (titleTextHeight >= 40) then
        realTextHeight = 44
    end
    Console.Log('aaa UpdateStyle DoUpdateStyle realTextHeight', realTextHeight)
    if (realTextHeight > 20) then
        self.contentView:SetStyle("display: flex;width: 100%;height: "..realTextHeight..";marginBottom: 16")
    end

    self.contentView:SetEllipsis(true);
    self:ApplyTheme()
end

function ViewModel:OnResize(width, height)
    utils.log("mail: OnResize"..width..','..height)
    local IsInAIO = qqutil.IsInAIO(self.view)
    utils.log("mail: OnResize"..width)
    Console.Log('mail: hasSetMetadata IsInAIO', self.hasSetMetaData, IsInAIO)
    if not self.hasSetMetaData then
        if IsInAIO == true then
            self.width = uiutil.AdjustViewWidth(width)
        else
            self.width = width
        end
        return
    end
    self:UpdateStyle(self.width)
end

function ViewModel:OnClick(sender)

    utils.log("OnClick" .. tostring(sender == self.view)..tostring(sender == self.bottomView))

    
    
    

    local oldurl = self.metaData['mailUrl']

    if (oldurl ==nil or oldurl == '')then
        return
    end

    utils.log("%E5%BD%93%E5%89%8Ditemoldurl%EF%BC%9A" .. oldurl)

    local url = self:prefix(oldurl)
    local res = utils.loadUrl(url, self.view:GetRoot())
end

function ViewModel:OnSetMetadata(value)

    utils.log("mail: OnSetMetadata")
    self.hasSetMetaData = true
    self.metaData = value["mail"]

    local title = self.metaData["title"]
    if (title ~= nil) then
        self.titleView:SetValue(title)
    end

    local subTitle = self.metaData["subTitle"]
    if (subTitle ~= nil) then
        self.subTitleView:SetValue(subTitle)
    end

    local content = self.metaData["content"]
    if (content ~= nil) then
        self.contentView:SetValue(content)
    end


    local detailDesc = self.metaData["detailDesc"]
    if (detailDesc ~= nil) then
        self.leftTextView:SetValue(detailDesc)
    end

    local attach = self.metaData["attach"]
    local attachStr = ""
    if (attach ~= nil and attach ~= 0 and attach ~= '') then
        local attachType = type(attach)

        if (attachType == 'number') then
            attachStr = ""..attach.."%E4%B8%AA%E9%99%84%E4%BB%B6"
            else
                attachStr = attach
        end

        self.attachView:SetValue(attachStr)
    end

    if (attach == nil or attach == '' or attach ==0) then
        self.attachIcon:SetValue('')
        self.attachIcon:SetStyle('display:none')
    end

end

function ViewModel:ApplyTheme()
    Console.Log('aaa UpdateStyle ApplyTheme')
    local Appconfig = theme.getThemeColorConfig()
    local isDark = app.getDarkColorModel()
    local useDefault = false
    if (Appconfig == nil) then
        useDefault = true
        if (isDark == true) then
            Appconfig = constant.COLOR_SCHEME_DEFAULT_NIGHT
        else
            Appconfig = constant.COLOR_SCHEME_DEFAULT
        end
    end

    -- utils.log("ViewModel Appconfig"..Net.TableToJSON(Appconfig))

    local bgColor = Appconfig[constant.THEME.COLOR_BACKGROUND]
    if (useDefault == false) then
        bgColor = theme.getThemeColorValue(constant.THEME.COLOR_BACKGROUND, Appconfig)
    end

    local textPrimary = Appconfig[constant.THEME.COLOR_TITLE]
    if (useDefault == false) then
        textPrimary = theme.getThemeColorValue(constant.THEME.COLOR_TITLE, Appconfig)
    end

    local textSecondary = Appconfig[constant.THEME.COLOR_SUMMARY]
    if (useDefault == false) then
        textSecondary = theme.getThemeColorValue(constant.THEME.COLOR_SUMMARY, Appconfig)
    end


    local border = Appconfig[constant.THEME.COLOR_SEPERATOR]
    if (useDefault == false) then
        border = theme.getThemeColorValue(constant.THEME.COLOR_SEPERATOR, Appconfig)
    end


    local whitle = Appconfig[constant.THEME.COLOR_WHIHE]
    if (useDefault == false) then
        whitle = theme.getThemeColorValue(constant.THEME.COLOR_WHIHE, Appconfig)
    end

    local texTure = Appconfig[constant.THEME.COLOR_BORDER]
    if (useDefault == false) then
        texTure = theme.getThemeColorValue(constant.THEME.COLOR_BORDER, Appconfig)
    end


    if(self.bgTexture ~=nil) then
        self.bgTexture:SetValue(bgColor)
    end

    if(self.titleView ~=nil) then
        self.titleView:SetTextColor(textPrimary)
    end

    if(self.subTitleView ~=nil) then
        self.subTitleView:SetTextColor(textPrimary)
    end

    if(self.contentView ~=nil) then
        self.contentView:SetTextColor(textSecondary)
    end


    if(self.leftTextView ~=nil) then
        self.leftTextView:SetTextColor(textPrimary)
    end

    if(self.attachView ~=nil) then
        self.attachView:SetTextColor(textSecondary)
    end

    if(self.seperatorTexture ~=nil) then
        self.seperatorTexture:SetValue(border)
    end


    utils.log("ViewModel ApplyTheme  "..tostring(isDark).."   "..tostring(useDefault)..textPrimary)

end

function ViewModel:OnConfigChange(config)
    utils.log("contact: OnConfigChange appconfig="..Net.TableToJSON(config))
    self:ApplyTheme()
end

function ViewModel:prefix(url)
    if (url == '' or url == nil) then
        return ""
    end
    if string.find(url, "http:") == 1 or string.find(url, "https:") == 1 then
        return url
    end
    return "https://" .. url
end

          _G['mail'] = {
            ViewModel = ViewModel
          }
        `;

  async function luaRun() {
    if (WebArk && (!WebArk.LuaAdapter)) {
      throw new Error('[ArkRender] LuaAdapter not found');
    }
    let factory = await WebArk.LuaAdapter.getLuaFactory();
    if (!factory) {
      factory = new wasmoon.LuaFactory();
    }
    const lua = await factory.createEngine();
    Object.keys(arkWeb__namespace).forEach((key) => {
      // console.warn('aaa WebArk key', key)
      ArkWindow[key] = WebArk[key];
      if (key === 'Net') {
          ArkWindow[key] = Net;
      }
      if (key === 'QQ') {
        ArkWindow[key] = QQ;
      }
      if (key === 'UI') {
        ArkWindow[key] = UI;
        lua.global.set("jsProxyUI", UI);
      } else {
        lua.global.set(key, ArkWindow[key]);
      }
    });
    lua.global.set('ArkWindow', ArkWindow);
    lua.global.set('JSCreateView', (view) => {
        view = view.split('.')[0];
        const newView = CreateView(view);
        return newView;
    });
    const luaUIObjectInject = `
  LuaJSView2LuaViewMap = {

  }

  LuaUIObject = {
  }
  function LuaUIObject:SetID(id)
    Console.Log('aaa lua proxy SetID', id)
    return self.jsUIObject.SetID(id);
  end
  function LuaUIObject:New(jsUIObject)
    -- TODO: delete jsuiobject
    Console.Log('aaa LuaUIObject:New', LuaJSView2LuaViewMap[jsUIObject.hashId], jsUIObject)
    if LuaJSView2LuaViewMap[jsUIObject.hashId] then
      return LuaJSView2LuaViewMap[jsUIObject.hashId]
    end
    local model = {}
    setmetatable(model, self)
    self.__index = self
    model.jsUIObject = jsUIObject
    LuaJSView2LuaViewMap[jsUIObject.hashId] = model
    return model
  end

  -- Pos Start
  function LuaUIObject:SetPos(x, y)
    return self.jsUIObject.SetPos(x, y)
  end
  function LuaUIObject:GetPos()
    local pos = self.jsUIObject.GetPos()
    return pos.x, pos.y
  end

  -- Pos End

  function CreateLinearGradient(x1, y1, x2, y2)
    return self.jsUIObject.CreateLinearGradient(x1, y1, x2, y2);
  end

  function SetFillStyle(gradient)
    return self.jsUIObject.SetFillStyle(gradient);
  end

  function Fill()
    return self.jsUIObject.Fill();
  end

  function Rectangle(left, top, w, h)
    return self.jsUIObject.Rectangle(left, top, w, h);
  end

  function LuaUIObject:GetID()
    return self.jsUIObject.GetID();
  end

  function LuaUIObject:SetID(id)
    return self.jsUIObject.SetID(id);
  end

  function LuaUIObject:GetSize()
    local size = self.jsUIObject.GetSize();
    return size.width, size.height
  end

  function LuaUIObject:SetSize(width,height)
    return self.jsUIObject.SetSize(width,height);
  end

  function LuaUIObject:SetAutoSize(autoSize)
    return self.jsUIObject.SetAutoSize(autoSize);
  end

  function LuaUIObject:SetRadius(left, top, right, bottom)
    return self.jsUIObject.SetRadius(left, top, right, bottom);
  end

  function LuaUIObject:GetRadius()
    local radius = self.jsUIObject.SetRadius();
    return radius.left, radius.top, radius.right, radius.bottom;
  end

  function LuaUIObject:GetUIObject(id)
    local jsView = self.jsUIObject.GetUIObject(id)
    Console.Log('[ArkBuilder] LuaUIObject:GetUIObject jsView type:'..type(jsView))
    if type(jsView) == 'nil' then
      return nil
    end
    if jsView and LuaJSView2LuaViewMap[jsView.hashId] then
        Console.Log('[ArkBuilder] LuaUIObject:GetUIObject jsView cache:',LuaJSView2LuaViewMap[jsView.hashId])
      return LuaJSView2LuaViewMap[jsView.hashId]
    end
    return LuaUIObject:New(jsView)
  end

  function LuaUIObject:GetTexture(textureName)
    return self.jsUIObject.GetTexture(textureName);
  end

  function LuaUIObject:HitTest(x, y)
    return self.jsUIObject.HitTest(x, y);
  end

  function LuaUIObject:GetLayered()
    return self.jsUIObject.GetLayered();
  end

  function LuaUIObject:SetLayered()
    return self.jsUIObject.SetLayered();
  end

  function LuaUIObject:GetController()
    return self.jsUIObject.GetController();
  end


  function LuaUIObject:GetTemplate()
    return self.jsUIObject.GetTemplate()
  end

  function LuaUIObject:GetRoot()
    local rootView = self.jsUIObject.GetRoot();
    if rootView and LuaJSView2LuaViewMap[rootView.hashId] then
      return LuaJSView2LuaViewMap[rootView.hashId]
    end
    return LuaUIObject:New(rootView)
  end

  function LuaUIObject:GetParent()
    Console.Log('[ArkBuilder] LuaUIObject:GetParent start')
    if self.jsUIObject then
      local parentView = self.jsUIObject.GetParent()
      Console.Log('[ArkBuilder] LuaUIObject:GetParent ing:', parentView)
      if parentView and LuaJSView2LuaViewMap[parentView.hashId] then
        return LuaJSView2LuaViewMap[parentView.hashId]
      else
        return LuaJSView2LuaViewMap[self.jsUIObject.hashId]
      end
    end
  end

  function LuaUIObject:MeasureTextSize()
    Console.Log('aaa MeasureTextSize start'..type(self.jsUIObject))
    if self.jsUIObject and self.jsUIObject.MeasureTextSize then
      local size = self.jsUIObject.MeasureTextSize();
      return size.width, size.height
    end
    Console.Warn('[ArkBuilder] warn LuaUIObject MeasureTextSize is nil')
    return 0, 0
  end

  function LuaUIObject:AddChild(view)
    Console.Log('aaa Lua AddChild', view)
    return self.jsUIObject.AddChild(view)
  end

  function LuaUIObject:InsertChild(pos, child)
    return self.jsUIObject.InsertChild(pos, child)
  end

  function LuaUIObject:DeleteChild(view)
    Console.Log('aaa DeleteChild view', view)
    return self.jsUIObject.DeleteChild(view.jsUIObject)
  end

  function LuaUIObject:DeleteChild(view)
    Console.Log('aaa Lua DeleteChild', view)
    return self.jsUIObject.DeleteChild(view)
  end

  function LuaUIObject:SetAnchors(anchors, update)
    return self.jsUIObject.SetAnchors(anchors, update)
  end

  -- Margin Start
  function LuaUIObject:SetMargin(top, right, bottom, left)
    return self.jsUIObject.SetMargin(top, right, bottom, left)
  end

  function LuaUIObject:GetMargin()
    local margin = self.jsUIObject.GetMargin()
    return margin.left, margin.top, margin.right, margin.bottom
  end

  -- Margin End

  function LuaUIObject:AttachEvent(event, fn)
    return self.jsUIObject.AttachEvent(event,fn)
  end

  function LuaUIObject:SetVisible(visible)
    return self.jsUIObject.SetVisible(visible)
  end

  function LuaUIObject:GetVisible()
    return self.jsUIObject.GetVisible()
  end

  function LuaUIObject:SetRootSize(view, width, height)
    if LuaJSView2LuaViewMap[view.hashId] then
      return self.jsUIObject.SetRootSize(LuaJSView2LuaViewMap[view.hashId], width, height)
    end
  end

  function LuaUIObject:SetValue(value)
    return self.jsUIObject.SetValue(value, true)
  end

  function LuaUIObject:GetValue()
    return self.jsUIObject.GetValue()
  end

  function LuaUIObject:GetMetadata()
    return self.jsUIObject.GetMetadata()
  end

  function LuaUIObject:GetFont()
    return self.jsUIObject.GetFont()
  end

  function LuaUIObject:GetMetadataType()
    return self.jsUIObject.GetMetadataType();
  end

  function LuaUIObject:GetFloating()
    return self.jsUIObject.GetFloating()
  end

  function LuaUIObject:GetFloating()
    return self.jsUIObject.GetFloating()
  end

  function LuaUIObject:GetRelativePos()
    return self.jsUIObject.GetRelativePos()
  end

  function LuaUIObject:SetFont(value)
    Console.Log('aaa LuaUIObject:SetFont')
    return self.jsUIObject.SetFont(value)
  end

  function LuaUIObject:GetLineHeight()
    return self.jsUIObject.GetLineHeight()
  end

  function LuaUIObject:SetLineHeight(height)
    return self.jsUIObject.SetLineHeight(height)
  end

  function LuaUIObject:SetMaxline(value)
    return self.jsUIObject.SetMaxline(value)
  end

  function LuaUIObject:LockUpdate()
    return self.jsUIObject.LockUpdate()
  end

  function LuaUIObject:UnlockUpdate()
    return self.jsUIObject.UnlockUpdate()
  end

  function LuaUIObject:Update()
    return self.jsUIObject.Update()
  end

  function LuaUIObject:ClearChildren()
    return self.jsUIObject.ClearChildren()
  end

  function LuaUIObject:SetRect(left, top, right, bottom)
    return self.jsUIObject.SetRect(left, top, right, bottom)
  end

  function LuaUIObject:SetStretch(stretch)
    return self.jsUIObject.SetStretch(stretch)
  end

  function LuaUIObject:GetType()
    return self.jsUIObject.GetType()
  end

  function LuaUIObject:GetChild()
    return self.jsUIObject.GetChild()
  end

  function LuaUIObject:GetFirstChild()
    return self.jsUIObject.GetFirstChild()
  end

  function LuaUIObject:GetLastChild()
    return self.jsUIObject.GetLastChild()
  end

  function LuaUIObject:GetNextChild()
    return self.jsUIObject.GetNextChild()
  end

  function LuaUIObject:GetPrevChild()
    return self.jsUIObject.GetPrevChild()
  end

  function LuaUIObject:SetMode(mode)
    return self.jsUIObject.SetMode(mode)
  end

  function LuaUIObject:GetMode()
    return self.jsUIObject.GetMode()
  end

  function LuaUIObject:SetTextColor(color)
    return self.jsUIObject.SetTextColor(color)
  end

  function LuaUIObject:SetEllipsis(value)
    return self.jsUIObject.SetEllipsis(value)
  end

  function LuaUIObject:SetAlign(value)
    return self.jsUIObject.SetAlign(value)
  end

  function LuaUIObject:IsType(type)
    return self.jsUIObject.IsType(type)
  end

  function LuaUIObject:GetStyle()
    return self.jsUIObject.GetStyle()
  end

  function LuaUIObject:SetStyle(style)
    return self.jsUIObject.SetStyle(style)
  end

  function LuaUIObject:SetMultiline(isMultiline)
    return self.jsUIObject.SetMultiline(isMultiline)
  end

  function LuaUIObject:DetachEvent(event)
    return self.jsUIObject.DetachEvent(event)
  end

  function LuaUIObject:GetRect()
    local rect = self.jsUIObject.GetRect()
    return rect.left, rect.top, rect.right, rect.bottom
  end

  -- canvas Start
  function LuaUIObject:ClearRect(x,y,width,height)
    return self.jsUIObject.ClearRect(x,y,width,height)
  end

  function LuaUIObject:Save()
    return self.jsUIObject.Save()
  end

  function LuaUIObject:DrawImage(image, left, top, iconWidth, iconHeight)
    return self.jsUIObject.DrawImage(image, left, top, iconWidth, iconHeight)
  end

  function LuaUIObject:SetDrawStyle(color)
    return self.jsUIObject.SetDrawStyle(color)
  end

  function LuaUIObject:DrawCircle(x, y, length)
    return self.jsUIObject.DrawCircle(x, y, length)
  end

  function LuaUIObject:Restore()
    return self.jsUIObject.Restore()
  end
  -- Canvas End

  -- UI start
  UI = {
  }

  function UI:View()
    local jsProxyObj = jsProxyUI.View()
    local model = LuaUIObject:New(jsProxyObj)
    return model
  end
  function UI:Text()
    Console.Log('UI:Text start')
    local jsProxyObj = jsProxyUI.Text()
    Console.Log('UI:Text jsProxyObj', jsProxyObj)
    local model = LuaUIObject:New(jsProxyObj)
    Console.Log('UI:Text model', model)
    return model
  end

  function UI:Image()
    local jsProxyObj = jsProxyUI.Image()
    local model = LuaUIObject:New(jsProxyObj)
    return model
  end
  function UI:Canvas()
    local jsProxyObj = jsProxyUI.Canvas()
    local model = LuaUIObject:New(jsProxyObj)
    return model
  end
  function UI:Video()
    local jsProxyObj = jsProxyUI.Video()
    local model = LuaUIObject:New(jsProxyObj)
    return model
  end
  -- UI end
  `;
    let finalCode = '';
    const moduleIdList = [];
    
        

















            finalCode = finalCode + code$f;
            moduleIdList.push('touch');
          

            finalCode = finalCode + code$e;
            moduleIdList.push('utils');
          

            finalCode = finalCode + code$d;
            moduleIdList.push('constant');
          

            finalCode = finalCode + code$c;
            moduleIdList.push('theme');
          

            finalCode = finalCode + code$b;
            moduleIdList.push('qqutil');
          

            finalCode = finalCode + code$a;
            moduleIdList.push('picutil');
          

            finalCode = finalCode + code$9;
            moduleIdList.push('uiutil');
          

            finalCode = finalCode + code$8;
            moduleIdList.push('app');
          

            finalCode = finalCode + code$7;
            moduleIdList.push('operationItem');
          

            finalCode = finalCode + code$6;
            moduleIdList.push('detailItem');
          

            finalCode = finalCode + code$5;
            moduleIdList.push('singlePicItem');
          

            finalCode = finalCode + code$4;
            moduleIdList.push('multiPicItem');
          

            finalCode = finalCode + code$3;
            moduleIdList.push('plainText');
          

            finalCode = finalCode + code$2;
            moduleIdList.push('singlePic');
          

            finalCode = finalCode + code$1;
            moduleIdList.push('multiPic');
          

            finalCode = finalCode + code;
            moduleIdList.push('mail');
          
        const applicationViewEvents = {};
          applicationViewEvents['operationItem'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['detailItem'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }];
        
          applicationViewEvents['singlePicItem'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['multiPicItem'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['plainText'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['singlePic'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['multiPic'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
          applicationViewEvents['mail'] = [{
      "eventName": "OnResize",
      "callback": "app.OnResize"
  }, {
      "eventName": "OnSetValue",
      "callback": "app.OnSetMetadata"
  }, {
      "eventName": "OnClick",
      "callback": "app.OnClick"
  }];
        
        
    /** 注入app的注册事件 */
    applicationViewEvents['app'] = [{"eventName":"OnCreateView","callback":"app.OnCreateView"},{"eventName":"OnExit","callback":"app.OnExit"},{"eventName":"OnStartup","callback":"app.OnStartup"},{"eventName":"OnConfigChange","callback":"app.OnConfigChange"}];
    /**
     * getSupportProxyEventNameTemplates
     * @params eventName 事件名称
     * @params host 事件宿主
     * */
    const getSupportProxyEventNameTemplates = (eventName, host, callbackName) => {
      host = host || '_ENV._G';
      callbackName = callbackName || 'OnSetMetadata';
      const supportProxyEventNameTemplates = {
        OnSetValue: `
        function (sender, value)
          if type(value) ~= 'table' and type(value) ~= 'userdata' then
            Console.Log('LuaBridge: ${callbackName} value is not table')
            return
          end
          local luaView = LuaJSView2LuaViewMap[sender.hashId]
          if type(luaView) == 'nil' then
            luaView = LuaUIObject:New(sender)
          end
          local tableValue = {}
          Console.Log('LuaBridge:${callbackName} value', value)
          for k, v in pairs(value) do
            tableValue[k] = v
          end
          Console.Log('LuaBridge:${callbackName} jsonToTable', tableValue)
          ${host}['${callbackName}'](luaView, tableValue)
        end
      `,
        OnCreateView: `
        function (view, template)
          local luaView = LuaUIObject:New(view)
          ${host}['OnCreateView'](luaView, template)
        end
      `,
        OnConfigChange: `
      function (config)
        Console.Log('LuaBridge:OnConfigChange start config:', config)
        ${host}['${callbackName}'](config)
      end
      `,
        OnStartup: `
      function (config)
        Console.Log('LuaBridge:OnStartup start config:', config)
        ${host}['${callbackName}'](config)
      end
      `,
        OnActivate: `
      function (view, active)
        Console.Log('LuaBridge:OnActivate start view, active:', view, active)
        local luaView = LuaUIObject:New(view)
        ${host}['${callbackName}'](luaView, active)
      end
      `,
        OnClick: `
        function (sender)
          local luaView = LuaJSView2LuaViewMap[sender.hashId]
          if type(luaView) == 'nil' then
            luaView = LuaUIObject:New(sender)
          end
          Console.Log('LuaBridge:${callbackName} ${host} ${callbackName}')
          ${host}['${callbackName}'](luaView)
        end
      `,
        OnDestroyView: `
        function (view)
          local luaView = LuaUIObject:New(view)
          ${host}['${callbackName}'](luaView, template)
        end
      `,
        OnExit: `
        function ()
        ${host}['OnExit']()
        end
      `,
        OnResize: `
        function (sender, srcWidth, srcHeight, dstWidth, dstHeight)
          Console.Log('lua inject', sender, srcWidth, srcHeight, dstWidth, dstHeight)
          local luaView = LuaJSView2LuaViewMap[sender.hashId]
          if type(luaView) == 'nil' then
            luaView = LuaUIObject:New(sender)
          end
          ${host}['${callbackName}'](luaView, srcWidth, srcHeight, dstWidth, dstHeight)
        end
      `,
        // 'OnTouchStart',
        // 'OnTouchEnd',
        // 'OnTouchEnd',
      };
      return supportProxyEventNameTemplates[eventName];
    };
    // luaBridge对象构造
    const luaBridgeTemp = {};
    // luaBridge函数对象映射
    const luaBridgeFunctionMap = {};

    /**
     *
     * 替换对应Lua函数代码
     * @param {*} luaBridgeFunctionMap
     * @return {*}
     */
    const generateLuaBridgeInjectCode = (luaBridgeFunctionMap) => {
      const luaBridgeFunctionMapStr = JSON.stringify(luaBridgeFunctionMap);
        return luaBridgeFunctionMapStr.replace(/\"(\w)*\"(:|=)/g, (a) => {
          return a.replace(/\"/g, "").replace(/:/g, '=');
        }).replace(/\"|\\n/g, "");
    };
    /**
     * 将字符串数组转成深度对象
     * @params curObj 当前操作对象
     * @params eventCasts剩余数组
     */
    const listToDeepObj = function (curObj, eventCasts) {
      if (!eventCasts || eventCasts.length === 0) {
        return;
      }
      if (eventCasts.length === 1) {
        curObj[eventCasts[0]] = `__${eventCasts[0]}__`;
        return;
      }
      const cast = eventCasts.shift();
      curObj[cast] = {};
      listToDeepObj(curObj[cast], eventCasts);
    };
    Object.keys(applicationViewEvents).forEach((key) => {
      const viewEvents = applicationViewEvents[key];
      viewEvents && viewEvents.forEach((viewEvent) => {
        const { eventName, callback } = viewEvent;
        if (!getSupportProxyEventNameTemplates(eventName)) {
          return;
        }
        const eventCasts = callback.split('.');
        let tempHost = '';
        if (eventCasts.length < 2) {
          tempHost = '';
        }
        if (eventCasts.length === 2 && eventCasts[0] != 'app') {
          tempHost = eventCasts[0];
        }
        if (eventCasts.length > 2) {
          tempHost = eventCasts.slice(1,eventCasts.length-1).join('.');
        }
        const eventTemplate = getSupportProxyEventNameTemplates(eventName, tempHost, eventCasts[eventCasts.length-1]);
        const lastIdx = eventCasts.length - 1;
        const viewKey = tempHost || 'app';
        if (!luaBridgeFunctionMap[viewKey]) {
          luaBridgeFunctionMap[viewKey] = {};
        }
        luaBridgeFunctionMap[viewKey][eventCasts[lastIdx]] = eventTemplate;
        /**
         * {app: {OnSetMetaData: function}}
         */
        const bridgeItemKey = eventCasts.shift();
        if(!luaBridgeTemp[bridgeItemKey]) {
          luaBridgeTemp[bridgeItemKey] = {};
        }
        const eventCastObj = {};
        listToDeepObj(eventCastObj, eventCasts);
        Object.keys(eventCastObj).forEach((key)=>{
          luaBridgeTemp[bridgeItemKey][key] = eventCastObj[key];
        });
      });
    });
    const luaBridgeInject =  `
    LuaBridge = ${generateLuaBridgeInjectCode(luaBridgeFunctionMap)}
    _ENV._G['LuaBridge'] = LuaBridge
    _ENV._G['CreateView'] = function(id)
      Console.Log('[ArkBuilder] Lua Bridge _G CreateView start id:'..id)
      local jsView = JSCreateView(id)
      Console.Log('[ArkBuilder] Lua Bridge _G CreateView:'..jsView.id)
      local luaView = LuaUIObject:New(jsView)
      return luaView
    end
  `;
    finalCode = `
    ${luaUIObjectInject}
    ${luaBridgeInject}
    ${finalCode}
  `;
    try {
      await lua.doString(finalCode);
    } catch(e) {
      console.error('doString error', e);
    }
   
    // 将app以及app内部字段依赖注入lua全局
    const luaGlobalWith = lua.global.get('_G');
    ArkWindow.app = luaGlobalWith['app'];
    // 注入其他依赖Lua模块
    moduleIdList.forEach((moduleId) =>{
      ArkWindow[moduleId] = luaGlobalWith[moduleId];
    });
    // 覆盖需要代理的类型
    const luaBridgeApi = luaGlobalWith['LuaBridge'];
    ArkWindow['LuaBridge'] = luaBridgeApi;
    if (ArkWindow.app && luaBridgeApi) {
      Object.keys(luaBridgeApi).forEach((key) => {
        ArkWindow.app[key] = luaBridgeApi[key];
      });
    }
    // 覆盖需要代理的函数
    ArkWindow.app.getExtendObject = ArkWindow.getExtendObject;

    return lua;
  }

  const uniqueApplicationId = (function() {
     function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
     }
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
   })();

   /**
    * 有很多地方会用到这里数据.所以这里最好还是挂载到app上.
    * @returns
    * @update 2022-07-30 22:47:10
    * @author alawnxu
    * @description 这里之前挂载app上.不过后面发现不可行.因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
    */
    ArkWindow.getExtendObject = function () {
     var appKey = 'ab573dbed181b9c0e57b6215b95375b6';


     return {
       appid: 'com.tencent.template.public',
       appKey,
       images: [{"name":"res/image/2.jpeg","url":"https://ark-release-1251316161.file.myqcloud.com/com.tencent.template.public/res/image/2.jpeg"},{"name":"res/image/arrow-right.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGjSURBVHgB7dqxaoNQFMbxGwXpmEcQEec8QrM6iGO3vlofwUnolI4d21WHrh19AbH3AwOF2i65555Pen5QmsTp+0NMuMQ5Y4wxxph/KnWC2rbNi6LIx3H8dKQSJwTj53m+pGl6qev65EgdnIDreP8wX1+a/PNz3/dvjkzwABvjrygjBH8L+JGt+zkejoxvh+A3wWEYXquqOnj3G5fvkiR5KMvymeXGKPIp4CO87CWC2MfgXiKIfg/YQwTRAMAeQTwAMEeIEgBYI0QLAIwRogYAtgjRAwBTBJUAwBJBLQAwRFANANoR1AOAZgSKAKAVgSYAaESgCgCxI9AFgJgRxE6Fb+VHfvx1PcsyF4LIqfCtmqZ5XJbl6ZfLkz9bPHddF+RwlS5AzPFAFSD2eKAJoDEeKAJojQf1AJrjQTWA9nhQC8AwHlQCsIyH6AGYxkPUAGzjIVoAxvEQJQDreBAPwDweRAOwjwexAHsYDyIB9jIeggfY03gIfiTmj7Le/b9p4xLdeJD6oeRp/a3gcX2JcjyI3QS/RXCs48UhAv6cMcYYY4zh8wWgRYgP9ek0dAAAAABJRU5ErkJggg=="},{"name":"res/image/attach.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWqSURBVHgB7Z1bchpHFIaPhC7oKWQFGa0gygqMVxBpBYQXUZQenKzAsALsB5UKSVWgFYSsQGQFwivwZAXBb+ie87uaFGV3D3Pp6ZkezldFYfdcLP1/307fTCQIgiAIgiAIgiAIgiAIghO2qKKMRqPGYrFo1Ov1ebvdnlNJqYwBFxcXzZ2dnTevr69N/hxxUmP1+tbW1oy/Zs/PzzfdbndKJcF7AyB8rVZ7D+ETPBbyp9fpdG6oYLw1gIUPWPhRQuG/JXx5eXnLJSKkgtgmDzk/Pz/a3t6+zSg+CPg9n4fD4e9UEN4ZAPG5rr/lPwZkj8HV1dV7KgCvqqAV8Rtx7ucSEnLj24h7P3PC7cKEHOKNATHFR52OhnW8Wq+jveCvJlc3yOVBxPNzfv4Xl22CFwbEEZ9z+8f9/f3euj4/m/EbGzGIeNeES8EJOaL0BsQRn3Ntm3PtmGKCEoFGnAylQfWMpuSAUjfCeYgPUMU8PT0Zczm3G8fkiNIakJf4S87Ozmb8fF93jQ1okSNKaUDe4i/hcaIPhkuNy8vLI3JA6QxwJT5Ag825faq7ZiHIi0WpDHAp/hIenPtbl84GBOSA0hhQhPiKUJfIvaQfyAE7VAJsiI937O7ujjhHnyQJpDinx42Sc6HwEmBLfLwD8wDo36vINxZ8v/ZeNvIfckChBtgUf+UdQRIT+N6fdencON+RAwozICfxl8QyAddNvR1+vrolIGfxl8CEdX35niE9PD09nZEDnBvgSPyv74gaWuZA6x0bpI14TbFBHjg1wKX4Ue+4vr5ucdVjioLRAPfJEc4MKJP4LPA44vm+y/kAJwb4Ij4TRowP5ULuBngkPmbD3rpexJWrAT6Jz/MDhSxPyW1GzDfxMT9ABZCLASJ+fKwbIOInw6oBIn5yrBkg4qfDSi8Ig1os3J9UAfGxr4AcYsWAWq0G8QPTdV/ExzseHh7ukswnZCWzARjUUhsitPgkvnpHkHRSJwuZ2oAYK8x8E3+V0MXegawloEdm8fseiw+clITUBqCx4h/wjeHyjIXrmZ71QPwlDf45cm2UUxuwWCyOyZz7jesuPRLfSXc1tQGc+3/VpfNs0thUb4r435NlXVBTl4htoLp01WBnihWqJj5IVQKwNZT0Qs4j1tX3KEOsUEXxQSoDOCdrczHHA9ofXOX+FhnYVPFBKgNYMFPg9Un7j0QsD9lk8UEqA9TOQ116qEs3GaYa7DEZqLr4IJUBpgWtLPTc8EigSzQtDQebID5wsiqCc/rckK4tGZsiPkhrQGhID3SJXDK092Mv1reh/iaJD9LGAaEukYelf9Kls9AT/hpoLmE445ZHVKeqOmryt7G3RBUTH1gtAdw2HOvSERlHrLfECmVsnh5FdVWpguKDVAbU63XTL9BQQdp3PD4+/kHpqaT4IJUBUbsLTZuc1S+exoTKig9S94L4F/pLl46G1TSv2ul0Ppg2RxuotPggtQEHBwdjw6UGVzcD03OYJ2ATDrnen5IZlLDx3t7eYZXFB1mnJMcRDefas3eWx8ioeADbQr9gPInbmMm6RbJVEB/YmBP+bLic29k7VREfZIqEIS7O6TFcbuQxp1ol8UHmoQgckkQRkTGbcDccDltkAZzrViXxgZWliXGmGtGoYu9Vmiop5tmg3okPrK0NVUeBjdbdp4y46cY4kSrBoaxeig+sro5mwXrqYLw4hPzBoUmf2JR/WeQv/I2e0CF2r+uOHzbgrfjA+v4AdQjqgNzw9egxX8UHueyQWbdk0QYI5PjT7hZ47LANctsjhuGI+/v7Hlcr78guCND6GNagCpD7sZUqDuitGWqOAwK7j9jHW+b/DyApzs4NXRl2aPGnGfOxuVrqMuF446ZKwi8p5OBW9b9bHLER6O38yN//z6Tx33FMDJaGz3xuXAVBEARBEARBEARBEARBEARBEJb8BxZV5BeWykIwAAAAAElFTkSuQmCC"},{"name":"res/image/icon-error.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAU+SURBVHgB7Z1tbttGEIZf0mwrqw3gniC6QdgTVPlvo84Jmp7A8Qlin8DuCeqeoDLs/i57gjA3cE4QA0lsOZG4mdmISZAo2g8uPyTOAwgyjIVAzsuZ2c8hIAiCIAiCIAhC34jQYdR+unMzxzgqMNqK8aBQGIE/TLT4LtsC1zFwpb8jXFHbF/TvbJAgjyb5NTpKpwT4aHClP799aWT/H8YVYmQFcD7cQtYlQTohwO1uOqYLOSAD8fcO6ibCGYvx40U+Qcu0JgA/7dMZDihkPGnE6EsvQnvGMcgrtif5FVqgcQE6YfgvISEob5z9cJkfo2EaFeB2L32MAk+DxfbQLDxi+yI/Q0M0IsDtfjrCDH/Rn2OsAWSUiUpw2ERYilEz0930QM3wDGtifIbC435E16w9tmZq8wCO9XdzPFUKT7DGqAinw4v8EDVRiwAccuipn9CPP8AGQPeRU0h6VEdICi6Ajvfv8F9nE60vnKC/w8PQIgQVYGONX1KDCMEE2HjjlwQWIYgAvTF+SUARgnRDOeH2xvgM3St1U/9R47TySL6yANO99GRTejsu0Fghvb1Ho/qKVApBeqCi9Ai3t9A453D4b34KT7wFWPT1n3VmQq0l6P6vaYzwi28+SOAJxcATtGD87ct85UNDawsKDaLYBh/muR7CA68cwKGH50sglIx95438knBRPflsHGQTn16RswB3u2l35/PbhGwy/cl94tFJAE68hcJjCEvhdW1XL3DzgDnN6cvT/004Ibt6gZsAEvuNsBe4tLcW4M1eui9Pvxn2At5mY9vexQOk22mJixdYCfCSlhdjhd8h2DK2TcZWAnw/X58F9S7AYejmnp3NbEOQhB9HeH+rTTsrAeICv0JwQm8utsAoAMd/6f14QDazyQNGAQYzpBC8sMkDNiFoDMELPlhiamMWQMKPN3yqx9TGKAAlk/sQvChUAA8oer7kWIkQAhAjCLVhDkHiAf5EYTxAqBERoGVEgJYxC8AbUQUveNOWqY14QI0UFg+vuRcUiQf4Qrar7gEq0kUvBA/iKIAHqAI5BC8WFVtWYhYglhBUgczUwCjA2y3zjwjLGbw2Rw+jAD9zbR3pirpDNosyc10iq/MBlIjPXXd81UXT+/99iWO7yGE1DiABMghOzIBzm3ZWAnAeUBajOuETw1cBPYDzAPVp/4dgBRd/son/jPUZMaXAJwGt9rrUSdfOiC3DNvww1nNBdOMShmyg3o9LMUCnyTh69P6EsBouAujU3IFpglPxghXweMlx4OokACdj8YIVRPjb9cC283oAe4GMjJdANqE8eQRHnAXQUxOOca4XeNrEa0WM62pGkNFxCZe59K016l0rQiX4o41iHV2bC9KdkgTeVRW914Q52dCIr/ehiJYdKxV4rbQoP7jIuVva214R33vVMseVd0XcJTiiC+ndsiXd8/PhZV65KG1lAfTYIMGjXnVNebElCXNwUcpWutLFspUlUrjVnaACMFK62I3gWxP1BdKFblJi5oRbh/GZ4B7wOTe76WlXFvN90V1N6unV9ealWgVgdIE/hZN1O2mjR7gKx1VqgtpQuwAM54VoTmsJqv0lTRt4nounWpp4hUkjApTIS3y+plEBSmhC7Qhcf6gjQnC44YWmAa11NP2WvVYEYHR3lesQtegRbRq+pDUBPofr0cVck6iBqlyLl35mundzmWdomU4IUFK+zFOLwTWKAr7Mk6aNz+cRMnmZpwOL1x5yuZwxrT3cVx+O/u8UwOirbu1iMpCPVPFnXuA5n23omsEFQRAEQRAEQRDeA1348XbiCRIZAAAAAElFTkSuQmCC"},{"name":"res/image/icon-warning.png","url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASsSURBVHgB7Z3fUdwwEMY/wfF+HUAHCRXEPGYmkKMCkgouVBCoIFBBSAWQpACcCoAOjg54zwVlJdsJIQdeyZKlO+9vJmNn8Nz59vP+kWSvAUEQBEEQBEEQhoZCxuhzjDFCQWe5Rf99AU3bah92/1/u6N/MbhVtNW5pv8Qc12rf/i1LshLgj8Fhjf52gZH9UFaYkj7vKwlS5iRIFgLo79boU8Bux4iNwpkRQ+3iAolJJkB9tRujf0AfRl+E8Yx7HGODvOK19ZIEp9AzWRj+MVXOOCOPOEbP9CqA/oZ3WMPHYLE9NLVHqD0KUb19ZQ/QVb9FV/1nVDF+Gbig8z3sIyytITKUYKf0Y66wPMY3TKhaurIeG5loHmBj/TqFG2Vj/fKicUIh6RCRiCKADTnr5MaKBk+rwTV58X6MkBRcAGv8DVxmm2h9MQl6HTuhRQgqwMoavyGCCMEEWHnjNwQWIYgAgzF+Q0ARwpShJuEOxfgG81vnOLeVXkc6C0C18qcVqnZceGnL7I50CkF2oKLsCHe4aBox7+EEnngLUE8vmBFuHhNq6bgjO2z75oMRfBlR6ElgfJqxfPaioakPjX4ZUz4wUWAHHnjlgHqOZAKhofCdN/JLwmvdk8/KQTbxqYqcBSAXz3c+PyXa5kTniUcnAWziVfGnaJeYqasXuHnAOs3py9X/HGNXL3ATQGI/h6nLwWwBKPZP5OpnMa5vs2Hh4gFSdvJhewFLgDqxHEDgUnCTMc8DRku1oJ4DY67NuCFIwo87BecgngAKryC4YW4uZtAqgI1lUv24Qzbj5IF2DxjRwoPgByMPcEJQAcEP1R45OAJsQfCldamWI8AmBD90CA9Qg19y9CdICJIKKCqcECQe4IsOk4SFiIgAiREBEsOpgmYQfGl9IFw8IC6ztgM4ZegMgi9BPOAWgh8qhAcoXEPwQ7dfvBKC4lK2HdAuwLz9Q4QnmLdHj1YBbG8dKUXdIZtx+hLxng8wjY4c7/iKRYL7/30pOQdxxwElBDeqi7YVngBVHsi271qWzAN6QJ0HfkDgoXDG7UvHf0ZM2ycBWfe6xCTDZ8QWnAQv/BjYc0H0w0tIGGrHVD8OzQBdJ+NOITzPvVvfOTcB5jYMiRc8hRkvbbhVjE4C1IlFvOApNL64PrDtvh5gvEBGxv9Txf4jOOIsgPWC+/77a2aPp028VsTqvpolhIYL316j0qyjO52adXivCVMompF8Eop0twavnRbl1Rtblg65Kjrt2ua4c8+4uhn3JTCwBzk0bsj4nX9z59tSbFU0x/6gStNqwBXkwUVpW+lKjm0rG6Rxq89HBkZaF7sR/NZEW57+tP3TVud+Ikq4MYxviHJvqBGB5kW2sRol6il+oYj1MofgIegxdW/RJB0WO2KWYY/rsU40ogtgqPPCCbly8iVNJiWNbd738QqTXgRokJf4LPrKBNDC+RF980FGQlQLTbTW0fdb9pIIYKhfc1Ik9ohkhm9IJsBDbD+6qidRH125jKFLmIm03fRrGlkI0PDgZZ4T26Mo5Ms8q3t1SnmZpwO1IGbGsaAz3awFMeVss/1LMxmo7TqF2b+x+5kZXBAEQRAEQRAE4Tfu2lwMt1VL2QAAAABJRU5ErkJggg=="}],
       fonts: {"app.10":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":10,"bold":false,"weight":0,"italic":false},"app.11":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":11,"bold":false,"weight":0,"italic":false},"app.12":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":12,"bold":false,"weight":0,"italic":false},"app.12.bold":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":12,"bold":false,"weight":700,"italic":false},"app.13":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":13,"bold":false,"weight":0,"italic":false},"app.14":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":14,"bold":false,"weight":0,"italic":false},"app.14.bold":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":14,"bold":false,"weight":700,"italic":false},"app.14.weight.400":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":14,"bold":false,"weight":400,"italic":false},"app.15":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":15,"bold":false,"weight":0,"italic":false},"app.16":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":16,"bold":false,"weight":0,"italic":false},"app.16.weight.400":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":16,"bold":false,"weight":0,"italic":false},"app.16.bold":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":16,"bold":false,"weight":700,"italic":false},"app.17":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":17,"bold":false,"weight":0,"italic":false},"app.18":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":18,"bold":false,"weight":0,"italic":false},"app.17.weight.500":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":17,"bold":false,"weight":500,"italic":false},"app.18.weight.700":{"fontFamily":"Heiti SC,Heiti TC,Microsoft YaHei","size":18,"bold":false,"weight":700,"italic":false}},
       appVersion: "0.0.3.1",
       buildVersion: "20240520114502",
       styles: {"operation-item":{"display":"flex","flexDirection":"column","width":"100%","height":"auto"},"seperator-operation":{"display":"flex","width":"100%","height":"0.5"},"operation-item-value":{"display":"flex","width":"100%","height":"auto","alignItems":"center","justifyContent":"space-between","padding":"10 0 10 0"},"arrow-icon":{"display":"flex","height":"16","width":"16"},"detail-item":{"display":"flex","width":"100%","height":"auto","alignItems":"flex-start","justifyContent":"space-between","marginBottom":"8"},"detail-item-label-text":{"display":"flex","width":"auto","height":"auto","flexShrink":"0","paddingRight":"5"},"detail-item-value-text":{"display":"flex","flex":"1","flexDirection":"row","flexWrap":"wrap","alignItems":"flex-start","alignContent":"flex-start","justifyContent":"flex-start","width":"auto","height":"auto","flexShrink":"0"},"detail-item-value-text-item":{"display":"flex","width":"auto","height":"auto"},"singlepic-item":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","marginBottom":"16"},"single-pic-item-bottom":{"display":"flex","width":"100%","height":"auto"},"top-text":{"display":"flex","width":"100%","height":"auto"},"single-pic-item-top":{"display":"flex","width":"100%","height":"auto","marginBottom":"6"},"bottom-text":{"display":"flex","width":"100%","height":"auto"},"multipic-item":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","marginBottom":"16"},"multi-pic-item":{"display":"flex","width":"100%","height":"auto","flexDirection":"row","alignItems":"center"},"text":{"display":"flex","width":"auto","height":"auto","flex":"1"},"multi-pic-image":{"display":"flex","width":"60","height":"60","flexShrink":"0"},"plainText":{"display":"flex","width":"600","maxHeight":"800"},"wrapper":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","padding":"16 16 0 16"},"header":{"display":"flex","width":"100%","height":"auto","alignItems":"center","marginBottom":"12"},"title-icon":{"display":"flex","width":"24","height":"24","marginRight":"4"},"title-text":{"display":"flex","width":"auto","height":"auto"},"content":{"display":"flex","flexDirection":"column","width":"100%","height":"auto"},"summary-text":{"display":"flex","width":"100%","height":"auto","marginBottom":"16"},"details":{"display":"flex","flexDirection":"column","marginBottom":"8","width":"100%"},"append":{"display":"flex","width":"100%","height":"auto","marginBottom":"16"},"append-text":{"display":"flex","width":"100%","height":"auto"},"operations":{"display":"flex","flexDirection":"column","width":"100%","height":"auto"},"single-pic":{"display":"flex","width":"600","maxHeight":"600","flexDirection":"column"},"single-pic-banner-wrap":{"display":"flex","flexDirection":"column","width":"100%","height":"auto"},"single-pic-banner":{"display":"flex","flexDirection":"column","width":"100%","height":"200"},"single-pic-item-wrap":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","padding":"16 16 0 16"},"multi-pic":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","maxHeight":"300"},"multi-pic-banner-wrap":{"display":"flex","flexDirection":"column","position":"relative","width":"100%","height":"auto"},"multi-pic-banner":{"display":"flex","flexDirection":"column","width":"100%","height":"100%"},"multi-pic-banner-text-wrap":{"display":"flex","flexDirection":"column","position":"absolute","width":"100%","height":"auto","bottom":"16","left":"16"},"banner-text":{"display":"flex","width":"100%","height":"auto"},"multi-pic-item-wrap":{"display":"flex","flexDirection":"column","width":"100%","height":"auto","padding":"16 16 0 16"},"mail":{"display":"flex","width":"560","maxHeight":"800","height":"auto","padding":"16 16 10 16","flexDirection":"column"},"mail-title":{"display":"flex","width":"100%","height":"auto","marginBottom":"12"},"mail-subtitle":{"display":"flex","width":"100%","height":"auto","alignItems":"center","marginBottom":"16"},"mail-content":{"display":"flex","width":"100%","height":"auto","marginBottom":"16"},"seperator":{"display":"flex","width":"100%","height":"0.5","marginBottom":"10"},"bottom":{"display":"flex","flexDirection":"row","justifyContent":"space-between","width":"100%","height":"auto"},"left":{"display":"flex","height":"auto","width":"auto","flexShink":"0","justifyContent":"flex-start","alignItems":"center"},"left-text":{"display":"flex","height":"auto","width":"auto"},"right":{"display":"flex","justifyContent":"flex-start","alignItems":"center","height":"auto","width":"auto"},"attach-icon":{"display":"flex","height":"16","width":"16","marginRight":"4"},"attach-number":{"display":"flex","height":"auto","width":"auto","marginRight":"4"}},
       applicationEvents: [{"eventName":"OnCreateView","callback":"app.OnCreateView"},{"eventName":"OnExit","callback":"app.OnExit"},{"eventName":"OnStartup","callback":"app.OnStartup"},{"eventName":"OnConfigChange","callback":"app.OnConfigChange"}],
       applicationId: appKey + '_' + uniqueApplicationId,
       urlWhiteList: []
     };
   };

   /**
    * 释放资源
    * @description 使用_命名,防止被重写
    */
   ArkWindow._destroyResource_ = function () {
     ArkGlobalContext.clearTemplates();
   };

   /** 标识是Lua Ark */
   ArkWindow.isLua = true;

   async function createApp(options) {
     const lua = await luaRun();
     const templates = ArkGlobalContext.getViewTemplates();
     ArkWindow.lua = lua;
     return new arkWeb.WebARKView({
       /**
        * 这里之前是导出的唯一的对象.不过后面发现不可行.因为在Ark视图里面有注册了很多事件.这些事件的会直接调用里面声明的全局方法.这个时候就有可能不是在某一个对象上了.
        * @author alawnxu
        * @date 2022-07-30 22:41:12
        * @see
        * com.tencent.qq_vip_collect_card_template
        * <Event>
        *  <OnSetValue value="gameLogic.OnSetData" />
        * </Event>
        *
        * 而游戏中心的大部分都是:
        * com.tencent.gamecenter.gshare
        * <Event>
        *  <OnSetValue value="Vark.onSetMetaData" />
        * </Event>
        *
        * 还有多个的:
        * com.tencent.mobileqq.reading
        * <OnSetValue value="bookUpdate.OnSetMetadata" name="OnSetValue"></OnSetValue>
        * <OnSetValue value="accountChange.OnSetMetadata" name="OnSetValue"></OnSetValue>
        *
        * 而根据不同的模板调用不同的初始化方法在正常不过.所以这里统一导出ArkWindow
        */
       app: ArkWindow,
       templates,
       ...(options || {}),
     });
   }

  return createApp;

}));
