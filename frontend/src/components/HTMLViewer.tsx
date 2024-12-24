"use client"
import { useState } from 'react';
import ReactXMLViewer from 'react-xml-viewer'

interface HTMLViewerProps {
    onApiCall: () => Promise<string>;
}

export default function HTMLViewer({ onApiCall }: HTMLViewerProps) {
    const [HTML, setHTML] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleApiCall = async () => {
        setLoading(true);
        try {
            const result = await onApiCall();
            console.log('Result:', result);
            setHTML(result);
        } catch (error) {
            console.error('Error calling API:', error);
            setHTML('Failed to fetch HTML content.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([HTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.html';
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
                {HTML ? (
                    <ReactXMLViewer collapsible={true} xml={HTML} />
                ) : (
                    <p className="text-gray-500">HTML preview will appear here</p>
                )}
            </div>
            {HTML && (
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Download HTML
                </button>
            )}
        </div>
    );
}

