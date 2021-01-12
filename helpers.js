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
