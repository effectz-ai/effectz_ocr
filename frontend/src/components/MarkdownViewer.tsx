"use client"
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewerProps {
    onApiCall: () => Promise<string>;
}

export default function MarkdownViewer({ onApiCall }: MarkdownViewerProps) {
    const [markdown, setMarkdown] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleApiCall = async () => {
        setLoading(true);
        try {
            const result = await onApiCall();
            console.log('Result:', result);
            setMarkdown(result);
        } catch (error) {
            console.error('Error calling API:', error);
            setMarkdown('Failed to fetch markdown content.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={handleApiCall}
                className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Generate'}
            </button>
            <div className="w-full h-[600px] text-black overflow-y-auto border border-gray-300 rounded p-4">
                {markdown ? (
                    <ReactMarkdown className="text-black">{markdown}</ReactMarkdown>
                ) : (
                    <p className="text-gray-500">Markdown preview will appear here</p>
                )}
            </div>
            {markdown && (
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Download Markdown
                </button>
            )}
        </div>
    );
}

