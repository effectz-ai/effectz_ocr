"use client"
import { useState } from 'react';
import { JsonViewer } from '@textea/json-viewer'

interface JSONViewerProps {
    onApiCall: () => Promise<string>;
}

export default function JSONViewer({ onApiCall }: JSONViewerProps) {
    const [jsonString, setJsonString] = useState<string>('');
    const [json, setJson] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleApiCall = async () => {
        setLoading(true);
        try {
            const result = await onApiCall();
            const resultJson = JSON.parse(result);
            setJsonString(result);
            setJson(resultJson);
            console.log('Result:', jsonString);
        } catch (error) {
            console.error('Error calling API:', error);
            setJsonString('Failed to fetch JSON content.');
            setJson({});
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'text/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.json';
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
                {jsonString ? (
                    <JsonViewer value={json} />
                ) : (
                    <p className="text-gray-500">JSON preview will appear here</p>
                )}
            </div>
            {jsonString && (
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Download JSON
                </button>
            )}
        </div>
    );
}

