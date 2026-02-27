"use client";

import React, { useState, useEffect } from "react";
import { companies } from "../../../data/companies";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CompanyProfile({
    params,
}: {
    params: { id: string } | Promise<{ id: string }>;
}) {
    // `params` is asynchronous in client components; unwrap with React.use.
    const { id } = React.use<{ id: string }>(params as any);
    const company = companies.find((c) => c.id === id);
    if (!company) return null;
    // state needed for notes and saved flag
    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(false);
    // create a non-nullable alias so TypeScript can infer correctly in
    // closures (Effect callback, handlers, etc.)
    const c = company;
    const [lists, setLists] = useState<any[]>([]);

    useEffect(() => {
        // use `c` instead of `company` to satisfy the compiler
        const storedLists = JSON.parse(
            localStorage.getItem("vc_lists") || "[]"
        );
        setLists(storedLists);
        const storedNote = localStorage.getItem(`note-${c.id}`);
        if (storedNote) setNote(storedNote);

        const savedCompanies: string[] = JSON.parse(
            localStorage.getItem("savedCompanies") || "[]"
        );

        setSaved(savedCompanies.includes(c.id));
    }, [c]);

    function saveNote() {
        // alias `c` avoids undefined checks
        localStorage.setItem(`note-${c.id}`, note);
    }

    function toggleSave() {
        const stored: string[] = JSON.parse(
            localStorage.getItem("savedCompanies") || "[]"
        );

        let updated: string[];

        if (stored.includes(c.id)) {
            updated = stored.filter((id) => id !== c.id);
            setSaved(false);
        } else {
            updated = [...stored, c.id];
            setSaved(true);
        }

        localStorage.setItem("savedCompanies", JSON.stringify(updated));
    }
    function addToList(listId: string) {
        const updated = lists.map((list) => {
            if (list.id === listId) {
                if (!list.companyIds.includes(c.id)) {
                    list.companyIds.push(c.id);
                }
            }
            return list;
        });

        localStorage.setItem("vc_lists", JSON.stringify(updated));
        setLists(updated);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <Badge variant="secondary">{c.industry}</Badge>

                    <p>{c.location}</p>

                    {lists.map((list) => (
                        <Button
                            key={list.id}
                            // match the default button color used by Save Note/Company
                            variant="default"
                            size="sm"
                            title={`Add to ${list.name}`}
                            onClick={() => addToList(list.id)}
                        >
                            Add to {list.name}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <Textarea
                        placeholder="Write notes..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <Button onClick={saveNote}>
                        Save Note
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI Enrichment</CardTitle>
                </CardHeader>

                <CardContent>
                    <Button>
                        Enrich Company
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}