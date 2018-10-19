document.body.onload = init;

function init() {
  var root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  require('./index.es6');
}
