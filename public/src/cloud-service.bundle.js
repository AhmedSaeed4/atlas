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
 */var kp=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},aw=function(n){let e=[],t=0,r=0;for(;t<n.length;){let s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){let i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){let i=n[t++],o=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{let i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Fp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){let i=n[s],o=s+1<n.length,c=o?n[s+1]:0,u=s+2<n.length,l=u?n[s+2]:0,h=i>>2,f=(i&3)<<4|c>>4,g=(c&15)<<2|l>>6,v=l&63;u||(v=64,o||(g=64)),r.push(t[h],t[f],t[g],t[v])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(kp(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):aw(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){let i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;let l=s<n.length?t[n.charAt(s)]:64;++s;let f=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||l==null||f==null)throw new Hu;let g=i<<2|c>>4;if(r.push(g),l!==64){let v=c<<4&240|l>>2;if(r.push(v),f!==64){let I=l<<6&192|f;r.push(I)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Hu=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},cw=function(n){let e=kp(n);return Fp.encodeByteArray(e,!0)},Si=function(n){return cw(n).replace(/\./g,"")},pa=function(n){try{return Fp.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */var uw=()=>xp().__FIREBASE_DEFAULTS__,lw=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Bw=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&pa(n[1]);return e&&JSON.parse(e)},ga=()=>{try{return Np()||uw()||lw()||Bw()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Lp=n=>ga()?.emulatorHosts?.[n],Vp=n=>{let e=Lp(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},ju=()=>ga()?.config,Mp=n=>ga()?.[`_${n}`];/**
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
 */var ws=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};/**
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
 */function Gp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Si(JSON.stringify(t)),Si(JSON.stringify(o)),""].join(".")}/**
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
 */function st(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Up(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(st())}function hw(){let n=ga()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Hp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function qp(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function jp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Kp(){let n=st();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Jp(){return!hw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ku(){try{return typeof indexedDB=="object"}catch{return!1}}function zp(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
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
 */var dw="FirebaseError",Nt=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=dw,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,An.prototype.create)}},An=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?fw(i,r):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new Nt(s,c,r)}};function fw(n,e){try{let t=0,r="";for(;t<n.length;){let s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}let i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}let o=n.substring(s+2,i),c=e[o];r+=n.substring(t,s)+(c!=null?String(c):`<${o}?>`),t=i+1}return r}catch{return n}}/**
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
 */function Wp(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function fn(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let s of t){if(!r.includes(s))return!1;let i=n[s],o=e[s];if(Op(i)&&Op(o)){if(!fn(i,o))return!1}else if(i!==o)return!1}for(let s of r)if(!t.includes(s))return!1;return!0}function Op(n){return n!==null&&typeof n=="object"}/**
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
 */function ys(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ds(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Is(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
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
 */function Qp(n,e){let t=new qu(n,e);return t.subscribe.bind(t)}var qu=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");pw(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Uu),s.error===void 0&&(s.error=Uu),s.complete===void 0&&(s.complete=Uu);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function pw(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Uu(){}/**
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
 */var tv=14400*1e3;/**
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
 */function Ue(n){return n&&n._delegate?n._delegate:n}/**
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
 */function kr(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ca(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */var jt=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
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
 */var Fr="[DEFAULT]";/**
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
 */var Ju=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new ws;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Cw(e))try{this.getOrInitializeService({instanceIdentifier:Fr})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Fr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Fr){return this.instances.has(e)}getOptions(e=Fr){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[i,o]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(i);r===c&&o.resolve(s)}return s}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);let i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:gw(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Fr){return this.component?this.component.multipleInstances?e:Fr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function gw(n){return n===Fr?void 0:n}function Cw(n){return n.instantiationMode==="EAGER"}/**
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
 */var ma=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Ju(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
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
 */var mw=[],pe;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(pe||(pe={}));var Ew={debug:pe.DEBUG,verbose:pe.VERBOSE,info:pe.INFO,warn:pe.WARN,error:pe.ERROR,silent:pe.SILENT},_w=pe.INFO,ww={[pe.DEBUG]:"log",[pe.VERBOSE]:"log",[pe.INFO]:"info",[pe.WARN]:"warn",[pe.ERROR]:"error"},yw=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),s=ww[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},ar=class{constructor(e){this.name=e,this._logLevel=_w,this._logHandler=yw,this._userLogHandler=null,mw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in pe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ew[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,pe.DEBUG,...e),this._logHandler(this,pe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,pe.VERBOSE,...e),this._logHandler(this,pe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,pe.INFO,...e),this._logHandler(this,pe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,pe.WARN,...e),this._logHandler(this,pe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,pe.ERROR,...e),this._logHandler(this,pe.ERROR,...e)}};var Dw=(n,e)=>e.some(t=>n instanceof t),$p,Yp;function Iw(){return $p||($p=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Tw(){return Yp||(Yp=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Xp=new WeakMap,Wu=new WeakMap,Zp=new WeakMap,zu=new WeakMap,$u=new WeakMap;function Aw(n){let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",o)},i=()=>{t(pn(n.result)),s()},o=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Xp.set(t,n)}).catch(()=>{}),$u.set(e,n),e}function vw(n){if(Wu.has(n))return;let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",o),n.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",o),n.addEventListener("abort",o)});Wu.set(n,e)}var Qu={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Wu.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Zp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return pn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function eg(n){Qu=n(Qu)}function bw(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(Ea(this),e,...t);return Zp.set(r,e.sort?e.sort():[e]),pn(r)}:Tw().includes(n)?function(...e){return n.apply(Ea(this),e),pn(Xp.get(this))}:function(...e){return pn(n.apply(Ea(this),e))}}function Sw(n){return typeof n=="function"?bw(n):(n instanceof IDBTransaction&&vw(n),Dw(n,Iw())?new Proxy(n,Qu):n)}function pn(n){if(n instanceof IDBRequest)return Aw(n);if(zu.has(n))return zu.get(n);let e=Sw(n);return e!==n&&(zu.set(n,e),$u.set(e,n)),e}var Ea=n=>$u.get(n);function ng(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){let o=indexedDB.open(n,e),c=pn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(pn(o.result),u.oldVersion,u.newVersion,pn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}var Rw=["get","getKey","getAll","getAllKeys","count"],Pw=["put","add","delete","clear"],Yu=new Map;function tg(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Yu.get(e))return Yu.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,s=Pw.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Rw.includes(t)))return;let i=async function(o,...c){let u=this.transaction(o,s?"readwrite":"readonly"),l=u.store;return r&&(l=l.index(c.shift())),(await Promise.all([l[t](...c),s&&u.done]))[0]};return Yu.set(e,i),i}eg(n=>({...n,get:(e,t,r)=>tg(e,t)||n.get(e,t,r),has:(e,t)=>!!tg(e,t)||n.has(e,t)}));/**
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
 */var Zu=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Nw(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function Nw(n){return n.getComponent()?.type==="VERSION"}var el="@firebase/app",rg="0.16.2";/**
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
 */var bn=new ar("@firebase/app"),Ow="@firebase/app-compat",kw="@firebase/analytics-compat",Fw="@firebase/analytics",xw="@firebase/app-check-compat",Lw="@firebase/app-check",Vw="@firebase/auth",Mw="@firebase/auth-compat",Gw="@firebase/database",Uw="@firebase/data-connect",Hw="@firebase/database-compat",qw="@firebase/functions",jw="@firebase/functions-compat",Kw="@firebase/installations",Jw="@firebase/installations-compat",zw="@firebase/messaging",Ww="@firebase/messaging-compat",Qw="@firebase/performance",$w="@firebase/performance-compat",Yw="@firebase/remote-config",Xw="@firebase/remote-config-compat",Zw="@firebase/storage",ey="@firebase/storage-compat",ty="@firebase/firestore",ny="@firebase/ai",ry="@firebase/firestore-compat",sy="firebase",iy="12.19.0";/**
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
 */var tl="[DEFAULT]",oy={[el]:"fire-core",[Ow]:"fire-core-compat",[Fw]:"fire-analytics",[kw]:"fire-analytics-compat",[Lw]:"fire-app-check",[xw]:"fire-app-check-compat",[Vw]:"fire-auth",[Mw]:"fire-auth-compat",[Gw]:"fire-rtdb",[Uw]:"fire-data-connect",[Hw]:"fire-rtdb-compat",[qw]:"fire-fn",[jw]:"fire-fn-compat",[Kw]:"fire-iid",[Jw]:"fire-iid-compat",[zw]:"fire-fcm",[Ww]:"fire-fcm-compat",[Qw]:"fire-perf",[$w]:"fire-perf-compat",[Yw]:"fire-rc",[Xw]:"fire-rc-compat",[Zw]:"fire-gcs",[ey]:"fire-gcs-compat",[ty]:"fire-fst",[ry]:"fire-fst-compat",[ny]:"fire-vertex","fire-js":"fire-js",[sy]:"fire-js-all"};/**
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
 */var Ri=new Map,ay=new Map,nl=new Map;function sg(n,e){try{n.container.addComponent(e)}catch(t){bn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function cr(n){let e=n.name;if(nl.has(e))return bn.debug(`There were multiple attempts to register component ${e}.`),!1;nl.set(e,n);for(let t of Ri.values())sg(t,n);for(let t of ay.values())sg(t,n);return!0}function Ni(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ot(n){return n==null?!1:n.settings!==void 0}/**
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
 */var cy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},vn=new An("app","Firebase",cy);/**
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
 */var rl=class{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new jt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw vn.create("app-deleted",{appName:this._name})}};/**
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
 */var ur=iy;function ol(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r={name:tl,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw vn.create("bad-app-name",{appName:String(s)});if(t||(t=ju()),!t)throw vn.create("no-options");let i=Ri.get(s);if(i)if(fn(t,i.options)){if(fn(r,i.config))return i;throw vn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw vn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});let o=new ma(s);for(let u of nl.values())o.addComponent(u);let c=new rl(t,r,o);return Ri.set(s,c),c}function al(n=tl){let e=Ri.get(n);if(!e&&n===tl&&ju())return ol();if(!e)throw vn.create("no-app",{appName:n});return e}function cg(){return Array.from(Ri.values())}function Zt(n,e,t){let r=oy[n]??n;t&&(r+=`-${t}`);let s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){let o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),bn.warn(o.join(" "));return}cr(new jt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */var uy="firebase-heartbeat-database",ly=1,Pi="firebase-heartbeat-store",Xu=null;function ug(){return Xu||(Xu=ng(uy,ly,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Pi)}catch(t){console.warn(t)}}}}).catch(n=>{throw vn.create("idb-open",{originalErrorMessage:n.message})})),Xu}async function By(n){try{let t=(await ug()).transaction(Pi),r=await t.objectStore(Pi).get(lg(n));return await t.done,r}catch(e){if(e instanceof Nt)bn.warn(e.message);else{let t=vn.create("idb-get",{originalErrorMessage:e?.message});bn.warn(t.message)}}}async function ig(n,e){try{let r=(await ug()).transaction(Pi,"readwrite");await r.objectStore(Pi).put(e,lg(n)),await r.done}catch(t){if(t instanceof Nt)bn.warn(t.message);else{let r=vn.create("idb-set",{originalErrorMessage:t?.message});bn.warn(r.message)}}}function lg(n){return`${n.name}!${n.options.appId}`}/**
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
 */var hy=1024,dy=30,sl=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new il(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=og();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>dy){let s=py(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){bn.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=og(),{heartbeatsToSend:t,unsentEntries:r}=fy(this._heartbeatsCache.heartbeats),s=Si(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return bn.warn(e),""}}};function og(){return new Date().toISOString().substring(0,10)}function fy(n,e=hy){let t=[],r=n.slice();for(let s of n){let i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),ag(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ag(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var il=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ku()?zp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await By(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return ig(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return ig(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function ag(n){return Si(JSON.stringify({version:2,heartbeats:n})).length}function py(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
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
 */function gy(n){cr(new jt("platform-logger",e=>new Zu(e),"PRIVATE")),cr(new jt("heartbeat",e=>new sl(e),"PRIVATE")),Zt(el,rg,n),Zt(el,rg,"esm2020"),Zt("fire-js","")}/**
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
 */gy("");/**
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
 */function bg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var Sg=bg,Rg=new An("auth","Firebase",bg());/**
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
 */var va=new ar("@firebase/auth");function wa(n,...e){va.logLevel<=pe.WARN&&va.warn(`Auth (${ur}): ${n}`,...e)}function ya(n,...e){va.logLevel<=pe.ERROR&&va.error(`Auth (${ur}): ${n}`,...e)}/**
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
 */function Kt(n,...e){throw Rl(n,...e)}function en(n,...e){return Rl(n,...e)}function $a(n,e,t){let r={...Sg(),[e]:t};return new An("auth","Firebase",r).create(e,{appName:n.name})}function xr(n){return $a(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Cy(n,e,t){let r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Kt(n,"argument-error"),$a(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Rl(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Rg.create(n,...e)}function re(n,e,...t){if(!n)throw Rl(e,...t)}function gn(n){let e="INTERNAL ASSERTION FAILED: "+n;throw ya(e),new Error(e)}function Rn(n,e){n||gn(e)}/**
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
 */function dl(){return typeof self<"u"&&self.location?.href||""}function my(){return Bg()==="http:"||Bg()==="https:"}function Bg(){return typeof self<"u"&&self.location?.protocol||null}/**
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
 */function Ey(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(my()||qp()||"connection"in navigator)?navigator.onLine:!0}function _y(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */var Lr=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,Rn(t>e,"Short delay should be less than long delay!"),this.isMobile=Up()||jp()}get(){return Ey()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
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
 */function Pl(n,e){Rn(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */var ba=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;gn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;gn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;gn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
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
 */var wy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */var yy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Dy=new Lr(3e4,6e4);function it(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function dt(n,e,t,r,s={}){return Pg(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});let c=ys({...o,key:n.config.apiKey}).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);let l={method:e,headers:u,...i};return Hp()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&kr(n.emulatorConfig.host)&&(l.credentials="include"),ba.fetch()(await Ng(n,n.config.apiHost,t,c),l)})}async function Pg(n,e,t){n._canInitEmulator=!1;let r={...wy,...e};try{let s=new fl(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let o=await i.json();if("needConfirmation"in o)throw ki(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{let c=i.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw ki(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw ki(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw ki(n,"user-disabled",o);let h=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw $a(n,h,l);Kt(n,h)}}catch(s){if(s instanceof Nt)throw s;Kt(n,"network-request-failed",{message:String(s)})}}async function qr(n,e,t,r,s={}){let i=await dt(n,e,t,r,s);return"mfaPendingCredential"in i&&Kt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Ng(n,e,t,r){let s=`${e}${t}?${r}`,i=n,o=i.config.emulator?Pl(n.config,s):`${n.config.apiScheme}://${s}`;return yy.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function Iy(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var fl=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(en(this.auth,"network-request-failed")),Dy.get())})}};function ki(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let s=en(n,e,r);return s.customData._tokenResponse=t,s}/**
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
 */function hg(n){return n!==void 0&&n.enterprise!==void 0}var Sa=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Iy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};/**
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
 */async function Og(n,e){return dt(n,"GET","/v2/recaptchaConfig",it(n,e))}/**
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
 */async function Ty(n,e){return dt(n,"POST","/v1/accounts:delete",e)}async function Ra(n,e){return dt(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Fi(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
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
 */async function kg(n,e=!1){let t=Ue(n),r=await t.getIdToken(e),s=Nl(r);re(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let i=typeof s.firebase=="object"?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:r,authTime:Fi(cl(s.auth_time)),issuedAtTime:Fi(cl(s.iat)),expirationTime:Fi(cl(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}function cl(n){return Number(n)*1e3}function Nl(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return ya("JWT malformed, contained fewer than 3 sections"),null;try{let s=pa(t);return s?JSON.parse(s):(ya("Failed to decode base64 JWT payload"),null)}catch(s){return ya("Caught error parsing JWT payload as JSON",s?.toString()),null}}function dg(n){let e=Nl(n);return re(e,"internal-error"),re(typeof e.exp<"u","internal-error"),re(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Gi(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Nt&&Ay(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ay({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */var pl=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
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
 */var Ui=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Fi(this.lastLoginAt),this.creationTime=Fi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
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
 */async function Pa(n){let e=n.auth,t=await n.getIdToken(),r=await Gi(n,Ra(e,{idToken:t}));re(r?.users.length,e,"internal-error");let s=r.users[0];n._notifyReloadListener(s);let i=s.providerUserInfo?.length?xg(s.providerUserInfo):[],o=vy(n.providerData,i),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!o?.length,l=c?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Ui(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,h)}async function Fg(n){let e=Ue(n);await Pa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function vy(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function xg(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function by(n,e){let t=await Pg(n,{},async()=>{let r=ys({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await Ng(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";let u={method:"POST",headers:c,body:r};return n.emulatorConfig&&kr(n.emulatorConfig.host)&&(u.credentials="include"),ba.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Sy(n,e){return dt(n,"POST","/v2/accounts:revokeToken",it(n,e))}/**
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
 */var xi=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){re(e.idToken,"internal-error"),re(typeof e.idToken<"u","internal-error"),re(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):dg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){re(e.length!==0,"internal-error");let t=dg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(re(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:s,expiresIn:i}=await by(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new n;return r&&(re(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(re(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(re(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return gn("not implemented")}};/**
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
 */function lr(n,e){re(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var Br=class n{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new pl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ui(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await Gi(this,this.stsTokenManager.getToken(this.auth,e));return re(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return kg(this,e)}reload(){return Fg(this)}_assign(e){this!==e&&(re(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){re(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Pa(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ot(this.auth.app))return Promise.reject(xr(this.auth));let e=await this.getIdToken();return await Gi(this,Ty(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:f,emailVerified:g,isAnonymous:v,providerData:I,stsTokenManager:S}=t;re(f&&S,e,"internal-error");let U=xi.fromJSON(this.name,S);re(typeof f=="string",e,"internal-error"),lr(r,e.name),lr(s,e.name),re(typeof g=="boolean",e,"internal-error"),re(typeof v=="boolean",e,"internal-error"),lr(i,e.name),lr(o,e.name),lr(c,e.name),lr(u,e.name),lr(l,e.name),lr(h,e.name);let H=new n({uid:f,auth:e,email:s,emailVerified:g,displayName:r,isAnonymous:v,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:U,createdAt:l,lastLoginAt:h});return I&&Array.isArray(I)&&(H.providerData=I.map(se=>({...se}))),u&&(H._redirectEventId=u),H}static async _fromIdTokenResponse(e,t,r=!1){let s=new xi;s.updateFromServerResponse(t);let i=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Pa(i),i}static async _fromGetAccountInfoResponse(e,t,r){let s=t.users[0];re(s.localId!==void 0,"internal-error");let i=s.providerUserInfo!==void 0?xg(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!i?.length,c=new xi;c.updateFromIdToken(r);let u=new n({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ui(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(u,l),u}};/**
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
 */var fg=new Map;function Sn(n){Rn(n instanceof Function,"Expected a class definition");let e=fg.get(n);return e?(Rn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,fg.set(n,e),e)}/**
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
 */var Na=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Na.type="NONE";var gl=Na;/**
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
 */function Da(n,e,t){return`firebase:${n}:${e}:${t}`}var Li=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:s,name:i}=this.auth;this.fullUserKey=Da(this.userKey,s.apiKey,i),this.fullPersistenceKey=Da("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await Ra(this.auth,{idToken:e}).catch(()=>{});return t?Br._fromGetAccountInfoResponse(this.auth,t,e):null}return Br._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new n(Sn(gl),e,r);let s=(await Promise.all(t.map(async l=>{try{if(await l._isAvailable())return l}catch{return}}))).filter(l=>l),i=s[0]||Sn(gl),o=Da(r,e.config.apiKey,e.name),c=null;for(let l of t)try{let h=await l._get(o);if(h){let f;if(typeof h=="string"){let g=await Ra(e,{idToken:h}).catch(()=>{});if(!g)break;f=await Br._fromGetAccountInfoResponse(e,g,h)}else f=Br._fromJSON(e,h);l!==i&&(c=f),i=l;break}}catch{}let u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new n(i,e,r):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new n(i,e,r))}};/**
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
 */function pg(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Gg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Lg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hg(e))return"Blackberry";if(qg(e))return"Webos";if(Vg(e))return"Safari";if((e.includes("chrome/")||Mg(e))&&!e.includes("edge/"))return"Chrome";if(Ug(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Lg(n=st()){return/firefox\//i.test(n)}function Vg(n=st()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Mg(n=st()){return/crios\//i.test(n)}function Gg(n=st()){return/iemobile/i.test(n)}function Ug(n=st()){return/android/i.test(n)}function Hg(n=st()){return/blackberry/i.test(n)}function qg(n=st()){return/webos/i.test(n)}function Ol(n=st()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Ry(n=st()){return Ol(n)&&!!window.navigator?.standalone}function Py(){return Kp()&&document.documentMode===10}function jg(n=st()){return Ol(n)||Ug(n)||qg(n)||Hg(n)||/windows phone/i.test(n)||Gg(n)}/**
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
 */function Kg(n,e=[]){let t;switch(n){case"Browser":t=pg(st());break;case"Worker":t=`${pg(st())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ur}/${r}`}/**
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
 */var Cl=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=i=>new Promise((o,c)=>{try{let u=e(i);o(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};/**
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
 */async function Ny(n,e={}){return dt(n,"GET","/v2/passwordPolicy",it(n,e))}/**
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
 */var Oy=6,ml=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Oy,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}};/**
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
 */var El=class{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Oa(this),this.idTokenSubscription=new Oa(this),this.beforeStateQueue=new Cl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Rg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Sn(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await Li.create(this,e)}catch(r){wa(`Failed to initialize persistence: ${r}`),this.persistenceManager=await Li.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(r){wa(`Failed to initialize current user: ${r}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await Ra(this,{idToken:e}),r=await Br._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Ot(this.app)){let i=this.app.settings.authIdToken;return i?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=this.redirectUser?._redirectEventId,o=r?._redirectEventId,c=await this.tryRedirectSignIn(e);(!i||i===o)&&c?.user&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return re(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Pa(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=_y()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ot(this.app))return Promise.reject(xr(this));let t=e?Ue(e):null;return t&&re(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&re(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ot(this.app)?Promise.reject(xr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ot(this.app)?Promise.reject(xr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Sn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await Ny(this),t=new ml(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new An("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Sy(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&Sn(e)||this._popupRedirectResolver;re(t,this,"argument-error"),this.redirectPersistenceManager=await Li.create(this,[Sn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};let i=typeof t=="function"?t:t.next.bind(t),o=!1,c=this._isInitialized?Promise.resolve():this._initializationPromise;if(re(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}).catch(u=>{if(!o)if(typeof t!="function"&&t.error)t.error(u);else if(r)r(u);else throw u}),typeof t=="function"){let u=e.addObserver(t,r,s);return()=>{o=!0,u()}}else{let u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){let r=t?.message||String(t),s=$a(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return re(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Kg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(Ot(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&wa(`Error while retrieving App Check token: ${e.error}`),e?.token}};function vs(n){return Ue(n)}var Oa=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=Qp(t=>this.observer=t)}get next(){return re(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
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
 */var Ya={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ky(n){Ya=n}function Jg(n){return Ya.loadJS(n)}function Fy(){return Ya.recaptchaEnterpriseScript}function xy(){return Ya.gapiScript}function zg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */var _l=class{constructor(){this.enterprise=new wl}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},wl=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};/**
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
 */var Ly="recaptcha-enterprise",Vi="NO_RECAPTCHA",gg="onFirebaseAuthREInstanceReady",Hi=class n{constructor(e){this.type=Ly,this.auth=vs(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{Og(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{let l=new Sa(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){let u=window.grecaptcha;hg(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(Vi)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new _l().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async c=>{if(!t&&hg(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Fy();u.length!==0&&(u+=c+`&onload=${gg}`),n.scriptInjectionDeferred=new ws,window[gg]=()=>{n.scriptInjectionDeferred?.resolve()},Jg(u).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{s(c,i,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}};Hi.scriptInjectionDeferred=null;async function Oi(n,e,t,r=!1,s=!1){let i=new Hi(n),o;if(s)o=Vi;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}let c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){let u=c.phoneEnrollmentInfo.phoneNumber,l=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){let u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Mi(n,e,t,r,s){if(s==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let i=await Oi(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await Oi(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(i)});else if(s==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let i=await Oi(n,e,t);return r(n,i).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let c=await Oi(n,e,t,!1,!0);return r(n,c)}return Promise.reject(o)})}else{let i=await Oi(n,e,t,!1,!0);return r(n,i)}else return Promise.reject(s+" provider is not supported.")}async function Vy(n){let e=vs(n),t=await Og(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Sa(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new Hi(e).verify()}/**
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
 */function kl(n,e){let t=Ni(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),i=t.getOptions();if(fn(i,e??{}))return s;Kt(s,"already-initialized")}return t.initialize({options:e})}function My(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Sn);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}/**
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
 */var Vr=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return gn("not implemented")}_getIdTokenResponse(e){return gn("not implemented")}_linkToIdToken(e,t){return gn("not implemented")}_getReauthenticationResolver(e){return gn("not implemented")}};/**
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
 */async function Gy(n,e){return dt(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function Uy(n,e){return qr(n,"POST","/v1/accounts:signInWithPassword",it(n,e))}/**
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
 */async function Hy(n,e){return qr(n,"POST","/v1/accounts:signInWithEmailLink",it(n,e))}async function qy(n,e){return qr(n,"POST","/v1/accounts:signInWithEmailLink",it(n,e))}/**
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
 */var qi=class n extends Vr{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Mi(e,t,"signInWithPassword",Uy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Hy(e,{email:this._email,oobCode:this._password});default:Kt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Mi(e,r,"signUpPassword",Gy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return qy(e,{idToken:t,email:this._email,oobCode:this._password});default:Kt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
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
 */async function Ts(n,e){return qr(n,"POST","/v1/accounts:signInWithIdp",it(n,e))}/**
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
 */var jy="http://localhost",Mr=class n extends Vr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Kt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;let o=new n(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return Ts(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,Ts(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,Ts(e,t)}buildRequest(){let e={requestUri:jy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ys(t)}return e}};/**
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
 */async function Cg(n,e){return dt(n,"POST","/v1/accounts:sendVerificationCode",it(n,e))}async function Ky(n,e){return qr(n,"POST","/v1/accounts:signInWithPhoneNumber",it(n,e))}async function Jy(n,e){let t=await qr(n,"POST","/v1/accounts:signInWithPhoneNumber",it(n,e));if(t.temporaryProof)throw ki(n,"account-exists-with-different-credential",t);return t}var zy={USER_NOT_FOUND:"user-not-found"};async function Wy(n,e){let t={...e,operation:"REAUTH"};return qr(n,"POST","/v1/accounts:signInWithPhoneNumber",it(n,t),zy)}/**
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
 */var ji=class n extends Vr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Ky(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Jy(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return Wy(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i}=e;return!r&&!t&&!s&&!i?null:new n({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i})}};/**
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
 */function Qy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function $y(n){let e=Ds(Is(n)).link,t=e?Ds(Is(e)).deep_link_id:null,r=Ds(Is(n)).deep_link_id;return(r?Ds(Is(r)).link:null)||r||t||e||n}var ka=class n{constructor(e){let t=Ds(Is(e)),r=t.apiKey??null,s=t.oobCode??null,i=Qy(t.mode??null);re(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=$y(e);try{return new n(t)}catch{return null}}};/**
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
 */var As=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return qi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=ka.parseLink(t);return re(r,"argument-error"),qi._fromEmailAndCode(e,r.code,r.tenantId)}};As.PROVIDER_ID="password";As.EMAIL_PASSWORD_SIGN_IN_METHOD="password";As.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */var Ki=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
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
 */var Gr=class extends Ki{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
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
 */var Ji=class n extends Gr{constructor(){super("facebook.com")}static credential(e){return Mr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Ji.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ji.PROVIDER_ID="facebook.com";/**
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
 */var Ur=class n extends Gr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Mr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};Ur.GOOGLE_SIGN_IN_METHOD="google.com";Ur.PROVIDER_ID="google.com";/**
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
 */var zi=class n extends Gr{constructor(){super("github.com")}static credential(e){return Mr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};zi.GITHUB_SIGN_IN_METHOD="github.com";zi.PROVIDER_ID="github.com";/**
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
 */var Wi=class n extends Gr{constructor(){super("twitter.com")}static credential(e,t){return Mr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};Wi.TWITTER_SIGN_IN_METHOD="twitter.com";Wi.PROVIDER_ID="twitter.com";/**
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
 */var Qi=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){let i=await Br._fromIdTokenResponse(e,r,s),o=mg(r);return new n({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let s=mg(r);return new n({user:e,providerId:s,_tokenResponse:r,operationType:t})}};function mg(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */var yl=class n extends Nt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new n(e,t,r,s)}};function Wg(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?yl._fromErrorAndOperation(n,i,e,r):i})}/**
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
 */async function Yy(n,e,t=!1){let r=await Gi(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Qi._forOperation(n,"link",r)}/**
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
 */async function Xy(n,e,t=!1){let{auth:r}=n;if(Ot(r.app))return Promise.reject(xr(r));let s="reauthenticate";try{let i=await Gi(n,Wg(r,s,e,n),t);re(i.idToken,r,"internal-error");let o=Nl(i.idToken);re(o,r,"internal-error");let{sub:c}=o;return re(n.uid===c,r,"user-mismatch"),Qi._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&Kt(r,"user-mismatch"),i}}/**
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
 */async function Zy(n,e,t=!1){if(Ot(n.app))return Promise.reject(xr(n));let r="signIn",s=await Wg(n,r,e),i=await Qi._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}/**
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
 */function Fl(n,e,t,r){return Ue(n).onAuthStateChanged(e,t,r)}function xl(n){return Ue(n).signOut()}/**
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
 */function Eg(n,e){return dt(n,"POST","/v2/accounts/mfaEnrollment:start",it(n,e))}function eD(n,e){return dt(n,"POST","/v2/accounts/mfaEnrollment:finalize",it(n,e))}function tD(n,e){return dt(n,"POST","/v2/accounts/mfaEnrollment:start",it(n,e))}function nD(n,e){return dt(n,"POST","/v2/accounts/mfaEnrollment:finalize",it(n,e))}var Fa="__sak";/**
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
 */var xa=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Fa,"1"),this.storage.removeItem(Fa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};/**
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
 */var rD=1e3,sD=10,La=class extends xa{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=jg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}let r=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);Py()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,sD):s()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},rD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};La.type="LOCAL";var Ll=La;/**
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
 */var iD=1e3;function ul(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function ll(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var Dl=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=ll(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:ul(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=ll(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=ll(e);if(window.cookieStore){let c=(l=>{let h=l.changed.find(g=>g.name===r);h&&t(h.value),l.deleted.find(g=>g.name===r)&&t(null)}),u=()=>window.cookieStore.removeEventListener("change",c);return this.listenerUnsubscribes.set(t,u),window.cookieStore.addEventListener("change",c)}let s=ul(r),i=setInterval(()=>{let c=ul(r);c!==s&&(t(c),s=c)},iD),o=()=>clearInterval(i);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};Dl.type="COOKIE";/**
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
 */var Va=class extends xa{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};Va.type="SESSION";var Qg=Va;/**
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
 */function oD(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */var Ma=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});let c=Array.from(o).map(async l=>l(t.origin,i)),u=await oD(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};Ma.receivers=[];/**
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
 */function Vl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */var Il=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{let l=Vl("",20);s.port1.start();let h=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(f){let g=f;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(g.data.response);break;default:clearTimeout(h),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};/**
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
 */function Cn(){return window}function aD(n){Cn().location.href=n}/**
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
 */function $g(){return typeof Cn().WorkerGlobalScope<"u"&&typeof Cn().importScripts=="function"}async function cD(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function uD(){return navigator?.serviceWorker?.controller||null}function lD(){return $g()?self:null}/**
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
 */var Yg="firebaseLocalStorageDb",BD=1,Ga="firebaseLocalStorage",Xg="fbase_key",Hr=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function Xa(n,e){return n.transaction([Ga],e?"readwrite":"readonly").objectStore(Ga)}function hD(){let n=indexedDB.deleteDatabase(Yg);return new Hr(n).toPromise()}function Zg(){let n=indexedDB.open(Yg,BD);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(Ga,{keyPath:Xg})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(Ga)?e(r):(r.close(),await hD(),e(await Zg()))})})}async function _g(n,e,t){let r=Xa(n,!0).put({[Xg]:e,value:t});return new Hr(r).toPromise()}async function dD(n,e){let t=Xa(n,!1).get(e),r=await new Hr(t).toPromise();return r===void 0?null:r.value}function wg(n,e){let t=Xa(n,!0).delete(e);return new Hr(t).toPromise()}var fD=800,pD=3,Ua=class{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Zg(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>pD)throw r;if(this.dbPromise){let s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return $g()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ma._getInstance(lD()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await cD(),!this.activeServiceWorker)return;this.sender=new Il(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||uD()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await _g(e,Fa,"1"),await wg(e,Fa)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>_g(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>dD(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>wg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(s=>{let i=Xa(s,!1).getAll();return new Hr(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||wa(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),fD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}};Ua.type="LOCAL";var Ml=Ua;/**
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
 */function yg(n,e){return dt(n,"POST","/v2/accounts/mfaSignIn:start",it(n,e))}function gD(n,e){return dt(n,"POST","/v2/accounts/mfaSignIn:finalize",it(n,e))}function CD(n,e){return dt(n,"POST","/v2/accounts/mfaSignIn:finalize",it(n,e))}/**
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
 */var Iv=zg("rcb"),Tv=new Lr(3e4,6e4);/**
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
 */var Ia="recaptcha";/**
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
 */async function mD(n,e,t){if(!n._getRecaptchaConfig())try{await Vy(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){let s=r.session;if("phoneNumber"in r){re(s.type==="enroll",n,"internal-error");let i={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Mi(n,i,"mfaSmsEnrollment",async(l,h)=>{if(h.phoneEnrollmentInfo.captchaResponse===Vi){re(t?.type===Ia,l,"argument-error");let f=await Bl(l,h,t);return Eg(l,f)}return Eg(l,h)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{re(s.type==="signin",n,"internal-error");let i=r.multiFactorHint?.uid||r.multiFactorUid;re(i,n,"missing-multi-factor-info");let o={mfaPendingCredential:s.credential,mfaEnrollmentId:i,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Mi(n,o,"mfaSmsSignIn",async(h,f)=>{if(f.phoneSignInInfo.captchaResponse===Vi){re(t?.type===Ia,h,"argument-error");let g=await Bl(h,f,t);return yg(h,g)}return yg(h,f)},"PHONE_PROVIDER").catch(h=>Promise.reject(h))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Mi(n,s,"sendVerificationCode",async(u,l)=>{if(l.captchaResponse===Vi){re(t?.type===Ia,u,"argument-error");let h=await Bl(u,l,t);return Cg(u,h)}return Cg(u,l)},"PHONE_PROVIDER").catch(u=>Promise.reject(u))).sessionInfo}}finally{t?._reset()}}async function Bl(n,e,t){re(t.type===Ia,n,"argument-error");let r=await t.verify();re(typeof r=="string",n,"argument-error");let s={...e};if("phoneEnrollmentInfo"in s){let i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,c=s.phoneEnrollmentInfo.clientType,u=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:r,captchaResponse:o,clientType:c,recaptchaVersion:u}}),s}else if("phoneSignInInfo"in s){let i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,c=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:i,clientType:o,recaptchaVersion:c}}),s}else return Object.assign(s,{recaptchaToken:r}),s}/**
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
 */var $i=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=vs(e)}verifyPhoneNumber(e,t){return mD(this.auth,e,Ue(t))}static credential(e,t){return ji._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?ji._fromTokenResponse(t,r):null}};$i.PROVIDER_ID="phone";$i.PHONE_SIGN_IN_METHOD="phone";/**
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
 */function eC(n,e){return e?Sn(e):(re(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */var Yi=class extends Vr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ts(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ts(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ts(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function ED(n){return Zy(n.auth,new Yi(n),n.bypassAuthState)}function _D(n){let{auth:e,user:t}=n;return re(t,e,"internal-error"),Xy(t,new Yi(n),n.bypassAuthState)}async function wD(n){let{auth:e,user:t}=n;return re(t,e,"internal-error"),Yy(t,new Yi(n),n.bypassAuthState)}/**
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
 */var Ha=class{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}let u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ED;case"linkViaPopup":case"linkViaRedirect":return wD;case"reauthViaPopup":case"reauthViaRedirect":return _D;default:Kt(this.auth,"internal-error")}}resolve(e){Rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
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
 */var yD=new Lr(2e3,1e4);async function Gl(n,e,t){if(Ot(n.app))return Promise.reject(en(n,"operation-not-supported-in-this-environment"));let r=vs(n);Cy(n,e,Ki);let s=eC(r,t);return new qa(r,"signInViaPopup",e,s).executeNotNull()}var qa=class n extends Ha{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return re(e,this.auth,"internal-error"),e}async onExecution(){Rn(this.filter.length===1,"Popup operations only handle one event");let e=Vl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(en(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(en(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(en(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,yD.get())};e()}};qa.currentPopupAction=null;/**
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
 */var DD="pendingRedirect",Ta=new Map,Tl=class extends Ha{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Ta.get(this.auth._key());if(!e){try{let r=await ID(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Ta.set(this.auth._key(),e)}return this.bypassAuthState||Ta.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function ID(n,e){let t=vD(e),r=AD(n);if(!await r._isAvailable())return!1;let s=await r._get(t)==="true";return await r._remove(t),s}function TD(n,e){Ta.set(n._key(),e)}function AD(n){return Sn(n._redirectPersistence)}function vD(n){return Da(DD,n.config.apiKey,n.name)}/**
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
 */async function bD(n,e,t=!1){if(Ot(n.app))return Promise.reject(xr(n));let r=vs(n),s=eC(r,e),o=await new Tl(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
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
 */var SD=600*1e3,Al=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!RD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!tC(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(en(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=SD&&this.cachedEventUids.clear(),this.cachedEventUids.has(Dg(e))}saveEventToCache(e){this.cachedEventUids.add(Dg(e)),this.lastProcessedEventTime=Date.now()}};function Dg(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function tC({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function RD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return tC(n);default:return!1}}/**
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
 */async function PD(n,e={}){return dt(n,"GET","/v1/projects",e)}/**
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
 */var ND=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,OD=/^https?/;async function kD(n){if(n.config.emulator)return;let{authorizedDomains:e}=await PD(n);for(let t of e)try{if(FD(t))return}catch{}Kt(n,"unauthorized-domain")}function FD(n){let e=dl(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!OD.test(t))return!1;if(ND.test(n))return r===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */var xD=new Lr(3e4,6e4);function Ig(){let n=Cn().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function LD(n){return new Promise((e,t)=>{function r(){Ig(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ig(),t(en(n,"network-request-failed"))},timeout:xD.get()})}if(Cn().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(Cn().gapi?.load)r();else{let s=zg("iframefcb");return Cn()[s]=()=>{gapi.load?r():t(en(n,"network-request-failed"))},Jg(`${xy()}?onload=${s}`).catch(i=>t(i))}}).catch(e=>{throw Aa=null,e})}var Aa=null;function VD(n){return Aa=Aa||LD(n),Aa}/**
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
 */var MD=new Lr(5e3,15e3),GD="__/auth/iframe",UD="emulator/auth/iframe",HD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},qD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function jD(n){let e=n.config;re(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?Pl(e,UD):`https://${n.config.authDomain}/${GD}`,r={apiKey:e.apiKey,appName:n.name,v:ur},s=qD.get(n.config.apiHost);s&&(r.eid=s);let i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${ys(r).slice(1)}`}async function KD(n){let e=await VD(n),t=Cn().gapi;return re(t,n,"internal-error"),e.open({where:document.body,url:jD(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:HD,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});let o=en(n,"network-request-failed"),c=Cn().setTimeout(()=>{i(o)},MD.get());function u(){Cn().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
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
 */var JD={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},zD=500,WD=600,QD="_blank",$D="http://localhost",ja=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function YD(n,e,t,r=zD,s=WD){let i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),c="",u={...JD,width:r.toString(),height:s.toString(),top:i,left:o},l=st().toLowerCase();t&&(c=Mg(l)?QD:t),Lg(l)&&(e=e||$D,u.scrollbars="yes");let h=Object.entries(u).reduce((g,[v,I])=>`${g}${v}=${I},`,"");if(Ry(l)&&c!=="_self")return XD(e||"",c),new ja(null);let f=window.open(e||"",c,h);re(f,n,"popup-blocked");try{f.focus()}catch{}return new ja(f)}function XD(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */var ZD="__/auth/handler",eI="emulator/auth/handler",tI=encodeURIComponent("fac");async function Tg(n,e,t,r,s,i){re(n.config.authDomain,n,"auth-domain-config-required"),re(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:ur,eventId:s};if(e instanceof Ki){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Wp(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[h,f]of Object.entries(i||{}))o[h]=f}if(e instanceof Gr){let h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);let c=o;for(let h of Object.keys(c))c[h]===void 0&&delete c[h];let u=await n._getAppCheckToken(),l=u?`#${tI}=${encodeURIComponent(u)}`:"";return`${nI(n)}?${ys(c).slice(1)}${l}`}function nI({config:n}){return n.emulator?Pl(n,eI):`https://${n.authDomain}/${ZD}`}/**
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
 */var hl="webStorageSupport",vl=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Qg,this._completeRedirectFn=bD,this._overrideRedirectResult=TD}async _openPopup(e,t,r,s){Rn(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let i=await Tg(e,t,r,dl(),s);return YD(e,i,Vl())}async _openRedirect(e,t,r,s){await this._originValidation(e);let i=await Tg(e,t,r,dl(),s);return aD(i),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Rn(i,"If manager is not set, promise should be"),i)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await KD(e),r=new Al(e);return t.register("authEvent",s=>(re(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(hl,{type:hl},s=>{let i=s?.[0]?.[hl];i!==void 0&&t(!!i),Kt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=kD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return jg()||Vg()||Ol()}},Ul=vl,Ka=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return gn("unexpected MultiFactorSessionType")}}},bl=class n extends Ka{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return eD(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return gD(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},Ja=class{constructor(){}static assertion(e){return bl._fromCredential(e)}};Ja.FACTOR_ID="phone";var za=class{static assertionForEnrollment(e,t){return Wa._fromSecret(e,t)}static assertionForSignIn(e,t){return Wa._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;re(typeof t.user?.auth<"u","internal-error");let r=await tD(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return Qa._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}};za.FACTOR_ID="totp";var Wa=class n extends Ka{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return re(typeof this.secret<"u",e,"argument-error"),nD(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){re(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return CD(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},Qa=class n{constructor(e,t,r,s,i,o,c){this.sessionInfo=o,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(_a(e)||_a(t))&&(r=!0),r&&(_a(e)&&(e=this.auth.currentUser?.email||"unknownuser"),_a(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function _a(n){return typeof n>"u"||n?.length===0}var Ag="@firebase/auth",vg="1.13.6";/**
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
 */var Sl=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){re(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};/**
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
 */function rI(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function sI(n){cr(new jt("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;re(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});let u={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kg(n)},l=new El(r,s,i,u);return My(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),cr(new jt("auth-internal",e=>{let t=vs(e.getProvider("auth").getImmediate());return(r=>new Sl(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Zt(Ag,vg,rI(n)),Zt(Ag,vg,"esm2020")}/**
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
 */var iI=300,Av=Mp("authIdTokenMaxAge")||iI;function oI(){return document.getElementsByTagName("head")?.[0]??document}ky({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{let i=en("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",oI().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});sI("Browser");var nC=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},rC={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Pn,Hl;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(b,m){function w(){}w.prototype=m.prototype,b.F=m.prototype,b.prototype=new w,b.prototype.constructor=b,b.D=function(A,D,y){for(var C=Array(arguments.length-2),te=2;te<arguments.length;te++)C[te-2]=arguments[te];return m.prototype[D].apply(A,C)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(b,m,w){w||(w=0);let A=Array(16);if(typeof m=="string")for(var D=0;D<16;++D)A[D]=m.charCodeAt(w++)|m.charCodeAt(w++)<<8|m.charCodeAt(w++)<<16|m.charCodeAt(w++)<<24;else for(D=0;D<16;++D)A[D]=m[w++]|m[w++]<<8|m[w++]<<16|m[w++]<<24;m=b.g[0],w=b.g[1],D=b.g[2];let y=b.g[3],C;C=m+(y^w&(D^y))+A[0]+3614090360&4294967295,m=w+(C<<7&4294967295|C>>>25),C=y+(D^m&(w^D))+A[1]+3905402710&4294967295,y=m+(C<<12&4294967295|C>>>20),C=D+(w^y&(m^w))+A[2]+606105819&4294967295,D=y+(C<<17&4294967295|C>>>15),C=w+(m^D&(y^m))+A[3]+3250441966&4294967295,w=D+(C<<22&4294967295|C>>>10),C=m+(y^w&(D^y))+A[4]+4118548399&4294967295,m=w+(C<<7&4294967295|C>>>25),C=y+(D^m&(w^D))+A[5]+1200080426&4294967295,y=m+(C<<12&4294967295|C>>>20),C=D+(w^y&(m^w))+A[6]+2821735955&4294967295,D=y+(C<<17&4294967295|C>>>15),C=w+(m^D&(y^m))+A[7]+4249261313&4294967295,w=D+(C<<22&4294967295|C>>>10),C=m+(y^w&(D^y))+A[8]+1770035416&4294967295,m=w+(C<<7&4294967295|C>>>25),C=y+(D^m&(w^D))+A[9]+2336552879&4294967295,y=m+(C<<12&4294967295|C>>>20),C=D+(w^y&(m^w))+A[10]+4294925233&4294967295,D=y+(C<<17&4294967295|C>>>15),C=w+(m^D&(y^m))+A[11]+2304563134&4294967295,w=D+(C<<22&4294967295|C>>>10),C=m+(y^w&(D^y))+A[12]+1804603682&4294967295,m=w+(C<<7&4294967295|C>>>25),C=y+(D^m&(w^D))+A[13]+4254626195&4294967295,y=m+(C<<12&4294967295|C>>>20),C=D+(w^y&(m^w))+A[14]+2792965006&4294967295,D=y+(C<<17&4294967295|C>>>15),C=w+(m^D&(y^m))+A[15]+1236535329&4294967295,w=D+(C<<22&4294967295|C>>>10),C=m+(D^y&(w^D))+A[1]+4129170786&4294967295,m=w+(C<<5&4294967295|C>>>27),C=y+(w^D&(m^w))+A[6]+3225465664&4294967295,y=m+(C<<9&4294967295|C>>>23),C=D+(m^w&(y^m))+A[11]+643717713&4294967295,D=y+(C<<14&4294967295|C>>>18),C=w+(y^m&(D^y))+A[0]+3921069994&4294967295,w=D+(C<<20&4294967295|C>>>12),C=m+(D^y&(w^D))+A[5]+3593408605&4294967295,m=w+(C<<5&4294967295|C>>>27),C=y+(w^D&(m^w))+A[10]+38016083&4294967295,y=m+(C<<9&4294967295|C>>>23),C=D+(m^w&(y^m))+A[15]+3634488961&4294967295,D=y+(C<<14&4294967295|C>>>18),C=w+(y^m&(D^y))+A[4]+3889429448&4294967295,w=D+(C<<20&4294967295|C>>>12),C=m+(D^y&(w^D))+A[9]+568446438&4294967295,m=w+(C<<5&4294967295|C>>>27),C=y+(w^D&(m^w))+A[14]+3275163606&4294967295,y=m+(C<<9&4294967295|C>>>23),C=D+(m^w&(y^m))+A[3]+4107603335&4294967295,D=y+(C<<14&4294967295|C>>>18),C=w+(y^m&(D^y))+A[8]+1163531501&4294967295,w=D+(C<<20&4294967295|C>>>12),C=m+(D^y&(w^D))+A[13]+2850285829&4294967295,m=w+(C<<5&4294967295|C>>>27),C=y+(w^D&(m^w))+A[2]+4243563512&4294967295,y=m+(C<<9&4294967295|C>>>23),C=D+(m^w&(y^m))+A[7]+1735328473&4294967295,D=y+(C<<14&4294967295|C>>>18),C=w+(y^m&(D^y))+A[12]+2368359562&4294967295,w=D+(C<<20&4294967295|C>>>12),C=m+(w^D^y)+A[5]+4294588738&4294967295,m=w+(C<<4&4294967295|C>>>28),C=y+(m^w^D)+A[8]+2272392833&4294967295,y=m+(C<<11&4294967295|C>>>21),C=D+(y^m^w)+A[11]+1839030562&4294967295,D=y+(C<<16&4294967295|C>>>16),C=w+(D^y^m)+A[14]+4259657740&4294967295,w=D+(C<<23&4294967295|C>>>9),C=m+(w^D^y)+A[1]+2763975236&4294967295,m=w+(C<<4&4294967295|C>>>28),C=y+(m^w^D)+A[4]+1272893353&4294967295,y=m+(C<<11&4294967295|C>>>21),C=D+(y^m^w)+A[7]+4139469664&4294967295,D=y+(C<<16&4294967295|C>>>16),C=w+(D^y^m)+A[10]+3200236656&4294967295,w=D+(C<<23&4294967295|C>>>9),C=m+(w^D^y)+A[13]+681279174&4294967295,m=w+(C<<4&4294967295|C>>>28),C=y+(m^w^D)+A[0]+3936430074&4294967295,y=m+(C<<11&4294967295|C>>>21),C=D+(y^m^w)+A[3]+3572445317&4294967295,D=y+(C<<16&4294967295|C>>>16),C=w+(D^y^m)+A[6]+76029189&4294967295,w=D+(C<<23&4294967295|C>>>9),C=m+(w^D^y)+A[9]+3654602809&4294967295,m=w+(C<<4&4294967295|C>>>28),C=y+(m^w^D)+A[12]+3873151461&4294967295,y=m+(C<<11&4294967295|C>>>21),C=D+(y^m^w)+A[15]+530742520&4294967295,D=y+(C<<16&4294967295|C>>>16),C=w+(D^y^m)+A[2]+3299628645&4294967295,w=D+(C<<23&4294967295|C>>>9),C=m+(D^(w|~y))+A[0]+4096336452&4294967295,m=w+(C<<6&4294967295|C>>>26),C=y+(w^(m|~D))+A[7]+1126891415&4294967295,y=m+(C<<10&4294967295|C>>>22),C=D+(m^(y|~w))+A[14]+2878612391&4294967295,D=y+(C<<15&4294967295|C>>>17),C=w+(y^(D|~m))+A[5]+4237533241&4294967295,w=D+(C<<21&4294967295|C>>>11),C=m+(D^(w|~y))+A[12]+1700485571&4294967295,m=w+(C<<6&4294967295|C>>>26),C=y+(w^(m|~D))+A[3]+2399980690&4294967295,y=m+(C<<10&4294967295|C>>>22),C=D+(m^(y|~w))+A[10]+4293915773&4294967295,D=y+(C<<15&4294967295|C>>>17),C=w+(y^(D|~m))+A[1]+2240044497&4294967295,w=D+(C<<21&4294967295|C>>>11),C=m+(D^(w|~y))+A[8]+1873313359&4294967295,m=w+(C<<6&4294967295|C>>>26),C=y+(w^(m|~D))+A[15]+4264355552&4294967295,y=m+(C<<10&4294967295|C>>>22),C=D+(m^(y|~w))+A[6]+2734768916&4294967295,D=y+(C<<15&4294967295|C>>>17),C=w+(y^(D|~m))+A[13]+1309151649&4294967295,w=D+(C<<21&4294967295|C>>>11),C=m+(D^(w|~y))+A[4]+4149444226&4294967295,m=w+(C<<6&4294967295|C>>>26),C=y+(w^(m|~D))+A[11]+3174756917&4294967295,y=m+(C<<10&4294967295|C>>>22),C=D+(m^(y|~w))+A[2]+718787259&4294967295,D=y+(C<<15&4294967295|C>>>17),C=w+(y^(D|~m))+A[9]+3951481745&4294967295,b.g[0]=b.g[0]+m&4294967295,b.g[1]=b.g[1]+(D+(C<<21&4294967295|C>>>11))&4294967295,b.g[2]=b.g[2]+D&4294967295,b.g[3]=b.g[3]+y&4294967295}r.prototype.v=function(b,m){m===void 0&&(m=b.length);let w=m-this.blockSize,A=this.C,D=this.h,y=0;for(;y<m;){if(D==0)for(;y<=w;)s(this,b,y),y+=this.blockSize;if(typeof b=="string"){for(;y<m;)if(A[D++]=b.charCodeAt(y++),D==this.blockSize){s(this,A),D=0;break}}else for(;y<m;)if(A[D++]=b[y++],D==this.blockSize){s(this,A),D=0;break}}this.h=D,this.o+=m},r.prototype.A=function(){var b=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);b[0]=128;for(var m=1;m<b.length-8;++m)b[m]=0;m=this.o*8;for(var w=b.length-8;w<b.length;++w)b[w]=m&255,m/=256;for(this.v(b),b=Array(16),m=0,w=0;w<4;++w)for(let A=0;A<32;A+=8)b[m++]=this.g[w]>>>A&255;return b};function i(b,m){var w=c;return Object.prototype.hasOwnProperty.call(w,b)?w[b]:w[b]=m(b)}function o(b,m){this.h=m;let w=[],A=!0;for(let D=b.length-1;D>=0;D--){let y=b[D]|0;A&&y==m||(w[D]=y,A=!1)}this.g=w}var c={};function u(b){return-128<=b&&b<128?i(b,function(m){return new o([m|0],m<0?-1:0)}):new o([b|0],b<0?-1:0)}function l(b){if(isNaN(b)||!isFinite(b))return f;if(b<0)return U(l(-b));let m=[],w=1;for(let A=0;b>=w;A++)m[A]=b/w|0,w*=4294967296;return new o(m,0)}function h(b,m){if(b.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(b.charAt(0)=="-")return U(h(b.substring(1),m));if(b.indexOf("-")>=0)throw Error('number format error: interior "-" character');let w=l(Math.pow(m,8)),A=f;for(let y=0;y<b.length;y+=8){var D=Math.min(8,b.length-y);let C=parseInt(b.substring(y,y+D),m);D<8?(D=l(Math.pow(m,D)),A=A.j(D).add(l(C))):(A=A.j(w),A=A.add(l(C)))}return A}var f=u(0),g=u(1),v=u(16777216);n=o.prototype,n.m=function(){if(S(this))return-U(this).m();let b=0,m=1;for(let w=0;w<this.g.length;w++){let A=this.i(w);b+=(A>=0?A:4294967296+A)*m,m*=4294967296}return b},n.toString=function(b){if(b=b||10,b<2||36<b)throw Error("radix out of range: "+b);if(I(this))return"0";if(S(this))return"-"+U(this).toString(b);let m=l(Math.pow(b,6));var w=this;let A="";for(;;){let D=Ce(w,m).g;w=H(w,D.j(m));let y=((w.g.length>0?w.g[0]:w.h)>>>0).toString(b);if(w=D,I(w))return y+A;for(;y.length<6;)y="0"+y;A=y+A}},n.i=function(b){return b<0?0:b<this.g.length?this.g[b]:this.h};function I(b){if(b.h!=0)return!1;for(let m=0;m<b.g.length;m++)if(b.g[m]!=0)return!1;return!0}function S(b){return b.h==-1}n.l=function(b){return b=H(this,b),S(b)?-1:I(b)?0:1};function U(b){let m=b.g.length,w=[];for(let A=0;A<m;A++)w[A]=~b.g[A];return new o(w,~b.h).add(g)}n.abs=function(){return S(this)?U(this):this},n.add=function(b){let m=Math.max(this.g.length,b.g.length),w=[],A=0;for(let D=0;D<=m;D++){let y=A+(this.i(D)&65535)+(b.i(D)&65535),C=(y>>>16)+(this.i(D)>>>16)+(b.i(D)>>>16);A=C>>>16,y&=65535,C&=65535,w[D]=C<<16|y}return new o(w,w[w.length-1]&-2147483648?-1:0)};function H(b,m){return b.add(U(m))}n.j=function(b){if(I(this)||I(b))return f;if(S(this))return S(b)?U(this).j(U(b)):U(U(this).j(b));if(S(b))return U(this.j(U(b)));if(this.l(v)<0&&b.l(v)<0)return l(this.m()*b.m());let m=this.g.length+b.g.length,w=[];for(var A=0;A<2*m;A++)w[A]=0;for(A=0;A<this.g.length;A++)for(let D=0;D<b.g.length;D++){let y=this.i(A)>>>16,C=this.i(A)&65535,te=b.i(D)>>>16,le=b.i(D)&65535;w[2*A+2*D]+=C*le,se(w,2*A+2*D),w[2*A+2*D+1]+=y*le,se(w,2*A+2*D+1),w[2*A+2*D+1]+=C*te,se(w,2*A+2*D+1),w[2*A+2*D+2]+=y*te,se(w,2*A+2*D+2)}for(b=0;b<m;b++)w[b]=w[2*b+1]<<16|w[2*b];for(b=m;b<2*m;b++)w[b]=0;return new o(w,0)};function se(b,m){for(;(b[m]&65535)!=b[m];)b[m+1]+=b[m]>>>16,b[m]&=65535,m++}function De(b,m){this.g=b,this.h=m}function Ce(b,m){if(I(m))throw Error("division by zero");if(I(b))return new De(f,f);if(S(b))return m=Ce(U(b),m),new De(U(m.g),U(m.h));if(S(m))return m=Ce(b,U(m)),new De(U(m.g),m.h);if(b.g.length>30){if(S(b)||S(m))throw Error("slowDivide_ only works with positive integers.");for(var w=g,A=m;A.l(b)<=0;)w=Pe(w),A=Pe(A);var D=Ie(w,1),y=Ie(A,1);for(A=Ie(A,2),w=Ie(w,2);!I(A);){var C=y.add(A);C.l(b)<=0&&(D=D.add(w),y=C),A=Ie(A,1),w=Ie(w,1)}return m=H(b,D.j(m)),new De(D,m)}for(D=f;b.l(m)>=0;){for(w=Math.max(1,Math.floor(b.m()/m.m())),A=Math.ceil(Math.log(w)/Math.LN2),A=A<=48?1:Math.pow(2,A-48),y=l(w),C=y.j(m);S(C)||C.l(b)>0;)w-=A,y=l(w),C=y.j(m);I(y)&&(y=g),D=D.add(y),b=H(b,C)}return new De(D,b)}n.B=function(b){return Ce(this,b).h},n.and=function(b){let m=Math.max(this.g.length,b.g.length),w=[];for(let A=0;A<m;A++)w[A]=this.i(A)&b.i(A);return new o(w,this.h&b.h)},n.or=function(b){let m=Math.max(this.g.length,b.g.length),w=[];for(let A=0;A<m;A++)w[A]=this.i(A)|b.i(A);return new o(w,this.h|b.h)},n.xor=function(b){let m=Math.max(this.g.length,b.g.length),w=[];for(let A=0;A<m;A++)w[A]=this.i(A)^b.i(A);return new o(w,this.h^b.h)};function Pe(b){let m=b.g.length+1,w=[];for(let A=0;A<m;A++)w[A]=b.i(A)<<1|b.i(A-1)>>>31;return new o(w,b.h)}function Ie(b,m){let w=m>>5;m%=32;let A=b.g.length-w,D=[];for(let y=0;y<A;y++)D[y]=m>0?b.i(y+w)>>>m|b.i(y+w+1)<<32-m:b.i(y+w);return new o(D,b.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Hl=rC.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=h,Pn=rC.Integer=o}).apply(typeof nC<"u"?nC:typeof self<"u"?self:typeof window<"u"?window:{});var Za=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Nn={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ql,aI,bs,jl,Xi,ec,Kl,Jl,zl;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Za=="object"&&Za];for(var B=0;B<a.length;++B){var d=a[B];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(a,B){if(B)e:{var d=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var P=a[p];if(!(P in d))break e;d=d[P]}a=a[a.length-1],p=d[a],B=B(p),B!=p&&B!=null&&e(d,a,{configurable:!0,writable:!0,value:B})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(B){var d=[],p;for(p in B)Object.prototype.hasOwnProperty.call(B,p)&&d.push([p,B[p]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var B=typeof a;return B=="object"&&a!=null||B=="function"}function u(a,B,d){return a.call.apply(a.bind,arguments)}function l(a,B,d){return l=u,l.apply(null,arguments)}function h(a,B){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function f(a,B){function d(){}d.prototype=B.prototype,a.Z=B.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(p,P,N){for(var K=Array(arguments.length-2),de=2;de<arguments.length;de++)K[de-2]=arguments[de];return B.prototype[P].apply(p,K)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){let B=a.length;if(B>0){let d=Array(B);for(let p=0;p<B;p++)d[p]=a[p];return d}return[]}function I(a,B){for(let p=1;p<arguments.length;p++){let P=arguments[p];var d=typeof P;if(d=d!="object"?d:P?Array.isArray(P)?"array":d:"null",d=="array"||d=="object"&&typeof P.length=="number"){d=a.length||0;let N=P.length||0;a.length=d+N;for(let K=0;K<N;K++)a[d+K]=P[K]}else a.push(P)}}class S{constructor(B,d){this.i=B,this.j=d,this.h=0,this.g=null}get(){let B;return this.h>0?(this.h--,B=this.g,this.g=B.next,B.next=null):B=this.i(),B}}function U(a){o.setTimeout(()=>{throw a},0)}function H(){var a=b;let B=null;return a.g&&(B=a.g,a.g=a.g.next,a.g||(a.h=null),B.next=null),B}class se{constructor(){this.h=this.g=null}add(B,d){let p=De.get();p.set(B,d),this.h?this.h.next=p:this.g=p,this.h=p}}var De=new S(()=>new Ce,a=>a.reset());class Ce{constructor(){this.next=this.g=this.h=null}set(B,d){this.h=B,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Pe,Ie=!1,b=new se,m=()=>{let a=Promise.resolve(void 0);Pe=()=>{a.then(w)}};function w(){for(var a;a=H();){try{a.h.call(a.g)}catch(d){U(d)}var B=De;B.j(a),B.h<100&&(B.h++,a.next=B.g,B.g=a)}Ie=!1}function A(){this.u=this.u,this.C=this.C}A.prototype.u=!1,A.prototype.dispose=function(){this.u||(this.u=!0,this.N())},A.prototype[Symbol.dispose]=function(){this.dispose()},A.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function D(a,B){this.type=a,this.g=this.target=B,this.defaultPrevented=!1}D.prototype.h=function(){this.defaultPrevented=!0};var y=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,B=Object.defineProperty({},"passive",{get:function(){a=!0}});try{let d=()=>{};o.addEventListener("test",d,B),o.removeEventListener("test",d,B)}catch{}return a})();function C(a){return/^[\s\xa0]*$/.test(a)}function te(a,B){D.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,B)}f(te,D),te.prototype.init=function(a,B){let d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=B,B=a.relatedTarget,B||(d=="mouseover"?B=a.fromElement:d=="mouseout"&&(B=a.toElement)),this.relatedTarget=B,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&te.Z.h.call(this)},te.prototype.h=function(){te.Z.h.call(this);let a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var le="closure_listenable_"+(Math.random()*1e6|0),fe=0;function Te(a,B,d,p,P){this.listener=a,this.proxy=null,this.src=B,this.type=d,this.capture=!!p,this.ha=P,this.key=++fe,this.da=this.fa=!1}function Fe(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Je(a,B,d){for(let p in a)B.call(d,a[p],p,a)}function Bn(a,B){for(let d in a)B.call(void 0,a[d],d,a)}function V(a){let B={};for(let d in a)B[d]=a[d];return B}let M="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function W(a,B){let d,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(d in p)a[d]=p[d];for(let N=0;N<M.length;N++)d=M[N],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function Q(a){this.src=a,this.g={},this.h=0}Q.prototype.add=function(a,B,d,p,P){let N=a.toString();a=this.g[N],a||(a=this.g[N]=[],this.h++);let K=ie(a,B,p,P);return K>-1?(B=a[K],d||(B.fa=!1)):(B=new Te(B,this.src,N,!!p,P),B.fa=d,a.push(B)),B};function ce(a,B){let d=B.type;if(d in a.g){var p=a.g[d],P=Array.prototype.indexOf.call(p,B,void 0),N;(N=P>=0)&&Array.prototype.splice.call(p,P,1),N&&(Fe(B),a.g[d].length==0&&(delete a.g[d],a.h--))}}function ie(a,B,d,p){for(let P=0;P<a.length;++P){let N=a[P];if(!N.da&&N.listener==B&&N.capture==!!d&&N.ha==p)return P}return-1}var ee="closure_lm_"+(Math.random()*1e6|0),ge={};function be(a,B,d,p,P){if(Array.isArray(B)){for(let N=0;N<B.length;N++)be(a,B[N],d,p,P);return null}return d=Tn(d),a&&a[le]?a.J(B,d,c(p)?!!p.capture:!1,P):he(a,B,d,!1,p,P)}function he(a,B,d,p,P,N){if(!B)throw Error("Invalid event type");let K=c(P)?!!P.capture:!!P,de=qt(a);if(de||(a[ee]=de=new Q(a)),d=de.add(B,d,p,K,N),d.proxy)return d;if(p=xe(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)y||(P=K),P===void 0&&(P=!1),a.addEventListener(B.toString(),p,P);else if(a.attachEvent)a.attachEvent(Ht(B.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function xe(){function a(d){return B.call(a.src,a.listener,d)}let B=In;return a}function Le(a,B,d,p,P){if(Array.isArray(B))for(var N=0;N<B.length;N++)Le(a,B[N],d,p,P);else p=c(p)?!!p.capture:!!p,d=Tn(d),a&&a[le]?(a=a.i,N=String(B).toString(),N in a.g&&(B=a.g[N],d=ie(B,d,p,P),d>-1&&(Fe(B[d]),Array.prototype.splice.call(B,d,1),B.length==0&&(delete a.g[N],a.h--)))):a&&(a=qt(a))&&(B=a.g[B.toString()],a=-1,B&&(a=ie(B,d,p,P)),(d=a>-1?B[a]:null)&&ut(d))}function ut(a){if(typeof a!="number"&&a&&!a.da){var B=a.src;if(B&&B[le])ce(B.i,a);else{var d=a.type,p=a.proxy;B.removeEventListener?B.removeEventListener(d,p,a.capture):B.detachEvent?B.detachEvent(Ht(d),p):B.addListener&&B.removeListener&&B.removeListener(p),(d=qt(B))?(ce(d,a),d.h==0&&(d.src=null,B[ee]=null)):Fe(a)}}}function Ht(a){return a in ge?ge[a]:ge[a]="on"+a}function In(a,B){if(a.da)a=!0;else{B=new te(B,this);let d=a.listener,p=a.ha||a.src;a.fa&&ut(a),a=d.call(p,B)}return a}function qt(a){return a=a[ee],a instanceof Q?a:null}var br="__closure_events_fn_"+(Math.random()*1e9>>>0);function Tn(a){return typeof a=="function"?a:(a[br]||(a[br]=function(B){return a.handleEvent(B)}),a[br])}function ht(){A.call(this),this.i=new Q(this),this.M=this,this.G=null}f(ht,A),ht.prototype[le]=!0,ht.prototype.removeEventListener=function(a,B,d,p){Le(this,a,B,d,p)};function mt(a,B){var d,p=a.G;if(p)for(d=[];p;p=p.G)d.push(p);if(a=a.M,p=B.type||B,typeof B=="string")B=new D(B,a);else if(B instanceof D)B.target=B.target||a;else{var P=B;B=new D(p,a),W(B,P)}P=!0;let N,K;if(d)for(K=d.length-1;K>=0;K--)N=B.g=d[K],P=na(N,p,!0,B)&&P;if(N=B.g=a,P=na(N,p,!0,B)&&P,P=na(N,p,!1,B)&&P,d)for(K=0;K<d.length;K++)N=B.g=d[K],P=na(N,p,!1,B)&&P}ht.prototype.N=function(){if(ht.Z.N.call(this),this.i){var a=this.i;for(let B in a.g){let d=a.g[B];for(let p=0;p<d.length;p++)Fe(d[p]);delete a.g[B],a.h--}}this.G=null},ht.prototype.J=function(a,B,d,p){return this.i.add(String(a),B,!1,d,p)},ht.prototype.K=function(a,B,d,p){return this.i.add(String(a),B,!0,d,p)};function na(a,B,d,p){if(B=a.i.g[String(B)],!B)return!0;B=B.concat();let P=!0;for(let N=0;N<B.length;++N){let K=B[N];if(K&&!K.da&&K.capture==d){let de=K.listener,Ze=K.ha||K.src;K.fa&&ce(a.i,K),P=de.call(Ze,p)!==!1&&P}}return P&&!p.defaultPrevented}function F_(a,B){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(B)>2147483647?-1:o.setTimeout(a,B||0)}function Vf(a){a.g=F_(()=>{a.g=null,a.i&&(a.i=!1,Vf(a))},a.l);let B=a.h;a.h=null,a.m.apply(null,B)}class x_ extends A{constructor(B,d){super(),this.m=B,this.l=d,this.h=null,this.i=!1,this.g=null}j(B){this.h=arguments,this.g?this.i=!0:Vf(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function di(a){A.call(this),this.h=a,this.g={}}f(di,A);var Mf=[];function Gf(a){Je(a.g,function(B,d){this.g.hasOwnProperty(d)&&ut(B)},a),a.g={}}di.prototype.N=function(){di.Z.N.call(this),Gf(this)},di.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Tu=o.JSON.stringify,L_=o.JSON.parse,V_=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Uf(){}function Hf(){}var fi={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Au(){D.call(this,"d")}f(Au,D);function vu(){D.call(this,"c")}f(vu,D);var Sr={},qf=null;function ra(){return qf=qf||new ht}Sr.Ia="serverreachability";function jf(a){D.call(this,Sr.Ia,a)}f(jf,D);function pi(a){let B=ra();mt(B,new jf(B))}Sr.STAT_EVENT="statevent";function Kf(a,B){D.call(this,Sr.STAT_EVENT,a),this.stat=B}f(Kf,D);function Et(a){let B=ra();mt(B,new Kf(B,a))}Sr.Ja="timingevent";function Jf(a,B){D.call(this,Sr.Ja,a),this.size=B}f(Jf,D);function gi(a,B){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},B)}function Ci(){this.g=!0}Ci.prototype.ua=function(){this.g=!1};function M_(a,B,d,p,P,N){a.info(function(){if(a.g)if(N){var K="",de=N.split("&");for(let Se=0;Se<de.length;Se++){var Ze=de[Se].split("=");if(Ze.length>1){let rt=Ze[0];Ze=Ze[1];let dn=rt.split("_");K=dn.length>=2&&dn[1]=="type"?K+(rt+"="+Ze+"&"):K+(rt+"=redacted&")}}}else K=null;else K=N;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+B+`
`+d+`
`+K})}function G_(a,B,d,p,P,N,K){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+B+`
`+d+`
`+N+" "+K})}function ms(a,B,d,p){a.info(function(){return"XMLHTTP TEXT ("+B+"): "+H_(a,d)+(p?" "+p:"")})}function U_(a,B){a.info(function(){return"TIMEOUT: "+B})}Ci.prototype.info=function(){};function H_(a,B){if(!a.g)return B;if(!B)return null;try{let N=JSON.parse(B);if(N){for(a=0;a<N.length;a++)if(Array.isArray(N[a])){var d=N[a];if(!(d.length<2)){var p=d[1];if(Array.isArray(p)&&!(p.length<1)){var P=p[0];if(P!="noop"&&P!="stop"&&P!="close")for(let K=1;K<p.length;K++)p[K]=""}}}}return Tu(N)}catch{return B}}var sa={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},zf={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Wf;function bu(){}f(bu,Uf),bu.prototype.g=function(){return new XMLHttpRequest},Wf=new bu;function mi(a){return encodeURIComponent(String(a))}function q_(a){var B=1;a=a.split(":");let d=[];for(;B>0&&a.length;)d.push(a.shift()),B--;return a.length&&d.push(a.join(":")),d}function tr(a,B,d,p){this.j=a,this.i=B,this.l=d,this.S=p||1,this.V=new di(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Qf}function Qf(){this.i=null,this.g="",this.h=!1}var $f={},Su={};function Ru(a,B,d){a.M=1,a.A=oa(hn(B)),a.u=d,a.R=!0,Yf(a,null)}function Yf(a,B){a.F=Date.now(),ia(a),a.B=hn(a.A);var d=a.B,p=a.S;Array.isArray(p)||(p=[String(p)]),lp(d.i,"t",p),a.C=0,d=a.j.L,a.h=new Qf,a.g=bp(a.j,d?B:null,!a.u),a.P>0&&(a.O=new x_(l(a.Y,a,a.g),a.P)),B=a.V,d=a.g,p=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(Mf[0]=P.toString()),P=Mf);for(let N=0;N<P.length;N++){let K=be(d,P[N],p||B.handleEvent,!1,B.h||B);if(!K)break;B.g[K.key]=K}B=a.J?V(a.J):{},a.u?(a.v||(a.v="POST"),B["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,B)):(a.v="GET",a.g.ea(a.B,a.v,null,B)),pi(),M_(a.i,a.v,a.B,a.l,a.S,a.u)}tr.prototype.ba=function(a){a=a.target;let B=this.O;B&&sr(a)==3?B.j():this.Y(a)},tr.prototype.Y=function(a){try{if(a==this.g)e:{let de=sr(this.g),Ze=this.g.ya(),Se=this.g.ca();if(!(de<3)&&(de!=3||this.g&&(this.h.h||this.g.la()||Cp(this.g)))){this.K||de!=4||Ze==7||(Ze==8||Se<=0?pi(3):pi(2)),Pu(this);var B=this.g.ca();this.X=B;var d=j_(this);if(this.o=B==200,G_(this.i,this.v,this.B,this.l,this.S,de,B),this.o){if(this.U&&!this.L){t:{if(this.g){var p,P=this.g;if((p=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(p)){var N=p;break t}}N=null}if(a=N)ms(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Nu(this,a);else{this.o=!1,this.m=3,Et(12),Rr(this),Ei(this);break e}}if(this.R){a=!0;let rt;for(;!this.K&&this.C<d.length;)if(rt=K_(this,d),rt==Su){de==4&&(this.m=4,Et(14),a=!1),ms(this.i,this.l,null,"[Incomplete Response]");break}else if(rt==$f){this.m=4,Et(15),ms(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else ms(this.i,this.l,rt,null),Nu(this,rt);if(Xf(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),de!=4||d.length!=0||this.h.h||(this.m=1,Et(16),a=!1),this.o=this.o&&a,!a)ms(this.i,this.l,d,"[Invalid Chunked Response]"),Rr(this),Ei(this);else if(d.length>0&&!this.W){this.W=!0;var K=this.j;K.g==this&&K.aa&&!K.P&&(K.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Mu(K),K.P=!0,Et(11))}}else ms(this.i,this.l,d,null),Nu(this,d);de==4&&Rr(this),this.o&&!this.K&&(de==4?Ip(this.j,this):(this.o=!1,ia(this)))}else iw(this.g),B==400&&d.indexOf("Unknown SID")>0?(this.m=3,Et(12)):(this.m=0,Et(13)),Rr(this),Ei(this)}}}catch{}};function j_(a){if(!Xf(a))return a.g.la();let B=Cp(a.g);if(B==="")return"";let d="",p=B.length,P=sr(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Rr(a),Ei(a),"";a.h.i=new o.TextDecoder}for(let N=0;N<p;N++)a.h.h=!0,d+=a.h.i.decode(B[N],{stream:!(P&&N==p-1)});return B.length=0,a.h.g+=d,a.C=0,a.h.g}function Xf(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function K_(a,B){var d=a.C,p=B.indexOf(`
`,d);return p==-1?Su:(d=Number(B.substring(d,p)),isNaN(d)?$f:(p+=1,p+d>B.length?Su:(B=B.slice(p,p+d),a.C=p+d,B)))}tr.prototype.cancel=function(){this.K=!0,Rr(this)};function ia(a){a.T=Date.now()+a.H,Zf(a,a.H)}function Zf(a,B){if(a.D!=null)throw Error("WatchDog timer not null");a.D=gi(l(a.aa,a),B)}function Pu(a){a.D&&(o.clearTimeout(a.D),a.D=null)}tr.prototype.aa=function(){this.D=null;let a=Date.now();a-this.T>=0?(U_(this.i,this.B),this.M!=2&&(pi(),Et(17)),Rr(this),this.m=2,Ei(this)):Zf(this,this.T-a)};function Ei(a){a.j.I==0||a.K||Ip(a.j,a)}function Rr(a){Pu(a);var B=a.O;B&&typeof B.dispose=="function"&&B.dispose(),a.O=null,Gf(a.V),a.g&&(B=a.g,a.g=null,B.abort(),B.dispose())}function Nu(a,B){try{var d=a.j;if(d.I!=0&&(d.g==a||Ou(d.h,a))){if(!a.L&&Ou(d.h,a)&&d.I==3){try{var p=d.Ba.g.parse(B)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)ha(d),la(d);else break e;Vu(d),Et(18)}}else d.xa=P[1],0<d.xa-d.K&&P[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=gi(l(d.Va,d),6e3));np(d.h)<=1&&d.ta&&(d.ta=void 0)}else Nr(d,11)}else if((a.L||d.g==a)&&ha(d),!C(B))for(P=d.Ba.g.parse(B),B=0;B<P.length;B++){let Se=P[B],rt=Se[0];if(!(rt<=d.K))if(d.K=rt,Se=Se[1],d.I==2)if(Se[0]=="c"){d.M=Se[1],d.ba=Se[2];let dn=Se[3];dn!=null&&(d.ka=dn,d.j.info("VER="+d.ka));let Or=Se[4];Or!=null&&(d.za=Or,d.j.info("SVER="+d.za));let ir=Se[5];ir!=null&&typeof ir=="number"&&ir>0&&(p=1.5*ir,d.O=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;let or=a.g;if(or){let fa=or.g?or.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(fa){var N=p.h;N.g||fa.indexOf("spdy")==-1&&fa.indexOf("quic")==-1&&fa.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(ku(N,N.h),N.h=null))}if(p.G){let Gu=or.g?or.g.getResponseHeader("X-HTTP-Session-Id"):null;Gu&&(p.wa=Gu,Ve(p.J,p.G,Gu))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),p=d;var K=a;if(p.na=vp(p,p.L?p.ba:null,p.W),K.L){rp(p.h,K);var de=K,Ze=p.O;Ze&&(de.H=Ze),de.D&&(Pu(de),ia(de)),p.g=K}else yp(p);d.i.length>0&&Ba(d)}else Se[0]!="stop"&&Se[0]!="close"||Nr(d,7);else d.I==3&&(Se[0]=="stop"||Se[0]=="close"?Se[0]=="stop"?Nr(d,7):Lu(d):Se[0]!="noop"&&d.l&&d.l.qa(Se),d.A=0)}}pi(4)}catch{}}var J_=class{constructor(a,B){this.g=a,this.map=B}};function ep(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function tp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function np(a){return a.h?1:a.g?a.g.size:0}function Ou(a,B){return a.h?a.h==B:a.g?a.g.has(B):!1}function ku(a,B){a.g?a.g.add(B):a.h=B}function rp(a,B){a.h&&a.h==B?a.h=null:a.g&&a.g.has(B)&&a.g.delete(B)}ep.prototype.cancel=function(){if(this.i=sp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let a of this.g.values())a.cancel();this.g.clear()}};function sp(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let B=a.i;for(let d of a.g.values())B=B.concat(d.G);return B}return v(a.i)}var ip=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function z_(a,B){if(a){a=a.split("&");for(let d=0;d<a.length;d++){let p=a[d].indexOf("="),P,N=null;p>=0?(P=a[d].substring(0,p),N=a[d].substring(p+1)):P=a[d],B(P,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function nr(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let B;a instanceof nr?(this.l=a.l,_i(this,a.j),this.o=a.o,this.g=a.g,wi(this,a.u),this.h=a.h,Fu(this,Bp(a.i)),this.m=a.m):a&&(B=String(a).match(ip))?(this.l=!1,_i(this,B[1]||"",!0),this.o=yi(B[2]||""),this.g=yi(B[3]||"",!0),wi(this,B[4]),this.h=yi(B[5]||"",!0),Fu(this,B[6]||"",!0),this.m=yi(B[7]||"")):(this.l=!1,this.i=new Ii(null,this.l))}nr.prototype.toString=function(){let a=[];var B=this.j;B&&a.push(Di(B,op,!0),":");var d=this.g;return(d||B=="file")&&(a.push("//"),(B=this.o)&&a.push(Di(B,op,!0),"@"),a.push(mi(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Di(d,d.charAt(0)=="/"?$_:Q_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Di(d,X_)),a.join("")},nr.prototype.resolve=function(a){let B=hn(this),d=!!a.j;d?_i(B,a.j):d=!!a.o,d?B.o=a.o:d=!!a.g,d?B.g=a.g:d=a.u!=null;var p=a.h;if(d)wi(B,a.u);else if(d=!!a.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var P=B.h.lastIndexOf("/");P!=-1&&(p=B.h.slice(0,P+1)+p)}if(P=p,P==".."||P==".")p="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){p=P.lastIndexOf("/",0)==0,P=P.split("/");let N=[];for(let K=0;K<P.length;){let de=P[K++];de=="."?p&&K==P.length&&N.push(""):de==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),p&&K==P.length&&N.push("")):(N.push(de),p=!0)}p=N.join("/")}else p=P}return d?B.h=p:d=a.i.toString()!=="",d?Fu(B,Bp(a.i)):d=!!a.m,d&&(B.m=a.m),B};function hn(a){return new nr(a)}function _i(a,B,d){a.j=d?yi(B,!0):B,a.j&&(a.j=a.j.replace(/:$/,""))}function wi(a,B){if(B){if(B=Number(B),isNaN(B)||B<0)throw Error("Bad port number "+B);a.u=B}else a.u=null}function Fu(a,B,d){B instanceof Ii?(a.i=B,Z_(a.i,a.l)):(d||(B=Di(B,Y_)),a.i=new Ii(B,a.l))}function Ve(a,B,d){a.i.set(B,d)}function oa(a){return Ve(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function yi(a,B){return a?B?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Di(a,B,d){return typeof a=="string"?(a=encodeURI(a).replace(B,W_),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function W_(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var op=/[#\/\?@]/g,Q_=/[#\?:]/g,$_=/[#\?]/g,Y_=/[#\?@]/g,X_=/#/g;function Ii(a,B){this.h=this.g=null,this.i=a||null,this.j=!!B}function Pr(a){a.g||(a.g=new Map,a.h=0,a.i&&z_(a.i,function(B,d){a.add(decodeURIComponent(B.replace(/\+/g," ")),d)}))}n=Ii.prototype,n.add=function(a,B){Pr(this),this.i=null,a=Es(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(B),this.h+=1,this};function ap(a,B){Pr(a),B=Es(a,B),a.g.has(B)&&(a.i=null,a.h-=a.g.get(B).length,a.g.delete(B))}function cp(a,B){return Pr(a),B=Es(a,B),a.g.has(B)}n.forEach=function(a,B){Pr(this),this.g.forEach(function(d,p){d.forEach(function(P){a.call(B,P,p,this)},this)},this)};function up(a,B){Pr(a);let d=[];if(typeof B=="string")cp(a,B)&&(d=d.concat(a.g.get(Es(a,B))));else for(a=Array.from(a.g.values()),B=0;B<a.length;B++)d=d.concat(a[B]);return d}n.set=function(a,B){return Pr(this),this.i=null,a=Es(this,a),cp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[B]),this.h+=1,this},n.get=function(a,B){return a?(a=up(this,a),a.length>0?String(a[0]):B):B};function lp(a,B,d){ap(a,B),d.length>0&&(a.i=null,a.g.set(Es(a,B),v(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let a=[],B=Array.from(this.g.keys());for(let p=0;p<B.length;p++){var d=B[p];let P=mi(d);d=up(this,d);for(let N=0;N<d.length;N++){let K=P;d[N]!==""&&(K+="="+mi(d[N])),a.push(K)}}return this.i=a.join("&")};function Bp(a){let B=new Ii;return B.i=a.i,a.g&&(B.g=new Map(a.g),B.h=a.h),B}function Es(a,B){return B=String(B),a.j&&(B=B.toLowerCase()),B}function Z_(a,B){B&&!a.j&&(Pr(a),a.i=null,a.g.forEach(function(d,p){let P=p.toLowerCase();p!=P&&(ap(this,p),lp(this,P,d))},a)),a.j=B}function ew(a,B){let d=new Ci;if(o.Image){let p=new Image;p.onload=h(rr,d,"TestLoadImage: loaded",!0,B,p),p.onerror=h(rr,d,"TestLoadImage: error",!1,B,p),p.onabort=h(rr,d,"TestLoadImage: abort",!1,B,p),p.ontimeout=h(rr,d,"TestLoadImage: timeout",!1,B,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else B(!1)}function tw(a,B){let d=new Ci,p=new AbortController,P=setTimeout(()=>{p.abort(),rr(d,"TestPingServer: timeout",!1,B)},1e4);fetch(a,{signal:p.signal}).then(N=>{clearTimeout(P),N.ok?rr(d,"TestPingServer: ok",!0,B):rr(d,"TestPingServer: server error",!1,B)}).catch(()=>{clearTimeout(P),rr(d,"TestPingServer: error",!1,B)})}function rr(a,B,d,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(d)}catch{}}function nw(){this.g=new V_}function aa(a){this.i=a.Sb||null,this.h=a.ab||!1}f(aa,Uf),aa.prototype.g=function(){return new ca(this.i,this.h)};function ca(a,B){ht.call(this),this.H=a,this.o=B,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}f(ca,ht),n=ca.prototype,n.open=function(a,B){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=B,this.readyState=1,Ai(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;let B={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(B.body=a),(this.H||o).fetch(new Request(this.D,B)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ti(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ai(this)),this.g&&(this.readyState=3,Ai(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;hp(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function hp(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var B=a.value?a.value:new Uint8Array(0);(B=this.B.decode(B,{stream:!a.done}))&&(this.response=this.responseText+=B)}a.done?Ti(this):Ai(this),this.readyState==3&&hp(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,Ti(this))},n.Na=function(a){this.g&&(this.response=a,Ti(this))},n.ga=function(){this.g&&Ti(this)};function Ti(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Ai(a)}n.setRequestHeader=function(a,B){this.A.append(a,B)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let a=[],B=this.h.entries();for(var d=B.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=B.next();return a.join(`\r
`)};function Ai(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ca.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function dp(a){let B="";return Je(a,function(d,p){B+=p,B+=":",B+=d,B+=`\r
`}),B}function xu(a,B,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=dp(d),typeof a=="string"?d!=null&&mi(d):Ve(a,B,d))}function Ge(a){ht.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}f(Ge,ht);var rw=/^https?$/i,sw=["POST","PUT"];n=Ge.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,B,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);B=B?B.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Wf.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(B,String(a),!0),this.B=!1}catch(N){fp(this,N);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)d.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(let N of p.keys())d.set(N,p.get(N));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(sw,B,void 0)>=0)||p||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[N,K]of d)this.g.setRequestHeader(N,K);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(N){fp(this,N)}};function fp(a,B){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=B,a.o=5,pp(a),ua(a)}function pp(a){a.A||(a.A=!0,mt(a,"complete"),mt(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,mt(this,"complete"),mt(this,"abort"),ua(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ua(this,!0)),Ge.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?gp(this):this.Xa())},n.Xa=function(){gp(this)};function gp(a){if(a.h&&typeof i<"u"){if(a.v&&sr(a)==4)setTimeout(a.Ca.bind(a),0);else if(mt(a,"readystatechange"),sr(a)==4){a.h=!1;try{let N=a.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var B=!0;break e;default:B=!1}var d;if(!(d=B)){var p;if(p=N===0){let K=String(a.D).match(ip)[1]||null;!K&&o.self&&o.self.location&&(K=o.self.location.protocol.slice(0,-1)),p=!rw.test(K?K.toLowerCase():"")}d=p}if(d)mt(a,"complete"),mt(a,"success");else{a.o=6;try{var P=sr(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",pp(a)}}finally{ua(a)}}}}function ua(a,B){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);let d=a.g;a.g=null,B||mt(a,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function sr(a){return a.g?a.g.readyState:0}n.ca=function(){try{return sr(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var B=this.g.responseText;return a&&B.indexOf(a)==0&&(B=B.substring(a.length)),L_(B)}};function Cp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function iw(a){let B={};a=(a.g&&sr(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(C(a[p]))continue;var d=q_(a[p]);let P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();let N=B[P]||[];B[P]=N,N.push(d)}Bn(B,function(p){return p.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function vi(a,B,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||B}function mp(a){this.za=0,this.i=[],this.j=new Ci,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=vi("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=vi("baseRetryDelayMs",5e3,a),this.Za=vi("retryDelaySeedMs",1e4,a),this.Ta=vi("forwardChannelMaxRetries",2,a),this.va=vi("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new ep(a&&a.concurrentRequestLimit),this.Ba=new nw,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=mp.prototype,n.ka=8,n.I=1,n.connect=function(a,B,d,p){Et(0),this.W=a,this.H=B||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.J=vp(this,null,this.W),Ba(this)};function Lu(a){if(Ep(a),a.I==3){var B=a.V++,d=hn(a.J);if(Ve(d,"SID",a.M),Ve(d,"RID",B),Ve(d,"TYPE","terminate"),bi(a,d),B=new tr(a,a.j,B),B.M=2,B.A=oa(hn(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(B.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=B.A,d=!0),d||(B.g=bp(B.j,null),B.g.ea(B.A)),B.F=Date.now(),ia(B)}Ap(a)}function la(a){a.g&&(Mu(a),a.g.cancel(),a.g=null)}function Ep(a){la(a),a.v&&(o.clearTimeout(a.v),a.v=null),ha(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Ba(a){if(!tp(a.h)&&!a.m){a.m=!0;var B=a.Ea;Pe||m(),Ie||(Pe(),Ie=!0),b.add(B,a),a.D=0}}function ow(a,B){return np(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=B.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=gi(l(a.Ea,a,B),Tp(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;let P=new tr(this,this.j,a),N=this.o;if(this.U&&(N?(N=V(N),W(N,this.U)):N=this.U),this.u!==null||this.R||(P.J=N,N=null),this.S)e:{for(var B=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(B+=p,B>4096){B=d;break e}if(B===4096||d===this.i.length-1){B=d+1;break e}}B=1e3}else B=1e3;B=wp(this,P,B),d=hn(this.J),Ve(d,"RID",a),Ve(d,"CVER",22),this.G&&Ve(d,"X-HTTP-Session-Id",this.G),bi(this,d),N&&(this.R?B="headers="+mi(dp(N))+"&"+B:this.u&&xu(d,this.u,N)),ku(this.h,P),this.Ra&&Ve(d,"TYPE","init"),this.S?(Ve(d,"$req",B),Ve(d,"SID","null"),P.U=!0,Ru(P,d,null)):Ru(P,d,B),this.I=2}}else this.I==3&&(a?_p(this,a):this.i.length==0||tp(this.h)||_p(this))};function _p(a,B){var d;B?d=B.l:d=a.V++;let p=hn(a.J);Ve(p,"SID",a.M),Ve(p,"RID",d),Ve(p,"AID",a.K),bi(a,p),a.u&&a.o&&xu(p,a.u,a.o),d=new tr(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),B&&(a.i=B.G.concat(a.i)),B=wp(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),ku(a.h,d),Ru(d,p,B)}function bi(a,B){a.H&&Je(a.H,function(d,p){Ve(B,p,d)}),a.l&&Je({},function(d,p){Ve(B,p,d)})}function wp(a,B,d){d=Math.min(a.i.length,d);let p=a.l?l(a.l.Ka,a.l,a):null;e:{var P=a.i;let de=-1;for(;;){let Ze=["count="+d];de==-1?d>0?(de=P[0].g,Ze.push("ofs="+de)):de=0:Ze.push("ofs="+de);let Se=!0;for(let rt=0;rt<d;rt++){var N=P[rt].g;let dn=P[rt].map;if(N-=de,N<0)de=Math.max(0,P[rt].g-100),Se=!1;else try{N="req"+N+"_"||"";try{var K=dn instanceof Map?dn:Object.entries(dn);for(let[Or,ir]of K){let or=ir;c(ir)&&(or=Tu(ir)),Ze.push(N+Or+"="+encodeURIComponent(or))}}catch(Or){throw Ze.push(N+"type="+encodeURIComponent("_badmap")),Or}}catch{p&&p(dn)}}if(Se){K=Ze.join("&");break e}}K=void 0}return a=a.i.splice(0,d),B.G=a,K}function yp(a){if(!a.g&&!a.v){a.Y=1;var B=a.Da;Pe||m(),Ie||(Pe(),Ie=!0),b.add(B,a),a.A=0}}function Vu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=gi(l(a.Da,a),Tp(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,Dp(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=gi(l(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Et(10),la(this),Dp(this))};function Mu(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Dp(a){a.g=new tr(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var B=hn(a.na);Ve(B,"RID","rpc"),Ve(B,"SID",a.M),Ve(B,"AID",a.K),Ve(B,"CI",a.F?"0":"1"),!a.F&&a.ia&&Ve(B,"TO",a.ia),Ve(B,"TYPE","xmlhttp"),bi(a,B),a.u&&a.o&&xu(B,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=oa(hn(B)),d.u=null,d.R=!0,Yf(d,a)}n.Va=function(){this.C!=null&&(this.C=null,la(this),Vu(this),Et(19))};function ha(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Ip(a,B){var d=null;if(a.g==B){ha(a),Mu(a),a.g=null;var p=2}else if(Ou(a.h,B))d=B.G,rp(a.h,B),p=1;else return;if(a.I!=0){if(B.o)if(p==1){d=B.u?B.u.length:0,B=Date.now()-B.F;var P=a.D;p=ra(),mt(p,new Jf(p,d)),Ba(a)}else yp(a);else if(P=B.m,P==3||P==0&&B.X>0||!(p==1&&ow(a,B)||p==2&&Vu(a)))switch(d&&d.length>0&&(B=a.h,B.i=B.i.concat(d)),P){case 1:Nr(a,5);break;case 4:Nr(a,10);break;case 3:Nr(a,6);break;default:Nr(a,2)}}}function Tp(a,B){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*B}function Nr(a,B){if(a.j.info("Error code "+B),B==2){var d=l(a.bb,a),p=a.Ua;let P=!p;p=new nr(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||_i(p,"https"),oa(p),P?ew(p.toString(),d):tw(p.toString(),d)}else Et(2);a.I=0,a.l&&a.l.pa(B),Ap(a),Ep(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Et(2)):(this.j.info("Failed to ping google.com"),Et(1))};function Ap(a){if(a.I=0,a.ja=[],a.l){let B=sp(a.h);(B.length!=0||a.i.length!=0)&&(I(a.ja,B),I(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function vp(a,B,d){var p=d instanceof nr?hn(d):new nr(d);if(p.g!="")B&&(p.g=B+"."+p.g),wi(p,p.u);else{var P=o.location;p=P.protocol,B=B?B+"."+P.hostname:P.hostname,P=+P.port;let N=new nr(null);p&&_i(N,p),B&&(N.g=B),P&&wi(N,P),d&&(N.h=d),p=N}return d=a.G,B=a.wa,d&&B&&Ve(p,d,B),Ve(p,"VER",a.ka),bi(a,p),p}function bp(a,B,d){if(B&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return B=a.Aa&&!a.ma?new Ge(new aa({ab:d})):new Ge(a.ma),B.Fa(a.L),B}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Sp(){}n=Sp.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function da(){}da.prototype.g=function(a,B){return new Pt(a,B)};function Pt(a,B){ht.call(this),this.g=new mp(B),this.l=a,this.h=B&&B.messageUrlParams||null,a=B&&B.messageHeaders||null,B&&B.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=B&&B.initMessageHeaders||null,B&&B.messageContentType&&(a?a["X-WebChannel-Content-Type"]=B.messageContentType:a={"X-WebChannel-Content-Type":B.messageContentType}),B&&B.sa&&(a?a["X-WebChannel-Client-Profile"]=B.sa:a={"X-WebChannel-Client-Profile":B.sa}),this.g.U=a,(a=B&&B.Qb)&&!C(a)&&(this.g.u=a),this.A=B&&B.supportsCrossDomainXhr||!1,this.v=B&&B.sendRawJson||!1,(B=B&&B.httpSessionIdParam)&&!C(B)&&(this.g.G=B,a=this.h,a!==null&&B in a&&(a=this.h,B in a&&delete a[B])),this.j=new _s(this)}f(Pt,ht),Pt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Pt.prototype.close=function(){Lu(this.g)},Pt.prototype.o=function(a){var B=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Tu(a),a=d);B.i.push(new J_(B.Ya++,a)),B.I==3&&Ba(B)},Pt.prototype.N=function(){this.g.l=null,delete this.j,Lu(this.g),delete this.g,Pt.Z.N.call(this)};function Rp(a){Au.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var B=a.__sm__;if(B){e:{for(let d in B){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,B=B!==null&&a in B?B[a]:void 0),this.data=B}else this.data=a}f(Rp,Au);function Pp(){vu.call(this),this.status=1}f(Pp,vu);function _s(a){this.g=a}f(_s,Sp),_s.prototype.ra=function(){mt(this.g,"a")},_s.prototype.qa=function(a){mt(this.g,new Rp(a))},_s.prototype.pa=function(a){mt(this.g,new Pp)},_s.prototype.oa=function(){mt(this.g,"b")},da.prototype.createWebChannel=da.prototype.g,Pt.prototype.send=Pt.prototype.o,Pt.prototype.open=Pt.prototype.m,Pt.prototype.close=Pt.prototype.close,zl=Nn.createWebChannelTransport=function(){return new da},Jl=Nn.getStatEventTarget=function(){return ra()},Kl=Nn.Event=Sr,ec=Nn.Stat={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},sa.NO_ERROR=0,sa.TIMEOUT=8,sa.HTTP_ERROR=6,Xi=Nn.ErrorCode=sa,zf.COMPLETE="complete",jl=Nn.EventType=zf,Hf.EventType=fi,fi.OPEN="a",fi.CLOSE="b",fi.ERROR="c",fi.MESSAGE="d",ht.prototype.listen=ht.prototype.J,bs=Nn.WebChannel=Hf,aI=Nn.FetchXmlHttpFactory=aa,Ge.prototype.listenOnce=Ge.prototype.K,Ge.prototype.getLastError=Ge.prototype.Ha,Ge.prototype.getLastErrorCode=Ge.prototype.ya,Ge.prototype.getStatus=Ge.prototype.ca,Ge.prototype.getResponseJson=Ge.prototype.La,Ge.prototype.getResponseText=Ge.prototype.la,Ge.prototype.send=Ge.prototype.ea,Ge.prototype.setWithCredentials=Ge.prototype.Fa,ql=Nn.XhrIo=Ge}).apply(typeof Za<"u"?Za:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var L=class jr{static FOLD_CASE=1;static LITERAL=2;static CLASS_NL=4;static DOT_NL=8;static ONE_LINE=16;static NON_GREEDY=32;static PERL_X=64;static UNICODE_GROUPS=128;static WAS_DOLLAR=256;static LOOKBEHIND=512;static MATCH_NL=jr.CLASS_NL|jr.DOT_NL;static PERL=jr.CLASS_NL|jr.ONE_LINE|jr.PERL_X|jr.UNICODE_GROUPS;static POSIX=0;static UNANCHORED=0;static ANCHOR_START=1;static ANCHOR_BOTH=2},tn={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},to=128,Yl=new Int32Array(to),Xl=new Int32Array(to),tc=65535;for(let n=0;n<to;n++)n>=97&&n<=122?Yl[n]=n-32:Yl[n]=n,n>=65&&n<=90?Xl[n]=n+32:Xl[n]=n;var k=class{static CODES=new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]]);static toUpperCase(n){if(n<to)return Yl[n];let e=String.fromCodePoint(n).toUpperCase(),t=e.codePointAt(0)>tc?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=r.codePointAt(0)>tc?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}static toLowerCase(n){if(n<to)return Xl[n];let e=String.fromCodePoint(n).toLowerCase(),t=e.codePointAt(0)>tc?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=r.codePointAt(0)>tc?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}},E=class{constructor(n,e=!1){this.data=n,this.isStride1=e,this.SIZE=e?2:3}getLo(n){return this.data[n*this.SIZE]}getHi(n){return this.data[n*this.SIZE+1]}getStride(n){return this.isStride1?1:this.data[n*this.SIZE+2]}get length(){return this.data.length/this.SIZE}},RC=new Uint8Array(256);for(let n=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";n<64;n++)RC[e.charCodeAt(n)]=n;var PC=n=>{let e=[],t=0,r=0;for(let s=0;s<n.length;s++){let i=RC[n.charCodeAt(s)];t|=(i&31)<<r,(i&32)===0?(e.push(t),t=0,r=0):r+=5}return e},_=(n,e)=>{let t=PC(n),r=e?t.length/2:t.length/3,s=new Uint32Array(r*3),i=0,o=0;for(let c=0;c<r;c++)i+=t[o++],s[c*3]=i,i+=t[o++],s[c*3+1]=i,s[c*3+2]=e?1:t[o++];return s},cI=n=>{let e=PC(n),t=new Map,r=0;for(let s=0;s<e.length;s+=2){r+=e[s];let i=e[s+1],o=i>>>1^-(i&1);t.set(r,r+o)}return t},nc=class{constructor(n){this.initializer=n,this.cache=new Map}has(n){return n in this.initializer}get(n){if(this.cache.has(n))return this.cache.get(n);let e=this.initializer[n],t=e?e():null;return this.cache.set(n,t),t}},At=class{static _CASE_ORBIT=null;static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=cI("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static _Print=null;static get Print(){return this._Print||(this._Print=new E(_("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static CATEGORIES=new nc({C:()=>new E(_("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new E(_("AfgDgB",!0)),Cf:()=>new E(_("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new E(_("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new E(_("gg2B--B",!0)),L:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new E(_("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new E(_("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new E(_("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new E(_("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new E(_("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new E(_("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new E(_("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new E(_("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new E(_("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new E(_("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new E(_("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new E(_("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new E(_("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new E(_("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new E(_("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new E(_("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new E(_("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new E(_("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new E(_("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new E(_("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new E(_("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new E(_("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new E(_("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new E(_("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new E(_("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new E(_("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new E(_("ohIA",!0)),Zp:()=>new E(_("phIA",!0)),Zs:()=>new E(_("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new E(_("wBJIFbF",!0)),Alphabetic:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new E(_("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new E(_("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new E(_("7-8DE",!0)),Emoji_Modifier_Base:()=>new E(_("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new E(_("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new E(_("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new E(_("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new E(_("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new E(_("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new E(_("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new E(_("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new E(_("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))});static get Upper(){return this.CATEGORIES.get("Lu")}static SCRIPTS=new nc({Adlam:()=>new E(_("go6DrCFJFB",!0)),Ahom:()=>new E(_("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new E(_("ggxCmS",!0)),Arabic:()=>new E(_("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new E(_("xpBlBDxBDCks9BE",!0)),Avestan:()=>new E(_("g4iC1BEG",!0)),Balinese:()=>new E(_("g4GsCCxB",!0)),Bamum:()=>new E(_("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new E(_("w26CdDF",!0)),Batak:()=>new E(_("g+GzBJD",!0)),Bengali:()=>new E(_("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new E(_("g17CYDY",!0)),Bhaiksuki:()=>new E(_("ggnCICsBCNLc",!0)),Bopomofo:()=>new E(_("qXB6wLqBxDf",!0)),Brahmi:()=>new E(_("ggkCtCFjBKA",!0)),Braille:()=>new E(_("ggK-H",!0)),Buginese:()=>new E(_("gwGbDB",!0)),Buhid:()=>new E(_("g6FT",!0)),Canadian_Aboriginal:()=>new E(_("ggF-TxRlC7tgCP",!0)),Carian:()=>new E(_("g1gCwB",!0)),Caucasian_Albanian:()=>new E(_("wphCzBMA",!0)),Chakma:()=>new E(_("gokC0BCR",!0)),Cham:()=>new E(_("gwqB2BKNDJDD",!0)),Cherokee:()=>new E(_("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new E(_("w9jCb",!0)),Common:()=>new E(_("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new E(_("ifNxkKzDGG",!0)),Cuneiform:()=>new E(_("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new E(_("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new E(_("w8rCiD",!0)),Cyrillic:()=>new E(_("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new E(_("gghCvC",!0)),Devanagari:()=>new E(_("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new E(_("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new E(_("ggmC7B",!0)),Duployan:()=>new E(_("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new E(_("ggsC1iBL68D",!0)),Elbasan:()=>new E(_("gohCnB",!0)),Elymaic:()=>new E(_("g-jCW",!0)),Ethiopic:()=>new E(_("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new E(_("gqjClBEcJB",!0)),Georgian:()=>new E(_("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new E(_("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new E(_("w5gCa",!0)),Grantha:()=>new E(_("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new E(_("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new E(_("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new E(_("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new E(_("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new E(_("go4C5B",!0)),Han:()=>new E(_("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new E(_("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new E(_("gojCnBJJ",!0)),Hanunoo:()=>new E(_("g5FU",!0)),Hatran:()=>new E(_("gniCSCBGE",!0)),Hebrew:()=>new E(_("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new E(_("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new E(_("giiCVCI",!0)),Inherited:()=>new E(_("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new E(_("g7iCSGH",!0)),Inscriptional_Parthian:()=>new E(_("g6iCVDH",!0)),Javanese:()=>new E(_("gsqBtCDJFB",!0)),Kaithi:()=>new E(_("gkkCiCLA",!0)),Kannada:()=>new E(_("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new E(_("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new E(_("g4nCQCoBEc",!0)),Kayah_Li:()=>new E(_("goqBtBCA",!0)),Kharoshthi:()=>new E(_("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new E(_("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new E(_("g8F9CDJHJnPf",!0)),Khojki:()=>new E(_("gwkCRCuB",!0)),Khudawadi:()=>new E(_("w1kC6BGJ",!0)),Kirat_Rai:()=>new E(_("gq7C5B",!0)),Lao:()=>new E(_("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new E(_("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new E(_("ggH3BEOEC",!0)),Limbu:()=>new E(_("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new E(_("gwhC2JKVLH",!0)),Linear_B:()=>new E(_("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new E(_("wmpBvBx1eA",!0)),Lycian:()=>new E(_("g0gCc",!0)),Lydian:()=>new E(_("gpiCZGA",!0)),Mahajani:()=>new E(_("wqkCmB",!0)),Makasar:()=>new E(_("g3nCY",!0)),Malayalam:()=>new E(_("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new E(_("giCbDA",!0)),Manichaean:()=>new E(_("g2iCmBFL",!0)),Marchen:()=>new E(_("wjnCfDVCN",!0)),Masaram_Gondi:()=>new E(_("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new E(_("gy7C6C",!0)),Meetei_Mayek:()=>new E(_("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new E(_("gg6DkGDP",!0)),Meroitic_Cursive:()=>new E(_("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new E(_("gsiCf",!0)),Miao:()=>new E(_("g47CqCF4BIQ",!0)),Modi:()=>new E(_("gwlCkCMJ",!0)),Mongolian:()=>new E(_("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new E(_("gy6CeCJFB",!0)),Multani:()=>new E(_("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new E(_("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new E(_("gkiCeJI",!0)),Nag_Mundari:()=>new E(_("wm5DpB",!0)),Nandinagari:()=>new E(_("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new E(_("gsGrBFZHKEB",!0)),Newa:()=>new E(_("gglC7CCE",!0)),Nko:()=>new E(_("g+B6BDC",!0)),Nushu:()=>new E(_("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new E(_("go4DsBENDJFB",!0)),Ogham:()=>new E(_("g0Fc",!0)),Ol_Chiki:()=>new E(_("wiHvB",!0)),Ol_Onal:()=>new E(_("wu5DqBFA",!0)),Old_Hungarian:()=>new E(_("gkjCyBOyBIF",!0)),Old_Italic:()=>new E(_("g4gCjBKC",!0)),Old_North_Arabian:()=>new E(_("g0iCf",!0)),Old_Permic:()=>new E(_("w6gCqB",!0)),Old_Persian:()=>new E(_("g9gCjBFN",!0)),Old_Sogdian:()=>new E(_("g4jCnB",!0)),Old_South_Arabian:()=>new E(_("gziCf",!0)),Old_Turkic:()=>new E(_("ggjCoC",!0)),Old_Uyghur:()=>new E(_("w7jCZ",!0)),Oriya:()=>new E(_("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new E(_("wlhCjBFjB",!0)),Osmanya:()=>new E(_("gkhCdDJ",!0)),Pahawh_Hmong:()=>new E(_("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new E(_("gjiCf",!0)),Pau_Cin_Hau:()=>new E(_("g2mC4B",!0)),Phags_Pa:()=>new E(_("giqB3B",!0)),Phoenician:()=>new E(_("goiCbEA",!0)),Psalter_Pahlavi:()=>new E(_("g8iCRIDNG",!0)),Rejang:()=>new E(_("wpqBjBMA",!0)),Runic:()=>new E(_("g1FqCEK",!0)),Samaritan:()=>new E(_("ggCtBDO",!0)),Saurashtra:()=>new E(_("gkqBlCJL",!0)),Sharada:()=>new E(_("gskC-ChsCH",!0)),Shavian:()=>new E(_("wihCvB",!0)),Siddham:()=>new E(_("gslC1BDlB",!0)),Sidetic:()=>new E(_("gqiCZ",!0)),SignWriting:()=>new E(_("gg2DrUQECO",!0)),Sinhala:()=>new E(_("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new E(_("w5jCpB",!0)),Sora_Sompeng:()=>new E(_("wmkCYIJ",!0)),Soyombo:()=>new E(_("wymCyC",!0)),Sundanese:()=>new E(_("g8G-BhIH",!0)),Sunuwar:()=>new E(_("g+mChBPJ",!0)),Syloti_Nagri:()=>new E(_("ggqBsB",!0)),Syriac:()=>new E(_("g4BNC7BDCxIK",!0)),Tagalog:()=>new E(_("g4FVKA",!0)),Tagbanwa:()=>new E(_("g7FMCCCB",!0)),Tai_Le:()=>new E(_("wqGdDE",!0)),Tai_Tham:()=>new E(_("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new E(_("g0qBiCZE",!0)),Tai_Yo:()=>new E(_("g25DeCVJB",!0)),Takri:()=>new E(_("g0lC5BHJ",!0)),Tamil:()=>new E(_("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new E(_("wz6CuCCJ",!0)),Tangut:()=>new E(_("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new E(_("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new E(_("g8BxB",!0)),Thai:()=>new E(_("hwD5BGb",!0)),Tibetan:()=>new E(_("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new E(_("wpL3BIBPA",!0)),Tirhuta:()=>new E(_("gklCnCJJ",!0)),Todhri:()=>new E(_("guhCzB",!0)),Tolong_Siki:()=>new E(_("wtnCrBFJ",!0)),Toto:()=>new E(_("w04De",!0)),Tulu_Tigalari:()=>new E(_("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new E(_("g8gCdCA",!0)),Unknown:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new E(_("gopBrJ",!0)),Vithkuqi:()=>new E(_("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new E(_("g24D5BGA",!0)),Warang_Citi:()=>new E(_("glmCyCNA",!0)),Yezidi:()=>new E(_("g0jCpBCCDB",!0)),Yi:()=>new E(_("ggoBskBE2B",!0)),Zanabazar_Square:()=>new E(_("gwmCnC",!0))});static FOLD_CATEGORIES=new nc({L:()=>new E(_("laA",!0)),LC:()=>new E(_("laA",!0)),Ll:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new E(_("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new E(_("5cgBgBlgHAB",!1)),Mn:()=>new E(_("5cgBgBlgHAB",!1)),Emoji:()=>new E(_("8mJA",!0)),Extended_Pictographic:()=>new E(_("8mJA",!0)),Lowercase:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new E(_("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))});static FOLD_SCRIPT=new nc({Common:()=>new E(_("8cgBgB",!1)),Greek:()=>new E(_("1FwUwU",!1)),Inherited:()=>new E(_("5cgBgBlgHAB",!1))})},z=class Jt{static MAX_RUNE=1114111;static MAX_ASCII=127;static MAX_LATIN1=255;static MAX_BMP=65535;static MIN_FOLD=65;static MAX_FOLD=125251;static MIN_HIGH_SURROGATE=55296;static MAX_HIGH_SURROGATE=56319;static MIN_LOW_SURROGATE=56320;static MAX_LOW_SURROGATE=57343;static MIN_SUPPLEMENTARY_CODE_POINT=65536;static is32(e,t){let r=0,s=e.length;for(;r<s;){let i=r+Math.floor((s-r)/2),o=e.getLo(i),c=e.getHi(i);if(o<=t&&t<=c){let u=e.getStride(i);return(t-o)%u===0}t<o?s=i:r=i+1}return!1}static is(e,t){if(t<=Jt.MAX_LATIN1){for(let r=0;r<e.length;r++){if(t>e.getHi(r))continue;let s=e.getLo(r);if(t<s)return!1;let i=e.getStride(r);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&Jt.is32(e,t)}static isUpper(e){if(e<=Jt.MAX_LATIN1){let t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return Jt.is(At.Upper,e)}static isPrint(e){return e<=Jt.MAX_LATIN1?e>=32&&e<Jt.MAX_ASCII||e>=161&&e!==173:Jt.is(At.Print,e)}static simpleFold(e){if(At.CASE_ORBIT.has(e))return At.CASE_ORBIT.get(e);let t=k.toLowerCase(e);return t!==e?t:k.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=Jt.MAX_ASCII&&t<=Jt.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let r=Jt.simpleFold(e);r!==e;r=Jt.simpleFold(r))if(r===t)return!0;return!1}},nB=256,NC=new Uint8Array(nB);for(let n=0;n<nB;n++)NC[n]=97<=n&&n<=122||65<=n&&n<=90||48<=n&&n<=57||n===95?1:0;var Wl=null,Ql=null,Y=class kt{static METACHARACTERS="\\.+*?()|[]{}^$";static EMPTY_BEGIN_LINE=1;static EMPTY_END_LINE=2;static EMPTY_BEGIN_TEXT=4;static EMPTY_END_TEXT=8;static EMPTY_WORD_BOUNDARY=16;static EMPTY_NO_WORD_BOUNDARY=32;static EMPTY_ALL=-1;static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")||k.CODES.get("a")<=e&&e<=k.CODES.get("z")||k.CODES.get("A")<=e&&e<=k.CODES.get("Z")}static unhex(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")?e-k.CODES.get("0"):k.CODES.get("a")<=e&&e<=k.CODES.get("f")?e-k.CODES.get("a")+10:k.CODES.get("A")<=e&&e<=k.CODES.get("F")?e-k.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(z.isPrint(e))kt.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case k.CODES.get('"'):t+='\\"';break;case k.CODES.get("\\"):t+="\\\\";break;case k.CODES.get("	"):t+="\\t";break;case k.CODES.get(`
`):t+="\\n";break;case k.CODES.get("\r"):t+="\\r";break;case k.CODES.get("\b"):t+="\\b";break;case k.CODES.get("\f"):t+="\\f";break;default:{let r=e.toString(16);e<256?(t+="\\x",r.length===1&&(t+="0"),t+=r):t+=`\\x{${r}}`;break}}return t}static stringToRunes(e){let t=String(e),r=[],s=0;for(;s<t.length;){let i=t.codePointAt(s);r.push(i),s+=i>z.MAX_BMP?2:1}return r}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<nB?NC[e]===1:!1}static emptyOpContext(e,t){let r=0;return e<0&&(r|=kt.EMPTY_BEGIN_TEXT|kt.EMPTY_BEGIN_LINE),e===10&&(r|=kt.EMPTY_BEGIN_LINE),t<0&&(r|=kt.EMPTY_END_TEXT|kt.EMPTY_END_LINE),t===10&&(r|=kt.EMPTY_END_LINE),kt.isWordRune(e)!==kt.isWordRune(t)?r|=kt.EMPTY_WORD_BOUNDARY:r|=kt.EMPTY_NO_WORD_BOUNDARY,r}static quoteMeta(e){return e.split("").map(t=>kt.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>z.MAX_BMP?2:1}static toArray(e){let t=e.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=e[s];return r}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return Wl||(Wl=new TextEncoder),Wl.encode(e);{let t=[],r=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===z.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===z.MIN_LOW_SURROGATE?(i=z.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){Ql||(Ql=new TextDecoder("utf-8"));let t=e instanceof Uint8Array?e:new Uint8Array(e);return Ql.decode(t)}else{let t=[],r=0,s=0;for(;r<e.length;){let i=e[r++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[r++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[r++],c=e[r++],u=e[r++],l=((i&7)<<18|(o&63)<<12|(c&63)<<6|u&63)-z.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(z.MIN_HIGH_SURROGATE+(l>>10)),t[s++]=String.fromCharCode(z.MIN_LOW_SURROGATE+(l&1023))}else{let o=e[r++],c=e[r++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|c&63)}}return t.join("")}}},OC=(n=[],e=0)=>{let t=Object.create(null);for(let r=0;r<n.length;r++){let s=n[r],i=e+r;t[s]=i,t[i]=s}return Object.freeze(t)},zr=class Zl{static Encoding=OC(["UTF_16","UTF_8"]);getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Zl.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Zl.Encoding.UTF_16}},sC=class extends zr{constructor(n=null){super(),this.bytes=n}getEncoding(){return zr.Encoding.UTF_8}asCharSequence(){return Y.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},uI=class extends zr{constructor(n=null){super(),this.charSequence=n}getEncoding(){return zr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return Y.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Jr=class{static utf16(n){return new uI(n)}static utf8(n){return Y.isByteArray(n)?new sC(n):new sC(Y.stringToUtf8ByteArray(n))}},_t=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},lI=class extends _t{constructor(n,e=0,t=n.length){super(),this.bytes=n,this.start=e,this.end=t}hasString(n,e){let t=n.bytes;if(t.length===0)return!0;let r=this.indexOf(this.bytes,t,this.start+e);return r!==-1&&r<=this.end-t.length}hasAnyString(n,e){return n.ac8?n.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return _t.EOF();let e=this.bytes[n]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&n+1<this.end){let t=this.bytes[n+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&n+2<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;return(r&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|r&63)<<3|3}else if(e>=240&&e<=244&&n+3<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;if((r&192)!==128)return e<<3|1;let s=this.bytes[n+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(r&63)<<6|s&63)<<3|4}else return e<<3|1}index(n,e){e+=this.start;let t=this.indexOf(this.bytes,n.prefixUTF8,e);return t<0?t:t-e}context(n){n+=this.start;let e=-1;if(n>this.start&&n<=this.end){let r=n-1;if(e=this.bytes[r--],e>=128){let s=n-4;for(s<this.start&&(s=this.start);r>=s&&(this.bytes[r]&192)===128;)r--;r<this.start&&(r=this.start),e=this.step(r-this.start)>>3}}let t=n<this.end?this.step(n-this.start)>>3:-1;return Y.emptyOpContext(e,t)}indexOf(n,e,t=0){let r=e.length;if(r===0)return t<=this.end?t:-1;let s=e[0],i=this.end-r,o=typeof n.indexOf=="function",c=t;for(;c<=i;){if(o){if(c=n.indexOf(s,c),c===-1||c>i)return-1}else{for(;c<=i&&n[c]!==s;)c++;if(c>i)return-1}let u=!0;for(let l=1;l<r;l++)if(n[c+l]!==e[l]){u=!1;break}if(u)return c;c++}return-1}prefixLength(n){return n.prefixUTF8.length}},BI=class extends _t{constructor(n,e=0,t=n.length){super(),this.charSequence=n,this.start=e,this.end=t}hasString(n,e){let t=this.charSequence.indexOf(n.str,this.start+e);return t!==-1&&t<=this.end-n.str.length}hasAnyString(n,e){return n.ac16?n.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return _t.EOF();let e=this.charSequence.charCodeAt(n);if(e<z.MIN_HIGH_SURROGATE||e>z.MAX_HIGH_SURROGATE||n+1>=this.end)return e<<3|1;let t=this.charSequence.charCodeAt(n+1);return t>=z.MIN_LOW_SURROGATE&&t<=z.MAX_LOW_SURROGATE?(e-z.MIN_HIGH_SURROGATE)*1024+(t-z.MIN_LOW_SURROGATE)+z.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(n,e){e+=this.start;let t=this.charSequence.indexOf(n.prefix,e);return t<0||t>this.end-n.prefix.length?-1:t-e}context(n){n+=this.start;let e=n>this.start&&n<=this.end?this.charSequence.charCodeAt(n-1):-1,t=n<this.end?this.charSequence.charCodeAt(n):-1;return Y.emptyOpContext(e,t)}prefixLength(n){return n.prefix.length}},Re=class{static fromUTF8(n,e=0,t=n.length){return new lI(n,e,t)}static fromUTF16(n,e=0,t=n.length){return new BI(n,e,t)}},no=class extends Error{constructor(n){super(n),this.name="RE2JSException"}},Ne=class extends no{constructor(n,e=null){let t=`error parsing regexp: ${n}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=n,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},kC=class extends no{constructor(n){super(n),this.name="RE2JSCompileException"}},Tt=class extends no{constructor(n){super(n),this.name="RE2JSGroupException"}},hI=class extends no{constructor(n){super(n),this.name="RE2JSFlagsException"}},eo=class extends no{constructor(n){super(n),this.name="RE2JSInternalException"}},iC=class FC{static MAX_REPLACER_ARGS=65535;static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(r=>{let s=r.codePointAt(0);return s===k.CODES.get("\\")||s===k.CODES.get("$")?`\\${r}`:r}).join(""):e.indexOf("$")<0?e:e.split("").map(r=>r.codePointAt(0)===k.CODES.get("$")?"$$":r).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;let r=this.patternInput.re2();this.patternGroupCount=r.numberOfCapturingGroups(),this.groups=[],this.namedGroups=r.namedGroups,this.numberOfInstructions=r.numberOfInstructions(),t instanceof zr?this.resetMatcherInput(t):Y.isByteArray(t)?this.resetMatcherInput(Jr.utf8(t)):this.resetMatcherInput(Jr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof zr||(Y.isByteArray(e)?e=Jr.utf8(e):e=Jr.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Tt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Tt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){let s=this.namedGroups[e];if(!Number.isFinite(s))throw new Tt(`group '${e}' not found`);e=s}let t=this.start(e),r=this.end(e);return t<0&&r<0?null:this.substring(t,r)}getNamedGroups(){if(!this.hasMatch)throw new Tt("perhaps no match attempted");let e=Object.create(null);for(let t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new Tt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new Tt("perhaps no match attempted");if(e===0||this.hasGroups)return;let t=this.matcherInputLength,r=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!r[0])throw new Tt("inconsistency in matching group data");this.groups=r[1],this.hasGroups=!0}matches(){return this.genMatch(0,L.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,L.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new Tt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){let t=(this.matcherInput.isUTF16Encoding()?Re.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Re.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,L.UNANCHORED)}genMatch(e,t){let r=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return r[0]?(this.groups=r[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?Y.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let r="",s=this.start(),i=this.end();return this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i,r+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),r}appendReplacementInternalJava(e){let t="",r=0,s=e.length,i=0;for(;i<s;){let o=e.codePointAt(i);if(o===k.CODES.get("\\")){if(r<i&&(t+=e.substring(r,i)),i++,i>=s)throw new Tt("character to be escaped is missing");r=i,i++;continue}if(o===k.CODES.get("$")){if(r<i&&(t+=e.substring(r,i)),i+1>=s)throw new Tt("Illegal group reference: group index is missing");let c=e.codePointAt(i+1);if(k.CODES.get("0")<=c&&c<=k.CODES.get("9")){let u=c-k.CODES.get("0"),l=i+2;for(;l<s;l++){let f=e.codePointAt(l);if(f<k.CODES.get("0")||f>k.CODES.get("9")||u*10+f-k.CODES.get("0")>this.patternGroupCount)break;u=u*10+f-k.CODES.get("0")}if(u>this.patternGroupCount)throw new Tt(`n > number of groups: ${u}`);let h=this.group(u);h!==null&&(t+=h),i=l,r=i}else if(c===k.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==k.CODES.get("}");)u++;if(u>=s)throw new Tt("named capture group is missing trailing '}'");let l=e.substring(i+2,u),h=this.group(l);h!==null&&(t+=h),i=u+1,r=i}else throw new Tt("Illegal group reference");continue}i++}return r<s&&(t+=e.substring(r,s)),t}appendReplacementInternalJs(e){let t="",r=0,s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===k.CODES.get("$")){let o=e.codePointAt(i+1);if(k.CODES.get("$")===o){r<i&&(t+=e.substring(r,i)),t+="$",i++,r=i+1;continue}else if(k.CODES.get("&")===o){r<i&&(t+=e.substring(r,i));let c=this.group(0);c!==null?t+=c:t+="$&",i++,r=i+1;continue}else if(k.CODES.get("`")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(0,this.start(0)),i++,r=i+1;continue}else if(k.CODES.get("'")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,r=i+1;continue}else if(k.CODES.get("1")<=o&&o<=k.CODES.get("9")){let c=o-k.CODES.get("0");for(r<i&&(t+=e.substring(r,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<k.CODES.get("0")||o>k.CODES.get("9")||c*10+o-k.CODES.get("0")>this.patternGroupCount));i++)c=c*10+o-k.CODES.get("0");if(c>this.patternGroupCount){t+=`$${c}`,r=i,i--;continue}let u=this.group(c);u!==null&&(t+=u),r=i,i--;continue}else if(o===k.CODES.get("<")){r<i&&(t+=e.substring(r,i)),i++;let c=i+1;for(;c<e.length&&e.codePointAt(c)!==k.CODES.get(">")&&e.codePointAt(c)!==k.CODES.get(" ");)c++;if(c===e.length||e.codePointAt(c)!==k.CODES.get(">")){t+=e.substring(i-1,c+1),r=c+1,i=c;continue}let u=e.substring(i+1,c);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){let l=this.group(u);l!==null&&(t+=l)}else t+=`$<${u}>`;r=c+1,i=c;continue}}return r<s&&(t+=e.substring(r,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,r=!1){let s="";this.reset();let i=typeof e=="function",o=Object.keys(this.namedGroups).length>0,c=null;if(i){if(this.groupCount()>=FC.MAX_REPLACER_ARGS)throw new Tt("Too many capture groups to safely invoke replacer function");c=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,c):this.appendReplacement(e,r),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,r){let s="",i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;let c=this.buildReplacerArgs(i,t,r);return s+=String(e(...c)),s}buildReplacerArgs(e,t,r){let s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){let c=this.start(o);c<0?s.push(void 0):s.push(this.substring(c,this.end(o)))}if(s.push(e),s.push(r),t){let o=this.getNamedGroups();for(let c in o)o[c]===null&&(o[c]=void 0);s.push(o)}return s}},F=class ot{static ALT=1;static ALT_MATCH=2;static CAPTURE=3;static EMPTY_WIDTH=4;static FAIL=5;static MATCH=6;static NOP=7;static RUNE=8;static RUNE1=9;static RUNE_ANY=10;static RUNE_ANY_NOT_NL=11;static LB_WRITE=12;static LB_CHECK=13;static isRuneOp(e){return ot.RUNE<=e&&e<=ot.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let r of e)t+=Y.escapeRune(r);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&L.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e):e===o}let t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&L.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}let t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case ot.ALT:return`alt -> ${this.out}, ${this.arg}`;case ot.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case ot.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case ot.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case ot.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case ot.FAIL:return"fail";case ot.NOP:return`nop -> ${this.out}`;case ot.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case ot.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case ot.RUNE:return this.runes===null?"rune <null>":["rune ",ot.escapeRunes(this.runes),(this.arg&L.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case ot.RUNE1:return`rune1 ${ot.escapeRunes(this.runes)} -> ${this.out}`;case ot.RUNE_ANY:return`any -> ${this.out}`;case ot.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},oC=class{constructor(n){this.sparse=new Int32Array(n),this.densePcs=new Int32Array(n),this.denseCaps=null,this.size=0,this.ncap=0}init(n){this.ncap=n;let e=this.densePcs.length*n;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(n){let e=this.sparse[n];return e<this.size&&this.densePcs[e]===n}isEmpty(){return this.size===0}add(n){let e=this.size++;return this.sparse[n]=e,this.densePcs[e]=n,e}clear(){this.size=0}toString(){let n="{";for(let e=0;e<this.size;e++)e!==0&&(n+=", "),n+=this.densePcs[e];return n+="}",n}},xC=class eB{static fromRE2(e){let t=new eB;return t.prog=e.prog,t.re2=e,t.q0=new oC(t.prog.numInst()),t.q1=new oC(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return eB.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?Y.emptyInts():Y.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,r){let s=this.re2.cond;if(s===Y.EMPTY_ALL||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,g=-1,v=0;l!==_t.EOF()&&(l=e.step(i+f),g=l>>3,v=l&7);let I;for(i===0?I=Y.emptyOpContext(-1,h):I=e.context(i);;){if(c.isEmpty()){if((s&Y.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&g!==this.re2.prefixRune&&e.canCheckPrefix()){let H=e.index(this.re2,i);if(H<0)break;i+=H,l=e.step(i),h=l>>3,f=l&7,l=e.step(i+f),g=l>>3,v=l&7,I=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let H=0;H<this.prog.lbStarts.length;H++)this.add(c,this.prog.lbStarts[H],i,this.matchcap,0,I);!this.matched&&(i===0||r===L.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(c,this.prog.start,i,this.matchcap,0,I));let S=i+f;if(I=e.context(S),this.step(c,u,i,S,h,I,r,i===e.endPos()),f===0||this.ncap===0&&this.matched)break;i+=f,h=g,f=v,h!==-1&&(l=e.step(i+f),g=l>>3,v=l&7);let U=c;c=u,u=U}return u.clear(),this.matched}matchSet(e,t,r){let s=this.re2.cond;if(s===Y.EMPTY_ALL)return[];if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,g=-1,v=0;l!==_t.EOF()&&(l=e.step(i+f),g=l>>3,v=l&7);let I=i===0?Y.emptyOpContext(-1,h):e.context(i),S=new Set;for(;!(c.isEmpty()&&((s&Y.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let se=0;se<this.prog.lbStarts.length;se++)this.add(c,this.prog.lbStarts[se],i,this.matchcap,0,I);(i===0||r===L.UNANCHORED)&&i>=o&&this.add(c,this.prog.start,i,this.matchcap,0,I);let U=i+f;I=e.context(U);for(let se=0;se<c.size;se++){let De=c.densePcs[se],Ce=this.prog.inst[De],Pe=se*this.ncap,Ie=!1;switch(Ce.op){case F.MATCH:if(r===L.ANCHOR_BOTH&&i!==e.endPos())break;S.add(Ce.arg);break;case F.RUNE:Ie=Ce.matchRune(h);break;case F.RUNE1:Ie=h===Ce.runes[0];break;case F.RUNE_ANY:Ie=!0;break;case F.RUNE_ANY_NOT_NL:Ie=h!==10;break;default:continue}Ie&&this.add(u,Ce.out,U,c.denseCaps,Pe,I)}if(c.clear(),f===0)break;i+=f,h=g,f=v,h!==-1&&(l=e.step(i+f),g=l>>3,v=l&7);let H=c;c=u,u=H}return u.clear(),Array.from(S).sort((U,H)=>U-H)}step(e,t,r,s,i,o,c,u){let l=this.re2.longest;for(let h=0;h<e.size;h++){let f=e.densePcs[h],g=h*this.ncap;if(l&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[g])continue;let v=this.prog.inst[f],I=!1;switch(v.op){case F.MATCH:if(c===L.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!l||!this.matched||this.matchcap[1]<r)){e.denseCaps[g+1]=r;for(let S=0;S<this.ncap;S++)this.matchcap[S]=e.denseCaps[g+S]}l||(e.size=0),this.matched=!0;break;case F.RUNE:I=v.matchRune(i);break;case F.RUNE1:I=i===v.runes[0];break;case F.RUNE_ANY:I=!0;break;case F.RUNE_ANY_NOT_NL:I=i!==10;break;default:continue}I&&this.add(t,v.out,s,e.denseCaps,g,o)}e.clear()}add(e,t,r,s,i,o){for(;;){if(t===0||e.contains(t))return;let c=e.add(t),u=this.prog.inst[t];switch(u.op){case F.FAIL:return;case F.ALT:case F.ALT_MATCH:this.add(e,u.out,r,s,i,o),t=u.arg;continue;case F.EMPTY_WIDTH:if((u.arg&~o)===0){t=u.out;continue}return;case F.NOP:t=u.out;continue;case F.CAPTURE:if(u.arg<this.ncap){let l=s[i+u.arg];s[i+u.arg]=r,this.add(e,u.out,r,s,i,o),s[i+u.arg]=l;return}else{t=u.out;continue}case F.LB_WRITE:this.lbTable[Math.abs(u.arg)]=r,t=u.out;continue;case F.LB_CHECK:if(u.arg>0){if(this.lbTable[u.arg]===r){t=u.out;continue}}else if(this.lbTable[-u.arg]!==r){t=u.out;continue}return;case F.MATCH:case F.RUNE:case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:if(this.ncap>0){let l=c*this.ncap;for(let h=0;h<this.ncap;h++)e.denseCaps[l+h]=s[i+h]}return;default:throw new eo("unhandled")}}}},aC=n=>{let e=-2128831035;for(let t=0;t<n.length;t++)e^=n[t],e=Math.imul(e,16777619);return e},dI=(n,e)=>{if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0},fI=class{constructor(n,e,t=[]){this.nfaStates=n,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array(z.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array(z.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},LC=class tB{static MAX_CACHE_CLEARS=5;static STATE_MEMORY_ESTIMATE=838;constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/tB.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){let t=new Set,r=[...e],s=!1,i=[];for(;r.length>0;){let c=r.pop();if(t.has(c))continue;t.add(c);let u=this.prog.getInst(c);switch(u.op){case F.MATCH:s=!0,i.includes(u.arg)||i.push(u.arg);break;case F.ALT:case F.ALT_MATCH:r.push(u.out),r.push(u.arg);break;case F.NOP:case F.CAPTURE:r.push(u.out);break;case F.EMPTY_WIDTH:case F.LB_WRITE:case F.LB_CHECK:return null}}let o=Int32Array.from(t).sort();return i.sort((c,u)=>c-u),{pcs:o,isMatch:s,matchIDs:i}}getState(e){let t=this.computeClosure(e);if(!t)return null;let r=t.pcs,s=aC(r),i=this.stateCache.get(s);if(i)for(let c=0;c<i.length;c++){let u=i[c];if(dI(u.nfaStates,r))return u.lastSeen=++this.clock,u}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=tB.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}let o=new fI(r,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){let e=[];for(let o of this.stateCache.values())for(let c=0;c<o.length;c++)e.push(o[c]);e.sort((o,c)=>o.lastSeen-c.lastSeen);let t=Math.max(1,Math.floor(this.stateLimit/2)),r=e.length-t,s=e.slice(r),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){let c=s[o];c.nextLatin1.fill(null),c.nextLatin1Anchored.fill(null),c.transKeys.length=0,c.transVals.length=0;let u=aC(c.nfaStates),l=this.stateCache.get(u);l||(l=[],this.stateCache.set(u,l)),l.push(c),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,r){if(t<=z.MAX_LATIN1)if(r===L.UNANCHORED){let o=e.nextLatin1[t];if(o!==null)return o}else{let o=e.nextLatin1Anchored[t];if(o!==null)return o}else{let o=t+(r===L.UNANCHORED?0:z.MAX_RUNE+1),c=e.transKeys,u=c.length;for(let l=0;l<u;l++)if(c[l]===o)return e.transVals[l]}let s=[];for(let o=0;o<e.nfaStates.length;o++){let c=e.nfaStates[o],u=this.prog.getInst(c);F.isRuneOp(u.op)&&u.matchRune(t)&&s.push(u.out)}r===L.UNANCHORED&&s.push(this.prog.start);let i=this.getState(s);if(t<=z.MAX_LATIN1)r===L.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{let o=t+(r===L.UNANCHORED?0:z.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,r){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(r===L.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){let c=e.step(o),u=c>>3,l=c&7;if(l===0)break;if(i=r===L.UNANCHORED&&u<=z.MAX_LATIN1&&i.nextLatin1[u]||this.step(i,u,r),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(r===L.ANCHOR_BOTH){if(o+l===s)return!0}else return!0;if(i.nfaStates.length===0&&r!==L.UNANCHORED)return!1;o+=l}return!1}matchSet(e,t,r){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState,o=new Set,c=(l,h)=>{l.isMatch&&(r===L.ANCHOR_BOTH?h===s&&l.matchIDs.forEach(f=>o.add(f)):l.matchIDs.forEach(f=>o.add(f)))};c(i,t);let u=t;for(;u<s;){let l=e.step(u),h=l>>3,f=l&7;if(f===0)break;if(i=r===L.UNANCHORED&&h<=z.MAX_LATIN1&&i.nextLatin1[h]||this.step(i,h,r),i===null)return null;if(i.lastSeen=++this.clock,u+=f,c(i,u),i.nfaStates.length===0&&r!==L.UNANCHORED)break}return Array.from(o).sort((l,h)=>l-h)}},pI=32,gI=500,$l=256,CI=256*1024,mI=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array($l),this.jobArg=new Uint8Array($l),this.jobPos=new Int32Array($l),this.jobLen=0,this.visited=new Uint32Array(0)}reset(n,e,t){this.end=e,this.jobLen=0,this.ncap=t;let r=n.numInst()*(e+1)+pI-1>>>5;this.visited.length<r?this.visited=new Uint32Array(r):this.visited.fill(0,0,r),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(n,e){let t=n*(this.end+1)+e,r=t>>>5,s=1<<(t&31);return(this.visited[r]&s)!==0?!1:(this.visited[r]|=s,!0)}push(n,e,t,r){if(n.prog.getInst(e).op!==F.FAIL&&(r||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){let s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;let o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;let c=new Int32Array(s);c.set(this.jobPos),this.jobPos=c}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=r?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(n,e,t,r,s){let i=n.longest;for(this.push(n,t,r,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],c=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],l=!0;for(;!(!l&&!this.shouldVisit(o,u));){l=!1;let h=n.prog.getInst(o);switch(h.op){case F.FAIL:throw new eo("unexpected InstFail");case F.ALT:if(c){c=!1,o=h.arg;continue}else{this.push(n,o,u,!0),o=h.out;continue}case F.ALT_MATCH:{let f=n.prog.getInst(h.out);if(F.isRuneOp(f.op)){this.push(n,h.arg,u,!1),o=h.arg,u=this.end;continue}this.push(n,h.out,this.end,!1),o=h.out;continue}case F.RUNE:{let f=e.step(u);if(f===_t.EOF()||!h.matchRune(f>>3))break;u+=f&7,o=h.out;continue}case F.RUNE1:{let f=e.step(u);if(f===_t.EOF()||f>>3!==h.runes[0])break;u+=f&7,o=h.out;continue}case F.RUNE_ANY_NOT_NL:{let f=e.step(u);if(f===_t.EOF()||f>>3===10)break;u+=f&7,o=h.out;continue}case F.RUNE_ANY:{let f=e.step(u);if(f===_t.EOF())break;u+=f&7,o=h.out;continue}case F.CAPTURE:if(c){this.cap[h.arg]=u;break}else{h.arg<this.ncap&&(this.push(n,o,this.cap[h.arg],!0),this.cap[h.arg]=u),o=h.out;continue}case F.EMPTY_WIDTH:{let f=e.context(u);if((h.arg&~f)!==0)break;o=h.out;continue}case F.NOP:o=h.out;continue;case F.MATCH:{if(s===L.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);let f=this.matchcap[1];if((f===-1||i&&u>0&&u>f)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case F.LB_WRITE:case F.LB_CHECK:throw new eo("Backtracker cannot evaluate Lookbehind instructions");default:throw new eo("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}},rc=[],sc=class VC{static shouldBacktrack(e){return e.numInst()<=gI}static maxBitStateLen(e){return VC.shouldBacktrack(e)?Math.floor(CI/e.numInst()):0}static execute(e,t,r,s,i){let o=e.cond;if(o===Y.EMPTY_ALL||(s===L.ANCHOR_START||s===L.ANCHOR_BOTH)&&r!==0||(o&Y.EMPTY_BEGIN_TEXT)!==0&&r!==0)return null;let c=rc.length>0?rc.pop():new mI,u=t.endPos();c.reset(e.prog,u,i);let l=!1;if((o&Y.EMPTY_BEGIN_TEXT)!==0||s===L.ANCHOR_START||s===L.ANCHOR_BOTH)c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)&&(l=!0);else{let f=-1;for(;r<=u&&f!==0;r+=f){if(e.prefix.length>0){let v=t.index(e,r);if(v<0)break;r+=v}if(c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)){l=!0;break}let g=t.step(r);f=g===_t.EOF()?0:g&7}}if(!l)return rc.push(c),null;let h=i===0?[]:Y.toArray(c.matchcap.subarray(0,i));return rc.push(c),h}},cC=class{constructor(n){this.sparse=new Uint32Array(n),this.dense=new Uint32Array(n),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(n){return n<this.sparse.length&&this.sparse[n]<this.size&&this.dense[this.sparse[n]]===n}insert(n){this.contains(n)||this.insertNew(n)}insertNew(n){n>=this.sparse.length||(this.sparse[n]=this.size,this.dense[this.size]=n,this.size++)}},EI=(n,e,t,r)=>{let s=n.length,i=e.length,o=0,c=0,u=[],l=[],h=!0,f=-1,g=v=>{let I=v?n:e,S=v?o:c,U=v?t:r;return f>0&&I[S]<=u[f]?!1:(u.push(I[S],I[S+1]),v?o+=2:c+=2,f+=2,l.push(U),!0)};for(;o<s||c<i;)if(c>=i?h=g(!0):o>=s||e[c]<n[o]?h=g(!1):h=g(!0),!h)return null;return{merged:u,next:l}},_I=class{constructor(n){this.start=n.start,this.numCap=n.numCap,this.inst=new Array(n.inst.length);for(let e=0;e<n.inst.length;e++){let t=n.inst[e],r=new F(t.op);r.out=t.out,r.arg=t.arg,r.runes=t.runes?t.runes.slice():[],r.next=null,this.inst[e]=r}}},wI=n=>{let e=new _I(n);for(let t=0;t<e.inst.length;t++){let r=e.inst[t];if(r.op!==F.ALT&&r.op!==F.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[r[i]];if(o.op!==F.ALT&&o.op!==F.ALT_MATCH&&(s="arg",i="out",o=e.inst[r[i]],o.op!==F.ALT&&o.op!==F.ALT_MATCH))continue;let c=e.inst[r[s]];if(c.op===F.ALT||c.op===F.ALT_MATCH)continue;let u="out",l="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,u="arg",l="out"),h&&(o[u]=r[s]),r[s]===o[u]&&(r[i]=o[l])}return e},yI=n=>{if(n.inst.length>=1e3)return null;let e=new cC(n.inst.length),t=new cC(n.inst.length),r=new Array(n.inst.length),s=new Array(n.inst.length).fill(!1),i=o=>{let c=!0,u=n.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case F.ALT:case F.ALT_MATCH:{c=i(u.out)&&i(u.arg);let l=s[u.out],h=s[u.arg];if(l&&h)return!1;if(h){let I=u.out;u.out=u.arg,u.arg=I;let S=l;l=h,h=S}l&&(s[o]=!0,u.op=F.ALT_MATCH);let f=r[u.out]||[],g=r[u.arg]||[],v=EI(f,g,u.out,u.arg);if(!v)return!1;r[o]=v.merged,u.next=new Uint32Array(v.next);break}case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:c=i(u.out),s[o]=s[u.out],r[o]=r[u.out]?r[u.out].slice():[],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break;case F.MATCH:case F.FAIL:s[o]=u.op===F.MATCH;break;case F.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){r[o]=[],u.next=new Uint32Array([u.out]);break}let l=[];if(u.runes.length===1&&(u.arg&L.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=z.simpleFold(h);f!==h;f=z.simpleFold(f))l.push(f,f);l.sort((f,g)=>f-g)}else for(let h=0;h<u.runes.length;h++)l.push(u.runes[h]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let l=[];if((u.arg&L.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=z.simpleFold(h);f!==h;f=z.simpleFold(f))l.push(f,f);l.sort((f,g)=>f-g)}else l.push(u.runes[0],u.runes[0]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,z.MAX_RUNE],u.next=new Uint32Array([u.out]);break;case F.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,9,11,z.MAX_RUNE],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break}return c};for(e.clear(),e.insert(n.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<n.inst.length;o++)r[o]&&(n.inst[o].runes=r[o]);return n},DI=(n,e)=>{for(let t=0;t<e.inst.length;t++){let r=e.inst[t];switch(r.op){case F.ALT:case F.ALT_MATCH:case F.RUNE:break;case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:case F.MATCH:case F.FAIL:n.inst[t].next=null;break;case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:n.inst[t].next=null,n.inst[t].op=r.op,n.inst[t].runes=r.runes?r.runes.slice():[];break}}},uC=class MC{static compile(e){if(e.start===0||e.numLb>0)return null;let t=e.inst[e.start];if(t.op!==F.EMPTY_WIDTH||(t.arg&Y.EMPTY_BEGIN_TEXT)===0)return null;let r=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===F.ALT||e.inst[i].op===F.ALT_MATCH){r=!0;break}for(let i=0;i<e.inst.length;i++){let o=e.inst[i],c=e.inst[o.out].op;switch(o.op){case F.ALT:case F.ALT_MATCH:if(c===F.MATCH||e.inst[o.arg].op===F.MATCH)return null;break;case F.EMPTY_WIDTH:if(c===F.MATCH){if((o.arg&Y.EMPTY_END_TEXT)===Y.EMPTY_END_TEXT)continue;return null}break;default:if(c===F.MATCH&&r)return null;break}}let s=wI(e);return s=yI(s),s!==null&&DI(s,e),s}static next(e,t){let r=e.matchRunePos(t);return r>=0?e.next[r]:e.op===F.ALT_MATCH?e.out:0}static execute(e,t,r,s,i){let o=e.onepass;if(!o)return null;let c=new Int32Array(i).fill(-1),u=!1,l=t.step(r),h=l>>3,f=l&7,g=_t.EOF(),v=-1,I=0;l!==_t.EOF()&&(g=t.step(r+f),g!==_t.EOF()&&(v=g>>3,I=g&7));let S=r===0?Y.emptyOpContext(-1,h):t.context(r),U=o.start,H;for(;;){switch(H=o.inst[U],U=H.out,H.op){case F.MATCH:return s===L.ANCHOR_BOTH&&r!==t.endPos()?null:(u=!0,c.length>0&&(c[0]=0,c[1]=r),i===0?[]:Y.toArray(c));case F.RUNE:if(!H.matchRune(h))return null;break;case F.RUNE1:if(h!==H.runes[0])return null;break;case F.RUNE_ANY:break;case F.RUNE_ANY_NOT_NL:if(h===10)return null;break;case F.ALT:case F.ALT_MATCH:U=MC.next(H,h);continue;case F.FAIL:return null;case F.NOP:continue;case F.EMPTY_WIDTH:if((H.arg&~S)!==0)return null;continue;case F.CAPTURE:H.arg<c.length&&(c[H.arg]=r);continue;default:throw new eo("bad inst")}if(f===0)break;S=Y.emptyOpContext(h,v),r+=f,h=v,f=I,h!==-1&&(g=t.step(r+f),g!==_t.EOF()?(v=g>>3,I=g&7):(v=-1,I=0))}return u?i===0?[]:Y.toArray(c):null}},T=class oe{static Op=OC(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"]);static isPseudoOp(e){return e>=oe.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===k.CODES.get("-")?"\\":""}static fromRegexp(e){let t=new oe(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=oe.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=oe.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case oe.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case oe.Op.EMPTY_MATCH:e+="(?:)";break;case oe.Op.STAR:case oe.Op.PLUS:case oe.Op.QUEST:case oe.Op.REPEAT:{let t=this.subs[0];switch(t.op>oe.Op.CAPTURE||t.op===oe.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case oe.Op.STAR:e+="*";break;case oe.Op.PLUS:e+="+";break;case oe.Op.QUEST:e+="?";break;case oe.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&L.NON_GREEDY)!==0&&(e+="?");break}case oe.Op.CONCAT:for(let t of this.subs)t.op===oe.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case oe.Op.ALTERNATE:{let t="";for(let r of this.subs)e+=t,t="|",e+=r.appendTo();break}case oe.Op.LITERAL:(this.flags&L.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=Y.escapeRune(t);(this.flags&L.FOLD_CASE)!==0&&(e+=")");break;case oe.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case oe.Op.ANY_CHAR:e+="(?s:.)";break;case oe.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case oe.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case oe.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==oe.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case oe.Op.BEGIN_TEXT:e+="\\A";break;case oe.Op.END_TEXT:(this.flags&L.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case oe.Op.BEGIN_LINE:e+="^";break;case oe.Op.END_LINE:e+="$";break;case oe.Op.WORD_BOUNDARY:e+="\\b";break;case oe.Op.NO_WORD_BOUNDARY:e+="\\B";break;case oe.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===z.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){let r=this.runes[t]+1,s=this.runes[t+1]-1;e+=oe.quoteIfHyphen(r),e+=Y.escapeRune(r),r!==s&&(e+="-",e+=oe.quoteIfHyphen(s),e+=Y.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){let r=this.runes[t],s=this.runes[t+1];e+=oe.quoteIfHyphen(r),e+=Y.escapeRune(r),r!==s&&(e+="-",e+=oe.quoteIfHyphen(s),e+=Y.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===oe.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){let r=t.maxCap();e<r&&(e=r)}return e}equals(e){if(!(e!==null&&e instanceof oe)||this.op!==e.op)return!1;switch(this.op){case oe.Op.END_TEXT:if((this.flags&L.WAS_DOLLAR)!==(e.flags&L.WAS_DOLLAR))return!1;break;case oe.Op.LITERAL:case oe.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case oe.Op.ALTERNATE:case oe.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case oe.Op.STAR:case oe.Op.PLUS:case oe.Op.QUEST:if((this.flags&L.NON_GREEDY)!==(e.flags&L.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.REPEAT:if((this.flags&L.NON_GREEDY)!==(e.flags&L.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case oe.Op.PLB:case oe.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},lC=class{constructor(n){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(let t of n){let r=0;for(let s=0;s<t.length;s++){let i=t[s];i in this.next[r]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[r][i]=this.next.length-1),r=this.next[r][i]}this.match[r]=!0}let e=[];for(let t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){let r=this.next[0][t];this.fail[r]=0,e.push(r)}for(;e.length>0;){let t=e.shift();for(let r in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],r)){let s=this.next[t][r],i=this.fail[t];for(;i!==0&&!(r in this.next[i]);)i=this.fail[i];r in this.next[i]?this.fail[s]=this.next[i][r]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n.charCodeAt(s);for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}searchUTF8(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n[s];for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}},Ae=class Zi{static Type={NONE:0,EXACT:1,AND:2,OR:3};constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case Zi.Type.NONE:return!0;case Zi.Type.EXACT:return e.hasString(this,t);case Zi.Type.AND:for(let r=0;r<this.subs.length;r++)if(!this.subs[r].eval(e,t))return!1;return!0;case Zi.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let r=0;r<this.subs.length;r++)if(this.subs[r].eval(e,t))return!0;return!1;default:return!0}}},II=class On{static build(e){let t=On.fromRegexp(e);return On.simplify(t)}static fromRegexp(e){if(!e)return new Ae(Ae.Type.NONE);switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.NO_MATCH:case T.Op.EMPTY_MATCH:case T.Op.BEGIN_LINE:case T.Op.END_LINE:case T.Op.BEGIN_TEXT:case T.Op.END_TEXT:case T.Op.WORD_BOUNDARY:case T.Op.NO_WORD_BOUNDARY:case T.Op.CHAR_CLASS:case T.Op.ANY_CHAR_NOT_NL:case T.Op.ANY_CHAR:return new Ae(Ae.Type.NONE);case T.Op.LITERAL:{if(e.runes.length===0||(e.flags&L.FOLD_CASE)!==0)return new Ae(Ae.Type.NONE);let t=new Ae(Ae.Type.EXACT),r="";for(let s=0;s<e.runes.length;s++)r+=String.fromCodePoint(e.runes[s]);return t.str=r,t.bytes=Y.stringToUtf8ByteArray(t.str),t}case T.Op.CAPTURE:case T.Op.PLUS:return On.fromRegexp(e.subs[0]);case T.Op.REPEAT:return e.min>=1?On.fromRegexp(e.subs[0]):new Ae(Ae.Type.NONE);case T.Op.CONCAT:{let t=new Ae(Ae.Type.AND);for(let r of e.subs)t.subs.push(On.fromRegexp(r));return t}case T.Op.ALTERNATE:{let t=new Ae(Ae.Type.OR);for(let r of e.subs)t.subs.push(On.fromRegexp(r));return t}default:return new Ae(Ae.Type.NONE)}}static simplify(e){if(e.type===Ae.Type.EXACT||e.type===Ae.Type.NONE)return e;if(e.type===Ae.Type.AND){let t=[];for(let r of e.subs){let s=On.simplify(r);if(s.type!==Ae.Type.NONE)if(s.type===Ae.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new Ae(Ae.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===Ae.Type.OR){let t=[];for(let o of e.subs){let c=On.simplify(o);if(c.type===Ae.Type.NONE)return new Ae(Ae.Type.NONE);if(c.type===Ae.Type.OR)for(let u=0;u<c.subs.length;u++)t.push(c.subs[u]);else t.push(c)}if(t.length===0)return new Ae(Ae.Type.NONE);if(t.length===1)return t[0];let r=new Set,s=[];for(let o of t)o.type===Ae.Type.EXACT?r.has(o.str)||(r.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(let o of s)if(o.type!==Ae.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new lC(s.map(o=>{let c=[];for(let u=0;u<o.str.length;u++)c.push(o.str.charCodeAt(u));return c})),e.ac8=new lC(s.map(o=>o.bytes))),e}return e}},zt=class{constructor(n=0,e=0){this.head=n,this.tail=e}},TI=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(n){return this.inst[n]}numInst(){return this.inst.length}addInst(n){this.inst.push(new F(n))}skipNop(n){let e=this.inst[n];for(;e.op===F.NOP||e.op===F.CAPTURE;)e=this.inst[n],n=e.out;return e}prefix(){let n="",e=this.skipNop(this.start);if(!F.isRuneOp(e.op)||e.runes.length!==1)return[e.op===F.MATCH,n];for(;F.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&L.FOLD_CASE)===0;)n+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===F.MATCH,n]}startCond(){let n=0,e=this.start;e:for(;;){let t=this.inst[e];switch(t.op){case F.EMPTY_WIDTH:n|=t.arg;break;case F.FAIL:return-1;case F.CAPTURE:case F.NOP:break;default:break e}e=t.out}return n}patch(n,e){let t=n.head;for(;t!==0;){let r=this.inst[t>>1];(t&1)===0?(t=r.out,r.out=e):(t=r.arg,r.arg=e)}}append(n,e){if(n.head===0)return e;if(e.head===0)return n;let t=this.inst[n.tail>>1];return(n.tail&1)===0?t.out=e.head:t.arg=e.head,new zt(n.head,e.tail)}toString(){let n="";for(let e=0;e<this.inst.length;e++){let t=n.length;n+=e,e===this.start&&(n+="*"),n+="        ".substring(n.length-t),n+=this.inst[e],n+=`
`}return n}},ic=class{constructor(n=0,e=new zt,t=!1){this.i=n,this.out=e,this.nullable=t}},GC=class Ss{static ANY_RUNE_NOT_NL(){return[0,k.CODES.get(`
`)-1,k.CODES.get(`
`)+1,z.MAX_RUNE]}static ANY_RUNE(){return[0,z.MAX_RUNE]}static compileRegexp(e){let t=new Ss,r=t.compile(e);return t.prog.patch(r.out,t.newInst(F.MATCH).i),t.prog.start=r.i,t.prog}static compileSet(e){let t=new Ss;if(e.length===0)return t.prog.start=t.newInst(F.FAIL).i,t.prog;let r=[];for(let i=0;i<e.length;i++){let o=t.compile(e[i]),c=t.newInst(F.MATCH);t.prog.getInst(c.i).arg=i,t.prog.patch(o.out,c.i),r.push(o.i)}let s=r[0];for(let i=1;i<r.length;i++){let o=t.newInst(F.ALT),c=t.prog.getInst(o.i);c.out=s,c.arg=r[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new TI,this.newInst(F.FAIL)}newInst(e){return this.prog.addInst(e),new ic(this.prog.numInst()-1,new zt,!0)}nop(){let e=this.newInst(F.NOP);return e.out=new zt(e.i<<1,e.i<<1),e}fail(){return new ic}cap(e){let t=this.newInst(F.CAPTURE);return t.out=new zt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new ic(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return s.out=e.i,s.arg=t.i,r.out=this.prog.append(e.out,t.out),r.nullable=e.nullable||t.nullable,r}loop(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new zt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new zt(r.i<<1|1,r.i<<1|1)),this.prog.patch(e.out,r.i),r}quest(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new zt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new zt(r.i<<1|1,r.i<<1|1)),r.out=this.prog.append(r.out,e.out),r}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new ic(e.i,this.loop(e,t).out,e.nullable)}empty(e){let t=this.newInst(F.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new zt(t.i<<1,t.i<<1),t}rune(e,t){let r=this.newInst(F.RUNE);r.nullable=!1;let s=this.prog.getInst(r.i);return s.runes=e,t&=L.FOLD_CASE,(e.length!==1||z.simpleFold(e[0])===e[0])&&(t&=~L.FOLD_CASE),s.arg=t,r.out=new zt(r.i<<1,r.i<<1),(t&L.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=F.RUNE1:e.length===2&&e[0]===0&&e[1]===z.MAX_RUNE?s.op=F.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===k.CODES.get(`
`)-1&&e[2]===k.CODES.get(`
`)+1&&e[3]===z.MAX_RUNE&&(s.op=F.RUNE_ANY_NOT_NL),r}lookBehind(e,t){let r=this.newInst(F.LB_WRITE);this.prog.getInst(r.i).arg=t;let s=this.rune(Ss.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,r.i);let c=this.newInst(F.LB_CHECK);return this.prog.getInst(c.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),c.out=new zt(c.i<<1,c.i<<1),c}compile(e){switch(e.op){case T.Op.NO_MATCH:return this.fail();case T.Op.EMPTY_MATCH:return this.nop();case T.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let r of e.runes){let s=this.rune([r],e.flags);t=t===null?s:this.cat(t,s)}return t}case T.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case T.Op.ANY_CHAR_NOT_NL:return this.rune(Ss.ANY_RUNE_NOT_NL(),0);case T.Op.ANY_CHAR:return this.rune(Ss.ANY_RUNE(),0);case T.Op.BEGIN_LINE:return this.empty(Y.EMPTY_BEGIN_LINE);case T.Op.END_LINE:return this.empty(Y.EMPTY_END_LINE);case T.Op.BEGIN_TEXT:return this.empty(Y.EMPTY_BEGIN_TEXT);case T.Op.END_TEXT:return this.empty(Y.EMPTY_END_TEXT);case T.Op.WORD_BOUNDARY:return this.empty(Y.EMPTY_WORD_BOUNDARY);case T.Op.NO_WORD_BOUNDARY:return this.empty(Y.EMPTY_NO_WORD_BOUNDARY);case T.Op.PLB:case T.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case T.Op.CAPTURE:{let t=this.cap(e.cap<<1),r=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,r),s)}case T.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.cat(t,s)}return t}case T.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.alt(t,s)}return t}default:throw new kC("regexp: unhandled case in compile")}}},UC=class Ft{static simplify(e){if(e===null)return null;switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:{let t=Ft.simplify(e.subs[0]);if(t!==e.subs[0]){let r=T.fromRegexp(e);return r.runes=[],r.subs=[t],r}return e}case T.Op.CONCAT:case T.Op.ALTERNATE:{let t=[],r=!1;for(let s=0;s<e.subs.length;s++){let i=e.subs[s],o=Ft.simplify(i);if(o!==i&&(r=!0),e.op===T.Op.CONCAT){if(o.op===T.Op.NO_MATCH)return new T(T.Op.NO_MATCH);if(o.op===T.Op.EMPTY_MATCH){r=!0;continue}if(o.op===T.Op.CONCAT){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}else if(e.op===T.Op.ALTERNATE){if(o.op===T.Op.NO_MATCH){r=!0;continue}if(o.op===T.Op.ALTERNATE){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}t.push(o)}if(r){if(t.length===0)return new T(e.op===T.Op.CONCAT?T.Op.EMPTY_MATCH:T.Op.NO_MATCH);if(t.length===1)return t[0];let s=T.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case T.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new T(T.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?new T(T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE?new T(T.Op.ANY_CHAR_NOT_NL):e;case T.Op.STAR:case T.Op.PLUS:case T.Op.QUEST:{let t=Ft.simplify(e.subs[0]);return Ft.simplify1(e.op,e.flags,t,e)}case T.Op.REPEAT:{if(e.min===0&&e.max===0)return new T(T.Op.EMPTY_MATCH);let t=Ft.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return Ft.simplify1(T.Op.STAR,e.flags,t,null);if(e.min===1)return Ft.simplify1(T.Op.PLUS,e.flags,t,null);let s=new T(T.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(Ft.simplify1(T.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),Ft.simplify(s)}if(e.min===1&&e.max===1)return t;let r=null;if(e.min>0){r=[];for(let s=0;s<e.min;s++)r.push(t)}if(e.max>e.min){let s=Ft.simplify1(T.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){let o=new T(T.Op.CONCAT);o.subs=[t,s],s=Ft.simplify1(T.Op.QUEST,e.flags,o,null)}if(r===null)return s;r.push(s)}if(r!==null){let s=new T(T.Op.CONCAT);return s.subs=r.slice(0),Ft.simplify(s)}return new T(T.Op.NO_MATCH)}}return e}static simplify1(e,t,r,s){if(r.op===T.Op.EMPTY_MATCH)return r;if(r.op===T.Op.NO_MATCH)return e===T.Op.PLUS?r:new T(T.Op.EMPTY_MATCH);if(e===r.op&&(t&L.NON_GREEDY)===(r.flags&L.NON_GREEDY))return r;if(s!==null&&s.op===e&&(s.flags&L.NON_GREEDY)===(t&L.NON_GREEDY)&&r===s.subs[0])return s;let i=new T(e);return i.flags=t,i.subs=[r],i}},we=class{constructor(n,e){this.sign=n,this.cls=e}},BC=[48,57],hC=[9,10,12,13,32,32],dC=[48,57,65,90,95,95,97,122],fC=new Map([["\\d",new we(1,BC)],["\\D",new we(-1,BC)],["\\s",new we(1,hC)],["\\S",new we(-1,hC)],["\\w",new we(1,dC)],["\\W",new we(-1,dC)]]),pC=[48,57,65,90,97,122],gC=[65,90,97,122],CC=[0,127],mC=[9,9,32,32],EC=[0,31,127,127],_C=[48,57],wC=[33,126],yC=[97,122],DC=[32,126],IC=[33,47,58,64,91,96,123,126],TC=[9,13,32,32],AC=[65,90],vC=[48,57,65,90,95,95,97,122],bC=[48,57,65,70,97,102],SC=new Map([["[:alnum:]",new we(1,pC)],["[:^alnum:]",new we(-1,pC)],["[:alpha:]",new we(1,gC)],["[:^alpha:]",new we(-1,gC)],["[:ascii:]",new we(1,CC)],["[:^ascii:]",new we(-1,CC)],["[:blank:]",new we(1,mC)],["[:^blank:]",new we(-1,mC)],["[:cntrl:]",new we(1,EC)],["[:^cntrl:]",new we(-1,EC)],["[:digit:]",new we(1,_C)],["[:^digit:]",new we(-1,_C)],["[:graph:]",new we(1,wC)],["[:^graph:]",new we(-1,wC)],["[:lower:]",new we(1,yC)],["[:^lower:]",new we(-1,yC)],["[:print:]",new we(1,DC)],["[:^print:]",new we(-1,DC)],["[:punct:]",new we(1,IC)],["[:^punct:]",new we(-1,IC)],["[:space:]",new we(1,TC)],["[:^space:]",new we(-1,TC)],["[:upper:]",new we(1,AC)],["[:^upper:]",new we(-1,AC)],["[:word:]",new we(1,vC)],["[:^word:]",new we(-1,vC)],["[:xdigit:]",new we(1,bC)],["[:^xdigit:]",new we(-1,bC)]]),hr=class dr{static charClassToString(e,t){let r="[";for(let s=0;s<t;s+=2){s>0&&(r+=" ");let i=e[s],o=e[s+1];i===o?r+=`0x${i.toString(16)}`:r+=`0x${i.toString(16)}-0x${o.toString(16)}`}return r+="]",r}static cmp(e,t,r,s){let i=e[t]-r;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,r){let s=((t+r)/2|0)&-2,i=e[s],o=e[s+1],c=t,u=r;for(;c<=u;){for(;c<r&&dr.cmp(e,c,i,o)<0;)c+=2;for(;u>t&&dr.cmp(e,u,i,o)>0;)u-=2;if(c<=u){if(c!==u){let l=e[c];e[c]=e[u],e[u]=l,l=e[c+1],e[c+1]=e[u+1],e[u+1]=l}c+=2,u-=2}}t<u&&dr.qsortIntPair(e,t,u),c<r&&dr.qsortIntPair(e,c,r)}constructor(e=Y.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;dr.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){let r=this.r[t],s=this.r[t+1];if(r<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=r,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&L.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let r=2;r<=4;r+=2)if(this.len>=r){let s=this.r[this.len-r],i=this.r[this.len-r+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-r]=e),t>i&&(this.r[this.len-r+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=z.MIN_FOLD&&t>=z.MAX_FOLD)return this.appendRange(e,t);if(t<z.MIN_FOLD||e>z.MAX_FOLD)return this.appendRange(e,t);e<z.MIN_FOLD&&(this.appendRange(e,z.MIN_FOLD-1),e=z.MIN_FOLD),t>z.MAX_FOLD&&(this.appendRange(z.MAX_FOLD+1,t),t=z.MAX_FOLD);for(let r=e;r<=t;r++){this.appendRange(r,r);for(let s=z.simpleFold(r);s!==r;s=z.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let r=0;r<e.length;r+=2){let s=e[r],i=e[r+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){let r=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(r,s);continue}for(let o=r;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let r=0;r<e.length;++r){let s=e.getLo(r),i=e.getHi(r),o=e.getStride(r);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let c=s;c<=i;c+=o)t<=c-1&&this.appendRange(t,c-1),t=c+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let r=0;r<this.len;r+=2){let s=this.r[r],i=this.r[r+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=z.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=z.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let r=e.cls;return t&&(r=new dr().appendFoldedClass(r).cleanClass().toArray()),this.appendClassWithSign(r,e.sign)}toString(){return dr.charClassToString(this.r,this.len)}},AI=class{constructor(n){this.str=n,this.position=0}pos(){return this.position}rewindTo(n){this.position=n}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(n){this.position+=n}skipString(n){this.position+=n.length}pop(){let n=this.str.codePointAt(this.position);return this.position+=Y.charCount(n),n}lookingAt(n){return this.str.startsWith(n,this.position)}rest(){return this.str.substring(this.position)}from(n){return this.str.substring(n,this.position)}toString(){return this.rest()}},HC=class ${static ERR_INTERNAL_ERROR="regexp/syntax: internal error";static ERR_INVALID_CHAR_RANGE="invalid character class range";static ERR_INVALID_ESCAPE="invalid escape sequence";static ERR_INVALID_NAMED_CAPTURE="invalid named capture";static ERR_INVALID_PERL_OP="invalid or unsupported Perl syntax";static ERR_INVALID_REPEAT_OP="invalid nested repetition operator";static ERR_INVALID_REPEAT_SIZE="invalid repeat count";static ERR_MISSING_BRACKET="missing closing ]";static ERR_MISSING_PAREN="missing closing )";static ERR_MISSING_REPEAT_ARGUMENT="missing argument to repetition operator";static ERR_TRAILING_BACKSLASH="trailing backslash at end of expression";static ERR_DUPLICATE_NAMED_CAPTURE="duplicate capture group name";static ERR_UNEXPECTED_PAREN="unexpected )";static ERR_NESTING_DEPTH="expression nests too deeply";static ERR_LARGE="expression too large";static ERR_INVALID_CAPTURE_IN_LOOKBEHIND="invalid capture in lookbehind";static MAX_HEIGHT=1e3;static MAX_SIZE=3355443;static MAX_RUNES=33554432;static ANY_TABLE=new E(new Uint32Array([0,z.MAX_RUNE,1]));static ASCII_TABLE=new E(new Uint32Array([0,127,1]));static ASCII_FOLD_TABLE=new E(new Uint32Array([0,127,1,383,383,1,8490,8490,1]));static unicodeTable(e){return e==="Any"?{tab:$.ANY_TABLE,fold:$.ANY_TABLE,sign:1}:e==="Ascii"?{tab:$.ASCII_TABLE,fold:$.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:At.CATEGORIES.get("Cn"),fold:At.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:At.CATEGORIES.get("LC"),fold:At.FOLD_CATEGORIES.get("LC"),sign:1}:At.CATEGORIES.has(e)?{tab:At.CATEGORIES.get(e),fold:At.FOLD_CATEGORIES.get(e),sign:1}:At.SCRIPTS.has(e)?{tab:At.SCRIPTS.get(e),fold:At.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<z.MIN_FOLD||e>z.MAX_FOLD)return e;let t=e,r=e;for(e=z.simpleFold(e);e!==r;e=z.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===T.Op.EMPTY_MATCH)return null;if(e.op===T.Op.CONCAT&&e.subs.length>0){let t=e.subs[0];return t.op===T.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){let r=new T(T.Op.LITERAL);return r.flags=t,r.runes=Y.stringToRunes(e),r}static parse(e,t){return new $(e,t).parseInternal()}static parseRepeat(e){let t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);let r=$.parseInt(e);if(r===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=r;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=$.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),r<0||r>1e3||s===-2||s>1e3||s>=0&&r>s)throw new Ne($.ERR_INVALID_REPEAT_SIZE,e.from(t));return r<<16|s&z.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){let r=e.codePointAt(t);if(r!==k.CODES.get("_")&&!Y.isalnum(r))return!1}return!0}static parseInt(e){let t=e.pos();for(;e.more()&&e.peek()>=k.CODES.get("0")&&e.peek()<=k.CODES.get("9");)e.skip(1);let r=e.from(t);return r.length===0||r.length>1&&r.codePointAt(0)===k.CODES.get("0")?-1:r.length>8?-2:parseInt(r,10)}static isCharClass(e){return e.op===T.Op.LITERAL&&e.runes.length===1||e.op===T.Op.CHAR_CLASS||e.op===T.Op.ANY_CHAR_NOT_NL||e.op===T.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case T.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case T.Op.CHAR_CLASS:for(let r=0;r<e.runes.length;r+=2)if(e.runes[r]<=t&&t<=e.runes[r+1])return!0;return!1;case T.Op.ANY_CHAR_NOT_NL:return t!==k.CODES.get(`
`);case T.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case T.Op.ANY_CHAR:break;case T.Op.ANY_CHAR_NOT_NL:$.matchRune(t,k.CODES.get(`
`))&&(e.op=T.Op.ANY_CHAR);break;case T.Op.CHAR_CLASS:t.op===T.Op.LITERAL?e.runes=new hr(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new hr(e.runes).appendClass(t.runes).toArray();break;case T.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=T.Op.CHAR_CLASS,e.runes=new hr().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){let t=e.pos();if(e.skip(1),!e.more())throw new Ne($.ERR_TRAILING_BACKSLASH);let r=e.pop();e:switch(r){case k.CODES.get("1"):case k.CODES.get("2"):case k.CODES.get("3"):case k.CODES.get("4"):case k.CODES.get("5"):case k.CODES.get("6"):case k.CODES.get("7"):if(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"))break;case k.CODES.get("0"):{let s=r-k.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"));i++)s=s*8+e.peek()-k.CODES.get("0"),e.skip(1);return s}case k.CODES.get("x"):{if(!e.more())break;if(r=e.pop(),r===k.CODES.get("{")){let o=0,c=0;for(;;){if(!e.more())break e;if(r=e.pop(),r===k.CODES.get("}"))break;let u=Y.unhex(r);if(u<0||(c=c*16+u,c>z.MAX_RUNE))break e;o++}if(o===0)break e;return c}let s=Y.unhex(r);if(!e.more())break;r=e.pop();let i=Y.unhex(r);if(s<0||i<0)break;return s*16+i}case k.CODES.get("a"):return k.CODES.get("\x07");case k.CODES.get("f"):return k.CODES.get("\f");case k.CODES.get("n"):return k.CODES.get(`
`);case k.CODES.get("r"):return k.CODES.get("\r");case k.CODES.get("t"):return k.CODES.get("	");case k.CODES.get("v"):return k.CODES.get("\v");default:if(r<=z.MAX_ASCII&&!Y.isalnum(r))return r;break}throw new Ne($.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new Ne($.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?$.parseEscape(e):e.pop()}static concatRunes(e,t){for(let r=0;r<t.length;r++)e.push(t[r]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===T.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if($.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new T(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>$.MAX_RUNES)throw new Ne($.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===T.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor($.MAX_SIZE/this.repeats)?this.repeats=$.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor($.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>$.MAX_SIZE)throw new Ne($.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let r=0;switch(e.op){case T.Op.LITERAL:r=e.runes.length;break;case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:case T.Op.STAR:r=2+this.calcSize(e.subs[0]);break;case T.Op.PLUS:case T.Op.QUEST:r=1+this.calcSize(e.subs[0]);break;case T.Op.CONCAT:for(let s of e.subs)r=r+this.calcSize(s);break;case T.Op.ALTERNATE:for(let s of e.subs)r=r+this.calcSize(s);e.subs.length>1&&(r=r+e.subs.length-1);break;case T.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?r=2+s:r=1+e.min*s;break}r=e.max*s+(e.max-e.min);break}}return r=Math.max(1,r),this.size===null&&(this.size=new Map),this.size.set(e,r),r}checkHeight(e){if(!(this.numRegexp<$.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>$.MAX_HEIGHT)throw new Ne($.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let r=1;for(let s of e.subs){let i=this.calcHeight(s);r<1+i&&(r=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,r),r}pop(){return this.stack.pop()}popToPseudo(){let e=this.stack.length,t=e;for(;t>0&&!T.isPseudoOp(this.stack[t-1].op);)t--;let r=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),r}push(e){if(this.numRunes+=e.runes.length,e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&~L.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&~L.FOLD_CASE}else if(e.op===T.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&z.simpleFold(e.runes[0])===e.runes[2]&&z.simpleFold(e.runes[2])===e.runes[0]||e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&z.simpleFold(e.runes[0])===e.runes[1]&&z.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|L.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|L.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){let r=this.stack.length;if(r<2)return!1;let s=this.stack[r-1],i=this.stack[r-2];return s.op!==T.Op.LITERAL||i.op!==T.Op.LITERAL||(s.flags&L.FOLD_CASE)!==(i.flags&L.FOLD_CASE)?!1:(i.runes=$.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){let r=this.newRegexp(T.Op.LITERAL);return r.flags=t,(t&L.FOLD_CASE)!==0&&(e=$.minFoldRune(e)),r.runes=[e],r}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){let t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,r,s,i,o){let c=this.flags;if((c&L.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),c^=L.NON_GREEDY),o!==-1))throw new Ne($.ERR_INVALID_REPEAT_OP,i.from(o));let u=this.stack.length;if(u===0)throw new Ne($.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let l=this.stack[u-1];if(T.isPseudoOp(l.op))throw new Ne($.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let h=this.newRegexp(e);if(h.min=t,h.max=r,h.flags=c,h.subs=[l],this.stack[u-1]=h,this.checkLimits(h),e===T.Op.REPEAT&&(t>=2||r>=2)&&!this.repeatIsValid(h,1e3))throw new Ne($.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===T.Op.REPEAT){let r=e.max;if(r===0)return!0;if(r<0&&(r=e.min),r>t)return!1;r>0&&(t=Math.trunc(t/r))}for(let r of e.subs)if(!this.repeatIsValid(r,t))return!1;return!0}concat(){this.maybeConcat(-1,0);let e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(T.Op.EMPTY_MATCH)):this.push(this.collapse(e,T.Op.CONCAT))}alternate(){let e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(T.Op.NO_MATCH)):this.push(this.collapse(e,T.Op.ALTERNATE))}cleanAlt(e){e.op===T.Op.CHAR_CLASS&&(e.runes=new hr(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?(e.runes=[],e.op=T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE&&(e.runes=[],e.op=T.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let r=0;for(let c of e)r+=c.op===t?c.subs.length:1;let s=new Array(r).fill(null),i=0;for(let c of e)if(c.op===t){for(let u=0;u<c.subs.length;u++)s[i++]=c.subs[u];this.reuse(c)}else s[i++]=c;let o=this.newRegexp(t);if(o.subs=s,t===T.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){let c=o;o=o.subs[0],this.reuse(c)}return o}factor(e){if(e.length<2)return e;let t=0,r=e.length,s=0,i=null,o=0,c=0,u=0;for(let h=0;h<=r;h++){let f=null,g=0,v=0;if(h<r){let I=e[t+h];if(I.op===T.Op.CONCAT&&I.subs.length>0&&(I=I.subs[0]),I.op===T.Op.LITERAL&&(f=I.runes,g=I.runes.length,v=I.flags&L.FOLD_CASE),v===c){let S=0;for(;S<o&&S<g&&i[S]===f[S];)S++;if(S>0){o=S;continue}}}if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let I=this.newRegexp(T.Op.LITERAL);I.flags=c,I.runes=i.slice(0,o);for(let H=u;H<h;H++)e[t+H]=this.removeLeadingString(e[t+H],o),this.checkLimits(e[t+H]);let S=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),U=this.newRegexp(T.Op.CONCAT);U.subs=[I,S],e[s++]=U}u=h,i=f,o=g,c=v}r=s,t=0,u=0,s=0;let l=null;for(let h=0;h<=r;h++){let f=null;if(!(h<r&&(f=$.leadingRegexp(e[t+h]),l!==null&&l.equals(f)&&($.isCharClass(l)||l.op===T.Op.REPEAT&&l.min===l.max&&$.isCharClass(l.subs[0]))))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let g=l;for(let S=u;S<h;S++){let U=S!==u;e[t+S]=this.removeLeadingRegexp(e[t+S],U),this.checkLimits(e[t+S])}let v=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),I=this.newRegexp(T.Op.CONCAT);I.subs=[g,v],e[s++]=I}u=h,l=f}}r=s,t=0,u=0,s=0;for(let h=0;h<=r;h++)if(!(h<r&&$.isCharClass(e[t+h]))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let f=u;for(let v=u+1;v<h;v++){let I=e[t+f],S=e[t+v];(I.op<S.op||I.op===S.op&&(I.runes!==null?I.runes.length:0)<(S.runes!==null?S.runes.length:0))&&(f=v)}let g=e[t+u];e[t+u]=e[t+f],e[t+f]=g;for(let v=u+1;v<h;v++)$.mergeCharClass(e[t+u],e[t+v]),this.reuse(e[t+v]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}h<r&&(e[s++]=e[t+h]),u=h+1}r=s,t=0,u=0,s=0;for(let h=0;h<r;++h)h+1<r&&e[t+h].op===T.Op.EMPTY_MATCH&&e[t+h+1].op===T.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return r=s,t=0,e.slice(t,r)}removeLeadingString(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){let r=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=r,r.op===T.Op.EMPTY_MATCH)switch(this.reuse(r),e.subs.length){case 0:case 1:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 2:{let s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===T.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=T.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 1:{let r=e;e=e.subs[0],this.reuse(r);break}}return e}return t&&this.reuse(e),this.newRegexp(T.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&L.LITERAL)!==0)return $.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,r=-1,s=new AI(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case k.CODES.get("("):if((this.flags&L.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&L.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(T.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case k.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case k.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case k.CODES.get("^"):(this.flags&L.ONE_LINE)!==0?this.op(T.Op.BEGIN_TEXT):this.op(T.Op.BEGIN_LINE),s.skip(1);break;case k.CODES.get("$"):(this.flags&L.ONE_LINE)!==0?this.op(T.Op.END_TEXT).flags|=L.WAS_DOLLAR:this.op(T.Op.END_LINE),s.skip(1);break;case k.CODES.get("."):(this.flags&L.DOT_NL)!==0?this.op(T.Op.ANY_CHAR):this.op(T.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case k.CODES.get("["):this.parseClass(s);break;case k.CODES.get("*"):case k.CODES.get("+"):case k.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case k.CODES.get("*"):o=T.Op.STAR;break;case k.CODES.get("+"):o=T.Op.PLUS;break;case k.CODES.get("?"):o=T.Op.QUEST;break}this.repeat(o,t,r,i,s,e);break}case k.CODES.get("{"):{i=s.pos();let o=$.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,r=(o&z.MAX_BMP)<<16>>16,this.repeat(T.Op.REPEAT,t,r,i,s,e);break}case k.CODES.get("\\"):{let o=s.pos();if(s.skip(1),(this.flags&L.PERL_X)!==0&&s.more())switch(s.pop()){case k.CODES.get("A"):this.op(T.Op.BEGIN_TEXT);break e;case k.CODES.get("b"):this.op(T.Op.WORD_BOUNDARY);break e;case k.CODES.get("B"):this.op(T.Op.NO_WORD_BOUNDARY);break e;case k.CODES.get("C"):throw new Ne($.ERR_INVALID_ESCAPE,"\\C");case k.CODES.get("Q"):{let l=s.rest(),h=l.indexOf("\\E");h>=0?(l=l.substring(0,h),s.skipString(l),s.skipString("\\E")):s.skipString(l);let f=0;for(;f<l.length;){let g=l.codePointAt(f);this.literal(g),f+=Y.charCount(g)}break e}case k.CODES.get("z"):this.op(T.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);let c=this.newRegexp(T.Op.CHAR_CLASS);if(c.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){let l=new hr;if(this.parseUnicodeClass(s,l)){c.runes=l.toArray(),this.push(c);break e}}let u=new hr;if(this.parsePerlClassEscape(s,u)){c.runes=u.toArray(),this.push(c);break e}s.rewindTo(o),this.reuse(c),this.literal($.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new Ne($.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){let t=e.pos(),r=e.rest();if(r.startsWith("(?P<")||r.startsWith("(?<")){let c=r.charAt(2)==="P"?4:3,u=r.indexOf(">");if(u<0)throw new Ne($.ERR_INVALID_NAMED_CAPTURE,r);let l=r.substring(c,u);if(e.skipString(l),e.skip(c+1),!$.isValidCaptureName(l))throw new Ne($.ERR_INVALID_NAMED_CAPTURE,r.substring(0,u+1));let h=this.op(T.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[l])throw new Ne($.ERR_DUPLICATE_NAMED_CAPTURE,l);this.namedGroups[l]=this.numCap,h.name=l;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){let c=e.pop();switch(c){case k.CODES.get("i"):s|=L.FOLD_CASE,o=!0;break;case k.CODES.get("m"):s&=~L.ONE_LINE,o=!0;break;case k.CODES.get("s"):s|=L.DOT_NL,o=!0;break;case k.CODES.get("U"):s|=L.NON_GREEDY,o=!0;break;case k.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case k.CODES.get(":"):case k.CODES.get(")"):if(i<0){if(!o)break e;s=~s}c===k.CODES.get(":")&&this.op(T.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new Ne($.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(T.Op.VERTICAL_BAR)}swapVerticalBar(){let e=this.stack.length;if(e>=3&&this.stack[e-2].op===T.Op.VERTICAL_BAR&&$.isCharClass(this.stack[e-1])&&$.isCharClass(this.stack[e-3])){let t=this.stack[e-1],r=this.stack[e-3];if(t.op>r.op){let s=r;r=t,t=s,this.stack[e-3]=r}return $.mergeCharClass(r,t),this.reuse(t),this.pop(),!0}if(e>=2){let t=this.stack[e-1],r=this.stack[e-2];if(r.op===T.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=r,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new Ne($.ERR_UNEXPECTED_PAREN,this.wholeRegexp);let e=this.pop(),t=this.pop();if(t.op!==T.Op.LEFT_PAREN)throw new Ne($.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if($.hasCapture(e))throw new Ne($.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=T.Op.PLB:t.op=T.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=T.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){let r=e.pos();if((this.flags&L.PERL_X)===0||!e.more()||e.pop()!==k.CODES.get("\\")||!e.more())return!1;e.pop();let s=e.from(r),i=fC.has(s)?fC.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&L.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){let r=e.rest(),s=r.indexOf(":]");if(s<0)return!1;let i=r.substring(0,s+2);e.skipString(i);let o=SC.has(i)?SC.get(i):null;if(o===null)throw new Ne($.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&L.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){let r=e.pos();if((this.flags&L.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===k.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(r),new Ne($.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==k.CODES.get("{"))o=Y.runeToString(i);else{let h=e.rest(),f=h.indexOf("}");if(f<0)throw e.rewindTo(r),new Ne($.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,f),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===k.CODES.get("^")&&(s=0-s,o=o.substring(1));let c=$.unicodeTable(o);if(c===null)throw new Ne($.ERR_INVALID_CHAR_RANGE,e.from(r));c.sign<0&&(s=0-s);let u=c.tab,l=c.fold;if((this.flags&L.FOLD_CASE)===0||l===null)t.appendTableWithSign(u,s);else{let h=new hr().appendTable(u).appendTable(l).cleanClass().toArray();t.appendClassWithSign(h,s)}return!0}parseClass(e){let t=e.pos();e.skip(1);let r=this.newRegexp(T.Op.CHAR_CLASS);r.flags=this.flags;let s=new hr,i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&L.CLASS_NL)===0&&s.appendRange(k.CODES.get(`
`),k.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==k.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&L.PERL_X)===0&&!o){let h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new Ne($.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;let c=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(c)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(c);let u=$.parseClassChar(e,t),l=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(l=$.parseClassChar(e,t),l<u)throw new Ne($.ERR_INVALID_CHAR_RANGE,e.from(c))}(this.flags&L.FOLD_CASE)===0?s.appendRange(u,l):s.appendFoldedRange(u,l)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),r.runes=s.toArray(),this.push(r)}},vI=class Kr{static initTest(e){let t=Kr.compile(e),r=new Kr(t.expr,t.prog,t.numSubexp,t.longest);return r.cond=t.cond,r.prefix=t.prefix,r.prefixUTF8=t.prefixUTF8,r.prefixComplete=t.prefixComplete,r.prefixRune=t.prefixRune,r.prefilter=t.prefilter,r}static compile(e){return Kr.compileImpl(e,L.PERL,!1)}static compilePOSIX(e){return Kr.compileImpl(e,L.POSIX,!0)}static compileImpl(e,t,r){let s=HC.parse(e,t),i=s.maxCap();s=UC.simplify(s);let o=II.build(s),c=GC.compileRegexp(s),u=new Kr(e,c,i,r);u.prefilter=o.type===Ae.Type.NONE?null:o;let[l,h]=c.prefix();return u.prefixComplete=l,u.prefix=h,u.prefixUTF8=Y.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(e,t){return Kr.compile(e).match(t)}constructor(e,t,r=0,s=0){this.expr=e,this.prog=t,this.numSubexp=r,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new LC(this.prog),this.onepass=uC.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,r,s){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1,c=e.prefixLength(this);if(r===L.UNANCHORED){let u=e.index(this,t);if(u<0)return null;i=t+u,o=i+c}else if(r===L.ANCHOR_BOTH){if(e.endPos()!==c||e.index(this,0)!==0)return null;i=0,o=c}else if(r===L.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=c}if(i<0)return null;if(s>0){let u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}executeEngine(e,t,r,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,r,s);if(this.prefilter!==null&&r===L.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return uC.execute(this,e,t,r,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=sc.maxBitStateLen(this.prog)?sc.execute(this,e,t,r,s):this.doExecuteNFA(e,t,r,s);if(this.prog.numLb===0){let i=this.dfa.match(e,t,r);if(i!==null)return i?[]:null;if(e.endPos()<=sc.maxBitStateLen(this.prog))return sc.execute(this,e,t,r,s)}return this.doExecuteNFA(e,t,r,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,r,s){let i=this.get();i||(i=xC.fromRE2(this)),i.init(s);let o=i.match(e,t,r)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(Re.fromUTF16(e),0,L.UNANCHORED,0)!==null}matchWithGroup(e,t,r,s,i){return e instanceof zr||(Y.isByteArray(e)?e=Jr.utf8(e):e=Jr.utf16(e)),this.matchMachineInput(e,t,r,s,i)}matchMachineInput(e,t,r,s,i){if(t>r)return[!1,null];let o=e.isUTF16Encoding()?Re.fromUTF16(e.asCharSequence(),0,r):Re.fromUTF8(e.asBytes(),0,r),c=this.executeEngine(o,t,s,2*i);return c===null?[!1,null]:[!0,c]}matchUTF8(e){return this.executeEngine(Re.fromUTF8(e),0,L.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,r){let s=0,i=0,o="",c=Re.fromUTF16(e),u=0;for(;i<=e.length;){let l=this.executeEngine(c,i,L.UNANCHORED,2);if(l===null||l.length===0)break;o+=e.substring(s,l[0]),(l[1]>s||l[0]===0)&&(o+=t(e.substring(l[0],l[1])),u++),s=l[1];let h=c.step(i)&7;if(i+h>l[1]?i+=h:i+1>l[1]?i++:i=l[1],u>=r)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let r=new Array(t).fill(-1);for(let s=0;s<e.length;s++)r[s]=e[s];e=r}return e}allMatches(e,t,r=s=>s){let s=[],i=e.endPos();t<0&&(t=i+1);let o=0,c=0,u=-1;for(;c<t&&o<=i;){let l=this.executeEngine(e,o,L.UNANCHORED,this.prog.numCap);if(l===null||l.length===0)break;let h=!0;if(l[1]===o){l[0]===u&&(h=!1);let f=e.step(o);f<0?o=i+1:o+=f&7}else o=l[1];u=l[1],h&&(s.push(r(this.pad(l))),c++)}return s}findUTF8(e){let t=this.executeEngine(Re.fromUTF8(e),0,L.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){let t=this.executeEngine(Re.fromUTF8(e),0,L.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){let t=this.executeEngine(Re.fromUTF16(e),0,L.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Re.fromUTF16(e),0,L.UNANCHORED,2)}findUTF8Submatch(e){let t=this.executeEngine(Re.fromUTF8(e),0,L.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.slice(t[2*s],t[2*s+1]));return r}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Re.fromUTF8(e),0,L.UNANCHORED,this.prog.numCap))}findSubmatch(e){let t=this.executeEngine(Re.fromUTF16(e),0,L.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.substring(t[2*s],t[2*s+1]));return r}findSubmatchIndex(e){return this.pad(this.executeEngine(Re.fromUTF16(e),0,L.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){let r=this.allMatches(Re.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return r.length===0?null:r}findAllUTF8Index(e,t){let r=this.allMatches(Re.fromUTF8(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAll(e,t){let r=this.allMatches(Re.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return r.length===0?null:r}findAllIndex(e,t){let r=this.allMatches(Re.fromUTF16(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAllUTF8Submatch(e,t){let r=this.allMatches(Re.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllUTF8SubmatchIndex(e,t){let r=this.allMatches(Re.fromUTF8(e),t);return r.length===0?null:r}findAllSubmatch(e,t){let r=this.allMatches(Re.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllSubmatchIndex(e,t){let r=this.allMatches(Re.fromUTF16(e),t);return r.length===0?null:r}},Kb=class oc{static UNANCHORED=L.UNANCHORED;static ANCHOR_START=L.ANCHOR_START;static ANCHOR_BOTH=L.ANCHOR_BOTH;constructor(e=oc.UNANCHORED,t=0,r=8388608){this.anchor=e,this.jsFlags=t,this.maxMem=r;let s=L.PERL;(t&tn.DISABLE_UNICODE_GROUPS)!==0&&(s&=~L.UNICODE_GROUPS),(t&tn.LOOKBEHINDS)!==0&&(s|=L.LOOKBEHIND),this.re2Flags=s,this.regexps=[],this.prog=null,this.dfa=null,this.dummyRe2=null}add(e){if(this.prog)throw new kC("Cannot add patterns after compile");let t=e;(this.jsFlags&tn.CASE_INSENSITIVE)!==0&&(t=`(?i)${t}`),(this.jsFlags&tn.DOTALL)!==0&&(t=`(?s)${t}`),(this.jsFlags&tn.MULTILINE)!==0&&(t=`(?m)${t}`);let r=HC.parse(t,this.re2Flags);return this.regexps.push(UC.simplify(r)),this.regexps.length-1}compile(){this.prog||(this.prog=GC.compileSet(this.regexps),this.dfa=new LC(this.prog,this.maxMem),this.dummyRe2={prog:this.prog,cond:this.prog.startCond(),prefix:"",prefixRune:0,longest:!1})}match(e){this.prog||this.compile();let t=Y.isByteArray(e)?Re.fromUTF8(e):Re.fromUTF16(e),r=L.UNANCHORED;this.anchor===oc.ANCHOR_START?r=L.ANCHOR_START:this.anchor===oc.ANCHOR_BOTH&&(r=L.ANCHOR_BOTH);let s=this.dfa.matchSet(t,0,r);if(s!==null)return s;let i=xC.fromRE2(this.dummyRe2);return i.init(0),i.matchSet(t,0,r)}},bI=class Rs{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let r="",s=!1,i=e.length;i===0&&(r="(?:)",s=!0);let o=!1,c=0;for(;c<i;){let l=e[c];if(l==="\\"){if(c+1<i)switch(l=e[c+1],l){case"\\":r+="\\\\",c+=2;continue;case"c":if(c+2<i){let g=e[c+2].charCodeAt(0);if(g>=65&&g<=90||g>=97&&g<=122){let v=g%32;r+="\\x",r+=(v>>4).toString(16).toUpperCase(),r+=(v&15).toString(16).toUpperCase(),c+=3,s=!0;continue}}r+="c",c+=2,s=!0;continue;case"u":if(c+2<i){if(e[c+2]==="{"){let g=c+3,v=!1,I=!1;for(;g<i;){let S=e[g];if(S==="}"){I=!0;break}if(!Rs.isHexadecimal(S))break;v=!0,g++}if(I&&v){r+="\\x",c+=2,s=!0;continue}}else if(c+5<i){let g=!0;for(let v=0;v<4;v++)if(!Rs.isHexadecimal(e[c+2+v])){g=!1;break}if(g){r+="\\x{"+e.substring(c+2,c+6)+"}",c+=6,s=!0;continue}}}r+="u",c+=2,s=!0;continue;case"x":{let g=!1;if(c+2<i&&e[c+2]==="{"){let v=c+3,I=!1,S=!1;for(;v<i;){let U=e[v];if(U==="}"){S=!0;break}if(!Rs.isHexadecimal(U))break;I=!0,v++}S&&I&&(g=!0)}else c+3<i&&Rs.isHexadecimal(e[c+2])&&Rs.isHexadecimal(e[c+3])&&(g=!0);g?(r+="\\x",c+=2):(r+="x",c+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":r+="\\"+l,c+=2;continue;default:{let g=e.codePointAt(c+1);if(g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122){let v=Y.charCount(g);r+=e.substring(c+1,c+1+v),c+=v+1,s=!0}else{r+="\\";let v=Y.charCount(g);r+=e.substring(c+1,c+1+v),c+=v+1}continue}}}else if(l==="/"){r+="\\/",c+=1,s=!0;continue}else if(l==="[")o=!0;else if(l==="]")o=!1;else if(!o&&l==="("&&c+2<i&&e[c+1]==="?"&&e[c+2]==="<"&&c+3<i&&!"=!>)".includes(e[c+3])){r+="(?P<",c+=3,s=!0;continue}let h=e.codePointAt(c),f=Y.charCount(h);r+=e.substring(c,c+f),c+=f}let u=s?r:e;return t.length>0?`(?${t})${u}`:u}},ac=class ft{static CASE_INSENSITIVE=tn.CASE_INSENSITIVE;static DOTALL=tn.DOTALL;static MULTILINE=tn.MULTILINE;static DISABLE_UNICODE_GROUPS=tn.DISABLE_UNICODE_GROUPS;static LONGEST_MATCH=tn.LONGEST_MATCH;static LOOKBEHINDS=tn.LOOKBEHINDS;static quote(e){return Y.quoteMeta(e)}static quoteReplacement(e,t=!1){return iC.quoteReplacement(e,t)}static translateRegExp(e){return bI.translate(e)}static compile(e,t=0){let r=e;if((t&ft.CASE_INSENSITIVE)!==0&&(r=`(?i)${r}`),(t&ft.DOTALL)!==0&&(r=`(?s)${r}`),(t&ft.MULTILINE)!==0&&(r=`(?m)${r}`),(t&~(ft.MULTILINE|ft.DOTALL|ft.CASE_INSENSITIVE|ft.DISABLE_UNICODE_GROUPS|ft.LONGEST_MATCH|ft.LOOKBEHINDS))!==0)throw new hI("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=L.PERL;(t&ft.DISABLE_UNICODE_GROUPS)!==0&&(s&=~L.UNICODE_GROUPS),(t&ft.LOOKBEHINDS)!==0&&(s|=L.LOOKBEHIND);let i=new ft(e,t);return i.re2Input=vI.compileImpl(r,s,(t&ft.LONGEST_MATCH)!==0),i}static matches(e,t){return ft.compile(e).testExact(t)}static initTest(e,t,r){if(e==null)throw new Error("pattern is null");if(r==null)throw new Error("re2 is null");let s=new ft(e,t);return s.re2Input=r,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return Y.isByteArray(e)&&(e=Jr.utf8(e)),new iC(this,e)}test(e){return Y.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){let t=Y.isByteArray(e)?Re.fromUTF8(e):Re.fromUTF16(e);return this.re2Input.executeEngine(t,0,L.ANCHOR_BOTH,0)!==null}exec(e){let t=this.matcher(e);if(!t.find())return null;let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;return r}split(e,t=0){let r=this.matcher(e),s=[],i=0,o=0;for(;r.find();){if(o===0&&r.end()===0){o=r.end();continue}if(t>0&&s.length===t-1)break;if(o===r.start()){if(t===0){i+=1,o=r.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.start())),o=r.end()}if(t===0&&o!==r.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.inputLength()))}return(t!==0||s.length===0&&!(o===r.inputLength()&&o>0))&&s.push(r.substring(o,r.inputLength())),s}*matchAll(e){let t=this.matcher(e);for(;t.find();){let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;yield r}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}};/**
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
 */var ii="12.19.0";function Am(n){ii=n}/**
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
 */var es=new ar("@firebase/firestore");function Ps(){return es.logLevel}function J(n,...e){if(es.logLevel<=pe.DEBUG){let t=e.map(Wd);es.debug(`Firestore (${ii}): ${n}`,...t)}}function Gn(n,...e){if(es.logLevel<=pe.ERROR){let t=e.map(Wd);es.error(`Firestore (${ii}): ${n}`,...t)}}function $t(n,...e){if(es.logLevel<=pe.WARN){let t=e.map(Wd);es.warn(`Firestore (${ii}): ${n}`,...t)}}function Wd(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function X(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,vm(n,r,t)}function vm(n,e,t){let r=`FIRESTORE (${ii}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Gn(r),new Error(r)}function ne(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||vm(e,s,r)}function Ee(n,e){return n}/**
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
 */function SI(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */var Ms=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let s=SI(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}};function me(n,e){return n<e?-1:n>e?1:0}function uB(n,e){let t=Math.min(n.length,e.length);for(let r=0;r<t;r++){let s=n.charAt(r),i=e.charAt(r);if(s!==i)return rB(s)===rB(i)?me(s,i):rB(s)?1:-1}return me(n.length,e.length)}var RI=55296,PI=57343;function rB(n){let e=n.charCodeAt(0);return e>=RI&&e<=PI}function Gs(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
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
 */var qe=class n{constructor(e,t){this.comparator=e,this.root=t||_n.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,_n.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,_n.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){let e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new xs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new xs(this.root,e,this.comparator,!1)}getReverseIterator(){return new xs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new xs(this.root,e,this.comparator,!0)}},xs=class{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},_n=class n{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??n.RED,this.left=s??n.EMPTY,this.right=i??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new n(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this,i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return n.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw X(43730,{key:this.key,value:this.value});if(this.right.isRed())throw X(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw X(27949);return e+(this.isRed()?0:1)}};_n.EMPTY=null,_n.RED=!0,_n.BLACK=!1;_n.EMPTY=new class{constructor(){this.size=0}get key(){throw X(57766)}get value(){throw X(16141)}get color(){throw X(16727)}get left(){throw X(29726)}get right(){throw X(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new _n(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */var tt=class n{constructor(e){this.comparator=e,this.data=new qe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new gc(this.data.getIterator())}getIteratorFrom(e){return new gc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},gc=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
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
 */var O={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},q=class extends Nt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
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
 */var mn="__name__",Cc=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&X(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&X(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let s=0;s<r;s++){let i=n.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return me(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),s=n.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?n.extractNumericId(e).compare(n.extractNumericId(t)):uB(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Pn.fromString(e.substring(4,e.length-2))}},ve=class n extends Cc{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new q(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new n(t)}static emptyPath(){return new n([])}},NI=/^[_a-zA-Z][_a-zA-Z0-9]*$/,Mt=class Ns extends Cc{construct(e,t,r){return new Ns(e,t,r)}static isValidIdentifier(e){return NI.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ns.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===mn}static keyField(){return new Ns([mn])}static fromServerFormat(e){let t=[],r="",s=0,i=()=>{if(r.length===0)throw new q(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;s<e.length;){let c=e[s];if(c==="\\"){if(s+1===e.length)throw new q(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new q(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(r+=c,s++):(i(),s++)}if(i(),o)throw new q(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ns(t)}static emptyPath(){return new Ns([])}};/**
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
 */var rn=class n{constructor(e){this.fields=e,e.sort(Mt.comparator)}static empty(){return new n([])}unionWith(e){let t=new tt(Mt.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Gs(this.fields,e.fields,((t,r)=>t.isEqual(r)))}};/**
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
 */function mc(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ps(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function bm(n,e){let t=[];for(let r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function Sm(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */var Z=class n{constructor(e){this.path=e}static fromPath(e){return new n(ve.fromString(e))}static fromName(e){return new n(ve.fromString(e).popFirst(5))}static empty(){return new n(ve.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ve.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ve.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new ve(e.slice()))}};/**
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
 */function Rm(n,e,t){if(!t)throw new q(O.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Pm(n,e,t,r){if(e===!0&&r===!0)throw new q(O.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function qC(n){if(!Z.isDocumentKey(n))throw new q(O.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function jC(n){if(Z.isDocumentKey(n))throw new q(O.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Uo(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ho(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":X(12329,{type:typeof n})}function Dn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new q(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=Ho(n);throw new q(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Nm(n,e){if(e<=0)throw new q(O.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
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
 */function Qe(n,e){let t={typeString:n};return e&&(t.value=e),t}function qo(n,e){if(!Uo(n))throw new q(O.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}let o=n[r];if(s&&typeof o!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new q(O.INVALID_ARGUMENT,t);return!0}/**
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
 */var KC=-62135596800,JC=1e6,He=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*JC);return new n(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new q(O.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return n._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{let s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new q(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new q(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<KC)throw new q(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new q(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/JC}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new q(O.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?me(this.nanoseconds,e.nanoseconds):me(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(qo(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-KC;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};He._jsonSchemaVersion="firestore/timestamp/1.0",He._jsonSchema={type:Qe("string",He._jsonSchemaVersion),seconds:Qe("number"),nanoseconds:Qe("number")};/**
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
 */var Ec=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
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
 */var Ye=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Ec("Invalid base64 string: "+i):i}})(e);return new n(t)}static fromUint8Array(e){let t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return me(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Ye.EMPTY_BYTE_STRING=new Ye("");var OI=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Un(n){if(ne(!!n,39018),typeof n=="string"){let e=0,t=OI.exec(n);if(ne(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Oe(n.seconds),nanos:Oe(n.nanos)}}function Oe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Hn(n){return typeof n=="string"?Ye.fromBase64String(n):Ye.fromUint8Array(n)}/**
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
 */var Om="server_timestamp",km="__type__",Fm="__previous_value__",xm="__local_write_time__";function oi(n){return(n?.mapValue?.fields||{})[km]?.stringValue===Om}function jo(n){let e=n.mapValue.fields[Fm];return oi(e)?jo(e):e}function Us(n){let e=Un(n.mapValue.fields[xm].timestampValue);return new He(e.seconds,e.nanos)}/**
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
 */var lB=class{constructor(e,t,r,s,i,o,c,u,l,h,f,g,v){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=h,this.apiKey=f,this._customHeaders=g,this.grpcFlowControlWindow=v}},ho="(default)",fo=class n{constructor(e,t){this.projectId=e,this.database=t||ho}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===ho}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};function Lm(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new q(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new fo(n.options.projectId,e)}/**
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
 */var kI=-1;function Ko(n){return n==null}function Hs(n){return n===0&&1/n==-1/0}function FI(n){return typeof n=="number"&&Number.isInteger(n)&&!Hs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function xI(n){return typeof n=="string"}/**
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
 */var Qd="__type__",Vm="__max__",cc={mapValue:{fields:{__type__:{stringValue:Vm}}}},$d="__vector__",ts="value",qs={nullValue:"NULL_VALUE"},vt={booleanValue:!0},ct={booleanValue:!1};function Xe(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?oi(n)?4:Mm(n)?9007199254740991:go(n)?10:11:X(28295,{value:n})}function Yt(n,e,t){if(n===e)return!0;let r=Xe(n);if(r!==Xe(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Us(n).isEqual(Us(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;let c=Un(i.timestampValue),u=Un(o.timestampValue);return c.seconds===u.seconds&&c.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,o){return Hn(i.bytesValue).isEqual(Hn(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,o){return Oe(i.geoPointValue.latitude)===Oe(o.geoPointValue.latitude)&&Oe(i.geoPointValue.longitude)===Oe(o.geoPointValue.longitude)})(n,e);case 2:return(function(i,o,c){if("integerValue"in i&&"integerValue"in o)return Oe(i.integerValue)===Oe(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=Oe(i.doubleValue),l=Oe(o.doubleValue);else{if(!c?.i)return!1;u=Oe(i.integerValue??i.doubleValue),l=Oe(o.integerValue??o.doubleValue)}return u===l?!!c?.o||Hs(u)===Hs(l):!!(c===void 0||c.u)&&isNaN(u)&&isNaN(l)})(n,e,t);case 9:return Gs(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Yt(s,i,t)));case 10:case 11:return(function(i,o,c){let u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(mc(u)!==mc(l))return!1;for(let h in u)if(u.hasOwnProperty(h)&&(l[h]===void 0||!Yt(u[h],l[h],c)))return!1;return!0})(n,e,t);default:return X(52216,{left:n})}}function po(n,e){return(n.values||[]).find((t=>Yt(t,e)))!==void 0}function bt(n,e){if(n===e)return 0;let t=Xe(n),r=Xe(e);if(t!==r)return me(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return me(n.booleanValue,e.booleanValue);case 2:return(function(i,o){let c=Oe(i.integerValue||i.doubleValue),u=Oe(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return zC(n.timestampValue,e.timestampValue);case 4:return zC(Us(n),Us(e));case 5:return uB(n.stringValue,e.stringValue);case 6:return(function(i,o){let c=Hn(i),u=Hn(o);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,o){let c=i.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){let h=me(c[l],u[l]);if(h!==0)return h}return me(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,o){let c=me(Oe(i.latitude),Oe(o.latitude));return c!==0?c:me(Oe(i.longitude),Oe(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return WC(n.arrayValue,e.arrayValue);case 10:return(function(i,o){let c=i.fields||{},u=o.fields||{},l=c[ts]?.arrayValue,h=u[ts]?.arrayValue,f=me(l?.values?.length||0,h?.values?.length||0);return f!==0?f:WC(l,h)})(n.mapValue,e.mapValue);case 11:return(function(i,o){if(i===cc.mapValue&&o===cc.mapValue)return 0;if(i===cc.mapValue)return 1;if(o===cc.mapValue)return-1;let c=i.fields||{},u=Object.keys(c),l=o.fields||{},h=Object.keys(l);u.sort(),h.sort();for(let f=0;f<u.length&&f<h.length;++f){let g=uB(u[f],h[f]);if(g!==0)return g;let v=bt(c[u[f]],l[h[f]]);if(v!==0)return v}return me(u.length,h.length)})(n.mapValue,e.mapValue);default:throw X(23264,{l:t})}}function zC(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return me(n,e);let t=Un(n),r=Un(e),s=me(t.seconds,r.seconds);return s!==0?s:me(t.nanos,r.nanos)}function WC(n,e){let t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){let i=bt(t[s],r[s]);if(i!==void 0&&i!==0)return i}return me(t.length,r.length)}function js(n){return BB(n)}function BB(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){let r=Un(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Hn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return Z.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(let i of t.values||[])s?s=!1:r+=",",r+=BB(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){let r=Object.keys(t.fields||{}).sort(),s="{",i=!0;for(let o of r)i?i=!1:s+=",",s+=`${o}:${BB(t.fields[o])}`;return s+"}"})(n.mapValue):X(61005,{value:n})}function hc(n){switch(Xe(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let e=jo(n);return e?16+hc(e):16;case 5:return 2*n.stringValue.length;case 6:return Hn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+hc(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return ps(r.fields,((i,o)=>{s+=i.length+hc(o)})),s})(n.mapValue);default:throw X(13486,{value:n})}}function Jo(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function En(n){return!!n&&"integerValue"in n}function Qr(n){return!!n&&"doubleValue"in n}function mr(n){return En(n)||Qr(n)}function Ks(n){return!!n&&"arrayValue"in n}function Lt(n){return!!n&&"nullValue"in n}function St(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Ls(n){return!!n&&"mapValue"in n}function go(n){return(n?.mapValue?.fields||{})[Qd]?.stringValue===$d}function hB(n){return(n?.mapValue?.fields||{})[ts]?.arrayValue}function io(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){let e={mapValue:{fields:{}}};return ps(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=io(r))),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=io(n.arrayValue.values[t]);return e}return{...n}}function Mm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Vm}var RS={mapValue:{fields:{[Qd]:{stringValue:$d},[ts]:{arrayValue:{}}}}};/**
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
 */var wt=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Ls(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=io(t)}setAll(e){let t=Mt.emptyPath(),r={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){let u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}o?r[c.lastSegment()]=io(o):s.push(c.lastSegment())}));let i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){let t=this.field(e.popLast());Ls(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Yt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Ls(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){ps(t,((s,i)=>e[s]=i));for(let s of r)delete e[s]}clone(){return new n(io(this.value))}};/**
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
 */function su(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Hs(e)?"-0":e}}function Yd(n){return{integerValue:""+n}}function Xd(n,e,t){return FI(e)?Yd(e):su(n,e)}/**
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
 */var Js=class{constructor(){this._=void 0}};function LI(n,e,t){return n instanceof ns?(function(s,i){let o={fields:{[km]:{stringValue:Om},[xm]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&oi(i)&&(i=jo(i)),i&&(o.fields[Fm]=i),{mapValue:o}})(t,e):n instanceof rs?Gm(n,e):n instanceof ss?Um(n,e):n instanceof is?(function(s,i){let o=MI(s,i),c=_c(o)+_c(s.h);return En(o)&&En(s.h)?Yd(c):su(s.serializer,c)})(n,e):n instanceof zs?(function(s,i){return QC(s,i,Math.min)})(n,e):n instanceof Ws?(function(s,i){return QC(s,i,Math.max)})(n,e):void 0}function VI(n,e,t){return n instanceof rs?Gm(n,e):n instanceof ss?Um(n,e):t}function MI(n,e){return n instanceof is?mr(e)?e:{integerValue:0}:null}var ns=class extends Js{},rs=class extends Js{constructor(e){super(),this.elements=e}};function Gm(n,e){let t=Hm(e);for(let r of n.elements)t.some((s=>Yt(s,r)))||t.push(r);return{arrayValue:{values:t}}}var ss=class extends Js{constructor(e){super(),this.elements=e}};function Um(n,e){let t=Hm(e);for(let r of n.elements)t=t.filter((s=>!Yt(s,r)));return{arrayValue:{values:t}}}var Co=class extends Js{constructor(e,t){super(),this.serializer=e,this.h=t}},is=class extends Co{},zs=class extends Co{},Ws=class extends Co{};function QC(n,e,t){if(!mr(e))return n.h;let r=t(_c(e),_c(n.h));return En(e)&&En(n.h)?Yd(r):su(n.serializer,r)}function _c(n){return Oe(n.integerValue||n.doubleValue)}function Hm(n){return Ks(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */var dB=class{constructor(e,t){this.field=e,this.transform=t}};function GI(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof rs&&s instanceof rs||r instanceof ss&&s instanceof ss?Gs(r.elements,s.elements,Yt):r instanceof is&&s instanceof is||r instanceof zs&&s instanceof zs||r instanceof Ws&&s instanceof Ws?Yt(r.h,s.h):r instanceof ns&&s instanceof ns})(n.transform,e.transform)}var nn=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function dc(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var Qs=class{};function qm(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new $s(n.key,nn.none()):new os(n.key,n.data,nn.none());{let t=n.data,r=wt.empty(),s=new tt(Mt.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new qn(n.key,r,new rn(s.toArray()),nn.none())}}function UI(n,e,t){n instanceof os?(function(s,i,o){let c=s.value.clone(),u=YC(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):n instanceof qn?(function(s,i,o){if(!dc(s.precondition,i))return void i.convertToUnknownDocument(o.version);let c=YC(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(jm(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function oo(n,e,t,r){return n instanceof os?(function(i,o,c,u){if(!dc(i.precondition,o))return c;let l=i.value.clone(),h=XC(i.fieldTransforms,u,o);return l.setAll(h),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(n,e,t,r):n instanceof qn?(function(i,o,c,u){if(!dc(i.precondition,o))return c;let l=XC(i.fieldTransforms,u,o),h=o.data;return h.setAll(jm(i)),h.setAll(l),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((f=>f.field)))})(n,e,t,r):(function(i,o,c){return dc(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(n,e,t)}function $C(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Gs(r,s,((i,o)=>GI(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var os=class extends Qs{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}},qn=class extends Qs{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}};function jm(n){let e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}})),e}function YC(n,e,t){let r=new Map;ne(n.length===t.length,32656,{T:t.length,P:n.length});for(let s=0;s<t.length;s++){let i=n[s],o=i.transform,c=e.data.field(i.field);r.set(i.field,VI(o,c,t[s]))}return r}function XC(n,e,t){let r=new Map;for(let s of n){let i=s.transform,o=t.data.field(s.field);r.set(s.field,LI(i,o,e))}return r}var $s=class extends Qs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},wc=class extends Qs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};/**
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
 */var jn=class{constructor(e,t){this.position=e,this.inclusive=t}};function ZC(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){let i=e[s],o=n.position[s];if(i.field.isKeyField()?r=Z.comparator(Z.fromName(o.referenceValue),t.key):r=bt(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function em(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Yt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */var yc=class{},Ke=class n extends yc{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new pB(e,t,r):t==="array-contains"?new mB(e,r):t==="in"?new EB(e,r):t==="not-in"?new _B(e,r):t==="array-contains-any"?new wB(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new gB(e,r):new CB(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(bt(t,this.value)):t!==null&&Xe(this.value)===Xe(t)&&this.matchesComparison(bt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return X(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},Xt=class n extends yc{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new n(e,t)}matches(e){return Km(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}};function Km(n){return n.op==="and"}function Jm(n){return HI(n)&&Km(n)}function HI(n){for(let e of n.filters)if(e instanceof Xt)return!1;return!0}function fB(n){if(n instanceof Ke)return n.field.canonicalString()+n.op.toString()+js(n.value);if(Jm(n))return n.filters.map((e=>fB(e))).join(",");{let e=n.filters.map((t=>fB(t))).join(",");return`${n.op}(${e})`}}function zm(n,e){return n instanceof Ke?(function(r,s){return s instanceof Ke&&r.op===s.op&&r.field.isEqual(s.field)&&Yt(r.value,s.value)})(n,e):n instanceof Xt?(function(r,s){return s instanceof Xt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,c)=>i&&zm(o,s.filters[c])),!0):!1})(n,e):void X(19439)}function Wm(n){return n instanceof Ke?(function(t){return`${t.field.canonicalString()} ${t.op} ${js(t.value)}`})(n):n instanceof Xt?(function(t){return t.op.toString()+" {"+t.getFilters().map(Wm).join(" ,")+"}"})(n):"Filter"}var pB=class extends Ke{constructor(e,t,r){super(e,t,r),this.key=Z.fromName(r.referenceValue)}matches(e){let t=Z.comparator(e.key,this.key);return this.matchesComparison(t)}},gB=class extends Ke{constructor(e,t){super(e,"in",t),this.keys=Qm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},CB=class extends Ke{constructor(e,t){super(e,"not-in",t),this.keys=Qm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function Qm(n,e){return(e.arrayValue?.values||[]).map((t=>Z.fromName(t.referenceValue)))}var mB=class extends Ke{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Ks(t)&&po(t.arrayValue,this.value)}},EB=class extends Ke{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&po(this.value.arrayValue,t)}},_B=class extends Ke{constructor(e,t){super(e,"not-in",t)}matches(e){if(po(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!po(this.value.arrayValue,t)}},wB=class extends Ke{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Ks(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>po(this.value.arrayValue,r)))}};/**
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
 */var Er=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function qI(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */var Be=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new He(0,0))}static max(){return new n(new He(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};/**
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
 */var Ut=class n{constructor(e,t,r,s,i,o,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new n(e,0,Be.min(),Be.min(),Be.min(),wt.empty(),0)}static newFoundDocument(e,t,r,s){return new n(e,1,t,Be.min(),r,s,0)}static newNoDocument(e,t){return new n(e,2,t,Be.min(),Be.min(),wt.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,Be.min(),Be.min(),wt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Be.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=wt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=wt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Be.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};/**
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
 */var mo=-1,Dc=class{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}};Dc.UNKNOWN_ID=-1;function jI(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=Be.fromTimestamp(r===1e9?new He(t+1,0):new He(t,r));return new as(s,Z.empty(),e)}function KI(n){return new as(n.readTime,n.key,mo)}var as=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(Be.min(),Z.empty(),mo)}static max(){return new n(Be.max(),Z.empty(),mo)}};function JI(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=Z.comparator(n.documentKey,e.documentKey),t!==0?t:me(n.largestBatchId,e.largestBatchId))}/**
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
 */var yB=class{constructor(e,t=null,r=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.R=null}};function tm(n,e=null,t=[],r=[],s=null,i=null,o=null){return new yB(n,e,t,r,s,i,o)}function $m(n){let e=Ee(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>fB(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Ko(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>js(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>js(r))).join(",")),e.R=t}return e.R}function Ym(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!qI(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!zm(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!em(n.startAt,e.startAt)&&em(n.endAt,e.endAt)}function Wr(n){return!!n.isCorePipeline}function Xm(n){return!!n.path&&Z.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */var Kn=class{constructor(e,t=null,r=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}};function zI(n,e,t,r,s,i,o,c){return new Kn(n,e,t,r,s,i,o,c)}function zo(n){return new Kn(n)}function nm(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function WI(n){return Z.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function iu(n){return n.collectionGroup!==null}function Xr(n){let e=Ee(n);if(e.A===null){e.A=[];let t=new Set;for(let i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new tt(Mt.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(c=c.add(l.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new Er(i,r))})),t.has(Mt.keyField().canonicalString())||e.A.push(new Er(Mt.keyField(),r))}return e.A}function wn(n){let e=Ee(n);return e.V||(e.V=QI(e,Xr(n))),e.V}function QI(n,e){if(n.limitType==="F")return tm(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{let i=s.dir==="desc"?"asc":"desc";return new Er(s.field,i)}));let t=n.endAt?new jn(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new jn(n.startAt.position,n.startAt.inclusive):null;return tm(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ou(n,e){let t=n.filters.concat([e]);return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Zm(n,e){let t=n.explicitOrderBy.concat([e]);return new Kn(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function Eo(n,e,t){return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function eE(n,e){return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,e,n.endAt)}function $I(n,e){return Ym(wn(n),wn(e))&&n.limitType===e.limitType}function ao(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Wm(s))).join(", ")}]`),Ko(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>js(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>js(s))).join(",")),`Target(${r})`})(wn(n))}; limitType=${n.limitType})`}function au(n,e){return e.isFoundDocument()&&(function(r,s){let i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):Z.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(let i of Xr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(let i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,c,u){let l=ZC(o,c,u);return o.inclusive?l<=0:l<0})(r.startAt,Xr(r),s)||r.endAt&&!(function(o,c,u){let l=ZC(o,c,u);return o.inclusive?l>=0:l>0})(r.endAt,Xr(r),s))})(n,e)}function Zd(n){return(e,t)=>{let r=!1;for(let s of Xr(n)){let i=YI(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function YI(n,e,t){let r=n.field.isKeyField()?Z.comparator(e.key,t.key):(function(i,o,c){let u=o.data.field(i),l=c.data.field(i);return u!==null&&l!==null?bt(u,l):X(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return X(19790,{direction:n.dir})}}/**
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
 */var DB=class{constructor(e,t){this.count=e,this.unchangedNames=t}};/**
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
 */var ze,ye;function XI(n){switch(n){case O.OK:return X(64938);case O.CANCELLED:case O.UNKNOWN:case O.DEADLINE_EXCEEDED:case O.RESOURCE_EXHAUSTED:case O.INTERNAL:case O.UNAVAILABLE:case O.UNAUTHENTICATED:return!1;case O.INVALID_ARGUMENT:case O.NOT_FOUND:case O.ALREADY_EXISTS:case O.PERMISSION_DENIED:case O.FAILED_PRECONDITION:case O.ABORTED:case O.OUT_OF_RANGE:case O.UNIMPLEMENTED:case O.DATA_LOSS:return!0;default:return X(15467,{code:n})}}function tE(n){if(n===void 0)return Gn("GRPC error has no .code"),O.UNKNOWN;switch(n){case ze.OK:return O.OK;case ze.CANCELLED:return O.CANCELLED;case ze.UNKNOWN:return O.UNKNOWN;case ze.DEADLINE_EXCEEDED:return O.DEADLINE_EXCEEDED;case ze.RESOURCE_EXHAUSTED:return O.RESOURCE_EXHAUSTED;case ze.INTERNAL:return O.INTERNAL;case ze.UNAVAILABLE:return O.UNAVAILABLE;case ze.UNAUTHENTICATED:return O.UNAUTHENTICATED;case ze.INVALID_ARGUMENT:return O.INVALID_ARGUMENT;case ze.NOT_FOUND:return O.NOT_FOUND;case ze.ALREADY_EXISTS:return O.ALREADY_EXISTS;case ze.PERMISSION_DENIED:return O.PERMISSION_DENIED;case ze.FAILED_PRECONDITION:return O.FAILED_PRECONDITION;case ze.ABORTED:return O.ABORTED;case ze.OUT_OF_RANGE:return O.OUT_OF_RANGE;case ze.UNIMPLEMENTED:return O.UNIMPLEMENTED;case ze.DATA_LOSS:return O.DATA_LOSS;default:return X(39323,{code:n})}}(ye=ze||(ze={}))[ye.OK=0]="OK",ye[ye.CANCELLED=1]="CANCELLED",ye[ye.UNKNOWN=2]="UNKNOWN",ye[ye.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ye[ye.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ye[ye.NOT_FOUND=5]="NOT_FOUND",ye[ye.ALREADY_EXISTS=6]="ALREADY_EXISTS",ye[ye.PERMISSION_DENIED=7]="PERMISSION_DENIED",ye[ye.UNAUTHENTICATED=16]="UNAUTHENTICATED",ye[ye.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ye[ye.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ye[ye.ABORTED=10]="ABORTED",ye[ye.OUT_OF_RANGE=11]="OUT_OF_RANGE",ye[ye.UNIMPLEMENTED=12]="UNIMPLEMENTED",ye[ye.INTERNAL=13]="INTERNAL",ye[ye.UNAVAILABLE=14]="UNAVAILABLE",ye[ye.DATA_LOSS=15]="DATA_LOSS";/**
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
 */var Jn=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ps(this.inner,((t,r)=>{for(let[s,i]of r)e(s,i)}))}isEmpty(){return Sm(this.inner)}size(){return this.innerSize}};/**
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
 */var ZI=new qe(Z.comparator);function Vt(){return ZI}var nE=new qe(Z.comparator);function Os(...n){let e=nE;for(let t of n)e=e.insert(t.key,t);return e}function eT(n){let e=nE;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function fr(){return co()}function rE(){return co()}function co(){return new Jn((n=>n.toString()),((n,e)=>n.isEqual(e)))}var PS=new qe(Z.comparator),tT=new tt(Z.comparator);function _e(...n){let e=tT;for(let t of n)e=e.add(t);return e}var nT=new tt(me);function rT(){return nT}/**
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
 */var sT=null;/**
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
 */function iT(){return new TextEncoder}/**
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
 */var oT=new Pn([4294967295,4294967295],0);function rm(n){let e=iT().encode(n),t=new Hl;return t.update(e),new Uint8Array(t.digest())}function sm(n){let e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Pn([t,r],0),new Pn([s,i],0)]}var IB=class n{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new $r(`Invalid padding: ${t}`);if(r<0)throw new $r(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new $r(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new $r(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=Pn.fromNumber(this.p)}v(e,t,r){let s=e.add(t.multiply(Pn.fromNumber(r)));return s.compare(oT)===1&&(s=new Pn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;let t=rm(e),[r,s]=sm(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);if(!this.D(o))return!1}return!0}static create(e,t,r){let s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new n(i,s,t);return r.forEach((c=>o.insert(c))),o}insert(e){if(this.p===0)return;let t=rm(e),[r,s]=sm(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);this.C(o)}}C(e){let t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}},$r=class extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}};/**
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
 */var _o=class n{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){let s=new Map;return s.set(e,wo.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new n(Be.min(),s,new qe(me),Vt(),Vt(),_e())}},wo=class n{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new n(r,t,_e(),_e(),_e())}};/**
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
 */var Vs=class{constructor(e,t,r,s){this.F=e,this.removedTargetIds=t,this.key=r,this.O=s}},Ic=class{constructor(e,t){this.targetId=e,this.M=t}},Tc=class{constructor(e,t,r=Ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}},Ac=class{constructor(e){this.targetId=e,this.N=0,this.L=im(),this.B=Ye.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=_e(),t=_e(),r=_e();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:X(38017,{changeType:i})}})),new wo(this.B,this.U,e,t,r)}G(){this.k=!1,this.L=im()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,ne(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}},ro="WatchChangeAggregator",TB=class{constructor(e){this.X=e,this.ee=new Map,this.te=Vt(),this.ne=uc(),this.re=Vt(),this.ie=uc(),this.se=new qe(me)}_e(e){for(let t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(let t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{let r=this.ee.get(t);if(r)switch(e.state){case 0:this.ce(t)&&r.K(e.resumeToken);break;case 1:r.Y(),r.q||r.G(),r.K(e.resumeToken);break;case 2:r.Y(),r.q||this.removeTarget(t);break;case 3:this.ce(t)&&(r.Z(),r.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),r.K(e.resumeToken));break;default:X(56790,{state:e.state})}else J(ro,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((r,s)=>{this.ce(s)&&t(s)}))}Ee(e){return Wr(e)?e.getPipelineSourceType()==="documents"&&e.getPipelineDocuments()?.length===1:Xm(e)}he(e){let t=e.targetId,r=e.M.count,s=this.Te(t);if(s){let i=s.target;if(this.Ee(i))if(r===0){let o=new Z(Wr(i)?ve.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,o,Ut.newNoDocument(o,Be.min()))}else ne(r===1,20013,"Single document existence filter with count: "+r);else{let o=this.Pe(t);if(o!==r){let c=this.Ie(e),u=c?this.Re(c,e,o):1;if(u!==0){this.le(t);let l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,l)}sT?.Ae((function(h,f,g,v,I){let S={localCacheCount:h,existenceFilterCount:f.count,databaseId:g.database,projectId:g.projectId},U=f.unchangedNames;return U&&(S.bloomFilter={applied:I===0,hashCount:U?.hashCount??0,bitmapLength:U?.bits?.bitmap?.length??0,padding:U?.bits?.padding??0,mightContain:H=>v?.mightContain(H)??!1}),S})(o,e.M,this.X.Ve(),c,u))}}}}Ie(e){let t=e.M.unchangedNames;if(!t||!t.bits)return null;let{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t,o,c;try{o=Hn(r).toUint8Array()}catch(u){if(u instanceof Ec)return $t("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new IB(o,s,i)}catch(u){return $t(u instanceof $r?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.p===0?null:c}Re(e,t,r){return t.M.count===r-this.de(e,t.targetId)?0:2}de(e,t){let r=this.X.getRemoteKeysForTarget(t),s=0;return r.forEach((i=>{let o=this.X.Ve(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.ae(t,i,null),s++)})),s}fe(e){let t=new Map;this.ee.forEach(((i,o)=>{let c=this.Te(o);if(c){if(i.current&&this.Ee(c.target)){let u=Wr(c.target)?ve.fromString(c.target.getPipelineDocuments()[0]):c.target.path,l=new Z(u);this.me(l).has(o)||this.pe(o,l)||this.ae(o,l,Ut.newNoDocument(l,e))}i.$&&(t.set(o,i.W()),i.G())}}));let r=_e();this.ie.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{let l=this.Te(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.te.forEach(((i,o)=>o.setReadTime(e))),this.re.forEach(((i,o)=>o.setReadTime(e)));let s=new _o(e,t,this.se,this.te,this.re,r);return this.te=Vt(),this.ne=uc(),this.re=Vt(),this.ie=uc(),this.se=new qe(me),s}oe(e,t){let r=this.ee.get(e);if(!r||!this.ce(e))return void J(ro,`addDocumentToTarget received document for unknown inactive target (${e})`);let s=this.pe(e,t.key)?2:0;r.j(t.key,s),Wr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,r){let s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),r&&(Wr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,r):this.te=this.te.insert(t,r))):J(ro,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){let t=this.ee.get(e);if(!t)return 0;let r=t.W();return this.X.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}J(e){let t=this.ee.get(e);t||(J(ro,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Ac(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new tt(me),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new tt(me),this.ne=this.ne.insert(e,t)),t}ce(e){let t=this.Te(e)!==null;return t||J(ro,"Detected inactive target",e),t}Te(e){let t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new Ac(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}};function uc(){return new qe(Z.comparator)}function im(){return new qe(Z.comparator)}var aT={asc:"ASCENDING",desc:"DESCENDING"},cT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},uT={and:"AND",or:"OR"},AB=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function vB(n,e){return n.useProto3Json||Ko(e)?e:{value:e}}function uo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ef(n){let e=Un(n);return new He(e.seconds,e.nanos)}function sE(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function fc(n,e){return uo(n,e.toTimestamp())}function Fn(n){return ne(!!n,49232),Be.fromTimestamp(ef(n))}function tf(n,e){return bB(n,e).canonicalString()}function bB(n,e){let t=(function(s){return new ve(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function iE(n){let e=ve.fromString(n);return ne(lE(e),10190,{key:e.toString()}),e}function yo(n,e){return tf(n.databaseId,e.path)}function lo(n,e){let t=iE(e);if(t.get(1)!==n.databaseId.projectId)throw new q(O.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new q(O.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new Z(aE(t))}function oE(n,e){return tf(n.databaseId,e)}function lT(n){let e=iE(n);return e.length===4?ve.emptyPath():aE(e)}function om(n){return new ve(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function aE(n){return ne(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function am(n,e,t){return{name:yo(n,e),fields:t.value.mapValue.fields}}function BT(n,e){return"found"in e?(function(r,s){ne(!!s.found,43571),s.found.name,s.found.updateTime;let i=lo(r,s.found.name),o=Fn(s.found.updateTime),c=s.found.createTime?Fn(s.found.createTime):Be.min(),u=new wt({mapValue:{fields:s.found.fields}});return Ut.newFoundDocument(i,o,c,u)})(n,e):"missing"in e?(function(r,s){ne(!!s.missing,3894),ne(!!s.readTime,22933);let i=lo(r,s.missing),o=Fn(s.readTime);return Ut.newNoDocument(i,o)})(n,e):X(7234,{result:e})}function hT(n,e){let t;if("targetChange"in e){e.targetChange;let r=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:X(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,h){return l.useProto3Json?(ne(h===void 0||typeof h=="string",58123),Ye.fromBase64String(h||"")):(ne(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),Ye.fromUint8Array(h||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(l){let h=l.code===void 0?O.UNKNOWN:tE(l.code);return new q(h,l.message||"")})(o);t=new Tc(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;let r=e.documentChange;r.document,r.document.name,r.document.updateTime;let s=lo(n,r.document.name),i=Fn(r.document.updateTime),o=r.document.createTime?Fn(r.document.createTime):Be.min(),c=new wt({mapValue:{fields:r.document.fields}}),u=Ut.newFoundDocument(s,i,o,c),l=r.targetIds||[],h=r.removedTargetIds||[];t=new Vs(l,h,u.key,u)}else if("documentDelete"in e){e.documentDelete;let r=e.documentDelete;r.document;let s=lo(n,r.document),i=r.readTime?Fn(r.readTime):Be.min(),o=Ut.newNoDocument(s,i),c=r.removedTargetIds||[];t=new Vs([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;let r=e.documentRemove;r.document;let s=lo(n,r.document),i=r.removedTargetIds||[];t=new Vs([],i,s,null)}else{if(!("filter"in e))return X(11601,{we:e});{e.filter;let r=e.filter;r.targetId;let{count:s=0,unchangedNames:i}=r,o=new DB(s,i),c=r.targetId;t=new Ic(c,o)}}return t}function dT(n,e){let t;if(e instanceof os)t={update:am(n,e.key,e.value)};else if(e instanceof $s)t={delete:yo(n,e.key)};else if(e instanceof qn)t={update:am(n,e.key,e.data),updateMask:yT(e.fieldMask)};else{if(!(e instanceof wc))return X(16599,{be:e.type});t={verify:yo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){let c=o.transform;if(c instanceof ns)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof rs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ss)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof is)return{fieldPath:o.field.canonicalString(),increment:c.h};if(c instanceof zs)return{fieldPath:o.field.canonicalString(),minimum:c.h};if(c instanceof Ws)return{fieldPath:o.field.canonicalString(),maximum:c.h};throw X(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:fc(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:X(27497)})(n,e.precondition)),t}function fT(n,e){return{documents:[oE(n,e.path)]}}function pT(n,e){let t={structuredQuery:{}},r=e.path,s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=oE(n,s);let i=(function(l){if(l.length!==0)return uE(Xt.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);let o=(function(l){if(l.length!==0)return l.map((h=>(function(g){return{field:ks(g.field),direction:ET(g.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);let c=vB(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{Se:t,parent:s}}function gT(n){let e=lT(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,s=null;if(r>0){ne(r===1,65062);let h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(f){let g=cE(f);return g instanceof Xt&&Jm(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(f){return f.map((g=>(function(I){return new Er(Fs(I.field),(function(U){switch(U){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(I.direction))})(g)))})(t.orderBy));let c=null;t.limit&&(c=(function(f){let g;return g=typeof f=="object"?f.value:f,Ko(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(f){let g=!!f.before,v=f.values||[];return new jn(v,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(f){let g=!f.before,v=f.values||[];return new jn(v,g)})(t.endAt)),zI(e,s,o,i,c,"F",u,l)}function CT(n,e){let t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return X(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function mT(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function cE(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=Fs(t.unaryFilter.field);return Ke.create(r,"==",{doubleValue:NaN});case"IS_NULL":let s=Fs(t.unaryFilter.field);return Ke.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let i=Fs(t.unaryFilter.field);return Ke.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let o=Fs(t.unaryFilter.field);return Ke.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return X(61313);default:return X(60726)}})(n):n.fieldFilter!==void 0?(function(t){return Ke.create(Fs(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return X(58110);default:return X(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Xt.create(t.compositeFilter.filters.map((r=>cE(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return X(1026)}})(t.compositeFilter.op))})(n):X(30097,{filter:n})}function ET(n){return aT[n]}function _T(n){return cT[n]}function wT(n){return uT[n]}function ks(n){return{fieldPath:n.canonicalString()}}function Fs(n){return Mt.fromServerFormat(n.fieldPath)}function uE(n){return n instanceof Ke?(function(t){if(t.op==="=="){if(St(t.value))return{unaryFilter:{field:ks(t.field),op:"IS_NAN"}};if(Lt(t.value))return{unaryFilter:{field:ks(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(St(t.value))return{unaryFilter:{field:ks(t.field),op:"IS_NOT_NAN"}};if(Lt(t.value))return{unaryFilter:{field:ks(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ks(t.field),op:_T(t.op),value:t.value}}})(n):n instanceof Xt?(function(t){let r=t.getFilters().map((s=>uE(s)));return r.length===1?r[0]:{compositeFilter:{op:wT(t.op),filters:r}}})(n):X(54877,{filter:n})}function yT(n){let e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function lE(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function BE(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function Do(n,e){let t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function hE(n){return{stringValue:n}}/**
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
 */function cu(n){return new AB(n,!0)}/**
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
 */var Qt=class n{constructor(e){this._byteString=e}static fromBase64String(e){try{return new n(Ye.fromBase64String(e))}catch(t){throw new q(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new n(Ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:n._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(qo(e,n._jsonSchema))return n.fromBase64String(e.bytes)}};Qt._jsonSchemaVersion="firestore/bytes/1.0",Qt._jsonSchema={type:Qe("string",Qt._jsonSchemaVersion),bytes:Qe("string")};/**
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
 */var cs=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new q(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Mt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};function uu(){return new cs(mn)}/**
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
 */var us=class{constructor(e){this._methodName=e}};/**
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
 */var xn=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new q(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new q(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return me(this._lat,e._lat)||me(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(qo(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};xn._jsonSchemaVersion="firestore/geoPoint/1.0",xn._jsonSchema={type:Qe("string",xn._jsonSchemaVersion),latitude:Qe("number"),longitude:Qe("number")};/**
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
 */var at=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};at.UNAUTHENTICATED=new at(null),at.GOOGLE_CREDENTIALS=new at("google-credentials-uid"),at.FIRST_PARTY=new at("first-party-uid"),at.MOCK_USER=new at("mock-user");/**
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
 */var on=class{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}};/**
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
 */var vc=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},bc=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(at.UNAUTHENTICATED)))}shutdown(){}},SB=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}},Sc=class{constructor(e){this.De=e,this.currentUser=at.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){ne(this.Ce===void 0,42304);let r=this.xe,s=u=>this.xe!==r?(r=this.xe,t(u)):Promise.resolve(),i=new on;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new on,e.enqueueRetryable((()=>s(this.currentUser)))};let o=()=>{let u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{J("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),o())};this.De.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){let u=this.De.getImmediate({optional:!0});u?c(u):(J("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new on)}}),0),o()}getToken(){let e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.xe!==e?(J("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(ne(typeof r.accessToken=="string",31837,{Oe:r}),new vc(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){let e=this.auth&&this.auth.getUid();return ne(e===null||typeof e=="string",2055,{Me:e}),new at(e)}},RB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r,this.type="FirstParty",this.user=at.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);let e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}},PB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r}getToken(){return Promise.resolve(new RB(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(at.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},Rc=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},Pc=class{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,Ot(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){ne(this.Ce===void 0,3512);let r=i=>{i.error!=null&&J("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);let o=i.token!==this.$e;return this.$e=i.token,J("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>r(i)))};let s=i=>{J("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){let i=this.qe.getImmediate({optional:!0});i?s(i):J("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new Rc(this.Ke));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ne(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new Rc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}};function dE(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */var NB=class{Qe(e){}shutdown(){}};/**
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
 */var cm="ConnectivityMonitor",Nc=class{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){J(cm,"Network connectivity changed: AVAILABLE");for(let e of this.He)e(0)}je(){J(cm,"Network connectivity changed: UNAVAILABLE");for(let e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};/**
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
 */var lc=null;function OB(){return lc===null?lc=(function(){return 268435456+Math.round(2147483648*Math.random())})():lc++,"0x"+lc.toString(16)}/**
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
 */var sB="RestConnection",DT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},kB=class{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${r}/databases/${s}`,this.tt=this.databaseId.database===ho?`project_id=${r}`:`project_id=${r}&database_id=${s}`}nt(e,t,r,s,i){let o=OB(),c=this.rt(e,t.toUriEncodedString());J(sB,`Sending RPC '${e}' ${o}:`,c,r);let u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);let{host:l}=new URL(c),h=kr(l);return this.st(e,c,u,r,h).then((f=>(J(sB,`Received RPC '${e}' ${o}: `,f),f)),(f=>{throw $t(sB,`RPC '${e}' ${o} failed with error: `,f,"url: ",c,"request:",r),f}))}_t(e,t,r,s,i,o){return this.nt(e,t,r,s,i)}it(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ii})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(let s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){let r=DT[e],s=`${this.Xe}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}};/**
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
 */var FB=class{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}};/**
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
 */var pt="WebChannelConnection",so=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))},Oc=class n extends kB{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!n.yt){let e=Jl();so(e,Kl.STAT_EVENT,(t=>{t.stat===ec.PROXY?J(pt,"STAT_EVENT: detected buffering proxy"):t.stat===ec.NOPROXY&&J(pt,"STAT_EVENT: detected no buffering proxy")})),n.yt=!0}}st(e,t,r,s,i){let o=OB();return new Promise(((c,u)=>{let l=new ql;l.setWithCredentials(!0),l.listenOnce(jl.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case Xi.NO_ERROR:let f=l.getResponseJson();J(pt,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),c(f);break;case Xi.TIMEOUT:J(pt,`RPC '${e}' ${o} timed out`),u(new q(O.DEADLINE_EXCEEDED,"Request time out"));break;case Xi.HTTP_ERROR:let g=l.getStatus();if(J(pt,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let v=l.getResponseJson();Array.isArray(v)&&(v=v[0]);let I=v?.error;if(I&&I.status&&I.message){let S=(function(H){let se=H.toLowerCase().replace(/_/g,"-");return Object.values(O).indexOf(se)>=0?se:O.UNKNOWN})(I.status);u(new q(S,I.message))}else u(new q(O.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new q(O.UNAVAILABLE,"Connection failed."));break;default:X(9055,{wt:e,streamId:o,bt:l.getLastErrorCode(),St:l.getLastError()})}}finally{J(pt,`RPC '${e}' ${o} completed.`)}}));let h=JSON.stringify(s);J(pt,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",h,r,15)}))}vt(e,t,r){let s=OB(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.it(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;let l=i.join("");J(pt,`Creating RPC '${e}' stream ${s}: ${l}`,c);let h=o.createWebChannel(l,c);this.Dt(h);let f=!1,g=!1,v=new FB({ot:I=>{g?J(pt,`Not sending because RPC '${e}' stream ${s} is closed:`,I):(f||(J(pt,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),J(pt,`RPC '${e}' stream ${s} sending:`,I),h.send(I))},ut:()=>h.close()});return so(h,bs.EventType.OPEN,(()=>{g||(J(pt,`RPC '${e}' stream ${s} transport opened.`),v.Rt())})),so(h,bs.EventType.CLOSE,(()=>{g||(g=!0,J(pt,`RPC '${e}' stream ${s} transport closed`),v.Vt(),this.xt(h))})),so(h,bs.EventType.ERROR,(I=>{g||(g=!0,$t(pt,`RPC '${e}' stream ${s} transport errored. Name:`,I.name,"Message:",I.message),v.Vt(new q(O.UNAVAILABLE,"The operation could not be completed")))})),so(h,bs.EventType.MESSAGE,(I=>{if(!g){let S=I.data[0];ne(!!S,16349);let U=S,H=U?.error||U[0]?.error;if(H){J(pt,`RPC '${e}' stream ${s} received error:`,H);let se=H.status,De=(function(Ie){let b=ze[Ie];if(b!==void 0)return tE(b)})(se),Ce=H.message;se==="NOT_FOUND"&&Ce.includes("database")&&Ce.includes("does not exist")&&Ce.includes(this.databaseId.database)&&$t(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),De===void 0&&(De=O.INTERNAL,Ce="Unknown error status: "+se+" with message "+H.message),g=!0,v.Vt(new q(De,Ce)),h.close()}else J(pt,`RPC '${e}' stream ${s} received:`,S),v.dt(S)}})),n.gt(),setTimeout((()=>{v.At()}),0),v}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,r){super.it(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return zl()}};/**
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
 */function IT(n){return new Oc(n)}Oc.yt=!1;var Io=class{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=r,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();let t=Math.floor(this.Nt+this.qt()),r=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-r);s>0&&J("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}};/**
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
 */var um="PersistentStream",xB=class{constructor(e,t,r,s,i,o,c,u){this.Ct=e,this.Kt=r,this.Qt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new Io(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===O.RESOURCE_EXHAUSTED?(Gn(t.toString()),Gn("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===O.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;let e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.un(r,s)}),(r=>{e((()=>{let s=new q(O.UNKNOWN,"Fetching auth token failed: "+r.message);return this.cn(s)}))}))}un(e,t){let r=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{r((()=>this.listener.ct()))})),this.stream.Et((()=>{r((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{r((()=>this.cn(s)))})),this.stream.onMessage((s=>{r((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return J(um,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(J(um,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}},LB=class extends xB{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();let t=hT(this.serializer,e),r=(function(i){if(!("targetChange"in i))return Be.min();let o=i.targetChange;return o.targetIds&&o.targetIds.length?Be.min():o.readTime?Fn(o.readTime):Be.min()})(e);return this.listener.Tn(t,r)}Pn(e){let t={};t.database=om(this.serializer),t.addTarget=(function(i,o){let c,u=o.target;if(c=Wr(u)?{pipelineQuery:mT(i,u)}:Xm(u)?{documents:fT(i,u)}:{query:pT(i,u).Se},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=sE(i,o.resumeToken);let l=vB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo(Be.min())>0){c.readTime=uo(i,o.snapshotVersion.toTimestamp());let l=vB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}return c})(this.serializer,e);let r=CT(this.serializer,e);r&&(t.labels=r),this.nn(t)}In(e){let t={};t.database=om(this.serializer),t.removeTarget=e,this.nn(t)}};/**
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
 */var VB=class{},MB=class extends VB{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new q(O.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,r,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.nt(e,bB(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(O.UNKNOWN,i.toString())}))}_t(e,t,r,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection._t(e,bB(t,r),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===O.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(O.UNKNOWN,o.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}};function TT(n,e,t,r){return new MB(n,e,t,r)}/**
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
 */var AT="ComponentProvider",lm=new Map;function vT(n,e,t,r,s){return new lB(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,dE(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
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
 */var Bm={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},fE=41943040,Wt=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};Wt.DEFAULT_COLLECTION_PERCENTILE=10,Wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Wt.DEFAULT=new Wt(fE,Wt.DEFAULT_COLLECTION_PERCENTILE,Wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Wt.DISABLED=new Wt(-1,0,0);/**
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
 */var Ys=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.gn(r),this.yn=r=>t.writeSequenceNumber(r))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.yn&&this.yn(e),e}};Ys.wn=-1;/**
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
 */var bT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",GB=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}};/**
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
 */async function lu(n){if(n.code!==O.FAILED_PRECONDITION||n.message!==bT)throw n;J("LocalStore","Unexpectedly lost primary lease")}/**
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
 */var G=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&X(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):n.reject(t)}static resolve(e){return new n(((t,r)=>{t(e)}))}static reject(e){return new n(((t,r)=>{r(e)}))}static waitFor(e){return new n(((t,r)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>r(u)))})),o=!0,i===s&&t()}))}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next((s=>s?n.resolve(s):r()));return t}static forEach(e,t){let r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new n(((r,s)=>{let i=e.length,o=new Array(i),c=0;for(let u=0;u<i;u++){let l=u;t(e[l]).next((h=>{o[l]=h,++c,c===i&&r(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new n(((r,s)=>{let i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}};/**
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
 */function ST(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ai(n){return n.name==="IndexedDbTransactionError"}/**
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
 */var hm="LruGarbageCollector",pE=1048576;function dm([n,e],[t,r]){let s=me(n,t);return s===0?me(e,r):s}var UB=class{constructor(e){this.Yn=e,this.buffer=new tt(dm),this.Zn=0}Xn(){return++this.Zn}er(e){let t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{let r=this.buffer.last();dm(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}},HB=class{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){J(hm,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){ai(t)?J(hm,"Ignoring IndexedDB error during garbage collection: ",t):await lu(t)}await this.nr(3e5)}))}},qB=class{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return G.resolve(Ys.wn);let r=new UB(t);return this.rr.forEachTarget(e,(s=>r.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>r.er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.rr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(J("LruGarbageCollector","Garbage collection skipped; disabled"),G.resolve(Bm)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(J("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Bm):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let r,s,i,o,c,u,l,h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((f=>(f>this.params.maximumSequenceNumbersToCollect?(J("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),s=this.params.maximumSequenceNumbersToCollect):s=f,o=Date.now(),this.nthSequenceNumber(e,s)))).next((f=>(r=f,c=Date.now(),this.removeTargets(e,r,t)))).next((f=>(i=f,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((f=>(l=Date.now(),Ps()<=pe.DEBUG&&J("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${f} documents in `+(l-u)+`ms
Total Duration: ${l-h}ms`),G.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:f}))))}};function RT(n,e){return new qB(n,e)}/**
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
 */var gE="firestore.googleapis.com",fm=!0,kc=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new q(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=gE,this.ssl=fm}else this.host=e.host,this.ssl=e.ssl??fm;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=fE;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pE)throw new q(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(Pm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=dE(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new q(O.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new q(O.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;let i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(let c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}},Bu=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new kc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new q(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new kc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new bc;switch(r.type){case"firstParty":return new PB(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new q(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){let r=lm.get(t);r&&(J(AT,"Removing Datastore"),lm.delete(t),r.terminate())})(this),Promise.resolve()}};function CE(n,e,t,r={}){n=Dn(n,Bu);let s=kr(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&Ca(`https://${c}`),i.host!==gE&&i.host!==c&&$t("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let u={...i,host:c,ssl:s,emulatorOptions:r};if(!fn(u,o)&&(n._setSettings(u),r.mockUserToken)){let l,h;if(typeof r.mockUserToken=="string")l=r.mockUserToken,h=at.MOCK_USER;else{l=Gp(r.mockUserToken,n._app?.options.projectId);let f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new q(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new at(f)}n._authCredentials=new SB(new vc(l,h))}}/**
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
 */var an=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},$e=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ln(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(qo(t,n._jsonSchema))return new n(e,r||null,new Z(ve.fromString(t.referencePath)))}};$e._jsonSchemaVersion="firestore/documentReference/1.0",$e._jsonSchema={type:Qe("string",$e._jsonSchemaVersion),referencePath:Qe("string")};var Ln=class n extends an{constructor(e,t,r){super(e,t,zo(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new $e(this.firestore,null,new Z(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function gs(n,e,...t){if(n=Ue(n),Rm("collection","path",e),n instanceof Bu){let r=ve.fromString(e,...t);return jC(r),new Ln(n,null,r)}{if(!(n instanceof $e||n instanceof Ln))throw new q(O.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(ve.fromString(e,...t));return jC(r),new Ln(n.firestore,null,r)}}function Zn(n,e,...t){if(n=Ue(n),arguments.length===1&&(e=Ms.newId()),Rm("doc","path",e),n instanceof Bu){let r=ve.fromString(e,...t);return qC(r),new $e(n,null,new Z(r))}{if(!(n instanceof $e||n instanceof Ln))throw new q(O.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(ve.fromString(e,...t));return qC(r),new $e(n.firestore,n instanceof Ln?n.converter:null,new Z(r))}}/**
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
 */var Gt=class n{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(qo(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new n(e.vectorValues);throw new q(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};Gt._jsonSchemaVersion="firestore/vectorValue/1.0",Gt._jsonSchema={type:Qe("string",Gt._jsonSchemaVersion),vectorValues:Qe("object")};/**
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
 */var PT=/^__.*__$/,jB=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new qn(e,this.data,this.fieldMask,t,this.fieldTransforms):new os(e,this.data,t,this.fieldTransforms)}},Fc=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new qn(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function mE(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw X(40011,{dataSource:n})}}var KB=class n{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new n({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Lc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(mE(this.dataSource)&&PT.test(e))throw this.createError('Document fields cannot begin and end with "__"')}},JB=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||cu(e)}createContext(e,t,r,s=!1){return new KB({dataSource:e,methodName:t,targetDoc:r,path:Mt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function hu(n){let e=n._freezeSettings(),t=cu(n._databaseId);return new JB(n._databaseId,!!e.ignoreUndefinedProperties,t)}function EE(n,e,t,r,s,i={}){let o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);rf("Data must be an object, but it was:",o,r);let c=yE(r,o),u,l;if(i.merge)u=new rn(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){let h=[];for(let f of i.mergeFields){let g=zn(e,f,t);if(!o.contains(g))throw new q(O.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);TE(h,g)||h.push(g)}u=new rn(h),l=o.fieldTransforms.filter((f=>u.covers(f.field)))}else u=null,l=o.fieldTransforms;return new jB(new wt(c),u,l)}var xc=class n extends us{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof n}};var zB=class n extends us{_toFieldTransform(e){return new dB(e.path,new ns)}isEqual(e){return e instanceof n}};function _E(n,e,t,r){let s=n.createContext(1,e,t);rf("Data must be an object, but it was:",s,r);let i=[],o=wt.empty();ps(r,((u,l)=>{let h=sf(e,u,t);l=Ue(l);let f=s.childContextForFieldPath(h);if(l instanceof xc)i.push(h);else{let g=_r(l,f);g!=null&&(i.push(h),o.set(h,g))}}));let c=new rn(i);return new Fc(o,c,s.fieldTransforms)}function wE(n,e,t,r,s,i){let o=n.createContext(1,e,t),c=[zn(e,r,t)],u=[s];if(i.length%2!=0)throw new q(O.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(zn(e,i[g])),u.push(i[g+1]);let l=[],h=wt.empty();for(let g=c.length-1;g>=0;--g)if(!TE(l,c[g])){let v=c[g],I=u[g];I=Ue(I);let S=o.childContextForFieldPath(v);if(I instanceof xc)l.push(v);else{let U=_r(I,S);U!=null&&(l.push(v),h.set(v,U))}}let f=new rn(l);return new Fc(h,f,o.fieldTransforms)}function nf(n,e,t,r=!1){return _r(t,n.createContext(r?4:3,e))}function _r(n,e,t){if(IE(n=Ue(n)))return rf("Unsupported field value:",e,n),yE(n,e);if(n instanceof us)return(function(s,i){if(!mE(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);let o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){let o=[],c=0;for(let u of s){let l=_r(u,i.childContextForArray(c));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),c++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=Ue(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Xd(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){let c=He.fromDate(s);return{timestampValue:uo(i.serializer,c)}}if(s instanceof He){let c=new He(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:uo(i.serializer,c)}}if(DE(s)){let c=He.fromInstant(s),u=new He(c.seconds,1e3*Math.floor(c.nanoseconds/1e3));return{timestampValue:uo(i.serializer,u)}}if(s instanceof xn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Qt)return{bytesValue:sE(i.serializer,s._byteString)};if(s instanceof $e){let c=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(c))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:tf(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Gt)return(function(u,l){let h=u instanceof Gt?u.toArray():u;return{mapValue:{fields:{[Qd]:{stringValue:$d},[ts]:{arrayValue:{values:h.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return su(l.serializer,g)}))}}}}}})(s,i);if(BE(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Ho(s)}`)})(n,e)}function yE(n,e){let t={};return Sm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ps(n,((r,s)=>{let i=_r(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function DE(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;let e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function IE(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof He||n instanceof xn||n instanceof Qt||n instanceof $e||n instanceof us||n instanceof Gt||DE(n)||BE(n))}function rf(n,e,t){if(!IE(t)||!Uo(t)){let r=Ho(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function zn(n,e,t){if((e=Ue(e))instanceof cs)return e._internalPath;if(typeof e=="string")return sf(n,e);throw Lc("Field path arguments must be of type string or ",n,!1,void 0,t)}var NT=new RegExp("[~\\*/\\[\\]]");function sf(n,e,t){if(e.search(NT)>=0)throw Lc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new cs(...e.split("."))._internalPath}catch{throw Lc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Lc(n,e,t,r,s){let i=r&&!r.isEmpty(),o=s!==void 0,c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new q(O.INVALID_ARGUMENT,c+n+u)}function TE(n,e){return n.some((t=>t.isEqual(e)))}function AE(n){return typeof n._readUserData=="function"}/**
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
 */var gt=class n{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){let r=wt.empty();for(let s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){let i=this.optionDefinitions[s];if(s in e){let o=e[s],c;i.nestedOptions&&Uo(o)?c={mapValue:{fields:new n(i.nestedOptions).getOptionsProto(t,o)}}:o&&(c=_r(o,t)??void 0),c&&r.set(Mt.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){let s=this._getKnownOptions(t,e);if(r){let i=new Map(bm(r,((o,c)=>[Mt.fromServerFormat(c),o!==void 0?_r(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}};/**
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
 */function OT(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Uo(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}/**
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
 */function cn(){return new zB("serverTimestamp")}function vE(n){return new Gt(n)}/**
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
 */function j(n){let e;return n instanceof Wn?n:(e=Uo(n)?FT(n):n instanceof Array?xT(n):bE(n,void 0),e)}function iB(n){if(n instanceof Wn)return n;if(n instanceof Gt)return To(n);if(Array.isArray(n))return To(vE(n));throw new Error("Unsupported value: "+typeof n)}function of(n){return xI(n)?pc(n):j(n)}var Wn=class{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,j(e)],"add")}asBoolean(){if(this instanceof yr)return this;if(this instanceof Xs)return new Mc(this);if(this instanceof wr)return new $B(this);if(this instanceof x)return new Vc(this);throw new q("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,j(e)],"subtract")}multiply(e){return new x("multiply",[this,j(e)],"multiply")}divide(e){return new x("divide",[this,j(e)],"divide")}mod(e){return new x("mod",[this,j(e)],"mod")}equal(e){return new x("equal",[this,j(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,j(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,j(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,j(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,j(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,j(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){let r=[e,...t].map((s=>j(s)));return new x("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,j(e)],"arrayContains").asBoolean()}arrayContainsAll(e){let t=Array.isArray(e)?new Yr(e.map(j),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){let t=Array.isArray(e)?new Yr(e.map(j),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){let t=Array.isArray(e)?new Yr(e.map(j),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){let t=Array.isArray(e)?new Yr(e.map(j),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,j(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,j(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,j(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,j(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,j(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,j(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,j(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,j(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){let t=[this];return e&&t.push(j(e)),new x("trim",t,"trim")}ltrim(e){let t=[this];return e&&t.push(j(e)),new x("ltrim",t,"ltrim")}rtrim(e){let t=[this];return e&&t.push(j(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,To(e)],"isType").asBoolean()}stringConcat(e,...t){let r=[e,...t].map(j);return new x("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,j(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,j(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,j(e),j(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,j(e),j(t)],"stringReplaceOne")}concat(e,...t){let r=[e,...t].map(j);return new x("concat",[this,...r],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,j(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,j(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new x("array_transform",[this,j(e),j(t),r],"arrayTransformWithIndex")}arraySlice(e,t){let r=[this,j(e)];return t!==void 0&&r.push(j(t)),new x("array_slice",r,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,j(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,j(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,j(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,j(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,j(e),j("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,j(e),j("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,j(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,To(e)],"mapGet")}mapSet(e,t,...r){let s=[this,j(e),j(t),...r.map(j)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,j(e)],"get_field")}count(){return xt._create("count",[this],"count")}sum(){return xt._create("sum",[this],"sum")}average(){return xt._create("average",[this],"average")}minimum(){return xt._create("minimum",[this],"minimum")}maximum(){return xt._create("maximum",[this],"maximum")}first(){return xt._create("first",[this],"first")}last(){return xt._create("last",[this],"last")}arrayAgg(){return xt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return xt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return xt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){let r=[e,...t];return new x("maximum",[this,...r.map(j)],"logicalMaximum")}logicalMinimum(e,...t){let r=[e,...t];return new x("minimum",[this,...r.map(j)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,iB(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,iB(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,iB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,j(e),j(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,j(e),j(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,of(e),j(t)],"timestampDiff")}timestampExtract(e,t){let r=[this,j(e)];return t&&r.push(j(t)),new x("timestamp_extract",r,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){let r=j(e);return new x("substring",t===void 0?[this,r]:[this,r,j(t)],"substring")}arrayGet(e){return new x("array_get",[this,j(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){let t=new x("if_error",[this,j(e)],"ifError");return e instanceof yr?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,j(e)],"mapRemove")}mapMerge(e,...t){let r=j(e),s=t.map(j);return new x("map_merge",[this,r,...s],"mapMerge")}pow(e){return new x("pow",[this,j(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,j(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,j(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,j(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,j(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,j(e),...t.map(j)],"coalesce")}join(e){return new x("join",[this,j(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,j(e)])}timestampTruncate(e,t){let r=[this,j(e)];return t&&r.push(j(t)),new x("timestamp_trunc",r)}ascending(){return LT(this)}descending(){return VT(this)}as(e){return new QB(this,e,"as")}},xt=class n{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){let s=new n(e,t);return s._methodName=r,s}as(e){return new WB(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}},WB=class{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}},QB=class{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}},Yr=class extends Wn{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}},wr=class extends Wn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,j(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}};function pc(n){return kT(n,"field")}function kT(n,e){return new wr(typeof n=="string"?mn===n?uu()._internalPath:zn("field",n):n._internalPath,e)}var Xs=class n extends Wn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){let t=new n(e,void 0);return t._protoValue=e,t}_toProto(e){return ne(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,OT(this._protoValue)||(this._protoValue=_r(this.value,e))}};function To(n,e){return bE(n,"constant")}function bE(n,e){let t=new Xs(n,e);return typeof n=="boolean"?new Mc(t):t}var x=class extends Wn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new gt({})}_toProto(e){let t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}},yr=class n extends Wn{get _methodName(){return this._expr._methodName}countIf(){return xt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){let t=j(e),r=new x("if_error",[this,t],"ifError");return t instanceof n?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}},Vc=class extends yr{constructor(e){super(),this._expr=e,this.expressionType="Function"}},Mc=class extends yr{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}},$B=class extends yr{constructor(e){super(),this._expr=e,this.expressionType="Field"}};function FT(n,e){let t=[];for(let r in n)if(Object.prototype.hasOwnProperty.call(n,r)){let s=n[r];t.push(To(r)),t.push(j(s))}return new x("map",t,"map")}function xT(n){return(function(t,r){return new x("array",t.map((s=>j(s))),r)})(n,"array")}function LT(n){return new Gc(of(n),"ascending","ascending")}function VT(n){return new Gc(of(n),"descending","descending")}var Gc=class{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:hE(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}};/**
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
 */var yt=class{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}},Uc=class extends yt{get _name(){return"add_fields"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[Do(e,this.fields)]}}_readUserData(e){super._readUserData(e),Dr(this.fields,e)}};var Hc=class extends yt{get _name(){return"aggregate"}get _optionsUtil(){return new gt({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[Do(e,this.accumulators),Do(e,this.groups)]}}_readUserData(e){super._readUserData(e),Dr(this.groups,e),Dr(this.accumulators,e)}},qc=class extends yt{get _name(){return"distinct"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[Do(e,this.groups)]}}_readUserData(e){super._readUserData(e),Dr(this.groups,e)}},Zs=class extends yt{get _name(){return"collection"}get _optionsUtil(){return new gt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}},ei=class extends yt{get _name(){return"collection_group"}get _optionsUtil(){return new gt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}};var Ao=class extends yt{get _name(){return"database"}get _optionsUtil(){return new gt({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}},vo=class extends yt{get _name(){return"documents"}get _optionsUtil(){return new gt({})}constructor(e,t){if(super(t),!e||e.length===0)throw new q(O.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");let r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new q(O.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=r,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}},ti=class extends yt{get _name(){return"where"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Dr(this.condition,e)}};var Qn=class extends yt{get _name(){return"limit"}get _optionsUtil(){return new gt({})}constructor(e,t){ne(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Xd(e,this.limit)]}}},jc=class extends yt{get _name(){return"offset"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Xd(e,this.offset)]}}},YB=class extends yt{get _name(){return"select"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[Do(e,this.selections)]}}_readUserData(e){super._readUserData(e),Dr(this.selections,e)}},sn=class extends yt{get _name(){return"sort"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),Dr(this.orderings,e)}};var XB=class n extends yt{get _name(){return"replace_with"}get _optionsUtil(){return new gt({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),hE(n.Ir)]}}_readUserData(e){super._readUserData(e),Dr(this.map,e)}};XB.Ir="full_replace";function Dr(n,e){return AE(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
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
 */var ZB=class n{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Vr(e,t){let r=this.userDataReader.createContext(3,e);return AE(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){let t=this.stages.map((r=>r));return this.Vr("where",e),t.push(new ti(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){let t=this.stages.map((r=>r));return t.push(new Qn(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){let r=this.stages.map((s=>s));return"orderings"in e?r.push(new sn(this.Vr("sort",e.orderings),{})):r.push(new sn(this.Vr("sort",[e,...t]),{})),new n(this._db,this.userDataReader,this._userDataWriter,r)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}};// Copyright 2024 Google LLC* @license
var lt=class{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return du(this)}getPipelineCollectionGroup(){return af(this)}getPipelineCollectionId(){return MT(this)}getPipelineDocuments(){return eh(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==qc.name&&s._name!==Hc.name||(r="keyless"),s._name===YB.name&&r==="exact"&&(r="augmented"),s._name===Uc.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return pr(this)}};function pr(n){let e=n.stages[0];return e instanceof Zs||e instanceof ei||e instanceof Ao||e instanceof vo?e._name:"unknown"}function du(n){if(pr(n)==="collection")return n.stages[0].hr}function af(n){if(pr(n)==="collection_group")return n.stages[0].collectionId}function MT(n){switch(pr(n)){case"collection":return ve.fromString(du(n)).lastSegment();case"collection_group":return af(n);default:return}}function eh(n){if(pr(n)==="documents")return n.stages[0].Tr}var R=class n{constructor(e,t){this.type=e,this.value=t}static mr(){return new n("ERROR",void 0)}static pr(){return new n("UNSET",void 0)}static gr(){return new n("NULL",qs)}static newValue(e){return Lt(e)?new n("NULL",qs):(function(r){return!!r&&"booleanValue"in r})(e)?new n("BOOLEAN",e):En(e)?new n("INT",e):Qr(e)?new n("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new n("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new n("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new n("BYTES",e):e.referenceValue?new n("REFERENCE",e):e.geoPointValue?new n("GEO_POINT",e):Ks(e)?new n("ARRAY",e):go(e)?new n("VECTOR",e):Ls(e)?new n("MAP",e):new n("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}};function Bo(n){if(!n.yr())return n.value}function SE(n){return n instanceof yr?n._expr:n}function ae(n){if((n=SE(n))instanceof wr)return new th(n);if(n instanceof Xs)return new nh(n);if(n instanceof Yr)return new rh(n);if(n instanceof x){if(n.name==="add")return new sh(n);if(n.name==="subtract")return new ih(n);if(n.name==="multiply")return new oh(n);if(n.name==="divide")return new ah(n);if(n.name==="mod")return new ch(n);if(n.name==="and")return new uh(n);if(n.name==="equal")return new yh(n);if(n.name==="not_equal")return new Dh(n);if(n.name==="less_than")return new Ih(n);if(n.name==="less_than_or_equal")return new Th(n);if(n.name==="greater_than")return new Ah(n);if(n.name==="greater_than_or_equal")return new vh(n);if(n.name==="array_concat")return new bh(n);if(n.name==="array_reverse")return new Sh(n);if(n.name==="array_contains")return new Rh(n);if(n.name==="array_contains_all")return new Ph(n);if(n.name==="array_contains_any")return new Nh(n);if(n.name==="array_length")return new Oh(n);if(n.name==="array_element")return new kh(n);if(n.name==="equal_any")return new Kc(n);if(n.name==="not_equal_any")return new hh(n);if(n.name==="is_nan")return new dh(n);if(n.name==="is_not_nan")return new fh(n);if(n.name==="is_null")return new ph(n);if(n.name==="is_not_null")return new gh(n);if(n.name==="is_error")return new Ch(n);if(n.name==="exists")return new mh(n);if(n.name==="not")return new ni(n);if(n.name==="or")return new lh(n);if(n.name==="xor")return new Bh(n);if(n.name==="conditional")return new Eh(n);if(n.name==="maximum")return new _h(n);if(n.name==="minimum")return new wh(n);if(n.name==="reverse")return new Fh(n);if(n.name==="replace_first")return new xh(n);if(n.name==="replace_all")return new Lh(n);if(n.name==="char_length")return new Vh(n);if(n.name==="byte_length")return new Mh(n);if(n.name==="like")return new Gh(n);if(n.name==="regex_contains")return new Uh(n);if(n.name==="regex_match")return new Hh(n);if(n.name==="string_contains")return new qh(n);if(n.name==="starts_with")return new jh(n);if(n.name==="ends_with")return new Kh(n);if(n.name==="to_lower")return new Jh(n);if(n.name==="to_upper")return new zh(n);if(n.name==="trim")return new Wh(n);if(n.name==="string_concat")return new Qh(n);if(n.name==="map_get")return new $h(n);if(n.name==="cosine_distance")return new Yh(n);if(n.name==="dot_product")return new Xh(n);if(n.name==="euclidean_distance")return new Zh(n);if(n.name==="vector_length")return new ed(n);if(n.name==="unix_micros_to_timestamp")return new td(n);if(n.name==="timestamp_to_unix_micros")return new sd(n);if(n.name==="unix_millis_to_timestamp")return new nd(n);if(n.name==="timestamp_to_unix_millis")return new id(n);if(n.name==="unix_seconds_to_timestamp")return new rd(n);if(n.name==="timestamp_to_unix_seconds")return new od(n);if(n.name==="timestamp_add")return new ad(n);if(n.name==="timestamp_subtract")return new cd(n)}throw new Error(`Unknown Expr : ${n}`)}var th=class{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===mn)return R.newValue({referenceValue:yo(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return R.newValue({timestampValue:fc(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return R.newValue({timestampValue:fc(e.serializer,t.createTime)});let r=t.data.field(this.expr._fieldPath);return r?oi(r)?R.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:fc(i.serializer,Be.fromTimestamp(Us(o)))};if(i.serverTimestampBehavior==="previous"){let c=jo(o);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):R.newValue(r):R.pr()}},nh=class{constructor(e){this.expr=e}evaluate(e,t){return R.newValue(this.expr._getValue())}},rh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.cr.map((s=>ae(s).evaluate(e,t)));return r.some((s=>s.yr()))?R.mr():R.newValue({arrayValue:{values:r.map((s=>s.value))}})}};function Bt(n){return Qr(n)?Number(n.doubleValue):Number(n.integerValue)}function yn(n){return BigInt(n.integerValue)}var GT=BigInt("0x7fffffffffffffff"),UT=-BigInt("0x8000000000000000"),ls=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length>=2,24778);let r=ae(this.expr.params[0]).evaluate(e,t),s=ae(this.expr.params[1]).evaluate(e,t),i=this.br(r,s);for(let o of this.expr.params.slice(2)){let c=ae(o).evaluate(e,t);i=this.br(i,c)}return i}br(e,t){if(e.yr()||t.yr())return R.mr();if(e.wr()||t.wr())return R.gr();let r=e.value,s=t.value;if(!Qr(r)&&!En(r)||!Qr(s)&&!En(s))return R.mr();if(Qr(r)||Qr(s)){let i=this.Sr(r,s);return i?R.newValue(i):R.mr()}if(En(r)&&En(s)){let i=this.vr(r,s);return i===void 0?R.mr():typeof i=="number"?R.newValue({doubleValue:i}):i<UT||i>GT?R.mr():R.newValue({integerValue:`${i}`})}return R.mr()}};function $n(n,e){return Xe(n)!==Xe(e)?"TYPE_MISMATCH":St(n)||St(e)?"NOT_EQ":Lt(n)&&Lt(e)?"EQ":Lt(n)||Lt(e)?"NULL":Ks(n)&&Ks(e)?(function(r,s){if(r.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let o=0;o<(r.values?.length??0);o++){let c=r.values[o],u=s.values[o];switch($n(c,u)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:X(44609,{Dr:c,Cr:u})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):go(n)&&go(e)||Ls(n)&&Ls(e)?(function(r,s){let i=r.fields||{},o=s.fields||{};if(mc(i)!==mc(o))return"NOT_EQ";let c=!1;for(let u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch($n(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return Yt(r,s,{u:!1,i:!0,o:!0})})(n,e)?"EQ":"NOT_EQ"}var sh=class extends ls{vr(e,t){return yn(e)+yn(t)}Sr(e,t){return{doubleValue:Bt(e)+Bt(t)}}},ih=class extends ls{constructor(e){super(e),this.expr=e}vr(e,t){return yn(e)-yn(t)}Sr(e,t){return{doubleValue:Bt(e)-Bt(t)}}},oh=class extends ls{constructor(e){super(e),this.expr=e}vr(e,t){return yn(e)*yn(t)}Sr(e,t){return{doubleValue:Bt(e)*Bt(t)}}},ah=class extends ls{constructor(e){super(e),this.expr=e}vr(e,t){let r=yn(t);if(r!==BigInt(0))return yn(e)/r}Sr(e,t){let r=Bt(t);return r===0?{doubleValue:Hs(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Bt(e)/r}}},ch=class extends ls{constructor(e){super(e),this.expr=e}vr(e,t){let r=yn(t);if(r!==BigInt(0))return yn(e)%r}Sr(e,t){let r=Bt(t);if(r!==0)return{doubleValue:Bt(e)%r}}},uh=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ae(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!o.value?.booleanValue)return R.newValue(ct);break;case"NULL":s=!0;break;default:r=!0}}return r?R.mr():s?R.gr():R.newValue(vt)}},ni=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,9634);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return R.newValue({booleanValue:!r.value?.booleanValue});case"NULL":return R.gr();default:return R.mr()}}},lh=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ae(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(o.value?.booleanValue)return R.newValue(vt);break;case"NULL":s=!0;break;default:r=!0}}return r?R.mr():s?R.gr():R.newValue(ct)}},Bh=class n{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ae(i).evaluate(e,t);switch(o.type){case"BOOLEAN":r=n.xor(r,!!o.value?.booleanValue);break;case"NULL":s=!0;break;default:return R.mr()}}return s?R.gr():R.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}},Kc=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,55094);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return R.mr()}if(r)return R.gr();for(let o of i.value?.arrayValue?.values??[])switch(Lt(s.value)&&Lt(o)?"EQ":$n(s.value,o)){case"EQ":return R.newValue(vt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(44608,{value:s.value,candidate:o})}return r?R.gr():R.newValue(ct)}},hh=class{constructor(e){this.expr=e}evaluate(e,t){return new ni(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}},dh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,23322);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return R.newValue(ct);case"DOUBLE":return R.newValue({booleanValue:isNaN(Bt(r.value))});case"NULL":return R.gr();default:return R.mr()}}},fh=class{constructor(e){this.expr=e}evaluate(e,t){return ne(this.expr.params.length===1,50406),new ni(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}},ph=class{constructor(e){this.expr=e}evaluate(e,t){switch(ne(this.expr.params.length===1,23123),ae(this.expr.params[0]).evaluate(e,t).type){case"NULL":return R.newValue(vt);case"UNSET":case"ERROR":return R.mr();default:return R.newValue(ct)}}},gh=class{constructor(e){this.expr=e}evaluate(e,t){return ne(this.expr.params.length===1,23167),new ni(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}},Ch=class{constructor(e){this.expr=e}evaluate(e,t){return ne(this.expr.params.length===1,5228),ae(this.expr.params[0]).evaluate(e,t).type==="ERROR"?R.newValue(vt):R.newValue(ct)}},mh=class{constructor(e){this.expr=e}evaluate(e,t){switch(ne(this.expr.params.length===1,6877),ae(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return R.mr();case"UNSET":return R.newValue(ct);default:return R.newValue(vt)}}},Eh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===3,11706);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return r.value?.booleanValue?ae(this.expr.params[1]).evaluate(e,t):ae(this.expr.params[2]).evaluate(e,t);case"NULL":return ae(this.expr.params[2]).evaluate(e,t);default:return R.mr()}}},_h=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ae(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||bt(i.value,s.value)>0?i:s}return s===void 0?R.gr():s}},wh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ae(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||bt(i.value,s.value)<0?i:s}return s===void 0?R.gr():s}},Ir=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return R.mr()}let s=ae(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return R.mr()}return this.Fr(r,s)}},yh=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return R.newValue(vt);if(e.wr()||t.wr()||St(e.value)||St(t.value)||Xe(e.value)!==Xe(t.value))return R.newValue(ct);switch($n(e.value,t.value)){case"EQ":return R.newValue(vt);case"NOT_EQ":return R.newValue(ct);case"NULL":return R.gr();default:X(44615,{left:e,right:t})}}},Dh=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){switch($n(e.value,t.value)){case"EQ":return R.newValue(ct);case"NOT_EQ":case"TYPE_MISMATCH":return R.newValue(vt);case"NULL":return R.gr();default:X(44614,{left:e,right:t})}}},Ih=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return Xe(e.value)!==Xe(t.value)||St(e.value)||St(t.value)?R.newValue(ct):R.newValue({booleanValue:bt(e.value,t.value)<0})}},Th=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return Xe(e.value)!==Xe(t.value)||St(e.value)||St(t.value)?R.newValue(ct):$n(e.value,t.value)==="EQ"?R.newValue(vt):R.newValue({booleanValue:bt(e.value,t.value)<0})}},Ah=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return Xe(e.value)!==Xe(t.value)||St(e.value)||St(t.value)?R.newValue(ct):R.newValue({booleanValue:bt(e.value,t.value)>0})}},vh=class extends Ir{constructor(e){super(e),this.expr=e}Fr(e,t){return Xe(e.value)!==Xe(t.value)||St(e.value)||St(t.value)?R.newValue(ct):$n(e.value,t.value)==="EQ"?R.newValue(vt):R.newValue({booleanValue:bt(e.value,t.value)>0})}},bh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Sh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,216);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return R.gr();case"ARRAY":{let s=r.value.arrayValue?.values??[];return R.newValue({arrayValue:{values:[...s].reverse()}})}default:return R.mr()}}},Rh=class{constructor(e){this.expr=e}evaluate(e,t){return ne(this.expr.params.length===2,52884),new Kc(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}},Ph=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,1392);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return R.mr()}if(r)return R.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of o){let l=!1;r=!1;for(let h of c){switch(Lt(u)&&Lt(h)?"EQ":$n(u,h)){case"EQ":l=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(44613,{value:h,search:u})}if(l)break}if(!l)return R.newValue(ct)}return R.newValue(vt)}},Nh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,2680);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return R.mr()}if(r)return R.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of c)for(let l of o)switch(Lt(u)&&Lt(l)?"EQ":$n(u,l)){case"EQ":return R.newValue(vt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:X(60403,{value:u,search:l})}return r?R.gr():R.newValue(ct)}},Oh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,38605);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return R.gr();case"ARRAY":return R.newValue({integerValue:`${r.value?.arrayValue?.values?.length??0}`});default:return R.mr()}}},kh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Fh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,1508);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return R.gr();case"BYTES":{let s=r.value?.bytesValue;if(typeof s=="string"){let i=Ye.fromBase64String(s).toUint8Array();return i.reverse(),R.newValue({bytesValue:Ye.fromUint8Array(i).toBase64()})}return R.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{let s=r.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),o=Array.from(i,(c=>c.segment)).reverse();return R.newValue({stringValue:o.join("")})}default:return R.mr()}}},xh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Lh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Vh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,19400);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return R.gr();case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){let h=o.codePointAt(u+1);h!==void 0&&h>=56320&&h<=57343?(c+=1,u++):c+=1}else c+=1;else c+=1;else{if(!(l<=1114111))return;c+=1,u++}}return c})(r.value.stringValue);return s===void 0?R.mr():R.newValue({integerValue:s})}default:return R.mr()}}},Mh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,8486);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{let s=r.value?.bytesValue;return typeof s=="string"?R.newValue({integerValue:Ye.fromBase64String(s).toUint8Array().length}):R.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l>=55296&&l<=57343){if(!(l<=56319))return;{let h=o.codePointAt(u+1);if(h===void 0||!(h>=56320&&h<=57343))return;c+=4,u++}}else if(l<=127)c+=1;else if(l<=2047)c+=2;else if(l<=65535)c+=3;else{if(!(l<=1114111))return;c+=4,u++}}return c})(r.value?.stringValue);return s===void 0?R.mr():R.newValue({integerValue:s})}case"NULL":return R.gr();default:return R.mr()}}},Tr=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return R.mr()}return r?R.gr():this.Or(s.value?.stringValue,i.value?.stringValue)}},Gh=class extends Tr{Or(e,t){try{let r=(function(o){let c="";for(let u=0;u<o.length;u++){let l=o.charAt(u);switch(l){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+l;break;default:c+=l}}return"^"+c+"$"})(t),s=ac.compile(r);return R.newValue({booleanValue:s.matches(e)})}catch(r){return $t(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),R.mr()}}},Uh=class extends Tr{Or(e,t){try{let r=ac.compile(t);return R.newValue({booleanValue:r.test(e)})}catch{return $t(`Invalid regex pattern found in regex_contains: ${t}, returning error`),R.mr()}}},Hh=class extends Tr{Or(e,t){try{return R.newValue({booleanValue:ac.compile(t).matches(e)})}catch{return $t(`Invalid regex pattern found in regex_match: ${t}, returning error`),R.mr()}}},qh=class extends Tr{Or(e,t){return R.newValue({booleanValue:e.includes(t)})}},jh=class extends Tr{Or(e,t){return R.newValue({booleanValue:e.startsWith(t)})}},Kh=class extends Tr{Or(e,t){return R.newValue({booleanValue:e.endsWith(t)})}},Jh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,29079);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return R.newValue({stringValue:r.value?.stringValue?.toLowerCase()});case"NULL":return R.gr();default:return R.mr()}}},zh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,60487);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return R.newValue({stringValue:r.value?.stringValue?.toUpperCase()});case"NULL":return R.gr();default:return R.mr()}}},Wh=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,28544);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return R.newValue({stringValue:r.value?.stringValue?.trim()});case"NULL":return R.gr();default:return R.mr()}}},Qh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((o=>ae(o).evaluate(e,t))),s="",i=!1;for(let o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return R.mr()}return i?R.gr():R.newValue({stringValue:s})}},$h=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,4483);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return R.pr();case"MAP":break;default:return R.mr()}let s=ae(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return R.mr();let i=r.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?R.pr():R.newValue(i)}},bo=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return R.mr()}if(r)return R.gr();let o=hB(s.value),c=hB(i.value);if(o===void 0||c===void 0||o.values?.length!==c.values?.length)return R.mr();let u=this.Mr(o,c);return u===void 0||isNaN(u)?R.mr():R.newValue({doubleValue:u})}},Yh=class extends bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return;let i=0,o=0,c=0;for(let l=0;l<r.length;l++){if(!mr(r[l])||!mr(s[l]))return;let h=Bt(r[l]),f=Bt(s[l]);i+=h*f,o+=h*h,c+=f*f}let u=Math.sqrt(o)*Math.sqrt(c);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}},Xh=class extends bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!mr(r[o])||!mr(s[o]))return;i+=Bt(r[o])*Bt(s[o])}return i}},Zh=class extends bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!mr(r[o])||!mr(s[o]))return;let c=Bt(r[o]),u=Bt(s[o]);i+=Math.pow(c-u,2)}return Math.sqrt(i)}},ed=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,39044);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{let s=hB(r.value);return R.newValue({integerValue:s?.values?.length??0})}case"NULL":return R.gr();default:return R.mr()}}},So=BigInt(-62135596800),Ro=BigInt(253402300799),Jc=BigInt(1e3),gr=BigInt(1e6),HT=So*Jc,qT=Ro*Jc+BigInt(999),jT=So*gr,KT=Ro*gr+BigInt(999999);function cf(n){return n>=jT&&n<=KT}function RE(n){return n>=So&&n<=Ro}function Po(n,e){let t=BigInt(n);return!(t<So||t>Ro)&&!(e<0||e>=1e9)&&(t!==So||e===0)&&!(t===Ro&&e>999999999)}function PE(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function uf(n){return BigInt(n.seconds)*gr+BigInt(Math.trunc(n.nanoseconds/1e3))}var No=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return R.gr();default:return R.mr()}}},td=class extends No{toTimestamp(e){if(!cf(e))return R.mr();let t=Number(e/gr),r=Number(e%gr*BigInt(1e3)),s=PE(t,r);return t=s.seconds,r=s.nanos,Po(t,r)?R.newValue({timestampValue:{seconds:t,nanos:r}}):R.mr()}},nd=class extends No{toTimestamp(e){if(!(function(o){return o>=HT&&o<=qT})(e))return R.mr();let t=Number(e/Jc),r=Number(e%Jc*BigInt(1e6)),s=PE(t,r);return t=s.seconds,r=s.nanos,Po(t,r)?R.newValue({timestampValue:{seconds:t,nanos:r}}):R.mr()}},rd=class extends No{toTimestamp(e){if(!RE(e))return R.mr();let t=Number(e);return R.newValue({timestampValue:{seconds:t,nanos:0}})}},Oo=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);let r=ae(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return R.gr();default:return R.mr()}let s=ef(r.value.timestampValue);return Po(s.seconds,s.nanoseconds)?this.Nr(s):R.mr()}},sd=class extends Oo{Nr(e){let t=uf(e);return cf(t)?R.newValue({integerValue:`${t.toString()}`}):R.mr()}},id=class extends Oo{Nr(e){let t=uf(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?R.newValue({integerValue:r.toString()}):R.newValue({integerValue:(r-BigInt(1)).toString()})}},od=class extends Oo{Nr(e){let t=BigInt(e.seconds);return RE(t)?R.newValue({integerValue:t.toString()}):R.mr()}},zc=class{constructor(e){this.expr=e}evaluate(e,t){ne(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1,s=ae(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return R.mr()}let i=ae(this.expr.params[1]).evaluate(e,t),o;switch(i.type){case"STRING":if(o=(function(se){switch(se){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return R.mr();break;case"NULL":r=!0;break;default:return R.mr()}let c=ae(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return R.mr()}if(r)return R.gr();let u=BigInt(c.value.integerValue),l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return R.mr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Lr(o)))return R.mr()}catch(H){return $t(`Error during timestamp arithmetic: ${H}`),R.mr()}let h=ef(s.value.timestampValue);if(!Po(h.seconds,h.nanoseconds))return R.mr();let f=uf(h),g=this.Br(f,l);if(!cf(g))return R.mr();let v=Number(g/gr),I=g%gr,S=Number((I<0?I+gr:I)*BigInt(1e3)),U=I<0?v-1:v;return Po(U,S)?R.newValue({timestampValue:{seconds:U,nanos:S}}):R.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}},ad=class extends zc{Br(e,t){return e+t}},cd=class extends zc{Br(e,t){return e-t}};/**
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
 */function ko(n){if((n=SE(n))instanceof wr)return`fld(${n.fieldName})`;if(n instanceof Xs)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof $e?`ref(${t.path})`:t instanceof Gt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof x)return`fn(${n.name},[${n.params.map(ko).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.cr.map(ko).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function JT(n){if(n instanceof Uc)return`${n._name}(${Bc(n.fields)})`;if(n instanceof Hc){let e=`${n._name}(${Bc(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${Bc(n.groups)})`),e}if(n instanceof qc)return`${n._name}(${Bc(n.groups)})`;if(n instanceof Zs)return`${n._name}(${n.hr})`;if(n instanceof ei)return`${n._name}(${n.collectionId})`;if(n instanceof Ao)return`${n._name}()`;if(n instanceof vo)return`${n._name}(${n.Tr.sort()})`;if(n instanceof ti)return`${n._name}(${ko(n.condition)})`;if(n instanceof Qn)return`${n._name}(${n.limit})`;if(n instanceof sn)return`${n._name}(${(function(t){return t.map((r=>`${ko(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function Bc(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${ko(t)}`)).join(",")}`}function Vn(n){return n.stages.map((e=>JT(e))).join("|")}function NE(n,e){return Vn(n)===Vn(e)}function et(n){return n instanceof lt}function pm(n){return et(n)?Vn(n):ao(n)}function OE(n){return et(n)?Vn(n):(function(t){return`${$m(wn(t))}|lt:${t.limitType}`})(n)}function fu(n,e){return n instanceof lt&&e instanceof lt?NE(n,e):!(n instanceof lt&&!(e instanceof lt)||!(n instanceof lt)&&e instanceof lt)&&$I(n,e)}function kE(n){return Wr(n)?Vn(n):$m(n)}function FE(n,e){return n instanceof lt&&e instanceof lt?NE(n,e):!(n instanceof lt&&!(e instanceof lt)||!(n instanceof lt)&&e instanceof lt)&&Ym(n,e)}function zT(n,e){let t=(function(s){let i=!1,o=[];for(let c of s)if(c instanceof sn)if(i=!0,c.orderings.some((u=>u.expr instanceof wr&&u.expr.fieldName===mn)))o.push(c);else{let u=c.orderings.map((l=>l));u.push(pc(mn).ascending()),o.push(new sn(u,{}))}else c instanceof Qn&&(i||(o.push(new sn([pc(mn).ascending()],{})),i=!0)),o.push(c);return i||o.push(new sn([pc(mn).ascending()],{})),o})(n.stages);if(n.userDataReader){let r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new lt(n.userDataReader.serializer,t,e)}/**
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
 */var ud=class{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){let i=this.mutations[s];i.key.isEqual(e.key)&&UI(i,e,r[s])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=oo(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=oo(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=rE();return this.mutations.forEach((s=>{let i=e.get(s.key),o=i.overlayedDocument,c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;let u=qm(o,c);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(Be.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),_e())}isEqual(e){return this.batchId===e.batchId&&Gs(this.mutations,e.mutations,((t,r)=>$C(t,r)))&&Gs(this.baseMutations,e.baseMutations,((t,r)=>$C(t,r)))}};/**
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
 */var xE="";function WT(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=gm(e)),e=QT(n.get(t),e);return gm(e)}function QT(n,e){let t=e,r=n.length;for(let s=0;s<r;s++){let i=n.charAt(s);switch(i){case"\0":t+="";break;case xE:t+="";break;default:t+=i}}return t}function gm(n){return n+xE+""}/**
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
 */var $T="remoteDocuments",LE="owner";var VE="mutationQueues";var ME="mutations";/**
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
 */var GE="documentMutations",YT="remoteDocumentsV14";var UE="remoteDocumentGlobal";var HE="targets";var qE="targetDocuments";var jE="targetGlobal",KE="collectionParents";var JE="clientMetadata";var zE="bundles";var WE="namedQueries";var XT="indexConfiguration";var ZT="indexState";var eA="indexEntries";var QE="documentOverlays";var tA="globals";var nA=[VE,ME,GE,$T,HE,LE,jE,qE,JE,UE,KE,zE,WE],OS=[...nA,QE],rA=[VE,ME,GE,YT,HE,LE,jE,qE,JE,UE,KE,zE,WE,QE],sA=rA,iA=[...sA,XT,ZT,eA];var kS=[...iA,tA];/**
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
 */var ld=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */var ri=class n{constructor(e,t,r,s,i=Be.min(),o=Be.min(),c=Ye.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new n(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};/**
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
 */var Bd=class{constructor(e){this.$r=e}};function oA(n){let e=gT({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Eo(e,e.limit,"L"):e}/**
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
 */var Wc=class{constructor(){}ei(e,t){this.ti(e,t),t.ni()}ti(e,t){if("nullValue"in e)this.ri(t,5);else if("booleanValue"in e)this.ri(t,10),t.ii(e.booleanValue?1:0);else if("integerValue"in e)this.ri(t,15),t.ii(Oe(e.integerValue));else if("doubleValue"in e){let r=Oe(e.doubleValue);isNaN(r)?this.ri(t,13):(this.ri(t,15),Hs(r)?t.ii(0):t.ii(r))}else if("timestampValue"in e){let r=e.timestampValue;this.ri(t,20),typeof r=="string"&&(r=Un(r)),t.si(`${r.seconds||""}`),t.ii(r.nanos||0)}else if("stringValue"in e)this._i(e.stringValue,t),this.oi(t);else if("bytesValue"in e)this.ri(t,30),t.ai(Hn(e.bytesValue)),this.oi(t);else if("referenceValue"in e)this.ui(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.ri(t,45),t.ii(r.latitude||0),t.ii(r.longitude||0)}else"mapValue"in e?Mm(e)?this.ri(t,Number.MAX_SAFE_INTEGER):go(e)?this.ci(e.mapValue,t):(this.li(e.mapValue,t),this.oi(t)):"arrayValue"in e?(this.Ei(e.arrayValue,t),this.oi(t)):X(19022,{hi:e})}_i(e,t){this.ri(t,25),this.Ti(e,t)}Ti(e,t){t.si(e)}li(e,t){let r=e.fields||{};this.ri(t,55);for(let s of Object.keys(r))this._i(s,t),this.ti(r[s],t)}ci(e,t){let r=e.fields||{};this.ri(t,53);let s=ts,i=r[s].arrayValue?.values?.length||0;this.ri(t,15),t.ii(Oe(i)),this._i(s,t),this.ti(r[s],t)}Ei(e,t){let r=e.values||[];this.ri(t,50);for(let s of r)this.ti(s,t)}ui(e,t){this.ri(t,37),Z.fromName(e).path.forEach((r=>{this.ri(t,60),this.Ti(r,t)}))}ri(e,t){e.ii(t)}oi(e){e.ii(2)}};Wc.Pi=new Wc;/**
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
 */var hd=class{constructor(){this.Zi=new dd}addToCollectionParentIndex(e,t){return this.Zi.add(t),G.resolve()}getCollectionParents(e,t){return G.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return G.resolve()}deleteFieldIndex(e,t){return G.resolve()}deleteAllFieldIndexes(e){return G.resolve()}createTargetIndexes(e,t){return G.resolve()}getDocumentsMatchingTarget(e,t){return G.resolve(null)}getIndexType(e,t){return G.resolve(0)}getFieldIndexes(e,t){return G.resolve([])}getNextCollectionGroupToUpdate(e){return G.resolve(null)}getMinOffset(e,t){return G.resolve(as.min())}getMinOffsetFromCollectionGroup(e,t){return G.resolve(as.min())}updateCollectionGroup(e,t,r){return G.resolve()}updateIndexEntries(e,t){return G.resolve()}},dd=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new tt(ve.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new tt(ve.comparator)).toArray()}};/**
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
 */var FS=new Uint8Array(0);/**
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
 */var Bs=class n{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new n(0)}static bs(){return new n(-1)}};/**
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
function $E(n,e){let t=e;for(let r of n.stages)t=cA({serializer:n.serializer,serverTimestampBehavior:n.listenOptions?.serverTimestampBehavior},r,t);return t}function pu(n,e){return $E(n,[e]).length>0}function aA(n,e){return et(n)?pu(n,e):au(n,e)}function cA(n,e,t){if(e instanceof Zs)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof ti)return(function(s,i,o){return o.filter((c=>{let u=Bo(ae(i.condition).evaluate(s,c));return u!==void 0&&Yt(u,vt)}))})(n,e,t);if(e instanceof ei)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Ao)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof vo)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&i.Pr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Qn)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof sn)return(function(s,i,o){let c=i.orderings.map((u=>({Ms:ae(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(let{Ms:h,direction:f}of c){let g=Bo(h.evaluate(s,u)),v=Bo(h.evaluate(s,l)),I=bt(g??qs,v??qs);if(I!==0)return f==="ascending"?I:-I}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function fd(n){let e=(function(r){for(let s=r.stages.length-1;s>=0;s--){let i=r.stages[s];if(i instanceof sn)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(let s of e){let i=Bo(ae(s.expr).evaluate({serializer:n.serializer},t)),o=Bo(ae(s.expr).evaluate({serializer:n.serializer},r)),c=bt(i||qs,o||qs);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function oB(n){for(let e=n.stages.length-1;e>=0;e--){let t=n.stages[e];if(t instanceof Qn)return{limit:t.limit}}}/**
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
 */var pd=class{constructor(){this.changes=new Jn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ut.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?G.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};/**
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
 */var gd=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};/**
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
 */var Cd=class{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&oo(r.mutation,s,rn.empty(),He.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,_e()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=_e()){let s=fr();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=Os();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){let r=fr();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,_e())))}populateOverlays(e,t,r){let s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,r,s){let i=Vt(),o=co(),c=(function(){return co()})();return t.forEach(((u,l)=>{let h=r.get(l.key);s.has(l.key)&&(h===void 0||h.mutation instanceof qn)?i=i.insert(l.key,l):h!==void 0?(o.set(l.key,h.mutation.getFieldMask()),oo(h.mutation,l,h.mutation.getFieldMask(),He.now())):o.set(l.key,rn.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,h)=>o.set(l,h))),t.forEach(((l,h)=>c.set(l,new gd(h,o.get(l)??null)))),c)))}recalculateAndSaveOverlays(e,t){let r=co(),s=new qe(((o,c)=>o-c)),i=_e();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(let c of o)c.keys().forEach((u=>{let l=t.get(u);if(l===null)return;let h=r.get(u)||rn.empty();h=c.applyToLocalView(l,h),r.set(u,h);let f=(s.get(c.batchId)||_e()).add(u);s=s.insert(c.batchId,f)}))})).next((()=>{let o=[],c=s.getReverseIterator();for(;c.hasNext();){let u=c.getNext(),l=u.key,h=u.value,f=rE();h.forEach((g=>{if(!i.has(g)){let v=qm(t.get(g),r.get(g));v!==null&&f.set(g,v),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,f))}return G.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return et(t)?this.getDocumentsMatchingPipeline(e,t,r,s):WI(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):iu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{let o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):G.resolve(fr()),c=mo,u=i;return o.next((l=>G.forEach(l,((h,f)=>(c<f.largestBatchId&&(c=f.largestBatchId),i.get(h)?G.resolve():this.remoteDocumentCache.getEntry(e,h).next((g=>{u=u.insert(h,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,_e()))).next((h=>({batchId:c,changes:eT(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new Z(t)).next((r=>{let s=Os();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){let i=t.collectionGroup,o=Os();return this.indexManager.getCollectionParents(e,i).next((c=>G.forEach(c,(u=>{let l=(function(f,g){return new Kn(g,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,r,s).next((h=>{h.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>au(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(pr(t)==="collection_group"){let i=af(t),o=Os();return this.indexManager.getCollectionParents(e,i).next((c=>G.forEach(c,(u=>{let l=(function(f,g){let v=f.stages.map((I=>I instanceof ei?new Zs(g.canonicalString(),{}):I));return new lt(f.serializer,v)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,r,s).next((h=>{h.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,pr(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=_e();for(let u of eh(t))c=c.add(Z.fromPath(u));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new q("invalid-argument",`Invalid pipeline source to execute offline: ${Vn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>pu(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{let c=o.getKey();t.get(c)===null&&(t=t.insert(c,Ut.newInvalidDocument(c)))}));let s=Os();return t.forEach(((i,o)=>{let c=e.get(i);c!==void 0&&oo(c.mutation,o,rn.empty(),He.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch(pr(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,ve.fromString(du(t)),r);case"collection_group":throw new q("invalid-argument",`Unexpected collection group pipeline: ${Vn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,eh(t).map((s=>Z.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new q("invalid-argument",`Failed to get overlays for pipeline: ${Vn(t)}`)}}};/**
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
 */var md=class{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return G.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Fn(s.createTime)}})(t)),G.resolve()}getNamedQuery(e,t){return G.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:oA(s.bundledQuery),readTime:Fn(s.readTime)}})(t)),G.resolve()}};/**
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
 */var Ed=class{constructor(){this.overlays=new qe(Z.comparator),this.Gs=new Map}getOverlay(e,t){return G.resolve(this.overlays.get(t))}getOverlays(e,t){let r=fr();return G.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){let r=fr();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),G.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Zr(e,t,i)})),G.resolve()}removeOverlaysForBatchId(e,t,r){let s=this.Gs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(r)),G.resolve()}getOverlaysForCollection(e,t,r){let s=fr(),i=t.length+1,o=new Z(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){let u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return G.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new qe(((l,h)=>l-h)),o=this.overlays.getIterator();for(;o.hasNext();){let l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let h=i.get(l.largestBatchId);h===null&&(h=fr(),i=i.insert(l.largestBatchId,h)),h.set(l.getKey(),l)}}let c=fr(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,h)=>c.set(l,h))),!(c.size()>=s)););return G.resolve(c)}Zr(e,t,r){let s=this.overlays.get(r.key);if(s!==null){let o=this.Gs.get(s.largestBatchId).delete(r.key);this.Gs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new ld(t,r));let i=this.Gs.get(t);i===void 0&&(i=_e(),this.Gs.set(t,i)),this.Gs.set(t,i.add(r.key))}};/**
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
 */var _d=class{constructor(){this.sessionToken=Ye.EMPTY_BYTE_STRING}getSessionToken(e){return G.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,G.resolve()}};/**
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
 */var Fo=class{constructor(){this.zs=new tt(We.js),this.Hs=new tt(We.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){let r=new We(e,t);this.zs=this.zs.add(r),this.Hs=this.Hs.add(r)}Ys(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Zs(new We(e,t))}Xs(e,t){e.forEach((r=>this.removeReference(r,t)))}e_(e){let t=new Z(new ve([])),r=new We(t,e),s=new We(t,e+1),i=[];return this.Hs.forEachInRange([r,s],(o=>{this.Zs(o),i.push(o.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){let t=new Z(new ve([])),r=new We(t,e),s=new We(t,e+1),i=_e();return this.Hs.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){let t=new We(e,0),r=this.zs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},We=class{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return Z.comparator(e.key,t.key)||me(e.r_,t.r_)}static Js(e,t){return me(e.r_,t.r_)||Z.comparator(e.key,t.key)}};/**
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
 */var wd=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new tt(We.js)}checkEmpty(e){return G.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){let i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let o=new ud(i,t,r,s);this.mutationQueue.push(o);for(let c of s)this.i_=this.i_.add(new We(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return G.resolve(o)}lookupMutationBatch(e,t){return G.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,s=this.__(r),i=s<0?0:s;return G.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return G.resolve(this.mutationQueue.length===0?kI:this.Gr-1)}getAllMutationBatches(e){return G.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new We(t,0),s=new We(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([r,s],(o=>{let c=this.s_(o.r_);i.push(c)})),G.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new tt(me);return t.forEach((s=>{let i=new We(s,0),o=new We(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,o],(c=>{r=r.add(c.r_)}))})),G.resolve(this.o_(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,s=r.length+1,i=r;Z.isDocumentKey(i)||(i=i.child(""));let o=new We(new Z(i),0),c=new tt(me);return this.i_.forEachWhile((u=>{let l=u.key.path;return!!r.isPrefixOf(l)&&(l.length===s&&(c=c.add(u.r_)),!0)}),o),G.resolve(this.o_(c))}o_(e){let t=[];return e.forEach((r=>{let s=this.s_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){ne(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.i_;return G.forEach(t.mutations,(s=>{let i=new We(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=r}))}Hr(e){}containsKey(e,t){let r=new We(t,0),s=this.i_.firstAfterOrEqual(r);return G.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,G.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){let t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};/**
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
 */var yd=class{constructor(e){this.u_=e,this.docs=(function(){return new qe(Z.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.u_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return G.resolve(r?r.document.mutableCopy():Ut.newInvalidDocument(t))}getEntries(e,t){let r=Vt();return t.forEach((s=>{let i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ut.newInvalidDocument(s))})),G.resolve(r)}getAllEntries(e){let t=Vt();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),G.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;et(t)?(i=ve.fromString(du(t)),o=h=>pu(t,h)):(i=t.path,o=h=>au(t,h));let c=Vt(),u=new Z(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){let{key:h,value:{document:f}}=l.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||JI(KI(f),r)<=0||(s.has(f.key)||o(f))&&(c=c.insert(f.key,f.mutableCopy()))}return G.resolve(c)}getAllFromCollectionGroup(e,t,r,s){X(9500)}c_(e,t){return G.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Dd(this)}getSize(e){return G.resolve(this.size)}},Dd=class extends pd{constructor(e){super(),this.$s=e}applyChanges(e){let t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(r)})),G.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}};/**
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
 */var Id=class{constructor(e){this.persistence=e,this.l_=new Jn((t=>kE(t)),FE),this.lastRemoteSnapshotVersion=Be.min(),this.highestTargetId=0,this.E_=0,this.h_=new Fo,this.targetCount=0,this.T_=Bs.ws()}forEachTarget(e,t){return this.l_.forEach(((r,s)=>t(s))),G.resolve()}getLastRemoteSnapshotVersion(e){return G.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return G.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),G.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.E_&&(this.E_=t),G.resolve()}Ds(e){this.l_.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.T_=new Bs(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,G.resolve()}updateTargetData(e,t){return this.Ds(t),G.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,G.resolve()}removeTargets(e,t,r){let s=0,i=[];return this.l_.forEach(((o,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.l_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),G.waitFor(i).next((()=>s))}getTargetCount(e){return G.resolve(this.targetCount)}getTargetData(e,t){let r=this.l_.get(t)||null;return G.resolve(r)}addMatchingKeys(e,t,r){return this.h_.Ys(t,r),G.resolve()}removeMatchingKeys(e,t,r){this.h_.Xs(t,r);let s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),G.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),G.resolve()}getMatchingKeysForTargetId(e,t){let r=this.h_.n_(t);return G.resolve(r)}containsKey(e,t){return G.resolve(this.h_.containsKey(t))}};/**
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
 */var Qc=class{constructor(e,t){this.P_={},this.overlays={},this.I_=new Ys(0),this.R_=!1,this.R_=!0,this.A_=new _d,this.referenceDelegate=e(this),this.V_=new Id(this),this.indexManager=new hd,this.remoteDocumentCache=(function(s){return new yd(s)})((r=>this.referenceDelegate.d_(r))),this.serializer=new Bd(t),this.f_=new md(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Ed,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.P_[e.toKey()];return r||(r=new wd(t,this.referenceDelegate),this.P_[e.toKey()]=r),r}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,r){J("MemoryPersistence","Starting transaction:",e);let s=new Td(this.I_.next());return this.referenceDelegate.m_(),r(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return G.or(Object.values(this.P_).map((r=>()=>r.containsKey(e,t))))}},Td=class extends GB{constructor(e){super(),this.currentSequenceNumber=e}},Ad=class n{constructor(e){this.persistence=e,this.y_=new Fo,this.w_=null}static b_(e){return new n(e)}get S_(){if(this.w_)return this.w_;throw X(60996)}addReference(e,t,r){return this.y_.addReference(r,t),this.S_.delete(r.toString()),G.resolve()}removeReference(e,t,r){return this.y_.removeReference(r,t),this.S_.add(r.toString()),G.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),G.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return G.forEach(this.S_,(r=>{let s=Z.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,Be.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return G.or([()=>G.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}},$c=class n{constructor(e,t){this.persistence=e,this.D_=new Jn((r=>WT(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=RT(this,t)}static b_(e,t){return new n(e,t)}m_(){}p_(e){return G.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){let t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Cs(e){let t=0;return this.sr(e,(r=>{t++})).next((()=>t))}sr(e,t){return G.forEach(this.D_,((r,s)=>this.Os(e,r,s).next((i=>i?G.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0,s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(o=>this.Os(e,o,t).next((c=>{c||(r++,i.removeEntry(o,Be.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),G.resolve()}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),G.resolve()}removeReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),G.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),G.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=hc(e.data.value)),t}Os(e,t,r){return G.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let s=this.D_.get(t);return G.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}};/**
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
 */var vd=class n{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Vo=r,this.fo=s}static mo(e,t){let r=_e(),s=_e();for(let i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new n(e,t.fromCache,r,s)}};/**
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
 */function uA(n,e){return Z.comparator(n.key,e.key)}/**
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
 */var bd=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};/**
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
 */var Sd=class{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return Jp()?8:ST(st())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,r,s){let i={result:null};return this.vo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Do(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;let o=new bd;return this.xo(e,t,o).next((c=>{if(i.result=c,this.yo)return this.Co(e,t,o,c.size)}))})).next((()=>i.result))}Co(e,t,r,s){return et(t)?G.resolve():r.documentReadCount<this.wo?(Ps()<=pe.DEBUG&&J("QueryEngine","SDK will not create cache indexes for query:",ao(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),G.resolve()):(Ps()<=pe.DEBUG&&J("QueryEngine","Query:",ao(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.bo*s?(Ps()<=pe.DEBUG&&J("QueryEngine","The SDK decides to create cache indexes for query:",ao(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,wn(t))):G.resolve())}vo(e,t){if(et(t))return G.resolve(null);let r=t;if(nm(r))return G.resolve(null);let s=wn(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=Eo(r,null,"F"),s=wn(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{let c=_e(...o);return this.So.getDocuments(e,c).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{let h=this.Fo(r,u);return this.Oo(r,h,c,l.readTime)?this.vo(e,Eo(r,null,"F")):this.Mo(e,h,r,l)}))))})))))}Do(e,t,r,s){return(et(t)?(function(o){for(let c of o.stages){if(c instanceof Qn||c instanceof jc)return!1;if(c instanceof ti){if(c.condition instanceof Vc&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof wr&&c.condition._expr.params[0].fieldName===mn)continue;return!1}}return!0})(t):nm(t))||s.isEqual(Be.min())?G.resolve(null):this.So.getDocuments(e,r).next((i=>{let o=this.Fo(t,i);return this.Oo(t,o,r,s)?G.resolve(null):(Ps()<=pe.DEBUG&&J("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),pm(t)),this.Mo(e,o,t,jI(s,mo)).next((c=>c)))}))}Fo(e,t){let r,s;return et(e)?(r=new tt(uA),s=i=>pu(e,i)):(r=new tt(Zd(e)),s=i=>au(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Oo(e,t,r,s){if(et(e))return(function(c){return c.stages.some((u=>u instanceof Qn||u instanceof jc))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;let i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,r){return Ps()<=pe.DEBUG&&J("QueryEngine","Using full collection scan to execute query:",pm(t)),this.So.getDocumentsMatchingQuery(e,t,as.min(),r)}Mo(e,t,r,s){return this.So.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}};/**
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
 */var lf="LocalStore",lA=3e8,Rd=class{constructor(e,t,r,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new qe(me),this.Bo=new Jn((i=>kE(i)),FE),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(r)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Cd(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}};function BA(n,e,t,r){return new Rd(n,e,t,r)}async function YE(n,e){let t=Ee(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{let o=[],c=[],u=_e();for(let l of s){o.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}for(let l of i){c.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}return t.localDocuments.getDocuments(r,u).next((l=>({$o:l,removedBatchIds:o,addedBatchIds:c})))}))}))}function XE(n){let e=Ee(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function hA(n,e){let t=Ee(n),r=e.snapshotVersion,s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{let o=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;let c=[];e.targetChanges.forEach(((h,f)=>{let g=s.get(f);if(!g)return;c.push(t.V_.removeMatchingKeys(i,h.removedDocuments,f).next((()=>t.V_.addMatchingKeys(i,h.addedDocuments,f))));let v=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?v=v.withResumeToken(Ye.EMPTY_BYTE_STRING,Be.min()).withLastLimboFreeSnapshotVersion(Be.min()):h.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(h.resumeToken,r)),s=s.insert(f,v),(function(S,U,H){return S.resumeToken.approximateByteSize()===0||U.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=lA?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0})(g,v,h)&&c.push(t.V_.updateTargetData(i,v))}));let u=Vt(),l=_e();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),c.push(dA(i,o,e.documentUpdates).next((h=>{u=h.Ko,l=h.Qo}))),!r.isEqual(Be.min())){let h=t.V_.getLastRemoteSnapshotVersion(i).next((f=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(h)}return G.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function dA(n,e,t){let r=_e(),s=_e();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=Vt();return t.forEach(((c,u)=>{let l=i.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(Be.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):J(lf,"Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)})),{Ko:o,Qo:s}}))}function fA(n,e){let t=Ee(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.V_.getTargetData(r,e).next((i=>i?(s=i,G.resolve(s)):t.V_.allocateTargetId(r).next((o=>(s=new ri(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.V_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{let s=t.Lo.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(r.targetId,r),t.Bo.set(e,r.targetId)),r}))}async function Pd(n,e,t){let r=Ee(n),s=r.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!ai(o))throw o;J(lf,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Lo=r.Lo.remove(e),r.Bo.delete(s.target)}function Cm(n,e,t){let r=Ee(n),s=Be.min(),i=_e();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,h){let f=Ee(u),g=f.Bo.get(h);return g!==void 0?G.resolve(f.Lo.get(g)):f.V_.getTargetData(l,h)})(r,o,et(e)?e:wn(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.V_.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>r.No.getDocumentsMatchingQuery(o,e,t?s:Be.min(),t?i:_e()))).next((c=>(pA(r,c),{documents:c,Wo:i})))))}function pA(n,e){e.forEach(((t,r)=>{let s=r.key.getCollectionGroup(),i=n.Uo.get(s)||Be.min();r.readTime.compareTo(i)>0&&n.Uo.set(s,r.readTime)}))}/**
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
 */var Nd=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(Gn(t),this.Xo=!1):J("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}};/**
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
 */var Yn="RemoteStore",Od=class{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new Bs(1e3),this.ca=new Bs(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((o=>{r.enqueueAndForget((async()=>{Qo(this)&&(J(Yn,"Restarting streams for network reachability change."),await(async function(u){let l=Ee(u);l.la.add(4),await Wo(l),l.Ta.set("Unknown"),l.la.delete(4),await gu(l)})(this))}))})),this.Ta=new Nd(r,s)}};async function gu(n){if(Qo(n))for(let e of n.Ea)await e(!0)}async function Wo(n){for(let e of n.Ea)await e(!1)}function kd(n,e){return n.oa.get(e)||void 0}function ZE(n,e){let t=Ee(n),r=kd(t,e.targetId);if(r!==void 0&&t._a.has(r))return;let s=(function(c,u){let l=kd(c,u);l!==void 0&&c.aa.delete(l);let h=(function(g,v){return v%2!=0?g.ca.next():g.ua.next()})(c,u);return c.oa.set(u,h),c.aa.set(h,u),h})(t,e.targetId);J(Yn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);let i=new ri(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),ff(t)?df(t):ci(t).Yt()&&hf(t,i)}function Bf(n,e){let t=Ee(n),r=ci(t),s=kd(t,e);J(Yn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),r.Yt()&&e_(t,s),t._a.size===0&&(r.Yt()?r.en():Qo(t)&&t.Ta.set("Unknown"))}function hf(n,e){if(n.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Be.min())>0){let t=n.aa.get(e.targetId);if(t===void 0)return void J(Yn,"SDK target ID not found for remote ID: "+e.targetId);let r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}ci(n).Pn(e)}function e_(n,e){n.Pa.J(e),ci(n).In(e)}function df(n){n.Pa=new TB({getRemoteKeysForTarget:e=>{let t=n.aa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):_e()},ye:e=>n._a.get(e)||null,Ve:()=>n.datastore.serializer.databaseId}),ci(n).start(),n.Ta.ea()}function ff(n){return Qo(n)&&!ci(n).Jt()&&n._a.size>0}function Qo(n){return Ee(n).la.size===0}function t_(n){n.Pa=void 0}async function gA(n){n.Ta.set("Online")}async function CA(n){n._a.forEach(((e,t)=>{hf(n,e)}))}async function mA(n,e){t_(n),ff(n)?(n.Ta.ra(e),df(n)):n.Ta.set("Unknown")}async function EA(n,e,t){if(n.Ta.set("Online"),e instanceof Tc&&e.state===2&&e.cause)try{await(async function(s,i){let o=i.cause;for(let c of i.targetIds){if(s._a.has(c)){let u=s.aa.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.oa.delete(u),s.aa.delete(c)),s._a.delete(c)}s.Pa.removeTarget(c)}})(n,e)}catch(r){J(Yn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await mm(n,r)}else if(e instanceof Vs?n.Pa._e(e):e instanceof Ic?n.Pa.he(e):n.Pa.ue(e),!t.isEqual(Be.min()))try{let r=await XE(n.localStore);t.compareTo(r)>=0&&await(function(i,o){let c=i.Pa.fe(o);c.targetChanges.forEach(((l,h)=>{if(l.resumeToken.approximateByteSize()>0){let f=i._a.get(h);f&&i._a.set(h,f.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,h)=>{let f=i._a.get(l);if(!f)return;i._a.set(l,f.withResumeToken(Ye.EMPTY_BYTE_STRING,f.snapshotVersion)),e_(i,l);let g=new ri(f.target,l,h,f.sequenceNumber);hf(i,g)}));let u=(function(h,f){let g=new Map;f.targetChanges.forEach(((I,S)=>{let U=h.aa.get(S);U!==void 0&&g.set(U,I)}));let v=new qe(me);return f.targetMismatches.forEach(((I,S)=>{let U=h.aa.get(I);U!==void 0&&(v=v.insert(U,S))})),new _o(f.snapshotVersion,g,v,f.documentUpdates,f.augmentedDocumentUpdates,f.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){J(Yn,"Failed to raise snapshot:",r),await mm(n,r)}}async function mm(n,e,t){if(!ai(e))throw e;n.la.add(1),await Wo(n),n.Ta.set("Offline"),t||(t=()=>XE(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{J(Yn,"Retrying IndexedDB access"),await t(),n.la.delete(1),await gu(n)}))}async function Em(n,e){let t=Ee(n);t.asyncQueue.verifyOperationInProgress(),J(Yn,"RemoteStore received new credentials");let r=Qo(t);t.la.add(3),await Wo(t),r&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await gu(t)}async function _A(n,e){let t=Ee(n);e?(t.la.delete(2),await gu(t)):e||(t.la.add(2),await Wo(t),t.Ta.set("Unknown"))}function ci(n){return n.Ia||(n.Ia=(function(t,r,s){let i=Ee(t);return i.pn(),new LB(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:gA.bind(null,n),Et:CA.bind(null,n),Tt:mA.bind(null,n),Tn:EA.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ia.Xt(),ff(n)?df(n):n.Ta.set("Unknown")):(await n.Ia.stop(),t_(n))}))),n.Ia}/**
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
 */var xo=class{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):Gn("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}};/**
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
 */var Fd=class n{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new on,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){let o=Date.now()+r,c=new n(e,t,o,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function n_(n,e){if(Gn("AsyncQueue",`${e}: ${n}`),ai(n))return new q(O.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */var Yc=class{constructor(){this.activeTargetIds=rT()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var xd=class{constructor(){this.fu=new Yc,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,r){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new Yc,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};/**
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
 */function aB(){return typeof document<"u"?document:null}/**
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
 */var Lo=class n{static emptySet(e){return new n(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||Z.comparator(t.key,r.key):(t,r)=>Z.comparator(t.key,r.key),this.keyedMap=Os(),this.sortedSet=new qe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){let e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
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
 */var Xc=class{constructor(){this.pu=new qe(Z.comparator)}track(e){let t=e.doc.key,r=this.pu.get(t);r?e.type!==0&&r.type===3?this.pu=this.pu.insert(t,e):e.type===3&&r.type!==1?this.pu=this.pu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.pu=this.pu.remove(t):e.type===1&&r.type===2?this.pu=this.pu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):X(63341,{we:e,gu:r}):this.pu=this.pu.insert(t,e)}yu(){let e=[];return this.pu.inorderTraversal(((t,r)=>{e.push(r)})),e}},si=class n{constructor(e,t,r,s,i,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,s,i){let o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new n(e,t,Lo.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&fu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}};/**
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
 */var Ld=class{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}},Vd=class{constructor(){this.queries=_m(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,r){let s=Ee(t),i=s.queries;s.queries=_m(),i.forEach(((o,c)=>{for(let u of c.bu)u.onError(r)}))})(this,new q(O.ABORTED,"Firestore shutting down"))}};function _m(){return new Jn((n=>OE(n)),fu)}async function pf(n,e){let t=Ee(n),r=3,s=e.query,i=t.queries.get(s);i?!i.Su()&&e.vu()&&(r=2):(i=new Ld,r=e.vu()?0:1);try{switch(r){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){let c=n_(o,`Initialization of query '${et(e.query)?Vn(e.query):ao(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&Cf(t)}async function gf(n,e){let t=Ee(n),r=e.query,s=3,i=t.queries.get(r);if(i){let o=i.bu.indexOf(e);o>=0&&(i.bu.splice(o,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function wA(n,e){let t=Ee(n),r=!1;for(let s of e){let i=s.query,o=t.queries.get(i);if(o){for(let c of o.bu)c.Cu(s)&&(r=!0);o.wu=s}}r&&Cf(t)}function yA(n,e,t){let r=Ee(n),s=r.queries.get(e);if(s)for(let i of s.bu)i.onError(t);r.queries.delete(e)}function Cf(n){n.Du.forEach((e=>{e.next()}))}var Md;(function(n){n.Default="default",n.Cache="cache"})(Md||(Md={}));var Vo=class{constructor(e,t,r){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=r||{}}Cu(e){if(!this.options.includeMetadataChanges){let r=[];for(let s of e.docChanges)s.type!==3&&r.push(s);e=new si(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;let r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;let t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=si.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==Md.Cache}};/**
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
 */var Zc=class{constructor(e){this.key=e}},eu=class{constructor(e){this.key=e}},Gd=class{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=_e(),this.mutatedKeys=_e(),this.Ju=et(e)?fd(e):Zd(e),this.Yu=new Lo(this.Ju)}get Zu(){return this.zu}Xu(e,t){let r=t?t.ec:new Xc,s=t?t.Yu:this.Yu,i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1,[u,l]=this.tc(this.query,s);e.inorderTraversal(((f,g)=>{let v=s.get(f),I=aA(this.query,g)?g:null,S=!!v&&this.mutatedKeys.has(v.key),U=!!I&&(I.hasLocalMutations||this.mutatedKeys.has(I.key)&&I.hasCommittedMutations),H=!1;v&&I?v.data.isEqual(I.data)?S!==U&&(r.track({type:3,doc:I}),H=!0):this.nc(v,I)||(r.track({type:2,doc:I}),H=!0,(u&&this.Ju(I,u)>0||l&&this.Ju(I,l)<0)&&(c=!0)):!v&&I?(r.track({type:0,doc:I}),H=!0):v&&!I&&(r.track({type:1,doc:v}),H=!0,(u||l)&&(c=!0)),H&&(I?(o=o.add(I),i=U?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}));let h=this.rc(this.query);if(h)if(et(this.query)){let f=[];o.forEach((I=>f.push(I)));let g=$E(this.query,f),v=new Lo(fd(this.query));for(let I of g)v=v.add(I);o.forEach((I=>{v.has(I.key)||(i=i.delete(I.key),r.track({type:1,doc:I}))})),o=v}else{let f=this.sc(this.query);for(;o.size>h;){let g=f==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),r.track({type:1,doc:g})}}return{Yu:o,ec:r,Oo:c,mutatedKeys:i}}rc(e){return et(e)?oB(e)?.limit:e.limit||void 0}sc(e){if(et(e)){let t=oB(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){if(et(e)){let r=oB(e)?.limit;return[t.size===r?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){let i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;let o=e.ec.yu();o.sort(((h,f)=>(function(v,I){let S=U=>{switch(U){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return X(20277,{we:U})}};return S(v)-S(I)})(h.type,f.type)||this.Ju(h.doc,f.doc))),this._c(r),s=s??!1;let c=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,l=u!==this.ju;return this.ju=u,o.length!==0||l?{snapshot:new si(this.query,e.Yu,i,o,e.mutatedKeys,u===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),ac:c}:{ac:c}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new Xc,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];let e=this.Hu;this.Hu=_e(),this.Yu.forEach((r=>{this.uc(r.key)&&(this.Hu=this.Hu.add(r.key))}));let t=[];return e.forEach((r=>{this.Hu.has(r)||t.push(new eu(r))})),this.Hu.forEach((r=>{e.has(r)||t.push(new Zc(r))})),t}cc(e){this.zu=e.Wo,this.Hu=_e();let t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return si.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}},mf="SyncEngine",Ud=class{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}},Hd=class{constructor(e){this.key=e,this.Ec=!1}},qd=class{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hc={},this.Tc=new Jn((c=>OE(c)),fu),this.Pc=new Map,this.Ic=new Set,this.Rc=new qe(Z.comparator),this.Ac=new Map,this.Vc=new Fo,this.dc={},this.fc=new Map,this.mc=Bs.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}};async function DA(n,e,t=!0){let r=a_(n),s,i=r.Tc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await r_(r,e,t,!0),s}async function IA(n,e){let t=a_(n);await r_(t,e,!0,!1)}async function r_(n,e,t,r){let s=await fA(n.localStore,et(e)?e:wn(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t),c;return r&&(c=await TA(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&ZE(n.remoteStore,s),c}async function TA(n,e,t,r,s){n.yc=(f,g,v)=>(async function(S,U,H,se){let De=U.view.Xu(H);De.Oo&&(De=await Cm(S.localStore,U.query,!1).then((({documents:b})=>U.view.Xu(b,De))));let Ce=se&&se.targetChanges.get(U.targetId),Pe=se&&se.targetMismatches.get(U.targetId)!=null,Ie=U.view.applyChanges(De,S.isPrimaryClient,Ce,Pe);return ym(S,U.targetId,Ie.ac),Ie.snapshot})(n,f,g,v);let i=await Cm(n.localStore,e,!0),o=new Gd(e,i.Wo),c=o.Xu(i.documents),u=wo.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),l=o.applyChanges(c,n.isPrimaryClient,u);ym(n,t,l.ac);let h=new Ud(e,t,o);return n.Tc.set(e,h),n.Pc.has(t)?n.Pc.get(t).push(e):n.Pc.set(t,[e]),l.snapshot}async function AA(n,e,t){let r=Ee(n),s=r.Tc.get(e),i=r.Pc.get(s.targetId);if(i.length>1)return r.Pc.set(s.targetId,i.filter((o=>!fu(o,e)))),void r.Tc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Pd(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Bf(r.remoteStore,s.targetId),jd(r,s.targetId)})).catch(lu)):(jd(r,s.targetId),await Pd(r.localStore,s.targetId,!0))}async function vA(n,e){let t=Ee(n),r=t.Tc.get(e),s=t.Pc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Bf(t.remoteStore,r.targetId))}async function s_(n,e){let t=Ee(n);try{let r=await hA(t.localStore,e);e.targetChanges.forEach(((s,i)=>{let o=t.Ac.get(i);o&&(ne(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Ec=!0:s.modifiedDocuments.size>0?ne(o.Ec,14607):s.removedDocuments.size>0&&(ne(o.Ec,42227),o.Ec=!1))})),await o_(t,r,e)}catch(r){await lu(r)}}function wm(n,e,t){let r=Ee(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let s=[];r.Tc.forEach(((i,o)=>{let c=o.view.xu(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){let u=Ee(o);u.onlineState=c;let l=!1;u.queries.forEach(((h,f)=>{for(let g of f.bu)g.xu(c)&&(l=!0)})),l&&Cf(u)})(r.eventManager,e),s.length&&r.hc.Tn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function bA(n,e,t){let r=Ee(n);r.sharedClientState.updateQueryState(e,"rejected",t);let s=r.Ac.get(e),i=s&&s.key;if(i){let o=new qe(Z.comparator);o=o.insert(i,Ut.newNoDocument(i,Be.min()));let c=_e().add(i),u=new _o(Be.min(),new Map,new qe(me),o,Vt(),c);await s_(r,u),r.Rc=r.Rc.remove(i),r.Ac.delete(e),Ef(r)}else await Pd(r.localStore,e,!1).then((()=>jd(r,e,t))).catch(lu)}function jd(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(let r of n.Pc.get(e))n.Tc.delete(r),t&&n.hc.wc(r,t);n.Pc.delete(e),n.isPrimaryClient&&n.Vc.e_(e).forEach((r=>{n.Vc.containsKey(r)||i_(n,r)}))}function i_(n,e){n.Ic.delete(e.path.canonicalString());let t=n.Rc.get(e);t!==null&&(Bf(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ac.delete(t),Ef(n))}function ym(n,e,t){for(let r of t)r instanceof Zc?(n.Vc.addReference(r.key,e),SA(n,r)):r instanceof eu?(J(mf,"Document no longer in limbo: "+r.key),n.Vc.removeReference(r.key,e),n.Vc.containsKey(r.key)||i_(n,r.key)):X(19791,{bc:r})}function SA(n,e){let t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Ic.has(r)||(J(mf,"New document in limbo: "+t),n.Ic.add(r),Ef(n))}function Ef(n){for(;n.Ic.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){let e=n.Ic.values().next().value;n.Ic.delete(e);let t=new Z(ve.fromString(e)),r=n.mc.next();n.Ac.set(r,new Hd(t)),n.Rc=n.Rc.insert(t,r),ZE(n.remoteStore,new ri(wn(zo(t.path)),r,"TargetPurposeLimboResolution",Ys.wn))}}async function o_(n,e,t){let r=Ee(n),s=[],i=[],o=[];r.Tc.isEmpty()||(r.Tc.forEach(((c,u)=>{o.push(r.yc(u,e,t).then((l=>{if((l||t)&&r.isPrimaryClient){let h=l?!l.fromCache:t?.targetChanges.get(u.targetId)?.current;r.sharedClientState.updateQueryState(u.targetId,h?"current":"not-current")}if(l){s.push(l);let h=vd.mo(u.targetId,l);i.push(h)}})))})),await Promise.all(o),r.hc.Tn(s),await(async function(u,l){let h=Ee(u);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(f=>G.forEach(l,(g=>G.forEach(g.Vo,(v=>h.persistence.referenceDelegate.addReference(f,g.targetId,v))).next((()=>G.forEach(g.fo,(v=>h.persistence.referenceDelegate.removeReference(f,g.targetId,v)))))))))}catch(f){if(!ai(f))throw f;J(lf,"Failed to update sequence numbers: "+f)}for(let f of l){let g=f.targetId;if(!f.fromCache){let v=h.Lo.get(g),I=v.snapshotVersion,S=v.withLastLimboFreeSnapshotVersion(I);h.Lo=h.Lo.insert(g,S)}}})(r.localStore,i))}async function RA(n,e){let t=Ee(n);if(!t.currentUser.isEqual(e)){J(mf,"User change. New user:",e.toKey());let r=await YE(t.localStore,e);t.currentUser=e,(function(i,o){i.fc.forEach((c=>{c.forEach((u=>{u.reject(new q(O.CANCELLED,o))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await o_(t,r.$o)}}function PA(n,e){let t=Ee(n),r=t.Ac.get(e);if(r&&r.Ec)return _e().add(r.key);{let s=_e(),i=t.Pc.get(e);if(!i)return s;for(let o of i??[]){let c=t.Tc.get(o);s=s.unionWith(c.view.Zu)}return s}}function a_(n){let e=Ee(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=s_.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=PA.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=bA.bind(null,e),e.hc.Tn=wA.bind(null,e.eventManager),e.hc.wc=yA.bind(null,e.eventManager),e}var hs=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=cu(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return BA(this.persistence,new Sd,e.initialUser,this.serializer)}Dc(e){return new Qc(Ad.b_,this.serializer)}vc(e){return new xd}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};hs.provider={build:()=>new hs};var Mo=class extends hs{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){ne(this.persistence.referenceDelegate instanceof $c,46915);let r=this.persistence.referenceDelegate.garbageCollector;return new HB(r,e.asyncQueue,t)}Dc(e){let t=this.cacheSizeBytes!==void 0?Wt.withCacheSize(this.cacheSizeBytes):Wt.DEFAULT;return new Qc((r=>$c.b_(r,t)),this.serializer)}};var ds=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>wm(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=RA.bind(null,this.syncEngine),await _A(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Vd})()}createDatastore(e){let t=cu(e.databaseInfo.databaseId),r=IT(e.databaseInfo);return TT(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,c){return new Od(r,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>wm(this.syncEngine,t,0)),(function(){return Nc.Ye()?new Nc:new NB})())}createSyncEngine(e,t){return(function(s,i,o,c,u,l,h){let f=new qd(s,i,o,c,u,l);return h&&(f.gc=!0),f})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){let r=Ee(t);J(Yn,"RemoteStore shutting down."),r.la.add(5),await Wo(r),r.ha.shutdown(),r.Ta.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}};ds.provider={build:()=>new ds};/**
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
 */var Kd=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new q(O.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await(async function(s,i){let o=Ee(s),c={documents:i.map((f=>yo(o.serializer,f)))},u=await o._t("BatchGetDocuments",o.serializer.databaseId,ve.emptyPath(),c,i.length),l=new Map;u.forEach((f=>{let g=BT(o.serializer,f);l.set(g.key.toString(),g)}));let h=[];return i.forEach((f=>{let g=l.get(f.toString());ne(!!g,55234,{key:f}),h.push(g)})),h})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new $s(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{let s=Z.fromPath(r);this.mutations.push(new wc(s,this.precondition(s)))})),await(async function(r,s){let i=Ee(r),o={writes:s.map((c=>dT(i.serializer,c)))};await i.nt("Commit",i.serializer.databaseId,ve.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw X(50498,{Mc:e.constructor.name});t=Be.min()}let r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new q(O.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Be.min())?nn.exists(!1):nn.updateTime(t):nn.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Be.min()))throw new q(O.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return nn.updateTime(t)}return nn.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
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
 */var Jd=class{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Nc=r.maxAttempts,this.Ht=new Io(this.asyncQueue,"transaction_retry")}Lc(){this.Nc-=1,this.Bc()}Bc(){this.Ht.kt((async()=>{let e=new Kd(this.datastore),t=this.Uc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.kc(s)}))))})).catch((r=>{this.kc(r)}))}))}Uc(e){try{let t=this.updateFunction(e);return!Ko(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}kc(e){this.Nc>0&&this.qc(e)?(this.Nc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Bc(),Promise.resolve())))):this.deferred.reject(e)}qc(e){if(e?.name==="FirebaseError"){let t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!XI(t)}return!1}};/**
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
 */var Ar="FirestoreClient",zd=class{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=at.UNAUTHENTICATED,this.clientId=Ms.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{J(Ar,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(J(Ar,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new on;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){let r=n_(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}};async function cB(n,e){n.asyncQueue.verifyOperationInProgress(),J(Ar,"Initializing OfflineComponentProvider");let t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await YE(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Dm(n,e){n.asyncQueue.verifyOperationInProgress();let t=await NA(n);J(Ar,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Em(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Em(e.remoteStore,s))),n._onlineComponents=e}async function NA(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){J(Ar,"Using user provided OfflineComponentProvider");try{await cB(n,n._uninitializedComponentsProvider._offline)}catch(e){let t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===O.FAILED_PRECONDITION||s.code===O.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;$t("Error using user provided cache. Falling back to memory cache: "+t),await cB(n,new hs)}}else J(Ar,"Using default OfflineComponentProvider"),await cB(n,new Mo(void 0));return n._offlineComponents}async function c_(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(J(Ar,"Using user provided OnlineComponentProvider"),await Dm(n,n._uninitializedComponentsProvider._online)):(J(Ar,"Using default OnlineComponentProvider"),await Dm(n,new ds))),n._onlineComponents}function OA(n){return c_(n).then((e=>e.datastore))}async function tu(n){let e=await c_(n),t=e.eventManager;return t.onListen=DA.bind(null,e.syncEngine),t.onUnlisten=AA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=IA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=vA.bind(null,e.syncEngine),t}function u_(n,e,t,r){let s=new xo(r),i=new Vo(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>pf(await tu(n),i))),()=>{s.Va(),n.asyncQueue.enqueueAndForget((async()=>gf(await tu(n),i)))}}function l_(n,e,t={}){let r=new on;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new xo({next:g=>{h.Va(),o.enqueueAndForget((()=>gf(i,f)));let v=g.docs.has(c);!v&&g.fromCache?l.reject(new q(O.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&g.fromCache&&u&&u.source==="server"?l.reject(new q(O.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new Vo(zo(c.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return pf(i,f)})(await tu(n),n.asyncQueue,e,t,r))),r.promise}function B_(n,e,t={}){let r=new on;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new xo({next:g=>{h.Va(),o.enqueueAndForget((()=>gf(i,f))),g.fromCache&&u.source==="server"?l.reject(new q(O.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new Vo(c instanceof ZB?zT(c):c,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return pf(i,f)})(await tu(n),n.asyncQueue,e,t,r))),r.promise}function h_(n,e,t){let r=new on;return n.asyncQueue.enqueueAndForget((async()=>{let s=await OA(n);new Jd(n.asyncQueue,s,t,e,r).Lc()})),r.promise}/**
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
 */var ui=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new $e(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new kA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){let t=this._document.data.field(zn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},kA=class extends ui{data(){return super.data()}};/**
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
 */var Go=class{convertValue(e,t="none"){switch(Xe(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Hn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw X(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return ps(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){let t=e.fields?.[ts].arrayValue?.values?.map((r=>Oe(r.doubleValue)));return new Gt(t)}convertGeoPoint(e){return new xn(Oe(e.latitude),Oe(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":let r=jo(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Us(e));default:return null}}convertTimestamp(e){let t=Un(e);return new He(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=ve.fromString(e);ne(lE(r),9688,{name:e});let s=new fo(r.get(1),r.get(3)),i=new Z(r.popFirst(5));return s.isEqual(t)||Gn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}};/**
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
 */function d_(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var nu=class extends Go{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new $e(this.firestore,null,t)}};/**
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
 */var Im="AsyncQueue",ru=class{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new Io(this,"async_queue_retry"),this.Hc=()=>{let r=aB();r&&J(Im,"Visibility state changed to "+r.visibilityState),this.Ht.$t()},this.Jc=e;let t=aB();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;let t=aB();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));let t=new on;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!ai(e))throw e;J(Im,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){let t=this.Jc.then((()=>(this.Gc=!0,e().catch((r=>{throw this.Wc=r,this.Gc=!1,Gn("INTERNAL UNHANDLED ERROR: ",Tm(r)),r})).then((r=>(this.Gc=!1,r))))));return this.Jc=t,t}enqueueAfterDelay(e,t,r){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);let s=Fd.createAndSchedule(this,e,t,r,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&X(47125,{tl:Tm(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(let t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(let t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){let t=this.Qc.indexOf(e);this.Qc.splice(t,1)}};function Tm(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
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
 */var Xn=class extends Bu{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new ru,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new ru(e),this._firestoreClient=void 0,await e}}};function _f(n,e,t){t||(t=ho);let r=Ni(n,"firestore");if(r.isInitialized(t)){let s=r.getImmediate({identifier:t}),i=r.getOptions(t);if(fn(i,e))return s;throw new q(O.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new q(O.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pE)throw new q(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&kr(e.host)&&Ca(e.host),r.initialize({options:e,instanceIdentifier:t})}function wf(n,e){let t=typeof n=="object"?n:al(),r=typeof n=="string"?n:e||ho,s=Ni(t,"firestore").getImmediate({identifier:r});if(!s._initialized){let i=Vp("firestore");i&&CE(s,...i)}return s}function $o(n){if(n._terminated)throw new q(O.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||FA(n),n._firestoreClient}function FA(n){let e=n._freezeSettings(),t=vT(n._databaseId,n._app?.options.appId||"",n._persistenceKey,n._app?.options.apiKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new zd(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){let i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(n._componentsProvider))}/**
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
 */var fs=class extends Go{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new $e(this.firestore,null,t)}};/**
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
 */var kn=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},Mn=class n extends ui{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new Zr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field(zn("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new q(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=n._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}};Mn._jsonSchemaVersion="firestore/documentSnapshot/1.0",Mn._jsonSchema={type:Qe("string",Mn._jsonSchemaVersion),bundleSource:Qe("string","DocumentSnapshot"),bundleName:Qe("string"),bundle:Qe("string")};var Zr=class extends Mn{data(e={}){return super.data(e)}},Cr=class n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new kn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){let e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Zr(this._firestore,this._userDataWriter,r.key,r,new kn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new q(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{et(s._snapshot.query)?fd(s._snapshot.query):Zd(s.query._query);let u=new Zr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new kn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{let u=new Zr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new kn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter),l=-1,h=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),h=o.indexOf(c.doc.key)),{type:xA(c.type),doc:u,oldIndex:l,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new q(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ms.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}};function xA(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return X(61501,{type:n})}}/**
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
 */Cr._jsonSchemaVersion="firestore/querySnapshot/1.0",Cr._jsonSchema={type:Qe("string",Cr._jsonSchemaVersion),bundleSource:Qe("string","QuerySnapshot"),bundleName:Qe("string"),bundle:Qe("string")};/**
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
 */function LA(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new q(O.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}var Xo=class{},li=class extends Xo{};function Zo(n,e,...t){let r=[];e instanceof Xo&&r.push(e),r=r.concat(t),(function(i){let o=i.filter((u=>u instanceof yf)).length,c=i.filter((u=>u instanceof Cu)).length;if(o>1||o>0&&c>0)throw new q(O.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(let s of r)n=s._apply(n);return n}var Cu=class n extends li{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=this._parse(e);return y_(e._query,t),new an(e.firestore,e.converter,ou(e._query,t))}_parse(e){let t=hu(e.firestore);return(function(i,o,c,u,l,h,f){let g;if(l.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new q(O.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){p_(f,h);let I=[];for(let S of f)I.push(f_(u,i,S));g={arrayValue:{values:I}}}else g=f_(u,i,f)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||p_(f,h),g=nf(c,o,f,h==="in"||h==="not-in");return Ke.create(l,h,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}};function mu(n,e,t){let r=e,s=zn("where",n);return Cu._create(s,r,t)}var yf=class n extends Xo{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new n(e,t)}_parse(e){let t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Xt.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s,c=i.getFlattenedFilters();for(let u of c)y_(o,u),o=ou(o,u)})(e._query,t),new an(e.firestore,e.converter,ou(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}};var Df=class n extends li{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new n(e,t)}_apply(e){let t=(function(s,i,o){if(s.startAt!==null)throw new q(O.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new q(O.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Er(i,o)})(e._query,this._field,this._direction);return new an(e.firestore,e.converter,Zm(e._query,t))}};function E_(n,e="asc"){let t=e,r=zn("orderBy",n);return Df._create(r,t)}var If=class n extends li{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new n(e,t,r)}_apply(e){return new an(e.firestore,e.converter,Eo(e._query,this._limit,this._limitType))}};function __(n){return Nm("limit",n),If._create("limit",n,"F")}var Tf=class n extends li{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=VA(e,this.type,this._docOrFields,this._inclusive);return new an(e.firestore,e.converter,eE(e._query,t))}};function w_(...n){return Tf._create("startAfter",n,!1)}function VA(n,e,t,r){if(t[0]=Ue(t[0]),t[0]instanceof ui)return(function(i,o,c,u,l){if(!u)throw new q(O.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);let h=[];for(let f of Xr(i))if(f.field.isKeyField())h.push(Jo(o,u.key));else{let g=u.data.field(f.field);if(oi(g))throw new q(O.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+f.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){let v=f.field.canonicalString();throw new q(O.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${v}' (used as the orderBy) does not exist.`)}h.push(g)}return new jn(h,l)})(n._query,n.firestore._databaseId,e,t[0]._document,r);{let s=hu(n.firestore);return(function(o,c,u,l,h,f){let g=o.explicitOrderBy;if(h.length>g.length)throw new q(O.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);let v=[];for(let I=0;I<h.length;I++){let S=h[I];if(g[I].field.isKeyField()){if(typeof S!="string")throw new q(O.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof S}`);if(!iu(o)&&S.indexOf("/")!==-1)throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${S}' contains a slash.`);let U=o.path.child(ve.fromString(S));if(!Z.isDocumentKey(U))throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${U}' is not because it contains an odd number of segments.`);let H=new Z(U);v.push(Jo(c,H))}else{let U=nf(u,l,S);v.push(U)}}return new jn(v,f)})(n._query,n.firestore._databaseId,s,e,t,r)}}function f_(n,e,t){if(typeof(t=Ue(t))=="string"){if(t==="")throw new q(O.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!iu(e)&&t.indexOf("/")!==-1)throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);let r=e.path.child(ve.fromString(t));if(!Z.isDocumentKey(r))throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Jo(n,new Z(r))}if(t instanceof $e)return Jo(n,t._key);throw new q(O.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ho(t)}.`)}function p_(n,e){if(!Array.isArray(n)||n.length===0)throw new q(O.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function y_(n,e){let t=(function(s,i){for(let o of s)for(let c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new q(O.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new q(O.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
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
 */function g_(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;let s=t;for(let i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}var Af=class{constructor(e){this.kind="memory",this._onlineComponentProvider=ds.provider,this._offlineComponentProvider=e?.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new Mo(void 0)}}toJSON(){return{kind:this.kind}}};function D_(n){return new Af(n)}/**
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
 */var MA={maxAttempts:5};/**
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
 */function Yo(n,e){if((n=Ue(n)).firestore!==e)throw new q(O.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
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
 */var GA=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=hu(e)}get(e){let t=Yo(e,this._firestore),r=new nu(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return X(24041);let i=s[0];if(i.isFoundDocument())return new ui(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new ui(this._firestore,r,t._key,null,t.converter);throw X(18433,{doc:i})}))}set(e,t,r){let s=Yo(e,this._firestore),i=d_(s.converter,t,r),o=EE(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,o),this}update(e,t,r,...s){let i=Yo(e,this._firestore),o;return o=typeof(t=Ue(t))=="string"||t instanceof cs?wE(this._dataReader,"Transaction.update",i._key,t,r,s):_E(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){let t=Yo(e,this._firestore);return this._transaction.delete(t._key),this}};/**
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
 */var vf=class extends GA{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=Yo(e,this._firestore),r=new fs(this._firestore);return super.get(e).then((s=>new Mn(this._firestore,r,t._key,s._document,new kn(!1,!1),t.converter)))}};function vr(n,e,t){n=Dn(n,Xn);let r={...MA,...t};(function(o){if(o.maxAttempts<1)throw new q(O.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);let s=$o(n);return h_(s,(i=>e(new vf(n,i))),r)}/**
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
 */function er(n){n=Dn(n,$e);let e=Dn(n.firestore,Xn),t=$o(e);return l_(t,n._key,{source:"server"}).then((r=>I_(e,n,r)))}function Eu(n){n=Dn(n,an);let e=Dn(n.firestore,Xn),t=$o(e),r=new fs(e);return B_(t,n._query,{source:"server"}).then((s=>new Cr(e,r,n,s)))}function bf(n,...e){n=Ue(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||g_(e[r])||(t=e[r++]);let s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(g_(e[r])){let l=e[r];e[r]=l.next?.bind(l),e[r+1]=l.error?.bind(l),e[r+2]=l.complete?.bind(l)}let i,o,c;if(n instanceof $e)o=Dn(n.firestore,Xn),c=zo(n._key.path),i={next:l=>{e[r]&&e[r](I_(o,n,l))},error:e[r+1],complete:e[r+2]};else{let l=Dn(n,an);o=Dn(l.firestore,Xn),c=l._query;let h=new fs(o);i={next:f=>{e[r]&&e[r](new Cr(o,h,l,f))},error:e[r+1],complete:e[r+2]},LA(n._query)}let u=$o(o);return u_(u,c,s,i)}function I_(n,e,t){let r=t.docs.get(e._key),s=new fs(n);return new Mn(n,s,e._key,r,new kn(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */var C_="@firebase/firestore",m_="4.17.2";(function(e,t=!0){Am(ur),cr(new jt("firestore",((r,{instanceIdentifier:s,options:i})=>{let o=r.getProvider("app").getImmediate(),c=new Xn(new Sc(r.getProvider("auth-internal")),new Pc(o,r.getProvider("app-check-internal")),Lm(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Zt(C_,m_,e),Zt(C_,m_,"esm2020")})();var UA="firebase",HA="12.19.0";/**
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
 */Zt(UA,HA,"app");var ea=Object.freeze({apiKey:"AIzaSyBvuAItyaaRKBywT11NJ2g9Tp4EjVGTc_M",authDomain:"atlas-ahmedsaeed4-2026.firebaseapp.com",projectId:"atlas-ahmedsaeed4-2026",appId:"1:790536067689:web:6833eb2e60f14f77e1a0f8",messagingSenderId:"790536067689"}),qA=Object.freeze(["apiKey","authDomain","projectId","appId","messagingSenderId"]);function Sf(n=ea){return!!n&&typeof n=="object"&&qA.every(e=>typeof n[e]=="string"&&n[e].trim())}function Rf(n=ea){return Sf(n)?Object.freeze({enabled:!0,projectId:n.projectId}):Object.freeze({enabled:!1,reason:"Online workspaces are unavailable because Firebase web configuration is missing."})}function _u(n,e,t=()=>{}){let r=!1,s=()=>{};return Promise.resolve(n).then(()=>{if(r)return;let i=e();r?i?.():typeof i=="function"&&(s=i)}).catch(i=>{r||t(i)}),()=>{r=!0,s()}}async function T_({auth:n,persistenceReady:e,uid:t=""}){if(await e,!t)return;let r=n?.currentUser;if(!r?.uid||r.uid!==t)throw Object.assign(new Error("The Firebase account changed before the online request started. Retry from the current account."),{code:"unauthenticated"});if(await r.getIdToken(),n?.currentUser?.uid!==t)throw Object.assign(new Error("The Firebase account changed while its access token was refreshing. Retry from the current account."),{code:"unauthenticated"})}function jA({location:n,history:e,eventTarget:t}){if(!n?.href)return()=>{};let r=n.href,s=new URL(r);if(!s.search&&!s.hash)return()=>{};s.search="",s.hash="";let i=s.href,o=e?.state;try{if(e.replaceState(o,"",i),n.href!==i)throw new Error("The browser URL did not change.")}catch(h){throw Object.assign(new Error("Atlas could not prepare a short sign-in URL. Open the normal workspace address to sign in, then return to your map.",{cause:h}),{code:"auth/sign-in-url-unavailable"})}let c=e.state,u=!1,l=()=>{u=!0};return t?.addEventListener?.("popstate",l),t?.addEventListener?.("hashchange",l),()=>{t?.removeEventListener?.("popstate",l),t?.removeEventListener?.("hashchange",l),!u&&n.href===i&&e.state===c&&e.replaceState(o,"",r)}}function A_(n,{location:e=globalThis.location,history:t=globalThis.history,eventTarget:r=globalThis}={}){let s=null;return()=>{if(s)return s;let i;try{i=jA({location:e,history:t,eventTarget:r});let o=n();return s=Promise.resolve(o).then(c=>(i(),c),c=>{try{i()}catch{}throw c}).finally(()=>{s=null}),s}catch(o){try{i?.()}catch{}return Promise.reject(o)}}}var Dt=Object.freeze({nodes:800,edges:2400,text:12e3,chartPoints:32,chartMagnitude:1e12,detailItems:8,detailText:240}),un=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},Me=(...n)=>n.find(e=>e!=null),je=(n,e,t=Dt.text,{required:r=!1}={})=>{if(n==null){if(r)throw new Error(e+" is required.");return""}if(typeof n!="string"&&typeof n!="number")throw new Error(e+" must be text.");let s=String(n).trim();if(r&&!s)throw new Error(e+" is required.");if(s.length>t)throw new Error(e+" must be "+t+" characters or fewer.");return s},Bi=(n,e,t=Dt.detailItems,r=Dt.detailText)=>{if(n==null)return[];if(!Array.isArray(n))throw new Error(e+" must be a list of text values.");if(n.length>t)throw new Error(e+" must contain "+t+" items or fewer.");return n.map((s,i)=>je(s,e+" item "+(i+1),r,{required:!0}))},v_=(n,e)=>n+"-"+String(e+1).padStart(3,"0");function Pf(n,e={}){let t=n;if(typeof n=="string"){if(new TextEncoder().encode(n).byteLength>2097152)throw new Error("This JSON file is larger than the 2 MB import limit.");try{t=JSON.parse(n)}catch(v){throw new Error("That is not valid JSON: "+v.message)}}if(t=un(t),!Object.keys(t).length)throw new Error("The JSON must contain a project, nodes, and edges.");let r=un(t.graph),s=un(Me(t.project,t.metadata,t.meta,r.project,{})),i=Me(t.nodes,t.components,r.nodes),o=Me(t.edges,t.connections,t.relationships,r.edges,r.links,[]);if(!Array.isArray(i))throw new Error("The map needs a nodes array (or components array).");if(!Array.isArray(o))throw new Error("The map needs an edges array (or connections array).");if(i.length>Dt.nodes)throw new Error("This map has "+i.length+" components; the limit is "+Dt.nodes+".");if(o.length>Dt.edges)throw new Error("This map has "+o.length+" connections; the limit is "+Dt.edges+".");if(i.length===0&&!e.allowEmpty)throw new Error("Add at least one component before importing this map.");let c=i.map((v,I)=>{let S=un(v),U=je(Me(S.id,S.key,S.slug,v_("node",I)),"Component "+(I+1)+" ID",160,{required:!0}),H=je(Me(S.label,S.name,S.title,S.id),"Component "+U+" name",120,{required:!0}),se=je(Me(S.type,S.kind,S.category,S.componentType,"Component"),"Component "+H+" type",60,{required:!0}),De=typeof S.sourceRef=="string"||typeof S.sourceRef=="number"?S.sourceRef:Me(un(S.sourceRef).path,un(S.sourceRef).file,un(S.sourceRef).uri,un(S.sourceRef).ref),Ce={id:U,label:H,type:se,description:je(Me(S.description,S.detail,S.sub,S.summary,S.purpose),"Component "+H+" description",1e3),source:je(Me(S.source,S.path,S.file,S.location,De),"Component "+H+" source",240),group:je(Me(S.group,S.domain,S.boundary),"Component "+H+" group",100)};if(S.junction!==void 0&&typeof S.junction!="boolean")throw new Error("Component "+H+" junction marker must be true or false.");if(S.junction===!0){if(se.toLowerCase()!=="junction")throw new Error("A junction marker requires component type Junction.");Ce.junction=!0}if(S.details!==void 0&&S.details!==null){if(!S.details||typeof S.details!="object"||Array.isArray(S.details))throw new Error("Details for "+H+" must be an object.");let m=S.details,w={purpose:je(m.purpose,"Component "+H+" purpose",500),operation:je(m.operation,"Component "+H+" operation",1e3),inputs:Bi(m.inputs,"Component "+H+" inputs"),outputs:Bi(m.outputs,"Component "+H+" outputs"),dependencies:Bi(m.dependencies,"Component "+H+" dependencies"),evidence:Bi(m.evidence,"Component "+H+" evidence"),uncertainty:Bi(m.uncertainty,"Component "+H+" uncertainty")};(w.purpose||w.operation||Object.values(w).some(A=>Array.isArray(A)&&A.length))&&(Ce.details=w)}if(S.chart!==void 0&&S.chart!==null){let m=un(S.chart),w=je(m.label,"Chart for "+H+" label",80,{required:!0}),A=je(m.kind,"Chart for "+H+" kind",8,{required:!0});if(!["bar","line","area"].includes(A))throw new Error("Chart for "+H+" kind must be bar, line, or area.");if(!Array.isArray(m.values)||m.values.length<2||m.values.length>Dt.chartPoints)throw new Error("Chart for "+H+" values must contain 2 to "+Dt.chartPoints+" points.");let D=m.values.map((fe,Te)=>{if(typeof fe!="number"||!Number.isFinite(fe)||Math.abs(fe)>Dt.chartMagnitude)throw new Error("Chart for "+H+" point "+(Te+1)+" must be a finite number within "+Dt.chartMagnitude+".");return fe}),y=je(m.evidence,"Chart for "+H+" evidence",240,{required:!0}),C=je(Me(m.unit,""),"Chart for "+H+" unit",24),te=m.categories===void 0||m.categories===null?[]:Bi(m.categories,"Chart for "+H+" categories",Dt.chartPoints,80),le=je(m.order,"Chart for "+H+" order",160);if(A==="bar"&&te.length!==D.length)throw new Error("Bar chart for "+H+" needs one category label for each value.");if((A==="line"||A==="area")&&te.length&&te.length!==D.length)throw new Error("Chart for "+H+" needs one category label for each value.");if((A==="line"||A==="area")&&!!te.length!=!!le)throw new Error("Ordered chart for "+H+" needs both category labels and an order explanation.");Ce.chart={label:w,kind:A,values:D,evidence:y},C&&(Ce.chart.unit=C),te.length&&(Ce.chart.categories=te),le&&(Ce.chart.order=le)}let Pe=un(Me(S.position,S.pos,{})),Ie=Number(Me(Pe.x,S.x)),b=Number(Me(Pe.y,S.y));return Number.isFinite(Ie)&&Number.isFinite(b)&&Math.abs(Ie)<1e5&&Math.abs(b)<1e5&&(Ce.position={x:Ie,y:b}),Ce}),u=new Set;for(let v of c){if(u.has(v.id))throw new Error('Duplicate component ID: "'+v.id+'". Each component needs a unique ID.');u.add(v.id)}let l=new Set,h=o.map((v,I)=>{let S=un(v),U=je(Me(S.source,S.from,S.sourceId,S.fromId),"Connection "+(I+1)+" source",160,{required:!0}),H=je(Me(S.target,S.to,S.targetId,S.toId),"Connection "+(I+1)+" target",160,{required:!0});if(!u.has(U))throw new Error("Connection "+(I+1)+' refers to missing component "'+U+'".');if(!u.has(H))throw new Error("Connection "+(I+1)+' refers to missing component "'+H+'".');let se=je(Me(S.id,S.key,v_("edge",I)),"Connection "+(I+1)+" ID",160,{required:!0});if(l.has(se))throw new Error('Duplicate connection ID: "'+se+'". Each connection needs a unique ID.');return l.add(se),{id:se,source:U,target:H,label:je(Me(S.label,S.name,S.relationship),"Connection "+se+" label",100),type:je(Me(S.type,S.kind),"Connection "+se+" type",60)}}),f={name:je(Me(s.name,s.title,t.projectName,"Imported architecture"),"Project name",120,{required:!0}),description:je(Me(s.description,s.tagline,s.summary,t.description),"Project description",500),type:je(Me(s.type,s.category,s.kind,t.projectType,"Software project"),"Project type",60)},g=Number(Me(t.schemaVersion,t.version,1));if(!Number.isInteger(g)||g!==1)throw new Error("Schema version "+String(Me(t.schemaVersion,t.version))+" is not supported. This viewer accepts version 1.");return{schemaVersion:g,project:f,nodes:c,edges:h}}function b_(n,e=2){return JSON.stringify({schemaVersion:1,project:n.project,nodes:n.nodes,edges:n.edges},null,e)}var Ct=Object.freeze({maxGraphBytes:2097152,maxChunkBytes:288*1024,maxChunkCount:8,workspaceIdBytes:16,maxWorkspaceName:120,maxProjectType:60,maxNodes:Dt.nodes,maxEdges:Dt.edges}),Of=new TextEncoder,Nf=/^[A-Za-z0-9_-]{22}$/,ke=class extends Error{constructor(e,t="invalid-data",r={}){super(e,r),this.name="CloudModelError",this.code=t}};function ln(n){if(typeof n!="string"||!Nf.test(n))throw new ke("This online workspace link is invalid.","invalid-id");return n}function kf(n=globalThis.crypto){if(!n||typeof n.getRandomValues!="function")throw new ke("Secure random IDs are unavailable in this browser.","crypto-unavailable");let e=new Uint8Array(Ct.workspaceIdBytes);n.getRandomValues(e);let t="";for(let s of e)t+=String.fromCharCode(s);let r=globalThis.btoa(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");return ln(r)}function JA(n,e=""){let t=n??e;if(typeof t!="string")throw new ke("Workspace name must be text.","invalid-name");let r=t.trim();if(!r)throw new ke("Workspace name is required.","invalid-name");if(r.length>Ct.maxWorkspaceName)throw new ke("Workspace name must be "+Ct.maxWorkspaceName+" characters or fewer.","invalid-name");return r}function zA(n,e){let t=[],r=[],s=0,i=()=>{r.length&&(t.push({text:r.join(""),byteLength:s}),r=[],s=0)};for(let o of n){let c=Of.encode(o).byteLength;if(c>e)throw new ke("A text character exceeds the cloud chunk limit.","chunk-too-large");s+c>e&&i(),r.push(o),s+=c}return i(),t.length||t.push({text:"",byteLength:0}),t.map((o,c)=>({index:c,...o}))}function Ff(n,{name:e}={}){let t;try{t=Pf(n,{allowEmpty:!0})}catch(o){throw new ke(o.message,"invalid-graph",{cause:o})}e!==void 0&&(t.project.name=JA(e,t.project.name));let r=b_(t,2),s=Of.encode(r).byteLength;if(s>Ct.maxGraphBytes)throw new ke("This graph exceeds Atlas's 2 MiB online workspace limit. Shorten optional details or reduce the map before saving.","graph-too-large");let i=zA(r,Ct.maxChunkBytes);if(i.length>Ct.maxChunkCount)throw new ke("This graph needs too many cloud chunks to save safely.","too-many-chunks");return Object.freeze({graph:t,json:r,byteLength:s,chunkCount:i.length,chunks:Object.freeze(i.map(o=>Object.freeze(o)))})}function xf({chunks:n,chunkCount:e,byteLength:t}){if(!Number.isInteger(e)||e<1||e>Ct.maxChunkCount)throw new ke("The online workspace has an invalid chunk count.","invalid-metadata");if(!Number.isInteger(t)||t<1||t>Ct.maxGraphBytes)throw new ke("The online workspace has an invalid size.","invalid-metadata");if(!Array.isArray(n)||n.length!==e)throw new ke("The online workspace is missing one or more graph chunks.","missing-chunk");let r=0,s=[];for(let c=0;c<e;c+=1){let u=n[c];if(!u||u.index!==c||typeof u.text!="string")throw new ke("The online workspace graph chunks are out of order.","invalid-chunk");let l=Of.encode(u.text).byteLength;if(l>Ct.maxChunkBytes)throw new ke("The online workspace contains an oversized graph chunk.","chunk-too-large");if(r+=l,r>Ct.maxGraphBytes)throw new ke("The online workspace graph exceeds the 2 MiB limit.","graph-too-large");s.push(u.text)}if(r!==t)throw new ke("The online workspace graph size does not match its metadata.","invalid-size");let i=s.join(""),o;try{o=Pf(i,{allowEmpty:!0})}catch(c){throw new ke("The online workspace contains an invalid graph: "+c.message,"invalid-graph",{cause:c})}return Object.freeze({graph:o,json:i,byteLength:r,chunkCount:e})}function It(n,e){if(ln(n),!e||typeof e!="object"||Array.isArray(e))throw new ke("The online workspace metadata is invalid.","invalid-metadata");let t=(c,u,l=!0)=>typeof c=="string"&&c.length<=u&&(!l||c.trim().length>0),r=(c,u,l)=>Number.isInteger(c)&&c>=u&&c<=l;if(e.schemaVersion!==1||typeof e.ownerId!="string"||!e.ownerId||typeof e.shared!="boolean"||typeof e.deleting!="boolean"||!t(e.name,Ct.maxWorkspaceName)||!t(e.projectType,Ct.maxProjectType)||!t(e.currentRevision,22)||!Nf.test(e.currentRevision)||!(e.previousRevision===null||typeof e.previousRevision=="string"&&Nf.test(e.previousRevision))||!r(e.chunkCount,1,Ct.maxChunkCount)||!r(e.byteLength,1,Ct.maxGraphBytes)||!r(e.nodeCount,0,Ct.maxNodes)||!r(e.edgeCount,0,Ct.maxEdges))throw new ke("The online workspace metadata is invalid or outside Atlas limits.","invalid-metadata");let s=c=>{if(c&&typeof c.toDate=="function"){let u=c.toDate();return Number.isFinite(u.getTime())?u.toISOString():null}return c instanceof Date&&Number.isFinite(c.getTime())?c.toISOString():typeof c=="string"&&Number.isFinite(Date.parse(c))?new Date(c).toISOString():null},i=s(e.createdAt),o=s(e.updatedAt);if(!i||!o)throw new ke("The online workspace timestamps are invalid.","invalid-metadata");return Object.freeze({id:n,schemaVersion:e.schemaVersion,ownerId:e.ownerId,shared:e.shared,deleting:e.deleting,name:e.name,projectType:e.projectType,currentRevision:e.currentRevision,previousRevision:e.previousRevision,chunkCount:e.chunkCount,byteLength:e.byteLength,nodeCount:e.nodeCount,edgeCount:e.edgeCount,createdAt:i,updatedAt:o})}function S_(n,e=globalThis.location?.href){let t=ln(n);if(typeof e!="string"||!e)throw new ke("A browser URL is required to make a workspace link.","missing-base-url");let r;try{r=new URL("./workspace",e)}catch(s){throw new ke("The workspace link base URL is invalid.","invalid-base-url",{cause:s})}return r.search="",r.searchParams.set("view",t),r.hash="",r.href}var Rt=class extends Error{constructor(e,t){super(e),this.name="CloudQuotaError",this.code=t,this.status="error"}};function wu(n){if(!n)return[];let e=n.workspaceIds;if(n.schemaVersion!==1||!Array.isArray(e)||e.some(t=>typeof t!="string"||!/^[A-Za-z0-9_-]{22}$/.test(t))||new Set(e).size!==e.length)throw new Rt("Cloud Workspace usage could not be verified. Your maps are unchanged.","quota-invalid");return[...e]}function R_(n,e,t=20){let r=wu(n);if(r.includes(e))throw new Rt("This workspace ID is already registered. Retry the original map rather than creating a duplicate.","workspace-id-collision");if(t!==null&&![20,30,40].includes(t))throw new Rt("The workspace allowance could not be verified. Your maps are unchanged.","quota-invalid");if(t!==null&&r.length>=t)throw new Rt(`You have reached the limit of ${t} Cloud Workspaces. Delete a Cloud Workspace to make room, or keep this map locally.`,"workspace-limit");return[...r,e]}function P_(n,e){let t=wu(n);if(!n||!t.includes(e))throw new Rt("Cloud Workspace usage needs setup before this deletion can finish. Your stored map has not been removed.","quota-uninitialized");return t.filter(r=>r!==e)}var WA=20,N_=Object.freeze([20,30,40,null]);function Cs(n){if(typeof n!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(n))throw new Rt("The account identifier is invalid.","invalid-account");return n}function yu(n){if(n==null)return WA;if(n.schemaVersion!==1||!N_.includes(n.maxWorkspaces))throw new Rt("The workspace allowance could not be verified. Your maps are unchanged.","quota-invalid");return n.maxWorkspaces}function Lf(n){if(!N_.includes(n))throw new Rt("Choose 20, 30, 40, or unlimited workspaces.","invalid-limit");return n}function Du(n){return typeof n?.toDate=="function"?n.toDate().toISOString():typeof n=="string"?n:null}function O_(n,e){return Cs(n),e?.email_verified!==!0||typeof e.email!="string"||!e.email||e.email.length>320||typeof e.name!="string"||e.name.length>200?null:Object.freeze({schemaVersion:1,uid:n,name:e.name,email:e.email})}var k_="atlas-online-workspaces",ta="workspaces",ue=class extends Error{constructor(e,t="cloud-error",{status:r="error",cause:s}={}){super(e,s?{cause:s}:void 0),this.name="CloudServiceError",this.code=t,this.status=r}},Iu=class extends ue{constructor(e,t){super("This workspace changed in another tab or device. Reload the online version before saving again.","conflict",{status:"conflict"}),this.name="CloudConflictError",this.expectedRevision=e,this.actualRevision=t}};function nt(n){if(n instanceof ue)return n;if(n instanceof Rt)return new ue(n.message,n.code,{cause:n});if(n instanceof ke)return new ue(n.message,n.code,{status:"invalid",cause:n});let e=typeof n?.code=="string"?n.code:"cloud-error";return e==="auth/popup-blocked"?new ue("Your browser blocked the Google sign-in popup. Allow popups for Atlas and try again.","popup-blocked",{status:"popup-blocked",cause:n}):e==="auth/popup-closed-by-user"||e==="auth/cancelled-popup-request"?new ue("Google sign-in was cancelled.","cancelled",{status:"cancelled",cause:n}):e==="permission-denied"||e==="storage/unauthorized"?new ue("You do not have permission to use this online workspace.","permission-denied",{status:"permission-denied",cause:n}):e==="not-found"||e==="auth/user-not-found"?new ue("This online workspace no longer exists.","not-found",{status:"not-found",cause:n}):e==="unauthenticated"||e==="auth/user-token-expired"?new ue("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated",cause:n}):["unavailable","deadline-exceeded","network-request-failed","auth/network-request-failed"].includes(e)?new ue("Atlas cannot reach the online workspace service. Check your connection and try again.","offline",{status:"offline",cause:n}):new ue(typeof n?.message=="string"&&n.message?n.message:"The online workspace request failed.",e,{status:"error",cause:n})}function QA(n){if(!n||typeof n.uid!="string"||!n.uid)return null;let e=t=>typeof t=="string"?t:"";return Object.freeze({uid:n.uid,displayName:e(n.displayName),email:e(n.email),photoURL:e(n.photoURL)})}function hi(n){return Object.freeze({id:n.id,ownerId:n.ownerId,name:n.name,projectType:n.projectType,nodeCount:n.nodeCount,edgeCount:n.edgeCount,shared:n.shared,deleting:n.deleting,currentRevision:n.currentRevision,createdAt:n.createdAt,updatedAt:n.updatedAt})}function $A(n,{app:e,auth:t,db:r,persistenceReady:s,workspaceIdFactory:i=kf,commitBatch:o,readWorkspaceFromServer:c,signInPopup:u=Gl,signInBrowser:l}={}){let h=e;if(!h){if(h=cg().find(V=>V.name===k_),h&&h.options.projectId!==n.projectId)throw new ue("Atlas is already connected to a different Firebase project.","project-mismatch",{status:"configuration"});h||(h=ol(n,k_))}let f=t||kl(h,{persistence:[Ml,Ll],popupRedirectResolver:Ul}),g=r;if(!g)try{g=_f(h,{localCache:D_()})}catch(V){if(V?.code!=="failed-precondition"&&V?.code!=="already-initialized")throw V;g=wf(h)}let v=s??f.authStateReady(),I=V=>T_({auth:f,persistenceReady:v,uid:V}),S=A_(()=>{let V=new Ur;return V.setCustomParameters({prompt:"select_account"}),u(f,V)},l),U=typeof o=="function"?o:V=>V.commit(),H=typeof c=="function"?c:er,se=V=>Zn(g,ta,V),De=V=>Zn(g,"workspaceQuota",V),Ce=V=>Zn(g,"accountProfiles",Cs(V)),Pe=V=>Zn(g,"accountLimits",Cs(V)),Ie=()=>Zn(g,"system","adminAccess");async function b(V){await I(V);let M=await er(Ie());if(await I(V),!M.exists()||M.data().adminUid!==V)throw new ue("This page is only available to the administrator.","admin-required",{status:"permission-denied"})}async function m(V){if(typeof V?.getIdTokenResult!="function")return;let M=await V.getIdTokenResult(),W=O_(V.uid,M.claims);W&&(await I(V.uid),await vr(g,async Q=>{let ce=await Q.get(Ce(V.uid)),ie=ce.exists()?ce.data():null;ie?.name===W.name&&ie?.email===W.email&&ie?.schemaVersion===1&&ie?.uid===V.uid||(await I(V.uid),Q.set(Ce(V.uid),{...W,createdAt:ie?.createdAt||cn(),updatedAt:cn()}))}))}let w=(V,M)=>Zn(g,ta,V,"revisions",M),A=(V,M)=>gs(w(V,M),"chunks"),D=(V,M,W)=>Zn(A(V,M),String(W)),y=new TextEncoder,C=V=>({index:V.index,payload:Qt.fromUint8Array(y.encode(V.text))}),te=()=>new Date().toISOString();function le({uid:V,encoded:M,revision:W,previousRevision:Q,shared:ce,createdAt:ie}){let ee=cn();return{schemaVersion:1,ownerId:V,shared:ce,deleting:!1,name:M.graph.project.name,projectType:M.graph.project.type,currentRevision:W,previousRevision:Q,chunkCount:M.chunkCount,byteLength:M.byteLength,nodeCount:M.graph.nodes.length,edgeCount:M.graph.edges.length,createdAt:ie||ee,updatedAt:ee}}function fe(V,M,W=te()){return{id:V,schemaVersion:M.schemaVersion,ownerId:M.ownerId,shared:M.shared,deleting:M.deleting,name:M.name,projectType:M.projectType,currentRevision:M.currentRevision,previousRevision:M.previousRevision,chunkCount:M.chunkCount,byteLength:M.byteLength,nodeCount:M.nodeCount,edgeCount:M.edgeCount,createdAt:M.createdAt&&typeof M.createdAt.toDate=="function"?M.createdAt.toDate().toISOString():M.createdAt||W,updatedAt:M.updatedAt&&typeof M.updatedAt.toDate=="function"?M.updatedAt.toDate().toISOString():M.updatedAt||W}}async function Te(V,M,W,Q){let ce=Array.from({length:Q},(ie,ee)=>D(M,W,ee));return Promise.all(ce.map(ie=>V.get(ie)))}function Fe(V){return V.docs.map(M=>It(M.id,M.data()))}async function Je(V,M){let W=Array.from({length:M.chunkCount},(ee,ge)=>D(V,M.currentRevision,ge)),ce=(await Promise.all(W.map(ee=>er(ee)))).map((ee,ge)=>{if(!ee.exists())throw new ue("The online workspace is missing a graph chunk.","missing-chunk",{status:"invalid"});let be=ee.data();if(!be.payload||typeof be.payload.toUint8Array!="function")throw new ue("The online workspace contains an invalid graph chunk.","invalid-chunk",{status:"invalid"});let he;try{he=new TextDecoder("utf-8",{fatal:!0}).decode(be.payload.toUint8Array())}catch(xe){throw new ue("The online workspace contains invalid UTF-8 graph data.","invalid-chunk",{status:"invalid",cause:xe})}return{index:be.index,text:he}}),ie=xf({chunks:ce,chunkCount:M.chunkCount,byteLength:M.byteLength});if(ie.graph.nodes.length!==M.nodeCount||ie.graph.edges.length!==M.edgeCount)throw new ue("The online workspace graph counts do not match its metadata.","count-mismatch",{status:"invalid"});return ie}function Bn(V,M,W){let Q=se(M),ce=!1,ie=0,ee=he=>{ce||W(he)},ge=async(he,xe)=>{if(ce||xe!==ie)return;if(he.metadata?.fromCache){ee({status:"loading"});return}if(he.metadata?.hasPendingWrites){ee({status:"loading"});return}if(!he.exists()){ee({status:"deleted"});return}let Le;try{Le=It(M,he.data())}catch(Ht){ee({status:"error",error:nt(Ht)});return}let ut=Le.ownerId===f.currentUser?.uid;if(!Le.shared&&!ut){ee({status:"revoked"});return}try{let Ht=await Je(M,Le);if(ce||xe!==ie)return;let In=await er(Q);if(!In.exists()){ee({status:"deleted"});return}let qt=It(M,In.data()),br=qt.ownerId===f.currentUser?.uid;if(!qt.shared&&!br){ee({status:"revoked"});return}if(qt.currentRevision!==Le.currentRevision||qt.chunkCount!==Le.chunkCount||qt.byteLength!==Le.byteLength){ee({status:"loading"});return}ee({status:"ready",metadata:Le,chunks:Ht})}catch(Ht){if(ce||xe!==ie)return;let In=nt(Ht);ee({status:In.status==="permission-denied"?"revoked":"error",error:In})}},be=_u(I(V),()=>bf(Q,{includeMetadataChanges:!0},he=>{ie+=1,ge(he,ie)},he=>{let xe=nt(he);ee({status:xe.status==="permission-denied"?"revoked":xe.status,error:xe})}),he=>{let xe=nt(he);ee({status:xe.status==="permission-denied"?"revoked":xe.status,error:xe})});return()=>{ce=!0,ie+=1,be()}}return{observeAuth:V=>_u(v,()=>Fl(f,M=>{V(M),M&&m(M).catch(()=>{})},M=>V(null,M)),M=>V(null,M)),getAdminAccess:async V=>{await I(V);let M=await er(Ie());return await I(V),{isAdmin:M.exists()&&M.data().adminUid===V}},listAdminAccounts:async(V,M="")=>{await b(V);let W=[E_(uu()),__(50)];M&&W.push(w_(Cs(M)));let Q=await Eu(Zo(gs(g,"accountProfiles"),...W)),ce=await Promise.all(Q.docs.map(async ie=>{let[ee,ge]=await Promise.all([er(Pe(ie.id)),er(De(ie.id))]),be=ie.data();return Object.freeze({uid:ie.id,name:String(be.name||""),email:String(be.email||""),maxWorkspaces:yu(ee.exists()?ee.data():null),allowanceUpdatedAt:ee.exists()?Du(ee.data().updatedAt):null,workspaceCount:ge.exists()?wu(ge.data()).length:null,isAdmin:ie.id===V})}));return await I(V),{accounts:ce,nextCursor:Q.size===50?Q.docs.at(-1).id:null}},setAccountLimit:async(V,M,W,Q)=>{await I(V),Lf(W),Cs(M),await vr(g,async ie=>{let[ee,ge,be]=await Promise.all([ie.get(Ie()),ie.get(Ce(M)),ie.get(Pe(M))]);if(await I(V),!ee.exists()||ee.data().adminUid!==V)throw new ue("Administrator access is required.","admin-required",{status:"permission-denied"});if(!ge.exists())throw new ue("This account is no longer in the directory. Refresh the list.","account-not-found");if((be.exists()?Du(be.data().updatedAt):null)!==Q)throw new ue("This allowance changed in another tab. Refresh before saving.","admin-conflict",{status:"conflict"});if(M===V&&W!==null)throw new ue("The administrator keeps unlimited access.","invalid-limit");ie.set(Pe(M),{schemaVersion:1,maxWorkspaces:W,updatedBy:V,updatedAt:cn()})});let ce=await er(Pe(M));return await I(V),{maxWorkspaces:yu(ce.data()),allowanceUpdatedAt:Du(ce.data().updatedAt)}},signInGoogle:async()=>(await v,S()),signOut:async()=>(await v,xl(f)),listWorkspaces:async V=>{await I(V);let M=Zo(gs(g,ta),mu("ownerId","==",V)),W=await Eu(M),Q=Fe(W);return W.metadata?.fromCache?{status:"offline",workspaces:Q}:{status:"ready",workspaces:Q}},watchOwnedWorkspaces:(V,M)=>{let W=Zo(gs(g,ta),mu("ownerId","==",V));return _u(I(V),()=>bf(W,{includeMetadataChanges:!0},Q=>{if(Q.metadata?.fromCache||Q.metadata?.hasPendingWrites){M({status:"loading",workspaces:[]});return}try{M({status:"ready",workspaces:Fe(Q)})}catch(ce){M({status:"error",error:nt(ce)})}},Q=>M({status:"error",error:nt(Q)})),Q=>M({status:"error",error:nt(Q)}))},createWorkspace:async(V,M,W="")=>{await I(V);let Q=W?ln(W):"",ce=async ge=>{await I(V);let be=i(),he=se(ge),xe=le({uid:V,encoded:M,revision:be,previousRevision:null,shared:!1});return await U({commit:()=>vr(g,async Le=>{let ut=await Le.get(De(V)),Ht;try{Ht=await Le.get(Pe(V))}catch(Tn){if(Tn?.code!=="permission-denied")throw Tn;await I(V)}let In=yu(Ht?.exists()?Ht.data():null);if(!ut.exists()&&!(await Eu(Zo(gs(g,ta),mu("ownerId","==",V)))).empty)throw new Rt("Cloud Workspace usage needs setup for this account. Existing maps are unchanged; keep this new map locally for now.","quota-uninitialized");let qt=ut.exists()?ut.data():null,br=R_(qt,ge,In);for(let Tn of M.chunks)Le.set(D(ge,be,Tn.index),C(Tn));Le.set(he,xe),Le.set(De(V),{schemaVersion:1,workspaceIds:br,lastWorkspaceId:ge,lastAction:"create",createdAt:qt?.createdAt||cn(),updatedAt:cn()})})}),fe(ge,{...xe,createdAt:te(),updatedAt:te()})};if(!Q){for(let ge=0;ge<3;ge+=1){let be=i();try{return await ce(be)}catch(he){if(!["permission-denied","workspace-id-collision"].includes(he?.code)||ge===2)throw he}}throw new ue("A new online workspace could not be created.","create-failed",{status:"error"})}let ie=async()=>{await I(V);let ge=await H(se(Q));if(await I(V),!ge.exists())return null;let be=It(Q,ge.data());if(be.ownerId!==V)throw new ue("This workspace ID is already in use by a different account. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});let he=await Je(Q,be);if(await I(V),he.json!==M.json)throw new ue("This workspace ID already contains a different map. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});return fe(Q,ge.data())},ee=null;for(let ge=0;ge<2;ge+=1)try{return await ce(Q)}catch(be){if(ee=be,["workspace-limit","quota-uninitialized","quota-invalid"].includes(be?.code))throw be;try{let he=await ie();if(he)return he}catch(he){if(he?.code==="workspace-id-collision")throw he;if(ge===1)throw ee}}throw ee||new ue("A new online workspace could not be created.","create-failed",{status:"error"})},saveWorkspace:async(V,M,W,Q)=>{await I(V);let ce=se(M),ie=kf();return vr(g,async ee=>{let ge=await ee.get(ce);if(!ge.exists())throw new ue("This online workspace no longer exists.","not-found",{status:"not-found"});let be=ge.data(),he=It(M,be);if(he.ownerId!==V)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(he.currentRevision!==Q)throw new Iu(Q,he.currentRevision);if(he.deleting)throw new ue("This workspace is being deleted. Retry deletion from the owner library.","delete-in-progress",{status:"delete-in-progress"});let xe=await Te(ee,M,he.currentRevision,he.chunkCount),Le=le({uid:V,encoded:W,revision:ie,previousRevision:he.currentRevision,shared:he.shared,createdAt:be.createdAt});for(let ut of W.chunks)ee.set(D(M,ie,ut.index),C(ut));for(let ut=0;ut<xe.length;ut+=1)xe[ut].exists()&&ee.delete(D(M,he.currentRevision,ut));return ee.update(ce,Le),fe(M,{...Le,createdAt:he.createdAt,updatedAt:te()})})},watchWorkspace:Bn,deleteWorkspace:async(V,M)=>{await I(V);let W=se(M),Q=!1;try{await vr(g,async ce=>{let ie=await ce.get(W);if(!ie.exists())return;let ee=It(M,ie.data());if(ee.ownerId!==V)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(ee.deleting){if(ee.shared)throw new ue("This workspace has an inconsistent deletion state. Contact support before retrying.","invalid-delete-state",{status:"invalid"});return}ce.update(W,{shared:!1,deleting:!0,updatedAt:cn()})}),Q=!0,await vr(g,async ce=>{let ie=await ce.get(W);if(!ie.exists())return;let ee=It(M,ie.data());if(ee.ownerId!==V)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(!ee.deleting||ee.shared)throw new ue("The workspace is no longer in a safe state for deletion.","invalid-delete-state",{status:"invalid"});let ge=await ce.get(De(V)),be=ge.exists()?ge.data():null,he=P_(be,M),xe=await Te(ce,M,ee.currentRevision,ee.chunkCount);for(let Le=0;Le<xe.length;Le+=1)xe[Le].exists()&&ce.delete(D(M,ee.currentRevision,Le));ce.delete(W),ce.update(De(V),{workspaceIds:he,lastWorkspaceId:M,lastAction:"delete",updatedAt:cn()})})}catch(ce){throw Q?new ue("Sharing was revoked, but deletion did not finish. Retry deletion to remove the stored graph.","delete-incomplete",{status:"delete-incomplete",cause:ce}):ce}},setShared:async(V,M,W)=>{await I(V);let Q=se(M);return await vr(g,async ce=>{let ie=await ce.get(Q);if(!ie.exists())throw new ue("This online workspace no longer exists.","not-found",{status:"not-found"});let ee=It(M,ie.data());if(ee.ownerId!==V)throw new ue("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(ee.deleting)throw new ue("This workspace is being deleted and cannot be shared.","delete-in-progress",{status:"delete-in-progress"});ce.update(Q,{shared:!!W,updatedAt:cn()})}),!!W},getCurrentUser:()=>f.currentUser}}function YA(){let n=()=>Promise.reject(new ue("Online workspaces are not configured in this build.","disabled",{status:"disabled"}));return{observeAuth:e=>(queueMicrotask(()=>e(null)),()=>{}),getAdminAccess:n,listAdminAccounts:n,setAccountLimit:n,signInGoogle:n,signOut:n,listWorkspaces:n,watchOwnedWorkspaces:(e,t)=>(queueMicrotask(()=>t({status:"disabled",workspaces:[]})),()=>{}),createWorkspace:n,saveWorkspace:n,watchWorkspace:(e,t,r)=>(queueMicrotask(()=>r({status:"error",error:new ue("Online workspaces are not configured in this build.","disabled",{status:"disabled"})})),()=>{}),deleteWorkspace:n,setShared:n,getCurrentUser:()=>null}}function XA({config:n=ea,app:e,auth:t,db:r,adapter:s,baseUrl:i}={}){let o=Rf(n),c;s?c=s:o.enabled?c=$A(n,{app:e,auth:t,db:r}):c=YA();let u=null,l=!1,h=null,f=0,g,v=new Promise(y=>{g=y}),I=new Set,S=new Set,U=new Set,H=()=>QA(u),se=y=>{try{y(H(),h)}catch{}},De=(y,C=null)=>{h=C?nt(C):null;let te=u?.uid||null,le=l;u=!h&&y&&typeof y.uid=="string"?y:null,l=!0;let fe=u?.uid||null;(!le||te!==fe)&&(f+=1),g(H());for(let Te of I)se(Te);if(le&&te!==fe){for(let Te of S)Te.restart();for(let Te of U)Te.restart()}else if(!le){for(let Te of S)Te.restart();for(let Te of U)Te.restart()}},Ce=()=>{};try{Ce=c.observeAuth((y,C)=>De(y,C))}catch(y){De(null,y)}let Pe=async()=>(l||await v,u),Ie=async()=>{let y=await Pe();if(h)throw h;if(!y||typeof y.uid!="string"||!y.uid)throw new ue("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated"});return{user:y,uid:y.uid,epoch:f}},b=y=>{if(f!==y.epoch||u?.uid!==y.uid)throw new ue("Your account changed while the request was running. Retry it from the current account.","account-changed",{status:"unauthenticated"})};function m(y,C=()=>{}){if(typeof y!="function")throw new TypeError("Auth observer callback must be a function.");let te=(le,fe)=>{fe?C(fe):y(le)};return I.add(te),l&&se(te),()=>I.delete(te)}function w(y){if(typeof y!="function")throw new TypeError("Workspace observer callback must be a function.");let C=!1,te=()=>{},le=0,fe=Fe=>{if(!C)try{y(Fe)}catch{}},Te={restart:async()=>{le+=1;let Fe=le;te(),te=()=>{};let Je=await Pe();if(C||le!==Fe)return;if(!Je?.uid){fe({status:"unauthenticated",workspaces:[]});return}let Bn=f;try{te=c.watchOwnedWorkspaces(Je.uid,V=>{if(!(C||le!==Fe||Bn!==f)){if(V?.status==="error"){fe({status:"error",error:nt(V.error),workspaces:[]});return}if(V?.status==="loading"){fe({status:"loading",workspaces:Array.isArray(V.workspaces)?V.workspaces:[]});return}if(V?.status==="offline"){fe({status:"offline",workspaces:Array.isArray(V.workspaces)?V.workspaces:[]});return}try{let M=Array.isArray(V?.workspaces)?V.workspaces.map(W=>hi(W?.id?It(W.id,W):It(W?.id,W?.data))):[];fe({status:"ready",workspaces:M})}catch(M){fe({status:"error",error:nt(M),workspaces:[]})}}})}catch(V){fe({status:nt(V).status,error:nt(V),workspaces:[]})}},stop:()=>{C=!0,le+=1,te(),S.delete(Te)}};return S.add(Te),Te.restart(),Te.stop}function A(y,C){let te=ln(y?.workspaceId||y?.sharedId);if(typeof C!="function")throw new TypeError("Workspace observer callback must be a function.");let le=!1,fe=()=>{},Te=0,Fe=Bn=>{if(!le)try{C(Bn)}catch{}},Je={restart:async()=>{Te+=1;let Bn=Te;fe(),fe=()=>{};let V=await Pe();if(le||Te!==Bn)return;let M=f;Fe({status:"loading"});try{fe=c.watchWorkspace(V?.uid||null,te,W=>{if(!(le||Te!==Bn||M!==f)){if(W?.status==="ready"){try{let Q=It(te,W.metadata),ce=Q.ownerId===u?.uid;if(!Q.shared&&!ce){Fe({status:"revoked"});return}let ie=W.chunks?.graph?W.chunks:xf({chunks:W.chunks,chunkCount:Q.chunkCount,byteLength:Q.byteLength});Fe({status:"ready",workspace:hi(Q),graph:ie.graph})}catch(Q){Fe({status:"error",error:nt(Q)})}return}if(W?.status==="error"){let Q=nt(W.error);Fe({status:Q.status==="permission-denied"?"revoked":Q.status,error:Q});return}if(["deleted","revoked","offline","loading","unauthenticated","disabled"].includes(W?.status)){Fe({status:W.status,error:W.error?nt(W.error):void 0});return}Fe({status:"error",error:new ue("The online workspace returned an unknown status.","invalid-response",{status:"error"})})}})}catch(W){let Q=nt(W);Fe({status:Q.status,error:Q})}},stop:()=>{le=!0,Te+=1,fe(),U.delete(Je)}};return U.add(Je),Je.restart(),Je.stop}let D=async y=>{try{let C=await Ie(),te=await y(C);return b(C),te}catch(C){throw nt(C)}};return Object.freeze({configStatus:o,onAuthStateChanged:m,signInWithGoogle:async()=>{try{let y=await c.signInGoogle();return De(y?.user||y),H()}catch(y){throw nt(y)}},signOut:async()=>{try{await c.signOut(),De(null)}catch(y){throw nt(y)}},listWorkspaces:()=>D(async({uid:y})=>{let C=await c.listWorkspaces(y);if(C?.status==="offline")return Object.freeze({status:"offline",workspaces:Array.isArray(C.workspaces)?C.workspaces:[]});let te=Array.isArray(C?.workspaces)?C.workspaces.map(le=>hi(le?.id?It(le.id,le):hi(le))):[];return Object.freeze({status:"ready",workspaces:te})}),getAdminAccess:()=>D(({uid:y})=>c.getAdminAccess(y)),listAdminAccounts:({afterUid:y=""}={})=>D(({uid:C})=>c.listAdminAccounts(C,y)),setAccountLimit:({targetUid:y,maxWorkspaces:C,expectedUpdatedAt:te,expectedAdminUid:le}={})=>D(({uid:fe})=>{if(fe!==le)throw new ue("Your account changed. Refresh before updating access.","account-changed",{status:"unauthenticated"});if(Cs(y),Lf(C),te!==null&&typeof te!="string")throw new ue("Refresh the account allowance before saving.","invalid-limit");return c.setAccountLimit(fe,y,C,te)}),watchOwnedWorkspaces:w,createWorkspace:({name:y,graph:C,workspaceId:te,expectedOwnerUid:le}={})=>D(async({uid:fe})=>{if(le&&String(le)!==fe)throw new ue("Your account changed before this map could be saved. Sign in to the account that started the save and retry.","account-changed",{status:"unauthenticated"});let Te=Ff(C,{name:y}),Fe=te?ln(te):"",Je=await c.createWorkspace(fe,Te,Fe);return hi(It(Je.id,Je))}),saveWorkspace:({workspaceId:y,graph:C,expectedRevision:te}={})=>D(async({uid:le})=>{let fe=ln(y),Te=ln(te),Fe=Ff(C),Je=await c.saveWorkspace(le,fe,Fe,Te);return hi(It(fe,Je))}),watchWorkspace:A,deleteWorkspace:y=>D(async({uid:C})=>{let te=ln(y);await c.deleteWorkspace(C,te)}),setShared:({workspaceId:y,enabled:C}={})=>D(async({uid:te})=>{let le=ln(y);if(typeof C!="boolean")throw new ue("Sharing state must be enabled or disabled.","invalid-sharing-state",{status:"invalid"});if(!await c.setShared(te,le,C))return null;let Te=i||globalThis.location?.href;return Object.freeze({sharedId:le,viewUrl:S_(le,Te)})}),dispose:()=>{for(let y of S)y.stop();for(let y of U)y.stop();I.clear(),Ce()}})}export{Iu as CloudConflictError,ue as CloudServiceError,XA as createCloudService,ea as firebaseConfig,Rf as getCloudConfigStatus,Sf as isCloudConfigured};
