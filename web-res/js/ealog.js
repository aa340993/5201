window.ealog=window.ealog||{addEvent:function(eventType,eventProperties=null){window.mixPanelEventLog.addEvent(eventType,eventProperties);if(document.getElementById('ealog_info').getAttribute('env')=='dev'){console.log({eventType:eventType,eventProperties:eventProperties});}
return this;},resetAccountId:function(userEmail=''){this.setUserProperties({'account id':userEmail});return this;},setUserProperties:function(userProperties){try{mixpanel.register(userProperties);}catch(e){console.log(e);}
return this;}};function getQueryString(name){let reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i");let r=window.location.search.substr(1).match(reg);if(r!=null)return unescape(r[2]);return null;}
window.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-ealog]').forEach((ele)=>{ele.addEventListener('click',()=>{let data=ele.dataset.ealog.split(',');ealog.addEvent(data[0],new Function('return '+data[1])());});});try{let source=getQueryString("source")||getQueryString("utm_source");let location=getQueryString("location");let version=getQueryString("version");let content=getQueryString("utm_content");let ab=getQueryString("ab");if(source){let other_data={};if(location)
other_data.location=location;if(version)
other_data.version=version;if(ab)
other_data.ab=ab;if(content)
other_data.content=content;let source_data={source:source,other:other_data};window.ealog.addEvent("external link",{source:source,location:location,version:version,ab:ab});window.localStorage.setItem("source_data",JSON.stringify(source_data));}}catch(e){console.error(e);}});window.eventLog={};window.pageConversion={};if(!window.localStorage.getItem("device_id")){async function FPPromise(){await new Promise((resolve,reject)=>{const script=document.createElement('script')
script.onload=resolve
script.onerror=reject
script.async=true
script.src='https://cdn.jsdelivr.net/npm/'
+'@fingerprintjs/fingerprintjs@3/dist/fp.min.js'
document.head.appendChild(script)});const fp=await FingerprintJS.load();return await fp.get()}
FPPromise().then(result=>{window.localStorage.setItem("device_id",result.visitorId);})}
function getBrowserType(){var ua=navigator.userAgent
var isOpera=ua.indexOf('Opera')>-1
if(isOpera){return 'Opera'}
var isIE=(ua.indexOf('compatible')>-1)&&(ua.indexOf('MSIE')>-1)&&!isOpera
var isIE11=(ua.indexOf('Trident')>-1)&&(ua.indexOf("rv:11.0")>-1)
if(isIE11){return 'IE11'}else if(isIE){var re=new RegExp('MSIE (\\d+\\.\\d+);')
re.test(ua)
var ver=parseFloat(RegExp["$1"])
if(ver===7){return 'IE7'}else if(ver===8){return 'IE8'}else if(ver===9){return 'IE9'}else if(ver===10){return 'IE10'}else{return "IE"}}
var isEdge=ua.indexOf("Edge")>-1
if(isEdge){return 'Edge'}
var isFirefox=ua.indexOf("Firefox")>-1
if(isFirefox){return 'Firefox'}
var isSafari=(ua.indexOf("Safari")>-1)&&(ua.indexOf("Chrome")==-1)
if(isSafari){return "Safari"}
var isChrome=(ua.indexOf("Chrome")>-1)&&(ua.indexOf("Safari")>-1)&&(ua.indexOf("Edge")==-1)
if(isChrome){return 'Chrome'}
var isUC=ua.indexOf("UBrowser")>-1
if(isUC){return 'UC'}
var isQQ=ua.indexOf("QQBrowser")>-1
if(isUC){return 'QQ'}
return ''}
window.zgEventLog={addEvent:function(eventType,eventProperties={}){}}
window.mixPanelEventLog={addEvent:function(eventType,eventProperties={}){if(!mixpanel||!mixpanel.track)return false;let isObject=function(variable){return typeof variable==='object'&&variable!==null&&!Array.isArray(variable);}
if(window.fjuser.info.result){mixpanel.identify(window.fjuser.info.id)}
switch(eventType){case 'revenue':eventProperties.revenueType=eventProperties.revenueType||"income";break;}
if(isObject(eventProperties)){mixpanel.track(eventType,eventProperties);}else{mixpanel.track(eventType);}}}
window.eventLog={addEvent:function(eventType,eventProperties=null){if(!eventType)return false
let eventPropertiesData={};eventPropertiesData.device_id=window.localStorage.getItem("device_id")
eventPropertiesData.uid=window.fjuser.info.result?window.fjuser.info.id:""
if(!eventPropertiesData.device_id&&!eventPropertiesData.uid)return false
eventPropertiesData.user_properties={"version":"3.1.0.1","os_name":getBrowserType(),"language":window.language_tag,"package":window.fjuser.info.result?window.fjuser.info.package:'free'}
eventPropertiesData.event_type=eventType;eventPropertiesData.event_properties={}
if(eventProperties){eventPropertiesData.event_properties=eventProperties}
this._sendPost(eventPropertiesData)},_sendPost:function(eventPropertiesData){let formData=new FormData()
formData.append('option','com_fj_event_statistics')
formData.append('task','event.create')
formData.append('params',JSON.stringify(eventPropertiesData))
let isProduction=(document.domain==="www.flexclip.com");$.ajax({url:isProduction?"https://static.flexclip.com":"https://www.smartvideomaker.com/",type:'POST',data:formData,contentType:false,processData:false,success:function(json){if(isProduction)
return;if(json.code===200){console.log({eventType:eventPropertiesData.event_type,eventProperties:eventPropertiesData.event_properties})}else{console.log(json.msg)}}})}}
window.pageConversion={key:"page-conversion-data",saveDay:30,isRecord:true,getCurrentDate:function(){const date=new Date();const year=date.getFullYear();const month=(date.getMonth()+1).toString().padStart(2,'0');const day=date.getDate().toString().padStart(2,'0');return `${year}-${month}-${day}`;},removeStorage:function(){localStorage.removeItem(this.key)},getCurrentUrl:function(){return window.location.pathname;},getPageConversionHistory:function(){return JSON.parse(localStorage.getItem(this.key))||{};},paymentBehavior:function(data){const history=this.getPageConversionHistory();if(history){const dates=Object.keys(history);let page=history[dates[0]];if(!page.trim()){for(let date in history){if(history[date].trim()){page=history[date];break;}}}
const regex=/mount\/g2/;const result=regex.test(page);if(result){return}
let _this=this;$.ajax({url:"https://www.flexclip.com/api/statistics/record-page-conversion",type:'POST',data:JSON.stringify({url:page,price:data.amount}),contentType:false,processData:false,success:function(json){_this.removeStorage();_this.isRecord=false;}})}},calculateDays:function(startTime,endTime){let startDate=new Date(startTime);let endDate=new Date(endTime);let timeDiff=Math.abs(endDate.getTime()-startDate.getTime());return Math.ceil(timeDiff/(1000*3600*24));},saveVisitedPage:function(){const currentDate=this.getCurrentDate();const currentUrl=this.getCurrentUrl();const regex=/mount\/g2/;const result=regex.test(currentUrl);if(result){return}
const history=this.getPageConversionHistory();if(history){for(let date in history){if(this.calculateDays(date,currentDate)>this.saveDay){delete history[date];}}}
history[currentDate]=currentUrl;localStorage.setItem(this.key,JSON.stringify(history));},hasVisitedToday:function(){const currentDate=this.getCurrentDate();const history=this.getPageConversionHistory()
return history[currentDate]!==undefined;},apply:function(){if(window.fjuser&&window.fjuser.info&&window.fjuser.info.result&&window.fjuser.info.policy!=='free'){this.isRecord=false;return;}
if(!this.hasVisitedToday()&&this.isRecord){this.saveVisitedPage();}}}
window.pageConversion.apply();