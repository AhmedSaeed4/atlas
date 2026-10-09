'use strict';

const childProcess = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const trace = process.env.ATLAS_CLOUD_RULES_TRACE === '1';
if (trace) console.error(`[cloud rules preload] active in PID ${process.pid}`);

function isJava(command) {
  const executable = path.basename(String(command)).toLowerCase();
  return executable === 'java' || executable === 'java.exe';
}
function isFirestoreEmulator(args) {
  return Array.isArray(args)
    && args.some((argument) => /cloud-firestore-emulator[^\\/]*\.jar/i.test(String(argument)));
}

for (const method of ['spawn', 'spawnSync']) {
  const original = childProcess[method];
  childProcess[method] = function hideJavaWindows(command, args, options) {
    if (!isJava(command)) {
      return Reflect.apply(original, this, arguments);
    }
    const isFirestore = isFirestoreEmulator(args);
    const windowsOptions = { windowsHide: true, ...(isFirestore ? { detached: false } : {}) };
    let child;
    if (Array.isArray(args)) {
      child = Reflect.apply(original, this, [command, args, { ...(options || {}), ...windowsOptions }]);
    } else {
      child = Reflect.apply(original, this, [command, { ...(args || {}), ...windowsOptions }]);
    }
    if (isFirestore && child.pid && process.env.ATLAS_CLOUD_RULES_PID_FILE) {
      fs.appendFileSync(process.env.ATLAS_CLOUD_RULES_PID_FILE, `${child.pid}\n`);
    }
    if (trace && isFirestore) console.error(`[cloud rules preload] spawned emulator process PID ${child.pid} from CLI PID ${process.pid}; detached=${windowsOptions.detached}, windowsHide=${windowsOptions.windowsHide}`);
    return child;
  };
}
