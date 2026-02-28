import { Suspense } from 'react';
import CompaniesClient from "../companies/companiesclient";

export default function CompaniesPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="text-center py-20">
                        <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full" />
                        <p className="mt-4 text-muted-foreground">Loading companies...</p>
                    </div>
                </div>
            }
        >
            <CompaniesClient />
        </Suspense>
    );
}