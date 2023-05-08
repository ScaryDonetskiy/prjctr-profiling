class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class BalancedBST {
    constructor() {
        this.root = null;
    }

    // helper function to get the height of a node
    getHeight(node) {
        if (node == null) {
            return 0;
        }
        return node.height;
    }

    // helper function to get the balance factor of a node
    getBalanceFactor(node) {
        if (node == null) {
            return 0;
        }
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    // helper function to perform a right rotation
    rotateRight(node) {
        let leftChild = node.left;
        let rightChildOfLeftChild = leftChild.right;

        leftChild.right = node;
        node.left = rightChildOfLeftChild;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        leftChild.height = 1 + Math.max(this.getHeight(leftChild.left), this.getHeight(leftChild.right));

        return leftChild;
    }

    // helper function to perform a left rotation
    rotateLeft(node) {
        let rightChild = node.right;
        let leftChildOfRightChild = rightChild.left;

        rightChild.left = node;
        node.right = leftChildOfRightChild;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        rightChild.height = 1 + Math.max(this.getHeight(rightChild.left), this.getHeight(rightChild.right));

        return rightChild;
    }

    insert(value) {
        this.root = this.#insert(this.root, value);
    }

    // helper function to insert a value into the tree
    #insert(node, value) {
        if (node == null) {
            return new Node(value);
        }

        if (value < node.value) {
            node.left = this.#insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.#insert(node.right, value);
        } else {
            return node; // no duplicate values allowed
        }

        // update height of the current node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // get the balance factor of the node
        let balanceFactor = this.getBalanceFactor(node);

        // check if the node is unbalanced
        // case 1: left-left
        if (balanceFactor > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }
        // case 2: right-right
        if (balanceFactor < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }
        // case 3: left-right
        if (balanceFactor > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        // case 4: right-left
        if (balanceFactor < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // helper function to find the node with the minimum value in a tree
    findMin(node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    delete(value) {
        this.root = this.#delete(this.root, value);
    }

    // helper function to delete a value from the tree
    #delete(node, value) {
        if (node == null) {
            return null;
        }

        if (value < node.value) {
            node.left = this.#delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.#delete(node.right, value);
        } else {
            // node to be deleted found
            // case 1: node has no children or only one child
            if (node.left == null || node.right == null) {
                let temp = null;
                if (temp == node.left) {
                    temp = node.right;
                } else {
                    temp = node.left;
                }

                if (temp == null) {
                    // node is a leaf node
                    temp = node;
                    node = null;
                } else {
                    // node has one child
                    node = temp;
                }
            } else {
                // case 2: node has two children
                let temp = this.findMin(node.right);
                node.value = temp.value;
                node.right = this.#delete(node.right, temp.value);
            }
        }

        if (node == null) {
            return null;
        }

        // update height of the current node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // get the balance factor of the node
        let balanceFactor = this.getBalanceFactor(node);

        // check if the node is unbalanced
        // case 1: left-left
        if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }
        // case 2: right-right
        if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }
        // case 3: left-right
        if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        // case 4: right-left
        if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // function to find a value in the tree
    find(value) {
        let node = this.root;
        while (node != null) {
            if (value < node.value) {
                node = node.left;
            } else if (value > node.value) {
                node = node.right;
            } else {
                return node;
            }
        }
        return null;
    }
}

function generateRandomData(size) {
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push(Math.floor(Math.random() * 1000));
    }
    return data;
}

function measureComplexity(tree, data) {
    let start, end;

    // measure time for inserting elements
    start = performance.now();
    for (let i = 0; i < data.length; i++) {
        tree.insert(data[i]);
    }
    end = performance.now();
    let insertTime = end - start;

    // measure time for finding elements
    start = performance.now();
    for (let i = 0; i < data.length; i++) {
        tree.find(data[i]);
    }
    end = performance.now();
    let findTime = end - start;

    // measure time for deleting elements
    start = performance.now();
    for (let i = 0; i < data.length; i++) {
        tree.delete(data[i]);
    }
    end = performance.now();
    let deleteTime = end - start;

    return { insertTime, findTime, deleteTime };
}

let dataSizes = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
let dataSets = [];
dataSizes.forEach((value) => {
    dataSets.push(generateRandomData(value));
})

for (let i = 0; i < dataSets.length; i++) {
    let tree = new BalancedBST();
    let complexity = measureComplexity(tree, dataSets[i]);
    console.log(`Dataset ${i+1}:`);
    console.log(`Insert time: ${complexity.insertTime}ms`);
    console.log(`Find time: ${complexity.findTime}ms`);
    console.log(`Delete time: ${complexity.deleteTime}ms`);
}
