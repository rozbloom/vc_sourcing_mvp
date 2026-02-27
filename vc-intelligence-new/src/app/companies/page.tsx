"use client";

import { useState } from "react";
import Link from "next/link";
import { companies as companyData } from "../../data/companies";

// shadcn/ui imports – run these first:
// npx shadcn@latest add card input select table badge button

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"; // optional: npx shadcn@latest add lucide (or just use text)

export default function CompaniesPage() {
    const [search, setSearch] = useState("");
    // we use "all" as a sentinel value instead of an empty string because
    // <Select.Item> disallows empty values.  When the filter is "all" we
    // simply don't apply the corresponding restriction.
    const [industryFilter, setIndustryFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [page, setPage] = useState(1);
    const perPage = 3;
    const [savedSearchName, setSavedSearchName] = useState("");

    const filtered = companyData.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesIndustry =
            industryFilter === "all" ? true : c.industry === industryFilter;
        const matchesLocation =
            locationFilter === "all" ? true : c.location === locationFilter;
        return matchesSearch && matchesIndustry && matchesLocation;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const industries = Array.from(new Set(companyData.map((c) => c.industry)));
    const locations = Array.from(new Set(companyData.map((c) => c.location)));

    function saveSearch() {
        if (!savedSearchName.trim()) return;

        const existing = JSON.parse(
            localStorage.getItem("vc_saved_searches") || "[]"
        );

        const newSearch = {
            id: crypto.randomUUID(),
            name: savedSearchName,
            search,
            industry,
        };

        const updated = [...existing, newSearch];

        localStorage.setItem(
            "vc_saved_searches",
            JSON.stringify(updated)
        );

        setSavedSearchName("");
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Company Discovery
                </h1>
                <p className="text-lg text-muted-foreground">
                    Search and explore companies matching your thesis
                </p>
            </div>

            {/* Filters */}
            <Card className="border shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
                        <div className="flex-1 min-w-0">
                            <Input
                                placeholder="Search companies..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="max-w-md"
                            />
                        </div>
                        <div className="flex gap-2">

                            <Input
                                placeholder="Save search name"
                                value={savedSearchName}
                                onChange={(e) => setSavedSearchName(e.target.value)}
                            />

                            <Button
                                variant="outline"
                                onClick={saveSearch}
                            >
                                Save Search
                            </Button>

                        </div>

                        <Select
                            value={industryFilter}
                            onValueChange={(value) => {
                                setIndustryFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Industries" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* sentinel value instead of empty string */}
                                <SelectItem value="all">All Industries</SelectItem>
                                {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={locationFilter}
                            onValueChange={(value) => {
                                setLocationFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                        {location}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/60">
                        <TableRow>
                            <TableHead className="w-[40%]">Company</TableHead>
                            <TableHead className="w-[30%]">Industry</TableHead>
                            <TableHead className="w-[30%]">Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.map((company) => (
                            <TableRow
                                key={company.id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/companies/${company.id}`}
                                        className="text-primary hover:text-primary/80 hover:underline transition-colors"
                                    >
                                        {company.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {company.industry}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {company.location}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {paginated.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        No companies match your filters.
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}