export const convertPlainArrToNested = (arr: any[], idField: "_id", parentField: "parentId", rootParent: number | null) => {
    // @ts-ignore
    const tree = {[rootParent]: {children: []}};

    // @ts-ignore
    arr.forEach(n => tree[n[idField]] = {...n, children: []});
    // @ts-ignore
    arr.forEach(n => tree[n[parentField]].children.push(tree[n[idField]]));

    // @ts-ignore
    return tree[rootParent].children;
}