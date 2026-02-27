"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type SavedSearch = {
    id: string;
    name: string;
    search: string;
    industry: string;
};

export default function SavedSearchPage() {
    const router = useRouter();
    const [saved, setSaved] = useState<SavedSearch[]>([]);

    useEffect(() => {
        const stored = JSON.parse(
            localStorage.getItem("vc_saved_searches") || "[]"
        );
        setSaved(stored);
    }, []);

    function runSearch(item: SavedSearch) {
        const params = new URLSearchParams({
            search: item.search,
            industry: item.industry,
        });

        router.push(`/companies?${params.toString()}`);
    }

    function removeSearch(id: string) {
        const updated = saved.filter((s) => s.id !== id);
        setSaved(updated);

        localStorage.setItem(
            "vc_saved_searches",
            JSON.stringify(updated)
        );
    }

    return (
        <div className="max-w-6xl mx-auto">

            <Card>
                <CardHeader>
                    <CardTitle>Saved Searches</CardTitle>
                </CardHeader>

                <CardContent>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Search</TableHead>
                                <TableHead>Industry</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {saved.map((item) => (
                                <TableRow key={item.id}>

                                    <TableCell>{item.name}</TableCell>

                                    <TableCell>{item.search}</TableCell>

                                    <TableCell>{item.industry}</TableCell>

                                    <TableCell className="flex gap-2">

                                        <Button
                                            size="sm"
                                            onClick={() => runSearch(item)}
                                        >
                                            Run
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeSearch(item.id)}
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