const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules
const output = execSync('heroku pg:backups:restore b001 --confirm  dry-sands-45238', { encoding: 'utf-8' });  // the default is 'buffer'
console.log('Output was:\n', output);