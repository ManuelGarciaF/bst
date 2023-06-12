// BST Exercise for The Odin Project
// TreeNode factory function.
function createTreeNode(data, left, right) {
    var node = Object.create({});
    node.data = data;
    node.left = left;
    node.right = right;
    return node;
}
var treePrototype = {
    insert: function (elem) {
        if (this.root === null) {
            this.root = createTreeNode(elem, null, null);
            return;
        }
        var currNode = this.root;
        var prevNode = currNode;
        while (currNode !== null) {
            prevNode = currNode;
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        prevNode[elem < prevNode.data ? "left" : "right"] = createTreeNode(elem, null, null);
    },
    delete: function (elem) {
        var elemNode = this.root;
        var fatherNode = null;
        while (elemNode !== null && elemNode.data !== elem) {
            fatherNode = elemNode;
            elemNode = (elem < elemNode.data) ? elemNode.left : elemNode.right;
        }
        if (elemNode === null)
            throw new Error("Tried to remove element that's not in the tree");
        // If it's not the root node.
        if (fatherNode !== null) {
            // If it's a leaf node
            if (elemNode.left === null && elemNode.right === null) {
                fatherNode[elem < fatherNode.data ? "left" : "right"] = null;
                return;
            }
            // If it has 1 child.
            if (elemNode.left === null || elemNode.right === null) {
                fatherNode[elem < fatherNode.data ? "left" : "right"] = (elemNode.left !== null ? elemNode.left : elemNode.right);
                return;
            }
        }
        else { // If deleting the root have to change the pointer in the Tree object instead of the father node.
            // If it's a leaf node
            if (elemNode.left === null && elemNode.right === null) {
                tree.root = null;
                return;
            }
            // If it has 1 child.
            if (elemNode.left === null || elemNode.right === null) {
                tree.root = (elemNode.left !== null ? elemNode.left : elemNode.right);
                return;
            }
        }
        // If it has two children nodes.
        // Find closest succesor.
        var succParent = elemNode;
        var succ = elemNode.right;
        while (succ.left !== null) {
            succParent = succ;
            succ = succ.left;
        }
        // Succ has no left children, only have to move the right node
        if (succParent !== elemNode) {
            succParent.left = succ.right;
        }
        else {
            succParent.right = succ.right;
        }
        // Change elemNode for succ.
        elemNode.data = succ.data;
    },
    find: function (elem) {
        var currNode = this.root;
        while (currNode !== null && currNode.data !== elem) {
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        return currNode;
    },
    levelOrder: function (fn) {
        var queue = [this.root];
        var orderedElems = [];
        while (queue.length > 0) {
            var node = queue.shift();
            if (node === undefined)
                throw new Error('Unreachable');
            orderedElems.push(node.data);
            if (node.left !== null)
                queue.push(node.left);
            if (node.right !== null)
                queue.push(node.right);
        }
        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },
    inorder: function (fn) {
        function nodeInorder(root) {
            var leftInorder = root.left === null ? [] : nodeInorder(root.left);
            var rightInorder = root.right === null ? [] : nodeInorder(root.right);
            return leftInorder.concat([root.data]).concat(rightInorder);
        }
        var orderedElems = nodeInorder(this.root);
        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },
    preorder: function (fn) {
        var orderedElems = [];
        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },
    postorder: function (fn) {
        var orderedElems = [];
        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },
};
// Tree factory function.
function createTree(data) {
    var tree = Object.create(treePrototype);
    tree.root = buildTree(data);
    return tree;
}
// Builds a bst from an array and returns the root node.
function buildTree(data) {
    if (data.length === 0)
        return null;
    data.sort(function (a, b) { return a - b; });
    var middleElem = Math.floor(data.length / 2);
    var leftData = data.slice(0, middleElem);
    var rightData = data.slice(middleElem + 1);
    var leftTree = buildTree(leftData);
    var rightTree = buildTree(rightData);
    return createTreeNode(data[middleElem], leftTree, rightTree);
}
function prettyPrintFromTreeNode(node, prefix, isLeft) {
    if (prefix === void 0) { prefix = ""; }
    if (isLeft === void 0) { isLeft = true; }
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrintFromTreeNode(node.right, "".concat(prefix).concat(isLeft ? "│   " : "    "), false);
    }
    console.log("".concat(prefix).concat(isLeft ? "└── " : "┌── ").concat(node.data));
    if (node.left !== null) {
        prettyPrintFromTreeNode(node.left, "".concat(prefix).concat(isLeft ? "    " : "│   "), true);
    }
}
;
// Tests
var randNums = [];
for (var i = 0; i < 10; ++i) {
    randNums.push(Math.floor(Math.random() * 100));
}
var tree = createTree(randNums);
if (tree.root !== null) {
    prettyPrintFromTreeNode(tree.root);
    console.log(tree.levelOrder());
    console.log(tree.inorder());
}
