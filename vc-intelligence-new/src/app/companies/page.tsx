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
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Company Discovery
                </h1>
                <p className="text-gray-500 mt-1">
                    Search and explore companies matching your thesis
                </p>
            </div>

            {/* Filters Card */}
            <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-wrap gap-4">

                <input
                    type="text"
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <select
                    value={industryFilter}
                    onChange={(e) => {
                        setIndustryFilter(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                        <option key={industry}>{industry}</option>
                    ))}
                </select>

                <select
                    value={locationFilter}
                    onChange={(e) => {
                        setLocationFilter(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                        <option key={location}>{location}</option>
                    ))}
                </select>

            </div>

            {/* Table Card */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

                <table className="w-full">
                    <thead className="bg-gray-50 text-sm">
                        <tr>
                            <th className="text-left px-4 py-3">Company</th>
                            <th className="text-left px-4 py-3">Industry</th>
                            <th className="text-left px-4 py-3">Location</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((company) => (
                            <tr
                                key={company.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 font-medium text-blue-600">
                                    <Link href={`/companies/${company.id}`}>
                                        {company.name}
                                    </Link>
                                </td>

                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-md">
                                        {company.industry}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                    {company.location}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">

                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                    Next
                </button>

            </div>

        </div>
    );
}