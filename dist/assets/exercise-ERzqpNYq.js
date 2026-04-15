import{ay as m}from"./index-BFtICLyj.js";async function w(o,r="medium"){return(await m.post("/api/exercise/generate",{topic:o,difficulty:r})).data.data}async function x(o,r,n){const t=r.split("|").map(s=>s.trim().toLowerCase()).filter(s=>s!==""),e=n.map(s=>s.trim().toLowerCase());if(t.length===0)return{score:0,feedback:"请输入至少一个答案"};let i=0;const c=[];for(let s=0;s<t.length;s++){const g=t[s];if(e.some(u=>g===u||f(g)===f(u)))i++,c.push(`✓ 答案 ${s+1} 正确`);else{const u=$(g,e);c.push(`✗ 答案 ${s+1} 错误${u?` (接近: ${u})`:""}`)}}const h=Math.max(t.length,e.length),a=Math.round(i/h*100);let l="";return a===100?l="🎉 完美！所有答案都正确！":a>=70?l=`👍 做得不错！答对 ${i}/${h} 个答案 (${a}分)

详情：
${c.join(`
`)}

参考答案：${e.join(" / ")}`:a>0?l=`💪 继续努力！答对 ${i}/${h} 个答案 (${a}分)

详情：
${c.join(`
`)}

参考答案：${e.join(" / ")}`:l=`❌ 需要再复习一下哦 (0分)

详情：
${c.join(`
`)}

参考答案：${e.join(" / ")}`,{score:a,feedback:l}}function f(o){return o.replace(/\s+/g,"").replace(/[；;，,。.]/g,",").toLowerCase()}function $(o,r){let n="",t=.5;for(const e of r){const i=d(o,e);i>t&&(t=i,n=e)}return t>.5?n:null}function d(o,r){const n=f(o),t=f(r);if(n===t)return 1;if(n.includes(t)||t.includes(n))return .8;const e=Math.max(n.length,t.length);return e===0?1:1-p(n,t)/e}function p(o,r){const n=[];for(let t=0;t<=r.length;t++)n[t]=[t];for(let t=0;t<=o.length;t++)n[0][t]=[t];for(let t=1;t<=r.length;t++)for(let e=1;e<=o.length;e++)r[t-1]===o[e-1]?n[t][e]=n[t-1][e-1]:n[t][e]=Math.min(n[t-1][e-1]+1,n[t][e-1]+1,n[t-1][e]+1);return n[r.length][o.length]}export{x as a,w as g};
