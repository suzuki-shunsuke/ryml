#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const axios = require('axios');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const minimist = require('minimist');

const handleParams = (text, argv) => {
  let data = {};
  if (!argv.quiet) {
    try {
      data = yaml.safeLoad(text);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
    console.log(`cat << END | ryml\n${yaml.safeDump(data)}END\n`);
  }

  for (const envName in process.env) {
    text = text.replace(`$(${envName})`, process.env[envName]);
  }
  try {
    data = yaml.safeLoad(text);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  if (!data.method) {
    console.error('method is required.');
    process.exit(1);
  }
  if (!data.url) {
    console.error('url is required.');
    process.exit(1);
  }
  if (['get', 'post', 'put', 'delete', 'head', 'options', 'patch'].indexOf(data.method) === -1) {
    console.error(`invalid method: ${data.method}`);
    process.exit(1);
  }
  axios(data).then(resp => {
    console.log(JSON.stringify(resp.data));
  }).catch(err => {
    console.error(JSON.stringify(err.response.data));
    process.exit(1);
  });
};

if (!module.parent) {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      v: 'version', h: 'help', q: 'quiet',
    },
  });
  if (argv.help) {
    try {
      const help = fs.readFileSync(path.join(__dirname, 'HELP.txt'), 'utf8');
      console.log(help);
      process.exit(0);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  } else if (argv.version) {
    console.log(require('./package.json').version);
  } else {
    if (process.stdin.isTTY) {
      fs.readFile(path.join(__dirname, 'template.yml'), (err, tmpl) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        inquirer.prompt([{
          type: 'editor',
          name: 'parameter',
          message: 'Please write request parameters with yaml.',
          default: tmpl,
        }]).then(answers => {
          if (!answers.parameter) {
            process.exit(0);
          }
          handleParams(answers.parameter, argv);
        });
      });
    } else {
      let text = '';
      process.stdin.on('data', chunk => {
        text += chunk;
      });
      process.stdin.on('end', () => {
        handleParams(text, argv);
      });
    }
  }
}
