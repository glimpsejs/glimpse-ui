import config from 'app.json';
import path from 'path';

module.exports = {
  output: path.join(__dirname, config.output)
};