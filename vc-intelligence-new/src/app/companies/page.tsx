"use client";

import { useState } from "react";
import Link from "next/link";
import { companies as companyData, Company } from "../../data/companies";

export default function CompaniesPage() {
    const [search, setSearch] = useState("");
    const [industryFilter, setIndustryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 3;

    const filtered = companyData.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase());
        const matchesIndustry = industryFilter
            ? c.industry === industryFilter
            : true;
        const matchesLocation = locationFilter
            ? c.location === locationFilter
            : true;
        return matchesSearch && matchesIndustry && matchesLocation;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice(
        (page - 1) * perPage,
        page * perPage
    );

    const industries = Array.from(
        new Set(companyData.map((c) => c.industry))
    );
    const locations = Array.from(
        new Set(companyData.map((c) => c.location))
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Companies</h1>

            {/* Filters */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border p-2 rounded"
                />

                <select
                    value={industryFilter}
                    onChange={(e) => {
                        setIndustryFilter(e.target.value);
                        setPage(1);
                    }}
                    className="border p-2 rounded"
                >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                        <option key={industry} value={industry}>
                            {industry}
                        </option>
                    ))}
                </select>

                <select
                    value={locationFilter}
                    onChange={(e) => {
                        setLocationFilter(e.target.value);
                        setPage(1);
                    }}
                    className="border p-2 rounded"
                >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </div>

            {/* Companies Table */}
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Industry</th>
                        <th className="border p-2 text-left">Location</th>
                    </tr>
                </thead>

                <tbody>
                    {paginated.map((company: Company) => (
                        <tr key={company.id}>
                            <td className="border p-2 text-blue-600 underline">
                                <Link href={`/companies/${company.id}`}>
                                    {company.name}
                                </Link>
                            </td>
                            <td className="border p-2">{company.industry}</td>
                            <td className="border p-2">{company.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

