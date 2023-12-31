// BST Exercise for The Odin Project

class TreeNode {
    data: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(data: number, left: TreeNode | null, right: TreeNode | null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

    height(): number {
        // If it's a leaf node
        if (this.left === null && this.right === null) return 0;

        // -1 to indicate that the node does not exist.
        const leftHeight = (this.left !== null) ? this.left.height() : -1;
        const rightHeight = (this.right !== null) ? this.right.height() : -1;

        return ((leftHeight > rightHeight) ? leftHeight : rightHeight) + 1;
    };

    isBalanced(): boolean {
        // A node with no children is balanced.
        if (this.left === null && this.right === null) return true;

        // -1 to indicate that the node does not exist.
        const leftHeight = (this.left !== null) ? this.left.height() : -1;
        const rightHeight = (this.right !== null) ? this.right.height() : -1;

        const leftBalanced = (this.left !== null) ? this.left.isBalanced() : true;
        const rightBalanced = (this.right !== null) ? this.right.isBalanced() : true;

        // The difference between the heights of the subtrees is 0 or 1, and the subtrees are,
        // themselves ordered.
        return (Math.abs(leftHeight - rightHeight) < 2) && leftBalanced && rightBalanced;
    }

    printSubTree(prefix = "", isLeft = true): void {
        if (this.right !== null) {
            this.right.printSubTree(`${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${this.data}`);
        if (this.left !== null) {
            this.left.printSubTree(`${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };
}

class Tree {
    root: TreeNode | null;

    // Tree factory function.
    constructor(data: number[]) {
        // Sort and remove duplicates from data
        const correctData = [...new Set(data.sort((a, b) => a - b))]

        this.root = buildBalancedTree(correctData);
    }

    print(): void {
        if (this.root === null) return;
        this.root.printSubTree();
    }

    insert(elem: number): void {
        if (this.root === null) {
            this.root = new TreeNode(elem, null, null);
            return;
        }

        let currNode: TreeNode | null = this.root;
        let prevNode: TreeNode | null = currNode;
        while (currNode !== null) {
            prevNode = currNode;
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        prevNode[elem < prevNode.data ? "left" : "right"] = new TreeNode(elem, null, null);
    };

    delete(elem: number): void {
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
    };

    find(elem: number): TreeNode | null {
        let currNode = this.root;
        while (currNode !== null && currNode.data !== elem) {
            currNode = (elem < currNode.data) ? currNode.left : currNode.right;
        }
        return currNode;
    };

    levelOrder(fn?: (n: number) => any): void | number[] {
        if (this.root === null && typeof fn === undefined) return [];
        if (this.root === null) return;

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
    };

    inorder(fn?: (n: number) => any): void | number[] {
        function nodeInorder(root: TreeNode): number[] {
            const leftInorder = root.left === null ? [] : nodeInorder(root.left);
            const rightInorder = root.right === null ? [] : nodeInorder(root.right);
            return leftInorder.concat([root.data]).concat(rightInorder);
        }

        if (this.root === null && typeof fn === undefined) return [];
        if (this.root === null) return;

        const orderedElems: number[] = nodeInorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    };

    preorder(fn?: (n: number) => any): void | number[] {
        function nodePreorder(root: TreeNode): number[] {
            const leftPreorder = root.left === null ? [] : nodePreorder(root.left);
            const rightPreorder = root.right === null ? [] : nodePreorder(root.right);
            return [root.data].concat(leftPreorder).concat(rightPreorder);
        }

        if (this.root === null && typeof fn === undefined) return [];
        if (this.root === null) return;

        const orderedElems: number[] = nodePreorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    };

    postorder(fn?: (n: number) => any): void | number[] {
        function nodePostorder(root: TreeNode): number[] {
            const leftPostorder = root.left === null ? [] : nodePostorder(root.left);
            const rightPostorder = root.right === null ? [] : nodePostorder(root.right);
            return rightPostorder.concat(leftPostorder).concat([root.data]);
        }

        if (this.root === null && typeof fn === undefined) return [];
        if (this.root === null) return;

        const orderedElems: number[] = nodePostorder(this.root);

        if (typeof fn === "undefined") {
            return orderedElems;
        }
        orderedElems.forEach(fn);
    };

    depth(target: TreeNode): number {
        let count = 0;
        let currNode = this.root;

        while (currNode !== null) {
            if (currNode.data === target.data) {
                return count;
            }
            currNode = (target.data > currNode.data) ? currNode.right : currNode.left;
            ++count;
        }

        // Not found
        return -1;
    };

    isBalanced(): boolean {
        if (this.root === null) return true;
        return this.root.isBalanced();
    };

    rebalance(): void {
        if (this.root === null) return;

        // Inorder is already sorted, can use that to build a new ordered tree.
        const ordered = this.inorder();
        if (typeof ordered === "undefined") throw new Error("Unreachable");

        this.root = buildBalancedTree(ordered);
    };

}

// Builds a balanced bst from an ordered array and returns the root node.
function buildBalancedTree(data: number[]): TreeNode | null {
    if (data.length === 0) return null;

    const middleElem: number = Math.floor(data.length / 2);
    const leftData = data.slice(0, middleElem);
    const rightData = data.slice(middleElem + 1);

    const leftTree = buildBalancedTree(leftData);
    const rightTree = buildBalancedTree(rightData);

    return new TreeNode(data[middleElem], leftTree, rightTree);
}

// Test script
const randNums: number[] = []
for (let i = 0; i < 100; ++i) {
    randNums.push(Math.floor(Math.random() * 100));
}

const tree = new Tree(randNums);

console.log("Tree is balanced: ", tree.isBalanced());
console.log("PreOrder: ", tree.preorder());
console.log("InOrder: ", tree.inorder());
console.log("PostOrder: ", tree.postorder());
console.log("--------------------");

const addedNums: number[] = [];
for (let i = 0; i < 20; ++i) {
    addedNums.push(Math.floor(Math.random() * 100));
}
addedNums.forEach(n => tree.insert(n));
console.log("Added: ", addedNums);
console.log("Tree is balanced: ", tree.isBalanced());
console.log("Rebalancing tree");
tree.rebalance();
console.log("Tree is balanced: ", tree.isBalanced());
console.log("PreOrder: ", tree.preorder());
console.log("InOrder: ", tree.inorder());
console.log("PostOrder: ", tree.postorder());
