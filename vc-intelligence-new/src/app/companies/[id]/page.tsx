"use client";

import { useState, useEffect } from "react";
import { companies } from "../../../data/companies";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CompanyProfile({
    params,
}: {
    params: { id: string };
}) {
    const company = companies.find((c) => c.id === params.id);

    const [note, setNote] = useState("");
    const [saved, setSaved] = useState(false);

    // early return guarantees `company` is defined for all subsequent logic
    if (!company) return null;
    // create a non-nullable alias so TypeScript can infer correctly in
    // closures (Effect callback, handlers, etc.)
    const c = company;

    useEffect(() => {
        // use `c` instead of `company` to satisfy the compiler
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

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <Badge variant="secondary">{c.industry}</Badge>

                    <p>{c.location}</p>

                    <Button
                        variant={saved ? "secondary" : "default"}
                        onClick={toggleSave}
                    >
                        {saved ? "Saved" : "Save Company"}
                    </Button>
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