// 统一管理练习课程的代码模板与标题映射，供各练习页按路由(step)加载

export type HtmlCssJs = { html: string; css: string; js: string; hints: string[] }
export type HtmlCss = { html: string; css: string; hints: string[] }
export type HtmlJs = { html: string; js: string; hints: string[] }

export const htmlLessons: Record<number, HtmlCssJs> = {
  1: {
    html: `<!DOCTYPE html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8"/>\n    <title>我的第一个网页</title>\n  </head>\n  <body>\n    <h1>欢迎来到我的网站！</h1>\n    <p>这是我的第一个HTML页面。</p>\n  </body>\n</html>`,
    css: `body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }\nh1 { color: var(--el-color-primary); }`,
    js: `console.log('Hello HTML!')`,
    hints: ['包含 <!DOCTYPE html>', '包含一个 <h1> 与一个 <p>', '尝试修改标题文本']
  },
  2: {
    html: `<h1>主标题</h1>\n<p>这是一个<strong>重要</strong>的段落，包含<em>斜体</em>文本。</p>\n<a href="#">示例链接</a>\n<img src="example.jpg" alt="示例图片" />`,
    css: `img{max-width:100%;}`,
    js: ``,
    hints: ['包含一个 <h1>', '包含一个 <p>', '使用 <strong> 或 <em>', '包含 <a> 或 <img>']
  },
  3: {
    html: `<ul>\n  <li>苹果</li>\n  <li>香蕉</li>\n</ul>\n<table>\n  <tr><th>姓名</th><th>年龄</th></tr>\n  <tr><td>张三</td><td>25</td></tr>\n</table>`,
    css: `table{border-collapse:collapse} th,td{border:1px solid #ddd;padding:6px 10px}`,
    js: ``,
    hints: ['包含 <ul> 或 <ol>', '包含至少一个 <li>', '包含 <table> 与 <tr>/<td>/<th>']
  },
  4: {
    html: `<form>\n  <label>姓名：<input type="text" required /></label>\n  <label>邮箱：<input type="email" required /></label>\n  <button type="submit">提交</button>\n</form>`,
    css: `label{display:block;margin:6px 0}`,
    js: `document.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();alert('已提交')})`,
    hints: ['包含 <form>', '包含 <input> 或 <textarea>', '包含提交 <button>']
  },
  5: {
    html: `<header>\n  <h1>网站标题</h1>\n</header>\n<main>\n  <section>\n    <article>\n      <h2>文章标题</h2>\n      <p>文章内容...</p>\n    </article>\n  </section>\n  <aside>\n    <h3>侧栏</h3>\n  </aside>\n</main>\n<footer>页脚</footer>`,
    css: `header,footer{padding:8px 0}`,
    js: ``,
    hints: ['包含 <header>/<footer>', '包含 <main> 与 <section> 或 <article>']
  }
}

export const htmlTitles: Record<number, string> = {
  1: 'HTML 简介和基础结构',
  2: '常用HTML标签',
  3: '列表和表格',
  4: '表单元素',
  5: '语义化标签'
}

export const cssLessons: Record<number, HtmlCss> = {
  1: {
    html: `<div class="card">卡片</div>`,
    css: `.card{padding:16px;border:1px solid #ccc;border-radius:8px;background:#f8fafc}`,
    hints: ['编写一个类选择器 .card', '为其添加 padding 与边框', '设置圆角与背景色']
  },
  2: {
    html: `<div class="grid">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
    css: `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.item{background:#e5e7eb;padding:10px;text-align:center}`,
    hints: ['使用 display:grid', '设置 repeat(3,1fr)', '使用 gap 控制间距']
  },
  3: {
    html: `<nav class="nav"><a>首页</a><a>课程</a><a>联系</a></nav>`,
    css: `.nav{display:flex;gap:12px;background:#111827;color:#fff;padding:8px;border-radius:6px}.nav a{color:inherit;text-decoration:none}`,
    hints: ['使用 flex 水平排列', '设置 gap 间距', '让链接继承颜色']
  },
  4: {
    html: `<button class="btn">按钮</button>`,
    css: `.btn{padding:8px 12px;border:1px solid var(--el-border-color);background:var(--el-fill-color);border-radius:6px}
.btn:hover{background:var(--el-fill-color-darker)}`,
    hints: ['使用 Element Plus 变量', '添加 :hover 态']
  }
}

export const cssTitles: Record<number, string> = {
  1: 'CSS 基础语法',
  2: '选择器详解',
  3: '盒模型和布局',
  4: '响应式设计'
}

export const jsLessons: Record<number, HtmlJs> = {
  1: {
    html: `<button id="btn">点我</button>\n<p id="out"></p>`,
    js: `document.getElementById('btn')?.addEventListener('click',()=>{\n  const out=document.getElementById('out');\n  if(out) out.textContent='按钮已点击';\n})`,
    hints: ['获取按钮元素', '绑定 click 事件', '修改段落文本']
  },
  2: {
    html: `<input id="name" placeholder="输入名字"/>\n<button id="hello">打招呼</button>\n<p id="msg"></p>`,
    js: `document.getElementById('hello')?.addEventListener('click',()=>{\n  const name = (document.getElementById('name') as HTMLInputElement)?.value || '同学';\n  const msg = document.getElementById('msg');\n  if (msg) msg.textContent = '你好，' + name + '！';\n})`,
    hints: ['读取输入框的值', '字符串拼接/模板字符串', '点击后更新页面']
  },
  3: {
    html: `<ul id="list"></ul>`,
    js: `const items=['苹果','香蕉','橙子'];\nconst ul=document.getElementById('list');\nif(ul){\n  items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li) })\n}`,
    hints: ['遍历数组', '创建 li 元素', 'appendChild 插入 DOM']
  },
  4: {
    html: `<p id="time"></p>`,
    js: `setInterval(()=>{\n  const el=document.getElementById('time');\n  if(el) el.textContent = new Date().toLocaleTimeString();\n},1000)`,
    hints: ['使用 setInterval', '每秒更新时间', 'toLocaleTimeString']
  },
  5: {
    html: `<button id="load">加载数据</button>\n<pre id="out"></pre>`,
    js: `document.getElementById('load')?.addEventListener('click', async ()=>{\n  try{\n    const res = await fetch('https://api.github.com/repos/vuejs/core');\n    const data = await res.json();\n    (document.getElementById('out')||{}).textContent = JSON.stringify({stargazers:data.stargazers_count,name:data.name}, null, 2)\n  }catch(e){ console.error(e) }\n})`,
    hints: ['fetch 发起请求', 'await/async', '在页面显示结果']
  }
}

export const jsTitles: Record<number, string> = {
  1: 'JavaScript 基础语法',
  2: '函数和作用域',
  3: '对象和数组',
  4: 'DOM操作',
  5: '异步编程'
}


