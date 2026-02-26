import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen border-r p-4">
            <h1 className="text-xl font-bold mb-6">VC Scout</h1>

            <nav className="flex flex-col gap-3">
                <Link href="/companies">Companies</Link>
                <Link href="/lists">Lists</Link>
                <Link href="/saved">Saved Searches</Link>
            </nav>
        </div>
    );
}