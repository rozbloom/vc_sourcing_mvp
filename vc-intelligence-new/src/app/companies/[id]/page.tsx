import { companies } from "../../../data/companies";

export default function CompanyProfile({
    params,
}: {
    params: { id: string };
}) {
    const company = companies.find((c) => c.id === params.id);

    if (!company) return <div>Company not found</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{company.name}</h1>
            <p className="mb-2">
                <strong>Website:</strong>{" "}
                <a
                    href={company.website}
                    target="_blank"
                    className="text-blue-600"
                >
                    {company.website}
                </a>
            </p>

            <p className="mb-2">
                <strong>Industry:</strong> {company.industry}
            </p>

            <button className="mt-6 px-4 py-2 bg-black text-white rounded">
                Enrich (Coming Next)
            </button>
        </div>
    );
}