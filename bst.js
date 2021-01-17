function BinaryTree(value, parent, left, right) {
  return {
    value,
    parent,
    left,
    right,
  };
}

var banana = BinaryTree('banana');
var apple = banana.left = BinaryTree('apple', banana);
var cherry = banana.right = BinaryTree('cherry', banana);
var apricot = apple.right = BinaryTree('apricot', apple);
var avocado = apricot.right = BinaryTree('avocado', apricot);
var cantaloupe = cherry.left = BinaryTree('cantaloupe', cherry);
var cucumber = cherry.right = BinaryTree('cucumber', cherry);
var grape = cucumber.right = BinaryTree('grape', cucumber);

/*
 * forEach
 */
BinaryTree.forEach = function forEach(visitFn, node) {
  if (node) {
    if (node.left) {
      forEach(visitFn, node.left);
    }

    visitFn(node);

    if (node.right) {
      forEach(visitFn, node.right);
    }
  }
};

//BinaryTree.forEach(node => console.log(node.value), banana);

//BinaryTree.forEach(node => console.log(node.value), cherry);

/*
 * map(..):
 * Transforms values as it projects them to a new BST.
 */
BinaryTree.map = function map(projectionFn, node) {
  if (node) {
    let newNode = projectionFn(node);
    newNode.parent = node.parent;
    newNode.left = node.left ?
      map(projectionFn, node.left) : undefined;
    newNode.right = node.right ?
      map(projectionFn, node.right) : undefined;

    if (newNode.left) {
      newNode.left.parent = newNode;
    }

    if (newNode.right) {
      newNode.right.parent = newNode;
    }

    return newNode;
  }
};

var BANANA = BinaryTree.map(
  node => BinaryTree(node.value.toUpperCase()),
  banana
);

//BinaryTree.forEach(node => console.log(node.value), BANANA);

/*
 * reduce(..):
 * Combines values in a BST to produce some other
 * (usually but not always non-BST) value
 */
BinaryTree.reduce = function reduce(reducerFn, initialValue, node) {
  if (arguments.length < 3) {
    // shift the parameters since `initialValue` was omitted
    node = initialValue;
  }

  if (node) {
    let result;

    if (arguments.length < 3) {
      if (node.left) {
        result = reduce(reducerFn, node.left);
      }
      else {
        return node.right ?
          reduce(reducerFn, node, node.right) : node;
      }
    }
    else {
      result = node.left ?
        reduce(reducerFn, initialValue, node.left) : initialValue;
    }

    result = reducerFn(result, node);
    result = node.right ?
      reduce(reducerFn, result, node.right) : result;

    return result;
  }

  return initialValue;
}

//var shoppingList = BinaryTree.reduce(
//  (result, node) => [...result, node.value],
//  [],
//  banana
//);
//
//console.log('shoppingList:', shoppingList);

/*
 * filter(..):
 * Selects or excludes values as it projects them to a new BST.
 */
BinaryTree.filter = function filter(predicateFn, node) {
  if (node) {
    let newNode;
    let newLeft = node.left ?
      filter(predicateFn, node.left) : undefined;
    let newRight = node.right ?
      filter(predicateFn, node.right) : undefined;

    if (predicateFn(node)) {
      newNode = BinaryTree(
        node.value,
        node.parent,
        newLeft,
        newRight
      );

      if (newLeft) {
        newLeft.parent = newNode;
      }

      if (newRight) {
        newRight.parent = newNode;
      }
    }
    else {
      if (newLeft) {
        if (newRight) {
          newNode = BinaryTree(
            undefined,
            node.parent,
            newLeft,
            newRight
          );

          newLeft.parent = newRight.parent = newNode;

          if (newRight.left) {
            let minRightNode = newRight;

            while (minRightNode.left) {
              minRightNode = minRightNode.left;
            }

            newNode.value = minRightNode.value;

            if (minRightNode.right) {
              minRightNode.parent.left = minRightNode.right;
              minRightNode.right.parent = minRightNode.parent;
            }
            else {
              minRightNode.parent.left = undefined;
            }

            minRightNode.right = minRightNode.parent = undefined;
          }
          else {
            newNode.value = newRight.value;
            newNode.right = newRight.right;

            if (newRight.right) {
              newRight.right.parent = newNode;
            }
          }
        }
        else {
          return newLeft;
        }
      }
      else {
        return newRight;
      }
    }

    return newNode;
  }
};

var vegetables = [
  'asparagus',
  'avocado',
  'brocoli',
  'carrot',
  'celery',
  'corn',
  'cucumber',
  'lettuce',
  'potato',
  'squash',
  'zucchini',
];

var whatToBuy = BinaryTree.filter(
  // filter the produce list only for vegetables
  node => vegetables.indexOf(node.value) != -1,
  banana
);

// shopping list
var shoppingList = BinaryTree.reduce(
  (result, node) => [...result, node.value],
  [],
  whatToBuy
);

console.log('shoppingList:', shoppingList);
