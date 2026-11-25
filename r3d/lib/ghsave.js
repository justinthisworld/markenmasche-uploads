// Fertiges Video direkt ins GitHub-Repo laden (Token liegt nur im localStorage dieses Browsers)
const REPO='justinthisworld/markenmasche-uploads';
export const hasToken=()=>!!localStorage.getItem('mm_gh_token');
export function setToken(t){localStorage.setItem('mm_gh_token',t.trim());}
function b64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=()=>rej(r.error);r.readAsDataURL(blob);});}
export async function uploadGH(path,blob){const tok=localStorage.getItem('mm_gh_token');if(!tok)throw new Error('kein Token');
 const H={Authorization:'Bearer '+tok,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
 let sha;const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:H});if(g.ok)sha=(await g.json()).sha;
 const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:H,body:JSON.stringify({message:'Render '+path,content:await b64(blob),sha})});
 if(!r.ok)throw new Error('GitHub '+r.status+': '+(await r.text()).slice(0,200));return path;}
