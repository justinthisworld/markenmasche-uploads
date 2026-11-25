// Speichern direkt in einen einmal gewählten Ordner (File System Access API, Handle in IndexedDB)
const DB='mm-save',ST='h';
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function getH(){const db=await idb();return new Promise(res=>{const tx=db.transaction(ST).objectStore(ST).get('dir');tx.onsuccess=()=>res(tx.result||null);tx.onerror=()=>res(null);});}
async function setH(h){const db=await idb();return new Promise(res=>{const tx=db.transaction(ST,'readwrite').objectStore(ST).put(h,'dir');tx.onsuccess=()=>res(true);});}
export async function pickDir(){const h=await showDirectoryPicker({id:'markenmasche',mode:'readwrite'});await setH(h);return h.name;}
export async function dirStatus(){const h=await getH();if(!h)return {name:null,perm:'none'};return {name:h.name,perm:await h.queryPermission({mode:'readwrite'})};}
export async function ensurePerm(){const h=await getH();if(!h)return false;if(await h.queryPermission({mode:'readwrite'})==='granted')return true;return (await h.requestPermission({mode:'readwrite'}))==='granted';}
export async function saveToDir(name,blob){const h=await getH();if(!h)throw new Error('kein Ordner gewählt');if(await h.queryPermission({mode:'readwrite'})!=='granted')throw new Error('keine Schreibrechte');
 const f=await h.getFileHandle(name,{create:true});const w=await f.createWritable();await w.write(blob);await w.close();return h.name+'/'+name;}
