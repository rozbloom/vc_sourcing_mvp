// src/lib/lists.ts
export type List = {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
};

export const getLists = (): List[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("vc_lists");
    return saved ? JSON.parse(saved) : [];
};

export const saveLists = (lists: List[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vc_lists", JSON.stringify(lists));
};

export const createNewList = (name: string): List => {
    const lists = getLists();
    const newList: List = {
        id: Date.now().toString(),
        name: name.trim(),
        companyIds: [],
        createdAt: new Date().toISOString(),
    };
    lists.push(newList);
    saveLists(lists);
    return newList;
};

export const addCompanyToList = (listId: string, companyId: string) => {
    const lists = getLists();
    const list = lists.find((l) => l.id === listId);
    if (list && !list.companyIds.includes(companyId)) {
        list.companyIds.push(companyId);
        saveLists(lists);
    }
    return list;
};