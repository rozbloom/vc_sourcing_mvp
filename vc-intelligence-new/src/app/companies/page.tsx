import { companies } from "../../data/companies";
import Link from "next/link";

export default function CompaniesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Companies</h1>

            <table className="w-full border">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Industry</th>
                        <th className="text-left p-2">Location</th>
                    </tr>
                </thead>

                <tbody>
                    {companies.map((company) => (
                        <tr key={company.id} className="border-b">
                            <td className="p-2">
                                <Link
                                    href={`/companies/${company.id}`}
                                    className="text-blue-600"
                                >
                                    {company.name}
                                </Link>
                            </td>
                            <td className="p-2">{company.industry}</td>
                            <td className="p-2">{company.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}