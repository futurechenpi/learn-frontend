import{d as G,u as X,r as d,H as z,k as S,j as l,f as o,h as c,v as f,t as y,s as w,E as O,_ as Z,c as I,K as pe,y as fe,w as he,as as ge,o as ve,$ as ye,e as F,M as V,a5 as P,F as be,p as _e,i as xe,Q as je,m as J,q as Ce}from"./index-ko4TOxCY.js";import{A as we}from"./AIAssistant-icIJ6CPl.js";import{g as Se,a as ke}from"./wrongQuestion-iKDNzvqC.js";import{s as Y}from"./progress-DlcVzztJ.js";import{u as Ee}from"./usePageContext-6Ghgt8vt.js";const Te={class:"wrong-question-form"},Le={class:"form-actions"},Ie=G({__name:"WrongQuestionButton",props:{courseKey:{},lessonStep:{},lessonTitle:{},currentCode:{}},setup(j){const t=j,N=X(),C=d(""),h=d(!1),M=d(!1),k=d();function r(){C.value="",k.value?.hide?.()}async function H(){if(N.userInfo?.userId){h.value=!0;try{const i=t.currentCode||"";if(((await Se(N.userInfo.userId))?.data||[]).find(v=>{const E=String(v.courseKey||"")===String(t.courseKey||""),T=(v.lessonStep??null)==(t.lessonStep??null);return E&&T})){O.warning("该题目已在错题本中"),k.value?.hide?.(),h.value=!1;return}await ke({courseKey:t.courseKey,lessonStep:t.lessonStep,lessonTitle:t.lessonTitle,wrongCode:i,note:C.value||void 0}),M.value=!0,O.success("已加入错题本"),k.value?.hide?.()}catch(i){O.error(i?.response?.data?.message||"操作失败")}h.value=!1}}return(i,a)=>{const g=S("el-button"),v=S("el-input"),E=S("el-popover");return w(),z(E,{ref_key:"popoverRef",ref:k,placement:"bottom-end",width:320,trigger:"click"},{reference:l(()=>[c(g,{type:M.value?"warning":"danger",size:"small"},{default:l(()=>[f(y(M.value?"✓ 已入错题本":"📌 加入错题本"),1)]),_:1},8,["type"])]),default:l(()=>[o("div",Te,[a[3]||(a[3]=o("h4",null,"📌 收藏到错题本",-1)),a[4]||(a[4]=o("p",{class:"form-hint"},"记录当前题目，方便之后重做复习",-1)),c(v,{modelValue:C.value,"onUpdate:modelValue":a[0]||(a[0]=T=>C.value=T),type:"textarea",rows:3,placeholder:"记下你的思路或遇到的问题（可选）...",resize:"vertical"},null,8,["modelValue"]),o("div",Le,[c(g,{size:"small",onClick:r},{default:l(()=>[...a[1]||(a[1]=[f("取消",-1)])]),_:1}),c(g,{type:"primary",size:"small",loading:h.value,onClick:H},{default:l(()=>[...a[2]||(a[2]=[f("确认添加",-1)])]),_:1},8,["loading"])])])]),_:1},512)}}}),Ne=Z(Ie,[["__scopeId","data-v-84307bad"]]),Me={class:"exercise-page"},He={class:"page-header"},Be={class:"left"},Ke={class:"desc"},Ve={class:"right"},Pe={class:"main"},ze={class:"workspace"},De={class:"preview-panel"},qe={class:"preview-row"},Re={class:"preview-half"},Oe=["srcdoc"],Fe={class:"preview-half"},Je=["srcdoc"],Ue={class:"editor-panel"},Ae={class:"editor-toolbar"},$e={class:"tools"},We={class:"sidebar"},Qe={class:"hints"},Ye={class:"hints-header"},Ge={class:"list"},Xe={class:"assistant"},Ze=G({__name:"ExerciseTemplate",props:{config:{}},setup(j){const t=j,N=pe(),C=Ce(),h=X(),{setContext:M}=Ee(),k={html:"HTML",css:"CSS",js:"JavaScript"},r=I(()=>Number(N.params.step||1)),H=I(()=>String(N.query.title||"开始练习")),i=d(t.config.defaultTab),a=d(""),g=d(""),v=d(""),E=d(),T=d(),U=d(),ee=d();let m={},D=null;const K=d(!1),b=fe({html:!1,css:!1,js:!1});function q(e){return t.config.tabLabels?.[e]||k[e]}const A=I(()=>{const e=Object.keys(t.config.lessons).map(Number).filter(s=>!Number.isNaN(s));return e.length?Math.max(...e):1}),te=I(()=>t.config.lessons[r.value]?.hints||[]);function $(){return getComputedStyle(document.documentElement).getPropertyValue("--el-color-primary")||"#3b82f6"}function se(){return document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches}function oe(e){return e==="css"?"css":e==="js"?t.config.courseKey==="typescript"||t.config.courseKey==="react"?"typescript":"javascript":"html"}function L(e){return e.replace(/<\/script/gi,"<\\/script").replace(/<!--/g,"<\\!--")}const ne=I(()=>{const e=t.config.lessons[r.value]||t.config.lessons[1];if(!e)return"";const s=L(e.html||""),u=L(e.css||""),n=L(e.js||""),p=t.config.frameworkCdn||"",_=$();return'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>'+u+`
:root{--el-color-primary:`+_+"}</style>"+p+"</head><body>"+s+"<script>try{"+n+"}catch(e){console.error(e)}<\/script></body></html>"}),ae=I(()=>{const e=L(a.value),s=L(g.value),u=L(v.value),n=$();let p=e;const _=t.config.frameworkCdn||"",x="<style>"+s+`
:root{--el-color-primary:`+n+"}</style>";return t.config.tabs.includes("html")||(p='<div class="exercise-body">'+e+"</div>"),'<!DOCTYPE html><html><head><meta charset="UTF-8"/>'+x+_+"</head><body>"+p+"<script>try{"+u+"}catch(e){console.error(e)}<\/script></body></html>"}),R=()=>{const e=t.config.lessons[r.value]||t.config.lessons[1],s=t.config.titles[r.value]||H.value,u=e?.html||"",n=e?.css||"",p=e?.js||"";M({pageName:t.config.pageContextName,routeName:t.config.routeName,lessonTitle:s,lessonStep:r.value,lessonTotalSteps:A.value,contentSummary:`练习目标：${s}
提示：${(e?.hints||[]).join("；")}`,codeExample:[`【目标 HTML】
`+u,`【目标 CSS】
`+n,`【目标 JS】
`+p,`【你当前写的 HTML】
`+a.value,`【你当前写的 CSS】
`+g.value,`【你当前写的 JS】
`+v.value].join(`

`)})};he(r,()=>{W(),R()}),ge(()=>{(a.value||g.value||v.value)&&R()});function W(){a.value="",g.value="",v.value="",b.html=!1,b.css=!1,b.js=!1,Object.values(m).forEach(e=>{e?.setValue("")})}ve(async()=>{W(),await ye(),await re(),R()});function le(e){return new Promise((s,u)=>{if(document.querySelector(`script[src="${e}"]`)){s();return}const n=document.createElement("script");n.src=e,n.onload=()=>s(),n.onerror=u,document.head.appendChild(n)})}async function re(){try{await le("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js");const e=window.require;e.config({paths:{vs:"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"}}),await new Promise(n=>e(["vs/editor/editor.main"],()=>n())),D=window.monaco;const s=se()?"vs-dark":"vs",u=(n,p,_)=>{if(!n||!D)return null;const x=D.editor.create(n,{value:"",language:oe(p),theme:s,automaticLayout:!0,minimap:{enabled:!1},lineNumbers:"on",fontSize:14,fontFamily:"'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",fontLigatures:!0,scrollBeyondLastLine:!1,wordWrap:"on",tabSize:2,insertSpaces:!0,renderWhitespace:"selection",bracketPairColorization:{enabled:!0},guides:{indentation:!0,bracketPairs:!0},suggest:{showKeywords:!0,showSnippets:!0,showMethods:!0,showFunctions:!0,showConstructors:!0,quickSuggestions:!0},padding:{top:12,bottom:12}});return x.onDidChangeModelContent(()=>{const B=x.getValue();_==="html"?a.value=B:_==="css"?g.value=B:_==="js"&&(v.value=B)}),x};t.config.tabs.includes("html")&&(m.html=u(E.value,"html","html")),t.config.tabs.includes("css")&&(m.css=u(T.value,"css","css")),t.config.tabs.includes("js")&&(m.js=u(U.value,"js","js")),Object.values(m).forEach(n=>{n?.layout()})}catch(e){console.error("Monaco Editor 初始化失败:",e)}}function ie(){C.push(t.config.backRoute)}function ce(){const e=Math.max(1,r.value+1);h.isLoggedIn&&h.userInfo?.userId&&Y({userId:h.userInfo.userId,course:t.config.progressKey,step:e}).catch(()=>{}),C.push({name:t.config.routeName,params:{step:e},query:{title:t.config.titles[e]||""}})}function ue(){const e=Math.max(1,r.value-1);h.isLoggedIn&&h.userInfo?.userId&&Y({userId:h.userInfo.userId,course:t.config.progressKey,step:e}).catch(()=>{}),C.push({name:t.config.routeName,params:{step:e},query:{title:t.config.titles[e]||""}})}function Q(){const e=m[i.value];e&&e.setValue(""),b[i.value]=!1}function de(){const e=i.value;if(b[e]){b[e]=!1,Q();return}const s=t.config.lessons[r.value]||t.config.lessons[1];s&&(e==="html"&&m.html?m.html.setValue(s.html||""):e==="css"&&m.css?m.css.setValue(s.css||""):e==="js"&&m.js&&m.js.setValue(s.js||""),b[e]=!0)}function me(){K.value=!K.value}return(e,s)=>{const u=S("el-icon"),n=S("el-button"),p=S("el-radio-button"),_=S("el-radio-group");return w(),F("div",Me,[o("header",He,[o("div",Be,[c(n,{text:"",onClick:ie},{default:l(()=>[c(u,null,{default:l(()=>[c(xe(je))]),_:1}),s[1]||(s[1]=f("返回",-1))]),_:1}),o("h1",null,"实战练习 · "+y(j.config.pageName.split(" ")[0]),1),o("span",Ke,"第 "+y(r.value)+" 课 · "+y(H.value),1)]),o("div",Ve,[c(Ne,{"course-key":j.config.courseKey,"lesson-step":r.value,"lesson-title":H.value},null,8,["course-key","lesson-step","lesson-title"]),c(n,{type:"primary",onClick:ue,disabled:r.value<=1},{default:l(()=>[...s[2]||(s[2]=[f("上一课",-1)])]),_:1},8,["disabled"]),c(n,{type:"primary",onClick:ce,disabled:r.value>=A.value},{default:l(()=>[...s[3]||(s[3]=[f("下一课",-1)])]),_:1},8,["disabled"])])]),o("main",Pe,[o("div",ze,[o("div",De,[o("div",qe,[o("div",Re,[s[4]||(s[4]=o("div",{class:"panel-header"},[o("span",{class:"panel-title"},"🎯 目标效果")],-1)),o("iframe",{srcdoc:ne.value,class:"goal-iframe"},null,8,Oe)]),o("div",Fe,[s[5]||(s[5]=o("div",{class:"panel-header"},[o("span",{class:"panel-title"},"📝 你的效果")],-1)),o("iframe",{srcdoc:ae.value,class:"user-iframe"},null,8,Je)])])]),o("div",Ue,[o("div",Ae,[c(_,{modelValue:i.value,"onUpdate:modelValue":s[0]||(s[0]=x=>i.value=x),size:"small",class:"tab-group"},{default:l(()=>[j.config.tabs.includes("html")?(w(),z(p,{key:0,value:"html"},{default:l(()=>[f(y(q("html")),1)]),_:1})):J("",!0),j.config.tabs.includes("css")?(w(),z(p,{key:1,value:"css"},{default:l(()=>[f(y(q("css")),1)]),_:1})):J("",!0),j.config.tabs.includes("js")?(w(),z(p,{key:2,value:"js"},{default:l(()=>[f(y(q("js")),1)]),_:1})):J("",!0)]),_:1},8,["modelValue"]),o("div",$e,[c(n,{size:"small",type:b[i.value]?"warning":"default",onClick:de},{default:l(()=>[f(y(b[i.value]?"🙈 隐藏答案":"💡 显示答案"),1)]),_:1},8,["type"]),c(n,{size:"small",type:"danger",onClick:Q},{default:l(()=>[...s[6]||(s[6]=[f("清空代码",-1)])]),_:1})])]),o("div",{class:"editor-body",ref_key:"editorBodyRef",ref:ee},[V(o("div",{class:"editor-host",ref_key:"htmlHost",ref:E},null,512),[[P,i.value==="html"]]),V(o("div",{class:"editor-host",ref_key:"cssHost",ref:T},null,512),[[P,i.value==="css"]]),V(o("div",{class:"editor-host",ref_key:"jsHost",ref:U},null,512),[[P,i.value==="js"]])],512)])]),o("aside",We,[o("div",Qe,[o("div",Ye,[s[7]||(s[7]=o("h3",null,"练习提示",-1)),c(n,{text:"",size:"small",onClick:me},{default:l(()=>[f(y(K.value?"收起":"查看提示"),1)]),_:1})]),V(o("ul",Ge,[(w(!0),F(be,null,_e(te.value,(x,B)=>(w(),F("li",{key:B},y(x),1))),128))],512),[[P,K.value]])]),o("div",Xe,[c(we)])])])])}}}),dt=Z(Ze,[["__scopeId","data-v-b1978076"]]),et={1:{html:`<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8"/>
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>欢迎来到我的网站！</h1>
    <p>这是我的第一个HTML页面。</p>
  </body>
</html>`,css:`body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }
h1 { color: var(--el-color-primary); }`,js:"console.log('Hello HTML!')",hints:["包含 <!DOCTYPE html>","包含一个 <h1> 与一个 <p>","尝试修改标题文本"]},2:{html:`<h1>主标题</h1>
<p>这是一个<strong>重要</strong>的段落，包含<em>斜体</em>文本。</p>
<a href="#">示例链接</a>
<img src="example.jpg" alt="示例图片" />`,css:"img{max-width:100%;}",js:"",hints:["包含一个 <h1>","包含一个 <p>","使用 <strong> 或 <em>","包含 <a> 或 <img>"]},3:{html:`<ul>
  <li>苹果</li>
  <li>香蕉</li>
</ul>
<table>
  <tr><th>姓名</th><th>年龄</th></tr>
  <tr><td>张三</td><td>25</td></tr>
</table>`,css:"table{border-collapse:collapse} th,td{border:1px solid #ddd;padding:6px 10px}",js:"",hints:["包含 <ul> 或 <ol>","包含至少一个 <li>","包含 <table> 与 <tr>/<td>/<th>"]},4:{html:`<form>
  <label>姓名：<input type="text" required /></label>
  <label>邮箱：<input type="email" required /></label>
  <button type="submit">提交</button>
</form>`,css:"label{display:block;margin:6px 0}",js:"document.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();alert('已提交')})",hints:["包含 <form>","包含 <input> 或 <textarea>","包含提交 <button>"]},5:{html:`<header>
  <h1>网站标题</h1>
</header>
<main>
  <section>
    <article>
      <h2>文章标题</h2>
      <p>文章内容...</p>
    </article>
  </section>
  <aside>
    <h3>侧栏</h3>
  </aside>
</main>
<footer>页脚</footer>`,css:"header,footer{padding:8px 0}",js:"",hints:["包含 <header>/<footer>","包含 <main> 与 <section> 或 <article>"]}},tt={1:"HTML 简介和基础结构",2:"常用HTML标签",3:"列表和表格",4:"表单元素",5:"语义化标签"},st={1:{html:'<div class="card">卡片</div>',css:".card{padding:16px;border:1px solid #ccc;border-radius:8px;background:#f8fafc}",hints:["编写一个类选择器 .card","为其添加 padding 与边框","设置圆角与背景色"]},2:{html:`<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>`,css:".grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.item{background:#e5e7eb;padding:10px;text-align:center}",hints:["使用 display:grid","设置 repeat(3,1fr)","使用 gap 控制间距"]},3:{html:'<nav class="nav"><a>首页</a><a>课程</a><a>联系</a></nav>',css:".nav{display:flex;gap:12px;background:#111827;color:#fff;padding:8px;border-radius:6px}.nav a{color:inherit;text-decoration:none}",hints:["使用 flex 水平排列","设置 gap 间距","让链接继承颜色"]},4:{html:'<button class="btn">按钮</button>',css:`.btn{padding:8px 12px;border:1px solid var(--el-border-color);background:var(--el-fill-color);border-radius:6px}
.btn:hover{background:var(--el-fill-color-darker)}`,hints:["使用 Element Plus 变量","添加 :hover 态"]}},ot={1:"CSS 基础语法",2:"选择器详解",3:"盒模型和布局",4:"响应式设计"},nt={1:{html:`<button id="btn">点我</button>
<p id="out"></p>`,js:`document.getElementById('btn')?.addEventListener('click',()=>{
  const out=document.getElementById('out');
  if(out) out.textContent='按钮已点击';
})`,hints:["获取按钮元素","绑定 click 事件","修改段落文本"]},2:{html:`<input id="name" placeholder="输入名字"/>
<button id="hello">打招呼</button>
<p id="msg"></p>`,js:`document.getElementById('hello')?.addEventListener('click',()=>{
  const name = (document.getElementById('name') as HTMLInputElement)?.value || '同学';
  const msg = document.getElementById('msg');
  if (msg) msg.textContent = '你好，' + name + '！';
})`,hints:["读取输入框的值","字符串拼接/模板字符串","点击后更新页面"]},3:{html:'<ul id="list"></ul>',js:`const items=['苹果','香蕉','橙子'];
const ul=document.getElementById('list');
if(ul){
  items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li) })
}`,hints:["遍历数组","创建 li 元素","appendChild 插入 DOM"]},4:{html:'<p id="time"></p>',js:`setInterval(()=>{
  const el=document.getElementById('time');
  if(el) el.textContent = new Date().toLocaleTimeString();
},1000)`,hints:["使用 setInterval","每秒更新时间","toLocaleTimeString"]},5:{html:`<button id="load">加载数据</button>
<pre id="out"></pre>`,js:`document.getElementById('load')?.addEventListener('click', async ()=>{
  try{
    const res = await fetch('https://api.github.com/repos/vuejs/core');
    const data = await res.json();
    (document.getElementById('out')||{}).textContent = JSON.stringify({stargazers:data.stargazers_count,name:data.name}, null, 2)
  }catch(e){ console.error(e) }
})`,hints:["fetch 发起请求","await/async","在页面显示结果"]}},at={1:"JavaScript 基础语法",2:"函数和作用域",3:"对象和数组",4:"DOM操作",5:"异步编程"},mt={courseKey:"html",pageName:"HTML 实战练习",routeName:"exercise-html",backRoute:"/learn/html",progressKey:"html",tabs:["html","css","js"],defaultTab:"html",pageContextName:"HTML 实战练习",lessons:et,titles:tt},pt={courseKey:"css",pageName:"CSS 实战练习",routeName:"exercise-css",backRoute:"/learn/css",progressKey:"css",tabs:["html","css"],defaultTab:"css",pageContextName:"CSS 实战练习",lessons:st,titles:ot},ft={courseKey:"javascript",pageName:"JavaScript 实战练习",routeName:"exercise-js",backRoute:"/learn/javascript",progressKey:"javascript",tabs:["html","js"],defaultTab:"js",pageContextName:"JavaScript 实战练习",lessons:nt,titles:at};export{dt as E,pt as c,mt as h,ft as j};
