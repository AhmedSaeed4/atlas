var Ep=()=>{};/**
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
 */var wp=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},J_=function(n){let e=[],t=0,r=0;for(;t<n.length;){let s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){let i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){let i=n[t++],o=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{let i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},yp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){let i=n[s],o=s+1<n.length,c=o?n[s+1]:0,u=s+2<n.length,l=u?n[s+2]:0,h=i>>2,f=(i&3)<<4|c>>4,C=(c&15)<<2|l>>6,v=l&63;u||(v=64,o||(C=64)),r.push(t[h],t[f],t[C],t[v])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(wp(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):J_(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){let i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;let l=s<n.length?t[n.charAt(s)]:64;++s;let f=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||l==null||f==null)throw new Au;let C=i<<2|c>>4;if(r.push(C),l!==64){let v=c<<4&240|l>>2;if(r.push(v),f!==64){let R=l<<6&192|f;r.push(R)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},Au=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},K_=function(n){let e=wp(n);return yp.encodeByteArray(e,!0)},fi=function(n){return K_(n).replace(/\./g,"")},ea=function(n){try{return yp.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Dp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */var z_=()=>Dp().__FIREBASE_DEFAULTS__,W_=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Q_=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&ea(n[1]);return e&&JSON.parse(e)},ta=()=>{try{return Ep()||z_()||W_()||Q_()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ip=n=>ta()?.emulatorHosts?.[n],Tp=n=>{let e=Ip(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},bu=()=>ta()?.config,Ap=n=>ta()?.[`_${n}`];/**
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
 */var is=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};/**
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
 */function vp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[fi(JSON.stringify(t)),fi(JSON.stringify(o)),""].join(".")}/**
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
 */function Xe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function bp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Xe())}function $_(){let n=ta()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Sp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Rp(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Pp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Np(){let n=Xe();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Op(){return!$_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Su(){try{return typeof indexedDB=="object"}catch{return!1}}function kp(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
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
 */var Y_="FirebaseError",At=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Y_,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fn.prototype.create)}},fn=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?X_(i,r):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new At(s,c,r)}};function X_(n,e){try{let t=0,r="";for(;t<n.length;){let s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}let i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}let o=n.substring(s+2,i),c=e[o];r+=n.substring(t,s)+(c!=null?String(c):`<${o}?>`),t=i+1}return r}catch{return n}}/**
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
 */function Fp(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function rn(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let s of t){if(!r.includes(s))return!1;let i=n[s],o=e[s];if(_p(i)&&_p(o)){if(!rn(i,o))return!1}else if(i!==o)return!1}for(let s of r)if(!t.includes(s))return!1;return!0}function _p(n){return n!==null&&typeof n=="object"}/**
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
 */function os(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function as(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function cs(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
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
 */function xp(n,e){let t=new vu(n,e);return t.subscribe.bind(t)}var vu=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Z_(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Tu),s.error===void 0&&(s.error=Tu),s.complete===void 0&&(s.complete=Tu);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function Z_(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Tu(){}/**
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
 */var xA=14400*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */function Ve(n){return n&&n._delegate?n._delegate:n}/**
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
 */function mr(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function na(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */var xt=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
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
 */var Er="[DEFAULT]";/**
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
 */var Ru=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new is;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(tw(e))try{this.getOrInitializeService({instanceIdentifier:Er})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Er){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Er){return this.instances.has(e)}getOptions(e=Er){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[i,o]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(i);r===c&&o.resolve(s)}return s}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);let i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ew(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Er){return this.component?this.component.multipleInstances?e:Er:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function ew(n){return n===Er?void 0:n}function tw(n){return n.instantiationMode==="EAGER"}/**
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
 */var ra=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Ru(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
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
 */var nw=[],fe;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(fe||(fe={}));var rw={debug:fe.DEBUG,verbose:fe.VERBOSE,info:fe.INFO,warn:fe.WARN,error:fe.ERROR,silent:fe.SILENT},sw=fe.INFO,iw={[fe.DEBUG]:"log",[fe.VERBOSE]:"log",[fe.INFO]:"info",[fe.WARN]:"warn",[fe.ERROR]:"error"},ow=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),s=iw[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},Jn=class{constructor(e){this.name=e,this._logLevel=sw,this._logHandler=ow,this._userLogHandler=null,nw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in fe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?rw[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,fe.DEBUG,...e),this._logHandler(this,fe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,fe.VERBOSE,...e),this._logHandler(this,fe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,fe.INFO,...e),this._logHandler(this,fe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,fe.WARN,...e),this._logHandler(this,fe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,fe.ERROR,...e),this._logHandler(this,fe.ERROR,...e)}};var aw=(n,e)=>e.some(t=>n instanceof t),Lp,Vp;function cw(){return Lp||(Lp=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function uw(){return Vp||(Vp=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Mp=new WeakMap,Nu=new WeakMap,Gp=new WeakMap,Pu=new WeakMap,ku=new WeakMap;function lw(n){let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",o)},i=()=>{t(sn(n.result)),s()},o=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Mp.set(t,n)}).catch(()=>{}),ku.set(e,n),e}function Bw(n){if(Nu.has(n))return;let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",o),n.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",o),n.addEventListener("abort",o)});Nu.set(n,e)}var Ou={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Nu.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Gp.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return sn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Up(n){Ou=n(Ou)}function hw(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(sa(this),e,...t);return Gp.set(r,e.sort?e.sort():[e]),sn(r)}:uw().includes(n)?function(...e){return n.apply(sa(this),e),sn(Mp.get(this))}:function(...e){return sn(n.apply(sa(this),e))}}function dw(n){return typeof n=="function"?hw(n):(n instanceof IDBTransaction&&Bw(n),aw(n,cw())?new Proxy(n,Ou):n)}function sn(n){if(n instanceof IDBRequest)return lw(n);if(Pu.has(n))return Pu.get(n);let e=dw(n);return e!==n&&(Pu.set(n,e),ku.set(e,n)),e}var sa=n=>ku.get(n);function qp(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){let o=indexedDB.open(n,e),c=sn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(sn(o.result),u.oldVersion,u.newVersion,sn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}var fw=["get","getKey","getAll","getAllKeys","count"],pw=["put","add","delete","clear"],Fu=new Map;function Hp(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Fu.get(e))return Fu.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,s=pw.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||fw.includes(t)))return;let i=async function(o,...c){let u=this.transaction(o,s?"readwrite":"readonly"),l=u.store;return r&&(l=l.index(c.shift())),(await Promise.all([l[t](...c),s&&u.done]))[0]};return Fu.set(e,i),i}Up(n=>({...n,get:(e,t,r)=>Hp(e,t)||n.get(e,t,r),has:(e,t)=>!!Hp(e,t)||n.has(e,t)}));/**
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
 */var Lu=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(gw(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function gw(n){return n.getComponent()?.type==="VERSION"}var Vu="@firebase/app",jp="0.16.2";/**
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
 */var gn=new Jn("@firebase/app"),Cw="@firebase/app-compat",mw="@firebase/analytics-compat",Ew="@firebase/analytics",_w="@firebase/app-check-compat",ww="@firebase/app-check",yw="@firebase/auth",Dw="@firebase/auth-compat",Iw="@firebase/database",Tw="@firebase/data-connect",Aw="@firebase/database-compat",vw="@firebase/functions",bw="@firebase/functions-compat",Sw="@firebase/installations",Rw="@firebase/installations-compat",Pw="@firebase/messaging",Nw="@firebase/messaging-compat",Ow="@firebase/performance",kw="@firebase/performance-compat",Fw="@firebase/remote-config",xw="@firebase/remote-config-compat",Lw="@firebase/storage",Vw="@firebase/storage-compat",Mw="@firebase/firestore",Gw="@firebase/ai",Uw="@firebase/firestore-compat",Hw="firebase",qw="12.19.0";/**
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
 */var Mu="[DEFAULT]",jw={[Vu]:"fire-core",[Cw]:"fire-core-compat",[Ew]:"fire-analytics",[mw]:"fire-analytics-compat",[ww]:"fire-app-check",[_w]:"fire-app-check-compat",[yw]:"fire-auth",[Dw]:"fire-auth-compat",[Iw]:"fire-rtdb",[Tw]:"fire-data-connect",[Aw]:"fire-rtdb-compat",[vw]:"fire-fn",[bw]:"fire-fn-compat",[Sw]:"fire-iid",[Rw]:"fire-iid-compat",[Pw]:"fire-fcm",[Nw]:"fire-fcm-compat",[Ow]:"fire-perf",[kw]:"fire-perf-compat",[Fw]:"fire-rc",[xw]:"fire-rc-compat",[Lw]:"fire-gcs",[Vw]:"fire-gcs-compat",[Mw]:"fire-fst",[Uw]:"fire-fst-compat",[Gw]:"fire-vertex","fire-js":"fire-js",[Hw]:"fire-js-all"};/**
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
 */var pi=new Map,Jw=new Map,Gu=new Map;function Jp(n,e){try{n.container.addComponent(e)}catch(t){gn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Kn(n){let e=n.name;if(Gu.has(e))return gn.debug(`There were multiple attempts to register component ${e}.`),!1;Gu.set(e,n);for(let t of pi.values())Jp(t,n);for(let t of Jw.values())Jp(t,n);return!0}function Ci(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function vt(n){return n==null?!1:n.settings!==void 0}/**
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
 */var Kw={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pn=new fn("app","Firebase",Kw);/**
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
 */var Uu=class{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new xt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pn.create("app-deleted",{appName:this._name})}};/**
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
 */var zn=qw;function ju(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r={name:Mu,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw pn.create("bad-app-name",{appName:String(s)});if(t||(t=bu()),!t)throw pn.create("no-options");let i=pi.get(s);if(i)if(rn(t,i.options)){if(rn(r,i.config))return i;throw pn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw pn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});let o=new ra(s);for(let u of Gu.values())o.addComponent(u);let c=new Uu(t,r,o);return pi.set(s,c),c}function Ju(n=Mu){let e=pi.get(n);if(!e&&n===Mu&&bu())return ju();if(!e)throw pn.create("no-app",{appName:n});return e}function Qp(){return Array.from(pi.values())}function Kt(n,e,t){let r=jw[n]??n;t&&(r+=`-${t}`);let s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){let o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),gn.warn(o.join(" "));return}Kn(new xt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */var zw="firebase-heartbeat-database",Ww=1,gi="firebase-heartbeat-store",xu=null;function $p(){return xu||(xu=qp(zw,Ww,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(gi)}catch(t){console.warn(t)}}}}).catch(n=>{throw pn.create("idb-open",{originalErrorMessage:n.message})})),xu}async function Qw(n){try{let t=(await $p()).transaction(gi),r=await t.objectStore(gi).get(Yp(n));return await t.done,r}catch(e){if(e instanceof At)gn.warn(e.message);else{let t=pn.create("idb-get",{originalErrorMessage:e?.message});gn.warn(t.message)}}}async function Kp(n,e){try{let r=(await $p()).transaction(gi,"readwrite");await r.objectStore(gi).put(e,Yp(n)),await r.done}catch(t){if(t instanceof At)gn.warn(t.message);else{let r=pn.create("idb-set",{originalErrorMessage:t?.message});gn.warn(r.message)}}}function Yp(n){return`${n.name}!${n.options.appId}`}/**
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
 */var $w=1024,Yw=30,Hu=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new qu(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=zp();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>Yw){let s=Zw(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){gn.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=zp(),{heartbeatsToSend:t,unsentEntries:r}=Xw(this._heartbeatsCache.heartbeats),s=fi(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return gn.warn(e),""}}};function zp(){return new Date().toISOString().substring(0,10)}function Xw(n,e=$w){let t=[],r=n.slice();for(let s of n){let i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Wp(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Wp(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var qu=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Su()?kp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await Qw(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Kp(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Kp(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function Wp(n){return fi(JSON.stringify({version:2,heartbeats:n})).length}function Zw(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
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
 */function ey(n){Kn(new xt("platform-logger",e=>new Lu(e),"PRIVATE")),Kn(new xt("heartbeat",e=>new Hu(e),"PRIVATE")),Kt(Vu,jp,n),Kt(Vu,jp,"esm2020"),Kt("fire-js","")}/**
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
 */ey("");/**
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
 */function pg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var gg=pg,Cg=new fn("auth","Firebase",pg());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ha=new Jn("@firebase/auth");function oa(n,...e){ha.logLevel<=fe.WARN&&ha.warn(`Auth (${zn}): ${n}`,...e)}function aa(n,...e){ha.logLevel<=fe.ERROR&&ha.error(`Auth (${zn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lt(n,...e){throw fl(n,...e)}function zt(n,...e){return fl(n,...e)}function Fa(n,e,t){let r={...gg(),[e]:t};return new fn("auth","Firebase",r).create(e,{appName:n.name})}function _r(n){return Fa(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ty(n,e,t){let r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Lt(n,"argument-error"),Fa(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function fl(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Cg.create(n,...e)}function ne(n,e,...t){if(!n)throw fl(e,...t)}function on(n){let e="INTERNAL ASSERTION FAILED: "+n;throw aa(e),new Error(e)}function mn(n,e){n||on(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(){return typeof self<"u"&&self.location?.href||""}function ny(){return Xp()==="http:"||Xp()==="https:"}function Xp(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ry(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ny()||Rp()||"connection"in navigator)?navigator.onLine:!0}function sy(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wr=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,mn(t>e,"Short delay should be less than long delay!"),this.isMobile=bp()||Pp()}get(){return ry()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(n,e){mn(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var da=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;on("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;on("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;on("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var iy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ay=new wr(3e4,6e4);function Ze(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function ot(n,e,t,r,s={}){return mg(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});let c=os({...o,key:n.config.apiKey}).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);let l={method:e,headers:u,...i};return Sp()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&mr(n.emulatorConfig.host)&&(l.credentials="include"),da.fetch()(await Eg(n,n.config.apiHost,t,c),l)})}async function mg(n,e,t){n._canInitEmulator=!1;let r={...iy,...e};try{let s=new Xu(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let o=await i.json();if("needConfirmation"in o)throw Ei(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{let c=i.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ei(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ei(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ei(n,"user-disabled",o);let h=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw Fa(n,h,l);Lt(n,h)}}catch(s){if(s instanceof At)throw s;Lt(n,"network-request-failed",{message:String(s)})}}async function vr(n,e,t,r,s={}){let i=await ot(n,e,t,r,s);return"mfaPendingCredential"in i&&Lt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Eg(n,e,t,r){let s=`${e}${t}?${r}`,i=n,o=i.config.emulator?pl(n.config,s):`${n.config.apiScheme}://${s}`;return oy.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function cy(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var Xu=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(zt(this.auth,"network-request-failed")),ay.get())})}};function Ei(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let s=zt(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zp(n){return n!==void 0&&n.enterprise!==void 0}var fa=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return cy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _g(n,e){return ot(n,"GET","/v2/recaptchaConfig",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uy(n,e){return ot(n,"POST","/v1/accounts:delete",e)}async function pa(n,e){return ot(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _i(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wg(n,e=!1){let t=Ve(n),r=await t.getIdToken(e),s=gl(r);ne(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let i=typeof s.firebase=="object"?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:r,authTime:_i(Ku(s.auth_time)),issuedAtTime:_i(Ku(s.iat)),expirationTime:_i(Ku(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}function Ku(n){return Number(n)*1e3}function gl(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return aa("JWT malformed, contained fewer than 3 sections"),null;try{let s=ea(t);return s?JSON.parse(s):(aa("Failed to decode base64 JWT payload"),null)}catch(s){return aa("Caught error parsing JWT payload as JSON",s?.toString()),null}}function eg(n){let e=gl(n);return ne(e,"internal-error"),ne(typeof e.exp<"u","internal-error"),ne(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ti(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof At&&ly(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function ly({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Zu=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ai=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=_i(this.lastLoginAt),this.creationTime=_i(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
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
 */async function ga(n){let e=n.auth,t=await n.getIdToken(),r=await Ti(n,pa(e,{idToken:t}));ne(r?.users.length,e,"internal-error");let s=r.users[0];n._notifyReloadListener(s);let i=s.providerUserInfo?.length?Dg(s.providerUserInfo):[],o=By(n.providerData,i),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!o?.length,l=c?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Ai(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,h)}async function yg(n){let e=Ve(n);await ga(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function By(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Dg(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hy(n,e){let t=await mg(n,{},async()=>{let r=os({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await Eg(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";let u={method:"POST",headers:c,body:r};return n.emulatorConfig&&mr(n.emulatorConfig.host)&&(u.credentials="include"),da.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function dy(n,e){return ot(n,"POST","/v2/accounts:revokeToken",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wi=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ne(e.idToken,"internal-error"),ne(typeof e.idToken<"u","internal-error"),ne(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):eg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ne(e.length!==0,"internal-error");let t=eg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ne(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:s,expiresIn:i}=await hy(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new n;return r&&(ne(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(ne(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(ne(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return on("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(n,e){ne(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var Qn=class n{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Zu(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ai(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await Ti(this,this.stsTokenManager.getToken(this.auth,e));return ne(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return wg(this,e)}reload(){return yg(this)}_assign(e){this!==e&&(ne(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){ne(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await ga(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(vt(this.auth.app))return Promise.reject(_r(this.auth));let e=await this.getIdToken();return await Ti(this,uy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:f,emailVerified:C,isAnonymous:v,providerData:R,stsTokenManager:S}=t;ne(f&&S,e,"internal-error");let G=wi.fromJSON(this.name,S);ne(typeof f=="string",e,"internal-error"),Wn(r,e.name),Wn(s,e.name),ne(typeof C=="boolean",e,"internal-error"),ne(typeof v=="boolean",e,"internal-error"),Wn(i,e.name),Wn(o,e.name),Wn(c,e.name),Wn(u,e.name),Wn(l,e.name),Wn(h,e.name);let U=new n({uid:f,auth:e,email:s,emailVerified:C,displayName:r,isAnonymous:v,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:G,createdAt:l,lastLoginAt:h});return R&&Array.isArray(R)&&(U.providerData=R.map(ae=>({...ae}))),u&&(U._redirectEventId=u),U}static async _fromIdTokenResponse(e,t,r=!1){let s=new wi;s.updateFromServerResponse(t);let i=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await ga(i),i}static async _fromGetAccountInfoResponse(e,t,r){let s=t.users[0];ne(s.localId!==void 0,"internal-error");let i=s.providerUserInfo!==void 0?Dg(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!i?.length,c=new wi;c.updateFromIdToken(r);let u=new n({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ai(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(u,l),u}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var tg=new Map;function Cn(n){mn(n instanceof Function,"Expected a class definition");let e=tg.get(n);return e?(mn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,tg.set(n,e),e)}/**
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
 */var Ca=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Ca.type="NONE";var el=Ca;/**
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
 */function ca(n,e,t){return`firebase:${n}:${e}:${t}`}var yi=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:s,name:i}=this.auth;this.fullUserKey=ca(this.userKey,s.apiKey,i),this.fullPersistenceKey=ca("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await pa(this.auth,{idToken:e}).catch(()=>{});return t?Qn._fromGetAccountInfoResponse(this.auth,t,e):null}return Qn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new n(Cn(el),e,r);let s=(await Promise.all(t.map(async l=>{try{if(await l._isAvailable())return l}catch{return}}))).filter(l=>l),i=s[0]||Cn(el),o=ca(r,e.config.apiKey,e.name),c=null;for(let l of t)try{let h=await l._get(o);if(h){let f;if(typeof h=="string"){let C=await pa(e,{idToken:h}).catch(()=>{});if(!C)break;f=await Qn._fromGetAccountInfoResponse(e,C,h)}else f=Qn._fromJSON(e,h);l!==i&&(c=f),i=l;break}}catch{}let u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new n(i,e,r):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new n(i,e,r))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ng(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(vg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ig(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Sg(e))return"Blackberry";if(Rg(e))return"Webos";if(Tg(e))return"Safari";if((e.includes("chrome/")||Ag(e))&&!e.includes("edge/"))return"Chrome";if(bg(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Ig(n=Xe()){return/firefox\//i.test(n)}function Tg(n=Xe()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ag(n=Xe()){return/crios\//i.test(n)}function vg(n=Xe()){return/iemobile/i.test(n)}function bg(n=Xe()){return/android/i.test(n)}function Sg(n=Xe()){return/blackberry/i.test(n)}function Rg(n=Xe()){return/webos/i.test(n)}function Cl(n=Xe()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function fy(n=Xe()){return Cl(n)&&!!window.navigator?.standalone}function py(){return Np()&&document.documentMode===10}function Pg(n=Xe()){return Cl(n)||bg(n)||Rg(n)||Sg(n)||/windows phone/i.test(n)||vg(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(n,e=[]){let t;switch(n){case"Browser":t=ng(Xe());break;case"Worker":t=`${ng(Xe())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${zn}/${r}`}/**
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
 */var tl=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=i=>new Promise((o,c)=>{try{let u=e(i);o(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};/**
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
 */async function gy(n,e={}){return ot(n,"GET","/v2/passwordPolicy",Ze(n,e))}/**
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
 */var Cy=6,nl=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Cy,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rl=class{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ma(this),this.idTokenSubscription=new ma(this),this.beforeStateQueue=new tl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Cg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Cn(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await yi.create(this,e)}catch(r){oa(`Failed to initialize persistence: ${r}`),this.persistenceManager=await yi.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(r){oa(`Failed to initialize current user: ${r}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await pa(this,{idToken:e}),r=await Qn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(vt(this.app)){let i=this.app.settings.authIdToken;return i?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=this.redirectUser?._redirectEventId,o=r?._redirectEventId,c=await this.tryRedirectSignIn(e);(!i||i===o)&&c?.user&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return ne(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ga(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=sy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(vt(this.app))return Promise.reject(_r(this));let t=e?Ve(e):null;return t&&ne(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ne(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return vt(this.app)?Promise.reject(_r(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return vt(this.app)?Promise.reject(_r(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Cn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await gy(this),t=new nl(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new fn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await dy(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&Cn(e)||this._popupRedirectResolver;ne(t,this,"argument-error"),this.redirectPersistenceManager=await yi.create(this,[Cn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};let i=typeof t=="function"?t:t.next.bind(t),o=!1,c=this._isInitialized?Promise.resolve():this._initializationPromise;if(ne(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}).catch(u=>{if(!o)if(typeof t!="function"&&t.error)t.error(u);else if(r)r(u);else throw u}),typeof t=="function"){let u=e.addObserver(t,r,s);return()=>{o=!0,u()}}else{let u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){let r=t?.message||String(t),s=Fa(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ne(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ng(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(vt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&oa(`Error while retrieving App Check token: ${e.error}`),e?.token}};function Bs(n){return Ve(n)}var ma=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=xp(t=>this.observer=t)}get next(){return ne(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function my(n){xa=n}function Og(n){return xa.loadJS(n)}function Ey(){return xa.recaptchaEnterpriseScript}function _y(){return xa.gapiScript}function kg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sl=class{constructor(){this.enterprise=new il}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},il=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};/**
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
 */var wy="recaptcha-enterprise",Di="NO_RECAPTCHA",rg="onFirebaseAuthREInstanceReady",vi=class n{constructor(e){this.type=wy,this.auth=Bs(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{_g(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{let l=new fa(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){let u=window.grecaptcha;Zp(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(Di)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new sl().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async c=>{if(!t&&Zp(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Ey();u.length!==0&&(u+=c+`&onload=${rg}`),n.scriptInjectionDeferred=new is,window[rg]=()=>{n.scriptInjectionDeferred?.resolve()},Og(u).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{s(c,i,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}};vi.scriptInjectionDeferred=null;async function mi(n,e,t,r=!1,s=!1){let i=new vi(n),o;if(s)o=Di;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}let c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){let u=c.phoneEnrollmentInfo.phoneNumber,l=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){let u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Ii(n,e,t,r,s){if(s==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let i=await mi(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await mi(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(i)});else if(s==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let i=await mi(n,e,t);return r(n,i).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let c=await mi(n,e,t,!1,!0);return r(n,c)}return Promise.reject(o)})}else{let i=await mi(n,e,t,!1,!0);return r(n,i)}else return Promise.reject(s+" provider is not supported.")}async function yy(n){let e=Bs(n),t=await _g(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new fa(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new vi(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ml(n,e){let t=Ci(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),i=t.getOptions();if(rn(i,e??{}))return s;Lt(s,"already-initialized")}return t.initialize({options:e})}function Dy(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Cn);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yr=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return on("not implemented")}_getIdTokenResponse(e){return on("not implemented")}_linkToIdToken(e,t){return on("not implemented")}_getReauthenticationResolver(e){return on("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Iy(n,e){return ot(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ty(n,e){return vr(n,"POST","/v1/accounts:signInWithPassword",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ay(n,e){return vr(n,"POST","/v1/accounts:signInWithEmailLink",Ze(n,e))}async function vy(n,e){return vr(n,"POST","/v1/accounts:signInWithEmailLink",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bi=class n extends yr{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ii(e,t,"signInWithPassword",Ty,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Ay(e,{email:this._email,oobCode:this._password});default:Lt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Ii(e,r,"signUpPassword",Iy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return vy(e,{idToken:t,email:this._email,oobCode:this._password});default:Lt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function us(n,e){return vr(n,"POST","/v1/accounts:signInWithIdp",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var by="http://localhost",Dr=class n extends yr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Lt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;let o=new n(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return us(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,us(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,us(e,t)}buildRequest(){let e={requestUri:by,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=os(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sg(n,e){return ot(n,"POST","/v1/accounts:sendVerificationCode",Ze(n,e))}async function Sy(n,e){return vr(n,"POST","/v1/accounts:signInWithPhoneNumber",Ze(n,e))}async function Ry(n,e){let t=await vr(n,"POST","/v1/accounts:signInWithPhoneNumber",Ze(n,e));if(t.temporaryProof)throw Ei(n,"account-exists-with-different-credential",t);return t}var Py={USER_NOT_FOUND:"user-not-found"};async function Ny(n,e){let t={...e,operation:"REAUTH"};return vr(n,"POST","/v1/accounts:signInWithPhoneNumber",Ze(n,t),Py)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Si=class n extends yr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Sy(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Ry(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return Ny(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i}=e;return!r&&!t&&!s&&!i?null:new n({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function ky(n){let e=as(cs(n)).link,t=e?as(cs(e)).deep_link_id:null,r=as(cs(n)).deep_link_id;return(r?as(cs(r)).link:null)||r||t||e||n}var Ea=class n{constructor(e){let t=as(cs(e)),r=t.apiKey??null,s=t.oobCode??null,i=Oy(t.mode??null);ne(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=ky(e);try{return new n(t)}catch{return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ls=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return bi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=Ea.parseLink(t);return ne(r,"argument-error"),bi._fromEmailAndCode(e,r.code,r.tenantId)}};ls.PROVIDER_ID="password";ls.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ls.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ri=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
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
 */var Ir=class extends Ri{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pi=class n extends Ir{constructor(){super("facebook.com")}static credential(e){return Dr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Pi.FACEBOOK_SIGN_IN_METHOD="facebook.com";Pi.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Tr=class n extends Ir{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Dr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};Tr.GOOGLE_SIGN_IN_METHOD="google.com";Tr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ni=class n extends Ir{constructor(){super("github.com")}static credential(e){return Dr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Ni.GITHUB_SIGN_IN_METHOD="github.com";Ni.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Oi=class n extends Ir{constructor(){super("twitter.com")}static credential(e,t){return Dr._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};Oi.TWITTER_SIGN_IN_METHOD="twitter.com";Oi.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var ki=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){let i=await Qn._fromIdTokenResponse(e,r,s),o=ig(r);return new n({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let s=ig(r);return new n({user:e,providerId:s,_tokenResponse:r,operationType:t})}};function ig(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var ol=class n extends At{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new n(e,t,r,s)}};function Fg(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?ol._fromErrorAndOperation(n,i,e,r):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */async function Fy(n,e,t=!1){let r=await Ti(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return ki._forOperation(n,"link",r)}/**
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
 */async function xy(n,e,t=!1){let{auth:r}=n;if(vt(r.app))return Promise.reject(_r(r));let s="reauthenticate";try{let i=await Ti(n,Fg(r,s,e,n),t);ne(i.idToken,r,"internal-error");let o=gl(i.idToken);ne(o,r,"internal-error");let{sub:c}=o;return ne(n.uid===c,r,"user-mismatch"),ki._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&Lt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ly(n,e,t=!1){if(vt(n.app))return Promise.reject(_r(n));let r="signIn",s=await Fg(n,r,e),i=await ki._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */function El(n,e,t,r){return Ve(n).onAuthStateChanged(e,t,r)}function _l(n){return Ve(n).signOut()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */function og(n,e){return ot(n,"POST","/v2/accounts/mfaEnrollment:start",Ze(n,e))}function Vy(n,e){return ot(n,"POST","/v2/accounts/mfaEnrollment:finalize",Ze(n,e))}function My(n,e){return ot(n,"POST","/v2/accounts/mfaEnrollment:start",Ze(n,e))}function Gy(n,e){return ot(n,"POST","/v2/accounts/mfaEnrollment:finalize",Ze(n,e))}var _a="__sak";/**
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
 */var wa=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(_a,"1"),this.storage.removeItem(_a),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Uy=1e3,Hy=10,ya=class extends wa{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Pg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}let r=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);py()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Hy):s()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Uy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};ya.type="LOCAL";var wl=ya;/**
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
 */var qy=1e3;function zu(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function Wu(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var al=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=Wu(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:zu(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=Wu(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=Wu(e);if(window.cookieStore){let c=(l=>{let h=l.changed.find(C=>C.name===r);h&&t(h.value),l.deleted.find(C=>C.name===r)&&t(null)}),u=()=>window.cookieStore.removeEventListener("change",c);return this.listenerUnsubscribes.set(t,u),window.cookieStore.addEventListener("change",c)}let s=zu(r),i=setInterval(()=>{let c=zu(r);c!==s&&(t(c),s=c)},qy),o=()=>clearInterval(i);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};al.type="COOKIE";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Da=class extends wa{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};Da.type="SESSION";var xg=Da;/**
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
 */function jy(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */var Ia=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});let c=Array.from(o).map(async l=>l(t.origin,i)),u=await jy(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};Ia.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */var cl=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{let l=yl("",20);s.port1.start();let h=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(f){let C=f;if(C.data.eventId===l)switch(C.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(C.data.response);break;default:clearTimeout(h),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function an(){return window}function Jy(n){an().location.href=n}/**
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
 */function Lg(){return typeof an().WorkerGlobalScope<"u"&&typeof an().importScripts=="function"}async function Ky(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function zy(){return navigator?.serviceWorker?.controller||null}function Wy(){return Lg()?self:null}/**
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
 */var Vg="firebaseLocalStorageDb",Qy=1,Ta="firebaseLocalStorage",Mg="fbase_key",Ar=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function La(n,e){return n.transaction([Ta],e?"readwrite":"readonly").objectStore(Ta)}function $y(){let n=indexedDB.deleteDatabase(Vg);return new Ar(n).toPromise()}function Gg(){let n=indexedDB.open(Vg,Qy);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(Ta,{keyPath:Mg})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(Ta)?e(r):(r.close(),await $y(),e(await Gg()))})})}async function ag(n,e,t){let r=La(n,!0).put({[Mg]:e,value:t});return new Ar(r).toPromise()}async function Yy(n,e){let t=La(n,!1).get(e),r=await new Ar(t).toPromise();return r===void 0?null:r.value}function cg(n,e){let t=La(n,!0).delete(e);return new Ar(t).toPromise()}var Xy=800,Zy=3,Aa=class{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Gg(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>Zy)throw r;if(this.dbPromise){let s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return Lg()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ia._getInstance(Wy()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await Ky(),!this.activeServiceWorker)return;this.sender=new cl(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||zy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await ag(e,_a,"1"),await cg(e,_a)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>ag(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>Yy(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>cg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(s=>{let i=La(s,!1).getAll();return new Ar(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||oa(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Xy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}};Aa.type="LOCAL";var Dl=Aa;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ug(n,e){return ot(n,"POST","/v2/accounts/mfaSignIn:start",Ze(n,e))}function eD(n,e){return ot(n,"POST","/v2/accounts/mfaSignIn:finalize",Ze(n,e))}function tD(n,e){return ot(n,"POST","/v2/accounts/mfaSignIn:finalize",Ze(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var iv=kg("rcb"),ov=new wr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ua="recaptcha";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nD(n,e,t){if(!n._getRecaptchaConfig())try{await yy(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){let s=r.session;if("phoneNumber"in r){ne(s.type==="enroll",n,"internal-error");let i={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Ii(n,i,"mfaSmsEnrollment",async(l,h)=>{if(h.phoneEnrollmentInfo.captchaResponse===Di){ne(t?.type===ua,l,"argument-error");let f=await Qu(l,h,t);return og(l,f)}return og(l,h)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{ne(s.type==="signin",n,"internal-error");let i=r.multiFactorHint?.uid||r.multiFactorUid;ne(i,n,"missing-multi-factor-info");let o={mfaPendingCredential:s.credential,mfaEnrollmentId:i,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Ii(n,o,"mfaSmsSignIn",async(h,f)=>{if(f.phoneSignInInfo.captchaResponse===Di){ne(t?.type===ua,h,"argument-error");let C=await Qu(h,f,t);return ug(h,C)}return ug(h,f)},"PHONE_PROVIDER").catch(h=>Promise.reject(h))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Ii(n,s,"sendVerificationCode",async(u,l)=>{if(l.captchaResponse===Di){ne(t?.type===ua,u,"argument-error");let h=await Qu(u,l,t);return sg(u,h)}return sg(u,l)},"PHONE_PROVIDER").catch(u=>Promise.reject(u))).sessionInfo}}finally{t?._reset()}}async function Qu(n,e,t){ne(t.type===ua,n,"argument-error");let r=await t.verify();ne(typeof r=="string",n,"argument-error");let s={...e};if("phoneEnrollmentInfo"in s){let i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,c=s.phoneEnrollmentInfo.clientType,u=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:r,captchaResponse:o,clientType:c,recaptchaVersion:u}}),s}else if("phoneSignInInfo"in s){let i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,c=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:i,clientType:o,recaptchaVersion:c}}),s}else return Object.assign(s,{recaptchaToken:r}),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fi=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=Bs(e)}verifyPhoneNumber(e,t){return nD(this.auth,e,Ve(t))}static credential(e,t){return Si._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?Si._fromTokenResponse(t,r):null}};Fi.PROVIDER_ID="phone";Fi.PHONE_SIGN_IN_METHOD="phone";/**
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
 */function Ug(n,e){return e?Cn(e):(ne(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */var xi=class extends yr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return us(e,this._buildIdpRequest())}_linkToIdToken(e,t){return us(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return us(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function rD(n){return Ly(n.auth,new xi(n),n.bypassAuthState)}function sD(n){let{auth:e,user:t}=n;return ne(t,e,"internal-error"),xy(t,new xi(n),n.bypassAuthState)}async function iD(n){let{auth:e,user:t}=n;return ne(t,e,"internal-error"),Fy(t,new xi(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var va=class{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}let u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return rD;case"linkViaPopup":case"linkViaRedirect":return iD;case"reauthViaPopup":case"reauthViaRedirect":return sD;default:Lt(this.auth,"internal-error")}}resolve(e){mn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){mn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oD=new wr(2e3,1e4);async function Il(n,e,t){if(vt(n.app))return Promise.reject(zt(n,"operation-not-supported-in-this-environment"));let r=Bs(n);ty(n,e,Ri);let s=Ug(r,t);return new ba(r,"signInViaPopup",e,s).executeNotNull()}var ba=class n extends va{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return ne(e,this.auth,"internal-error"),e}async onExecution(){mn(this.filter.length===1,"Popup operations only handle one event");let e=yl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(zt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(zt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(zt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,oD.get())};e()}};ba.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var aD="pendingRedirect",la=new Map,ul=class extends va{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=la.get(this.auth._key());if(!e){try{let r=await cD(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}la.set(this.auth._key(),e)}return this.bypassAuthState||la.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function cD(n,e){let t=BD(e),r=lD(n);if(!await r._isAvailable())return!1;let s=await r._get(t)==="true";return await r._remove(t),s}function uD(n,e){la.set(n._key(),e)}function lD(n){return Cn(n._redirectPersistence)}function BD(n){return ca(aD,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hD(n,e,t=!1){if(vt(n.app))return Promise.reject(_r(n));let r=Bs(n),s=Ug(r,e),o=await new ul(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dD=600*1e3,ll=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!fD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!Hg(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(zt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=dD&&this.cachedEventUids.clear(),this.cachedEventUids.has(lg(e))}saveEventToCache(e){this.cachedEventUids.add(lg(e)),this.lastProcessedEventTime=Date.now()}};function lg(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Hg({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function fD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Hg(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pD(n,e={}){return ot(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,CD=/^https?/;async function mD(n){if(n.config.emulator)return;let{authorizedDomains:e}=await pD(n);for(let t of e)try{if(ED(t))return}catch{}Lt(n,"unauthorized-domain")}function ED(n){let e=Yu(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!CD.test(t))return!1;if(gD.test(n))return r===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */var _D=new wr(3e4,6e4);function Bg(){let n=an().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function wD(n){return new Promise((e,t)=>{function r(){Bg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Bg(),t(zt(n,"network-request-failed"))},timeout:_D.get()})}if(an().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(an().gapi?.load)r();else{let s=kg("iframefcb");return an()[s]=()=>{gapi.load?r():t(zt(n,"network-request-failed"))},Og(`${_y()}?onload=${s}`).catch(i=>t(i))}}).catch(e=>{throw Ba=null,e})}var Ba=null;function yD(n){return Ba=Ba||wD(n),Ba}/**
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
 */var DD=new wr(5e3,15e3),ID="__/auth/iframe",TD="emulator/auth/iframe",AD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},vD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function bD(n){let e=n.config;ne(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?pl(e,TD):`https://${n.config.authDomain}/${ID}`,r={apiKey:e.apiKey,appName:n.name,v:zn},s=vD.get(n.config.apiHost);s&&(r.eid=s);let i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${os(r).slice(1)}`}async function SD(n){let e=await yD(n),t=an().gapi;return ne(t,n,"internal-error"),e.open({where:document.body,url:bD(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:AD,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});let o=zt(n,"network-request-failed"),c=an().setTimeout(()=>{i(o)},DD.get());function u(){an().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
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
 */var RD={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},PD=500,ND=600,OD="_blank",kD="http://localhost",Sa=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function FD(n,e,t,r=PD,s=ND){let i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),c="",u={...RD,width:r.toString(),height:s.toString(),top:i,left:o},l=Xe().toLowerCase();t&&(c=Ag(l)?OD:t),Ig(l)&&(e=e||kD,u.scrollbars="yes");let h=Object.entries(u).reduce((C,[v,R])=>`${C}${v}=${R},`,"");if(fy(l)&&c!=="_self")return xD(e||"",c),new Sa(null);let f=window.open(e||"",c,h);ne(f,n,"popup-blocked");try{f.focus()}catch{}return new Sa(f)}function xD(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */var LD="__/auth/handler",VD="emulator/auth/handler",MD=encodeURIComponent("fac");async function hg(n,e,t,r,s,i){ne(n.config.authDomain,n,"auth-domain-config-required"),ne(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:zn,eventId:s};if(e instanceof Ri){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Fp(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[h,f]of Object.entries(i||{}))o[h]=f}if(e instanceof Ir){let h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);let c=o;for(let h of Object.keys(c))c[h]===void 0&&delete c[h];let u=await n._getAppCheckToken(),l=u?`#${MD}=${encodeURIComponent(u)}`:"";return`${GD(n)}?${os(c).slice(1)}${l}`}function GD({config:n}){return n.emulator?pl(n,VD):`https://${n.authDomain}/${LD}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $u="webStorageSupport",Bl=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=xg,this._completeRedirectFn=hD,this._overrideRedirectResult=uD}async _openPopup(e,t,r,s){mn(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let i=await hg(e,t,r,Yu(),s);return FD(e,i,yl())}async _openRedirect(e,t,r,s){await this._originValidation(e);let i=await hg(e,t,r,Yu(),s);return Jy(i),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(mn(i,"If manager is not set, promise should be"),i)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await SD(e),r=new ll(e);return t.register("authEvent",s=>(ne(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send($u,{type:$u},s=>{let i=s?.[0]?.[$u];i!==void 0&&t(!!i),Lt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=mD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Pg()||Tg()||Cl()}},Tl=Bl,Ra=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return on("unexpected MultiFactorSessionType")}}},hl=class n extends Ra{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return Vy(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return eD(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},Pa=class{constructor(){}static assertion(e){return hl._fromCredential(e)}};Pa.FACTOR_ID="phone";var Na=class{static assertionForEnrollment(e,t){return Oa._fromSecret(e,t)}static assertionForSignIn(e,t){return Oa._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;ne(typeof t.user?.auth<"u","internal-error");let r=await My(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return ka._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}};Na.FACTOR_ID="totp";var Oa=class n extends Ra{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return ne(typeof this.secret<"u",e,"argument-error"),Gy(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){ne(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return tD(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},ka=class n{constructor(e,t,r,s,i,o,c){this.sessionInfo=o,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(ia(e)||ia(t))&&(r=!0),r&&(ia(e)&&(e=this.auth.currentUser?.email||"unknownuser"),ia(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function ia(n){return typeof n>"u"||n?.length===0}var dg="@firebase/auth",fg="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dl=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ne(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UD(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function HD(n){Kn(new xt("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;ne(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});let u={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ng(n)},l=new rl(r,s,i,u);return Dy(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Kn(new xt("auth-internal",e=>{let t=Bs(e.getProvider("auth").getImmediate());return(r=>new dl(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Kt(dg,fg,UD(n)),Kt(dg,fg,"esm2020")}/**
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
 */var qD=300,av=Ap("authIdTokenMaxAge")||qD;function jD(){return document.getElementsByTagName("head")?.[0]??document}my({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{let i=zt("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",jD().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});HD("Browser");var qg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},jg={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var En,Al;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,m){function w(){}w.prototype=m.prototype,A.F=m.prototype,A.prototype=new w,A.prototype.constructor=A,A.D=function(I,D,y){for(var p=Array(arguments.length-2),O=2;O<arguments.length;O++)p[O-2]=arguments[O];return m.prototype[D].apply(I,p)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,m,w){w||(w=0);let I=Array(16);if(typeof m=="string")for(var D=0;D<16;++D)I[D]=m.charCodeAt(w++)|m.charCodeAt(w++)<<8|m.charCodeAt(w++)<<16|m.charCodeAt(w++)<<24;else for(D=0;D<16;++D)I[D]=m[w++]|m[w++]<<8|m[w++]<<16|m[w++]<<24;m=A.g[0],w=A.g[1],D=A.g[2];let y=A.g[3],p;p=m+(y^w&(D^y))+I[0]+3614090360&4294967295,m=w+(p<<7&4294967295|p>>>25),p=y+(D^m&(w^D))+I[1]+3905402710&4294967295,y=m+(p<<12&4294967295|p>>>20),p=D+(w^y&(m^w))+I[2]+606105819&4294967295,D=y+(p<<17&4294967295|p>>>15),p=w+(m^D&(y^m))+I[3]+3250441966&4294967295,w=D+(p<<22&4294967295|p>>>10),p=m+(y^w&(D^y))+I[4]+4118548399&4294967295,m=w+(p<<7&4294967295|p>>>25),p=y+(D^m&(w^D))+I[5]+1200080426&4294967295,y=m+(p<<12&4294967295|p>>>20),p=D+(w^y&(m^w))+I[6]+2821735955&4294967295,D=y+(p<<17&4294967295|p>>>15),p=w+(m^D&(y^m))+I[7]+4249261313&4294967295,w=D+(p<<22&4294967295|p>>>10),p=m+(y^w&(D^y))+I[8]+1770035416&4294967295,m=w+(p<<7&4294967295|p>>>25),p=y+(D^m&(w^D))+I[9]+2336552879&4294967295,y=m+(p<<12&4294967295|p>>>20),p=D+(w^y&(m^w))+I[10]+4294925233&4294967295,D=y+(p<<17&4294967295|p>>>15),p=w+(m^D&(y^m))+I[11]+2304563134&4294967295,w=D+(p<<22&4294967295|p>>>10),p=m+(y^w&(D^y))+I[12]+1804603682&4294967295,m=w+(p<<7&4294967295|p>>>25),p=y+(D^m&(w^D))+I[13]+4254626195&4294967295,y=m+(p<<12&4294967295|p>>>20),p=D+(w^y&(m^w))+I[14]+2792965006&4294967295,D=y+(p<<17&4294967295|p>>>15),p=w+(m^D&(y^m))+I[15]+1236535329&4294967295,w=D+(p<<22&4294967295|p>>>10),p=m+(D^y&(w^D))+I[1]+4129170786&4294967295,m=w+(p<<5&4294967295|p>>>27),p=y+(w^D&(m^w))+I[6]+3225465664&4294967295,y=m+(p<<9&4294967295|p>>>23),p=D+(m^w&(y^m))+I[11]+643717713&4294967295,D=y+(p<<14&4294967295|p>>>18),p=w+(y^m&(D^y))+I[0]+3921069994&4294967295,w=D+(p<<20&4294967295|p>>>12),p=m+(D^y&(w^D))+I[5]+3593408605&4294967295,m=w+(p<<5&4294967295|p>>>27),p=y+(w^D&(m^w))+I[10]+38016083&4294967295,y=m+(p<<9&4294967295|p>>>23),p=D+(m^w&(y^m))+I[15]+3634488961&4294967295,D=y+(p<<14&4294967295|p>>>18),p=w+(y^m&(D^y))+I[4]+3889429448&4294967295,w=D+(p<<20&4294967295|p>>>12),p=m+(D^y&(w^D))+I[9]+568446438&4294967295,m=w+(p<<5&4294967295|p>>>27),p=y+(w^D&(m^w))+I[14]+3275163606&4294967295,y=m+(p<<9&4294967295|p>>>23),p=D+(m^w&(y^m))+I[3]+4107603335&4294967295,D=y+(p<<14&4294967295|p>>>18),p=w+(y^m&(D^y))+I[8]+1163531501&4294967295,w=D+(p<<20&4294967295|p>>>12),p=m+(D^y&(w^D))+I[13]+2850285829&4294967295,m=w+(p<<5&4294967295|p>>>27),p=y+(w^D&(m^w))+I[2]+4243563512&4294967295,y=m+(p<<9&4294967295|p>>>23),p=D+(m^w&(y^m))+I[7]+1735328473&4294967295,D=y+(p<<14&4294967295|p>>>18),p=w+(y^m&(D^y))+I[12]+2368359562&4294967295,w=D+(p<<20&4294967295|p>>>12),p=m+(w^D^y)+I[5]+4294588738&4294967295,m=w+(p<<4&4294967295|p>>>28),p=y+(m^w^D)+I[8]+2272392833&4294967295,y=m+(p<<11&4294967295|p>>>21),p=D+(y^m^w)+I[11]+1839030562&4294967295,D=y+(p<<16&4294967295|p>>>16),p=w+(D^y^m)+I[14]+4259657740&4294967295,w=D+(p<<23&4294967295|p>>>9),p=m+(w^D^y)+I[1]+2763975236&4294967295,m=w+(p<<4&4294967295|p>>>28),p=y+(m^w^D)+I[4]+1272893353&4294967295,y=m+(p<<11&4294967295|p>>>21),p=D+(y^m^w)+I[7]+4139469664&4294967295,D=y+(p<<16&4294967295|p>>>16),p=w+(D^y^m)+I[10]+3200236656&4294967295,w=D+(p<<23&4294967295|p>>>9),p=m+(w^D^y)+I[13]+681279174&4294967295,m=w+(p<<4&4294967295|p>>>28),p=y+(m^w^D)+I[0]+3936430074&4294967295,y=m+(p<<11&4294967295|p>>>21),p=D+(y^m^w)+I[3]+3572445317&4294967295,D=y+(p<<16&4294967295|p>>>16),p=w+(D^y^m)+I[6]+76029189&4294967295,w=D+(p<<23&4294967295|p>>>9),p=m+(w^D^y)+I[9]+3654602809&4294967295,m=w+(p<<4&4294967295|p>>>28),p=y+(m^w^D)+I[12]+3873151461&4294967295,y=m+(p<<11&4294967295|p>>>21),p=D+(y^m^w)+I[15]+530742520&4294967295,D=y+(p<<16&4294967295|p>>>16),p=w+(D^y^m)+I[2]+3299628645&4294967295,w=D+(p<<23&4294967295|p>>>9),p=m+(D^(w|~y))+I[0]+4096336452&4294967295,m=w+(p<<6&4294967295|p>>>26),p=y+(w^(m|~D))+I[7]+1126891415&4294967295,y=m+(p<<10&4294967295|p>>>22),p=D+(m^(y|~w))+I[14]+2878612391&4294967295,D=y+(p<<15&4294967295|p>>>17),p=w+(y^(D|~m))+I[5]+4237533241&4294967295,w=D+(p<<21&4294967295|p>>>11),p=m+(D^(w|~y))+I[12]+1700485571&4294967295,m=w+(p<<6&4294967295|p>>>26),p=y+(w^(m|~D))+I[3]+2399980690&4294967295,y=m+(p<<10&4294967295|p>>>22),p=D+(m^(y|~w))+I[10]+4293915773&4294967295,D=y+(p<<15&4294967295|p>>>17),p=w+(y^(D|~m))+I[1]+2240044497&4294967295,w=D+(p<<21&4294967295|p>>>11),p=m+(D^(w|~y))+I[8]+1873313359&4294967295,m=w+(p<<6&4294967295|p>>>26),p=y+(w^(m|~D))+I[15]+4264355552&4294967295,y=m+(p<<10&4294967295|p>>>22),p=D+(m^(y|~w))+I[6]+2734768916&4294967295,D=y+(p<<15&4294967295|p>>>17),p=w+(y^(D|~m))+I[13]+1309151649&4294967295,w=D+(p<<21&4294967295|p>>>11),p=m+(D^(w|~y))+I[4]+4149444226&4294967295,m=w+(p<<6&4294967295|p>>>26),p=y+(w^(m|~D))+I[11]+3174756917&4294967295,y=m+(p<<10&4294967295|p>>>22),p=D+(m^(y|~w))+I[2]+718787259&4294967295,D=y+(p<<15&4294967295|p>>>17),p=w+(y^(D|~m))+I[9]+3951481745&4294967295,A.g[0]=A.g[0]+m&4294967295,A.g[1]=A.g[1]+(D+(p<<21&4294967295|p>>>11))&4294967295,A.g[2]=A.g[2]+D&4294967295,A.g[3]=A.g[3]+y&4294967295}r.prototype.v=function(A,m){m===void 0&&(m=A.length);let w=m-this.blockSize,I=this.C,D=this.h,y=0;for(;y<m;){if(D==0)for(;y<=w;)s(this,A,y),y+=this.blockSize;if(typeof A=="string"){for(;y<m;)if(I[D++]=A.charCodeAt(y++),D==this.blockSize){s(this,I),D=0;break}}else for(;y<m;)if(I[D++]=A[y++],D==this.blockSize){s(this,I),D=0;break}}this.h=D,this.o+=m},r.prototype.A=function(){var A=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);A[0]=128;for(var m=1;m<A.length-8;++m)A[m]=0;m=this.o*8;for(var w=A.length-8;w<A.length;++w)A[w]=m&255,m/=256;for(this.v(A),A=Array(16),m=0,w=0;w<4;++w)for(let I=0;I<32;I+=8)A[m++]=this.g[w]>>>I&255;return A};function i(A,m){var w=c;return Object.prototype.hasOwnProperty.call(w,A)?w[A]:w[A]=m(A)}function o(A,m){this.h=m;let w=[],I=!0;for(let D=A.length-1;D>=0;D--){let y=A[D]|0;I&&y==m||(w[D]=y,I=!1)}this.g=w}var c={};function u(A){return-128<=A&&A<128?i(A,function(m){return new o([m|0],m<0?-1:0)}):new o([A|0],A<0?-1:0)}function l(A){if(isNaN(A)||!isFinite(A))return f;if(A<0)return G(l(-A));let m=[],w=1;for(let I=0;A>=w;I++)m[I]=A/w|0,w*=4294967296;return new o(m,0)}function h(A,m){if(A.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(A.charAt(0)=="-")return G(h(A.substring(1),m));if(A.indexOf("-")>=0)throw Error('number format error: interior "-" character');let w=l(Math.pow(m,8)),I=f;for(let y=0;y<A.length;y+=8){var D=Math.min(8,A.length-y);let p=parseInt(A.substring(y,y+D),m);D<8?(D=l(Math.pow(m,D)),I=I.j(D).add(l(p))):(I=I.j(w),I=I.add(l(p)))}return I}var f=u(0),C=u(1),v=u(16777216);n=o.prototype,n.m=function(){if(S(this))return-G(this).m();let A=0,m=1;for(let w=0;w<this.g.length;w++){let I=this.i(w);A+=(I>=0?I:4294967296+I)*m,m*=4294967296}return A},n.toString=function(A){if(A=A||10,A<2||36<A)throw Error("radix out of range: "+A);if(R(this))return"0";if(S(this))return"-"+G(this).toString(A);let m=l(Math.pow(A,6));var w=this;let I="";for(;;){let D=_e(w,m).g;w=U(w,D.j(m));let y=((w.g.length>0?w.g[0]:w.h)>>>0).toString(A);if(w=D,R(w))return y+I;for(;y.length<6;)y="0"+y;I=y+I}},n.i=function(A){return A<0?0:A<this.g.length?this.g[A]:this.h};function R(A){if(A.h!=0)return!1;for(let m=0;m<A.g.length;m++)if(A.g[m]!=0)return!1;return!0}function S(A){return A.h==-1}n.l=function(A){return A=U(this,A),S(A)?-1:R(A)?0:1};function G(A){let m=A.g.length,w=[];for(let I=0;I<m;I++)w[I]=~A.g[I];return new o(w,~A.h).add(C)}n.abs=function(){return S(this)?G(this):this},n.add=function(A){let m=Math.max(this.g.length,A.g.length),w=[],I=0;for(let D=0;D<=m;D++){let y=I+(this.i(D)&65535)+(A.i(D)&65535),p=(y>>>16)+(this.i(D)>>>16)+(A.i(D)>>>16);I=p>>>16,y&=65535,p&=65535,w[D]=p<<16|y}return new o(w,w[w.length-1]&-2147483648?-1:0)};function U(A,m){return A.add(G(m))}n.j=function(A){if(R(this)||R(A))return f;if(S(this))return S(A)?G(this).j(G(A)):G(G(this).j(A));if(S(A))return G(this.j(G(A)));if(this.l(v)<0&&A.l(v)<0)return l(this.m()*A.m());let m=this.g.length+A.g.length,w=[];for(var I=0;I<2*m;I++)w[I]=0;for(I=0;I<this.g.length;I++)for(let D=0;D<A.g.length;D++){let y=this.i(I)>>>16,p=this.i(I)&65535,O=A.i(D)>>>16,K=A.i(D)&65535;w[2*I+2*D]+=p*K,ae(w,2*I+2*D),w[2*I+2*D+1]+=y*K,ae(w,2*I+2*D+1),w[2*I+2*D+1]+=p*O,ae(w,2*I+2*D+1),w[2*I+2*D+2]+=y*O,ae(w,2*I+2*D+2)}for(A=0;A<m;A++)w[A]=w[2*A+1]<<16|w[2*A];for(A=m;A<2*m;A++)w[A]=0;return new o(w,0)};function ae(A,m){for(;(A[m]&65535)!=A[m];)A[m+1]+=A[m]>>>16,A[m]&=65535,m++}function Ee(A,m){this.g=A,this.h=m}function _e(A,m){if(R(m))throw Error("division by zero");if(R(A))return new Ee(f,f);if(S(A))return m=_e(G(A),m),new Ee(G(m.g),G(m.h));if(S(m))return m=_e(A,G(m)),new Ee(G(m.g),m.h);if(A.g.length>30){if(S(A)||S(m))throw Error("slowDivide_ only works with positive integers.");for(var w=C,I=m;I.l(A)<=0;)w=Oe(w),I=Oe(I);var D=we(w,1),y=we(I,1);for(I=we(I,2),w=we(w,2);!R(I);){var p=y.add(I);p.l(A)<=0&&(D=D.add(w),y=p),I=we(I,1),w=we(w,1)}return m=U(A,D.j(m)),new Ee(D,m)}for(D=f;A.l(m)>=0;){for(w=Math.max(1,Math.floor(A.m()/m.m())),I=Math.ceil(Math.log(w)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),y=l(w),p=y.j(m);S(p)||p.l(A)>0;)w-=I,y=l(w),p=y.j(m);R(y)&&(y=C),D=D.add(y),A=U(A,p)}return new Ee(D,A)}n.B=function(A){return _e(this,A).h},n.and=function(A){let m=Math.max(this.g.length,A.g.length),w=[];for(let I=0;I<m;I++)w[I]=this.i(I)&A.i(I);return new o(w,this.h&A.h)},n.or=function(A){let m=Math.max(this.g.length,A.g.length),w=[];for(let I=0;I<m;I++)w[I]=this.i(I)|A.i(I);return new o(w,this.h|A.h)},n.xor=function(A){let m=Math.max(this.g.length,A.g.length),w=[];for(let I=0;I<m;I++)w[I]=this.i(I)^A.i(I);return new o(w,this.h^A.h)};function Oe(A){let m=A.g.length+1,w=[];for(let I=0;I<m;I++)w[I]=A.i(I)<<1|A.i(I-1)>>>31;return new o(w,A.h)}function we(A,m){let w=m>>5;m%=32;let I=A.g.length-w,D=[];for(let y=0;y<I;y++)D[y]=m>0?A.i(y+w)>>>m|A.i(y+w+1)<<32-m:A.i(y+w);return new o(D,A.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Al=jg.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=h,En=jg.Integer=o}).apply(typeof qg<"u"?qg:typeof self<"u"?self:typeof window<"u"?window:{});var Va=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},_n={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var vl,JD,hs,bl,Li,Ma,Sl,Rl,Pl;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Va=="object"&&Va];for(var B=0;B<a.length;++B){var d=a[B];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(a,B){if(B)e:{var d=r;a=a.split(".");for(var g=0;g<a.length-1;g++){var P=a[g];if(!(P in d))break e;d=d[P]}a=a[a.length-1],g=d[a],B=B(g),B!=g&&B!=null&&e(d,a,{configurable:!0,writable:!0,value:B})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(B){var d=[],g;for(g in B)Object.prototype.hasOwnProperty.call(B,g)&&d.push([g,B[g]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var B=typeof a;return B=="object"&&a!=null||B=="function"}function u(a,B,d){return a.call.apply(a.bind,arguments)}function l(a,B,d){return l=u,l.apply(null,arguments)}function h(a,B){var d=Array.prototype.slice.call(arguments,1);return function(){var g=d.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function f(a,B){function d(){}d.prototype=B.prototype,a.Z=B.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(g,P,N){for(var j=Array(arguments.length-2),de=2;de<arguments.length;de++)j[de-2]=arguments[de];return B.prototype[P].apply(g,j)}}var C=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){let B=a.length;if(B>0){let d=Array(B);for(let g=0;g<B;g++)d[g]=a[g];return d}return[]}function R(a,B){for(let g=1;g<arguments.length;g++){let P=arguments[g];var d=typeof P;if(d=d!="object"?d:P?Array.isArray(P)?"array":d:"null",d=="array"||d=="object"&&typeof P.length=="number"){d=a.length||0;let N=P.length||0;a.length=d+N;for(let j=0;j<N;j++)a[d+j]=P[j]}else a.push(P)}}class S{constructor(B,d){this.i=B,this.j=d,this.h=0,this.g=null}get(){let B;return this.h>0?(this.h--,B=this.g,this.g=B.next,B.next=null):B=this.i(),B}}function G(a){o.setTimeout(()=>{throw a},0)}function U(){var a=A;let B=null;return a.g&&(B=a.g,a.g=a.g.next,a.g||(a.h=null),B.next=null),B}class ae{constructor(){this.h=this.g=null}add(B,d){let g=Ee.get();g.set(B,d),this.h?this.h.next=g:this.g=g,this.h=g}}var Ee=new S(()=>new _e,a=>a.reset());class _e{constructor(){this.next=this.g=this.h=null}set(B,d){this.h=B,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Oe,we=!1,A=new ae,m=()=>{let a=Promise.resolve(void 0);Oe=()=>{a.then(w)}};function w(){for(var a;a=U();){try{a.h.call(a.g)}catch(d){G(d)}var B=Ee;B.j(a),B.h<100&&(B.h++,a.next=B.g,B.g=a)}we=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function D(a,B){this.type=a,this.g=this.target=B,this.defaultPrevented=!1}D.prototype.h=function(){this.defaultPrevented=!0};var y=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,B=Object.defineProperty({},"passive",{get:function(){a=!0}});try{let d=()=>{};o.addEventListener("test",d,B),o.removeEventListener("test",d,B)}catch{}return a})();function p(a){return/^[\s\xa0]*$/.test(a)}function O(a,B){D.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,B)}f(O,D),O.prototype.init=function(a,B){let d=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=B,B=a.relatedTarget,B||(d=="mouseover"?B=a.fromElement:d=="mouseout"&&(B=a.toElement)),this.relatedTarget=B,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&O.Z.h.call(this)},O.prototype.h=function(){O.Z.h.call(this);let a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var K="closure_listenable_"+(Math.random()*1e6|0),W=0;function Q(a,B,d,g,P){this.listener=a,this.proxy=null,this.src=B,this.type=d,this.capture=!!g,this.ha=P,this.key=++W,this.da=this.fa=!1}function re(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function $(a,B,d){for(let g in a)B.call(d,a[g],g,a)}function pe(a,B){for(let d in a)B.call(void 0,a[d],d,a)}function le(a){let B={};for(let d in a)B[d]=a[d];return B}let oe="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ue(a,B){let d,g;for(let P=1;P<arguments.length;P++){g=arguments[P];for(d in g)a[d]=g[d];for(let N=0;N<oe.length;N++)d=oe[N],Object.prototype.hasOwnProperty.call(g,d)&&(a[d]=g[d])}}function Be(a){this.src=a,this.g={},this.h=0}Be.prototype.add=function(a,B,d,g,P){let N=a.toString();a=this.g[N],a||(a=this.g[N]=[],this.h++);let j=mt(a,B,g,P);return j>-1?(B=a[j],d||(B.fa=!1)):(B=new Q(B,this.src,N,!!g,P),B.fa=d,a.push(B)),B};function Ke(a,B){let d=B.type;if(d in a.g){var g=a.g[d],P=Array.prototype.indexOf.call(g,B,void 0),N;(N=P>=0)&&Array.prototype.splice.call(g,P,1),N&&(re(B),a.g[d].length==0&&(delete a.g[d],a.h--))}}function mt(a,B,d,g){for(let P=0;P<a.length;++P){let N=a[P];if(!N.da&&N.listener==B&&N.capture==!!d&&N.ha==g)return P}return-1}var Jt="closure_lm_"+(Math.random()*1e6|0),It={};function Go(a,B,d,g,P){if(Array.isArray(B)){for(let N=0;N<B.length;N++)Go(a,B[N],d,g,P);return null}return d=If(d),a&&a[K]?a.J(B,d,c(g)?!!g.capture:!1,P):g_(a,B,d,!1,g,P)}function g_(a,B,d,g,P,N){if(!B)throw Error("Invalid event type");let j=c(P)?!!P.capture:!!P,de=au(a);if(de||(a[Jt]=de=new Be(a)),d=de.add(B,d,g,j,N),d.proxy)return d;if(g=C_(),d.proxy=g,g.src=a,g.listener=d,a.addEventListener)y||(P=j),P===void 0&&(P=!1),a.addEventListener(B.toString(),g,P);else if(a.attachEvent)a.attachEvent(Df(B.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return d}function C_(){function a(d){return B.call(a.src,a.listener,d)}let B=m_;return a}function yf(a,B,d,g,P){if(Array.isArray(B))for(var N=0;N<B.length;N++)yf(a,B[N],d,g,P);else g=c(g)?!!g.capture:!!g,d=If(d),a&&a[K]?(a=a.i,N=String(B).toString(),N in a.g&&(B=a.g[N],d=mt(B,d,g,P),d>-1&&(re(B[d]),Array.prototype.splice.call(B,d,1),B.length==0&&(delete a.g[N],a.h--)))):a&&(a=au(a))&&(B=a.g[B.toString()],a=-1,B&&(a=mt(B,d,g,P)),(d=a>-1?B[a]:null)&&ou(d))}function ou(a){if(typeof a!="number"&&a&&!a.da){var B=a.src;if(B&&B[K])Ke(B.i,a);else{var d=a.type,g=a.proxy;B.removeEventListener?B.removeEventListener(d,g,a.capture):B.detachEvent?B.detachEvent(Df(d),g):B.addListener&&B.removeListener&&B.removeListener(g),(d=au(B))?(Ke(d,a),d.h==0&&(d.src=null,B[Jt]=null)):re(a)}}}function Df(a){return a in It?It[a]:It[a]="on"+a}function m_(a,B){if(a.da)a=!0;else{B=new O(B,this);let d=a.listener,g=a.ha||a.src;a.fa&&ou(a),a=d.call(g,B)}return a}function au(a){return a=a[Jt],a instanceof Be?a:null}var cu="__closure_events_fn_"+(Math.random()*1e9>>>0);function If(a){return typeof a=="function"?a:(a[cu]||(a[cu]=function(B){return a.handleEvent(B)}),a[cu])}function it(){I.call(this),this.i=new Be(this),this.M=this,this.G=null}f(it,I),it.prototype[K]=!0,it.prototype.removeEventListener=function(a,B,d,g){yf(this,a,B,d,g)};function Bt(a,B){var d,g=a.G;if(g)for(d=[];g;g=g.G)d.push(g);if(a=a.M,g=B.type||B,typeof B=="string")B=new D(B,a);else if(B instanceof D)B.target=B.target||a;else{var P=B;B=new D(g,a),ue(B,P)}P=!0;let N,j;if(d)for(j=d.length-1;j>=0;j--)N=B.g=d[j],P=Uo(N,g,!0,B)&&P;if(N=B.g=a,P=Uo(N,g,!0,B)&&P,P=Uo(N,g,!1,B)&&P,d)for(j=0;j<d.length;j++)N=B.g=d[j],P=Uo(N,g,!1,B)&&P}it.prototype.N=function(){if(it.Z.N.call(this),this.i){var a=this.i;for(let B in a.g){let d=a.g[B];for(let g=0;g<d.length;g++)re(d[g]);delete a.g[B],a.h--}}this.G=null},it.prototype.J=function(a,B,d,g){return this.i.add(String(a),B,!1,d,g)},it.prototype.K=function(a,B,d,g){return this.i.add(String(a),B,!0,d,g)};function Uo(a,B,d,g){if(B=a.i.g[String(B)],!B)return!0;B=B.concat();let P=!0;for(let N=0;N<B.length;++N){let j=B[N];if(j&&!j.da&&j.capture==d){let de=j.listener,ze=j.ha||j.src;j.fa&&Ke(a.i,j),P=de.call(ze,g)!==!1&&P}}return P&&!g.defaultPrevented}function E_(a,B){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(B)>2147483647?-1:o.setTimeout(a,B||0)}function Tf(a){a.g=E_(()=>{a.g=null,a.i&&(a.i=!1,Tf(a))},a.l);let B=a.h;a.h=null,a.m.apply(null,B)}class __ extends I{constructor(B,d){super(),this.m=B,this.l=d,this.h=null,this.i=!1,this.g=null}j(B){this.h=arguments,this.g?this.i=!0:Tf(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Xs(a){I.call(this),this.h=a,this.g={}}f(Xs,I);var Af=[];function vf(a){$(a.g,function(B,d){this.g.hasOwnProperty(d)&&ou(B)},a),a.g={}}Xs.prototype.N=function(){Xs.Z.N.call(this),vf(this)},Xs.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var uu=o.JSON.stringify,w_=o.JSON.parse,y_=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function bf(){}function Sf(){}var Zs={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function lu(){D.call(this,"d")}f(lu,D);function Bu(){D.call(this,"c")}f(Bu,D);var dr={},Rf=null;function Ho(){return Rf=Rf||new it}dr.Ia="serverreachability";function Pf(a){D.call(this,dr.Ia,a)}f(Pf,D);function ei(a){let B=Ho();Bt(B,new Pf(B))}dr.STAT_EVENT="statevent";function Nf(a,B){D.call(this,dr.STAT_EVENT,a),this.stat=B}f(Nf,D);function ht(a){let B=Ho();Bt(B,new Nf(B,a))}dr.Ja="timingevent";function Of(a,B){D.call(this,dr.Ja,a),this.size=B}f(Of,D);function ti(a,B){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},B)}function ni(){this.g=!0}ni.prototype.ua=function(){this.g=!1};function D_(a,B,d,g,P,N){a.info(function(){if(a.g)if(N){var j="",de=N.split("&");for(let Ae=0;Ae<de.length;Ae++){var ze=de[Ae].split("=");if(ze.length>1){let Ye=ze[0];ze=ze[1];let nn=Ye.split("_");j=nn.length>=2&&nn[1]=="type"?j+(Ye+"="+ze+"&"):j+(Ye+"=redacted&")}}}else j=null;else j=N;return"XMLHTTP REQ ("+g+") [attempt "+P+"]: "+B+`
`+d+`
`+j})}function I_(a,B,d,g,P,N,j){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+P+"]: "+B+`
`+d+`
`+N+" "+j})}function ns(a,B,d,g){a.info(function(){return"XMLHTTP TEXT ("+B+"): "+A_(a,d)+(g?" "+g:"")})}function T_(a,B){a.info(function(){return"TIMEOUT: "+B})}ni.prototype.info=function(){};function A_(a,B){if(!a.g)return B;if(!B)return null;try{let N=JSON.parse(B);if(N){for(a=0;a<N.length;a++)if(Array.isArray(N[a])){var d=N[a];if(!(d.length<2)){var g=d[1];if(Array.isArray(g)&&!(g.length<1)){var P=g[0];if(P!="noop"&&P!="stop"&&P!="close")for(let j=1;j<g.length;j++)g[j]=""}}}}return uu(N)}catch{return B}}var qo={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},kf={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Ff;function hu(){}f(hu,bf),hu.prototype.g=function(){return new XMLHttpRequest},Ff=new hu;function ri(a){return encodeURIComponent(String(a))}function v_(a){var B=1;a=a.split(":");let d=[];for(;B>0&&a.length;)d.push(a.shift()),B--;return a.length&&d.push(a.join(":")),d}function Mn(a,B,d,g){this.j=a,this.i=B,this.l=d,this.S=g||1,this.V=new Xs(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new xf}function xf(){this.i=null,this.g="",this.h=!1}var Lf={},du={};function fu(a,B,d){a.M=1,a.A=Jo(tn(B)),a.u=d,a.R=!0,Vf(a,null)}function Vf(a,B){a.F=Date.now(),jo(a),a.B=tn(a.A);var d=a.B,g=a.S;Array.isArray(g)||(g=[String(g)]),Yf(d.i,"t",g),a.C=0,d=a.j.L,a.h=new xf,a.g=pp(a.j,d?B:null,!a.u),a.P>0&&(a.O=new __(l(a.Y,a,a.g),a.P)),B=a.V,d=a.g,g=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(Af[0]=P.toString()),P=Af);for(let N=0;N<P.length;N++){let j=Go(d,P[N],g||B.handleEvent,!1,B.h||B);if(!j)break;B.g[j.key]=j}B=a.J?le(a.J):{},a.u?(a.v||(a.v="POST"),B["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,B)):(a.v="GET",a.g.ea(a.B,a.v,null,B)),ei(),D_(a.i,a.v,a.B,a.l,a.S,a.u)}Mn.prototype.ba=function(a){a=a.target;let B=this.O;B&&Hn(a)==3?B.j():this.Y(a)},Mn.prototype.Y=function(a){try{if(a==this.g)e:{let de=Hn(this.g),ze=this.g.ya(),Ae=this.g.ca();if(!(de<3)&&(de!=3||this.g&&(this.h.h||this.g.la()||sp(this.g)))){this.K||de!=4||ze==7||(ze==8||Ae<=0?ei(3):ei(2)),pu(this);var B=this.g.ca();this.X=B;var d=b_(this);if(this.o=B==200,I_(this.i,this.v,this.B,this.l,this.S,de,B),this.o){if(this.U&&!this.L){t:{if(this.g){var g,P=this.g;if((g=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(g)){var N=g;break t}}N=null}if(a=N)ns(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,gu(this,a);else{this.o=!1,this.m=3,ht(12),fr(this),si(this);break e}}if(this.R){a=!0;let Ye;for(;!this.K&&this.C<d.length;)if(Ye=S_(this,d),Ye==du){de==4&&(this.m=4,ht(14),a=!1),ns(this.i,this.l,null,"[Incomplete Response]");break}else if(Ye==Lf){this.m=4,ht(15),ns(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else ns(this.i,this.l,Ye,null),gu(this,Ye);if(Mf(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),de!=4||d.length!=0||this.h.h||(this.m=1,ht(16),a=!1),this.o=this.o&&a,!a)ns(this.i,this.l,d,"[Invalid Chunked Response]"),fr(this),si(this);else if(d.length>0&&!this.W){this.W=!0;var j=this.j;j.g==this&&j.aa&&!j.P&&(j.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Du(j),j.P=!0,ht(11))}}else ns(this.i,this.l,d,null),gu(this,d);de==4&&fr(this),this.o&&!this.K&&(de==4?Bp(this.j,this):(this.o=!1,jo(this)))}else q_(this.g),B==400&&d.indexOf("Unknown SID")>0?(this.m=3,ht(12)):(this.m=0,ht(13)),fr(this),si(this)}}}catch{}};function b_(a){if(!Mf(a))return a.g.la();let B=sp(a.g);if(B==="")return"";let d="",g=B.length,P=Hn(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return fr(a),si(a),"";a.h.i=new o.TextDecoder}for(let N=0;N<g;N++)a.h.h=!0,d+=a.h.i.decode(B[N],{stream:!(P&&N==g-1)});return B.length=0,a.h.g+=d,a.C=0,a.h.g}function Mf(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function S_(a,B){var d=a.C,g=B.indexOf(`
`,d);return g==-1?du:(d=Number(B.substring(d,g)),isNaN(d)?Lf:(g+=1,g+d>B.length?du:(B=B.slice(g,g+d),a.C=g+d,B)))}Mn.prototype.cancel=function(){this.K=!0,fr(this)};function jo(a){a.T=Date.now()+a.H,Gf(a,a.H)}function Gf(a,B){if(a.D!=null)throw Error("WatchDog timer not null");a.D=ti(l(a.aa,a),B)}function pu(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Mn.prototype.aa=function(){this.D=null;let a=Date.now();a-this.T>=0?(T_(this.i,this.B),this.M!=2&&(ei(),ht(17)),fr(this),this.m=2,si(this)):Gf(this,this.T-a)};function si(a){a.j.I==0||a.K||Bp(a.j,a)}function fr(a){pu(a);var B=a.O;B&&typeof B.dispose=="function"&&B.dispose(),a.O=null,vf(a.V),a.g&&(B=a.g,a.g=null,B.abort(),B.dispose())}function gu(a,B){try{var d=a.j;if(d.I!=0&&(d.g==a||Cu(d.h,a))){if(!a.L&&Cu(d.h,a)&&d.I==3){try{var g=d.Ba.g.parse(B)}catch{g=null}if(Array.isArray(g)&&g.length==3){var P=g;if(P[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)Yo(d),Qo(d);else break e;yu(d),ht(18)}}else d.xa=P[1],0<d.xa-d.K&&P[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=ti(l(d.Va,d),6e3));qf(d.h)<=1&&d.ta&&(d.ta=void 0)}else gr(d,11)}else if((a.L||d.g==a)&&Yo(d),!p(B))for(P=d.Ba.g.parse(B),B=0;B<P.length;B++){let Ae=P[B],Ye=Ae[0];if(!(Ye<=d.K))if(d.K=Ye,Ae=Ae[1],d.I==2)if(Ae[0]=="c"){d.M=Ae[1],d.ba=Ae[2];let nn=Ae[3];nn!=null&&(d.ka=nn,d.j.info("VER="+d.ka));let Cr=Ae[4];Cr!=null&&(d.za=Cr,d.j.info("SVER="+d.za));let qn=Ae[5];qn!=null&&typeof qn=="number"&&qn>0&&(g=1.5*qn,d.O=g,d.j.info("backChannelRequestTimeoutMs_="+g)),g=d;let jn=a.g;if(jn){let Zo=jn.g?jn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Zo){var N=g.h;N.g||Zo.indexOf("spdy")==-1&&Zo.indexOf("quic")==-1&&Zo.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(mu(N,N.h),N.h=null))}if(g.G){let Iu=jn.g?jn.g.getResponseHeader("X-HTTP-Session-Id"):null;Iu&&(g.wa=Iu,Pe(g.J,g.G,Iu))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),g=d;var j=a;if(g.na=fp(g,g.L?g.ba:null,g.W),j.L){jf(g.h,j);var de=j,ze=g.O;ze&&(de.H=ze),de.D&&(pu(de),jo(de)),g.g=j}else up(g);d.i.length>0&&$o(d)}else Ae[0]!="stop"&&Ae[0]!="close"||gr(d,7);else d.I==3&&(Ae[0]=="stop"||Ae[0]=="close"?Ae[0]=="stop"?gr(d,7):wu(d):Ae[0]!="noop"&&d.l&&d.l.qa(Ae),d.A=0)}}ei(4)}catch{}}var R_=class{constructor(a,B){this.g=a,this.map=B}};function Uf(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Hf(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function qf(a){return a.h?1:a.g?a.g.size:0}function Cu(a,B){return a.h?a.h==B:a.g?a.g.has(B):!1}function mu(a,B){a.g?a.g.add(B):a.h=B}function jf(a,B){a.h&&a.h==B?a.h=null:a.g&&a.g.has(B)&&a.g.delete(B)}Uf.prototype.cancel=function(){if(this.i=Jf(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let a of this.g.values())a.cancel();this.g.clear()}};function Jf(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let B=a.i;for(let d of a.g.values())B=B.concat(d.G);return B}return v(a.i)}var Kf=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function P_(a,B){if(a){a=a.split("&");for(let d=0;d<a.length;d++){let g=a[d].indexOf("="),P,N=null;g>=0?(P=a[d].substring(0,g),N=a[d].substring(g+1)):P=a[d],B(P,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Gn(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let B;a instanceof Gn?(this.l=a.l,ii(this,a.j),this.o=a.o,this.g=a.g,oi(this,a.u),this.h=a.h,Eu(this,Xf(a.i)),this.m=a.m):a&&(B=String(a).match(Kf))?(this.l=!1,ii(this,B[1]||"",!0),this.o=ai(B[2]||""),this.g=ai(B[3]||"",!0),oi(this,B[4]),this.h=ai(B[5]||"",!0),Eu(this,B[6]||"",!0),this.m=ai(B[7]||"")):(this.l=!1,this.i=new ui(null,this.l))}Gn.prototype.toString=function(){let a=[];var B=this.j;B&&a.push(ci(B,zf,!0),":");var d=this.g;return(d||B=="file")&&(a.push("//"),(B=this.o)&&a.push(ci(B,zf,!0),"@"),a.push(ri(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(ci(d,d.charAt(0)=="/"?k_:O_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",ci(d,x_)),a.join("")},Gn.prototype.resolve=function(a){let B=tn(this),d=!!a.j;d?ii(B,a.j):d=!!a.o,d?B.o=a.o:d=!!a.g,d?B.g=a.g:d=a.u!=null;var g=a.h;if(d)oi(B,a.u);else if(d=!!a.h){if(g.charAt(0)!="/")if(this.g&&!this.h)g="/"+g;else{var P=B.h.lastIndexOf("/");P!=-1&&(g=B.h.slice(0,P+1)+g)}if(P=g,P==".."||P==".")g="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){g=P.lastIndexOf("/",0)==0,P=P.split("/");let N=[];for(let j=0;j<P.length;){let de=P[j++];de=="."?g&&j==P.length&&N.push(""):de==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),g&&j==P.length&&N.push("")):(N.push(de),g=!0)}g=N.join("/")}else g=P}return d?B.h=g:d=a.i.toString()!=="",d?Eu(B,Xf(a.i)):d=!!a.m,d&&(B.m=a.m),B};function tn(a){return new Gn(a)}function ii(a,B,d){a.j=d?ai(B,!0):B,a.j&&(a.j=a.j.replace(/:$/,""))}function oi(a,B){if(B){if(B=Number(B),isNaN(B)||B<0)throw Error("Bad port number "+B);a.u=B}else a.u=null}function Eu(a,B,d){B instanceof ui?(a.i=B,L_(a.i,a.l)):(d||(B=ci(B,F_)),a.i=new ui(B,a.l))}function Pe(a,B,d){a.i.set(B,d)}function Jo(a){return Pe(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function ai(a,B){return a?B?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ci(a,B,d){return typeof a=="string"?(a=encodeURI(a).replace(B,N_),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function N_(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var zf=/[#\/\?@]/g,O_=/[#\?:]/g,k_=/[#\?]/g,F_=/[#\?@]/g,x_=/#/g;function ui(a,B){this.h=this.g=null,this.i=a||null,this.j=!!B}function pr(a){a.g||(a.g=new Map,a.h=0,a.i&&P_(a.i,function(B,d){a.add(decodeURIComponent(B.replace(/\+/g," ")),d)}))}n=ui.prototype,n.add=function(a,B){pr(this),this.i=null,a=rs(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(B),this.h+=1,this};function Wf(a,B){pr(a),B=rs(a,B),a.g.has(B)&&(a.i=null,a.h-=a.g.get(B).length,a.g.delete(B))}function Qf(a,B){return pr(a),B=rs(a,B),a.g.has(B)}n.forEach=function(a,B){pr(this),this.g.forEach(function(d,g){d.forEach(function(P){a.call(B,P,g,this)},this)},this)};function $f(a,B){pr(a);let d=[];if(typeof B=="string")Qf(a,B)&&(d=d.concat(a.g.get(rs(a,B))));else for(a=Array.from(a.g.values()),B=0;B<a.length;B++)d=d.concat(a[B]);return d}n.set=function(a,B){return pr(this),this.i=null,a=rs(this,a),Qf(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[B]),this.h+=1,this},n.get=function(a,B){return a?(a=$f(this,a),a.length>0?String(a[0]):B):B};function Yf(a,B,d){Wf(a,B),d.length>0&&(a.i=null,a.g.set(rs(a,B),v(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let a=[],B=Array.from(this.g.keys());for(let g=0;g<B.length;g++){var d=B[g];let P=ri(d);d=$f(this,d);for(let N=0;N<d.length;N++){let j=P;d[N]!==""&&(j+="="+ri(d[N])),a.push(j)}}return this.i=a.join("&")};function Xf(a){let B=new ui;return B.i=a.i,a.g&&(B.g=new Map(a.g),B.h=a.h),B}function rs(a,B){return B=String(B),a.j&&(B=B.toLowerCase()),B}function L_(a,B){B&&!a.j&&(pr(a),a.i=null,a.g.forEach(function(d,g){let P=g.toLowerCase();g!=P&&(Wf(this,g),Yf(this,P,d))},a)),a.j=B}function V_(a,B){let d=new ni;if(o.Image){let g=new Image;g.onload=h(Un,d,"TestLoadImage: loaded",!0,B,g),g.onerror=h(Un,d,"TestLoadImage: error",!1,B,g),g.onabort=h(Un,d,"TestLoadImage: abort",!1,B,g),g.ontimeout=h(Un,d,"TestLoadImage: timeout",!1,B,g),o.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else B(!1)}function M_(a,B){let d=new ni,g=new AbortController,P=setTimeout(()=>{g.abort(),Un(d,"TestPingServer: timeout",!1,B)},1e4);fetch(a,{signal:g.signal}).then(N=>{clearTimeout(P),N.ok?Un(d,"TestPingServer: ok",!0,B):Un(d,"TestPingServer: server error",!1,B)}).catch(()=>{clearTimeout(P),Un(d,"TestPingServer: error",!1,B)})}function Un(a,B,d,g,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),g(d)}catch{}}function G_(){this.g=new y_}function Ko(a){this.i=a.Sb||null,this.h=a.ab||!1}f(Ko,bf),Ko.prototype.g=function(){return new zo(this.i,this.h)};function zo(a,B){it.call(this),this.H=a,this.o=B,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}f(zo,it),n=zo.prototype,n.open=function(a,B){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=B,this.readyState=1,Bi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;let B={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(B.body=a),(this.H||o).fetch(new Request(this.D,B)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,li(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Bi(this)),this.g&&(this.readyState=3,Bi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Zf(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Zf(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var B=a.value?a.value:new Uint8Array(0);(B=this.B.decode(B,{stream:!a.done}))&&(this.response=this.responseText+=B)}a.done?li(this):Bi(this),this.readyState==3&&Zf(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,li(this))},n.Na=function(a){this.g&&(this.response=a,li(this))},n.ga=function(){this.g&&li(this)};function li(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Bi(a)}n.setRequestHeader=function(a,B){this.A.append(a,B)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let a=[],B=this.h.entries();for(var d=B.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=B.next();return a.join(`\r
`)};function Bi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(zo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function ep(a){let B="";return $(a,function(d,g){B+=g,B+=":",B+=d,B+=`\r
`}),B}function _u(a,B,d){e:{for(g in d){var g=!1;break e}g=!0}g||(d=ep(d),typeof a=="string"?d!=null&&ri(d):Pe(a,B,d))}function ke(a){it.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}f(ke,it);var U_=/^https?$/i,H_=["POST","PUT"];n=ke.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,B,d,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);B=B?B.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ff.g(),this.g.onreadystatechange=C(l(this.Ca,this));try{this.B=!0,this.g.open(B,String(a),!0),this.B=!1}catch(N){tp(this,N);return}if(a=d||"",d=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var P in g)d.set(P,g[P]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(let N of g.keys())d.set(N,g.get(N));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(d.keys()).find(N=>N.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(H_,B,void 0)>=0)||g||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[N,j]of d)this.g.setRequestHeader(N,j);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(N){tp(this,N)}};function tp(a,B){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=B,a.o=5,np(a),Wo(a)}function np(a){a.A||(a.A=!0,Bt(a,"complete"),Bt(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Bt(this,"complete"),Bt(this,"abort"),Wo(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Wo(this,!0)),ke.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?rp(this):this.Xa())},n.Xa=function(){rp(this)};function rp(a){if(a.h&&typeof i<"u"){if(a.v&&Hn(a)==4)setTimeout(a.Ca.bind(a),0);else if(Bt(a,"readystatechange"),Hn(a)==4){a.h=!1;try{let N=a.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var B=!0;break e;default:B=!1}var d;if(!(d=B)){var g;if(g=N===0){let j=String(a.D).match(Kf)[1]||null;!j&&o.self&&o.self.location&&(j=o.self.location.protocol.slice(0,-1)),g=!U_.test(j?j.toLowerCase():"")}d=g}if(d)Bt(a,"complete"),Bt(a,"success");else{a.o=6;try{var P=Hn(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",np(a)}}finally{Wo(a)}}}}function Wo(a,B){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);let d=a.g;a.g=null,B||Bt(a,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Hn(a){return a.g?a.g.readyState:0}n.ca=function(){try{return Hn(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var B=this.g.responseText;return a&&B.indexOf(a)==0&&(B=B.substring(a.length)),w_(B)}};function sp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function q_(a){let B={};a=(a.g&&Hn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(p(a[g]))continue;var d=v_(a[g]);let P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();let N=B[P]||[];B[P]=N,N.push(d)}pe(B,function(g){return g.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function hi(a,B,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||B}function ip(a){this.za=0,this.i=[],this.j=new ni,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=hi("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=hi("baseRetryDelayMs",5e3,a),this.Za=hi("retryDelaySeedMs",1e4,a),this.Ta=hi("forwardChannelMaxRetries",2,a),this.va=hi("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Uf(a&&a.concurrentRequestLimit),this.Ba=new G_,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=ip.prototype,n.ka=8,n.I=1,n.connect=function(a,B,d,g){ht(0),this.W=a,this.H=B||{},d&&g!==void 0&&(this.H.OSID=d,this.H.OAID=g),this.F=this.X,this.J=fp(this,null,this.W),$o(this)};function wu(a){if(op(a),a.I==3){var B=a.V++,d=tn(a.J);if(Pe(d,"SID",a.M),Pe(d,"RID",B),Pe(d,"TYPE","terminate"),di(a,d),B=new Mn(a,a.j,B),B.M=2,B.A=Jo(tn(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(B.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=B.A,d=!0),d||(B.g=pp(B.j,null),B.g.ea(B.A)),B.F=Date.now(),jo(B)}dp(a)}function Qo(a){a.g&&(Du(a),a.g.cancel(),a.g=null)}function op(a){Qo(a),a.v&&(o.clearTimeout(a.v),a.v=null),Yo(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function $o(a){if(!Hf(a.h)&&!a.m){a.m=!0;var B=a.Ea;Oe||m(),we||(Oe(),we=!0),A.add(B,a),a.D=0}}function j_(a,B){return qf(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=B.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=ti(l(a.Ea,a,B),hp(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;let P=new Mn(this,this.j,a),N=this.o;if(this.U&&(N?(N=le(N),ue(N,this.U)):N=this.U),this.u!==null||this.R||(P.J=N,N=null),this.S)e:{for(var B=0,d=0;d<this.i.length;d++){t:{var g=this.i[d];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(B+=g,B>4096){B=d;break e}if(B===4096||d===this.i.length-1){B=d+1;break e}}B=1e3}else B=1e3;B=cp(this,P,B),d=tn(this.J),Pe(d,"RID",a),Pe(d,"CVER",22),this.G&&Pe(d,"X-HTTP-Session-Id",this.G),di(this,d),N&&(this.R?B="headers="+ri(ep(N))+"&"+B:this.u&&_u(d,this.u,N)),mu(this.h,P),this.Ra&&Pe(d,"TYPE","init"),this.S?(Pe(d,"$req",B),Pe(d,"SID","null"),P.U=!0,fu(P,d,null)):fu(P,d,B),this.I=2}}else this.I==3&&(a?ap(this,a):this.i.length==0||Hf(this.h)||ap(this))};function ap(a,B){var d;B?d=B.l:d=a.V++;let g=tn(a.J);Pe(g,"SID",a.M),Pe(g,"RID",d),Pe(g,"AID",a.K),di(a,g),a.u&&a.o&&_u(g,a.u,a.o),d=new Mn(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),B&&(a.i=B.G.concat(a.i)),B=cp(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),mu(a.h,d),fu(d,g,B)}function di(a,B){a.H&&$(a.H,function(d,g){Pe(B,g,d)}),a.l&&$({},function(d,g){Pe(B,g,d)})}function cp(a,B,d){d=Math.min(a.i.length,d);let g=a.l?l(a.l.Ka,a.l,a):null;e:{var P=a.i;let de=-1;for(;;){let ze=["count="+d];de==-1?d>0?(de=P[0].g,ze.push("ofs="+de)):de=0:ze.push("ofs="+de);let Ae=!0;for(let Ye=0;Ye<d;Ye++){var N=P[Ye].g;let nn=P[Ye].map;if(N-=de,N<0)de=Math.max(0,P[Ye].g-100),Ae=!1;else try{N="req"+N+"_"||"";try{var j=nn instanceof Map?nn:Object.entries(nn);for(let[Cr,qn]of j){let jn=qn;c(qn)&&(jn=uu(qn)),ze.push(N+Cr+"="+encodeURIComponent(jn))}}catch(Cr){throw ze.push(N+"type="+encodeURIComponent("_badmap")),Cr}}catch{g&&g(nn)}}if(Ae){j=ze.join("&");break e}}j=void 0}return a=a.i.splice(0,d),B.G=a,j}function up(a){if(!a.g&&!a.v){a.Y=1;var B=a.Da;Oe||m(),we||(Oe(),we=!0),A.add(B,a),a.A=0}}function yu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=ti(l(a.Da,a),hp(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,lp(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=ti(l(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,ht(10),Qo(this),lp(this))};function Du(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function lp(a){a.g=new Mn(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var B=tn(a.na);Pe(B,"RID","rpc"),Pe(B,"SID",a.M),Pe(B,"AID",a.K),Pe(B,"CI",a.F?"0":"1"),!a.F&&a.ia&&Pe(B,"TO",a.ia),Pe(B,"TYPE","xmlhttp"),di(a,B),a.u&&a.o&&_u(B,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=Jo(tn(B)),d.u=null,d.R=!0,Vf(d,a)}n.Va=function(){this.C!=null&&(this.C=null,Qo(this),yu(this),ht(19))};function Yo(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Bp(a,B){var d=null;if(a.g==B){Yo(a),Du(a),a.g=null;var g=2}else if(Cu(a.h,B))d=B.G,jf(a.h,B),g=1;else return;if(a.I!=0){if(B.o)if(g==1){d=B.u?B.u.length:0,B=Date.now()-B.F;var P=a.D;g=Ho(),Bt(g,new Of(g,d)),$o(a)}else up(a);else if(P=B.m,P==3||P==0&&B.X>0||!(g==1&&j_(a,B)||g==2&&yu(a)))switch(d&&d.length>0&&(B=a.h,B.i=B.i.concat(d)),P){case 1:gr(a,5);break;case 4:gr(a,10);break;case 3:gr(a,6);break;default:gr(a,2)}}}function hp(a,B){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*B}function gr(a,B){if(a.j.info("Error code "+B),B==2){var d=l(a.bb,a),g=a.Ua;let P=!g;g=new Gn(g||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||ii(g,"https"),Jo(g),P?V_(g.toString(),d):M_(g.toString(),d)}else ht(2);a.I=0,a.l&&a.l.pa(B),dp(a),op(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),ht(2)):(this.j.info("Failed to ping google.com"),ht(1))};function dp(a){if(a.I=0,a.ja=[],a.l){let B=Jf(a.h);(B.length!=0||a.i.length!=0)&&(R(a.ja,B),R(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function fp(a,B,d){var g=d instanceof Gn?tn(d):new Gn(d);if(g.g!="")B&&(g.g=B+"."+g.g),oi(g,g.u);else{var P=o.location;g=P.protocol,B=B?B+"."+P.hostname:P.hostname,P=+P.port;let N=new Gn(null);g&&ii(N,g),B&&(N.g=B),P&&oi(N,P),d&&(N.h=d),g=N}return d=a.G,B=a.wa,d&&B&&Pe(g,d,B),Pe(g,"VER",a.ka),di(a,g),g}function pp(a,B,d){if(B&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return B=a.Aa&&!a.ma?new ke(new Ko({ab:d})):new ke(a.ma),B.Fa(a.L),B}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function gp(){}n=gp.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function Xo(){}Xo.prototype.g=function(a,B){return new Tt(a,B)};function Tt(a,B){it.call(this),this.g=new ip(B),this.l=a,this.h=B&&B.messageUrlParams||null,a=B&&B.messageHeaders||null,B&&B.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=B&&B.initMessageHeaders||null,B&&B.messageContentType&&(a?a["X-WebChannel-Content-Type"]=B.messageContentType:a={"X-WebChannel-Content-Type":B.messageContentType}),B&&B.sa&&(a?a["X-WebChannel-Client-Profile"]=B.sa:a={"X-WebChannel-Client-Profile":B.sa}),this.g.U=a,(a=B&&B.Qb)&&!p(a)&&(this.g.u=a),this.A=B&&B.supportsCrossDomainXhr||!1,this.v=B&&B.sendRawJson||!1,(B=B&&B.httpSessionIdParam)&&!p(B)&&(this.g.G=B,a=this.h,a!==null&&B in a&&(a=this.h,B in a&&delete a[B])),this.j=new ss(this)}f(Tt,it),Tt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Tt.prototype.close=function(){wu(this.g)},Tt.prototype.o=function(a){var B=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=uu(a),a=d);B.i.push(new R_(B.Ya++,a)),B.I==3&&$o(B)},Tt.prototype.N=function(){this.g.l=null,delete this.j,wu(this.g),delete this.g,Tt.Z.N.call(this)};function Cp(a){lu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var B=a.__sm__;if(B){e:{for(let d in B){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,B=B!==null&&a in B?B[a]:void 0),this.data=B}else this.data=a}f(Cp,lu);function mp(){Bu.call(this),this.status=1}f(mp,Bu);function ss(a){this.g=a}f(ss,gp),ss.prototype.ra=function(){Bt(this.g,"a")},ss.prototype.qa=function(a){Bt(this.g,new Cp(a))},ss.prototype.pa=function(a){Bt(this.g,new mp)},ss.prototype.oa=function(){Bt(this.g,"b")},Xo.prototype.createWebChannel=Xo.prototype.g,Tt.prototype.send=Tt.prototype.o,Tt.prototype.open=Tt.prototype.m,Tt.prototype.close=Tt.prototype.close,Pl=_n.createWebChannelTransport=function(){return new Xo},Rl=_n.getStatEventTarget=function(){return Ho()},Sl=_n.Event=dr,Ma=_n.Stat={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},qo.NO_ERROR=0,qo.TIMEOUT=8,qo.HTTP_ERROR=6,Li=_n.ErrorCode=qo,kf.COMPLETE="complete",bl=_n.EventType=kf,Sf.EventType=Zs,Zs.OPEN="a",Zs.CLOSE="b",Zs.ERROR="c",Zs.MESSAGE="d",it.prototype.listen=it.prototype.J,hs=_n.WebChannel=Sf,JD=_n.FetchXmlHttpFactory=Ko,ke.prototype.listenOnce=ke.prototype.K,ke.prototype.getLastError=ke.prototype.Ha,ke.prototype.getLastErrorCode=ke.prototype.ya,ke.prototype.getStatus=ke.prototype.ca,ke.prototype.getResponseJson=ke.prototype.La,ke.prototype.getResponseText=ke.prototype.la,ke.prototype.send=ke.prototype.ea,ke.prototype.setWithCredentials=ke.prototype.Fa,vl=_n.XhrIo=ke}).apply(typeof Va<"u"?Va:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var L=class br{static FOLD_CASE=1;static LITERAL=2;static CLASS_NL=4;static DOT_NL=8;static ONE_LINE=16;static NON_GREEDY=32;static PERL_X=64;static UNICODE_GROUPS=128;static WAS_DOLLAR=256;static LOOKBEHIND=512;static MATCH_NL=br.CLASS_NL|br.DOT_NL;static PERL=br.CLASS_NL|br.ONE_LINE|br.PERL_X|br.UNICODE_GROUPS;static POSIX=0;static UNANCHORED=0;static ANCHOR_START=1;static ANCHOR_BOTH=2},Wt={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},Gi=128,Fl=new Int32Array(Gi),xl=new Int32Array(Gi),Ga=65535;for(let n=0;n<Gi;n++)n>=97&&n<=122?Fl[n]=n-32:Fl[n]=n,n>=65&&n<=90?xl[n]=n+32:xl[n]=n;var k=class{static CODES=new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]]);static toUpperCase(n){if(n<Gi)return Fl[n];let e=String.fromCodePoint(n).toUpperCase(),t=e.codePointAt(0)>Ga?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=r.codePointAt(0)>Ga?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}static toLowerCase(n){if(n<Gi)return xl[n];let e=String.fromCodePoint(n).toLowerCase(),t=e.codePointAt(0)>Ga?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=r.codePointAt(0)>Ga?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}},E=class{constructor(n,e=!1){this.data=n,this.isStride1=e,this.SIZE=e?2:3}getLo(n){return this.data[n*this.SIZE]}getHi(n){return this.data[n*this.SIZE+1]}getStride(n){return this.isStride1?1:this.data[n*this.SIZE+2]}get length(){return this.data.length/this.SIZE}},CC=new Uint8Array(256);for(let n=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";n<64;n++)CC[e.charCodeAt(n)]=n;var mC=n=>{let e=[],t=0,r=0;for(let s=0;s<n.length;s++){let i=CC[n.charCodeAt(s)];t|=(i&31)<<r,(i&32)===0?(e.push(t),t=0,r=0):r+=5}return e},_=(n,e)=>{let t=mC(n),r=e?t.length/2:t.length/3,s=new Uint32Array(r*3),i=0,o=0;for(let c=0;c<r;c++)i+=t[o++],s[c*3]=i,i+=t[o++],s[c*3+1]=i,s[c*3+2]=e?1:t[o++];return s},KD=n=>{let e=mC(n),t=new Map,r=0;for(let s=0;s<e.length;s+=2){r+=e[s];let i=e[s+1],o=i>>>1^-(i&1);t.set(r,r+o)}return t},Ua=class{constructor(n){this.initializer=n,this.cache=new Map}has(n){return n in this.initializer}get(n){if(this.cache.has(n))return this.cache.get(n);let e=this.initializer[n],t=e?e():null;return this.cache.set(n,t),t}},_t=class{static _CASE_ORBIT=null;static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=KD("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static _Print=null;static get Print(){return this._Print||(this._Print=new E(_("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static CATEGORIES=new Ua({C:()=>new E(_("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new E(_("AfgDgB",!0)),Cf:()=>new E(_("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new E(_("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new E(_("gg2B--B",!0)),L:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new E(_("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new E(_("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new E(_("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new E(_("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new E(_("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new E(_("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new E(_("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new E(_("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new E(_("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new E(_("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new E(_("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new E(_("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new E(_("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new E(_("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new E(_("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new E(_("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new E(_("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new E(_("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new E(_("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new E(_("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new E(_("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new E(_("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new E(_("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new E(_("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new E(_("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new E(_("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new E(_("ohIA",!0)),Zp:()=>new E(_("phIA",!0)),Zs:()=>new E(_("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new E(_("wBJIFbF",!0)),Alphabetic:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new E(_("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new E(_("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new E(_("7-8DE",!0)),Emoji_Modifier_Base:()=>new E(_("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new E(_("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new E(_("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new E(_("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new E(_("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new E(_("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new E(_("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new E(_("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new E(_("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))});static get Upper(){return this.CATEGORIES.get("Lu")}static SCRIPTS=new Ua({Adlam:()=>new E(_("go6DrCFJFB",!0)),Ahom:()=>new E(_("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new E(_("ggxCmS",!0)),Arabic:()=>new E(_("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new E(_("xpBlBDxBDCks9BE",!0)),Avestan:()=>new E(_("g4iC1BEG",!0)),Balinese:()=>new E(_("g4GsCCxB",!0)),Bamum:()=>new E(_("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new E(_("w26CdDF",!0)),Batak:()=>new E(_("g+GzBJD",!0)),Bengali:()=>new E(_("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new E(_("g17CYDY",!0)),Bhaiksuki:()=>new E(_("ggnCICsBCNLc",!0)),Bopomofo:()=>new E(_("qXB6wLqBxDf",!0)),Brahmi:()=>new E(_("ggkCtCFjBKA",!0)),Braille:()=>new E(_("ggK-H",!0)),Buginese:()=>new E(_("gwGbDB",!0)),Buhid:()=>new E(_("g6FT",!0)),Canadian_Aboriginal:()=>new E(_("ggF-TxRlC7tgCP",!0)),Carian:()=>new E(_("g1gCwB",!0)),Caucasian_Albanian:()=>new E(_("wphCzBMA",!0)),Chakma:()=>new E(_("gokC0BCR",!0)),Cham:()=>new E(_("gwqB2BKNDJDD",!0)),Cherokee:()=>new E(_("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new E(_("w9jCb",!0)),Common:()=>new E(_("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new E(_("ifNxkKzDGG",!0)),Cuneiform:()=>new E(_("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new E(_("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new E(_("w8rCiD",!0)),Cyrillic:()=>new E(_("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new E(_("gghCvC",!0)),Devanagari:()=>new E(_("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new E(_("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new E(_("ggmC7B",!0)),Duployan:()=>new E(_("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new E(_("ggsC1iBL68D",!0)),Elbasan:()=>new E(_("gohCnB",!0)),Elymaic:()=>new E(_("g-jCW",!0)),Ethiopic:()=>new E(_("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new E(_("gqjClBEcJB",!0)),Georgian:()=>new E(_("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new E(_("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new E(_("w5gCa",!0)),Grantha:()=>new E(_("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new E(_("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new E(_("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new E(_("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new E(_("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new E(_("go4C5B",!0)),Han:()=>new E(_("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new E(_("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new E(_("gojCnBJJ",!0)),Hanunoo:()=>new E(_("g5FU",!0)),Hatran:()=>new E(_("gniCSCBGE",!0)),Hebrew:()=>new E(_("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new E(_("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new E(_("giiCVCI",!0)),Inherited:()=>new E(_("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new E(_("g7iCSGH",!0)),Inscriptional_Parthian:()=>new E(_("g6iCVDH",!0)),Javanese:()=>new E(_("gsqBtCDJFB",!0)),Kaithi:()=>new E(_("gkkCiCLA",!0)),Kannada:()=>new E(_("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new E(_("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new E(_("g4nCQCoBEc",!0)),Kayah_Li:()=>new E(_("goqBtBCA",!0)),Kharoshthi:()=>new E(_("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new E(_("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new E(_("g8F9CDJHJnPf",!0)),Khojki:()=>new E(_("gwkCRCuB",!0)),Khudawadi:()=>new E(_("w1kC6BGJ",!0)),Kirat_Rai:()=>new E(_("gq7C5B",!0)),Lao:()=>new E(_("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new E(_("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new E(_("ggH3BEOEC",!0)),Limbu:()=>new E(_("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new E(_("gwhC2JKVLH",!0)),Linear_B:()=>new E(_("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new E(_("wmpBvBx1eA",!0)),Lycian:()=>new E(_("g0gCc",!0)),Lydian:()=>new E(_("gpiCZGA",!0)),Mahajani:()=>new E(_("wqkCmB",!0)),Makasar:()=>new E(_("g3nCY",!0)),Malayalam:()=>new E(_("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new E(_("giCbDA",!0)),Manichaean:()=>new E(_("g2iCmBFL",!0)),Marchen:()=>new E(_("wjnCfDVCN",!0)),Masaram_Gondi:()=>new E(_("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new E(_("gy7C6C",!0)),Meetei_Mayek:()=>new E(_("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new E(_("gg6DkGDP",!0)),Meroitic_Cursive:()=>new E(_("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new E(_("gsiCf",!0)),Miao:()=>new E(_("g47CqCF4BIQ",!0)),Modi:()=>new E(_("gwlCkCMJ",!0)),Mongolian:()=>new E(_("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new E(_("gy6CeCJFB",!0)),Multani:()=>new E(_("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new E(_("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new E(_("gkiCeJI",!0)),Nag_Mundari:()=>new E(_("wm5DpB",!0)),Nandinagari:()=>new E(_("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new E(_("gsGrBFZHKEB",!0)),Newa:()=>new E(_("gglC7CCE",!0)),Nko:()=>new E(_("g+B6BDC",!0)),Nushu:()=>new E(_("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new E(_("go4DsBENDJFB",!0)),Ogham:()=>new E(_("g0Fc",!0)),Ol_Chiki:()=>new E(_("wiHvB",!0)),Ol_Onal:()=>new E(_("wu5DqBFA",!0)),Old_Hungarian:()=>new E(_("gkjCyBOyBIF",!0)),Old_Italic:()=>new E(_("g4gCjBKC",!0)),Old_North_Arabian:()=>new E(_("g0iCf",!0)),Old_Permic:()=>new E(_("w6gCqB",!0)),Old_Persian:()=>new E(_("g9gCjBFN",!0)),Old_Sogdian:()=>new E(_("g4jCnB",!0)),Old_South_Arabian:()=>new E(_("gziCf",!0)),Old_Turkic:()=>new E(_("ggjCoC",!0)),Old_Uyghur:()=>new E(_("w7jCZ",!0)),Oriya:()=>new E(_("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new E(_("wlhCjBFjB",!0)),Osmanya:()=>new E(_("gkhCdDJ",!0)),Pahawh_Hmong:()=>new E(_("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new E(_("gjiCf",!0)),Pau_Cin_Hau:()=>new E(_("g2mC4B",!0)),Phags_Pa:()=>new E(_("giqB3B",!0)),Phoenician:()=>new E(_("goiCbEA",!0)),Psalter_Pahlavi:()=>new E(_("g8iCRIDNG",!0)),Rejang:()=>new E(_("wpqBjBMA",!0)),Runic:()=>new E(_("g1FqCEK",!0)),Samaritan:()=>new E(_("ggCtBDO",!0)),Saurashtra:()=>new E(_("gkqBlCJL",!0)),Sharada:()=>new E(_("gskC-ChsCH",!0)),Shavian:()=>new E(_("wihCvB",!0)),Siddham:()=>new E(_("gslC1BDlB",!0)),Sidetic:()=>new E(_("gqiCZ",!0)),SignWriting:()=>new E(_("gg2DrUQECO",!0)),Sinhala:()=>new E(_("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new E(_("w5jCpB",!0)),Sora_Sompeng:()=>new E(_("wmkCYIJ",!0)),Soyombo:()=>new E(_("wymCyC",!0)),Sundanese:()=>new E(_("g8G-BhIH",!0)),Sunuwar:()=>new E(_("g+mChBPJ",!0)),Syloti_Nagri:()=>new E(_("ggqBsB",!0)),Syriac:()=>new E(_("g4BNC7BDCxIK",!0)),Tagalog:()=>new E(_("g4FVKA",!0)),Tagbanwa:()=>new E(_("g7FMCCCB",!0)),Tai_Le:()=>new E(_("wqGdDE",!0)),Tai_Tham:()=>new E(_("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new E(_("g0qBiCZE",!0)),Tai_Yo:()=>new E(_("g25DeCVJB",!0)),Takri:()=>new E(_("g0lC5BHJ",!0)),Tamil:()=>new E(_("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new E(_("wz6CuCCJ",!0)),Tangut:()=>new E(_("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new E(_("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new E(_("g8BxB",!0)),Thai:()=>new E(_("hwD5BGb",!0)),Tibetan:()=>new E(_("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new E(_("wpL3BIBPA",!0)),Tirhuta:()=>new E(_("gklCnCJJ",!0)),Todhri:()=>new E(_("guhCzB",!0)),Tolong_Siki:()=>new E(_("wtnCrBFJ",!0)),Toto:()=>new E(_("w04De",!0)),Tulu_Tigalari:()=>new E(_("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new E(_("g8gCdCA",!0)),Unknown:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new E(_("gopBrJ",!0)),Vithkuqi:()=>new E(_("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new E(_("g24D5BGA",!0)),Warang_Citi:()=>new E(_("glmCyCNA",!0)),Yezidi:()=>new E(_("g0jCpBCCDB",!0)),Yi:()=>new E(_("ggoBskBE2B",!0)),Zanabazar_Square:()=>new E(_("gwmCnC",!0))});static FOLD_CATEGORIES=new Ua({L:()=>new E(_("laA",!0)),LC:()=>new E(_("laA",!0)),Ll:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new E(_("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new E(_("5cgBgBlgHAB",!1)),Mn:()=>new E(_("5cgBgBlgHAB",!1)),Emoji:()=>new E(_("8mJA",!0)),Extended_Pictographic:()=>new E(_("8mJA",!0)),Lowercase:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new E(_("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))});static FOLD_SCRIPT=new Ua({Common:()=>new E(_("8cgBgB",!1)),Greek:()=>new E(_("1FwUwU",!1)),Inherited:()=>new E(_("5cgBgBlgHAB",!1))})},z=class Vt{static MAX_RUNE=1114111;static MAX_ASCII=127;static MAX_LATIN1=255;static MAX_BMP=65535;static MIN_FOLD=65;static MAX_FOLD=125251;static MIN_HIGH_SURROGATE=55296;static MAX_HIGH_SURROGATE=56319;static MIN_LOW_SURROGATE=56320;static MAX_LOW_SURROGATE=57343;static MIN_SUPPLEMENTARY_CODE_POINT=65536;static is32(e,t){let r=0,s=e.length;for(;r<s;){let i=r+Math.floor((s-r)/2),o=e.getLo(i),c=e.getHi(i);if(o<=t&&t<=c){let u=e.getStride(i);return(t-o)%u===0}t<o?s=i:r=i+1}return!1}static is(e,t){if(t<=Vt.MAX_LATIN1){for(let r=0;r<e.length;r++){if(t>e.getHi(r))continue;let s=e.getLo(r);if(t<s)return!1;let i=e.getStride(r);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&Vt.is32(e,t)}static isUpper(e){if(e<=Vt.MAX_LATIN1){let t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return Vt.is(_t.Upper,e)}static isPrint(e){return e<=Vt.MAX_LATIN1?e>=32&&e<Vt.MAX_ASCII||e>=161&&e!==173:Vt.is(_t.Print,e)}static simpleFold(e){if(_t.CASE_ORBIT.has(e))return _t.CASE_ORBIT.get(e);let t=k.toLowerCase(e);return t!==e?t:k.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=Vt.MAX_ASCII&&t<=Vt.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let r=Vt.simpleFold(e);r!==e;r=Vt.simpleFold(r))if(r===t)return!0;return!1}},Gl=256,EC=new Uint8Array(Gl);for(let n=0;n<Gl;n++)EC[n]=97<=n&&n<=122||65<=n&&n<=90||48<=n&&n<=57||n===95?1:0;var Nl=null,Ol=null,X=class bt{static METACHARACTERS="\\.+*?()|[]{}^$";static EMPTY_BEGIN_LINE=1;static EMPTY_END_LINE=2;static EMPTY_BEGIN_TEXT=4;static EMPTY_END_TEXT=8;static EMPTY_WORD_BOUNDARY=16;static EMPTY_NO_WORD_BOUNDARY=32;static EMPTY_ALL=-1;static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")||k.CODES.get("a")<=e&&e<=k.CODES.get("z")||k.CODES.get("A")<=e&&e<=k.CODES.get("Z")}static unhex(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")?e-k.CODES.get("0"):k.CODES.get("a")<=e&&e<=k.CODES.get("f")?e-k.CODES.get("a")+10:k.CODES.get("A")<=e&&e<=k.CODES.get("F")?e-k.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(z.isPrint(e))bt.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case k.CODES.get('"'):t+='\\"';break;case k.CODES.get("\\"):t+="\\\\";break;case k.CODES.get("	"):t+="\\t";break;case k.CODES.get(`
`):t+="\\n";break;case k.CODES.get("\r"):t+="\\r";break;case k.CODES.get("\b"):t+="\\b";break;case k.CODES.get("\f"):t+="\\f";break;default:{let r=e.toString(16);e<256?(t+="\\x",r.length===1&&(t+="0"),t+=r):t+=`\\x{${r}}`;break}}return t}static stringToRunes(e){let t=String(e),r=[],s=0;for(;s<t.length;){let i=t.codePointAt(s);r.push(i),s+=i>z.MAX_BMP?2:1}return r}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<Gl?EC[e]===1:!1}static emptyOpContext(e,t){let r=0;return e<0&&(r|=bt.EMPTY_BEGIN_TEXT|bt.EMPTY_BEGIN_LINE),e===10&&(r|=bt.EMPTY_BEGIN_LINE),t<0&&(r|=bt.EMPTY_END_TEXT|bt.EMPTY_END_LINE),t===10&&(r|=bt.EMPTY_END_LINE),bt.isWordRune(e)!==bt.isWordRune(t)?r|=bt.EMPTY_WORD_BOUNDARY:r|=bt.EMPTY_NO_WORD_BOUNDARY,r}static quoteMeta(e){return e.split("").map(t=>bt.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>z.MAX_BMP?2:1}static toArray(e){let t=e.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=e[s];return r}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return Nl||(Nl=new TextEncoder),Nl.encode(e);{let t=[],r=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===z.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===z.MIN_LOW_SURROGATE?(i=z.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){Ol||(Ol=new TextDecoder("utf-8"));let t=e instanceof Uint8Array?e:new Uint8Array(e);return Ol.decode(t)}else{let t=[],r=0,s=0;for(;r<e.length;){let i=e[r++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[r++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[r++],c=e[r++],u=e[r++],l=((i&7)<<18|(o&63)<<12|(c&63)<<6|u&63)-z.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(z.MIN_HIGH_SURROGATE+(l>>10)),t[s++]=String.fromCharCode(z.MIN_LOW_SURROGATE+(l&1023))}else{let o=e[r++],c=e[r++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|c&63)}}return t.join("")}}},_C=(n=[],e=0)=>{let t=Object.create(null);for(let r=0;r<n.length;r++){let s=n[r],i=e+r;t[s]=i,t[i]=s}return Object.freeze(t)},Pr=class Ll{static Encoding=_C(["UTF_16","UTF_8"]);getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Ll.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Ll.Encoding.UTF_16}},Jg=class extends Pr{constructor(n=null){super(),this.bytes=n}getEncoding(){return Pr.Encoding.UTF_8}asCharSequence(){return X.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},zD=class extends Pr{constructor(n=null){super(),this.charSequence=n}getEncoding(){return Pr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return X.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Rr=class{static utf16(n){return new zD(n)}static utf8(n){return X.isByteArray(n)?new Jg(n):new Jg(X.stringToUtf8ByteArray(n))}},dt=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},WD=class extends dt{constructor(n,e=0,t=n.length){super(),this.bytes=n,this.start=e,this.end=t}hasString(n,e){let t=n.bytes;if(t.length===0)return!0;let r=this.indexOf(this.bytes,t,this.start+e);return r!==-1&&r<=this.end-t.length}hasAnyString(n,e){return n.ac8?n.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return dt.EOF();let e=this.bytes[n]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&n+1<this.end){let t=this.bytes[n+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&n+2<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;return(r&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|r&63)<<3|3}else if(e>=240&&e<=244&&n+3<this.end){let t=this.bytes[n+1]&255;if((t&192)!==128)return e<<3|1;let r=this.bytes[n+2]&255;if((r&192)!==128)return e<<3|1;let s=this.bytes[n+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(r&63)<<6|s&63)<<3|4}else return e<<3|1}index(n,e){e+=this.start;let t=this.indexOf(this.bytes,n.prefixUTF8,e);return t<0?t:t-e}context(n){n+=this.start;let e=-1;if(n>this.start&&n<=this.end){let r=n-1;if(e=this.bytes[r--],e>=128){let s=n-4;for(s<this.start&&(s=this.start);r>=s&&(this.bytes[r]&192)===128;)r--;r<this.start&&(r=this.start),e=this.step(r-this.start)>>3}}let t=n<this.end?this.step(n-this.start)>>3:-1;return X.emptyOpContext(e,t)}indexOf(n,e,t=0){let r=e.length;if(r===0)return t<=this.end?t:-1;let s=e[0],i=this.end-r,o=typeof n.indexOf=="function",c=t;for(;c<=i;){if(o){if(c=n.indexOf(s,c),c===-1||c>i)return-1}else{for(;c<=i&&n[c]!==s;)c++;if(c>i)return-1}let u=!0;for(let l=1;l<r;l++)if(n[c+l]!==e[l]){u=!1;break}if(u)return c;c++}return-1}prefixLength(n){return n.prefixUTF8.length}},QD=class extends dt{constructor(n,e=0,t=n.length){super(),this.charSequence=n,this.start=e,this.end=t}hasString(n,e){let t=this.charSequence.indexOf(n.str,this.start+e);return t!==-1&&t<=this.end-n.str.length}hasAnyString(n,e){return n.ac16?n.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(n){if(n+=this.start,n>=this.end)return dt.EOF();let e=this.charSequence.charCodeAt(n);if(e<z.MIN_HIGH_SURROGATE||e>z.MAX_HIGH_SURROGATE||n+1>=this.end)return e<<3|1;let t=this.charSequence.charCodeAt(n+1);return t>=z.MIN_LOW_SURROGATE&&t<=z.MAX_LOW_SURROGATE?(e-z.MIN_HIGH_SURROGATE)*1024+(t-z.MIN_LOW_SURROGATE)+z.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(n,e){e+=this.start;let t=this.charSequence.indexOf(n.prefix,e);return t<0||t>this.end-n.prefix.length?-1:t-e}context(n){n+=this.start;let e=n>this.start&&n<=this.end?this.charSequence.charCodeAt(n-1):-1,t=n<this.end?this.charSequence.charCodeAt(n):-1;return X.emptyOpContext(e,t)}prefixLength(n){return n.prefix.length}},ve=class{static fromUTF8(n,e=0,t=n.length){return new WD(n,e,t)}static fromUTF16(n,e=0,t=n.length){return new QD(n,e,t)}},Ui=class extends Error{constructor(n){super(n),this.name="RE2JSException"}},be=class extends Ui{constructor(n,e=null){let t=`error parsing regexp: ${n}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=n,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},wC=class extends Ui{constructor(n){super(n),this.name="RE2JSCompileException"}},Et=class extends Ui{constructor(n){super(n),this.name="RE2JSGroupException"}},$D=class extends Ui{constructor(n){super(n),this.name="RE2JSFlagsException"}},Mi=class extends Ui{constructor(n){super(n),this.name="RE2JSInternalException"}},Kg=class yC{static MAX_REPLACER_ARGS=65535;static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(r=>{let s=r.codePointAt(0);return s===k.CODES.get("\\")||s===k.CODES.get("$")?`\\${r}`:r}).join(""):e.indexOf("$")<0?e:e.split("").map(r=>r.codePointAt(0)===k.CODES.get("$")?"$$":r).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;let r=this.patternInput.re2();this.patternGroupCount=r.numberOfCapturingGroups(),this.groups=[],this.namedGroups=r.namedGroups,this.numberOfInstructions=r.numberOfInstructions(),t instanceof Pr?this.resetMatcherInput(t):X.isByteArray(t)?this.resetMatcherInput(Rr.utf8(t)):this.resetMatcherInput(Rr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof Pr||(X.isByteArray(e)?e=Rr.utf8(e):e=Rr.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Et(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new Et(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){let s=this.namedGroups[e];if(!Number.isFinite(s))throw new Et(`group '${e}' not found`);e=s}let t=this.start(e),r=this.end(e);return t<0&&r<0?null:this.substring(t,r)}getNamedGroups(){if(!this.hasMatch)throw new Et("perhaps no match attempted");let e=Object.create(null);for(let t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new Et(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new Et("perhaps no match attempted");if(e===0||this.hasGroups)return;let t=this.matcherInputLength,r=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!r[0])throw new Et("inconsistency in matching group data");this.groups=r[1],this.hasGroups=!0}matches(){return this.genMatch(0,L.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,L.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new Et(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){let t=(this.matcherInput.isUTF16Encoding()?ve.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):ve.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,L.UNANCHORED)}genMatch(e,t){let r=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return r[0]?(this.groups=r[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?X.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let r="",s=this.start(),i=this.end();return this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i,r+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),r}appendReplacementInternalJava(e){let t="",r=0,s=e.length,i=0;for(;i<s;){let o=e.codePointAt(i);if(o===k.CODES.get("\\")){if(r<i&&(t+=e.substring(r,i)),i++,i>=s)throw new Et("character to be escaped is missing");r=i,i++;continue}if(o===k.CODES.get("$")){if(r<i&&(t+=e.substring(r,i)),i+1>=s)throw new Et("Illegal group reference: group index is missing");let c=e.codePointAt(i+1);if(k.CODES.get("0")<=c&&c<=k.CODES.get("9")){let u=c-k.CODES.get("0"),l=i+2;for(;l<s;l++){let f=e.codePointAt(l);if(f<k.CODES.get("0")||f>k.CODES.get("9")||u*10+f-k.CODES.get("0")>this.patternGroupCount)break;u=u*10+f-k.CODES.get("0")}if(u>this.patternGroupCount)throw new Et(`n > number of groups: ${u}`);let h=this.group(u);h!==null&&(t+=h),i=l,r=i}else if(c===k.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==k.CODES.get("}");)u++;if(u>=s)throw new Et("named capture group is missing trailing '}'");let l=e.substring(i+2,u),h=this.group(l);h!==null&&(t+=h),i=u+1,r=i}else throw new Et("Illegal group reference");continue}i++}return r<s&&(t+=e.substring(r,s)),t}appendReplacementInternalJs(e){let t="",r=0,s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===k.CODES.get("$")){let o=e.codePointAt(i+1);if(k.CODES.get("$")===o){r<i&&(t+=e.substring(r,i)),t+="$",i++,r=i+1;continue}else if(k.CODES.get("&")===o){r<i&&(t+=e.substring(r,i));let c=this.group(0);c!==null?t+=c:t+="$&",i++,r=i+1;continue}else if(k.CODES.get("`")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(0,this.start(0)),i++,r=i+1;continue}else if(k.CODES.get("'")===o){r<i&&(t+=e.substring(r,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,r=i+1;continue}else if(k.CODES.get("1")<=o&&o<=k.CODES.get("9")){let c=o-k.CODES.get("0");for(r<i&&(t+=e.substring(r,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<k.CODES.get("0")||o>k.CODES.get("9")||c*10+o-k.CODES.get("0")>this.patternGroupCount));i++)c=c*10+o-k.CODES.get("0");if(c>this.patternGroupCount){t+=`$${c}`,r=i,i--;continue}let u=this.group(c);u!==null&&(t+=u),r=i,i--;continue}else if(o===k.CODES.get("<")){r<i&&(t+=e.substring(r,i)),i++;let c=i+1;for(;c<e.length&&e.codePointAt(c)!==k.CODES.get(">")&&e.codePointAt(c)!==k.CODES.get(" ");)c++;if(c===e.length||e.codePointAt(c)!==k.CODES.get(">")){t+=e.substring(i-1,c+1),r=c+1,i=c;continue}let u=e.substring(i+1,c);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){let l=this.group(u);l!==null&&(t+=l)}else t+=`$<${u}>`;r=c+1,i=c;continue}}return r<s&&(t+=e.substring(r,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,r=!1){let s="";this.reset();let i=typeof e=="function",o=Object.keys(this.namedGroups).length>0,c=null;if(i){if(this.groupCount()>=yC.MAX_REPLACER_ARGS)throw new Et("Too many capture groups to safely invoke replacer function");c=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,c):this.appendReplacement(e,r),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,r){let s="",i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;let c=this.buildReplacerArgs(i,t,r);return s+=String(e(...c)),s}buildReplacerArgs(e,t,r){let s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){let c=this.start(o);c<0?s.push(void 0):s.push(this.substring(c,this.end(o)))}if(s.push(e),s.push(r),t){let o=this.getNamedGroups();for(let c in o)o[c]===null&&(o[c]=void 0);s.push(o)}return s}},F=class et{static ALT=1;static ALT_MATCH=2;static CAPTURE=3;static EMPTY_WIDTH=4;static FAIL=5;static MATCH=6;static NOP=7;static RUNE=8;static RUNE1=9;static RUNE_ANY=10;static RUNE_ANY_NOT_NL=11;static LB_WRITE=12;static LB_CHECK=13;static isRuneOp(e){return et.RUNE<=e&&e<=et.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let r of e)t+=X.escapeRune(r);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&L.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e):e===o}let t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&L.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}let t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case et.ALT:return`alt -> ${this.out}, ${this.arg}`;case et.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case et.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case et.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case et.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case et.FAIL:return"fail";case et.NOP:return`nop -> ${this.out}`;case et.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case et.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case et.RUNE:return this.runes===null?"rune <null>":["rune ",et.escapeRunes(this.runes),(this.arg&L.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case et.RUNE1:return`rune1 ${et.escapeRunes(this.runes)} -> ${this.out}`;case et.RUNE_ANY:return`any -> ${this.out}`;case et.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},zg=class{constructor(n){this.sparse=new Int32Array(n),this.densePcs=new Int32Array(n),this.denseCaps=null,this.size=0,this.ncap=0}init(n){this.ncap=n;let e=this.densePcs.length*n;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(n){let e=this.sparse[n];return e<this.size&&this.densePcs[e]===n}isEmpty(){return this.size===0}add(n){let e=this.size++;return this.sparse[n]=e,this.densePcs[e]=n,e}clear(){this.size=0}toString(){let n="{";for(let e=0;e<this.size;e++)e!==0&&(n+=", "),n+=this.densePcs[e];return n+="}",n}},DC=class Vl{static fromRE2(e){let t=new Vl;return t.prog=e.prog,t.re2=e,t.q0=new zg(t.prog.numInst()),t.q1=new zg(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return Vl.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?X.emptyInts():X.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,r){let s=this.re2.cond;if(s===X.EMPTY_ALL||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,C=-1,v=0;l!==dt.EOF()&&(l=e.step(i+f),C=l>>3,v=l&7);let R;for(i===0?R=X.emptyOpContext(-1,h):R=e.context(i);;){if(c.isEmpty()){if((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&C!==this.re2.prefixRune&&e.canCheckPrefix()){let U=e.index(this.re2,i);if(U<0)break;i+=U,l=e.step(i),h=l>>3,f=l&7,l=e.step(i+f),C=l>>3,v=l&7,R=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let U=0;U<this.prog.lbStarts.length;U++)this.add(c,this.prog.lbStarts[U],i,this.matchcap,0,R);!this.matched&&(i===0||r===L.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(c,this.prog.start,i,this.matchcap,0,R));let S=i+f;if(R=e.context(S),this.step(c,u,i,S,h,R,r,i===e.endPos()),f===0||this.ncap===0&&this.matched)break;i+=f,h=C,f=v,h!==-1&&(l=e.step(i+f),C=l>>3,v=l&7);let G=c;c=u,u=G}return u.clear(),this.matched}matchSet(e,t,r){let s=this.re2.cond;if(s===X.EMPTY_ALL)return[];if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,c=this.q0,u=this.q1,l=e.step(i),h=l>>3,f=l&7,C=-1,v=0;l!==dt.EOF()&&(l=e.step(i+f),C=l>>3,v=l&7);let R=i===0?X.emptyOpContext(-1,h):e.context(i),S=new Set;for(;!(c.isEmpty()&&((s&X.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let ae=0;ae<this.prog.lbStarts.length;ae++)this.add(c,this.prog.lbStarts[ae],i,this.matchcap,0,R);(i===0||r===L.UNANCHORED)&&i>=o&&this.add(c,this.prog.start,i,this.matchcap,0,R);let G=i+f;R=e.context(G);for(let ae=0;ae<c.size;ae++){let Ee=c.densePcs[ae],_e=this.prog.inst[Ee],Oe=ae*this.ncap,we=!1;switch(_e.op){case F.MATCH:if(r===L.ANCHOR_BOTH&&i!==e.endPos())break;S.add(_e.arg);break;case F.RUNE:we=_e.matchRune(h);break;case F.RUNE1:we=h===_e.runes[0];break;case F.RUNE_ANY:we=!0;break;case F.RUNE_ANY_NOT_NL:we=h!==10;break;default:continue}we&&this.add(u,_e.out,G,c.denseCaps,Oe,R)}if(c.clear(),f===0)break;i+=f,h=C,f=v,h!==-1&&(l=e.step(i+f),C=l>>3,v=l&7);let U=c;c=u,u=U}return u.clear(),Array.from(S).sort((G,U)=>G-U)}step(e,t,r,s,i,o,c,u){let l=this.re2.longest;for(let h=0;h<e.size;h++){let f=e.densePcs[h],C=h*this.ncap;if(l&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[C])continue;let v=this.prog.inst[f],R=!1;switch(v.op){case F.MATCH:if(c===L.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!l||!this.matched||this.matchcap[1]<r)){e.denseCaps[C+1]=r;for(let S=0;S<this.ncap;S++)this.matchcap[S]=e.denseCaps[C+S]}l||(e.size=0),this.matched=!0;break;case F.RUNE:R=v.matchRune(i);break;case F.RUNE1:R=i===v.runes[0];break;case F.RUNE_ANY:R=!0;break;case F.RUNE_ANY_NOT_NL:R=i!==10;break;default:continue}R&&this.add(t,v.out,s,e.denseCaps,C,o)}e.clear()}add(e,t,r,s,i,o){for(;;){if(t===0||e.contains(t))return;let c=e.add(t),u=this.prog.inst[t];switch(u.op){case F.FAIL:return;case F.ALT:case F.ALT_MATCH:this.add(e,u.out,r,s,i,o),t=u.arg;continue;case F.EMPTY_WIDTH:if((u.arg&~o)===0){t=u.out;continue}return;case F.NOP:t=u.out;continue;case F.CAPTURE:if(u.arg<this.ncap){let l=s[i+u.arg];s[i+u.arg]=r,this.add(e,u.out,r,s,i,o),s[i+u.arg]=l;return}else{t=u.out;continue}case F.LB_WRITE:this.lbTable[Math.abs(u.arg)]=r,t=u.out;continue;case F.LB_CHECK:if(u.arg>0){if(this.lbTable[u.arg]===r){t=u.out;continue}}else if(this.lbTable[-u.arg]!==r){t=u.out;continue}return;case F.MATCH:case F.RUNE:case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:if(this.ncap>0){let l=c*this.ncap;for(let h=0;h<this.ncap;h++)e.denseCaps[l+h]=s[i+h]}return;default:throw new Mi("unhandled")}}}},Wg=n=>{let e=-2128831035;for(let t=0;t<n.length;t++)e^=n[t],e=Math.imul(e,16777619);return e},YD=(n,e)=>{if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0},XD=class{constructor(n,e,t=[]){this.nfaStates=n,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array(z.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array(z.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},IC=class Ml{static MAX_CACHE_CLEARS=5;static STATE_MEMORY_ESTIMATE=838;constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/Ml.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){let t=new Set,r=[...e],s=!1,i=[];for(;r.length>0;){let c=r.pop();if(t.has(c))continue;t.add(c);let u=this.prog.getInst(c);switch(u.op){case F.MATCH:s=!0,i.includes(u.arg)||i.push(u.arg);break;case F.ALT:case F.ALT_MATCH:r.push(u.out),r.push(u.arg);break;case F.NOP:case F.CAPTURE:r.push(u.out);break;case F.EMPTY_WIDTH:case F.LB_WRITE:case F.LB_CHECK:return null}}let o=Int32Array.from(t).sort();return i.sort((c,u)=>c-u),{pcs:o,isMatch:s,matchIDs:i}}getState(e){let t=this.computeClosure(e);if(!t)return null;let r=t.pcs,s=Wg(r),i=this.stateCache.get(s);if(i)for(let c=0;c<i.length;c++){let u=i[c];if(YD(u.nfaStates,r))return u.lastSeen=++this.clock,u}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=Ml.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}let o=new XD(r,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){let e=[];for(let o of this.stateCache.values())for(let c=0;c<o.length;c++)e.push(o[c]);e.sort((o,c)=>o.lastSeen-c.lastSeen);let t=Math.max(1,Math.floor(this.stateLimit/2)),r=e.length-t,s=e.slice(r),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){let c=s[o];c.nextLatin1.fill(null),c.nextLatin1Anchored.fill(null),c.transKeys.length=0,c.transVals.length=0;let u=Wg(c.nfaStates),l=this.stateCache.get(u);l||(l=[],this.stateCache.set(u,l)),l.push(c),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,r){if(t<=z.MAX_LATIN1)if(r===L.UNANCHORED){let o=e.nextLatin1[t];if(o!==null)return o}else{let o=e.nextLatin1Anchored[t];if(o!==null)return o}else{let o=t+(r===L.UNANCHORED?0:z.MAX_RUNE+1),c=e.transKeys,u=c.length;for(let l=0;l<u;l++)if(c[l]===o)return e.transVals[l]}let s=[];for(let o=0;o<e.nfaStates.length;o++){let c=e.nfaStates[o],u=this.prog.getInst(c);F.isRuneOp(u.op)&&u.matchRune(t)&&s.push(u.out)}r===L.UNANCHORED&&s.push(this.prog.start);let i=this.getState(s);if(t<=z.MAX_LATIN1)r===L.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{let o=t+(r===L.UNANCHORED?0:z.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,r){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(r===L.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){let c=e.step(o),u=c>>3,l=c&7;if(l===0)break;if(i=r===L.UNANCHORED&&u<=z.MAX_LATIN1&&i.nextLatin1[u]||this.step(i,u,r),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(r===L.ANCHOR_BOTH){if(o+l===s)return!0}else return!0;if(i.nfaStates.length===0&&r!==L.UNANCHORED)return!1;o+=l}return!1}matchSet(e,t,r){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState,o=new Set,c=(l,h)=>{l.isMatch&&(r===L.ANCHOR_BOTH?h===s&&l.matchIDs.forEach(f=>o.add(f)):l.matchIDs.forEach(f=>o.add(f)))};c(i,t);let u=t;for(;u<s;){let l=e.step(u),h=l>>3,f=l&7;if(f===0)break;if(i=r===L.UNANCHORED&&h<=z.MAX_LATIN1&&i.nextLatin1[h]||this.step(i,h,r),i===null)return null;if(i.lastSeen=++this.clock,u+=f,c(i,u),i.nfaStates.length===0&&r!==L.UNANCHORED)break}return Array.from(o).sort((l,h)=>l-h)}},ZD=32,eI=500,kl=256,tI=256*1024,nI=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(kl),this.jobArg=new Uint8Array(kl),this.jobPos=new Int32Array(kl),this.jobLen=0,this.visited=new Uint32Array(0)}reset(n,e,t){this.end=e,this.jobLen=0,this.ncap=t;let r=n.numInst()*(e+1)+ZD-1>>>5;this.visited.length<r?this.visited=new Uint32Array(r):this.visited.fill(0,0,r),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(n,e){let t=n*(this.end+1)+e,r=t>>>5,s=1<<(t&31);return(this.visited[r]&s)!==0?!1:(this.visited[r]|=s,!0)}push(n,e,t,r){if(n.prog.getInst(e).op!==F.FAIL&&(r||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){let s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;let o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;let c=new Int32Array(s);c.set(this.jobPos),this.jobPos=c}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=r?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(n,e,t,r,s){let i=n.longest;for(this.push(n,t,r,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],c=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],l=!0;for(;!(!l&&!this.shouldVisit(o,u));){l=!1;let h=n.prog.getInst(o);switch(h.op){case F.FAIL:throw new Mi("unexpected InstFail");case F.ALT:if(c){c=!1,o=h.arg;continue}else{this.push(n,o,u,!0),o=h.out;continue}case F.ALT_MATCH:{let f=n.prog.getInst(h.out);if(F.isRuneOp(f.op)){this.push(n,h.arg,u,!1),o=h.arg,u=this.end;continue}this.push(n,h.out,this.end,!1),o=h.out;continue}case F.RUNE:{let f=e.step(u);if(f===dt.EOF()||!h.matchRune(f>>3))break;u+=f&7,o=h.out;continue}case F.RUNE1:{let f=e.step(u);if(f===dt.EOF()||f>>3!==h.runes[0])break;u+=f&7,o=h.out;continue}case F.RUNE_ANY_NOT_NL:{let f=e.step(u);if(f===dt.EOF()||f>>3===10)break;u+=f&7,o=h.out;continue}case F.RUNE_ANY:{let f=e.step(u);if(f===dt.EOF())break;u+=f&7,o=h.out;continue}case F.CAPTURE:if(c){this.cap[h.arg]=u;break}else{h.arg<this.ncap&&(this.push(n,o,this.cap[h.arg],!0),this.cap[h.arg]=u),o=h.out;continue}case F.EMPTY_WIDTH:{let f=e.context(u);if((h.arg&~f)!==0)break;o=h.out;continue}case F.NOP:o=h.out;continue;case F.MATCH:{if(s===L.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);let f=this.matchcap[1];if((f===-1||i&&u>0&&u>f)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case F.LB_WRITE:case F.LB_CHECK:throw new Mi("Backtracker cannot evaluate Lookbehind instructions");default:throw new Mi("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}},Ha=[],qa=class TC{static shouldBacktrack(e){return e.numInst()<=eI}static maxBitStateLen(e){return TC.shouldBacktrack(e)?Math.floor(tI/e.numInst()):0}static execute(e,t,r,s,i){let o=e.cond;if(o===X.EMPTY_ALL||(s===L.ANCHOR_START||s===L.ANCHOR_BOTH)&&r!==0||(o&X.EMPTY_BEGIN_TEXT)!==0&&r!==0)return null;let c=Ha.length>0?Ha.pop():new nI,u=t.endPos();c.reset(e.prog,u,i);let l=!1;if((o&X.EMPTY_BEGIN_TEXT)!==0||s===L.ANCHOR_START||s===L.ANCHOR_BOTH)c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)&&(l=!0);else{let f=-1;for(;r<=u&&f!==0;r+=f){if(e.prefix.length>0){let v=t.index(e,r);if(v<0)break;r+=v}if(c.ncap>0&&(c.cap[0]=r),c.tryBacktrack(e,t,e.prog.start,r,s)){l=!0;break}let C=t.step(r);f=C===dt.EOF()?0:C&7}}if(!l)return Ha.push(c),null;let h=i===0?[]:X.toArray(c.matchcap.subarray(0,i));return Ha.push(c),h}},Qg=class{constructor(n){this.sparse=new Uint32Array(n),this.dense=new Uint32Array(n),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(n){return n<this.sparse.length&&this.sparse[n]<this.size&&this.dense[this.sparse[n]]===n}insert(n){this.contains(n)||this.insertNew(n)}insertNew(n){n>=this.sparse.length||(this.sparse[n]=this.size,this.dense[this.size]=n,this.size++)}},rI=(n,e,t,r)=>{let s=n.length,i=e.length,o=0,c=0,u=[],l=[],h=!0,f=-1,C=v=>{let R=v?n:e,S=v?o:c,G=v?t:r;return f>0&&R[S]<=u[f]?!1:(u.push(R[S],R[S+1]),v?o+=2:c+=2,f+=2,l.push(G),!0)};for(;o<s||c<i;)if(c>=i?h=C(!0):o>=s||e[c]<n[o]?h=C(!1):h=C(!0),!h)return null;return{merged:u,next:l}},sI=class{constructor(n){this.start=n.start,this.numCap=n.numCap,this.inst=new Array(n.inst.length);for(let e=0;e<n.inst.length;e++){let t=n.inst[e],r=new F(t.op);r.out=t.out,r.arg=t.arg,r.runes=t.runes?t.runes.slice():[],r.next=null,this.inst[e]=r}}},iI=n=>{let e=new sI(n);for(let t=0;t<e.inst.length;t++){let r=e.inst[t];if(r.op!==F.ALT&&r.op!==F.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[r[i]];if(o.op!==F.ALT&&o.op!==F.ALT_MATCH&&(s="arg",i="out",o=e.inst[r[i]],o.op!==F.ALT&&o.op!==F.ALT_MATCH))continue;let c=e.inst[r[s]];if(c.op===F.ALT||c.op===F.ALT_MATCH)continue;let u="out",l="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,u="arg",l="out"),h&&(o[u]=r[s]),r[s]===o[u]&&(r[i]=o[l])}return e},oI=n=>{if(n.inst.length>=1e3)return null;let e=new Qg(n.inst.length),t=new Qg(n.inst.length),r=new Array(n.inst.length),s=new Array(n.inst.length).fill(!1),i=o=>{let c=!0,u=n.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case F.ALT:case F.ALT_MATCH:{c=i(u.out)&&i(u.arg);let l=s[u.out],h=s[u.arg];if(l&&h)return!1;if(h){let R=u.out;u.out=u.arg,u.arg=R;let S=l;l=h,h=S}l&&(s[o]=!0,u.op=F.ALT_MATCH);let f=r[u.out]||[],C=r[u.arg]||[],v=rI(f,C,u.out,u.arg);if(!v)return!1;r[o]=v.merged,u.next=new Uint32Array(v.next);break}case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:c=i(u.out),s[o]=s[u.out],r[o]=r[u.out]?r[u.out].slice():[],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break;case F.MATCH:case F.FAIL:s[o]=u.op===F.MATCH;break;case F.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){r[o]=[],u.next=new Uint32Array([u.out]);break}let l=[];if(u.runes.length===1&&(u.arg&L.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=z.simpleFold(h);f!==h;f=z.simpleFold(f))l.push(f,f);l.sort((f,C)=>f-C)}else for(let h=0;h<u.runes.length;h++)l.push(u.runes[h]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let l=[];if((u.arg&L.FOLD_CASE)!==0){let h=u.runes[0];l.push(h,h);for(let f=z.simpleFold(h);f!==h;f=z.simpleFold(f))l.push(f,f);l.sort((f,C)=>f-C)}else l.push(u.runes[0],u.runes[0]);r[o]=l,u.next=new Uint32Array(Math.floor(l.length/2)+1).fill(u.out),u.op=F.RUNE;break}case F.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,z.MAX_RUNE],u.next=new Uint32Array([u.out]);break;case F.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),r[o]=[0,9,11,z.MAX_RUNE],u.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(u.out);break}return c};for(e.clear(),e.insert(n.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<n.inst.length;o++)r[o]&&(n.inst[o].runes=r[o]);return n},aI=(n,e)=>{for(let t=0;t<e.inst.length;t++){let r=e.inst[t];switch(r.op){case F.ALT:case F.ALT_MATCH:case F.RUNE:break;case F.CAPTURE:case F.EMPTY_WIDTH:case F.NOP:case F.MATCH:case F.FAIL:n.inst[t].next=null;break;case F.RUNE1:case F.RUNE_ANY:case F.RUNE_ANY_NOT_NL:n.inst[t].next=null,n.inst[t].op=r.op,n.inst[t].runes=r.runes?r.runes.slice():[];break}}},$g=class AC{static compile(e){if(e.start===0||e.numLb>0)return null;let t=e.inst[e.start];if(t.op!==F.EMPTY_WIDTH||(t.arg&X.EMPTY_BEGIN_TEXT)===0)return null;let r=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===F.ALT||e.inst[i].op===F.ALT_MATCH){r=!0;break}for(let i=0;i<e.inst.length;i++){let o=e.inst[i],c=e.inst[o.out].op;switch(o.op){case F.ALT:case F.ALT_MATCH:if(c===F.MATCH||e.inst[o.arg].op===F.MATCH)return null;break;case F.EMPTY_WIDTH:if(c===F.MATCH){if((o.arg&X.EMPTY_END_TEXT)===X.EMPTY_END_TEXT)continue;return null}break;default:if(c===F.MATCH&&r)return null;break}}let s=iI(e);return s=oI(s),s!==null&&aI(s,e),s}static next(e,t){let r=e.matchRunePos(t);return r>=0?e.next[r]:e.op===F.ALT_MATCH?e.out:0}static execute(e,t,r,s,i){let o=e.onepass;if(!o)return null;let c=new Int32Array(i).fill(-1),u=!1,l=t.step(r),h=l>>3,f=l&7,C=dt.EOF(),v=-1,R=0;l!==dt.EOF()&&(C=t.step(r+f),C!==dt.EOF()&&(v=C>>3,R=C&7));let S=r===0?X.emptyOpContext(-1,h):t.context(r),G=o.start,U;for(;;){switch(U=o.inst[G],G=U.out,U.op){case F.MATCH:return s===L.ANCHOR_BOTH&&r!==t.endPos()?null:(u=!0,c.length>0&&(c[0]=0,c[1]=r),i===0?[]:X.toArray(c));case F.RUNE:if(!U.matchRune(h))return null;break;case F.RUNE1:if(h!==U.runes[0])return null;break;case F.RUNE_ANY:break;case F.RUNE_ANY_NOT_NL:if(h===10)return null;break;case F.ALT:case F.ALT_MATCH:G=AC.next(U,h);continue;case F.FAIL:return null;case F.NOP:continue;case F.EMPTY_WIDTH:if((U.arg&~S)!==0)return null;continue;case F.CAPTURE:U.arg<c.length&&(c[U.arg]=r);continue;default:throw new Mi("bad inst")}if(f===0)break;S=X.emptyOpContext(h,v),r+=f,h=v,f=R,h!==-1&&(C=t.step(r+f),C!==dt.EOF()?(v=C>>3,R=C&7):(v=-1,R=0))}return u?i===0?[]:X.toArray(c):null}},T=class se{static Op=_C(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"]);static isPseudoOp(e){return e>=se.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===k.CODES.get("-")?"\\":""}static fromRegexp(e){let t=new se(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=se.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=se.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case se.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case se.Op.EMPTY_MATCH:e+="(?:)";break;case se.Op.STAR:case se.Op.PLUS:case se.Op.QUEST:case se.Op.REPEAT:{let t=this.subs[0];switch(t.op>se.Op.CAPTURE||t.op===se.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case se.Op.STAR:e+="*";break;case se.Op.PLUS:e+="+";break;case se.Op.QUEST:e+="?";break;case se.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&L.NON_GREEDY)!==0&&(e+="?");break}case se.Op.CONCAT:for(let t of this.subs)t.op===se.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case se.Op.ALTERNATE:{let t="";for(let r of this.subs)e+=t,t="|",e+=r.appendTo();break}case se.Op.LITERAL:(this.flags&L.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=X.escapeRune(t);(this.flags&L.FOLD_CASE)!==0&&(e+=")");break;case se.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case se.Op.ANY_CHAR:e+="(?s:.)";break;case se.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case se.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case se.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==se.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case se.Op.BEGIN_TEXT:e+="\\A";break;case se.Op.END_TEXT:(this.flags&L.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case se.Op.BEGIN_LINE:e+="^";break;case se.Op.END_LINE:e+="$";break;case se.Op.WORD_BOUNDARY:e+="\\b";break;case se.Op.NO_WORD_BOUNDARY:e+="\\B";break;case se.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===z.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){let r=this.runes[t]+1,s=this.runes[t+1]-1;e+=se.quoteIfHyphen(r),e+=X.escapeRune(r),r!==s&&(e+="-",e+=se.quoteIfHyphen(s),e+=X.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){let r=this.runes[t],s=this.runes[t+1];e+=se.quoteIfHyphen(r),e+=X.escapeRune(r),r!==s&&(e+="-",e+=se.quoteIfHyphen(s),e+=X.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===se.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){let r=t.maxCap();e<r&&(e=r)}return e}equals(e){if(!(e!==null&&e instanceof se)||this.op!==e.op)return!1;switch(this.op){case se.Op.END_TEXT:if((this.flags&L.WAS_DOLLAR)!==(e.flags&L.WAS_DOLLAR))return!1;break;case se.Op.LITERAL:case se.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case se.Op.ALTERNATE:case se.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case se.Op.STAR:case se.Op.PLUS:case se.Op.QUEST:if((this.flags&L.NON_GREEDY)!==(e.flags&L.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case se.Op.REPEAT:if((this.flags&L.NON_GREEDY)!==(e.flags&L.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case se.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case se.Op.PLB:case se.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},Yg=class{constructor(n){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(let t of n){let r=0;for(let s=0;s<t.length;s++){let i=t[s];i in this.next[r]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[r][i]=this.next.length-1),r=this.next[r][i]}this.match[r]=!0}let e=[];for(let t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){let r=this.next[0][t];this.fail[r]=0,e.push(r)}for(;e.length>0;){let t=e.shift();for(let r in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],r)){let s=this.next[t][r],i=this.fail[t];for(;i!==0&&!(r in this.next[i]);)i=this.fail[i];r in this.next[i]?this.fail[s]=this.next[i][r]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n.charCodeAt(s);for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}searchUTF8(n,e,t){let r=0;for(let s=e;s<t;s++){let i=n[s];for(;r!==0&&!(i in this.next[r]);)r=this.fail[r];if(i in this.next[r]&&(r=this.next[r][i]),this.match[r])return!0}return!1}},Ie=class Vi{static Type={NONE:0,EXACT:1,AND:2,OR:3};constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case Vi.Type.NONE:return!0;case Vi.Type.EXACT:return e.hasString(this,t);case Vi.Type.AND:for(let r=0;r<this.subs.length;r++)if(!this.subs[r].eval(e,t))return!1;return!0;case Vi.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let r=0;r<this.subs.length;r++)if(this.subs[r].eval(e,t))return!0;return!1;default:return!0}}},cI=class wn{static build(e){let t=wn.fromRegexp(e);return wn.simplify(t)}static fromRegexp(e){if(!e)return new Ie(Ie.Type.NONE);switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.NO_MATCH:case T.Op.EMPTY_MATCH:case T.Op.BEGIN_LINE:case T.Op.END_LINE:case T.Op.BEGIN_TEXT:case T.Op.END_TEXT:case T.Op.WORD_BOUNDARY:case T.Op.NO_WORD_BOUNDARY:case T.Op.CHAR_CLASS:case T.Op.ANY_CHAR_NOT_NL:case T.Op.ANY_CHAR:return new Ie(Ie.Type.NONE);case T.Op.LITERAL:{if(e.runes.length===0||(e.flags&L.FOLD_CASE)!==0)return new Ie(Ie.Type.NONE);let t=new Ie(Ie.Type.EXACT),r="";for(let s=0;s<e.runes.length;s++)r+=String.fromCodePoint(e.runes[s]);return t.str=r,t.bytes=X.stringToUtf8ByteArray(t.str),t}case T.Op.CAPTURE:case T.Op.PLUS:return wn.fromRegexp(e.subs[0]);case T.Op.REPEAT:return e.min>=1?wn.fromRegexp(e.subs[0]):new Ie(Ie.Type.NONE);case T.Op.CONCAT:{let t=new Ie(Ie.Type.AND);for(let r of e.subs)t.subs.push(wn.fromRegexp(r));return t}case T.Op.ALTERNATE:{let t=new Ie(Ie.Type.OR);for(let r of e.subs)t.subs.push(wn.fromRegexp(r));return t}default:return new Ie(Ie.Type.NONE)}}static simplify(e){if(e.type===Ie.Type.EXACT||e.type===Ie.Type.NONE)return e;if(e.type===Ie.Type.AND){let t=[];for(let r of e.subs){let s=wn.simplify(r);if(s.type!==Ie.Type.NONE)if(s.type===Ie.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new Ie(Ie.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===Ie.Type.OR){let t=[];for(let o of e.subs){let c=wn.simplify(o);if(c.type===Ie.Type.NONE)return new Ie(Ie.Type.NONE);if(c.type===Ie.Type.OR)for(let u=0;u<c.subs.length;u++)t.push(c.subs[u]);else t.push(c)}if(t.length===0)return new Ie(Ie.Type.NONE);if(t.length===1)return t[0];let r=new Set,s=[];for(let o of t)o.type===Ie.Type.EXACT?r.has(o.str)||(r.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(let o of s)if(o.type!==Ie.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new Yg(s.map(o=>{let c=[];for(let u=0;u<o.str.length;u++)c.push(o.str.charCodeAt(u));return c})),e.ac8=new Yg(s.map(o=>o.bytes))),e}return e}},Mt=class{constructor(n=0,e=0){this.head=n,this.tail=e}},uI=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(n){return this.inst[n]}numInst(){return this.inst.length}addInst(n){this.inst.push(new F(n))}skipNop(n){let e=this.inst[n];for(;e.op===F.NOP||e.op===F.CAPTURE;)e=this.inst[n],n=e.out;return e}prefix(){let n="",e=this.skipNop(this.start);if(!F.isRuneOp(e.op)||e.runes.length!==1)return[e.op===F.MATCH,n];for(;F.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&L.FOLD_CASE)===0;)n+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===F.MATCH,n]}startCond(){let n=0,e=this.start;e:for(;;){let t=this.inst[e];switch(t.op){case F.EMPTY_WIDTH:n|=t.arg;break;case F.FAIL:return-1;case F.CAPTURE:case F.NOP:break;default:break e}e=t.out}return n}patch(n,e){let t=n.head;for(;t!==0;){let r=this.inst[t>>1];(t&1)===0?(t=r.out,r.out=e):(t=r.arg,r.arg=e)}}append(n,e){if(n.head===0)return e;if(e.head===0)return n;let t=this.inst[n.tail>>1];return(n.tail&1)===0?t.out=e.head:t.arg=e.head,new Mt(n.head,e.tail)}toString(){let n="";for(let e=0;e<this.inst.length;e++){let t=n.length;n+=e,e===this.start&&(n+="*"),n+="        ".substring(n.length-t),n+=this.inst[e],n+=`
`}return n}},ja=class{constructor(n=0,e=new Mt,t=!1){this.i=n,this.out=e,this.nullable=t}},vC=class ds{static ANY_RUNE_NOT_NL(){return[0,k.CODES.get(`
`)-1,k.CODES.get(`
`)+1,z.MAX_RUNE]}static ANY_RUNE(){return[0,z.MAX_RUNE]}static compileRegexp(e){let t=new ds,r=t.compile(e);return t.prog.patch(r.out,t.newInst(F.MATCH).i),t.prog.start=r.i,t.prog}static compileSet(e){let t=new ds;if(e.length===0)return t.prog.start=t.newInst(F.FAIL).i,t.prog;let r=[];for(let i=0;i<e.length;i++){let o=t.compile(e[i]),c=t.newInst(F.MATCH);t.prog.getInst(c.i).arg=i,t.prog.patch(o.out,c.i),r.push(o.i)}let s=r[0];for(let i=1;i<r.length;i++){let o=t.newInst(F.ALT),c=t.prog.getInst(o.i);c.out=s,c.arg=r[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new uI,this.newInst(F.FAIL)}newInst(e){return this.prog.addInst(e),new ja(this.prog.numInst()-1,new Mt,!0)}nop(){let e=this.newInst(F.NOP);return e.out=new Mt(e.i<<1,e.i<<1),e}fail(){return new ja}cap(e){let t=this.newInst(F.CAPTURE);return t.out=new Mt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new ja(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return s.out=e.i,s.arg=t.i,r.out=this.prog.append(e.out,t.out),r.nullable=e.nullable||t.nullable,r}loop(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new Mt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new Mt(r.i<<1|1,r.i<<1|1)),this.prog.patch(e.out,r.i),r}quest(e,t){let r=this.newInst(F.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new Mt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new Mt(r.i<<1|1,r.i<<1|1)),r.out=this.prog.append(r.out,e.out),r}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new ja(e.i,this.loop(e,t).out,e.nullable)}empty(e){let t=this.newInst(F.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new Mt(t.i<<1,t.i<<1),t}rune(e,t){let r=this.newInst(F.RUNE);r.nullable=!1;let s=this.prog.getInst(r.i);return s.runes=e,t&=L.FOLD_CASE,(e.length!==1||z.simpleFold(e[0])===e[0])&&(t&=~L.FOLD_CASE),s.arg=t,r.out=new Mt(r.i<<1,r.i<<1),(t&L.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=F.RUNE1:e.length===2&&e[0]===0&&e[1]===z.MAX_RUNE?s.op=F.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===k.CODES.get(`
`)-1&&e[2]===k.CODES.get(`
`)+1&&e[3]===z.MAX_RUNE&&(s.op=F.RUNE_ANY_NOT_NL),r}lookBehind(e,t){let r=this.newInst(F.LB_WRITE);this.prog.getInst(r.i).arg=t;let s=this.rune(ds.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,r.i);let c=this.newInst(F.LB_CHECK);return this.prog.getInst(c.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),c.out=new Mt(c.i<<1,c.i<<1),c}compile(e){switch(e.op){case T.Op.NO_MATCH:return this.fail();case T.Op.EMPTY_MATCH:return this.nop();case T.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let r of e.runes){let s=this.rune([r],e.flags);t=t===null?s:this.cat(t,s)}return t}case T.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case T.Op.ANY_CHAR_NOT_NL:return this.rune(ds.ANY_RUNE_NOT_NL(),0);case T.Op.ANY_CHAR:return this.rune(ds.ANY_RUNE(),0);case T.Op.BEGIN_LINE:return this.empty(X.EMPTY_BEGIN_LINE);case T.Op.END_LINE:return this.empty(X.EMPTY_END_LINE);case T.Op.BEGIN_TEXT:return this.empty(X.EMPTY_BEGIN_TEXT);case T.Op.END_TEXT:return this.empty(X.EMPTY_END_TEXT);case T.Op.WORD_BOUNDARY:return this.empty(X.EMPTY_WORD_BOUNDARY);case T.Op.NO_WORD_BOUNDARY:return this.empty(X.EMPTY_NO_WORD_BOUNDARY);case T.Op.PLB:case T.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case T.Op.CAPTURE:{let t=this.cap(e.cap<<1),r=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,r),s)}case T.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&L.NON_GREEDY)!==0);case T.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.cat(t,s)}return t}case T.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let r of e.subs){let s=this.compile(r);t=t===null?s:this.alt(t,s)}return t}default:throw new wC("regexp: unhandled case in compile")}}},bC=class St{static simplify(e){if(e===null)return null;switch(e.op){case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:{let t=St.simplify(e.subs[0]);if(t!==e.subs[0]){let r=T.fromRegexp(e);return r.runes=[],r.subs=[t],r}return e}case T.Op.CONCAT:case T.Op.ALTERNATE:{let t=[],r=!1;for(let s=0;s<e.subs.length;s++){let i=e.subs[s],o=St.simplify(i);if(o!==i&&(r=!0),e.op===T.Op.CONCAT){if(o.op===T.Op.NO_MATCH)return new T(T.Op.NO_MATCH);if(o.op===T.Op.EMPTY_MATCH){r=!0;continue}if(o.op===T.Op.CONCAT){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}else if(e.op===T.Op.ALTERNATE){if(o.op===T.Op.NO_MATCH){r=!0;continue}if(o.op===T.Op.ALTERNATE){r=!0;for(let c=0;c<o.subs.length;c++)t.push(o.subs[c]);continue}}t.push(o)}if(r){if(t.length===0)return new T(e.op===T.Op.CONCAT?T.Op.EMPTY_MATCH:T.Op.NO_MATCH);if(t.length===1)return t[0];let s=T.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case T.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new T(T.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?new T(T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE?new T(T.Op.ANY_CHAR_NOT_NL):e;case T.Op.STAR:case T.Op.PLUS:case T.Op.QUEST:{let t=St.simplify(e.subs[0]);return St.simplify1(e.op,e.flags,t,e)}case T.Op.REPEAT:{if(e.min===0&&e.max===0)return new T(T.Op.EMPTY_MATCH);let t=St.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return St.simplify1(T.Op.STAR,e.flags,t,null);if(e.min===1)return St.simplify1(T.Op.PLUS,e.flags,t,null);let s=new T(T.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(St.simplify1(T.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),St.simplify(s)}if(e.min===1&&e.max===1)return t;let r=null;if(e.min>0){r=[];for(let s=0;s<e.min;s++)r.push(t)}if(e.max>e.min){let s=St.simplify1(T.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){let o=new T(T.Op.CONCAT);o.subs=[t,s],s=St.simplify1(T.Op.QUEST,e.flags,o,null)}if(r===null)return s;r.push(s)}if(r!==null){let s=new T(T.Op.CONCAT);return s.subs=r.slice(0),St.simplify(s)}return new T(T.Op.NO_MATCH)}}return e}static simplify1(e,t,r,s){if(r.op===T.Op.EMPTY_MATCH)return r;if(r.op===T.Op.NO_MATCH)return e===T.Op.PLUS?r:new T(T.Op.EMPTY_MATCH);if(e===r.op&&(t&L.NON_GREEDY)===(r.flags&L.NON_GREEDY))return r;if(s!==null&&s.op===e&&(s.flags&L.NON_GREEDY)===(t&L.NON_GREEDY)&&r===s.subs[0])return s;let i=new T(e);return i.flags=t,i.subs=[r],i}},ye=class{constructor(n,e){this.sign=n,this.cls=e}},Xg=[48,57],Zg=[9,10,12,13,32,32],eC=[48,57,65,90,95,95,97,122],tC=new Map([["\\d",new ye(1,Xg)],["\\D",new ye(-1,Xg)],["\\s",new ye(1,Zg)],["\\S",new ye(-1,Zg)],["\\w",new ye(1,eC)],["\\W",new ye(-1,eC)]]),nC=[48,57,65,90,97,122],rC=[65,90,97,122],sC=[0,127],iC=[9,9,32,32],oC=[0,31,127,127],aC=[48,57],cC=[33,126],uC=[97,122],lC=[32,126],BC=[33,47,58,64,91,96,123,126],hC=[9,13,32,32],dC=[65,90],fC=[48,57,65,90,95,95,97,122],pC=[48,57,65,70,97,102],gC=new Map([["[:alnum:]",new ye(1,nC)],["[:^alnum:]",new ye(-1,nC)],["[:alpha:]",new ye(1,rC)],["[:^alpha:]",new ye(-1,rC)],["[:ascii:]",new ye(1,sC)],["[:^ascii:]",new ye(-1,sC)],["[:blank:]",new ye(1,iC)],["[:^blank:]",new ye(-1,iC)],["[:cntrl:]",new ye(1,oC)],["[:^cntrl:]",new ye(-1,oC)],["[:digit:]",new ye(1,aC)],["[:^digit:]",new ye(-1,aC)],["[:graph:]",new ye(1,cC)],["[:^graph:]",new ye(-1,cC)],["[:lower:]",new ye(1,uC)],["[:^lower:]",new ye(-1,uC)],["[:print:]",new ye(1,lC)],["[:^print:]",new ye(-1,lC)],["[:punct:]",new ye(1,BC)],["[:^punct:]",new ye(-1,BC)],["[:space:]",new ye(1,hC)],["[:^space:]",new ye(-1,hC)],["[:upper:]",new ye(1,dC)],["[:^upper:]",new ye(-1,dC)],["[:word:]",new ye(1,fC)],["[:^word:]",new ye(-1,fC)],["[:xdigit:]",new ye(1,pC)],["[:^xdigit:]",new ye(-1,pC)]]),$n=class Yn{static charClassToString(e,t){let r="[";for(let s=0;s<t;s+=2){s>0&&(r+=" ");let i=e[s],o=e[s+1];i===o?r+=`0x${i.toString(16)}`:r+=`0x${i.toString(16)}-0x${o.toString(16)}`}return r+="]",r}static cmp(e,t,r,s){let i=e[t]-r;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,r){let s=((t+r)/2|0)&-2,i=e[s],o=e[s+1],c=t,u=r;for(;c<=u;){for(;c<r&&Yn.cmp(e,c,i,o)<0;)c+=2;for(;u>t&&Yn.cmp(e,u,i,o)>0;)u-=2;if(c<=u){if(c!==u){let l=e[c];e[c]=e[u],e[u]=l,l=e[c+1],e[c+1]=e[u+1],e[u+1]=l}c+=2,u-=2}}t<u&&Yn.qsortIntPair(e,t,u),c<r&&Yn.qsortIntPair(e,c,r)}constructor(e=X.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;Yn.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){let r=this.r[t],s=this.r[t+1];if(r<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=r,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&L.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let r=2;r<=4;r+=2)if(this.len>=r){let s=this.r[this.len-r],i=this.r[this.len-r+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-r]=e),t>i&&(this.r[this.len-r+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=z.MIN_FOLD&&t>=z.MAX_FOLD)return this.appendRange(e,t);if(t<z.MIN_FOLD||e>z.MAX_FOLD)return this.appendRange(e,t);e<z.MIN_FOLD&&(this.appendRange(e,z.MIN_FOLD-1),e=z.MIN_FOLD),t>z.MAX_FOLD&&(this.appendRange(z.MAX_FOLD+1,t),t=z.MAX_FOLD);for(let r=e;r<=t;r++){this.appendRange(r,r);for(let s=z.simpleFold(r);s!==r;s=z.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let r=0;r<e.length;r+=2){let s=e[r],i=e[r+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){let r=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(r,s);continue}for(let o=r;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let r=0;r<e.length;++r){let s=e.getLo(r),i=e.getHi(r),o=e.getStride(r);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let c=s;c<=i;c+=o)t<=c-1&&this.appendRange(t,c-1),t=c+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let r=0;r<this.len;r+=2){let s=this.r[r],i=this.r[r+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=z.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=z.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let r=e.cls;return t&&(r=new Yn().appendFoldedClass(r).cleanClass().toArray()),this.appendClassWithSign(r,e.sign)}toString(){return Yn.charClassToString(this.r,this.len)}},lI=class{constructor(n){this.str=n,this.position=0}pos(){return this.position}rewindTo(n){this.position=n}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(n){this.position+=n}skipString(n){this.position+=n.length}pop(){let n=this.str.codePointAt(this.position);return this.position+=X.charCount(n),n}lookingAt(n){return this.str.startsWith(n,this.position)}rest(){return this.str.substring(this.position)}from(n){return this.str.substring(n,this.position)}toString(){return this.rest()}},SC=class Y{static ERR_INTERNAL_ERROR="regexp/syntax: internal error";static ERR_INVALID_CHAR_RANGE="invalid character class range";static ERR_INVALID_ESCAPE="invalid escape sequence";static ERR_INVALID_NAMED_CAPTURE="invalid named capture";static ERR_INVALID_PERL_OP="invalid or unsupported Perl syntax";static ERR_INVALID_REPEAT_OP="invalid nested repetition operator";static ERR_INVALID_REPEAT_SIZE="invalid repeat count";static ERR_MISSING_BRACKET="missing closing ]";static ERR_MISSING_PAREN="missing closing )";static ERR_MISSING_REPEAT_ARGUMENT="missing argument to repetition operator";static ERR_TRAILING_BACKSLASH="trailing backslash at end of expression";static ERR_DUPLICATE_NAMED_CAPTURE="duplicate capture group name";static ERR_UNEXPECTED_PAREN="unexpected )";static ERR_NESTING_DEPTH="expression nests too deeply";static ERR_LARGE="expression too large";static ERR_INVALID_CAPTURE_IN_LOOKBEHIND="invalid capture in lookbehind";static MAX_HEIGHT=1e3;static MAX_SIZE=3355443;static MAX_RUNES=33554432;static ANY_TABLE=new E(new Uint32Array([0,z.MAX_RUNE,1]));static ASCII_TABLE=new E(new Uint32Array([0,127,1]));static ASCII_FOLD_TABLE=new E(new Uint32Array([0,127,1,383,383,1,8490,8490,1]));static unicodeTable(e){return e==="Any"?{tab:Y.ANY_TABLE,fold:Y.ANY_TABLE,sign:1}:e==="Ascii"?{tab:Y.ASCII_TABLE,fold:Y.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:_t.CATEGORIES.get("Cn"),fold:_t.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:_t.CATEGORIES.get("LC"),fold:_t.FOLD_CATEGORIES.get("LC"),sign:1}:_t.CATEGORIES.has(e)?{tab:_t.CATEGORIES.get(e),fold:_t.FOLD_CATEGORIES.get(e),sign:1}:_t.SCRIPTS.has(e)?{tab:_t.SCRIPTS.get(e),fold:_t.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<z.MIN_FOLD||e>z.MAX_FOLD)return e;let t=e,r=e;for(e=z.simpleFold(e);e!==r;e=z.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===T.Op.EMPTY_MATCH)return null;if(e.op===T.Op.CONCAT&&e.subs.length>0){let t=e.subs[0];return t.op===T.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){let r=new T(T.Op.LITERAL);return r.flags=t,r.runes=X.stringToRunes(e),r}static parse(e,t){return new Y(e,t).parseInternal()}static parseRepeat(e){let t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);let r=Y.parseInt(e);if(r===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=r;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=Y.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),r<0||r>1e3||s===-2||s>1e3||s>=0&&r>s)throw new be(Y.ERR_INVALID_REPEAT_SIZE,e.from(t));return r<<16|s&z.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){let r=e.codePointAt(t);if(r!==k.CODES.get("_")&&!X.isalnum(r))return!1}return!0}static parseInt(e){let t=e.pos();for(;e.more()&&e.peek()>=k.CODES.get("0")&&e.peek()<=k.CODES.get("9");)e.skip(1);let r=e.from(t);return r.length===0||r.length>1&&r.codePointAt(0)===k.CODES.get("0")?-1:r.length>8?-2:parseInt(r,10)}static isCharClass(e){return e.op===T.Op.LITERAL&&e.runes.length===1||e.op===T.Op.CHAR_CLASS||e.op===T.Op.ANY_CHAR_NOT_NL||e.op===T.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case T.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case T.Op.CHAR_CLASS:for(let r=0;r<e.runes.length;r+=2)if(e.runes[r]<=t&&t<=e.runes[r+1])return!0;return!1;case T.Op.ANY_CHAR_NOT_NL:return t!==k.CODES.get(`
`);case T.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case T.Op.ANY_CHAR:break;case T.Op.ANY_CHAR_NOT_NL:Y.matchRune(t,k.CODES.get(`
`))&&(e.op=T.Op.ANY_CHAR);break;case T.Op.CHAR_CLASS:t.op===T.Op.LITERAL?e.runes=new $n(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new $n(e.runes).appendClass(t.runes).toArray();break;case T.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=T.Op.CHAR_CLASS,e.runes=new $n().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){let t=e.pos();if(e.skip(1),!e.more())throw new be(Y.ERR_TRAILING_BACKSLASH);let r=e.pop();e:switch(r){case k.CODES.get("1"):case k.CODES.get("2"):case k.CODES.get("3"):case k.CODES.get("4"):case k.CODES.get("5"):case k.CODES.get("6"):case k.CODES.get("7"):if(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"))break;case k.CODES.get("0"):{let s=r-k.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"));i++)s=s*8+e.peek()-k.CODES.get("0"),e.skip(1);return s}case k.CODES.get("x"):{if(!e.more())break;if(r=e.pop(),r===k.CODES.get("{")){let o=0,c=0;for(;;){if(!e.more())break e;if(r=e.pop(),r===k.CODES.get("}"))break;let u=X.unhex(r);if(u<0||(c=c*16+u,c>z.MAX_RUNE))break e;o++}if(o===0)break e;return c}let s=X.unhex(r);if(!e.more())break;r=e.pop();let i=X.unhex(r);if(s<0||i<0)break;return s*16+i}case k.CODES.get("a"):return k.CODES.get("\x07");case k.CODES.get("f"):return k.CODES.get("\f");case k.CODES.get("n"):return k.CODES.get(`
`);case k.CODES.get("r"):return k.CODES.get("\r");case k.CODES.get("t"):return k.CODES.get("	");case k.CODES.get("v"):return k.CODES.get("\v");default:if(r<=z.MAX_ASCII&&!X.isalnum(r))return r;break}throw new be(Y.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new be(Y.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?Y.parseEscape(e):e.pop()}static concatRunes(e,t){for(let r=0;r<t.length;r++)e.push(t[r]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===T.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(Y.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new T(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>Y.MAX_RUNES)throw new be(Y.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===T.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(Y.MAX_SIZE/this.repeats)?this.repeats=Y.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(Y.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>Y.MAX_SIZE)throw new be(Y.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let r=0;switch(e.op){case T.Op.LITERAL:r=e.runes.length;break;case T.Op.PLB:case T.Op.NLB:case T.Op.CAPTURE:case T.Op.STAR:r=2+this.calcSize(e.subs[0]);break;case T.Op.PLUS:case T.Op.QUEST:r=1+this.calcSize(e.subs[0]);break;case T.Op.CONCAT:for(let s of e.subs)r=r+this.calcSize(s);break;case T.Op.ALTERNATE:for(let s of e.subs)r=r+this.calcSize(s);e.subs.length>1&&(r=r+e.subs.length-1);break;case T.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?r=2+s:r=1+e.min*s;break}r=e.max*s+(e.max-e.min);break}}return r=Math.max(1,r),this.size===null&&(this.size=new Map),this.size.set(e,r),r}checkHeight(e){if(!(this.numRegexp<Y.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>Y.MAX_HEIGHT)throw new be(Y.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let r=1;for(let s of e.subs){let i=this.calcHeight(s);r<1+i&&(r=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,r),r}pop(){return this.stack.pop()}popToPseudo(){let e=this.stack.length,t=e;for(;t>0&&!T.isPseudoOp(this.stack[t-1].op);)t--;let r=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),r}push(e){if(this.numRunes+=e.runes.length,e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&~L.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&~L.FOLD_CASE}else if(e.op===T.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&z.simpleFold(e.runes[0])===e.runes[2]&&z.simpleFold(e.runes[2])===e.runes[0]||e.op===T.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&z.simpleFold(e.runes[0])===e.runes[1]&&z.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|L.FOLD_CASE))return null;e.op=T.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|L.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){let r=this.stack.length;if(r<2)return!1;let s=this.stack[r-1],i=this.stack[r-2];return s.op!==T.Op.LITERAL||i.op!==T.Op.LITERAL||(s.flags&L.FOLD_CASE)!==(i.flags&L.FOLD_CASE)?!1:(i.runes=Y.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){let r=this.newRegexp(T.Op.LITERAL);return r.flags=t,(t&L.FOLD_CASE)!==0&&(e=Y.minFoldRune(e)),r.runes=[e],r}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){let t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,r,s,i,o){let c=this.flags;if((c&L.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),c^=L.NON_GREEDY),o!==-1))throw new be(Y.ERR_INVALID_REPEAT_OP,i.from(o));let u=this.stack.length;if(u===0)throw new be(Y.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let l=this.stack[u-1];if(T.isPseudoOp(l.op))throw new be(Y.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let h=this.newRegexp(e);if(h.min=t,h.max=r,h.flags=c,h.subs=[l],this.stack[u-1]=h,this.checkLimits(h),e===T.Op.REPEAT&&(t>=2||r>=2)&&!this.repeatIsValid(h,1e3))throw new be(Y.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===T.Op.REPEAT){let r=e.max;if(r===0)return!0;if(r<0&&(r=e.min),r>t)return!1;r>0&&(t=Math.trunc(t/r))}for(let r of e.subs)if(!this.repeatIsValid(r,t))return!1;return!0}concat(){this.maybeConcat(-1,0);let e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(T.Op.EMPTY_MATCH)):this.push(this.collapse(e,T.Op.CONCAT))}alternate(){let e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(T.Op.NO_MATCH)):this.push(this.collapse(e,T.Op.ALTERNATE))}cleanAlt(e){e.op===T.Op.CHAR_CLASS&&(e.runes=new $n(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?(e.runes=[],e.op=T.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===z.MAX_RUNE&&(e.runes=[],e.op=T.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let r=0;for(let c of e)r+=c.op===t?c.subs.length:1;let s=new Array(r).fill(null),i=0;for(let c of e)if(c.op===t){for(let u=0;u<c.subs.length;u++)s[i++]=c.subs[u];this.reuse(c)}else s[i++]=c;let o=this.newRegexp(t);if(o.subs=s,t===T.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){let c=o;o=o.subs[0],this.reuse(c)}return o}factor(e){if(e.length<2)return e;let t=0,r=e.length,s=0,i=null,o=0,c=0,u=0;for(let h=0;h<=r;h++){let f=null,C=0,v=0;if(h<r){let R=e[t+h];if(R.op===T.Op.CONCAT&&R.subs.length>0&&(R=R.subs[0]),R.op===T.Op.LITERAL&&(f=R.runes,C=R.runes.length,v=R.flags&L.FOLD_CASE),v===c){let S=0;for(;S<o&&S<C&&i[S]===f[S];)S++;if(S>0){o=S;continue}}}if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let R=this.newRegexp(T.Op.LITERAL);R.flags=c,R.runes=i.slice(0,o);for(let U=u;U<h;U++)e[t+U]=this.removeLeadingString(e[t+U],o),this.checkLimits(e[t+U]);let S=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),G=this.newRegexp(T.Op.CONCAT);G.subs=[R,S],e[s++]=G}u=h,i=f,o=C,c=v}r=s,t=0,u=0,s=0;let l=null;for(let h=0;h<=r;h++){let f=null;if(!(h<r&&(f=Y.leadingRegexp(e[t+h]),l!==null&&l.equals(f)&&(Y.isCharClass(l)||l.op===T.Op.REPEAT&&l.min===l.max&&Y.isCharClass(l.subs[0]))))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let C=l;for(let S=u;S<h;S++){let G=S!==u;e[t+S]=this.removeLeadingRegexp(e[t+S],G),this.checkLimits(e[t+S])}let v=this.collapse(e.slice(t+u,t+h),T.Op.ALTERNATE),R=this.newRegexp(T.Op.CONCAT);R.subs=[C,v],e[s++]=R}u=h,l=f}}r=s,t=0,u=0,s=0;for(let h=0;h<=r;h++)if(!(h<r&&Y.isCharClass(e[t+h]))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let f=u;for(let v=u+1;v<h;v++){let R=e[t+f],S=e[t+v];(R.op<S.op||R.op===S.op&&(R.runes!==null?R.runes.length:0)<(S.runes!==null?S.runes.length:0))&&(f=v)}let C=e[t+u];e[t+u]=e[t+f],e[t+f]=C;for(let v=u+1;v<h;v++)Y.mergeCharClass(e[t+u],e[t+v]),this.reuse(e[t+v]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}h<r&&(e[s++]=e[t+h]),u=h+1}r=s,t=0,u=0,s=0;for(let h=0;h<r;++h)h+1<r&&e[t+h].op===T.Op.EMPTY_MATCH&&e[t+h+1].op===T.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return r=s,t=0,e.slice(t,r)}removeLeadingString(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){let r=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=r,r.op===T.Op.EMPTY_MATCH)switch(this.reuse(r),e.subs.length){case 0:case 1:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 2:{let s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===T.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=T.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===T.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=T.Op.EMPTY_MATCH,e.subs=T.emptySubs();break;case 1:{let r=e;e=e.subs[0],this.reuse(r);break}}return e}return t&&this.reuse(e),this.newRegexp(T.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&L.LITERAL)!==0)return Y.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,r=-1,s=new lI(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case k.CODES.get("("):if((this.flags&L.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&L.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(T.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case k.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case k.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case k.CODES.get("^"):(this.flags&L.ONE_LINE)!==0?this.op(T.Op.BEGIN_TEXT):this.op(T.Op.BEGIN_LINE),s.skip(1);break;case k.CODES.get("$"):(this.flags&L.ONE_LINE)!==0?this.op(T.Op.END_TEXT).flags|=L.WAS_DOLLAR:this.op(T.Op.END_LINE),s.skip(1);break;case k.CODES.get("."):(this.flags&L.DOT_NL)!==0?this.op(T.Op.ANY_CHAR):this.op(T.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case k.CODES.get("["):this.parseClass(s);break;case k.CODES.get("*"):case k.CODES.get("+"):case k.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case k.CODES.get("*"):o=T.Op.STAR;break;case k.CODES.get("+"):o=T.Op.PLUS;break;case k.CODES.get("?"):o=T.Op.QUEST;break}this.repeat(o,t,r,i,s,e);break}case k.CODES.get("{"):{i=s.pos();let o=Y.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,r=(o&z.MAX_BMP)<<16>>16,this.repeat(T.Op.REPEAT,t,r,i,s,e);break}case k.CODES.get("\\"):{let o=s.pos();if(s.skip(1),(this.flags&L.PERL_X)!==0&&s.more())switch(s.pop()){case k.CODES.get("A"):this.op(T.Op.BEGIN_TEXT);break e;case k.CODES.get("b"):this.op(T.Op.WORD_BOUNDARY);break e;case k.CODES.get("B"):this.op(T.Op.NO_WORD_BOUNDARY);break e;case k.CODES.get("C"):throw new be(Y.ERR_INVALID_ESCAPE,"\\C");case k.CODES.get("Q"):{let l=s.rest(),h=l.indexOf("\\E");h>=0?(l=l.substring(0,h),s.skipString(l),s.skipString("\\E")):s.skipString(l);let f=0;for(;f<l.length;){let C=l.codePointAt(f);this.literal(C),f+=X.charCount(C)}break e}case k.CODES.get("z"):this.op(T.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);let c=this.newRegexp(T.Op.CHAR_CLASS);if(c.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){let l=new $n;if(this.parseUnicodeClass(s,l)){c.runes=l.toArray(),this.push(c);break e}}let u=new $n;if(this.parsePerlClassEscape(s,u)){c.runes=u.toArray(),this.push(c);break e}s.rewindTo(o),this.reuse(c),this.literal(Y.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new be(Y.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){let t=e.pos(),r=e.rest();if(r.startsWith("(?P<")||r.startsWith("(?<")){let c=r.charAt(2)==="P"?4:3,u=r.indexOf(">");if(u<0)throw new be(Y.ERR_INVALID_NAMED_CAPTURE,r);let l=r.substring(c,u);if(e.skipString(l),e.skip(c+1),!Y.isValidCaptureName(l))throw new be(Y.ERR_INVALID_NAMED_CAPTURE,r.substring(0,u+1));let h=this.op(T.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[l])throw new be(Y.ERR_DUPLICATE_NAMED_CAPTURE,l);this.namedGroups[l]=this.numCap,h.name=l;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){let c=e.pop();switch(c){case k.CODES.get("i"):s|=L.FOLD_CASE,o=!0;break;case k.CODES.get("m"):s&=~L.ONE_LINE,o=!0;break;case k.CODES.get("s"):s|=L.DOT_NL,o=!0;break;case k.CODES.get("U"):s|=L.NON_GREEDY,o=!0;break;case k.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case k.CODES.get(":"):case k.CODES.get(")"):if(i<0){if(!o)break e;s=~s}c===k.CODES.get(":")&&this.op(T.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new be(Y.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){let e=this.newRegexp(T.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(T.Op.VERTICAL_BAR)}swapVerticalBar(){let e=this.stack.length;if(e>=3&&this.stack[e-2].op===T.Op.VERTICAL_BAR&&Y.isCharClass(this.stack[e-1])&&Y.isCharClass(this.stack[e-3])){let t=this.stack[e-1],r=this.stack[e-3];if(t.op>r.op){let s=r;r=t,t=s,this.stack[e-3]=r}return Y.mergeCharClass(r,t),this.reuse(t),this.pop(),!0}if(e>=2){let t=this.stack[e-1],r=this.stack[e-2];if(r.op===T.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=r,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new be(Y.ERR_UNEXPECTED_PAREN,this.wholeRegexp);let e=this.pop(),t=this.pop();if(t.op!==T.Op.LEFT_PAREN)throw new be(Y.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(Y.hasCapture(e))throw new be(Y.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=T.Op.PLB:t.op=T.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=T.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){let r=e.pos();if((this.flags&L.PERL_X)===0||!e.more()||e.pop()!==k.CODES.get("\\")||!e.more())return!1;e.pop();let s=e.from(r),i=tC.has(s)?tC.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&L.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){let r=e.rest(),s=r.indexOf(":]");if(s<0)return!1;let i=r.substring(0,s+2);e.skipString(i);let o=gC.has(i)?gC.get(i):null;if(o===null)throw new be(Y.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&L.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){let r=e.pos();if((this.flags&L.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===k.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(r),new be(Y.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==k.CODES.get("{"))o=X.runeToString(i);else{let h=e.rest(),f=h.indexOf("}");if(f<0)throw e.rewindTo(r),new be(Y.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,f),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===k.CODES.get("^")&&(s=0-s,o=o.substring(1));let c=Y.unicodeTable(o);if(c===null)throw new be(Y.ERR_INVALID_CHAR_RANGE,e.from(r));c.sign<0&&(s=0-s);let u=c.tab,l=c.fold;if((this.flags&L.FOLD_CASE)===0||l===null)t.appendTableWithSign(u,s);else{let h=new $n().appendTable(u).appendTable(l).cleanClass().toArray();t.appendClassWithSign(h,s)}return!0}parseClass(e){let t=e.pos();e.skip(1);let r=this.newRegexp(T.Op.CHAR_CLASS);r.flags=this.flags;let s=new $n,i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&L.CLASS_NL)===0&&s.appendRange(k.CODES.get(`
`),k.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==k.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&L.PERL_X)===0&&!o){let h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new be(Y.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;let c=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(c)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(c);let u=Y.parseClassChar(e,t),l=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(l=Y.parseClassChar(e,t),l<u)throw new be(Y.ERR_INVALID_CHAR_RANGE,e.from(c))}(this.flags&L.FOLD_CASE)===0?s.appendRange(u,l):s.appendFoldedRange(u,l)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),r.runes=s.toArray(),this.push(r)}},BI=class Sr{static initTest(e){let t=Sr.compile(e),r=new Sr(t.expr,t.prog,t.numSubexp,t.longest);return r.cond=t.cond,r.prefix=t.prefix,r.prefixUTF8=t.prefixUTF8,r.prefixComplete=t.prefixComplete,r.prefixRune=t.prefixRune,r.prefilter=t.prefilter,r}static compile(e){return Sr.compileImpl(e,L.PERL,!1)}static compilePOSIX(e){return Sr.compileImpl(e,L.POSIX,!0)}static compileImpl(e,t,r){let s=SC.parse(e,t),i=s.maxCap();s=bC.simplify(s);let o=cI.build(s),c=vC.compileRegexp(s),u=new Sr(e,c,i,r);u.prefilter=o.type===Ie.Type.NONE?null:o;let[l,h]=c.prefix();return u.prefixComplete=l,u.prefix=h,u.prefixUTF8=X.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(e,t){return Sr.compile(e).match(t)}constructor(e,t,r=0,s=0){this.expr=e,this.prog=t,this.numSubexp=r,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new IC(this.prog),this.onepass=$g.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,r,s){if((r===L.ANCHOR_START||r===L.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1,c=e.prefixLength(this);if(r===L.UNANCHORED){let u=e.index(this,t);if(u<0)return null;i=t+u,o=i+c}else if(r===L.ANCHOR_BOTH){if(e.endPos()!==c||e.index(this,0)!==0)return null;i=0,o=c}else if(r===L.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=c}if(i<0)return null;if(s>0){let u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}executeEngine(e,t,r,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,r,s);if(this.prefilter!==null&&r===L.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return $g.execute(this,e,t,r,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=qa.maxBitStateLen(this.prog)?qa.execute(this,e,t,r,s):this.doExecuteNFA(e,t,r,s);if(this.prog.numLb===0){let i=this.dfa.match(e,t,r);if(i!==null)return i?[]:null;if(e.endPos()<=qa.maxBitStateLen(this.prog))return qa.execute(this,e,t,r,s)}return this.doExecuteNFA(e,t,r,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,r,s){let i=this.get();i||(i=DC.fromRE2(this)),i.init(s);let o=i.match(e,t,r)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(ve.fromUTF16(e),0,L.UNANCHORED,0)!==null}matchWithGroup(e,t,r,s,i){return e instanceof Pr||(X.isByteArray(e)?e=Rr.utf8(e):e=Rr.utf16(e)),this.matchMachineInput(e,t,r,s,i)}matchMachineInput(e,t,r,s,i){if(t>r)return[!1,null];let o=e.isUTF16Encoding()?ve.fromUTF16(e.asCharSequence(),0,r):ve.fromUTF8(e.asBytes(),0,r),c=this.executeEngine(o,t,s,2*i);return c===null?[!1,null]:[!0,c]}matchUTF8(e){return this.executeEngine(ve.fromUTF8(e),0,L.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,r){let s=0,i=0,o="",c=ve.fromUTF16(e),u=0;for(;i<=e.length;){let l=this.executeEngine(c,i,L.UNANCHORED,2);if(l===null||l.length===0)break;o+=e.substring(s,l[0]),(l[1]>s||l[0]===0)&&(o+=t(e.substring(l[0],l[1])),u++),s=l[1];let h=c.step(i)&7;if(i+h>l[1]?i+=h:i+1>l[1]?i++:i=l[1],u>=r)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let r=new Array(t).fill(-1);for(let s=0;s<e.length;s++)r[s]=e[s];e=r}return e}allMatches(e,t,r=s=>s){let s=[],i=e.endPos();t<0&&(t=i+1);let o=0,c=0,u=-1;for(;c<t&&o<=i;){let l=this.executeEngine(e,o,L.UNANCHORED,this.prog.numCap);if(l===null||l.length===0)break;let h=!0;if(l[1]===o){l[0]===u&&(h=!1);let f=e.step(o);f<0?o=i+1:o+=f&7}else o=l[1];u=l[1],h&&(s.push(r(this.pad(l))),c++)}return s}findUTF8(e){let t=this.executeEngine(ve.fromUTF8(e),0,L.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){let t=this.executeEngine(ve.fromUTF8(e),0,L.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){let t=this.executeEngine(ve.fromUTF16(e),0,L.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(ve.fromUTF16(e),0,L.UNANCHORED,2)}findUTF8Submatch(e){let t=this.executeEngine(ve.fromUTF8(e),0,L.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.slice(t[2*s],t[2*s+1]));return r}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(ve.fromUTF8(e),0,L.UNANCHORED,this.prog.numCap))}findSubmatch(e){let t=this.executeEngine(ve.fromUTF16(e),0,L.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.substring(t[2*s],t[2*s+1]));return r}findSubmatchIndex(e){return this.pad(this.executeEngine(ve.fromUTF16(e),0,L.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){let r=this.allMatches(ve.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return r.length===0?null:r}findAllUTF8Index(e,t){let r=this.allMatches(ve.fromUTF8(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAll(e,t){let r=this.allMatches(ve.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return r.length===0?null:r}findAllIndex(e,t){let r=this.allMatches(ve.fromUTF16(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAllUTF8Submatch(e,t){let r=this.allMatches(ve.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllUTF8SubmatchIndex(e,t){let r=this.allMatches(ve.fromUTF8(e),t);return r.length===0?null:r}findAllSubmatch(e,t){let r=this.allMatches(ve.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllSubmatchIndex(e,t){let r=this.allMatches(ve.fromUTF16(e),t);return r.length===0?null:r}},Ab=class Ja{static UNANCHORED=L.UNANCHORED;static ANCHOR_START=L.ANCHOR_START;static ANCHOR_BOTH=L.ANCHOR_BOTH;constructor(e=Ja.UNANCHORED,t=0,r=8388608){this.anchor=e,this.jsFlags=t,this.maxMem=r;let s=L.PERL;(t&Wt.DISABLE_UNICODE_GROUPS)!==0&&(s&=~L.UNICODE_GROUPS),(t&Wt.LOOKBEHINDS)!==0&&(s|=L.LOOKBEHIND),this.re2Flags=s,this.regexps=[],this.prog=null,this.dfa=null,this.dummyRe2=null}add(e){if(this.prog)throw new wC("Cannot add patterns after compile");let t=e;(this.jsFlags&Wt.CASE_INSENSITIVE)!==0&&(t=`(?i)${t}`),(this.jsFlags&Wt.DOTALL)!==0&&(t=`(?s)${t}`),(this.jsFlags&Wt.MULTILINE)!==0&&(t=`(?m)${t}`);let r=SC.parse(t,this.re2Flags);return this.regexps.push(bC.simplify(r)),this.regexps.length-1}compile(){this.prog||(this.prog=vC.compileSet(this.regexps),this.dfa=new IC(this.prog,this.maxMem),this.dummyRe2={prog:this.prog,cond:this.prog.startCond(),prefix:"",prefixRune:0,longest:!1})}match(e){this.prog||this.compile();let t=X.isByteArray(e)?ve.fromUTF8(e):ve.fromUTF16(e),r=L.UNANCHORED;this.anchor===Ja.ANCHOR_START?r=L.ANCHOR_START:this.anchor===Ja.ANCHOR_BOTH&&(r=L.ANCHOR_BOTH);let s=this.dfa.matchSet(t,0,r);if(s!==null)return s;let i=DC.fromRE2(this.dummyRe2);return i.init(0),i.matchSet(t,0,r)}},hI=class fs{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let r="",s=!1,i=e.length;i===0&&(r="(?:)",s=!0);let o=!1,c=0;for(;c<i;){let l=e[c];if(l==="\\"){if(c+1<i)switch(l=e[c+1],l){case"\\":r+="\\\\",c+=2;continue;case"c":if(c+2<i){let C=e[c+2].charCodeAt(0);if(C>=65&&C<=90||C>=97&&C<=122){let v=C%32;r+="\\x",r+=(v>>4).toString(16).toUpperCase(),r+=(v&15).toString(16).toUpperCase(),c+=3,s=!0;continue}}r+="c",c+=2,s=!0;continue;case"u":if(c+2<i){if(e[c+2]==="{"){let C=c+3,v=!1,R=!1;for(;C<i;){let S=e[C];if(S==="}"){R=!0;break}if(!fs.isHexadecimal(S))break;v=!0,C++}if(R&&v){r+="\\x",c+=2,s=!0;continue}}else if(c+5<i){let C=!0;for(let v=0;v<4;v++)if(!fs.isHexadecimal(e[c+2+v])){C=!1;break}if(C){r+="\\x{"+e.substring(c+2,c+6)+"}",c+=6,s=!0;continue}}}r+="u",c+=2,s=!0;continue;case"x":{let C=!1;if(c+2<i&&e[c+2]==="{"){let v=c+3,R=!1,S=!1;for(;v<i;){let G=e[v];if(G==="}"){S=!0;break}if(!fs.isHexadecimal(G))break;R=!0,v++}S&&R&&(C=!0)}else c+3<i&&fs.isHexadecimal(e[c+2])&&fs.isHexadecimal(e[c+3])&&(C=!0);C?(r+="\\x",c+=2):(r+="x",c+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":r+="\\"+l,c+=2;continue;default:{let C=e.codePointAt(c+1);if(C>=48&&C<=57||C>=65&&C<=90||C>=97&&C<=122){let v=X.charCount(C);r+=e.substring(c+1,c+1+v),c+=v+1,s=!0}else{r+="\\";let v=X.charCount(C);r+=e.substring(c+1,c+1+v),c+=v+1}continue}}}else if(l==="/"){r+="\\/",c+=1,s=!0;continue}else if(l==="[")o=!0;else if(l==="]")o=!1;else if(!o&&l==="("&&c+2<i&&e[c+1]==="?"&&e[c+2]==="<"&&c+3<i&&!"=!>)".includes(e[c+3])){r+="(?P<",c+=3,s=!0;continue}let h=e.codePointAt(c),f=X.charCount(h);r+=e.substring(c,c+f),c+=f}let u=s?r:e;return t.length>0?`(?${t})${u}`:u}},Ka=class at{static CASE_INSENSITIVE=Wt.CASE_INSENSITIVE;static DOTALL=Wt.DOTALL;static MULTILINE=Wt.MULTILINE;static DISABLE_UNICODE_GROUPS=Wt.DISABLE_UNICODE_GROUPS;static LONGEST_MATCH=Wt.LONGEST_MATCH;static LOOKBEHINDS=Wt.LOOKBEHINDS;static quote(e){return X.quoteMeta(e)}static quoteReplacement(e,t=!1){return Kg.quoteReplacement(e,t)}static translateRegExp(e){return hI.translate(e)}static compile(e,t=0){let r=e;if((t&at.CASE_INSENSITIVE)!==0&&(r=`(?i)${r}`),(t&at.DOTALL)!==0&&(r=`(?s)${r}`),(t&at.MULTILINE)!==0&&(r=`(?m)${r}`),(t&~(at.MULTILINE|at.DOTALL|at.CASE_INSENSITIVE|at.DISABLE_UNICODE_GROUPS|at.LONGEST_MATCH|at.LOOKBEHINDS))!==0)throw new $D("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=L.PERL;(t&at.DISABLE_UNICODE_GROUPS)!==0&&(s&=~L.UNICODE_GROUPS),(t&at.LOOKBEHINDS)!==0&&(s|=L.LOOKBEHIND);let i=new at(e,t);return i.re2Input=BI.compileImpl(r,s,(t&at.LONGEST_MATCH)!==0),i}static matches(e,t){return at.compile(e).testExact(t)}static initTest(e,t,r){if(e==null)throw new Error("pattern is null");if(r==null)throw new Error("re2 is null");let s=new at(e,t);return s.re2Input=r,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return X.isByteArray(e)&&(e=Rr.utf8(e)),new Kg(this,e)}test(e){return X.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){let t=X.isByteArray(e)?ve.fromUTF8(e):ve.fromUTF16(e);return this.re2Input.executeEngine(t,0,L.ANCHOR_BOTH,0)!==null}exec(e){let t=this.matcher(e);if(!t.find())return null;let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;return r}split(e,t=0){let r=this.matcher(e),s=[],i=0,o=0;for(;r.find();){if(o===0&&r.end()===0){o=r.end();continue}if(t>0&&s.length===t-1)break;if(o===r.start()){if(t===0){i+=1,o=r.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.start())),o=r.end()}if(t===0&&o!==r.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.inputLength()))}return(t!==0||s.length===0&&!(o===r.inputLength()&&o>0))&&s.push(r.substring(o,r.inputLength())),s}*matchAll(e){let t=this.matcher(e);for(;t.find();){let r=[t.group(0)];for(let i=1;i<=t.groupCount();i++){let o=t.group(i);r.push(o===null?void 0:o)}r.index=t.start(0),r.input=e;let s=this.namedGroups();if(Object.keys(s).length>0){let i=t.getNamedGroups();for(let o in i)i[o]===null&&(i[o]=void 0);r.groups=i}else r.groups=void 0;yield r}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}};/**
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
 */var js="12.19.0";function dm(n){js=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Lr=new Jn("@firebase/firestore");function ps(){return Lr.logLevel}function J(n,...e){if(Lr.logLevel<=fe.DEBUG){let t=e.map(Nd);Lr.debug(`Firestore (${js}): ${n}`,...t)}}function bn(n,...e){if(Lr.logLevel<=fe.ERROR){let t=e.map(Nd);Lr.error(`Firestore (${js}): ${n}`,...t)}}function Ht(n,...e){if(Lr.logLevel<=fe.WARN){let t=e.map(Nd);Lr.warn(`Firestore (${js}): ${n}`,...t)}}function Nd(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function Z(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,fm(n,r,t)}function fm(n,e,t){let r=`FIRESTORE (${js}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw bn(r),new Error(r)}function ee(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||fm(e,s,r)}function Ce(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dI(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */var Is=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let s=dI(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}};function ge(n,e){return n<e?-1:n>e?1:0}function zl(n,e){let t=Math.min(n.length,e.length);for(let r=0;r<t;r++){let s=n.charAt(r),i=e.charAt(r);if(s!==i)return Ul(s)===Ul(i)?ge(s,i):Ul(s)?1:-1}return ge(n.length,e.length)}var fI=55296,pI=57343;function Ul(n){let e=n.charCodeAt(0);return e>=fI&&e<=pI}function Ts(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
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
 */var xe=class n{constructor(e,t){this.comparator=e,this.root=t||ln.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ln.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ln.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){let e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new _s(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new _s(this.root,e,this.comparator,!1)}getReverseIterator(){return new _s(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new _s(this.root,e,this.comparator,!0)}},_s=class{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},ln=class n{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??n.RED,this.left=s??n.EMPTY,this.right=i??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new n(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this,i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return n.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Z(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Z(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw Z(27949);return e+(this.isRed()?0:1)}};ln.EMPTY=null,ln.RED=!0,ln.BLACK=!1;ln.EMPTY=new class{constructor(){this.size=0}get key(){throw Z(57766)}get value(){throw Z(16141)}get color(){throw Z(16727)}get left(){throw Z(29726)}get right(){throw Z(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new ln(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */var Qe=class n{constructor(e){this.comparator=e,this.data=new xe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new tc(this.data.getIterator())}getIteratorFrom(e){return new tc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},tc=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
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
 */var V={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},H=class extends At{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
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
 */var cn="__name__",nc=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&Z(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Z(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let s=0;s<r;s++){let i=n.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ge(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),s=n.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?n.extractNumericId(e).compare(n.extractNumericId(t)):zl(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return En.fromString(e.substring(4,e.length-2))}},Te=class n extends nc{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new H(V.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new n(t)}static emptyPath(){return new n([])}},gI=/^[_a-zA-Z][_a-zA-Z0-9]*$/,Ot=class gs extends nc{construct(e,t,r){return new gs(e,t,r)}static isValidIdentifier(e){return gI.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),gs.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===cn}static keyField(){return new gs([cn])}static fromServerFormat(e){let t=[],r="",s=0,i=()=>{if(r.length===0)throw new H(V.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;s<e.length;){let c=e[s];if(c==="\\"){if(s+1===e.length)throw new H(V.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new H(V.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(r+=c,s++):(i(),s++)}if(i(),o)throw new H(V.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new gs(t)}static emptyPath(){return new gs([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $t=class n{constructor(e){this.fields=e,e.sort(Ot.comparator)}static empty(){return new n([])}unionWith(e){let t=new Qe(Ot.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ts(this.fields,e.fields,((t,r)=>t.isEqual(r)))}};/**
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
 */function rc(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ts(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function pm(n,e){let t=[];for(let r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function gm(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */var te=class n{constructor(e){this.path=e}static fromPath(e){return new n(Te.fromString(e))}static fromName(e){return new n(Te.fromString(e).popFirst(5))}static empty(){return new n(Te.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Te.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Te.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new Te(e.slice()))}};/**
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
 */function Cm(n,e,t){if(!t)throw new H(V.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function mm(n,e,t,r){if(e===!0&&r===!0)throw new H(V.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function RC(n){if(!te.isDocumentKey(n))throw new H(V.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function PC(n){if(te.isDocumentKey(n))throw new H(V.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function To(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ao(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Z(12329,{type:typeof n})}function dn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new H(V.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=Ao(n);throw new H(V.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */function He(n,e){let t={typeString:n};return e&&(t.value=e),t}function vo(n,e){if(!To(n))throw new H(V.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}let o=n[r];if(s&&typeof o!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new H(V.INVALID_ARGUMENT,t);return!0}/**
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
 */var NC=-62135596800,OC=1e6,Fe=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*OC);return new n(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new H(V.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return n._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{let s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new H(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new H(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<NC)throw new H(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new H(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/OC}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new H(V.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?ge(this.nanoseconds,e.nanoseconds):ge(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(vo(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-NC;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};Fe._jsonSchemaVersion="firestore/timestamp/1.0",Fe._jsonSchema={type:He("string",Fe._jsonSchemaVersion),seconds:He("number"),nanoseconds:He("number")};/**
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
 */var sc=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var je=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new sc("Invalid base64 string: "+i):i}})(e);return new n(t)}static fromUint8Array(e){let t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ge(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};je.EMPTY_BYTE_STRING=new je("");var CI=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Sn(n){if(ee(!!n,39018),typeof n=="string"){let e=0,t=CI.exec(n);if(ee(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Se(n.seconds),nanos:Se(n.nanos)}}function Se(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Rn(n){return typeof n=="string"?je.fromBase64String(n):je.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Em="server_timestamp",_m="__type__",wm="__previous_value__",ym="__local_write_time__";function bo(n){return(n?.mapValue?.fields||{})[_m]?.stringValue===Em}function So(n){let e=n.mapValue.fields[wm];return bo(e)?So(e):e}function As(n){let e=Sn(n.mapValue.fields[ym].timestampValue);return new Fe(e.seconds,e.nanos)}/**
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
 */var Wl=class{constructor(e,t,r,s,i,o,c,u,l,h,f,C,v){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=h,this.apiKey=f,this._customHeaders=C,this.grpcFlowControlWindow=v}},Yi="(default)",Xi=class n{constructor(e,t){this.projectId=e,this.database=t||Yi}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===Yi}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};function Dm(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new H(V.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Xi(n.options.projectId,e)}/**
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
 */var mI=-1;function Ro(n){return n==null}function vs(n){return n===0&&1/n==-1/0}function EI(n){return typeof n=="number"&&Number.isInteger(n)&&!vs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function _I(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Od="__type__",Im="__max__",za={mapValue:{fields:{__type__:{stringValue:Im}}}},kd="__vector__",Vr="value",bs={nullValue:"NULL_VALUE"},wt={booleanValue:!0},nt={booleanValue:!1};function Je(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?bo(n)?4:Tm(n)?9007199254740991:eo(n)?10:11:Z(28295,{value:n})}function qt(n,e,t){if(n===e)return!0;let r=Je(n);if(r!==Je(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return As(n).isEqual(As(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;let c=Sn(i.timestampValue),u=Sn(o.timestampValue);return c.seconds===u.seconds&&c.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,o){return Rn(i.bytesValue).isEqual(Rn(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,o){return Se(i.geoPointValue.latitude)===Se(o.geoPointValue.latitude)&&Se(i.geoPointValue.longitude)===Se(o.geoPointValue.longitude)})(n,e);case 2:return(function(i,o,c){if("integerValue"in i&&"integerValue"in o)return Se(i.integerValue)===Se(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=Se(i.doubleValue),l=Se(o.doubleValue);else{if(!c?.i)return!1;u=Se(i.integerValue??i.doubleValue),l=Se(o.integerValue??o.doubleValue)}return u===l?!!c?.o||vs(u)===vs(l):!!(c===void 0||c.u)&&isNaN(u)&&isNaN(l)})(n,e,t);case 9:return Ts(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>qt(s,i,t)));case 10:case 11:return(function(i,o,c){let u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(rc(u)!==rc(l))return!1;for(let h in u)if(u.hasOwnProperty(h)&&(l[h]===void 0||!qt(u[h],l[h],c)))return!1;return!0})(n,e,t);default:return Z(52216,{left:n})}}function Zi(n,e){return(n.values||[]).find((t=>qt(t,e)))!==void 0}function yt(n,e){if(n===e)return 0;let t=Je(n),r=Je(e);if(t!==r)return ge(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return ge(n.booleanValue,e.booleanValue);case 2:return(function(i,o){let c=Se(i.integerValue||i.doubleValue),u=Se(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return kC(n.timestampValue,e.timestampValue);case 4:return kC(As(n),As(e));case 5:return zl(n.stringValue,e.stringValue);case 6:return(function(i,o){let c=Rn(i),u=Rn(o);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,o){let c=i.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){let h=ge(c[l],u[l]);if(h!==0)return h}return ge(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,o){let c=ge(Se(i.latitude),Se(o.latitude));return c!==0?c:ge(Se(i.longitude),Se(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return FC(n.arrayValue,e.arrayValue);case 10:return(function(i,o){let c=i.fields||{},u=o.fields||{},l=c[Vr]?.arrayValue,h=u[Vr]?.arrayValue,f=ge(l?.values?.length||0,h?.values?.length||0);return f!==0?f:FC(l,h)})(n.mapValue,e.mapValue);case 11:return(function(i,o){if(i===za.mapValue&&o===za.mapValue)return 0;if(i===za.mapValue)return 1;if(o===za.mapValue)return-1;let c=i.fields||{},u=Object.keys(c),l=o.fields||{},h=Object.keys(l);u.sort(),h.sort();for(let f=0;f<u.length&&f<h.length;++f){let C=zl(u[f],h[f]);if(C!==0)return C;let v=yt(c[u[f]],l[h[f]]);if(v!==0)return v}return ge(u.length,h.length)})(n.mapValue,e.mapValue);default:throw Z(23264,{l:t})}}function kC(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ge(n,e);let t=Sn(n),r=Sn(e),s=ge(t.seconds,r.seconds);return s!==0?s:ge(t.nanos,r.nanos)}function FC(n,e){let t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){let i=yt(t[s],r[s]);if(i!==void 0&&i!==0)return i}return ge(t.length,r.length)}function Ss(n){return Ql(n)}function Ql(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){let r=Sn(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Rn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return te.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(let i of t.values||[])s?s=!1:r+=",",r+=Ql(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){let r=Object.keys(t.fields||{}).sort(),s="{",i=!0;for(let o of r)i?i=!1:s+=",",s+=`${o}:${Ql(t.fields[o])}`;return s+"}"})(n.mapValue):Z(61005,{value:n})}function Ya(n){switch(Je(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let e=So(n);return e?16+Ya(e):16;case 5:return 2*n.stringValue.length;case 6:return Rn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+Ya(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return ts(r.fields,((i,o)=>{s+=i.length+Ya(o)})),s})(n.mapValue);default:throw Z(13486,{value:n})}}function Fd(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function un(n){return!!n&&"integerValue"in n}function Or(n){return!!n&&"doubleValue"in n}function nr(n){return un(n)||Or(n)}function Rs(n){return!!n&&"arrayValue"in n}function Pt(n){return!!n&&"nullValue"in n}function Dt(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ws(n){return!!n&&"mapValue"in n}function eo(n){return(n?.mapValue?.fields||{})[Od]?.stringValue===kd}function $l(n){return(n?.mapValue?.fields||{})[Vr]?.arrayValue}function ji(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){let e={mapValue:{fields:{}}};return ts(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=ji(r))),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ji(n.arrayValue.values[t]);return e}return{...n}}function Tm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Im}var BS={mapValue:{fields:{[Od]:{stringValue:kd},[Vr]:{arrayValue:{}}}}};/**
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
 */var ft=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!ws(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ji(t)}setAll(e){let t=Ot.emptyPath(),r={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){let u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}o?r[c.lastSegment()]=ji(o):s.push(c.lastSegment())}));let i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){let t=this.field(e.popLast());ws(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return qt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];ws(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){ts(t,((s,i)=>e[s]=i));for(let s of r)delete e[s]}clone(){return new n(ji(this.value))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:vs(e)?"-0":e}}function xd(n){return{integerValue:""+n}}function Ld(n,e,t){return EI(e)?xd(e):jc(n,e)}/**
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
 */var Ps=class{constructor(){this._=void 0}};function wI(n,e,t){return n instanceof Mr?(function(s,i){let o={fields:{[_m]:{stringValue:Em},[ym]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&bo(i)&&(i=So(i)),i&&(o.fields[wm]=i),{mapValue:o}})(t,e):n instanceof Gr?Am(n,e):n instanceof Ur?vm(n,e):n instanceof Hr?(function(s,i){let o=DI(s,i),c=ic(o)+ic(s.h);return un(o)&&un(s.h)?xd(c):jc(s.serializer,c)})(n,e):n instanceof Ns?(function(s,i){return xC(s,i,Math.min)})(n,e):n instanceof Os?(function(s,i){return xC(s,i,Math.max)})(n,e):void 0}function yI(n,e,t){return n instanceof Gr?Am(n,e):n instanceof Ur?vm(n,e):t}function DI(n,e){return n instanceof Hr?nr(e)?e:{integerValue:0}:null}var Mr=class extends Ps{},Gr=class extends Ps{constructor(e){super(),this.elements=e}};function Am(n,e){let t=bm(e);for(let r of n.elements)t.some((s=>qt(s,r)))||t.push(r);return{arrayValue:{values:t}}}var Ur=class extends Ps{constructor(e){super(),this.elements=e}};function vm(n,e){let t=bm(e);for(let r of n.elements)t=t.filter((s=>!qt(s,r)));return{arrayValue:{values:t}}}var to=class extends Ps{constructor(e,t){super(),this.serializer=e,this.h=t}},Hr=class extends to{},Ns=class extends to{},Os=class extends to{};function xC(n,e,t){if(!nr(e))return n.h;let r=t(ic(e),ic(n.h));return un(e)&&un(n.h)?xd(r):jc(n.serializer,r)}function ic(n){return Se(n.integerValue||n.doubleValue)}function bm(n){return Rs(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */var Yl=class{constructor(e,t){this.field=e,this.transform=t}};function II(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Gr&&s instanceof Gr||r instanceof Ur&&s instanceof Ur?Ts(r.elements,s.elements,qt):r instanceof Hr&&s instanceof Hr||r instanceof Ns&&s instanceof Ns||r instanceof Os&&s instanceof Os?qt(r.h,s.h):r instanceof Mr&&s instanceof Mr})(n.transform,e.transform)}var Qt=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function Xa(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var ks=class{};function Sm(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Fs(n.key,Qt.none()):new qr(n.key,n.data,Qt.none());{let t=n.data,r=ft.empty(),s=new Qe(Ot.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Pn(n.key,r,new $t(s.toArray()),Qt.none())}}function TI(n,e,t){n instanceof qr?(function(s,i,o){let c=s.value.clone(),u=VC(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):n instanceof Pn?(function(s,i,o){if(!Xa(s.precondition,i))return void i.convertToUnknownDocument(o.version);let c=VC(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Rm(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Ji(n,e,t,r){return n instanceof qr?(function(i,o,c,u){if(!Xa(i.precondition,o))return c;let l=i.value.clone(),h=MC(i.fieldTransforms,u,o);return l.setAll(h),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(n,e,t,r):n instanceof Pn?(function(i,o,c,u){if(!Xa(i.precondition,o))return c;let l=MC(i.fieldTransforms,u,o),h=o.data;return h.setAll(Rm(i)),h.setAll(l),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((f=>f.field)))})(n,e,t,r):(function(i,o,c){return Xa(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(n,e,t)}function LC(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ts(r,s,((i,o)=>II(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var qr=class extends ks{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}},Pn=class extends ks{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}};function Rm(n){let e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}})),e}function VC(n,e,t){let r=new Map;ee(n.length===t.length,32656,{T:t.length,P:n.length});for(let s=0;s<t.length;s++){let i=n[s],o=i.transform,c=e.data.field(i.field);r.set(i.field,yI(o,c,t[s]))}return r}function MC(n,e,t){let r=new Map;for(let s of n){let i=s.transform,o=t.data.field(s.field);r.set(s.field,wI(i,o,e))}return r}var Fs=class extends ks{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},oc=class extends ks{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};/**
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
 */var jr=class{constructor(e,t){this.position=e,this.inclusive=t}};function GC(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){let i=e[s],o=n.position[s];if(i.field.isKeyField()?r=te.comparator(te.fromName(o.referenceValue),t.key):r=yt(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function UC(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!qt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */var ac=class{},Me=class n extends ac{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Zl(e,t,r):t==="array-contains"?new nB(e,r):t==="in"?new rB(e,r):t==="not-in"?new sB(e,r):t==="array-contains-any"?new iB(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new eB(e,r):new tB(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(yt(t,this.value)):t!==null&&Je(this.value)===Je(t)&&this.matchesComparison(yt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Z(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},jt=class n extends ac{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new n(e,t)}matches(e){return Pm(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}};function Pm(n){return n.op==="and"}function Nm(n){return AI(n)&&Pm(n)}function AI(n){for(let e of n.filters)if(e instanceof jt)return!1;return!0}function Xl(n){if(n instanceof Me)return n.field.canonicalString()+n.op.toString()+Ss(n.value);if(Nm(n))return n.filters.map((e=>Xl(e))).join(",");{let e=n.filters.map((t=>Xl(t))).join(",");return`${n.op}(${e})`}}function Om(n,e){return n instanceof Me?(function(r,s){return s instanceof Me&&r.op===s.op&&r.field.isEqual(s.field)&&qt(r.value,s.value)})(n,e):n instanceof jt?(function(r,s){return s instanceof jt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,c)=>i&&Om(o,s.filters[c])),!0):!1})(n,e):void Z(19439)}function km(n){return n instanceof Me?(function(t){return`${t.field.canonicalString()} ${t.op} ${Ss(t.value)}`})(n):n instanceof jt?(function(t){return t.op.toString()+" {"+t.getFilters().map(km).join(" ,")+"}"})(n):"Filter"}var Zl=class extends Me{constructor(e,t,r){super(e,t,r),this.key=te.fromName(r.referenceValue)}matches(e){let t=te.comparator(e.key,this.key);return this.matchesComparison(t)}},eB=class extends Me{constructor(e,t){super(e,"in",t),this.keys=Fm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},tB=class extends Me{constructor(e,t){super(e,"not-in",t),this.keys=Fm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function Fm(n,e){return(e.arrayValue?.values||[]).map((t=>te.fromName(t.referenceValue)))}var nB=class extends Me{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Rs(t)&&Zi(t.arrayValue,this.value)}},rB=class extends Me{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&Zi(this.value.arrayValue,t)}},sB=class extends Me{constructor(e,t){super(e,"not-in",t)}matches(e){if(Zi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Zi(this.value.arrayValue,t)}},iB=class extends Me{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Rs(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Zi(this.value.arrayValue,r)))}};/**
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
 */var Jr=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function vI(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */var ce=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new Fe(0,0))}static max(){return new n(new Fe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};/**
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
 */var Ft=class n{constructor(e,t,r,s,i,o,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new n(e,0,ce.min(),ce.min(),ce.min(),ft.empty(),0)}static newFoundDocument(e,t,r,s){return new n(e,1,t,ce.min(),r,s,0)}static newNoDocument(e,t){return new n(e,2,t,ce.min(),ce.min(),ft.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,ce.min(),ce.min(),ft.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ce.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ft.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ft.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ce.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};/**
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
 */var no=-1,cc=class{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}};cc.UNKNOWN_ID=-1;function bI(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=ce.fromTimestamp(r===1e9?new Fe(t+1,0):new Fe(t,r));return new Kr(s,te.empty(),e)}function SI(n){return new Kr(n.readTime,n.key,no)}var Kr=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(ce.min(),te.empty(),no)}static max(){return new n(ce.max(),te.empty(),no)}};function RI(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=te.comparator(n.documentKey,e.documentKey),t!==0?t:ge(n.largestBatchId,e.largestBatchId))}/**
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
 */var oB=class{constructor(e,t=null,r=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.R=null}};function HC(n,e=null,t=[],r=[],s=null,i=null,o=null){return new oB(n,e,t,r,s,i,o)}function xm(n){let e=Ce(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Xl(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Ro(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Ss(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Ss(r))).join(",")),e.R=t}return e.R}function Lm(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!vI(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Om(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!UC(n.startAt,e.startAt)&&UC(n.endAt,e.endAt)}function Nr(n){return!!n.isCorePipeline}function Vm(n){return!!n.path&&te.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */var zr=class{constructor(e,t=null,r=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}};function PI(n,e,t,r,s,i,o,c){return new zr(n,e,t,r,s,i,o,c)}function Po(n){return new zr(n)}function qC(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function NI(n){return te.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Vd(n){return n.collectionGroup!==null}function ys(n){let e=Ce(n);if(e.A===null){e.A=[];let t=new Set;for(let i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new Qe(Ot.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(c=c.add(l.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new Jr(i,r))})),t.has(Ot.keyField().canonicalString())||e.A.push(new Jr(Ot.keyField(),r))}return e.A}function Bn(n){let e=Ce(n);return e.V||(e.V=OI(e,ys(n))),e.V}function OI(n,e){if(n.limitType==="F")return HC(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{let i=s.dir==="desc"?"asc":"desc";return new Jr(s.field,i)}));let t=n.endAt?new jr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new jr(n.startAt.position,n.startAt.inclusive):null;return HC(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Jc(n,e){let t=n.filters.concat([e]);return new zr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function uc(n,e,t){return new zr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function kI(n,e){return Lm(Bn(n),Bn(e))&&n.limitType===e.limitType}function Ki(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>km(s))).join(", ")}]`),Ro(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Ss(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Ss(s))).join(",")),`Target(${r})`})(Bn(n))}; limitType=${n.limitType})`}function Kc(n,e){return e.isFoundDocument()&&(function(r,s){let i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):te.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(let i of ys(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(let i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,c,u){let l=GC(o,c,u);return o.inclusive?l<=0:l<0})(r.startAt,ys(r),s)||r.endAt&&!(function(o,c,u){let l=GC(o,c,u);return o.inclusive?l>=0:l>0})(r.endAt,ys(r),s))})(n,e)}function Md(n){return(e,t)=>{let r=!1;for(let s of ys(n)){let i=FI(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function FI(n,e,t){let r=n.field.isKeyField()?te.comparator(e.key,t.key):(function(i,o,c){let u=o.data.field(i),l=c.data.field(i);return u!==null&&l!==null?yt(u,l):Z(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Z(19790,{direction:n.dir})}}/**
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
 */var aB=class{constructor(e,t){this.count=e,this.unchangedNames=t}};/**
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
 */var Ge,De;function xI(n){switch(n){case V.OK:return Z(64938);case V.CANCELLED:case V.UNKNOWN:case V.DEADLINE_EXCEEDED:case V.RESOURCE_EXHAUSTED:case V.INTERNAL:case V.UNAVAILABLE:case V.UNAUTHENTICATED:return!1;case V.INVALID_ARGUMENT:case V.NOT_FOUND:case V.ALREADY_EXISTS:case V.PERMISSION_DENIED:case V.FAILED_PRECONDITION:case V.ABORTED:case V.OUT_OF_RANGE:case V.UNIMPLEMENTED:case V.DATA_LOSS:return!0;default:return Z(15467,{code:n})}}function Mm(n){if(n===void 0)return bn("GRPC error has no .code"),V.UNKNOWN;switch(n){case Ge.OK:return V.OK;case Ge.CANCELLED:return V.CANCELLED;case Ge.UNKNOWN:return V.UNKNOWN;case Ge.DEADLINE_EXCEEDED:return V.DEADLINE_EXCEEDED;case Ge.RESOURCE_EXHAUSTED:return V.RESOURCE_EXHAUSTED;case Ge.INTERNAL:return V.INTERNAL;case Ge.UNAVAILABLE:return V.UNAVAILABLE;case Ge.UNAUTHENTICATED:return V.UNAUTHENTICATED;case Ge.INVALID_ARGUMENT:return V.INVALID_ARGUMENT;case Ge.NOT_FOUND:return V.NOT_FOUND;case Ge.ALREADY_EXISTS:return V.ALREADY_EXISTS;case Ge.PERMISSION_DENIED:return V.PERMISSION_DENIED;case Ge.FAILED_PRECONDITION:return V.FAILED_PRECONDITION;case Ge.ABORTED:return V.ABORTED;case Ge.OUT_OF_RANGE:return V.OUT_OF_RANGE;case Ge.UNIMPLEMENTED:return V.UNIMPLEMENTED;case Ge.DATA_LOSS:return V.DATA_LOSS;default:return Z(39323,{code:n})}}(De=Ge||(Ge={}))[De.OK=0]="OK",De[De.CANCELLED=1]="CANCELLED",De[De.UNKNOWN=2]="UNKNOWN",De[De.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",De[De.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",De[De.NOT_FOUND=5]="NOT_FOUND",De[De.ALREADY_EXISTS=6]="ALREADY_EXISTS",De[De.PERMISSION_DENIED=7]="PERMISSION_DENIED",De[De.UNAUTHENTICATED=16]="UNAUTHENTICATED",De[De.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",De[De.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",De[De.ABORTED=10]="ABORTED",De[De.OUT_OF_RANGE=11]="OUT_OF_RANGE",De[De.UNIMPLEMENTED=12]="UNIMPLEMENTED",De[De.INTERNAL=13]="INTERNAL",De[De.UNAVAILABLE=14]="UNAVAILABLE",De[De.DATA_LOSS=15]="DATA_LOSS";/**
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
 */var Nn=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ts(this.inner,((t,r)=>{for(let[s,i]of r)e(s,i)}))}isEmpty(){return gm(this.inner)}size(){return this.innerSize}};/**
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
 */var LI=new xe(te.comparator);function Nt(){return LI}var Gm=new xe(te.comparator);function Cs(...n){let e=Gm;for(let t of n)e=e.insert(t.key,t);return e}function VI(n){let e=Gm;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Xn(){return zi()}function Um(){return zi()}function zi(){return new Nn((n=>n.toString()),((n,e)=>n.isEqual(e)))}var hS=new xe(te.comparator),MI=new Qe(te.comparator);function me(...n){let e=MI;for(let t of n)e=e.add(t);return e}var GI=new Qe(ge);function UI(){return GI}/**
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
 */var HI=null;/**
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
 */function qI(){return new TextEncoder}/**
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
 */var jI=new En([4294967295,4294967295],0);function jC(n){let e=qI().encode(n),t=new Al;return t.update(e),new Uint8Array(t.digest())}function JC(n){let e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new En([t,r],0),new En([s,i],0)]}var cB=class n{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new kr(`Invalid padding: ${t}`);if(r<0)throw new kr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new kr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new kr(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=En.fromNumber(this.p)}v(e,t,r){let s=e.add(t.multiply(En.fromNumber(r)));return s.compare(jI)===1&&(s=new En([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;let t=jC(e),[r,s]=JC(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);if(!this.D(o))return!1}return!0}static create(e,t,r){let s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new n(i,s,t);return r.forEach((c=>o.insert(c))),o}insert(e){if(this.p===0)return;let t=jC(e),[r,s]=JC(t);for(let i=0;i<this.hashCount;i++){let o=this.v(r,s,i);this.C(o)}}C(e){let t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}},kr=class extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}};/**
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
 */var ro=class n{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){let s=new Map;return s.set(e,so.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new n(ce.min(),s,new xe(ge),Nt(),Nt(),me())}},so=class n{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new n(r,t,me(),me(),me())}};/**
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
 */var Ds=class{constructor(e,t,r,s){this.F=e,this.removedTargetIds=t,this.key=r,this.O=s}},lc=class{constructor(e,t){this.targetId=e,this.M=t}},Bc=class{constructor(e,t,r=je.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}},hc=class{constructor(e){this.targetId=e,this.N=0,this.L=KC(),this.B=je.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=me(),t=me(),r=me();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:Z(38017,{changeType:i})}})),new so(this.B,this.U,e,t,r)}G(){this.k=!1,this.L=KC()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,ee(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}},Hi="WatchChangeAggregator",uB=class{constructor(e){this.X=e,this.ee=new Map,this.te=Nt(),this.ne=Wa(),this.re=Nt(),this.ie=Wa(),this.se=new xe(ge)}_e(e){for(let t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(let t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{let r=this.ee.get(t);if(r)switch(e.state){case 0:this.ce(t)&&r.K(e.resumeToken);break;case 1:r.Y(),r.q||r.G(),r.K(e.resumeToken);break;case 2:r.Y(),r.q||this.removeTarget(t);break;case 3:this.ce(t)&&(r.Z(),r.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),r.K(e.resumeToken));break;default:Z(56790,{state:e.state})}else J(Hi,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((r,s)=>{this.ce(s)&&t(s)}))}Ee(e){return Nr(e)?e.getPipelineSourceType()==="documents"&&e.getPipelineDocuments()?.length===1:Vm(e)}he(e){let t=e.targetId,r=e.M.count,s=this.Te(t);if(s){let i=s.target;if(this.Ee(i))if(r===0){let o=new te(Nr(i)?Te.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,o,Ft.newNoDocument(o,ce.min()))}else ee(r===1,20013,"Single document existence filter with count: "+r);else{let o=this.Pe(t);if(o!==r){let c=this.Ie(e),u=c?this.Re(c,e,o):1;if(u!==0){this.le(t);let l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,l)}HI?.Ae((function(h,f,C,v,R){let S={localCacheCount:h,existenceFilterCount:f.count,databaseId:C.database,projectId:C.projectId},G=f.unchangedNames;return G&&(S.bloomFilter={applied:R===0,hashCount:G?.hashCount??0,bitmapLength:G?.bits?.bitmap?.length??0,padding:G?.bits?.padding??0,mightContain:U=>v?.mightContain(U)??!1}),S})(o,e.M,this.X.Ve(),c,u))}}}}Ie(e){let t=e.M.unchangedNames;if(!t||!t.bits)return null;let{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t,o,c;try{o=Rn(r).toUint8Array()}catch(u){if(u instanceof sc)return Ht("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new cB(o,s,i)}catch(u){return Ht(u instanceof kr?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.p===0?null:c}Re(e,t,r){return t.M.count===r-this.de(e,t.targetId)?0:2}de(e,t){let r=this.X.getRemoteKeysForTarget(t),s=0;return r.forEach((i=>{let o=this.X.Ve(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.ae(t,i,null),s++)})),s}fe(e){let t=new Map;this.ee.forEach(((i,o)=>{let c=this.Te(o);if(c){if(i.current&&this.Ee(c.target)){let u=Nr(c.target)?Te.fromString(c.target.getPipelineDocuments()[0]):c.target.path,l=new te(u);this.me(l).has(o)||this.pe(o,l)||this.ae(o,l,Ft.newNoDocument(l,e))}i.$&&(t.set(o,i.W()),i.G())}}));let r=me();this.ie.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{let l=this.Te(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.te.forEach(((i,o)=>o.setReadTime(e))),this.re.forEach(((i,o)=>o.setReadTime(e)));let s=new ro(e,t,this.se,this.te,this.re,r);return this.te=Nt(),this.ne=Wa(),this.re=Nt(),this.ie=Wa(),this.se=new xe(ge),s}oe(e,t){let r=this.ee.get(e);if(!r||!this.ce(e))return void J(Hi,`addDocumentToTarget received document for unknown inactive target (${e})`);let s=this.pe(e,t.key)?2:0;r.j(t.key,s),Nr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,r){let s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),r&&(Nr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,r):this.te=this.te.insert(t,r))):J(Hi,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){let t=this.ee.get(e);if(!t)return 0;let r=t.W();return this.X.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}J(e){let t=this.ee.get(e);t||(J(Hi,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new hc(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new Qe(ge),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new Qe(ge),this.ne=this.ne.insert(e,t)),t}ce(e){let t=this.Te(e)!==null;return t||J(Hi,"Detected inactive target",e),t}Te(e){let t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new hc(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}};function Wa(){return new xe(te.comparator)}function KC(){return new xe(te.comparator)}var JI={asc:"ASCENDING",desc:"DESCENDING"},KI={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},zI={and:"AND",or:"OR"},lB=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function BB(n,e){return n.useProto3Json||Ro(e)?e:{value:e}}function Wi(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Gd(n){let e=Sn(n);return new Fe(e.seconds,e.nanos)}function Hm(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Za(n,e){return Wi(n,e.toTimestamp())}function Dn(n){return ee(!!n,49232),ce.fromTimestamp(Gd(n))}function Ud(n,e){return hB(n,e).canonicalString()}function hB(n,e){let t=(function(s){return new Te(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function qm(n){let e=Te.fromString(n);return ee(Wm(e),10190,{key:e.toString()}),e}function io(n,e){return Ud(n.databaseId,e.path)}function Qi(n,e){let t=qm(e);if(t.get(1)!==n.databaseId.projectId)throw new H(V.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new H(V.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new te(Jm(t))}function jm(n,e){return Ud(n.databaseId,e)}function WI(n){let e=qm(n);return e.length===4?Te.emptyPath():Jm(e)}function zC(n){return new Te(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Jm(n){return ee(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function WC(n,e,t){return{name:io(n,e),fields:t.value.mapValue.fields}}function QI(n,e){return"found"in e?(function(r,s){ee(!!s.found,43571),s.found.name,s.found.updateTime;let i=Qi(r,s.found.name),o=Dn(s.found.updateTime),c=s.found.createTime?Dn(s.found.createTime):ce.min(),u=new ft({mapValue:{fields:s.found.fields}});return Ft.newFoundDocument(i,o,c,u)})(n,e):"missing"in e?(function(r,s){ee(!!s.missing,3894),ee(!!s.readTime,22933);let i=Qi(r,s.missing),o=Dn(s.readTime);return Ft.newNoDocument(i,o)})(n,e):Z(7234,{result:e})}function $I(n,e){let t;if("targetChange"in e){e.targetChange;let r=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:Z(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,h){return l.useProto3Json?(ee(h===void 0||typeof h=="string",58123),je.fromBase64String(h||"")):(ee(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),je.fromUint8Array(h||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(l){let h=l.code===void 0?V.UNKNOWN:Mm(l.code);return new H(h,l.message||"")})(o);t=new Bc(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;let r=e.documentChange;r.document,r.document.name,r.document.updateTime;let s=Qi(n,r.document.name),i=Dn(r.document.updateTime),o=r.document.createTime?Dn(r.document.createTime):ce.min(),c=new ft({mapValue:{fields:r.document.fields}}),u=Ft.newFoundDocument(s,i,o,c),l=r.targetIds||[],h=r.removedTargetIds||[];t=new Ds(l,h,u.key,u)}else if("documentDelete"in e){e.documentDelete;let r=e.documentDelete;r.document;let s=Qi(n,r.document),i=r.readTime?Dn(r.readTime):ce.min(),o=Ft.newNoDocument(s,i),c=r.removedTargetIds||[];t=new Ds([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;let r=e.documentRemove;r.document;let s=Qi(n,r.document),i=r.removedTargetIds||[];t=new Ds([],i,s,null)}else{if(!("filter"in e))return Z(11601,{we:e});{e.filter;let r=e.filter;r.targetId;let{count:s=0,unchangedNames:i}=r,o=new aB(s,i),c=r.targetId;t=new lc(c,o)}}return t}function YI(n,e){let t;if(e instanceof qr)t={update:WC(n,e.key,e.value)};else if(e instanceof Fs)t={delete:io(n,e.key)};else if(e instanceof Pn)t={update:WC(n,e.key,e.data),updateMask:oT(e.fieldMask)};else{if(!(e instanceof oc))return Z(16599,{be:e.type});t={verify:io(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){let c=o.transform;if(c instanceof Mr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Gr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Ur)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Hr)return{fieldPath:o.field.canonicalString(),increment:c.h};if(c instanceof Ns)return{fieldPath:o.field.canonicalString(),minimum:c.h};if(c instanceof Os)return{fieldPath:o.field.canonicalString(),maximum:c.h};throw Z(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Za(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Z(27497)})(n,e.precondition)),t}function XI(n,e){return{documents:[jm(n,e.path)]}}function ZI(n,e){let t={structuredQuery:{}},r=e.path,s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=jm(n,s);let i=(function(l){if(l.length!==0)return zm(jt.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);let o=(function(l){if(l.length!==0)return l.map((h=>(function(C){return{field:ms(C.field),direction:rT(C.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);let c=BB(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{Se:t,parent:s}}function eT(n){let e=WI(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,s=null;if(r>0){ee(r===1,65062);let h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(f){let C=Km(f);return C instanceof jt&&Nm(C)?C.getFilters():[C]})(t.where));let o=[];t.orderBy&&(o=(function(f){return f.map((C=>(function(R){return new Jr(Es(R.field),(function(G){switch(G){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(C)))})(t.orderBy));let c=null;t.limit&&(c=(function(f){let C;return C=typeof f=="object"?f.value:f,Ro(C)?null:C})(t.limit));let u=null;t.startAt&&(u=(function(f){let C=!!f.before,v=f.values||[];return new jr(v,C)})(t.startAt));let l=null;return t.endAt&&(l=(function(f){let C=!f.before,v=f.values||[];return new jr(v,C)})(t.endAt)),PI(e,s,o,i,c,"F",u,l)}function tT(n,e){let t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Z(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function nT(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function Km(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=Es(t.unaryFilter.field);return Me.create(r,"==",{doubleValue:NaN});case"IS_NULL":let s=Es(t.unaryFilter.field);return Me.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let i=Es(t.unaryFilter.field);return Me.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let o=Es(t.unaryFilter.field);return Me.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Z(61313);default:return Z(60726)}})(n):n.fieldFilter!==void 0?(function(t){return Me.create(Es(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Z(58110);default:return Z(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return jt.create(t.compositeFilter.filters.map((r=>Km(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Z(1026)}})(t.compositeFilter.op))})(n):Z(30097,{filter:n})}function rT(n){return JI[n]}function sT(n){return KI[n]}function iT(n){return zI[n]}function ms(n){return{fieldPath:n.canonicalString()}}function Es(n){return Ot.fromServerFormat(n.fieldPath)}function zm(n){return n instanceof Me?(function(t){if(t.op==="=="){if(Dt(t.value))return{unaryFilter:{field:ms(t.field),op:"IS_NAN"}};if(Pt(t.value))return{unaryFilter:{field:ms(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Dt(t.value))return{unaryFilter:{field:ms(t.field),op:"IS_NOT_NAN"}};if(Pt(t.value))return{unaryFilter:{field:ms(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ms(t.field),op:sT(t.op),value:t.value}}})(n):n instanceof jt?(function(t){let r=t.getFilters().map((s=>zm(s)));return r.length===1?r[0]:{compositeFilter:{op:iT(t.op),filters:r}}})(n):Z(54877,{filter:n})}function oT(n){let e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Wm(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Qm(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function oo(n,e){let t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function $m(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(n){return new lB(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ut=class n{constructor(e){this._byteString=e}static fromBase64String(e){try{return new n(je.fromBase64String(e))}catch(t){throw new H(V.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new n(je.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:n._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(vo(e,n._jsonSchema))return n.fromBase64String(e.bytes)}};Ut._jsonSchemaVersion="firestore/bytes/1.0",Ut._jsonSchema={type:He("string",Ut._jsonSchemaVersion),bytes:He("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wr=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new H(V.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ot(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};function Ym(){return new Wr(cn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qr=class{constructor(e){this._methodName=e}};/**
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
 */var In=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new H(V.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new H(V.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ge(this._lat,e._lat)||ge(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(vo(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};In._jsonSchemaVersion="firestore/geoPoint/1.0",In._jsonSchema={type:He("string",In._jsonSchemaVersion),latitude:He("number"),longitude:He("number")};/**
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
 */var tt=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};tt.UNAUTHENTICATED=new tt(null),tt.GOOGLE_CREDENTIALS=new tt("google-credentials-uid"),tt.FIRST_PARTY=new tt("first-party-uid"),tt.MOCK_USER=new tt("mock-user");/**
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
 */var Xt=class{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}};/**
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
 */var dc=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},fc=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(tt.UNAUTHENTICATED)))}shutdown(){}},dB=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}},pc=class{constructor(e){this.De=e,this.currentUser=tt.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){ee(this.Ce===void 0,42304);let r=this.xe,s=u=>this.xe!==r?(r=this.xe,t(u)):Promise.resolve(),i=new Xt;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new Xt,e.enqueueRetryable((()=>s(this.currentUser)))};let o=()=>{let u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{J("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),o())};this.De.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){let u=this.De.getImmediate({optional:!0});u?c(u):(J("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Xt)}}),0),o()}getToken(){let e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.xe!==e?(J("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(ee(typeof r.accessToken=="string",31837,{Oe:r}),new dc(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){let e=this.auth&&this.auth.getUid();return ee(e===null||typeof e=="string",2055,{Me:e}),new tt(e)}},fB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r,this.type="FirstParty",this.user=tt.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);let e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}},pB=class{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r}getToken(){return Promise.resolve(new fB(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(tt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},gc=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},Cc=class{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,vt(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){ee(this.Ce===void 0,3512);let r=i=>{i.error!=null&&J("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);let o=i.token!==this.$e;return this.$e=i.token,J("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>r(i)))};let s=i=>{J("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){let i=this.qe.getImmediate({optional:!0});i?s(i):J("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new gc(this.Ke));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ee(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new gc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}};function Xm(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */var gB=class{Qe(e){}shutdown(){}};/**
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
 */var QC="ConnectivityMonitor",mc=class{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){J(QC,"Network connectivity changed: AVAILABLE");for(let e of this.He)e(0)}je(){J(QC,"Network connectivity changed: UNAVAILABLE");for(let e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};/**
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
 */var Qa=null;function CB(){return Qa===null?Qa=(function(){return 268435456+Math.round(2147483648*Math.random())})():Qa++,"0x"+Qa.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hl="RestConnection",aT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},mB=class{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${r}/databases/${s}`,this.tt=this.databaseId.database===Yi?`project_id=${r}`:`project_id=${r}&database_id=${s}`}nt(e,t,r,s,i){let o=CB(),c=this.rt(e,t.toUriEncodedString());J(Hl,`Sending RPC '${e}' ${o}:`,c,r);let u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);let{host:l}=new URL(c),h=mr(l);return this.st(e,c,u,r,h).then((f=>(J(Hl,`Received RPC '${e}' ${o}: `,f),f)),(f=>{throw Ht(Hl,`RPC '${e}' ${o} failed with error: `,f,"url: ",c,"request:",r),f}))}_t(e,t,r,s,i,o){return this.nt(e,t,r,s,i)}it(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+js})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(let s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){let r=aT[e],s=`${this.Xe}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}};/**
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
 */var EB=class{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}};/**
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
 */var ct="WebChannelConnection",qi=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))},Ec=class n extends mB{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!n.yt){let e=Rl();qi(e,Sl.STAT_EVENT,(t=>{t.stat===Ma.PROXY?J(ct,"STAT_EVENT: detected buffering proxy"):t.stat===Ma.NOPROXY&&J(ct,"STAT_EVENT: detected no buffering proxy")})),n.yt=!0}}st(e,t,r,s,i){let o=CB();return new Promise(((c,u)=>{let l=new vl;l.setWithCredentials(!0),l.listenOnce(bl.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case Li.NO_ERROR:let f=l.getResponseJson();J(ct,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),c(f);break;case Li.TIMEOUT:J(ct,`RPC '${e}' ${o} timed out`),u(new H(V.DEADLINE_EXCEEDED,"Request time out"));break;case Li.HTTP_ERROR:let C=l.getStatus();if(J(ct,`RPC '${e}' ${o} failed with status:`,C,"response text:",l.getResponseText()),C>0){let v=l.getResponseJson();Array.isArray(v)&&(v=v[0]);let R=v?.error;if(R&&R.status&&R.message){let S=(function(U){let ae=U.toLowerCase().replace(/_/g,"-");return Object.values(V).indexOf(ae)>=0?ae:V.UNKNOWN})(R.status);u(new H(S,R.message))}else u(new H(V.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new H(V.UNAVAILABLE,"Connection failed."));break;default:Z(9055,{wt:e,streamId:o,bt:l.getLastErrorCode(),St:l.getLastError()})}}finally{J(ct,`RPC '${e}' ${o} completed.`)}}));let h=JSON.stringify(s);J(ct,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",h,r,15)}))}vt(e,t,r){let s=CB(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.it(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;let l=i.join("");J(ct,`Creating RPC '${e}' stream ${s}: ${l}`,c);let h=o.createWebChannel(l,c);this.Dt(h);let f=!1,C=!1,v=new EB({ot:R=>{C?J(ct,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(f||(J(ct,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),J(ct,`RPC '${e}' stream ${s} sending:`,R),h.send(R))},ut:()=>h.close()});return qi(h,hs.EventType.OPEN,(()=>{C||(J(ct,`RPC '${e}' stream ${s} transport opened.`),v.Rt())})),qi(h,hs.EventType.CLOSE,(()=>{C||(C=!0,J(ct,`RPC '${e}' stream ${s} transport closed`),v.Vt(),this.xt(h))})),qi(h,hs.EventType.ERROR,(R=>{C||(C=!0,Ht(ct,`RPC '${e}' stream ${s} transport errored. Name:`,R.name,"Message:",R.message),v.Vt(new H(V.UNAVAILABLE,"The operation could not be completed")))})),qi(h,hs.EventType.MESSAGE,(R=>{if(!C){let S=R.data[0];ee(!!S,16349);let G=S,U=G?.error||G[0]?.error;if(U){J(ct,`RPC '${e}' stream ${s} received error:`,U);let ae=U.status,Ee=(function(we){let A=Ge[we];if(A!==void 0)return Mm(A)})(ae),_e=U.message;ae==="NOT_FOUND"&&_e.includes("database")&&_e.includes("does not exist")&&_e.includes(this.databaseId.database)&&Ht(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Ee===void 0&&(Ee=V.INTERNAL,_e="Unknown error status: "+ae+" with message "+U.message),C=!0,v.Vt(new H(Ee,_e)),h.close()}else J(ct,`RPC '${e}' stream ${s} received:`,S),v.dt(S)}})),n.gt(),setTimeout((()=>{v.At()}),0),v}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,r){super.it(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Pl()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cT(n){return new Ec(n)}Ec.yt=!1;var ao=class{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=r,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();let t=Math.floor(this.Nt+this.qt()),r=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-r);s>0&&J("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}};/**
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
 */var $C="PersistentStream",_B=class{constructor(e,t,r,s,i,o,c,u){this.Ct=e,this.Kt=r,this.Qt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new ao(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===V.RESOURCE_EXHAUSTED?(bn(t.toString()),bn("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===V.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;let e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.un(r,s)}),(r=>{e((()=>{let s=new H(V.UNKNOWN,"Fetching auth token failed: "+r.message);return this.cn(s)}))}))}un(e,t){let r=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{r((()=>this.listener.ct()))})),this.stream.Et((()=>{r((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{r((()=>this.cn(s)))})),this.stream.onMessage((s=>{r((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return J($C,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(J($C,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}},wB=class extends _B{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();let t=$I(this.serializer,e),r=(function(i){if(!("targetChange"in i))return ce.min();let o=i.targetChange;return o.targetIds&&o.targetIds.length?ce.min():o.readTime?Dn(o.readTime):ce.min()})(e);return this.listener.Tn(t,r)}Pn(e){let t={};t.database=zC(this.serializer),t.addTarget=(function(i,o){let c,u=o.target;if(c=Nr(u)?{pipelineQuery:nT(i,u)}:Vm(u)?{documents:XI(i,u)}:{query:ZI(i,u).Se},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Hm(i,o.resumeToken);let l=BB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo(ce.min())>0){c.readTime=Wi(i,o.snapshotVersion.toTimestamp());let l=BB(i,o.expectedCount);l!==null&&(c.expectedCount=l)}return c})(this.serializer,e);let r=tT(this.serializer,e);r&&(t.labels=r),this.nn(t)}In(e){let t={};t.database=zC(this.serializer),t.removeTarget=e,this.nn(t)}};/**
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
 */var yB=class{},DB=class extends yB{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new H(V.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,r,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.nt(e,hB(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new H(V.UNKNOWN,i.toString())}))}_t(e,t,r,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection._t(e,hB(t,r),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new H(V.UNKNOWN,o.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}};function uT(n,e,t,r){return new DB(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lT="ComponentProvider",YC=new Map;function BT(n,e,t,r,s){return new Wl(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Xm(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
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
 */var XC={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Zm=41943040,Gt=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};Gt.DEFAULT_COLLECTION_PERCENTILE=10,Gt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Gt.DEFAULT=new Gt(Zm,Gt.DEFAULT_COLLECTION_PERCENTILE,Gt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Gt.DISABLED=new Gt(-1,0,0);/**
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
 */var xs=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.gn(r),this.yn=r=>t.writeSequenceNumber(r))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.yn&&this.yn(e),e}};xs.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",IB=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}};/**
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
 */async function Wc(n){if(n.code!==V.FAILED_PRECONDITION||n.message!==hT)throw n;J("LocalStore","Unexpectedly lost primary lease")}/**
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
 */var M=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Z(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):n.reject(t)}static resolve(e){return new n(((t,r)=>{t(e)}))}static reject(e){return new n(((t,r)=>{r(e)}))}static waitFor(e){return new n(((t,r)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>r(u)))})),o=!0,i===s&&t()}))}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next((s=>s?n.resolve(s):r()));return t}static forEach(e,t){let r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new n(((r,s)=>{let i=e.length,o=new Array(i),c=0;for(let u=0;u<i;u++){let l=u;t(e[l]).next((h=>{o[l]=h,++c,c===i&&r(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new n(((r,s)=>{let i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}};/**
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
 */function dT(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Js(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ZC="LruGarbageCollector",eE=1048576;function em([n,e],[t,r]){let s=ge(n,t);return s===0?ge(e,r):s}var TB=class{constructor(e){this.Yn=e,this.buffer=new Qe(em),this.Zn=0}Xn(){return++this.Zn}er(e){let t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{let r=this.buffer.last();em(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}},AB=class{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){J(ZC,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Js(t)?J(ZC,"Ignoring IndexedDB error during garbage collection: ",t):await Wc(t)}await this.nr(3e5)}))}},vB=class{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return M.resolve(xs.wn);let r=new TB(t);return this.rr.forEachTarget(e,(s=>r.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>r.er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.rr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(J("LruGarbageCollector","Garbage collection skipped; disabled"),M.resolve(XC)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(J("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),XC):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let r,s,i,o,c,u,l,h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((f=>(f>this.params.maximumSequenceNumbersToCollect?(J("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),s=this.params.maximumSequenceNumbersToCollect):s=f,o=Date.now(),this.nthSequenceNumber(e,s)))).next((f=>(r=f,c=Date.now(),this.removeTargets(e,r,t)))).next((f=>(i=f,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((f=>(l=Date.now(),ps()<=fe.DEBUG&&J("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${f} documents in `+(l-u)+`ms
Total Duration: ${l-h}ms`),M.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:f}))))}};function fT(n,e){return new vB(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var tE="firestore.googleapis.com",tm=!0,_c=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new H(V.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=tE,this.ssl=tm}else this.host=e.host,this.ssl=e.ssl??tm;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Zm;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<eE)throw new H(V.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(mm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Xm(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new H(V.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new H(V.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new H(V.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new H(V.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;let i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(let c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}},Qc=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _c({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new H(V.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new H(V.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _c(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new fc;switch(r.type){case"firstParty":return new pB(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new H(V.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){let r=YC.get(t);r&&(J(lT,"Removing Datastore"),YC.delete(t),r.terminate())})(this),Promise.resolve()}};function nE(n,e,t,r={}){n=dn(n,Qc);let s=mr(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&na(`https://${c}`),i.host!==tE&&i.host!==c&&Ht("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let u={...i,host:c,ssl:s,emulatorOptions:r};if(!rn(u,o)&&(n._setSettings(u),r.mockUserToken)){let l,h;if(typeof r.mockUserToken=="string")l=r.mockUserToken,h=tt.MOCK_USER;else{l=vp(r.mockUserToken,n._app?.options.projectId);let f=r.mockUserToken.sub||r.mockUserToken.user_id;if(!f)throw new H(V.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new tt(f)}n._authCredentials=new dB(new dc(l,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rr=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},qe=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Tn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(vo(t,n._jsonSchema))return new n(e,r||null,new te(Te.fromString(t.referencePath)))}};qe._jsonSchemaVersion="firestore/documentReference/1.0",qe._jsonSchema={type:He("string",qe._jsonSchemaVersion),referencePath:He("string")};var Tn=class n extends rr{constructor(e,t,r){super(e,t,Po(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new qe(this.firestore,null,new te(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function Ks(n,e,...t){if(n=Ve(n),Cm("collection","path",e),n instanceof Qc){let r=Te.fromString(e,...t);return PC(r),new Tn(n,null,r)}{if(!(n instanceof qe||n instanceof Tn))throw new H(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Te.fromString(e,...t));return PC(r),new Tn(n.firestore,null,r)}}function zs(n,e,...t){if(n=Ve(n),arguments.length===1&&(e=Is.newId()),Cm("doc","path",e),n instanceof Qc){let r=Te.fromString(e,...t);return RC(r),new qe(n,null,new te(r))}{if(!(n instanceof qe||n instanceof Tn))throw new H(V.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Te.fromString(e,...t));return RC(r),new qe(n.firestore,n instanceof Tn?n.converter:null,new te(r))}}/**
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
 */var kt=class n{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(vo(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new n(e.vectorValues);throw new H(V.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};kt._jsonSchemaVersion="firestore/vectorValue/1.0",kt._jsonSchema={type:He("string",kt._jsonSchemaVersion),vectorValues:He("object")};/**
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
 */var pT=/^__.*__$/,bB=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Pn(e,this.data,this.fieldMask,t,this.fieldTransforms):new qr(e,this.data,t,this.fieldTransforms)}},wc=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Pn(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function rE(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Z(40011,{dataSource:n})}}var SB=class n{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new n({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Dc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(rE(this.dataSource)&&pT.test(e))throw this.createError('Document fields cannot begin and end with "__"')}},RB=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||zc(e)}createContext(e,t,r,s=!1){return new SB({dataSource:e,methodName:t,targetDoc:r,path:Ot.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Hd(n){let e=n._freezeSettings(),t=zc(n._databaseId);return new RB(n._databaseId,!!e.ignoreUndefinedProperties,t)}function sE(n,e,t,r,s,i={}){let o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);qd("Data must be an object, but it was:",o,r);let c=cE(r,o),u,l;if(i.merge)u=new $t(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){let h=[];for(let f of i.mergeFields){let C=ir(e,f,t);if(!o.contains(C))throw new H(V.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);BE(h,C)||h.push(C)}u=new $t(h),l=o.fieldTransforms.filter((f=>u.covers(f.field)))}else u=null,l=o.fieldTransforms;return new bB(new ft(c),u,l)}var yc=class n extends Qr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof n}};var PB=class n extends Qr{_toFieldTransform(e){return new Yl(e.path,new Mr)}isEqual(e){return e instanceof n}};function iE(n,e,t,r){let s=n.createContext(1,e,t);qd("Data must be an object, but it was:",s,r);let i=[],o=ft.empty();ts(r,((u,l)=>{let h=jd(e,u,t);l=Ve(l);let f=s.childContextForFieldPath(h);if(l instanceof yc)i.push(h);else{let C=sr(l,f);C!=null&&(i.push(h),o.set(h,C))}}));let c=new $t(i);return new wc(o,c,s.fieldTransforms)}function oE(n,e,t,r,s,i){let o=n.createContext(1,e,t),c=[ir(e,r,t)],u=[s];if(i.length%2!=0)throw new H(V.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let C=0;C<i.length;C+=2)c.push(ir(e,i[C])),u.push(i[C+1]);let l=[],h=ft.empty();for(let C=c.length-1;C>=0;--C)if(!BE(l,c[C])){let v=c[C],R=u[C];R=Ve(R);let S=o.childContextForFieldPath(v);if(R instanceof yc)l.push(v);else{let G=sr(R,S);G!=null&&(l.push(v),h.set(v,G))}}let f=new $t(l);return new wc(h,f,o.fieldTransforms)}function aE(n,e,t,r=!1){return sr(t,n.createContext(r?4:3,e))}function sr(n,e,t){if(lE(n=Ve(n)))return qd("Unsupported field value:",e,n),cE(n,e);if(n instanceof Qr)return(function(s,i){if(!rE(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);let o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){let o=[],c=0;for(let u of s){let l=sr(u,i.childContextForArray(c));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),c++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=Ve(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Ld(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){let c=Fe.fromDate(s);return{timestampValue:Wi(i.serializer,c)}}if(s instanceof Fe){let c=new Fe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Wi(i.serializer,c)}}if(uE(s)){let c=Fe.fromInstant(s),u=new Fe(c.seconds,1e3*Math.floor(c.nanoseconds/1e3));return{timestampValue:Wi(i.serializer,u)}}if(s instanceof In)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ut)return{bytesValue:Hm(i.serializer,s._byteString)};if(s instanceof qe){let c=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(c))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:Ud(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof kt)return(function(u,l){let h=u instanceof kt?u.toArray():u;return{mapValue:{fields:{[Od]:{stringValue:kd},[Vr]:{arrayValue:{values:h.map((C=>{if(typeof C!="number")throw l.createError("VectorValues must only contain numeric values.");return jc(l.serializer,C)}))}}}}}})(s,i);if(Qm(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Ao(s)}`)})(n,e)}function cE(n,e){let t={};return gm(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ts(n,((r,s)=>{let i=sr(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function uE(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;let e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function lE(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Fe||n instanceof In||n instanceof Ut||n instanceof qe||n instanceof Qr||n instanceof kt||uE(n)||Qm(n))}function qd(n,e,t){if(!lE(t)||!To(t)){let r=Ao(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function ir(n,e,t){if((e=Ve(e))instanceof Wr)return e._internalPath;if(typeof e=="string")return jd(n,e);throw Dc("Field path arguments must be of type string or ",n,!1,void 0,t)}var gT=new RegExp("[~\\*/\\[\\]]");function jd(n,e,t){if(e.search(gT)>=0)throw Dc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Wr(...e.split("."))._internalPath}catch{throw Dc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Dc(n,e,t,r,s){let i=r&&!r.isEmpty(),o=s!==void 0,c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new H(V.INVALID_ARGUMENT,c+n+u)}function BE(n,e){return n.some((t=>t.isEqual(e)))}function hE(n){return typeof n._readUserData=="function"}/**
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
 */var ut=class n{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){let r=ft.empty();for(let s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){let i=this.optionDefinitions[s];if(s in e){let o=e[s],c;i.nestedOptions&&To(o)?c={mapValue:{fields:new n(i.nestedOptions).getOptionsProto(t,o)}}:o&&(c=sr(o,t)??void 0),c&&r.set(Ot.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){let s=this._getKnownOptions(t,e);if(r){let i=new Map(pm(r,((o,c)=>[Ot.fromServerFormat(c),o!==void 0?sr(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}};/**
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
 */function CT(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!To(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(){return new PB("serverTimestamp")}function dE(n){return new kt(n)}/**
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
 */function q(n){let e;return n instanceof On?n:(e=To(n)?ET(n):n instanceof Array?_T(n):fE(n,void 0),e)}function ql(n){if(n instanceof On)return n;if(n instanceof kt)return co(n);if(Array.isArray(n))return co(dE(n));throw new Error("Unsupported value: "+typeof n)}function Jd(n){return _I(n)?ec(n):q(n)}var On=class{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,q(e)],"add")}asBoolean(){if(this instanceof ar)return this;if(this instanceof Ls)return new Tc(this);if(this instanceof or)return new kB(this);if(this instanceof x)return new Ic(this);throw new H("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,q(e)],"subtract")}multiply(e){return new x("multiply",[this,q(e)],"multiply")}divide(e){return new x("divide",[this,q(e)],"divide")}mod(e){return new x("mod",[this,q(e)],"mod")}equal(e){return new x("equal",[this,q(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,q(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,q(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,q(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,q(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,q(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){let r=[e,...t].map((s=>q(s)));return new x("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,q(e)],"arrayContains").asBoolean()}arrayContainsAll(e){let t=Array.isArray(e)?new Fr(e.map(q),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){let t=Array.isArray(e)?new Fr(e.map(q),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){let t=Array.isArray(e)?new Fr(e.map(q),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){let t=Array.isArray(e)?new Fr(e.map(q),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,q(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,q(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,q(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,q(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,q(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,q(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,q(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,q(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){let t=[this];return e&&t.push(q(e)),new x("trim",t,"trim")}ltrim(e){let t=[this];return e&&t.push(q(e)),new x("ltrim",t,"ltrim")}rtrim(e){let t=[this];return e&&t.push(q(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,co(e)],"isType").asBoolean()}stringConcat(e,...t){let r=[e,...t].map(q);return new x("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,q(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,q(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,q(e),q(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,q(e),q(t)],"stringReplaceOne")}concat(e,...t){let r=[e,...t].map(q);return new x("concat",[this,...r],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,q(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,q(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new x("array_transform",[this,q(e),q(t),r],"arrayTransformWithIndex")}arraySlice(e,t){let r=[this,q(e)];return t!==void 0&&r.push(q(t)),new x("array_slice",r,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,q(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,q(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,q(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,q(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,q(e),q("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,q(e),q("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,q(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,co(e)],"mapGet")}mapSet(e,t,...r){let s=[this,q(e),q(t),...r.map(q)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,q(e)],"get_field")}count(){return Rt._create("count",[this],"count")}sum(){return Rt._create("sum",[this],"sum")}average(){return Rt._create("average",[this],"average")}minimum(){return Rt._create("minimum",[this],"minimum")}maximum(){return Rt._create("maximum",[this],"maximum")}first(){return Rt._create("first",[this],"first")}last(){return Rt._create("last",[this],"last")}arrayAgg(){return Rt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Rt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Rt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){let r=[e,...t];return new x("maximum",[this,...r.map(q)],"logicalMaximum")}logicalMinimum(e,...t){let r=[e,...t];return new x("minimum",[this,...r.map(q)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,ql(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,ql(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,ql(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,q(e),q(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,q(e),q(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,Jd(e),q(t)],"timestampDiff")}timestampExtract(e,t){let r=[this,q(e)];return t&&r.push(q(t)),new x("timestamp_extract",r,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){let r=q(e);return new x("substring",t===void 0?[this,r]:[this,r,q(t)],"substring")}arrayGet(e){return new x("array_get",[this,q(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){let t=new x("if_error",[this,q(e)],"ifError");return e instanceof ar?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,q(e)],"mapRemove")}mapMerge(e,...t){let r=q(e),s=t.map(q);return new x("map_merge",[this,r,...s],"mapMerge")}pow(e){return new x("pow",[this,q(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,q(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,q(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,q(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,q(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,q(e),...t.map(q)],"coalesce")}join(e){return new x("join",[this,q(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,q(e)])}timestampTruncate(e,t){let r=[this,q(e)];return t&&r.push(q(t)),new x("timestamp_trunc",r)}ascending(){return wT(this)}descending(){return yT(this)}as(e){return new OB(this,e,"as")}},Rt=class n{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){let s=new n(e,t);return s._methodName=r,s}as(e){return new NB(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}},NB=class{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}},OB=class{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}},Fr=class extends On{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}},or=class extends On{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,q(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}};function ec(n){return mT(n,"field")}function mT(n,e){return new or(typeof n=="string"?cn===n?Ym()._internalPath:ir("field",n):n._internalPath,e)}var Ls=class n extends On{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){let t=new n(e,void 0);return t._protoValue=e,t}_toProto(e){return ee(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,CT(this._protoValue)||(this._protoValue=sr(this.value,e))}};function co(n,e){return fE(n,"constant")}function fE(n,e){let t=new Ls(n,e);return typeof n=="boolean"?new Tc(t):t}var x=class extends On{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new ut({})}_toProto(e){let t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}},ar=class n extends On{get _methodName(){return this._expr._methodName}countIf(){return Rt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){let t=q(e),r=new x("if_error",[this,t],"ifError");return t instanceof n?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}},Ic=class extends ar{constructor(e){super(),this._expr=e,this.expressionType="Function"}},Tc=class extends ar{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}},kB=class extends ar{constructor(e){super(),this._expr=e,this.expressionType="Field"}};function ET(n,e){let t=[];for(let r in n)if(Object.prototype.hasOwnProperty.call(n,r)){let s=n[r];t.push(co(r)),t.push(q(s))}return new x("map",t,"map")}function _T(n){return(function(t,r){return new x("array",t.map((s=>q(s))),r)})(n,"array")}function wT(n){return new Ac(Jd(n),"ascending","ascending")}function yT(n){return new Ac(Jd(n),"descending","descending")}var Ac=class{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:$m(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}};/**
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
 */var pt=class{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}},vc=class extends pt{get _name(){return"add_fields"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[oo(e,this.fields)]}}_readUserData(e){super._readUserData(e),cr(this.fields,e)}};var bc=class extends pt{get _name(){return"aggregate"}get _optionsUtil(){return new ut({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[oo(e,this.accumulators),oo(e,this.groups)]}}_readUserData(e){super._readUserData(e),cr(this.groups,e),cr(this.accumulators,e)}},Sc=class extends pt{get _name(){return"distinct"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[oo(e,this.groups)]}}_readUserData(e){super._readUserData(e),cr(this.groups,e)}},Vs=class extends pt{get _name(){return"collection"}get _optionsUtil(){return new ut({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}},Ms=class extends pt{get _name(){return"collection_group"}get _optionsUtil(){return new ut({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}};var uo=class extends pt{get _name(){return"database"}get _optionsUtil(){return new ut({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}},lo=class extends pt{get _name(){return"documents"}get _optionsUtil(){return new ut({})}constructor(e,t){if(super(t),!e||e.length===0)throw new H(V.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");let r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new H(V.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=r,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}},Gs=class extends pt{get _name(){return"where"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),cr(this.condition,e)}};var kn=class extends pt{get _name(){return"limit"}get _optionsUtil(){return new ut({})}constructor(e,t){ee(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Ld(e,this.limit)]}}},Rc=class extends pt{get _name(){return"offset"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Ld(e,this.offset)]}}},FB=class extends pt{get _name(){return"select"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[oo(e,this.selections)]}}_readUserData(e){super._readUserData(e),cr(this.selections,e)}},Yt=class extends pt{get _name(){return"sort"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),cr(this.orderings,e)}};var xB=class n extends pt{get _name(){return"replace_with"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),$m(n.Ir)]}}_readUserData(e){super._readUserData(e),cr(this.map,e)}};xB.Ir="full_replace";function cr(n,e){return hE(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
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
 */var LB=class n{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Vr(e,t){let r=this.userDataReader.createContext(3,e);return hE(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){let t=this.stages.map((r=>r));return this.Vr("where",e),t.push(new Gs(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){let t=this.stages.map((r=>r));return t.push(new kn(e,{})),new n(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){let r=this.stages.map((s=>s));return"orderings"in e?r.push(new Yt(this.Vr("sort",e.orderings),{})):r.push(new Yt(this.Vr("sort",[e,...t]),{})),new n(this._db,this.userDataReader,this._userDataWriter,r)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}};// Copyright 2024 Google LLC* @license
var rt=class{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return $c(this)}getPipelineCollectionGroup(){return Kd(this)}getPipelineCollectionId(){return DT(this)}getPipelineDocuments(){return VB(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Sc.name&&s._name!==bc.name||(r="keyless"),s._name===FB.name&&r==="exact"&&(r="augmented"),s._name===vc.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return Zn(this)}};function Zn(n){let e=n.stages[0];return e instanceof Vs||e instanceof Ms||e instanceof uo||e instanceof lo?e._name:"unknown"}function $c(n){if(Zn(n)==="collection")return n.stages[0].hr}function Kd(n){if(Zn(n)==="collection_group")return n.stages[0].collectionId}function DT(n){switch(Zn(n)){case"collection":return Te.fromString($c(n)).lastSegment();case"collection_group":return Kd(n);default:return}}function VB(n){if(Zn(n)==="documents")return n.stages[0].Tr}var b=class n{constructor(e,t){this.type=e,this.value=t}static mr(){return new n("ERROR",void 0)}static pr(){return new n("UNSET",void 0)}static gr(){return new n("NULL",bs)}static newValue(e){return Pt(e)?new n("NULL",bs):(function(r){return!!r&&"booleanValue"in r})(e)?new n("BOOLEAN",e):un(e)?new n("INT",e):Or(e)?new n("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new n("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new n("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new n("BYTES",e):e.referenceValue?new n("REFERENCE",e):e.geoPointValue?new n("GEO_POINT",e):Rs(e)?new n("ARRAY",e):eo(e)?new n("VECTOR",e):ws(e)?new n("MAP",e):new n("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}};function $i(n){if(!n.yr())return n.value}function pE(n){return n instanceof ar?n._expr:n}function ie(n){if((n=pE(n))instanceof or)return new MB(n);if(n instanceof Ls)return new GB(n);if(n instanceof Fr)return new UB(n);if(n instanceof x){if(n.name==="add")return new HB(n);if(n.name==="subtract")return new qB(n);if(n.name==="multiply")return new jB(n);if(n.name==="divide")return new JB(n);if(n.name==="mod")return new KB(n);if(n.name==="and")return new zB(n);if(n.name==="equal")return new oh(n);if(n.name==="not_equal")return new ah(n);if(n.name==="less_than")return new ch(n);if(n.name==="less_than_or_equal")return new uh(n);if(n.name==="greater_than")return new lh(n);if(n.name==="greater_than_or_equal")return new Bh(n);if(n.name==="array_concat")return new hh(n);if(n.name==="array_reverse")return new dh(n);if(n.name==="array_contains")return new fh(n);if(n.name==="array_contains_all")return new ph(n);if(n.name==="array_contains_any")return new gh(n);if(n.name==="array_length")return new Ch(n);if(n.name==="array_element")return new mh(n);if(n.name==="equal_any")return new Pc(n);if(n.name==="not_equal_any")return new $B(n);if(n.name==="is_nan")return new YB(n);if(n.name==="is_not_nan")return new XB(n);if(n.name==="is_null")return new ZB(n);if(n.name==="is_not_null")return new eh(n);if(n.name==="is_error")return new th(n);if(n.name==="exists")return new nh(n);if(n.name==="not")return new Us(n);if(n.name==="or")return new WB(n);if(n.name==="xor")return new QB(n);if(n.name==="conditional")return new rh(n);if(n.name==="maximum")return new sh(n);if(n.name==="minimum")return new ih(n);if(n.name==="reverse")return new Eh(n);if(n.name==="replace_first")return new _h(n);if(n.name==="replace_all")return new wh(n);if(n.name==="char_length")return new yh(n);if(n.name==="byte_length")return new Dh(n);if(n.name==="like")return new Ih(n);if(n.name==="regex_contains")return new Th(n);if(n.name==="regex_match")return new Ah(n);if(n.name==="string_contains")return new vh(n);if(n.name==="starts_with")return new bh(n);if(n.name==="ends_with")return new Sh(n);if(n.name==="to_lower")return new Rh(n);if(n.name==="to_upper")return new Ph(n);if(n.name==="trim")return new Nh(n);if(n.name==="string_concat")return new Oh(n);if(n.name==="map_get")return new kh(n);if(n.name==="cosine_distance")return new Fh(n);if(n.name==="dot_product")return new xh(n);if(n.name==="euclidean_distance")return new Lh(n);if(n.name==="vector_length")return new Vh(n);if(n.name==="unix_micros_to_timestamp")return new Mh(n);if(n.name==="timestamp_to_unix_micros")return new Hh(n);if(n.name==="unix_millis_to_timestamp")return new Gh(n);if(n.name==="timestamp_to_unix_millis")return new qh(n);if(n.name==="unix_seconds_to_timestamp")return new Uh(n);if(n.name==="timestamp_to_unix_seconds")return new jh(n);if(n.name==="timestamp_add")return new Jh(n);if(n.name==="timestamp_subtract")return new Kh(n)}throw new Error(`Unknown Expr : ${n}`)}var MB=class{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===cn)return b.newValue({referenceValue:io(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return b.newValue({timestampValue:Za(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return b.newValue({timestampValue:Za(e.serializer,t.createTime)});let r=t.data.field(this.expr._fieldPath);return r?bo(r)?b.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Za(i.serializer,ce.fromTimestamp(As(o)))};if(i.serverTimestampBehavior==="previous"){let c=So(o);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):b.newValue(r):b.pr()}},GB=class{constructor(e){this.expr=e}evaluate(e,t){return b.newValue(this.expr._getValue())}},UB=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.cr.map((s=>ie(s).evaluate(e,t)));return r.some((s=>s.yr()))?b.mr():b.newValue({arrayValue:{values:r.map((s=>s.value))}})}};function st(n){return Or(n)?Number(n.doubleValue):Number(n.integerValue)}function hn(n){return BigInt(n.integerValue)}var IT=BigInt("0x7fffffffffffffff"),TT=-BigInt("0x8000000000000000"),$r=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length>=2,24778);let r=ie(this.expr.params[0]).evaluate(e,t),s=ie(this.expr.params[1]).evaluate(e,t),i=this.br(r,s);for(let o of this.expr.params.slice(2)){let c=ie(o).evaluate(e,t);i=this.br(i,c)}return i}br(e,t){if(e.yr()||t.yr())return b.mr();if(e.wr()||t.wr())return b.gr();let r=e.value,s=t.value;if(!Or(r)&&!un(r)||!Or(s)&&!un(s))return b.mr();if(Or(r)||Or(s)){let i=this.Sr(r,s);return i?b.newValue(i):b.mr()}if(un(r)&&un(s)){let i=this.vr(r,s);return i===void 0?b.mr():typeof i=="number"?b.newValue({doubleValue:i}):i<TT||i>IT?b.mr():b.newValue({integerValue:`${i}`})}return b.mr()}};function Fn(n,e){return Je(n)!==Je(e)?"TYPE_MISMATCH":Dt(n)||Dt(e)?"NOT_EQ":Pt(n)&&Pt(e)?"EQ":Pt(n)||Pt(e)?"NULL":Rs(n)&&Rs(e)?(function(r,s){if(r.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let o=0;o<(r.values?.length??0);o++){let c=r.values[o],u=s.values[o];switch(Fn(c,u)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:Z(44609,{Dr:c,Cr:u})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):eo(n)&&eo(e)||ws(n)&&ws(e)?(function(r,s){let i=r.fields||{},o=s.fields||{};if(rc(i)!==rc(o))return"NOT_EQ";let c=!1;for(let u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(Fn(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return qt(r,s,{u:!1,i:!0,o:!0})})(n,e)?"EQ":"NOT_EQ"}var HB=class extends $r{vr(e,t){return hn(e)+hn(t)}Sr(e,t){return{doubleValue:st(e)+st(t)}}},qB=class extends $r{constructor(e){super(e),this.expr=e}vr(e,t){return hn(e)-hn(t)}Sr(e,t){return{doubleValue:st(e)-st(t)}}},jB=class extends $r{constructor(e){super(e),this.expr=e}vr(e,t){return hn(e)*hn(t)}Sr(e,t){return{doubleValue:st(e)*st(t)}}},JB=class extends $r{constructor(e){super(e),this.expr=e}vr(e,t){let r=hn(t);if(r!==BigInt(0))return hn(e)/r}Sr(e,t){let r=st(t);return r===0?{doubleValue:vs(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:st(e)/r}}},KB=class extends $r{constructor(e){super(e),this.expr=e}vr(e,t){let r=hn(t);if(r!==BigInt(0))return hn(e)%r}Sr(e,t){let r=st(t);if(r!==0)return{doubleValue:st(e)%r}}},zB=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ie(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!o.value?.booleanValue)return b.newValue(nt);break;case"NULL":s=!0;break;default:r=!0}}return r?b.mr():s?b.gr():b.newValue(wt)}},Us=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,9634);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return b.newValue({booleanValue:!r.value?.booleanValue});case"NULL":return b.gr();default:return b.mr()}}},WB=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ie(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(o.value?.booleanValue)return b.newValue(wt);break;case"NULL":s=!0;break;default:r=!0}}return r?b.mr():s?b.gr():b.newValue(nt)}},QB=class n{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=ie(i).evaluate(e,t);switch(o.type){case"BOOLEAN":r=n.xor(r,!!o.value?.booleanValue);break;case"NULL":s=!0;break;default:return b.mr()}}return s?b.gr():b.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}},Pc=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,55094);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.mr()}if(r)return b.gr();for(let o of i.value?.arrayValue?.values??[])switch(Pt(s.value)&&Pt(o)?"EQ":Fn(s.value,o)){case"EQ":return b.newValue(wt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(44608,{value:s.value,candidate:o})}return r?b.gr():b.newValue(nt)}},$B=class{constructor(e){this.expr=e}evaluate(e,t){return new Us(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}},YB=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,23322);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return b.newValue(nt);case"DOUBLE":return b.newValue({booleanValue:isNaN(st(r.value))});case"NULL":return b.gr();default:return b.mr()}}},XB=class{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,50406),new Us(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}},ZB=class{constructor(e){this.expr=e}evaluate(e,t){switch(ee(this.expr.params.length===1,23123),ie(this.expr.params[0]).evaluate(e,t).type){case"NULL":return b.newValue(wt);case"UNSET":case"ERROR":return b.mr();default:return b.newValue(nt)}}},eh=class{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,23167),new Us(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}},th=class{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,5228),ie(this.expr.params[0]).evaluate(e,t).type==="ERROR"?b.newValue(wt):b.newValue(nt)}},nh=class{constructor(e){this.expr=e}evaluate(e,t){switch(ee(this.expr.params.length===1,6877),ie(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return b.mr();case"UNSET":return b.newValue(nt);default:return b.newValue(wt)}}},rh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===3,11706);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return r.value?.booleanValue?ie(this.expr.params[1]).evaluate(e,t):ie(this.expr.params[2]).evaluate(e,t);case"NULL":return ie(this.expr.params[2]).evaluate(e,t);default:return b.mr()}}},sh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ie(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||yt(i.value,s.value)>0?i:s}return s===void 0?b.gr():s}},ih=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>ie(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||yt(i.value,s.value)<0?i:s}return s===void 0?b.gr():s}},ur=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return b.mr()}let s=ie(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return b.mr()}return this.Fr(r,s)}},oh=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return b.newValue(wt);if(e.wr()||t.wr()||Dt(e.value)||Dt(t.value)||Je(e.value)!==Je(t.value))return b.newValue(nt);switch(Fn(e.value,t.value)){case"EQ":return b.newValue(wt);case"NOT_EQ":return b.newValue(nt);case"NULL":return b.gr();default:Z(44615,{left:e,right:t})}}},ah=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){switch(Fn(e.value,t.value)){case"EQ":return b.newValue(nt);case"NOT_EQ":case"TYPE_MISMATCH":return b.newValue(wt);case"NULL":return b.gr();default:Z(44614,{left:e,right:t})}}},ch=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Dt(e.value)||Dt(t.value)?b.newValue(nt):b.newValue({booleanValue:yt(e.value,t.value)<0})}},uh=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Dt(e.value)||Dt(t.value)?b.newValue(nt):Fn(e.value,t.value)==="EQ"?b.newValue(wt):b.newValue({booleanValue:yt(e.value,t.value)<0})}},lh=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Dt(e.value)||Dt(t.value)?b.newValue(nt):b.newValue({booleanValue:yt(e.value,t.value)>0})}},Bh=class extends ur{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Dt(e.value)||Dt(t.value)?b.newValue(nt):Fn(e.value,t.value)==="EQ"?b.newValue(wt):b.newValue({booleanValue:yt(e.value,t.value)>0})}},hh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},dh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,216);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.gr();case"ARRAY":{let s=r.value.arrayValue?.values??[];return b.newValue({arrayValue:{values:[...s].reverse()}})}default:return b.mr()}}},fh=class{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===2,52884),new Pc(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}},ph=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,1392);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.mr()}if(r)return b.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of o){let l=!1;r=!1;for(let h of c){switch(Pt(u)&&Pt(h)?"EQ":Fn(u,h)){case"EQ":l=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(44613,{value:h,search:u})}if(l)break}if(!l)return b.newValue(nt)}return b.newValue(wt)}},gh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,2680);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.mr()}if(r)return b.gr();let o=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(let u of c)for(let l of o)switch(Pt(u)&&Pt(l)?"EQ":Fn(u,l)){case"EQ":return b.newValue(wt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Z(60403,{value:u,search:l})}return r?b.gr():b.newValue(nt)}},Ch=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,38605);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.gr();case"ARRAY":return b.newValue({integerValue:`${r.value?.arrayValue?.values?.length??0}`});default:return b.mr()}}},mh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},Eh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,1508);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.gr();case"BYTES":{let s=r.value?.bytesValue;if(typeof s=="string"){let i=je.fromBase64String(s).toUint8Array();return i.reverse(),b.newValue({bytesValue:je.fromUint8Array(i).toBase64()})}return b.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{let s=r.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),o=Array.from(i,(c=>c.segment)).reverse();return b.newValue({stringValue:o.join("")})}default:return b.mr()}}},_h=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},wh=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},yh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,19400);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.gr();case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){let h=o.codePointAt(u+1);h!==void 0&&h>=56320&&h<=57343?(c+=1,u++):c+=1}else c+=1;else c+=1;else{if(!(l<=1114111))return;c+=1,u++}}return c})(r.value.stringValue);return s===void 0?b.mr():b.newValue({integerValue:s})}default:return b.mr()}}},Dh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,8486);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{let s=r.value?.bytesValue;return typeof s=="string"?b.newValue({integerValue:je.fromBase64String(s).toUint8Array().length}):b.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{let s=(function(o){let c=0;for(let u=0;u<o.length;u++){let l=o.codePointAt(u);if(l===void 0)return;if(l>=55296&&l<=57343){if(!(l<=56319))return;{let h=o.codePointAt(u+1);if(h===void 0||!(h>=56320&&h<=57343))return;c+=4,u++}}else if(l<=127)c+=1;else if(l<=2047)c+=2;else if(l<=65535)c+=3;else{if(!(l<=1114111))return;c+=4,u++}}return c})(r.value?.stringValue);return s===void 0?b.mr():b.newValue({integerValue:s})}case"NULL":return b.gr();default:return b.mr()}}},lr=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return b.mr()}return r?b.gr():this.Or(s.value?.stringValue,i.value?.stringValue)}},Ih=class extends lr{Or(e,t){try{let r=(function(o){let c="";for(let u=0;u<o.length;u++){let l=o.charAt(u);switch(l){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+l;break;default:c+=l}}return"^"+c+"$"})(t),s=Ka.compile(r);return b.newValue({booleanValue:s.matches(e)})}catch(r){return Ht(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),b.mr()}}},Th=class extends lr{Or(e,t){try{let r=Ka.compile(t);return b.newValue({booleanValue:r.test(e)})}catch{return Ht(`Invalid regex pattern found in regex_contains: ${t}, returning error`),b.mr()}}},Ah=class extends lr{Or(e,t){try{return b.newValue({booleanValue:Ka.compile(t).matches(e)})}catch{return Ht(`Invalid regex pattern found in regex_match: ${t}, returning error`),b.mr()}}},vh=class extends lr{Or(e,t){return b.newValue({booleanValue:e.includes(t)})}},bh=class extends lr{Or(e,t){return b.newValue({booleanValue:e.startsWith(t)})}},Sh=class extends lr{Or(e,t){return b.newValue({booleanValue:e.endsWith(t)})}},Rh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,29079);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.toLowerCase()});case"NULL":return b.gr();default:return b.mr()}}},Ph=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,60487);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.toUpperCase()});case"NULL":return b.gr();default:return b.mr()}}},Nh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,28544);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.trim()});case"NULL":return b.gr();default:return b.mr()}}},Oh=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((o=>ie(o).evaluate(e,t))),s="",i=!1;for(let o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return b.mr()}return i?b.gr():b.newValue({stringValue:s})}},kh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,4483);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return b.pr();case"MAP":break;default:return b.mr()}let s=ie(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return b.mr();let i=r.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?b.pr():b.newValue(i)}},Bo=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return b.mr()}if(r)return b.gr();let o=$l(s.value),c=$l(i.value);if(o===void 0||c===void 0||o.values?.length!==c.values?.length)return b.mr();let u=this.Mr(o,c);return u===void 0||isNaN(u)?b.mr():b.newValue({doubleValue:u})}},Fh=class extends Bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return;let i=0,o=0,c=0;for(let l=0;l<r.length;l++){if(!nr(r[l])||!nr(s[l]))return;let h=st(r[l]),f=st(s[l]);i+=h*f,o+=h*h,c+=f*f}let u=Math.sqrt(o)*Math.sqrt(c);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}},xh=class extends Bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!nr(r[o])||!nr(s[o]))return;i+=st(r[o])*st(s[o])}return i}},Lh=class extends Bo{Mr(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!nr(r[o])||!nr(s[o]))return;let c=st(r[o]),u=st(s[o]);i+=Math.pow(c-u,2)}return Math.sqrt(i)}},Vh=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,39044);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{let s=$l(r.value);return b.newValue({integerValue:s?.values?.length??0})}case"NULL":return b.gr();default:return b.mr()}}},ho=BigInt(-62135596800),fo=BigInt(253402300799),Nc=BigInt(1e3),er=BigInt(1e6),AT=ho*Nc,vT=fo*Nc+BigInt(999),bT=ho*er,ST=fo*er+BigInt(999999);function zd(n){return n>=bT&&n<=ST}function gE(n){return n>=ho&&n<=fo}function po(n,e){let t=BigInt(n);return!(t<ho||t>fo)&&!(e<0||e>=1e9)&&(t!==ho||e===0)&&!(t===fo&&e>999999999)}function CE(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function Wd(n){return BigInt(n.seconds)*er+BigInt(Math.trunc(n.nanoseconds/1e3))}var go=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return b.gr();default:return b.mr()}}},Mh=class extends go{toTimestamp(e){if(!zd(e))return b.mr();let t=Number(e/er),r=Number(e%er*BigInt(1e3)),s=CE(t,r);return t=s.seconds,r=s.nanos,po(t,r)?b.newValue({timestampValue:{seconds:t,nanos:r}}):b.mr()}},Gh=class extends go{toTimestamp(e){if(!(function(o){return o>=AT&&o<=vT})(e))return b.mr();let t=Number(e/Nc),r=Number(e%Nc*BigInt(1e6)),s=CE(t,r);return t=s.seconds,r=s.nanos,po(t,r)?b.newValue({timestampValue:{seconds:t,nanos:r}}):b.mr()}},Uh=class extends go{toTimestamp(e){if(!gE(e))return b.mr();let t=Number(e);return b.newValue({timestampValue:{seconds:t,nanos:0}})}},Co=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);let r=ie(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return b.gr();default:return b.mr()}let s=Gd(r.value.timestampValue);return po(s.seconds,s.nanoseconds)?this.Nr(s):b.mr()}},Hh=class extends Co{Nr(e){let t=Wd(e);return zd(t)?b.newValue({integerValue:`${t.toString()}`}):b.mr()}},qh=class extends Co{Nr(e){let t=Wd(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?b.newValue({integerValue:r.toString()}):b.newValue({integerValue:(r-BigInt(1)).toString()})}},jh=class extends Co{Nr(e){let t=BigInt(e.seconds);return gE(t)?b.newValue({integerValue:t.toString()}):b.mr()}},Oc=class{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1,s=ie(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return b.mr()}let i=ie(this.expr.params[1]).evaluate(e,t),o;switch(i.type){case"STRING":if(o=(function(ae){switch(ae){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return b.mr();break;case"NULL":r=!0;break;default:return b.mr()}let c=ie(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return b.mr()}if(r)return b.gr();let u=BigInt(c.value.integerValue),l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return b.mr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Lr(o)))return b.mr()}catch(U){return Ht(`Error during timestamp arithmetic: ${U}`),b.mr()}let h=Gd(s.value.timestampValue);if(!po(h.seconds,h.nanoseconds))return b.mr();let f=Wd(h),C=this.Br(f,l);if(!zd(C))return b.mr();let v=Number(C/er),R=C%er,S=Number((R<0?R+er:R)*BigInt(1e3)),G=R<0?v-1:v;return po(G,S)?b.newValue({timestampValue:{seconds:G,nanos:S}}):b.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}},Jh=class extends Oc{Br(e,t){return e+t}},Kh=class extends Oc{Br(e,t){return e-t}};/**
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
 */function mo(n){if((n=pE(n))instanceof or)return`fld(${n.fieldName})`;if(n instanceof Ls)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof qe?`ref(${t.path})`:t instanceof kt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof x)return`fn(${n.name},[${n.params.map(mo).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.cr.map(mo).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function RT(n){if(n instanceof vc)return`${n._name}(${$a(n.fields)})`;if(n instanceof bc){let e=`${n._name}(${$a(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${$a(n.groups)})`),e}if(n instanceof Sc)return`${n._name}(${$a(n.groups)})`;if(n instanceof Vs)return`${n._name}(${n.hr})`;if(n instanceof Ms)return`${n._name}(${n.collectionId})`;if(n instanceof uo)return`${n._name}()`;if(n instanceof lo)return`${n._name}(${n.Tr.sort()})`;if(n instanceof Gs)return`${n._name}(${mo(n.condition)})`;if(n instanceof kn)return`${n._name}(${n.limit})`;if(n instanceof Yt)return`${n._name}(${(function(t){return t.map((r=>`${mo(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function $a(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${mo(t)}`)).join(",")}`}function An(n){return n.stages.map((e=>RT(e))).join("|")}function mE(n,e){return An(n)===An(e)}function We(n){return n instanceof rt}function nm(n){return We(n)?An(n):Ki(n)}function EE(n){return We(n)?An(n):(function(t){return`${xm(Bn(t))}|lt:${t.limitType}`})(n)}function Yc(n,e){return n instanceof rt&&e instanceof rt?mE(n,e):!(n instanceof rt&&!(e instanceof rt)||!(n instanceof rt)&&e instanceof rt)&&kI(n,e)}function _E(n){return Nr(n)?An(n):xm(n)}function wE(n,e){return n instanceof rt&&e instanceof rt?mE(n,e):!(n instanceof rt&&!(e instanceof rt)||!(n instanceof rt)&&e instanceof rt)&&Lm(n,e)}function PT(n,e){let t=(function(s){let i=!1,o=[];for(let c of s)if(c instanceof Yt)if(i=!0,c.orderings.some((u=>u.expr instanceof or&&u.expr.fieldName===cn)))o.push(c);else{let u=c.orderings.map((l=>l));u.push(ec(cn).ascending()),o.push(new Yt(u,{}))}else c instanceof kn&&(i||(o.push(new Yt([ec(cn).ascending()],{})),i=!0)),o.push(c);return i||o.push(new Yt([ec(cn).ascending()],{})),o})(n.stages);if(n.userDataReader){let r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new rt(n.userDataReader.serializer,t,e)}/**
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
 */var zh=class{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){let i=this.mutations[s];i.key.isEqual(e.key)&&TI(i,e,r[s])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=Ji(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=Ji(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=Um();return this.mutations.forEach((s=>{let i=e.get(s.key),o=i.overlayedDocument,c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;let u=Sm(o,c);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(ce.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),me())}isEqual(e){return this.batchId===e.batchId&&Ts(this.mutations,e.mutations,((t,r)=>LC(t,r)))&&Ts(this.baseMutations,e.baseMutations,((t,r)=>LC(t,r)))}};/**
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
 */var yE="";function NT(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=rm(e)),e=OT(n.get(t),e);return rm(e)}function OT(n,e){let t=e,r=n.length;for(let s=0;s<r;s++){let i=n.charAt(s);switch(i){case"\0":t+="";break;case yE:t+="";break;default:t+=i}}return t}function rm(n){return n+yE+""}/**
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
 */var kT="remoteDocuments",DE="owner";var IE="mutationQueues";var TE="mutations";/**
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
 */var AE="documentMutations",FT="remoteDocumentsV14";var vE="remoteDocumentGlobal";var bE="targets";var SE="targetDocuments";var RE="targetGlobal",PE="collectionParents";var NE="clientMetadata";var OE="bundles";var kE="namedQueries";var xT="indexConfiguration";var LT="indexState";var VT="indexEntries";var FE="documentOverlays";var MT="globals";var GT=[IE,TE,AE,kT,bE,DE,RE,SE,NE,vE,PE,OE,kE],fS=[...GT,FE],UT=[IE,TE,AE,FT,bE,DE,RE,SE,NE,vE,PE,OE,kE,FE],HT=UT,qT=[...HT,xT,LT,VT];var pS=[...qT,MT];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Wh=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */var Hs=class n{constructor(e,t,r,s,i=ce.min(),o=ce.min(),c=je.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new n(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};/**
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
 */var Qh=class{constructor(e){this.$r=e}};function jT(n){let e=eT({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?uc(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var kc=class{constructor(){}ei(e,t){this.ti(e,t),t.ni()}ti(e,t){if("nullValue"in e)this.ri(t,5);else if("booleanValue"in e)this.ri(t,10),t.ii(e.booleanValue?1:0);else if("integerValue"in e)this.ri(t,15),t.ii(Se(e.integerValue));else if("doubleValue"in e){let r=Se(e.doubleValue);isNaN(r)?this.ri(t,13):(this.ri(t,15),vs(r)?t.ii(0):t.ii(r))}else if("timestampValue"in e){let r=e.timestampValue;this.ri(t,20),typeof r=="string"&&(r=Sn(r)),t.si(`${r.seconds||""}`),t.ii(r.nanos||0)}else if("stringValue"in e)this._i(e.stringValue,t),this.oi(t);else if("bytesValue"in e)this.ri(t,30),t.ai(Rn(e.bytesValue)),this.oi(t);else if("referenceValue"in e)this.ui(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.ri(t,45),t.ii(r.latitude||0),t.ii(r.longitude||0)}else"mapValue"in e?Tm(e)?this.ri(t,Number.MAX_SAFE_INTEGER):eo(e)?this.ci(e.mapValue,t):(this.li(e.mapValue,t),this.oi(t)):"arrayValue"in e?(this.Ei(e.arrayValue,t),this.oi(t)):Z(19022,{hi:e})}_i(e,t){this.ri(t,25),this.Ti(e,t)}Ti(e,t){t.si(e)}li(e,t){let r=e.fields||{};this.ri(t,55);for(let s of Object.keys(r))this._i(s,t),this.ti(r[s],t)}ci(e,t){let r=e.fields||{};this.ri(t,53);let s=Vr,i=r[s].arrayValue?.values?.length||0;this.ri(t,15),t.ii(Se(i)),this._i(s,t),this.ti(r[s],t)}Ei(e,t){let r=e.values||[];this.ri(t,50);for(let s of r)this.ti(s,t)}ui(e,t){this.ri(t,37),te.fromName(e).path.forEach((r=>{this.ri(t,60),this.Ti(r,t)}))}ri(e,t){e.ii(t)}oi(e){e.ii(2)}};kc.Pi=new kc;/**
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
 */var $h=class{constructor(){this.Zi=new Yh}addToCollectionParentIndex(e,t){return this.Zi.add(t),M.resolve()}getCollectionParents(e,t){return M.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return M.resolve()}deleteFieldIndex(e,t){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,t){return M.resolve()}getDocumentsMatchingTarget(e,t){return M.resolve(null)}getIndexType(e,t){return M.resolve(0)}getFieldIndexes(e,t){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,t){return M.resolve(Kr.min())}getMinOffsetFromCollectionGroup(e,t){return M.resolve(Kr.min())}updateCollectionGroup(e,t,r){return M.resolve()}updateIndexEntries(e,t){return M.resolve()}},Yh=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Qe(Te.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Qe(Te.comparator)).toArray()}};/**
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
 */var gS=new Uint8Array(0);/**
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
 */var Yr=class n{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new n(0)}static bs(){return new n(-1)}};/**
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
function xE(n,e){let t=e;for(let r of n.stages)t=KT({serializer:n.serializer,serverTimestampBehavior:n.listenOptions?.serverTimestampBehavior},r,t);return t}function Xc(n,e){return xE(n,[e]).length>0}function JT(n,e){return We(n)?Xc(n,e):Kc(n,e)}function KT(n,e,t){if(e instanceof Vs)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof Gs)return(function(s,i,o){return o.filter((c=>{let u=$i(ie(i.condition).evaluate(s,c));return u!==void 0&&qt(u,wt)}))})(n,e,t);if(e instanceof Ms)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof uo)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof lo)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&i.Pr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof kn)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof Yt)return(function(s,i,o){let c=i.orderings.map((u=>({Ms:ie(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(let{Ms:h,direction:f}of c){let C=$i(h.evaluate(s,u)),v=$i(h.evaluate(s,l)),R=yt(C??bs,v??bs);if(R!==0)return f==="ascending"?R:-R}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Xh(n){let e=(function(r){for(let s=r.stages.length-1;s>=0;s--){let i=r.stages[s];if(i instanceof Yt)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(let s of e){let i=$i(ie(s.expr).evaluate({serializer:n.serializer},t)),o=$i(ie(s.expr).evaluate({serializer:n.serializer},r)),c=yt(i||bs,o||bs);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function jl(n){for(let e=n.stages.length-1;e>=0;e--){let t=n.stages[e];if(t instanceof kn)return{limit:t.limit}}}/**
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
 */var Zh=class{constructor(){this.changes=new Nn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ft.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?M.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};/**
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
 */var ed=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};/**
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
 */var td=class{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Ji(r.mutation,s,$t.empty(),Fe.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,me()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=me()){let s=Xn();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=Cs();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){let r=Xn();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,me())))}populateOverlays(e,t,r){let s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,r,s){let i=Nt(),o=zi(),c=(function(){return zi()})();return t.forEach(((u,l)=>{let h=r.get(l.key);s.has(l.key)&&(h===void 0||h.mutation instanceof Pn)?i=i.insert(l.key,l):h!==void 0?(o.set(l.key,h.mutation.getFieldMask()),Ji(h.mutation,l,h.mutation.getFieldMask(),Fe.now())):o.set(l.key,$t.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,h)=>o.set(l,h))),t.forEach(((l,h)=>c.set(l,new ed(h,o.get(l)??null)))),c)))}recalculateAndSaveOverlays(e,t){let r=zi(),s=new xe(((o,c)=>o-c)),i=me();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(let c of o)c.keys().forEach((u=>{let l=t.get(u);if(l===null)return;let h=r.get(u)||$t.empty();h=c.applyToLocalView(l,h),r.set(u,h);let f=(s.get(c.batchId)||me()).add(u);s=s.insert(c.batchId,f)}))})).next((()=>{let o=[],c=s.getReverseIterator();for(;c.hasNext();){let u=c.getNext(),l=u.key,h=u.value,f=Um();h.forEach((C=>{if(!i.has(C)){let v=Sm(t.get(C),r.get(C));v!==null&&f.set(C,v),i=i.add(C)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,f))}return M.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return We(t)?this.getDocumentsMatchingPipeline(e,t,r,s):NI(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Vd(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{let o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):M.resolve(Xn()),c=no,u=i;return o.next((l=>M.forEach(l,((h,f)=>(c<f.largestBatchId&&(c=f.largestBatchId),i.get(h)?M.resolve():this.remoteDocumentCache.getEntry(e,h).next((C=>{u=u.insert(h,C)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,me()))).next((h=>({batchId:c,changes:VI(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new te(t)).next((r=>{let s=Cs();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){let i=t.collectionGroup,o=Cs();return this.indexManager.getCollectionParents(e,i).next((c=>M.forEach(c,(u=>{let l=(function(f,C){return new zr(C,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,r,s).next((h=>{h.forEach(((f,C)=>{o=o.insert(f,C)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>Kc(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(Zn(t)==="collection_group"){let i=Kd(t),o=Cs();return this.indexManager.getCollectionParents(e,i).next((c=>M.forEach(c,(u=>{let l=(function(f,C){let v=f.stages.map((R=>R instanceof Ms?new Vs(C.canonicalString(),{}):R));return new rt(f.serializer,v)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,r,s).next((h=>{h.forEach(((f,C)=>{o=o.insert(f,C)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,Zn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=me();for(let u of VB(t))c=c.add(te.fromPath(u));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new H("invalid-argument",`Invalid pipeline source to execute offline: ${An(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>Xc(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{let c=o.getKey();t.get(c)===null&&(t=t.insert(c,Ft.newInvalidDocument(c)))}));let s=Cs();return t.forEach(((i,o)=>{let c=e.get(i);c!==void 0&&Ji(c.mutation,o,$t.empty(),Fe.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch(Zn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Te.fromString($c(t)),r);case"collection_group":throw new H("invalid-argument",`Unexpected collection group pipeline: ${An(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,VB(t).map((s=>te.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new H("invalid-argument",`Failed to get overlays for pipeline: ${An(t)}`)}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nd=class{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return M.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Dn(s.createTime)}})(t)),M.resolve()}getNamedQuery(e,t){return M.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:jT(s.bundledQuery),readTime:Dn(s.readTime)}})(t)),M.resolve()}};/**
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
 */var rd=class{constructor(){this.overlays=new xe(te.comparator),this.Gs=new Map}getOverlay(e,t){return M.resolve(this.overlays.get(t))}getOverlays(e,t){let r=Xn();return M.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){let r=Xn();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),M.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Zr(e,t,i)})),M.resolve()}removeOverlaysForBatchId(e,t,r){let s=this.Gs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(r)),M.resolve()}getOverlaysForCollection(e,t,r){let s=Xn(),i=t.length+1,o=new te(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){let u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return M.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new xe(((l,h)=>l-h)),o=this.overlays.getIterator();for(;o.hasNext();){let l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let h=i.get(l.largestBatchId);h===null&&(h=Xn(),i=i.insert(l.largestBatchId,h)),h.set(l.getKey(),l)}}let c=Xn(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,h)=>c.set(l,h))),!(c.size()>=s)););return M.resolve(c)}Zr(e,t,r){let s=this.overlays.get(r.key);if(s!==null){let o=this.Gs.get(s.largestBatchId).delete(r.key);this.Gs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new Wh(t,r));let i=this.Gs.get(t);i===void 0&&(i=me(),this.Gs.set(t,i)),this.Gs.set(t,i.add(r.key))}};/**
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
 */var sd=class{constructor(){this.sessionToken=je.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,M.resolve()}};/**
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
 */var Eo=class{constructor(){this.zs=new Qe(Ue.js),this.Hs=new Qe(Ue.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){let r=new Ue(e,t);this.zs=this.zs.add(r),this.Hs=this.Hs.add(r)}Ys(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Zs(new Ue(e,t))}Xs(e,t){e.forEach((r=>this.removeReference(r,t)))}e_(e){let t=new te(new Te([])),r=new Ue(t,e),s=new Ue(t,e+1),i=[];return this.Hs.forEachInRange([r,s],(o=>{this.Zs(o),i.push(o.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){let t=new te(new Te([])),r=new Ue(t,e),s=new Ue(t,e+1),i=me();return this.Hs.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){let t=new Ue(e,0),r=this.zs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},Ue=class{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return te.comparator(e.key,t.key)||ge(e.r_,t.r_)}static Js(e,t){return ge(e.r_,t.r_)||te.comparator(e.key,t.key)}};/**
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
 */var id=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new Qe(Ue.js)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){let i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let o=new zh(i,t,r,s);this.mutationQueue.push(o);for(let c of s)this.i_=this.i_.add(new Ue(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return M.resolve(o)}lookupMutationBatch(e,t){return M.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,s=this.__(r),i=s<0?0:s;return M.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?mI:this.Gr-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new Ue(t,0),s=new Ue(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([r,s],(o=>{let c=this.s_(o.r_);i.push(c)})),M.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Qe(ge);return t.forEach((s=>{let i=new Ue(s,0),o=new Ue(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,o],(c=>{r=r.add(c.r_)}))})),M.resolve(this.o_(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,s=r.length+1,i=r;te.isDocumentKey(i)||(i=i.child(""));let o=new Ue(new te(i),0),c=new Qe(ge);return this.i_.forEachWhile((u=>{let l=u.key.path;return!!r.isPrefixOf(l)&&(l.length===s&&(c=c.add(u.r_)),!0)}),o),M.resolve(this.o_(c))}o_(e){let t=[];return e.forEach((r=>{let s=this.s_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){ee(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.i_;return M.forEach(t.mutations,(s=>{let i=new Ue(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=r}))}Hr(e){}containsKey(e,t){let r=new Ue(t,0),s=this.i_.firstAfterOrEqual(r);return M.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){let t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};/**
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
 */var od=class{constructor(e){this.u_=e,this.docs=(function(){return new xe(te.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.u_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return M.resolve(r?r.document.mutableCopy():Ft.newInvalidDocument(t))}getEntries(e,t){let r=Nt();return t.forEach((s=>{let i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ft.newInvalidDocument(s))})),M.resolve(r)}getAllEntries(e){let t=Nt();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),M.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;We(t)?(i=Te.fromString($c(t)),o=h=>Xc(t,h)):(i=t.path,o=h=>Kc(t,h));let c=Nt(),u=new te(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){let{key:h,value:{document:f}}=l.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||RI(SI(f),r)<=0||(s.has(f.key)||o(f))&&(c=c.insert(f.key,f.mutableCopy()))}return M.resolve(c)}getAllFromCollectionGroup(e,t,r,s){Z(9500)}c_(e,t){return M.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new ad(this)}getSize(e){return M.resolve(this.size)}},ad=class extends Zh{constructor(e){super(),this.$s=e}applyChanges(e){let t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(r)})),M.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}};/**
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
 */var cd=class{constructor(e){this.persistence=e,this.l_=new Nn((t=>_E(t)),wE),this.lastRemoteSnapshotVersion=ce.min(),this.highestTargetId=0,this.E_=0,this.h_=new Eo,this.targetCount=0,this.T_=Yr.ws()}forEachTarget(e,t){return this.l_.forEach(((r,s)=>t(s))),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.E_&&(this.E_=t),M.resolve()}Ds(e){this.l_.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.T_=new Yr(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,M.resolve()}updateTargetData(e,t){return this.Ds(t),M.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,t,r){let s=0,i=[];return this.l_.forEach(((o,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.l_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),M.waitFor(i).next((()=>s))}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,t){let r=this.l_.get(t)||null;return M.resolve(r)}addMatchingKeys(e,t,r){return this.h_.Ys(t,r),M.resolve()}removeMatchingKeys(e,t,r){this.h_.Xs(t,r);let s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),M.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),M.resolve()}getMatchingKeysForTargetId(e,t){let r=this.h_.n_(t);return M.resolve(r)}containsKey(e,t){return M.resolve(this.h_.containsKey(t))}};/**
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
 */var Fc=class{constructor(e,t){this.P_={},this.overlays={},this.I_=new xs(0),this.R_=!1,this.R_=!0,this.A_=new sd,this.referenceDelegate=e(this),this.V_=new cd(this),this.indexManager=new $h,this.remoteDocumentCache=(function(s){return new od(s)})((r=>this.referenceDelegate.d_(r))),this.serializer=new Qh(t),this.f_=new nd(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new rd,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.P_[e.toKey()];return r||(r=new id(t,this.referenceDelegate),this.P_[e.toKey()]=r),r}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,r){J("MemoryPersistence","Starting transaction:",e);let s=new ud(this.I_.next());return this.referenceDelegate.m_(),r(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return M.or(Object.values(this.P_).map((r=>()=>r.containsKey(e,t))))}},ud=class extends IB{constructor(e){super(),this.currentSequenceNumber=e}},ld=class n{constructor(e){this.persistence=e,this.y_=new Eo,this.w_=null}static b_(e){return new n(e)}get S_(){if(this.w_)return this.w_;throw Z(60996)}addReference(e,t,r){return this.y_.addReference(r,t),this.S_.delete(r.toString()),M.resolve()}removeReference(e,t,r){return this.y_.removeReference(r,t),this.S_.add(r.toString()),M.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),M.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.S_,(r=>{let s=te.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,ce.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return M.or([()=>M.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}},xc=class n{constructor(e,t){this.persistence=e,this.D_=new Nn((r=>NT(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=fT(this,t)}static b_(e,t){return new n(e,t)}m_(){}p_(e){return M.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){let t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Cs(e){let t=0;return this.sr(e,(r=>{t++})).next((()=>t))}sr(e,t){return M.forEach(this.D_,((r,s)=>this.Os(e,r,s).next((i=>i?M.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0,s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(o=>this.Os(e,o,t).next((c=>{c||(r++,i.removeEntry(o,ce.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),M.resolve()}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),M.resolve()}removeReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),M.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),M.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ya(e.data.value)),t}Os(e,t,r){return M.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let s=this.D_.get(t);return M.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Bd=class n{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Vo=r,this.fo=s}static mo(e,t){let r=me(),s=me();for(let i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new n(e,t.fromCache,r,s)}};/**
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
 */function zT(n,e){return te.comparator(n.key,e.key)}/**
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
 */var hd=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};/**
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
 */var dd=class{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return Op()?8:dT(Xe())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,r,s){let i={result:null};return this.vo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Do(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;let o=new hd;return this.xo(e,t,o).next((c=>{if(i.result=c,this.yo)return this.Co(e,t,o,c.size)}))})).next((()=>i.result))}Co(e,t,r,s){return We(t)?M.resolve():r.documentReadCount<this.wo?(ps()<=fe.DEBUG&&J("QueryEngine","SDK will not create cache indexes for query:",Ki(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),M.resolve()):(ps()<=fe.DEBUG&&J("QueryEngine","Query:",Ki(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.bo*s?(ps()<=fe.DEBUG&&J("QueryEngine","The SDK decides to create cache indexes for query:",Ki(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Bn(t))):M.resolve())}vo(e,t){if(We(t))return M.resolve(null);let r=t;if(qC(r))return M.resolve(null);let s=Bn(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=uc(r,null,"F"),s=Bn(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{let c=me(...o);return this.So.getDocuments(e,c).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{let h=this.Fo(r,u);return this.Oo(r,h,c,l.readTime)?this.vo(e,uc(r,null,"F")):this.Mo(e,h,r,l)}))))})))))}Do(e,t,r,s){return(We(t)?(function(o){for(let c of o.stages){if(c instanceof kn||c instanceof Rc)return!1;if(c instanceof Gs){if(c.condition instanceof Ic&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof or&&c.condition._expr.params[0].fieldName===cn)continue;return!1}}return!0})(t):qC(t))||s.isEqual(ce.min())?M.resolve(null):this.So.getDocuments(e,r).next((i=>{let o=this.Fo(t,i);return this.Oo(t,o,r,s)?M.resolve(null):(ps()<=fe.DEBUG&&J("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),nm(t)),this.Mo(e,o,t,bI(s,no)).next((c=>c)))}))}Fo(e,t){let r,s;return We(e)?(r=new Qe(zT),s=i=>Xc(e,i)):(r=new Qe(Md(e)),s=i=>Kc(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Oo(e,t,r,s){if(We(e))return(function(c){return c.stages.some((u=>u instanceof kn||u instanceof Rc))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;let i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,r){return ps()<=fe.DEBUG&&J("QueryEngine","Using full collection scan to execute query:",nm(t)),this.So.getDocumentsMatchingQuery(e,t,Kr.min(),r)}Mo(e,t,r,s){return this.So.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qd="LocalStore",WT=3e8,fd=class{constructor(e,t,r,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new xe(ge),this.Bo=new Nn((i=>_E(i)),wE),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(r)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new td(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}};function QT(n,e,t,r){return new fd(n,e,t,r)}async function LE(n,e){let t=Ce(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{let o=[],c=[],u=me();for(let l of s){o.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}for(let l of i){c.push(l.batchId);for(let h of l.mutations)u=u.add(h.key)}return t.localDocuments.getDocuments(r,u).next((l=>({$o:l,removedBatchIds:o,addedBatchIds:c})))}))}))}function VE(n){let e=Ce(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function $T(n,e){let t=Ce(n),r=e.snapshotVersion,s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{let o=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;let c=[];e.targetChanges.forEach(((h,f)=>{let C=s.get(f);if(!C)return;c.push(t.V_.removeMatchingKeys(i,h.removedDocuments,f).next((()=>t.V_.addMatchingKeys(i,h.addedDocuments,f))));let v=C.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?v=v.withResumeToken(je.EMPTY_BYTE_STRING,ce.min()).withLastLimboFreeSnapshotVersion(ce.min()):h.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(h.resumeToken,r)),s=s.insert(f,v),(function(S,G,U){return S.resumeToken.approximateByteSize()===0||G.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=WT?!0:U.addedDocuments.size+U.modifiedDocuments.size+U.removedDocuments.size>0})(C,v,h)&&c.push(t.V_.updateTargetData(i,v))}));let u=Nt(),l=me();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),c.push(YT(i,o,e.documentUpdates).next((h=>{u=h.Ko,l=h.Qo}))),!r.isEqual(ce.min())){let h=t.V_.getLastRemoteSnapshotVersion(i).next((f=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(h)}return M.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function YT(n,e,t){let r=me(),s=me();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=Nt();return t.forEach(((c,u)=>{let l=i.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(ce.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):J(Qd,"Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)})),{Ko:o,Qo:s}}))}function XT(n,e){let t=Ce(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.V_.getTargetData(r,e).next((i=>i?(s=i,M.resolve(s)):t.V_.allocateTargetId(r).next((o=>(s=new Hs(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.V_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{let s=t.Lo.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(r.targetId,r),t.Bo.set(e,r.targetId)),r}))}async function pd(n,e,t){let r=Ce(n),s=r.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Js(o))throw o;J(Qd,`Failed to update sequence numbers for target ${e}: ${o}`)}r.Lo=r.Lo.remove(e),r.Bo.delete(s.target)}function sm(n,e,t){let r=Ce(n),s=ce.min(),i=me();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,h){let f=Ce(u),C=f.Bo.get(h);return C!==void 0?M.resolve(f.Lo.get(C)):f.V_.getTargetData(l,h)})(r,o,We(e)?e:Bn(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.V_.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>r.No.getDocumentsMatchingQuery(o,e,t?s:ce.min(),t?i:me()))).next((c=>(ZT(r,c),{documents:c,Wo:i})))))}function ZT(n,e){e.forEach(((t,r)=>{let s=r.key.getCollectionGroup(),i=n.Uo.get(s)||ce.min();r.readTime.compareTo(i)>0&&n.Uo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var gd=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(bn(t),this.Xo=!1):J("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}};/**
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
 */var xn="RemoteStore",Cd=class{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new Yr(1e3),this.ca=new Yr(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((o=>{r.enqueueAndForget((async()=>{Oo(this)&&(J(xn,"Restarting streams for network reachability change."),await(async function(u){let l=Ce(u);l.la.add(4),await No(l),l.Ta.set("Unknown"),l.la.delete(4),await Zc(l)})(this))}))})),this.Ta=new gd(r,s)}};async function Zc(n){if(Oo(n))for(let e of n.Ea)await e(!0)}async function No(n){for(let e of n.Ea)await e(!1)}function md(n,e){return n.oa.get(e)||void 0}function ME(n,e){let t=Ce(n),r=md(t,e.targetId);if(r!==void 0&&t._a.has(r))return;let s=(function(c,u){let l=md(c,u);l!==void 0&&c.aa.delete(l);let h=(function(C,v){return v%2!=0?C.ca.next():C.ua.next()})(c,u);return c.oa.set(u,h),c.aa.set(h,u),h})(t,e.targetId);J(xn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);let i=new Hs(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),Zd(t)?Xd(t):Ws(t).Yt()&&Yd(t,i)}function $d(n,e){let t=Ce(n),r=Ws(t),s=md(t,e);J(xn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),r.Yt()&&GE(t,s),t._a.size===0&&(r.Yt()?r.en():Oo(t)&&t.Ta.set("Unknown"))}function Yd(n,e){if(n.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ce.min())>0){let t=n.aa.get(e.targetId);if(t===void 0)return void J(xn,"SDK target ID not found for remote ID: "+e.targetId);let r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}Ws(n).Pn(e)}function GE(n,e){n.Pa.J(e),Ws(n).In(e)}function Xd(n){n.Pa=new uB({getRemoteKeysForTarget:e=>{let t=n.aa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):me()},ye:e=>n._a.get(e)||null,Ve:()=>n.datastore.serializer.databaseId}),Ws(n).start(),n.Ta.ea()}function Zd(n){return Oo(n)&&!Ws(n).Jt()&&n._a.size>0}function Oo(n){return Ce(n).la.size===0}function UE(n){n.Pa=void 0}async function eA(n){n.Ta.set("Online")}async function tA(n){n._a.forEach(((e,t)=>{Yd(n,e)}))}async function nA(n,e){UE(n),Zd(n)?(n.Ta.ra(e),Xd(n)):n.Ta.set("Unknown")}async function rA(n,e,t){if(n.Ta.set("Online"),e instanceof Bc&&e.state===2&&e.cause)try{await(async function(s,i){let o=i.cause;for(let c of i.targetIds){if(s._a.has(c)){let u=s.aa.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.oa.delete(u),s.aa.delete(c)),s._a.delete(c)}s.Pa.removeTarget(c)}})(n,e)}catch(r){J(xn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await im(n,r)}else if(e instanceof Ds?n.Pa._e(e):e instanceof lc?n.Pa.he(e):n.Pa.ue(e),!t.isEqual(ce.min()))try{let r=await VE(n.localStore);t.compareTo(r)>=0&&await(function(i,o){let c=i.Pa.fe(o);c.targetChanges.forEach(((l,h)=>{if(l.resumeToken.approximateByteSize()>0){let f=i._a.get(h);f&&i._a.set(h,f.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,h)=>{let f=i._a.get(l);if(!f)return;i._a.set(l,f.withResumeToken(je.EMPTY_BYTE_STRING,f.snapshotVersion)),GE(i,l);let C=new Hs(f.target,l,h,f.sequenceNumber);Yd(i,C)}));let u=(function(h,f){let C=new Map;f.targetChanges.forEach(((R,S)=>{let G=h.aa.get(S);G!==void 0&&C.set(G,R)}));let v=new xe(ge);return f.targetMismatches.forEach(((R,S)=>{let G=h.aa.get(R);G!==void 0&&(v=v.insert(G,S))})),new ro(f.snapshotVersion,C,v,f.documentUpdates,f.augmentedDocumentUpdates,f.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){J(xn,"Failed to raise snapshot:",r),await im(n,r)}}async function im(n,e,t){if(!Js(e))throw e;n.la.add(1),await No(n),n.Ta.set("Offline"),t||(t=()=>VE(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{J(xn,"Retrying IndexedDB access"),await t(),n.la.delete(1),await Zc(n)}))}async function om(n,e){let t=Ce(n);t.asyncQueue.verifyOperationInProgress(),J(xn,"RemoteStore received new credentials");let r=Oo(t);t.la.add(3),await No(t),r&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await Zc(t)}async function sA(n,e){let t=Ce(n);e?(t.la.delete(2),await Zc(t)):e||(t.la.add(2),await No(t),t.Ta.set("Unknown"))}function Ws(n){return n.Ia||(n.Ia=(function(t,r,s){let i=Ce(t);return i.pn(),new wB(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:eA.bind(null,n),Et:tA.bind(null,n),Tt:nA.bind(null,n),Tn:rA.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ia.Xt(),Zd(n)?Xd(n):n.Ta.set("Unknown")):(await n.Ia.stop(),UE(n))}))),n.Ia}/**
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
 */var _o=class{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):bn("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}};/**
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
 */var Ed=class n{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Xt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){let o=Date.now()+r,c=new n(e,t,o,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new H(V.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function HE(n,e){if(bn("AsyncQueue",`${e}: ${n}`),Js(n))return new H(V.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Lc=class{constructor(){this.activeTargetIds=UI()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var _d=class{constructor(){this.fu=new Lc,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,r){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new Lc,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(){return typeof document<"u"?document:null}/**
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
 */var wo=class n{static emptySet(e){return new n(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||te.comparator(t.key,r.key):(t,r)=>te.comparator(t.key,r.key),this.keyedMap=Cs(),this.sortedSet=new xe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){let e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
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
 */var Vc=class{constructor(){this.pu=new xe(te.comparator)}track(e){let t=e.doc.key,r=this.pu.get(t);r?e.type!==0&&r.type===3?this.pu=this.pu.insert(t,e):e.type===3&&r.type!==1?this.pu=this.pu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.pu=this.pu.remove(t):e.type===1&&r.type===2?this.pu=this.pu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):Z(63341,{we:e,gu:r}):this.pu=this.pu.insert(t,e)}yu(){let e=[];return this.pu.inorderTraversal(((t,r)=>{e.push(r)})),e}},qs=class n{constructor(e,t,r,s,i,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,s,i){let o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new n(e,t,wo.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Yc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}};/**
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
 */var wd=class{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}},yd=class{constructor(){this.queries=am(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,r){let s=Ce(t),i=s.queries;s.queries=am(),i.forEach(((o,c)=>{for(let u of c.bu)u.onError(r)}))})(this,new H(V.ABORTED,"Firestore shutting down"))}};function am(){return new Nn((n=>EE(n)),Yc)}async function ef(n,e){let t=Ce(n),r=3,s=e.query,i=t.queries.get(s);i?!i.Su()&&e.vu()&&(r=2):(i=new wd,r=e.vu()?0:1);try{switch(r){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){let c=HE(o,`Initialization of query '${We(e.query)?An(e.query):Ki(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&nf(t)}async function tf(n,e){let t=Ce(n),r=e.query,s=3,i=t.queries.get(r);if(i){let o=i.bu.indexOf(e);o>=0&&(i.bu.splice(o,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function iA(n,e){let t=Ce(n),r=!1;for(let s of e){let i=s.query,o=t.queries.get(i);if(o){for(let c of o.bu)c.Cu(s)&&(r=!0);o.wu=s}}r&&nf(t)}function oA(n,e,t){let r=Ce(n),s=r.queries.get(e);if(s)for(let i of s.bu)i.onError(t);r.queries.delete(e)}function nf(n){n.Du.forEach((e=>{e.next()}))}var Dd;(function(n){n.Default="default",n.Cache="cache"})(Dd||(Dd={}));var yo=class{constructor(e,t,r){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=r||{}}Cu(e){if(!this.options.includeMetadataChanges){let r=[];for(let s of e.docChanges)s.type!==3&&r.push(s);e=new qs(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;let r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;let t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=qs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==Dd.Cache}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */var Mc=class{constructor(e){this.key=e}},Gc=class{constructor(e){this.key=e}},Id=class{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=me(),this.mutatedKeys=me(),this.Ju=We(e)?Xh(e):Md(e),this.Yu=new wo(this.Ju)}get Zu(){return this.zu}Xu(e,t){let r=t?t.ec:new Vc,s=t?t.Yu:this.Yu,i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1,[u,l]=this.tc(this.query,s);e.inorderTraversal(((f,C)=>{let v=s.get(f),R=JT(this.query,C)?C:null,S=!!v&&this.mutatedKeys.has(v.key),G=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations),U=!1;v&&R?v.data.isEqual(R.data)?S!==G&&(r.track({type:3,doc:R}),U=!0):this.nc(v,R)||(r.track({type:2,doc:R}),U=!0,(u&&this.Ju(R,u)>0||l&&this.Ju(R,l)<0)&&(c=!0)):!v&&R?(r.track({type:0,doc:R}),U=!0):v&&!R&&(r.track({type:1,doc:v}),U=!0,(u||l)&&(c=!0)),U&&(R?(o=o.add(R),i=G?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}));let h=this.rc(this.query);if(h)if(We(this.query)){let f=[];o.forEach((R=>f.push(R)));let C=xE(this.query,f),v=new wo(Xh(this.query));for(let R of C)v=v.add(R);o.forEach((R=>{v.has(R.key)||(i=i.delete(R.key),r.track({type:1,doc:R}))})),o=v}else{let f=this.sc(this.query);for(;o.size>h;){let C=f==="F"?o.last():o.first();o=o.delete(C.key),i=i.delete(C.key),r.track({type:1,doc:C})}}return{Yu:o,ec:r,Oo:c,mutatedKeys:i}}rc(e){return We(e)?jl(e)?.limit:e.limit||void 0}sc(e){if(We(e)){let t=jl(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){if(We(e)){let r=jl(e)?.limit;return[t.size===r?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){let i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;let o=e.ec.yu();o.sort(((h,f)=>(function(v,R){let S=G=>{switch(G){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Z(20277,{we:G})}};return S(v)-S(R)})(h.type,f.type)||this.Ju(h.doc,f.doc))),this._c(r),s=s??!1;let c=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,l=u!==this.ju;return this.ju=u,o.length!==0||l?{snapshot:new qs(this.query,e.Yu,i,o,e.mutatedKeys,u===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),ac:c}:{ac:c}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new Vc,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];let e=this.Hu;this.Hu=me(),this.Yu.forEach((r=>{this.uc(r.key)&&(this.Hu=this.Hu.add(r.key))}));let t=[];return e.forEach((r=>{this.Hu.has(r)||t.push(new Gc(r))})),this.Hu.forEach((r=>{e.has(r)||t.push(new Mc(r))})),t}cc(e){this.zu=e.Wo,this.Hu=me();let t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return qs.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}},rf="SyncEngine",Td=class{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}},Ad=class{constructor(e){this.key=e,this.Ec=!1}},vd=class{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hc={},this.Tc=new Nn((c=>EE(c)),Yc),this.Pc=new Map,this.Ic=new Set,this.Rc=new xe(te.comparator),this.Ac=new Map,this.Vc=new Eo,this.dc={},this.fc=new Map,this.mc=Yr.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}};async function aA(n,e,t=!0){let r=zE(n),s,i=r.Tc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await qE(r,e,t,!0),s}async function cA(n,e){let t=zE(n);await qE(t,e,!0,!1)}async function qE(n,e,t,r){let s=await XT(n.localStore,We(e)?e:Bn(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t),c;return r&&(c=await uA(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&ME(n.remoteStore,s),c}async function uA(n,e,t,r,s){n.yc=(f,C,v)=>(async function(S,G,U,ae){let Ee=G.view.Xu(U);Ee.Oo&&(Ee=await sm(S.localStore,G.query,!1).then((({documents:A})=>G.view.Xu(A,Ee))));let _e=ae&&ae.targetChanges.get(G.targetId),Oe=ae&&ae.targetMismatches.get(G.targetId)!=null,we=G.view.applyChanges(Ee,S.isPrimaryClient,_e,Oe);return um(S,G.targetId,we.ac),we.snapshot})(n,f,C,v);let i=await sm(n.localStore,e,!0),o=new Id(e,i.Wo),c=o.Xu(i.documents),u=so.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),l=o.applyChanges(c,n.isPrimaryClient,u);um(n,t,l.ac);let h=new Td(e,t,o);return n.Tc.set(e,h),n.Pc.has(t)?n.Pc.get(t).push(e):n.Pc.set(t,[e]),l.snapshot}async function lA(n,e,t){let r=Ce(n),s=r.Tc.get(e),i=r.Pc.get(s.targetId);if(i.length>1)return r.Pc.set(s.targetId,i.filter((o=>!Yc(o,e)))),void r.Tc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await pd(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&$d(r.remoteStore,s.targetId),bd(r,s.targetId)})).catch(Wc)):(bd(r,s.targetId),await pd(r.localStore,s.targetId,!0))}async function BA(n,e){let t=Ce(n),r=t.Tc.get(e),s=t.Pc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),$d(t.remoteStore,r.targetId))}async function jE(n,e){let t=Ce(n);try{let r=await $T(t.localStore,e);e.targetChanges.forEach(((s,i)=>{let o=t.Ac.get(i);o&&(ee(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Ec=!0:s.modifiedDocuments.size>0?ee(o.Ec,14607):s.removedDocuments.size>0&&(ee(o.Ec,42227),o.Ec=!1))})),await KE(t,r,e)}catch(r){await Wc(r)}}function cm(n,e,t){let r=Ce(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let s=[];r.Tc.forEach(((i,o)=>{let c=o.view.xu(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){let u=Ce(o);u.onlineState=c;let l=!1;u.queries.forEach(((h,f)=>{for(let C of f.bu)C.xu(c)&&(l=!0)})),l&&nf(u)})(r.eventManager,e),s.length&&r.hc.Tn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function hA(n,e,t){let r=Ce(n);r.sharedClientState.updateQueryState(e,"rejected",t);let s=r.Ac.get(e),i=s&&s.key;if(i){let o=new xe(te.comparator);o=o.insert(i,Ft.newNoDocument(i,ce.min()));let c=me().add(i),u=new ro(ce.min(),new Map,new xe(ge),o,Nt(),c);await jE(r,u),r.Rc=r.Rc.remove(i),r.Ac.delete(e),sf(r)}else await pd(r.localStore,e,!1).then((()=>bd(r,e,t))).catch(Wc)}function bd(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(let r of n.Pc.get(e))n.Tc.delete(r),t&&n.hc.wc(r,t);n.Pc.delete(e),n.isPrimaryClient&&n.Vc.e_(e).forEach((r=>{n.Vc.containsKey(r)||JE(n,r)}))}function JE(n,e){n.Ic.delete(e.path.canonicalString());let t=n.Rc.get(e);t!==null&&($d(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ac.delete(t),sf(n))}function um(n,e,t){for(let r of t)r instanceof Mc?(n.Vc.addReference(r.key,e),dA(n,r)):r instanceof Gc?(J(rf,"Document no longer in limbo: "+r.key),n.Vc.removeReference(r.key,e),n.Vc.containsKey(r.key)||JE(n,r.key)):Z(19791,{bc:r})}function dA(n,e){let t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Ic.has(r)||(J(rf,"New document in limbo: "+t),n.Ic.add(r),sf(n))}function sf(n){for(;n.Ic.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){let e=n.Ic.values().next().value;n.Ic.delete(e);let t=new te(Te.fromString(e)),r=n.mc.next();n.Ac.set(r,new Ad(t)),n.Rc=n.Rc.insert(t,r),ME(n.remoteStore,new Hs(Bn(Po(t.path)),r,"TargetPurposeLimboResolution",xs.wn))}}async function KE(n,e,t){let r=Ce(n),s=[],i=[],o=[];r.Tc.isEmpty()||(r.Tc.forEach(((c,u)=>{o.push(r.yc(u,e,t).then((l=>{if((l||t)&&r.isPrimaryClient){let h=l?!l.fromCache:t?.targetChanges.get(u.targetId)?.current;r.sharedClientState.updateQueryState(u.targetId,h?"current":"not-current")}if(l){s.push(l);let h=Bd.mo(u.targetId,l);i.push(h)}})))})),await Promise.all(o),r.hc.Tn(s),await(async function(u,l){let h=Ce(u);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(f=>M.forEach(l,(C=>M.forEach(C.Vo,(v=>h.persistence.referenceDelegate.addReference(f,C.targetId,v))).next((()=>M.forEach(C.fo,(v=>h.persistence.referenceDelegate.removeReference(f,C.targetId,v)))))))))}catch(f){if(!Js(f))throw f;J(Qd,"Failed to update sequence numbers: "+f)}for(let f of l){let C=f.targetId;if(!f.fromCache){let v=h.Lo.get(C),R=v.snapshotVersion,S=v.withLastLimboFreeSnapshotVersion(R);h.Lo=h.Lo.insert(C,S)}}})(r.localStore,i))}async function fA(n,e){let t=Ce(n);if(!t.currentUser.isEqual(e)){J(rf,"User change. New user:",e.toKey());let r=await LE(t.localStore,e);t.currentUser=e,(function(i,o){i.fc.forEach((c=>{c.forEach((u=>{u.reject(new H(V.CANCELLED,o))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await KE(t,r.$o)}}function pA(n,e){let t=Ce(n),r=t.Ac.get(e);if(r&&r.Ec)return me().add(r.key);{let s=me(),i=t.Pc.get(e);if(!i)return s;for(let o of i??[]){let c=t.Tc.get(o);s=s.unionWith(c.view.Zu)}return s}}function zE(n){let e=Ce(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=jE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=pA.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=hA.bind(null,e),e.hc.Tn=iA.bind(null,e.eventManager),e.hc.wc=oA.bind(null,e.eventManager),e}var Xr=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=zc(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return QT(this.persistence,new dd,e.initialUser,this.serializer)}Dc(e){return new Fc(ld.b_,this.serializer)}vc(e){return new _d}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};Xr.provider={build:()=>new Xr};var Do=class extends Xr{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){ee(this.persistence.referenceDelegate instanceof xc,46915);let r=this.persistence.referenceDelegate.garbageCollector;return new AB(r,e.asyncQueue,t)}Dc(e){let t=this.cacheSizeBytes!==void 0?Gt.withCacheSize(this.cacheSizeBytes):Gt.DEFAULT;return new Fc((r=>xc.b_(r,t)),this.serializer)}};var Zr=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>cm(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=fA.bind(null,this.syncEngine),await sA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new yd})()}createDatastore(e){let t=zc(e.databaseInfo.databaseId),r=cT(e.databaseInfo);return uT(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,c){return new Cd(r,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>cm(this.syncEngine,t,0)),(function(){return mc.Ye()?new mc:new gB})())}createSyncEngine(e,t){return(function(s,i,o,c,u,l,h){let f=new vd(s,i,o,c,u,l);return h&&(f.gc=!0),f})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){let r=Ce(t);J(xn,"RemoteStore shutting down."),r.la.add(5),await No(r),r.ha.shutdown(),r.Ta.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}};Zr.provider={build:()=>new Zr};/**
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
 */var Sd=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new H(V.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await(async function(s,i){let o=Ce(s),c={documents:i.map((f=>io(o.serializer,f)))},u=await o._t("BatchGetDocuments",o.serializer.databaseId,Te.emptyPath(),c,i.length),l=new Map;u.forEach((f=>{let C=QI(o.serializer,f);l.set(C.key.toString(),C)}));let h=[];return i.forEach((f=>{let C=l.get(f.toString());ee(!!C,55234,{key:f}),h.push(C)})),h})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new Fs(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{let s=te.fromPath(r);this.mutations.push(new oc(s,this.precondition(s)))})),await(async function(r,s){let i=Ce(r),o={writes:s.map((c=>YI(i.serializer,c)))};await i.nt("Commit",i.serializer.databaseId,Te.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Z(50498,{Mc:e.constructor.name});t=ce.min()}let r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new H(V.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(ce.min())?Qt.exists(!1):Qt.updateTime(t):Qt.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(ce.min()))throw new H(V.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Qt.updateTime(t)}return Qt.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
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
 */var Rd=class{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Nc=r.maxAttempts,this.Ht=new ao(this.asyncQueue,"transaction_retry")}Lc(){this.Nc-=1,this.Bc()}Bc(){this.Ht.kt((async()=>{let e=new Sd(this.datastore),t=this.Uc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.kc(s)}))))})).catch((r=>{this.kc(r)}))}))}Uc(e){try{let t=this.updateFunction(e);return!Ro(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}kc(e){this.Nc>0&&this.qc(e)?(this.Nc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Bc(),Promise.resolve())))):this.deferred.reject(e)}qc(e){if(e?.name==="FirebaseError"){let t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!xI(t)}return!1}};/**
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
 */var Br="FirestoreClient",Pd=class{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=tt.UNAUTHENTICATED,this.clientId=Is.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{J(Br,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(J(Br,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new Xt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){let r=HE(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}};async function Kl(n,e){n.asyncQueue.verifyOperationInProgress(),J(Br,"Initializing OfflineComponentProvider");let t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await LE(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function lm(n,e){n.asyncQueue.verifyOperationInProgress();let t=await gA(n);J(Br,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>om(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>om(e.remoteStore,s))),n._onlineComponents=e}async function gA(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){J(Br,"Using user provided OfflineComponentProvider");try{await Kl(n,n._uninitializedComponentsProvider._offline)}catch(e){let t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===V.FAILED_PRECONDITION||s.code===V.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Ht("Error using user provided cache. Falling back to memory cache: "+t),await Kl(n,new Xr)}}else J(Br,"Using default OfflineComponentProvider"),await Kl(n,new Do(void 0));return n._offlineComponents}async function WE(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(J(Br,"Using user provided OnlineComponentProvider"),await lm(n,n._uninitializedComponentsProvider._online)):(J(Br,"Using default OnlineComponentProvider"),await lm(n,new Zr))),n._onlineComponents}function CA(n){return WE(n).then((e=>e.datastore))}async function Uc(n){let e=await WE(n),t=e.eventManager;return t.onListen=aA.bind(null,e.syncEngine),t.onUnlisten=lA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=cA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=BA.bind(null,e.syncEngine),t}function QE(n,e,t,r){let s=new _o(r),i=new yo(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>ef(await Uc(n),i))),()=>{s.Va(),n.asyncQueue.enqueueAndForget((async()=>tf(await Uc(n),i)))}}function $E(n,e,t={}){let r=new Xt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new _o({next:C=>{h.Va(),o.enqueueAndForget((()=>tf(i,f)));let v=C.docs.has(c);!v&&C.fromCache?l.reject(new H(V.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&C.fromCache&&u&&u.source==="server"?l.reject(new H(V.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(C)},error:C=>l.reject(C)}),f=new yo(Po(c.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return ef(i,f)})(await Uc(n),n.asyncQueue,e,t,r))),r.promise}function YE(n,e,t={}){let r=new Xt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){let h=new _o({next:C=>{h.Va(),o.enqueueAndForget((()=>tf(i,f))),C.fromCache&&u.source==="server"?l.reject(new H(V.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(C)},error:C=>l.reject(C)}),f=new yo(c instanceof LB?PT(c):c,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return ef(i,f)})(await Uc(n),n.asyncQueue,e,t,r))),r.promise}function XE(n,e,t){let r=new Xt;return n.asyncQueue.enqueueAndForget((async()=>{let s=await CA(n);new Rd(n.asyncQueue,s,t,e,r).Lc()})),r.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ko=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new qe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new mA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){let t=this._document.data.field(ir("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},mA=class extends ko{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Io=class{convertValue(e,t="none"){switch(Je(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Rn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Z(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return ts(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){let t=e.fields?.[Vr].arrayValue?.values?.map((r=>Se(r.doubleValue)));return new kt(t)}convertGeoPoint(e){return new In(Se(e.latitude),Se(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":let r=So(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(As(e));default:return null}}convertTimestamp(e){let t=Sn(e);return new Fe(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=Te.fromString(e);ee(Wm(r),9688,{name:e});let s=new Xi(r.get(1),r.get(3)),i=new te(r.popFirst(5));return s.isEqual(t)||bn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZE(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var Hc=class extends Io{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ut(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new qe(this.firestore,null,t)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Bm="AsyncQueue",qc=class{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new ao(this,"async_queue_retry"),this.Hc=()=>{let r=Jl();r&&J(Bm,"Visibility state changed to "+r.visibilityState),this.Ht.$t()},this.Jc=e;let t=Jl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;let t=Jl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));let t=new Xt;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!Js(e))throw e;J(Bm,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){let t=this.Jc.then((()=>(this.Gc=!0,e().catch((r=>{throw this.Wc=r,this.Gc=!1,bn("INTERNAL UNHANDLED ERROR: ",hm(r)),r})).then((r=>(this.Gc=!1,r))))));return this.Jc=t,t}enqueueAfterDelay(e,t,r){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);let s=Ed.createAndSchedule(this,e,t,r,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&Z(47125,{tl:hm(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(let t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(let t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){let t=this.Qc.indexOf(e);this.Qc.splice(t,1)}};function hm(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
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
 */var Ln=class extends Qc{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new qc,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new qc(e),this._firestoreClient=void 0,await e}}};function of(n,e,t){t||(t=Yi);let r=Ci(n,"firestore");if(r.isInitialized(t)){let s=r.getImmediate({identifier:t}),i=r.getOptions(t);if(rn(i,e))return s;throw new H(V.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new H(V.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<eE)throw new H(V.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&mr(e.host)&&na(e.host),r.initialize({options:e,instanceIdentifier:t})}function af(n,e){let t=typeof n=="object"?n:Ju(),r=typeof n=="string"?n:e||Yi,s=Ci(t,"firestore").getImmediate({identifier:r});if(!s._initialized){let i=Tp("firestore");i&&nE(s,...i)}return s}function Fo(n){if(n._terminated)throw new H(V.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||EA(n),n._firestoreClient}function EA(n){let e=n._freezeSettings(),t=BT(n._databaseId,n._app?.options.appId||"",n._persistenceKey,n._app?.options.apiKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new Pd(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){let i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(n._componentsProvider))}/**
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
 */var es=class extends Io{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ut(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new qe(this.firestore,null,t)}};/**
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
 */var yn=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},vn=class n extends ko{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new xr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field(ir("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new H(V.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=n._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}};vn._jsonSchemaVersion="firestore/documentSnapshot/1.0",vn._jsonSchema={type:He("string",vn._jsonSchemaVersion),bundleSource:He("string","DocumentSnapshot"),bundleName:He("string"),bundle:He("string")};var xr=class extends vn{data(e={}){return super.data(e)}},tr=class n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new yn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){let e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new xr(this._firestore,this._userDataWriter,r.key,r,new yn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new H(V.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{We(s._snapshot.query)?Xh(s._snapshot.query):Md(s.query._query);let u=new xr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new yn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{let u=new xr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new yn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter),l=-1,h=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),h=o.indexOf(c.doc.key)),{type:_A(c.type),doc:u,oldIndex:l,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new H(V.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Is.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}};function _A(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Z(61501,{type:n})}}/**
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
 */tr._jsonSchemaVersion="firestore/querySnapshot/1.0",tr._jsonSchema={type:He("string",tr._jsonSchemaVersion),bundleSource:He("string","QuerySnapshot"),bundleName:He("string"),bundle:He("string")};/**
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
 */function wA(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new H(V.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}var Lo=class{},cf=class extends Lo{};function tu(n,e,...t){let r=[];e instanceof Lo&&r.push(e),r=r.concat(t),(function(i){let o=i.filter((u=>u instanceof uf)).length,c=i.filter((u=>u instanceof eu)).length;if(o>1||o>0&&c>0)throw new H(V.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(let s of r)n=s._apply(n);return n}var eu=class n extends cf{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new n(e,t,r)}_apply(e){let t=this._parse(e);return i_(e._query,t),new rr(e.firestore,e.converter,Jc(e._query,t))}_parse(e){let t=Hd(e.firestore);return(function(i,o,c,u,l,h,f){let C;if(l.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new H(V.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){t_(f,h);let R=[];for(let S of f)R.push(e_(u,i,S));C={arrayValue:{values:R}}}else C=e_(u,i,f)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||t_(f,h),C=aE(c,o,f,h==="in"||h==="not-in");return Me.create(l,h,C)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}};function nu(n,e,t){let r=e,s=ir("where",n);return eu._create(s,r,t)}var uf=class n extends Lo{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new n(e,t)}_parse(e){let t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:jt.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s,c=i.getFlattenedFilters();for(let u of c)i_(o,u),o=Jc(o,u)})(e._query,t),new rr(e.firestore,e.converter,Jc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}};function e_(n,e,t){if(typeof(t=Ve(t))=="string"){if(t==="")throw new H(V.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Vd(e)&&t.indexOf("/")!==-1)throw new H(V.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);let r=e.path.child(Te.fromString(t));if(!te.isDocumentKey(r))throw new H(V.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Fd(n,new te(r))}if(t instanceof qe)return Fd(n,t._key);throw new H(V.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ao(t)}.`)}function t_(n,e){if(!Array.isArray(n)||n.length===0)throw new H(V.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function i_(n,e){let t=(function(s,i){for(let o of s)for(let c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new H(V.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new H(V.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
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
 */function n_(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;let s=t;for(let i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}var lf=class{constructor(e){this.kind="memory",this._onlineComponentProvider=Zr.provider,this._offlineComponentProvider=e?.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new Do(void 0)}}toJSON(){return{kind:this.kind}}};function o_(n){return new lf(n)}/**
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
 */var yA={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xo(n,e){if((n=Ve(n)).firestore!==e)throw new H(V.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var DA=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Hd(e)}get(e){let t=xo(e,this._firestore),r=new Hc(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return Z(24041);let i=s[0];if(i.isFoundDocument())return new ko(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new ko(this._firestore,r,t._key,null,t.converter);throw Z(18433,{doc:i})}))}set(e,t,r){let s=xo(e,this._firestore),i=ZE(s.converter,t,r),o=sE(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,o),this}update(e,t,r,...s){let i=xo(e,this._firestore),o;return o=typeof(t=Ve(t))=="string"||t instanceof Wr?oE(this._dataReader,"Transaction.update",i._key,t,r,s):iE(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){let t=xo(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Bf=class extends DA{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=xo(e,this._firestore),r=new es(this._firestore);return super.get(e).then((s=>new vn(this._firestore,r,t._key,s._document,new yn(!1,!1),t.converter)))}};function Qs(n,e,t){n=dn(n,Ln);let r={...yA,...t};(function(o){if(o.maxAttempts<1)throw new H(V.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);let s=Fo(n);return XE(s,(i=>e(new Bf(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ru(n){n=dn(n,qe);let e=dn(n.firestore,Ln),t=Fo(e);return $E(t,n._key,{source:"server"}).then((r=>a_(e,n,r)))}function hf(n){n=dn(n,rr);let e=dn(n.firestore,Ln),t=Fo(e),r=new es(e);return YE(t,n._query,{source:"server"}).then((s=>new tr(e,r,n,s)))}function df(n,...e){n=Ve(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||n_(e[r])||(t=e[r++]);let s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(n_(e[r])){let l=e[r];e[r]=l.next?.bind(l),e[r+1]=l.error?.bind(l),e[r+2]=l.complete?.bind(l)}let i,o,c;if(n instanceof qe)o=dn(n.firestore,Ln),c=Po(n._key.path),i={next:l=>{e[r]&&e[r](a_(o,n,l))},error:e[r+1],complete:e[r+2]};else{let l=dn(n,rr);o=dn(l.firestore,Ln),c=l._query;let h=new es(o);i={next:f=>{e[r]&&e[r](new tr(o,h,l,f))},error:e[r+1],complete:e[r+2]},wA(n._query)}let u=Fo(o);return QE(u,c,s,i)}function a_(n,e,t){let r=t.docs.get(e._key),s=new es(n);return new vn(n,s,e._key,r,new yn(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */var r_="@firebase/firestore",s_="4.17.2";(function(e,t=!0){dm(zn),Kn(new xt("firestore",((r,{instanceIdentifier:s,options:i})=>{let o=r.getProvider("app").getImmediate(),c=new Ln(new pc(r.getProvider("auth-internal")),new Cc(o,r.getProvider("app-check-internal")),Dm(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Kt(r_,s_,e),Kt(r_,s_,"esm2020")})();var IA="firebase",TA="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Kt(IA,TA,"app");var Vo=Object.freeze({apiKey:"AIzaSyBvuAItyaaRKBywT11NJ2g9Tp4EjVGTc_M",authDomain:"atlas-ahmedsaeed4-2026.firebaseapp.com",projectId:"atlas-ahmedsaeed4-2026",appId:"1:790536067689:web:6833eb2e60f14f77e1a0f8",messagingSenderId:"790536067689"}),AA=Object.freeze(["apiKey","authDomain","projectId","appId","messagingSenderId"]);function ff(n=Vo){return!!n&&typeof n=="object"&&AA.every(e=>typeof n[e]=="string"&&n[e].trim())}function pf(n=Vo){return ff(n)?Object.freeze({enabled:!0,projectId:n.projectId}):Object.freeze({enabled:!1,reason:"Online workspaces are unavailable because Firebase web configuration is missing."})}function su(n,e,t=()=>{}){let r=!1,s=()=>{};return Promise.resolve(n).then(()=>{if(r)return;let i=e();r?i?.():typeof i=="function"&&(s=i)}).catch(i=>{r||t(i)}),()=>{r=!0,s()}}async function c_({auth:n,persistenceReady:e,uid:t=""}){if(await e,!t)return;let r=n?.currentUser;if(!r?.uid||r.uid!==t)throw Object.assign(new Error("The Firebase account changed before the online request started. Retry from the current account."),{code:"unauthenticated"});if(await r.getIdToken(),n?.currentUser?.uid!==t)throw Object.assign(new Error("The Firebase account changed while its access token was refreshing. Retry from the current account."),{code:"unauthenticated"})}var gt=Object.freeze({nodes:800,edges:2400,text:12e3,chartPoints:32,chartMagnitude:1e12,detailItems:8,detailText:240}),Zt=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},Ne=(...n)=>n.find(e=>e!=null),Le=(n,e,t=gt.text,{required:r=!1}={})=>{if(n==null){if(r)throw new Error(e+" is required.");return""}if(typeof n!="string"&&typeof n!="number")throw new Error(e+" must be text.");let s=String(n).trim();if(r&&!s)throw new Error(e+" is required.");if(s.length>t)throw new Error(e+" must be "+t+" characters or fewer.");return s},$s=(n,e,t=gt.detailItems,r=gt.detailText)=>{if(n==null)return[];if(!Array.isArray(n))throw new Error(e+" must be a list of text values.");if(n.length>t)throw new Error(e+" must contain "+t+" items or fewer.");return n.map((s,i)=>Le(s,e+" item "+(i+1),r,{required:!0}))},u_=(n,e)=>n+"-"+String(e+1).padStart(3,"0");function gf(n,e={}){let t=n;if(typeof n=="string"){if(new TextEncoder().encode(n).byteLength>2097152)throw new Error("This JSON file is larger than the 2 MB import limit.");try{t=JSON.parse(n)}catch(v){throw new Error("That is not valid JSON: "+v.message)}}if(t=Zt(t),!Object.keys(t).length)throw new Error("The JSON must contain a project, nodes, and edges.");let r=Zt(t.graph),s=Zt(Ne(t.project,t.metadata,t.meta,r.project,{})),i=Ne(t.nodes,t.components,r.nodes),o=Ne(t.edges,t.connections,t.relationships,r.edges,r.links,[]);if(!Array.isArray(i))throw new Error("The map needs a nodes array (or components array).");if(!Array.isArray(o))throw new Error("The map needs an edges array (or connections array).");if(i.length>gt.nodes)throw new Error("This map has "+i.length+" components; the limit is "+gt.nodes+".");if(o.length>gt.edges)throw new Error("This map has "+o.length+" connections; the limit is "+gt.edges+".");if(i.length===0&&!e.allowEmpty)throw new Error("Add at least one component before importing this map.");let c=i.map((v,R)=>{let S=Zt(v),G=Le(Ne(S.id,S.key,S.slug,u_("node",R)),"Component "+(R+1)+" ID",160,{required:!0}),U=Le(Ne(S.label,S.name,S.title,S.id),"Component "+G+" name",120,{required:!0}),ae=Le(Ne(S.type,S.kind,S.category,S.componentType,"Component"),"Component "+U+" type",60,{required:!0}),Ee=typeof S.sourceRef=="string"||typeof S.sourceRef=="number"?S.sourceRef:Ne(Zt(S.sourceRef).path,Zt(S.sourceRef).file,Zt(S.sourceRef).uri,Zt(S.sourceRef).ref),_e={id:G,label:U,type:ae,description:Le(Ne(S.description,S.detail,S.sub,S.summary,S.purpose),"Component "+U+" description",1e3),source:Le(Ne(S.source,S.path,S.file,S.location,Ee),"Component "+U+" source",240),group:Le(Ne(S.group,S.domain,S.boundary),"Component "+U+" group",100)};if(S.junction!==void 0&&typeof S.junction!="boolean")throw new Error("Component "+U+" junction marker must be true or false.");if(S.junction===!0){if(ae.toLowerCase()!=="junction")throw new Error("A junction marker requires component type Junction.");_e.junction=!0}if(S.details!==void 0&&S.details!==null){if(!S.details||typeof S.details!="object"||Array.isArray(S.details))throw new Error("Details for "+U+" must be an object.");let m=S.details,w={purpose:Le(m.purpose,"Component "+U+" purpose",500),operation:Le(m.operation,"Component "+U+" operation",1e3),inputs:$s(m.inputs,"Component "+U+" inputs"),outputs:$s(m.outputs,"Component "+U+" outputs"),dependencies:$s(m.dependencies,"Component "+U+" dependencies"),evidence:$s(m.evidence,"Component "+U+" evidence"),uncertainty:$s(m.uncertainty,"Component "+U+" uncertainty")};(w.purpose||w.operation||Object.values(w).some(I=>Array.isArray(I)&&I.length))&&(_e.details=w)}if(S.chart!==void 0&&S.chart!==null){let m=Zt(S.chart),w=Le(m.label,"Chart for "+U+" label",80,{required:!0}),I=Le(m.kind,"Chart for "+U+" kind",8,{required:!0});if(!["bar","line","area"].includes(I))throw new Error("Chart for "+U+" kind must be bar, line, or area.");if(!Array.isArray(m.values)||m.values.length<2||m.values.length>gt.chartPoints)throw new Error("Chart for "+U+" values must contain 2 to "+gt.chartPoints+" points.");let D=m.values.map((W,Q)=>{if(typeof W!="number"||!Number.isFinite(W)||Math.abs(W)>gt.chartMagnitude)throw new Error("Chart for "+U+" point "+(Q+1)+" must be a finite number within "+gt.chartMagnitude+".");return W}),y=Le(m.evidence,"Chart for "+U+" evidence",240,{required:!0}),p=Le(Ne(m.unit,""),"Chart for "+U+" unit",24),O=m.categories===void 0||m.categories===null?[]:$s(m.categories,"Chart for "+U+" categories",gt.chartPoints,80),K=Le(m.order,"Chart for "+U+" order",160);if(I==="bar"&&O.length!==D.length)throw new Error("Bar chart for "+U+" needs one category label for each value.");if((I==="line"||I==="area")&&O.length&&O.length!==D.length)throw new Error("Chart for "+U+" needs one category label for each value.");if((I==="line"||I==="area")&&!!O.length!=!!K)throw new Error("Ordered chart for "+U+" needs both category labels and an order explanation.");_e.chart={label:w,kind:I,values:D,evidence:y},p&&(_e.chart.unit=p),O.length&&(_e.chart.categories=O),K&&(_e.chart.order=K)}let Oe=Zt(Ne(S.position,S.pos,{})),we=Number(Ne(Oe.x,S.x)),A=Number(Ne(Oe.y,S.y));return Number.isFinite(we)&&Number.isFinite(A)&&Math.abs(we)<1e5&&Math.abs(A)<1e5&&(_e.position={x:we,y:A}),_e}),u=new Set;for(let v of c){if(u.has(v.id))throw new Error('Duplicate component ID: "'+v.id+'". Each component needs a unique ID.');u.add(v.id)}let l=new Set,h=o.map((v,R)=>{let S=Zt(v),G=Le(Ne(S.source,S.from,S.sourceId,S.fromId),"Connection "+(R+1)+" source",160,{required:!0}),U=Le(Ne(S.target,S.to,S.targetId,S.toId),"Connection "+(R+1)+" target",160,{required:!0});if(!u.has(G))throw new Error("Connection "+(R+1)+' refers to missing component "'+G+'".');if(!u.has(U))throw new Error("Connection "+(R+1)+' refers to missing component "'+U+'".');let ae=Le(Ne(S.id,S.key,u_("edge",R)),"Connection "+(R+1)+" ID",160,{required:!0});if(l.has(ae))throw new Error('Duplicate connection ID: "'+ae+'". Each connection needs a unique ID.');return l.add(ae),{id:ae,source:G,target:U,label:Le(Ne(S.label,S.name,S.relationship),"Connection "+ae+" label",100),type:Le(Ne(S.type,S.kind),"Connection "+ae+" type",60)}}),f={name:Le(Ne(s.name,s.title,t.projectName,"Imported architecture"),"Project name",120,{required:!0}),description:Le(Ne(s.description,s.tagline,s.summary,t.description),"Project description",500),type:Le(Ne(s.type,s.category,s.kind,t.projectType,"Software project"),"Project type",60)},C=Number(Ne(t.schemaVersion,t.version,1));if(!Number.isInteger(C)||C!==1)throw new Error("Schema version "+String(Ne(t.schemaVersion,t.version))+" is not supported. This viewer accepts version 1.");return{schemaVersion:C,project:f,nodes:c,edges:h}}function l_(n,e=2){return JSON.stringify({schemaVersion:1,project:n.project,nodes:n.nodes,edges:n.edges},null,e)}var lt=Object.freeze({maxGraphBytes:2097152,maxChunkBytes:288*1024,maxChunkCount:8,workspaceIdBytes:16,maxWorkspaceName:120,maxProjectType:60,maxNodes:gt.nodes,maxEdges:gt.edges}),mf=new TextEncoder,Cf=/^[A-Za-z0-9_-]{22}$/,Re=class extends Error{constructor(e,t="invalid-data",r={}){super(e,r),this.name="CloudModelError",this.code=t}};function en(n){if(typeof n!="string"||!Cf.test(n))throw new Re("This online workspace link is invalid.","invalid-id");return n}function Ef(n=globalThis.crypto){if(!n||typeof n.getRandomValues!="function")throw new Re("Secure random IDs are unavailable in this browser.","crypto-unavailable");let e=new Uint8Array(lt.workspaceIdBytes);n.getRandomValues(e);let t="";for(let s of e)t+=String.fromCharCode(s);let r=globalThis.btoa(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");return en(r)}function bA(n,e=""){let t=n??e;if(typeof t!="string")throw new Re("Workspace name must be text.","invalid-name");let r=t.trim();if(!r)throw new Re("Workspace name is required.","invalid-name");if(r.length>lt.maxWorkspaceName)throw new Re("Workspace name must be "+lt.maxWorkspaceName+" characters or fewer.","invalid-name");return r}function SA(n,e){let t=[],r=[],s=0,i=()=>{r.length&&(t.push({text:r.join(""),byteLength:s}),r=[],s=0)};for(let o of n){let c=mf.encode(o).byteLength;if(c>e)throw new Re("A text character exceeds the cloud chunk limit.","chunk-too-large");s+c>e&&i(),r.push(o),s+=c}return i(),t.length||t.push({text:"",byteLength:0}),t.map((o,c)=>({index:c,...o}))}function _f(n,{name:e}={}){let t;try{t=gf(n,{allowEmpty:!0})}catch(o){throw new Re(o.message,"invalid-graph",{cause:o})}e!==void 0&&(t.project.name=bA(e,t.project.name));let r=l_(t,2),s=mf.encode(r).byteLength;if(s>lt.maxGraphBytes)throw new Re("This graph exceeds Atlas's 2 MiB online workspace limit. Shorten optional details or reduce the map before saving.","graph-too-large");let i=SA(r,lt.maxChunkBytes);if(i.length>lt.maxChunkCount)throw new Re("This graph needs too many cloud chunks to save safely.","too-many-chunks");return Object.freeze({graph:t,json:r,byteLength:s,chunkCount:i.length,chunks:Object.freeze(i.map(o=>Object.freeze(o)))})}function wf({chunks:n,chunkCount:e,byteLength:t}){if(!Number.isInteger(e)||e<1||e>lt.maxChunkCount)throw new Re("The online workspace has an invalid chunk count.","invalid-metadata");if(!Number.isInteger(t)||t<1||t>lt.maxGraphBytes)throw new Re("The online workspace has an invalid size.","invalid-metadata");if(!Array.isArray(n)||n.length!==e)throw new Re("The online workspace is missing one or more graph chunks.","missing-chunk");let r=0,s=[];for(let c=0;c<e;c+=1){let u=n[c];if(!u||u.index!==c||typeof u.text!="string")throw new Re("The online workspace graph chunks are out of order.","invalid-chunk");let l=mf.encode(u.text).byteLength;if(l>lt.maxChunkBytes)throw new Re("The online workspace contains an oversized graph chunk.","chunk-too-large");if(r+=l,r>lt.maxGraphBytes)throw new Re("The online workspace graph exceeds the 2 MiB limit.","graph-too-large");s.push(u.text)}if(r!==t)throw new Re("The online workspace graph size does not match its metadata.","invalid-size");let i=s.join(""),o;try{o=gf(i,{allowEmpty:!0})}catch(c){throw new Re("The online workspace contains an invalid graph: "+c.message,"invalid-graph",{cause:c})}return Object.freeze({graph:o,json:i,byteLength:r,chunkCount:e})}function Ct(n,e){if(en(n),!e||typeof e!="object"||Array.isArray(e))throw new Re("The online workspace metadata is invalid.","invalid-metadata");let t=(c,u,l=!0)=>typeof c=="string"&&c.length<=u&&(!l||c.trim().length>0),r=(c,u,l)=>Number.isInteger(c)&&c>=u&&c<=l;if(e.schemaVersion!==1||typeof e.ownerId!="string"||!e.ownerId||typeof e.shared!="boolean"||typeof e.deleting!="boolean"||!t(e.name,lt.maxWorkspaceName)||!t(e.projectType,lt.maxProjectType)||!t(e.currentRevision,22)||!Cf.test(e.currentRevision)||!(e.previousRevision===null||typeof e.previousRevision=="string"&&Cf.test(e.previousRevision))||!r(e.chunkCount,1,lt.maxChunkCount)||!r(e.byteLength,1,lt.maxGraphBytes)||!r(e.nodeCount,0,lt.maxNodes)||!r(e.edgeCount,0,lt.maxEdges))throw new Re("The online workspace metadata is invalid or outside Atlas limits.","invalid-metadata");let s=c=>{if(c&&typeof c.toDate=="function"){let u=c.toDate();return Number.isFinite(u.getTime())?u.toISOString():null}return c instanceof Date&&Number.isFinite(c.getTime())?c.toISOString():typeof c=="string"&&Number.isFinite(Date.parse(c))?new Date(c).toISOString():null},i=s(e.createdAt),o=s(e.updatedAt);if(!i||!o)throw new Re("The online workspace timestamps are invalid.","invalid-metadata");return Object.freeze({id:n,schemaVersion:e.schemaVersion,ownerId:e.ownerId,shared:e.shared,deleting:e.deleting,name:e.name,projectType:e.projectType,currentRevision:e.currentRevision,previousRevision:e.previousRevision,chunkCount:e.chunkCount,byteLength:e.byteLength,nodeCount:e.nodeCount,edgeCount:e.edgeCount,createdAt:i,updatedAt:o})}function B_(n,e=globalThis.location?.href){let t=en(n);if(typeof e!="string"||!e)throw new Re("A browser URL is required to make a workspace link.","missing-base-url");let r;try{r=new URL("./workspace",e)}catch(s){throw new Re("The workspace link base URL is invalid.","invalid-base-url",{cause:s})}return r.search="",r.searchParams.set("view",t),r.hash="",r.href}var Vn=class extends Error{constructor(e,t){super(e),this.name="CloudQuotaError",this.code=t,this.status="error"}};function h_(n){if(!n)return[];let e=n.workspaceIds;if(n.schemaVersion!==1||!Array.isArray(e)||e.some(t=>typeof t!="string"||!/^[A-Za-z0-9_-]{22}$/.test(t))||new Set(e).size!==e.length)throw new Vn("Cloud Workspace usage could not be verified. Your maps are unchanged.","quota-invalid");return[...e]}function d_(n,e){let t=h_(n);if(t.includes(e))throw new Vn("This workspace ID is already registered. Retry the original map rather than creating a duplicate.","workspace-id-collision");if(t.length>=20)throw new Vn("You have reached the limit of 20 Cloud Workspaces. Delete a Cloud Workspace to make room, or keep this map locally.","workspace-limit");return[...t,e]}function f_(n,e){let t=h_(n);if(!n||!t.includes(e))throw new Vn("Cloud Workspace usage needs setup before this deletion can finish. Your stored map has not been removed.","quota-uninitialized");return t.filter(r=>r!==e)}var p_="atlas-online-workspaces",Mo="workspaces",he=class extends Error{constructor(e,t="cloud-error",{status:r="error",cause:s}={}){super(e,s?{cause:s}:void 0),this.name="CloudServiceError",this.code=t,this.status=r}},iu=class extends he{constructor(e,t){super("This workspace changed in another tab or device. Reload the online version before saving again.","conflict",{status:"conflict"}),this.name="CloudConflictError",this.expectedRevision=e,this.actualRevision=t}};function $e(n){if(n instanceof he)return n;if(n instanceof Vn)return new he(n.message,n.code,{cause:n});if(n instanceof Re)return new he(n.message,n.code,{status:"invalid",cause:n});let e=typeof n?.code=="string"?n.code:"cloud-error";return e==="auth/popup-blocked"?new he("Your browser blocked the Google sign-in popup. Allow popups for Atlas and try again.","popup-blocked",{status:"popup-blocked",cause:n}):e==="auth/popup-closed-by-user"||e==="auth/cancelled-popup-request"?new he("Google sign-in was cancelled.","cancelled",{status:"cancelled",cause:n}):e==="permission-denied"||e==="storage/unauthorized"?new he("You do not have permission to use this online workspace.","permission-denied",{status:"permission-denied",cause:n}):e==="not-found"||e==="auth/user-not-found"?new he("This online workspace no longer exists.","not-found",{status:"not-found",cause:n}):e==="unauthenticated"||e==="auth/user-token-expired"?new he("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated",cause:n}):["unavailable","deadline-exceeded","network-request-failed","auth/network-request-failed"].includes(e)?new he("Atlas cannot reach the online workspace service. Check your connection and try again.","offline",{status:"offline",cause:n}):new he(typeof n?.message=="string"&&n.message?n.message:"The online workspace request failed.",e,{status:"error",cause:n})}function RA(n){if(!n||typeof n.uid!="string"||!n.uid)return null;let e=t=>typeof t=="string"?t:"";return Object.freeze({uid:n.uid,displayName:e(n.displayName),email:e(n.email),photoURL:e(n.photoURL)})}function Ys(n){return Object.freeze({id:n.id,ownerId:n.ownerId,name:n.name,projectType:n.projectType,nodeCount:n.nodeCount,edgeCount:n.edgeCount,shared:n.shared,deleting:n.deleting,currentRevision:n.currentRevision,createdAt:n.createdAt,updatedAt:n.updatedAt})}function PA(n,{app:e,auth:t,db:r,persistenceReady:s,workspaceIdFactory:i=Ef,commitBatch:o,readWorkspaceFromServer:c}={}){let u=e;if(!u){if(u=Qp().find(p=>p.name===p_),u&&u.options.projectId!==n.projectId)throw new he("Atlas is already connected to a different Firebase project.","project-mismatch",{status:"configuration"});u||(u=ju(n,p_))}let l=t||ml(u,{persistence:[Dl,wl],popupRedirectResolver:Tl}),h=r;if(!h)try{h=of(u,{localCache:o_()})}catch(p){if(p?.code!=="failed-precondition"&&p?.code!=="already-initialized")throw p;h=af(u)}let f=s??l.authStateReady(),C=p=>c_({auth:l,persistenceReady:f,uid:p}),v=typeof o=="function"?o:p=>p.commit(),R=typeof c=="function"?c:ru,S=p=>zs(h,Mo,p),G=p=>zs(h,"workspaceQuota",p),U=(p,O)=>zs(h,Mo,p,"revisions",O),ae=(p,O)=>Ks(U(p,O),"chunks"),Ee=(p,O,K)=>zs(ae(p,O),String(K)),_e=new TextEncoder,Oe=p=>({index:p.index,payload:Ut.fromUint8Array(_e.encode(p.text))}),we=()=>new Date().toISOString();function A({uid:p,encoded:O,revision:K,previousRevision:W,shared:Q,createdAt:re}){let $=hr();return{schemaVersion:1,ownerId:p,shared:Q,deleting:!1,name:O.graph.project.name,projectType:O.graph.project.type,currentRevision:K,previousRevision:W,chunkCount:O.chunkCount,byteLength:O.byteLength,nodeCount:O.graph.nodes.length,edgeCount:O.graph.edges.length,createdAt:re||$,updatedAt:$}}function m(p,O,K=we()){return{id:p,schemaVersion:O.schemaVersion,ownerId:O.ownerId,shared:O.shared,deleting:O.deleting,name:O.name,projectType:O.projectType,currentRevision:O.currentRevision,previousRevision:O.previousRevision,chunkCount:O.chunkCount,byteLength:O.byteLength,nodeCount:O.nodeCount,edgeCount:O.edgeCount,createdAt:O.createdAt&&typeof O.createdAt.toDate=="function"?O.createdAt.toDate().toISOString():O.createdAt||K,updatedAt:O.updatedAt&&typeof O.updatedAt.toDate=="function"?O.updatedAt.toDate().toISOString():O.updatedAt||K}}async function w(p,O,K,W){let Q=Array.from({length:W},(re,$)=>Ee(O,K,$));return Promise.all(Q.map(re=>p.get(re)))}function I(p){return p.docs.map(O=>Ct(O.id,O.data()))}async function D(p,O){let K=Array.from({length:O.chunkCount},($,pe)=>Ee(p,O.currentRevision,pe)),Q=(await Promise.all(K.map($=>ru($)))).map(($,pe)=>{if(!$.exists())throw new he("The online workspace is missing a graph chunk.","missing-chunk",{status:"invalid"});let le=$.data();if(!le.payload||typeof le.payload.toUint8Array!="function")throw new he("The online workspace contains an invalid graph chunk.","invalid-chunk",{status:"invalid"});let oe;try{oe=new TextDecoder("utf-8",{fatal:!0}).decode(le.payload.toUint8Array())}catch(ue){throw new he("The online workspace contains invalid UTF-8 graph data.","invalid-chunk",{status:"invalid",cause:ue})}return{index:le.index,text:oe}}),re=wf({chunks:Q,chunkCount:O.chunkCount,byteLength:O.byteLength});if(re.graph.nodes.length!==O.nodeCount||re.graph.edges.length!==O.edgeCount)throw new he("The online workspace graph counts do not match its metadata.","count-mismatch",{status:"invalid"});return re}function y(p,O,K){let W=S(O),Q=!1,re=0,$=oe=>{Q||K(oe)},pe=async(oe,ue)=>{if(Q||ue!==re)return;if(oe.metadata?.fromCache){$({status:"loading"});return}if(oe.metadata?.hasPendingWrites){$({status:"loading"});return}if(!oe.exists()){$({status:"deleted"});return}let Be;try{Be=Ct(O,oe.data())}catch(mt){$({status:"error",error:$e(mt)});return}let Ke=Be.ownerId===l.currentUser?.uid;if(!Be.shared&&!Ke){$({status:"revoked"});return}try{let mt=await D(O,Be);if(Q||ue!==re)return;let Jt=await ru(W);if(!Jt.exists()){$({status:"deleted"});return}let It=Ct(O,Jt.data()),Go=It.ownerId===l.currentUser?.uid;if(!It.shared&&!Go){$({status:"revoked"});return}if(It.currentRevision!==Be.currentRevision||It.chunkCount!==Be.chunkCount||It.byteLength!==Be.byteLength){$({status:"loading"});return}$({status:"ready",metadata:Be,chunks:mt})}catch(mt){if(Q||ue!==re)return;let Jt=$e(mt);$({status:Jt.status==="permission-denied"?"revoked":"error",error:Jt})}},le=su(C(p),()=>df(W,{includeMetadataChanges:!0},oe=>{re+=1,pe(oe,re)},oe=>{let ue=$e(oe);$({status:ue.status==="permission-denied"?"revoked":ue.status,error:ue})}),oe=>{let ue=$e(oe);$({status:ue.status==="permission-denied"?"revoked":ue.status,error:ue})});return()=>{Q=!0,re+=1,le()}}return{observeAuth:p=>su(f,()=>El(l,O=>p(O),O=>p(null,O)),O=>p(null,O)),signInGoogle:async()=>{await f;let p=new Tr;return p.setCustomParameters({prompt:"select_account"}),Il(l,p)},signOut:async()=>(await f,_l(l)),listWorkspaces:async p=>{await C(p);let O=tu(Ks(h,Mo),nu("ownerId","==",p)),K=await hf(O),W=I(K);return K.metadata?.fromCache?{status:"offline",workspaces:W}:{status:"ready",workspaces:W}},watchOwnedWorkspaces:(p,O)=>{let K=tu(Ks(h,Mo),nu("ownerId","==",p));return su(C(p),()=>df(K,{includeMetadataChanges:!0},W=>{if(W.metadata?.fromCache||W.metadata?.hasPendingWrites){O({status:"loading",workspaces:[]});return}try{O({status:"ready",workspaces:I(W)})}catch(Q){O({status:"error",error:$e(Q)})}},W=>O({status:"error",error:$e(W)})),W=>O({status:"error",error:$e(W)}))},createWorkspace:async(p,O,K="")=>{await C(p);let W=K?en(K):"",Q=async pe=>{await C(p);let le=i(),oe=S(pe),ue=A({uid:p,encoded:O,revision:le,previousRevision:null,shared:!1});return await v({commit:()=>Qs(h,async Be=>{let Ke=await Be.get(G(p));if(!Ke.exists()&&!(await hf(tu(Ks(h,Mo),nu("ownerId","==",p)))).empty)throw new Vn("Cloud Workspace usage needs setup for this account. Existing maps are unchanged; keep this new map locally for now.","quota-uninitialized");let mt=Ke.exists()?Ke.data():null,Jt=d_(mt,pe);for(let It of O.chunks)Be.set(Ee(pe,le,It.index),Oe(It));Be.set(oe,ue),Be.set(G(p),{schemaVersion:1,workspaceIds:Jt,lastWorkspaceId:pe,lastAction:"create",createdAt:mt?.createdAt||hr(),updatedAt:hr()})})}),m(pe,{...ue,createdAt:we(),updatedAt:we()})};if(!W){for(let pe=0;pe<3;pe+=1){let le=i();try{return await Q(le)}catch(oe){if(!["permission-denied","workspace-id-collision"].includes(oe?.code)||pe===2)throw oe}}throw new he("A new online workspace could not be created.","create-failed",{status:"error"})}let re=async()=>{await C(p);let pe=await R(S(W));if(await C(p),!pe.exists())return null;let le=Ct(W,pe.data());if(le.ownerId!==p)throw new he("This workspace ID is already in use by a different account. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});let oe=await D(W,le);if(await C(p),oe.json!==O.json)throw new he("This workspace ID already contains a different map. Nothing was overwritten.","workspace-id-collision",{status:"conflict"});return m(W,pe.data())},$=null;for(let pe=0;pe<2;pe+=1)try{return await Q(W)}catch(le){if($=le,["workspace-limit","quota-uninitialized","quota-invalid"].includes(le?.code))throw le;try{let oe=await re();if(oe)return oe}catch(oe){if(oe?.code==="workspace-id-collision")throw oe;if(pe===1)throw $}}throw $||new he("A new online workspace could not be created.","create-failed",{status:"error"})},saveWorkspace:async(p,O,K,W)=>{await C(p);let Q=S(O),re=Ef();return Qs(h,async $=>{let pe=await $.get(Q);if(!pe.exists())throw new he("This online workspace no longer exists.","not-found",{status:"not-found"});let le=pe.data(),oe=Ct(O,le);if(oe.ownerId!==p)throw new he("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(oe.currentRevision!==W)throw new iu(W,oe.currentRevision);if(oe.deleting)throw new he("This workspace is being deleted. Retry deletion from the owner library.","delete-in-progress",{status:"delete-in-progress"});let ue=await w($,O,oe.currentRevision,oe.chunkCount),Be=A({uid:p,encoded:K,revision:re,previousRevision:oe.currentRevision,shared:oe.shared,createdAt:le.createdAt});for(let Ke of K.chunks)$.set(Ee(O,re,Ke.index),Oe(Ke));for(let Ke=0;Ke<ue.length;Ke+=1)ue[Ke].exists()&&$.delete(Ee(O,oe.currentRevision,Ke));return $.update(Q,Be),m(O,{...Be,createdAt:oe.createdAt,updatedAt:we()})})},watchWorkspace:y,deleteWorkspace:async(p,O)=>{await C(p);let K=S(O),W=!1;try{await Qs(h,async Q=>{let re=await Q.get(K);if(!re.exists())return;let $=Ct(O,re.data());if($.ownerId!==p)throw new he("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if($.deleting){if($.shared)throw new he("This workspace has an inconsistent deletion state. Contact support before retrying.","invalid-delete-state",{status:"invalid"});return}Q.update(K,{shared:!1,deleting:!0,updatedAt:hr()})}),W=!0,await Qs(h,async Q=>{let re=await Q.get(K);if(!re.exists())return;let $=Ct(O,re.data());if($.ownerId!==p)throw new he("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if(!$.deleting||$.shared)throw new he("The workspace is no longer in a safe state for deletion.","invalid-delete-state",{status:"invalid"});let pe=await Q.get(G(p)),le=pe.exists()?pe.data():null,oe=f_(le,O),ue=await w(Q,O,$.currentRevision,$.chunkCount);for(let Be=0;Be<ue.length;Be+=1)ue[Be].exists()&&Q.delete(Ee(O,$.currentRevision,Be));Q.delete(K),Q.update(G(p),{workspaceIds:oe,lastWorkspaceId:O,lastAction:"delete",updatedAt:hr()})})}catch(Q){throw W?new he("Sharing was revoked, but deletion did not finish. Retry deletion to remove the stored graph.","delete-incomplete",{status:"delete-incomplete",cause:Q}):Q}},setShared:async(p,O,K)=>{await C(p);let W=S(O);return await Qs(h,async Q=>{let re=await Q.get(W);if(!re.exists())throw new he("This online workspace no longer exists.","not-found",{status:"not-found"});let $=Ct(O,re.data());if($.ownerId!==p)throw new he("You do not own this online workspace.","permission-denied",{status:"permission-denied"});if($.deleting)throw new he("This workspace is being deleted and cannot be shared.","delete-in-progress",{status:"delete-in-progress"});Q.update(W,{shared:!!K,updatedAt:hr()})}),!!K},getCurrentUser:()=>l.currentUser}}function NA(){let n=()=>Promise.reject(new he("Online workspaces are not configured in this build.","disabled",{status:"disabled"}));return{observeAuth:e=>(queueMicrotask(()=>e(null)),()=>{}),signInGoogle:n,signOut:n,listWorkspaces:n,watchOwnedWorkspaces:(e,t)=>(queueMicrotask(()=>t({status:"disabled",workspaces:[]})),()=>{}),createWorkspace:n,saveWorkspace:n,watchWorkspace:(e,t,r)=>(queueMicrotask(()=>r({status:"error",error:new he("Online workspaces are not configured in this build.","disabled",{status:"disabled"})})),()=>{}),deleteWorkspace:n,setShared:n,getCurrentUser:()=>null}}function OA({config:n=Vo,app:e,auth:t,db:r,adapter:s,baseUrl:i}={}){let o=pf(n),c;s?c=s:o.enabled?c=PA(n,{app:e,auth:t,db:r}):c=NA();let u=null,l=!1,h=null,f=0,C,v=new Promise(y=>{C=y}),R=new Set,S=new Set,G=new Set,U=()=>RA(u),ae=y=>{try{y(U(),h)}catch{}},Ee=(y,p=null)=>{h=p?$e(p):null;let O=u?.uid||null,K=l;u=!h&&y&&typeof y.uid=="string"?y:null,l=!0;let W=u?.uid||null;(!K||O!==W)&&(f+=1),C(U());for(let Q of R)ae(Q);if(K&&O!==W){for(let Q of S)Q.restart();for(let Q of G)Q.restart()}else if(!K){for(let Q of S)Q.restart();for(let Q of G)Q.restart()}},_e=()=>{};try{_e=c.observeAuth((y,p)=>Ee(y,p))}catch(y){Ee(null,y)}let Oe=async()=>(l||await v,u),we=async()=>{let y=await Oe();if(h)throw h;if(!y||typeof y.uid!="string"||!y.uid)throw new he("Sign in to manage your online workspaces.","unauthenticated",{status:"unauthenticated"});return{user:y,uid:y.uid,epoch:f}},A=y=>{if(f!==y.epoch||u?.uid!==y.uid)throw new he("Your account changed while the request was running. Retry it from the current account.","account-changed",{status:"unauthenticated"})};function m(y,p=()=>{}){if(typeof y!="function")throw new TypeError("Auth observer callback must be a function.");let O=(K,W)=>{W?p(W):y(K)};return R.add(O),l&&ae(O),()=>R.delete(O)}function w(y){if(typeof y!="function")throw new TypeError("Workspace observer callback must be a function.");let p=!1,O=()=>{},K=0,W=re=>{if(!p)try{y(re)}catch{}},Q={restart:async()=>{K+=1;let re=K;O(),O=()=>{};let $=await Oe();if(p||K!==re)return;if(!$?.uid){W({status:"unauthenticated",workspaces:[]});return}let pe=f;try{O=c.watchOwnedWorkspaces($.uid,le=>{if(!(p||K!==re||pe!==f)){if(le?.status==="error"){W({status:"error",error:$e(le.error),workspaces:[]});return}if(le?.status==="loading"){W({status:"loading",workspaces:Array.isArray(le.workspaces)?le.workspaces:[]});return}if(le?.status==="offline"){W({status:"offline",workspaces:Array.isArray(le.workspaces)?le.workspaces:[]});return}try{let oe=Array.isArray(le?.workspaces)?le.workspaces.map(ue=>Ys(ue?.id?Ct(ue.id,ue):Ct(ue?.id,ue?.data))):[];W({status:"ready",workspaces:oe})}catch(oe){W({status:"error",error:$e(oe),workspaces:[]})}}})}catch(le){W({status:$e(le).status,error:$e(le),workspaces:[]})}},stop:()=>{p=!0,K+=1,O(),S.delete(Q)}};return S.add(Q),Q.restart(),Q.stop}function I(y,p){let O=en(y?.workspaceId||y?.sharedId);if(typeof p!="function")throw new TypeError("Workspace observer callback must be a function.");let K=!1,W=()=>{},Q=0,re=pe=>{if(!K)try{p(pe)}catch{}},$={restart:async()=>{Q+=1;let pe=Q;W(),W=()=>{};let le=await Oe();if(K||Q!==pe)return;let oe=f;re({status:"loading"});try{W=c.watchWorkspace(le?.uid||null,O,ue=>{if(!(K||Q!==pe||oe!==f)){if(ue?.status==="ready"){try{let Be=Ct(O,ue.metadata),Ke=Be.ownerId===u?.uid;if(!Be.shared&&!Ke){re({status:"revoked"});return}let mt=ue.chunks?.graph?ue.chunks:wf({chunks:ue.chunks,chunkCount:Be.chunkCount,byteLength:Be.byteLength});re({status:"ready",workspace:Ys(Be),graph:mt.graph})}catch(Be){re({status:"error",error:$e(Be)})}return}if(ue?.status==="error"){let Be=$e(ue.error);re({status:Be.status==="permission-denied"?"revoked":Be.status,error:Be});return}if(["deleted","revoked","offline","loading","unauthenticated","disabled"].includes(ue?.status)){re({status:ue.status,error:ue.error?$e(ue.error):void 0});return}re({status:"error",error:new he("The online workspace returned an unknown status.","invalid-response",{status:"error"})})}})}catch(ue){let Be=$e(ue);re({status:Be.status,error:Be})}},stop:()=>{K=!0,Q+=1,W(),G.delete($)}};return G.add($),$.restart(),$.stop}let D=async y=>{try{let p=await we(),O=await y(p);return A(p),O}catch(p){throw $e(p)}};return Object.freeze({configStatus:o,onAuthStateChanged:m,signInWithGoogle:async()=>{try{let y=await c.signInGoogle();return Ee(y?.user||y),U()}catch(y){throw $e(y)}},signOut:async()=>{try{await c.signOut(),Ee(null)}catch(y){throw $e(y)}},listWorkspaces:()=>D(async({uid:y})=>{let p=await c.listWorkspaces(y);if(p?.status==="offline")return Object.freeze({status:"offline",workspaces:Array.isArray(p.workspaces)?p.workspaces:[]});let O=Array.isArray(p?.workspaces)?p.workspaces.map(K=>Ys(K?.id?Ct(K.id,K):Ys(K))):[];return Object.freeze({status:"ready",workspaces:O})}),watchOwnedWorkspaces:w,createWorkspace:({name:y,graph:p,workspaceId:O,expectedOwnerUid:K}={})=>D(async({uid:W})=>{if(K&&String(K)!==W)throw new he("Your account changed before this map could be saved. Sign in to the account that started the save and retry.","account-changed",{status:"unauthenticated"});let Q=_f(p,{name:y}),re=O?en(O):"",$=await c.createWorkspace(W,Q,re);return Ys(Ct($.id,$))}),saveWorkspace:({workspaceId:y,graph:p,expectedRevision:O}={})=>D(async({uid:K})=>{let W=en(y),Q=en(O),re=_f(p),$=await c.saveWorkspace(K,W,re,Q);return Ys(Ct(W,$))}),watchWorkspace:I,deleteWorkspace:y=>D(async({uid:p})=>{let O=en(y);await c.deleteWorkspace(p,O)}),setShared:({workspaceId:y,enabled:p}={})=>D(async({uid:O})=>{let K=en(y);if(typeof p!="boolean")throw new he("Sharing state must be enabled or disabled.","invalid-sharing-state",{status:"invalid"});if(!await c.setShared(O,K,p))return null;let Q=i||globalThis.location?.href;return Object.freeze({sharedId:K,viewUrl:B_(K,Q)})}),dispose:()=>{for(let y of S)y.stop();for(let y of G)y.stop();R.clear(),_e()}})}export{iu as CloudConflictError,he as CloudServiceError,OA as createCloudService,Vo as firebaseConfig,pf as getCloudConfigStatus,ff as isCloudConfigured};
