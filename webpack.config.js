const path = require('path')

const SRC_DIR = path.resolve(__dirname, 'src', 'functions')
const OUT_DIR = path.resolve(__dirname, 'build')

const config = {
  entry: {
    helloWorld: path.resolve(SRC_DIR, 'helloWorld'),
    authorizer: path.resolve(SRC_DIR, 'authorizer'),
  },
  mode: 'development',
  output: {
    path: OUT_DIR,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  target: 'node'
}

module.exports = config
