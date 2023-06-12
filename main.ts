// BST Exercise for The Odin Project

interface TreeNode {
    data: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

// TreeNode factory function.
function createTreeNode(data: number, left: TreeNode | null, right: TreeNode | null): TreeNode {
    const node: TreeNode = Object.create({});
    node.data = data;
    node.left = left;
    node.right = right;
    return node;
}

interface Tree {
    root: TreeNode | null;
    insert(elem: number): void;
    delete(elem: number): void;
    find(elem: number): TreeNode | null;
    levelOrder(fn?: (n: number) => any): void | number[],
    inorder(fn?: (n: number) => any): void | number[],
    preorder(fn?: (n: number) => any): void | number[],
    postorder(fn?: (n: number) => any): void | number[],
    height(node: TreeNode): number,
    depth(node: TreeNode): number,
}

const treePrototype = {

    insert(elem: number): void {
        if (this.root === null) {
            this.root = createTreeNode(elem, null, null);
            return;
        }

        let currNode = this.root;
        let prevNode = currNode;
        while (currNode !== null) {
            prevNode = currNode;
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        prevNode[elem < prevNode.data ? "left" : "right"] = createTreeNode(elem, null, null);
    },

    delete(elem: number) {
        let elemNode = this.root;
        let fatherNode: TreeNode | null = null;
        while (elemNode !== null && elemNode.data !== elem) {
            fatherNode = elemNode;
            elemNode = (elem < elemNode.data) ? elemNode.left : elemNode.right;
        }

        if (elemNode === null) throw new Error("Tried to remove element that's not in the tree")

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
        } else { // If deleting the root have to change the pointer in the Tree object instead of the father node.
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
        let succParent = elemNode;
        let succ = elemNode.right;
        while (succ.left !== null) {
            succParent = succ;
            succ = succ.left;
        }

        // Succ has no left children, only have to move the right node
        if (succParent !== elemNode) {
            succParent.left = succ.right;
        } else {
            succParent.right = succ.right;
        }

        // Change elemNode for succ.
        elemNode.data = succ.data;
    },

    find(elem: number): TreeNode | null {
        let currNode = this.root;
        while (currNode !== null && currNode.data !== elem) {
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        return currNode;
    },

    levelOrder(fn?: (n: number) => any): void | number[] {
        const queue: TreeNode[] = [this.root];
        const orderedElems: number[] = [];

        while (queue.length > 0) {
            const node = queue.shift();
            if (node === undefined) throw new Error('Unreachable');

            orderedElems.push(node.data);

            if (node.left !== null) queue.push(node.left);
            if (node.right !== null) queue.push(node.right);
        }

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },

    inorder(fn?: (n: number) => any): void | number[] {
        function nodeInorder(root: TreeNode): number[] {
            const leftInorder = root.left === null ? [] : nodeInorder(root.left);
            const rightInorder = root.right === null ? [] : nodeInorder(root.right);
            return leftInorder.concat([root.data]).concat(rightInorder);
        }

        const orderedElems: number[] = nodeInorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },

    preorder(fn?: (n: number) => any): void | number[] {
        function nodePreorder(root: TreeNode): number[] {
            const leftPreorder = root.left === null ? [] : nodePreorder(root.left);
            const rightPreorder = root.right === null ? [] : nodePreorder(root.right);
            return [root.data].concat(leftPreorder).concat(rightPreorder);
        }

        const orderedElems: number[] = nodePreorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },

    postorder(fn?: (n: number) => any): void | number[] {
        function nodePostorder(root: TreeNode): number[] {
            const leftPostorder = root.left === null ? [] : nodePostorder(root.left);
            const rightPostorder = root.right === null ? [] : nodePostorder(root.right);
            return rightPostorder.concat(leftPostorder).concat([root.data]);
        }

        const orderedElems: number[] = nodePostorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    },

    height(node: TreeNode): number {
        return 0;
    },

    depth(node: TreeNode): number {
        return 0;
    },
}

// Tree factory function.
function createTree(data: number[]): Tree {
    const tree: Tree = Object.create(treePrototype);
    tree.root = buildTree(data);
    return tree;
}

// Builds a bst from an array and returns the root node.
function buildTree(data: number[]): TreeNode | null {
    if (data.length === 0) return null;

    data.sort((a, b) => a - b)

    const middleElem: number = Math.floor(data.length / 2);
    const leftData = data.slice(0, middleElem);
    const rightData = data.slice(middleElem + 1);

    const leftTree = buildTree(leftData);
    const rightTree = buildTree(rightData);

    return createTreeNode(data[middleElem], leftTree, rightTree);
}

function prettyPrintFromTreeNode(node: TreeNode, prefix = "", isLeft = true): void {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrintFromTreeNode(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrintFromTreeNode(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

// Tests

const randNums: number[] = []
for (let i = 0; i < 10; ++i) {
    randNums.push(Math.floor(Math.random() * 100));
}

const tree = createTree(randNums);
if (tree.root !== null) {
    prettyPrintFromTreeNode(tree.root);
    console.log(tree.levelOrder());
    console.log(tree.inorder());
}
