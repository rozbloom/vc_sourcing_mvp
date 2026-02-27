"use client";

import React, { useState, useEffect } from "react";
import { companies } from "../../../data/companies";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import SignalsTimeline from "../../../components/signals-timeline";
import CompanyNotes from "../../../components/company-notes";
import { getLists, createNewList, addCompanyToList } from "../../../lib/lists";

export default function CompanyProfile({
    params,
}: {
    params: { id: string } | Promise<{ id: string }>;
}) {
    const { id } = React.use<{ id: string }>(params as any);
    const company = companies.find((c) => c.id === id);
    if (!company) return <div className="p-8 text-center">Company not found</div>;

    const [enriched, setEnriched] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lists, setLists] = useState<any[]>([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load lists + cached enrichment
        setLists(getLists());

        const savedCompanies: string[] = JSON.parse(
            localStorage.getItem("savedCompanies") || "[]"
        );
        setSaved(savedCompanies.includes(company.id));

        const cached = localStorage.getItem(`enrichment-${company.id}`);
        if (cached) setEnriched(JSON.parse(cached));
    }, [company.id]);

    const runEnrichment = async () => {
        if (!company?.website) return;

        const cached = localStorage.getItem(`enrichment-${company.id}`);
        if (cached) {
            setEnriched(JSON.parse(cached));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: company.website }),
            });

            const data = await res.json();
            localStorage.setItem(`enrichment-${company.id}`, JSON.stringify(data));
            setEnriched(data);
        } catch (err) {
            console.error(err);
            alert("Enrichment failed – check console");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToList = () => {
        const listName = prompt("Enter list name:");
        if (!listName?.trim()) return;

        let targetList = lists.find(
            (l) => l.name.toLowerCase() === listName.toLowerCase()
        );
        if (!targetList) {
            targetList = createNewList(listName);
            setLists(getLists()); // refresh
        }

        addCompanyToList(targetList.id, company.id);
        alert(`✅ Saved to "${targetList.name}"`);
    };

    const toggleSave = () => {
        const stored: string[] = JSON.parse(
            localStorage.getItem("savedCompanies") || "[]"
        );
        let updated: string[];

        if (stored.includes(company.id)) {
            updated = stored.filter((cid) => cid !== company.id);
            setSaved(false);
        } else {
            updated = [...stored, company.id];
            setSaved(true);
        }
        localStorage.setItem("savedCompanies", JSON.stringify(updated));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
                    <p className="text-xl text-gray-600 mt-1">
                        {company.location} • {company.industry}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={toggleSave} variant={saved ? "secondary" : "default"}>
                        {saved ? "✓ Saved" : "Save Company"}
                    </Button>
                    <Button
                        onClick={handleSaveToList}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Save to List
                    </Button>
                </div>
            </div>

            {/* Signals Timeline – always visible */}
            <SignalsTimeline
                signals={enriched?.signals || []}
                companyName={company.name}
            />

            {/* Live Enrichment */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Live Enrichment
                        <Button onClick={runEnrichment} disabled={loading}>
                            {loading ? "Enriching from multiple pages..." : "Run Live Enrichment"}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {enriched ? (
                        <>
                            {/* Summary */}
                            <div>
                                <h3 className="font-semibold mb-2">Summary</h3>
                                <p className="text-lg leading-relaxed">{enriched.summary}</p>
                            </div>

                            {/* What They Do */}
                            <div>
                                <h3 className="font-semibold mb-3">What they do</h3>
                                <ul className="list-disc pl-6 space-y-2 text-[15px]">
                                    {enriched.whatTheyDo?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    )) || <p className="text-gray-500">No data yet</p>}
                                </ul>
                            </div>

                            {/* Keywords */}
                            <div>
                                <h3 className="font-semibold mb-2">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {enriched.keywords?.map((kw: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-sm">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-gray-500 italic">
                                Run live enrichment to get AI-powered summary, what-they-do bullets,
                                keywords, and multi-page signals.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes */}
            <CompanyNotes companyId={company.id} />

            {/* Quick add to existing lists */}
            {lists.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Add to Lists</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {lists.map((list) => (
                                <Button
                                    key={list.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        addCompanyToList(list.id, company.id);
                                        alert(`Added to ${list.name}`);
                                    }}
                                >
                                    + {list.name}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
