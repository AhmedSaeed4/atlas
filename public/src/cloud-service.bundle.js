var Np=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kp=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},ow=function(n){let e=[],t=0,r=0;for(;t<n.length;){let s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){let i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){let i=n[t++],o=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{let i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Fp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){let i=n[s],o=s+1<n.length,c=o?n[s+1]:0,u=s+2<n.length,l=u?n[s+2]:0,h=i>>2,f=(i&3)<<4|c>>4,g=(c&15)<<2|l>>6,v=l&63;u||(v=64,o||(g=64)),r.push(t[h],t[f],t[g],t[v])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(kp(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):ow(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){let i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;let l=s<n.length?t[n.charAt(s)]:64;++s;let f=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||l==null||f==null)throw new Uu;let g=i<<2|c>>4;if(r.push(g),l!==64){let v=c<<4&240|l>>2;if(r.push(v),f!==64){let R=l<<6&192|f;r.push(R)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Uu=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},aw=function(n){let e=kp(n);return Fp.encodeByteArray(e,!0)},Ai=function(n){return aw(n).replace(/\./g,"")},ha=function(n){try{return Fp.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cw=()=>xp().__FIREBASE_DEFAULTS__,uw=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},lw=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&ha(n[1]);return e&&JSON.parse(e)},da=()=>{try{return Np()||cw()||uw()||lw()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Lp=n=>da()?.emulatorHosts?.[n],Vp=n=>{let e=Lp(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},qu=()=>da()?.config,Mp=n=>da()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ms=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Ai(JSON.stringify(t)),Ai(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Up(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(nt())}function Bw(){let n=da()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Hp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function qp(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function jp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Kp(){let n=nt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Jp(){return!Bw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ju(){try{return typeof indexedDB=="object"}catch{return!1}}function zp(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hw="FirebaseError",Rt=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=hw,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yn.prototype.create)}},yn=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?dw(i,r):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new Rt(s,c,r)}};function dw(n,e){try{let t=0,r="";for(;t<n.length;){let s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}let i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}let o=n.substring(s+2,i),c=e[o];r+=n.substring(t,s)+(c!=null?String(c):`<${o}?>`),t=i+1}return r}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wp(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function hn(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let s of t){if(!r.includes(s))return!1;let i=n[s],o=e[s];if(Op(i)&&Op(o)){if(!hn(i,o))return!1}else if(i!==o)return!1}for(let s of r)if(!t.includes(s))return!1;return!0}function Op(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function _s(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function ws(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qp(n,e){let t=new Hu(n,e);return t.subscribe.bind(t)}var Hu=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");fw(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Gu),s.error===void 0&&(s.error=Gu),s.complete===void 0&&(s.complete=Gu);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function fw(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Gu(){}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ZA=14400*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rr(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function fa(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ut=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ku=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new ms;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(gw(e))try{this.getOrInitializeService({instanceIdentifier:Pr})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Pr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Pr){return this.instances.has(e)}getOptions(e=Pr){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[i,o]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(i);r===c&&o.resolve(s)}return s}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);let i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:pw(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Pr){return this.component?this.component.multipleInstances?e:Pr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function pw(n){return n===Pr?void 0:n}function gw(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pa=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Ku(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cw=[],ge;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ge||(ge={}));var mw={debug:ge.DEBUG,verbose:ge.VERBOSE,info:ge.INFO,warn:ge.WARN,error:ge.ERROR,silent:ge.SILENT},Ew=ge.INFO,_w={[ge.DEBUG]:"log",[ge.VERBOSE]:"log",[ge.INFO]:"info",[ge.WARN]:"warn",[ge.ERROR]:"error"},ww=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),s=_w[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},sr=class{constructor(e){this.name=e,this._logLevel=Ew,this._logHandler=ww,this._userLogHandler=null,Cw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ge))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?mw[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ge.DEBUG,...e),this._logHandler(this,ge.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ge.VERBOSE,...e),this._logHandler(this,ge.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ge.INFO,...e),this._logHandler(this,ge.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ge.WARN,...e),this._logHandler(this,ge.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ge.ERROR,...e),this._logHandler(this,ge.ERROR,...e)}};var yw=(n,e)=>e.some(t=>n instanceof t),$p,Yp;function Dw(){return $p||($p=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Iw(){return Yp||(Yp=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Xp=new WeakMap,zu=new WeakMap,Zp=new WeakMap,Ju=new WeakMap,Qu=new WeakMap;function Tw(n){let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",o)},i=()=>{t(dn(n.result)),s()},o=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Xp.set(t,n)}).catch(()=>{}),Qu.set(e,n),e}function Aw(n){if(zu.has(n))return;let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",o),n.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",o),n.addEventListener("abort",o)});zu.set(n,e)}var Wu={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return zu.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Zp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return dn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function eg(n){Wu=n(Wu)}function vw(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(ga(this),e,...t);return Zp.set(r,e.sort?e.sort():[e]),dn(r)}:Iw().includes(n)?function(...e){return n.apply(ga(this),e),dn(Xp.get(this))}:function(...e){return dn(n.apply(ga(this),e))}}function bw(n){return typeof n=="function"?vw(n):(n instanceof IDBTransaction&&Aw(n),yw(n,Dw())?new Proxy(n,Wu):n)}function dn(n){if(n instanceof IDBRequest)return Tw(n);if(Ju.has(n))return Ju.get(n);let e=bw(n);return e!==n&&(Ju.set(n,e),Qu.set(e,n)),e}var ga=n=>Qu.get(n);function ng(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){let o=indexedDB.open(n,e),c=dn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(dn(o.result),u.oldVersion,u.newVersion,dn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}var Sw=["get","getKey","getAll","getAllKeys","count"],Rw=["put","add","delete","clear"],$u=new Map;function tg(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if($u.get(e))return $u.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,s=Rw.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Sw.includes(t)))return;let i=async function(o,...c){let u=this.transaction(o,s?"readwrite":"readonly"),l=u.store;return r&&(l=l.index(c.shift())),(await Promise.all([l[t](...c),s&&u.done]))[0]};return $u.set(e,i),i}eg(n=>({...n,get:(e,t,r)=>tg(e,t)||n.get(e,t,r),has:(e,t)=>!!tg(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Xu=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Pw(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function Pw(n){return n.getComponent()?.type==="VERSION"}var Zu="@firebase/app",rg="0.16.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var In=new sr("@firebase/app"),Nw="@firebase/app-compat",Ow="@firebase/analytics-compat",kw="@firebase/analytics",Fw="@firebase/app-check-compat",xw="@firebase/app-check",Lw="@firebase/auth",Vw="@firebase/auth-compat",Mw="@firebase/database",Gw="@firebase/data-connect",Uw="@firebase/database-compat",Hw="@firebase/functions",qw="@firebase/functions-compat",jw="@firebase/installations",Kw="@firebase/installations-compat",Jw="@firebase/messaging",zw="@firebase/messaging-compat",Ww="@firebase/performance",Qw="@firebase/performance-compat",$w="@firebase/remote-config",Yw="@firebase/remote-config-compat",Xw="@firebase/storage",Zw="@firebase/storage-compat",ey="@firebase/firestore",ty="@firebase/ai",ny="@firebase/firestore-compat",ry="firebase",sy="12.19.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var el="[DEFAULT]",iy={[Zu]:"fire-core",[Nw]:"fire-core-compat",[kw]:"fire-analytics",[Ow]:"fire-analytics-compat",[xw]:"fire-app-check",[Fw]:"fire-app-check-compat",[Lw]:"fire-auth",[Vw]:"fire-auth-compat",[Mw]:"fire-rtdb",[Gw]:"fire-data-connect",[Uw]:"fire-rtdb-compat",[Hw]:"fire-fn",[qw]:"fire-fn-compat",[jw]:"fire-iid",[Kw]:"fire-iid-compat",[Jw]:"fire-fcm",[zw]:"fire-fcm-compat",[Ww]:"fire-perf",[Qw]:"fire-perf-compat",[$w]:"fire-rc",[Yw]:"fire-rc-compat",[Xw]:"fire-gcs",[Zw]:"fire-gcs-compat",[ey]:"fire-fst",[ny]:"fire-fst-compat",[ty]:"fire-vertex","fire-js":"fire-js",[ry]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vi=new Map,oy=new Map,tl=new Map;function sg(n,e){try{n.container.addComponent(e)}catch(t){In.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ir(n){let e=n.name;if(tl.has(e))return In.debug(`There were multiple attempts to register component ${e}.`),!1;tl.set(e,n);for(let t of vi.values())sg(t,n);for(let t of oy.values())sg(t,n);return!0}function Si(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Pt(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ay={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Dn=new yn("app","Firebase",ay);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nl=class{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Ut("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Dn.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var or=sy;function il(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r={name:el,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Dn.create("bad-app-name",{appName:String(s)});if(t||(t=qu()),!t)throw Dn.create("no-options");let i=vi.get(s);if(i)if(hn(t,i.options)){if(hn(r,i.config))return i;throw Dn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw Dn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});let o=new pa(s);for(let u of tl.values())o.addComponent(u);let c=new nl(t,r,o);return vi.set(s,c),c}function ol(n=el){let e=vi.get(n);if(!e&&n===el&&qu())return il();if(!e)throw Dn.create("no-app",{appName:n});return e}function cg(){return Array.from(vi.values())}function Yt(n,e,t){let r=iy[n]??n;t&&(r+=`-${t}`);let s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){let o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),In.warn(o.join(" "));return}ir(new Ut(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cy="firebase-heartbeat-database",uy=1,bi="firebase-heartbeat-store",Yu=null;function ug(){return Yu||(Yu=ng(cy,uy,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(bi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Dn.create("idb-open",{originalErrorMessage:n.message})})),Yu}async function ly(n){try{let t=(await ug()).transaction(bi),r=await t.objectStore(bi).get(lg(n));return await t.done,r}catch(e){if(e instanceof Rt)In.warn(e.message);else{let t=Dn.create("idb-get",{originalErrorMessage:e?.message});In.warn(t.message)}}}async function ig(n,e){try{let r=(await ug()).transaction(bi,"readwrite");await r.objectStore(bi).put(e,lg(n)),await r.done}catch(t){if(t instanceof Rt)In.warn(t.message);else{let r=Dn.create("idb-set",{originalErrorMessage:t?.message});In.warn(r.message)}}}function lg(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var By=1024,hy=30,rl=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new sl(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=og();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>hy){let s=fy(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){In.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=og(),{heartbeatsToSend:t,unsentEntries:r}=dy(this._heartbeatsCache.heartbeats),s=Ai(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return In.warn(e),""}}};function og(){return new Date().toISOString().substring(0,10)}function dy(n,e=By){let t=[],r=n.slice();for(let s of n){let i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),ag(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ag(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var sl=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ju()?zp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await ly(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return ig(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return ig(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function ag(n){return Ai(JSON.stringify({version:2,heartbeats:n})).length}function fy(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function py(n){ir(new Ut("platform-logger",e=>new Xu(e),"PRIVATE")),ir(new Ut("heartbeat",e=>new rl(e),"PRIVATE")),Yt(Zu,rg,n),Yt(Zu,rg,"esm2020"),Yt("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */py("");/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var Sg=bg,Rg=new yn("auth","Firebase",bg());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ia=new sr("@firebase/auth");function ma(n,...e){Ia.logLevel<=ge.WARN&&Ia.warn(`Auth (${or}): ${n}`,...e)}function Ea(n,...e){Ia.logLevel<=ge.ERROR&&Ia.error(`Auth (${or}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ht(n,...e){throw Sl(n,...e)}function Xt(n,...e){return Sl(n,...e)}function za(n,e,t){let r={...Sg(),[e]:t};return new yn("auth","Firebase",r).create(e,{appName:n.name})}function Nr(n){return za(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function gy(n,e,t){let r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Ht(n,"argument-error"),za(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Sl(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Rg.create(n,...e)}function ne(n,e,...t){if(!n)throw Sl(e,...t)}function fn(n){let e="INTERNAL ASSERTION FAILED: "+n;throw Ea(e),new Error(e)}function An(n,e){n||fn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hl(){return typeof self<"u"&&self.location?.href||""}function Cy(){return Bg()==="http:"||Bg()==="https:"}function Bg(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function my(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Cy()||qp()||"connection"in navigator)?navigator.onLine:!0}function Ey(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Or=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,An(t>e,"Short delay should be less than long delay!"),this.isMobile=Up()||jp()}get(){return my()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(n,e){An(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ta=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;fn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;fn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;fn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _y={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],yy=new Or(3e4,6e4);function rt(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function lt(n,e,t,r,s={}){return Pg(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});let c=Es({...o,key:n.config.apiKey}).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);let l={method:e,headers:u,...i};return Hp()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Rr(n.emulatorConfig.host)&&(l.credentials="include"),Ta.fetch()(await Ng(n,n.config.apiHost,t,c),l)})}async function Pg(n,e,t){n._canInitEmulator=!1;let r={..._y,...e};try{let s=new dl(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let o=await i.json();if("needConfirmation"in o)throw Pi(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{let c=i.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Pi(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Pi(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw Pi(n,"user-disabled",o);let h=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw za(n,h,l);Ht(n,h)}}catch(s){if(s instanceof Rt)throw s;Ht(n,"network-request-failed",{message:String(s)})}}async function Mr(n,e,t,r,s={}){let i=await lt(n,e,t,r,s);return"mfaPendingCredential"in i&&Ht(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Ng(n,e,t,r){let s=`${e}${t}?${r}`,i=n,o=i.config.emulator?Rl(n.config,s):`${n.config.apiScheme}://${s}`;return wy.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function Dy(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var dl=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Xt(this.auth,"network-request-failed")),yy.get())})}};function Pi(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let s=Xt(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(n){return n!==void 0&&n.enterprise!==void 0}var Aa=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Dy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Og(n,e){return lt(n,"GET","/v2/recaptchaConfig",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Iy(n,e){return lt(n,"POST","/v1/accounts:delete",e)}async function va(n,e){return lt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ni(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kg(n,e=!1){let t=Ge(n),r=await t.getIdToken(e),s=Pl(r);ne(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let i=typeof s.firebase=="object"?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:r,authTime:Ni(al(s.auth_time)),issuedAtTime:Ni(al(s.iat)),expirationTime:Ni(al(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}function al(n){return Number(n)*1e3}function Pl(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ea("JWT malformed, contained fewer than 3 sections"),null;try{let s=ha(t);return s?JSON.parse(s):(Ea("Failed to decode base64 JWT payload"),null)}catch(s){return Ea("Caught error parsing JWT payload as JSON",s?.toString()),null}}function dg(n){let e=Pl(n);return ne(e,"internal-error"),ne(typeof e.exp<"u","internal-error"),ne(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Li(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Rt&&Ty(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ty({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fl=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Vi=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ni(this.lastLoginAt),this.creationTime=Ni(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ba(n){let e=n.auth,t=await n.getIdToken(),r=await Li(n,va(e,{idToken:t}));ne(r?.users.length,e,"internal-error");let s=r.users[0];n._notifyReloadListener(s);let i=s.providerUserInfo?.length?xg(s.providerUserInfo):[],o=Ay(n.providerData,i),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!o?.length,l=c?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Vi(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,h)}async function Fg(n){let e=Ge(n);await ba(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ay(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function xg(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vy(n,e){let t=await Pg(n,{},async()=>{let r=Es({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await Ng(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";let u={method:"POST",headers:c,body:r};return n.emulatorConfig&&Rr(n.emulatorConfig.host)&&(u.credentials="include"),Ta.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function by(n,e){return lt(n,"POST","/v2/accounts:revokeToken",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oi=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ne(e.idToken,"internal-error"),ne(typeof e.idToken<"u","internal-error"),ne(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):dg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ne(e.length!==0,"internal-error");let t=dg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ne(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:s,expiresIn:i}=await vy(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new n;return r&&(ne(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(ne(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(ne(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return fn("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ar(n,e){ne(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var cr=class n{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new fl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Vi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await Li(this,this.stsTokenManager.getToken(this.auth,e));return ne(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return kg(this,e)}reload(){return Fg(this)}_assign(e){this!==e&&(ne(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){ne(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await ba(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Pt(this.auth.app))return Promise.reject(Nr(this.auth));let e=await this.getIdToken();return await Li(this,Iy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:f,emailVerified:g,isAnonymous:v,providerData:R,stsTokenManager:b}=t;ne(f&&b,e,"internal-error");let G=Oi.fromJSON(this.name,b);ne(typeof f=="string",e,"internal-error"),ar(r,e.name),ar(s,e.name),ne(typeof g=="boolean",e,"internal-error"),ne(typeof v=="boolean",e,"internal-error"),ar(i,e.name),ar(o,e.name),ar(c,e.name),ar(u,e.name),ar(l,e.name),ar(h,e.name);let U=new n({uid:f,auth:e,email:s,emailVerified:g,displayName:r,isAnonymous:v,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:G,createdAt:l,lastLoginAt:h});return R&&Array.isArray(R)&&(U.providerData=R.map(ae=>({...ae}))),u&&(U._redirectEventId=u),U}static async _fromIdTokenResponse(e,t,r=!1){let s=new Oi;s.updateFromServerResponse(t);let i=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await ba(i),i}static async _fromGetAccountInfoResponse(e,t,r){let s=t.users[0];ne(s.localId!==void 0,"internal-error");let i=s.providerUserInfo!==void 0?xg(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!i?.length,c=new Oi;c.updateFromIdToken(r);let u=new n({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Vi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(u,l),u}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fg=new Map;function Tn(n){An(n instanceof Function,"Expected a class definition");let e=fg.get(n);return e?(An(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,fg.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Sa=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Sa.type="NONE";var pl=Sa;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(n,e,t){return`firebase:${n}:${e}:${t}`}var ki=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:s,name:i}=this.auth;this.fullUserKey=_a(this.userKey,s.apiKey,i),this.fullPersistenceKey=_a("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await va(this.auth,{idToken:e}).catch(()=>{});return t?cr._fromGetAccountInfoResponse(this.auth,t,e):null}return cr._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new n(Tn(pl),e,r);let s=(await Promise.all(t.map(async l=>{try{if(await l._isAvailable())return l}catch{return}}))).filter(l=>l),i=s[0]||Tn(pl),o=_a(r,e.config.apiKey,e.name),c=null;for(let l of t)try{let h=await l._get(o);if(h){let f;if(typeof h=="string"){let g=await va(e,{idToken:h}).catch(()=>{});if(!g)break;f=await cr._fromGetAccountInfoResponse(e,g,h)}else f=cr._fromJSON(e,h);l!==i&&(c=f),i=l;break}}catch{}let u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new n(i,e,r):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new n(i,e,r))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pg(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Gg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Lg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hg(e))return"Blackberry";if(qg(e))return"Webos";if(Vg(e))return"Safari";if((e.includes("chrome/")||Mg(e))&&!e.includes("edge/"))return"Chrome";if(Ug(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Lg(n=nt()){return/firefox\//i.test(n)}function Vg(n=nt()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Mg(n=nt()){return/crios\//i.test(n)}function Gg(n=nt()){return/iemobile/i.test(n)}function Ug(n=nt()){return/android/i.test(n)}function Hg(n=nt()){return/blackberry/i.test(n)}function qg(n=nt()){return/webos/i.test(n)}function Nl(n=nt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Sy(n=nt()){return Nl(n)&&!!window.navigator?.standalone}function Ry(){return Kp()&&document.documentMode===10}function jg(n=nt()){return Nl(n)||Ug(n)||qg(n)||Hg(n)||/windows phone/i.test(n)||Gg(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kg(n,e=[]){let t;switch(n){case"Browser":t=pg(nt());break;case"Worker":t=`${pg(nt())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${or}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gl=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=i=>new Promise((o,c)=>{try{let u=e(i);o(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Py(n,e={}){return lt(n,"GET","/v2/passwordPolicy",rt(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ny=6,Cl=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Ny,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ml=class{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ra(this),this.idTokenSubscription=new Ra(this),this.beforeStateQueue=new gl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Rg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Tn(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await ki.create(this,e)}catch(r){ma(`Failed to initialize persistence: ${r}`),this.persistenceManager=await ki.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(r){ma(`Failed to initialize current user: ${r}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await va(this,{idToken:e}),r=await cr._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Pt(this.app)){let i=this.app.settings.authIdToken;return i?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=this.redirectUser?._redirectEventId,o=r?._redirectEventId,c=await this.tryRedirectSignIn(e);(!i||i===o)&&c?.user&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return ne(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ba(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Ey()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Pt(this.app))return Promise.reject(Nr(this));let t=e?Ge(e):null;return t&&ne(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ne(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Pt(this.app)?Promise.reject(Nr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Pt(this.app)?Promise.reject(Nr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Tn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await Py(this),t=new Cl(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new yn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await by(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&Tn(e)||this._popupRedirectResolver;ne(t,this,"argument-error"),this.redirectPersistenceManager=await ki.create(this,[Tn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};let i=typeof t=="function"?t:t.next.bind(t),o=!1,c=this._isInitialized?Promise.resolve():this._initializationPromise;if(ne(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}).catch(u=>{if(!o)if(typeof t!="function"&&t.error)t.error(u);else if(r)r(u);else throw u}),typeof t=="function"){let u=e.addObserver(t,r,s);return()=>{o=!0,u()}}else{let u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){let r=t?.message||String(t),s=za(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ne(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Kg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(Pt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&ma(`Error while retrieving App Check token: ${e.error}`),e?.token}};function Is(n){return Ge(n)}var Ra=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=Qp(t=>this.observer=t)}get next(){return ne(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Oy(n){Wa=n}function Jg(n){return Wa.loadJS(n)}function ky(){return Wa.recaptchaEnterpriseScript}function Fy(){return Wa.gapiScript}function zg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var El=class{constructor(){this.enterprise=new _l}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},_l=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xy="recaptcha-enterprise",Fi="NO_RECAPTCHA",gg="onFirebaseAuthREInstanceReady",Mi=class n{constructor(e){this.type=xy,this.auth=Is(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{Og(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{let l=new Aa(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){let u=window.grecaptcha;hg(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(Fi)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new El().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async c=>{if(!t&&hg(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=ky();u.length!==0&&(u+=c+`&onload=${gg}`),n.scriptInjectionDeferred=new ms,window[gg]=()=>{n.scriptInjectionDeferred?.resolve()},Jg(u).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{s(c,i,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}};Mi.scriptInjectionDeferred=null;async function Ri(n,e,t,r=!1,s=!1){let i=new Mi(n),o;if(s)o=Fi;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}let c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){let u=c.phoneEnrollmentInfo.phoneNumber,l=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){let u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function xi(n,e,t,r,s){if(s==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let i=await Ri(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await Ri(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(i)});else if(s==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let i=await Ri(n,e,t);return r(n,i).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let c=await Ri(n,e,t,!1,!0);return r(n,c)}return Promise.reject(o)})}else{let i=await Ri(n,e,t,!1,!0);return r(n,i)}else return Promise.reject(s+" provider is not supported.")}async function Ly(n){let e=Is(n),t=await Og(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Aa(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new Mi(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ol(n,e){let t=Si(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),i=t.getOptions();if(hn(i,e??{}))return s;Ht(s,"already-initialized")}return t.initialize({options:e})}function Vy(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Tn);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kr=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return fn("not implemented")}_getIdTokenResponse(e){return fn("not implemented")}_linkToIdToken(e,t){return fn("not implemented")}_getReauthenticationResolver(e){return fn("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function My(n,e){return lt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gy(n,e){return Mr(n,"POST","/v1/accounts:signInWithPassword",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uy(n,e){return Mr(n,"POST","/v1/accounts:signInWithEmailLink",rt(n,e))}async function Hy(n,e){return Mr(n,"POST","/v1/accounts:signInWithEmailLink",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Gi=class n extends kr{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return xi(e,t,"signInWithPassword",Gy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Uy(e,{email:this._email,oobCode:this._password});default:Ht(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return xi(e,r,"signUpPassword",My,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Hy(e,{idToken:t,email:this._email,oobCode:this._password});default:Ht(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ys(n,e){return Mr(n,"POST","/v1/accounts:signInWithIdp",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var qy="http://localhost",Fr=class n extends kr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ht("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;let o=new n(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return ys(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,ys(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,ys(e,t)}buildRequest(){let e={requestUri:qy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Es(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cg(n,e){return lt(n,"POST","/v1/accounts:sendVerificationCode",rt(n,e))}async function jy(n,e){return Mr(n,"POST","/v1/accounts:signInWithPhoneNumber",rt(n,e))}async function Ky(n,e){let t=await Mr(n,"POST","/v1/accounts:signInWithPhoneNumber",rt(n,e));if(t.temporaryProof)throw Pi(n,"account-exists-with-different-credential",t);return t}var Jy={USER_NOT_FOUND:"user-not-found"};async function zy(n,e){let t={...e,operation:"REAUTH"};return Mr(n,"POST","/v1/accounts:signInWithPhoneNumber",rt(n,t),Jy)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ui=class n extends kr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return jy(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Ky(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return zy(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i}=e;return!r&&!t&&!s&&!i?null:new n({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Qy(n){let e=_s(ws(n)).link,t=e?_s(ws(e)).deep_link_id:null,r=_s(ws(n)).deep_link_id;return(r?_s(ws(r)).link:null)||r||t||e||n}var Pa=class n{constructor(e){let t=_s(ws(e)),r=t.apiKey??null,s=t.oobCode??null,i=Wy(t.mode??null);ne(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=Qy(e);try{return new n(t)}catch{return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ds=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return Gi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=Pa.parseLink(t);return ne(r,"argument-error"),Gi._fromEmailAndCode(e,r.code,r.tenantId)}};Ds.PROVIDER_ID="password";Ds.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ds.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hi=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xr=class extends Hi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var qi=class n extends xr{constructor(){super("facebook.com")}static credential(e){return Fr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};qi.FACEBOOK_SIGN_IN_METHOD="facebook.com";qi.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Lr=class n extends xr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Fr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};Lr.GOOGLE_SIGN_IN_METHOD="google.com";Lr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ji=class n extends xr{constructor(){super("github.com")}static credential(e){return Fr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};ji.GITHUB_SIGN_IN_METHOD="github.com";ji.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ki=class n extends xr{constructor(){super("twitter.com")}static credential(e,t){return Fr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};Ki.TWITTER_SIGN_IN_METHOD="twitter.com";Ki.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ji=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){let i=await cr._fromIdTokenResponse(e,r,s),o=mg(r);return new n({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let s=mg(r);return new n({user:e,providerId:s,_tokenResponse:r,operationType:t})}};function mg(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wl=class n extends Rt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new n(e,t,r,s)}};function Wg(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?wl._fromErrorAndOperation(n,i,e,r):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $y(n,e,t=!1){let r=await Li(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Ji._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yy(n,e,t=!1){let{auth:r}=n;if(Pt(r.app))return Promise.reject(Nr(r));let s="reauthenticate";try{let i=await Li(n,Wg(r,s,e,n),t);ne(i.idToken,r,"internal-error");let o=Pl(i.idToken);ne(o,r,"internal-error");let{sub:c}=o;return ne(n.uid===c,r,"user-mismatch"),Ji._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&Ht(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xy(n,e,t=!1){if(Pt(n.app))return Promise.reject(Nr(n));let r="signIn",s=await Wg(n,r,e),i=await Ji._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kl(n,e,t,r){return Ge(n).onAuthStateChanged(e,t,r)}function Fl(n){return Ge(n).signOut()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eg(n,e){return lt(n,"POST","/v2/accounts/mfaEnrollment:start",rt(n,e))}function Zy(n,e){return lt(n,"POST","/v2/accounts/mfaEnrollment:finalize",rt(n,e))}function eD(n,e){return lt(n,"POST","/v2/accounts/mfaEnrollment:start",rt(n,e))}function tD(n,e){return lt(n,"POST","/v2/accounts/mfaEnrollment:finalize",rt(n,e))}var Na="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oa=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Na,"1"),this.storage.removeItem(Na),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nD=1e3,rD=10,ka=class extends Oa{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=jg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}let r=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);Ry()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,rD):s()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},nD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};ka.type="LOCAL";var xl=ka;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sD=1e3;function cl(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function ul(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var yl=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=ul(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:cl(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=ul(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=ul(e);if(window.cookieStore){let c=(l=>{let h=l.changed.find(g=>g.name===r);h&&t(h.value),l.deleted.find(g=>g.name===r)&&t(null)}),u=()=>window.cookieStore.removeEventListener("change",c);return this.listenerUnsubscribes.set(t,u),window.cookieStore.addEventListener("change",c)}let s=cl(r),i=setInterval(()=>{let c=cl(r);c!==s&&(t(c),s=c)},sD),o=()=>clearInterval(i);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};yl.type="COOKIE";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fa=class extends Oa{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};Fa.type="SESSION";var Qg=Fa;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iD(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xa=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});let c=Array.from(o).map(async l=>l(t.origin,i)),u=await iD(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};xa.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Dl=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{let l=Ll("",20);s.port1.start();let h=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(f){let g=f;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(g.data.response);break;default:clearTimeout(h),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(){return window}function oD(n){pn().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $g(){return typeof pn().WorkerGlobalScope<"u"&&typeof pn().importScripts=="function"}async function aD(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function cD(){return navigator?.serviceWorker?.controller||null}function uD(){return $g()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Yg="firebaseLocalStorageDb",lD=1,La="firebaseLocalStorage",Xg="fbase_key",Vr=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function Qa(n,e){return n.transaction([La],e?"readwrite":"readonly").objectStore(La)}function BD(){let n=indexedDB.deleteDatabase(Yg);return new Vr(n).toPromise()}function Zg(){let n=indexedDB.open(Yg,lD);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(La,{keyPath:Xg})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(La)?e(r):(r.close(),await BD(),e(await Zg()))})})}async function _g(n,e,t){let r=Qa(n,!0).put({[Xg]:e,value:t});return new Vr(r).toPromise()}async function hD(n,e){let t=Qa(n,!1).get(e),r=await new Vr(t).toPromise();return r===void 0?null:r.value}function wg(n,e){let t=Qa(n,!0).delete(e);return new Vr(t).toPromise()}var dD=800,fD=3,Va=class{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Zg(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>fD)throw r;if(this.dbPromise){let s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return $g()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=xa._getInstance(uD()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await aD(),!this.activeServiceWorker)return;this.sender=new Dl(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||cD()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await _g(e,Na,"1"),await wg(e,Na)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>_g(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>hD(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>wg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(s=>{let i=Qa(s,!1).getAll();return new Vr(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||ma(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),dD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}};Va.type="LOCAL";var Vl=Va;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yg(n,e){return lt(n,"POST","/v2/accounts/mfaSignIn:start",rt(n,e))}function pD(n,e){return lt(n,"POST","/v2/accounts/mfaSignIn:finalize",rt(n,e))}function gD(n,e){return lt(n,"POST","/v2/accounts/mfaSignIn:finalize",rt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yv=zg("rcb"),Dv=new Or(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wa="recaptcha";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CD(n,e,t){if(!n._getRecaptchaConfig())try{await Ly(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){let s=r.session;if("phoneNumber"in r){ne(s.type==="enroll",n,"internal-error");let i={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await xi(n,i,"mfaSmsEnrollment",async(l,h)=>{if(h.phoneEnrollmentInfo.captchaResponse===Fi){ne(t?.type===wa,l,"argument-error");let f=await ll(l,h,t);return Eg(l,f)}return Eg(l,h)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{ne(s.type==="signin",n,"internal-error");let i=r.multiFactorHint?.uid||r.multiFactorUid;ne(i,n,"missing-multi-factor-info");let o={mfaPendingCredential:s.credential,mfaEnrollmentId:i,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await xi(n,o,"mfaSmsSignIn",async(h,f)=>{if(f.phoneSignInInfo.captchaResponse===Fi){ne(t?.type===wa,h,"argument-error");let g=await ll(h,f,t);return yg(h,g)}return yg(h,f)},"PHONE_PROVIDER").catch(h=>Promise.reject(h))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await xi(n,s,"sendVerificationCode",async(u,l)=>{if(l.captchaResponse===Fi){ne(t?.type===wa,u,"argument-error");let h=await ll(u,l,t);return Cg(u,h)}return Cg(u,l)},"PHONE_PROVIDER").catch(u=>Promise.reject(u))).sessionInfo}}finally{t?._reset()}}async function ll(n,e,t){ne(t.type===wa,n,"argument-error");let r=await t.verify();ne(typeof r=="string",n,"argument-error");let s={...e};if("phoneEnrollmentInfo"in s){let i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,c=s.phoneEnrollmentInfo.clientType,u=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:r,captchaResponse:o,clientType:c,recaptchaVersion:u}}),s}else if("phoneSignInInfo"in s){let i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,c=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:i,clientType:o,recaptchaVersion:c}}),s}else return Object.assign(s,{recaptchaToken:r}),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zi=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=Is(e)}verifyPhoneNumber(e,t){return CD(this.auth,e,Ge(t))}static credential(e,t){return Ui._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?Ui._fromTokenResponse(t,r):null}};zi.PROVIDER_ID="phone";zi.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eC(n,e){return e?Tn(e):(ne(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wi=class extends kr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ys(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ys(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ys(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function mD(n){return Xy(n.auth,new Wi(n),n.bypassAuthState)}function ED(n){let{auth:e,user:t}=n;return ne(t,e,"internal-error"),Yy(t,new Wi(n),n.bypassAuthState)}async function _D(n){let{auth:e,user:t}=n;return ne(t,e,"internal-error"),$y(t,new Wi(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ma=class{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}let u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mD;case"linkViaPopup":case"linkViaRedirect":return _D;case"reauthViaPopup":case"reauthViaRedirect":return ED;default:Ht(this.auth,"internal-error")}}resolve(e){An(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){An(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wD=new Or(2e3,1e4);async function Ml(n,e,t){if(Pt(n.app))return Promise.reject(Xt(n,"operation-not-supported-in-this-environment"));let r=Is(n);gy(n,e,Hi);let s=eC(r,t);return new Ga(r,"signInViaPopup",e,s).executeNotNull()}var Ga=class n extends Ma{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return ne(e,this.auth,"internal-error"),e}async onExecution(){An(this.filter.length===1,"Popup operations only handle one event");let e=Ll();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Xt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(Xt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,wD.get())};e()}};Ga.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yD="pendingRedirect",ya=new Map,Il=class extends Ma{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=ya.get(this.auth._key());if(!e){try{let r=await DD(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}ya.set(this.auth._key(),e)}return this.bypassAuthState||ya.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function DD(n,e){let t=AD(e),r=TD(n);if(!await r._isAvailable())return!1;let s=await r._get(t)==="true";return await r._remove(t),s}function ID(n,e){ya.set(n._key(),e)}function TD(n){return Tn(n._redirectPersistence)}function AD(n){return _a(yD,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vD(n,e,t=!1){if(Pt(n.app))return Promise.reject(Nr(n));let r=Is(n),s=eC(r,e),o=await new Il(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bD=600*1e3,Tl=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!SD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!tC(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(Xt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bD&&this.cachedEventUids.clear(),this.cachedEventUids.has(Dg(e))}saveEventToCache(e){this.cachedEventUids.add(Dg(e)),this.lastProcessedEventTime=Date.now()}};function Dg(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function tC({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function SD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return tC(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function RD(n,e={}){return lt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var PD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ND=/^https?/;async function OD(n){if(n.config.emulator)return;let{authorizedDomains:e}=await RD(n);for(let t of e)try{if(kD(t))return}catch{}Ht(n,"unauthorized-domain")}function kD(n){let e=hl(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!ND.test(t))return!1;if(PD.test(n))return r===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var FD=new Or(3e4,6e4);function Ig(){let n=pn().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function xD(n){return new Promise((e,t)=>{function r(){Ig(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ig(),t(Xt(n,"network-request-failed"))},timeout:FD.get()})}if(pn().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(pn().gapi?.load)r();else{let s=zg("iframefcb");return pn()[s]=()=>{gapi.load?r():t(Xt(n,"network-request-failed"))},Jg(`${Fy()}?onload=${s}`).catch(i=>t(i))}}).catch(e=>{throw Da=null,e})}var Da=null;function LD(n){return Da=Da||xD(n),Da}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var VD=new Or(5e3,15e3),MD="__/auth/iframe",GD="emulator/auth/iframe",UD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},HD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function qD(n){let e=n.config;ne(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?Rl(e,GD):`https://${n.config.authDomain}/${MD}`,r={apiKey:e.apiKey,appName:n.name,v:or},s=HD.get(n.config.apiHost);s&&(r.eid=s);let i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Es(r).slice(1)}`}async function jD(n){let e=await LD(n),t=pn().gapi;return ne(t,n,"internal-error"),e.open({where:document.body,url:qD(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:UD,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});let o=Xt(n,"network-request-failed"),c=pn().setTimeout(()=>{i(o)},VD.get());function u(){pn().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var KD={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},JD=500,zD=600,WD="_blank",QD="http://localhost",Ua=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function $D(n,e,t,r=JD,s=zD){let i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),c="",u={...KD,width:r.toString(),height:s.toString(),top:i,left:o},l=nt().toLowerCase();t&&(c=Mg(l)?WD:t),Lg(l)&&(e=e||QD,u.scrollbars="yes");let h=Object.entries(u).reduce((g,[v,R])=>`${g}${v}=${R},`,"");if(Sy(l)&&c!=="_self")return YD(e||"",c),new Ua(null);let f=window.open(e||"",c,h);ne(f,n,"popup-blocked");try{f.focus()}catch{}return new Ua(f)}function YD(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var XD="__/auth/handler",ZD="emulator/auth/handler",eI=encodeURIComponent("fac");async function Tg(n,e,t,r,s,i){ne(n.config.authDomain,n,"auth-domain-config-required"),ne(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:or,eventId:s};if(e instanceof Hi){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Wp(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[h,f]of Object.entries(i||{}))o[h]=f}if(e instanceof xr){let h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);let c=o;for(let h of Object.keys(c))c[h]===void 0&&delete c[h];let u=await n._getAppCheckToken(),l=u?`#${eI}=${encodeURIComponent(u)}`:"";return`${tI(n)}?${Es(c).slice(1)}${l}`}function tI({config:n}){return n.emulator?Rl(n,ZD):`https://${n.authDomain}/${XD}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Bl="webStorageSupport",Al=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Qg,this._completeRedirectFn=vD,this._overrideRedirectResult=ID}async _openPopup(e,t,r,s){An(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let i=await Tg(e,t,r,hl(),s);return $D(e,i,Ll())}async _openRedirect(e,t,r,s){await this._originValidation(e);let i=await Tg(e,t,r,hl(),s);return oD(i),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(An(i,"If manager is not set, promise should be"),i)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await jD(e),r=new Tl(e);return t.register("authEvent",s=>(ne(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Bl,{type:Bl},s=>{let i=s?.[0]?.[Bl];i!==void 0&&t(!!i),Ht(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=OD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return jg()||Vg()||Nl()}},Gl=Al,Ha=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return fn("unexpected MultiFactorSessionType")}}},vl=class n extends Ha{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return Zy(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return pD(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},qa=class{constructor(){}static assertion(e){return vl._fromCredential(e)}};qa.FACTOR_ID="phone";var ja=class{static assertionForEnrollment(e,t){return Ka._fromSecret(e,t)}static assertionForSignIn(e,t){return Ka._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;ne(typeof t.user?.auth<"u","internal-error");let r=await eD(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return Ja._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}};ja.FACTOR_ID="totp";var Ka=class n extends Ha{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return ne(typeof this.secret<"u",e,"argument-error"),tD(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){ne(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return gD(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},Ja=class n{constructor(e,t,r,s,i,o,c){this.sessionInfo=o,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(Ca(e)||Ca(t))&&(r=!0),r&&(Ca(e)&&(e=this.auth.currentUser?.email||"unknownuser"),Ca(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function Ca(n){return typeof n>"u"||n?.length===0}var Ag="@firebase/auth",vg="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bl=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ne(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nI(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function rI(n){ir(new Ut("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;ne(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});let u={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kg(n)},l=new ml(r,s,i,u);return Vy(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ir(new Ut("auth-internal",e=>{let t=Is(e.getProvider("auth").getImmediate());return(r=>new bl(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Yt(Ag,vg,nI(n)),Yt(Ag,vg,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sI=300,Iv=Mp("authIdTokenMaxAge")||sI;function iI(){return document.getElementsByTagName("head")?.[0]??document}Oy({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{let i=Xt("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",iI().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});rI("Browser");var nC=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},rC={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var vn,Ul;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,m){function y(){}y.prototype=m.prototype,A.F=m.prototype,A.prototype=new y,A.prototype.constructor=A,A.D=function(I,D,w){for(var C=Array(arguments.length-2),re=2;re<arguments.length;re++)C[re-2]=arguments[re];return m.prototype[D].apply(I,C)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,m,y){y||(y=0);let I=Array(16);if(typeof m=="string")for(var D=0;D<16;++D)I[D]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(D=0;D<16;++D)I[D]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=A.g[0],y=A.g[1],D=A.g[2];let w=A.g[3],C;C=m+(w^y&(D^w))+I[0]+3614090360&4294967295,m=y+(C<<7&4294967295|C>>>25),C=w+(D^m&(y^D))+I[1]+3905402710&4294967295,w=m+(C<<12&4294967295|C>>>20),C=D+(y^w&(m^y))+I[2]+606105819&4294967295,D=w+(C<<17&4294967295|C>>>15),C=y+(m^D&(w^m))+I[3]+3250441966&4294967295,y=D+(C<<22&4294967295|C>>>10),C=m+(w^y&(D^w))+I[4]+4118548399&4294967295,m=y+(C<<7&4294967295|C>>>25),C=w+(D^m&(y^D))+I[5]+1200080426&4294967295,w=m+(C<<12&4294967295|C>>>20),C=D+(y^w&(m^y))+I[6]+2821735955&4294967295,D=w+(C<<17&4294967295|C>>>15),C=y+(m^D&(w^m))+I[7]+4249261313&4294967295,y=D+(C<<22&4294967295|C>>>10),C=m+(w^y&(D^w))+I[8]+1770035416&4294967295,m=y+(C<<7&4294967295|C>>>25),C=w+(D^m&(y^D))+I[9]+2336552879&4294967295,w=m+(C<<12&4294967295|C>>>20),C=D+(y^w&(m^y))+I[10]+4294925233&4294967295,D=w+(C<<17&4294967295|C>>>15),C=y+(m^D&(w^m))+I[11]+2304563134&4294967295,y=D+(C<<22&4294967295|C>>>10),C=m+(w^y&(D^w))+I[12]+1804603682&4294967295,m=y+(C<<7&4294967295|C>>>25),C=w+(D^m&(y^D))+I[13]+4254626195&4294967295,w=m+(C<<12&4294967295|C>>>20),C=D+(y^w&(m^y))+I[14]+2792965006&4294967295,D=w+(C<<17&4294967295|C>>>15),C=y+(m^D&(w^m))+I[15]+1236535329&4294967295,y=D+(C<<22&4294967295|C>>>10),C=m+(D^w&(y^D))+I[1]+4129170786&4294967295,m=y+(C<<5&4294967295|C>>>27),C=w+(y^D&(m^y))+I[6]+3225465664&4294967295,w=m+(C<<9&4294967295|C>>>23),C=D+(m^y&(w^m))+I[11]+643717713&4294967295,D=w+(C<<14&4294967295|C>>>18),C=y+(w^m&(D^w))+I[0]+3921069994&4294967295,y=D+(C<<20&4294967295|C>>>12),C=m+(D^w&(y^D))+I[5]+3593408605&4294967295,m=y+(C<<5&4294967295|C>>>27),C=w+(y^D&(m^y))+I[10]+38016083&4294967295,w=m+(C<<9&4294967295|C>>>23),C=D+(m^y&(w^m))+I[15]+3634488961&4294967295,D=w+(C<<14&4294967295|C>>>18),C=y+(w^m&(D^w))+I[4]+3889429448&4294967295,y=D+(C<<20&4294967295|C>>>12),C=m+(D^w&(y^D))+I[9]+568446438&4294967295,m=y+(C<<5&4294967295|C>>>27),C=w+(y^D&(m^y))+I[14]+3275163606&4294967295,w=m+(C<<9&4294967295|C>>>23),C=D+(m^y&(w^m))+I[3]+4107603335&4294967295,D=w+(C<<14&4294967295|C>>>18),C=y+(w^m&(D^w))+I[8]+1163531501&4294967295,y=D+(C<<20&4294967295|C>>>12),C=m+(D^w&(y^D))+I[13]+2850285829&4294967295,m=y+(C<<5&4294967295|C>>>27),C=w+(y^D&(m^y))+I[2]+4243563512&4294967295,w=m+(C<<9&4294967295|C>>>23),C=D+(m^y&(w^m))+I[7]+1735328473&4294967295,D=w+(C<<14&4294967295|C>>>18),C=y+(w^m&(D^w))+I[12]+2368359562&4294967295,y=D+(C<<20&4294967295|C>>>12),C=m+(y^D^w)+I[5]+4294588738&4294967295,m=y+(C<<4&4294967295|C>>>28),C=w+(m^y^D)+I[8]+2272392833&4294967295,w=m+(C<<11&4294967295|C>>>21),C=D+(w^m^y)+I[11]+1839030562&4294967295,D=w+(C<<16&4294967295|C>>>16),C=y+(D^w^m)+I[14]+4259657740&4294967295,y=D+(C<<23&4294967295|C>>>9),C=m+(y^D^w)+I[1]+2763975236&4294967295,m=y+(C<<4&4294967295|C>>>28),C=w+(m^y^D)+I[4]+1272893353&4294967295,w=m+(C<<11&4294967295|C>>>21),C=D+(w^m^y)+I[7]+4139469664&4294967295,D=w+(C<<16&4294967295|C>>>16),C=y+(D^w^m)+I[10]+3200236656&4294967295,y=D+(C<<23&4294967295|C>>>9),C=m+(y^D^w)+I[13]+681279174&4294967295,m=y+(C<<4&4294967295|C>>>28),C=w+(m^y^D)+I[0]+3936430074&4294967295,w=m+(C<<11&4294967295|C>>>21),C=D+(w^m^y)+I[3]+3572445317&4294967295,D=w+(C<<16&4294967295|C>>>16),C=y+(D^w^m)+I[6]+76029189&4294967295,y=D+(C<<23&4294967295|C>>>9),C=m+(y^D^w)+I[9]+3654602809&4294967295,m=y+(C<<4&4294967295|C>>>28),C=w+(m^y^D)+I[12]+3873151461&4294967295,w=m+(C<<11&4294967295|C>>>21),C=D+(w^m^y)+I[15]+530742520&4294967295,D=w+(C<<16&4294967295|C>>>16),C=y+(D^w^m)+I[2]+3299628645&4294967295,y=D+(C<<23&4294967295|C>>>9),C=m+(D^(y|~w))+I[0]+4096336452&4294967295,m=y+(C<<6&4294967295|C>>>26),C=w+(y^(m|~D))+I[7]+1126891415&4294967295,w=m+(C<<10&4294967295|C>>>22),C=D+(m^(w|~y))+I[14]+2878612391&4294967295,D=w+(C<<15&4294967295|C>>>17),C=y+(w^(D|~m))+I[5]+4237533241&4294967295,y=D+(C<<21&4294967295|C>>>11),C=m+(D^(y|~w))+I[12]+1700485571&4294967295,m=y+(C<<6&4294967295|C>>>26),C=w+(y^(m|~D))+I[3]+2399980690&4294967295,w=m+(C<<10&4294967295|C>>>22),C=D+(m^(w|~y))+I[10]+4293915773&4294967295,D=w+(C<<15&4294967295|C>>>17),C=y+(w^(D|~m))+I[1]+2240044497&4294967295,y=D+(C<<21&4294967295|C>>>11),C=m+(D^(y|~w))+I[8]+1873313359&4294967295,m=y+(C<<6&4294967295|C>>>26),C=w+(y^(m|~D))+I[15]+4264355552&4294967295,w=m+(C<<10&4294967295|C>>>22),C=D+(m^(w|~y))+I[6]+2734768916&4294967295,D=w+(C<<15&4294967295|C>>>17),C=y+(w^(D|~m))+I[13]+1309151649&4294967295,y=D+(C<<21&4294967295|C>>>11),C=m+(D^(y|~w))+I[4]+4149444226&4294967295,m=y+(C<<6&4294967295|C>>>26),C=w+(y^(m|~D))+I[11]+3174756917&4294967295,w=m+(C<<10&4294967295|C>>>22),C=D+(m^(w|~y))+I[2]+718787259&4294967295,D=w+(C<<15&4294967295|C>>>17),C=y+(w^(D|~m))+I[9]+3951481745&4294967295,A.g[0]=A.g[0]+m&4294967295,A.g[1]=A.g[1]+(D+(C<<21&4294967295|C>>>11))&4294967295,A.g[2]=A.g[2]+D&4294967295,A.g[3]=A.g[3]+w&4294967295}r.prototype.v=function(A,m){m===void 0&&(m=A.length);let y=m-this.blockSize,I=this.C,D=this.h,w=0;for(;w<m;){if(D==0)for(;w<=y;)s(this,A,w),w+=this.blockSize;if(typeof A=="string"){for(;w<m;)if(I[D++]=A.charCodeAt(w++),D==this.blockSize){s(this,I),D=0;break}}else for(;w<m;)if(I[D++]=A[w++],D==this.blockSize){s(this,I),D=0;break}}this.h=D,this.o+=m},r.prototype.A=function(){var A=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);A[0]=128;for(var m=1;m<A.length-8;++m)A[m]=0;m=this.o*8;for(var y=A.length-8;y<A.length;++y)A[y]=m&255,m/=256;for(this.v(A),A=Array(16),m=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)A[m++]=this.g[y]>>>I&255;return A};function i(A,m){var y=c;return Object.prototype.hasOwnProperty.call(y,A)?y[A]:y[A]=m(A)}function o(A,m){this.h=m;let y=[],I=!0;for(let D=A.length-1;D>=0;D--){let w=A[D]|0;I&&w==m||(y[D]=w,I=!1)}this.g=y}var c={};function u(A){return-128<=A&&A<128?i(A,function(m){return new o([m|0],m<0?-1:0)}):new o([A|0],A<0?-1:0)}function l(A){if(isNaN(A)||!isFinite(A))return f;if(A<0)return G(l(-A));let m=[],y=1;for(let I=0;A>=y;I++)m[I]=A/y|0,y*=4294967296;return new o(m,0)}function h(A,m){if(A.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(A.charAt(0)=="-")return G(h(A.substring(1),m));if(A.indexOf("-")>=0)throw Error('number format error: interior "-" character');let y=l(Math.pow(m,8)),I=f;for(let w=0;w<A.length;w+=8){var D=Math.min(8,A.length-w);let C=parseInt(A.substring(w,w+D),m);D<8?(D=l(Math.pow(m,D)),I=I.j(D).add(l(C))):(I=I.j(y),I=I.add(l(C)))}return I}var f=u(0),g=u(1),v=u(16777216);n=o.prototype,n.m=function(){if(b(this))return-G(this).m();let A=0,m=1;for(let y=0;y<this.g.length;y++){let I=this.i(y);A+=(I>=0?I:4294967296+I)*m,m*=4294967296}return A},n.toString=function(A){if(A=A||10,A<2||36<A)throw Error("radix out of range: "+A);if(R(this))return"0";if(b(this))return"-"+G(this).toString(A);let m=l(Math.pow(A,6));var y=this;let I="";for(;;){let D=we(y,m).g;y=U(y,D.j(m));let w=((y.g.length>0?y.g[0]:y.h)>>>0).toString(A);if(y=D,R(y))return w+I;for(;w.length<6;)w="0"+w;I=w+I}},n.i=function(A){return A<0?0:A<this.g.length?this.g[A]:this.h};function R(A){if(A.h!=0)return!1;for(let m=0;m<A.g.length;m++)if(A.g[m]!=0)return!1;return!0}function b(A){return A.h==-1}n.l=function(A){return A=U(this,A),b(A)?-1:R(A)?0:1};function G(A){let m=A.g.length,y=[];for(let I=0;I<m;I++)y[I]=~A.g[I];return new o(y,~A.h).add(g)}n.abs=function(){return b(this)?G(this):this},n.add=function(A){let m=Math.max(this.g.length,A.g.length),y=[],I=0;for(let D=0;D<=m;D++){let w=I+(this.i(D)&65535)+(A.i(D)&65535),C=(w>>>16)+(this.i(D)>>>16)+(A.i(D)>>>16);I=C>>>16,w&=65535,C&=65535,y[D]=C<<16|w}return new o(y,y[y.length-1]&-2147483648?-1:0)};function U(A,m){return A.add(G(m))}n.j=function(A){if(R(this)||R(A))return f;if(b(this))return b(A)?G(this).j(G(A)):G(G(this).j(A));if(b(A))return G(this.j(G(A)));if(this.l(v)<0&&A.l(v)<0)return l(this.m()*A.m());let m=this.g.length+A.g.length,y=[];for(var I=0;I<2*m;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let D=0;D<A.g.length;D++){let w=this.i(I)>>>16,C=this.i(I)&65535,re=A.i(D)>>>16,le=A.i(D)&65535;y[2*I+2*D]+=C*le,ae(y,2*I+2*D),y[2*I+2*D+1]+=w*le,ae(y,2*I+2*D+1),y[2*I+2*D+1]+=C*re,ae(y,2*I+2*D+1),y[2*I+2*D+2]+=w*re,ae(y,2*I+2*D+2)}for(A=0;A<m;A++)y[A]=y[2*A+1]<<16|y[2*A];for(A=m;A<2*m;A++)y[A]=0;return new o(y,0)};function ae(A,m){for(;(A[m]&65535)!=A[m];)A[m+1]+=A[m]>>>16,A[m]&=65535,m++}function ve(A,m){this.g=A,this.h=m}function we(A,m){if(R(m))throw Error("division by zero");if(R(A))return new ve(f,f);if(b(A))return m=we(G(A),m),new ve(G(m.g),G(m.h));if(b(m))return m=we(A,G(m)),new ve(G(m.g),m.h);if(A.g.length>30){if(b(A)||b(m))throw Error("slowDivide_ only works with positive integers.");for(var y=g,I=m;I.l(A)<=0;)y=Ve(y),I=Ve(I);var D=be(y,1),w=be(I,1);for(I=be(I,2),y=be(y,2);!R(I);){var C=w.add(I);C.l(A)<=0&&(D=D.add(y),w=C),I=be(I,1),y=be(y,1)}return m=U(A,D.j(m)),new ve(D,m)}for(D=f;A.l(m)>=0;){for(y=Math.max(1,Math.floor(A.m()/m.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),w=l(y),C=w.j(m);b(C)||C.l(A)>0;)y-=I,w=l(y),C=w.j(m);R(w)&&(w=g),D=D.add(w),A=U(A,C)}return new ve(D,A)}n.B=function(A){return we(this,A).h},n.and=function(A){let m=Math.max(this.g.length,A.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)&A.i(I);return new o(y,this.h&A.h)},n.or=function(A){let m=Math.max(this.g.length,A.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)|A.i(I);return new o(y,this.h|A.h)},n.xor=function(A){let m=Math.max(this.g.length,A.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)^A.i(I);return new o(y,this.h^A.h)};function Ve(A){let m=A.g.length+1,y=[];for(let I=0;I<m;I++)y[I]=A.i(I)<<1|A.i(I-1)>>>31;return new o(y,A.h)}function be(A,m){let y=m>>5;m%=32;let I=A.g.length-y,D=[];for(let w=0;w<I;w++)D[w]=m>0?A.i(w+y)>>>m|A.i(w+y+1)<<32-m:A.i(w+y);return new o(D,A.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Ul=rC.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=h,vn=rC.Integer=o}).apply(typeof nC<"u"?nC:typeof self<"u"?self:typeof window<"u"?window:{});var $a=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},bn={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Hl,oI,Ts,ql,Qi,Ya,jl,Kl,Jl;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof $a=="object"&&$a];for(var B=0;B<a.length;++B){var d=a[B];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(a,B){if(B)e:{var d=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var P=a[p];if(!(P in d))break e;d=d[P]}a=a[a.length-1],p=d[a],B=B(p),B!=p&&B!=null&&e(d,a,{configurable:!0,writable:!0,value:B})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(B){var d=[],p;for(p in B)Object.prototype.hasOwnProperty.call(B,p)&&d.push([p,B[p]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var B=typeof a;return B=="object"&&a!=null||B=="function"}function u(a,B,d){return a.call.apply(a.bind,arguments)}function l(a,B,d){return l=u,l.apply(null,arguments)}function h(a,B){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function f(a,B){function d(){}d.prototype=B.prototype,a.Z=B.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(p,P,N){for(var K=Array(arguments.length-2),de=2;de<arguments.length;de++)K[de-2]=arguments[de];return B.prototype[P].apply(p,K)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){let B=a.length;if(B>0){let d=Array(B);for(let p=0;p<B;p++)d[p]=a[p];return d}return[]}function R(a,B){for(let p=1;p<arguments.length;p++){let P=arguments[p];var d=typeof P;if(d=d!="object"?d:P?Array.isArray(P)?"array":d:"null",d=="array"||d=="object"&&typeof P.length=="number"){d=a.length||0;let N=P.length||0;a.length=d+N;for(let K=0;K<N;K++)a[d+K]=P[K]}else a.push(P)}}class b{constructor(B,d){this.i=B,this.j=d,this.h=0,this.g=null}get(){let B;return this.h>0?(this.h--,B=this.g,this.g=B.next,B.next=null):B=this.i(),B}}function G(a){o.setTimeout(()=>{throw a},0)}function U(){var a=A;let B=null;return a.g&&(B=a.g,a.g=a.g.next,a.g||(a.h=null),B.next=null),B}class ae{constructor(){this.h=this.g=null}add(B,d){let p=ve.get();p.set(B,d),this.h?this.h.next=p:this.g=p,this.h=p}}var ve=new b(()=>new we,a=>a.reset());class we{constructor(){this.next=this.g=this.h=null}set(B,d){this.h=B,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Ve,be=!1,A=new ae,m=()=>{let a=Promise.resolve(void 0);Ve=()=>{a.then(y)}};function y(){for(var a;a=U();){try{a.h.call(a.g)}catch(d){G(d)}var B=ve;B.j(a),B.h<100&&(B.h++,a.next=B.g,B.g=a)}be=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function D(a,B){this.type=a,this.g=this.target=B,this.defaultPrevented=!1}D.prototype.h=function(){this.defaultPrevented=!0};var w=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,B=Object.defineProperty({},"passive",{get:function(){a=!0}});try{let d=()=>{};o.addEventListener("test",d,B),o.removeEventListener("test",d,B)}catch{}return a})();function C(a){return/^[\s\xa0]*$/.test(a)}function re(a,B){D.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,B)}f(re,D),re.prototype.init=function(a,B){let d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=B,B=a.relatedTarget,B||(d=="mouseover"?B=a.fromElement:d=="mouseout"&&(B=a.toElement)),this.relatedTarget=B,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&re.Z.h.call(this)},re.prototype.h=function(){re.Z.h.call(this);let a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var le="closure_listenable_"+(Math.random()*1e6|0),pe=0;function Ae(a,B,d,p,P){this.listener=a,this.proxy=null,this.src=B,this.type=d,this.capture=!!p,this.ha=P,this.key=++pe,this.da=this.fa=!1}function L(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function M(a,B,d){for(let p in a)B.call(d,a[p],p,a)}function se(a,B){for(let d in a)B.call(void 0,a[d],d,a)}function $(a){let B={};for(let d in a)B[d]=a[d];return B}let ie="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Q(a,B){let d,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(d in p)a[d]=p[d];for(let N=0;N<ie.length;N++)d=ie[N],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function J(a){this.src=a,this.g={},this.h=0}J.prototype.add=function(a,B,d,p,P){let N=a.toString();a=this.g[N],a||(a=this.g[N]=[],this.h++);let K=Ee(a,B,p,P);return K>-1?(B=a[K],d||(B.fa=!1)):(B=new Ae(B,this.src,N,!!p,P),B.fa=d,a.push(B)),B};function fe(a,B){let d=B.type;if(d in a.g){var p=a.g[d],P=Array.prototype.indexOf.call(p,B,void 0),N;(N=P>=0)&&Array.prototype.splice.call(p,P,1),N&&(L(B),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Ee(a,B,d,p){for(let P=0;P<a.length;++P){let N=a[P];if(!N.da&&N.listener==B&&N.capture==!!d&&N.ha==p)return P}return-1}var he="closure_lm_"+(Math.random()*1e6|0),Se={};function Fe(a,B,d,p,P){if(Array.isArray(B)){for(let N=0;N<B.length;N++)Fe(a,B[N],d,p,P);return null}return d=Lf(d),a&&a[le]?a.J(B,d,c(p)?!!p.capture:!1,P):pt(a,B,d,!1,p,P)}function pt(a,B,d,p,P,N){if(!B)throw Error("Invalid event type");let K=c(P)?!!P.capture:!!P,de=yu(a);if(de||(a[he]=de=new J(a)),d=de.add(B,d,p,K,N),d.proxy)return d;if(p=$t(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)w||(P=K),P===void 0&&(P=!1),a.addEventListener(B.toString(),p,P);else if(a.attachEvent)a.attachEvent(fs(B.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function $t(){function a(d){return B.call(a.src,a.listener,d)}let B=Yn;return a}function un(a,B,d,p,P){if(Array.isArray(B))for(var N=0;N<B.length;N++)un(a,B[N],d,p,P);else p=c(p)?!!p.capture:!!p,d=Lf(d),a&&a[le]?(a=a.i,N=String(B).toString(),N in a.g&&(B=a.g[N],d=Ee(B,d,p,P),d>-1&&(L(B[d]),Array.prototype.splice.call(B,d,1),B.length==0&&(delete a.g[N],a.h--)))):a&&(a=yu(a))&&(B=a.g[B.toString()],a=-1,B&&(a=Ee(B,d,p,P)),(d=a>-1?B[a]:null)&&Gt(d))}function Gt(a){if(typeof a!="number"&&a&&!a.da){var B=a.src;if(B&&B[le])fe(B.i,a);else{var d=a.type,p=a.proxy;B.removeEventListener?B.removeEventListener(d,p,a.capture):B.detachEvent?B.detachEvent(fs(d),p):B.addListener&&B.removeListener&&B.removeListener(p),(d=yu(B))?(fe(d,a),d.h==0&&(d.src=null,B[he]=null)):L(a)}}}function fs(a){return a in Se?Se[a]:Se[a]="on"+a}function Yn(a,B){if(a.da)a=!0;else{B=new re(B,this);let d=a.listener,p=a.ha||a.src;a.fa&&Gt(a),a=d.call(p,B)}return a}function yu(a){return a=a[he],a instanceof J?a:null}var Du="__closure_events_fn_"+(Math.random()*1e9>>>0);function Lf(a){return typeof a=="function"?a:(a[Du]||(a[Du]=function(B){return a.handleEvent(B)}),a[Du])}function ut(){I.call(this),this.i=new J(this),this.M=this,this.G=null}f(ut,I),ut.prototype[le]=!0,ut.prototype.removeEventListener=function(a,B,d,p){un(this,a,B,d,p)};function gt(a,B){var d,p=a.G;if(p)for(d=[];p;p=p.G)d.push(p);if(a=a.M,p=B.type||B,typeof B=="string")B=new D(B,a);else if(B instanceof D)B.target=B.target||a;else{var P=B;B=new D(p,a),Q(B,P)}P=!0;let N,K;if(d)for(K=d.length-1;K>=0;K--)N=B.g=d[K],P=Zo(N,p,!0,B)&&P;if(N=B.g=a,P=Zo(N,p,!0,B)&&P,P=Zo(N,p,!1,B)&&P,d)for(K=0;K<d.length;K++)N=B.g=d[K],P=Zo(N,p,!1,B)&&P}ut.prototype.N=function(){if(ut.Z.N.call(this),this.i){var a=this.i;for(let B in a.g){let d=a.g[B];for(let p=0;p<d.length;p++)L(d[p]);delete a.g[B],a.h--}}this.G=null},ut.prototype.J=function(a,B,d,p){return this.i.add(String(a),B,!1,d,p)},ut.prototype.K=function(a,B,d,p){return this.i.add(String(a),B,!0,d,p)};function Zo(a,B,d,p){if(B=a.i.g[String(B)],!B)return!0;B=B.concat();let P=!0;for(let N=0;N<B.length;++N){let K=B[N];if(K&&!K.da&&K.capture==d){let de=K.listener,Ye=K.ha||K.src;K.fa&&fe(a.i,K),P=de.call(Ye,p)!==!1&&P}}return P&&!p.defaultPrevented}function k_(a,B){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(B)>2147483647?-1:o.setTimeout(a,B||0)}function Vf(a){a.g=k_(()=>{a.g=null,a.i&&(a.i=!1,Vf(a))},a.l);let B=a.h;a.h=null,a.m.apply(null,B)}class F_ extends I{constructor(B,d){super(),this.m=B,this.l=d,this.h=null,this.i=!1,this.g=null}j(B){this.h=arguments,this.g?this.i=!0:Vf(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function li(a){I.call(this),this.h=a,this.g={}}f(li,I);var Mf=[];function Gf(a){M(a.g,function(B,d){this.g.hasOwnProperty(d)&&Gt(B)},a),a.g={}}li.prototype.N=function(){li.Z.N.call(this),Gf(this)},li.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Iu=o.JSON.stringify,x_=o.JSON.parse,L_=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Uf(){}function Hf(){}var Bi={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Tu(){D.call(this,"d")}f(Tu,D);function Au(){D.call(this,"c")}f(Au,D);var Tr={},qf=null;function ea(){return qf=qf||new ut}Tr.Ia="serverreachability";function jf(a){D.call(this,Tr.Ia,a)}f(jf,D);function hi(a){let B=ea();gt(B,new jf(B))}Tr.STAT_EVENT="statevent";function Kf(a,B){D.call(this,Tr.STAT_EVENT,a),this.stat=B}f(Kf,D);function Ct(a){let B=ea();gt(B,new Kf(B,a))}Tr.Ja="timingevent";function Jf(a,B){D.call(this,Tr.Ja,a),this.size=B}f(Jf,D);function di(a,B){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},B)}function fi(){this.g=!0}fi.prototype.ua=function(){this.g=!1};function V_(a,B,d,p,P,N){a.info(function(){if(a.g)if(N){var K="",de=N.split("&");for(let Re=0;Re<de.length;Re++){var Ye=de[Re].split("=");if(Ye.length>1){let tt=Ye[0];Ye=Ye[1];let Bn=tt.split("_");K=Bn.length>=2&&Bn[1]=="type"?K+(tt+"="+Ye+"&"):K+(tt+"=redacted&")}}}else K=null;else K=N;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+B+`
`+d+`
`+K})}function M_(a,B,d,p,P,N,K){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+B+`
`+d+`
`+N+" "+K})}function ps(a,B,d,p){a.info(function(){return"XMLHTTP TEXT ("+B+"): "+U_(a,d)+(p?" "+p:"")})}function G_(a,B){a.info(function(){return"TIMEOUT: "+B})}fi.prototype.info=function(){};function U_(a,B){if(!a.g)return B;if(!B)return null;try{let N=JSON.parse(B);if(N){for(a=0;a<N.length;a++)if(Array.isArray(N[a])){var d=N[a];if(!(d.length<2)){var p=d[1];if(Array.isArray(p)&&!(p.length<1)){var P=p[0];if(P!="noop"&&P!="stop"&&P!="close")for(let K=1;K<p.length;K++)p[K]=""}}}}return Iu(N)}catch{return B}}var ta={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},zf={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Wf;function vu(){}f(vu,Uf),vu.prototype.g=function(){return new XMLHttpRequest},Wf=new vu;function pi(a){return encodeURIComponent(String(a))}function H_(a){var B=1;a=a.split(":");let d=[];for(;B>0&&a.length;)d.push(a.shift()),B--;return a.length&&d.push(a.join(":")),d}function Xn(a,B,d,p){this.j=a,this.i=B,this.l=d,this.S=p||1,this.V=new li(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Qf}function Qf(){this.i=null,this.g="",this.h=!1}var $f={},bu={};function Su(a,B,d){a.M=1,a.A=ra(ln(B)),a.u=d,a.R=!0,Yf(a,null)}function Yf(a,B){a.F=Date.now(),na(a),a.B=ln(a.A);var d=a.B,p=a.S;Array.isArray(p)||(p=[String(p)]),lp(d.i,"t",p),a.C=0,d=a.j.L,a.h=new Qf,a.g=bp(a.j,d?B:null,!a.u),a.P>0&&(a.O=new F_(l(a.Y,a,a.g),a.P)),B=a.V,d=a.g,p=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(Mf[0]=P.toString()),P=Mf);for(let N=0;N<P.length;N++){let K=Fe(d,P[N],p||B.handleEvent,!1,B.h||B);if(!K)break;B.g[K.key]=K}B=a.J?$(a.J):{},a.u?(a.v||(a.v="POST"),B["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,B)):(a.v="GET",a.g.ea(a.B,a.v,null,B)),hi(),V_(a.i,a.v,a.B,a.l,a.S,a.u)}Xn.prototype.ba=function(a){a=a.target;let B=this.O;B&&tr(a)==3?B.j():this.Y(a)},Xn.prototype.Y=function(a){try{if(a==this.g)e:{let de=tr(this.g),Ye=this.g.ya(),Re=this.g.ca();if(!(de<3)&&(de!=3||this.g&&(this.h.h||this.g.la()||Cp(this.g)))){this.K||de!=4||Ye==7||(Ye==8||Re<=0?hi(3):hi(2)),Ru(this);var B=this.g.ca();this.X=B;var d=q_(this);if(this.o=B==200,M_(this.i,this.v,this.B,this.l,this.S,de,B),this.o){if(this.U&&!this.L){t:{if(this.g){var p,P=this.g;if((p=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(p)){var N=p;break t}}N=null}if(a=N)ps(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Pu(this,a);else{this.o=!1,this.m=3,Ct(12),Ar(this),gi(this);break e}}if(this.R){a=!0;let tt;for(;!this.K&&this.C<d.length;)if(tt=j_(this,d),tt==bu){de==4&&(this.m=4,Ct(14),a=!1),ps(this.i,this.l,null,"[Incomplete Response]");break}else if(tt==$f){this.m=4,Ct(15),ps(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else ps(this.i,this.l,tt,null),Pu(this,tt);if(Xf(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),de!=4||d.length!=0||this.h.h||(this.m=1,Ct(16),a=!1),this.o=this.o&&a,!a)ps(this.i,this.l,d,"[Invalid Chunked Response]"),Ar(this),gi(this);else if(d.length>0&&!this.W){this.W=!0;var K=this.j;K.g==this&&K.aa&&!K.P&&(K.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Vu(K),K.P=!0,Ct(11))}}else ps(this.i,this.l,d,null),Pu(this,d);de==4&&Ar(this),this.o&&!this.K&&(de==4?Ip(this.j,this):(this.o=!1,na(this)))}else sw(this.g),B==400&&d.indexOf("Unknown SID")>0?(this.m=3,Ct(12)):(this.m=0,Ct(13)),Ar(this),gi(this)}}}catch{}};function q_(a){if(!Xf(a))return a.g.la();let B=Cp(a.g);if(B==="")return"";let d="",p=B.length,P=tr(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Ar(a),gi(a),"";a.h.i=new o.TextDecoder}for(let N=0;N<p;N++)a.h.h=!0,d+=a.h.i.decode(B[N],{stream:!(P&&N==p-1)});return B.length=0,a.h.g+=d,a.C=0,a.h.g}function Xf(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function j_(a,B){var d=a.C,p=B.indexOf(`
`,d);return p==-1?bu:(d=Number(B.substring(d,p)),isNaN(d)?$f:(p+=1,p+d>B.length?bu:(B=B.slice(p,p+d),a.C=p+d,B)))}Xn.prototype.cancel=function(){this.K=!0,Ar(this)};function na(a){a.T=Date.now()+a.H,Zf(a,a.H)}function Zf(a,B){if(a.D!=null)throw Error("WatchDog timer not null");a.D=di(l(a.aa,a),B)}function Ru(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Xn.prototype.aa=function(){this.D=null;let a=Date.now();a-this.T>=0?(G_(this.i,this.B),this.M!=2&&(hi(),Ct(17)),Ar(this),this.m=2,gi(this)):Zf(this,this.T-a)};function gi(a){a.j.I==0||a.K||Ip(a.j,a)}function Ar(a){Ru(a);var B=a.O;B&&typeof B.dispose=="function"&&B.dispose(),a.O=null,Gf(a.V),a.g&&(B=a.g,a.g=null,B.abort(),B.dispose())}function Pu(a,B){try{var d=a.j;if(d.I!=0&&(d.g==a||Nu(d.h,a))){if(!a.L&&Nu(d.h,a)&&d.I==3){try{var p=d.Ba.g.parse(B)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)ua(d),aa(d);else break e;Lu(d),Ct(18)}}else d.xa=P[1],0<d.xa-d.K&&P[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=di(l(d.Va,d),6e3));np(d.h)<=1&&d.ta&&(d.ta=void 0)}else br(d,11)}else if((a.L||d.g==a)&&ua(d),!C(B))for(P=d.Ba.g.parse(B),B=0;B<P.length;B++){let Re=P[B],tt=Re[0];if(!(tt<=d.K))if(d.K=tt,Re=Re[1],d.I==2)if(Re[0]=="c"){d.M=Re[1],d.ba=Re[2];let Bn=Re[3];Bn!=null&&(d.ka=Bn,d.j.info("VER="+d.ka));let Sr=Re[4];Sr!=null&&(d.za=Sr,d.j.info("SVER="+d.za));let nr=Re[5];nr!=null&&typeof nr=="number"&&nr>0&&(p=1.5*nr,d.O=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;let rr=a.g;if(rr){let Ba=rr.g?rr.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ba){var N=p.h;N.g||Ba.indexOf("spdy")==-1&&Ba.indexOf("quic")==-1&&Ba.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(Ou(N,N.h),N.h=null))}if(p.G){let Mu=rr.g?rr.g.getResponseHeader("X-HTTP-Session-Id"):null;Mu&&(p.wa=Mu,xe(p.J,p.G,Mu))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),p=d;var K=a;if(p.na=vp(p,p.L?p.ba:null,p.W),K.L){rp(p.h,K);var de=K,Ye=p.O;Ye&&(de.H=Ye),de.D&&(Ru(de),na(de)),p.g=K}else yp(p);d.i.length>0&&ca(d)}else Re[0]!="stop"&&Re[0]!="close"||br(d,7);else d.I==3&&(Re[0]=="stop"||Re[0]=="close"?Re[0]=="stop"?br(d,7):xu(d):Re[0]!="noop"&&d.l&&d.l.qa(Re),d.A=0)}}hi(4)}catch{}}var K_=class{constructor(a,B){this.g=a,this.map=B}};function ep(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function tp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function np(a){return a.h?1:a.g?a.g.size:0}function Nu(a,B){return a.h?a.h==B:a.g?a.g.has(B):!1}function Ou(a,B){a.g?a.g.add(B):a.h=B}function rp(a,B){a.h&&a.h==B?a.h=null:a.g&&a.g.has(B)&&a.g.delete(B)}ep.prototype.cancel=function(){if(this.i=sp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let a of this.g.values())a.cancel();this.g.clear()}};function sp(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let B=a.i;for(let d of a.g.values())B=B.concat(d.G);return B}return v(a.i)}var ip=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function J_(a,B){if(a){a=a.split("&");for(let d=0;d<a.length;d++){let p=a[d].indexOf("="),P,N=null;p>=0?(P=a[d].substring(0,p),N=a[d].substring(p+1)):P=a[d],B(P,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Zn(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let B;a instanceof Zn?(this.l=a.l,Ci(this,a.j),this.o=a.o,this.g=a.g,mi(this,a.u),this.h=a.h,ku(this,Bp(a.i)),this.m=a.m):a&&(B=String(a).match(ip))?(this.l=!1,Ci(this,B[1]||"",!0),this.o=Ei(B[2]||""),this.g=Ei(B[3]||"",!0),mi(this,B[4]),this.h=Ei(B[5]||"",!0),ku(this,B[6]||"",!0),this.m=Ei(B[7]||"")):(this.l=!1,this.i=new wi(null,this.l))}Zn.prototype.toString=function(){let a=[];var B=this.j;B&&a.push(_i(B,op,!0),":");var d=this.g;return(d||B=="file")&&(a.push("//"),(B=this.o)&&a.push(_i(B,op,!0),"@"),a.push(pi(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(_i(d,d.charAt(0)=="/"?Q_:W_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",_i(d,Y_)),a.join("")},Zn.prototype.resolve=function(a){let B=ln(this),d=!!a.j;d?Ci(B,a.j):d=!!a.o,d?B.o=a.o:d=!!a.g,d?B.g=a.g:d=a.u!=null;var p=a.h;if(d)mi(B,a.u);else if(d=!!a.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var P=B.h.lastIndexOf("/");P!=-1&&(p=B.h.slice(0,P+1)+p)}if(P=p,P==".."||P==".")p="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){p=P.lastIndexOf("/",0)==0,P=P.split("/");let N=[];for(let K=0;K<P.length;){let de=P[K++];de=="."?p&&K==P.length&&N.push(""):de==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),p&&K==P.length&&N.push("")):(N.push(de),p=!0)}p=N.join("/")}else p=P}return d?B.h=p:d=a.i.toString()!=="",d?ku(B,Bp(a.i)):d=!!a.m,d&&(B.m=a.m),B};function ln(a){return new Zn(a)}function Ci(a,B,d){a.j=d?Ei(B,!0):B,a.j&&(a.j=a.j.replace(/:$/,""))}function mi(a,B){if(B){if(B=Number(B),isNaN(B)||B<0)throw Error("Bad port number "+B);a.u=B}else a.u=null}function ku(a,B,d){B instanceof wi?(a.i=B,X_(a.i,a.l)):(d||(B=_i(B,$_)),a.i=new wi(B,a.l))}function xe(a,B,d){a.i.set(B,d)}function ra(a){return xe(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Ei(a,B){return a?B?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function _i(a,B,d){return typeof a=="string"?(a=encodeURI(a).replace(B,z_),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function z_(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var op=/[#\/\?@]/g,W_=/[#\?:]/g,Q_=/[#\?]/g,$_=/[#\?@]/g,Y_=/#/g;function wi(a,B){this.h=this.g=null,this.i=a||null,this.j=!!B}function vr(a){a.g||(a.g=new Map,a.h=0,a.i&&J_(a.i,function(B,d){a.add(decodeURIComponent(B.replace(/\+/g," ")),d)}))}n=wi.prototype,n.add=function(a,B){vr(this),this.i=null,a=gs(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(B),this.h+=1,this};function ap(a,B){vr(a),B=gs(a,B),a.g.has(B)&&(a.i=null,a.h-=a.g.get(B).length,a.g.delete(B))}function cp(a,B){return vr(a),B=gs(a,B),a.g.has(B)}n.forEach=function(a,B){vr(this),this.g.forEach(function(d,p){d.forEach(function(P){a.call(B,P,p,this)},this)},this)};function up(a,B){vr(a);let d=[];if(typeof B=="string")cp(a,B)&&(d=d.concat(a.g.get(gs(a,B))));else for(a=Array.from(a.g.values()),B=0;B<a.length;B++)d=d.concat(a[B]);return d}n.set=function(a,B){return vr(this),this.i=null,a=gs(this,a),cp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[B]),this.h+=1,this},n.get=function(a,B){return a?(a=up(this,a),a.length>0?String(a[0]):B):B};function lp(a,B,d){ap(a,B),d.length>0&&(a.i=null,a.g.set(gs(a,B),v(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let a=[],B=Array.from(this.g.keys());for(let p=0;p<B.length;p++){var d=B[p];let P=pi(d);d=up(this,d);for(let N=0;N<d.length;N++){let K=P;d[N]!==""&&(K+="="+pi(d[N])),a.push(K)}}return this.i=a.join("&")};function Bp(a){let B=new wi;return B.i=a.i,a.g&&(B.g=new Map(a.g),B.h=a.h),B}function gs(a,B){return B=String(B),a.j&&(B=B.toLowerCase()),B}function X_(a,B){B&&!a.j&&(vr(a),a.i=null,a.g.forEach(function(d,p){let P=p.toLowerCase();p!=P&&(ap(this,p),lp(this,P,d))},a)),a.j=B}function Z_(a,B){let d=new fi;if(o.Image){let p=new Image;p.onload=h(er,d,"TestLoadImage: loaded",!0,B,p),p.onerror=h(er,d,"TestLoadImage: error",!1,B,p),p.onabort=h(er,d,"TestLoadImage: abort",!1,B,p),p.ontimeout=h(er,d,"TestLoadImage: timeout",!1,B,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else B(!1)}function ew(a,B){let d=new fi,p=new AbortController,P=setTimeout(()=>{p.abort(),er(d,"TestPingServer: timeout",!1,B)},1e4);fetch(a,{signal:p.signal}).then(N=>{clearTimeout(P),N.ok?er(d,"TestPingServer: ok",!0,B):er(d,"TestPingServer: server error",!1,B)}).catch(()=>{clearTimeout(P),er(d,"TestPingServer: error",!1,B)})}function er(a,B,d,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(d)}catch{}}function tw(){this.g=new L_}function sa(a){this.i=a.Sb||null,this.h=a.ab||!1}f(sa,Uf),sa.prototype.g=function(){return new ia(this.i,this.h)};function ia(a,B){ut.call(this),this.H=a,this.o=B,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}f(ia,ut),n=ia.prototype,n.open=function(a,B){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=B,this.readyState=1,Di(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;let B={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(B.body=a),(this.H||o).fetch(new Request(this.D,B)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,yi(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Di(this)),this.g&&(this.readyState=3,Di(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;hp(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function hp(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var B=a.value?a.value:new Uint8Array(0);(B=this.B.decode(B,{stream:!a.done}))&&(this.response=this.responseText+=B)}a.done?yi(this):Di(this),this.readyState==3&&hp(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,yi(this))},n.Na=function(a){this.g&&(this.response=a,yi(this))},n.ga=function(){this.g&&yi(this)};function yi(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Di(a)}n.setRequestHeader=function(a,B){this.A.append(a,B)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let a=[],B=this.h.entries();for(var d=B.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=B.next();return a.join(`\r
`)};function Di(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ia.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function dp(a){let B="";return M(a,function(d,p){B+=p,B+=":",B+=d,B+=`\r
`}),B}function Fu(a,B,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=dp(d),typeof a=="string"?d!=null&&pi(d):xe(a,B,d))}function Me(a){ut.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}f(Me,ut);var nw=/^https?$/i,rw=["POST","PUT"];n=Me.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,B,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);B=B?B.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Wf.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(B,String(a),!0),this.B=!1}catch(N){fp(this,N);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)d.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(let N of p.keys())d.set(N,p.get(N));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(rw,B,void 0)>=0)||p||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[N,K]of d)this.g.setRequestHeader(N,K);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(N){fp(this,N)}};function fp(a,B){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=B,a.o=5,pp(a),oa(a)}function pp(a){a.A||(a.A=!0,gt(a,"complete"),gt(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,gt(this,"complete"),gt(this,"abort"),oa(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),oa(this,!0)),Me.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?gp(this):this.Xa())},n.Xa=function(){gp(this)};function gp(a){if(a.h&&typeof i<"u"){if(a.v&&tr(a)==4)setTimeout(a.Ca.bind(a),0);else if(gt(a,"readystatechange"),tr(a)==4){a.h=!1;try{let N=a.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var B=!0;break e;default:B=!1}var d;if(!(d=B)){var p;if(p=N===0){let K=String(a.D).match(ip)[1]||null;!K&&o.self&&o.self.location&&(K=o.self.location.protocol.slice(0,-1)),p=!nw.test(K?K.toLowerCase():"")}d=p}if(d)gt(a,"complete"),gt(a,"success");else{a.o=6;try{var P=tr(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",pp(a)}}finally{oa(a)}}}}function oa(a,B){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);let d=a.g;a.g=null,B||gt(a,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function tr(a){return a.g?a.g.readyState:0}n.ca=function(){try{return tr(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var B=this.g.responseText;return a&&B.indexOf(a)==0&&(B=B.substring(a.length)),x_(B)}};function Cp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function sw(a){let B={};a=(a.g&&tr(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(C(a[p]))continue;var d=H_(a[p]);let P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();let N=B[P]||[];B[P]=N,N.push(d)}se(B,function(p){return p.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ii(a,B,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||B}function mp(a){this.za=0,this.i=[],this.j=new fi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ii("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ii("baseRetryDelayMs",5e3,a),this.Za=Ii("retryDelaySeedMs",1e4,a),this.Ta=Ii("forwardChannelMaxRetries",2,a),this.va=Ii("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new ep(a&&a.concurrentRequestLimit),this.Ba=new tw,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=mp.prototype,n.ka=8,n.I=1,n.connect=function(a,B,d,p){Ct(0),this.W=a,this.H=B||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.J=vp(this,null,this.W),ca(this)};function xu(a){if(Ep(a),a.I==3){var B=a.V++,d=ln(a.J);if(xe(d,"SID",a.M),xe(d,"RID",B),xe(d,"TYPE","terminate"),Ti(a,d),B=new Xn(a,a.j,B),B.M=2,B.A=ra(ln(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(B.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=B.A,d=!0),d||(B.g=bp(B.j,null),B.g.ea(B.A)),B.F=Date.now(),na(B)}Ap(a)}function aa(a){a.g&&(Vu(a),a.g.cancel(),a.g=null)}function Ep(a){aa(a),a.v&&(o.clearTimeout(a.v),a.v=null),ua(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function ca(a){if(!tp(a.h)&&!a.m){a.m=!0;var B=a.Ea;Ve||m(),be||(Ve(),be=!0),A.add(B,a),a.D=0}}function iw(a,B){return np(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=B.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=di(l(a.Ea,a,B),Tp(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;let P=new Xn(this,this.j,a),N=this.o;if(this.U&&(N?(N=$(N),Q(N,this.U)):N=this.U),this.u!==null||this.R||(P.J=N,N=null),this.S)e:{for(var B=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(B+=p,B>4096){B=d;break e}if(B===4096||d===this.i.length-1){B=d+1;break e}}B=1e3}else B=1e3;B=wp(this,P,B),d=ln(this.J),xe(d,"RID",a),xe(d,"CVER",22),this.G&&xe(d,"X-HTTP-Session-Id",this.G),Ti(this,d),N&&(this.R?B="headers="+pi(dp(N))+"&"+B:this.u&&Fu(d,this.u,N)),Ou(this.h,P),this.Ra&&xe(d,"TYPE","init"),this.S?(xe(d,"$req",B),xe(d,"SID","null"),P.U=!0,Su(P,d,null)):Su(P,d,B),this.I=2}}else this.I==3&&(a?_p(this,a):this.i.length==0||tp(this.h)||_p(this))};function _p(a,B){var d;B?d=B.l:d=a.V++;let p=ln(a.J);xe(p,"SID",a.M),xe(p,"RID",d),xe(p,"AID",a.K),Ti(a,p),a.u&&a.o&&Fu(p,a.u,a.o),d=new Xn(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),B&&(a.i=B.G.concat(a.i)),B=wp(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Ou(a.h,d),Su(d,p,B)}function Ti(a,B){a.H&&M(a.H,function(d,p){xe(B,p,d)}),a.l&&M({},function(d,p){xe(B,p,d)})}function wp(a,B,d){d=Math.min(a.i.length,d);let p=a.l?l(a.l.Ka,a.l,a):null;e:{var P=a.i;let de=-1;for(;;){let Ye=["count="+d];de==-1?d>0?(de=P[0].g,Ye.push("ofs="+de)):de=0:Ye.push("ofs="+de);let Re=!0;for(let tt=0;tt<d;tt++){var N=P[tt].g;let Bn=P[tt].map;if(N-=de,N<0)de=Math.max(0,P[tt].g-100),Re=!1;else try{N="req"+N+"_"||"";try{var K=Bn instanceof Map?Bn:Object.entries(Bn);for(let[Sr,nr]of K){let rr=nr;c(nr)&&(rr=Iu(nr)),Ye.push(N+Sr+"="+encodeURIComponent(rr))}}catch(Sr){throw Ye.push(N+"type="+encodeURIComponent("_badmap")),Sr}}catch{p&&p(Bn)}}if(Re){K=Ye.join("&");break e}}K=void 0}return a=a.i.splice(0,d),B.G=a,K}function yp(a){if(!a.g&&!a.v){a.Y=1;var B=a.Da;Ve||m(),be||(Ve(),be=!0),A.add(B,a),a.A=0}}function Lu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=di(l(a.Da,a),Tp(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,Dp(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=di(l(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Ct(10),aa(this),Dp(this))};function Vu(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Dp(a){a.g=new Xn(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var B=ln(a.na);xe(B,"RID","rpc"),xe(B,"SID",a.M),xe(B,"AID",a.K),xe(B,"CI",a.F?"0":"1"),!a.F&&a.ia&&xe(B,"TO",a.ia),xe(B,"TYPE","xmlhttp"),Ti(a,B),a.u&&a.o&&Fu(B,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=ra(ln(B)),d.u=null,d.R=!0,Yf(d,a)}n.Va=function(){this.C!=null&&(this.C=null,aa(this),Lu(this),Ct(19))};function ua(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Ip(a,B){var d=null;if(a.g==B){ua(a),Vu(a),a.g=null;var p=2}else if(Nu(a.h,B))d=B.G,rp(a.h,B),p=1;else return;if(a.I!=0){if(B.o)if(p==1){d=B.u?B.u.length:0,B=Date.now()-B.F;var P=a.D;p=ea(),gt(p,new Jf(p,d)),ca(a)}else yp(a);else if(P=B.m,P==3||P==0&&B.X>0||!(p==1&&iw(a,B)||p==2&&Lu(a)))switch(d&&d.length>0&&(B=a.h,B.i=B.i.concat(d)),P){case 1:br(a,5);break;case 4:br(a,10);break;case 3:br(a,6);break;default:br(a,2)}}}function Tp(a,B){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*B}function br(a,B){if(a.j.info("Error code "+B),B==2){var d=l(a.bb,a),p=a.Ua;let P=!p;p=new Zn(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Ci(p,"https"),ra(p),P?Z_(p.toString(),d):ew(p.toString(),d)}else Ct(2);a.I=0,a.l&&a.l.pa(B),Ap(a),Ep(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Ct(2)):(this.j.info("Failed to ping google.com"),Ct(1))};function Ap(a){if(a.I=0,a.ja=[],a.l){let B=sp(a.h);(B.length!=0||a.i.length!=0)&&(R(a.ja,B),R(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function vp(a,B,d){var p=d instanceof Zn?ln(d):new Zn(d);if(p.g!="")B&&(p.g=B+"."+p.g),mi(p,p.u);else{var P=o.location;p=P.protocol,B=B?B+"."+P.hostname:P.hostname,P=+P.port;let N=new Zn(null);p&&Ci(N,p),B&&(N.g=B),P&&mi(N,P),d&&(N.h=d),p=N}return d=a.G,B=a.wa,d&&B&&xe(p,d,B),xe(p,"VER",a.ka),Ti(a,p),p}function bp(a,B,d){if(B&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return B=a.Aa&&!a.ma?new Me(new sa({ab:d})):new Me(a.ma),B.Fa(a.L),B}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Sp(){}n=Sp.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function la(){}la.prototype.g=function(a,B){return new St(a,B)};function St(a,B){ut.call(this),this.g=new mp(B),this.l=a,this.h=B&&B.messageUrlParams||null,a=B&&B.messageHeaders||null,B&&B.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=B&&B.initMessageHeaders||null,B&&B.messageContentType&&(a?a["X-WebChannel-Content-Type"]=B.messageContentType:a={"X-WebChannel-Content-Type":B.messageContentType}),B&&B.sa&&(a?a["X-WebChannel-Client-Profile"]=B.sa:a={"X-WebChannel-Client-Profile":B.sa}),this.g.U=a,(a=B&&B.Qb)&&!C(a)&&(this.g.u=a),this.A=B&&B.supportsCrossDomainXhr||!1,this.v=B&&B.sendRawJson||!1,(B=B&&B.httpSessionIdParam)&&!C(B)&&(this.g.G=B,a=this.h,a!==null&&B in a&&(a=this.h,B in a&&delete a[B])),this.j=new Cs(this)}f(St,ut),St.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},St.prototype.close=function(){xu(this.g)},St.prototype.o=function(a){var B=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Iu(a),a=d);B.i.push(new K_(B.Ya++,a)),B.I==3&&ca(B)},St.prototype.N=function(){this.g.l=null,delete this.j,xu(this.g),delete this.g,St.Z.N.call(this)};function Rp(a){Tu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var B=a.__sm__;if(B){e:{for(let d in B){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,B=B!==null&&a in B?B[a]:void 0),this.data=B}else this.data=a}f(Rp,Tu);function Pp(){Au.call(this),this.status=1}f(Pp,Au);function Cs(a){this.g=a}f(Cs,Sp),Cs.prototype.ra=function(){gt(this.g,"a")},Cs.prototype.qa=function(a){gt(this.g,new Rp(a))},Cs.prototype.pa=function(a){gt(this.g,new Pp)},Cs.prototype.oa=function(){gt(this.g,"b")},la.prototype.createWebChannel=la.prototype.g,St.prototype.send=St.prototype.o,St.prototype.open=St.prototype.m,St.prototype.close=St.prototype.close,Jl=bn.createWebChannelTransport=function(){return new la},Kl=bn.getStatEventTarget=function(){return ea()},jl=bn.Event=Tr,Ya=bn.Stat={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ta.NO_ERROR=0,ta.TIMEOUT=8,ta.HTTP_ERROR=6,Qi=bn.ErrorCode=ta,zf.COMPLETE="complete",ql=bn.EventType=zf,Hf.EventType=Bi,Bi.OPEN="a",Bi.CLOSE="b",Bi.ERROR="c",Bi.MESSAGE="d",ut.prototype.listen=ut.prototype.J,Ts=bn.WebChannel=Hf,oI=bn.FetchXmlHttpFactory=sa,Me.prototype.listenOnce=Me.prototype.K,Me.prototype.getLastError=Me.prototype.Ha,Me.prototype.getLastErrorCode=Me.prototype.ya,Me.prototype.getStatus=Me.prototype.ca,Me.prototype.getResponseJson=Me.prototype.La,Me.prototype.getResponseText=Me.prototype.la,Me.prototype.send=Me.prototype.ea,Me.prototype.setWithCredentials=Me.prototype.Fa,Hl=bn.XhrIo=Me}).apply(typeof $a<"u"?$a:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var V=class Gr{static FOLD_CASE=1;static LITERAL=2;static CLASS_NL=4;static DOT_NL=8;static ONE_LINE=16;static NON_GREEDY=32;static PERL_X=64;static UNICODE_GROUPS=128;static WAS_DOLLAR=256;static LOOKBEHIND=512;static MATCH_NL=Gr.CLASS_NL|Gr.DOT_NL;static PERL=Gr.CLASS_NL|Gr.ONE_LINE|Gr.PERL_X|Gr.UNICODE_GROUPS;static POSIX=0;static UNANCHORED=0;static ANCHOR_START=1;static ANCHOR_BOTH=2},Zt={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},Xi=128,$l=new Int32Array(Xi),Yl=new Int32Array(Xi),Xa=65535;for(let n=0;n<Xi;n++)n>=97&&n<=122?$l[n]=n-32:$l[n]=n,n>=65&&n<=90?Yl[n]=n+32:Yl[n]=n;var k=class{static CODES=new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]]);static toUpperCase(n){if(n<Xi)return $l[n];let e=String.fromCodePoint(n).toUpperCase(),t=e.codePointAt(0)>Xa?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=r.codePointAt(0)>Xa?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}static toLowerCase(n){if(n<Xi)return Yl[n];let e=String.fromCodePoint(n).toLowerCase(),t=e.codePointAt(0)>Xa?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=r.codePointAt(0)>Xa?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}},E=class{constructor(n,e=!1){this.data=n,this.isStride1=e,this.SIZE=e?2:3}getLo(n){return this.data[n*this.SIZE]}getHi(n){return this.data[n*this.SIZE+1]}getStride(n){return this.isStride1?1:this.data[n*this.SIZE+2]}get length(){return this.data.length/this.SIZE}},RC=new Uint8Array(256);for(let n=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";n<64;n++)RC[e.charCodeAt(n)]=n;var PC=n=>{let e=[],t=0,r=0;for(let s=0;s<n.length;s++){let i=RC[n.charCodeAt(s)];t|=(i&31)<<r,(i&32)===0?(e.push(t),t=0,r=0):r+=5}return e},_=(n,e)=>{let t=PC(n),r=e?t.length/2:t.length/3,s=new Uint32Array(r*3),i=0,o=0;for(let c=0;c<r;c++)i+=t[o++],s[c*3]=i,i+=t[o++],s[c*3+1]=i,s[c*3+2]=e?1:t[o++];return s},aI=n=>{let e=PC(n),t=new Map,r=0;for(let s=0;s<e.length;s+=2){r+=e[s];let i=e[s+1],o=i>>>1^-(i&1);t.set(r,r+o)}return t},Za=class{constructor(n){this.initializer=n,this.cache=new Map}has(n){return n in this.initializer}get(n){if(this.cache.has(n))return this.cache.get(n);let e=this.initializer[n],t=e?e():null;return this.cache.set(n,t),t}},It=class{static _CASE_ORBIT=null;static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=aI("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static _Print=null;static get Print(){return this._Print||(this._Print=new E(_("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static CATEGORIES=new Za({C:()=>new E(_("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new E(_("AfgDgB",!0)),Cf:()=>new E(_("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new E(_("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new E(_("gg2B--B",!0)),L:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new E(_("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new E(_("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new E(_("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new E(_("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new E(_("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new E(_("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new E(_("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new E(_("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new E(_("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new E(_("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new E(_("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new E(_("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new E(_("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new E(_("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new E(_("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new E(_("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new E(_("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new E(_("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new E(_("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new E(_("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new E(_("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new E(_("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new E(_("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new E(_("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new E(_("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new E(_("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new E(_("ohIA",!0)),Zp:()=>new E(_("phIA",!0)),Zs:()=>new E(_("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new E(_("wBJIFbF",!0)),Alphabetic:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new E(_("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new E(_("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new E(_("7-8DE",!0)),Emoji_Modifier_Base:()=>new E(_("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new E(_("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new E(_("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new E(_("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new E(_("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new E(_("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new E(_("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new E(_("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new E(_("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))});static get Upper(){return this.CATEGORIES.get("Lu")}static SCRIPTS=new Za({Adlam:()=>new E(_("go6DrCFJFB",!0)),Ahom:()=>new E(_("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new E(_("ggxCmS",!0)),Arabic:()=>new E(_("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new E(_("xpBlBDxBDCks9BE",!0)),Avestan:()=>new E(_("g4iC1BEG",!0)),Balinese:()=>new E(_("g4GsCCxB",!0)),Bamum:()=>new E(_("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new E(_("w26CdDF",!0)),Batak:()=>new E(_("g+GzBJD",!0)),Bengali:()=>new E(_("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new E(_("g17CYDY",!0)),Bhaiksuki:()=>new E(_("ggnCICsBCNLc",!0)),Bopomofo:()=>new E(_("qXB6wLqBxDf",!0)),Brahmi:()=>new E(_("ggkCtCFjBKA",!0)),Braille:()=>new E(_("ggK-H",!0)),Buginese:()=>new E(_("gwGbDB",!0)),Buhid:()=>new E(_("g6FT",!0)),Canadian_Aboriginal:()=>new E(_("ggF-TxRlC7tgCP",!0)),Carian:()=>new E(_("g1gCwB",!0)),Caucasian_Albanian:()=>new E(_("wphCzBMA",!0)),Chakma:()=>new E(_("gokC0BCR",!0)),Cham:()=>new E(_("gwqB2BKNDJDD",!0)),Cherokee:()=>new E(_("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new E(_("w9jCb",!0)),Common:()=>new E(_("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new E(_("ifNxkKzDGG",!0)),Cuneiform:()=>new E(_("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new E(_("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new E(_("w8rCiD",!0)),Cyrillic:()=>new E(_("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new E(_("gghCvC",!0)),Devanagari:()=>new E(_("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new E(_("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new E(_("ggmC7B",!0)),Duployan:()=>new E(_("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new E(_("ggsC1iBL68D",!0)),Elbasan:()=>new E(_("gohCnB",!0)),Elymaic:()=>new E(_("g-jCW",!0)),Ethiopic:()=>new E(_("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new E(_("gqjClBEcJB",!0)),Georgian:()=>new E(_("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new E(_("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new E(_("w5gCa",!0)),Grantha:()=>new E(_("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new E(_("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new E(_("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new E(_("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new E(_("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new E(_("go4C5B",!0)),Han:()=>new E(_("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new E(_("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new E(_("gojCnBJJ",!0)),Hanunoo:()=>new E(_("g5FU",!0)),Hatran:()=>new E(_("gniCSCBGE",!0)),Hebrew:()=>new E(_("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new E(_("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new E(_("giiCVCI",!0)),Inherited:()=>new E(_("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new E(_("g7iCSGH",!0)),Inscriptional_Parthian:()=>new E(_("g6iCVDH",!0)),Javanese:()=>new E(_("gsqBtCDJFB",!0)),Kaithi:()=>new E(_("gkkCiCLA",!0)),Kannada:()=>new E(_("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new E(_("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new E(_("g4nCQCoBEc",!0)),Kayah_Li:()=>new E(_("goqBtBCA",!0)),Kharoshthi:()=>new E(_("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new E(_("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new E(_("g8F9CDJHJnPf",!0)),Khojki:()=>new E(_("gwkCRCuB",!0)),Khudawadi:()=>new E(_("w1kC6BGJ",!0)),Kirat_Rai:()=>new E(_("gq7C5B",!0)),Lao:()=>new E(_("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new E(_("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new E(_("ggH3BEOEC",!0)),Limbu:()=>new E(_("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new E(_("gwhC2JKVLH",!0)),Linear_B:()=>new E(_("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new E(_("wmpBvBx1eA",!0)),Lycian:()=>new E(_("g0gCc",!0)),Lydian:()=>new E(_("gpiCZGA",!0)),Mahajani:()=>new E(_("wqkCmB",!0)),Makasar:()=>new E(_("g3nCY",!0)),Malayalam:()=>new E(_("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new E(_("giCbDA",!0)),Manichaean:()=>new E(_("g2iCmBFL",!0)),Marchen:()=>new E(_("wjnCfDVCN",!0)),Masaram_Gondi:()=>new E(_("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new E(_("gy7C6C",!0)),Meetei_Mayek:()=>new E(_("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new E(_("gg6DkGDP",!0)),Meroitic_Cursive:()=>new E(_("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new E(_("gsiCf",!0)),Miao:()=>new E(_("g47CqCF4BIQ",!0)),Modi:()=>new E(_("gwlCkCMJ",!0)),Mongolian:()=>new E(_("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new E(_("gy6CeCJFB",!0)),Multani:()=>new E(_("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new E(_("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new E(_("gkiCeJI",!0)),Nag_Mundari:()=>new E(_("wm5DpB",!0)),Nandinagari:()=>new E(_("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new E(_("gsGrBFZHKEB",!0)),Newa:()=>new E(_("gglC7CCE",!0)),Nko:()=>new E(_("g+B6BDC",!0)),Nushu:()=>new E(_("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new E(_("go4DsBENDJFB",!0)),Ogham:()=>new E(_("g0Fc",!0)),Ol_Chiki:()=>new E(_("wiHvB",!0)),Ol_Onal:()=>new E(_("wu5DqBFA",!0)),Old_Hungarian:()=>new E(_("gkjCyBOyBIF",!0)),Old_Italic:()=>new E(_("g4gCjBKC",!0)),Old_North_Arabian:()=>new E(_("g0iCf",!0)),Old_Permic:()=>new E(_("w6gCqB",!0)),Old_Persian:()=>new E(_("g9gCjBFN",!0)),Old_Sogdian:()=>new E(_("g4jCnB",!0)),Old_South_Arabian:()=>new E(_("gziCf",!0)),Old_Turkic:()=>new E(_("ggjCoC",!0)),Old_Uyghur:()=>new E(_("w7jCZ",!0)),Oriya:()=>new E(_("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new E(_("wlhCjBFjB",!0)),Osmanya:()=>new E(_("gkhCdDJ",!0)),Pahawh_Hmong:()=>new E(_("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new E(_("gjiCf",!0)),Pau_Cin_Hau:()=>new E(_("g2mC4B",!0)),Phags_Pa:()=>new E(_("giqB3B",!0)),Phoenician:()=>new E(_("goiCbEA",!0)),Psalter_Pahlavi:()=>new E(_("g8iCRIDNG",!0)),Rejang:()=>new E(_("wpqBjBMA",!0)),Runic:()=>new E(_("g1FqCEK",!0)),Samaritan:()=>new E(_("ggCtBDO",!0)),Saurashtra:()=>new E(_("gkqBlCJL",!0)),Sharada:()=>new E(_("gskC-ChsCH",!0)),Shavian:()=>new E(_("wihCvB",!0)),Siddham:()=>new E(_("gslC1BDlB",!0)),Sidetic:()=>new E(_("gqiCZ",!0)),SignWriting:()=>new E(_("gg2DrUQECO",!0)),Sinhala:()=>new E(_("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new E(_("w5jCpB",!0)),Sora_Sompeng:()=>new E(_("wmkCYIJ",!0)),Soyombo:()=>new E(_("wymCyC",!0)),Sundanese:()=>new E(_("g8G-BhIH",!0)),Sunuwar:()=>new E(_("g+mChBPJ",!0)),Syloti_Nagri:()=>new E(_("ggqBsB",!0)),Syriac:()=>new E(_("g4BNC7BDCxIK",!0)),Tagalog:()=>new E(_("g4FVKA",!0)),Tagbanwa:()=>new E(_("g7FMCCCB",!0)),Tai_Le:()=>new E(_("wqGdDE",!0)),Tai_Tham:()=>new E(_("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new E(_("g0qBiCZE",!0)),Tai_Yo:()=>new E(_("g25DeCVJB",!0)),Takri:()=>new E(_("g0lC5BHJ",!0)),Tamil:()=>new E(_("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new E(_("wz6CuCCJ",!0)),Tangut:()=>new E(_("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new E(_("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new E(_("g8BxB",!0)),Thai:()=>new E(_("hwD5BGb",!0)),Tibetan:()=>new E(_("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new E(_("wpL3BIBPA",!0)),Tirhuta:()=>new E(_("gklCnCJJ",!0)),Todhri:()=>new E(_("guhCzB",!0)),Tolong_Siki:()=>new E(_("wtnCrBFJ",!0)),Toto:()=>new E(_("w04De",!0)),Tulu_Tigalari:()=>new E(_("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new E(_("g8gCdCA",!0)),Unknown:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new E(_("gopBrJ",!0)),Vithkuqi:()=>new E(_("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new E(_("g24D5BGA",!0)),Warang_Citi:()=>new E(_("glmCyCNA",!0)),Yezidi:()=>new E(_("g0jCpBCCDB",!0)),Yi:()=>new E(_("ggoBskBE2B",!0)),Zanabazar_Square:()=>new E(_("gwmCnC",!0))});static FOLD_CATEGORIES=new Za({L:()=>new E(_("laA",!0)),LC:()=>new E(_("laA",!0)),Ll:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new E(_("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new E(_("5cgBgBlgHAB",!1)),Mn:()=>new E(_("5cgBgBlgHAB",!1)),Emoji:()=>new E(_("8mJA",!0)),Extended_Pictographic:()=>new E(_("8mJA",!0)),Lowercase:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new E(_("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))});static FOLD_SCRIPT=new Za({Common:()=>new E(_("8cgBgB",!1)),Greek:()=>new E(_("1FwUwU",!1)),Inherited:()=>new E(_("5cgBgBlgHAB",!1))})},W=class qt{static MAX_RUNE=1114111;static MAX_ASCII=127;static MAX_LATIN1=255;static MAX_BMP=65535;static MIN_FOLD=65;static MAX_FOLD=125251;static MIN_HIGH_SURROGATE=55296;static MAX_HIGH_SURROGATE=56319;static MIN_LOW_SURROGATE=56320;static MAX_LOW_SURROGATE=57343;static MIN_SUPPLEMENTARY_CODE_POINT=65536;static is32(e,t){let r=0,s=e.length;for(;r<s;){let i=r+Math.floor((s-r)/2),o=e.getLo(i),c=e.getHi(i);if(o<=t&&t<=c){let u=e.getStride(i);return(t-o)%u===0}t<o?s=i:r=i+1}return!1}static is(e,t){if(t<=qt.MAX_LATIN1){for(let r=0;r<e.length;r++){if(t>e.getHi(r))continue;let s=e.getLo(r);if(t<s)return!1;let i=e.getStride(r);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&qt.is32(e,t)}static isUpper(e){if(e<=qt.MAX_LATIN1){let t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return qt.is(It.Upper,e)}static isPrint(e){return e<=qt.MAX_LATIN1?e>=32&&e<qt.MAX_ASCII||e>=161&&e!==173:qt.is(It.Print,e)}static simpleFold(e){if(It.CASE_ORBIT.has(e))return It.CASE_ORBIT.get(e);let t=k.toLowerCase(e);return t!==e?t:k.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=qt.MAX_ASCII&&t<=qt.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let r=qt.simpleFold(e);r!==e;r=qt.simpleFold(r))if(r===t)return!0;return!1}},tB=256,NC=new Uint8Array(tB);for(let n=0;n<tB;n++)NC[n]=97<=n&&n<=122||65<=n&&n<=90||48<=n&&n<=57||n===95?1:0;var zl=null,Wl=null,X=class Nt{static METACHARACTERS="\\.+*?()|[]{}^$";static EMPTY_BEGIN_LINE=1;static EMPTY_END_LINE=2;static EMPTY_BEGIN_TEXT=4;static EMPTY_END_TEXT=8;static EMPTY_WORD_BOUNDARY=16;static EMPTY_NO_WORD_BOUNDARY=32;static EMPTY_ALL=-1;static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")||k.CODES.get("a")<=e&&e<=k.CODES.get("z")||k.CODES.get("A")<=e&&e<=k.CODES.get("Z")}static unhex(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")?e-k.CODES.get("0"):k.CODES.get("a")<=e&&e<=k.CODES.get("f")?e-k.CODES.get("a")+10:k.CODES.get("A")<=e&&e<=k.CODES.get("F")?e-k.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(W.isPrint(e))Nt.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case k.CODES.get('"'):t+='\\"';break;case k.CODES.get("\\"):t+="\\\\";break;case k.CODES.get("	"):t+="\\t";break;case k.CODES.get(`
`):t+="\\n";break;case k.CODES.get("\r"):t+="\\r";break;case k.CODES.get("\b"):t+="\\b";break;case k.CODES.get("\f"):t+="\\f";break;default:{let r=e.toString(16);e<256?(t+="\\x",r.length===1&&(t+="0"),t+=r):t+=`\\x{${r}}`;break}}return t}static stringToRunes(e){let t=String(e),r=[],s=0;for(;s<t.length;){let i=t.codePointAt(s);r.push(i),s+=i>W.MAX_BMP?2:1}return r}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<tB?NC[e]===1:!1}static emptyOpContext(e,t){let r=0;return e<0&&(r|=Nt.EMPTY_BEGIN_TEXT|Nt.EMPTY_BEGIN_LINE),e===10&&(r|=Nt.EMPTY_BEGIN_LINE),t<0&&(r|=Nt.EMPTY_END_TEXT|Nt.EMPTY_END_LINE),t===10&&(r|=Nt.EMPTY_END_LINE),Nt.isWordRune(e)!==Nt.isWordRune(t)?r|=Nt.EMPTY_WORD_BOUNDARY:r|=Nt.EMPTY_NO_WORD_BOUNDARY,r}static quoteMeta(e){return e.split("").map(t=>Nt.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>W.MAX_BMP?2:1}static toArray(e){let t=e.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=e[s];return r}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return zl||(zl=new TextEncoder),zl.encode(e);{let t=[],r=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===W.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===W.MIN_LOW_SURROGATE?(i=W.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){Wl||(Wl=new TextDecoder("utf-8"));let t=e instanceof Uint8Array?e:new Uint8Array(e);return Wl.decode(t)}else{let t=[],r=0,s=0;for(;r<e.length;){let i=e[r++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[r++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[r++],c=e[r++],u=e[r++],l=((i&7)<<18|(o&63)<<12|(c&63)<<6|u&63)-W.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(W.MIN_HIGH_SURROGATE+(l>>10)),t[s++]=String.fromCharCode(W.MIN_LOW_SURROGATE+(l&1023))}else{let o=e[r++],c=e[r++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|c&63)}}return t.join("")}}},OC=(n=[],e=0)=>{let t=Object.create(null);for(let r=0;r<n.length;r++){let s=n[r],i=e+r;t[s]=i,t[i]=s}return Object.freeze(t)},qr=class Xl{static Encoding=OC(["UTF_16","UTF_8"]);getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Xl.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Xl.Encoding.UTF_16}},sC=class extends qr{constructor(n=null){super(),this.bytes=n}getEncoding(){return qr.Encoding.UTF_8}asCharSequence(){return X.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},cI=class extends qr{constructor(n=null){super(),this.charSequence=n}getEncoding(){return qr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return X.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Hr=class{static utf16(n){return new cI(n)}static utf8(n){return X.isByteArray(n)?new sC(n):new sC(X.stringToUtf8ByteArray(n))}},mt=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},uI=class extends mt{constructor(n,e=0,t=n.length){super(),this.bytes=n,this.start=e,this.end=t}hasString(n,e){let t=n.bytes;if(t.length===0)return!0;let r=this.indexOf(this.bytes,t,this.start+e);return r!==-1&&r<=this.end-t.length}hasAnyString(n,e){return n.ac8?n.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return mt.EOF();let e=this.bytes[n]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&n+1<this.end){let t=this.bytes[n+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&n+2<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;return(r&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|r&63)<<3|3}else if(e>=240&&e<=244&&n+3<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;if((r&192)!==128)return e<<3|1;let s=this.bytes[n+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(r&63)<<6|s&63)<<3|4}else return e<<3|1}index(n,e){e+=this.start;let t=this.indexOf(this.bytes,n.prefixUTF8,e);return t<0?t:t-e}context(n){n+=this.start;let e=-1;if(n>this.start&&n<=this.end){let r=n-1;if(e=this.bytes[r--],e>=128){let s=n-4;for(s<this.start&&(s=this.start);r>=s&&(this.bytes[r]&192)===128;)r--;r<this.start&&(r=this.start),e=this.step(r-this.start)>>3}}let t=n<this.end?this.step(n-this.start)>>3:-1;return X.emptyOpContext(e,t)}indexOf(n,e,t=0){let r=e.length;if(r===0)return t<=this.end?t:-1;let s=e[0],i=this.end-r,o=typeof n.indexOf=="function",c=t;for(;c<=i;){if(o){if(c=n.indexOf(s,c),c===-1||c>i)return-1}else{for(;c<=i&&n[c]!==s;)c++;if(c>i)return-1}let u=!0;for(let l=1;l<r;l++)if(n[c+l]!==e[l]){u=!1;break}if(u)return c;c++}return-1}prefixLength(n){return n.prefixUTF8.length}},lI=class extends mt{constructor(n,e=0,t=n.length){super(),this.charSequence=n,this.start=e,this.end=t}hasString(n,e){let t=this.charSequence.indexOf(n.str,this.start+e);return t!==-1&&t<=this.end-n.str.length}hasAnyString(n,e){return n.ac16?n.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return mt.EOF();let e=this.charSequence.charCodeAt(n);if(e<W.MIN_HIGH_SURROGATE||e>W.MAX_HIGH_SURROGATE||n+1>=this.end)return e<<3|1;let t=this.charSequence.charCodeAt(n+1);return t>=W.MIN_LOW_SURROGATE&&t<=W.MAX_LOW_SURROGATE?(e-W.MIN_HIGH_SURROGATE)*1024+(t-W.MIN_LOW_SURROGATE)+W.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(n,e){e+=this.start;let t=this.charSequence.indexOf(n.prefix,e);return t<0||t>this.end-n.prefix.length?-1:t-e}context(n){n+=this.start;let e=n>this.start&&n<=this.end?this.charSequence.charCodeAt(n-1):-1,t=n<this.end?this.charSequence.charCodeAt(n):-1;return X.emptyOpContext(e,t)}prefixLength(n){return n.prefix.length}},Pe=class{static fromUTF8(n,e=0,t=n.length){return new uI(n,e,t)}static fromUTF16(n,e=0,t=n.length){return new lI(n,e,t)}},Zi=class extends Error{constructor(n){super(n),this.name="RE2JSException"}},Ne=class extends Zi{constructor(n,e=null){let t=`error parsing regexp: ${n}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=n,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},kC=class extends Zi{constructor(n){super(n),this.name="RE2JSCompileException"}},Dt=class extends Zi{constructor(n){super(n),this.name="RE2JSGroupException"}},BI=class extends Zi{constructor(n){super(n),this.name="RE2JSFlagsException"}},Yi=class extends Zi{constructor(n){super(n),this.name="RE2JSInternalException"}},iC=class FC{static MAX_REPLACER_ARGS=65535;static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(r=>{let s=r.codePointAt(0);return s===k.CODES.get("\\")||s===k.CODES.get("$")?`\\${r}`:r}).join(""):e.indexOf("$")<0?e:e.split("").map(r=>r.codePointAt(0)===k.CODES.get("$")?"$$":r).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;let r=this.patternInput.re2();this.patternGroupCount=r.numberOfCapturingGroups(),this.groups=[],this.namedGroups=r.namedGroups,this.numberOfInstructions=r.numberOfInstructions(),t instanceof qr?this.resetMatcherInput(t):X.isByteArray(t)?this.resetMatcherInput(Hr.utf8(t)):this.resetMatcherInput(Hr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof qr||(X.isByteArray(e)?e=Hr.utf8(e):e=Hr.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){let s=this.namedGroups[e];if(!Number.isFinite(s))throw new Dt(`group '${e}' not found`);e=s}let t=this.start(e),r=this.end(e);return t<0&&r<0?null:this.substring(t,r)}getNamedGroups(){if(!this.hasMatch)throw new Dt("perhaps no match attempted");let e=Object.create(null);for(let t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new Dt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new Dt("perhaps no match attempted");if(e===0||this.hasGroups)return;let t=this.matcherInputLength,r=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!r[0])throw new Dt("inconsistency in matching group data");this.groups=r[1],this.hasGroups=!0}matches(){return this.genMatch(0,V.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,V.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new Dt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){let t=(this.matcherInput.isUTF16Encoding()?Pe.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Pe.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,V.UNANCHORED)}genMatch(e,t){let r=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return r[0]?(this.groups=r[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?X.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let r="",s=this.start(),i=this.end();return this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i,r+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),r}appendReplacementInternalJava(e){let t="",r=0,s=e.length,i=0;for(;i<s;){let o=e.codePointAt(i);if(o===k.CODES.get("\\")){if(r<i&&(t+=e.substring(r,i)),i++,i>=s)throw new Dt("character to be escaped is missing");r=i,i++;continue}if(o===k.CODES.get("$")){if(r<i&&(t+=e.substring(r,i)),i+1>=s)throw new Dt("Illegal group reference: group index is missing");let c=e.codePointAt(i+1);if(k.CODES.get("0")<=c&&c<=k.CODES.get("9")){let u=c-k.CODES.get("0"),l=i+2;for(;l<s;l++){let f=e.codePointAt(l);if(f<k.CODES.get("0")||f>k.CODES.get("9")||u*10+f-k.CODES.get("0")>this.patternGroupCount)break;u=u*10+f-k.CODES.get("0")}if(u>this.patternGroupCount)throw new Dt(`n > number of groups: ${u}`);let h=this.group(u);h!==null&&(t+=h),i=l,r=i}else if(c===k.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==k.CODES.get("}");)u++;if(u>=s)throw new Dt("named capture group is missing trailing '}'");let l=e.substring(i+2,u),h=this.group(l);h!==null&&(t+=h),i=u+1,r=i}else throw new Dt("Illegal group reference");continue}i++}return r<s&&(t+=e.substring(r,s)),t}appendReplacementInternalJs(e){let t="",r=0,s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===k.CODES.get("$")){let o=e.codePointAt(i+1);if(k.CODES.get("$")===o){r<i&&(t+=e.substring(r,i)),t+="$",i++,r=i+1;continue}else if(k.CODES.get("&")===o){r<i&&(t+=e.substring(r,i));let c=this.group(0);c!==null?t+=c:t+="$&",i++,r=i+1;continue}else if(k.CODES.get("`")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(0,this.start(0)),i++,r=i+1;continue}else if(k.CODES.get("'")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,r=i+1;continue}else if(k.CODES.get("1")<=o&&o<=k.CODES.get("9")){let c=o-k.CODES.get("0");for(r<i&&(t+=e.substring(r,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<k.CODES.get("0")||o>k.CODES.get("9")||c*10+o-k.CODES.get("0")>this.patternGroupCount));i++)c=c*10+o-k.CODES.get("0");if(c>this.patternGroupCount){t+=`$${c}`,r=i,i--;continue}let u=this.group(c);u!==null&&(t+=u),r=i,i--;continue}else if(o===k.CODES.get("<")){r<i&&(t+=e.substring(r,i)),i++;let c=i+1;for(;c<e.length&&e.codePointAt(c)!==k.CODES.get(">")&&e.codePointAt(c)!==k.CODES.get(" ");)c++;if(c===e.length||e.codePointAt(c)!==k.CODES.get(">")){t+=e.substring(i-1,c+1),r=c+1,i=c;continue}let u=e.substring(i+1,c);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){let l=this.group(u);l!==null&&(t+=l)}else t+=`$<${u}>`;r=c+1,i=c;continue}}return r<s&&(t+=e.substring(r,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,r=!1){let s="";this.reset();let i=typeof e=="function",o=Object.keys(this.namedGroups).length>0,c=null;if(i){if(this.groupCount()>=FC.MAX_REPLACER_ARGS)throw new Dt("Too many capture groups to safely invoke replacer function");c=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,c):this.appendReplacement(e,r),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,r){let s="",i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;let c=this.buildReplacerArgs(i,t,r);return s+=String(e(...c)),s}buildReplacerArgs(e,t,r){let s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){let c=this.start(o);c<0?s.push(void 0):s.push(this.substring(c,this.end(o)))}if(s.push(e),s.push(r),t){let o=this.getNamedGroups();for(let c in o)o[c]===null&&(o[c]=void 0);s.push(o)}return s}},F=class st{static ALT=1;static ALT_MATCH=2;static CAPTURE=3;static EMPTY_WIDTH=4;static FAIL=5;static MATCH=6;static NOP=7;static RUNE=8;static RUNE1=9;static RUNE_ANY=10;static RUNE_ANY_NOT_NL=11;static LB_WRITE=12;static LB_CHECK=13;static isRuneOp(e){return st.RUNE<=e&&e<=st.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let r of e)t+=X.escapeRune(r);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?W.equalsIgnoreCase(o,e):e===o}let t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&V.FOLD_CASE)!==0?W.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}let t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case st.ALT:return`alt -> ${this.out}, ${this.arg}`;case st.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case st.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case st.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case st.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case st.FAIL:return"fail";case st.NOP:return`nop -> ${this.out}`;case st.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case st.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case st.RUNE:return this.runes===null?"rune <null>":["rune ",st.escapeRunes(this.runes),(this.arg&V.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case st.RUNE1:return`rune1 ${st.escapeRunes(this.runes)} -> ${this.out}`;case st.RUNE_ANY:return`any -> ${this.out}`;case st.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},oC=class{constructor(n){this.sparse=new Int32Array(n),this.densePcs=new Int32Array(n),this.denseCaps=null,this.size=0,this.ncap=0}init(n){this.ncap=n;let e=this.densePcs.length*n;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(n){let e=this.sparse[n];return e<this.size&&this.densePcs[e]===n}isEmpty(){return this.size===0}add(n){let e=this.size++;return this.sparse[n]=e,this.densePcs[e]=n,e}clear(){this.size=0}toString(){let n="{";for(let e=0;e<this.size;e++)e!==0&&(n+=", "),n+=this.densePcs[e];return n+="}",n}},xC=class Zl{static fromRE2(e){let t=new Zl;return t.prog=e.prog,t.re2=e,t.q0=new oC(t.prog.numInst()),t.q1=new oC(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return Zl.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?X.emptyInts():X.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,r){let s=this.re2.cond;if(s===X.EMPTY_ALL||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,g=-1,v=0;l!==mt.EOF()&&(l=e.step(i+f),g=l>>3,v=l&7);let R;for(i===0?R=X.emptyOpContext(-1,h):R=e.context(i);;){if(c.isEmpty()){if((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&g!==this.re2.prefixRune&&e.canCheckPrefix()){let U=e.index(this.re2,i);if(U<0)break;i+=U,l=e.step(i),h=l>>3,f=l&7,l=e.step(i+f),g=l>>3,v=l&7,R=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let U=0;U<this.prog.lbStarts.length;U++)this.add(c,this.prog.lbStarts[U],i,this.matchcap,0,R);!this.matched&&(i===0||r===V.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(c,this.prog.start,i,this.matchcap,0,R));let b=i+f;if(R=e.context(b),this.step(c,u,i,b,h,R,r,i===e.endPos()),f===0||this.ncap===0&&this.matched)break;i+=f,h=g,f=v,h!==-1&&(l=e.step(i+f),g=l>>3,v=l&7);let G=c;c=u,u=G}return u.clear(),this.matched}matchSet(e,t,r){let s=this.re2.cond;if(s===X.EMPTY_ALL)return[];if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,g=-1,v=0;l!==mt.EOF()&&(l=e.step(i+f),g=l>>3,v=l&7);let R=i===0?X.emptyOpContext(-1,h):e.context(i),b=new Set;for(;!(c.isEmpty()&&((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let ae=0;ae<this.prog.lbStarts.length;ae++)this.add(c,this.prog.lbStarts[ae],i,this.matchcap,0,R);(i===0||r===V.UNANCHORED)&&i>=o&&this.add(c,this.prog.start,i,this.matchcap,0,R);let G=i+f;R=e.context(G);for(let ae=0;ae<c.size;ae++){let ve=c.densePcs[ae],we=this.prog.inst[ve],Ve=ae*this.ncap,be=!1;switch(we.op){case F.MATCH:if(r===V.ANCHOR_BOTH&&i!==e.endPos())break;b.add(we.arg);break;case F.RUNE:be=we.matchRune(h);break;case F.RUNE1:be=h===we.runes[0];break;case F.RUNE_ANY:be=!0;break;case F.RUNE_ANY_NOT_NL:be=h!==10;break;default:continue}be&&this.add(u,we.out,G,c.denseCaps,Ve,R)}if(c.clear(),f===0)break;i+=f,h=g,f=v,h!==-1&&(l=e.step(i+f),g=l>>3,v=l&7);let U=c;c=u,u=U}return u.clear(),Array.from(b).sort((G,U)=>G-U)}step(e,t,r,s,i,o,c,u){let l=this.re2.longest;for(let h=0;h<e.size;h++){let f=e.densePcs[h],g=h*this.ncap;if(l&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[g])continue;let v=this.prog.inst[f],R=!1;switch(v.op){case F.MATCH:if(c===V.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!l||!this.matched||this.matchcap[1]<r)){e.denseCaps[g+1]=r;for(let b=0;b<this.ncap;b++)this.matchcap[b]=e.denseCaps[g+b]}l||(e.size=0),this.matched=!0;break;case F.RUNE:R=v.matchRune(i);break;case F.RUNE1:R=i===v.runes[0];break;case F.RUNE_ANY:R=!0;break;case F.RUNE_ANY_NOT_NL:R=i!==10;break;default:continue}R&&this.add(t,v.out,s,e.denseCaps,g,o)}e.clear()}add(e,t,r,s,i,o){for(;;){if(t===0||e.contains(t))return;let c=e.add(t),u=this.prog.inst[t];switch(u.op){case F.FAIL:return;case F.ALT:case F.ALT_MATCH:this.add(e,u.out,r,s,i,o),t=u.arg;continue;case F.EMPTY_WIDTH:if((u.arg&~o)===0){t=u.out;continue}return;case F.NOP:t=u.out;continue;case F.CAPTURE:if(u.arg<this.ncap){let l=s[i+u.arg];s[i+u.arg]=r,this.add(e,u.out,r,s,i,o),s[i+u.arg]=l;return}else{t=u.out;continue}case F.LB_WRITE:this.lbTable[Math.abs(u.arg)]=r,t=u.out;continue;case F.LB_CHECK:if(u.arg>0){if(this.lbTable[u.arg]===r){t=u.out;continue}}else if(this.lbTable[-u.arg]!==r){t=u.out;continue}return;case F.MATCH:case F.RUNE:case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:if(this.ncap>0){let l=c*this.ncap;for(let h=0;h<this.ncap;h++)e.denseCaps[l+h]=s[i+h]}return;default:throw new Yi("unhandled")}}}},aC=n=>{let e=-2128831035;for(let t=0;t<n.length;t++)e^=n[t],e=Math.imul(e,16777619);return e},hI=(n,e)=>{if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0},dI=class{constructor(n,e,t=[]){this.nfaStates=n,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array(W.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array(W.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},LC=class eB{static MAX_CACHE_CLEARS=5;static STATE_MEMORY_ESTIMATE=838;constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/eB.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){let t=new Set,r=[...e],s=!1,i=[];for(;r.length>0;){let c=r.pop();if(t.has(c))continue;t.add(c);let u=this.prog.getInst(c);switch(u.op){case F.MATCH:s=!0,i.includes(u.arg)||i.push(u.arg);break;case F.ALT:case F.ALT_MATCH:r.push(u.out),r.push(u.arg);break;case F.NOP:case F.CAPTURE:r.push(u.out);break;case F.EMPTY_WIDTH:case F.LB_WRITE:case F.LB_CHECK:return null}}let o=Int32Array.from(t).sort();return i.sort((c,u)=>c-u),{pcs:o,isMatch:s,matchIDs:i}}getState(e){let t=this.computeClosure(e);if(!t)return null;let r=t.pcs,s=aC(r),i=this.stateCache.get(s);if(i)for(let c=0;c<i.length;c++){let u=i[c];if(hI(u.nfaStates,r))return u.lastSeen=++this.clock,u}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=eB.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}let o=new dI(r,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){let e=[];for(let o of this.stateCache.values())for(let c=0;c<o.length;c++)e.push(o[c]);e.sort((o,c)=>o.lastSeen-c.lastSeen);let t=Math.max(1,Math.floor(this.stateLimit/2)),r=e.length-t,s=e.slice(r),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){let c=s[o];c.nextLatin1.fill(null),c.nextLatin1Anchored.fill(null),c.transKeys.length=0,c.transVals.length=0;let u=aC(c.nfaStates),l=this.stateCache.get(u);l||(l=[],this.stateCache.set(u,l)),l.push(c),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,r){if(t<=W.MAX_LATIN1)if(r===V.UNANCHORED){let o=e.nextLatin1[t];if(o!==null)return o}else{let o=e.nextLatin1Anchored[t];if(o!==null)return o}else{let o=t+(r===V.UNANCHORED?0:W.MAX_RUNE+1),c=e.transKeys,u=c.length;for(let l=0;l<u;l++)if(c[l]===o)return e.transVals[l]}let s=[];for(let o=0;o<e.nfaStates.length;o++){let c=e.nfaStates[o],u=this.prog.getInst(c);F.isRuneOp(u.op)&&u.matchRune(t)&&s.push(u.out)}r===V.UNANCHORED&&s.push(this.prog.start);let i=this.getState(s);if(t<=W.MAX_LATIN1)r===V.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{let o=t+(r===V.UNANCHORED?0:W.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,r){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(r===V.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){let c=e.step(o),u=c>>3,l=c&7;if(l===0)break;if(i=r===V.UNANCHORED&&u<=W.MAX_LATIN1&&i.nextLatin1[u]||this.step(i,u,r),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(r===V.ANCHOR_BOTH){if(o+l===s)return!0}else return!0;if(i.nfaStates.length===0&&r!==V.UNANCHORED)return!1;o+=l}return!1}matchSet(e,t,r){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState,o=new Set,c=(l,h)=>{l.isMatch&&(r===V.ANCHOR_BOTH?h===s&&l.matchIDs.forEach(f=>o.add(f)):l.matchIDs.forEach(f=>o.add(f)))};c(i,t);let u=t;for(;u<s;){let l=e.step(u),h=l>>3,f=l&7;if(f===0)break;if(i=r===V.UNANCHORED&&h<=W.MAX_LATIN1&&i.nextLatin1[h]||this.step(i,h,r),i===null)return null;if(i.lastSeen=++this.clock,u+=f,c(i,u),i.nfaStates.length===0&&r!==V.UNANCHORED)break}return Array.from(o).sort((l,h)=>l-h)}},fI=32,pI=500,Ql=256,gI=256*1024,CI=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(Ql),this.jobArg=new Uint8Array(Ql),this.jobPos=new Int32Array(Ql),this.jobLen=0,this.visited=new Uint32Array(0)}reset(n,e,t){this.end=e,this.jobLen=0,this.ncap=t;let r=n.numInst()*(e+1)+fI-1>>>5;this.visited.length<r?this.visited=new Uint32Array(r):this.visited.fill(0,0,r),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(n,e){let t=n*(this.end+1)+e,r=t>>>5,s=1<<(t&31);return(this.visited[r]&s)!==0?!1:(this.visited[r]|=s,!0)}push(n,e,t,r){if(n.prog.getInst(e).op!==F.FAIL&&(r||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){let s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;let o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;let c=new Int32Array(s);c.set(this.jobPos),this.jobPos=c}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=r?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(n,e,t,r,s){let i=n.longest;for(this.push(n,t,r,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],c=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],l=!0;for(;!(!l&&!this.shouldVisit(o,u));){l=!1;let h=n.prog.getInst(o);switch(h.op){case F.FAIL:throw new Yi("unexpected InstFail");case F.ALT:if(c){c=!1,o=h.arg;continue}else{this.push(n,o,u,!0),o=h.out;continue}case F.ALT_MATCH:{let f=n.prog.getInst(h.out);if(F.isRuneOp(f.op)){this.push(n,h.arg,u,!1),o=h.arg,u=this.end;continue}this.push(n,h.out,this.end,!1),o=h.out;continue}case F.RUNE:{let f=e.step(u);if(f===mt.EOF()||!h.matchRune(f>>3))break;u+=f&7,o=h.out;continue}case F.RUNE1:{let f=e.step(u);if(f===mt.EOF()||f>>3!==h.runes[0])break;u+=f&7,o=h.out;continue}case F.RUNE_ANY_NOT_NL:{let f=e.step(u);if(f===mt.EOF()||f>>3===10)break;u+=f&7,o=h.out;continue}case F.RUNE_ANY:{let f=e.step(u);if(f===mt.EOF())break;u+=f&7,o=h.out;continue}case F.CAPTURE:if(c){this.cap[h.arg]=u;break}else{h.arg<this.ncap&&(this.push(n,o,this.cap[h.arg],!0),this.cap[h.arg]=u),o=h.out;continue}case F.EMPTY_WIDTH:{let f=e.context(u);if((h.arg&~f)!==0)break;o=h.out;continue}case F.NOP:o=h.out;continue;case F.MATCH:{if(s===V.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);let f=this.matchcap[1];if((f===-1||i&&u>0&&u>f)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case F.LB_WRITE:case F.LB_CHECK:throw new Yi("Backtracker cannot evaluate Lookbehind instructions");default:throw new Yi("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}},ec=[],tc=class VC{static shouldBacktrack(e){return e.numInst()<=pI}static maxBitStateLen(e){return VC.shouldBacktrack(e)?Math.floor(gI/e.numInst()):0}static execute(e,t,r,s,i){let o=e.cond;if(o===X.EMPTY_ALL||(s===V.ANCHOR_START||s===V.ANCHOR_BOTH)&&r!==0||(o&X.EMPTY_BEGIN_TEXT)!==0&&r!==0)return null;let c=ec.length>0?ec.pop():new CI,u=t.endPos();c.reset(e.prog,u,i);let l=!1;if((o&X.EMPTY_BEGIN_TEXT)!==0||s===V.ANCHOR_START||s===V.ANCHOR_BOTH)c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)&&(l=!0);else{let f=-1;for(;r<=u&&f!==0;r+=f){if(e.prefix.length>0){let v=t.index(e,r);if(v<0)break;r+=v}if(c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)){l=!0;break}let g=t.step(r);f=g===mt.EOF()?0:g&7}}if(!l)return ec.push(c),null;let h=i===0?[]:X.toArray(c.matchcap.subarray(0,i));return ec.push(c),h}},cC=class{constructor(n){this.sparse=new Uint32Array(n),this.dense=new Uint32Array(n),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(n){return n<this.sparse.length&&this.sparse[n]<this.size&&this.dense[this.sparse[n]]===n}insert(n){this.contains(n)||this.insertNew(n)}insertNew(n){n>=this.sparse.length||(this.sparse[n]=this.size,this.dense[this.size]=n,this.size++)}},mI=(n,e,t,r)=>{let s=n.length,i=e.length,o=0,c=0,u=[],l=[],h=!0,f=-1,g=v=>{let R=v?n:e,b=v?o:c,G=v?t:r;return f>0&&R[b]<=u[f]?!1:(u.push(R[b],R[b+1]),v?o+=2:c+=2,f+=2,l.push(G),!0)};for(;o<s||c<i;)if(c>=i?h=g(!0):o>=s||e[c]<n[o]?h=g(!1):h=g(!0),!h)return null;return{merged:u,next:l}},EI=class{constructor(n){this.start=n.start,this.numCap=n.numCap,this.inst=new Array(n.inst.length);for(let e=0;e<n.inst.length;e++){let t=n.inst[e],r=new F(t.op);r.out=t.out,r.arg=t.arg,r.runes=t.runes?t.runes.slice():[],r.next=null,this.inst[e]=r}}},_I=n=>{let e=new EI(n);for(let t=0;t<e.inst.length;t++){let r=e.inst[t];if(r.op!==F.ALT&&r.op!==F.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[r[i]];if(o.op!==F.ALT&&o.op!==F.ALT_MATCH&&(s="arg",i="out",o=e.inst[r[i]],o.op!==F.ALT&&o.op!==F.ALT_MATCH))continue;let c=e.inst[r[s]];if(c.op===F.ALT||c.op===F.ALT_MATCH)continue;let u="out",l="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,u="arg",l="out"),h&&(o[u]=r[s]),r[s]===o[u]&&(r[i]=o[l])}return e},wI=n=>{if(n.inst.length>=1e3)return null;let e=new cC(n.inst.length),t=new cC(n.inst.length),r=new Array(n.inst.length),s=new Array(n.inst.length).fill(!1),i=o=>{let c=!0,u=n.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case F.ALT:case F.ALT_MATCH:{c=i(u.out)&&i(u.arg);let l=s[u.out],h=s[u.arg];if(l&&h)return!1;if(h){let R=u.out;u.out=u.arg,u.arg=R;let b=l;l=h,h=b}l&&(s[o]=!0,u.op=F.ALT_MATCH);let f=r[u.out]||[],g=r[u.arg]||[],v=mI(f,g,u.out,u.arg);if(!v)return!1;r[o]=v.merged,u.next=new Uint32Array(v.next);break}case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:c=i(u.out),s[o]=s[u.out],r[o]=r[u.out]?r[u.out].slice():[],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break;case F.MATCH:case F.FAIL:s[o]=u.op===F.MATCH;break;case F.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){r[o]=[],u.next=new Uint32Array([u.out]);break}let l=[];if(u.runes.length===1&&(u.arg&V.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=W.simpleFold(h);f!==h;f=W.simpleFold(f))l.push(f,f);l.sort((f,g)=>f-g)}else for(let h=0;h<u.runes.length;h++)l.push(u.runes[h]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let l=[];if((u.arg&V.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=W.simpleFold(h);f!==h;f=W.simpleFold(f))l.push(f,f);l.sort((f,g)=>f-g)}else l.push(u.runes[0],u.runes[0]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,W.MAX_RUNE],u.next=new Uint32Array([u.out]);break;case F.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,9,11,W.MAX_RUNE],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break}return c};for(e.clear(),e.insert(n.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<n.inst.length;o++)r[o]&&(n.inst[o].runes=r[o]);return n},yI=(n,e)=>{for(let t=0;t<e.inst.length;t++){let r=e.inst[t];switch(r.op){case F.ALT:case F.ALT_MATCH:case F.RUNE:break;case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:case F.MATCH:case F.FAIL:n.inst[t].next=null;break;case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:n.inst[t].next=null,n.inst[t].op=r.op,n.inst[t].runes=r.runes?r.runes.slice():[];break}}},uC=class MC{static compile(e){if(e.start===0||e.numLb>0)return null;let t=e.inst[e.start];if(t.op!==F.EMPTY_WIDTH||(t.arg&X.EMPTY_BEGIN_TEXT)===0)return null;let r=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===F.ALT||e.inst[i].op===F.ALT_MATCH){r=!0;break}for(let i=0;i<e.inst.length;i++){let o=e.inst[i],c=e.inst[o.out].op;switch(o.op){case F.ALT:case F.ALT_MATCH:if(c===F.MATCH||e.inst[o.arg].op===F.MATCH)return null;break;case F.EMPTY_WIDTH:if(c===F.MATCH){if((o.arg&X.EMPTY_END_TEXT)===X.EMPTY_END_TEXT)continue;return null}break;default:if(c===F.MATCH&&r)return null;break}}let s=_I(e);return s=wI(s),s!==null&&yI(s,e),s}static next(e,t){let r=e.matchRunePos(t);return r>=0?e.next[r]:e.op===F.ALT_MATCH?e.out:0}static execute(e,t,r,s,i){let o=e.onepass;if(!o)return null;let c=new Int32Array(i).fill(-1),u=!1,l=t.step(r),h=l>>3,f=l&7,g=mt.EOF(),v=-1,R=0;l!==mt.EOF()&&(g=t.step(r+f),g!==mt.EOF()&&(v=g>>3,R=g&7));let b=r===0?X.emptyOpContext(-1,h):t.context(r),G=o.start,U;for(;;){switch(U=o.inst[G],G=U.out,U.op){case F.MATCH:return s===V.ANCHOR_BOTH&&r!==t.endPos()?null:(u=!0,c.length>0&&(c[0]=0,c[1]=r),i===0?[]:X.toArray(c));case F.RUNE:if(!U.matchRune(h))return null;break;case F.RUNE1:if(h!==U.runes[0])return null;break;case F.RUNE_ANY:break;case F.RUNE_ANY_NOT_NL:if(h===10)return null;break;case F.ALT:case F.ALT_MATCH:G=MC.next(U,h);continue;case F.FAIL:return null;case F.NOP:continue;case F.EMPTY_WIDTH:if((U.arg&~b)!==0)return null;continue;case F.CAPTURE:U.arg<c.length&&(c[U.arg]=r);continue;default:throw new Yi("bad inst")}if(f===0)break;b=X.emptyOpContext(h,v),r+=f,h=v,f=R,h!==-1&&(g=t.step(r+f),g!==mt.EOF()?(v=g>>3,R=g&7):(v=-1,R=0))}return u?i===0?[]:X.toArray(c):null}},T=class oe{static Op=OC(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"]);static isPseudoOp(e){return e>=oe.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===k.CODES.get("-")?"\\":""}static fromRegexp(e){let t=new oe(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=oe.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=oe.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case oe.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case oe.Op.EMPTY_MATCH:e+="(?:)";break;case oe.Op.STAR:case oe.Op.PLUS:case oe.Op.QUEST:case oe.Op.REPEAT:{let t=this.subs[0];switch(t.op>oe.Op.CAPTURE||t.op===oe.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case oe.Op.STAR:e+="*";break;case oe.Op.PLUS:e+="+";break;case oe.Op.QUEST:e+="?";break;case oe.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&V.NON_GREEDY)!==0&&(e+="?");break}case oe.Op.CONCAT:for(let t of this.subs)t.op===oe.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case oe.Op.ALTERNATE:{let t="";for(let r of this.subs)e+=t,t="|",e+=r.appendTo();break}case oe.Op.LITERAL:(this.flags&V.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=X.escapeRune(t);(this.flags&V.FOLD_CASE)!==0&&(e+=")");break;case oe.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case oe.Op.ANY_CHAR:e+="(?s:.)";break;case oe.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case oe.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case oe.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==oe.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case oe.Op.BEGIN_TEXT:e+="\\A";break;case oe.Op.END_TEXT:(this.flags&V.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case oe.Op.BEGIN_LINE:e+="^";break;case oe.Op.END_LINE:e+="$";break;case oe.Op.WORD_BOUNDARY:e+="\\b";break;case oe.Op.NO_WORD_BOUNDARY:e+="\\B";break;case oe.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===W.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){let r=this.runes[t]+1,s=this.runes[t+1]-1;e+=oe.quoteIfHyphen(r),e+=X.escapeRune(r),r!==s&&(e+="-",e+=oe.quoteIfHyphen(s),e+=X.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){let r=this.runes[t],s=this.runes[t+1];e+=oe.quoteIfHyphen(r),e+=X.escapeRune(r),r!==s&&(e+="-",e+=oe.quoteIfHyphen(s),e+=X.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===oe.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){let r=t.maxCap();e<r&&(e=r)}return e}equals(e){if(!(e!==null&&e instanceof oe)||this.op!==e.op)return!1;switch(this.op){case oe.Op.END_TEXT:if((this.flags&V.WAS_DOLLAR)!==(e.flags&V.WAS_DOLLAR))return!1;break;case oe.Op.LITERAL:case oe.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case oe.Op.ALTERNATE:case oe.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case oe.Op.STAR:case oe.Op.PLUS:case oe.Op.QUEST:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.REPEAT:if((this.flags&V.NON_GREEDY)!==(e.flags&V.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.PLB:case oe.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},lC=class{constructor(n){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(let t of n){let r=0;for(let s=0;s<t.length;s++){let i=t[s];i in this.next[r]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[r][i]=this.next.length-1),r=this.next[r][i]}this.match[r]=!0}let e=[];for(let t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){let r=this.next[0][t];this.fail[r]=0,e.push(r)}for(;e.length>0;){let t=e.shift();for(let r in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],r)){let s=this.next[t][r],i=this.fail[t];for(;i!==0&&!(r in this.next[i]);)i=this.fail[i];r in this.next[i]?this.fail[s]=this.next[i][r]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n.charCodeAt(s);for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}searchUTF8(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n[s];for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}},Ie=class $i{static Type={NONE:0,EXACT:1,AND:2,OR:3};constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case $i.Type.NONE:return!0;case $i.Type.EXACT:return e.hasString(this,t);case $i.Type.AND:for(let r=0;r<this.subs.length;r++)if(!this.subs[r].eval(e,t))return!1;return!0;case $i.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let r=0;r<this.subs.length;r++)if(this.subs[r].eval(e,t))return!0;return!1;default:return!0}}},DI=class Sn{static build(e){let t=Sn.fromRegexp(e);return Sn.simplify(t)}static fromRegexp(e){if(!e)return new Ie(Ie.Type.NONE);switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.NO_MATCH:case T.Op.EMPTY_MATCH:case T.Op.BEGIN_LINE:case T.Op.END_LINE:case T.Op.BEGIN_TEXT:case T.Op.END_TEXT:case T.Op.WORD_BOUNDARY:case T.Op.NO_WORD_BOUNDARY:case T.Op.CHAR_CLASS:case T.Op.ANY_CHAR_NOT_NL:case T.Op.ANY_CHAR:return new Ie(Ie.Type.NONE);case T.Op.LITERAL:{if(e.runes.length===0||(e.flags&V.FOLD_CASE)!==0)return new Ie(Ie.Type.NONE);let t=new Ie(Ie.Type.EXACT),r="";for(let s=0;s<e.runes.length;s++)r+=String.fromCodePoint(e.runes[s]);return t.str=r,t.bytes=X.stringToUtf8ByteArray(t.str),t}case T.Op.CAPTURE:case T.Op.PLUS:return Sn.fromRegexp(e.subs[0]);case T.Op.REPEAT:return e.min>=1?Sn.fromRegexp(e.subs[0]):new Ie(Ie.Type.NONE);case T.Op.CONCAT:{let t=new Ie(Ie.Type.AND);for(let r of e.subs)t.subs.push(Sn.fromRegexp(r));return t}case T.Op.ALTERNATE:{let t=new Ie(Ie.Type.OR);for(let r of e.subs)t.subs.push(Sn.fromRegexp(r));return t}default:return new Ie(Ie.Type.NONE)}}static simplify(e){if(e.type===Ie.Type.EXACT||e.type===Ie.Type.NONE)return e;if(e.type===Ie.Type.AND){let t=[];for(let r of e.subs){let s=Sn.simplify(r);if(s.type!==Ie.Type.NONE)if(s.type===Ie.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new Ie(Ie.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===Ie.Type.OR){let t=[];for(let o of e.subs){let c=Sn.simplify(o);if(c.type===Ie.Type.NONE)return new Ie(Ie.Type.NONE);if(c.type===Ie.Type.OR)for(let u=0;u<c.subs.length;u++)t.push(c.subs[u]);else t.push(c)}if(t.length===0)return new Ie(Ie.Type.NONE);if(t.length===1)return t[0];let r=new Set,s=[];for(let o of t)o.type===Ie.Type.EXACT?r.has(o.str)||(r.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(let o of s)if(o.type!==Ie.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new lC(s.map(o=>{let c=[];for(let u=0;u<o.str.length;u++)c.push(o.str.charCodeAt(u));return c})),e.ac8=new lC(s.map(o=>o.bytes))),e}return e}},jt=class{constructor(n=0,e=0){this.head=n,this.tail=e}},II=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(n){return this.inst[n]}numInst(){return this.inst.length}addInst(n){this.inst.push(new F(n))}skipNop(n){let e=this.inst[n];for(;e.op===F.NOP||e.op===F.CAPTURE;)e=this.inst[n],n=e.out;return e}prefix(){let n="",e=this.skipNop(this.start);if(!F.isRuneOp(e.op)||e.runes.length!==1)return[e.op===F.MATCH,n];for(;F.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&V.FOLD_CASE)===0;)n+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===F.MATCH,n]}startCond(){let n=0,e=this.start;e:for(;;){let t=this.inst[e];switch(t.op){case F.EMPTY_WIDTH:n|=t.arg;break;case F.FAIL:return-1;case F.CAPTURE:case F.NOP:break;default:break e}e=t.out}return n}patch(n,e){let t=n.head;for(;t!==0;){let r=this.inst[t>>1];(t&1)===0?(t=r.out,r.out=e):(t=r.arg,r.arg=e)}}append(n,e){if(n.head===0)return e;if(e.head===0)return n;let t=this.inst[n.tail>>1];return(n.tail&1)===0?t.out=e.head:t.arg=e.head,new jt(n.head,e.tail)}toString(){let n="";for(let e=0;e<this.inst.length;e++){let t=n.length;n+=e,e===this.start&&(n+="*"),n+="        ".substring(n.length-t),n+=this.inst[e],n+=`
`}return n}},nc=class{constructor(n=0,e=new jt,t=!1){this.i=n,this.out=e,this.nullable=t}},GC=class As{static ANY_RUNE_NOT_NL(){return[0,k.CODES.get(`
`)-1,k.CODES.get(`
`)+1,W.MAX_RUNE]}static ANY_RUNE(){return[0,W.MAX_RUNE]}static compileRegexp(e){let t=new As,r=t.compile(e);return t.prog.patch(r.out,t.newInst(F.MATCH).i),t.prog.start=r.i,t.prog}static compileSet(e){let t=new As;if(e.length===0)return t.prog.start=t.newInst(F.FAIL).i,t.prog;let r=[];for(let i=0;i<e.length;i++){let o=t.compile(e[i]),c=t.newInst(F.MATCH);t.prog.getInst(c.i).arg=i,t.prog.patch(o.out,c.i),r.push(o.i)}let s=r[0];for(let i=1;i<r.length;i++){let o=t.newInst(F.ALT),c=t.prog.getInst(o.i);c.out=s,c.arg=r[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new II,this.newInst(F.FAIL)}newInst(e){return this.prog.addInst(e),new nc(this.prog.numInst()-1,new jt,!0)}nop(){let e=this.newInst(F.NOP);return e.out=new jt(e.i<<1,e.i<<1),e}fail(){return new nc}cap(e){let t=this.newInst(F.CAPTURE);return t.out=new jt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new nc(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return s.out=e.i,s.arg=t.i,r.out=this.prog.append(e.out,t.out),r.nullable=e.nullable||t.nullable,r}loop(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new jt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new jt(r.i<<1|1,r.i<<1|1)),this.prog.patch(e.out,r.i),r}quest(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new jt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new jt(r.i<<1|1,r.i<<1|1)),r.out=this.prog.append(r.out,e.out),r}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new nc(e.i,this.loop(e,t).out,e.nullable)}empty(e){let t=this.newInst(F.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new jt(t.i<<1,t.i<<1),t}rune(e,t){let r=this.newInst(F.RUNE);r.nullable=!1;let s=this.prog.getInst(r.i);return s.runes=e,t&=V.FOLD_CASE,(e.length!==1||W.simpleFold(e[0])===e[0])&&(t&=~V.FOLD_CASE),s.arg=t,r.out=new jt(r.i<<1,r.i<<1),(t&V.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=F.RUNE1:e.length===2&&e[0]===0&&e[1]===W.MAX_RUNE?s.op=F.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===k.CODES.get(`
`)-1&&e[2]===k.CODES.get(`
`)+1&&e[3]===W.MAX_RUNE&&(s.op=F.RUNE_ANY_NOT_NL),r}lookBehind(e,t){let r=this.newInst(F.LB_WRITE);this.prog.getInst(r.i).arg=t;let s=this.rune(As.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,r.i);let c=this.newInst(F.LB_CHECK);return this.prog.getInst(c.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),c.out=new jt(c.i<<1,c.i<<1),c}compile(e){switch(e.op){case T.Op.NO_MATCH:return this.fail();case T.Op.EMPTY_MATCH:return this.nop();case T.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let r of e.runes){let s=this.rune([r],e.flags);t=t===null?s:this.cat(t,s)}return t}case T.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case T.Op.ANY_CHAR_NOT_NL:return this.rune(As.ANY_RUNE_NOT_NL(),0);case T.Op.ANY_CHAR:return this.rune(As.ANY_RUNE(),0);case T.Op.BEGIN_LINE:return this.empty(X.EMPTY_BEGIN_LINE);case T.Op.END_LINE:return this.empty(X.EMPTY_END_LINE);case T.Op.BEGIN_TEXT:return this.empty(X.EMPTY_BEGIN_TEXT);case T.Op.END_TEXT:return this.empty(X.EMPTY_END_TEXT);case T.Op.WORD_BOUNDARY:return this.empty(X.EMPTY_WORD_BOUNDARY);case T.Op.NO_WORD_BOUNDARY:return this.empty(X.EMPTY_NO_WORD_BOUNDARY);case T.Op.PLB:case T.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case T.Op.CAPTURE:{let t=this.cap(e.cap<<1),r=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,r),s)}case T.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&V.NON_GREEDY)!==0);case T.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.cat(t,s)}return t}case T.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.alt(t,s)}return t}default:throw new kC("regexp: unhandled case in compile")}}},UC=class Ot{static simplify(e){if(e===null)return null;switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:{let t=Ot.simplify(e.subs[0]);if(t!==e.subs[0]){let r=T.fromRegexp(e);return r.runes=[],r.subs=[t],r}return e}case T.Op.CONCAT:case T.Op.ALTERNATE:{let t=[],r=!1;for(let s=0;s<e.subs.length;s++){let i=e.subs[s],o=Ot.simplify(i);if(o!==i&&(r=!0),e.op===T.Op.CONCAT){if(o.op===T.Op.NO_MATCH)return new T(T.Op.NO_MATCH);if(o.op===T.Op.EMPTY_MATCH){r=!0;continue}if(o.op===T.Op.CONCAT){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}else if(e.op===T.Op.ALTERNATE){if(o.op===T.Op.NO_MATCH){r=!0;continue}if(o.op===T.Op.ALTERNATE){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}t.push(o)}if(r){if(t.length===0)return new T(e.op===T.Op.CONCAT?T.Op.EMPTY_MATCH:T.Op.NO_MATCH);if(t.length===1)return t[0];let s=T.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case T.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new T(T.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===W.MAX_RUNE?new T(T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===W.MAX_RUNE?new T(T.Op.ANY_CHAR_NOT_NL):e;case T.Op.STAR:case T.Op.PLUS:case T.Op.QUEST:{let t=Ot.simplify(e.subs[0]);return Ot.simplify1(e.op,e.flags,t,e)}case T.Op.REPEAT:{if(e.min===0&&e.max===0)return new T(T.Op.EMPTY_MATCH);let t=Ot.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return Ot.simplify1(T.Op.STAR,e.flags,t,null);if(e.min===1)return Ot.simplify1(T.Op.PLUS,e.flags,t,null);let s=new T(T.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(Ot.simplify1(T.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),Ot.simplify(s)}if(e.min===1&&e.max===1)return t;let r=null;if(e.min>0){r=[];for(let s=0;s<e.min;s++)r.push(t)}if(e.max>e.min){let s=Ot.simplify1(T.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){let o=new T(T.Op.CONCAT);o.subs=[t,s],s=Ot.simplify1(T.Op.QUEST,e.flags,o,null)}if(r===null)return s;r.push(s)}if(r!==null){let s=new T(T.Op.CONCAT);return s.subs=r.slice(0),Ot.simplify(s)}return new T(T.Op.NO_MATCH)}}return e}static simplify1(e,t,r,s){if(r.op===T.Op.EMPTY_MATCH)return r;if(r.op===T.Op.NO_MATCH)return e===T.Op.PLUS?r:new T(T.Op.EMPTY_MATCH);if(e===r.op&&(t&V.NON_GREEDY)===(r.flags&V.NON_GREEDY))return r;if(s!==null&&s.op===e&&(s.flags&V.NON_GREEDY)===(t&V.NON_GREEDY)&&r===s.subs[0])return s;let i=new T(e);return i.flags=t,i.subs=[r],i}},ye=class{constructor(n,e){this.sign=n,this.cls=e}},BC=[48,57],hC=[9,10,12,13,32,32],dC=[48,57,65,90,95,95,97,122],fC=new Map([["\\d",new ye(1,BC)],["\\D",new ye(-1,BC)],["\\s",new ye(1,hC)],["\\S",new ye(-1,hC)],["\\w",new ye(1,dC)],["\\W",new ye(-1,dC)]]),pC=[48,57,65,90,97,122],gC=[65,90,97,122],CC=[0,127],mC=[9,9,32,32],EC=[0,31,127,127],_C=[48,57],wC=[33,126],yC=[97,122],DC=[32,126],IC=[33,47,58,64,91,96,123,126],TC=[9,13,32,32],AC=[65,90],vC=[48,57,65,90,95,95,97,122],bC=[48,57,65,70,97,102],SC=new Map([["[:alnum:]",new ye(1,pC)],["[:^alnum:]",new ye(-1,pC)],["[:alpha:]",new ye(1,gC)],["[:^alpha:]",new ye(-1,gC)],["[:ascii:]",new ye(1,CC)],["[:^ascii:]",new ye(-1,CC)],["[:blank:]",new ye(1,mC)],["[:^blank:]",new ye(-1,mC)],["[:cntrl:]",new ye(1,EC)],["[:^cntrl:]",new ye(-1,EC)],["[:digit:]",new ye(1,_C)],["[:^digit:]",new ye(-1,_C)],["[:graph:]",new ye(1,wC)],["[:^graph:]",new ye(-1,wC)],["[:lower:]",new ye(1,yC)],["[:^lower:]",new ye(-1,yC)],["[:print:]",new ye(1,DC)],["[:^print:]",new ye(-1,DC)],["[:punct:]",new ye(1,IC)],["[:^punct:]",new ye(-1,IC)],["[:space:]",new ye(1,TC)],["[:^space:]",new ye(-1,TC)],["[:upper:]",new ye(1,AC)],["[:^upper:]",new ye(-1,AC)],["[:word:]",new ye(1,vC)],["[:^word:]",new ye(-1,vC)],["[:xdigit:]",new ye(1,bC)],["[:^xdigit:]",new ye(-1,bC)]]),ur=class lr{static charClassToString(e,t){let r="[";for(let s=0;s<t;s+=2){s>0&&(r+=" ");let i=e[s],o=e[s+1];i===o?r+=`0x${i.toString(16)}`:r+=`0x${i.toString(16)}-0x${o.toString(16)}`}return r+="]",r}static cmp(e,t,r,s){let i=e[t]-r;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,r){let s=((t+r)/2|0)&-2,i=e[s],o=e[s+1],c=t,u=r;for(;c<=u;){for(;c<r&&lr.cmp(e,c,i,o)<0;)c+=2;for(;u>t&&lr.cmp(e,u,i,o)>0;)u-=2;if(c<=u){if(c!==u){let l=e[c];e[c]=e[u],e[u]=l,l=e[c+1],e[c+1]=e[u+1],e[u+1]=l}c+=2,u-=2}}t<u&&lr.qsortIntPair(e,t,u),c<r&&lr.qsortIntPair(e,c,r)}constructor(e=X.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;lr.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){let r=this.r[t],s=this.r[t+1];if(r<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=r,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&V.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let r=2;r<=4;r+=2)if(this.len>=r){let s=this.r[this.len-r],i=this.r[this.len-r+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-r]=e),t>i&&(this.r[this.len-r+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=W.MIN_FOLD&&t>=W.MAX_FOLD)return this.appendRange(e,t);if(t<W.MIN_FOLD||e>W.MAX_FOLD)return this.appendRange(e,t);e<W.MIN_FOLD&&(this.appendRange(e,W.MIN_FOLD-1),e=W.MIN_FOLD),t>W.MAX_FOLD&&(this.appendRange(W.MAX_FOLD+1,t),t=W.MAX_FOLD);for(let r=e;r<=t;r++){this.appendRange(r,r);for(let s=W.simpleFold(r);s!==r;s=W.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let r=0;r<e.length;r+=2){let s=e[r],i=e[r+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=W.MAX_RUNE&&this.appendRange(t,W.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){let r=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(r,s);continue}for(let o=r;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let r=0;r<e.length;++r){let s=e.getLo(r),i=e.getHi(r),o=e.getStride(r);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let c=s;c<=i;c+=o)t<=c-1&&this.appendRange(t,c-1),t=c+1}return t<=W.MAX_RUNE&&this.appendRange(t,W.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let r=0;r<this.len;r+=2){let s=this.r[r],i=this.r[r+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=W.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=W.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let r=e.cls;return t&&(r=new lr().appendFoldedClass(r).cleanClass().toArray()),this.appendClassWithSign(r,e.sign)}toString(){return lr.charClassToString(this.r,this.len)}},TI=class{constructor(n){this.str=n,this.position=0}pos(){return this.position}rewindTo(n){this.position=n}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(n){this.position+=n}skipString(n){this.position+=n.length}pop(){let n=this.str.codePointAt(this.position);return this.position+=X.charCount(n),n}lookingAt(n){return this.str.startsWith(n,this.position)}rest(){return this.str.substring(this.position)}from(n){return this.str.substring(n,this.position)}toString(){return this.rest()}},HC=class Y{static ERR_INTERNAL_ERROR="regexp/syntax: internal error";static ERR_INVALID_CHAR_RANGE="invalid character class range";static ERR_INVALID_ESCAPE="invalid escape sequence";static ERR_INVALID_NAMED_CAPTURE="invalid named capture";static ERR_INVALID_PERL_OP="invalid or unsupported Perl syntax";static ERR_INVALID_REPEAT_OP="invalid nested repetition operator";static ERR_INVALID_REPEAT_SIZE="invalid repeat count";static ERR_MISSING_BRACKET="missing closing ]";static ERR_MISSING_PAREN="missing closing )";static ERR_MISSING_REPEAT_ARGUMENT="missing argument to repetition operator";static ERR_TRAILING_BACKSLASH="trailing backslash at end of expression";static ERR_DUPLICATE_NAMED_CAPTURE="duplicate capture group name";static ERR_UNEXPECTED_PAREN="unexpected )";static ERR_NESTING_DEPTH="expression nests too deeply";static ERR_LARGE="expression too large";static ERR_INVALID_CAPTURE_IN_LOOKBEHIND="invalid capture in lookbehind";static MAX_HEIGHT=1e3;static MAX_SIZE=3355443;static MAX_RUNES=33554432;static ANY_TABLE=new E(new Uint32Array([0,W.MAX_RUNE,1]));static ASCII_TABLE=new E(new Uint32Array([0,127,1]));static ASCII_FOLD_TABLE=new E(new Uint32Array([0,127,1,383,383,1,8490,8490,1]));static unicodeTable(e){return e==="Any"?{tab:Y.ANY_TABLE,fold:Y.ANY_TABLE,sign:1}:e==="Ascii"?{tab:Y.ASCII_TABLE,fold:Y.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:It.CATEGORIES.get("Cn"),fold:It.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:It.CATEGORIES.get("LC"),fold:It.FOLD_CATEGORIES.get("LC"),sign:1}:It.CATEGORIES.has(e)?{tab:It.CATEGORIES.get(e),fold:It.FOLD_CATEGORIES.get(e),sign:1}:It.SCRIPTS.has(e)?{tab:It.SCRIPTS.get(e),fold:It.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<W.MIN_FOLD||e>W.MAX_FOLD)return e;let t=e,r=e;for(e=W.simpleFold(e);e!==r;e=W.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===T.Op.EMPTY_MATCH)return null;if(e.op===T.Op.CONCAT&&e.subs.length>0){let t=e.subs[0];return t.op===T.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){let r=new T(T.Op.LITERAL);return r.flags=t,r.runes=X.stringToRunes(e),r}static parse(e,t){return new Y(e,t).parseInternal()}static parseRepeat(e){let t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);let r=Y.parseInt(e);if(r===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=r;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=Y.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),r<0||r>1e3||s===-2||s>1e3||s>=0&&r>s)throw new Ne(Y.ERR_INVALID_REPEAT_SIZE,e.from(t));return r<<16|s&W.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){let r=e.codePointAt(t);if(r!==k.CODES.get("_")&&!X.isalnum(r))return!1}return!0}static parseInt(e){let t=e.pos();for(;e.more()&&e.peek()>=k.CODES.get("0")&&e.peek()<=k.CODES.get("9");)e.skip(1);let r=e.from(t);return r.length===0||r.length>1&&r.codePointAt(0)===k.CODES.get("0")?-1:r.length>8?-2:parseInt(r,10)}static isCharClass(e){return e.op===T.Op.LITERAL&&e.runes.length===1||e.op===T.Op.CHAR_CLASS||e.op===T.Op.ANY_CHAR_NOT_NL||e.op===T.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case T.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case T.Op.CHAR_CLASS:for(let r=0;r<e.runes.length;r+=2)if(e.runes[r]<=t&&t<=e.runes[r+1])return!0;return!1;case T.Op.ANY_CHAR_NOT_NL:return t!==k.CODES.get(`
`);case T.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case T.Op.ANY_CHAR:break;case T.Op.ANY_CHAR_NOT_NL:Y.matchRune(t,k.CODES.get(`
`))&&(e.op=T.Op.ANY_CHAR);break;case T.Op.CHAR_CLASS:t.op===T.Op.LITERAL?e.runes=new ur(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new ur(e.runes).appendClass(t.runes).toArray();break;case T.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=T.Op.CHAR_CLASS,e.runes=new ur().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){let t=e.pos();if(e.skip(1),!e.more())throw new Ne(Y.ERR_TRAILING_BACKSLASH);let r=e.pop();e:switch(r){case k.CODES.get("1"):case k.CODES.get("2"):case k.CODES.get("3"):case k.CODES.get("4"):case k.CODES.get("5"):case k.CODES.get("6"):case k.CODES.get("7"):if(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"))break;case k.CODES.get("0"):{let s=r-k.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"));i++)s=s*8+e.peek()-k.CODES.get("0"),e.skip(1);return s}case k.CODES.get("x"):{if(!e.more())break;if(r=e.pop(),r===k.CODES.get("{")){let o=0,c=0;for(;;){if(!e.more())break e;if(r=e.pop(),r===k.CODES.get("}"))break;let u=X.unhex(r);if(u<0||(c=c*16+u,c>W.MAX_RUNE))break e;o++}if(o===0)break e;return c}let s=X.unhex(r);if(!e.more())break;r=e.pop();let i=X.unhex(r);if(s<0||i<0)break;return s*16+i}case k.CODES.get("a"):return k.CODES.get("\x07");case k.CODES.get("f"):return k.CODES.get("\f");case k.CODES.get("n"):return k.CODES.get(`
`);case k.CODES.get("r"):return k.CODES.get("\r");case k.CODES.get("t"):return k.CODES.get("	");case k.CODES.get("v"):return k.CODES.get("\v");default:if(r<=W.MAX_ASCII&&!X.isalnum(r))return r;break}throw new Ne(Y.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new Ne(Y.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?Y.parseEscape(e):e.pop()}static concatRunes(e,t){for(let r=0;r<t.length;r++)e.push(t[r]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===T.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(Y.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new T(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>Y.MAX_RUNES)throw new Ne(Y.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===T.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(Y.MAX_SIZE/this.repeats)?this.repeats=Y.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(Y.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>Y.MAX_SIZE)throw new Ne(Y.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let r=0;switch(e.op){case T.Op.LITERAL:r=e.runes.length;break;case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:case T.Op.STAR:r=2+this.calcSize(e.subs[0]);break;case T.Op.PLUS:case T.Op.QUEST:r=1+this.calcSize(e.subs[0]);break;case T.Op.CONCAT:for(let s of e.subs)r=r+this.calcSize(s);break;case T.Op.ALTERNATE:for(let s of e.subs)r=r+this.calcSize(s);e.subs.length>1&&(r=r+e.subs.length-1);break;case T.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?r=2+s:r=1+e.min*s;break}r=e.max*s+(e.max-e.min);break}}return r=Math.max(1,r),this.size===null&&(this.size=new Map),this.size.set(e,r),r}checkHeight(e){if(!(this.numRegexp<Y.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>Y.MAX_HEIGHT)throw new Ne(Y.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let r=1;for(let s of e.subs){let i=this.calcHeight(s);r<1+i&&(r=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,r),r}pop(){return this.stack.pop()}popToPseudo(){let e=this.stack.length,t=e;for(;t>0&&!T.isPseudoOp(this.stack[t-1].op);)t--;let r=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),r}push(e){if(this.numRunes+=e.runes.length,e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&~V.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&~V.FOLD_CASE}else if(e.op===T.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&W.simpleFold(e.runes[0])===e.runes[2]&&W.simpleFold(e.runes[2])===e.runes[0]||e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&W.simpleFold(e.runes[0])===e.runes[1]&&W.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|V.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|V.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){let r=this.stack.length;if(r<2)return!1;let s=this.stack[r-1],i=this.stack[r-2];return s.op!==T.Op.LITERAL||i.op!==T.Op.LITERAL||(s.flags&V.FOLD_CASE)!==(i.flags&V.FOLD_CASE)?!1:(i.runes=Y.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){let r=this.newRegexp(T.Op.LITERAL);return r.flags=t,(t&V.FOLD_CASE)!==0&&(e=Y.minFoldRune(e)),r.runes=[e],r}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){let t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,r,s,i,o){let c=this.flags;if((c&V.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),c^=V.NON_GREEDY),o!==-1))throw new Ne(Y.ERR_INVALID_REPEAT_OP,i.from(o));let u=this.stack.length;if(u===0)throw new Ne(Y.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let l=this.stack[u-1];if(T.isPseudoOp(l.op))throw new Ne(Y.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let h=this.newRegexp(e);if(h.min=t,h.max=r,h.flags=c,h.subs=[l],this.stack[u-1]=h,this.checkLimits(h),e===T.Op.REPEAT&&(t>=2||r>=2)&&!this.repeatIsValid(h,1e3))throw new Ne(Y.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===T.Op.REPEAT){let r=e.max;if(r===0)return!0;if(r<0&&(r=e.min),r>t)return!1;r>0&&(t=Math.trunc(t/r))}for(let r of e.subs)if(!this.repeatIsValid(r,t))return!1;return!0}concat(){this.maybeConcat(-1,0);let e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(T.Op.EMPTY_MATCH)):this.push(this.collapse(e,T.Op.CONCAT))}alternate(){let e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(T.Op.NO_MATCH)):this.push(this.collapse(e,T.Op.ALTERNATE))}cleanAlt(e){e.op===T.Op.CHAR_CLASS&&(e.runes=new ur(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===W.MAX_RUNE?(e.runes=[],e.op=T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===W.MAX_RUNE&&(e.runes=[],e.op=T.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let r=0;for(let c of e)r+=c.op===t?c.subs.length:1;let s=new Array(r).fill(null),i=0;for(let c of e)if(c.op===t){for(let u=0;u<c.subs.length;u++)s[i++]=c.subs[u];this.reuse(c)}else s[i++]=c;let o=this.newRegexp(t);if(o.subs=s,t===T.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){let c=o;o=o.subs[0],this.reuse(c)}return o}factor(e){if(e.length<2)return e;let t=0,r=e.length,s=0,i=null,o=0,c=0,u=0;for(let h=0;h<=r;h++){let f=null,g=0,v=0;if(h<r){let R=e[t+h];if(R.op===T.Op.CONCAT&&R.subs.length>0&&(R=R.subs[0]),R.op===T.Op.LITERAL&&(f=R.runes,g=R.runes.length,v=R.flags&V.FOLD_CASE),v===c){let b=0;for(;b<o&&b<g&&i[b]===f[b];)b++;if(b>0){o=b;continue}}}if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let R=this.newRegexp(T.Op.LITERAL);R.flags=c,R.runes=i.slice(0,o);for(let U=u;U<h;U++)e[t+U]=this.removeLeadingString(e[t+U],o),this.checkLimits(e[t+U]);let b=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),G=this.newRegexp(T.Op.CONCAT);G.subs=[R,b],e[s++]=G}u=h,i=f,o=g,c=v}r=s,t=0,u=0,s=0;let l=null;for(let h=0;h<=r;h++){let f=null;if(!(h<r&&(f=Y.leadingRegexp(e[t+h]),l!==null&&l.equals(f)&&(Y.isCharClass(l)||l.op===T.Op.REPEAT&&l.min===l.max&&Y.isCharClass(l.subs[0]))))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let g=l;for(let b=u;b<h;b++){let G=b!==u;e[t+b]=this.removeLeadingRegexp(e[t+b],G),this.checkLimits(e[t+b])}let v=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),R=this.newRegexp(T.Op.CONCAT);R.subs=[g,v],e[s++]=R}u=h,l=f}}r=s,t=0,u=0,s=0;for(let h=0;h<=r;h++)if(!(h<r&&Y.isCharClass(e[t+h]))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let f=u;for(let v=u+1;v<h;v++){let R=e[t+f],b=e[t+v];(R.op<b.op||R.op===b.op&&(R.runes!==null?R.runes.length:0)<(b.runes!==null?b.runes.length:0))&&(f=v)}let g=e[t+u];e[t+u]=e[t+f],e[t+f]=g;for(let v=u+1;v<h;v++)Y.mergeCharClass(e[t+u],e[t+v]),this.reuse(e[t+v]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}h<r&&(e[s++]=e[t+h]),u=h+1}r=s,t=0,u=0,s=0;for(let h=0;h<r;++h)h+1<r&&e[t+h].op===T.Op.EMPTY_MATCH&&e[t+h+1].op===T.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return r=s,t=0,e.slice(t,r)}removeLeadingString(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){let r=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=r,r.op===T.Op.EMPTY_MATCH)switch(this.reuse(r),e.subs.length){case 0:case 1:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 2:{let s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===T.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=T.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 1:{let r=e;e=e.subs[0],this.reuse(r);break}}return e}return t&&this.reuse(e),this.newRegexp(T.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&V.LITERAL)!==0)return Y.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,r=-1,s=new TI(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case k.CODES.get("("):if((this.flags&V.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&V.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(T.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case k.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case k.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case k.CODES.get("^"):(this.flags&V.ONE_LINE)!==0?this.op(T.Op.BEGIN_TEXT):this.op(T.Op.BEGIN_LINE),s.skip(1);break;case k.CODES.get("$"):(this.flags&V.ONE_LINE)!==0?this.op(T.Op.END_TEXT).flags|=V.WAS_DOLLAR:this.op(T.Op.END_LINE),s.skip(1);break;case k.CODES.get("."):(this.flags&V.DOT_NL)!==0?this.op(T.Op.ANY_CHAR):this.op(T.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case k.CODES.get("["):this.parseClass(s);break;case k.CODES.get("*"):case k.CODES.get("+"):case k.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case k.CODES.get("*"):o=T.Op.STAR;break;case k.CODES.get("+"):o=T.Op.PLUS;break;case k.CODES.get("?"):o=T.Op.QUEST;break}this.repeat(o,t,r,i,s,e);break}case k.CODES.get("{"):{i=s.pos();let o=Y.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,r=(o&W.MAX_BMP)<<16>>16,this.repeat(T.Op.REPEAT,t,r,i,s,e);break}case k.CODES.get("\\"):{let o=s.pos();if(s.skip(1),(this.flags&V.PERL_X)!==0&&s.more())switch(s.pop()){case k.CODES.get("A"):this.op(T.Op.BEGIN_TEXT);break e;case k.CODES.get("b"):this.op(T.Op.WORD_BOUNDARY);break e;case k.CODES.get("B"):this.op(T.Op.NO_WORD_BOUNDARY);break e;case k.CODES.get("C"):throw new Ne(Y.ERR_INVALID_ESCAPE,"\\C");case k.CODES.get("Q"):{let l=s.rest(),h=l.indexOf("\\E");h>=0?(l=l.substring(0,h),s.skipString(l),s.skipString("\\E")):s.skipString(l);let f=0;for(;f<l.length;){let g=l.codePointAt(f);this.literal(g),f+=X.charCount(g)}break e}case k.CODES.get("z"):this.op(T.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);let c=this.newRegexp(T.Op.CHAR_CLASS);if(c.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){let l=new ur;if(this.parseUnicodeClass(s,l)){c.runes=l.toArray(),this.push(c);break e}}let u=new ur;if(this.parsePerlClassEscape(s,u)){c.runes=u.toArray(),this.push(c);break e}s.rewindTo(o),this.reuse(c),this.literal(Y.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new Ne(Y.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){let t=e.pos(),r=e.rest();if(r.startsWith("(?P<")||r.startsWith("(?<")){let c=r.charAt(2)==="P"?4:3,u=r.indexOf(">");if(u<0)throw new Ne(Y.ERR_INVALID_NAMED_CAPTURE,r);let l=r.substring(c,u);if(e.skipString(l),e.skip(c+1),!Y.isValidCaptureName(l))throw new Ne(Y.ERR_INVALID_NAMED_CAPTURE,r.substring(0,u+1));let h=this.op(T.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[l])throw new Ne(Y.ERR_DUPLICATE_NAMED_CAPTURE,l);this.namedGroups[l]=this.numCap,h.name=l;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){let c=e.pop();switch(c){case k.CODES.get("i"):s|=V.FOLD_CASE,o=!0;break;case k.CODES.get("m"):s&=~V.ONE_LINE,o=!0;break;case k.CODES.get("s"):s|=V.DOT_NL,o=!0;break;case k.CODES.get("U"):s|=V.NON_GREEDY,o=!0;break;case k.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case k.CODES.get(":"):case k.CODES.get(")"):if(i<0){if(!o)break e;s=~s}c===k.CODES.get(":")&&this.op(T.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new Ne(Y.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(T.Op.VERTICAL_BAR)}swapVerticalBar(){let e=this.stack.length;if(e>=3&&this.stack[e-2].op===T.Op.VERTICAL_BAR&&Y.isCharClass(this.stack[e-1])&&Y.isCharClass(this.stack[e-3])){let t=this.stack[e-1],r=this.stack[e-3];if(t.op>r.op){let s=r;r=t,t=s,this.stack[e-3]=r}return Y.mergeCharClass(r,t),this.reuse(t),this.pop(),!0}if(e>=2){let t=this.stack[e-1],r=this.stack[e-2];if(r.op===T.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=r,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new Ne(Y.ERR_UNEXPECTED_PAREN,this.wholeRegexp);let e=this.pop(),t=this.pop();if(t.op!==T.Op.LEFT_PAREN)throw new Ne(Y.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(Y.hasCapture(e))throw new Ne(Y.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=T.Op.PLB:t.op=T.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=T.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){let r=e.pos();if((this.flags&V.PERL_X)===0||!e.more()||e.pop()!==k.CODES.get("\\")||!e.more())return!1;e.pop();let s=e.from(r),i=fC.has(s)?fC.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&V.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){let r=e.rest(),s=r.indexOf(":]");if(s<0)return!1;let i=r.substring(0,s+2);e.skipString(i);let o=SC.has(i)?SC.get(i):null;if(o===null)throw new Ne(Y.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&V.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){let r=e.pos();if((this.flags&V.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===k.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(r),new Ne(Y.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==k.CODES.get("{"))o=X.runeToString(i);else{let h=e.rest(),f=h.indexOf("}");if(f<0)throw e.rewindTo(r),new Ne(Y.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,f),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===k.CODES.get("^")&&(s=0-s,o=o.substring(1));let c=Y.unicodeTable(o);if(c===null)throw new Ne(Y.ERR_INVALID_CHAR_RANGE,e.from(r));c.sign<0&&(s=0-s);let u=c.tab,l=c.fold;if((this.flags&V.FOLD_CASE)===0||l===null)t.appendTableWithSign(u,s);else{let h=new ur().appendTable(u).appendTable(l).cleanClass().toArray();t.appendClassWithSign(h,s)}return!0}parseClass(e){let t=e.pos();e.skip(1);let r=this.newRegexp(T.Op.CHAR_CLASS);r.flags=this.flags;let s=new ur,i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&V.CLASS_NL)===0&&s.appendRange(k.CODES.get(`
`),k.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==k.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&V.PERL_X)===0&&!o){let h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new Ne(Y.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;let c=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(c)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(c);let u=Y.parseClassChar(e,t),l=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(l=Y.parseClassChar(e,t),l<u)throw new Ne(Y.ERR_INVALID_CHAR_RANGE,e.from(c))}(this.flags&V.FOLD_CASE)===0?s.appendRange(u,l):s.appendFoldedRange(u,l)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),r.runes=s.toArray(),this.push(r)}},AI=class Ur{static initTest(e){let t=Ur.compile(e),r=new Ur(t.expr,t.prog,t.numSubexp,t.longest);return r.cond=t.cond,r.prefix=t.prefix,r.prefixUTF8=t.prefixUTF8,r.prefixComplete=t.prefixComplete,r.prefixRune=t.prefixRune,r.prefilter=t.prefilter,r}static compile(e){return Ur.compileImpl(e,V.PERL,!1)}static compilePOSIX(e){return Ur.compileImpl(e,V.POSIX,!0)}static compileImpl(e,t,r){let s=HC.parse(e,t),i=s.maxCap();s=UC.simplify(s);let o=DI.build(s),c=GC.compileRegexp(s),u=new Ur(e,c,i,r);u.prefilter=o.type===Ie.Type.NONE?null:o;let[l,h]=c.prefix();return u.prefixComplete=l,u.prefix=h,u.prefixUTF8=X.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(e,t){return Ur.compile(e).match(t)}constructor(e,t,r=0,s=0){this.expr=e,this.prog=t,this.numSubexp=r,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new LC(this.prog),this.onepass=uC.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,r,s){if((r===V.ANCHOR_START||r===V.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1,c=e.prefixLength(this);if(r===V.UNANCHORED){let u=e.index(this,t);if(u<0)return null;i=t+u,o=i+c}else if(r===V.ANCHOR_BOTH){if(e.endPos()!==c||e.index(this,0)!==0)return null;i=0,o=c}else if(r===V.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=c}if(i<0)return null;if(s>0){let u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}executeEngine(e,t,r,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,r,s);if(this.prefilter!==null&&r===V.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return uC.execute(this,e,t,r,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=tc.maxBitStateLen(this.prog)?tc.execute(this,e,t,r,s):this.doExecuteNFA(e,t,r,s);if(this.prog.numLb===0){let i=this.dfa.match(e,t,r);if(i!==null)return i?[]:null;if(e.endPos()<=tc.maxBitStateLen(this.prog))return tc.execute(this,e,t,r,s)}return this.doExecuteNFA(e,t,r,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,r,s){let i=this.get();i||(i=xC.fromRE2(this)),i.init(s);let o=i.match(e,t,r)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(Pe.fromUTF16(e),0,V.UNANCHORED,0)!==null}matchWithGroup(e,t,r,s,i){return e instanceof qr||(X.isByteArray(e)?e=Hr.utf8(e):e=Hr.utf16(e)),this.matchMachineInput(e,t,r,s,i)}matchMachineInput(e,t,r,s,i){if(t>r)return[!1,null];let o=e.isUTF16Encoding()?Pe.fromUTF16(e.asCharSequence(),0,r):Pe.fromUTF8(e.asBytes(),0,r),c=this.executeEngine(o,t,s,2*i);return c===null?[!1,null]:[!0,c]}matchUTF8(e){return this.executeEngine(Pe.fromUTF8(e),0,V.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,r){let s=0,i=0,o="",c=Pe.fromUTF16(e),u=0;for(;i<=e.length;){let l=this.executeEngine(c,i,V.UNANCHORED,2);if(l===null||l.length===0)break;o+=e.substring(s,l[0]),(l[1]>s||l[0]===0)&&(o+=t(e.substring(l[0],l[1])),u++),s=l[1];let h=c.step(i)&7;if(i+h>l[1]?i+=h:i+1>l[1]?i++:i=l[1],u>=r)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let r=new Array(t).fill(-1);for(let s=0;s<e.length;s++)r[s]=e[s];e=r}return e}allMatches(e,t,r=s=>s){let s=[],i=e.endPos();t<0&&(t=i+1);let o=0,c=0,u=-1;for(;c<t&&o<=i;){let l=this.executeEngine(e,o,V.UNANCHORED,this.prog.numCap);if(l===null||l.length===0)break;let h=!0;if(l[1]===o){l[0]===u&&(h=!1);let f=e.step(o);f<0?o=i+1:o+=f&7}else o=l[1];u=l[1],h&&(s.push(r(this.pad(l))),c++)}return s}findUTF8(e){let t=this.executeEngine(Pe.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){let t=this.executeEngine(Pe.fromUTF8(e),0,V.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){let t=this.executeEngine(Pe.fromUTF16(e),0,V.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Pe.fromUTF16(e),0,V.UNANCHORED,2)}findUTF8Submatch(e){let t=this.executeEngine(Pe.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.slice(t[2*s],t[2*s+1]));return r}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Pe.fromUTF8(e),0,V.UNANCHORED,this.prog.numCap))}findSubmatch(e){let t=this.executeEngine(Pe.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.substring(t[2*s],t[2*s+1]));return r}findSubmatchIndex(e){return this.pad(this.executeEngine(Pe.fromUTF16(e),0,V.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){let r=this.allMatches(Pe.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return r.length===0?null:r}findAllUTF8Index(e,t){let r=this.allMatches(Pe.fromUTF8(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAll(e,t){let r=this.allMatches(Pe.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return r.length===0?null:r}findAllIndex(e,t){let r=this.allMatches(Pe.fromUTF16(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAllUTF8Submatch(e,t){let r=this.allMatches(Pe.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllUTF8SubmatchIndex(e,t){let r=this.allMatches(Pe.fromUTF8(e),t);return r.length===0?null:r}findAllSubmatch(e,t){let r=this.allMatches(Pe.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllSubmatchIndex(e,t){let r=this.allMatches(Pe.fromUTF16(e),t);return r.length===0?null:r}},qb=class rc{static UNANCHORED=V.UNANCHORED;static ANCHOR_START=V.ANCHOR_START;static ANCHOR_BOTH=V.ANCHOR_BOTH;constructor(e=rc.UNANCHORED,t=0,r=8388608){this.anchor=e,this.jsFlags=t,this.maxMem=r;let s=V.PERL;(t&Zt.DISABLE_UNICODE_GROUPS)!==0&&(s&=~V.UNICODE_GROUPS),(t&Zt.LOOKBEHINDS)!==0&&(s|=V.LOOKBEHIND),this.re2Flags=s,this.regexps=[],this.prog=null,this.dfa=null,this.dummyRe2=null}add(e){if(this.prog)throw new kC("Cannot add patterns after compile");let t=e;(this.jsFlags&Zt.CASE_INSENSITIVE)!==0&&(t=`(?i)${t}`),(this.jsFlags&Zt.DOTALL)!==0&&(t=`(?s)${t}`),(this.jsFlags&Zt.MULTILINE)!==0&&(t=`(?m)${t}`);let r=HC.parse(t,this.re2Flags);return this.regexps.push(UC.simplify(r)),this.regexps.length-1}compile(){this.prog||(this.prog=GC.compileSet(this.regexps),this.dfa=new LC(this.prog,this.maxMem),this.dummyRe2={prog:this.prog,cond:this.prog.startCond(),prefix:"",prefixRune:0,longest:!1})}match(e){this.prog||this.compile();let t=X.isByteArray(e)?Pe.fromUTF8(e):Pe.fromUTF16(e),r=V.UNANCHORED;this.anchor===rc.ANCHOR_START?r=V.ANCHOR_START:this.anchor===rc.ANCHOR_BOTH&&(r=V.ANCHOR_BOTH);let s=this.dfa.matchSet(t,0,r);if(s!==null)return s;let i=xC.fromRE2(this.dummyRe2);return i.init(0),i.matchSet(t,0,r)}},vI=class vs{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let r="",s=!1,i=e.length;i===0&&(r="(?:)",s=!0);let o=!1,c=0;for(;c<i;){let l=e[c];if(l==="\\"){if(c+1<i)switch(l=e[c+1],l){case"\\":r+="\\\\",c+=2;continue;case"c":if(c+2<i){let g=e[c+2].charCodeAt(0);if(g>=65&&g<=90||g>=97&&g<=122){let v=g%32;r+="\\x",r+=(v>>4).toString(16).toUpperCase(),r+=(v&15).toString(16).toUpperCase(),c+=3,s=!0;continue}}r+="c",c+=2,s=!0;continue;case"u":if(c+2<i){if(e[c+2]==="{"){let g=c+3,v=!1,R=!1;for(;g<i;){let b=e[g];if(b==="}"){R=!0;break}if(!vs.isHexadecimal(b))break;v=!0,g++}if(R&&v){r+="\\x",c+=2,s=!0;continue}}else if(c+5<i){let g=!0;for(let v=0;v<4;v++)if(!vs.isHexadecimal(e[c+2+v])){g=!1;break}if(g){r+="\\x{"+e.substring(c+2,c+6)+"}",c+=6,s=!0;continue}}}r+="u",c+=2,s=!0;continue;case"x":{let g=!1;if(c+2<i&&e[c+2]==="{"){let v=c+3,R=!1,b=!1;for(;v<i;){let G=e[v];if(G==="}"){b=!0;break}if(!vs.isHexadecimal(G))break;R=!0,v++}b&&R&&(g=!0)}else c+3<i&&vs.isHexadecimal(e[c+2])&&vs.isHexadecimal(e[c+3])&&(g=!0);g?(r+="\\x",c+=2):(r+="x",c+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":r+="\\"+l,c+=2;continue;default:{let g=e.codePointAt(c+1);if(g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122){let v=X.charCount(g);r+=e.substring(c+1,c+1+v),c+=v+1,s=!0}else{r+="\\";let v=X.charCount(g);r+=e.substring(c+1,c+1+v),c+=v+1}continue}}}else if(l==="/"){r+="\\/",c+=1,s=!0;continue}else if(l==="[")o=!0;else if(l==="]")o=!1;else if(!o&&l==="("&&c+2<i&&e[c+1]==="?"&&e[c+2]==="<"&&c+3<i&&!"=!>)".includes(e[c+3])){r+="(?P<",c+=3,s=!0;continue}let h=e.codePointAt(c),f=X.charCount(h);r+=e.substring(c,c+f),c+=f}let u=s?r:e;return t.length>0?`(?${t})${u}`:u}},sc=class Bt{static CASE_INSENSITIVE=Zt.CASE_INSENSITIVE;static DOTALL=Zt.DOTALL;static MULTILINE=Zt.MULTILINE;static DISABLE_UNICODE_GROUPS=Zt.DISABLE_UNICODE_GROUPS;static LONGEST_MATCH=Zt.LONGEST_MATCH;static LOOKBEHINDS=Zt.LOOKBEHINDS;static quote(e){return X.quoteMeta(e)}static quoteReplacement(e,t=!1){return iC.quoteReplacement(e,t)}static translateRegExp(e){return vI.translate(e)}static compile(e,t=0){let r=e;if((t&Bt.CASE_INSENSITIVE)!==0&&(r=`(?i)${r}`),(t&Bt.DOTALL)!==0&&(r=`(?s)${r}`),(t&Bt.MULTILINE)!==0&&(r=`(?m)${r}`),(t&~(Bt.MULTILINE|Bt.DOTALL|Bt.CASE_INSENSITIVE|Bt.DISABLE_UNICODE_GROUPS|Bt.LONGEST_MATCH|Bt.LOOKBEHINDS))!==0)throw new BI("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=V.PERL;(t&Bt.DISABLE_UNICODE_GROUPS)!==0&&(s&=~V.UNICODE_GROUPS),(t&Bt.LOOKBEHINDS)!==0&&(s|=V.LOOKBEHIND);let i=new Bt(e,t);return i.re2Input=AI.compileImpl(r,s,(t&Bt.LONGEST_MATCH)!==0),i}static matches(e,t){return Bt.compile(e).testExact(t)}static initTest(e,t,r){if(e==null)throw new Error("pattern is null");if(r==null)throw new Error("re2 is null");let s=new Bt(e,t);return s.re2Input=r,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return X.isByteArray(e)&&(e=Hr.utf8(e)),new iC(this,e)}test(e){return X.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){let t=X.isByteArray(e)?Pe.fromUTF8(e):Pe.fromUTF16(e);return this.re2Input.executeEngine(t,0,V.ANCHOR_BOTH,0)!==null}exec(e){let t=this.matcher(e);if(!t.find())return null;let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;return r}split(e,t=0){let r=this.matcher(e),s=[],i=0,o=0;for(;r.find();){if(o===0&&r.end()===0){o=r.end();continue}if(t>0&&s.length===t-1)break;if(o===r.start()){if(t===0){i+=1,o=r.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.start())),o=r.end()}if(t===0&&o!==r.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.inputLength()))}return(t!==0||s.length===0&&!(o===r.inputLength()&&o>0))&&s.push(r.substring(o,r.inputLength())),s}*matchAll(e){let t=this.matcher(e);for(;t.find();){let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;yield r}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ni="12.19.0";function Am(n){ni=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $r=new sr("@firebase/firestore");function bs(){return $r.logLevel}function z(n,...e){if($r.logLevel<=ge.DEBUG){let t=e.map(zd);$r.debug(`Firestore (${ni}): ${n}`,...t)}}function xn(n,...e){if($r.logLevel<=ge.ERROR){let t=e.map(zd);$r.error(`Firestore (${ni}): ${n}`,...t)}}function zt(n,...e){if($r.logLevel<=ge.WARN){let t=e.map(zd);$r.warn(`Firestore (${ni}): ${n}`,...t)}}function zd(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,vm(n,r,t)}function vm(n,e,t){let r=`FIRESTORE (${ni}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw xn(r),new Error(r)}function te(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||vm(e,s,r)}function me(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bI(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xs=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let s=bI(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}};function Ce(n,e){return n<e?-1:n>e?1:0}function cB(n,e){let t=Math.min(n.length,e.length);for(let r=0;r<t;r++){let s=n.charAt(r),i=e.charAt(r);if(s!==i)return nB(s)===nB(i)?Ce(s,i):nB(s)?1:-1}return Ce(n.length,e.length)}var SI=55296,RI=57343;function nB(n){let e=n.charCodeAt(0);return e>=SI&&e<=RI}function Ls(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var He=class n{constructor(e,t){this.comparator=e,this.root=t||mn.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,mn.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,mn.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){let e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Os(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Os(this.root,e,this.comparator,!1)}getReverseIterator(){return new Os(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Os(this.root,e,this.comparator,!0)}},Os=class{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},mn=class n{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??n.RED,this.left=s??n.EMPTY,this.right=i??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new n(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this,i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return n.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Z(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Z(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw Z(27949);return e+(this.isRed()?0:1)}};mn.EMPTY=null,mn.RED=!0,mn.BLACK=!1;mn.EMPTY=new class{constructor(){this.size=0}get key(){throw Z(57766)}get value(){throw Z(16141)}get color(){throw Z(16727)}get left(){throw Z(29726)}get right(){throw Z(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new mn(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ze=class n{constructor(e){this.comparator=e,this.data=new He(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new dc(this.data.getIterator())}getIteratorFrom(e){return new dc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},dc=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},q=class extends Rt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gn="__name__",fc=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&Z(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Z(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let s=0;s<r;s++){let i=n.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return Ce(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),s=n.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?n.extractNumericId(e).compare(n.extractNumericId(t)):cB(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return vn.fromString(e.substring(4,e.length-2))}},Te=class n extends fc{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new q(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new n(t)}static emptyPath(){return new n([])}},PI=/^[_a-zA-Z][_a-zA-Z0-9]*$/,Lt=class Ss extends fc{construct(e,t,r){return new Ss(e,t,r)}static isValidIdentifier(e){return PI.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ss.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===gn}static keyField(){return new Ss([gn])}static fromServerFormat(e){let t=[],r="",s=0,i=()=>{if(r.length===0)throw new q(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;s<e.length;){let c=e[s];if(c==="\\"){if(s+1===e.length)throw new q(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new q(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(r+=c,s++):(i(),s++)}if(i(),o)throw new q(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ss(t)}static emptyPath(){return new Ss([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var tn=class n{constructor(e){this.fields=e,e.sort(Lt.comparator)}static empty(){return new n([])}unionWith(e){let t=new Ze(Lt.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ls(this.fields,e.fields,((t,r)=>t.isEqual(r)))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Bs(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function bm(n,e){let t=[];for(let r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function Sm(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ee=class n{constructor(e){this.path=e}static fromPath(e){return new n(Te.fromString(e))}static fromName(e){return new n(Te.fromString(e).popFirst(5))}static empty(){return new n(Te.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Te.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Te.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new Te(e.slice()))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rm(n,e,t){if(!t)throw new q(O.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Pm(n,e,t,r){if(e===!0&&r===!0)throw new q(O.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function qC(n){if(!ee.isDocumentKey(n))throw new q(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function jC(n){if(ee.isDocumentKey(n))throw new q(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Vo(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Mo(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Z(12329,{type:typeof n})}function wn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new q(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=Mo(n);throw new q(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Nm(n,e){if(e<=0)throw new q(O.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(n,e){let t={typeString:n};return e&&(t.value=e),t}function Go(n,e){if(!Vo(n))throw new q(O.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}let o=n[r];if(s&&typeof o!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new q(O.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var KC=-62135596800,JC=1e6,Ue=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*JC);return new n(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new q(O.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return n._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{let s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new q(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new q(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<KC)throw new q(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/JC}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new q(O.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?Ce(this.nanoseconds,e.nanoseconds):Ce(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Go(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-KC;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};Ue._jsonSchemaVersion="firestore/timestamp/1.0",Ue._jsonSchema={type:ze("string",Ue._jsonSchemaVersion),seconds:ze("number"),nanoseconds:ze("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gc=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qe=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new gc("Invalid base64 string: "+i):i}})(e);return new n(t)}static fromUint8Array(e){let t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ce(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Qe.EMPTY_BYTE_STRING=new Qe("");var NI=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ln(n){if(te(!!n,39018),typeof n=="string"){let e=0,t=NI.exec(n);if(te(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Oe(n.seconds),nanos:Oe(n.nanos)}}function Oe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Vn(n){return typeof n=="string"?Qe.fromBase64String(n):Qe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Om="server_timestamp",km="__type__",Fm="__previous_value__",xm="__local_write_time__";function ri(n){return(n?.mapValue?.fields||{})[km]?.stringValue===Om}function Uo(n){let e=n.mapValue.fields[Fm];return ri(e)?Uo(e):e}function Vs(n){let e=Ln(n.mapValue.fields[xm].timestampValue);return new Ue(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var uB=class{constructor(e,t,r,s,i,o,c,u,l,h,f,g,v){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=h,this.apiKey=f,this._customHeaders=g,this.grpcFlowControlWindow=v}},uo="(default)",lo=class n{constructor(e,t){this.projectId=e,this.database=t||uo}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===uo}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};function Lm(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new q(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new lo(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var OI=-1;function Ho(n){return n==null}function Ms(n){return n===0&&1/n==-1/0}function kI(n){return typeof n=="number"&&Number.isInteger(n)&&!Ms(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function FI(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wd="__type__",Vm="__max__",ic={mapValue:{fields:{__type__:{stringValue:Vm}}}},Qd="__vector__",Yr="value",Gs={nullValue:"NULL_VALUE"},Tt={booleanValue:!0},ot={booleanValue:!1};function $e(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ri(n)?4:Mm(n)?9007199254740991:ho(n)?10:11:Z(28295,{value:n})}function Wt(n,e,t){if(n===e)return!0;let r=$e(n);if(r!==$e(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Vs(n).isEqual(Vs(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;let c=Ln(i.timestampValue),u=Ln(o.timestampValue);return c.seconds===u.seconds&&c.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,o){return Vn(i.bytesValue).isEqual(Vn(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,o){return Oe(i.geoPointValue.latitude)===Oe(o.geoPointValue.latitude)&&Oe(i.geoPointValue.longitude)===Oe(o.geoPointValue.longitude)})(n,e);case 2:return(function(i,o,c){if("integerValue"in i&&"integerValue"in o)return Oe(i.integerValue)===Oe(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=Oe(i.doubleValue),l=Oe(o.doubleValue);else{if(!c?.i)return!1;u=Oe(i.integerValue??i.doubleValue),l=Oe(o.integerValue??o.doubleValue)}return u===l?!!c?.o||Ms(u)===Ms(l):!!(c===void 0||c.u)&&isNaN(u)&&isNaN(l)})(n,e,t);case 9:return Ls(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Wt(s,i,t)));case 10:case 11:return(function(i,o,c){let u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(pc(u)!==pc(l))return!1;for(let h in u)if(u.hasOwnProperty(h)&&(l[h]===void 0||!Wt(u[h],l[h],c)))return!1;return!0})(n,e,t);default:return Z(52216,{left:n})}}function Bo(n,e){return(n.values||[]).find((t=>Wt(t,e)))!==void 0}function At(n,e){if(n===e)return 0;let t=$e(n),r=$e(e);if(t!==r)return Ce(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ce(n.booleanValue,e.booleanValue);case 2:return(function(i,o){let c=Oe(i.integerValue||i.doubleValue),u=Oe(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return zC(n.timestampValue,e.timestampValue);case 4:return zC(Vs(n),Vs(e));case 5:return cB(n.stringValue,e.stringValue);case 6:return(function(i,o){let c=Vn(i),u=Vn(o);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,o){let c=i.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){let h=Ce(c[l],u[l]);if(h!==0)return h}return Ce(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,o){let c=Ce(Oe(i.latitude),Oe(o.latitude));return c!==0?c:Ce(Oe(i.longitude),Oe(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return WC(n.arrayValue,e.arrayValue);case 10:return(function(i,o){let c=i.fields||{},u=o.fields||{},l=c[Yr]?.arrayValue,h=u[Yr]?.arrayValue,f=Ce(l?.values?.length||0,h?.values?.length||0);return f!==0?f:WC(l,h)})(n.mapValue,e.mapValue);case 11:return(function(i,o){if(i===ic.mapValue&&o===ic.mapValue)return 0;if(i===ic.mapValue)return 1;if(o===ic.mapValue)return-1;let c=i.fields||{},u=Object.keys(c),l=o.fields||{},h=Object.keys(l);u.sort(),h.sort();for(let f=0;f<u.length&&f<h.length;++f){let g=cB(u[f],h[f]);if(g!==0)return g;let v=At(c[u[f]],l[h[f]]);if(v!==0)return v}return Ce(u.length,h.length)})(n.mapValue,e.mapValue);default:throw Z(23264,{l:t})}}function zC(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Ce(n,e);let t=Ln(n),r=Ln(e),s=Ce(t.seconds,r.seconds);return s!==0?s:Ce(t.nanos,r.nanos)}function WC(n,e){let t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){let i=At(t[s],r[s]);if(i!==void 0&&i!==0)return i}return Ce(t.length,r.length)}function Us(n){return lB(n)}function lB(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){let r=Ln(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Vn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return ee.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(let i of t.values||[])s?s=!1:r+=",",r+=lB(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){let r=Object.keys(t.fields||{}).sort(),s="{",i=!0;for(let o of r)i?i=!1:s+=",",s+=`${o}:${lB(t.fields[o])}`;return s+"}"})(n.mapValue):Z(61005,{value:n})}function uc(n){switch($e(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let e=Uo(n);return e?16+uc(e):16;case 5:return 2*n.stringValue.length;case 6:return Vn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+uc(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return Bs(r.fields,((i,o)=>{s+=i.length+uc(o)})),s})(n.mapValue);default:throw Z(13486,{value:n})}}function qo(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Cn(n){return!!n&&"integerValue"in n}function Kr(n){return!!n&&"doubleValue"in n}function pr(n){return Cn(n)||Kr(n)}function Hs(n){return!!n&&"arrayValue"in n}function Ft(n){return!!n&&"nullValue"in n}function vt(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ks(n){return!!n&&"mapValue"in n}function ho(n){return(n?.mapValue?.fields||{})[Wd]?.stringValue===Qd}function BB(n){return(n?.mapValue?.fields||{})[Yr]?.arrayValue}function no(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){let e={mapValue:{fields:{}}};return Bs(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=no(r))),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=no(n.arrayValue.values[t]);return e}return{...n}}function Mm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Vm}var bS={mapValue:{fields:{[Wd]:{stringValue:Qd},[Yr]:{arrayValue:{}}}}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Et=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!ks(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=no(t)}setAll(e){let t=Lt.emptyPath(),r={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){let u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}o?r[c.lastSegment()]=no(o):s.push(c.lastSegment())}));let i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){let t=this.field(e.popLast());ks(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Wt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];ks(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Bs(t,((s,i)=>e[s]=i));for(let s of r)delete e[s]}clone(){return new n(no(this.value))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ms(e)?"-0":e}}function $d(n){return{integerValue:""+n}}function Yd(n,e,t){return kI(e)?$d(e):tu(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var qs=class{constructor(){this._=void 0}};function xI(n,e,t){return n instanceof Xr?(function(s,i){let o={fields:{[km]:{stringValue:Om},[xm]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ri(i)&&(i=Uo(i)),i&&(o.fields[Fm]=i),{mapValue:o}})(t,e):n instanceof Zr?Gm(n,e):n instanceof es?Um(n,e):n instanceof ts?(function(s,i){let o=VI(s,i),c=Cc(o)+Cc(s.h);return Cn(o)&&Cn(s.h)?$d(c):tu(s.serializer,c)})(n,e):n instanceof js?(function(s,i){return QC(s,i,Math.min)})(n,e):n instanceof Ks?(function(s,i){return QC(s,i,Math.max)})(n,e):void 0}function LI(n,e,t){return n instanceof Zr?Gm(n,e):n instanceof es?Um(n,e):t}function VI(n,e){return n instanceof ts?pr(e)?e:{integerValue:0}:null}var Xr=class extends qs{},Zr=class extends qs{constructor(e){super(),this.elements=e}};function Gm(n,e){let t=Hm(e);for(let r of n.elements)t.some((s=>Wt(s,r)))||t.push(r);return{arrayValue:{values:t}}}var es=class extends qs{constructor(e){super(),this.elements=e}};function Um(n,e){let t=Hm(e);for(let r of n.elements)t=t.filter((s=>!Wt(s,r)));return{arrayValue:{values:t}}}var fo=class extends qs{constructor(e,t){super(),this.serializer=e,this.h=t}},ts=class extends fo{},js=class extends fo{},Ks=class extends fo{};function QC(n,e,t){if(!pr(e))return n.h;let r=t(Cc(e),Cc(n.h));return Cn(e)&&Cn(n.h)?$d(r):tu(n.serializer,r)}function Cc(n){return Oe(n.integerValue||n.doubleValue)}function Hm(n){return Hs(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hB=class{constructor(e,t){this.field=e,this.transform=t}};function MI(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Zr&&s instanceof Zr||r instanceof es&&s instanceof es?Ls(r.elements,s.elements,Wt):r instanceof ts&&s instanceof ts||r instanceof js&&s instanceof js||r instanceof Ks&&s instanceof Ks?Wt(r.h,s.h):r instanceof Xr&&s instanceof Xr})(n.transform,e.transform)}var en=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function lc(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var Js=class{};function qm(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new zs(n.key,en.none()):new ns(n.key,n.data,en.none());{let t=n.data,r=Et.empty(),s=new Ze(Lt.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Mn(n.key,r,new tn(s.toArray()),en.none())}}function GI(n,e,t){n instanceof ns?(function(s,i,o){let c=s.value.clone(),u=YC(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):n instanceof Mn?(function(s,i,o){if(!lc(s.precondition,i))return void i.convertToUnknownDocument(o.version);let c=YC(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(jm(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function ro(n,e,t,r){return n instanceof ns?(function(i,o,c,u){if(!lc(i.precondition,o))return c;let l=i.value.clone(),h=XC(i.fieldTransforms,u,o);return l.setAll(h),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(n,e,t,r):n instanceof Mn?(function(i,o,c,u){if(!lc(i.precondition,o))return c;let l=XC(i.fieldTransforms,u,o),h=o.data;return h.setAll(jm(i)),h.setAll(l),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((f=>f.field)))})(n,e,t,r):(function(i,o,c){return lc(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(n,e,t)}function $C(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ls(r,s,((i,o)=>MI(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var ns=class extends Js{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}},Mn=class extends Js{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}};function jm(n){let e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}})),e}function YC(n,e,t){let r=new Map;te(n.length===t.length,32656,{T:t.length,P:n.length});for(let s=0;s<t.length;s++){let i=n[s],o=i.transform,c=e.data.field(i.field);r.set(i.field,LI(o,c,t[s]))}return r}function XC(n,e,t){let r=new Map;for(let s of n){let i=s.transform,o=t.data.field(s.field);r.set(s.field,xI(i,o,e))}return r}var zs=class extends Js{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},mc=class extends Js{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Gn=class{constructor(e,t){this.position=e,this.inclusive=t}};function ZC(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){let i=e[s],o=n.position[s];if(i.field.isKeyField()?r=ee.comparator(ee.fromName(o.referenceValue),t.key):r=At(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function em(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Wt(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ec=class{},je=class n extends Ec{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new fB(e,t,r):t==="array-contains"?new CB(e,r):t==="in"?new mB(e,r):t==="not-in"?new EB(e,r):t==="array-contains-any"?new _B(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new pB(e,r):new gB(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(At(t,this.value)):t!==null&&$e(this.value)===$e(t)&&this.matchesComparison(At(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Z(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},Qt=class n extends Ec{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new n(e,t)}matches(e){return Km(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}};function Km(n){return n.op==="and"}function Jm(n){return UI(n)&&Km(n)}function UI(n){for(let e of n.filters)if(e instanceof Qt)return!1;return!0}function dB(n){if(n instanceof je)return n.field.canonicalString()+n.op.toString()+Us(n.value);if(Jm(n))return n.filters.map((e=>dB(e))).join(",");{let e=n.filters.map((t=>dB(t))).join(",");return`${n.op}(${e})`}}function zm(n,e){return n instanceof je?(function(r,s){return s instanceof je&&r.op===s.op&&r.field.isEqual(s.field)&&Wt(r.value,s.value)})(n,e):n instanceof Qt?(function(r,s){return s instanceof Qt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,c)=>i&&zm(o,s.filters[c])),!0):!1})(n,e):void Z(19439)}function Wm(n){return n instanceof je?(function(t){return`${t.field.canonicalString()} ${t.op} ${Us(t.value)}`})(n):n instanceof Qt?(function(t){return t.op.toString()+" {"+t.getFilters().map(Wm).join(" ,")+"}"})(n):"Filter"}var fB=class extends je{constructor(e,t,r){super(e,t,r),this.key=ee.fromName(r.referenceValue)}matches(e){let t=ee.comparator(e.key,this.key);return this.matchesComparison(t)}},pB=class extends je{constructor(e,t){super(e,"in",t),this.keys=Qm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},gB=class extends je{constructor(e,t){super(e,"not-in",t),this.keys=Qm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function Qm(n,e){return(e.arrayValue?.values||[]).map((t=>ee.fromName(t.referenceValue)))}var CB=class extends je{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Hs(t)&&Bo(t.arrayValue,this.value)}},mB=class extends je{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&Bo(this.value.arrayValue,t)}},EB=class extends je{constructor(e,t){super(e,"not-in",t)}matches(e){if(Bo(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Bo(this.value.arrayValue,t)}},_B=class extends je{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Hs(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Bo(this.value.arrayValue,r)))}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gr=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function HI(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Be=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new Ue(0,0))}static max(){return new n(new Ue(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Mt=class n{constructor(e,t,r,s,i,o,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new n(e,0,Be.min(),Be.min(),Be.min(),Et.empty(),0)}static newFoundDocument(e,t,r,s){return new n(e,1,t,Be.min(),r,s,0)}static newNoDocument(e,t){return new n(e,2,t,Be.min(),Be.min(),Et.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,Be.min(),Be.min(),Et.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Be.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Et.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Et.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Be.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var po=-1,_c=class{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}};_c.UNKNOWN_ID=-1;function qI(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=Be.fromTimestamp(r===1e9?new Ue(t+1,0):new Ue(t,r));return new rs(s,ee.empty(),e)}function jI(n){return new rs(n.readTime,n.key,po)}var rs=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(Be.min(),ee.empty(),po)}static max(){return new n(Be.max(),ee.empty(),po)}};function KI(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=ee.comparator(n.documentKey,e.documentKey),t!==0?t:Ce(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wB=class{constructor(e,t=null,r=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.R=null}};function tm(n,e=null,t=[],r=[],s=null,i=null,o=null){return new wB(n,e,t,r,s,i,o)}function $m(n){let e=me(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>dB(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Ho(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Us(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Us(r))).join(",")),e.R=t}return e.R}function Ym(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!HI(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!zm(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!em(n.startAt,e.startAt)&&em(n.endAt,e.endAt)}function jr(n){return!!n.isCorePipeline}function Xm(n){return!!n.path&&ee.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Un=class{constructor(e,t=null,r=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}};function JI(n,e,t,r,s,i,o,c){return new Un(n,e,t,r,s,i,o,c)}function jo(n){return new Un(n)}function nm(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function zI(n){return ee.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function nu(n){return n.collectionGroup!==null}function Wr(n){let e=me(n);if(e.A===null){e.A=[];let t=new Set;for(let i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new Ze(Lt.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(c=c.add(l.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new gr(i,r))})),t.has(Lt.keyField().canonicalString())||e.A.push(new gr(Lt.keyField(),r))}return e.A}function En(n){let e=me(n);return e.V||(e.V=WI(e,Wr(n))),e.V}function WI(n,e){if(n.limitType==="F")return tm(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{let i=s.dir==="desc"?"asc":"desc";return new gr(s.field,i)}));let t=n.endAt?new Gn(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Gn(n.startAt.position,n.startAt.inclusive):null;return tm(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ru(n,e){let t=n.filters.concat([e]);return new Un(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Zm(n,e){let t=n.explicitOrderBy.concat([e]);return new Un(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function go(n,e,t){return new Un(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function eE(n,e){return new Un(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,e,n.endAt)}function QI(n,e){return Ym(En(n),En(e))&&n.limitType===e.limitType}function so(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Wm(s))).join(", ")}]`),Ho(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Us(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Us(s))).join(",")),`Target(${r})`})(En(n))}; limitType=${n.limitType})`}function su(n,e){return e.isFoundDocument()&&(function(r,s){let i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):ee.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(let i of Wr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(let i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,c,u){let l=ZC(o,c,u);return o.inclusive?l<=0:l<0})(r.startAt,Wr(r),s)||r.endAt&&!(function(o,c,u){let l=ZC(o,c,u);return o.inclusive?l>=0:l>0})(r.endAt,Wr(r),s))})(n,e)}function Xd(n){return(e,t)=>{let r=!1;for(let s of Wr(n)){let i=$I(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function $I(n,e,t){let r=n.field.isKeyField()?ee.comparator(e.key,t.key):(function(i,o,c){let u=o.data.field(i),l=c.data.field(i);return u!==null&&l!==null?At(u,l):Z(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Z(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yB=class{constructor(e,t){this.count=e,this.unchangedNames=t}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ke,De;function YI(n){switch(n){case O.OK:return Z(64938);case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0;default:return Z(15467,{code:n})}}function tE(n){if(n===void 0)return xn("GRPC error has no .code"),O.UNKNOWN;switch(n){case Ke.OK:return O.OK;case Ke.CANCELLED:return O.CANCELLED;case Ke.UNKNOWN:return O.UNKNOWN;case Ke.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case Ke.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case Ke.INTERNAL:return O.INTERNAL;case Ke.UNAVAILABLE:return O.UNAVAILABLE;case Ke.UNAUTHENTICATED:return O.UNAUTHENTICATED;case Ke.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case Ke.NOT_FOUND:return O.NOT_FOUND;case Ke.ALREADY_EXISTS:return O.ALREADY_EXISTS;case Ke.PERMISSION_DENIED:return O.PERMISSION_DENIED;case Ke.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case Ke.ABORTED:return O.ABORTED;case Ke.OUT_OF_RANGE:return O.OUT_OF_RANGE;case Ke.UNIMPLEMENTED:return O.UNIMPLEMENTED;case Ke.DATA_LOSS:return O.DATA_LOSS;default:return Z(39323,{code:n})}}(De=Ke||(Ke={}))[De.OK=0]="OK",De[De.CANCELLED=1]="CANCELLED",De[De.UNKNOWN=2]="UNKNOWN",De[De.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",De[De.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",De[De.NOT_FOUND=5]="NOT_FOUND",De[De.ALREADY_EXISTS=6]="ALREADY_EXISTS",De[De.PERMISSION_DENIED=7]="PERMISSION_DENIED",De[De.UNAUTHENTICATED=16]="UNAUTHENTICATED",De[De.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",De[De.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",De[De.ABORTED=10]="ABORTED",De[De.OUT_OF_RANGE=11]="OUT_OF_RANGE",De[De.UNIMPLEMENTED=12]="UNIMPLEMENTED",De[De.INTERNAL=13]="INTERNAL",De[De.UNAVAILABLE=14]="UNAVAILABLE",De[De.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hn=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Bs(this.inner,((t,r)=>{for(let[s,i]of r)e(s,i)}))}isEmpty(){return Sm(this.inner)}size(){return this.innerSize}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var XI=new He(ee.comparator);function xt(){return XI}var nE=new He(ee.comparator);function Rs(...n){let e=nE;for(let t of n)e=e.insert(t.key,t);return e}function ZI(n){let e=nE;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Br(){return io()}function rE(){return io()}function io(){return new Hn((n=>n.toString()),((n,e)=>n.isEqual(e)))}var SS=new He(ee.comparator),eT=new Ze(ee.comparator);function _e(...n){let e=eT;for(let t of n)e=e.add(t);return e}var tT=new Ze(Ce);function nT(){return tT}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rT=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sT(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var iT=new vn([4294967295,4294967295],0);function rm(n){let e=sT().encode(n),t=new Ul;return t.update(e),new Uint8Array(t.digest())}function sm(n){let e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new vn([t,r],0),new vn([s,i],0)]}var DB=class n{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Jr(`Invalid padding: ${t}`);if(r<0)throw new Jr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Jr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Jr(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=vn.fromNumber(this.p)}v(e,t,r){let s=e.add(t.multiply(vn.fromNumber(r)));return s.compare(iT)===1&&(s=new vn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;let t=rm(e),[r,s]=sm(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);if(!this.D(o))return!1}return!0}static create(e,t,r){let s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new n(i,s,t);return r.forEach((c=>o.insert(c))),o}insert(e){if(this.p===0)return;let t=rm(e),[r,s]=sm(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);this.C(o)}}C(e){let t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}},Jr=class extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Co=class n{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){let s=new Map;return s.set(e,mo.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new n(Be.min(),s,new He(Ce),xt(),xt(),_e())}},mo=class n{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new n(r,t,_e(),_e(),_e())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fs=class{constructor(e,t,r,s){this.F=e,this.removedTargetIds=t,this.key=r,this.O=s}},wc=class{constructor(e,t){this.targetId=e,this.M=t}},yc=class{constructor(e,t,r=Qe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}},Dc=class{constructor(e){this.targetId=e,this.N=0,this.L=im(),this.B=Qe.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=_e(),t=_e(),r=_e();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:Z(38017,{changeType:i})}})),new mo(this.B,this.U,e,t,r)}G(){this.k=!1,this.L=im()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,te(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}},eo="WatchChangeAggregator",IB=class{constructor(e){this.X=e,this.ee=new Map,this.te=xt(),this.ne=oc(),this.re=xt(),this.ie=oc(),this.se=new He(Ce)}_e(e){for(let t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(let t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{let r=this.ee.get(t);if(r)switch(e.state){case 0:this.ce(t)&&r.K(e.resumeToken);break;case 1:r.Y(),r.q||r.G(),r.K(e.resumeToken);break;case 2:r.Y(),r.q||this.removeTarget(t);break;case 3:this.ce(t)&&(r.Z(),r.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),r.K(e.resumeToken));break;default:Z(56790,{state:e.state})}else z(eo,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((r,s)=>{this.ce(s)&&t(s)}))}Ee(e){return jr(e)?e.getPipelineSourceType()==="documents"&&e.getPipelineDocuments()?.length===1:Xm(e)}he(e){let t=e.targetId,r=e.M.count,s=this.Te(t);if(s){let i=s.target;if(this.Ee(i))if(r===0){let o=new ee(jr(i)?Te.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,o,Mt.newNoDocument(o,Be.min()))}else te(r===1,20013,"Single document existence filter with count: "+r);else{let o=this.Pe(t);if(o!==r){let c=this.Ie(e),u=c?this.Re(c,e,o):1;if(u!==0){this.le(t);let l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,l)}rT?.Ae((function(h,f,g,v,R){let b={localCacheCount:h,existenceFilterCount:f.count,databaseId:g.database,projectId:g.projectId},G=f.unchangedNames;return G&&(b.bloomFilter={applied:R===0,hashCount:G?.hashCount??0,bitmapLength:G?.bits?.bitmap?.length??0,padding:G?.bits?.padding??0,mightContain:U=>v?.mightContain(U)??!1}),b})(o,e.M,this.X.Ve(),c,u))}}}}Ie(e){let t=e.M.unchangedNames;if(!t||!t.bits)return null;let{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t,o,c;try{o=Vn(r).toUint8Array()}catch(u){if(u instanceof gc)return zt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new DB(o,s,i)}catch(u){return zt(u instanceof Jr?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.p===0?null:c}Re(e,t,r){return t.M.count===r-this.de(e,t.targetId)?0:2}de(e,t){let r=this.X.getRemoteKeysForTarget(t),s=0;return r.forEach((i=>{let o=this.X.Ve(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.ae(t,i,null),s++)})),s}fe(e){let t=new Map;this.ee.forEach(((i,o)=>{let c=this.Te(o);if(c){if(i.current&&this.Ee(c.target)){let u=jr(c.target)?Te.fromString(c.target.getPipelineDocuments()[0]):c.target.path,l=new ee(u);this.me(l).has(o)||this.pe(o,l)||this.ae(o,l,Mt.newNoDocument(l,e))}i.$&&(t.set(o,i.W()),i.G())}}));let r=_e();this.ie.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{let l=this.Te(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.te.forEach(((i,o)=>o.setReadTime(e))),this.re.forEach(((i,o)=>o.setReadTime(e)));let s=new Co(e,t,this.se,this.te,this.re,r);return this.te=xt(),this.ne=oc(),this.re=xt(),this.ie=oc(),this.se=new He(Ce),s}oe(e,t){let r=this.ee.get(e);if(!r||!this.ce(e))return void z(eo,`addDocumentToTarget received document for unknown inactive target (${e})`);let s=this.pe(e,t.key)?2:0;r.j(t.key,s),jr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,r){let s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),r&&(jr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,r):this.te=this.te.insert(t,r))):z(eo,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){let t=this.ee.get(e);if(!t)return 0;let r=t.W();return this.X.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}J(e){let t=this.ee.get(e);t||(z(eo,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Dc(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new Ze(Ce),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new Ze(Ce),this.ne=this.ne.insert(e,t)),t}ce(e){let t=this.Te(e)!==null;return t||z(eo,"Detected inactive target",e),t}Te(e){let t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new Dc(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}};function oc(){return new He(ee.comparator)}function im(){return new He(ee.comparator)}var oT={asc:"ASCENDING",desc:"DESCENDING"},aT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},cT={and:"AND",or:"OR"},TB=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function AB(n,e){return n.useProto3Json||Ho(e)?e:{value:e}}function oo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Zd(n){let e=Ln(n);return new Ue(e.seconds,e.nanos)}function sE(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Bc(n,e){return oo(n,e.toTimestamp())}function Pn(n){return te(!!n,49232),Be.fromTimestamp(Zd(n))}function ef(n,e){return vB(n,e).canonicalString()}function vB(n,e){let t=(function(s){return new Te(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function iE(n){let e=Te.fromString(n);return te(lE(e),10190,{key:e.toString()}),e}function Eo(n,e){return ef(n.databaseId,e.path)}function ao(n,e){let t=iE(e);if(t.get(1)!==n.databaseId.projectId)throw new q(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new q(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new ee(aE(t))}function oE(n,e){return ef(n.databaseId,e)}function uT(n){let e=iE(n);return e.length===4?Te.emptyPath():aE(e)}function om(n){return new Te(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function aE(n){return te(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function am(n,e,t){return{name:Eo(n,e),fields:t.value.mapValue.fields}}function lT(n,e){return"found"in e?(function(r,s){te(!!s.found,43571),s.found.name,s.found.updateTime;let i=ao(r,s.found.name),o=Pn(s.found.updateTime),c=s.found.createTime?Pn(s.found.createTime):Be.min(),u=new Et({mapValue:{fields:s.found.fields}});return Mt.newFoundDocument(i,o,c,u)})(n,e):"missing"in e?(function(r,s){te(!!s.missing,3894),te(!!s.readTime,22933);let i=ao(r,s.missing),o=Pn(s.readTime);return Mt.newNoDocument(i,o)})(n,e):Z(7234,{result:e})}function BT(n,e){let t;if("targetChange"in e){e.targetChange;let r=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:Z(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,h){return l.useProto3Json?(te(h===void 0||typeof h=="string",58123),Qe.fromBase64String(h||"")):(te(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),Qe.fromUint8Array(h||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(l){let h=l.code===void 0?O.UNKNOWN:tE(l.code);return new q(h,l.message||"")})(o);t=new yc(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;let r=e.documentChange;r.document,r.document.name,r.document.updateTime;let s=ao(n,r.document.name),i=Pn(r.document.updateTime),o=r.document.createTime?Pn(r.document.createTime):Be.min(),c=new Et({mapValue:{fields:r.document.fields}}),u=Mt.newFoundDocument(s,i,o,c),l=r.targetIds||[],h=r.removedTargetIds||[];t=new Fs(l,h,u.key,u)}else if("documentDelete"in e){e.documentDelete;let r=e.documentDelete;r.document;let s=ao(n,r.document),i=r.readTime?Pn(r.readTime):Be.min(),o=Mt.newNoDocument(s,i),c=r.removedTargetIds||[];t=new Fs([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;let r=e.documentRemove;r.document;let s=ao(n,r.document),i=r.removedTargetIds||[];t=new Fs([],i,s,null)}else{if(!("filter"in e))return Z(11601,{we:e});{e.filter;let r=e.filter;r.targetId;let{count:s=0,unchangedNames:i}=r,o=new yB(s,i),c=r.targetId;t=new wc(c,o)}}return t}function hT(n,e){let t;if(e instanceof ns)t={update:am(n,e.key,e.value)};else if(e instanceof zs)t={delete:Eo(n,e.key)};else if(e instanceof Mn)t={update:am(n,e.key,e.data),updateMask:wT(e.fieldMask)};else{if(!(e instanceof mc))return Z(16599,{be:e.type});t={verify:Eo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){let c=o.transform;if(c instanceof Xr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Zr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof es)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof ts)return{fieldPath:o.field.canonicalString(),increment:c.h};if(c instanceof js)return{fieldPath:o.field.canonicalString(),minimum:c.h};if(c instanceof Ks)return{fieldPath:o.field.canonicalString(),maximum:c.h};throw Z(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Bc(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Z(27497)})(n,e.precondition)),t}function dT(n,e){return{documents:[oE(n,e.path)]}}function fT(n,e){let t={structuredQuery:{}},r=e.path,s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=oE(n,s);let i=(function(l){if(l.length!==0)return uE(Qt.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);let o=(function(l){if(l.length!==0)return l.map((h=>(function(g){return{field:Ps(g.field),direction:mT(g.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);let c=AB(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{Se:t,parent:s}}function pT(n){let e=uT(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,s=null;if(r>0){te(r===1,65062);let h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(f){let g=cE(f);return g instanceof Qt&&Jm(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(f){return f.map((g=>(function(R){return new gr(Ns(R.field),(function(G){switch(G){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(g)))})(t.orderBy));let c=null;t.limit&&(c=(function(f){let g;return g=typeof f=="object"?f.value:f,Ho(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(f){let g=!!f.before,v=f.values||[];return new Gn(v,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(f){let g=!f.before,v=f.values||[];return new Gn(v,g)})(t.endAt)),JI(e,s,o,i,c,"F",u,l)}function gT(n,e){let t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Z(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function CT(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function cE(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=Ns(t.unaryFilter.field);return je.create(r,"==",{doubleValue:NaN});case"IS_NULL":let s=Ns(t.unaryFilter.field);return je.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let i=Ns(t.unaryFilter.field);return je.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let o=Ns(t.unaryFilter.field);return je.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Z(61313);default:return Z(60726)}})(n):n.fieldFilter!==void 0?(function(t){return je.create(Ns(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Z(58110);default:return Z(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Qt.create(t.compositeFilter.filters.map((r=>cE(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Z(1026)}})(t.compositeFilter.op))})(n):Z(30097,{filter:n})}function mT(n){return oT[n]}function ET(n){return aT[n]}function _T(n){return cT[n]}function Ps(n){return{fieldPath:n.canonicalString()}}function Ns(n){return Lt.fromServerFormat(n.fieldPath)}function uE(n){return n instanceof je?(function(t){if(t.op==="=="){if(vt(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NAN"}};if(Ft(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(vt(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NAN"}};if(Ft(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ps(t.field),op:ET(t.op),value:t.value}}})(n):n instanceof Qt?(function(t){let r=t.getFilters().map((s=>uE(s)));return r.length===1?r[0]:{compositeFilter:{op:_T(t.op),filters:r}}})(n):Z(54877,{filter:n})}function wT(n){let e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function lE(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function BE(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function _o(n,e){let t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function hE(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iu(n){return new TB(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jt=class n{constructor(e){this._byteString=e}static fromBase64String(e){try{return new n(Qe.fromBase64String(e))}catch(t){throw new q(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new n(Qe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:n._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Go(e,n._jsonSchema))return n.fromBase64String(e.bytes)}};Jt._jsonSchemaVersion="firestore/bytes/1.0",Jt._jsonSchema={type:ze("string",Jt._jsonSchemaVersion),bytes:ze("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ss=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new q(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Lt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};function ou(){return new ss(gn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var is=class{constructor(e){this._methodName=e}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Nn=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new q(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new q(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ce(this._lat,e._lat)||Ce(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(Go(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};Nn._jsonSchemaVersion="firestore/geoPoint/1.0",Nn._jsonSchema={type:ze("string",Nn._jsonSchemaVersion),latitude:ze("number"),longitude:ze("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var it=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};it.UNAUTHENTICATED=new it(null),it.GOOGLE_CREDENTIALS=new it("google-credentials-uid"),it.FIRST_PARTY=new it("first-party-uid"),it.MOCK_USER=new it("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rn=class{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ic=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},Tc=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(it.UNAUTHENTICATED)))}shutdown(){}},bB=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}},Ac=class{constructor(e){this.De=e,this.currentUser=it.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){te(this.Ce===void 0,42304);let r=this.xe,s=u=>this.xe!==r?(r=this.xe,t(u)):Promise.resolve(),i=new rn;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new rn,e.enqueueRetryable((()=>s(this.currentUser)))};let o=()=>{let u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),o())};this.De.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){let u=this.De.getImmediate({optional:!0});u?c(u):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new rn)}}),0),o()}getToken(){let e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.xe!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(te(typeof r.accessToken=="string",31837,{Oe:r}),new Ic(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){let e=this.auth&&this.auth.getUid();return te(e===null||typeof e=="string",2055,{Me:e}),new it(e)}},SB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r,this.type="FirstParty",this.user=it.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);let e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}},RB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r}getToken(){return Promise.resolve(new SB(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(it.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},vc=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},bc=class{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,Pt(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){te(this.Ce===void 0,3512);let r=i=>{i.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);let o=i.token!==this.$e;return this.$e=i.token,z("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>r(i)))};let s=i=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){let i=this.qe.getImmediate({optional:!0});i?s(i):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new vc(this.Ke));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(te(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new vc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}};function dE(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var PB=class{Qe(e){}shutdown(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cm="ConnectivityMonitor",Sc=class{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){z(cm,"Network connectivity changed: AVAILABLE");for(let e of this.He)e(0)}je(){z(cm,"Network connectivity changed: UNAVAILABLE");for(let e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ac=null;function NB(){return ac===null?ac=(function(){return 268435456+Math.round(2147483648*Math.random())})():ac++,"0x"+ac.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rB="RestConnection",yT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},OB=class{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${r}/databases/${s}`,this.tt=this.databaseId.database===uo?`project_id=${r}`:`project_id=${r}&database_id=${s}`}nt(e,t,r,s,i){let o=NB(),c=this.rt(e,t.toUriEncodedString());z(rB,`Sending RPC '${e}' ${o}:`,c,r);let u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);let{host:l}=new URL(c),h=Rr(l);return this.st(e,c,u,r,h).then((f=>(z(rB,`Received RPC '${e}' ${o}: `,f),f)),(f=>{throw zt(rB,`RPC '${e}' ${o} failed with error: `,f,"url: ",c,"request:",r),f}))}_t(e,t,r,s,i,o){return this.nt(e,t,r,s,i)}it(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ni})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(let s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){let r=yT[e],s=`${this.Xe}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kB=class{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ht="WebChannelConnection",to=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))},Rc=class n extends OB{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!n.yt){let e=Kl();to(e,jl.STAT_EVENT,(t=>{t.stat===Ya.PROXY?z(ht,"STAT_EVENT: detected buffering proxy"):t.stat===Ya.NOPROXY&&z(ht,"STAT_EVENT: detected no buffering proxy")})),n.yt=!0}}st(e,t,r,s,i){let o=NB();return new Promise(((c,u)=>{let l=new Hl;l.setWithCredentials(!0),l.listenOnce(ql.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case Qi.NO_ERROR:let f=l.getResponseJson();z(ht,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),c(f);break;case Qi.TIMEOUT:z(ht,`RPC '${e}' ${o} timed out`),u(new q(O.DEADLINE_EXCEEDED,"Request time out"));break;case Qi.HTTP_ERROR:let g=l.getStatus();if(z(ht,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let v=l.getResponseJson();Array.isArray(v)&&(v=v[0]);let R=v?.error;if(R&&R.status&&R.message){let b=(function(U){let ae=U.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(ae)>=0?ae:O.UNKNOWN})(R.status);u(new q(b,R.message))}else u(new q(O.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new q(O.UNAVAILABLE,"Connection failed."));break;default:Z(9055,{wt:e,streamId:o,bt:l.getLastErrorCode(),St:l.getLastError()})}}finally{z(ht,`RPC '${e}' ${o} completed.`)}}));let h=JSON.stringify(s);z(ht,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",h,r,15)}))}vt(e,t,r){let s=NB(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.it(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;let l=i.join("");z(ht,`Creating RPC '${e}' stream ${s}: ${l}`,c);let h=o.createWebChannel(l,c);this.Dt(h);let f=!1,g=!1,v=new kB({ot:R=>{g?z(ht,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(f||(z(ht,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),z(ht,`RPC '${e}' stream ${s} sending:`,R),h.send(R))},ut:()=>h.close()});return to(h,Ts.EventType.OPEN,(()=>{g||(z(ht,`RPC '${e}' stream ${s} transport opened.`),v.Rt())})),to(h,Ts.EventType.CLOSE,(()=>{g||(g=!0,z(ht,`RPC '${e}' stream ${s} transport closed`),v.Vt(),this.xt(h))})),to(h,Ts.EventType.ERROR,(R=>{g||(g=!0,zt(ht,`RPC '${e}' stream ${s} transport errored. Name:`,R.name,"Message:",R.message),v.Vt(new q(O.UNAVAILABLE,"The operation could not be completed")))})),to(h,Ts.EventType.MESSAGE,(R=>{if(!g){let b=R.data[0];te(!!b,16349);let G=b,U=G?.error||G[0]?.error;if(U){z(ht,`RPC '${e}' stream ${s} received error:`,U);let ae=U.status,ve=(function(be){let A=Ke[be];if(A!==void 0)return tE(A)})(ae),we=U.message;ae==="NOT_FOUND"&&we.includes("database")&&we.includes("does not exist")&&we.includes(this.databaseId.database)&&zt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ve===void 0&&(ve=O.INTERNAL,we="Unknown error status: "+ae+" with message "+U.message),g=!0,v.Vt(new q(ve,we)),h.close()}else z(ht,`RPC '${e}' stream ${s} received:`,b),v.dt(b)}})),n.gt(),setTimeout((()=>{v.At()}),0),v}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,r){super.it(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Jl()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DT(n){return new Rc(n)}Rc.yt=!1;var wo=class{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=r,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();let t=Math.floor(this.Nt+this.qt()),r=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-r);s>0&&z("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var um="PersistentStream",FB=class{constructor(e,t,r,s,i,o,c,u){this.Ct=e,this.Kt=r,this.Qt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new wo(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===O.RESOURCE_EXHAUSTED?(xn(t.toString()),xn("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;let e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.un(r,s)}),(r=>{e((()=>{let s=new q(O.UNKNOWN,"Fetching auth token failed: "+r.message);return this.cn(s)}))}))}un(e,t){let r=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{r((()=>this.listener.ct()))})),this.stream.Et((()=>{r((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{r((()=>this.cn(s)))})),this.stream.onMessage((s=>{r((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return z(um,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(z(um,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}},xB=class extends FB{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();let t=BT(this.serializer,e),r=(function(i){if(!("targetChange"in i))return Be.min();let o=i.targetChange;return o.targetIds&&o.targetIds.length?Be.min():o.readTime?Pn(o.readTime):Be.min()})(e);return this.listener.Tn(t,r)}Pn(e){let t={};t.database=om(this.serializer),t.addTarget=(function(i,o){let c,u=o.target;if(c=jr(u)?{pipelineQuery:CT(i,u)}:Xm(u)?{documents:dT(i,u)}:{query:fT(i,u).Se},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=sE(i,o.resumeToken);let l=AB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo(Be.min())>0){c.readTime=oo(i,o.snapshotVersion.toTimestamp());let l=AB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}return c})(this.serializer,e);let r=gT(this.serializer,e);r&&(t.labels=r),this.nn(t)}In(e){let t={};t.database=om(this.serializer),t.removeTarget=e,this.nn(t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var LB=class{},VB=class extends LB{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new q(O.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,r,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.nt(e,vB(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(O.UNKNOWN,i.toString())}))}_t(e,t,r,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection._t(e,vB(t,r),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(O.UNKNOWN,o.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}};function IT(n,e,t,r){return new VB(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var TT="ComponentProvider",lm=new Map;function AT(n,e,t,r,s){return new uB(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,dE(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Bm={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},fE=41943040,Kt=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};Kt.DEFAULT_COLLECTION_PERCENTILE=10,Kt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Kt.DEFAULT=new Kt(fE,Kt.DEFAULT_COLLECTION_PERCENTILE,Kt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Kt.DISABLED=new Kt(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ws=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.gn(r),this.yn=r=>t.writeSequenceNumber(r))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.yn&&this.yn(e),e}};Ws.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",MB=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function au(n){if(n.code!==O.FAILED_PRECONDITION||n.message!==vT)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Z(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):n.reject(t)}static resolve(e){return new n(((t,r)=>{t(e)}))}static reject(e){return new n(((t,r)=>{r(e)}))}static waitFor(e){return new n(((t,r)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>r(u)))})),o=!0,i===s&&t()}))}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next((s=>s?n.resolve(s):r()));return t}static forEach(e,t){let r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new n(((r,s)=>{let i=e.length,o=new Array(i),c=0;for(let u=0;u<i;u++){let l=u;t(e[l]).next((h=>{o[l]=h,++c,c===i&&r(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new n(((r,s)=>{let i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bT(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function si(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hm="LruGarbageCollector",pE=1048576;function dm([n,e],[t,r]){let s=Ce(n,t);return s===0?Ce(e,r):s}var GB=class{constructor(e){this.Yn=e,this.buffer=new Ze(dm),this.Zn=0}Xn(){return++this.Zn}er(e){let t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{let r=this.buffer.last();dm(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}},UB=class{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){z(hm,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){si(t)?z(hm,"Ignoring IndexedDB error during garbage collection: ",t):await au(t)}await this.nr(3e5)}))}},HB=class{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return H.resolve(Ws.wn);let r=new GB(t);return this.rr.forEachTarget(e,(s=>r.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>r.er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.rr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(z("LruGarbageCollector","Garbage collection skipped; disabled"),H.resolve(Bm)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(z("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Bm):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let r,s,i,o,c,u,l,h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((f=>(f>this.params.maximumSequenceNumbersToCollect?(z("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),s=this.params.maximumSequenceNumbersToCollect):s=f,o=Date.now(),this.nthSequenceNumber(e,s)))).next((f=>(r=f,c=Date.now(),this.removeTargets(e,r,t)))).next((f=>(i=f,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((f=>(l=Date.now(),bs()<=ge.DEBUG&&z("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${f} documents in `+(l-u)+`ms
Total Duration: ${l-h}ms`),H.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:f}))))}};function ST(n,e){return new HB(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gE="firestore.googleapis.com",fm=!0,Pc=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new q(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=gE,this.ssl=fm}else this.host=e.host,this.ssl=e.ssl??fm;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=fE;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pE)throw new q(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(Pm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=dE(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new q(O.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;let i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(let c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}},cu=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Pc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Pc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Tc;switch(r.type){case"firstParty":return new RB(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new q(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){let r=lm.get(t);r&&(z(TT,"Removing Datastore"),lm.delete(t),r.terminate())})(this),Promise.resolve()}};function CE(n,e,t,r={}){n=wn(n,cu);let s=Rr(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&fa(`https://${c}`),i.host!==gE&&i.host!==c&&zt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let u={...i,host:c,ssl:s,emulatorOptions:r};if(!hn(u,o)&&(n._setSettings(u),r.mockUserToken)){let l,h;if(typeof r.mockUserToken=="string")l=r.mockUserToken,h=it.MOCK_USER;else{l=Gp(r.mockUserToken,n._app?.options.projectId);let f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new q(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new it(f)}n._authCredentials=new bB(new Ic(l,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sn=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},We=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new On(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Go(t,n._jsonSchema))return new n(e,r||null,new ee(Te.fromString(t.referencePath)))}};We._jsonSchemaVersion="firestore/documentReference/1.0",We._jsonSchema={type:ze("string",We._jsonSchemaVersion),referencePath:ze("string")};var On=class n extends sn{constructor(e,t,r){super(e,t,jo(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new We(this.firestore,null,new ee(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function hs(n,e,...t){if(n=Ge(n),Rm("collection","path",e),n instanceof cu){let r=Te.fromString(e,...t);return jC(r),new On(n,null,r)}{if(!(n instanceof We||n instanceof On))throw new q(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Te.fromString(e,...t));return jC(r),new On(n.firestore,null,r)}}function Qn(n,e,...t){if(n=Ge(n),arguments.length===1&&(e=xs.newId()),Rm("doc","path",e),n instanceof cu){let r=Te.fromString(e,...t);return qC(r),new We(n,null,new ee(r))}{if(!(n instanceof We||n instanceof On))throw new q(O.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Te.fromString(e,...t));return qC(r),new We(n.firestore,n instanceof On?n.converter:null,new ee(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Vt=class n{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Go(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new n(e.vectorValues);throw new q(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};Vt._jsonSchemaVersion="firestore/vectorValue/1.0",Vt._jsonSchema={type:ze("string",Vt._jsonSchemaVersion),vectorValues:ze("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var RT=/^__.*__$/,qB=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Mn(e,this.data,this.fieldMask,t,this.fieldTransforms):new ns(e,this.data,t,this.fieldTransforms)}},Nc=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Mn(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function mE(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Z(40011,{dataSource:n})}}var jB=class n{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new n({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return kc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(mE(this.dataSource)&&RT.test(e))throw this.createError('Document fields cannot begin and end with "__"')}},KB=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||iu(e)}createContext(e,t,r,s=!1){return new jB({dataSource:e,methodName:t,targetDoc:r,path:Lt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function uu(n){let e=n._freezeSettings(),t=iu(n._databaseId);return new KB(n._databaseId,!!e.ignoreUndefinedProperties,t)}function EE(n,e,t,r,s,i={}){let o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);nf("Data must be an object, but it was:",o,r);let c=yE(r,o),u,l;if(i.merge)u=new tn(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){let h=[];for(let f of i.mergeFields){let g=qn(e,f,t);if(!o.contains(g))throw new q(O.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);TE(h,g)||h.push(g)}u=new tn(h),l=o.fieldTransforms.filter((f=>u.covers(f.field)))}else u=null,l=o.fieldTransforms;return new qB(new Et(c),u,l)}var Oc=class n extends is{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof n}};var JB=class n extends is{_toFieldTransform(e){return new hB(e.path,new Xr)}isEqual(e){return e instanceof n}};function _E(n,e,t,r){let s=n.createContext(1,e,t);nf("Data must be an object, but it was:",s,r);let i=[],o=Et.empty();Bs(r,((u,l)=>{let h=rf(e,u,t);l=Ge(l);let f=s.childContextForFieldPath(h);if(l instanceof Oc)i.push(h);else{let g=Cr(l,f);g!=null&&(i.push(h),o.set(h,g))}}));let c=new tn(i);return new Nc(o,c,s.fieldTransforms)}function wE(n,e,t,r,s,i){let o=n.createContext(1,e,t),c=[qn(e,r,t)],u=[s];if(i.length%2!=0)throw new q(O.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(qn(e,i[g])),u.push(i[g+1]);let l=[],h=Et.empty();for(let g=c.length-1;g>=0;--g)if(!TE(l,c[g])){let v=c[g],R=u[g];R=Ge(R);let b=o.childContextForFieldPath(v);if(R instanceof Oc)l.push(v);else{let G=Cr(R,b);G!=null&&(l.push(v),h.set(v,G))}}let f=new tn(l);return new Nc(h,f,o.fieldTransforms)}function tf(n,e,t,r=!1){return Cr(t,n.createContext(r?4:3,e))}function Cr(n,e,t){if(IE(n=Ge(n)))return nf("Unsupported field value:",e,n),yE(n,e);if(n instanceof is)return(function(s,i){if(!mE(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);let o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){let o=[],c=0;for(let u of s){let l=Cr(u,i.childContextForArray(c));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),c++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=Ge(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Yd(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){let c=Ue.fromDate(s);return{timestampValue:oo(i.serializer,c)}}if(s instanceof Ue){let c=new Ue(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:oo(i.serializer,c)}}if(DE(s)){let c=Ue.fromInstant(s),u=new Ue(c.seconds,1e3*Math.floor(c.nanoseconds/1e3));return{timestampValue:oo(i.serializer,u)}}if(s instanceof Nn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Jt)return{bytesValue:sE(i.serializer,s._byteString)};if(s instanceof We){let c=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(c))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:ef(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Vt)return(function(u,l){let h=u instanceof Vt?u.toArray():u;return{mapValue:{fields:{[Wd]:{stringValue:Qd},[Yr]:{arrayValue:{values:h.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return tu(l.serializer,g)}))}}}}}})(s,i);if(BE(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Mo(s)}`)})(n,e)}function yE(n,e){let t={};return Sm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Bs(n,((r,s)=>{let i=Cr(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function DE(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;let e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function IE(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Ue||n instanceof Nn||n instanceof Jt||n instanceof We||n instanceof is||n instanceof Vt||DE(n)||BE(n))}function nf(n,e,t){if(!IE(t)||!Vo(t)){let r=Mo(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function qn(n,e,t){if((e=Ge(e))instanceof ss)return e._internalPath;if(typeof e=="string")return rf(n,e);throw kc("Field path arguments must be of type string or ",n,!1,void 0,t)}var PT=new RegExp("[~\\*/\\[\\]]");function rf(n,e,t){if(e.search(PT)>=0)throw kc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ss(...e.split("."))._internalPath}catch{throw kc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function kc(n,e,t,r,s){let i=r&&!r.isEmpty(),o=s!==void 0,c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new q(O.INVALID_ARGUMENT,c+n+u)}function TE(n,e){return n.some((t=>t.isEqual(e)))}function AE(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dt=class n{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){let r=Et.empty();for(let s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){let i=this.optionDefinitions[s];if(s in e){let o=e[s],c;i.nestedOptions&&Vo(o)?c={mapValue:{fields:new n(i.nestedOptions).getOptionsProto(t,o)}}:o&&(c=Cr(o,t)??void 0),c&&r.set(Lt.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){let s=this._getKnownOptions(t,e);if(r){let i=new Map(bm(r,((o,c)=>[Lt.fromServerFormat(c),o!==void 0?Cr(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NT(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Vo(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(){return new JB("serverTimestamp")}function vE(n){return new Vt(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(n){let e;return n instanceof jn?n:(e=Vo(n)?kT(n):n instanceof Array?FT(n):bE(n,void 0),e)}function sB(n){if(n instanceof jn)return n;if(n instanceof Vt)return yo(n);if(Array.isArray(n))return yo(vE(n));throw new Error("Unsupported value: "+typeof n)}function sf(n){return FI(n)?hc(n):j(n)}var jn=class{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,j(e)],"add")}asBoolean(){if(this instanceof Er)return this;if(this instanceof Qs)return new xc(this);if(this instanceof mr)return new QB(this);if(this instanceof x)return new Fc(this);throw new q("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,j(e)],"subtract")}multiply(e){return new x("multiply",[this,j(e)],"multiply")}divide(e){return new x("divide",[this,j(e)],"divide")}mod(e){return new x("mod",[this,j(e)],"mod")}equal(e){return new x("equal",[this,j(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,j(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,j(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,j(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,j(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,j(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){let r=[e,...t].map((s=>j(s)));return new x("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,j(e)],"arrayContains").asBoolean()}arrayContainsAll(e){let t=Array.isArray(e)?new zr(e.map(j),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){let t=Array.isArray(e)?new zr(e.map(j),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){let t=Array.isArray(e)?new zr(e.map(j),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){let t=Array.isArray(e)?new zr(e.map(j),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,j(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,j(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,j(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,j(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,j(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,j(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,j(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,j(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){let t=[this];return e&&t.push(j(e)),new x("trim",t,"trim")}ltrim(e){let t=[this];return e&&t.push(j(e)),new x("ltrim",t,"ltrim")}rtrim(e){let t=[this];return e&&t.push(j(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,yo(e)],"isType").asBoolean()}stringConcat(e,...t){let r=[e,...t].map(j);return new x("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,j(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,j(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,j(e),j(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,j(e),j(t)],"stringReplaceOne")}concat(e,...t){let r=[e,...t].map(j);return new x("concat",[this,...r],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,j(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,j(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new x("array_transform",[this,j(e),j(t),r],"arrayTransformWithIndex")}arraySlice(e,t){let r=[this,j(e)];return t!==void 0&&r.push(j(t)),new x("array_slice",r,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,j(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,j(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,j(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,j(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,j(e),j("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,j(e),j("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,j(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,yo(e)],"mapGet")}mapSet(e,t,...r){let s=[this,j(e),j(t),...r.map(j)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,j(e)],"get_field")}count(){return kt._create("count",[this],"count")}sum(){return kt._create("sum",[this],"sum")}average(){return kt._create("average",[this],"average")}minimum(){return kt._create("minimum",[this],"minimum")}maximum(){return kt._create("maximum",[this],"maximum")}first(){return kt._create("first",[this],"first")}last(){return kt._create("last",[this],"last")}arrayAgg(){return kt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return kt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return kt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){let r=[e,...t];return new x("maximum",[this,...r.map(j)],"logicalMaximum")}logicalMinimum(e,...t){let r=[e,...t];return new x("minimum",[this,...r.map(j)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,sB(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,sB(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,sB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,j(e),j(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,j(e),j(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,sf(e),j(t)],"timestampDiff")}timestampExtract(e,t){let r=[this,j(e)];return t&&r.push(j(t)),new x("timestamp_extract",r,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){let r=j(e);return new x("substring",t===void 0?[this,r]:[this,r,j(t)],"substring")}arrayGet(e){return new x("array_get",[this,j(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){let t=new x("if_error",[this,j(e)],"ifError");return e instanceof Er?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,j(e)],"mapRemove")}mapMerge(e,...t){let r=j(e),s=t.map(j);return new x("map_merge",[this,r,...s],"mapMerge")}pow(e){return new x("pow",[this,j(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,j(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,j(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,j(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,j(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,j(e),...t.map(j)],"coalesce")}join(e){return new x("join",[this,j(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,j(e)])}timestampTruncate(e,t){let r=[this,j(e)];return t&&r.push(j(t)),new x("timestamp_trunc",r)}ascending(){return xT(this)}descending(){return LT(this)}as(e){return new WB(this,e,"as")}},kt=class n{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){let s=new n(e,t);return s._methodName=r,s}as(e){return new zB(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}},zB=class{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}},WB=class{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}},zr=class extends jn{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}},mr=class extends jn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,j(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}};function hc(n){return OT(n,"field")}function OT(n,e){return new mr(typeof n=="string"?gn===n?ou()._internalPath:qn("field",n):n._internalPath,e)}var Qs=class n extends jn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){let t=new n(e,void 0);return t._protoValue=e,t}_toProto(e){return te(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,NT(this._protoValue)||(this._protoValue=Cr(this.value,e))}};function yo(n,e){return bE(n,"constant")}function bE(n,e){let t=new Qs(n,e);return typeof n=="boolean"?new xc(t):t}var x=class extends jn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new dt({})}_toProto(e){let t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}},Er=class n extends jn{get _methodName(){return this._expr._methodName}countIf(){return kt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){let t=j(e),r=new x("if_error",[this,t],"ifError");return t instanceof n?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}},Fc=class extends Er{constructor(e){super(),this._expr=e,this.expressionType="Function"}},xc=class extends Er{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}},QB=class extends Er{constructor(e){super(),this._expr=e,this.expressionType="Field"}};function kT(n,e){let t=[];for(let r in n)if(Object.prototype.hasOwnProperty.call(n,r)){let s=n[r];t.push(yo(r)),t.push(j(s))}return new x("map",t,"map")}function FT(n){return(function(t,r){return new x("array",t.map((s=>j(s))),r)})(n,"array")}function xT(n){return new Lc(sf(n),"ascending","ascending")}function LT(n){return new Lc(sf(n),"descending","descending")}var Lc=class{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:hE(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _t=class{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}},Vc=class extends _t{get _name(){return"add_fields"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[_o(e,this.fields)]}}_readUserData(e){super._readUserData(e),_r(this.fields,e)}};var Mc=class extends _t{get _name(){return"aggregate"}get _optionsUtil(){return new dt({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[_o(e,this.accumulators),_o(e,this.groups)]}}_readUserData(e){super._readUserData(e),_r(this.groups,e),_r(this.accumulators,e)}},Gc=class extends _t{get _name(){return"distinct"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[_o(e,this.groups)]}}_readUserData(e){super._readUserData(e),_r(this.groups,e)}},$s=class extends _t{get _name(){return"collection"}get _optionsUtil(){return new dt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}},Ys=class extends _t{get _name(){return"collection_group"}get _optionsUtil(){return new dt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}};var Do=class extends _t{get _name(){return"database"}get _optionsUtil(){return new dt({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}},Io=class extends _t{get _name(){return"documents"}get _optionsUtil(){return new dt({})}constructor(e,t){if(super(t),!e||e.length===0)throw new q(O.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");let r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new q(O.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=r,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}},Xs=class extends _t{get _name(){return"where"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),_r(this.condition,e)}};var Kn=class extends _t{get _name(){return"limit"}get _optionsUtil(){return new dt({})}constructor(e,t){te(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Yd(e,this.limit)]}}},Uc=class extends _t{get _name(){return"offset"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Yd(e,this.offset)]}}},$B=class extends _t{get _name(){return"select"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[_o(e,this.selections)]}}_readUserData(e){super._readUserData(e),_r(this.selections,e)}},nn=class extends _t{get _name(){return"sort"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),_r(this.orderings,e)}};var YB=class n extends _t{get _name(){return"replace_with"}get _optionsUtil(){return new dt({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),hE(n.Ir)]}}_readUserData(e){super._readUserData(e),_r(this.map,e)}};YB.Ir="full_replace";function _r(n,e){return AE(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var XB=class n{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Vr(e,t){let r=this.userDataReader.createContext(3,e);return AE(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){let t=this.stages.map((r=>r));return this.Vr("where",e),t.push(new Xs(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){let t=this.stages.map((r=>r));return t.push(new Kn(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){let r=this.stages.map((s=>s));return"orderings"in e?r.push(new nn(this.Vr("sort",e.orderings),{})):r.push(new nn(this.Vr("sort",[e,...t]),{})),new n(this._db,this.userDataReader,this._userDataWriter,r)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}};// Copyright 2024 Google LLC* @license
var at=class{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return lu(this)}getPipelineCollectionGroup(){return of(this)}getPipelineCollectionId(){return VT(this)}getPipelineDocuments(){return ZB(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Gc.name&&s._name!==Mc.name||(r="keyless"),s._name===$B.name&&r==="exact"&&(r="augmented"),s._name===Vc.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return hr(this)}};function hr(n){let e=n.stages[0];return e instanceof $s||e instanceof Ys||e instanceof Do||e instanceof Io?e._name:"unknown"}function lu(n){if(hr(n)==="collection")return n.stages[0].hr}function of(n){if(hr(n)==="collection_group")return n.stages[0].collectionId}function VT(n){switch(hr(n)){case"collection":return Te.fromString(lu(n)).lastSegment();case"collection_group":return of(n);default:return}}function ZB(n){if(hr(n)==="documents")return n.stages[0].Tr}var S=class n{constructor(e,t){this.type=e,this.value=t}static mr(){return new n("ERROR",void 0)}static pr(){return new n("UNSET",void 0)}static gr(){return new n("NULL",Gs)}static newValue(e){return Ft(e)?new n("NULL",Gs):(function(r){return!!r&&"booleanValue"in r})(e)?new n("BOOLEAN",e):Cn(e)?new n("INT",e):Kr(e)?new n("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new n("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new n("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new n("BYTES",e):e.referenceValue?new n("REFERENCE",e):e.geoPointValue?new n("GEO_POINT",e):Hs(e)?new n("ARRAY",e):ho(e)?new n("VECTOR",e):ks(e)?new n("MAP",e):new n("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}};function co(n){if(!n.yr())return n.value}function SE(n){return n instanceof Er?n._expr:n}function ce(n){if((n=SE(n))instanceof mr)return new eh(n);if(n instanceof Qs)return new th(n);if(n instanceof zr)return new nh(n);if(n instanceof x){if(n.name==="add")return new rh(n);if(n.name==="subtract")return new sh(n);if(n.name==="multiply")return new ih(n);if(n.name==="divide")return new oh(n);if(n.name==="mod")return new ah(n);if(n.name==="and")return new ch(n);if(n.name==="equal")return new wh(n);if(n.name==="not_equal")return new yh(n);if(n.name==="less_than")return new Dh(n);if(n.name==="less_than_or_equal")return new Ih(n);if(n.name==="greater_than")return new Th(n);if(n.name==="greater_than_or_equal")return new Ah(n);if(n.name==="array_concat")return new vh(n);if(n.name==="array_reverse")return new bh(n);if(n.name==="array_contains")return new Sh(n);if(n.name==="array_contains_all")return new Rh(n);if(n.name==="array_contains_any")return new Ph(n);if(n.name==="array_length")return new Nh(n);if(n.name==="array_element")return new Oh(n);if(n.name==="equal_any")return new Hc(n);if(n.name==="not_equal_any")return new Bh(n);if(n.name==="is_nan")return new hh(n);if(n.name==="is_not_nan")return new dh(n);if(n.name==="is_null")return new fh(n);if(n.name==="is_not_null")return new ph(n);if(n.name==="is_error")return new gh(n);if(n.name==="exists")return new Ch(n);if(n.name==="not")return new Zs(n);if(n.name==="or")return new uh(n);if(n.name==="xor")return new lh(n);if(n.name==="conditional")return new mh(n);if(n.name==="maximum")return new Eh(n);if(n.name==="minimum")return new _h(n);if(n.name==="reverse")return new kh(n);if(n.name==="replace_first")return new Fh(n);if(n.name==="replace_all")return new xh(n);if(n.name==="char_length")return new Lh(n);if(n.name==="byte_length")return new Vh(n);if(n.name==="like")return new Mh(n);if(n.name==="regex_contains")return new Gh(n);if(n.name==="regex_match")return new Uh(n);if(n.name==="string_contains")return new Hh(n);if(n.name==="starts_with")return new qh(n);if(n.name==="ends_with")return new jh(n);if(n.name==="to_lower")return new Kh(n);if(n.name==="to_upper")return new Jh(n);if(n.name==="trim")return new zh(n);if(n.name==="string_concat")return new Wh(n);if(n.name==="map_get")return new Qh(n);if(n.name==="cosine_distance")return new $h(n);if(n.name==="dot_product")return new Yh(n);if(n.name==="euclidean_distance")return new Xh(n);if(n.name==="vector_length")return new Zh(n);if(n.name==="unix_micros_to_timestamp")return new ed(n);if(n.name==="timestamp_to_unix_micros")return new rd(n);if(n.name==="unix_millis_to_timestamp")return new td(n);if(n.name==="timestamp_to_unix_millis")return new sd(n);if(n.name==="unix_seconds_to_timestamp")return new nd(n);if(n.name==="timestamp_to_unix_seconds")return new id(n);if(n.name==="timestamp_add")return new od(n);if(n.name==="timestamp_subtract")return new ad(n)}throw new Error(`Unknown Expr : ${n}`)}var eh=class{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===gn)return S.newValue({referenceValue:Eo(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return S.newValue({timestampValue:Bc(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return S.newValue({timestampValue:Bc(e.serializer,t.createTime)});let r=t.data.field(this.expr._fieldPath);return r?ri(r)?S.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Bc(i.serializer,Be.fromTimestamp(Vs(o)))};if(i.serverTimestampBehavior==="previous"){let c=Uo(o);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):S.newValue(r):S.pr()}},th=class{constructor(e){this.expr=e}evaluate(e,t){return S.newValue(this.expr._getValue())}},nh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.cr.map((s=>ce(s).evaluate(e,t)));return r.some((s=>s.yr()))?S.mr():S.newValue({arrayValue:{values:r.map((s=>s.value))}})}};function ct(n){return Kr(n)?Number(n.doubleValue):Number(n.integerValue)}function _n(n){return BigInt(n.integerValue)}var MT=BigInt("0x7fffffffffffffff"),GT=-BigInt("0x8000000000000000"),os=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length>=2,24778);let r=ce(this.expr.params[0]).evaluate(e,t),s=ce(this.expr.params[1]).evaluate(e,t),i=this.br(r,s);for(let o of this.expr.params.slice(2)){let c=ce(o).evaluate(e,t);i=this.br(i,c)}return i}br(e,t){if(e.yr()||t.yr())return S.mr();if(e.wr()||t.wr())return S.gr();let r=e.value,s=t.value;if(!Kr(r)&&!Cn(r)||!Kr(s)&&!Cn(s))return S.mr();if(Kr(r)||Kr(s)){let i=this.Sr(r,s);return i?S.newValue(i):S.mr()}if(Cn(r)&&Cn(s)){let i=this.vr(r,s);return i===void 0?S.mr():typeof i=="number"?S.newValue({doubleValue:i}):i<GT||i>MT?S.mr():S.newValue({integerValue:`${i}`})}return S.mr()}};function Jn(n,e){return $e(n)!==$e(e)?"TYPE_MISMATCH":vt(n)||vt(e)?"NOT_EQ":Ft(n)&&Ft(e)?"EQ":Ft(n)||Ft(e)?"NULL":Hs(n)&&Hs(e)?(function(r,s){if(r.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let o=0;o<(r.values?.length??0);o++){let c=r.values[o],u=s.values[o];switch(Jn(c,u)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:Z(44609,{Dr:c,Cr:u})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):ho(n)&&ho(e)||ks(n)&&ks(e)?(function(r,s){let i=r.fields||{},o=s.fields||{};if(pc(i)!==pc(o))return"NOT_EQ";let c=!1;for(let u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(Jn(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return Wt(r,s,{u:!1,i:!0,o:!0})})(n,e)?"EQ":"NOT_EQ"}var rh=class extends os{vr(e,t){return _n(e)+_n(t)}Sr(e,t){return{doubleValue:ct(e)+ct(t)}}},sh=class extends os{constructor(e){super(e),this.expr=e}vr(e,t){return _n(e)-_n(t)}Sr(e,t){return{doubleValue:ct(e)-ct(t)}}},ih=class extends os{constructor(e){super(e),this.expr=e}vr(e,t){return _n(e)*_n(t)}Sr(e,t){return{doubleValue:ct(e)*ct(t)}}},oh=class extends os{constructor(e){super(e),this.expr=e}vr(e,t){let r=_n(t);if(r!==BigInt(0))return _n(e)/r}Sr(e,t){let r=ct(t);return r===0?{doubleValue:Ms(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:ct(e)/r}}},ah=class extends os{constructor(e){super(e),this.expr=e}vr(e,t){let r=_n(t);if(r!==BigInt(0))return _n(e)%r}Sr(e,t){let r=ct(t);if(r!==0)return{doubleValue:ct(e)%r}}},ch=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ce(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!o.value?.booleanValue)return S.newValue(ot);break;case"NULL":s=!0;break;default:r=!0}}return r?S.mr():s?S.gr():S.newValue(Tt)}},Zs=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,9634);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return S.newValue({booleanValue:!r.value?.booleanValue});case"NULL":return S.gr();default:return S.mr()}}},uh=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ce(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(o.value?.booleanValue)return S.newValue(Tt);break;case"NULL":s=!0;break;default:r=!0}}return r?S.mr():s?S.gr():S.newValue(ot)}},lh=class n{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ce(i).evaluate(e,t);switch(o.type){case"BOOLEAN":r=n.xor(r,!!o.value?.booleanValue);break;case"NULL":s=!0;break;default:return S.mr()}}return s?S.gr():S.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}},Hc=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,55094);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return S.mr()}if(r)return S.gr();for(let o of i.value?.arrayValue?.values??[])switch(Ft(s.value)&&Ft(o)?"EQ":Jn(s.value,o)){case"EQ":return S.newValue(Tt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(44608,{value:s.value,candidate:o})}return r?S.gr():S.newValue(ot)}},Bh=class{constructor(e){this.expr=e}evaluate(e,t){return new Zs(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}},hh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,23322);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return S.newValue(ot);case"DOUBLE":return S.newValue({booleanValue:isNaN(ct(r.value))});case"NULL":return S.gr();default:return S.mr()}}},dh=class{constructor(e){this.expr=e}evaluate(e,t){return te(this.expr.params.length===1,50406),new Zs(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}},fh=class{constructor(e){this.expr=e}evaluate(e,t){switch(te(this.expr.params.length===1,23123),ce(this.expr.params[0]).evaluate(e,t).type){case"NULL":return S.newValue(Tt);case"UNSET":case"ERROR":return S.mr();default:return S.newValue(ot)}}},ph=class{constructor(e){this.expr=e}evaluate(e,t){return te(this.expr.params.length===1,23167),new Zs(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}},gh=class{constructor(e){this.expr=e}evaluate(e,t){return te(this.expr.params.length===1,5228),ce(this.expr.params[0]).evaluate(e,t).type==="ERROR"?S.newValue(Tt):S.newValue(ot)}},Ch=class{constructor(e){this.expr=e}evaluate(e,t){switch(te(this.expr.params.length===1,6877),ce(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return S.mr();case"UNSET":return S.newValue(ot);default:return S.newValue(Tt)}}},mh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===3,11706);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return r.value?.booleanValue?ce(this.expr.params[1]).evaluate(e,t):ce(this.expr.params[2]).evaluate(e,t);case"NULL":return ce(this.expr.params[2]).evaluate(e,t);default:return S.mr()}}},Eh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ce(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||At(i.value,s.value)>0?i:s}return s===void 0?S.gr():s}},_h=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ce(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||At(i.value,s.value)<0?i:s}return s===void 0?S.gr():s}},wr=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return S.mr()}let s=ce(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return S.mr()}return this.Fr(r,s)}},wh=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return S.newValue(Tt);if(e.wr()||t.wr()||vt(e.value)||vt(t.value)||$e(e.value)!==$e(t.value))return S.newValue(ot);switch(Jn(e.value,t.value)){case"EQ":return S.newValue(Tt);case"NOT_EQ":return S.newValue(ot);case"NULL":return S.gr();default:Z(44615,{left:e,right:t})}}},yh=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){switch(Jn(e.value,t.value)){case"EQ":return S.newValue(ot);case"NOT_EQ":case"TYPE_MISMATCH":return S.newValue(Tt);case"NULL":return S.gr();default:Z(44614,{left:e,right:t})}}},Dh=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){return $e(e.value)!==$e(t.value)||vt(e.value)||vt(t.value)?S.newValue(ot):S.newValue({booleanValue:At(e.value,t.value)<0})}},Ih=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){return $e(e.value)!==$e(t.value)||vt(e.value)||vt(t.value)?S.newValue(ot):Jn(e.value,t.value)==="EQ"?S.newValue(Tt):S.newValue({booleanValue:At(e.value,t.value)<0})}},Th=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){return $e(e.value)!==$e(t.value)||vt(e.value)||vt(t.value)?S.newValue(ot):S.newValue({booleanValue:At(e.value,t.value)>0})}},Ah=class extends wr{constructor(e){super(e),this.expr=e}Fr(e,t){return $e(e.value)!==$e(t.value)||vt(e.value)||vt(t.value)?S.newValue(ot):Jn(e.value,t.value)==="EQ"?S.newValue(Tt):S.newValue({booleanValue:At(e.value,t.value)>0})}},vh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},bh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,216);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return S.gr();case"ARRAY":{let s=r.value.arrayValue?.values??[];return S.newValue({arrayValue:{values:[...s].reverse()}})}default:return S.mr()}}},Sh=class{constructor(e){this.expr=e}evaluate(e,t){return te(this.expr.params.length===2,52884),new Hc(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}},Rh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,1392);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return S.mr()}if(r)return S.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of o){let l=!1;r=!1;for(let h of c){switch(Ft(u)&&Ft(h)?"EQ":Jn(u,h)){case"EQ":l=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(44613,{value:h,search:u})}if(l)break}if(!l)return S.newValue(ot)}return S.newValue(Tt)}},Ph=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,2680);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return S.mr()}if(r)return S.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of c)for(let l of o)switch(Ft(u)&&Ft(l)?"EQ":Jn(u,l)){case"EQ":return S.newValue(Tt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(60403,{value:u,search:l})}return r?S.gr():S.newValue(ot)}},Nh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,38605);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return S.gr();case"ARRAY":return S.newValue({integerValue:`${r.value?.arrayValue?.values?.length??0}`});default:return S.mr()}}},Oh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},kh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,1508);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return S.gr();case"BYTES":{let s=r.value?.bytesValue;if(typeof s=="string"){let i=Qe.fromBase64String(s).toUint8Array();return i.reverse(),S.newValue({bytesValue:Qe.fromUint8Array(i).toBase64()})}return S.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{let s=r.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),o=Array.from(i,(c=>c.segment)).reverse();return S.newValue({stringValue:o.join("")})}default:return S.mr()}}},Fh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},xh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Lh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,19400);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return S.gr();case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){let h=o.codePointAt(u+1);h!==void 0&&h>=56320&&h<=57343?(c+=1,u++):c+=1}else c+=1;else c+=1;else{if(!(l<=1114111))return;c+=1,u++}}return c})(r.value.stringValue);return s===void 0?S.mr():S.newValue({integerValue:s})}default:return S.mr()}}},Vh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,8486);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{let s=r.value?.bytesValue;return typeof s=="string"?S.newValue({integerValue:Qe.fromBase64String(s).toUint8Array().length}):S.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l>=55296&&l<=57343){if(!(l<=56319))return;{let h=o.codePointAt(u+1);if(h===void 0||!(h>=56320&&h<=57343))return;c+=4,u++}}else if(l<=127)c+=1;else if(l<=2047)c+=2;else if(l<=65535)c+=3;else{if(!(l<=1114111))return;c+=4,u++}}return c})(r.value?.stringValue);return s===void 0?S.mr():S.newValue({integerValue:s})}case"NULL":return S.gr();default:return S.mr()}}},yr=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return S.mr()}return r?S.gr():this.Or(s.value?.stringValue,i.value?.stringValue)}},Mh=class extends yr{Or(e,t){try{let r=(function(o){let c="";for(let u=0;u<o.length;u++){let l=o.charAt(u);switch(l){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+l;break;default:c+=l}}return"^"+c+"$"})(t),s=sc.compile(r);return S.newValue({booleanValue:s.matches(e)})}catch(r){return zt(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),S.mr()}}},Gh=class extends yr{Or(e,t){try{let r=sc.compile(t);return S.newValue({booleanValue:r.test(e)})}catch{return zt(`Invalid regex pattern found in regex_contains: ${t}, returning error`),S.mr()}}},Uh=class extends yr{Or(e,t){try{return S.newValue({booleanValue:sc.compile(t).matches(e)})}catch{return zt(`Invalid regex pattern found in regex_match: ${t}, returning error`),S.mr()}}},Hh=class extends yr{Or(e,t){return S.newValue({booleanValue:e.includes(t)})}},qh=class extends yr{Or(e,t){return S.newValue({booleanValue:e.startsWith(t)})}},jh=class extends yr{Or(e,t){return S.newValue({booleanValue:e.endsWith(t)})}},Kh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,29079);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return S.newValue({stringValue:r.value?.stringValue?.toLowerCase()});case"NULL":return S.gr();default:return S.mr()}}},Jh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,60487);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return S.newValue({stringValue:r.value?.stringValue?.toUpperCase()});case"NULL":return S.gr();default:return S.mr()}}},zh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,28544);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return S.newValue({stringValue:r.value?.stringValue?.trim()});case"NULL":return S.gr();default:return S.mr()}}},Wh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((o=>ce(o).evaluate(e,t))),s="",i=!1;for(let o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return S.mr()}return i?S.gr():S.newValue({stringValue:s})}},Qh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,4483);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return S.pr();case"MAP":break;default:return S.mr()}let s=ce(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return S.mr();let i=r.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?S.pr():S.newValue(i)}},To=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return S.mr()}if(r)return S.gr();let o=BB(s.value),c=BB(i.value);if(o===void 0||c===void 0||o.values?.length!==c.values?.length)return S.mr();let u=this.Mr(o,c);return u===void 0||isNaN(u)?S.mr():S.newValue({doubleValue:u})}},$h=class extends To{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return;let i=0,o=0,c=0;for(let l=0;l<r.length;l++){if(!pr(r[l])||!pr(s[l]))return;let h=ct(r[l]),f=ct(s[l]);i+=h*f,o+=h*h,c+=f*f}let u=Math.sqrt(o)*Math.sqrt(c);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}},Yh=class extends To{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!pr(r[o])||!pr(s[o]))return;i+=ct(r[o])*ct(s[o])}return i}},Xh=class extends To{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!pr(r[o])||!pr(s[o]))return;let c=ct(r[o]),u=ct(s[o]);i+=Math.pow(c-u,2)}return Math.sqrt(i)}},Zh=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,39044);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{let s=BB(r.value);return S.newValue({integerValue:s?.values?.length??0})}case"NULL":return S.gr();default:return S.mr()}}},Ao=BigInt(-62135596800),vo=BigInt(253402300799),qc=BigInt(1e3),dr=BigInt(1e6),UT=Ao*qc,HT=vo*qc+BigInt(999),qT=Ao*dr,jT=vo*dr+BigInt(999999);function af(n){return n>=qT&&n<=jT}function RE(n){return n>=Ao&&n<=vo}function bo(n,e){let t=BigInt(n);return!(t<Ao||t>vo)&&!(e<0||e>=1e9)&&(t!==Ao||e===0)&&!(t===vo&&e>999999999)}function PE(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function cf(n){return BigInt(n.seconds)*dr+BigInt(Math.trunc(n.nanoseconds/1e3))}var So=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return S.gr();default:return S.mr()}}},ed=class extends So{toTimestamp(e){if(!af(e))return S.mr();let t=Number(e/dr),r=Number(e%dr*BigInt(1e3)),s=PE(t,r);return t=s.seconds,r=s.nanos,bo(t,r)?S.newValue({timestampValue:{seconds:t,nanos:r}}):S.mr()}},td=class extends So{toTimestamp(e){if(!(function(o){return o>=UT&&o<=HT})(e))return S.mr();let t=Number(e/qc),r=Number(e%qc*BigInt(1e6)),s=PE(t,r);return t=s.seconds,r=s.nanos,bo(t,r)?S.newValue({timestampValue:{seconds:t,nanos:r}}):S.mr()}},nd=class extends So{toTimestamp(e){if(!RE(e))return S.mr();let t=Number(e);return S.newValue({timestampValue:{seconds:t,nanos:0}})}},Ro=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);let r=ce(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return S.gr();default:return S.mr()}let s=Zd(r.value.timestampValue);return bo(s.seconds,s.nanoseconds)?this.Nr(s):S.mr()}},rd=class extends Ro{Nr(e){let t=cf(e);return af(t)?S.newValue({integerValue:`${t.toString()}`}):S.mr()}},sd=class extends Ro{Nr(e){let t=cf(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?S.newValue({integerValue:r.toString()}):S.newValue({integerValue:(r-BigInt(1)).toString()})}},id=class extends Ro{Nr(e){let t=BigInt(e.seconds);return RE(t)?S.newValue({integerValue:t.toString()}):S.mr()}},jc=class{constructor(e){this.expr=e}evaluate(e,t){te(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1,s=ce(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return S.mr()}let i=ce(this.expr.params[1]).evaluate(e,t),o;switch(i.type){case"STRING":if(o=(function(ae){switch(ae){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return S.mr();break;case"NULL":r=!0;break;default:return S.mr()}let c=ce(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return S.mr()}if(r)return S.gr();let u=BigInt(c.value.integerValue),l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return S.mr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Lr(o)))return S.mr()}catch(U){return zt(`Error during timestamp arithmetic: ${U}`),S.mr()}let h=Zd(s.value.timestampValue);if(!bo(h.seconds,h.nanoseconds))return S.mr();let f=cf(h),g=this.Br(f,l);if(!af(g))return S.mr();let v=Number(g/dr),R=g%dr,b=Number((R<0?R+dr:R)*BigInt(1e3)),G=R<0?v-1:v;return bo(G,b)?S.newValue({timestampValue:{seconds:G,nanos:b}}):S.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}},od=class extends jc{Br(e,t){return e+t}},ad=class extends jc{Br(e,t){return e-t}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Po(n){if((n=SE(n))instanceof mr)return`fld(${n.fieldName})`;if(n instanceof Qs)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof We?`ref(${t.path})`:t instanceof Vt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof x)return`fn(${n.name},[${n.params.map(Po).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.cr.map(Po).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function KT(n){if(n instanceof Vc)return`${n._name}(${cc(n.fields)})`;if(n instanceof Mc){let e=`${n._name}(${cc(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${cc(n.groups)})`),e}if(n instanceof Gc)return`${n._name}(${cc(n.groups)})`;if(n instanceof $s)return`${n._name}(${n.hr})`;if(n instanceof Ys)return`${n._name}(${n.collectionId})`;if(n instanceof Do)return`${n._name}()`;if(n instanceof Io)return`${n._name}(${n.Tr.sort()})`;if(n instanceof Xs)return`${n._name}(${Po(n.condition)})`;if(n instanceof Kn)return`${n._name}(${n.limit})`;if(n instanceof nn)return`${n._name}(${(function(t){return t.map((r=>`${Po(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function cc(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${Po(t)}`)).join(",")}`}function kn(n){return n.stages.map((e=>KT(e))).join("|")}function NE(n,e){return kn(n)===kn(e)}function Xe(n){return n instanceof at}function pm(n){return Xe(n)?kn(n):so(n)}function OE(n){return Xe(n)?kn(n):(function(t){return`${$m(En(t))}|lt:${t.limitType}`})(n)}function Bu(n,e){return n instanceof at&&e instanceof at?NE(n,e):!(n instanceof at&&!(e instanceof at)||!(n instanceof at)&&e instanceof at)&&QI(n,e)}function kE(n){return jr(n)?kn(n):$m(n)}function FE(n,e){return n instanceof at&&e instanceof at?NE(n,e):!(n instanceof at&&!(e instanceof at)||!(n instanceof at)&&e instanceof at)&&Ym(n,e)}function JT(n,e){let t=(function(s){let i=!1,o=[];for(let c of s)if(c instanceof nn)if(i=!0,c.orderings.some((u=>u.expr instanceof mr&&u.expr.fieldName===gn)))o.push(c);else{let u=c.orderings.map((l=>l));u.push(hc(gn).ascending()),o.push(new nn(u,{}))}else c instanceof Kn&&(i||(o.push(new nn([hc(gn).ascending()],{})),i=!0)),o.push(c);return i||o.push(new nn([hc(gn).ascending()],{})),o})(n.stages);if(n.userDataReader){let r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new at(n.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cd=class{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){let i=this.mutations[s];i.key.isEqual(e.key)&&GI(i,e,r[s])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=ro(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=ro(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=rE();return this.mutations.forEach((s=>{let i=e.get(s.key),o=i.overlayedDocument,c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;let u=qm(o,c);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(Be.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),_e())}isEqual(e){return this.batchId===e.batchId&&Ls(this.mutations,e.mutations,((t,r)=>$C(t,r)))&&Ls(this.baseMutations,e.baseMutations,((t,r)=>$C(t,r)))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xE="";function zT(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=gm(e)),e=WT(n.get(t),e);return gm(e)}function WT(n,e){let t=e,r=n.length;for(let s=0;s<r;s++){let i=n.charAt(s);switch(i){case"\0":t+="";break;case xE:t+="";break;default:t+=i}}return t}function gm(n){return n+xE+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var QT="remoteDocuments",LE="owner";var VE="mutationQueues";var ME="mutations";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var GE="documentMutations",$T="remoteDocumentsV14";var UE="remoteDocumentGlobal";var HE="targets";var qE="targetDocuments";var jE="targetGlobal",KE="collectionParents";var JE="clientMetadata";var zE="bundles";var WE="namedQueries";var YT="indexConfiguration";var XT="indexState";var ZT="indexEntries";var QE="documentOverlays";var eA="globals";var tA=[VE,ME,GE,QT,HE,LE,jE,qE,JE,UE,KE,zE,WE],PS=[...tA,QE],nA=[VE,ME,GE,$T,HE,LE,jE,qE,JE,UE,KE,zE,WE,QE],rA=nA,sA=[...rA,YT,XT,ZT];var NS=[...sA,eA];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ud=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ei=class n{constructor(e,t,r,s,i=Be.min(),o=Be.min(),c=Qe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new n(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ld=class{constructor(e){this.$r=e}};function iA(n){let e=pT({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?go(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Kc=class{constructor(){}ei(e,t){this.ti(e,t),t.ni()}ti(e,t){if("nullValue"in e)this.ri(t,5);else if("booleanValue"in e)this.ri(t,10),t.ii(e.booleanValue?1:0);else if("integerValue"in e)this.ri(t,15),t.ii(Oe(e.integerValue));else if("doubleValue"in e){let r=Oe(e.doubleValue);isNaN(r)?this.ri(t,13):(this.ri(t,15),Ms(r)?t.ii(0):t.ii(r))}else if("timestampValue"in e){let r=e.timestampValue;this.ri(t,20),typeof r=="string"&&(r=Ln(r)),t.si(`${r.seconds||""}`),t.ii(r.nanos||0)}else if("stringValue"in e)this._i(e.stringValue,t),this.oi(t);else if("bytesValue"in e)this.ri(t,30),t.ai(Vn(e.bytesValue)),this.oi(t);else if("referenceValue"in e)this.ui(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.ri(t,45),t.ii(r.latitude||0),t.ii(r.longitude||0)}else"mapValue"in e?Mm(e)?this.ri(t,Number.MAX_SAFE_INTEGER):ho(e)?this.ci(e.mapValue,t):(this.li(e.mapValue,t),this.oi(t)):"arrayValue"in e?(this.Ei(e.arrayValue,t),this.oi(t)):Z(19022,{hi:e})}_i(e,t){this.ri(t,25),this.Ti(e,t)}Ti(e,t){t.si(e)}li(e,t){let r=e.fields||{};this.ri(t,55);for(let s of Object.keys(r))this._i(s,t),this.ti(r[s],t)}ci(e,t){let r=e.fields||{};this.ri(t,53);let s=Yr,i=r[s].arrayValue?.values?.length||0;this.ri(t,15),t.ii(Oe(i)),this._i(s,t),this.ti(r[s],t)}Ei(e,t){let r=e.values||[];this.ri(t,50);for(let s of r)this.ti(s,t)}ui(e,t){this.ri(t,37),ee.fromName(e).path.forEach((r=>{this.ri(t,60),this.Ti(r,t)}))}ri(e,t){e.ii(t)}oi(e){e.ii(2)}};Kc.Pi=new Kc;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Bd=class{constructor(){this.Zi=new hd}addToCollectionParentIndex(e,t){return this.Zi.add(t),H.resolve()}getCollectionParents(e,t){return H.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return H.resolve()}deleteFieldIndex(e,t){return H.resolve()}deleteAllFieldIndexes(e){return H.resolve()}createTargetIndexes(e,t){return H.resolve()}getDocumentsMatchingTarget(e,t){return H.resolve(null)}getIndexType(e,t){return H.resolve(0)}getFieldIndexes(e,t){return H.resolve([])}getNextCollectionGroupToUpdate(e){return H.resolve(null)}getMinOffset(e,t){return H.resolve(rs.min())}getMinOffsetFromCollectionGroup(e,t){return H.resolve(rs.min())}updateCollectionGroup(e,t,r){return H.resolve()}updateIndexEntries(e,t){return H.resolve()}},hd=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Ze(Te.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Ze(Te.comparator)).toArray()}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var OS=new Uint8Array(0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var as=class n{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new n(0)}static bs(){return new n(-1)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// Copyright 2024 Google LLC* @license
function $E(n,e){let t=e;for(let r of n.stages)t=aA({serializer:n.serializer,serverTimestampBehavior:n.listenOptions?.serverTimestampBehavior},r,t);return t}function hu(n,e){return $E(n,[e]).length>0}function oA(n,e){return Xe(n)?hu(n,e):su(n,e)}function aA(n,e,t){if(e instanceof $s)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof Xs)return(function(s,i,o){return o.filter((c=>{let u=co(ce(i.condition).evaluate(s,c));return u!==void 0&&Wt(u,Tt)}))})(n,e,t);if(e instanceof Ys)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Do)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof Io)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&i.Pr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Kn)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof nn)return(function(s,i,o){let c=i.orderings.map((u=>({Ms:ce(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(let{Ms:h,direction:f}of c){let g=co(h.evaluate(s,u)),v=co(h.evaluate(s,l)),R=At(g??Gs,v??Gs);if(R!==0)return f==="ascending"?R:-R}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function dd(n){let e=(function(r){for(let s=r.stages.length-1;s>=0;s--){let i=r.stages[s];if(i instanceof nn)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(let s of e){let i=co(ce(s.expr).evaluate({serializer:n.serializer},t)),o=co(ce(s.expr).evaluate({serializer:n.serializer},r)),c=At(i||Gs,o||Gs);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function iB(n){for(let e=n.stages.length-1;e>=0;e--){let t=n.stages[e];if(t instanceof Kn)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fd=class{constructor(){this.changes=new Hn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Mt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?H.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pd=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gd=class{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&ro(r.mutation,s,tn.empty(),Ue.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,_e()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=_e()){let s=Br();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=Rs();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){let r=Br();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,_e())))}populateOverlays(e,t,r){let s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,r,s){let i=xt(),o=io(),c=(function(){return io()})();return t.forEach(((u,l)=>{let h=r.get(l.key);s.has(l.key)&&(h===void 0||h.mutation instanceof Mn)?i=i.insert(l.key,l):h!==void 0?(o.set(l.key,h.mutation.getFieldMask()),ro(h.mutation,l,h.mutation.getFieldMask(),Ue.now())):o.set(l.key,tn.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,h)=>o.set(l,h))),t.forEach(((l,h)=>c.set(l,new pd(h,o.get(l)??null)))),c)))}recalculateAndSaveOverlays(e,t){let r=io(),s=new He(((o,c)=>o-c)),i=_e();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(let c of o)c.keys().forEach((u=>{let l=t.get(u);if(l===null)return;let h=r.get(u)||tn.empty();h=c.applyToLocalView(l,h),r.set(u,h);let f=(s.get(c.batchId)||_e()).add(u);s=s.insert(c.batchId,f)}))})).next((()=>{let o=[],c=s.getReverseIterator();for(;c.hasNext();){let u=c.getNext(),l=u.key,h=u.value,f=rE();h.forEach((g=>{if(!i.has(g)){let v=qm(t.get(g),r.get(g));v!==null&&f.set(g,v),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,f))}return H.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Xe(t)?this.getDocumentsMatchingPipeline(e,t,r,s):zI(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):nu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{let o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):H.resolve(Br()),c=po,u=i;return o.next((l=>H.forEach(l,((h,f)=>(c<f.largestBatchId&&(c=f.largestBatchId),i.get(h)?H.resolve():this.remoteDocumentCache.getEntry(e,h).next((g=>{u=u.insert(h,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,_e()))).next((h=>({batchId:c,changes:ZI(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ee(t)).next((r=>{let s=Rs();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){let i=t.collectionGroup,o=Rs();return this.indexManager.getCollectionParents(e,i).next((c=>H.forEach(c,(u=>{let l=(function(f,g){return new Un(g,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,r,s).next((h=>{h.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>su(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(hr(t)==="collection_group"){let i=of(t),o=Rs();return this.indexManager.getCollectionParents(e,i).next((c=>H.forEach(c,(u=>{let l=(function(f,g){let v=f.stages.map((R=>R instanceof Ys?new $s(g.canonicalString(),{}):R));return new at(f.serializer,v)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,r,s).next((h=>{h.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,hr(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=_e();for(let u of ZB(t))c=c.add(ee.fromPath(u));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new q("invalid-argument",`Invalid pipeline source to execute offline: ${kn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>hu(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{let c=o.getKey();t.get(c)===null&&(t=t.insert(c,Mt.newInvalidDocument(c)))}));let s=Rs();return t.forEach(((i,o)=>{let c=e.get(i);c!==void 0&&ro(c.mutation,o,tn.empty(),Ue.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch(hr(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Te.fromString(lu(t)),r);case"collection_group":throw new q("invalid-argument",`Unexpected collection group pipeline: ${kn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,ZB(t).map((s=>ee.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new q("invalid-argument",`Failed to get overlays for pipeline: ${kn(t)}`)}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cd=class{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return H.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Pn(s.createTime)}})(t)),H.resolve()}getNamedQuery(e,t){return H.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:iA(s.bundledQuery),readTime:Pn(s.readTime)}})(t)),H.resolve()}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var md=class{constructor(){this.overlays=new He(ee.comparator),this.Gs=new Map}getOverlay(e,t){return H.resolve(this.overlays.get(t))}getOverlays(e,t){let r=Br();return H.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){let r=Br();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),H.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Zr(e,t,i)})),H.resolve()}removeOverlaysForBatchId(e,t,r){let s=this.Gs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(r)),H.resolve()}getOverlaysForCollection(e,t,r){let s=Br(),i=t.length+1,o=new ee(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){let u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return H.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new He(((l,h)=>l-h)),o=this.overlays.getIterator();for(;o.hasNext();){let l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let h=i.get(l.largestBatchId);h===null&&(h=Br(),i=i.insert(l.largestBatchId,h)),h.set(l.getKey(),l)}}let c=Br(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,h)=>c.set(l,h))),!(c.size()>=s)););return H.resolve(c)}Zr(e,t,r){let s=this.overlays.get(r.key);if(s!==null){let o=this.Gs.get(s.largestBatchId).delete(r.key);this.Gs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new ud(t,r));let i=this.Gs.get(t);i===void 0&&(i=_e(),this.Gs.set(t,i)),this.Gs.set(t,i.add(r.key))}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ed=class{constructor(){this.sessionToken=Qe.EMPTY_BYTE_STRING}getSessionToken(e){return H.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,H.resolve()}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var No=class{constructor(){this.zs=new Ze(Je.js),this.Hs=new Ze(Je.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){let r=new Je(e,t);this.zs=this.zs.add(r),this.Hs=this.Hs.add(r)}Ys(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Zs(new Je(e,t))}Xs(e,t){e.forEach((r=>this.removeReference(r,t)))}e_(e){let t=new ee(new Te([])),r=new Je(t,e),s=new Je(t,e+1),i=[];return this.Hs.forEachInRange([r,s],(o=>{this.Zs(o),i.push(o.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){let t=new ee(new Te([])),r=new Je(t,e),s=new Je(t,e+1),i=_e();return this.Hs.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){let t=new Je(e,0),r=this.zs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},Je=class{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return ee.comparator(e.key,t.key)||Ce(e.r_,t.r_)}static Js(e,t){return Ce(e.r_,t.r_)||ee.comparator(e.key,t.key)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _d=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new Ze(Je.js)}checkEmpty(e){return H.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){let i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let o=new cd(i,t,r,s);this.mutationQueue.push(o);for(let c of s)this.i_=this.i_.add(new Je(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return H.resolve(o)}lookupMutationBatch(e,t){return H.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,s=this.__(r),i=s<0?0:s;return H.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return H.resolve(this.mutationQueue.length===0?OI:this.Gr-1)}getAllMutationBatches(e){return H.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new Je(t,0),s=new Je(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([r,s],(o=>{let c=this.s_(o.r_);i.push(c)})),H.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Ze(Ce);return t.forEach((s=>{let i=new Je(s,0),o=new Je(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,o],(c=>{r=r.add(c.r_)}))})),H.resolve(this.o_(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,s=r.length+1,i=r;ee.isDocumentKey(i)||(i=i.child(""));let o=new Je(new ee(i),0),c=new Ze(Ce);return this.i_.forEachWhile((u=>{let l=u.key.path;return!!r.isPrefixOf(l)&&(l.length===s&&(c=c.add(u.r_)),!0)}),o),H.resolve(this.o_(c))}o_(e){let t=[];return e.forEach((r=>{let s=this.s_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){te(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.i_;return H.forEach(t.mutations,(s=>{let i=new Je(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=r}))}Hr(e){}containsKey(e,t){let r=new Je(t,0),s=this.i_.firstAfterOrEqual(r);return H.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,H.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){let t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wd=class{constructor(e){this.u_=e,this.docs=(function(){return new He(ee.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.u_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return H.resolve(r?r.document.mutableCopy():Mt.newInvalidDocument(t))}getEntries(e,t){let r=xt();return t.forEach((s=>{let i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Mt.newInvalidDocument(s))})),H.resolve(r)}getAllEntries(e){let t=xt();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),H.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;Xe(t)?(i=Te.fromString(lu(t)),o=h=>hu(t,h)):(i=t.path,o=h=>su(t,h));let c=xt(),u=new ee(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){let{key:h,value:{document:f}}=l.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||KI(jI(f),r)<=0||(s.has(f.key)||o(f))&&(c=c.insert(f.key,f.mutableCopy()))}return H.resolve(c)}getAllFromCollectionGroup(e,t,r,s){Z(9500)}c_(e,t){return H.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new yd(this)}getSize(e){return H.resolve(this.size)}},yd=class extends fd{constructor(e){super(),this.$s=e}applyChanges(e){let t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(r)})),H.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Dd=class{constructor(e){this.persistence=e,this.l_=new Hn((t=>kE(t)),FE),this.lastRemoteSnapshotVersion=Be.min(),this.highestTargetId=0,this.E_=0,this.h_=new No,this.targetCount=0,this.T_=as.ws()}forEachTarget(e,t){return this.l_.forEach(((r,s)=>t(s))),H.resolve()}getLastRemoteSnapshotVersion(e){return H.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return H.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),H.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.E_&&(this.E_=t),H.resolve()}Ds(e){this.l_.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.T_=new as(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,H.resolve()}updateTargetData(e,t){return this.Ds(t),H.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,H.resolve()}removeTargets(e,t,r){let s=0,i=[];return this.l_.forEach(((o,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.l_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),H.waitFor(i).next((()=>s))}getTargetCount(e){return H.resolve(this.targetCount)}getTargetData(e,t){let r=this.l_.get(t)||null;return H.resolve(r)}addMatchingKeys(e,t,r){return this.h_.Ys(t,r),H.resolve()}removeMatchingKeys(e,t,r){this.h_.Xs(t,r);let s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),H.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),H.resolve()}getMatchingKeysForTargetId(e,t){let r=this.h_.n_(t);return H.resolve(r)}containsKey(e,t){return H.resolve(this.h_.containsKey(t))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jc=class{constructor(e,t){this.P_={},this.overlays={},this.I_=new Ws(0),this.R_=!1,this.R_=!0,this.A_=new Ed,this.referenceDelegate=e(this),this.V_=new Dd(this),this.indexManager=new Bd,this.remoteDocumentCache=(function(s){return new wd(s)})((r=>this.referenceDelegate.d_(r))),this.serializer=new ld(t),this.f_=new Cd(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new md,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.P_[e.toKey()];return r||(r=new _d(t,this.referenceDelegate),this.P_[e.toKey()]=r),r}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,r){z("MemoryPersistence","Starting transaction:",e);let s=new Id(this.I_.next());return this.referenceDelegate.m_(),r(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return H.or(Object.values(this.P_).map((r=>()=>r.containsKey(e,t))))}},Id=class extends MB{constructor(e){super(),this.currentSequenceNumber=e}},Td=class n{constructor(e){this.persistence=e,this.y_=new No,this.w_=null}static b_(e){return new n(e)}get S_(){if(this.w_)return this.w_;throw Z(60996)}addReference(e,t,r){return this.y_.addReference(r,t),this.S_.delete(r.toString()),H.resolve()}removeReference(e,t,r){return this.y_.removeReference(r,t),this.S_.add(r.toString()),H.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),H.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return H.forEach(this.S_,(r=>{let s=ee.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,Be.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return H.or([()=>H.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}},zc=class n{constructor(e,t){this.persistence=e,this.D_=new Hn((r=>zT(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=ST(this,t)}static b_(e,t){return new n(e,t)}m_(){}p_(e){return H.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){let t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Cs(e){let t=0;return this.sr(e,(r=>{t++})).next((()=>t))}sr(e,t){return H.forEach(this.D_,((r,s)=>this.Os(e,r,s).next((i=>i?H.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0,s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(o=>this.Os(e,o,t).next((c=>{c||(r++,i.removeEntry(o,Be.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),H.resolve()}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),H.resolve()}removeReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),H.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),H.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=uc(e.data.value)),t}Os(e,t,r){return H.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let s=this.D_.get(t);return H.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ad=class n{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Vo=r,this.fo=s}static mo(e,t){let r=_e(),s=_e();for(let i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new n(e,t.fromCache,r,s)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cA(n,e){return ee.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vd=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bd=class{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return Jp()?8:bT(nt())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,r,s){let i={result:null};return this.vo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Do(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;let o=new vd;return this.xo(e,t,o).next((c=>{if(i.result=c,this.yo)return this.Co(e,t,o,c.size)}))})).next((()=>i.result))}Co(e,t,r,s){return Xe(t)?H.resolve():r.documentReadCount<this.wo?(bs()<=ge.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",so(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),H.resolve()):(bs()<=ge.DEBUG&&z("QueryEngine","Query:",so(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.bo*s?(bs()<=ge.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",so(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,En(t))):H.resolve())}vo(e,t){if(Xe(t))return H.resolve(null);let r=t;if(nm(r))return H.resolve(null);let s=En(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=go(r,null,"F"),s=En(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{let c=_e(...o);return this.So.getDocuments(e,c).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{let h=this.Fo(r,u);return this.Oo(r,h,c,l.readTime)?this.vo(e,go(r,null,"F")):this.Mo(e,h,r,l)}))))})))))}Do(e,t,r,s){return(Xe(t)?(function(o){for(let c of o.stages){if(c instanceof Kn||c instanceof Uc)return!1;if(c instanceof Xs){if(c.condition instanceof Fc&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof mr&&c.condition._expr.params[0].fieldName===gn)continue;return!1}}return!0})(t):nm(t))||s.isEqual(Be.min())?H.resolve(null):this.So.getDocuments(e,r).next((i=>{let o=this.Fo(t,i);return this.Oo(t,o,r,s)?H.resolve(null):(bs()<=ge.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),pm(t)),this.Mo(e,o,t,qI(s,po)).next((c=>c)))}))}Fo(e,t){let r,s;return Xe(e)?(r=new Ze(cA),s=i=>hu(e,i)):(r=new Ze(Xd(e)),s=i=>su(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Oo(e,t,r,s){if(Xe(e))return(function(c){return c.stages.some((u=>u instanceof Kn||u instanceof Uc))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;let i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,r){return bs()<=ge.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",pm(t)),this.So.getDocumentsMatchingQuery(e,t,rs.min(),r)}Mo(e,t,r,s){return this.So.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var uf="LocalStore",uA=3e8,Sd=class{constructor(e,t,r,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new He(Ce),this.Bo=new Hn((i=>kE(i)),FE),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(r)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new gd(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}};function lA(n,e,t,r){return new Sd(n,e,t,r)}async function YE(n,e){let t=me(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{let o=[],c=[],u=_e();for(let l of s){o.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}for(let l of i){c.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}return t.localDocuments.getDocuments(r,u).next((l=>({$o:l,removedBatchIds:o,addedBatchIds:c})))}))}))}function XE(n){let e=me(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function BA(n,e){let t=me(n),r=e.snapshotVersion,s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{let o=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;let c=[];e.targetChanges.forEach(((h,f)=>{let g=s.get(f);if(!g)return;c.push(t.V_.removeMatchingKeys(i,h.removedDocuments,f).next((()=>t.V_.addMatchingKeys(i,h.addedDocuments,f))));let v=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?v=v.withResumeToken(Qe.EMPTY_BYTE_STRING,Be.min()).withLastLimboFreeSnapshotVersion(Be.min()):h.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(h.resumeToken,r)),s=s.insert(f,v),(function(b,G,U){return b.resumeToken.approximateByteSize()===0||G.snapshotVersion.toMicroseconds()-b.snapshotVersion.toMicroseconds()>=uA?!0:U.addedDocuments.size+U.modifiedDocuments.size+U.removedDocuments.size>0})(g,v,h)&&c.push(t.V_.updateTargetData(i,v))}));let u=xt(),l=_e();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),c.push(hA(i,o,e.documentUpdates).next((h=>{u=h.Ko,l=h.Qo}))),!r.isEqual(Be.min())){let h=t.V_.getLastRemoteSnapshotVersion(i).next((f=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(h)}return H.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function hA(n,e,t){let r=_e(),s=_e();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=xt();return t.forEach(((c,u)=>{let l=i.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(Be.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):z(uf,"Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)})),{Ko:o,Qo:s}}))}function dA(n,e){let t=me(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.V_.getTargetData(r,e).next((i=>i?(s=i,H.resolve(s)):t.V_.allocateTargetId(r).next((o=>(s=new ei(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.V_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{let s=t.Lo.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(r.targetId,r),t.Bo.set(e,r.targetId)),r}))}async function Rd(n,e,t){let r=me(n),s=r.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!si(o))throw o;z(uf,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Lo=r.Lo.remove(e),r.Bo.delete(s.target)}function Cm(n,e,t){let r=me(n),s=Be.min(),i=_e();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,h){let f=me(u),g=f.Bo.get(h);return g!==void 0?H.resolve(f.Lo.get(g)):f.V_.getTargetData(l,h)})(r,o,Xe(e)?e:En(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.V_.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>r.No.getDocumentsMatchingQuery(o,e,t?s:Be.min(),t?i:_e()))).next((c=>(fA(r,c),{documents:c,Wo:i})))))}function fA(n,e){e.forEach(((t,r)=>{let s=r.key.getCollectionGroup(),i=n.Uo.get(s)||Be.min();r.readTime.compareTo(i)>0&&n.Uo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pd=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(xn(t),this.Xo=!1):z("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zn="RemoteStore",Nd=class{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new as(1e3),this.ca=new as(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((o=>{r.enqueueAndForget((async()=>{Jo(this)&&(z(zn,"Restarting streams for network reachability change."),await(async function(u){let l=me(u);l.la.add(4),await Ko(l),l.Ta.set("Unknown"),l.la.delete(4),await du(l)})(this))}))})),this.Ta=new Pd(r,s)}};async function du(n){if(Jo(n))for(let e of n.Ea)await e(!0)}async function Ko(n){for(let e of n.Ea)await e(!1)}function Od(n,e){return n.oa.get(e)||void 0}function ZE(n,e){let t=me(n),r=Od(t,e.targetId);if(r!==void 0&&t._a.has(r))return;let s=(function(c,u){let l=Od(c,u);l!==void 0&&c.aa.delete(l);let h=(function(g,v){return v%2!=0?g.ca.next():g.ua.next()})(c,u);return c.oa.set(u,h),c.aa.set(h,u),h})(t,e.targetId);z(zn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);let i=new ei(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),df(t)?hf(t):ii(t).Yt()&&Bf(t,i)}function lf(n,e){let t=me(n),r=ii(t),s=Od(t,e);z(zn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),r.Yt()&&e_(t,s),t._a.size===0&&(r.Yt()?r.en():Jo(t)&&t.Ta.set("Unknown"))}function Bf(n,e){if(n.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Be.min())>0){let t=n.aa.get(e.targetId);if(t===void 0)return void z(zn,"SDK target ID not found for remote ID: "+e.targetId);let r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}ii(n).Pn(e)}function e_(n,e){n.Pa.J(e),ii(n).In(e)}function hf(n){n.Pa=new IB({getRemoteKeysForTarget:e=>{let t=n.aa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):_e()},ye:e=>n._a.get(e)||null,Ve:()=>n.datastore.serializer.databaseId}),ii(n).start(),n.Ta.ea()}function df(n){return Jo(n)&&!ii(n).Jt()&&n._a.size>0}function Jo(n){return me(n).la.size===0}function t_(n){n.Pa=void 0}async function pA(n){n.Ta.set("Online")}async function gA(n){n._a.forEach(((e,t)=>{Bf(n,e)}))}async function CA(n,e){t_(n),df(n)?(n.Ta.ra(e),hf(n)):n.Ta.set("Unknown")}async function mA(n,e,t){if(n.Ta.set("Online"),e instanceof yc&&e.state===2&&e.cause)try{await(async function(s,i){let o=i.cause;for(let c of i.targetIds){if(s._a.has(c)){let u=s.aa.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.oa.delete(u),s.aa.delete(c)),s._a.delete(c)}s.Pa.removeTarget(c)}})(n,e)}catch(r){z(zn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await mm(n,r)}else if(e instanceof Fs?n.Pa._e(e):e instanceof wc?n.Pa.he(e):n.Pa.ue(e),!t.isEqual(Be.min()))try{let r=await XE(n.localStore);t.compareTo(r)>=0&&await(function(i,o){let c=i.Pa.fe(o);c.targetChanges.forEach(((l,h)=>{if(l.resumeToken.approximateByteSize()>0){let f=i._a.get(h);f&&i._a.set(h,f.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,h)=>{let f=i._a.get(l);if(!f)return;i._a.set(l,f.withResumeToken(Qe.EMPTY_BYTE_STRING,f.snapshotVersion)),e_(i,l);let g=new ei(f.target,l,h,f.sequenceNumber);Bf(i,g)}));let u=(function(h,f){let g=new Map;f.targetChanges.forEach(((R,b)=>{let G=h.aa.get(b);G!==void 0&&g.set(G,R)}));let v=new He(Ce);return f.targetMismatches.forEach(((R,b)=>{let G=h.aa.get(R);G!==void 0&&(v=v.insert(G,b))})),new Co(f.snapshotVersion,g,v,f.documentUpdates,f.augmentedDocumentUpdates,f.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){z(zn,"Failed to raise snapshot:",r),await mm(n,r)}}async function mm(n,e,t){if(!si(e))throw e;n.la.add(1),await Ko(n),n.Ta.set("Offline"),t||(t=()=>XE(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{z(zn,"Retrying IndexedDB access"),await t(),n.la.delete(1),await du(n)}))}async function Em(n,e){let t=me(n);t.asyncQueue.verifyOperationInProgress(),z(zn,"RemoteStore received new credentials");let r=Jo(t);t.la.add(3),await Ko(t),r&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await du(t)}async function EA(n,e){let t=me(n);e?(t.la.delete(2),await du(t)):e||(t.la.add(2),await Ko(t),t.Ta.set("Unknown"))}function ii(n){return n.Ia||(n.Ia=(function(t,r,s){let i=me(t);return i.pn(),new xB(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:pA.bind(null,n),Et:gA.bind(null,n),Tt:CA.bind(null,n),Tn:mA.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ia.Xt(),df(n)?hf(n):n.Ta.set("Unknown")):(await n.Ia.stop(),t_(n))}))),n.Ia}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oo=class{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):xn("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kd=class n{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new rn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){let o=Date.now()+r,c=new n(e,t,o,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function n_(n,e){if(xn("AsyncQueue",`${e}: ${n}`),si(n))return new q(O.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wc=class{constructor(){this.activeTargetIds=nT()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var Fd=class{constructor(){this.fu=new Wc,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,r){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new Wc,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oB(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ko=class n{static emptySet(e){return new n(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||ee.comparator(t.key,r.key):(t,r)=>ee.comparator(t.key,r.key),this.keyedMap=Rs(),this.sortedSet=new He(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){let e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){let r=new n;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qc=class{constructor(){this.pu=new He(ee.comparator)}track(e){let t=e.doc.key,r=this.pu.get(t);r?e.type!==0&&r.type===3?this.pu=this.pu.insert(t,e):e.type===3&&r.type!==1?this.pu=this.pu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.pu=this.pu.remove(t):e.type===1&&r.type===2?this.pu=this.pu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):Z(63341,{we:e,gu:r}):this.pu=this.pu.insert(t,e)}yu(){let e=[];return this.pu.inorderTraversal(((t,r)=>{e.push(r)})),e}},ti=class n{constructor(e,t,r,s,i,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,s,i){let o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new n(e,t,ko.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Bu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xd=class{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}},Ld=class{constructor(){this.queries=_m(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,r){let s=me(t),i=s.queries;s.queries=_m(),i.forEach(((o,c)=>{for(let u of c.bu)u.onError(r)}))})(this,new q(O.ABORTED,"Firestore shutting down"))}};function _m(){return new Hn((n=>OE(n)),Bu)}async function ff(n,e){let t=me(n),r=3,s=e.query,i=t.queries.get(s);i?!i.Su()&&e.vu()&&(r=2):(i=new xd,r=e.vu()?0:1);try{switch(r){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){let c=n_(o,`Initialization of query '${Xe(e.query)?kn(e.query):so(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&gf(t)}async function pf(n,e){let t=me(n),r=e.query,s=3,i=t.queries.get(r);if(i){let o=i.bu.indexOf(e);o>=0&&(i.bu.splice(o,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function _A(n,e){let t=me(n),r=!1;for(let s of e){let i=s.query,o=t.queries.get(i);if(o){for(let c of o.bu)c.Cu(s)&&(r=!0);o.wu=s}}r&&gf(t)}function wA(n,e,t){let r=me(n),s=r.queries.get(e);if(s)for(let i of s.bu)i.onError(t);r.queries.delete(e)}function gf(n){n.Du.forEach((e=>{e.next()}))}var Vd;(function(n){n.Default="default",n.Cache="cache"})(Vd||(Vd={}));var Fo=class{constructor(e,t,r){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=r||{}}Cu(e){if(!this.options.includeMetadataChanges){let r=[];for(let s of e.docChanges)s.type!==3&&r.push(s);e=new ti(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;let r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;let t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=ti.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==Vd.Cache}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $c=class{constructor(e){this.key=e}},Yc=class{constructor(e){this.key=e}},Md=class{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=_e(),this.mutatedKeys=_e(),this.Ju=Xe(e)?dd(e):Xd(e),this.Yu=new ko(this.Ju)}get Zu(){return this.zu}Xu(e,t){let r=t?t.ec:new Qc,s=t?t.Yu:this.Yu,i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1,[u,l]=this.tc(this.query,s);e.inorderTraversal(((f,g)=>{let v=s.get(f),R=oA(this.query,g)?g:null,b=!!v&&this.mutatedKeys.has(v.key),G=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations),U=!1;v&&R?v.data.isEqual(R.data)?b!==G&&(r.track({type:3,doc:R}),U=!0):this.nc(v,R)||(r.track({type:2,doc:R}),U=!0,(u&&this.Ju(R,u)>0||l&&this.Ju(R,l)<0)&&(c=!0)):!v&&R?(r.track({type:0,doc:R}),U=!0):v&&!R&&(r.track({type:1,doc:v}),U=!0,(u||l)&&(c=!0)),U&&(R?(o=o.add(R),i=G?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}));let h=this.rc(this.query);if(h)if(Xe(this.query)){let f=[];o.forEach((R=>f.push(R)));let g=$E(this.query,f),v=new ko(dd(this.query));for(let R of g)v=v.add(R);o.forEach((R=>{v.has(R.key)||(i=i.delete(R.key),r.track({type:1,doc:R}))})),o=v}else{let f=this.sc(this.query);for(;o.size>h;){let g=f==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),r.track({type:1,doc:g})}}return{Yu:o,ec:r,Oo:c,mutatedKeys:i}}rc(e){return Xe(e)?iB(e)?.limit:e.limit||void 0}sc(e){if(Xe(e)){let t=iB(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){if(Xe(e)){let r=iB(e)?.limit;return[t.size===r?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){let i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;let o=e.ec.yu();o.sort(((h,f)=>(function(v,R){let b=G=>{switch(G){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Z(20277,{we:G})}};return b(v)-b(R)})(h.type,f.type)||this.Ju(h.doc,f.doc))),this._c(r),s=s??!1;let c=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,l=u!==this.ju;return this.ju=u,o.length!==0||l?{snapshot:new ti(this.query,e.Yu,i,o,e.mutatedKeys,u===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),ac:c}:{ac:c}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new Qc,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];let e=this.Hu;this.Hu=_e(),this.Yu.forEach((r=>{this.uc(r.key)&&(this.Hu=this.Hu.add(r.key))}));let t=[];return e.forEach((r=>{this.Hu.has(r)||t.push(new Yc(r))})),this.Hu.forEach((r=>{e.has(r)||t.push(new $c(r))})),t}cc(e){this.zu=e.Wo,this.Hu=_e();let t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return ti.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}},Cf="SyncEngine",Gd=class{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}},Ud=class{constructor(e){this.key=e,this.Ec=!1}},Hd=class{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hc={},this.Tc=new Hn((c=>OE(c)),Bu),this.Pc=new Map,this.Ic=new Set,this.Rc=new He(ee.comparator),this.Ac=new Map,this.Vc=new No,this.dc={},this.fc=new Map,this.mc=as.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}};async function yA(n,e,t=!0){let r=a_(n),s,i=r.Tc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await r_(r,e,t,!0),s}async function DA(n,e){let t=a_(n);await r_(t,e,!0,!1)}async function r_(n,e,t,r){let s=await dA(n.localStore,Xe(e)?e:En(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t),c;return r&&(c=await IA(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&ZE(n.remoteStore,s),c}async function IA(n,e,t,r,s){n.yc=(f,g,v)=>(async function(b,G,U,ae){let ve=G.view.Xu(U);ve.Oo&&(ve=await Cm(b.localStore,G.query,!1).then((({documents:A})=>G.view.Xu(A,ve))));let we=ae&&ae.targetChanges.get(G.targetId),Ve=ae&&ae.targetMismatches.get(G.targetId)!=null,be=G.view.applyChanges(ve,b.isPrimaryClient,we,Ve);return ym(b,G.targetId,be.ac),be.snapshot})(n,f,g,v);let i=await Cm(n.localStore,e,!0),o=new Md(e,i.Wo),c=o.Xu(i.documents),u=mo.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),l=o.applyChanges(c,n.isPrimaryClient,u);ym(n,t,l.ac);let h=new Gd(e,t,o);return n.Tc.set(e,h),n.Pc.has(t)?n.Pc.get(t).push(e):n.Pc.set(t,[e]),l.snapshot}async function TA(n,e,t){let r=me(n),s=r.Tc.get(e),i=r.Pc.get(s.targetId);if(i.length>1)return r.Pc.set(s.targetId,i.filter((o=>!Bu(o,e)))),void r.Tc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Rd(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&lf(r.remoteStore,s.targetId),qd(r,s.targetId)})).catch(au)):(qd(r,s.targetId),await Rd(r.localStore,s.targetId,!0))}async function AA(n,e){let t=me(n),r=t.Tc.get(e),s=t.Pc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),lf(t.remoteStore,r.targetId))}async function s_(n,e){let t=me(n);try{let r=await BA(t.localStore,e);e.targetChanges.forEach(((s,i)=>{let o=t.Ac.get(i);o&&(te(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Ec=!0:s.modifiedDocuments.size>0?te(o.Ec,14607):s.removedDocuments.size>0&&(te(o.Ec,42227),o.Ec=!1))})),await o_(t,r,e)}catch(r){await au(r)}}function wm(n,e,t){let r=me(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let s=[];r.Tc.forEach(((i,o)=>{let c=o.view.xu(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){let u=me(o);u.onlineState=c;let l=!1;u.queries.forEach(((h,f)=>{for(let g of f.bu)g.xu(c)&&(l=!0)})),l&&gf(u)})(r.eventManager,e),s.length&&r.hc.Tn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function vA(n,e,t){let r=me(n);r.sharedClientState.updateQueryState(e,"rejected",t);let s=r.Ac.get(e),i=s&&s.key;if(i){let o=new He(ee.comparator);o=o.insert(i,Mt.newNoDocument(i,Be.min()));let c=_e().add(i),u=new Co(Be.min(),new Map,new He(Ce),o,xt(),c);await s_(r,u),r.Rc=r.Rc.remove(i),r.Ac.delete(e),mf(r)}else await Rd(r.localStore,e,!1).then((()=>qd(r,e,t))).catch(au)}function qd(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(let r of n.Pc.get(e))n.Tc.delete(r),t&&n.hc.wc(r,t);n.Pc.delete(e),n.isPrimaryClient&&n.Vc.e_(e).forEach((r=>{n.Vc.containsKey(r)||i_(n,r)}))}function i_(n,e){n.Ic.delete(e.path.canonicalString());let t=n.Rc.get(e);t!==null&&(lf(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ac.delete(t),mf(n))}function ym(n,e,t){for(let r of t)r instanceof $c?(n.Vc.addReference(r.key,e),bA(n,r)):r instanceof Yc?(z(Cf,"Document no longer in limbo: "+r.key),n.Vc.removeReference(r.key,e),n.Vc.containsKey(r.key)||i_(n,r.key)):Z(19791,{bc:r})}function bA(n,e){let t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Ic.has(r)||(z(Cf,"New document in limbo: "+t),n.Ic.add(r),mf(n))}function mf(n){for(;n.Ic.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){let e=n.Ic.values().next().value;n.Ic.delete(e);let t=new ee(Te.fromString(e)),r=n.mc.next();n.Ac.set(r,new Ud(t)),n.Rc=n.Rc.insert(t,r),ZE(n.remoteStore,new ei(En(jo(t.path)),r,"TargetPurposeLimboResolution",Ws.wn))}}async function o_(n,e,t){let r=me(n),s=[],i=[],o=[];r.Tc.isEmpty()||(r.Tc.forEach(((c,u)=>{o.push(r.yc(u,e,t).then((l=>{if((l||t)&&r.isPrimaryClient){let h=l?!l.fromCache:t?.targetChanges.get(u.targetId)?.current;r.sharedClientState.updateQueryState(u.targetId,h?"current":"not-current")}if(l){s.push(l);let h=Ad.mo(u.targetId,l);i.push(h)}})))})),await Promise.all(o),r.hc.Tn(s),await(async function(u,l){let h=me(u);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(f=>H.forEach(l,(g=>H.forEach(g.Vo,(v=>h.persistence.referenceDelegate.addReference(f,g.targetId,v))).next((()=>H.forEach(g.fo,(v=>h.persistence.referenceDelegate.removeReference(f,g.targetId,v)))))))))}catch(f){if(!si(f))throw f;z(uf,"Failed to update sequence numbers: "+f)}for(let f of l){let g=f.targetId;if(!f.fromCache){let v=h.Lo.get(g),R=v.snapshotVersion,b=v.withLastLimboFreeSnapshotVersion(R);h.Lo=h.Lo.insert(g,b)}}})(r.localStore,i))}async function SA(n,e){let t=me(n);if(!t.currentUser.isEqual(e)){z(Cf,"User change. New user:",e.toKey());let r=await YE(t.localStore,e);t.currentUser=e,(function(i,o){i.fc.forEach((c=>{c.forEach((u=>{u.reject(new q(O.CANCELLED,o))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await o_(t,r.$o)}}function RA(n,e){let t=me(n),r=t.Ac.get(e);if(r&&r.Ec)return _e().add(r.key);{let s=_e(),i=t.Pc.get(e);if(!i)return s;for(let o of i??[]){let c=t.Tc.get(o);s=s.unionWith(c.view.Zu)}return s}}function a_(n){let e=me(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=s_.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=RA.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=vA.bind(null,e),e.hc.Tn=_A.bind(null,e.eventManager),e.hc.wc=wA.bind(null,e.eventManager),e}var cs=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=iu(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return lA(this.persistence,new bd,e.initialUser,this.serializer)}Dc(e){return new Jc(Td.b_,this.serializer)}vc(e){return new Fd}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};cs.provider={build:()=>new cs};var xo=class extends cs{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){te(this.persistence.referenceDelegate instanceof zc,46915);let r=this.persistence.referenceDelegate.garbageCollector;return new UB(r,e.asyncQueue,t)}Dc(e){let t=this.cacheSizeBytes!==void 0?Kt.withCacheSize(this.cacheSizeBytes):Kt.DEFAULT;return new Jc((r=>zc.b_(r,t)),this.serializer)}};var us=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>wm(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=SA.bind(null,this.syncEngine),await EA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Ld})()}createDatastore(e){let t=iu(e.databaseInfo.databaseId),r=DT(e.databaseInfo);return IT(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,c){return new Nd(r,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>wm(this.syncEngine,t,0)),(function(){return Sc.Ye()?new Sc:new PB})())}createSyncEngine(e,t){return(function(s,i,o,c,u,l,h){let f=new Hd(s,i,o,c,u,l);return h&&(f.gc=!0),f})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){let r=me(t);z(zn,"RemoteStore shutting down."),r.la.add(5),await Ko(r),r.ha.shutdown(),r.Ta.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}};us.provider={build:()=>new us};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jd=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new q(O.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await(async function(s,i){let o=me(s),c={documents:i.map((f=>Eo(o.serializer,f)))},u=await o._t("BatchGetDocuments",o.serializer.databaseId,Te.emptyPath(),c,i.length),l=new Map;u.forEach((f=>{let g=lT(o.serializer,f);l.set(g.key.toString(),g)}));let h=[];return i.forEach((f=>{let g=l.get(f.toString());te(!!g,55234,{key:f}),h.push(g)})),h})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new zs(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{let s=ee.fromPath(r);this.mutations.push(new mc(s,this.precondition(s)))})),await(async function(r,s){let i=me(r),o={writes:s.map((c=>hT(i.serializer,c)))};await i.nt("Commit",i.serializer.databaseId,Te.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Z(50498,{Mc:e.constructor.name});t=Be.min()}let r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new q(O.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Be.min())?en.exists(!1):en.updateTime(t):en.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Be.min()))throw new q(O.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return en.updateTime(t)}return en.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Kd=class{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Nc=r.maxAttempts,this.Ht=new wo(this.asyncQueue,"transaction_retry")}Lc(){this.Nc-=1,this.Bc()}Bc(){this.Ht.kt((async()=>{let e=new jd(this.datastore),t=this.Uc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.kc(s)}))))})).catch((r=>{this.kc(r)}))}))}Uc(e){try{let t=this.updateFunction(e);return!Ho(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}kc(e){this.Nc>0&&this.qc(e)?(this.Nc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Bc(),Promise.resolve())))):this.deferred.reject(e)}qc(e){if(e?.name==="FirebaseError"){let t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!YI(t)}return!1}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Dr="FirestoreClient",Jd=class{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=it.UNAUTHENTICATED,this.clientId=xs.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{z(Dr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(z(Dr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new rn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){let r=n_(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}};async function aB(n,e){n.asyncQueue.verifyOperationInProgress(),z(Dr,"Initializing OfflineComponentProvider");let t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await YE(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Dm(n,e){n.asyncQueue.verifyOperationInProgress();let t=await PA(n);z(Dr,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Em(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Em(e.remoteStore,s))),n._onlineComponents=e}async function PA(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z(Dr,"Using user provided OfflineComponentProvider");try{await aB(n,n._uninitializedComponentsProvider._offline)}catch(e){let t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===O.FAILED_PRECONDITION||s.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;zt("Error using user provided cache. Falling back to memory cache: "+t),await aB(n,new cs)}}else z(Dr,"Using default OfflineComponentProvider"),await aB(n,new xo(void 0));return n._offlineComponents}async function c_(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z(Dr,"Using user provided OnlineComponentProvider"),await Dm(n,n._uninitializedComponentsProvider._online)):(z(Dr,"Using default OnlineComponentProvider"),await Dm(n,new us))),n._onlineComponents}function NA(n){return c_(n).then((e=>e.datastore))}async function Xc(n){let e=await c_(n),t=e.eventManager;return t.onListen=yA.bind(null,e.syncEngine),t.onUnlisten=TA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=DA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=AA.bind(null,e.syncEngine),t}function u_(n,e,t,r){let s=new Oo(r),i=new Fo(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>ff(await Xc(n),i))),()=>{s.Va(),n.asyncQueue.enqueueAndForget((async()=>pf(await Xc(n),i)))}}function l_(n,e,t={}){let r=new rn;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new Oo({next:g=>{h.Va(),o.enqueueAndForget((()=>pf(i,f)));let v=g.docs.has(c);!v&&g.fromCache?l.reject(new q(O.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&g.fromCache&&u&&u.source==="server"?l.reject(new q(O.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new Fo(jo(c.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return ff(i,f)})(await Xc(n),n.asyncQueue,e,t,r))),r.promise}function B_(n,e,t={}){let r=new rn;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new Oo({next:g=>{h.Va(),o.enqueueAndForget((()=>pf(i,f))),g.fromCache&&u.source==="server"?l.reject(new q(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new Fo(c instanceof XB?JT(c):c,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return ff(i,f)})(await Xc(n),n.asyncQueue,e,t,r))),r.promise}function h_(n,e,t){let r=new rn;return n.asyncQueue.enqueueAndForget((async()=>{let s=await NA(n);new Kd(n.asyncQueue,s,t,e,r).Lc()})),r.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oi=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new We(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new OA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){let t=this._document.data.field(qn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},OA=class extends oi{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Lo=class{convertValue(e,t="none"){switch($e(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Vn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Z(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return Bs(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){let t=e.fields?.[Yr].arrayValue?.values?.map((r=>Oe(r.doubleValue)));return new Vt(t)}convertGeoPoint(e){return new Nn(Oe(e.latitude),Oe(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":let r=Uo(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Vs(e));default:return null}}convertTimestamp(e){let t=Ln(e);return new Ue(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=Te.fromString(e);te(lE(r),9688,{name:e});let s=new lo(r.get(1),r.get(3)),i=new ee(r.popFirst(5));return s.isEqual(t)||xn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d_(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var Zc=class extends Lo{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new We(this.firestore,null,t)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Im="AsyncQueue",eu=class{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new wo(this,"async_queue_retry"),this.Hc=()=>{let r=oB();r&&z(Im,"Visibility state changed to "+r.visibilityState),this.Ht.$t()},this.Jc=e;let t=oB();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;let t=oB();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));let t=new rn;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!si(e))throw e;z(Im,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){let t=this.Jc.then((()=>(this.Gc=!0,e().catch((r=>{throw this.Wc=r,this.Gc=!1,xn("INTERNAL UNHANDLED ERROR: ",Tm(r)),r})).then((r=>(this.Gc=!1,r))))));return this.Jc=t,t}enqueueAfterDelay(e,t,r){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);let s=kd.createAndSchedule(this,e,t,r,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&Z(47125,{tl:Tm(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(let t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(let t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){let t=this.Qc.indexOf(e);this.Qc.splice(t,1)}};function Tm(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wn=class extends cu{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new eu,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new eu(e),this._firestoreClient=void 0,await e}}};function Ef(n,e,t){t||(t=uo);let r=Si(n,"firestore");if(r.isInitialized(t)){let s=r.getImmediate({identifier:t}),i=r.getOptions(t);if(hn(i,e))return s;throw new q(O.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new q(O.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pE)throw new q(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Rr(e.host)&&fa(e.host),r.initialize({options:e,instanceIdentifier:t})}function _f(n,e){let t=typeof n=="object"?n:ol(),r=typeof n=="string"?n:e||uo,s=Si(t,"firestore").getImmediate({identifier:r});if(!s._initialized){let i=Vp("firestore");i&&CE(s,...i)}return s}function zo(n){if(n._terminated)throw new q(O.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||kA(n),n._firestoreClient}function kA(n){let e=n._freezeSettings(),t=AT(n._databaseId,n._app?.options.appId||"",n._persistenceKey,n._app?.options.apiKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new Jd(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){let i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ls=class extends Lo{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new We(this.firestore,null,t)}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Rn=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},Fn=class n extends oi{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new Qr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field(qn("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new q(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=n._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}};Fn._jsonSchemaVersion="firestore/documentSnapshot/1.0",Fn._jsonSchema={type:ze("string",Fn._jsonSchemaVersion),bundleSource:ze("string","DocumentSnapshot"),bundleName:ze("string"),bundle:ze("string")};var Qr=class extends Fn{data(e={}){return super.data(e)}},fr=class n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Rn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){let e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Qr(this._firestore,this._userDataWriter,r.key,r,new Rn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new q(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{Xe(s._snapshot.query)?dd(s._snapshot.query):Xd(s.query._query);let u=new Qr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Rn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{let u=new Qr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Rn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter),l=-1,h=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),h=o.indexOf(c.doc.key)),{type:FA(c.type),doc:u,oldIndex:l,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new q(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=xs.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}};function FA(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Z(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fr._jsonSchemaVersion="firestore/querySnapshot/1.0",fr._jsonSchema={type:ze("string",fr._jsonSchemaVersion),bundleSource:ze("string","QuerySnapshot"),bundleName:ze("string"),bundle:ze("string")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xA(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new q(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}var Qo=class{},ai=class extends Qo{};function $o(n,e,...t){let r=[];e instanceof Qo&&r.push(e),r=r.concat(t),(function(i){let o=i.filter((u=>u instanceof wf)).length,c=i.filter((u=>u instanceof fu)).length;if(o>1||o>0&&c>0)throw new q(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(let s of r)n=s._apply(n);return n}var fu=class n extends ai{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=this._parse(e);return y_(e._query,t),new sn(e.firestore,e.converter,ru(e._query,t))}_parse(e){let t=uu(e.firestore);return(function(i,o,c,u,l,h,f){let g;if(l.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new q(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){p_(f,h);let R=[];for(let b of f)R.push(f_(u,i,b));g={arrayValue:{values:R}}}else g=f_(u,i,f)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||p_(f,h),g=tf(c,o,f,h==="in"||h==="not-in");return je.create(l,h,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}};function pu(n,e,t){let r=e,s=qn("where",n);return fu._create(s,r,t)}var wf=class n extends Qo{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new n(e,t)}_parse(e){let t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Qt.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s,c=i.getFlattenedFilters();for(let u of c)y_(o,u),o=ru(o,u)})(e._query,t),new sn(e.firestore,e.converter,ru(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}};var yf=class n extends ai{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new n(e,t)}_apply(e){let t=(function(s,i,o){if(s.startAt!==null)throw new q(O.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new q(O.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new gr(i,o)})(e._query,this._field,this._direction);return new sn(e.firestore,e.converter,Zm(e._query,t))}};function E_(n,e="asc"){let t=e,r=qn("orderBy",n);return yf._create(r,t)}var Df=class n extends ai{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new n(e,t,r)}_apply(e){return new sn(e.firestore,e.converter,go(e._query,this._limit,this._limitType))}};function __(n){return Nm("limit",n),Df._create("limit",n,"F")}var If=class n extends ai{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=LA(e,this.type,this._docOrFields,this._inclusive);return new sn(e.firestore,e.converter,eE(e._query,t))}};function w_(...n){return If._create("startAfter",n,!1)}function LA(n,e,t,r){if(t[0]=Ge(t[0]),t[0]instanceof oi)return(function(i,o,c,u,l){if(!u)throw new q(O.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);let h=[];for(let f of Wr(i))if(f.field.isKeyField())h.push(qo(o,u.key));else{let g=u.data.field(f.field);if(ri(g))throw new q(O.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+f.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){let v=f.field.canonicalString();throw new q(O.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${v}' (used as the orderBy) does not exist.`)}h.push(g)}return new Gn(h,l)})(n._query,n.firestore._databaseId,e,t[0]._document,r);{let s=uu(n.firestore);return(function(o,c,u,l,h,f){let g=o.explicitOrderBy;if(h.length>g.length)throw new q(O.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);let v=[];for(let R=0;R<h.length;R++){let b=h[R];if(g[R].field.isKeyField()){if(typeof b!="string")throw new q(O.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof b}`);if(!nu(o)&&b.indexOf("/")!==-1)throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${b}' contains a slash.`);let G=o.path.child(Te.fromString(b));if(!ee.isDocumentKey(G))throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${G}' is not because it contains an odd number of segments.`);let U=new ee(G);v.push(qo(c,U))}else{let G=tf(u,l,b);v.push(G)}}return new Gn(v,f)})(n._query,n.firestore._databaseId,s,e,t,r)}}function f_(n,e,t){if(typeof(t=Ge(t))=="string"){if(t==="")throw new q(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!nu(e)&&t.indexOf("/")!==-1)throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);let r=e.path.child(Te.fromString(t));if(!ee.isDocumentKey(r))throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return qo(n,new ee(r))}if(t instanceof We)return qo(n,t._key);throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Mo(t)}.`)}function p_(n,e){if(!Array.isArray(n)||n.length===0)throw new q(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function y_(n,e){let t=(function(s,i){for(let o of s)for(let c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new q(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g_(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;let s=t;for(let i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}var Tf=class{constructor(e){this.kind="memory",this._onlineComponentProvider=us.provider,this._offlineComponentProvider=e?.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new xo(void 0)}}toJSON(){return{kind:this.kind}}};function D_(n){return new Tf(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var VA={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(n,e){if((n=Ge(n)).firestore!==e)throw new q(O.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var MA=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=uu(e)}get(e){let t=Wo(e,this._firestore),r=new Zc(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return Z(24041);let i=s[0];if(i.isFoundDocument())return new oi(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new oi(this._firestore,r,t._key,null,t.converter);throw Z(18433,{doc:i})}))}set(e,t,r){let s=Wo(e,this._firestore),i=d_(s.converter,t,r),o=EE(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,o),this}update(e,t,r,...s){let i=Wo(e,this._firestore),o;return o=typeof(t=Ge(t))=="string"||t instanceof ss?wE(this._dataReader,"Transaction.update",i._key,t,r,s):_E(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){let t=Wo(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Af=class extends MA{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=Wo(e,this._firestore),r=new ls(this._firestore);return super.get(e).then((s=>new Fn(this._firestore,r,t._key,s._document,new Rn(!1,!1),t.converter)))}};function Ir(n,e,t){n=wn(n,Wn);let r={...VA,...t};(function(o){if(o.maxAttempts<1)throw new q(O.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);let s=zo(n);return h_(s,(i=>e(new Af(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(n){n=wn(n,We);let e=wn(n.firestore,Wn),t=zo(e);return l_(t,n._key,{source:"server"}).then((r=>I_(e,n,r)))}function gu(n){n=wn(n,sn);let e=wn(n.firestore,Wn),t=zo(e),r=new ls(e);return B_(t,n._query,{source:"server"}).then((s=>new fr(e,r,n,s)))}function vf(n,...e){n=Ge(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||g_(e[r])||(t=e[r++]);let s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(g_(e[r])){let l=e[r];e[r]=l.next?.bind(l),e[r+1]=l.error?.bind(l),e[r+2]=l.complete?.bind(l)}let i,o,c;if(n instanceof We)o=wn(n.firestore,Wn),c=jo(n._key.path),i={next:l=>{e[r]&&e[r](I_(o,n,l))},error:e[r+1],complete:e[r+2]};else{let l=wn(n,sn);o=wn(l.firestore,Wn),c=l._query;let h=new ls(o);i={next:f=>{e[r]&&e[r](new fr(o,h,l,f))},error:e[r+1],complete:e[r+2]},xA(n._query)}let u=zo(o);return u_(u,c,s,i)}function I_(n,e,t){let r=t.docs.get(e._key),s=new ls(n);return new Fn(n,s,e._key,r,new Rn(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var C_="@firebase/firestore",m_="4.17.2";(function(e,t=!0){Am(or),ir(new Ut("firestore",((r,{instanceIdentifier:s,options:i})=>{let o=r.getProvider("app").getImmediate(),c=new Wn(new Ac(r.getProvider("auth-internal")),new bc(o,r.getProvider("app-check-internal")),Lm(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Yt(C_,m_,e),Yt(C_,m_,"esm2020")})();var GA="firebase",UA="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Yt(GA,UA,"app");var Yo=Object.freeze({apiKey:"AIzaSyBvuAItyaaRKBywT11NJ2g9Tp4EjVGTc_M",authDomain:"atlas-ahmedsaeed4-2026.firebaseapp.com",projectId:"atlas-ahmedsaeed4-2026",appId:"1:790536067689:web:6833eb2e60f14f77e1a0f8",messagingSenderId:"790536067689"}),HA=Object.freeze(["apiKey","authDomain","projectId","appId","messagingSenderId"]);function bf(n=Yo){return!!n&&typeof n=="object"&&HA.every(e=>typeof n[e]=="string"&&n[e].trim())}function Sf(n=Yo){return bf(n)?Object.freeze({enabled:!0,projectId:n.projectId}):Object.freeze({enabled:!1,reason:"Online workspaces are unavailable because Firebase web configuration is missing."})}function Cu(n,e,t=()=>{}){let r=!1,s=()=>{};return Promise.resolve(n).then(()=>{if(r)return;let i=e();r?i?.():typeof i=="function"&&(s=i)}).catch(i=>{r||t(i)}),()=>{r=!0,s()}}async function T_({auth:n,persistenceReady:e,uid:t=""}){if(await e,!t)return;let r=n?.currentUser;if(!r?.uid||r.uid!==t)throw Object.assign(new Error("The Firebase account changed before the online request started. Retry from the current account."),{code:"unauthenticated"});if(await r.getIdToken(),n?.currentUser?.uid!==t)throw Object.assign(new Error("The Firebase account changed while its access token was refreshing. Retry from the current account."),{code:"unauthenticated"})}var wt=Object.freeze({nodes:800,edges:2400,text:12e3,chartPoints:32,chartMagnitude:1e12,detailItems:8,detailText:240}),an=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},Le=(...n)=>n.find(e=>e!=null),qe=(n,e,t=wt.text,{required:r=!1}={})=>{if(n==null){if(r)throw new Error(e+" is required.");return""}if(typeof n!="string"&&typeof n!="number")throw new Error(e+" must be text.");let s=String(n).trim();if(r&&!s)throw new Error(e+" is required.");if(s.length>t)throw new Error(e+" must be "+t+" characters or fewer.");return s},ci=(n,e,t=wt.detailItems,r=wt.detailText)=>{if(n==null)return[];if(!Array.isArray(n))throw new Error(e+" must be a list of text values.");if(n.length>t)throw new Error(e+" must contain "+t+" items or fewer.");return n.map((s,i)=>qe(s,e+" item "+(i+1),r,{required:!0}))},A_=(n,e)=>n+"-"+String(e+1).padStart(3,"0");function Rf(n,e={}){let t=n;if(typeof n=="string"){if(new TextEncoder().encode(n).byteLength>2097152)throw new Error("This JSON file is larger than the 2 MB import limit.");try{t=JSON.parse(n)}catch(v){throw new Error("That is not valid JSON: "+v.message)}}if(t=an(t),!Object.keys(t).length)throw new Error("The JSON must contain a project, nodes, and edges.");let r=an(t.graph),s=an(Le(t.project,t.metadata,t.meta,r.project,{})),i=Le(t.nodes,t.components,r.nodes),o=Le(t.edges,t.connections,t.relationships,r.edges,r.links,[]);if(!Array.isArray(i))throw new Error("The map needs a nodes array (or components array).");if(!Array.isArray(o))throw new Error("The map needs an edges array (or connections array).");if(i.length>wt.nodes)throw new Error("This map has "+i.length+" components; the limit is "+wt.nodes+".");if(o.length>wt.edges)throw new Error("This map has "+o.length+" connections; the limit is "+wt.edges+".");if(i.length===0&&!e.allowEmpty)throw new Error("Add at least one component before importing this map.");let c=i.map((v,R)=>{let b=an(v),G=qe(Le(b.id,b.key,b.slug,A_("node",R)),"Component "+(R+1)+" ID",160,{required:!0}),U=qe(Le(b.label,b.name,b.title,b.id),"Component "+G+" name",120,{required:!0}),ae=qe(Le(b.type,b.kind,b.category,b.componentType,"Component"),"Component "+U+" type",60,{required:!0}),ve=typeof b.sourceRef=="string"||typeof b.sourceRef=="number"?b.sourceRef:Le(an(b.sourceRef).path,an(b.sourceRef).file,an(b.sourceRef).uri,an(b.sourceRef).ref),we={id:G,label:U,type:ae,description:qe(Le(b.description,b.detail,b.sub,b.summary,b.purpose),"Component "+U+" description",1e3),source:qe(Le(b.source,b.path,b.file,b.location,ve),"Component "+U+" source",240),group:qe(Le(b.group,b.domain,b.boundary),"Component "+U+" group",100)};if(b.junction!==void 0&&typeof b.junction!="boolean")throw new Error("Component "+U+" junction marker must be true or false.");if(b.junction===!0){if(ae.toLowerCase()!=="junction")throw new Error("A junction marker requires component type Junction.");we.junction=!0}if(b.details!==void 0&&b.details!==null){if(!b.details||typeof b.details!="object"||Array.isArray(b.details))throw new Error("Details for "+U+" must be an object.");let m=b.details,y={purpose:qe(m.purpose,"Component "+U+" purpose",500),operation:qe(m.operation,"Component "+U+" operation",1e3),inputs:ci(m.inputs,"Component "+U+" inputs"),outputs:ci(m.outputs,"Component "+U+" outputs"),dependencies:ci(m.dependencies,"Component "+U+" dependencies"),evidence:ci(m.evidence,"Component "+U+" evidence"),uncertainty:ci(m.uncertainty,"Component "+U+" uncertainty")};(y.purpose||y.operation||Object.values(y).some(I=>Array.isArray(I)&&I.length))&&(we.details=y)}if(b.chart!==void 0&&b.chart!==null){let m=an(b.chart),y=qe(m.label,"Chart for "+U+" label",80,{required:!0}),I=qe(m.kind,"Chart for "+U+" kind",8,{required:!0});if(!["bar","line","area"].includes(I))throw new Error("Chart for "+U+" kind must be bar, line, or area.");if(!Array.isArray(m.values)||m.values.length<2||m.values.length>wt.chartPoints)throw new Error("Chart for "+U+" values must contain 2 to "+wt.chartPoints+" points.");let D=m.values.map((pe,Ae)=>{if(typeof pe!="number"||!Number.isFinite(pe)||Math.abs(pe)>wt.chartMagnitude)throw new Error("Chart for "+U+" point "+(Ae+1)+" must be a finite number within "+wt.chartMagnitude+".");return pe}),w=qe(m.evidence,"Chart for "+U+" evidence",240,{required:!0}),C=qe(Le(m.unit,""),"Chart for "+U+" unit",24),re=m.categories===void 0||m.categories===null?[]:ci(m.categories,"Chart for "+U+" categories",wt.chartPoints,80),le=qe(m.order,"Chart for "+U+" order",160);if(I==="bar"&&re.length!==D.length)throw new Error("Bar chart for "+U+" needs one category label for each value.");if((I==="line"||I==="area")&&re.length&&re.length!==D.length)throw new Error("Chart for "+U+" needs one category label for each value.");if((I==="line"||I==="area")&&!!re.length!=!!le)throw new Error("Ordered chart for "+U+" needs both category labels and an order explanation.");we.chart={label:y,kind:I,values:D,evidence:w},C&&(we.chart.unit=C),re.length&&(we.chart.categories=re),le&&(we.chart.order=le)}let Ve=an(Le(b.position,b.pos,{})),be=Number(Le(Ve.x,b.x)),A=Number(Le(Ve.y,b.y));return Number.isFinite(be)&&Number.isFinite(A)&&Math.abs(be)<1e5&&Math.abs(A)<1e5&&(we.position={x:be,y:A}),we}),u=new Set;for(let v of c){if(u.has(v.id))throw new Error('Duplicate component ID: "'+v.id+'". Each component needs a unique ID.');u.add(v.id)}let l=new Set,h=o.map((v,R)=>{let b=an(v),G=qe(Le(b.source,b.from,b.sourceId,b.fromId),"Connection "+(R+1)+" source",160,{required:!0}),U=qe(Le(b.target,b.to,b.targetId,b.toId),"Connection "+(R+1)+" target",160,{required:!0});if(!u.has(G))throw new Error("Connection "+(R+1)+' refers to missing component "'+G+'".');if(!u.has(U))throw new Error("Connection "+(R+1)+' refers to missing component "'+U+'".');let ae=qe(Le(b.id,b.key,A_("edge",R)),"Connection "+(R+1)+" ID",160,{required:!0});if(l.has(ae))throw new Error('Duplicate connection ID: "'+ae+'". Each connection needs a unique ID.');return l.add(ae),{id:ae,source:G,target:U,label:qe(Le(b.label,b.name,b.relationship),"Connection "+ae+" label",100),type:qe(Le(b.type,b.kind),"Connection "+ae+" type",60)}}),f={name:qe(Le(s.name,s.title,t.projectName,"Imported architecture"),"Project name",120,{required:!0}),description:qe(Le(s.description,s.tagline,s.summary,t.description),"Project description",500),type:qe(Le(s.type,s.category,s.kind,t.projectType,"Software project"),"Project type",60)},g=Number(Le(t.schemaVersion,t.version,1));if(!Number.isInteger(g)||g!==1)throw new Error("Schema version "+String(Le(t.schemaVersion,t.version))+" is not supported. This viewer accepts version 1.");return{schemaVersion:g,project:f,nodes:c,edges:h}}function v_(n,e=2){return JSON.stringify({schemaVersion:1,project:n.project,nodes:n.nodes,edges:n.edges},null,e)}var ft=Object.freeze({maxGraphBytes:2097152,maxChunkBytes:288*1024,maxChunkCount:8,workspaceIdBytes:16,maxWorkspaceName:120,maxProjectType:60,maxNodes:wt.nodes,maxEdges:wt.edges}),Nf=new TextEncoder,Pf=/^[A-Za-z0-9_-]{22}$/,ke=class extends Error{constructor(e,t="invalid-data",r={}){super(e,r),this.name="CloudModelError",this.code=t}};function cn(n){if(typeof n!="string"||!Pf.test(n))throw new ke("This online workspace link is invalid.","invalid-id");return n}function Of(n=globalThis.crypto){if(!n||typeof n.getRandomValues!="function")throw new ke("Secure random IDs are unavailable in this browser.","crypto-unavailable");let e=new Uint8Array(ft.workspaceIdBytes);n.getRandomValues(e);let t="";for(let s of e)t+=String.fromCharCode(s);let r=globalThis.btoa(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");return cn(r)}function jA(n,e=""){let t=n??e;if(typeof t!="string")throw new ke("Workspace name must be text.","invalid-name");let r=t.trim();if(!r)throw new ke("Workspace name is required.","invalid-name");if(r.length>ft.maxWorkspaceName)throw new ke("Workspace name must be "+ft.maxWorkspaceName+" characters or fewer.","invalid-name");return r}function KA(n,e){let t=[],r=[],s=0,i=()=>{r.length&&(t.push({text:r.join(""),byteLength:s}),r=[],s=0)};for(let o of n){let c=Nf.encode(o).byteLength;if(c>e)throw new ke("A text character exceeds the cloud chunk limit.","chunk-too-large");s+c>e&&i(),r.push(o),s+=c}return i(),t.length||t.push({text:"",byteLength:0}),t.map((o,c)=>({index:c,...o}))}function kf(n,{name:e}={}){let t;try{t=Rf(n,{allowEmpty:!0})}catch(o){throw new ke(o.message,"invalid-graph",{cause:o})}e!==void 0&&(t.project.name=jA(e,t.project.name));let r=v_(t,2),s=Nf.encode(r).byteLength;if(s>ft.maxGraphBytes)throw new ke("This graph exceeds Atlas's 2 MiB online workspace limit. Shorten optional details or reduce the map before saving.","graph-too-large");let i=KA(r,ft.maxChunkBytes);if(i.length>ft.maxChunkCount)throw new ke("This graph needs too many cloud chunks to save safely.","too-many-chunks");return Object.freeze({graph:t,json:r,byteLength:s,chunkCount:i.length,chunks:Object.freeze(i.map(o=>Object.freeze(o)))})}function Ff({chunks:n,chunkCount:e,byteLength:t}){if(!Number.isInteger(e)||e<1||e>ft.maxChunkCount)throw new ke("The online workspace has an invalid chunk count.","invalid-metadata");if(!Number.isInteger(t)||t<1||t>ft.maxGraphBytes)throw new ke("The online workspace has an invalid size.","invalid-metadata");if(!Array.isArray(n)||n.length!==e)throw new ke("The online workspace is missing one or more graph chunks.","missing-chunk");let r=0,s=[];for(let c=0;c<e;c+=1){let u=n[c];if(!u||u.index!==c||typeof u.text!="string")throw new ke("The online workspace graph chunks are out of order.","invalid-chunk");let l=Nf.encode(u.text).byteLength;if(l>ft.maxChunkBytes)throw new ke("The online workspace contains an oversized graph chunk.","chunk-too-large");if(r+=l,r>ft.maxGraphBytes)throw new ke("The online workspace graph exceeds the 2 MiB limit.","graph-too-large");s.push(u.text)}if(r!==t)throw new ke("The online workspace graph size does not match its metadata.","invalid-size");let i=s.join(""),o;try{o=Rf(i,{allowEmpty:!0})}catch(c){throw new ke("The online workspace contains an invalid graph: "+c.message,"invalid-graph",{cause:c})}return Object.freeze({graph:o,json:i,byteLength:r,chunkCount:e})}function yt(n,e){if(cn(n),!e||typeof e!="object"||Array.isArray(e))throw new ke("The online workspace metadata is invalid.","invalid-metadata");let t=(c,u,l=!0)=>typeof c=="string"&&c.length<=u&&(!l||c.trim().length>0),r=(c,u,l)=>Number.isInteger(c)&&c>=u&&c<=l;if(e.schemaVersion!==1||typeof e.ownerId!="string"||!e.ownerId||typeof e.shared!="boolean"||typeof e.deleting!="boolean"||!t(e.name,ft.maxWorkspaceName)||!t(e.projectType,ft.maxProjectType)||!t(e.currentRevision,22)||!Pf.test(e.currentRevision)||!(e.previousRevision===null||typeof e.previousRevision=="string"&&Pf.test(e.previousRevision))||!r(e.chunkCount,1,ft.maxChunkCount)||!r(e.byteLength,1,ft.maxGraphBytes)||!r(e.nodeCount,0,ft.maxNodes)||!r(e.edgeCount,0,ft.maxEdges))throw new ke("The online workspace metadata is invalid or outside Atlas limits.","invalid-metadata");let s=c=>{if(c&&typeof c.toDate=="function"){let u=c.toDate();return Number.isFinite(u.getTime())?u.toISOString():null}return c instanceof Date&&Number.isFinite(c.getTime())?c.toISOString():typeof c=="string"&&Number.isFinite(Date.parse(c))?new Date(c).toISOString():null},i=s(e.createdAt),o=s(e.updatedAt);if(!i||!o)throw new ke("The online workspace timestamps are invalid.","invalid-metadata");return Object.freeze({id:n,schemaVersion:e.schemaVersion,ownerId:e.ownerId,shared:e.shared,deleting:e.deleting,name:e.name,projectType:e.projectType,currentRevision:e.currentRevision,previousRevision:e.previousRevision,chunkCount:e.chunkCount,byteLength:e.byteLength,nodeCount:e.nodeCount,edgeCount:e.edgeCount,createdAt:i,updatedAt:o})}function b_(n,e=globalThis.location?.href){let t=cn(n);if(typeof e!="string"||!e)throw new ke("A browser URL is required to make a workspace link.","missing-base-url");let r;try{r=new URL("./workspace",e)}catch(s){throw new ke("The workspace link base URL is invalid.","invalid-base-url",{cause:s})}return r.search="",r.searchParams.set("view",t),r.hash="",r.href}var bt=class extends Error{constructor(e,t){super(e),this.name="CloudQuotaError",this.code=t,this.status="error"}};function mu(n){if(!n)return[];let e=n.workspaceIds;if(n.schemaVersion!==1||!Array.isArray(e)||e.some(t=>typeof t!="string"||!/^[A-Za-z0-9_-]{22}$/.test(t))||new Set(e).size!==e.length)throw new bt("Cloud Workspace usage could not be verified. Your maps are unchanged.","quota-invalid");return[...e]}function S_(n,e,t=20){let r=mu(n);if(r.includes(e))throw new bt("This workspace ID is already registered. Retry the original map rather than creating a duplicate.","workspace-id-collision");if(t!==null&&![20,30,40].includes(t))throw new bt("The workspace allowance could not be verified. Your maps are unchanged.","quota-invalid");if(t!==null&&r.length>=t)throw new bt(`You have reached the limit of ${t} Cloud Workspaces. Delete a Cloud Workspace to make room, or keep this map locally.`,"workspace-limit");return[...r,e]}function R_(n,e){let t=mu(n);if(!n||!t.includes(e))throw new bt("Cloud Workspace usage needs setup before this deletion can finish. Your stored map has not been removed.","quota-uninitialized");return t.filter(r=>r!==e)}var JA=20,P_=Object.freeze([20,30,40,null]);function ds(n){if(typeof n!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(n))throw new bt("The account identifier is invalid.","invalid-account");return n}function Eu(n){if(n==null)return JA;if(n.schemaVersion!==1||!P_.includes(n.maxWorkspaces))throw new bt("The workspace allowance could not be verified. Your maps are unchanged.","quota-invalid");return n.maxWorkspaces}function xf(n){if(!P_.includes(n))throw new bt("Choose 20, 30, 40, or unlimited workspaces.","invalid-limit");return n}function _u(n){return typeof n?.toDate=="function"?n.toDate().toISOString():typeof n=="string"?n:null}function N_(n,e){return ds(n),e?.email_verified!==!0||typeof e.email!="string"||!e.email||e.email.length>320||typeof e.name!="string"||e.name.length>200?null:Object.freeze({schemaVersion:1,uid:n,name:e.name,email:e.email})}var O_="atlas-online-workspaces",Xo="workspaces",ue=class extends Error{constructor(e,t="cloud-error",{status:r="error",cause:s}={}){super(e,s?{cause:s}:void 0),this.name="CloudServiceError",this.code=t,this.status=r}},wu=class extends ue{constructor(e,t){super("This workspace changed in another tab or device. Reload the online version before saving again.","conflict",{status:"conflict"}),this.name="CloudConflictError",this.expectedRevision=e,this.actualRevision=t}};function et(n){if(n instanceof ue)return n;if(n instanceof bt)return new ue(n.message,n.code,{cause:n});if(n instanceof ke)return new ue(n.message,n.code,{status:"invalid",cause:n});let e=typeof n?.code=="string"?n.code:"cloud-error";return e==="auth/popup-blocked"?new ue("Your browser blocked the Google sign-in popup. Allow popups for Atlas and try again.","popup-blocked",{status:"popup-blocked",cause:n}):e==="auth/popup-closed-by-user"||e==="auth/cancelled-popup-request"?new ue("Google sign-in was cancelled.","cancelled",{status:"cancelled",cause:n}):e==="permission-denied"||e==="storage/unauthorized"?new ue("You do not have permission to use this online workspace.","permission-denied",{status:"permission-denied",cause:n}):e==="not-found"||e==="auth/user-not-found"?new ue("This online workspace no longer exists.","not-found",{status:"not-found",cause:n}):e==="unauthenticated"||e==="auth/user-token-expired"?new ue("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated",cause:n}):["unavailable","deadline-exceeded","network-request-failed","auth/network-request-failed"].includes(e)?new ue("Atlas cannot reach the online workspace service. Check your connection and try again.","offline",{status:"offline",cause:n}):new ue(typeof n?.message=="string"&&n.message?n.message:"The online workspace request failed.",e,{status:"error",cause:n})}function zA(n){if(!n||typeof n.uid!="string"||!n.uid)return null;let e=t=>typeof t=="string"?t:"";return Object.freeze({uid:n.uid,displayName:e(n.displayName),email:e(n.email),photoURL:e(n.photoURL)})}function ui(n){return Object.freeze({id:n.id,ownerId:n.ownerId,name:n.name,projectType:n.projectType,nodeCount:n.nodeCount,edgeCount:n.edgeCount,shared:n.shared,deleting:n.deleting,currentRevision:n.currentRevision,createdAt:n.createdAt,updatedAt:n.updatedAt})}function WA(n,{app:e,auth:t,db:r,persistenceReady:s,workspaceIdFactory:i=Of,commitBatch:o,readWorkspaceFromServer:c}={}){let u=e;if(!u){if(u=cg().find(L=>L.name===O_),u&&u.options.projectId!==n.projectId)throw new ue("Atlas is already connected to a different Firebase project.","project-mismatch",{status:"configuration"});u||(u=il(n,O_))}let l=t||Ol(u,{persistence:[Vl,xl],popupRedirectResolver:Gl}),h=r;if(!h)try{h=Ef(u,{localCache:D_()})}catch(L){if(L?.code!=="failed-precondition"&&L?.code!=="already-initialized")throw L;h=_f(u)}let f=s??l.authStateReady(),g=L=>T_({auth:l,persistenceReady:f,uid:L}),v=typeof o=="function"?o:L=>L.commit(),R=typeof c=="function"?c:$n,b=L=>Qn(h,Xo,L),G=L=>Qn(h,"workspaceQuota",L),U=L=>Qn(h,"accountProfiles",ds(L)),ae=L=>Qn(h,"accountLimits",ds(L)),ve=()=>Qn(h,"system","adminAccess");async function we(L){await g(L);let M=await $n(ve());if(await g(L),!M.exists()||M.data().adminUid!==L)throw new ue("This page is only available to the administrator.","admin-required",{status:"permission-denied"})}async function Ve(L){if(typeof L?.getIdTokenResult!="function")return;let M=await L.getIdTokenResult(),se=N_(L.uid,M.claims);se&&(await g(L.uid),await Ir(h,async $=>{let ie=await $.get(U(L.uid)),Q=ie.exists()?ie.data():null;Q?.name===se.name&&Q?.email===se.email&&Q?.schemaVersion===1&&Q?.uid===L.uid||(await g(L.uid),$.set(U(L.uid),{...se,createdAt:Q?.createdAt||on(),updatedAt:on()}))}))}let be=(L,M)=>Qn(h,Xo,L,"revisions",M),A=(L,M)=>hs(be(L,M),"chunks"),m=(L,M,se)=>Qn(A(L,M),String(se)),y=new TextEncoder,I=L=>({index:L.index,payload:Jt.fromUint8Array(y.encode(L.text))}),D=()=>new Date().toISOString();function w({uid:L,encoded:M,revision:se,previousRevision:$,shared:ie,createdAt:Q}){let J=on();return{schemaVersion:1,ownerId:L,shared:ie,deleting:!1,name:M.graph.project.name,projectType:M.graph.project.type,currentRevision:se,previousRevision:$,chunkCount:M.chunkCount,byteLength:M.byteLength,nodeCount:M.graph.nodes.length,edgeCount:M.graph.edges.length,createdAt:Q||J,updatedAt:J}}function C(L,M,se=D()){return{id:L,schemaVersion:M.schemaVersion,ownerId:M.ownerId,shared:M.shared,deleting:M.deleting,name:M.name,projectType:M.projectType,currentRevision:M.currentRevision,previousRevision:M.previousRevision,chunkCount:M.chunkCount,byteLength:M.byteLength,nodeCount:M.nodeCount,edgeCount:M.edgeCount,createdAt:M.createdAt&&typeof M.createdAt.toDate=="function"?M.createdAt.toDate().toISOString():M.createdAt||se,updatedAt:M.updatedAt&&typeof M.updatedAt.toDate=="function"?M.updatedAt.toDate().toISOString():M.updatedAt||se}}async function re(L,M,se,$){let ie=Array.from({length:$},(Q,J)=>m(M,se,J));return Promise.all(ie.map(Q=>L.get(Q)))}function le(L){return L.docs.map(M=>yt(M.id,M.data()))}async function pe(L,M){let se=Array.from({length:M.chunkCount},(J,fe)=>m(L,M.currentRevision,fe)),ie=(await Promise.all(se.map(J=>$n(J)))).map((J,fe)=>{if(!J.exists())throw new ue("The online workspace is missing a graph chunk.","missing-chunk",{status:"invalid"});let Ee=J.data();if(!Ee.payload||typeof Ee.payload.toUint8Array!="function")throw new ue("The online workspace contains an invalid graph chunk.","invalid-chunk",{status:"invalid"});let he;try{he=new TextDecoder("utf-8",{fatal:!0}).decode(Ee.payload.toUint8Array())}catch(Se){throw new ue("The online workspace contains invalid UTF-8 graph data.","invalid-chunk",{status:"invalid",cause:Se})}return{index:Ee.index,text:he}}),Q=Ff({chunks:ie,chunkCount:M.chunkCount,byteLength:M.byteLength});if(Q.graph.nodes.length!==M.nodeCount||Q.graph.edges.length!==M.edgeCount)throw new ue("The online workspace graph counts do not match its metadata.","count-mismatch",{status:"invalid"});return Q}function Ae(L,M,se){let $=b(M),ie=!1,Q=0,J=he=>{ie||se(he)},fe=async(he,Se)=>{if(ie||Se!==Q)return;if(he.metadata?.fromCache){J({status:"loading"});return}if(he.metadata?.hasPendingWrites){J({status:"loading"});return}if(!he.exists()){J({status:"deleted"});return}let Fe;try{Fe=yt(M,he.data())}catch($t){J({status:"error",error:et($t)});return}let pt=Fe.ownerId===l.currentUser?.uid;if(!Fe.shared&&!pt){J({status:"revoked"});return}try{let $t=await pe(M,Fe);if(ie||Se!==Q)return;let un=await $n($);if(!un.exists()){J({status:"deleted"});return}let Gt=yt(M,un.data()),fs=Gt.ownerId===l.currentUser?.uid;if(!Gt.shared&&!fs){J({status:"revoked"});return}if(Gt.currentRevision!==Fe.currentRevision||Gt.chunkCount!==Fe.chunkCount||Gt.byteLength!==Fe.byteLength){J({status:"loading"});return}J({status:"ready",metadata:Fe,chunks:$t})}catch($t){if(ie||Se!==Q)return;let un=et($t);J({status:un.status==="permission-denied"?"revoked":"error",error:un})}},Ee=Cu(g(L),()=>vf($,{includeMetadataChanges:!0},he=>{Q+=1,fe(he,Q)},he=>{let Se=et(he);J({status:Se.status==="permission-denied"?"revoked":Se.status,error:Se})}),he=>{let Se=et(he);J({status:Se.status==="permission-denied"?"revoked":Se.status,error:Se})});return()=>{ie=!0,Q+=1,Ee()}}return{observeAuth:L=>Cu(f,()=>kl(l,M=>{L(M),M&&Ve(M).catch(()=>{})},M=>L(null,M)),M=>L(null,M)),getAdminAccess:async L=>{await g(L);let M=await $n(ve());return await g(L),{isAdmin:M.exists()&&M.data().adminUid===L}},listAdminAccounts:async(L,M="")=>{await we(L);let se=[E_(ou()),__(50)];M&&se.push(w_(ds(M)));let $=await gu($o(hs(h,"accountProfiles"),...se)),ie=await Promise.all($.docs.map(async Q=>{let[J,fe]=await Promise.all([$n(ae(Q.id)),$n(G(Q.id))]),Ee=Q.data();return Object.freeze({uid:Q.id,name:String(Ee.name||""),email:String(Ee.email||""),maxWorkspaces:Eu(J.exists()?J.data():null),allowanceUpdatedAt:J.exists()?_u(J.data().updatedAt):null,workspaceCount:fe.exists()?mu(fe.data()).length:null,isAdmin:Q.id===L})}));return await g(L),{accounts:ie,nextCursor:$.size===50?$.docs.at(-1).id:null}},setAccountLimit:async(L,M,se,$)=>{await g(L),xf(se),ds(M),await Ir(h,async Q=>{let[J,fe,Ee]=await Promise.all([Q.get(ve()),Q.get(U(M)),Q.get(ae(M))]);if(await g(L),!J.exists()||J.data().adminUid!==L)throw new ue("Administrator access is required.","admin-required",{status:"permission-denied"});if(!fe.exists())throw new ue("This account is no longer in the directory. Refresh the list.","account-not-found");if((Ee.exists()?_u(Ee.data().updatedAt):null)!==$)throw new ue("This allowance changed in another tab. Refresh before saving.","admin-conflict",{status:"conflict"});if(M===L&&se!==null)throw new ue("The administrator keeps unlimited access.","invalid-limit");Q.set(ae(M),{schemaVersion:1,maxWorkspaces:se,updatedBy:L,updatedAt:on()})});let ie=await $n(ae(M));return await g(L),{maxWorkspaces:Eu(ie.data()),allowanceUpdatedAt:_u(ie.data().updatedAt)}},signInGoogle:async()=>{await f;let L=new Lr;return L.setCustomParameters({prompt:"select_account"}),Ml(l,L)},signOut:async()=>(await f,Fl(l)),listWorkspaces:async L=>{await g(L);let M=$o(hs(h,Xo),pu("ownerId","==",L)),se=await gu(M),$=le(se);return se.metadata?.fromCache?{status:"offline",workspaces:$}:{status:"ready",workspaces:$}},watchOwnedWorkspaces:(L,M)=>{let se=$o(hs(h,Xo),pu("ownerId","==",L));return Cu(g(L),()=>vf(se,{includeMetadataChanges:!0},$=>{if($.metadata?.fromCache||$.metadata?.hasPendingWrites){M({status:"loading",workspaces:[]});return}try{M({status:"ready",workspaces:le($)})}catch(ie){M({status:"error",error:et(ie)})}},$=>M({status:"error",error:et($)})),$=>M({status:"error",error:et($)}))},createWorkspace:async(L,M,se="")=>{await g(L);let $=se?cn(se):"",ie=async fe=>{await g(L);let Ee=i(),he=b(fe),Se=w({uid:L,encoded:M,revision:Ee,previousRevision:null,shared:!1});return await v({commit:()=>Ir(h,async Fe=>{let pt=await Fe.get(G(L)),$t;try{$t=await Fe.get(ae(L))}catch(Yn){if(Yn?.code!=="permission-denied")throw Yn;await g(L)}let un=Eu($t?.exists()?$t.data():null);if(!pt.exists()&&!(await gu($o(hs(h,Xo),pu("ownerId","==",L)))).empty)throw new bt("Cloud Workspace usage needs setup for this account. Existing maps are unchanged; keep this new map locally for now.","quota-uninitialized");let Gt=pt.exists()?pt.data():null,fs=S_(Gt,fe,un);for(let Yn of M.chunks)Fe.set(m(fe,Ee,Yn.index),I(Yn));Fe.set(he,Se),Fe.set(G(L),{schemaVersion:1,workspaceIds:fs,lastWorkspaceId:fe,lastAction:"create",createdAt:Gt?.createdAt||on(),updatedAt:on()})})}),C(fe,{...Se,createdAt:D(),updatedAt:D()})};if(!$){for(let fe=0;fe<3;fe+=1){let Ee=i();try{return await ie(Ee)}catch(he){if(!["permission-denied","workspace-id-collision"].includes(he?.code)||fe===2)throw he}}throw new ue("A new online workspace could not be created.","create-failed",{status:"error"})}let Q=async()=>{await g(L);let fe=await R(b($));if(await g(L),!fe.exists())return null;let Ee=yt($,fe.data());if(Ee.ownerId!==L)throw new ue("This workspace ID is already in use by a different account. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});let he=await pe($,Ee);if(await g(L),he.json!==M.json)throw new ue("This workspace ID already contains a different map. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});return C($,fe.data())},J=null;for(let fe=0;fe<2;fe+=1)try{return await ie($)}catch(Ee){if(J=Ee,["workspace-limit","quota-uninitialized","quota-invalid"].includes(Ee?.code))throw Ee;try{let he=await Q();if(he)return he}catch(he){if(he?.code==="workspace-id-collision")throw he;if(fe===1)throw J}}throw J||new ue("A new online workspace could not be created.","create-failed",{status:"error"})},saveWorkspace:async(L,M,se,$)=>{await g(L);let ie=b(M),Q=Of();return Ir(h,async J=>{let fe=await J.get(ie);if(!fe.exists())throw new ue("This online workspace no longer exists.","not-found",{status:"not-found"});let Ee=fe.data(),he=yt(M,Ee);if(he.ownerId!==L)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(he.currentRevision!==$)throw new wu($,he.currentRevision);if(he.deleting)throw new ue("This workspace is being deleted. Retry deletion from the owner library.","delete-in-progress",{status:"delete-in-progress"});let Se=await re(J,M,he.currentRevision,he.chunkCount),Fe=w({uid:L,encoded:se,revision:Q,previousRevision:he.currentRevision,shared:he.shared,createdAt:Ee.createdAt});for(let pt of se.chunks)J.set(m(M,Q,pt.index),I(pt));for(let pt=0;pt<Se.length;pt+=1)Se[pt].exists()&&J.delete(m(M,he.currentRevision,pt));return J.update(ie,Fe),C(M,{...Fe,createdAt:he.createdAt,updatedAt:D()})})},watchWorkspace:Ae,deleteWorkspace:async(L,M)=>{await g(L);let se=b(M),$=!1;try{await Ir(h,async ie=>{let Q=await ie.get(se);if(!Q.exists())return;let J=yt(M,Q.data());if(J.ownerId!==L)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(J.deleting){if(J.shared)throw new ue("This workspace has an inconsistent deletion state. Contact support before retrying.","invalid-delete-state",{status:"invalid"});return}ie.update(se,{shared:!1,deleting:!0,updatedAt:on()})}),$=!0,await Ir(h,async ie=>{let Q=await ie.get(se);if(!Q.exists())return;let J=yt(M,Q.data());if(J.ownerId!==L)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(!J.deleting||J.shared)throw new ue("The workspace is no longer in a safe state for deletion.","invalid-delete-state",{status:"invalid"});let fe=await ie.get(G(L)),Ee=fe.exists()?fe.data():null,he=R_(Ee,M),Se=await re(ie,M,J.currentRevision,J.chunkCount);for(let Fe=0;Fe<Se.length;Fe+=1)Se[Fe].exists()&&ie.delete(m(M,J.currentRevision,Fe));ie.delete(se),ie.update(G(L),{workspaceIds:he,lastWorkspaceId:M,lastAction:"delete",updatedAt:on()})})}catch(ie){throw $?new ue("Sharing was revoked, but deletion did not finish. Retry deletion to remove the stored graph.","delete-incomplete",{status:"delete-incomplete",cause:ie}):ie}},setShared:async(L,M,se)=>{await g(L);let $=b(M);return await Ir(h,async ie=>{let Q=await ie.get($);if(!Q.exists())throw new ue("This online workspace no longer exists.","not-found",{status:"not-found"});let J=yt(M,Q.data());if(J.ownerId!==L)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(J.deleting)throw new ue("This workspace is being deleted and cannot be shared.","delete-in-progress",{status:"delete-in-progress"});ie.update($,{shared:!!se,updatedAt:on()})}),!!se},getCurrentUser:()=>l.currentUser}}function QA(){let n=()=>Promise.reject(new ue("Online workspaces are not configured in this build.","disabled",{status:"disabled"}));return{observeAuth:e=>(queueMicrotask(()=>e(null)),()=>{}),getAdminAccess:n,listAdminAccounts:n,setAccountLimit:n,signInGoogle:n,signOut:n,listWorkspaces:n,watchOwnedWorkspaces:(e,t)=>(queueMicrotask(()=>t({status:"disabled",workspaces:[]})),()=>{}),createWorkspace:n,saveWorkspace:n,watchWorkspace:(e,t,r)=>(queueMicrotask(()=>r({status:"error",error:new ue("Online workspaces are not configured in this build.","disabled",{status:"disabled"})})),()=>{}),deleteWorkspace:n,setShared:n,getCurrentUser:()=>null}}function $A({config:n=Yo,app:e,auth:t,db:r,adapter:s,baseUrl:i}={}){let o=Sf(n),c;s?c=s:o.enabled?c=WA(n,{app:e,auth:t,db:r}):c=QA();let u=null,l=!1,h=null,f=0,g,v=new Promise(w=>{g=w}),R=new Set,b=new Set,G=new Set,U=()=>zA(u),ae=w=>{try{w(U(),h)}catch{}},ve=(w,C=null)=>{h=C?et(C):null;let re=u?.uid||null,le=l;u=!h&&w&&typeof w.uid=="string"?w:null,l=!0;let pe=u?.uid||null;(!le||re!==pe)&&(f+=1),g(U());for(let Ae of R)ae(Ae);if(le&&re!==pe){for(let Ae of b)Ae.restart();for(let Ae of G)Ae.restart()}else if(!le){for(let Ae of b)Ae.restart();for(let Ae of G)Ae.restart()}},we=()=>{};try{we=c.observeAuth((w,C)=>ve(w,C))}catch(w){ve(null,w)}let Ve=async()=>(l||await v,u),be=async()=>{let w=await Ve();if(h)throw h;if(!w||typeof w.uid!="string"||!w.uid)throw new ue("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated"});return{user:w,uid:w.uid,epoch:f}},A=w=>{if(f!==w.epoch||u?.uid!==w.uid)throw new ue("Your account changed while the request was running. Retry it from the current account.","account-changed",{status:"unauthenticated"})};function m(w,C=()=>{}){if(typeof w!="function")throw new TypeError("Auth observer callback must be a function.");let re=(le,pe)=>{pe?C(pe):w(le)};return R.add(re),l&&ae(re),()=>R.delete(re)}function y(w){if(typeof w!="function")throw new TypeError("Workspace observer callback must be a function.");let C=!1,re=()=>{},le=0,pe=L=>{if(!C)try{w(L)}catch{}},Ae={restart:async()=>{le+=1;let L=le;re(),re=()=>{};let M=await Ve();if(C||le!==L)return;if(!M?.uid){pe({status:"unauthenticated",workspaces:[]});return}let se=f;try{re=c.watchOwnedWorkspaces(M.uid,$=>{if(!(C||le!==L||se!==f)){if($?.status==="error"){pe({status:"error",error:et($.error),workspaces:[]});return}if($?.status==="loading"){pe({status:"loading",workspaces:Array.isArray($.workspaces)?$.workspaces:[]});return}if($?.status==="offline"){pe({status:"offline",workspaces:Array.isArray($.workspaces)?$.workspaces:[]});return}try{let ie=Array.isArray($?.workspaces)?$.workspaces.map(Q=>ui(Q?.id?yt(Q.id,Q):yt(Q?.id,Q?.data))):[];pe({status:"ready",workspaces:ie})}catch(ie){pe({status:"error",error:et(ie),workspaces:[]})}}})}catch($){pe({status:et($).status,error:et($),workspaces:[]})}},stop:()=>{C=!0,le+=1,re(),b.delete(Ae)}};return b.add(Ae),Ae.restart(),Ae.stop}function I(w,C){let re=cn(w?.workspaceId||w?.sharedId);if(typeof C!="function")throw new TypeError("Workspace observer callback must be a function.");let le=!1,pe=()=>{},Ae=0,L=se=>{if(!le)try{C(se)}catch{}},M={restart:async()=>{Ae+=1;let se=Ae;pe(),pe=()=>{};let $=await Ve();if(le||Ae!==se)return;let ie=f;L({status:"loading"});try{pe=c.watchWorkspace($?.uid||null,re,Q=>{if(!(le||Ae!==se||ie!==f)){if(Q?.status==="ready"){try{let J=yt(re,Q.metadata),fe=J.ownerId===u?.uid;if(!J.shared&&!fe){L({status:"revoked"});return}let Ee=Q.chunks?.graph?Q.chunks:Ff({chunks:Q.chunks,chunkCount:J.chunkCount,byteLength:J.byteLength});L({status:"ready",workspace:ui(J),graph:Ee.graph})}catch(J){L({status:"error",error:et(J)})}return}if(Q?.status==="error"){let J=et(Q.error);L({status:J.status==="permission-denied"?"revoked":J.status,error:J});return}if(["deleted","revoked","offline","loading","unauthenticated","disabled"].includes(Q?.status)){L({status:Q.status,error:Q.error?et(Q.error):void 0});return}L({status:"error",error:new ue("The online workspace returned an unknown status.","invalid-response",{status:"error"})})}})}catch(Q){let J=et(Q);L({status:J.status,error:J})}},stop:()=>{le=!0,Ae+=1,pe(),G.delete(M)}};return G.add(M),M.restart(),M.stop}let D=async w=>{try{let C=await be(),re=await w(C);return A(C),re}catch(C){throw et(C)}};return Object.freeze({configStatus:o,onAuthStateChanged:m,signInWithGoogle:async()=>{try{let w=await c.signInGoogle();return ve(w?.user||w),U()}catch(w){throw et(w)}},signOut:async()=>{try{await c.signOut(),ve(null)}catch(w){throw et(w)}},listWorkspaces:()=>D(async({uid:w})=>{let C=await c.listWorkspaces(w);if(C?.status==="offline")return Object.freeze({status:"offline",workspaces:Array.isArray(C.workspaces)?C.workspaces:[]});let re=Array.isArray(C?.workspaces)?C.workspaces.map(le=>ui(le?.id?yt(le.id,le):ui(le))):[];return Object.freeze({status:"ready",workspaces:re})}),getAdminAccess:()=>D(({uid:w})=>c.getAdminAccess(w)),listAdminAccounts:({afterUid:w=""}={})=>D(({uid:C})=>c.listAdminAccounts(C,w)),setAccountLimit:({targetUid:w,maxWorkspaces:C,expectedUpdatedAt:re,expectedAdminUid:le}={})=>D(({uid:pe})=>{if(pe!==le)throw new ue("Your account changed. Refresh before updating access.","account-changed",{status:"unauthenticated"});if(ds(w),xf(C),re!==null&&typeof re!="string")throw new ue("Refresh the account allowance before saving.","invalid-limit");return c.setAccountLimit(pe,w,C,re)}),watchOwnedWorkspaces:y,createWorkspace:({name:w,graph:C,workspaceId:re,expectedOwnerUid:le}={})=>D(async({uid:pe})=>{if(le&&String(le)!==pe)throw new ue("Your account changed before this map could be saved. Sign in to the account that started the save and retry.","account-changed",{status:"unauthenticated"});let Ae=kf(C,{name:w}),L=re?cn(re):"",M=await c.createWorkspace(pe,Ae,L);return ui(yt(M.id,M))}),saveWorkspace:({workspaceId:w,graph:C,expectedRevision:re}={})=>D(async({uid:le})=>{let pe=cn(w),Ae=cn(re),L=kf(C),M=await c.saveWorkspace(le,pe,L,Ae);return ui(yt(pe,M))}),watchWorkspace:I,deleteWorkspace:w=>D(async({uid:C})=>{let re=cn(w);await c.deleteWorkspace(C,re)}),setShared:({workspaceId:w,enabled:C}={})=>D(async({uid:re})=>{let le=cn(w);if(typeof C!="boolean")throw new ue("Sharing state must be enabled or disabled.","invalid-sharing-state",{status:"invalid"});if(!await c.setShared(re,le,C))return null;let Ae=i||globalThis.location?.href;return Object.freeze({sharedId:le,viewUrl:b_(le,Ae)})}),dispose:()=>{for(let w of b)w.stop();for(let w of G)w.stop();R.clear(),we()}})}export{wu as CloudConflictError,ue as CloudServiceError,$A as createCloudService,Yo as firebaseConfig,Sf as getCloudConfigStatus,bf as isCloudConfigured};
