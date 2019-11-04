const path = require('path');

module.exports = [
  {
    name: 'js-spa',
    desc: 'javascript单页应用',
    extraFiles: [
      path.resolve(__dirname, './js-spa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/js/'),
    ],
  },
  {
    name: 'ts-spa',
    desc: 'typescript单页应用',
    extraFiles: [
      path.resolve(__dirname, './ts-spa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/ts/'),
    ],
  },
  {
    name: 'js-mpa',
    desc: 'javascript多页应用',
    extraFiles: [
      path.resolve(__dirname, './js-mpa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/js/'),
    ],
  },
  {
    name: 'ts-mpa',
    desc: 'typescript多页应用',
    extraFiles: [
      path.resolve(__dirname, './ts-mpa/'),
      path.resolve(__dirname, './share/common/'),
      path.resolve(__dirname, './share/ts/'),
    ],
  },
];
