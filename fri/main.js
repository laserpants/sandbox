(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? elm$core$Result$Ok(value)
		: (value instanceof String)
			? elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done(elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done(elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done(elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? elm$http$Http$GoodStatus_ : elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return elm$core$Dict$empty;
	}

	var headers = elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(elm$core$Dict$update, key, function(oldValue) {
				return elm$core$Maybe$Just(elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? elm$core$Maybe$Just(event.total) : elm$core$Maybe$Nothing
		}))));
	});
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		out.push(A4(elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		return replacer(A4(elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return elm$core$Maybe$Nothing;
	}
}var author$project$Main$RouterMsg = function (a) {
	return {$: 'RouterMsg', a: a};
};
var author$project$Main$UrlChange = function (a) {
	return {$: 'UrlChange', a: a};
};
var author$project$Main$UrlRequest = function (a) {
	return {$: 'UrlRequest', a: a};
};
var author$project$Main$FetchNotifications = {$: 'FetchNotifications'};
var author$project$Main$NoPage = {$: 'NoPage'};
var author$project$Main$State = F4(
	function (router, ui, session, page) {
		return {page: page, router: router, session: session, ui: ui};
	});
var author$project$Main$UiMsg = function (a) {
	return {$: 'UiMsg', a: a};
};
var author$project$Data$Notification$Notification = F3(
	function (id, message, time) {
		return {id: id, message: message, time: time};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$List$cons = _List_cons;
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Basics$False = {$: 'False'};
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var elm$core$Basics$True = {$: 'True'};
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$int = _Json_decodeInt;
var elm$json$Json$Decode$map3 = _Json_map3;
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$Data$Notification$decoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Data$Notification$Notification,
	A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'message', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'time', elm$json$Json$Decode$int));
var author$project$Data$Project$Project = F3(
	function (id, name, country) {
		return {country: country, id: id, name: name};
	});
var author$project$Data$Project$decoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Data$Project$Project,
	A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'country', elm$json$Json$Decode$string));
var author$project$Data$Session$Session = F3(
	function (user, project, notifications) {
		return {notifications: notifications, project: project, user: user};
	});
var author$project$Data$User$User = F5(
	function (id, email, login, name, rememberMe) {
		return {email: email, id: id, login: login, name: name, rememberMe: rememberMe};
	});
var elm$json$Json$Decode$bool = _Json_decodeBool;
var elm$json$Json$Decode$map5 = _Json_map5;
var author$project$Data$User$decoder = A6(
	elm$json$Json$Decode$map5,
	author$project$Data$User$User,
	A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'email', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'login', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'rememberMe', elm$json$Json$Decode$bool));
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$json$Json$Decode$maybe = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder),
				elm$json$Json$Decode$succeed(elm$core$Maybe$Nothing)
			]));
};
var author$project$Data$Session$decoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Data$Session$Session,
	A2(elm$json$Json$Decode$field, 'user', author$project$Data$User$decoder),
	elm$json$Json$Decode$maybe(
		A2(elm$json$Json$Decode$field, 'project', author$project$Data$Project$decoder)),
	A2(
		elm$json$Json$Decode$field,
		'notifications',
		elm$json$Json$Decode$list(author$project$Data$Notification$decoder)));
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var author$project$Main$initSession = function (_n0) {
	var session = _n0.session;
	var _n1 = A2(elm$json$Json$Decode$decodeString, author$project$Data$Session$decoder, session);
	if (_n1.$ === 'Ok') {
		var result = _n1.a;
		return elm$core$Maybe$Just(result);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Update$Deep$save = function (model) {
	return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, _List_Nil);
};
var author$project$Main$routerInit = function (key) {
	return author$project$Update$Deep$save(
		{key: key, route: elm$core$Maybe$Nothing});
};
var author$project$Main$Closed = {$: 'Closed'};
var author$project$Main$HttpGet = {$: 'HttpGet'};
var author$project$Main$NotificationsApiMsg = function (a) {
	return {$: 'NotificationsApiMsg', a: a};
};
var author$project$Main$NotificationsModalMsg = function (a) {
	return {$: 'NotificationsModalMsg', a: a};
};
var author$project$Main$UiState = F5(
	function (sidebarVisible, userDropdownStatus, notifsDropdownStatus, notificationsModal, notifications) {
		return {notifications: notifications, notificationsModal: notificationsModal, notifsDropdownStatus: notifsDropdownStatus, sidebarVisible: sidebarVisible, userDropdownStatus: userDropdownStatus};
	});
var author$project$Main$NotRequested = {$: 'NotRequested'};
var author$project$Main$Response = function (a) {
	return {$: 'Response', a: a};
};
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === 'RBNode_elm_builtin') {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === 'RBNode_elm_builtin') {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === 'RBNode_elm_builtin') {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var elm$http$Http$Timeout_ = {$: 'Timeout_'};
var elm$http$Http$emptyBody = _Http_emptyBody;
var elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return elm$core$Result$Err(
				f(e));
		}
	});
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			elm$core$Basics$identity,
			A2(elm$core$Basics$composeR, toResult, toMsg));
	});
var elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var elm$http$Http$NetworkError = {$: 'NetworkError'};
var elm$http$Http$Timeout = {$: 'Timeout'};
var elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return elm$core$Result$Err(
					elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return elm$core$Result$Err(elm$http$Http$Timeout);
			case 'NetworkError_':
				return elm$core$Result$Err(elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return elm$core$Result$Err(
					elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					elm$core$Result$mapError,
					elm$http$Http$BadBody,
					toResult(body));
		}
	});
var elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			elm$http$Http$expectStringResponse,
			toMsg,
			elm$http$Http$resolve(
				function (string) {
					return A2(
						elm$core$Result$mapError,
						elm$json$Json$Decode$errorToString,
						A2(elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var elm$http$Http$init = elm$core$Task$succeed(
	A2(elm$http$Http$State, elm$core$Dict$empty, _List_Nil));
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Process$kill = _Scheduler_kill;
var elm$core$Process$spawn = _Scheduler_spawn;
var elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _n2 = A2(elm$core$Dict$get, tracker, reqs);
					if (_n2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _n2.a;
						return A2(
							elm$core$Task$andThen,
							function (_n3) {
								return A3(
									elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2(elm$core$Dict$remove, tracker, reqs));
							},
							elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						elm$core$Task$andThen,
						function (pid) {
							var _n4 = req.tracker;
							if (_n4.$ === 'Nothing') {
								return A3(elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _n4.a;
								return A3(
									elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3(elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			elm$core$Task$andThen,
			function (reqs) {
				return elm$core$Task$succeed(
					A2(elm$http$Http$State, reqs, subs));
			},
			A3(elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (_n0.$ === 'Just') {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _n0) {
		var actualTracker = _n0.a;
		var toMsg = _n0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? elm$core$Maybe$Just(
			A2(
				elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : elm$core$Maybe$Nothing;
	});
var elm$http$Http$onSelfMsg = F3(
	function (router, _n0, state) {
		var tracker = _n0.a;
		var progress = _n0.b;
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$filterMap,
					A3(elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var elm$http$Http$subMap = F2(
	function (func, _n0) {
		var tracker = _n0.a;
		var toMsg = _n0.b;
		return A2(
			elm$http$Http$MySub,
			tracker,
			A2(elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager(elm$http$Http$init, elm$http$Http$onEffects, elm$http$Http$onSelfMsg, elm$http$Http$cmdMap, elm$http$Http$subMap);
var elm$http$Http$command = _Platform_leaf('Http');
var elm$http$Http$subscription = _Platform_leaf('Http');
var elm$http$Http$request = function (r) {
	return elm$http$Http$command(
		elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var author$project$Main$apiInit = function (_n0) {
	var endpoint = _n0.endpoint;
	var method = _n0.method;
	var decoder = _n0.decoder;
	var expect = A2(elm$http$Http$expectJson, author$project$Main$Response, decoder);
	var request = F2(
		function (suffix, body) {
			return elm$http$Http$request(
				{
					body: A2(elm$core$Maybe$withDefault, elm$http$Http$emptyBody, body),
					expect: expect,
					headers: _List_Nil,
					method: function () {
						switch (method.$) {
							case 'HttpGet':
								return 'GET';
							case 'HttpPost':
								return 'POST';
							default:
								return 'PUT';
						}
					}(),
					timeout: elm$core$Maybe$Nothing,
					tracker: elm$core$Maybe$Nothing,
					url: _Utils_ap(endpoint, suffix)
				});
		});
	return author$project$Update$Deep$save(
		{request: request, resource: author$project$Main$NotRequested});
};
var rundis$elm_bootstrap$Bootstrap$Modal$Hide = {$: 'Hide'};
var rundis$elm_bootstrap$Bootstrap$Modal$hidden = rundis$elm_bootstrap$Bootstrap$Modal$Hide;
var author$project$Main$notificationsModalInit = author$project$Update$Deep$save(
	{modal: rundis$elm_bootstrap$Bootstrap$Modal$hidden, notification: elm$core$Maybe$Nothing});
var author$project$Update$Deep$ap = F2(
	function (_n0, _n1) {
		var f = _n0.a;
		var cmda = _n0.b;
		var e = _n0.c;
		var model = _n1.a;
		var cmdb = _n1.b;
		var e2 = _n1.c;
		return _Utils_Tuple3(
			f(model),
			elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[cmda, cmdb])),
			_Utils_ap(e, e2));
	});
var author$project$Update$Deep$andMap = F2(
	function (a, b) {
		return A2(author$project$Update$Deep$ap, b, a);
	});
var elm$core$Platform$Cmd$map = _Platform_map;
var author$project$Update$Deep$mapCmd = F2(
	function (f, _n0) {
		var model = _n0.a;
		var cmd = _n0.b;
		var events = _n0.c;
		return _Utils_Tuple3(
			model,
			A2(elm$core$Platform$Cmd$map, f, cmd),
			events);
	});
var author$project$Main$uiInit = function () {
	var notifications = author$project$Main$apiInit(
		{
			decoder: A2(
				elm$json$Json$Decode$field,
				'notifications',
				elm$json$Json$Decode$list(author$project$Data$Notification$decoder)),
			endpoint: '/notifications',
			method: author$project$Main$HttpGet
		});
	return A2(
		author$project$Update$Deep$andMap,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$NotificationsApiMsg, notifications),
		A2(
			author$project$Update$Deep$andMap,
			A2(author$project$Update$Deep$mapCmd, author$project$Main$NotificationsModalMsg, author$project$Main$notificationsModalInit),
			A2(
				author$project$Update$Deep$andMap,
				author$project$Update$Deep$save(author$project$Main$Closed),
				A2(
					author$project$Update$Deep$andMap,
					author$project$Update$Deep$save(author$project$Main$Closed),
					A2(
						author$project$Update$Deep$andMap,
						author$project$Update$Deep$save(true),
						author$project$Update$Deep$save(author$project$Main$UiState))))));
}();
var author$project$Main$LoginPage = function (a) {
	return {$: 'LoginPage', a: a};
};
var author$project$Main$LoginPageMsg = function (a) {
	return {$: 'LoginPageMsg', a: a};
};
var author$project$Main$NewProjectPage = function (a) {
	return {$: 'NewProjectPage', a: a};
};
var author$project$Main$NewProjectPageMsg = function (a) {
	return {$: 'NewProjectPageMsg', a: a};
};
var author$project$Main$PageMsg = function (a) {
	return {$: 'PageMsg', a: a};
};
var author$project$Main$ProfilePage = function (a) {
	return {$: 'ProfilePage', a: a};
};
var author$project$Main$ProfilePageMsg = function (a) {
	return {$: 'ProfilePageMsg', a: a};
};
var author$project$Main$ProjectHomePage = function (a) {
	return {$: 'ProjectHomePage', a: a};
};
var author$project$Main$ProjectHomePageMsg = function (a) {
	return {$: 'ProjectHomePageMsg', a: a};
};
var author$project$Main$ProjectSettingsPage = function (a) {
	return {$: 'ProjectSettingsPage', a: a};
};
var author$project$Main$ProjectSettingsPageMsg = function (a) {
	return {$: 'ProjectSettingsPageMsg', a: a};
};
var author$project$Main$Redirect = function (a) {
	return {$: 'Redirect', a: a};
};
var author$project$Main$RegisterPage = function (a) {
	return {$: 'RegisterPage', a: a};
};
var author$project$Main$RegisterPageMsg = function (a) {
	return {$: 'RegisterPageMsg', a: a};
};
var author$project$Main$ResetPasswordPage = function (a) {
	return {$: 'ResetPasswordPage', a: a};
};
var author$project$Main$ResetPasswordPageMsg = function (a) {
	return {$: 'ResetPasswordPageMsg', a: a};
};
var author$project$Main$SelectProjectPage = function (a) {
	return {$: 'SelectProjectPage', a: a};
};
var author$project$Main$SelectProjectPageMsg = function (a) {
	return {$: 'SelectProjectPageMsg', a: a};
};
var author$project$Main$insertAsPageIn = F2(
	function (state, page) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{page: page}));
	});
var author$project$Main$insertAsRouterIn = F2(
	function (state, router) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{router: router}));
	});
var author$project$Main$HttpPost = {$: 'HttpPost'};
var author$project$Main$LoginApiMsg = function (a) {
	return {$: 'LoginApiMsg', a: a};
};
var author$project$Main$LoginPageState = F3(
	function (session, form, sent) {
		return {form: form, sent: sent, session: session};
	});
var author$project$Main$LoginForm = F3(
	function (login, password, rememberMe) {
		return {login: login, password: password, rememberMe: rememberMe};
	});
var etaque$elm_form$Form$Validate$errMaybe = function (res) {
	if (res.$ === 'Ok') {
		return elm$core$Maybe$Nothing;
	} else {
		var e = res.a;
		return elm$core$Maybe$Just(e);
	}
};
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var etaque$elm_form$Form$Tree$Group = function (a) {
	return {$: 'Group', a: a};
};
var etaque$elm_form$Form$Tree$group = function (items) {
	return etaque$elm_form$Form$Tree$Group(
		elm$core$Dict$fromList(items));
};
var elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3(elm$core$Dict$foldl, elm$core$Dict$insert, t2, t1);
	});
var etaque$elm_form$Form$Validate$groupErrorsUnion = F2(
	function (e1, e2) {
		var _n0 = _Utils_Tuple2(e1, e2);
		if ((_n0.a.$ === 'Group') && (_n0.b.$ === 'Group')) {
			var g1 = _n0.a.a;
			var g2 = _n0.b.a;
			return etaque$elm_form$Form$Tree$Group(
				A2(elm$core$Dict$union, g1, g2));
		} else {
			return e2;
		}
	});
var etaque$elm_form$Form$Validate$mergeMany = function (errors) {
	return A3(
		elm$core$List$foldl,
		etaque$elm_form$Form$Validate$groupErrorsUnion,
		etaque$elm_form$Form$Tree$group(_List_Nil),
		A2(elm$core$List$filterMap, elm$core$Basics$identity, errors));
};
var etaque$elm_form$Form$Validate$andMap = F3(
	function (aValidation, partialValidation, validationField) {
		var _n0 = _Utils_Tuple2(
			partialValidation(validationField),
			aValidation(validationField));
		if ((_n0.a.$ === 'Ok') && (_n0.b.$ === 'Ok')) {
			var partial = _n0.a.a;
			var a = _n0.b.a;
			return elm$core$Result$Ok(
				partial(a));
		} else {
			var partialResult = _n0.a;
			var aResult = _n0.b;
			return elm$core$Result$Err(
				etaque$elm_form$Form$Validate$mergeMany(
					_List_fromArray(
						[
							etaque$elm_form$Form$Validate$errMaybe(partialResult),
							etaque$elm_form$Form$Validate$errMaybe(aResult)
						])));
		}
	});
var etaque$elm_form$Form$Field$asBool = function (field) {
	if ((field.$ === 'Value') && (field.a.$ === 'Bool')) {
		var b = field.a.a;
		return elm$core$Maybe$Just(b);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var etaque$elm_form$Form$Validate$bool = function (v) {
	var _n0 = etaque$elm_form$Form$Field$asBool(v);
	if (_n0.$ === 'Just') {
		var b = _n0.a;
		return elm$core$Result$Ok(b);
	} else {
		return elm$core$Result$Ok(false);
	}
};
var etaque$elm_form$Form$Field$EmptyField = {$: 'EmptyField'};
var etaque$elm_form$Form$Tree$Value = function (a) {
	return {$: 'Value', a: a};
};
var etaque$elm_form$Form$Tree$getAtName = F2(
	function (name, value) {
		if (value.$ === 'Group') {
			var items = value.a;
			return A2(elm$core$Dict$get, name, items);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var etaque$elm_form$Form$Validate$field = F3(
	function (key, validation, validationField) {
		return A2(
			elm$core$Result$mapError,
			function (e) {
				return etaque$elm_form$Form$Tree$group(
					_List_fromArray(
						[
							_Utils_Tuple2(key, e)
						]));
			},
			validation(
				A2(
					elm$core$Maybe$withDefault,
					etaque$elm_form$Form$Tree$Value(etaque$elm_form$Form$Field$EmptyField),
					A2(etaque$elm_form$Form$Tree$getAtName, key, validationField))));
	});
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var etaque$elm_form$Form$Error$Empty = {$: 'Empty'};
var etaque$elm_form$Form$Error$InvalidString = {$: 'InvalidString'};
var etaque$elm_form$Form$Error$value = etaque$elm_form$Form$Tree$Value;
var etaque$elm_form$Form$Field$asString = function (field) {
	if ((field.$ === 'Value') && (field.a.$ === 'String')) {
		var s = field.a.a;
		return elm$core$Maybe$Just(s);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var etaque$elm_form$Form$Validate$string = function (v) {
	var _n0 = etaque$elm_form$Form$Field$asString(v);
	if (_n0.$ === 'Just') {
		var s = _n0.a;
		return elm$core$String$isEmpty(s) ? elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$Empty)) : elm$core$Result$Ok(s);
	} else {
		return elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$InvalidString));
	}
};
var etaque$elm_form$Form$Validate$succeed = F2(
	function (a, validationField) {
		return elm$core$Result$Ok(a);
	});
var author$project$Main$loginFormValidate = A2(
	etaque$elm_form$Form$Validate$andMap,
	A2(etaque$elm_form$Form$Validate$field, 'rememberMe', etaque$elm_form$Form$Validate$bool),
	A2(
		etaque$elm_form$Form$Validate$andMap,
		A2(etaque$elm_form$Form$Validate$field, 'password', etaque$elm_form$Form$Validate$string),
		A2(
			etaque$elm_form$Form$Validate$andMap,
			A2(etaque$elm_form$Form$Validate$field, 'login', etaque$elm_form$Form$Validate$string),
			etaque$elm_form$Form$Validate$succeed(author$project$Main$LoginForm))));
var author$project$Update$Deep$map = F2(
	function (f, _n0) {
		var model = _n0.a;
		var cmd = _n0.b;
		var events = _n0.c;
		return _Utils_Tuple3(
			f(model),
			cmd,
			events);
	});
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var author$project$Update$Deep$map2 = function (f) {
	return A2(
		elm$core$Basics$composeL,
		author$project$Update$Deep$ap,
		author$project$Update$Deep$map(f));
};
var author$project$Update$Deep$map3 = F2(
	function (f, x) {
		return A2(
			elm$core$Basics$composeL,
			author$project$Update$Deep$ap,
			A2(author$project$Update$Deep$map2, f, x));
	});
var elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var elm$core$Set$empty = elm$core$Set$Set_elm_builtin(elm$core$Dict$empty);
var etaque$elm_form$Form$F = function (a) {
	return {$: 'F', a: a};
};
var etaque$elm_form$Form$updateValidate = F2(
	function (validation, model) {
		var _n0 = validation(model.fields);
		if (_n0.$ === 'Ok') {
			var output = _n0.a;
			return _Utils_update(
				model,
				{
					errors: etaque$elm_form$Form$Tree$group(_List_Nil),
					output: elm$core$Maybe$Just(output)
				});
		} else {
			var error = _n0.a;
			return _Utils_update(
				model,
				{errors: error, output: elm$core$Maybe$Nothing});
		}
	});
var etaque$elm_form$Form$initial = F2(
	function (initialFields, validation) {
		var model = {
			changedFields: elm$core$Set$empty,
			dirtyFields: elm$core$Set$empty,
			errors: etaque$elm_form$Form$Tree$group(_List_Nil),
			fields: etaque$elm_form$Form$Tree$group(initialFields),
			focus: elm$core$Maybe$Nothing,
			isSubmitted: false,
			originalValues: elm$core$Dict$empty,
			output: elm$core$Maybe$Nothing
		};
		return etaque$elm_form$Form$F(
			A2(etaque$elm_form$Form$updateValidate, validation, model));
	});
var author$project$Main$loginPageInit = function () {
	var session = author$project$Main$apiInit(
		{
			decoder: A2(elm$json$Json$Decode$field, 'session', author$project$Data$Session$decoder),
			endpoint: '/auth/login',
			method: author$project$Main$HttpPost
		});
	var form = A2(etaque$elm_form$Form$initial, _List_Nil, author$project$Main$loginFormValidate);
	return A4(
		author$project$Update$Deep$map3,
		author$project$Main$LoginPageState,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$LoginApiMsg, session),
		author$project$Update$Deep$save(form),
		author$project$Update$Deep$save(false));
}();
var author$project$Update$Deep$join = function (_n0) {
	var _n1 = _n0.a;
	var model = _n1.a;
	var cmda = _n1.b;
	var e = _n1.c;
	var cmdb = _n0.b;
	var e2 = _n0.c;
	return _Utils_Tuple3(
		model,
		elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[cmda, cmdb])),
		_Utils_ap(e, e2));
};
var author$project$Update$Deep$andThen = function (f) {
	return A2(
		elm$core$Basics$composeL,
		author$project$Update$Deep$join,
		author$project$Update$Deep$map(f));
};
var author$project$Update$Deep$foldEvents = function (_n0) {
	var m = _n0.a;
	var cmd = _n0.b;
	var events = _n0.c;
	return A3(
		elm$core$List$foldr,
		author$project$Update$Deep$andThen,
		_Utils_Tuple3(m, cmd, _List_Nil),
		events);
};
var author$project$Update$Deep$andFinally = function (_do) {
	return A2(
		elm$core$Basics$composeL,
		author$project$Update$Deep$foldEvents,
		author$project$Update$Deep$andThen(_do));
};
var author$project$Main$loadLoginPage = function (state) {
	return A2(
		author$project$Update$Deep$andFinally,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$insertAsPageIn(state),
			author$project$Main$LoginPage),
		A2(
			author$project$Update$Deep$mapCmd,
			A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$LoginPageMsg),
			author$project$Main$loginPageInit));
};
var author$project$Main$NewProjectApiMsg = function (a) {
	return {$: 'NewProjectApiMsg', a: a};
};
var author$project$Main$NewProjectPageState = F4(
	function (project, form, key, sent) {
		return {form: form, key: key, project: project, sent: sent};
	});
var author$project$Main$NewProjectForm = F3(
	function (name, country, description) {
		return {country: country, description: description, name: name};
	});
var elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return elm$core$Maybe$Just(v);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var etaque$elm_form$Form$Validate$maybe = F2(
	function (validation, validationField) {
		return elm$core$Result$Ok(
			elm$core$Result$toMaybe(
				validation(validationField)));
	});
var author$project$Main$newProjectFormValidate = A2(
	etaque$elm_form$Form$Validate$andMap,
	etaque$elm_form$Form$Validate$maybe(
		A2(etaque$elm_form$Form$Validate$field, 'description', etaque$elm_form$Form$Validate$string)),
	A2(
		etaque$elm_form$Form$Validate$andMap,
		A2(etaque$elm_form$Form$Validate$field, 'country', etaque$elm_form$Form$Validate$string),
		A2(
			etaque$elm_form$Form$Validate$andMap,
			A2(etaque$elm_form$Form$Validate$field, 'name', etaque$elm_form$Form$Validate$string),
			etaque$elm_form$Form$Validate$succeed(author$project$Main$NewProjectForm))));
var author$project$Update$Deep$map4 = F3(
	function (f, x, y) {
		return A2(
			elm$core$Basics$composeL,
			author$project$Update$Deep$ap,
			A3(author$project$Update$Deep$map3, f, x, y));
	});
var author$project$Main$newProjectPageInit = function (key) {
	var project = author$project$Main$apiInit(
		{
			decoder: A2(elm$json$Json$Decode$field, 'project', author$project$Data$Project$decoder),
			endpoint: '/projects',
			method: author$project$Main$HttpPost
		});
	var form = A2(etaque$elm_form$Form$initial, _List_Nil, author$project$Main$newProjectFormValidate);
	return A5(
		author$project$Update$Deep$map4,
		author$project$Main$NewProjectPageState,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$NewProjectApiMsg, project),
		author$project$Update$Deep$save(form),
		author$project$Update$Deep$save(key),
		author$project$Update$Deep$save(false));
};
var author$project$Main$loadNewProjectPage = function (state) {
	return A2(
		author$project$Update$Deep$andFinally,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$insertAsPageIn(state),
			author$project$Main$NewProjectPage),
		A2(
			author$project$Update$Deep$mapCmd,
			A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$NewProjectPageMsg),
			author$project$Main$newProjectPageInit(state.router.key)));
};
var author$project$Main$HttpPut = {$: 'HttpPut'};
var author$project$Main$ProfileApiMsg = function (a) {
	return {$: 'ProfileApiMsg', a: a};
};
var author$project$Main$ProfilePageState = F4(
	function (user, form, key, sent) {
		return {form: form, key: key, sent: sent, user: user};
	});
var author$project$Main$ProfileForm = function (name) {
	return {name: name};
};
var author$project$Main$profileFormValidate = A2(
	etaque$elm_form$Form$Validate$andMap,
	A2(etaque$elm_form$Form$Validate$field, 'name', etaque$elm_form$Form$Validate$string),
	etaque$elm_form$Form$Validate$succeed(author$project$Main$ProfileForm));
var etaque$elm_form$Form$Field$String = function (a) {
	return {$: 'String', a: a};
};
var etaque$elm_form$Form$Field$value = etaque$elm_form$Form$Tree$Value;
var author$project$Main$profilePageInit = F2(
	function (key, user) {
		var form = A2(
			etaque$elm_form$Form$initial,
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					etaque$elm_form$Form$Field$value(
						etaque$elm_form$Form$Field$String(user.name)))
				]),
			author$project$Main$profileFormValidate);
		var apiUser = author$project$Main$apiInit(
			{
				decoder: A2(elm$json$Json$Decode$field, 'user', author$project$Data$User$decoder),
				endpoint: '/users/' + elm$core$String$fromInt(user.id),
				method: author$project$Main$HttpPut
			});
		return A2(
			author$project$Update$Deep$andMap,
			author$project$Update$Deep$save(false),
			A2(
				author$project$Update$Deep$andMap,
				author$project$Update$Deep$save(key),
				A2(
					author$project$Update$Deep$andMap,
					author$project$Update$Deep$save(form),
					A2(
						author$project$Update$Deep$andMap,
						A2(author$project$Update$Deep$mapCmd, author$project$Main$ProfileApiMsg, apiUser),
						author$project$Update$Deep$save(author$project$Main$ProfilePageState)))));
	});
var author$project$Main$loadProfilePage = F2(
	function (user, state) {
		return A2(
			author$project$Update$Deep$andFinally,
			A2(
				elm$core$Basics$composeL,
				author$project$Main$insertAsPageIn(state),
				author$project$Main$ProfilePage),
			A2(
				author$project$Update$Deep$mapCmd,
				A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProfilePageMsg),
				A2(author$project$Main$profilePageInit, state.router.key, user)));
	});
var author$project$Main$RegisterApiMsg = function (a) {
	return {$: 'RegisterApiMsg', a: a};
};
var author$project$Main$RegisterPageState = F3(
	function (user, form, sent) {
		return {form: form, sent: sent, user: user};
	});
var author$project$Main$RegisterForm = F9(
	function (name, email, useEmailAsLogin, login, organization, phoneNumber, password, confirmPassword, agreeWithTerms) {
		return {agreeWithTerms: agreeWithTerms, confirmPassword: confirmPassword, email: email, login: login, name: name, organization: organization, password: password, phoneNumber: phoneNumber, useEmailAsLogin: useEmailAsLogin};
	});
var author$project$Main$MustAgreeWithTerms = {$: 'MustAgreeWithTerms'};
var etaque$elm_form$Form$Error$CustomError = function (a) {
	return {$: 'CustomError', a: a};
};
var etaque$elm_form$Form$Validate$customError = A2(elm$core$Basics$composeR, etaque$elm_form$Form$Error$CustomError, etaque$elm_form$Form$Error$value);
var etaque$elm_form$Form$Validate$fail = F2(
	function (error, validationField) {
		return elm$core$Result$Err(error);
	});
var author$project$Main$mustBeChecked = function (checked) {
	return checked ? etaque$elm_form$Form$Validate$succeed(true) : etaque$elm_form$Form$Validate$fail(
		etaque$elm_form$Form$Validate$customError(author$project$Main$MustAgreeWithTerms));
};
var author$project$Main$DoesNotMatchPassword = {$: 'DoesNotMatchPassword'};
var elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return elm$core$Result$Err(msg);
		}
	});
var etaque$elm_form$Form$Validate$andThen = F3(
	function (callback, validation, validationField) {
		return A2(
			elm$core$Result$andThen,
			function (next) {
				return A2(callback, next, validationField);
			},
			validation(validationField));
	});
var author$project$Main$validateConfirmation = function (password) {
	return A2(
		etaque$elm_form$Form$Validate$field,
		'confirmPassword',
		A2(
			etaque$elm_form$Form$Validate$andThen,
			function (confirmation) {
				return _Utils_eq(password, confirmation) ? etaque$elm_form$Form$Validate$succeed(confirmation) : etaque$elm_form$Form$Validate$fail(
					etaque$elm_form$Form$Validate$customError(author$project$Main$DoesNotMatchPassword));
			},
			etaque$elm_form$Form$Validate$string));
};
var etaque$elm_form$Form$Validate$nonEmpty = F2(
	function (s, validationField) {
		return elm$core$String$isEmpty(s) ? elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$Empty)) : elm$core$Result$Ok(s);
	});
var author$project$Main$validateLogin = A2(
	etaque$elm_form$Form$Validate$andThen,
	function (useEmail) {
		return useEmail ? etaque$elm_form$Form$Validate$succeed('') : A2(
			etaque$elm_form$Form$Validate$field,
			'login',
			A2(etaque$elm_form$Form$Validate$andThen, etaque$elm_form$Form$Validate$nonEmpty, etaque$elm_form$Form$Validate$string));
	},
	A2(etaque$elm_form$Form$Validate$field, 'useEmailAsLogin', etaque$elm_form$Form$Validate$bool));
var etaque$elm_form$Form$Error$InvalidEmail = {$: 'InvalidEmail'};
var elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var elm$regex$Regex$contains = _Regex_contains;
var etaque$elm_form$Form$Error$InvalidFormat = {$: 'InvalidFormat'};
var etaque$elm_form$Form$Validate$format = F3(
	function (regex, s, validationField) {
		return A2(elm$regex$Regex$contains, regex, s) ? elm$core$Result$Ok(s) : elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$InvalidFormat));
	});
var etaque$elm_form$Form$Validate$mapError = F2(
	function (f, validation) {
		return function (validationField) {
			return A2(
				elm$core$Result$mapError,
				f,
				validation(validationField));
		};
	});
var elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var elm$regex$Regex$never = _Regex_never;
var etaque$elm_form$Form$Validate$validEmailPattern = A2(
	elm$core$Maybe$withDefault,
	elm$regex$Regex$never,
	A2(
		elm$regex$Regex$fromStringWith,
		{caseInsensitive: true, multiline: false},
		'^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
var etaque$elm_form$Form$Validate$email = A2(
	etaque$elm_form$Form$Validate$andThen,
	function (s) {
		return A2(
			etaque$elm_form$Form$Validate$mapError,
			function (_n0) {
				return etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$InvalidEmail);
			},
			A2(etaque$elm_form$Form$Validate$format, etaque$elm_form$Form$Validate$validEmailPattern, s));
	},
	etaque$elm_form$Form$Validate$string);
var etaque$elm_form$Form$Validate$emptyString = function (v) {
	var _n0 = etaque$elm_form$Form$Field$asString(v);
	if (_n0.$ === 'Just') {
		var s = _n0.a;
		return elm$core$String$isEmpty(s) ? elm$core$Result$Ok(s) : elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$InvalidString));
	} else {
		return elm$core$Result$Ok('');
	}
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$String$length = _String_length;
var etaque$elm_form$Form$Error$ShorterStringThan = function (a) {
	return {$: 'ShorterStringThan', a: a};
};
var etaque$elm_form$Form$Validate$minLength = F3(
	function (min, s, validationField) {
		return (_Utils_cmp(
			elm$core$String$length(s),
			min) > -1) ? elm$core$Result$Ok(s) : elm$core$Result$Err(
			etaque$elm_form$Form$Error$value(
				etaque$elm_form$Form$Error$ShorterStringThan(min)));
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var etaque$elm_form$Form$Validate$oneOf = F2(
	function (validations, validationField) {
		var walkResults = F2(
			function (result, combined) {
				var _n0 = _Utils_Tuple2(combined, result);
				if (_n0.a.$ === 'Ok') {
					return combined;
				} else {
					return result;
				}
			});
		var results = A2(
			elm$core$List$map,
			function (v) {
				return v(validationField);
			},
			validations);
		return A3(
			elm$core$List$foldl,
			walkResults,
			elm$core$Result$Err(
				etaque$elm_form$Form$Error$value(etaque$elm_form$Form$Error$Empty)),
			results);
	});
var author$project$Main$registerFormValidate = A2(
	etaque$elm_form$Form$Validate$andMap,
	A2(
		etaque$elm_form$Form$Validate$field,
		'agreeWithTerms',
		A2(etaque$elm_form$Form$Validate$andThen, author$project$Main$mustBeChecked, etaque$elm_form$Form$Validate$bool)),
	A2(
		etaque$elm_form$Form$Validate$andMap,
		etaque$elm_form$Form$Validate$oneOf(
			_List_fromArray(
				[
					A2(
					etaque$elm_form$Form$Validate$andThen,
					author$project$Main$validateConfirmation,
					A2(etaque$elm_form$Form$Validate$field, 'password', etaque$elm_form$Form$Validate$string)),
					A2(etaque$elm_form$Form$Validate$andThen, author$project$Main$validateConfirmation, etaque$elm_form$Form$Validate$emptyString)
				])),
		A2(
			etaque$elm_form$Form$Validate$andMap,
			A2(
				etaque$elm_form$Form$Validate$field,
				'password',
				A2(
					etaque$elm_form$Form$Validate$andThen,
					etaque$elm_form$Form$Validate$minLength(8),
					etaque$elm_form$Form$Validate$string)),
			A2(
				etaque$elm_form$Form$Validate$andMap,
				etaque$elm_form$Form$Validate$maybe(
					A2(
						etaque$elm_form$Form$Validate$andThen,
						etaque$elm_form$Form$Validate$nonEmpty,
						A2(etaque$elm_form$Form$Validate$field, 'phoneNumber', etaque$elm_form$Form$Validate$string))),
				A2(
					etaque$elm_form$Form$Validate$andMap,
					etaque$elm_form$Form$Validate$maybe(
						A2(
							etaque$elm_form$Form$Validate$andThen,
							etaque$elm_form$Form$Validate$nonEmpty,
							A2(etaque$elm_form$Form$Validate$field, 'organization', etaque$elm_form$Form$Validate$string))),
					A2(
						etaque$elm_form$Form$Validate$andMap,
						author$project$Main$validateLogin,
						A2(
							etaque$elm_form$Form$Validate$andMap,
							A2(etaque$elm_form$Form$Validate$field, 'useEmailAsLogin', etaque$elm_form$Form$Validate$bool),
							A2(
								etaque$elm_form$Form$Validate$andMap,
								A2(etaque$elm_form$Form$Validate$field, 'email', etaque$elm_form$Form$Validate$email),
								A2(
									etaque$elm_form$Form$Validate$andMap,
									A2(
										etaque$elm_form$Form$Validate$field,
										'name',
										A2(etaque$elm_form$Form$Validate$andThen, etaque$elm_form$Form$Validate$nonEmpty, etaque$elm_form$Form$Validate$string)),
									etaque$elm_form$Form$Validate$succeed(author$project$Main$RegisterForm))))))))));
var etaque$elm_form$Form$Field$Bool = function (a) {
	return {$: 'Bool', a: a};
};
var author$project$Main$registerPageInit = function () {
	var form = A2(
		etaque$elm_form$Form$initial,
		_List_fromArray(
			[
				_Utils_Tuple2(
				'useEmailAsLogin',
				etaque$elm_form$Form$Field$value(
					etaque$elm_form$Form$Field$Bool(true)))
			]),
		author$project$Main$registerFormValidate);
	var apiUser = author$project$Main$apiInit(
		{
			decoder: A2(elm$json$Json$Decode$field, 'user', author$project$Data$User$decoder),
			endpoint: '/users',
			method: author$project$Main$HttpPost
		});
	return A4(
		author$project$Update$Deep$map3,
		author$project$Main$RegisterPageState,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$RegisterApiMsg, apiUser),
		author$project$Update$Deep$save(form),
		author$project$Update$Deep$save(false));
}();
var author$project$Main$loadRegisterPage = function (state) {
	return A2(
		author$project$Update$Deep$andFinally,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$insertAsPageIn(state),
			author$project$Main$RegisterPage),
		A2(
			author$project$Update$Deep$mapCmd,
			A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$RegisterPageMsg),
			author$project$Main$registerPageInit));
};
var author$project$Main$ResetPasswordApiMsg = function (a) {
	return {$: 'ResetPasswordApiMsg', a: a};
};
var author$project$Main$ResetPasswordPageState = F3(
	function (response, form, sent) {
		return {form: form, response: response, sent: sent};
	});
var author$project$Main$ResetPasswordForm = function (login) {
	return {login: login};
};
var author$project$Main$resetPasswordFormValidate = A2(
	etaque$elm_form$Form$Validate$andMap,
	A2(etaque$elm_form$Form$Validate$field, 'login', etaque$elm_form$Form$Validate$string),
	etaque$elm_form$Form$Validate$succeed(author$project$Main$ResetPasswordForm));
var author$project$Main$resetPasswordPageInit = function () {
	var response = author$project$Main$apiInit(
		{
			decoder: A2(
				elm$json$Json$Decode$map,
				function (status) {
					return {status: status};
				},
				elm$json$Json$Decode$int),
			endpoint: '/auth/reset_password',
			method: author$project$Main$HttpPost
		});
	var form = A2(etaque$elm_form$Form$initial, _List_Nil, author$project$Main$resetPasswordFormValidate);
	return A4(
		author$project$Update$Deep$map3,
		author$project$Main$ResetPasswordPageState,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$ResetPasswordApiMsg, response),
		author$project$Update$Deep$save(form),
		author$project$Update$Deep$save(false));
}();
var author$project$Main$loadResetPasswordPage = function (state) {
	return A2(
		author$project$Update$Deep$andFinally,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$insertAsPageIn(state),
			author$project$Main$ResetPasswordPage),
		A2(
			author$project$Update$Deep$mapCmd,
			A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ResetPasswordPageMsg),
			author$project$Main$resetPasswordPageInit));
};
var author$project$Main$projectSettingsPageInit = author$project$Update$Deep$save(
	{});
var author$project$Main$loadSettingsPage = function (state) {
	return A2(
		author$project$Update$Deep$andFinally,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$insertAsPageIn(state),
			author$project$Main$ProjectSettingsPage),
		A2(
			author$project$Update$Deep$mapCmd,
			A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProjectSettingsPageMsg),
			author$project$Main$projectSettingsPageInit));
};
var author$project$Main$LoginFormMsg = function (a) {
	return {$: 'LoginFormMsg', a: a};
};
var author$project$Main$Request = F2(
	function (a, b) {
		return {$: 'Request', a: a, b: b};
	});
var elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2(elm$json$Json$Encode$encode, 0, value));
};
var author$project$Main$apiJsonRequest = function (url) {
	return A2(
		elm$core$Basics$composeL,
		A2(
			elm$core$Basics$composeL,
			author$project$Main$Request(url),
			elm$core$Maybe$Just),
		elm$http$Http$jsonBody);
};
var author$project$Main$Available = function (a) {
	return {$: 'Available', a: a};
};
var author$project$Main$Error = function (a) {
	return {$: 'Error', a: a};
};
var author$project$Main$Requested = {$: 'Requested'};
var author$project$Main$setResource = F2(
	function (resource, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{resource: resource}));
	});
var author$project$Update$Deep$invokeHandler = F2(
	function (handler, state) {
		return _Utils_Tuple3(
			state,
			elm$core$Platform$Cmd$none,
			_List_fromArray(
				[handler]));
	});
var author$project$Update$Deep$andInvokeHandler = A2(elm$core$Basics$composeL, author$project$Update$Deep$andThen, author$project$Update$Deep$invokeHandler);
var author$project$Update$Deep$runCmd = F2(
	function (cmd, state) {
		return _Utils_Tuple3(state, cmd, _List_Nil);
	});
var author$project$Update$Deep$andRunCmd = A2(elm$core$Basics$composeL, author$project$Update$Deep$andThen, author$project$Update$Deep$runCmd);
var author$project$Main$apiUpdate = F3(
	function (_n0, msg, model) {
		var onSuccess = _n0.onSuccess;
		var onError = _n0.onError;
		switch (msg.$) {
			case 'Request':
				var url = msg.a;
				var maybeBody = msg.b;
				return A2(
					author$project$Update$Deep$andRunCmd,
					A2(model.request, url, maybeBody),
					A2(author$project$Main$setResource, author$project$Main$Requested, model));
			case 'Response':
				if (msg.a.$ === 'Ok') {
					var resource = msg.a.a;
					return A2(
						author$project$Update$Deep$andInvokeHandler,
						onSuccess(resource),
						A2(
							author$project$Main$setResource,
							author$project$Main$Available(resource),
							model));
				} else {
					var error = msg.a.a;
					return A2(
						author$project$Update$Deep$andInvokeHandler,
						onError(error),
						A2(
							author$project$Main$setResource,
							author$project$Main$Error(error),
							model));
				}
			default:
				return A2(author$project$Main$setResource, author$project$Main$NotRequested, model);
		}
	});
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Main$loginFormToJson = function (_n0) {
	var login = _n0.login;
	var password = _n0.password;
	var rememberMe = _n0.rememberMe;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'login',
				elm$json$Json$Encode$string(login)),
				_Utils_Tuple2(
				'password',
				elm$json$Json$Encode$string(password)),
				_Utils_Tuple2(
				'rememberMe',
				elm$json$Json$Encode$bool(rememberMe))
			]));
};
var author$project$Main$loginPageInsertAsFormIn = F2(
	function (state, form) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{form: form}));
	});
var author$project$Main$loginPageInsertAsSessionIn = F2(
	function (state, session) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{session: session}));
	});
var author$project$Main$loginPageSetSent = F2(
	function (sent, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{sent: sent}));
	});
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var etaque$elm_form$Form$Reset = function (a) {
	return {$: 'Reset', a: a};
};
var etaque$elm_form$Form$getOutput = function (_n0) {
	var model = _n0.a;
	return model.output;
};
var elm$core$Basics$not = _Basics_not;
var elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3(elm$core$Dict$insert, k, v, d) : d;
				}),
			elm$core$Dict$empty,
			dict);
	});
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Set$filter = F2(
	function (isGood, _n0) {
		var dict = _n0.a;
		return elm$core$Set$Set_elm_builtin(
			A2(
				elm$core$Dict$filter,
				F2(
					function (key, _n1) {
						return isGood(key);
					}),
				dict));
	});
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return elm$core$Set$Set_elm_builtin(
			A3(elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var elm$core$Dict$member = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$get, key, dict);
		if (_n0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var elm$core$Set$member = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return A2(elm$core$Dict$member, key, dict);
	});
var elm$core$Set$remove = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return elm$core$Set$Set_elm_builtin(
			A2(elm$core$Dict$remove, key, dict));
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$core$String$toInt = _String_toInt;
var etaque$elm_form$Form$Tree$IntFragment = function (a) {
	return {$: 'IntFragment', a: a};
};
var etaque$elm_form$Form$Tree$StringFragment = function (a) {
	return {$: 'StringFragment', a: a};
};
var etaque$elm_form$Form$Tree$toFragment = function (s) {
	return A2(
		elm$core$Maybe$withDefault,
		etaque$elm_form$Form$Tree$StringFragment(s),
		A2(
			elm$core$Maybe$map,
			etaque$elm_form$Form$Tree$IntFragment,
			elm$core$String$toInt(s)));
};
var etaque$elm_form$Form$Tree$extractFragments = function (name) {
	return A2(
		elm$core$List$map,
		etaque$elm_form$Form$Tree$toFragment,
		A2(elm$core$String$split, '.', name));
};
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var etaque$elm_form$Form$Tree$getAtIndex = F2(
	function (index, value) {
		switch (value.$) {
			case 'List':
				var items = value.a;
				return elm$core$List$head(
					A2(elm$core$List$drop, index, items));
			case 'Group':
				var items = value.a;
				return A2(
					elm$core$Dict$get,
					elm$core$String$fromInt(index),
					items);
			default:
				return elm$core$Maybe$Nothing;
		}
	});
var etaque$elm_form$Form$Tree$getAtPath = F2(
	function (path, tree) {
		var walkPath = F2(
			function (fragment, maybeField) {
				if (fragment.$ === 'IntFragment') {
					var index = fragment.a;
					return A2(
						elm$core$Maybe$andThen,
						etaque$elm_form$Form$Tree$getAtIndex(index),
						maybeField);
				} else {
					var name = fragment.a;
					return A2(
						elm$core$Maybe$andThen,
						etaque$elm_form$Form$Tree$getAtName(name),
						maybeField);
				}
			});
		return A3(
			elm$core$List$foldl,
			walkPath,
			elm$core$Maybe$Just(tree),
			etaque$elm_form$Form$Tree$extractFragments(path));
	});
var etaque$elm_form$Form$getFieldAt = F2(
	function (qualifiedName, model) {
		return A2(etaque$elm_form$Form$Tree$getAtPath, qualifiedName, model.fields);
	});
var etaque$elm_form$Form$Tree$List = function (a) {
	return {$: 'List', a: a};
};
var etaque$elm_form$Form$Tree$asList = function (value) {
	if (value.$ === 'List') {
		var items = value.a;
		return items;
	} else {
		return _List_Nil;
	}
};
var etaque$elm_form$Form$Tree$merge = F2(
	function (t1, t2) {
		var _n0 = _Utils_Tuple2(t1, t2);
		if ((_n0.a.$ === 'Group') && (_n0.b.$ === 'Group')) {
			var g1 = _n0.a.a;
			var g2 = _n0.b.a;
			return etaque$elm_form$Form$Tree$Group(
				A2(elm$core$Dict$union, g1, g2));
		} else {
			return t1;
		}
	});
var etaque$elm_form$Form$Tree$updateListAtIndex = F2(
	function (index, updater) {
		return elm$core$List$indexedMap(
			F2(
				function (i, f) {
					return _Utils_eq(i, index) ? updater(f) : f;
				}));
	});
var etaque$elm_form$Form$Tree$recursiveSet = F3(
	function (fragments, node, tree) {
		if (fragments.b) {
			var head = fragments.a;
			var rest = fragments.b;
			if (head.$ === 'IntFragment') {
				var index = head.a;
				return etaque$elm_form$Form$Tree$List(
					A3(
						etaque$elm_form$Form$Tree$updateListAtIndex,
						index,
						A2(etaque$elm_form$Form$Tree$recursiveSet, rest, node),
						etaque$elm_form$Form$Tree$asList(tree)));
			} else {
				var name = head.a;
				var target = A2(
					elm$core$Maybe$withDefault,
					etaque$elm_form$Form$Tree$Group(elm$core$Dict$empty),
					A2(etaque$elm_form$Form$Tree$getAtName, name, tree));
				var childNode = A3(etaque$elm_form$Form$Tree$recursiveSet, rest, node, target);
				return A2(
					etaque$elm_form$Form$Tree$merge,
					etaque$elm_form$Form$Tree$Group(
						elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2(name, childNode)
								]))),
					tree);
			}
		} else {
			return node;
		}
	});
var etaque$elm_form$Form$Tree$setAtPath = F3(
	function (path, node, tree) {
		return A3(
			etaque$elm_form$Form$Tree$recursiveSet,
			etaque$elm_form$Form$Tree$extractFragments(path),
			node,
			tree);
	});
var etaque$elm_form$Form$setFieldAt = F3(
	function (path, field, model) {
		return A3(etaque$elm_form$Form$Tree$setAtPath, path, field, model.fields);
	});
var etaque$elm_form$Form$Tree$asValue = function (node) {
	if (node.$ === 'Value') {
		var value = node.a;
		return elm$core$Maybe$Just(value);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var etaque$elm_form$Form$update = F3(
	function (validation, msg, _n0) {
		var model = _n0.a;
		switch (msg.$) {
			case 'NoOp':
				return etaque$elm_form$Form$F(model);
			case 'Focus':
				var name = msg.a;
				var newModel = _Utils_update(
					model,
					{
						focus: elm$core$Maybe$Just(name)
					});
				return etaque$elm_form$Form$F(newModel);
			case 'Blur':
				var name = msg.a;
				var newDirtyFields = A2(elm$core$Set$remove, name, model.dirtyFields);
				var newModel = _Utils_update(
					model,
					{dirtyFields: newDirtyFields, focus: elm$core$Maybe$Nothing});
				return etaque$elm_form$Form$F(
					A2(etaque$elm_form$Form$updateValidate, validation, newModel));
			case 'Input':
				var name = msg.a;
				var inputType = msg.b;
				var fieldValue = msg.c;
				var newFields = A3(
					etaque$elm_form$Form$setFieldAt,
					name,
					etaque$elm_form$Form$Tree$Value(fieldValue),
					model);
				var isDirty = function () {
					switch (inputType.$) {
						case 'Text':
							return true;
						case 'Textarea':
							return true;
						default:
							return false;
					}
				}();
				var newDirtyFields = isDirty ? A2(elm$core$Set$insert, name, model.dirtyFields) : model.dirtyFields;
				var _n2 = function () {
					if (A2(elm$core$Set$member, name, model.changedFields)) {
						var storedValue = A2(
							elm$core$Maybe$withDefault,
							elm$core$Maybe$Nothing,
							A2(elm$core$Dict$get, name, model.originalValues));
						var shouldBeNothing = function (v) {
							_n4$2:
							while (true) {
								switch (v.$) {
									case 'String':
										if (v.a === '') {
											return true;
										} else {
											break _n4$2;
										}
									case 'Bool':
										if (!v.a) {
											return true;
										} else {
											break _n4$2;
										}
									default:
										break _n4$2;
								}
							}
							return false;
						};
						var sameAsOriginal = function () {
							if (storedValue.$ === 'Just') {
								var v = storedValue.a;
								return _Utils_eq(v, fieldValue);
							} else {
								return shouldBeNothing(fieldValue);
							}
						}();
						var changedFields = sameAsOriginal ? A2(elm$core$Set$remove, name, model.changedFields) : model.changedFields;
						return _Utils_Tuple2(changedFields, model.originalValues);
					} else {
						var originalValue = A2(
							elm$core$Maybe$andThen,
							etaque$elm_form$Form$Tree$asValue,
							A2(etaque$elm_form$Form$getFieldAt, name, model));
						return _Utils_Tuple2(
							A2(elm$core$Set$insert, name, model.changedFields),
							A3(elm$core$Dict$insert, name, originalValue, model.originalValues));
					}
				}();
				var newChangedFields = _n2.a;
				var newOriginalValues = _n2.b;
				var newModel = _Utils_update(
					model,
					{changedFields: newChangedFields, dirtyFields: newDirtyFields, fields: newFields, originalValues: newOriginalValues});
				return etaque$elm_form$Form$F(
					A2(etaque$elm_form$Form$updateValidate, validation, newModel));
			case 'Append':
				var listName = msg.a;
				var listFields = A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						elm$core$Maybe$map,
						etaque$elm_form$Form$Tree$asList,
						A2(etaque$elm_form$Form$getFieldAt, listName, model)));
				var newListFields = _Utils_ap(
					listFields,
					_List_fromArray(
						[
							etaque$elm_form$Form$Tree$Value(etaque$elm_form$Form$Field$EmptyField)
						]));
				var newModel = _Utils_update(
					model,
					{
						fields: A3(
							etaque$elm_form$Form$setFieldAt,
							listName,
							etaque$elm_form$Form$Tree$List(newListFields),
							model)
					});
				return etaque$elm_form$Form$F(newModel);
			case 'RemoveItem':
				var listName = msg.a;
				var index = msg.b;
				var listFields = A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						elm$core$Maybe$map,
						etaque$elm_form$Form$Tree$asList,
						A2(etaque$elm_form$Form$getFieldAt, listName, model)));
				var newListFields = _Utils_ap(
					A2(elm$core$List$take, index, listFields),
					A2(elm$core$List$drop, index + 1, listFields));
				var fieldNamePattern = _Utils_ap(
					listName,
					elm$core$String$fromInt(index));
				var filterChangedFields = elm$core$Set$filter(
					A2(
						elm$core$Basics$composeL,
						elm$core$Basics$not,
						elm$core$String$startsWith(fieldNamePattern)));
				var filterOriginalValue = elm$core$Dict$filter(
					F2(
						function (c, _n6) {
							return !A2(elm$core$String$startsWith, fieldNamePattern, c);
						}));
				var newModel = _Utils_update(
					model,
					{
						changedFields: filterChangedFields(model.changedFields),
						fields: A3(
							etaque$elm_form$Form$setFieldAt,
							listName,
							etaque$elm_form$Form$Tree$List(newListFields),
							model),
						originalValues: filterOriginalValue(model.originalValues)
					});
				return etaque$elm_form$Form$F(
					A2(etaque$elm_form$Form$updateValidate, validation, newModel));
			case 'Submit':
				var validatedModel = A2(etaque$elm_form$Form$updateValidate, validation, model);
				return etaque$elm_form$Form$F(
					_Utils_update(
						validatedModel,
						{isSubmitted: true}));
			case 'Validate':
				return etaque$elm_form$Form$F(
					A2(etaque$elm_form$Form$updateValidate, validation, model));
			default:
				var fields = msg.a;
				var newModel = _Utils_update(
					model,
					{
						changedFields: elm$core$Set$empty,
						dirtyFields: elm$core$Set$empty,
						fields: etaque$elm_form$Form$Tree$group(fields),
						isSubmitted: false,
						originalValues: elm$core$Dict$empty
					});
				return etaque$elm_form$Form$F(
					A2(etaque$elm_form$Form$updateValidate, validation, newModel));
		}
	});
var author$project$Main$loginPageHandleSubmit = F3(
	function (_n4, json, state) {
		var onAuthResponse = _n4.onAuthResponse;
		return A3(
			author$project$Main$loginPageUpdate,
			{onAuthResponse: onAuthResponse},
			author$project$Main$LoginApiMsg(
				A2(author$project$Main$apiJsonRequest, '', json)),
			state);
	});
var author$project$Main$loginPageUpdate = F3(
	function (_n0, msg, state) {
		var onAuthResponse = _n0.onAuthResponse;
		var responseHandler = function (session) {
			return A2(
				elm$core$Basics$composeR,
				author$project$Update$Deep$invokeHandler(
					onAuthResponse(session)),
				A2(
					elm$core$Basics$composeR,
					author$project$Update$Deep$andThen(
						author$project$Main$loginPageSetSent(false)),
					author$project$Update$Deep$andThen(
						A2(
							author$project$Main$loginPageUpdate,
							{onAuthResponse: onAuthResponse},
							author$project$Main$LoginFormMsg(
								etaque$elm_form$Form$Reset(_List_Nil))))));
		};
		if (msg.$ === 'LoginApiMsg') {
			var apiMsg = msg.a;
			return A2(
				author$project$Update$Deep$andFinally,
				author$project$Main$loginPageInsertAsSessionIn(state),
				A2(
					author$project$Update$Deep$mapCmd,
					author$project$Main$LoginApiMsg,
					A3(
						author$project$Main$apiUpdate,
						{
							onError: elm$core$Basics$always(
								responseHandler(elm$core$Maybe$Nothing)),
							onSuccess: A2(elm$core$Basics$composeL, responseHandler, elm$core$Maybe$Just)
						},
						apiMsg,
						state.session)));
		} else {
			var formMsg = msg.a;
			var _n2 = _Utils_Tuple2(
				formMsg,
				etaque$elm_form$Form$getOutput(state.form));
			if ((_n2.a.$ === 'Submit') && (_n2.b.$ === 'Just')) {
				var _n3 = _n2.a;
				var form = _n2.b.a;
				return A2(
					author$project$Update$Deep$andThen,
					author$project$Main$loginPageSetSent(true),
					A3(
						author$project$Main$loginPageHandleSubmit,
						{onAuthResponse: onAuthResponse},
						author$project$Main$loginFormToJson(form),
						state));
			} else {
				return A2(
					author$project$Main$loginPageInsertAsFormIn,
					state,
					A3(etaque$elm_form$Form$update, author$project$Main$loginFormValidate, formMsg, state.form));
			}
		}
	});
var author$project$Main$NewProjectFormMsg = function (a) {
	return {$: 'NewProjectFormMsg', a: a};
};
var elm$json$Json$Encode$null = _Json_encodeNull;
var elm_community$json_extra$Json$Encode$Extra$maybe = function (encoder) {
	return A2(
		elm$core$Basics$composeR,
		elm$core$Maybe$map(encoder),
		elm$core$Maybe$withDefault(elm$json$Json$Encode$null));
};
var author$project$Main$newProjectFormToJson = function (_n0) {
	var name = _n0.name;
	var country = _n0.country;
	var description = _n0.description;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(name)),
				_Utils_Tuple2(
				'country',
				elm$json$Json$Encode$string(country)),
				_Utils_Tuple2(
				'description',
				A2(elm_community$json_extra$Json$Encode$Extra$maybe, elm$json$Json$Encode$string, description))
			]));
};
var author$project$Main$newProjectPageInsertAsFormIn = F2(
	function (state, form) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{form: form}));
	});
var author$project$Main$newProjectPageInsertAsProjectIn = F2(
	function (state, project) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{project: project}));
	});
var author$project$Main$newProjectPageSetSent = F2(
	function (sent, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{sent: sent}));
	});
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$json$Json$Decode$map2 = _Json_map2;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var author$project$Main$newProjectPageHandleSubmit = F3(
	function (_n4, json, state) {
		var onNewProject = _n4.onNewProject;
		return A3(
			author$project$Main$newProjectPageUpdate,
			{onNewProject: onNewProject},
			author$project$Main$NewProjectApiMsg(
				A2(author$project$Main$apiJsonRequest, '', json)),
			state);
	});
var author$project$Main$newProjectPageUpdate = F3(
	function (_n0, msg, state) {
		var onNewProject = _n0.onNewProject;
		var resetForm = A2(
			elm$core$Basics$composeR,
			author$project$Main$newProjectPageSetSent(false),
			author$project$Update$Deep$andThen(
				A2(
					author$project$Main$newProjectPageUpdate,
					{onNewProject: onNewProject},
					author$project$Main$NewProjectFormMsg(
						etaque$elm_form$Form$Reset(_List_Nil)))));
		var responseHandler = function (project) {
			return A2(
				elm$core$Basics$composeR,
				author$project$Update$Deep$invokeHandler(
					onNewProject(project)),
				author$project$Update$Deep$andThen(resetForm));
		};
		switch (msg.$) {
			case 'NewProjectApiMsg':
				var apiMsg = msg.a;
				return A2(
					author$project$Update$Deep$andFinally,
					author$project$Main$newProjectPageInsertAsProjectIn(state),
					A2(
						author$project$Update$Deep$mapCmd,
						author$project$Main$NewProjectApiMsg,
						A3(
							author$project$Main$apiUpdate,
							{
								onError: elm$core$Basics$always(
									author$project$Main$newProjectPageSetSent(false)),
								onSuccess: responseHandler
							},
							apiMsg,
							state.project)));
			case 'NewProjectPageFormCancel':
				return A2(
					author$project$Update$Deep$runCmd,
					A2(elm$browser$Browser$Navigation$replaceUrl, state.key, '/'),
					state);
			default:
				var formMsg = msg.a;
				var _n2 = _Utils_Tuple2(
					formMsg,
					etaque$elm_form$Form$getOutput(state.form));
				if ((_n2.a.$ === 'Submit') && (_n2.b.$ === 'Just')) {
					var _n3 = _n2.a;
					var form = _n2.b.a;
					return A2(
						author$project$Update$Deep$andThen,
						author$project$Main$newProjectPageSetSent(true),
						A3(
							author$project$Main$newProjectPageHandleSubmit,
							{onNewProject: onNewProject},
							author$project$Main$newProjectFormToJson(form),
							state));
				} else {
					return A2(
						author$project$Main$newProjectPageInsertAsFormIn,
						state,
						A3(etaque$elm_form$Form$update, author$project$Main$newProjectFormValidate, formMsg, state.form));
				}
		}
	});
var author$project$Main$ProfileFormMsg = function (a) {
	return {$: 'ProfileFormMsg', a: a};
};
var author$project$Main$profileFormToJson = function (_n0) {
	var name = _n0.name;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(name))
			]));
};
var author$project$Main$profilePageInsertAsFormIn = F2(
	function (state, form) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{form: form}));
	});
var author$project$Main$profilePageInsertAsUserIn = F2(
	function (state, user) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{user: user}));
	});
var author$project$Main$profilePageSetSent = F2(
	function (sent, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{sent: sent}));
	});
var author$project$Main$profilePageHandleSubmit = F3(
	function (_n4, json, state) {
		var onProfileUpdated = _n4.onProfileUpdated;
		return A3(
			author$project$Main$profilePageUpdate,
			{onProfileUpdated: onProfileUpdated},
			author$project$Main$ProfileApiMsg(
				A2(author$project$Main$apiJsonRequest, '', json)),
			state);
	});
var author$project$Main$profilePageUpdate = F3(
	function (_n0, msg, state) {
		var onProfileUpdated = _n0.onProfileUpdated;
		var responseHandler = function (user) {
			return author$project$Update$Deep$invokeHandler(
				onProfileUpdated(user));
		};
		var resetForm = A2(
			elm$core$Basics$composeR,
			author$project$Main$profilePageSetSent(false),
			author$project$Update$Deep$andThen(
				A2(
					author$project$Main$profilePageUpdate,
					{onProfileUpdated: onProfileUpdated},
					author$project$Main$ProfileFormMsg(
						etaque$elm_form$Form$Reset(_List_Nil)))));
		switch (msg.$) {
			case 'ProfileApiMsg':
				var apiMsg = msg.a;
				return A2(
					author$project$Update$Deep$andFinally,
					author$project$Main$profilePageInsertAsUserIn(state),
					A2(
						author$project$Update$Deep$mapCmd,
						author$project$Main$ProfileApiMsg,
						A3(
							author$project$Main$apiUpdate,
							{
								onError: elm$core$Basics$always(
									author$project$Main$profilePageSetSent(false)),
								onSuccess: responseHandler
							},
							apiMsg,
							state.user)));
			case 'ProfilePageFormCancel':
				return A2(
					author$project$Update$Deep$runCmd,
					A2(elm$browser$Browser$Navigation$replaceUrl, state.key, '/'),
					state);
			default:
				var formMsg = msg.a;
				var _n2 = _Utils_Tuple2(
					formMsg,
					etaque$elm_form$Form$getOutput(state.form));
				if ((_n2.a.$ === 'Submit') && (_n2.b.$ === 'Just')) {
					var _n3 = _n2.a;
					var form = _n2.b.a;
					return A2(
						author$project$Update$Deep$andThen,
						author$project$Main$profilePageSetSent(true),
						A3(
							author$project$Main$profilePageHandleSubmit,
							{onProfileUpdated: onProfileUpdated},
							author$project$Main$profileFormToJson(form),
							state));
				} else {
					return A2(
						author$project$Main$profilePageInsertAsFormIn,
						state,
						A3(etaque$elm_form$Form$update, author$project$Main$profileFormValidate, formMsg, state.form));
				}
		}
	});
var author$project$Main$ProjectHomePageApiMsg = function (a) {
	return {$: 'ProjectHomePageApiMsg', a: a};
};
var author$project$Main$projectHomePageFetchProject = author$project$Main$ProjectHomePageApiMsg(
	A2(author$project$Main$Request, '', elm$core$Maybe$Nothing));
var author$project$Main$ProjectHomePageState = function (project) {
	return {project: project};
};
var author$project$Main$projectHomePageInit = function (projectId) {
	var project = author$project$Main$apiInit(
		{
			decoder: A2(elm$json$Json$Decode$field, 'project', author$project$Data$Project$decoder),
			endpoint: '/projects/' + elm$core$String$fromInt(projectId),
			method: author$project$Main$HttpGet
		});
	return A2(
		author$project$Update$Deep$map,
		author$project$Main$ProjectHomePageState,
		A2(author$project$Update$Deep$mapCmd, author$project$Main$ProjectHomePageApiMsg, project));
};
var author$project$Main$projectHomePageInsertAsProjectIn = F2(
	function (state, project) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{project: project}));
	});
var author$project$Main$projectHomePageUpdate = F2(
	function (msg, state) {
		var apiMsg = msg.a;
		return A2(
			author$project$Update$Deep$andFinally,
			author$project$Main$projectHomePageInsertAsProjectIn(state),
			A2(
				author$project$Update$Deep$mapCmd,
				author$project$Main$ProjectHomePageApiMsg,
				A3(
					author$project$Main$apiUpdate,
					{
						onError: elm$core$Basics$always(author$project$Update$Deep$save),
						onSuccess: elm$core$Basics$always(author$project$Update$Deep$save)
					},
					apiMsg,
					state.project)));
	});
var author$project$Main$projectSettingsPageUpdate = F2(
	function (msg, state) {
		return author$project$Update$Deep$save(state);
	});
var author$project$Main$registerFormToJson = function (_n0) {
	var name = _n0.name;
	var email = _n0.email;
	var useEmailAsLogin = _n0.useEmailAsLogin;
	var login = _n0.login;
	var password = _n0.password;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(name)),
				_Utils_Tuple2(
				'email',
				elm$json$Json$Encode$string(email)),
				_Utils_Tuple2(
				'login',
				elm$json$Json$Encode$string(
					useEmailAsLogin ? email : login)),
				_Utils_Tuple2(
				'password',
				elm$json$Json$Encode$string(password))
			]));
};
var author$project$Main$registerPageInsertAsFormIn = F2(
	function (state, form) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{form: form}));
	});
var author$project$Main$registerPageInsertAsUserIn = F2(
	function (state, user) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{user: user}));
	});
var author$project$Main$registerPageSetSent = F2(
	function (sent, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{sent: sent}));
	});
var author$project$Main$registerPageHandleSubmit = F2(
	function (json, state) {
		return A2(
			author$project$Main$registerPageUpdate,
			author$project$Main$RegisterApiMsg(
				A2(author$project$Main$apiJsonRequest, '', json)),
			state);
	});
var author$project$Main$registerPageUpdate = F2(
	function (msg, state) {
		if (msg.$ === 'RegisterApiMsg') {
			var apiMsg = msg.a;
			return A2(
				author$project$Update$Deep$andFinally,
				author$project$Main$registerPageInsertAsUserIn(state),
				A2(
					author$project$Update$Deep$mapCmd,
					author$project$Main$RegisterApiMsg,
					A3(
						author$project$Main$apiUpdate,
						{
							onError: elm$core$Basics$always(
								author$project$Main$registerPageSetSent(false)),
							onSuccess: elm$core$Basics$always(author$project$Update$Deep$save)
						},
						apiMsg,
						state.user)));
		} else {
			var formMsg = msg.a;
			var _n1 = _Utils_Tuple2(
				formMsg,
				etaque$elm_form$Form$getOutput(state.form));
			if ((_n1.a.$ === 'Submit') && (_n1.b.$ === 'Just')) {
				var _n2 = _n1.a;
				var form = _n1.b.a;
				return A2(
					author$project$Update$Deep$andThen,
					author$project$Main$registerPageSetSent(true),
					A2(
						author$project$Main$registerPageHandleSubmit,
						author$project$Main$registerFormToJson(form),
						state));
			} else {
				return A2(
					author$project$Main$registerPageInsertAsFormIn,
					state,
					A3(etaque$elm_form$Form$update, author$project$Main$registerFormValidate, formMsg, state.form));
			}
		}
	});
var author$project$Main$resetPasswordFormToJson = function (_n0) {
	var login = _n0.login;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'login',
				elm$json$Json$Encode$string(login))
			]));
};
var author$project$Main$resetPasswordPageInsertAsFormIn = F2(
	function (state, form) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{form: form}));
	});
var author$project$Main$resetPasswordPageInsertAsResponseIn = F2(
	function (state, response) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{response: response}));
	});
var author$project$Main$resetPasswordPageSetSent = F2(
	function (sent, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{sent: sent}));
	});
var author$project$Main$resetPasswordPageHandleSubmit = F2(
	function (json, state) {
		return A2(
			author$project$Main$resetPasswordPageUpdate,
			author$project$Main$ResetPasswordApiMsg(
				A2(author$project$Main$apiJsonRequest, '', json)),
			state);
	});
var author$project$Main$resetPasswordPageUpdate = F2(
	function (msg, state) {
		if (msg.$ === 'ResetPasswordApiMsg') {
			var apiMsg = msg.a;
			return A2(
				author$project$Update$Deep$andFinally,
				author$project$Main$resetPasswordPageInsertAsResponseIn(state),
				A2(
					author$project$Update$Deep$mapCmd,
					author$project$Main$ResetPasswordApiMsg,
					A3(
						author$project$Main$apiUpdate,
						{
							onError: elm$core$Basics$always(
								author$project$Main$resetPasswordPageSetSent(false)),
							onSuccess: elm$core$Basics$always(author$project$Update$Deep$save)
						},
						apiMsg,
						state.response)));
		} else {
			var formMsg = msg.a;
			var _n1 = _Utils_Tuple2(
				formMsg,
				etaque$elm_form$Form$getOutput(state.form));
			if ((_n1.a.$ === 'Submit') && (_n1.b.$ === 'Just')) {
				var _n2 = _n1.a;
				var form = _n1.b.a;
				return A2(
					author$project$Update$Deep$andThen,
					author$project$Main$resetPasswordPageSetSent(true),
					A2(
						author$project$Main$resetPasswordPageHandleSubmit,
						author$project$Main$resetPasswordFormToJson(form),
						state));
			} else {
				return A2(
					author$project$Main$resetPasswordPageInsertAsFormIn,
					state,
					A3(etaque$elm_form$Form$update, author$project$Main$resetPasswordFormValidate, formMsg, state.form));
			}
		}
	});
var author$project$Main$Home = {$: 'Home'};
var author$project$Main$Login = {$: 'Login'};
var author$project$Main$Logout = {$: 'Logout'};
var author$project$Main$NewProject = {$: 'NewProject'};
var author$project$Main$Profile = {$: 'Profile'};
var author$project$Main$Projects = {$: 'Projects'};
var author$project$Main$Register = {$: 'Register'};
var author$project$Main$ResetPassword = {$: 'ResetPassword'};
var author$project$Main$Settings = {$: 'Settings'};
var elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var elm$url$Url$Parser$mapState = F2(
	function (func, _n0) {
		var visited = _n0.visited;
		var unvisited = _n0.unvisited;
		var params = _n0.params;
		var frag = _n0.frag;
		var value = _n0.value;
		return A5(
			elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var elm$url$Url$Parser$map = F2(
	function (subValue, _n0) {
		var parseArg = _n0.a;
		return elm$url$Url$Parser$Parser(
			function (_n1) {
				var visited = _n1.visited;
				var unvisited = _n1.unvisited;
				var params = _n1.params;
				var frag = _n1.frag;
				var value = _n1.value;
				return A2(
					elm$core$List$map,
					elm$url$Url$Parser$mapState(value),
					parseArg(
						A5(elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$url$Url$Parser$oneOf = function (parsers) {
	return elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				elm$core$List$concatMap,
				function (_n0) {
					var parser = _n0.a;
					return parser(state);
				},
				parsers);
		});
};
var elm$url$Url$Parser$s = function (str) {
	return elm$url$Url$Parser$Parser(
		function (_n0) {
			var visited = _n0.visited;
			var unvisited = _n0.unvisited;
			var params = _n0.params;
			var frag = _n0.frag;
			var value = _n0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						elm$url$Url$Parser$State,
						A2(elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var elm$url$Url$Parser$slash = F2(
	function (_n0, _n1) {
		var parseBefore = _n0.a;
		var parseAfter = _n1.a;
		return elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var elm$url$Url$Parser$top = elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var author$project$Main$parser = elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(elm$url$Url$Parser$map, author$project$Main$Home, elm$url$Url$Parser$top),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Login,
			elm$url$Url$Parser$s('login')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Logout,
			elm$url$Url$Parser$s('logout')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$ResetPassword,
			elm$url$Url$Parser$s('reset-password')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Register,
			elm$url$Url$Parser$s('register')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Profile,
			elm$url$Url$Parser$s('profile')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Settings,
			elm$url$Url$Parser$s('settings')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Projects,
			elm$url$Url$Parser$s('projects')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$NewProject,
			A2(
				elm$url$Url$Parser$slash,
				elm$url$Url$Parser$s('projects'),
				elm$url$Url$Parser$s('new')))
		]));
var elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _n1 = state.unvisited;
			if (!_n1.b) {
				return elm$core$Maybe$Just(state.value);
			} else {
				if ((_n1.a === '') && (!_n1.b.b)) {
					return elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				elm$core$List$cons,
				segment,
				elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var elm$url$Url$Parser$preparePath = function (path) {
	var _n0 = A2(elm$core$String$split, '/', path);
	if (_n0.b && (_n0.a === '')) {
		var segments = _n0.b;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _n0;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var elm$url$Url$percentDecode = _Url_percentDecode;
var elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return elm$core$Maybe$Just(
				A2(elm$core$List$cons, value, list));
		}
	});
var elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _n0 = A2(elm$core$String$split, '=', segment);
		if ((_n0.b && _n0.b.b) && (!_n0.b.b.b)) {
			var rawKey = _n0.a;
			var _n1 = _n0.b;
			var rawValue = _n1.a;
			var _n2 = elm$url$Url$percentDecode(rawKey);
			if (_n2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _n2.a;
				var _n3 = elm$url$Url$percentDecode(rawValue);
				if (_n3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _n3.a;
					return A3(
						elm$core$Dict$update,
						key,
						elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			elm$core$List$foldr,
			elm$url$Url$Parser$addParam,
			elm$core$Dict$empty,
			A2(elm$core$String$split, '&', qry));
	}
};
var elm$url$Url$Parser$parse = F2(
	function (_n0, url) {
		var parser = _n0.a;
		return elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					elm$url$Url$Parser$State,
					_List_Nil,
					elm$url$Url$Parser$preparePath(url.path),
					elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					elm$core$Basics$identity)));
	});
var author$project$Main$fromUrl = elm$url$Url$Parser$parse(author$project$Main$parser);
var author$project$Main$routerRedirect = F2(
	function (key, href) {
		return author$project$Update$Deep$runCmd(
			A2(elm$browser$Browser$Navigation$replaceUrl, key, href));
	});
var author$project$Main$setRoute = F2(
	function (route, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{route: route}));
	});
var elm$browser$Browser$Navigation$load = _Browser_load;
var elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + elm$core$String$fromInt(port_));
		}
	});
var elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var elm$url$Url$toString = function (url) {
	var http = function () {
		var _n0 = url.protocol;
		if (_n0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var author$project$Main$routerUpdate = F3(
	function (_n0, msg, state) {
		var onRouteChange = _n0.onRouteChange;
		return function () {
			switch (msg.$) {
				case 'UrlChange':
					var url = msg.a;
					var route = author$project$Main$fromUrl(url);
					return A2(
						elm$core$Basics$composeR,
						author$project$Main$setRoute(route),
						author$project$Update$Deep$andInvokeHandler(
							onRouteChange(route)));
				case 'UrlRequest':
					if (msg.a.$ === 'Internal') {
						var url = msg.a.a;
						return author$project$Update$Deep$runCmd(
							A2(
								elm$browser$Browser$Navigation$pushUrl,
								state.key,
								elm$url$Url$toString(url)));
					} else {
						var href = msg.a.a;
						return author$project$Update$Deep$runCmd(
							elm$browser$Browser$Navigation$load(href));
					}
				default:
					var href = msg.a;
					return A2(author$project$Main$routerRedirect, state.key, href);
			}
		}()(state);
	});
var author$project$Main$ProjectsListApiMsg = function (a) {
	return {$: 'ProjectsListApiMsg', a: a};
};
var author$project$Main$selectProjectFetchProjects = author$project$Main$ProjectsListApiMsg(
	A2(author$project$Main$Request, '', elm$core$Maybe$Nothing));
var author$project$Main$SelectProjectPageState = F3(
	function (projects, query, results) {
		return {projects: projects, query: query, results: results};
	});
var author$project$Main$selectProjectPageInit = function () {
	var projects = author$project$Main$apiInit(
		{
			decoder: A2(
				elm$json$Json$Decode$field,
				'projects',
				elm$json$Json$Decode$list(author$project$Data$Project$decoder)),
			endpoint: '/projects',
			method: author$project$Main$HttpGet
		});
	return A2(
		author$project$Update$Deep$andMap,
		author$project$Update$Deep$save(_List_Nil),
		A2(
			author$project$Update$Deep$andMap,
			author$project$Update$Deep$save(''),
			A2(
				author$project$Update$Deep$andMap,
				A2(author$project$Update$Deep$mapCmd, author$project$Main$ProjectsListApiMsg, projects),
				author$project$Update$Deep$save(author$project$Main$SelectProjectPageState))));
}();
var author$project$Main$selectProjectPageInsertAsProjectsIn = F2(
	function (state, projects) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{projects: projects}));
	});
var author$project$Main$WebSocketSearchProjectsResults = function (a) {
	return {$: 'WebSocketSearchProjectsResults', a: a};
};
var author$project$Main$WebSocketSearchProjectsResultsPayload = F2(
	function (query, results) {
		return {query: query, results: results};
	});
var author$project$Main$webSocketSearchProjectsResultsDecoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Main$WebSocketSearchProjectsResultsPayload,
	A2(elm$json$Json$Decode$field, 'query', elm$json$Json$Decode$string),
	A2(
		elm$json$Json$Decode$field,
		'results',
		elm$json$Json$Decode$list(author$project$Data$Project$decoder)));
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$fail = _Json_fail;
var author$project$Main$websocketMessageDecoder = function () {
	var payloadDecoder = function (type_) {
		if (type_ === 'search_projects_results') {
			return A2(elm$json$Json$Decode$map, author$project$Main$WebSocketSearchProjectsResults, author$project$Main$webSocketSearchProjectsResultsDecoder);
		} else {
			return elm$json$Json$Decode$fail('Unrecognized message type');
		}
	};
	return A2(
		elm$json$Json$Decode$andThen,
		payloadDecoder,
		A2(elm$json$Json$Decode$field, 'type', elm$json$Json$Decode$string));
}();
var author$project$Main$websocketProjectEncodeSearchQuery = function (query) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'type',
				elm$json$Json$Encode$string('search_projects')),
				_Utils_Tuple2(
				'query',
				elm$json$Json$Encode$string(query))
			]));
};
var author$project$Ports$websocketOut = _Platform_outgoingPort('websocketOut', elm$json$Json$Encode$string);
var author$project$Main$selectProjectPageUpdate = F3(
	function (_n0, msg, state) {
		var onProjectSelected = _n0.onProjectSelected;
		switch (msg.$) {
			case 'SelectProjectQuery':
				var query = msg.a;
				return A2(
					author$project$Update$Deep$andRunCmd,
					author$project$Ports$websocketOut(
						A2(
							elm$json$Json$Encode$encode,
							0,
							author$project$Main$websocketProjectEncodeSearchQuery(query))),
					author$project$Update$Deep$save(
						_Utils_update(
							state,
							{query: query})));
			case 'ProjectsListApiMsg':
				var apiMsg = msg.a;
				return A2(
					author$project$Update$Deep$andFinally,
					author$project$Main$selectProjectPageInsertAsProjectsIn(state),
					A2(
						author$project$Update$Deep$mapCmd,
						author$project$Main$ProjectsListApiMsg,
						A3(
							author$project$Main$apiUpdate,
							{
								onError: elm$core$Basics$always(author$project$Update$Deep$save),
								onSuccess: elm$core$Basics$always(author$project$Update$Deep$save)
							},
							apiMsg,
							state.projects)));
			case 'SelectProject':
				var project = msg.a;
				return A2(
					author$project$Update$Deep$invokeHandler,
					onProjectSelected(project),
					state);
			default:
				var websocketMsg = msg.a;
				var _n2 = A2(elm$json$Json$Decode$decodeString, author$project$Main$websocketMessageDecoder, websocketMsg);
				if (_n2.$ === 'Ok') {
					var searchProjectsResults = _n2.a.a;
					return _Utils_eq(searchProjectsResults.query, state.query) ? author$project$Update$Deep$save(
						_Utils_update(
							state,
							{results: searchProjectsResults.results})) : author$project$Update$Deep$save(state);
				} else {
					return author$project$Update$Deep$save(state);
				}
		}
	});
var author$project$Main$setSession = F2(
	function (session, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{session: session}));
	});
var author$project$Main$setWorkingProject = F2(
	function (project, state) {
		var session = state.session;
		return function () {
			if (session.$ === 'Nothing') {
				return author$project$Update$Deep$save;
			} else {
				var session_ = session.a;
				return author$project$Main$setSession(
					elm$core$Maybe$Just(
						_Utils_update(
							session_,
							{
								project: elm$core$Maybe$Just(project)
							})));
			}
		}()(state);
	});
var author$project$Ports$clearSession = _Platform_outgoingPort(
	'clearSession',
	function ($) {
		return elm$json$Json$Encode$null;
	});
var elm$core$Maybe$destruct = F3(
	function (_default, func, maybe) {
		if (maybe.$ === 'Just') {
			var a = maybe.a;
			return func(a);
		} else {
			return _default;
		}
	});
var elm$json$Json$Encode$int = _Json_wrap;
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var author$project$Ports$setSession = _Platform_outgoingPort(
	'setSession',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'notifications',
					elm$json$Json$Encode$list(
						function ($) {
							return elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'id',
										elm$json$Json$Encode$int($.id)),
										_Utils_Tuple2(
										'message',
										elm$json$Json$Encode$string($.message)),
										_Utils_Tuple2(
										'time',
										elm$json$Json$Encode$int($.time))
									]));
						})($.notifications)),
					_Utils_Tuple2(
					'project',
					function ($) {
						return A3(
							elm$core$Maybe$destruct,
							elm$json$Json$Encode$null,
							function ($) {
								return elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'country',
											elm$json$Json$Encode$string($.country)),
											_Utils_Tuple2(
											'id',
											elm$json$Json$Encode$int($.id)),
											_Utils_Tuple2(
											'name',
											elm$json$Json$Encode$string($.name))
										]));
							},
							$);
					}($.project)),
					_Utils_Tuple2(
					'user',
					function ($) {
						return elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'email',
									elm$json$Json$Encode$string($.email)),
									_Utils_Tuple2(
									'id',
									elm$json$Json$Encode$int($.id)),
									_Utils_Tuple2(
									'login',
									elm$json$Json$Encode$string($.login)),
									_Utils_Tuple2(
									'name',
									elm$json$Json$Encode$string($.name)),
									_Utils_Tuple2(
									'rememberMe',
									elm$json$Json$Encode$bool($.rememberMe))
								]));
					}($.user))
				]));
	});
var author$project$Main$updateSessionStorage = function (state) {
	var session = state.session;
	return function () {
		if (session.$ === 'Nothing') {
			return author$project$Update$Deep$runCmd(
				author$project$Ports$clearSession(_Utils_Tuple0));
		} else {
			var session_ = session.a;
			return author$project$Update$Deep$runCmd(
				author$project$Ports$setSession(session_));
		}
	}()(state);
};
var author$project$Main$setNotifications = F2(
	function (notifications, state) {
		var session = state.session;
		return function () {
			if (session.$ === 'Nothing') {
				return author$project$Update$Deep$save;
			} else {
				var session_ = session.a;
				return author$project$Main$setSession(
					elm$core$Maybe$Just(
						_Utils_update(
							session_,
							{notifications: notifications})));
			}
		}()(state);
	});
var author$project$Main$handleNotificationsFetched = F2(
	function (notifications, state) {
		return A2(
			author$project$Update$Deep$andThen,
			author$project$Main$updateSessionStorage,
			A2(author$project$Main$setNotifications, notifications, state));
	});
var author$project$Main$insertAsUiIn = F2(
	function (state, ui) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{ui: ui}));
	});
var author$project$Main$uiStateSetNotifications = F2(
	function (notifications, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{notifications: notifications}));
	});
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var author$project$Main$dismissNotification = F2(
	function (id, state) {
		var notifications = state.notifications;
		return function () {
			var _n0 = notifications.resource;
			if (_n0.$ === 'Available') {
				var availableNotifications = _n0.a;
				var resource = A2(
					elm$core$List$filter,
					function (notif) {
						return !_Utils_eq(notif.id, id);
					},
					availableNotifications);
				return author$project$Main$uiStateSetNotifications(
					_Utils_update(
						notifications,
						{
							resource: author$project$Main$Available(resource)
						}));
			} else {
				return author$project$Update$Deep$save;
			}
		}()(state);
	});
var author$project$Main$insertAsNotificationsIn = F2(
	function (state, notifications) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{notifications: notifications}));
	});
var author$project$Main$insertAsNotificationsModalIn = F2(
	function (state, notificationsModal) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{notificationsModal: notificationsModal}));
	});
var author$project$Main$setNotificationsModalVisibility = F2(
	function (visibility, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{modal: visibility}));
	});
var rundis$elm_bootstrap$Bootstrap$Modal$Show = {$: 'Show'};
var rundis$elm_bootstrap$Bootstrap$Modal$shown = rundis$elm_bootstrap$Bootstrap$Modal$Show;
var author$project$Main$notificationsModalUpdate = F3(
	function (_n0, msg, state) {
		var onDismiss = _n0.onDismiss;
		switch (msg.$) {
			case 'NotificationsModalOpen':
				var notification = msg.a;
				return A2(
					author$project$Main$setNotificationsModalVisibility,
					rundis$elm_bootstrap$Bootstrap$Modal$shown,
					_Utils_update(
						state,
						{
							notification: elm$core$Maybe$Just(notification)
						}));
			case 'NotificationsModalClose':
				return A2(author$project$Main$setNotificationsModalVisibility, rundis$elm_bootstrap$Bootstrap$Modal$hidden, state);
			case 'NotificationsModalAnimate':
				var visibility = msg.a;
				return A2(author$project$Main$setNotificationsModalVisibility, visibility, state);
			default:
				return function () {
					var _n2 = state.notification;
					if (_n2.$ === 'Nothing') {
						return author$project$Update$Deep$save;
					} else {
						var id = _n2.a.id;
						return A2(
							elm$core$Basics$composeR,
							author$project$Update$Deep$invokeHandler(
								onDismiss(id)),
							author$project$Update$Deep$andThen(
								author$project$Main$setNotificationsModalVisibility(rundis$elm_bootstrap$Bootstrap$Modal$hidden)));
					}
				}()(state);
		}
	});
var author$project$Main$setEventsDropdownStatus = F2(
	function (status, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{notifsDropdownStatus: status}));
	});
var author$project$Main$setUserDropdownStatus = F2(
	function (status, state) {
		return author$project$Update$Deep$save(
			_Utils_update(
				state,
				{userDropdownStatus: status}));
	});
var author$project$Main$Open = {$: 'Open'};
var author$project$Main$toggleDropdownStatus = function (status) {
	switch (status.$) {
		case 'Open':
			return author$project$Main$Closed;
		case 'Listen':
			return author$project$Main$Closed;
		default:
			return author$project$Main$Open;
	}
};
var author$project$Main$toggleSidebar = function (state) {
	return author$project$Update$Deep$save(
		_Utils_update(
			state,
			{sidebarVisible: !state.sidebarVisible}));
};
var author$project$Main$uiUpdate = F3(
	function (_n0, msg, state) {
		var onNotificationsFetched = _n0.onNotificationsFetched;
		switch (msg.$) {
			case 'ToggleSidebar':
				return author$project$Main$toggleSidebar(state);
			case 'ToggleUserDropdown':
				return A2(
					author$project$Main$setUserDropdownStatus,
					author$project$Main$toggleDropdownStatus(state.userDropdownStatus),
					state);
			case 'ToggleEventsDropdown':
				return A2(
					author$project$Main$setEventsDropdownStatus,
					author$project$Main$toggleDropdownStatus(state.notifsDropdownStatus),
					state);
			case 'UserDropdownStatus':
				var dropdownStatus = msg.a;
				return A2(author$project$Main$setUserDropdownStatus, dropdownStatus, state);
			case 'EventsDropdownStatus':
				var dropdownStatus = msg.a;
				return A2(author$project$Main$setEventsDropdownStatus, dropdownStatus, state);
			case 'NotificationsModalMsg':
				var notificationsModalMsg = msg.a;
				return A2(
					author$project$Update$Deep$andFinally,
					author$project$Main$insertAsNotificationsModalIn(state),
					A2(
						author$project$Update$Deep$mapCmd,
						author$project$Main$NotificationsModalMsg,
						A3(
							author$project$Main$notificationsModalUpdate,
							{onDismiss: author$project$Main$dismissNotification},
							notificationsModalMsg,
							state.notificationsModal)));
			case 'NotificationsApiMsg':
				var apiMsg = msg.a;
				return A2(
					author$project$Update$Deep$andFinally,
					author$project$Main$insertAsNotificationsIn(state),
					A2(
						author$project$Update$Deep$mapCmd,
						author$project$Main$NotificationsApiMsg,
						A3(
							author$project$Main$apiUpdate,
							{
								onError: elm$core$Basics$always(
									author$project$Update$Deep$invokeHandler(
										onNotificationsFetched(_List_Nil))),
								onSuccess: A2(elm$core$Basics$composeL, author$project$Update$Deep$invokeHandler, onNotificationsFetched)
							},
							apiMsg,
							state.notifications)));
			default:
				return A3(
					author$project$Main$uiUpdate,
					{onNotificationsFetched: onNotificationsFetched},
					author$project$Main$NotificationsApiMsg(
						A2(author$project$Main$Request, '', elm$core$Maybe$Nothing)),
					state);
		}
	});
var author$project$Main$updateUiWith = F2(
	function (msg, state) {
		return A2(
			author$project$Update$Deep$andFinally,
			author$project$Main$insertAsUiIn(state),
			A2(
				author$project$Update$Deep$mapCmd,
				author$project$Main$UiMsg,
				A3(
					author$project$Main$uiUpdate,
					{onNotificationsFetched: author$project$Main$handleNotificationsFetched},
					msg,
					state.ui)));
	});
var author$project$Update$Deep$andThenIf = F3(
	function (b, f, _do) {
		return b ? author$project$Update$Deep$join(
			A2(author$project$Update$Deep$map, f, _do)) : _do;
	});
var elm_community$maybe_extra$Maybe$Extra$isJust = function (m) {
	if (m.$ === 'Nothing') {
		return false;
	} else {
		return true;
	}
};
var author$project$Main$authenticatedRoute = F3(
	function (_n18, route, state) {
		var project = _n18.project;
		var user = _n18.user;
		return function () {
			switch (route.$) {
				case 'Projects':
					return author$project$Main$loadSelectProjectPage;
				case 'NewProject':
					return author$project$Main$loadNewProjectPage;
				case 'Profile':
					return author$project$Main$loadProfilePage(user);
				default:
					if (project.$ === 'Nothing') {
						return author$project$Main$cyclic$redirect()('/projects');
					} else {
						var project_ = project.a;
						return A3(author$project$Main$projectRoute, user, project_, route);
					}
			}
		}()(state);
	});
var author$project$Main$handleAuthResponse = F2(
	function (maybeSession, state) {
		return A3(
			author$project$Update$Deep$andThenIf,
			elm_community$maybe_extra$Maybe$Extra$isJust(maybeSession),
			author$project$Main$cyclic$redirect()('/'),
			A2(
				author$project$Update$Deep$andThen,
				author$project$Main$updateSessionStorage,
				A2(author$project$Main$setSession, maybeSession, state)));
	});
var author$project$Main$handleProfileUpdated = F2(
	function (user, state) {
		return function () {
			var _n17 = state.session;
			if (_n17.$ === 'Nothing') {
				return author$project$Update$Deep$save;
			} else {
				var session = _n17.a;
				return A2(
					elm$core$Basics$composeR,
					author$project$Main$setSession(
						elm$core$Maybe$Just(
							_Utils_update(
								session,
								{user: user}))),
					A2(
						elm$core$Basics$composeR,
						author$project$Update$Deep$andThen(author$project$Main$updateSessionStorage),
						author$project$Update$Deep$andThen(
							author$project$Main$cyclic$redirect()('/'))));
			}
		}()(state);
	});
var author$project$Main$handleProjectSelected = F2(
	function (project, state) {
		return A2(
			author$project$Update$Deep$andThen,
			author$project$Main$cyclic$redirect()('/'),
			A2(
				author$project$Update$Deep$andThen,
				author$project$Main$updateUiWith(author$project$Main$FetchNotifications),
				A2(
					author$project$Update$Deep$andThen,
					author$project$Main$updateSessionStorage,
					A2(author$project$Main$setWorkingProject, project, state))));
	});
var author$project$Main$handleRouteChange = F2(
	function (maybeRoute, state) {
		var authenticated = elm_community$maybe_extra$Maybe$Extra$isJust(state.session);
		return function () {
			if (maybeRoute.$ === 'Nothing') {
				return author$project$Update$Deep$save;
			} else {
				switch (maybeRoute.a.$) {
					case 'Login':
						var _n12 = maybeRoute.a;
						return authenticated ? author$project$Main$cyclic$redirect()('/') : author$project$Main$loadLoginPage;
					case 'Register':
						var _n13 = maybeRoute.a;
						return authenticated ? author$project$Main$cyclic$redirect()('/') : author$project$Main$loadRegisterPage;
					case 'ResetPassword':
						var _n14 = maybeRoute.a;
						return authenticated ? author$project$Main$cyclic$redirect()('/') : author$project$Main$loadResetPasswordPage;
					case 'Logout':
						var _n15 = maybeRoute.a;
						return A2(
							elm$core$Basics$composeR,
							author$project$Main$setSession(elm$core$Maybe$Nothing),
							A2(
								elm$core$Basics$composeR,
								author$project$Update$Deep$andThen(author$project$Main$updateSessionStorage),
								author$project$Update$Deep$andThen(
									author$project$Main$cyclic$redirect()('/'))));
					default:
						var route = maybeRoute.a;
						var _n16 = state.session;
						if (_n16.$ === 'Nothing') {
							return author$project$Main$cyclic$redirect()('/login');
						} else {
							var session = _n16.a;
							return A2(author$project$Main$authenticatedRoute, session, route);
						}
				}
			}
		}()(state);
	});
var author$project$Main$loadHomePage = F2(
	function (projectId, state) {
		return A2(
			author$project$Update$Deep$andThen,
			author$project$Main$update(
				author$project$Main$PageMsg(
					author$project$Main$ProjectHomePageMsg(author$project$Main$projectHomePageFetchProject))),
			A2(
				author$project$Update$Deep$andFinally,
				A2(
					elm$core$Basics$composeL,
					author$project$Main$insertAsPageIn(state),
					author$project$Main$ProjectHomePage),
				A2(
					author$project$Update$Deep$mapCmd,
					A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProjectHomePageMsg),
					author$project$Main$projectHomePageInit(projectId))));
	});
var author$project$Main$loadSelectProjectPage = function (state) {
	return A2(
		author$project$Update$Deep$andThen,
		author$project$Main$update(
			author$project$Main$PageMsg(
				author$project$Main$SelectProjectPageMsg(author$project$Main$selectProjectFetchProjects))),
		A2(
			author$project$Update$Deep$andFinally,
			A2(
				elm$core$Basics$composeL,
				author$project$Main$insertAsPageIn(state),
				author$project$Main$SelectProjectPage),
			A2(
				author$project$Update$Deep$mapCmd,
				A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$SelectProjectPageMsg),
				author$project$Main$selectProjectPageInit)));
};
var author$project$Main$pageUpdate = F2(
	function (msg, state) {
		var page = state.page;
		switch (page.$) {
			case 'LoginPage':
				var loginPageState = page.a;
				if (msg.$ === 'LoginPageMsg') {
					var loginPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$LoginPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$LoginPageMsg),
							A3(
								author$project$Main$loginPageUpdate,
								{onAuthResponse: author$project$Main$handleAuthResponse},
								loginPageMsg,
								loginPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'RegisterPage':
				var registerPageState = page.a;
				if (msg.$ === 'RegisterPageMsg') {
					var registerPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$RegisterPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$RegisterPageMsg),
							A2(author$project$Main$registerPageUpdate, registerPageMsg, registerPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'SelectProjectPage':
				var selectProjectPageState = page.a;
				if (msg.$ === 'SelectProjectPageMsg') {
					var selectProjectPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$SelectProjectPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$SelectProjectPageMsg),
							A3(
								author$project$Main$selectProjectPageUpdate,
								{onProjectSelected: author$project$Main$handleProjectSelected},
								selectProjectPageMsg,
								selectProjectPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'ResetPasswordPage':
				var resetPasswordPageState = page.a;
				if (msg.$ === 'ResetPasswordPageMsg') {
					var resetPasswordPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$ResetPasswordPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ResetPasswordPageMsg),
							A2(author$project$Main$resetPasswordPageUpdate, resetPasswordPageMsg, resetPasswordPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'ProfilePage':
				var profilePageState = page.a;
				if (msg.$ === 'ProfilePageMsg') {
					var profilePageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$ProfilePage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProfilePageMsg),
							A3(
								author$project$Main$profilePageUpdate,
								{onProfileUpdated: author$project$Main$handleProfileUpdated},
								profilePageMsg,
								profilePageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'NewProjectPage':
				var newProjectPageState = page.a;
				if (msg.$ === 'NewProjectPageMsg') {
					var newProjectPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$NewProjectPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$NewProjectPageMsg),
							A3(
								author$project$Main$newProjectPageUpdate,
								{onNewProject: author$project$Main$handleProjectSelected},
								newProjectPageMsg,
								newProjectPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'ProjectHomePage':
				var projectHomePageState = page.a;
				if (msg.$ === 'ProjectHomePageMsg') {
					var projectHomePageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$ProjectHomePage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProjectHomePageMsg),
							A2(author$project$Main$projectHomePageUpdate, projectHomePageMsg, projectHomePageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			case 'ProjectSettingsPage':
				var projectSettingsPageState = page.a;
				if (msg.$ === 'ProjectSettingsPageMsg') {
					var projectSettingsPageMsg = msg.a;
					return A2(
						author$project$Update$Deep$andFinally,
						A2(
							elm$core$Basics$composeL,
							author$project$Main$insertAsPageIn(state),
							author$project$Main$ProjectSettingsPage),
						A2(
							author$project$Update$Deep$mapCmd,
							A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProjectSettingsPageMsg),
							A2(author$project$Main$projectSettingsPageUpdate, projectSettingsPageMsg, projectSettingsPageState)));
				} else {
					return author$project$Update$Deep$save(state);
				}
			default:
				return author$project$Update$Deep$save(state);
		}
	});
var author$project$Main$projectRoute = F4(
	function (user, project, route, state) {
		return function () {
			switch (route.$) {
				case 'Home':
					return author$project$Main$loadHomePage(project.id);
				case 'Settings':
					return author$project$Main$loadSettingsPage;
				default:
					return author$project$Update$Deep$save;
			}
		}()(state);
	});
var author$project$Main$update = F2(
	function (msg, state) {
		return function () {
			switch (msg.$) {
				case 'RouterMsg':
					var routerMsg = msg.a;
					return author$project$Main$updateRouterWith(routerMsg);
				case 'UiMsg':
					var uiMsg = msg.a;
					return author$project$Main$updateUiWith(uiMsg);
				default:
					var pageMsg = msg.a;
					return author$project$Main$pageUpdate(pageMsg);
			}
		}()(state);
	});
var author$project$Main$updateRouterWith = F2(
	function (msg, state) {
		return A2(
			author$project$Update$Deep$andFinally,
			author$project$Main$insertAsRouterIn(state),
			A2(
				author$project$Update$Deep$mapCmd,
				author$project$Main$RouterMsg,
				A3(
					author$project$Main$routerUpdate,
					{onRouteChange: author$project$Main$handleRouteChange},
					msg,
					state.router)));
	});
function author$project$Main$cyclic$redirect() {
	return A2(elm$core$Basics$composeL, author$project$Main$updateRouterWith, author$project$Main$Redirect);
}
try {
	var author$project$Main$redirect = author$project$Main$cyclic$redirect();
	author$project$Main$cyclic$redirect = function () {
		return author$project$Main$redirect;
	};
} catch ($) {
throw 'Some top-level definitions from `Main` are causing infinite recursion:\n\n  ┌─────┐\n  │    authenticatedRoute\n  │     ↓\n  │    handleAuthResponse\n  │     ↓\n  │    handleProfileUpdated\n  │     ↓\n  │    handleProjectSelected\n  │     ↓\n  │    handleRouteChange\n  │     ↓\n  │    loadHomePage\n  │     ↓\n  │    loadSelectProjectPage\n  │     ↓\n  │    pageUpdate\n  │     ↓\n  │    projectRoute\n  │     ↓\n  │    redirect\n  │     ↓\n  │    update\n  │     ↓\n  │    updateRouterWith\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.0/halting-problem to learn how to fix it!';}
var author$project$Main$init = F3(
	function (flags, url, key) {
		return A2(
			author$project$Update$Deep$andThen,
			author$project$Main$updateUiWith(author$project$Main$FetchNotifications),
			A2(
				author$project$Update$Deep$andThen,
				author$project$Main$updateRouterWith(
					author$project$Main$UrlChange(url)),
				A2(
					author$project$Update$Deep$andMap,
					author$project$Update$Deep$save(author$project$Main$NoPage),
					A2(
						author$project$Update$Deep$andMap,
						author$project$Update$Deep$save(
							author$project$Main$initSession(flags)),
						A2(
							author$project$Update$Deep$andMap,
							A2(author$project$Update$Deep$mapCmd, author$project$Main$UiMsg, author$project$Main$uiInit),
							A2(
								author$project$Update$Deep$andMap,
								A2(
									author$project$Update$Deep$mapCmd,
									author$project$Main$RouterMsg,
									author$project$Main$routerInit(key)),
								author$project$Update$Deep$save(author$project$Main$State)))))));
	});
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$core$Platform$Sub$none = elm$core$Platform$Sub$batch(_List_Nil);
var author$project$Main$loginPageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$newProjectPageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$profilePageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$projectHomePageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$projectSettingsPageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$registerPageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$resetPasswordPageSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$SelectProjectWebsocketMsg = function (a) {
	return {$: 'SelectProjectWebsocketMsg', a: a};
};
var author$project$Ports$websocketIn = _Platform_incomingPort('websocketIn', elm$json$Json$Decode$string);
var author$project$Main$selectProjectPageSubscriptions = F2(
	function (state, msg) {
		return author$project$Ports$websocketIn(
			A2(elm$core$Basics$composeL, msg, author$project$Main$SelectProjectWebsocketMsg));
	});
var author$project$Main$pageSubscriptions = F2(
	function (page, msg) {
		switch (page.$) {
			case 'NoPage':
				return elm$core$Platform$Sub$none;
			case 'LoginPage':
				var loginPageState = page.a;
				return A2(
					author$project$Main$loginPageSubscriptions,
					loginPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$LoginPageMsg));
			case 'RegisterPage':
				var registerPageState = page.a;
				return A2(
					author$project$Main$registerPageSubscriptions,
					registerPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$RegisterPageMsg));
			case 'SelectProjectPage':
				var selectProjectPageState = page.a;
				return A2(
					author$project$Main$selectProjectPageSubscriptions,
					selectProjectPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$SelectProjectPageMsg));
			case 'ResetPasswordPage':
				var resetPasswordPageState = page.a;
				return A2(
					author$project$Main$resetPasswordPageSubscriptions,
					resetPasswordPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$ResetPasswordPageMsg));
			case 'ProfilePage':
				var profilePageState = page.a;
				return A2(
					author$project$Main$profilePageSubscriptions,
					profilePageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$ProfilePageMsg));
			case 'NewProjectPage':
				var newProjectPageState = page.a;
				return A2(
					author$project$Main$newProjectPageSubscriptions,
					newProjectPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$NewProjectPageMsg));
			case 'ProjectHomePage':
				var projectHomePageState = page.a;
				return A2(
					author$project$Main$projectHomePageSubscriptions,
					projectHomePageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$ProjectHomePageMsg));
			default:
				var projectSettingsPageState = page.a;
				return A2(
					author$project$Main$projectSettingsPageSubscriptions,
					projectSettingsPageState,
					A2(elm$core$Basics$composeL, msg, author$project$Main$ProjectSettingsPageMsg));
		}
	});
var author$project$Main$routerSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$none;
	});
var author$project$Main$EventsDropdownStatus = function (a) {
	return {$: 'EventsDropdownStatus', a: a};
};
var author$project$Main$UserDropdownStatus = function (a) {
	return {$: 'UserDropdownStatus', a: a};
};
var author$project$Main$Listen = {$: 'Listen'};
var elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var elm$browser$Browser$AnimationManager$init = elm$core$Task$succeed(
	A3(elm$browser$Browser$AnimationManager$State, _List_Nil, elm$core$Maybe$Nothing, 0));
var elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _n0) {
		var request = _n0.request;
		var oldTime = _n0.oldTime;
		var _n1 = _Utils_Tuple2(request, subs);
		if (_n1.a.$ === 'Nothing') {
			if (!_n1.b.b) {
				var _n2 = _n1.a;
				return elm$browser$Browser$AnimationManager$init;
			} else {
				var _n4 = _n1.a;
				return A2(
					elm$core$Task$andThen,
					function (pid) {
						return A2(
							elm$core$Task$andThen,
							function (time) {
								return elm$core$Task$succeed(
									A3(
										elm$browser$Browser$AnimationManager$State,
										subs,
										elm$core$Maybe$Just(pid),
										time));
							},
							elm$browser$Browser$AnimationManager$now);
					},
					elm$core$Process$spawn(
						A2(
							elm$core$Task$andThen,
							elm$core$Platform$sendToSelf(router),
							elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_n1.b.b) {
				var pid = _n1.a.a;
				return A2(
					elm$core$Task$andThen,
					function (_n3) {
						return elm$browser$Browser$AnimationManager$init;
					},
					elm$core$Process$kill(pid));
			} else {
				return elm$core$Task$succeed(
					A3(elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var elm$time$Time$millisToPosix = elm$time$Time$Posix;
var elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _n0) {
		var subs = _n0.subs;
		var oldTime = _n0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(
						elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			elm$core$Task$andThen,
			function (pid) {
				return A2(
					elm$core$Task$andThen,
					function (_n1) {
						return elm$core$Task$succeed(
							A3(
								elm$browser$Browser$AnimationManager$State,
								subs,
								elm$core$Maybe$Just(pid),
								newTime));
					},
					elm$core$Task$sequence(
						A2(elm$core$List$map, send, subs)));
			},
			elm$core$Process$spawn(
				A2(
					elm$core$Task$andThen,
					elm$core$Platform$sendToSelf(router),
					elm$browser$Browser$AnimationManager$rAF)));
	});
var elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Time(
				A2(elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return elm$browser$Browser$AnimationManager$Delta(
				A2(elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager(elm$browser$Browser$AnimationManager$init, elm$browser$Browser$AnimationManager$onEffects, elm$browser$Browser$AnimationManager$onSelfMsg, 0, elm$browser$Browser$AnimationManager$subMap);
var elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return elm$browser$Browser$AnimationManager$subscription(
		elm$browser$Browser$AnimationManager$Time(tagger));
};
var elm$browser$Browser$Events$onAnimationFrame = elm$browser$Browser$AnimationManager$onAnimationFrame;
var elm$browser$Browser$Events$Document = {$: 'Document'};
var elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var elm$browser$Browser$Events$init = elm$core$Task$succeed(
	A2(elm$browser$Browser$Events$State, _List_Nil, elm$core$Dict$empty));
var elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var elm$browser$Browser$Events$spawn = F3(
	function (router, key, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						elm$core$Platform$sendToSelf,
						router,
						A2(elm$browser$Browser$Events$Event, key, event));
				}));
	});
var elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _n0) {
				stepState:
				while (true) {
					var list = _n0.a;
					var result = _n0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _n2 = list.a;
						var lKey = _n2.a;
						var lValue = _n2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_n0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_n0 = $temp$_n0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _n3 = A3(
			elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _n3.a;
		var intermediateResult = _n3.b;
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n4, result) {
					var k = _n4.a;
					var v = _n4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _n6) {
				var deads = _n6.a;
				var lives = _n6.b;
				var news = _n6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						elm$core$List$cons,
						A3(elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_n4, pid, _n5) {
				var deads = _n5.a;
				var lives = _n5.b;
				var news = _n5.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _n2, _n3) {
				var deads = _n3.a;
				var lives = _n3.b;
				var news = _n3.c;
				return _Utils_Tuple3(
					deads,
					A3(elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2(elm$core$List$map, elm$browser$Browser$Events$addKey, subs);
		var _n0 = A6(
			elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, elm$core$Dict$empty, _List_Nil));
		var deadPids = _n0.a;
		var livePids = _n0.b;
		var makeNewPids = _n0.c;
		return A2(
			elm$core$Task$andThen,
			function (pids) {
				return elm$core$Task$succeed(
					A2(
						elm$browser$Browser$Events$State,
						newSubs,
						A2(
							elm$core$Dict$union,
							livePids,
							elm$core$Dict$fromList(pids))));
			},
			A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$sequence(makeNewPids);
				},
				elm$core$Task$sequence(
					A2(elm$core$List$map, elm$core$Process$kill, deadPids))));
	});
var elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _n0, state) {
		var key = _n0.key;
		var event = _n0.event;
		var toMessage = function (_n2) {
			var subKey = _n2.a;
			var _n3 = _n2.b;
			var node = _n3.a;
			var name = _n3.b;
			var decoder = _n3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : elm$core$Maybe$Nothing;
		};
		var messages = A2(elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Platform$sendToApp(router),
					messages)));
	});
var elm$browser$Browser$Events$subMap = F2(
	function (func, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var decoder = _n0.c;
		return A3(
			elm$browser$Browser$Events$MySub,
			node,
			name,
			A2(elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager(elm$browser$Browser$Events$init, elm$browser$Browser$Events$onEffects, elm$browser$Browser$Events$onSelfMsg, 0, elm$browser$Browser$Events$subMap);
var elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return elm$browser$Browser$Events$subscription(
			A3(elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var elm$browser$Browser$Events$onClick = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'click');
var author$project$Main$dropdownSubscriptions = F2(
	function (status, msg) {
		switch (status.$) {
			case 'Open':
				return elm$browser$Browser$Events$onAnimationFrame(
					elm$core$Basics$always(
						msg(author$project$Main$Listen)));
			case 'Listen':
				return elm$browser$Browser$Events$onClick(
					elm$json$Json$Decode$succeed(
						msg(author$project$Main$Closed)));
			default:
				return elm$core$Platform$Sub$none;
		}
	});
var author$project$Main$NotificationsModalAnimate = function (a) {
	return {$: 'NotificationsModalAnimate', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Modal$FadeClose = {$: 'FadeClose'};
var rundis$elm_bootstrap$Bootstrap$Modal$subscriptions = F2(
	function (visibility, animateMsg) {
		if (visibility.$ === 'StartClose') {
			return elm$browser$Browser$Events$onAnimationFrame(
				function (_n1) {
					return animateMsg(rundis$elm_bootstrap$Bootstrap$Modal$FadeClose);
				});
		} else {
			return elm$core$Platform$Sub$none;
		}
	});
var author$project$Main$notificationsModalSubscriptions = F2(
	function (state, msg) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$Modal$subscriptions,
			state.modal,
			A2(elm$core$Basics$composeL, msg, author$project$Main$NotificationsModalAnimate));
	});
var author$project$Main$uiSubscriptions = F2(
	function (state, msg) {
		return elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					A2(
					author$project$Main$dropdownSubscriptions,
					state.userDropdownStatus,
					A2(elm$core$Basics$composeL, msg, author$project$Main$UserDropdownStatus)),
					A2(
					author$project$Main$dropdownSubscriptions,
					state.notifsDropdownStatus,
					A2(elm$core$Basics$composeL, msg, author$project$Main$EventsDropdownStatus)),
					A2(
					author$project$Main$notificationsModalSubscriptions,
					state.notificationsModal,
					A2(elm$core$Basics$composeL, msg, author$project$Main$NotificationsModalMsg))
				]));
	});
var author$project$Main$subscriptions = function (_n0) {
	var ui = _n0.ui;
	var router = _n0.router;
	var page = _n0.page;
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(author$project$Main$pageSubscriptions, page, author$project$Main$PageMsg),
				A2(author$project$Main$uiSubscriptions, ui, author$project$Main$UiMsg),
				A2(author$project$Main$routerSubscriptions, router, author$project$Main$RouterMsg)
			]));
};
var author$project$Main$NewProjectPageFormCancel = {$: 'NewProjectPageFormCancel'};
var author$project$Main$ProfilePageFormCancel = {$: 'ProfilePageFormCancel'};
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var author$project$Main$container = elm$html$Html$Attributes$class('container');
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'blur',
		elm$json$Json$Decode$succeed(msg));
};
var elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'focus',
		elm$json$Json$Decode$succeed(msg));
};
var etaque$elm_form$Form$Blur = function (a) {
	return {$: 'Blur', a: a};
};
var etaque$elm_form$Form$Checkbox = {$: 'Checkbox'};
var etaque$elm_form$Form$Focus = function (a) {
	return {$: 'Focus', a: a};
};
var etaque$elm_form$Form$Input = F3(
	function (a, b, c) {
		return {$: 'Input', a: a, b: b, c: c};
	});
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Off = {$: 'Off'};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$On = {$: 'On'};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Value = function (a) {
	return {$: 'Value', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$checked = function (isCheck) {
	return rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Value(
		isCheck ? rundis$elm_bootstrap$Bootstrap$Form$Checkbox$On : rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Off);
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Custom = {$: 'Custom'};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Checkbox = function (a) {
	return {$: 'Checkbox', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$create = F2(
	function (options, label) {
		return rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Checkbox(
			{label: label, options: options});
	});
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$label = _VirtualDom_node('label');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var elm$html$Html$Attributes$classList = function (classes) {
	return elm$html$Html$Attributes$class(
		A2(
			elm$core$String$join,
			' ',
			A2(
				elm$core$List$map,
				elm$core$Tuple$first,
				A2(elm$core$List$filter, elm$core$Tuple$second, classes))));
};
var elm$html$Html$Attributes$for = elm$html$Html$Attributes$stringProperty('htmlFor');
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Id':
				var val = modifier.a;
				return _Utils_update(
					options,
					{
						id: elm$core$Maybe$Just(val)
					});
			case 'Value':
				var val = modifier.a;
				return _Utils_update(
					options,
					{state: val});
			case 'Inline':
				return _Utils_update(
					options,
					{inline: true});
			case 'OnChecked':
				var toMsg = modifier.a;
				return _Utils_update(
					options,
					{
						onChecked: elm$core$Maybe$Just(toMsg)
					});
			case 'Custom':
				return _Utils_update(
					options,
					{custom: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Validation':
				var validation = modifier.a;
				return _Utils_update(
					options,
					{
						validation: elm$core$Maybe$Just(validation)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$defaultOptions = {attributes: _List_Nil, custom: false, disabled: false, id: elm$core$Maybe$Nothing, inline: false, onChecked: elm$core$Maybe$Nothing, state: rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Off, validation: elm$core$Maybe$Nothing};
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$html$Html$Events$targetChecked = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	elm$json$Json$Decode$bool);
var elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		elm$html$Html$Events$on,
		'change',
		A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetChecked));
};
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$html$Html$Attributes$checked = elm$html$Html$Attributes$boolProperty('checked');
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$stateAttribute = function (state) {
	switch (state.$) {
		case 'On':
			return elm$html$Html$Attributes$checked(true);
		case 'Off':
			return elm$html$Html$Attributes$checked(false);
		default:
			return A2(elm$html$Html$Attributes$attribute, 'indeterminate', 'true');
	}
};
var rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString = function (validation) {
	if (validation.$ === 'Success') {
		return 'is-valid';
	} else {
		return 'is-invalid';
	}
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$toAttributes = function (options) {
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-check-input', !options.custom),
						_Utils_Tuple2('custom-control-input', options.custom)
					])),
				elm$html$Html$Attributes$type_('checkbox'),
				elm$html$Html$Attributes$disabled(options.disabled),
				rundis$elm_bootstrap$Bootstrap$Form$Checkbox$stateAttribute(options.state)
			]),
		_Utils_ap(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(elm$core$Maybe$map, elm$html$Html$Events$onCheck, options.onChecked),
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$id, options.id)
					])),
			_Utils_ap(
				function () {
					var _n0 = options.validation;
					if (_n0.$ === 'Just') {
						var v = _n0.a;
						return _List_fromArray(
							[
								elm$html$Html$Attributes$class(
								rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(v))
							]);
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes)));
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$view = function (_n0) {
	var chk = _n0.a;
	var opts = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Form$Checkbox$applyModifier, rundis$elm_bootstrap$Bootstrap$Form$Checkbox$defaultOptions, chk.options);
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-check', !opts.custom),
						_Utils_Tuple2('form-check-inline', (!opts.custom) && opts.inline),
						_Utils_Tuple2('custom-control', opts.custom),
						_Utils_Tuple2('custom-checkbox', opts.custom),
						_Utils_Tuple2('custom-control-inline', opts.inline && opts.custom)
					]))
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$input,
				rundis$elm_bootstrap$Bootstrap$Form$Checkbox$toAttributes(opts),
				_List_Nil),
				A2(
				elm$html$Html$label,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('form-check-label', !opts.custom),
									_Utils_Tuple2('custom-control-label', opts.custom)
								]))
						]),
					function () {
						var _n1 = opts.id;
						if (_n1.$ === 'Just') {
							var v = _n1.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$for(v)
								]);
						} else {
							return _List_Nil;
						}
					}()),
				_List_fromArray(
					[
						elm$html$Html$text(chk.label)
					]))
			]));
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$custom = function (options) {
	return A2(
		elm$core$Basics$composeL,
		rundis$elm_bootstrap$Bootstrap$Form$Checkbox$view,
		rundis$elm_bootstrap$Bootstrap$Form$Checkbox$create(
			A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Custom, options)));
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Id = function (a) {
	return {$: 'Id', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$id = function (theId) {
	return rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Id(theId);
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$OnChecked = function (a) {
	return {$: 'OnChecked', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$onCheck = function (toMsg) {
	return rundis$elm_bootstrap$Bootstrap$Form$Checkbox$OnChecked(toMsg);
};
var author$project$Main$bootstrapCheckbox = F5(
	function (id, label, state, options, attrs) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$Form$Checkbox$custom,
			_Utils_ap(
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Checkbox$id(id),
						rundis$elm_bootstrap$Bootstrap$Form$Checkbox$onCheck(
						A2(
							elm$core$Basics$composeR,
							etaque$elm_form$Form$Field$Bool,
							A2(etaque$elm_form$Form$Input, state.path, etaque$elm_form$Form$Checkbox))),
						rundis$elm_bootstrap$Bootstrap$Form$Checkbox$checked(
						A2(elm$core$Maybe$withDefault, false, state.value)),
						rundis$elm_bootstrap$Bootstrap$Form$Checkbox$attrs(
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Events$onFocus(
									etaque$elm_form$Form$Focus(state.path)),
									elm$html$Html$Events$onBlur(
									etaque$elm_form$Form$Blur(state.path))
								]),
							attrs))
					]),
				options),
			label);
	});
var etaque$elm_form$Form$Text = {$: 'Text'};
var rundis$elm_bootstrap$Bootstrap$Form$Input$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Input$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$onInput = function (toMsg) {
	return rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput(toMsg);
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$Value = function (a) {
	return {$: 'Value', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$value = function (value_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Input$Value(value_);
};
var author$project$Main$bootstrapInputOptions = F3(
	function (state, options, attrs) {
		return _Utils_ap(
			_List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$value(
					A2(elm$core$Maybe$withDefault, '', state.value)),
					rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
					A2(
						elm$core$Basics$composeR,
						etaque$elm_form$Form$Field$String,
						A2(etaque$elm_form$Form$Input, state.path, etaque$elm_form$Form$Text))),
					rundis$elm_bootstrap$Bootstrap$Form$Input$attrs(
					_Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Events$onFocus(
								etaque$elm_form$Form$Focus(state.path)),
								elm$html$Html$Events$onBlur(
								etaque$elm_form$Form$Blur(state.path))
							]),
						attrs))
				]),
			options);
	});
var rundis$elm_bootstrap$Bootstrap$Form$Input$Password = {$: 'Password'};
var rundis$elm_bootstrap$Bootstrap$Form$Input$Input = function (a) {
	return {$: 'Input', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$Type = function (a) {
	return {$: 'Type', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$create = F2(
	function (tipe, options) {
		return rundis$elm_bootstrap$Bootstrap$Form$Input$Input(
			{
				options: A2(
					elm$core$List$cons,
					rundis$elm_bootstrap$Bootstrap$Form$Input$Type(tipe),
					options)
			});
	});
var elm$html$Html$Attributes$placeholder = elm$html$Html$Attributes$stringProperty('placeholder');
var elm$html$Html$Attributes$readonly = elm$html$Html$Attributes$boolProperty('readOnly');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: elm$core$Maybe$Just(id_)
					});
			case 'Type':
				var tipe = modifier.a;
				return _Utils_update(
					options,
					{tipe: tipe});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: elm$core$Maybe$Just(value_)
					});
			case 'Placeholder':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						placeholder: elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: elm$core$Maybe$Just(validation_)
					});
			case 'Readonly':
				var val = modifier.a;
				return _Utils_update(
					options,
					{readonly: val});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Form$Input$Text = {$: 'Text'};
var rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions = {attributes: _List_Nil, disabled: false, id: elm$core$Maybe$Nothing, onInput: elm$core$Maybe$Nothing, placeholder: elm$core$Maybe$Nothing, readonly: false, size: elm$core$Maybe$Nothing, tipe: rundis$elm_bootstrap$Bootstrap$Form$Input$Text, validation: elm$core$Maybe$Nothing, value: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size.$) {
		case 'XS':
			return elm$core$Maybe$Nothing;
		case 'SM':
			return elm$core$Maybe$Just('sm');
		case 'MD':
			return elm$core$Maybe$Just('md');
		case 'LG':
			return elm$core$Maybe$Just('lg');
		default:
			return elm$core$Maybe$Just('xl');
	}
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute = function (size) {
	return A2(
		elm$core$Maybe$map,
		function (s) {
			return elm$html$Html$Attributes$class('form-control-' + s);
		},
		rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size));
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute = function (inputType) {
	return elm$html$Html$Attributes$type_(
		function () {
			switch (inputType.$) {
				case 'Text':
					return 'text';
				case 'Password':
					return 'password';
				case 'DatetimeLocal':
					return 'datetime-local';
				case 'Date':
					return 'date';
				case 'Month':
					return 'month';
				case 'Time':
					return 'time';
				case 'Week':
					return 'week';
				case 'Number':
					return 'number';
				case 'Email':
					return 'email';
				case 'Url':
					return 'url';
				case 'Search':
					return 'search';
				case 'Tel':
					return 'tel';
				default:
					return 'color';
			}
		}());
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute = function (validation) {
	return elm$html$Html$Attributes$class(
		rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier, rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('form-control'),
				elm$html$Html$Attributes$disabled(options.disabled),
				elm$html$Html$Attributes$readonly(options.readonly),
				rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute(options.tipe)
			]),
		_Utils_ap(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$id, options.id),
						A2(elm$core$Maybe$andThen, rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute, options.size),
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$value, options.value),
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$placeholder, options.placeholder),
						A2(elm$core$Maybe$map, elm$html$Html$Events$onInput, options.onInput),
						A2(elm$core$Maybe$map, rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute, options.validation)
					])),
			options.attributes));
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$view = function (_n0) {
	var options = _n0.a.options;
	return A2(
		elm$html$Html$input,
		rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes(options),
		_List_Nil);
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$input = F2(
	function (tipe, options) {
		return rundis$elm_bootstrap$Bootstrap$Form$Input$view(
			A2(rundis$elm_bootstrap$Bootstrap$Form$Input$create, tipe, options));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Input$password = rundis$elm_bootstrap$Bootstrap$Form$Input$input(rundis$elm_bootstrap$Bootstrap$Form$Input$Password);
var author$project$Main$bootstrapInputPassword = F3(
	function (state, options, attrs) {
		return rundis$elm_bootstrap$Bootstrap$Form$Input$password(
			A3(author$project$Main$bootstrapInputOptions, state, options, attrs));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Input$text = rundis$elm_bootstrap$Bootstrap$Form$Input$input(rundis$elm_bootstrap$Bootstrap$Form$Input$Text);
var author$project$Main$bootstrapInputText = F3(
	function (state, options, attrs) {
		return rundis$elm_bootstrap$Bootstrap$Form$Input$text(
			A3(author$project$Main$bootstrapInputOptions, state, options, attrs));
	});
var rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback = F2(
	function (attributes, children) {
		return A2(
			elm$html$Html$div,
			A2(
				elm$core$List$cons,
				elm$html$Html$Attributes$class('invalid-feedback'),
				attributes),
			children);
	});
var author$project$Main$bootstrapInvalidFeedback = F3(
	function (toString, state, attrs) {
		var _n0 = state.liveError;
		if (_n0.$ === 'Nothing') {
			return elm$html$Html$text('');
		} else {
			var error = _n0.a;
			return A2(
				rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
				attrs,
				_List_fromArray(
					[
						elm$html$Html$text(
						toString(error))
					]));
		}
	});
var elm$core$Debug$toString = _Debug_toString;
var author$project$Main$errorToString = function (error) {
	switch (error.$) {
		case 'Empty':
			return 'This field is required';
		case 'InvalidString':
			return 'This field is required';
		case 'InvalidEmail':
			return 'Please enter a valid email address';
		case 'InvalidFormat':
			return 'Invalid format';
		case 'InvalidInt':
			return 'The value must be an integer';
		case 'InvalidFloat':
			return 'The value must be a number';
		case 'InvalidBool':
			return 'Error';
		case 'SmallerIntThan':
			var _int = error.a;
			return 'Error';
		case 'GreaterIntThan':
			var _int = error.a;
			return 'Error';
		case 'SmallerFloatThan':
			var _float = error.a;
			return 'Error';
		case 'GreaterFloatThan':
			var _float = error.a;
			return 'Error';
		case 'ShorterStringThan':
			var _int = error.a;
			return 'Must be at least ' + (elm$core$String$fromInt(_int) + ' characters');
		case 'LongerStringThan':
			var _int = error.a;
			return 'Must be no more than ' + (elm$core$String$fromInt(_int) + ' characters');
		case 'NotIncludedIn':
			return 'Error';
		default:
			var e = error.a;
			return elm$core$Debug$toString(e);
	}
};
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var etaque$elm_form$Form$Submit = {$: 'Submit'};
var etaque$elm_form$Form$getBoolAt = F2(
	function (name, _n0) {
		var model = _n0.a;
		return A2(
			elm$core$Maybe$andThen,
			etaque$elm_form$Form$Field$asBool,
			A2(etaque$elm_form$Form$getFieldAt, name, model));
	});
var etaque$elm_form$Form$getErrorAt = F2(
	function (path, _n0) {
		var model = _n0.a;
		return A2(
			elm$core$Maybe$andThen,
			etaque$elm_form$Form$Tree$asValue,
			A2(etaque$elm_form$Form$Tree$getAtPath, path, model.errors));
	});
var etaque$elm_form$Form$getFocus = function (_n0) {
	var model = _n0.a;
	return model.focus;
};
var etaque$elm_form$Form$isChangedAt = F2(
	function (qualifiedName, _n0) {
		var model = _n0.a;
		return A2(elm$core$Set$member, qualifiedName, model.changedFields);
	});
var etaque$elm_form$Form$isDirtyAt = F2(
	function (qualifiedName, _n0) {
		var model = _n0.a;
		return A2(elm$core$Set$member, qualifiedName, model.dirtyFields);
	});
var etaque$elm_form$Form$isSubmitted = function (_n0) {
	var model = _n0.a;
	return model.isSubmitted;
};
var etaque$elm_form$Form$getLiveErrorAt = F2(
	function (name, form) {
		return (etaque$elm_form$Form$isSubmitted(form) || (A2(etaque$elm_form$Form$isChangedAt, name, form) && (!A2(etaque$elm_form$Form$isDirtyAt, name, form)))) ? A2(etaque$elm_form$Form$getErrorAt, name, form) : elm$core$Maybe$Nothing;
	});
var etaque$elm_form$Form$getField = F3(
	function (getValue, path, form) {
		return {
			error: A2(etaque$elm_form$Form$getErrorAt, path, form),
			hasFocus: _Utils_eq(
				etaque$elm_form$Form$getFocus(form),
				elm$core$Maybe$Just(path)),
			isChanged: A2(etaque$elm_form$Form$isChangedAt, path, form),
			isDirty: A2(etaque$elm_form$Form$isDirtyAt, path, form),
			liveError: A2(etaque$elm_form$Form$getLiveErrorAt, path, form),
			path: path,
			value: A2(getValue, path, form)
		};
	});
var etaque$elm_form$Form$getFieldAsBool = etaque$elm_form$Form$getField(etaque$elm_form$Form$getBoolAt);
var etaque$elm_form$Form$getStringAt = F2(
	function (name, _n0) {
		var model = _n0.a;
		return A2(
			elm$core$Maybe$andThen,
			etaque$elm_form$Form$Field$asString,
			A2(etaque$elm_form$Form$getFieldAt, name, model));
	});
var etaque$elm_form$Form$getFieldAsString = etaque$elm_form$Form$getField(etaque$elm_form$Form$getStringAt);
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Block = {$: 'Block'};
var rundis$elm_bootstrap$Bootstrap$Button$block = rundis$elm_bootstrap$Bootstrap$Internal$Button$Block;
var elm$html$Html$button = _VirtualDom_node('button');
var rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						size: elm$core$Maybe$Just(size)
					});
			case 'Coloring':
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						coloring: elm$core$Maybe$Just(coloring)
					});
			case 'Block':
				return _Utils_update(
					options,
					{block: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {attributes: _List_Nil, block: false, coloring: elm$core$Maybe$Nothing, disabled: false, size: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role.$) {
		case 'Primary':
			return 'primary';
		case 'Secondary':
			return 'secondary';
		case 'Success':
			return 'success';
		case 'Info':
			return 'info';
		case 'Warning':
			return 'warning';
		case 'Danger':
			return 'danger';
		case 'Dark':
			return 'dark';
		case 'Light':
			return 'light';
		default:
			return 'link';
	}
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.block),
						_Utils_Tuple2('disabled', options.disabled)
					])),
				elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			function () {
				var _n0 = A2(elm$core$Maybe$andThen, rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.size);
				if (_n0.$ === 'Just') {
					var s = _n0.a;
					return _List_fromArray(
						[
							elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _n1 = options.coloring;
					if (_n1.$ === 'Just') {
						if (_n1.a.$ === 'Roled') {
							var role = _n1.a.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class(
									'btn-' + rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _n1.a.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class(
									'btn-outline-' + rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes)));
};
var rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			elm$html$Html$button,
			rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$disabled = function (disabled_) {
	return rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled(disabled_);
};
var elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$Button$onClick = function (message) {
	return rundis$elm_bootstrap$Bootstrap$Button$attrs(
		_List_fromArray(
			[
				A2(
				elm$html$Html$Events$preventDefaultOn,
				'click',
				elm$json$Json$Decode$succeed(
					_Utils_Tuple2(message, true)))
			]));
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 'Coloring', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = {$: 'Primary'};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled = function (a) {
	return {$: 'Roled', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$primary = rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled(rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary));
var elm$html$Html$form = _VirtualDom_node('form');
var rundis$elm_bootstrap$Bootstrap$Form$form = F2(
	function (attributes, children) {
		return A2(elm$html$Html$form, attributes, children);
	});
var rundis$elm_bootstrap$Bootstrap$Form$applyModifier = F2(
	function (modifier, options) {
		var value = modifier.a;
		return _Utils_update(
			options,
			{
				attributes: _Utils_ap(options.attributes, value)
			});
	});
var rundis$elm_bootstrap$Bootstrap$Form$defaultOptions = {attributes: _List_Nil};
var rundis$elm_bootstrap$Bootstrap$Form$toAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Form$applyModifier, rundis$elm_bootstrap$Bootstrap$Form$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('form-group')
			]),
		options.attributes);
};
var rundis$elm_bootstrap$Bootstrap$Form$group = F2(
	function (options, children) {
		return A2(
			elm$html$Html$div,
			rundis$elm_bootstrap$Bootstrap$Form$toAttributes(options),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Form$label = F2(
	function (attributes, children) {
		return A2(
			elm$html$Html$label,
			A2(
				elm$core$List$cons,
				elm$html$Html$Attributes$class('form-control-label'),
				attributes),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config = function (a) {
	return {$: 'Config', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapConfig = F2(
	function (mapper, _n0) {
		var configRec = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
			mapper(configRec));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children = function (children_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapConfig(
		function (conf) {
			return _Utils_update(
				conf,
				{children: children_});
		});
};
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config = rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
	{
		children: _List_Nil,
		legend: elm$core$Maybe$Nothing,
		options: {attributes: _List_Nil, disabled: false, isGroup: false}
	});
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapOptions = F2(
	function (mapper, _n0) {
		var conf = _n0.a;
		var options = conf.options;
		return rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
			_Utils_update(
				conf,
				{
					options: mapper(options)
				}));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled = function (isDisabled) {
	return rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapOptions(
		function (opts) {
			return _Utils_update(
				opts,
				{disabled: isDisabled});
		});
};
var elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view = function (_n0) {
	var rec = _n0.a;
	var options = rec.options;
	return A2(
		elm$html$Html$fieldset,
		_Utils_ap(
			_List_fromArray(
				[
					elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('form-group', options.isGroup)
						])),
					elm$html$Html$Attributes$disabled(options.disabled)
				]),
			options.attributes),
		function (xs) {
			return A2(elm$core$List$append, xs, rec.children);
		}(
			A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					elm$core$Maybe$map,
					function (e) {
						return _List_fromArray(
							[e]);
					},
					rec.legend))));
};
var rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger = {$: 'Danger'};
var rundis$elm_bootstrap$Bootstrap$Form$Input$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$danger = rundis$elm_bootstrap$Bootstrap$Form$Input$Validation(rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var author$project$Main$loginFormView = F3(
	function (form, sent, msg) {
		var rememberMe = A2(etaque$elm_form$Form$getFieldAsBool, 'rememberMe', form);
		var password = A2(etaque$elm_form$Form$getFieldAsString, 'password', form);
		var passwordOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, password.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var login = A2(etaque$elm_form$Form$getFieldAsString, 'login', form);
		var loginOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, login.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		return A2(
			elm$html$Html$map,
			msg,
			A2(
				rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
						A2(
							rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Login')
												])),
											A3(author$project$Main$bootstrapInputText, login, loginOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, login, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Password')
												])),
											A3(author$project$Main$bootstrapInputPassword, password, passwordOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, password, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A5(author$project$Main$bootstrapCheckbox, 'login-remember-me', 'Remember me', rememberMe, _List_Nil, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, rememberMe, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$block,
											rundis$elm_bootstrap$Bootstrap$Button$primary,
											rundis$elm_bootstrap$Bootstrap$Button$onClick(etaque$elm_form$Form$Submit),
											rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
										]),
									_List_fromArray(
										[
											elm$html$Html$text(
											sent ? 'Please wait' : 'Log in')
										]))
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled, sent, rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))
					])));
	});
var author$project$Main$errorMessage = function (error) {
	_n0$3:
	while (true) {
		if (error.$ === 'BadStatus') {
			switch (error.a) {
				case 401:
					return 'Authentication failed.';
				case 500:
					return 'Application error (500 Internal Server Error)';
				case 501:
					return 'This feature is not implemented';
				default:
					break _n0$3;
			}
		} else {
			break _n0$3;
		}
	}
	return 'Something went wrong!';
};
var rundis$elm_bootstrap$Bootstrap$Alert$Shown = {$: 'Shown'};
var rundis$elm_bootstrap$Bootstrap$Alert$Config = function (a) {
	return {$: 'Config', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Alert$attrs = F2(
	function (attributes, _n0) {
		var configRec = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Alert$Config(
			_Utils_update(
				configRec,
				{attributes: attributes}));
	});
var rundis$elm_bootstrap$Bootstrap$Alert$children = F2(
	function (children_, _n0) {
		var configRec = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Alert$Config(
			_Utils_update(
				configRec,
				{children: children_}));
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Role$Secondary = {$: 'Secondary'};
var rundis$elm_bootstrap$Bootstrap$Alert$config = rundis$elm_bootstrap$Bootstrap$Alert$Config(
	{attributes: _List_Nil, children: _List_Nil, dismissable: elm$core$Maybe$Nothing, role: rundis$elm_bootstrap$Bootstrap$Internal$Role$Secondary, visibility: rundis$elm_bootstrap$Bootstrap$Alert$Shown, withAnimation: false});
var rundis$elm_bootstrap$Bootstrap$Alert$role = F2(
	function (role_, _n0) {
		var configRec = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Alert$Config(
			_Utils_update(
				configRec,
				{role: role_}));
	});
var elm$html$Html$span = _VirtualDom_node('span');
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var rundis$elm_bootstrap$Bootstrap$Alert$Closed = {$: 'Closed'};
var rundis$elm_bootstrap$Bootstrap$Alert$StartClose = {$: 'StartClose'};
var rundis$elm_bootstrap$Bootstrap$Alert$clickHandler = F2(
	function (visibility, configRec) {
		var handleClick = F2(
			function (viz, toMsg) {
				return elm$html$Html$Events$onClick(
					toMsg(viz));
			});
		var _n0 = configRec.dismissable;
		if (_n0.$ === 'Just') {
			var dismissMsg = _n0.a;
			return _List_fromArray(
				[
					configRec.withAnimation ? A2(handleClick, rundis$elm_bootstrap$Bootstrap$Alert$StartClose, dismissMsg) : A2(handleClick, rundis$elm_bootstrap$Bootstrap$Alert$Closed, dismissMsg)
				]);
		} else {
			return _List_Nil;
		}
	});
var rundis$elm_bootstrap$Bootstrap$Alert$injectButton = F2(
	function (btn, children_) {
		if (children_.b) {
			var head = children_.a;
			var tail = children_.b;
			return A2(
				elm$core$List$cons,
				head,
				A2(elm$core$List$cons, btn, tail));
		} else {
			return _List_fromArray(
				[btn]);
		}
	});
var rundis$elm_bootstrap$Bootstrap$Alert$isDismissable = function (configRec) {
	var _n0 = configRec.dismissable;
	if (_n0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var rundis$elm_bootstrap$Bootstrap$Alert$maybeAddDismissButton = F3(
	function (visibilty, configRec, children_) {
		return rundis$elm_bootstrap$Bootstrap$Alert$isDismissable(configRec) ? A2(
			rundis$elm_bootstrap$Bootstrap$Alert$injectButton,
			A2(
				elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('button'),
							elm$html$Html$Attributes$class('close'),
							A2(elm$html$Html$Attributes$attribute, 'aria-label', 'close')
						]),
					A2(rundis$elm_bootstrap$Bootstrap$Alert$clickHandler, visibilty, configRec)),
				_List_fromArray(
					[
						A2(
						elm$html$Html$span,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('×')
							]))
					])),
			children_) : children_;
	});
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass = F2(
	function (prefix, role) {
		return elm$html$Html$Attributes$class(
			prefix + ('-' + function () {
				switch (role.$) {
					case 'Primary':
						return 'primary';
					case 'Secondary':
						return 'secondary';
					case 'Success':
						return 'success';
					case 'Info':
						return 'info';
					case 'Warning':
						return 'warning';
					case 'Danger':
						return 'danger';
					case 'Light':
						return 'light';
					default:
						return 'dark';
				}
			}()));
	});
var rundis$elm_bootstrap$Bootstrap$Alert$viewAttributes = F2(
	function (visibility, configRec) {
		var visibiltyAttributes = _Utils_eq(visibility, rundis$elm_bootstrap$Bootstrap$Alert$Closed) ? _List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'display', 'none')
			]) : _List_Nil;
		var animationAttributes = function () {
			if (configRec.withAnimation) {
				var _n0 = configRec.dismissable;
				if (_n0.$ === 'Just') {
					var dismissMsg = _n0.a;
					return _List_fromArray(
						[
							A2(
							elm$html$Html$Events$on,
							'transitionend',
							elm$json$Json$Decode$succeed(
								dismissMsg(rundis$elm_bootstrap$Bootstrap$Alert$Closed)))
						]);
				} else {
					return _List_Nil;
				}
			} else {
				return _List_Nil;
			}
		}();
		var alertAttributes = _List_fromArray(
			[
				A2(elm$html$Html$Attributes$attribute, 'role', 'alert'),
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('alert', true),
						_Utils_Tuple2(
						'alert-dismissible',
						rundis$elm_bootstrap$Bootstrap$Alert$isDismissable(configRec)),
						_Utils_Tuple2('fade', configRec.withAnimation),
						_Utils_Tuple2(
						'show',
						_Utils_eq(visibility, rundis$elm_bootstrap$Bootstrap$Alert$Shown))
					])),
				A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'alert', configRec.role)
			]);
		return elm$core$List$concat(
			_List_fromArray(
				[configRec.attributes, alertAttributes, visibiltyAttributes, animationAttributes]));
	});
var rundis$elm_bootstrap$Bootstrap$Alert$view = F2(
	function (visibility, _n0) {
		var configRec = _n0.a;
		return A2(
			elm$html$Html$div,
			A2(rundis$elm_bootstrap$Bootstrap$Alert$viewAttributes, visibility, configRec),
			A3(rundis$elm_bootstrap$Bootstrap$Alert$maybeAddDismissButton, visibility, configRec, configRec.children));
	});
var rundis$elm_bootstrap$Bootstrap$Alert$simple = F3(
	function (role_, attributes, children_) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$view,
			rundis$elm_bootstrap$Bootstrap$Alert$Shown,
			A2(
				rundis$elm_bootstrap$Bootstrap$Alert$children,
				children_,
				A2(
					rundis$elm_bootstrap$Bootstrap$Alert$attrs,
					attributes,
					A2(rundis$elm_bootstrap$Bootstrap$Alert$role, role_, rundis$elm_bootstrap$Bootstrap$Alert$config))));
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Role$Danger = {$: 'Danger'};
var rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger = rundis$elm_bootstrap$Bootstrap$Alert$simple(rundis$elm_bootstrap$Bootstrap$Internal$Role$Danger);
var author$project$Main$loginPageError = function (sessionResource) {
	if (sessionResource.$ === 'Error') {
		var error = sessionResource.a;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Main$errorMessage(error))
				]));
	} else {
		return elm$html$Html$text('');
	}
};
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$h2 = _VirtualDom_node('h2');
var elm$html$Html$hr = _VirtualDom_node('hr');
var elm$html$Html$p = _VirtualDom_node('p');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var rundis$elm_bootstrap$Bootstrap$Internal$Role$Primary = {$: 'Primary'};
var rundis$elm_bootstrap$Bootstrap$Alert$simplePrimary = rundis$elm_bootstrap$Bootstrap$Alert$simple(rundis$elm_bootstrap$Bootstrap$Internal$Role$Primary);
var author$project$Main$loginPageView = F2(
	function (_n0, msg) {
		var form = _n0.form;
		var session = _n0.session;
		var sent = _n0.sent;
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h2,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('text-gray-900 mb-4')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Log in')
								]))
						])),
					A2(
					elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							rundis$elm_bootstrap$Bootstrap$Alert$simplePrimary,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('This is a demo. Log in using \'test\' and password \'test\'.')
								]))
						])),
					A2(
					elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							author$project$Main$loginPageError(session.resource)
						])),
					A3(
					author$project$Main$loginFormView,
					form,
					sent,
					A2(elm$core$Basics$composeL, msg, author$project$Main$LoginFormMsg)),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$a,
							_List_fromArray(
								[
									elm$html$Html$Attributes$href('/reset-password')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Forgot password?')
								])),
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('mx-2')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('|')
								])),
							A2(
							elm$html$Html$a,
							_List_fromArray(
								[
									elm$html$Html$Attributes$href('/register')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Create an account')
								]))
						]))
				]));
	});
var elm$html$Html$Attributes$selected = elm$html$Html$Attributes$boolProperty('selected');
var etaque$elm_form$Form$Select = {$: 'Select'};
var rundis$elm_bootstrap$Bootstrap$Form$Select$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Select$Attrs(attrs_);
};
var elm$html$Html$option = _VirtualDom_node('option');
var rundis$elm_bootstrap$Bootstrap$Form$Select$Item = function (a) {
	return {$: 'Item', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$item = F2(
	function (attributes, children) {
		return rundis$elm_bootstrap$Bootstrap$Form$Select$Item(
			A2(elm$html$Html$option, attributes, children));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Select$OnChange = function (a) {
	return {$: 'OnChange', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$onChange = function (toMsg) {
	return rundis$elm_bootstrap$Bootstrap$Form$Select$OnChange(toMsg);
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$Select = function (a) {
	return {$: 'Select', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$create = F2(
	function (options, items) {
		return rundis$elm_bootstrap$Bootstrap$Form$Select$Select(
			{items: items, options: options});
	});
var elm$html$Html$select = _VirtualDom_node('select');
var rundis$elm_bootstrap$Bootstrap$Form$Select$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: elm$core$Maybe$Just(id_)
					});
			case 'Custom':
				return _Utils_update(
					options,
					{custom: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'OnChange':
				var onChange_ = modifier.a;
				return _Utils_update(
					options,
					{
						onChange: elm$core$Maybe$Just(onChange_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: elm$core$Maybe$Just(validation_)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Form$Select$customEventOnChange = function (tagger) {
	return A2(
		elm$html$Html$Events$on,
		'change',
		A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue));
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$defaultOptions = {attributes: _List_Nil, custom: false, disabled: false, id: elm$core$Maybe$Nothing, onChange: elm$core$Maybe$Nothing, size: elm$core$Maybe$Nothing, validation: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Form$Select$sizeAttribute = F2(
	function (isCustom, size_) {
		var prefix = isCustom ? 'custom-select-' : 'form-control-';
		return A2(
			elm$core$Maybe$map,
			function (s) {
				return elm$html$Html$Attributes$class(
					_Utils_ap(prefix, s));
			},
			rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size_));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Select$validationAttribute = function (validation_) {
	return elm$html$Html$Attributes$class(
		rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation_));
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$toAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Form$Select$applyModifier, rundis$elm_bootstrap$Bootstrap$Form$Select$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-control', !options.custom),
						_Utils_Tuple2('custom-select', options.custom)
					])),
				elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$id, options.id),
						A2(
						elm$core$Maybe$andThen,
						rundis$elm_bootstrap$Bootstrap$Form$Select$sizeAttribute(options.custom),
						options.size),
						A2(elm$core$Maybe$map, rundis$elm_bootstrap$Bootstrap$Form$Select$customEventOnChange, options.onChange),
						A2(elm$core$Maybe$map, rundis$elm_bootstrap$Bootstrap$Form$Select$validationAttribute, options.validation)
					])),
			options.attributes));
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$view = function (_n0) {
	var options = _n0.a.options;
	var items = _n0.a.items;
	return A2(
		elm$html$Html$select,
		rundis$elm_bootstrap$Bootstrap$Form$Select$toAttributes(options),
		A2(
			elm$core$List$map,
			function (_n1) {
				var e = _n1.a;
				return e;
			},
			items));
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$select = F2(
	function (options, items) {
		return rundis$elm_bootstrap$Bootstrap$Form$Select$view(
			A2(rundis$elm_bootstrap$Bootstrap$Form$Select$create, options, items));
	});
var author$project$Main$bootstrapSelect = F4(
	function (items, state, options, attrs) {
		var build = function (_n0) {
			var k = _n0.a;
			var v = _n0.b;
			return A2(
				rundis$elm_bootstrap$Bootstrap$Form$Select$item,
				_List_fromArray(
					[
						elm$html$Html$Attributes$value(k),
						elm$html$Html$Attributes$selected(
						_Utils_eq(
							state.value,
							elm$core$Maybe$Just(k)))
					]),
				_List_fromArray(
					[
						elm$html$Html$text(v)
					]));
		};
		return A2(
			rundis$elm_bootstrap$Bootstrap$Form$Select$select,
			_Utils_ap(
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Select$onChange(
						A2(
							elm$core$Basics$composeR,
							etaque$elm_form$Form$Field$String,
							A2(etaque$elm_form$Form$Input, state.path, etaque$elm_form$Form$Select))),
						rundis$elm_bootstrap$Bootstrap$Form$Select$attrs(
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Events$onFocus(
									etaque$elm_form$Form$Focus(state.path)),
									elm$html$Html$Events$onBlur(
									etaque$elm_form$Form$Blur(state.path))
								]),
							attrs))
					]),
				options),
			A2(elm$core$List$map, build, items));
	});
var etaque$elm_form$Form$Textarea = {$: 'Textarea'};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Textarea$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$onInput = function (toMsg) {
	return rundis$elm_bootstrap$Bootstrap$Form$Textarea$OnInput(toMsg);
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$Textarea = function (a) {
	return {$: 'Textarea', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$create = function (options) {
	return rundis$elm_bootstrap$Bootstrap$Form$Textarea$Textarea(
		{options: options});
};
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		elm$core$String$fromInt(n));
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: elm$core$Maybe$Just(id_)
					});
			case 'Rows':
				var rows_ = modifier.a;
				return _Utils_update(
					options,
					{
						rows: elm$core$Maybe$Just(rows_)
					});
			case 'Disabled':
				return _Utils_update(
					options,
					{disabled: true});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation = modifier.a;
				return _Utils_update(
					options,
					{
						validation: elm$core$Maybe$Just(validation)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$defaultOptions = {attributes: _List_Nil, disabled: false, id: elm$core$Maybe$Nothing, onInput: elm$core$Maybe$Nothing, rows: elm$core$Maybe$Nothing, validation: elm$core$Maybe$Nothing, value: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$validationAttribute = function (validation) {
	return elm$html$Html$Attributes$class(
		rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$toAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Form$Textarea$applyModifier, rundis$elm_bootstrap$Bootstrap$Form$Textarea$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('form-control'),
				elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$id, options.id),
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$rows, options.rows),
						A2(elm$core$Maybe$map, elm$html$Html$Attributes$value, options.value),
						A2(elm$core$Maybe$map, elm$html$Html$Events$onInput, options.onInput),
						A2(elm$core$Maybe$map, rundis$elm_bootstrap$Bootstrap$Form$Textarea$validationAttribute, options.validation)
					])),
			options.attributes));
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$view = function (_n0) {
	var options = _n0.a.options;
	return A2(
		elm$html$Html$textarea,
		rundis$elm_bootstrap$Bootstrap$Form$Textarea$toAttributes(options),
		_List_Nil);
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea = A2(elm$core$Basics$composeL, rundis$elm_bootstrap$Bootstrap$Form$Textarea$view, rundis$elm_bootstrap$Bootstrap$Form$Textarea$create);
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$Value = function (a) {
	return {$: 'Value', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$value = function (value_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Textarea$Value(value_);
};
var author$project$Main$bootstrapTextarea = F3(
	function (state, options, attrs) {
		return rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea(
			_Utils_ap(
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Textarea$value(
						A2(elm$core$Maybe$withDefault, '', state.value)),
						rundis$elm_bootstrap$Bootstrap$Form$Textarea$onInput(
						A2(
							elm$core$Basics$composeR,
							etaque$elm_form$Form$Field$String,
							A2(etaque$elm_form$Form$Input, state.path, etaque$elm_form$Form$Textarea))),
						rundis$elm_bootstrap$Bootstrap$Form$Textarea$attrs(
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Events$onFocus(
									etaque$elm_form$Form$Focus(state.path)),
									elm$html$Html$Events$onBlur(
									etaque$elm_form$Form$Blur(state.path))
								]),
							attrs))
					]),
				options));
	});
var rundis$elm_bootstrap$Bootstrap$Form$Select$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Select$danger = rundis$elm_bootstrap$Bootstrap$Form$Select$Validation(rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Textarea$danger = rundis$elm_bootstrap$Bootstrap$Form$Textarea$Validation(rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var author$project$Main$newProjectFormView = F3(
	function (form, sent, msg) {
		var name = A2(etaque$elm_form$Form$getFieldAsString, 'name', form);
		var nameOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, name.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var description = A2(etaque$elm_form$Form$getFieldAsString, 'description', form);
		var descriptionOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, description.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Textarea$danger, opts);
		}();
		var country = A2(etaque$elm_form$Form$getFieldAsString, 'country', form);
		var countryOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, country.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Select$danger, opts);
		}();
		return A2(
			elm$html$Html$map,
			msg,
			A2(
				rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
						A2(
							rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Name')
												])),
											A3(author$project$Main$bootstrapInputText, name, nameOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, name, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Country')
												])),
											A4(
											author$project$Main$bootstrapSelect,
											_List_fromArray(
												[
													_Utils_Tuple2('', ''),
													_Utils_Tuple2('FI', 'Finland'),
													_Utils_Tuple2('MW', 'Malawi'),
													_Utils_Tuple2('GH', 'Ghana'),
													_Utils_Tuple2('UG', 'Uganda')
												]),
											country,
											countryOptions,
											_List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, country, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Description')
												])),
											A3(author$project$Main$bootstrapTextarea, description, descriptionOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, description, _List_Nil)
										]))
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled, sent, rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))
					])));
	});
var author$project$Main$newProjectPageError = function (projectResource) {
	if (projectResource.$ === 'Error') {
		var error = projectResource.a;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Main$errorMessage(error))
				]));
	} else {
		return elm$html$Html$text('');
	}
};
var author$project$Main$profileFormView = F3(
	function (form, sent, msg) {
		var name = A2(etaque$elm_form$Form$getFieldAsString, 'name', form);
		var nameOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, name.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		return A2(
			elm$html$Html$map,
			msg,
			A2(
				rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
						A2(
							rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Name')
												])),
											A3(author$project$Main$bootstrapInputText, name, nameOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, name, _List_Nil)
										]))
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled, sent, rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))
					])));
	});
var author$project$Main$profilePageError = function (userResource) {
	if (userResource.$ === 'Error') {
		var error = userResource.a;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Main$errorMessage(error))
				]));
	} else {
		return elm$html$Html$text('');
	}
};
var author$project$Main$projectHomePageView = F2(
	function (_n0, msg) {
		var project = _n0.project;
		var _n1 = project.resource;
		switch (_n1.$) {
			case 'NotRequested':
				return elm$html$Html$text('not requested');
			case 'Requested':
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'margin', '8em')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('d-flex justify-content-center')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'border-width', '6px'),
											A2(elm$html$Html$Attributes$style, 'width', '4rem'),
											A2(elm$html$Html$Attributes$style, 'height', '4rem'),
											elm$html$Html$Attributes$class('spinner-border text-success'),
											A2(elm$html$Html$Attributes$attribute, 'role', 'status')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$span,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('sr-only')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Loading')
												]))
										]))
								]))
						]));
			case 'Error':
				var httpError = _n1.a;
				return elm$html$Html$text(
					elm$core$Debug$toString(httpError));
			default:
				var project_ = _n1.a;
				return A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('info')
						]));
		}
	});
var author$project$Main$NotificationsModalClose = {$: 'NotificationsModalClose'};
var author$project$Main$NotificationsModalDismiss = {$: 'NotificationsModalDismiss'};
var rundis$elm_bootstrap$Bootstrap$Modal$Body = function (a) {
	return {$: 'Body', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Modal$Config = function (a) {
	return {$: 'Config', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Modal$body = F3(
	function (attributes, children, _n0) {
		var conf = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					body: elm$core$Maybe$Just(
						rundis$elm_bootstrap$Bootstrap$Modal$Body(
							{attributes: attributes, children: children}))
				}));
	});
var rundis$elm_bootstrap$Bootstrap$Modal$config = function (closeMsg) {
	return rundis$elm_bootstrap$Bootstrap$Modal$Config(
		{
			body: elm$core$Maybe$Nothing,
			closeMsg: closeMsg,
			footer: elm$core$Maybe$Nothing,
			header: elm$core$Maybe$Nothing,
			options: {centered: true, hideOnBackdropClick: true, modalSize: elm$core$Maybe$Nothing},
			withAnimation: elm$core$Maybe$Nothing
		});
};
var rundis$elm_bootstrap$Bootstrap$Modal$Footer = function (a) {
	return {$: 'Footer', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Modal$footer = F3(
	function (attributes, children, _n0) {
		var conf = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					footer: elm$core$Maybe$Just(
						rundis$elm_bootstrap$Bootstrap$Modal$Footer(
							{attributes: attributes, children: children}))
				}));
	});
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		elm$core$String$fromInt(n));
};
var rundis$elm_bootstrap$Bootstrap$Modal$StartClose = {$: 'StartClose'};
var rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg = function (config_) {
	var _n0 = config_.withAnimation;
	if (_n0.$ === 'Just') {
		var animationMsg = _n0.a;
		return animationMsg(rundis$elm_bootstrap$Bootstrap$Modal$StartClose);
	} else {
		return config_.closeMsg;
	}
};
var rundis$elm_bootstrap$Bootstrap$Modal$isFade = function (conf) {
	return A2(
		elm$core$Maybe$withDefault,
		false,
		A2(
			elm$core$Maybe$map,
			function (_n0) {
				return true;
			},
			conf.withAnimation));
};
var rundis$elm_bootstrap$Bootstrap$Modal$backdrop = F2(
	function (visibility, conf) {
		var attributes = function () {
			switch (visibility.$) {
				case 'Show':
					return _Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('modal-backdrop', true),
										_Utils_Tuple2(
										'fade',
										rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
										_Utils_Tuple2('show', true)
									]))
							]),
						conf.options.hideOnBackdropClick ? _List_fromArray(
							[
								elm$html$Html$Events$onClick(
								rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg(conf))
							]) : _List_Nil);
				case 'StartClose':
					return _List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', true),
									_Utils_Tuple2('fade', true),
									_Utils_Tuple2('show', true)
								]))
						]);
				case 'FadeClose':
					return _List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', true),
									_Utils_Tuple2('fade', true),
									_Utils_Tuple2('show', false)
								]))
						]);
				default:
					return _List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', false),
									_Utils_Tuple2(
									'fade',
									rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
									_Utils_Tuple2('show', false)
								]))
						]);
			}
		}();
		return _List_fromArray(
			[
				A2(elm$html$Html$div, attributes, _List_Nil)
			]);
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['className']),
	elm$json$Json$Decode$string);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target = function (decoder) {
	return A2(elm$json$Json$Decode$field, 'target', decoder);
};
var rundis$elm_bootstrap$Bootstrap$Modal$containerClickDecoder = function (closeMsg) {
	return A2(
		elm$json$Json$Decode$andThen,
		function (c) {
			return A2(elm$core$String$contains, 'elm-bootstrap-modal', c) ? elm$json$Json$Decode$succeed(closeMsg) : elm$json$Json$Decode$fail('ignoring');
		},
		rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target(rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className));
};
var rundis$elm_bootstrap$Bootstrap$Modal$display = F2(
	function (visibility, conf) {
		switch (visibility.$) {
			case 'Show':
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2(elm$html$Html$Attributes$style, 'display', 'block'),
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2(
								'fade',
								rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
								_Utils_Tuple2('show', true)
							]))
					]);
			case 'StartClose':
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2(elm$html$Html$Attributes$style, 'display', 'block'),
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2('fade', true),
								_Utils_Tuple2('show', true)
							]))
					]);
			case 'FadeClose':
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2(elm$html$Html$Attributes$style, 'display', 'block'),
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2('fade', true),
								_Utils_Tuple2('show', false)
							])),
						A2(
						elm$html$Html$Events$on,
						'transitionend',
						elm$json$Json$Decode$succeed(conf.closeMsg))
					]);
			default:
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'height', '0px'),
						A2(elm$html$Html$Attributes$style, 'display', 'block'),
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2(
								'fade',
								rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
								_Utils_Tuple2('show', false)
							]))
					]);
		}
	});
var rundis$elm_bootstrap$Bootstrap$Modal$modalClass = function (size) {
	var _n0 = rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size);
	if (_n0.$ === 'Just') {
		var s = _n0.a;
		return _List_fromArray(
			[
				elm$html$Html$Attributes$class('modal-' + s)
			]);
	} else {
		return _List_Nil;
	}
};
var rundis$elm_bootstrap$Bootstrap$Modal$modalAttributes = function (options) {
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('modal-dialog', true),
						_Utils_Tuple2('modal-dialog-centered', options.centered)
					])),
				A2(elm$html$Html$Attributes$style, 'pointer-events', 'auto')
			]),
		A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(elm$core$Maybe$map, rundis$elm_bootstrap$Bootstrap$Modal$modalClass, options.modalSize)));
};
var rundis$elm_bootstrap$Bootstrap$Modal$renderBody = function (maybeBody) {
	if (maybeBody.$ === 'Just') {
		var cfg = maybeBody.a.a;
		return elm$core$Maybe$Just(
			A2(
				elm$html$Html$div,
				A2(
					elm$core$List$cons,
					elm$html$Html$Attributes$class('modal-body'),
					cfg.attributes),
				cfg.children));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var rundis$elm_bootstrap$Bootstrap$Modal$renderFooter = function (maybeFooter) {
	if (maybeFooter.$ === 'Just') {
		var cfg = maybeFooter.a.a;
		return elm$core$Maybe$Just(
			A2(
				elm$html$Html$div,
				A2(
					elm$core$List$cons,
					elm$html$Html$Attributes$class('modal-footer'),
					cfg.attributes),
				cfg.children));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var rundis$elm_bootstrap$Bootstrap$Modal$closeButton = function (closeMsg) {
	return A2(
		elm$html$Html$button,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('close'),
				elm$html$Html$Events$onClick(closeMsg)
			]),
		_List_fromArray(
			[
				elm$html$Html$text('×')
			]));
};
var rundis$elm_bootstrap$Bootstrap$Modal$renderHeader = function (conf_) {
	var _n0 = conf_.header;
	if (_n0.$ === 'Just') {
		var cfg = _n0.a.a;
		return elm$core$Maybe$Just(
			A2(
				elm$html$Html$div,
				A2(
					elm$core$List$cons,
					elm$html$Html$Attributes$class('modal-header'),
					cfg.attributes),
				_Utils_ap(
					cfg.children,
					_List_fromArray(
						[
							rundis$elm_bootstrap$Bootstrap$Modal$closeButton(
							rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg(conf_))
						]))));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var rundis$elm_bootstrap$Bootstrap$Modal$view = F2(
	function (visibility, _n0) {
		var conf = _n0.a;
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$tabindex(-1)
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Modal$display, visibility, conf)),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_Utils_ap(
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$attribute, 'role', 'document'),
											elm$html$Html$Attributes$class('elm-bootstrap-modal')
										]),
									_Utils_ap(
										rundis$elm_bootstrap$Bootstrap$Modal$modalAttributes(conf.options),
										conf.options.hideOnBackdropClick ? _List_fromArray(
											[
												A2(
												elm$html$Html$Events$on,
												'click',
												rundis$elm_bootstrap$Bootstrap$Modal$containerClickDecoder(conf.closeMsg))
											]) : _List_Nil)),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('modal-content')
											]),
										A2(
											elm$core$List$filterMap,
											elm$core$Basics$identity,
											_List_fromArray(
												[
													rundis$elm_bootstrap$Bootstrap$Modal$renderHeader(conf),
													rundis$elm_bootstrap$Bootstrap$Modal$renderBody(conf.body),
													rundis$elm_bootstrap$Bootstrap$Modal$renderFooter(conf.footer)
												])))
									]))
							]))
					]),
				A2(rundis$elm_bootstrap$Bootstrap$Modal$backdrop, visibility, conf)));
	});
var rundis$elm_bootstrap$Bootstrap$Modal$withAnimation = F2(
	function (animateMsg, _n0) {
		var conf = _n0.a;
		return rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					withAnimation: elm$core$Maybe$Just(animateMsg)
				}));
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$m2 = elm$html$Html$Attributes$class('m-2');
var author$project$Main$notificationsModalView = F2(
	function (state, msg) {
		var _n0 = state.notification;
		if (_n0.$ === 'Nothing') {
			return elm$html$Html$text('');
		} else {
			var notification = _n0.a;
			return A2(
				elm$html$Html$map,
				msg,
				A2(
					rundis$elm_bootstrap$Bootstrap$Modal$view,
					state.modal,
					A3(
						rundis$elm_bootstrap$Bootstrap$Modal$footer,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								rundis$elm_bootstrap$Bootstrap$Button$button,
								_List_fromArray(
									[
										rundis$elm_bootstrap$Bootstrap$Button$primary,
										rundis$elm_bootstrap$Bootstrap$Button$block,
										rundis$elm_bootstrap$Bootstrap$Button$attrs(
										_List_fromArray(
											[
												elm$html$Html$Events$onClick(author$project$Main$NotificationsModalDismiss)
											]))
									]),
								_List_fromArray(
									[
										elm$html$Html$text('Dismiss')
									]))
							]),
						A3(
							rundis$elm_bootstrap$Bootstrap$Modal$body,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$m2]),
									_List_fromArray(
										[
											elm$html$Html$text(notification.message)
										]))
								]),
							A2(
								rundis$elm_bootstrap$Bootstrap$Modal$withAnimation,
								author$project$Main$NotificationsModalAnimate,
								rundis$elm_bootstrap$Bootstrap$Modal$config(author$project$Main$NotificationsModalClose))))));
		}
	});
var author$project$Main$ToggleSidebar = {$: 'ToggleSidebar'};
var author$project$Main$ToggleUserDropdown = {$: 'ToggleUserDropdown'};
var author$project$Main$NotificationsModalOpen = function (a) {
	return {$: 'NotificationsModalOpen', a: a};
};
var author$project$Main$ToggleEventsDropdown = {$: 'ToggleEventsDropdown'};
var elm$html$Html$h6 = _VirtualDom_node('h6');
var elm$html$Html$i = _VirtualDom_node('i');
var elm$html$Html$li = _VirtualDom_node('li');
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Link = {$: 'Link'};
var rundis$elm_bootstrap$Bootstrap$Button$roleLink = rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled(rundis$elm_bootstrap$Bootstrap$Internal$Button$Link));
var rundis$elm_bootstrap$Bootstrap$General$Internal$SM = {$: 'SM'};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Size = function (a) {
	return {$: 'Size', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$small = rundis$elm_bootstrap$Bootstrap$Internal$Button$Size(rundis$elm_bootstrap$Bootstrap$General$Internal$SM);
var author$project$Main$uiNotificationsDropdown = F2(
	function (state, msg) {
		var menuItem = function (notification) {
			return A2(
				elm$html$Html$span,
				_List_fromArray(
					[
						elm$html$Html$Events$onClick(
						msg(
							author$project$Main$NotificationsModalMsg(
								author$project$Main$NotificationsModalOpen(notification)))),
						A2(elm$html$Html$Attributes$style, 'cursor', 'pointer'),
						elm$html$Html$Attributes$class('dropdown-item d-flex align-items-center')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('mr-3')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$class('icon-circle bg-success'),
										A2(elm$html$Html$Attributes$style, 'width', '2.8rem'),
										A2(elm$html$Html$Attributes$style, 'height', '2.8rem')
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$i,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'font-size', '1.85em'),
												elm$html$Html$Attributes$class('fas fa-smile text-white')
											]),
										_List_Nil)
									]))
							])),
						A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(notification.message)
									]))
							]))
					]));
		};
		var menu = function () {
			var _n1 = state.notifications.resource;
			if (_n1.$ === 'Available') {
				var notifications = _n1.a;
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							((!_Utils_eq(author$project$Main$Closed, state.notifsDropdownStatus)) ? 'show ' : '') + 'dropdown-list dropdown-menu dropdown-menu-right shadow-sm animated--grow-in')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								elm$html$Html$h6,
								_List_fromArray(
									[
										elm$html$Html$Attributes$class('bg-success border-success dropdown-header')
									]),
								_List_fromArray(
									[
										elm$html$Html$text('Notifications')
									]))
							]),
						_Utils_ap(
							A2(elm$core$List$map, menuItem, notifications),
							_List_fromArray(
								[
									A2(
									elm$html$Html$a,
									_List_fromArray(
										[
											elm$html$Html$Attributes$href('/notifications'),
											elm$html$Html$Attributes$class('dropdown-item text-center text-gray-500')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Show all notifications')
										]))
								]))));
			} else {
				return elm$html$Html$text('');
			}
		}();
		var icon = function () {
			var _n0 = state.notifications.resource;
			switch (_n0.$) {
				case 'NotRequested':
					return elm$html$Html$text('');
				case 'Error':
					var httpError = _n0.a;
					return elm$html$Html$text('');
				case 'Requested':
					return A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'min-width', '59px')
							]),
						_List_fromArray(
							[
								A2(
								rundis$elm_bootstrap$Bootstrap$Button$button,
								_List_fromArray(
									[
										rundis$elm_bootstrap$Bootstrap$Button$small,
										rundis$elm_bootstrap$Bootstrap$Button$roleLink,
										rundis$elm_bootstrap$Bootstrap$Button$attrs(
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'font-size', '1.4em'),
												elm$html$Html$Attributes$class('nav-link dropdown-toggle'),
												elm$html$Html$Events$onClick(
												msg(author$project$Main$ToggleEventsDropdown))
											]))
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('d-flex justify-content-center'),
												A2(elm$html$Html$Attributes$style, 'height', '100%'),
												A2(elm$html$Html$Attributes$style, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														A2(elm$html$Html$Attributes$style, 'opacity', '0.65'),
														A2(elm$html$Html$Attributes$style, 'border-width', '5px'),
														A2(elm$html$Html$Attributes$style, 'width', '2rem'),
														A2(elm$html$Html$Attributes$style, 'height', '2rem'),
														elm$html$Html$Attributes$class('spinner-border text-white'),
														A2(elm$html$Html$Attributes$attribute, 'role', 'status')
													]),
												_List_fromArray(
													[
														A2(
														elm$html$Html$span,
														_List_fromArray(
															[
																elm$html$Html$Attributes$class('sr-only')
															]),
														_List_fromArray(
															[
																elm$html$Html$text('Loading')
															]))
													]))
											]))
									]))
							]));
				default:
					var notifications = _n0.a;
					var count = elm$core$List$length(notifications);
					return (!count) ? elm$html$Html$text('') : A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'min-width', '59px')
							]),
						_List_fromArray(
							[
								A2(
								rundis$elm_bootstrap$Bootstrap$Button$button,
								_List_fromArray(
									[
										rundis$elm_bootstrap$Bootstrap$Button$small,
										rundis$elm_bootstrap$Bootstrap$Button$roleLink,
										rundis$elm_bootstrap$Bootstrap$Button$attrs(
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'font-size', '1.4em'),
												elm$html$Html$Attributes$class('nav-link dropdown-toggle'),
												elm$html$Html$Events$onClick(
												msg(author$project$Main$ToggleEventsDropdown))
											]))
									]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$i,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('fas fa-bell fa-fw')
											]),
										_List_Nil),
										A2(
										elm$html$Html$span,
										_List_fromArray(
											[
												A2(elm$html$Html$Attributes$style, 'margin-top', '1.1rem'),
												A2(elm$html$Html$Attributes$style, 'margin-right', '0.1rem'),
												elm$html$Html$Attributes$class('badge badge-danger badge-counter')
											]),
										_List_fromArray(
											[
												elm$html$Html$text(
												elm$core$String$fromInt(count))
											]))
									]))
							]));
			}
		}();
		return A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('mr-2 nav-item dropdown no-arrow')
				]),
			_List_fromArray(
				[icon, menu]));
	});
var elm$html$Html$b = _VirtualDom_node('b');
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$nav = _VirtualDom_node('nav');
var elm$html$Html$ul = _VirtualDom_node('ul');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$Main$uiNavbarView = F3(
	function (state, user, msg) {
		return A2(
			elm$html$Html$nav,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('navbar navbar-expand navbar-dark bg-success topbar static-top')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Events$onClick(
							msg(author$project$Main$ToggleSidebar)),
							elm$html$Html$Attributes$class('text-white btn btn-link d-md-none rounded-circle mr-3')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$i,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('fa fa-bars')
								]),
							_List_Nil)
						])),
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$href('/'),
							elm$html$Html$Attributes$class('navbar-brand')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Farm Radio Interactive')
						])),
					A2(
					elm$html$Html$ul,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('navbar-nav ml-auto')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$li,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('nav-item dropdown')
								]),
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$small,
											rundis$elm_bootstrap$Bootstrap$Button$roleLink,
											rundis$elm_bootstrap$Bootstrap$Button$attrs(
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'font-size', '1em'),
													elm$html$Html$Attributes$class('nav-link dropdown-toggle')
												]))
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$b,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('English')
												]))
										]))
								])),
							A2(author$project$Main$uiNotificationsDropdown, state, msg),
							A2(
							elm$html$Html$li,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('nav-item dropdown no-arrow')
								]),
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$roleLink,
											rundis$elm_bootstrap$Bootstrap$Button$attrs(
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('nav-link dropdown-toggle'),
													elm$html$Html$Events$onClick(
													msg(author$project$Main$ToggleUserDropdown))
												]))
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$span,
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'font-size', '.9em'),
													elm$html$Html$Attributes$class('mr-3 d-none d-lg-inline text-white small')
												]),
											_List_fromArray(
												[
													elm$html$Html$text(user.name)
												])),
											A2(
											elm$html$Html$img,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('img-profile rounded-circle'),
													A2(elm$html$Html$Attributes$style, 'width', '2.4rem'),
													A2(elm$html$Html$Attributes$style, 'height', '2.4rem'),
													elm$html$Html$Attributes$src('/tmp/photo-1518822275865-16eec4d3023d.jpeg')
												]),
											_List_Nil)
										])),
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class(
											((!_Utils_eq(author$project$Main$Closed, state.userDropdownStatus)) ? 'show ' : '') + 'dropdown-menu dropdown-menu-right shadow-sm animated--grow-in')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-header')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Account')
												])),
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$href('/profile'),
													elm$html$Html$Attributes$class('dropdown-item')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Profile')
												])),
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-divider')
												]),
											_List_Nil),
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-header')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Project')
												])),
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-item'),
													elm$html$Html$Attributes$href('/settings')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Settings')
												])),
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-item'),
													elm$html$Html$Attributes$href('/projects')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Change project')
												])),
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-item'),
													elm$html$Html$Attributes$href('/projects/new')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('New project')
												])),
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-divider')
												]),
											_List_Nil),
											A2(
											elm$html$Html$a,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('dropdown-item'),
													elm$html$Html$Attributes$href('/logout')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Log out')
												]))
										]))
								]))
						]))
				]));
	});
var author$project$Main$uiSidebarView = F2(
	function (state, msg) {
		var toggled = state.sidebarVisible ? '' : 'toggled ';
		return A2(
			elm$html$Html$ul,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class(toggled + 'navbar-nav bg-secondary sidebar sidebar-dark accordion')
				]),
			_List_Nil);
	});
var author$project$Main$projectLayout = F3(
	function (user, ui, page) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(author$project$Main$uiNavbarView, ui, user, author$project$Main$UiMsg),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$id('wrapper')
						]),
					_List_fromArray(
						[
							A2(author$project$Main$uiSidebarView, ui, author$project$Main$UiMsg),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$id('content-wrapper'),
									elm$html$Html$Attributes$class('d-flex flex-column')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$id('content')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('container-fluid mt-4')
												]),
											_List_fromArray(
												[page]))
										]))
								]))
						])),
					A2(
					author$project$Main$notificationsModalView,
					ui.notificationsModal,
					A2(elm$core$Basics$composeL, author$project$Main$UiMsg, author$project$Main$NotificationsModalMsg))
				]));
	});
var author$project$Main$RegisterFormMsg = function (a) {
	return {$: 'RegisterFormMsg', a: a};
};
var elm_community$maybe_extra$Maybe$Extra$isNothing = function (m) {
	if (m.$ === 'Nothing') {
		return true;
	} else {
		return false;
	}
};
var elm$html$Html$small = _VirtualDom_node('small');
var rundis$elm_bootstrap$Bootstrap$Form$help = F2(
	function (attributes, children) {
		return A2(
			elm$html$Html$small,
			A2(
				elm$core$List$cons,
				elm$html$Html$Attributes$class('form-text text-muted'),
				attributes),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Checkbox$danger = rundis$elm_bootstrap$Bootstrap$Form$Checkbox$Validation(rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var rundis$elm_bootstrap$Bootstrap$Form$Input$Placeholder = function (a) {
	return {$: 'Placeholder', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder = function (value_) {
	return rundis$elm_bootstrap$Bootstrap$Form$Input$Placeholder(value_);
};
var author$project$Main$registerFormView = F3(
	function (form, sent, msg) {
		var useEmailAsLogin = A2(etaque$elm_form$Form$getFieldAsBool, 'useEmailAsLogin', form);
		var useEmailAsLoginOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, useEmailAsLogin.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Checkbox$danger, opts);
		}();
		var phoneNumber = A2(etaque$elm_form$Form$getFieldAsString, 'phoneNumber', form);
		var phoneNumberOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Phone number')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, phoneNumber.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var password = A2(etaque$elm_form$Form$getFieldAsString, 'password', form);
		var passwordOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Password')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, password.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var organization = A2(etaque$elm_form$Form$getFieldAsString, 'organization', form);
		var organizationOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Organization')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, organization.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var name = A2(etaque$elm_form$Form$getFieldAsString, 'name', form);
		var nameOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Name')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, name.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var login = A2(etaque$elm_form$Form$getFieldAsString, 'login', form);
		var loginOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Login')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, login.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var loginField = function () {
			var _n0 = useEmailAsLogin.value;
			if ((_n0.$ === 'Just') && (!_n0.a)) {
				return A2(
					rundis$elm_bootstrap$Bootstrap$Form$group,
					_List_Nil,
					_List_fromArray(
						[
							A3(author$project$Main$bootstrapInputText, login, loginOptions, _List_Nil),
							A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, login, _List_Nil)
						]));
			} else {
				return elm$html$Html$text('');
			}
		}();
		var email = A2(etaque$elm_form$Form$getFieldAsString, 'email', form);
		var emailOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Email')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, email.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var confirmPassword = A2(etaque$elm_form$Form$getFieldAsString, 'confirmPassword', form);
		var confirmPasswordOptions = function () {
			var opts = _List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Confirm password')
				]);
			return _Utils_eq(elm$core$Maybe$Nothing, confirmPassword.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		var agreeWithTerms = A2(etaque$elm_form$Form$getFieldAsBool, 'agreeWithTerms', form);
		var agreeWithTermsOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, agreeWithTerms.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Checkbox$danger, opts);
		}();
		return A2(
			elm$html$Html$map,
			msg,
			A2(
				rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
						A2(
							rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputText, name, nameOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, name, _List_Nil),
											((!name.isChanged) && elm_community$maybe_extra$Maybe$Extra$isNothing(name.liveError)) ? A2(
											rundis$elm_bootstrap$Bootstrap$Form$help,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('This field is required')
												])) : elm$html$Html$text('')
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputText, email, emailOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, email, _List_Nil),
											((!email.isChanged) && elm_community$maybe_extra$Maybe$Extra$isNothing(email.liveError)) ? A2(
											rundis$elm_bootstrap$Bootstrap$Form$help,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('This field is required')
												])) : elm$html$Html$text('')
										])),
									loginField,
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A5(author$project$Main$bootstrapCheckbox, 'register-form-use-email-login', 'Use email as login?', useEmailAsLogin, useEmailAsLoginOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, useEmailAsLogin, _List_Nil)
										])),
									A2(elm$html$Html$hr, _List_Nil, _List_Nil),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputText, organization, organizationOptions, _List_Nil)
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputText, phoneNumber, phoneNumberOptions, _List_Nil)
										])),
									A2(elm$html$Html$hr, _List_Nil, _List_Nil),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputPassword, password, passwordOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, password, _List_Nil),
											((!password.isChanged) && elm_community$maybe_extra$Maybe$Extra$isNothing(password.liveError)) ? A2(
											rundis$elm_bootstrap$Bootstrap$Form$help,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('This field is required')
												])) : elm$html$Html$text('')
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A3(author$project$Main$bootstrapInputPassword, confirmPassword, confirmPasswordOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, confirmPassword, _List_Nil),
											((!confirmPassword.isChanged) && elm_community$maybe_extra$Maybe$Extra$isNothing(confirmPassword.liveError)) ? A2(
											rundis$elm_bootstrap$Bootstrap$Form$help,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('This field is required')
												])) : elm$html$Html$text('')
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													elm$html$Html$b,
													_List_Nil,
													_List_fromArray(
														[
															elm$html$Html$text('Terms and conditions')
														]))
												])),
											rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea(
											_List_fromArray(
												[
													rundis$elm_bootstrap$Bootstrap$Form$Textarea$attrs(
													_List_fromArray(
														[
															A2(elm$html$Html$Attributes$style, 'height', '97px'),
															A2(elm$html$Html$Attributes$style, 'font-size', '11pt'),
															elm$html$Html$Attributes$readonly(true)
														])),
													rundis$elm_bootstrap$Bootstrap$Form$Textarea$value('Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account. Please fill out and submit the form below to apply for a user account.')
												]))
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A5(author$project$Main$bootstrapCheckbox, 'register-agree-with-terms', 'I agree with the terms of this service', agreeWithTerms, agreeWithTermsOptions, _List_Nil),
											A3(
											author$project$Main$bootstrapInvalidFeedback,
											author$project$Main$errorToString,
											agreeWithTerms,
											_List_fromArray(
												[
													A2(elm$html$Html$Attributes$style, 'display', 'block')
												]))
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$block,
											rundis$elm_bootstrap$Bootstrap$Button$primary,
											rundis$elm_bootstrap$Bootstrap$Button$onClick(etaque$elm_form$Form$Submit),
											rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
										]),
									_List_fromArray(
										[
											elm$html$Html$text(
											sent ? 'Please wait' : 'Submit')
										]))
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled, sent, rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))
					])));
	});
var author$project$Main$registerPageError = function (userResource) {
	if (userResource.$ === 'Error') {
		var error = userResource.a;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Main$errorMessage(error))
				]));
	} else {
		return elm$html$Html$text('');
	}
};
var author$project$Main$registerPageView = F2(
	function (_n0, msg) {
		var user = _n0.user;
		var form = _n0.form;
		var sent = _n0.sent;
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h2,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('text-gray-900 mb-4')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Create an account')
								]))
						])),
					author$project$Main$registerPageError(user.resource),
					A2(
					elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('Please fill out and submit the form below to apply for a user account.')
						])),
					A3(
					author$project$Main$registerFormView,
					form,
					sent,
					A2(elm$core$Basics$composeL, msg, author$project$Main$RegisterFormMsg)),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Or ')
								])),
							A2(
							elm$html$Html$a,
							_List_fromArray(
								[
									elm$html$Html$Attributes$href('/login')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('log in')
								])),
							A2(
							elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(' if you already have an account.')
								]))
						]))
				]));
	});
var author$project$Main$ResetPasswordFormMsg = function (a) {
	return {$: 'ResetPasswordFormMsg', a: a};
};
var author$project$Main$resetPasswordError = function (resource) {
	if (resource.$ === 'Error') {
		var error = resource.a;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Alert$simpleDanger,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Main$errorMessage(error))
				]));
	} else {
		return elm$html$Html$text('');
	}
};
var author$project$Main$resetPasswordFormView = F3(
	function (form, sent, msg) {
		var login = A2(etaque$elm_form$Form$getFieldAsString, 'login', form);
		var loginOptions = function () {
			var opts = _List_Nil;
			return _Utils_eq(elm$core$Maybe$Nothing, login.liveError) ? opts : A2(elm$core$List$cons, rundis$elm_bootstrap$Bootstrap$Form$Input$danger, opts);
		}();
		return A2(
			elm$html$Html$map,
			msg,
			A2(
				rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
						A2(
							rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
							_List_fromArray(
								[
									A2(
									rundis$elm_bootstrap$Bootstrap$Form$group,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											rundis$elm_bootstrap$Bootstrap$Form$label,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('Login')
												])),
											A3(author$project$Main$bootstrapInputText, login, loginOptions, _List_Nil),
											A3(author$project$Main$bootstrapInvalidFeedback, author$project$Main$errorToString, login, _List_Nil),
											_Utils_eq(elm$core$Maybe$Nothing, login.liveError) ? A2(
											rundis$elm_bootstrap$Bootstrap$Form$help,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('This is your login or email address')
												])) : elm$html$Html$text('')
										])),
									A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$block,
											rundis$elm_bootstrap$Bootstrap$Button$primary,
											rundis$elm_bootstrap$Bootstrap$Button$onClick(etaque$elm_form$Form$Submit),
											rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
										]),
									_List_fromArray(
										[
											elm$html$Html$text(
											sent ? 'Please wait' : 'Request')
										]))
								]),
							A2(rundis$elm_bootstrap$Bootstrap$Form$Fieldset$disabled, sent, rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))
					])));
	});
var author$project$Main$resetPasswordPageView = F2(
	function (_n0, msg) {
		var response = _n0.response;
		var form = _n0.form;
		var sent = _n0.sent;
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$i,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'font-size', '64px'),
									elm$html$Html$Attributes$class('fas fa-meh-rolling-eyes mb-3')
								]),
							_List_Nil),
							A2(
							elm$html$Html$h2,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('text-gray-900 mb-4')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Lost your password?')
								]))
						])),
					A2(
					elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('It happens! Enter your login or email address in the field below and press the ‘Request’ button. If we find a matching account, an email will be sent with further instructions.')
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-left')
						]),
					_List_fromArray(
						[
							author$project$Main$resetPasswordError(response.resource),
							A3(
							author$project$Main$resetPasswordFormView,
							form,
							sent,
							A2(elm$core$Basics$composeL, msg, author$project$Main$ResetPasswordFormMsg))
						])),
					A2(elm$html$Html$hr, _List_Nil, _List_Nil),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$a,
							_List_fromArray(
								[
									elm$html$Html$Attributes$href('/login')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Return to login')
								]))
						]))
				]));
	});
var author$project$Main$SelectProjectQuery = function (a) {
	return {$: 'SelectProjectQuery', a: a};
};
var author$project$Main$SelectProject = function (a) {
	return {$: 'SelectProject', a: a};
};
var elm$core$String$toLower = _String_toLower;
var author$project$Main$highlightQuery = F2(
	function (input, query) {
		var queryLength = elm$core$String$length(query);
		var pairs = function (xs) {
			if (xs.b) {
				if (xs.b.b) {
					var fst = xs.a;
					var _n1 = xs.b;
					var snd = _n1.a;
					var rest = _n1.b;
					return A2(
						elm$core$List$cons,
						_Utils_Tuple2(fst, snd),
						pairs(rest));
				} else {
					var fst = xs.a;
					return _List_fromArray(
						[
							_Utils_Tuple2(fst, '')
						]);
				}
			} else {
				return _List_Nil;
			}
		};
		var indexes = A2(
			elm$core$String$indexes,
			elm$core$String$toLower(query),
			elm$core$String$toLower(input));
		var htmlPairs = function (_n4) {
			var slice = _n4.a;
			var query_ = _n4.b;
			return _List_fromArray(
				[
					elm$html$Html$text(slice),
					A2(
					elm$html$Html$b,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(query_)
						]))
				]);
		};
		var fun = F2(
			function (ix, _n3) {
				var str = _n3.a;
				var strs = _n3.b;
				var prev = _n3.c;
				var wordLength = ix - prev;
				var tokenLength = wordLength + queryLength;
				var strs_ = A2(
					elm$core$List$cons,
					A3(elm$core$String$slice, wordLength, tokenLength, str),
					A2(
						elm$core$List$cons,
						A2(elm$core$String$left, wordLength, str),
						strs));
				return _Utils_Tuple3(
					A2(elm$core$String$dropLeft, tokenLength, str),
					strs_,
					ix + queryLength);
			});
		var _n2 = A3(
			elm$core$List$foldl,
			fun,
			_Utils_Tuple3(input, _List_Nil, 0),
			indexes);
		var head = _n2.a;
		var tail = _n2.b;
		return A2(
			elm$html$Html$span,
			_List_Nil,
			A2(
				elm$core$List$concatMap,
				htmlPairs,
				pairs(
					elm$core$List$reverse(
						A2(elm$core$List$cons, head, tail)))));
	});
var elm_community$maybe_extra$Maybe$Extra$unpack = F3(
	function (d, f, m) {
		if (m.$ === 'Nothing') {
			return d(_Utils_Tuple0);
		} else {
			var a = m.a;
			return f(a);
		}
	});
var rundis$elm_bootstrap$Bootstrap$Table$Td = function (a) {
	return {$: 'Td', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$td = F2(
	function (options, children) {
		return rundis$elm_bootstrap$Bootstrap$Table$Td(
			{children: children, options: options});
	});
var rundis$elm_bootstrap$Bootstrap$Table$Row = function (a) {
	return {$: 'Row', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$tr = F2(
	function (options, cells) {
		return rundis$elm_bootstrap$Bootstrap$Table$Row(
			{cells: cells, options: options});
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$p0 = elm$html$Html$Attributes$class('p-0');
var author$project$Main$selectProjectProjectsListItem = F3(
	function (msg, maybeQuery, project) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$Table$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					rundis$elm_bootstrap$Bootstrap$Table$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							rundis$elm_bootstrap$Bootstrap$Button$button,
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Button$roleLink,
									rundis$elm_bootstrap$Bootstrap$Button$attrs(
									_List_fromArray(
										[
											elm$html$Html$Events$onClick(
											msg(
												author$project$Main$SelectProject(project))),
											rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$p0
										]))
								]),
							_List_fromArray(
								[
									A3(
									elm_community$maybe_extra$Maybe$Extra$unpack,
									elm$core$Basics$always(
										elm$html$Html$text(project.name)),
									author$project$Main$highlightQuery(project.name),
									maybeQuery)
								]))
						])),
					A2(
					rundis$elm_bootstrap$Bootstrap$Table$td,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('Today')
						])),
					A2(
					rundis$elm_bootstrap$Bootstrap$Table$td,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(project.country)
						]))
				]));
	});
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$CellAttr = function (a) {
	return {$: 'CellAttr', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$cellAttr = function (attr_) {
	return rundis$elm_bootstrap$Bootstrap$Table$CellAttr(attr_);
};
var rundis$elm_bootstrap$Bootstrap$Table$THead = function (a) {
	return {$: 'THead', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$thead = F2(
	function (options, rows) {
		return rundis$elm_bootstrap$Bootstrap$Table$THead(
			{options: options, rows: rows});
	});
var rundis$elm_bootstrap$Bootstrap$Table$simpleThead = function (cells) {
	return A2(
		rundis$elm_bootstrap$Bootstrap$Table$thead,
		_List_Nil,
		_List_fromArray(
			[
				A2(rundis$elm_bootstrap$Bootstrap$Table$tr, _List_Nil, cells)
			]));
};
var rundis$elm_bootstrap$Bootstrap$Table$Small = {$: 'Small'};
var rundis$elm_bootstrap$Bootstrap$Table$small = rundis$elm_bootstrap$Bootstrap$Table$Small;
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var elm$html$Html$table = _VirtualDom_node('table');
var rundis$elm_bootstrap$Bootstrap$Table$Inversed = {$: 'Inversed'};
var rundis$elm_bootstrap$Bootstrap$Table$isResponsive = function (option) {
	if (option.$ === 'Responsive') {
		return true;
	} else {
		return false;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody = function (a) {
	return {$: 'KeyedTBody', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$TBody = function (a) {
	return {$: 'TBody', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$InversedRow = function (a) {
	return {$: 'InversedRow', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$KeyedRow = function (a) {
	return {$: 'KeyedRow', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$InversedCell = function (a) {
	return {$: 'InversedCell', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$Th = function (a) {
	return {$: 'Th', a: a};
};
var rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell = function (cell) {
	var inverseOptions = function (options) {
		return A2(
			elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledCell') {
					var role = opt.a;
					return rundis$elm_bootstrap$Bootstrap$Table$InversedCell(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (cell.$ === 'Th') {
		var cellCfg = cell.a;
		return rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	} else {
		var cellCfg = cell.a;
		return rundis$elm_bootstrap$Bootstrap$Table$Td(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow = function (row) {
	var inversedOptions = function (options) {
		return A2(
			elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledRow') {
					var role = opt.a;
					return rundis$elm_bootstrap$Bootstrap$Table$InversedRow(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return rundis$elm_bootstrap$Bootstrap$Table$Row(
			{
				cells: A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell, cells),
				options: inversedOptions(options)
			});
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
			{
				cells: A2(
					elm$core$List$map,
					function (_n1) {
						var key = _n1.a;
						var cell = _n1.b;
						return _Utils_Tuple2(
							key,
							rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell(cell));
					},
					cells),
				options: inversedOptions(options)
			});
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody = F2(
	function (isTableInversed, tbody_) {
		var _n0 = _Utils_Tuple2(isTableInversed, tbody_);
		if (!_n0.a) {
			return tbody_;
		} else {
			if (_n0.b.$ === 'TBody') {
				var body = _n0.b.a;
				return rundis$elm_bootstrap$Bootstrap$Table$TBody(
					_Utils_update(
						body,
						{
							rows: A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, body.rows)
						}));
			} else {
				var keyedBody = _n0.b.a;
				return rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody(
					_Utils_update(
						keyedBody,
						{
							rows: A2(
								elm$core$List$map,
								function (_n1) {
									var key = _n1.a;
									var row = _n1.b;
									return _Utils_Tuple2(
										key,
										rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow(row));
								},
								keyedBody.rows)
						}));
			}
		}
	});
var rundis$elm_bootstrap$Bootstrap$Table$InversedHead = {$: 'InversedHead'};
var rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead = F2(
	function (isTableInversed, _n0) {
		var thead_ = _n0.a;
		var isHeadInversed = A2(
			elm$core$List$any,
			function (opt) {
				return _Utils_eq(opt, rundis$elm_bootstrap$Bootstrap$Table$InversedHead);
			},
			thead_.options);
		return rundis$elm_bootstrap$Bootstrap$Table$THead(
			(isTableInversed || isHeadInversed) ? _Utils_update(
				thead_,
				{
					rows: A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, thead_.rows)
				}) : thead_);
	});
var rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive = F2(
	function (options, table_) {
		var responsiveClass = elm$html$Html$Attributes$class(
			'table-responsive' + A2(
				elm$core$Maybe$withDefault,
				'',
				A2(
					elm$core$Maybe$map,
					function (v) {
						return '-' + v;
					},
					A2(
						elm$core$Maybe$andThen,
						rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption,
						A2(
							elm$core$Maybe$andThen,
							function (opt) {
								if (opt.$ === 'Responsive') {
									var val = opt.a;
									return val;
								} else {
									return elm$core$Maybe$Nothing;
								}
							},
							elm$core$List$head(
								A2(elm$core$List$filter, rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options)))))));
		return A2(elm$core$List$any, rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options) ? A2(
			elm$html$Html$div,
			_List_fromArray(
				[responsiveClass]),
			_List_fromArray(
				[table_])) : table_;
	});
var elm$html$Html$tbody = _VirtualDom_node('tbody');
var elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var elm$html$Html$Keyed$node = elm$virtual_dom$VirtualDom$keyedNode;
var elm$html$Html$Attributes$scope = elm$html$Html$Attributes$stringProperty('scope');
var rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh = function (cell) {
	if (cell.$ === 'Th') {
		var cellConfig = cell.a;
		return rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellConfig,
				{
					options: A2(
						elm$core$List$cons,
						rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
							elm$html$Html$Attributes$scope('row')),
						cellConfig.options)
				}));
	} else {
		return cell;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var first = cells.a;
			var rest = cells.b;
			return rundis$elm_bootstrap$Bootstrap$Table$Row(
				{
					cells: A2(
						elm$core$List$cons,
						rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first),
						rest),
					options: options
				});
		}
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var _n3 = cells.a;
			var firstKey = _n3.a;
			var first = _n3.b;
			var rest = cells.b;
			return rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
				{
					cells: A2(
						elm$core$List$cons,
						_Utils_Tuple2(
							firstKey,
							rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first)),
						rest),
					options: options
				});
		}
	}
};
var elm$html$Html$tr = _VirtualDom_node('tr');
var elm$html$Html$td = _VirtualDom_node('td');
var elm$html$Html$th = _VirtualDom_node('th');
var rundis$elm_bootstrap$Bootstrap$Table$cellAttribute = function (option) {
	switch (option.$) {
		case 'RoledCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role);
			} else {
				var _n1 = option.a;
				return elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg-', role);
			} else {
				var _n2 = option.a;
				return elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$cellAttributes = function (options) {
	return A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$cellAttribute, options);
};
var rundis$elm_bootstrap$Bootstrap$Table$renderCell = function (cell) {
	if (cell.$ === 'Td') {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			elm$html$Html$td,
			rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	} else {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			elm$html$Html$th,
			rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$rowClass = function (option) {
	switch (option.$) {
		case 'RoledRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role_);
			} else {
				var _n1 = option.a;
				return elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role_);
			} else {
				var _n2 = option.a;
				return elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$rowAttributes = function (options) {
	return A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$rowClass, options);
};
var rundis$elm_bootstrap$Bootstrap$Table$renderRow = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return A2(
			elm$html$Html$tr,
			rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$renderCell, cells));
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return A3(
			elm$html$Html$Keyed$node,
			'tr',
			rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2(
				elm$core$List$map,
				function (_n1) {
					var key = _n1.a;
					var cell = _n1.b;
					return _Utils_Tuple2(
						key,
						rundis$elm_bootstrap$Bootstrap$Table$renderCell(cell));
				},
				cells));
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$renderTBody = function (body) {
	if (body.$ === 'TBody') {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A2(
			elm$html$Html$tbody,
			attributes,
			A2(
				elm$core$List$map,
				function (row) {
					return rundis$elm_bootstrap$Bootstrap$Table$renderRow(
						rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row));
				},
				rows));
	} else {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A3(
			elm$html$Html$Keyed$node,
			'tbody',
			attributes,
			A2(
				elm$core$List$map,
				function (_n1) {
					var key = _n1.a;
					var row = _n1.b;
					return _Utils_Tuple2(
						key,
						rundis$elm_bootstrap$Bootstrap$Table$renderRow(
							rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row)));
				},
				rows));
	}
};
var elm$html$Html$thead = _VirtualDom_node('thead');
var rundis$elm_bootstrap$Bootstrap$Table$theadAttribute = function (option) {
	switch (option.$) {
		case 'InversedHead':
			return elm$html$Html$Attributes$class('thead-dark');
		case 'DefaultHead':
			return elm$html$Html$Attributes$class('thead-default');
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$theadAttributes = function (options) {
	return A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$theadAttribute, options);
};
var rundis$elm_bootstrap$Bootstrap$Table$renderTHead = function (_n0) {
	var options = _n0.a.options;
	var rows = _n0.a.rows;
	return A2(
		elm$html$Html$thead,
		rundis$elm_bootstrap$Bootstrap$Table$theadAttributes(options),
		A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$renderRow, rows));
};
var rundis$elm_bootstrap$Bootstrap$Table$tableClass = function (option) {
	switch (option.$) {
		case 'Inversed':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-dark'));
		case 'Striped':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-striped'));
		case 'Bordered':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-bordered'));
		case 'Hover':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-hover'));
		case 'Small':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-sm'));
		case 'Responsive':
			return elm$core$Maybe$Nothing;
		case 'Reflow':
			return elm$core$Maybe$Just(
				elm$html$Html$Attributes$class('table-reflow'));
		default:
			var attr_ = option.a;
			return elm$core$Maybe$Just(attr_);
	}
};
var rundis$elm_bootstrap$Bootstrap$Table$tableAttributes = function (options) {
	return A2(
		elm$core$List$cons,
		elm$html$Html$Attributes$class('table'),
		A2(
			elm$core$List$filterMap,
			elm$core$Basics$identity,
			A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Table$tableClass, options)));
};
var rundis$elm_bootstrap$Bootstrap$Table$table = function (rec) {
	var isInversed = A2(
		elm$core$List$any,
		function (opt) {
			return _Utils_eq(opt, rundis$elm_bootstrap$Bootstrap$Table$Inversed);
		},
		rec.options);
	var classOptions = A2(
		elm$core$List$filter,
		function (opt) {
			return !rundis$elm_bootstrap$Bootstrap$Table$isResponsive(opt);
		},
		rec.options);
	return A2(
		rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive,
		rec.options,
		A2(
			elm$html$Html$table,
			rundis$elm_bootstrap$Bootstrap$Table$tableAttributes(classOptions),
			_List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Table$renderTHead(
					A2(rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead, isInversed, rec.thead)),
					rundis$elm_bootstrap$Bootstrap$Table$renderTBody(
					A2(rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody, isInversed, rec.tbody))
				])));
};
var rundis$elm_bootstrap$Bootstrap$Table$tbody = F2(
	function (attributes, rows) {
		return rundis$elm_bootstrap$Bootstrap$Table$TBody(
			{attributes: attributes, rows: rows});
	});
var rundis$elm_bootstrap$Bootstrap$Table$th = F2(
	function (options, children) {
		return rundis$elm_bootstrap$Bootstrap$Table$Th(
			{children: children, options: options});
	});
var author$project$Main$selectProjectProjectsTable = F3(
	function (maybeQuery, projects, msg) {
		return elm$core$List$isEmpty(projects) ? A2(
			elm$html$Html$p,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('p-1')
				]),
			_List_fromArray(
				[
					elm$html$Html$text('No projects found.')
				])) : rundis$elm_bootstrap$Bootstrap$Table$table(
			{
				options: _List_fromArray(
					[rundis$elm_bootstrap$Bootstrap$Table$small]),
				tbody: A2(
					rundis$elm_bootstrap$Bootstrap$Table$tbody,
					_List_Nil,
					A2(
						elm$core$List$map,
						A2(author$project$Main$selectProjectProjectsListItem, msg, maybeQuery),
						projects)),
				thead: rundis$elm_bootstrap$Bootstrap$Table$simpleThead(
					_List_fromArray(
						[
							A2(
							rundis$elm_bootstrap$Bootstrap$Table$th,
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
									elm$html$Html$Attributes$class('w-50'))
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Project name')
								])),
							A2(
							rundis$elm_bootstrap$Bootstrap$Table$th,
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
									elm$html$Html$Attributes$class('w-40'))
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Last accessed')
								])),
							A2(
							rundis$elm_bootstrap$Bootstrap$Table$th,
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
									elm$html$Html$Attributes$class('w-10'))
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Country')
								]))
						]))
			});
	});
var author$project$Main$selectProjectProjectsListView = F2(
	function (_n0, msg) {
		var projects = _n0.projects;
		var query = _n0.query;
		var results = _n0.results;
		var _n1 = projects.resource;
		switch (_n1.$) {
			case 'NotRequested':
				return elm$html$Html$text('not requested');
			case 'Requested':
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'margin', '2.5em')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('d-flex justify-content-center')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'border-width', '6px'),
											A2(elm$html$Html$Attributes$style, 'width', '3.5rem'),
											A2(elm$html$Html$Attributes$style, 'height', '3.5rem'),
											elm$html$Html$Attributes$class('spinner-border text-primary'),
											A2(elm$html$Html$Attributes$attribute, 'role', 'status')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$span,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('sr-only')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Loading')
												]))
										]))
								]))
						]));
			case 'Error':
				var httpError = _n1.a;
				return elm$html$Html$text('error!');
			default:
				var projects_ = _n1.a;
				return A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'min-height', '180px')
								]),
							_List_fromArray(
								[
									elm$core$String$isEmpty(query) ? A3(author$project$Main$selectProjectProjectsTable, elm$core$Maybe$Nothing, projects_, msg) : A3(
									author$project$Main$selectProjectProjectsTable,
									elm$core$Maybe$Just(query),
									results,
									msg)
								]))
						]));
		}
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Role$Info = {$: 'Info'};
var rundis$elm_bootstrap$Bootstrap$Alert$simpleInfo = rundis$elm_bootstrap$Bootstrap$Alert$simple(rundis$elm_bootstrap$Bootstrap$Internal$Role$Info);
var rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mb4 = elm$html$Html$Attributes$class('mb-4');
var author$project$Main$selectProjectPageView = F2(
	function (state, msg) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('text-center')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-left')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Type the name of the project you’d like to access in the input field below, or select a recently used project.')
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mb4]),
					_List_fromArray(
						[
							rundis$elm_bootstrap$Bootstrap$Form$Input$text(
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Type the name of a project here'),
									rundis$elm_bootstrap$Bootstrap$Form$Input$value(state.query),
									rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
									A2(elm$core$Basics$composeL, msg, author$project$Main$SelectProjectQuery))
								]))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-left')
						]),
					_List_fromArray(
						[
							A2(
							rundis$elm_bootstrap$Bootstrap$Alert$simpleInfo,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('mb-4')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('If you can’t find the project you’re looking for, ask an administrator for access.')
								])),
							A2(author$project$Main$selectProjectProjectsListView, state, msg)
						]))
				]));
	});
var rundis$elm_bootstrap$Bootstrap$Button$linkButton = F2(
	function (options, children) {
		return A2(
			elm$html$Html$a,
			A2(
				elm$core$List$cons,
				A2(elm$html$Html$Attributes$attribute, 'role', 'button'),
				rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options)),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Secondary = {$: 'Secondary'};
var rundis$elm_bootstrap$Bootstrap$Button$secondary = rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled(rundis$elm_bootstrap$Bootstrap$Internal$Button$Secondary));
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$ButtonGroup$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$ButtonItem = function (a) {
	return {$: 'ButtonItem', a: a};
};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$button = F2(
	function (options, children) {
		return rundis$elm_bootstrap$Bootstrap$ButtonGroup$ButtonItem(
			A2(rundis$elm_bootstrap$Bootstrap$Button$button, options, children));
	});
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$GroupItem = function (a) {
	return {$: 'GroupItem', a: a};
};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						size: elm$core$Maybe$Just(size)
					});
			case 'Vertical':
				return _Utils_update(
					options,
					{vertical: true});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$defaultOptions = {attributes: _List_Nil, size: elm$core$Maybe$Nothing, vertical: false};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$groupAttributes = F2(
	function (toggle, modifiers) {
		var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$ButtonGroup$applyModifier, rundis$elm_bootstrap$Bootstrap$ButtonGroup$defaultOptions, modifiers);
		return _Utils_ap(
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$attribute, 'role', 'group'),
					elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('btn-group', true),
							_Utils_Tuple2('btn-group-toggle', toggle),
							_Utils_Tuple2('btn-group-vertical', options.vertical)
						])),
					A2(elm$html$Html$Attributes$attribute, 'data-toggle', 'buttons')
				]),
			_Utils_ap(
				function () {
					var _n0 = A2(elm$core$Maybe$andThen, rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.size);
					if (_n0.$ === 'Just') {
						var s = _n0.a;
						return _List_fromArray(
							[
								elm$html$Html$Attributes$class('btn-group-' + s)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes));
	});
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem = F2(
	function (options, items) {
		return rundis$elm_bootstrap$Bootstrap$ButtonGroup$GroupItem(
			A2(
				elm$html$Html$div,
				A2(rundis$elm_bootstrap$Bootstrap$ButtonGroup$groupAttributes, false, options),
				A2(
					elm$core$List$map,
					function (_n0) {
						var elem = _n0.a;
						return elem;
					},
					items)));
	});
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$renderGroup = function (_n0) {
	var elem = _n0.a;
	return elem;
};
var rundis$elm_bootstrap$Bootstrap$ButtonGroup$toolbar = F2(
	function (attributes, items) {
		return A2(
			elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$attribute, 'role', 'toolbar'),
						elm$html$Html$Attributes$class('btn-toolbar')
					]),
				attributes),
			A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$ButtonGroup$renderGroup, items));
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$ml1 = elm$html$Html$Attributes$class('ml-1');
var author$project$Main$pageView = F3(
	function (ui, session, page) {
		if (session.$ === 'Nothing') {
			switch (page.$) {
				case 'LoginPage':
					var loginPageState = page.a;
					return A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('bg-primary'),
								A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[author$project$Main$container]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('row justify-content-center')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														elm$html$Html$Attributes$class('col-md-10')
													]),
												_List_fromArray(
													[
														A2(
														elm$html$Html$div,
														_List_fromArray(
															[
																elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
															]),
														_List_fromArray(
															[
																A2(
																elm$html$Html$div,
																_List_fromArray(
																	[
																		elm$html$Html$Attributes$class('card-body p-0')
																	]),
																_List_fromArray(
																	[
																		A2(
																		elm$html$Html$div,
																		_List_fromArray(
																			[
																				elm$html$Html$Attributes$class('row')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				elm$html$Html$div,
																				_List_fromArray(
																					[
																						A2(elm$html$Html$Attributes$style, 'min-height', '600px'),
																						A2(elm$html$Html$Attributes$style, 'background-image', 'url(/img/bg-register.jpg)'),
																						elm$html$Html$Attributes$class('col-lg-6 d-none d-lg-block bg-register-image')
																					]),
																				_List_Nil),
																				A2(
																				elm$html$Html$div,
																				_List_fromArray(
																					[
																						elm$html$Html$Attributes$class('col-lg-6')
																					]),
																				_List_fromArray(
																					[
																						A2(
																						elm$html$Html$div,
																						_List_fromArray(
																							[
																								elm$html$Html$Attributes$class('p-5')
																							]),
																						_List_fromArray(
																							[
																								A2(
																								author$project$Main$loginPageView,
																								loginPageState,
																								A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$LoginPageMsg))
																							]))
																					]))
																			]))
																	]))
															]))
													]))
											]))
									]))
							]));
				case 'RegisterPage':
					var registerPageState = page.a;
					return A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('bg-success'),
								A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[author$project$Main$container]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('row justify-content-center')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														elm$html$Html$Attributes$class('col-lg-8 col-xl-6')
													]),
												_List_fromArray(
													[
														A2(
														elm$html$Html$div,
														_List_fromArray(
															[
																elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
															]),
														_List_fromArray(
															[
																A2(
																elm$html$Html$div,
																_List_fromArray(
																	[
																		elm$html$Html$Attributes$class('card-body p-0')
																	]),
																_List_fromArray(
																	[
																		A2(
																		elm$html$Html$div,
																		_List_fromArray(
																			[
																				elm$html$Html$Attributes$class('row')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				elm$html$Html$div,
																				_List_fromArray(
																					[
																						elm$html$Html$Attributes$class('col-lg-12')
																					]),
																				_List_fromArray(
																					[
																						A2(
																						elm$html$Html$div,
																						_List_fromArray(
																							[
																								elm$html$Html$Attributes$class('p-5')
																							]),
																						_List_fromArray(
																							[
																								A2(
																								author$project$Main$registerPageView,
																								registerPageState,
																								A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$RegisterPageMsg))
																							]))
																					]))
																			]))
																	]))
															]))
													]))
											]))
									]))
							]));
				case 'ResetPasswordPage':
					var resetPasswordPageState = page.a;
					return A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('bg-success'),
								A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[author$project$Main$container]),
								_List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('row justify-content-center')
											]),
										_List_fromArray(
											[
												A2(
												elm$html$Html$div,
												_List_fromArray(
													[
														elm$html$Html$Attributes$class('col-lg-6 col-xl-5')
													]),
												_List_fromArray(
													[
														A2(
														elm$html$Html$div,
														_List_fromArray(
															[
																elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
															]),
														_List_fromArray(
															[
																A2(
																elm$html$Html$div,
																_List_fromArray(
																	[
																		elm$html$Html$Attributes$class('card-body p-0')
																	]),
																_List_fromArray(
																	[
																		A2(
																		elm$html$Html$div,
																		_List_fromArray(
																			[
																				elm$html$Html$Attributes$class('row')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				elm$html$Html$div,
																				_List_fromArray(
																					[
																						elm$html$Html$Attributes$class('col-lg-12')
																					]),
																				_List_fromArray(
																					[
																						A2(
																						elm$html$Html$div,
																						_List_fromArray(
																							[
																								elm$html$Html$Attributes$class('p-5')
																							]),
																						_List_fromArray(
																							[
																								A2(
																								author$project$Main$resetPasswordPageView,
																								resetPasswordPageState,
																								A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ResetPasswordPageMsg))
																							]))
																					]))
																			]))
																	]))
															]))
													]))
											]))
									]))
							]));
				default:
					return elm$html$Html$text('');
			}
		} else {
			var session_ = session.a;
			var _n2 = session_.project;
			if (_n2.$ === 'Nothing') {
				switch (page.$) {
					case 'NewProjectPage':
						var project = page.a.project;
						var form = page.a.form;
						var sent = page.a.sent;
						return A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('bg-success'),
									A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[author$project$Main$container]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('row justify-content-center')
												]),
											_List_fromArray(
												[
													A2(
													elm$html$Html$div,
													_List_fromArray(
														[
															elm$html$Html$Attributes$class('col-lg-6 col-xl-5')
														]),
													_List_fromArray(
														[
															A2(
															elm$html$Html$div,
															_List_fromArray(
																[
																	elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
																]),
															_List_fromArray(
																[
																	A2(
																	elm$html$Html$div,
																	_List_fromArray(
																		[
																			elm$html$Html$Attributes$class('card-body p-0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			elm$html$Html$div,
																			_List_fromArray(
																				[
																					elm$html$Html$Attributes$class('row')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					elm$html$Html$div,
																					_List_fromArray(
																						[
																							elm$html$Html$Attributes$class('col-lg-12')
																						]),
																					_List_fromArray(
																						[
																							A2(
																							elm$html$Html$div,
																							_List_fromArray(
																								[
																									elm$html$Html$Attributes$class('p-5')
																								]),
																							_List_fromArray(
																								[
																									A2(
																									elm$html$Html$div,
																									_List_fromArray(
																										[
																											elm$html$Html$Attributes$class('text-center')
																										]),
																									_List_fromArray(
																										[
																											A2(
																											elm$html$Html$i,
																											_List_fromArray(
																												[
																													A2(elm$html$Html$Attributes$style, 'font-size', '64px'),
																													elm$html$Html$Attributes$class('fas fa-rocket mb-3')
																												]),
																											_List_Nil),
																											A2(
																											elm$html$Html$h2,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$class('text-gray-900 mb-4')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('New project')
																												]))
																										])),
																									author$project$Main$newProjectPageError(project.resource),
																									A3(
																									author$project$Main$newProjectFormView,
																									form,
																									sent,
																									A2(
																										elm$core$Basics$composeL,
																										A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$NewProjectPageMsg),
																										author$project$Main$NewProjectFormMsg)),
																									A2(
																									rundis$elm_bootstrap$Bootstrap$ButtonGroup$toolbar,
																									_List_Nil,
																									_List_fromArray(
																										[
																											A2(
																											rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
																											_List_fromArray(
																												[
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(_List_Nil)
																												]),
																											_List_fromArray(
																												[
																													A2(
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
																													_List_fromArray(
																														[
																															rundis$elm_bootstrap$Bootstrap$Button$primary,
																															rundis$elm_bootstrap$Bootstrap$Button$onClick(
																															author$project$Main$PageMsg(
																																author$project$Main$NewProjectPageMsg(
																																	author$project$Main$NewProjectFormMsg(etaque$elm_form$Form$Submit)))),
																															rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																														]),
																													_List_fromArray(
																														[
																															elm$html$Html$text(
																															sent ? 'Please wait' : 'Save')
																														]))
																												])),
																											A2(
																											rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
																											_List_fromArray(
																												[
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(
																													_List_fromArray(
																														[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$ml1]))
																												]),
																											_List_fromArray(
																												[
																													A2(
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
																													_List_fromArray(
																														[
																															rundis$elm_bootstrap$Bootstrap$Button$secondary,
																															rundis$elm_bootstrap$Bootstrap$Button$onClick(
																															author$project$Main$PageMsg(
																																author$project$Main$NewProjectPageMsg(author$project$Main$NewProjectPageFormCancel))),
																															rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																														]),
																													_List_fromArray(
																														[
																															elm$html$Html$text('Cancel')
																														]))
																												]))
																										]))
																								]))
																						]))
																				]))
																		]))
																]))
														]))
												]))
										]))
								]));
					case 'SelectProjectPage':
						var selectProjectPageState = page.a;
						return A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('bg-success'),
									A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[author$project$Main$container]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('row justify-content-center')
												]),
											_List_fromArray(
												[
													A2(
													elm$html$Html$div,
													_List_fromArray(
														[
															elm$html$Html$Attributes$class('col-lg-8')
														]),
													_List_fromArray(
														[
															A2(
															elm$html$Html$div,
															_List_fromArray(
																[
																	elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
																]),
															_List_fromArray(
																[
																	A2(
																	elm$html$Html$div,
																	_List_fromArray(
																		[
																			elm$html$Html$Attributes$class('card-body p-0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			elm$html$Html$div,
																			_List_fromArray(
																				[
																					elm$html$Html$Attributes$class('row')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					elm$html$Html$div,
																					_List_fromArray(
																						[
																							elm$html$Html$Attributes$class('col-lg-12')
																						]),
																					_List_fromArray(
																						[
																							A2(
																							elm$html$Html$div,
																							_List_fromArray(
																								[
																									elm$html$Html$Attributes$class('p-5')
																								]),
																							_List_fromArray(
																								[
																									A2(
																									elm$html$Html$div,
																									_List_fromArray(
																										[
																											elm$html$Html$Attributes$class('text-center')
																										]),
																									_List_fromArray(
																										[
																											A2(
																											elm$html$Html$i,
																											_List_fromArray(
																												[
																													A2(elm$html$Html$Attributes$style, 'font-size', '64px'),
																													elm$html$Html$Attributes$class('fas fa-comments'),
																													elm$html$Html$Attributes$class('mb-3')
																												]),
																											_List_Nil),
																											A2(
																											elm$html$Html$h2,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$class('text-gray-900'),
																													elm$html$Html$Attributes$class('mb-4')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('Choose your project')
																												]))
																										])),
																									A2(
																									author$project$Main$selectProjectPageView,
																									selectProjectPageState,
																									A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$SelectProjectPageMsg)),
																									A2(
																									rundis$elm_bootstrap$Bootstrap$Button$linkButton,
																									_List_fromArray(
																										[
																											rundis$elm_bootstrap$Bootstrap$Button$small,
																											rundis$elm_bootstrap$Bootstrap$Button$block,
																											rundis$elm_bootstrap$Bootstrap$Button$primary,
																											rundis$elm_bootstrap$Bootstrap$Button$attrs(
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$href('/projects/new')
																												]))
																										]),
																									_List_fromArray(
																										[
																											elm$html$Html$text('Create a new project')
																										])),
																									A2(elm$html$Html$hr, _List_Nil, _List_Nil),
																									A2(
																									elm$html$Html$div,
																									_List_fromArray(
																										[
																											elm$html$Html$Attributes$class('text-center')
																										]),
																									_List_fromArray(
																										[
																											A2(
																											elm$html$Html$a,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$href('/profile')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('Profile')
																												])),
																											A2(
																											elm$html$Html$span,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$class('mx-2')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('|')
																												])),
																											A2(
																											elm$html$Html$a,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$href('/logout')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('Log out')
																												]))
																										]))
																								]))
																						]))
																				]))
																		]))
																]))
														]))
												]))
										]))
								]));
					case 'ProfilePage':
						var user = page.a.user;
						var form = page.a.form;
						var sent = page.a.sent;
						return A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('bg-success'),
									A2(elm$html$Html$Attributes$style, 'min-height', '100vh')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[author$project$Main$container]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('row justify-content-center')
												]),
											_List_fromArray(
												[
													A2(
													elm$html$Html$div,
													_List_fromArray(
														[
															elm$html$Html$Attributes$class('col-lg-6 col-xl-5')
														]),
													_List_fromArray(
														[
															A2(
															elm$html$Html$div,
															_List_fromArray(
																[
																	elm$html$Html$Attributes$class('card o-hidden border-0 shadow-sm my-5')
																]),
															_List_fromArray(
																[
																	A2(
																	elm$html$Html$div,
																	_List_fromArray(
																		[
																			elm$html$Html$Attributes$class('card-body p-0')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			elm$html$Html$div,
																			_List_fromArray(
																				[
																					elm$html$Html$Attributes$class('row')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					elm$html$Html$div,
																					_List_fromArray(
																						[
																							elm$html$Html$Attributes$class('col-lg-12')
																						]),
																					_List_fromArray(
																						[
																							A2(
																							elm$html$Html$div,
																							_List_fromArray(
																								[
																									elm$html$Html$Attributes$class('p-5')
																								]),
																							_List_fromArray(
																								[
																									A2(
																									elm$html$Html$div,
																									_List_fromArray(
																										[
																											elm$html$Html$Attributes$class('text-center')
																										]),
																									_List_fromArray(
																										[
																											A2(
																											elm$html$Html$i,
																											_List_fromArray(
																												[
																													A2(elm$html$Html$Attributes$style, 'font-size', '64px'),
																													elm$html$Html$Attributes$class('fas fa-user'),
																													elm$html$Html$Attributes$class('mb-3')
																												]),
																											_List_Nil),
																											A2(
																											elm$html$Html$h2,
																											_List_fromArray(
																												[
																													elm$html$Html$Attributes$class('text-gray-900'),
																													elm$html$Html$Attributes$class('mb-4')
																												]),
																											_List_fromArray(
																												[
																													elm$html$Html$text('User profile')
																												]))
																										])),
																									author$project$Main$profilePageError(user.resource),
																									A3(
																									author$project$Main$profileFormView,
																									form,
																									sent,
																									A2(
																										elm$core$Basics$composeL,
																										A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProfilePageMsg),
																										author$project$Main$ProfileFormMsg)),
																									A2(
																									rundis$elm_bootstrap$Bootstrap$ButtonGroup$toolbar,
																									_List_Nil,
																									_List_fromArray(
																										[
																											A2(
																											rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
																											_List_fromArray(
																												[
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(_List_Nil)
																												]),
																											_List_fromArray(
																												[
																													A2(
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
																													_List_fromArray(
																														[
																															rundis$elm_bootstrap$Bootstrap$Button$primary,
																															rundis$elm_bootstrap$Bootstrap$Button$onClick(
																															author$project$Main$PageMsg(
																																author$project$Main$ProfilePageMsg(
																																	author$project$Main$ProfileFormMsg(etaque$elm_form$Form$Submit)))),
																															rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																														]),
																													_List_fromArray(
																														[
																															elm$html$Html$text(
																															sent ? 'Please wait' : 'Save')
																														]))
																												])),
																											A2(
																											rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
																											_List_fromArray(
																												[
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(
																													_List_fromArray(
																														[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$ml1]))
																												]),
																											_List_fromArray(
																												[
																													A2(
																													rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
																													_List_fromArray(
																														[
																															rundis$elm_bootstrap$Bootstrap$Button$secondary,
																															rundis$elm_bootstrap$Bootstrap$Button$onClick(
																															author$project$Main$PageMsg(
																																author$project$Main$ProfilePageMsg(author$project$Main$ProfilePageFormCancel))),
																															rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																														]),
																													_List_fromArray(
																														[
																															elm$html$Html$text('Cancel')
																														]))
																												]))
																										]))
																								]))
																						]))
																				]))
																		]))
																]))
														]))
												]))
										]))
								]));
					default:
						return elm$html$Html$text('');
				}
			} else {
				var project_ = _n2.a;
				return A3(
					author$project$Main$projectLayout,
					session_.user,
					ui,
					function () {
						switch (page.$) {
							case 'ProjectHomePage':
								var projectHomePageState = page.a;
								return A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'max-width', '640px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$h2,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('text-gray-900'),
													elm$html$Html$Attributes$class('mb-4')
												]),
											_List_fromArray(
												[
													elm$html$Html$text(project_.name)
												])),
											A2(
											author$project$Main$projectHomePageView,
											projectHomePageState,
											A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProjectHomePageMsg))
										]));
							case 'ProjectSettingsPage':
								var projectSettingsPageState = page.a;
								return A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'max-width', '640px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$h2,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('text-gray-900'),
													elm$html$Html$Attributes$class('mb-4')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Settings')
												]))
										]));
							case 'NewProjectPage':
								var project = page.a.project;
								var form = page.a.form;
								var sent = page.a.sent;
								return A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'max-width', '640px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$h2,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('text-gray-900'),
													elm$html$Html$Attributes$class('mb-4')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('New project')
												])),
											author$project$Main$newProjectPageError(project.resource),
											A3(
											author$project$Main$newProjectFormView,
											form,
											sent,
											A2(
												elm$core$Basics$composeL,
												A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$NewProjectPageMsg),
												author$project$Main$NewProjectFormMsg)),
											A2(
											rundis$elm_bootstrap$Bootstrap$ButtonGroup$toolbar,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
													_List_fromArray(
														[
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(_List_Nil)
														]),
													_List_fromArray(
														[
															A2(
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
															_List_fromArray(
																[
																	rundis$elm_bootstrap$Bootstrap$Button$primary,
																	rundis$elm_bootstrap$Bootstrap$Button$onClick(
																	author$project$Main$PageMsg(
																		author$project$Main$NewProjectPageMsg(
																			author$project$Main$NewProjectFormMsg(etaque$elm_form$Form$Submit)))),
																	rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(
																	sent ? 'Please wait' : 'Save')
																]))
														])),
													A2(
													rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
													_List_fromArray(
														[
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(
															_List_fromArray(
																[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$ml1]))
														]),
													_List_fromArray(
														[
															A2(
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
															_List_fromArray(
																[
																	rundis$elm_bootstrap$Bootstrap$Button$secondary,
																	rundis$elm_bootstrap$Bootstrap$Button$onClick(
																	author$project$Main$PageMsg(
																		author$project$Main$NewProjectPageMsg(author$project$Main$NewProjectPageFormCancel))),
																	rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																]),
															_List_fromArray(
																[
																	elm$html$Html$text('Cancel')
																]))
														]))
												]))
										]));
							case 'SelectProjectPage':
								var selectProjectPageState = page.a;
								return A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'max-width', '800px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$h2,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('text-gray-900'),
													elm$html$Html$Attributes$class('mb-4')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('Select a project')
												])),
											A2(
											author$project$Main$selectProjectPageView,
											selectProjectPageState,
											A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$SelectProjectPageMsg))
										]));
							case 'ProfilePage':
								var user = page.a.user;
								var form = page.a.form;
								var sent = page.a.sent;
								return A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											A2(elm$html$Html$Attributes$style, 'max-width', '640px')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$h2,
											_List_fromArray(
												[
													elm$html$Html$Attributes$class('text-gray-900'),
													elm$html$Html$Attributes$class('mb-4')
												]),
											_List_fromArray(
												[
													elm$html$Html$text('User profile')
												])),
											author$project$Main$profilePageError(user.resource),
											A3(
											author$project$Main$profileFormView,
											form,
											sent,
											A2(
												elm$core$Basics$composeL,
												A2(elm$core$Basics$composeL, author$project$Main$PageMsg, author$project$Main$ProfilePageMsg),
												author$project$Main$ProfileFormMsg)),
											A2(
											rundis$elm_bootstrap$Bootstrap$ButtonGroup$toolbar,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
													_List_fromArray(
														[
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(_List_Nil)
														]),
													_List_fromArray(
														[
															A2(
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
															_List_fromArray(
																[
																	rundis$elm_bootstrap$Bootstrap$Button$primary,
																	rundis$elm_bootstrap$Bootstrap$Button$onClick(
																	author$project$Main$PageMsg(
																		author$project$Main$ProfilePageMsg(
																			author$project$Main$ProfileFormMsg(etaque$elm_form$Form$Submit)))),
																	rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																]),
															_List_fromArray(
																[
																	elm$html$Html$text(
																	sent ? 'Please wait' : 'Save')
																]))
														])),
													A2(
													rundis$elm_bootstrap$Bootstrap$ButtonGroup$buttonGroupItem,
													_List_fromArray(
														[
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$attrs(
															_List_fromArray(
																[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$ml1]))
														]),
													_List_fromArray(
														[
															A2(
															rundis$elm_bootstrap$Bootstrap$ButtonGroup$button,
															_List_fromArray(
																[
																	rundis$elm_bootstrap$Bootstrap$Button$secondary,
																	rundis$elm_bootstrap$Bootstrap$Button$onClick(
																	author$project$Main$PageMsg(
																		author$project$Main$ProfilePageMsg(author$project$Main$ProfilePageFormCancel))),
																	rundis$elm_bootstrap$Bootstrap$Button$disabled(sent)
																]),
															_List_fromArray(
																[
																	elm$html$Html$text('Cancel')
																]))
														]))
												]))
										]));
							default:
								return elm$html$Html$text('');
						}
					}());
			}
		}
	});
var author$project$Main$view = function (state) {
	var ui = state.ui;
	var session = state.session;
	var page = state.page;
	return {
		body: _List_fromArray(
			[
				A3(author$project$Main$pageView, ui, session, page)
			]),
		title: ''
	};
};
var author$project$Update$Deep$applicationInit = F4(
	function (f, a, b, c) {
		var _n0 = A3(f, a, b, c);
		var model = _n0.a;
		var cmd = _n0.b;
		return _Utils_Tuple2(model, cmd);
	});
var author$project$Update$Deep$runUpdate = F3(
	function (f, a, b) {
		var _n0 = A2(f, a, b);
		var model = _n0.a;
		var cmd = _n0.b;
		return _Utils_Tuple2(model, cmd);
	});
var elm$browser$Browser$application = _Browser_application;
var author$project$Update$Deep$Browser$application = function (config) {
	return elm$browser$Browser$application(
		{
			init: author$project$Update$Deep$applicationInit(config.init),
			onUrlChange: config.onUrlChange,
			onUrlRequest: config.onUrlRequest,
			subscriptions: config.subscriptions,
			update: author$project$Update$Deep$runUpdate(config.update),
			view: config.view
		});
};
var author$project$Main$main = author$project$Update$Deep$Browser$application(
	{
		init: author$project$Main$init,
		onUrlChange: A2(elm$core$Basics$composeL, author$project$Main$RouterMsg, author$project$Main$UrlChange),
		onUrlRequest: A2(elm$core$Basics$composeL, author$project$Main$RouterMsg, author$project$Main$UrlRequest),
		subscriptions: author$project$Main$subscriptions,
		update: author$project$Main$update,
		view: author$project$Main$view
	});
_Platform_export({'Main':{'init':author$project$Main$main(
	A2(
		elm$json$Json$Decode$andThen,
		function (session) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (api) {
					return elm$json$Json$Decode$succeed(
						{api: api, session: session});
				},
				A2(elm$json$Json$Decode$field, 'api', elm$json$Json$Decode$string));
		},
		A2(elm$json$Json$Decode$field, 'session', elm$json$Json$Decode$string)))(0)}});}(this));