function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

function identity(v) {
  return v;
}

function constant(v) {
  return function value() {
    return v;
  };
}

function spreadArgs(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}

function gatherArgs(fn) {
  return function gatheredFn(...argsArr) {
    return fn(argsArr);
  };
}

function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  };
}

function partialRight(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...laterArgs, ...presetArgs);
  };
}

function curry(fn, arity = fn.length) {
  return (
    function nextCurried(prevArgs) {
      return function curried(nextArg) {
        let result;

        var args = [...prevArgs, nextArg];

        if (args.length >= arity) {
          result = fn(...args);
        }
        else {
          result = nextCurried(args);
        }

        return result;
      };
    }
  )([]);
}

function looseCurry(fn, arity = fn.length) {
  return (
    function nextCurried(prevArgs) {
      return function curried(...nextArgs) {
        let result;

        var args = [...prevArgs, ...nextArgs];

        if (args.length >= arity) {
          result = fn(...args);
        }
        else {
          result = nextCurried(args);
        }

        return result;
      };
    }
  )([]);
}

function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;

    for (let arg of args) {
      ret = ret(arg);
    }

    return ret;
  };
}

function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
  };
}

function curryProps(fn, arity = 1) {
  return (
    function nextCurried(prevArgsObj) {
      return function curried(nextArgObj = {}) {
        let result;

        var [key] = Object.keys(nextArgObj);
        var allArgsObj = Object.assign(
          {},
          prevArgsObj,
          { [key]: nextArgObj[key] }
        );

        if (Object.keys(allArgsObj).length >= arity) {
          result = fn(allArgsObj);
        }
        else {
          result = nextCurried(allArgsObj);
        }

        return result;
      }
    };
  )([]);
}

function spreadArgProps(
  fn,
  propOrder = fn
  .toString()
  .replace(/^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)\s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, '$1$2$3')
  .split(/\s*,\s*/)
  .map(v => v.replace(/[=\s].*$/, ''))
) {
  return function spreadFn(argsObj) {
    return fn(...propOrder.map(k => argsObj[k]));
  };
}

function not(predicate) {
  return function negated(...args) {
    return !predicate(...args);
  };
}

function when(predicate, fn) {
  return function conditional(...args) {
    if (predicate(...args)) {
      return fn(...args);
    }
  };
}

function compose2(fn2, fn1) {
  return function composed(origValue) {
    return fn2(fn1(origValue));
  };
}

function compose(...fns) {
  return function composed(result) {
    // copy the array of functions
    var list = [...fns];

    while (list.length > 0) {
      // take the last function off the end of the list and execute it
      result = list.pop()(result);
    }

    return result;
  };
}

function compose_(...fns) {
  return function composed(result) {
    return [...fns]
      .reverse()
      .reduce(function reducer(result, fn) {
        return fn(result);
      }, result);
  };
}

function compose__(...fns) {
  return fns
    .reverse()
    .reduce(function reducer(fn1, fn2) {
      return function composed(...args) {
        return fn2(fn1(...args));
      };
    });
}

function compose___(...fns) {
  let result;

  // pull off the last two arguments
  var [fn1, fn2, ...rest] = fns.reverse();

  var composedFn = function composed(...args) {
    return fn2(fn1(...args));
  };

  if (rest.length == 0) {
    result = composedFn;
  } else {
    result = compose(...rest.reverse(), composedFn);
  }

  return result;
}

function pipe(...fns) {
  return function piped(result) {
    var list = [...fns];

    while (list.length > 0) {
      // take the first function from the list and execute it
      result = list.shift()(result);
    }

    return result;
  };
}

// var pipe = reverseArgs(compose);

function conditionallyStoreData(store, location, value, checkFn) {
  if (checkFn(value, store, location)) {
    store[location] = value;
  }
}

function notEmpty(val) { return val != ''; }

function isUndefined(val) { return val === undefined; }

function isPropUndefined(val, obj, prop) {
  return isUndefined(obj[prop]);
}

function prop(name, obj) {
  return obj[name];
}

function setProp(name, obj, val) {
  var o = Object.assign({}, obj);

  o[name] = val;

  return o;
}

function makeObjProp(name, value) {
  return setProp(name, {}, value);
}

var getPerson = partial(ajax, 'http://some.api/person');
var getLastOrder = partial(ajax, 'http://some.api/order', { id: -1 });
var extractName = partial(prop, 'name');
var outputPersonName = compose(output, extractName);
var processPerson = partialRight(getPerson, outputPersonName);
var personData = partial(makeObjProp, 'id');
var extractPersonId = partial(prop, 'personId');
var lookupPerson = compose(processPerson, personData, extractPersonId);
// getLastOrder(lookupPerson);
