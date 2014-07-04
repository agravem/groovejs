module.exports = Tokenizer;

function token(type, text) {
  return { type: type, text: text };
}

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

function Tokenizer(input) {
  this.input = input;
  this.p = 0;
  this.c = input[this.p];
}

Tokenizer.prototype.nextToken = function() {
  while(this.c != '') {
    switch(this.c) {
      case ' ': case '\t': case '\n': case '\r': this.WS(); continue;
      case '/': return this.PATH();
      case '?': case '&': return this.QUERY();
      default:
        if(isLetter(this.c)) return this.VERB();
        else throw new Error("invalid character " + this.c);
    }
  }

  return token('EOF', '');
}

Tokenizer.prototype.VERB = function() {
  var buffer = "";
  while(isLetter(this.c)) { buffer += this.c; this.consume(); }
  return token('VERB', buffer);
}

Tokenizer.prototype.WS = function() {
  while(/\s/.test(this.c)) this.consume();
}

Tokenizer.prototype.PATH = function(){
  var buffer = "/"; this.consume();
  while(/[^\/?&]/.test(this.c)) { buffer += this.c; this.consume(); }
  return token('PATH', buffer);
}

Tokenizer.prototype.QUERY = function() {
  this.consume();
  var buffer = "";
  while(/[a-zA-Z0-9\-_=:,\.]/.test(this.c)) { buffer += this.c; this.consume(); }
  return token('QUERY', buffer);
}

Tokenizer.prototype.consume = function() {
  this.p++;
  if (this.p >= this.input.length) this.c = '';
  else this.c = this.input[this.p];
}

Tokenizer.prototype.tokens = function() {
  var data  = { verb: '', path: [], query: {}};
  var token = {};

  while(true) {
    token = this.nextToken();
    if(token.type === 'EOF') break;
    switch(token.type) {
    case 'VERB': data.verb = token.text; break;
    case 'PATH': data.path.push(token.text); break;
    case 'QUERY':
      var query = token.text.split('=');
      data.query[query[0]] = query[1];
      break;
    }
  }

  return data;
}
