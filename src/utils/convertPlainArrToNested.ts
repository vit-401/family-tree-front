export const convertPlainArrToNested = (arr: any[], idField: "_id", parentField: "parentId", rootParent: string | number | null) => {
    const tree: any = {[rootParent as any]: {children: []}};

    arr.forEach(n => tree[n[idField]] = {...n, children: []});
    
    arr.forEach(n => {
        if (tree[n[parentField]]) {
            tree[n[parentField]].children.push(tree[n[idField]]);
        }
    });

    return tree[rootParent as any].children;
}
