// components/signals-timeline.tsx
'use client';

type Signal = {
    id: string;
    label: string;
    source: string;
    timestamp: string;
};

interface Props {
    signals: Signal[];
    companyName?: string;
}

export default function SignalsTimeline({ signals, companyName }: Props) {
    const sorted = [...signals].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Signals Timeline</h3>
                <span className="text-sm text-gray-500">({signals.length})</span>
            </div>

            {sorted.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                    No signals yet for {companyName || 'this company'}. Run live enrichment.
                </p>
            ) : (
                <div className="space-y-6 relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    {sorted.map((signal, i) => (
                        <div key={signal.id || i} className="relative">
                            <div className="absolute -left-[9px] w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900" />
                            <div>
                                <div className="font-medium">{signal.label}</div>
                                <a
                                    href={signal.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm block mt-0.5"
                                >
                                    {signal.source.replace(/^https?:\/\//, '')}
                                </a>
                                <time className="text-xs text-gray-500 mt-1 block">
                                    {new Date(signal.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })} — {new Date(signal.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </time>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
