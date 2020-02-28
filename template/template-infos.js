const path = require('path');

module.exports = [
  {
    name: 'js-spa',
    desc: 'javascript single page app',
    extraFiles: [
      path.resolve(__dirname, './js-spa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/js/'),
    ],
  },
  {
    name: 'ts-spa',
    desc: 'typescript single page app',
    extraFiles: [
      path.resolve(__dirname, './ts-spa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/ts/'),
    ],
  },
  {
    name: 'js-mpa',
    desc: 'javascript multiple page app',
    extraFiles: [
      path.resolve(__dirname, './js-mpa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/js/'),
    ],
  },
  {
    name: 'ts-mpa',
    desc: 'typescript multiple page app',
    extraFiles: [
      path.resolve(__dirname, './ts-mpa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/ts/'),
    ],
  },
];
