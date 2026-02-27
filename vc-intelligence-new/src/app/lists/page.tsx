"use client";

import { useEffect, useState } from "react";
import { companies } from "../../data/companies";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type List = {
    id: string;
    name: string;
    companyIds: string[];
};

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [name, setName] = useState("");

    useEffect(() => {
        const stored = JSON.parse(
            localStorage.getItem("vc_lists") || "[]"
        );
        setLists(stored);
    }, []);

    function persist(updated: List[]) {
        setLists(updated);
        localStorage.setItem("vc_lists", JSON.stringify(updated));
    }

    function createList() {
        if (!name.trim()) return;

        const newList: List = {
            id: crypto.randomUUID(),
            name,
            companyIds: [],
        };

        persist([...lists, newList]);
        setName("");
    }

    function removeList(id: string) {
        const updated = lists.filter((l) => l.id !== id);
        persist(updated);
    }

    function exportLists() {
        const blob = new Blob(
            [JSON.stringify(lists, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "lists.json";
        a.click();
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Create List */}
            <Card>
                <CardHeader>
                    <CardTitle>Create List</CardTitle>
                </CardHeader>

                <CardContent className="flex gap-3">

                    <Input
                        placeholder="List name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="max-w-sm"
                    />

                    <Button onClick={createList}>
                        Create
                    </Button>

                    <Button
                        variant="outline"
                        onClick={exportLists}
                    >
                        Export JSON
                    </Button>

                </CardContent>
            </Card>

            {/* Lists Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Lists</CardTitle>
                </CardHeader>

                <CardContent>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Companies</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {lists.map((list) => (
                                <TableRow key={list.id}>
                                    <TableCell className="font-medium">
                                        {list.name}
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
                                            {list.companyIds.length}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeList(list.id)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>

        </div>
    );
}