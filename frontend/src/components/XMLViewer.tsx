"use client"
import { useState } from 'react';
import ReactXMLViewer from 'react-xml-viewer'

interface XMLViewerProps {
    onApiCall: () => Promise<string>;
}

export default function XMLViewer({ onApiCall }: XMLViewerProps) {
    const [XML, setXML] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleApiCall = async () => {
        setLoading(true);
        try {
            const result = await onApiCall();
            console.log('Result:', result);
            setXML(result);
        } catch (error) {
            console.error('Error calling API:', error);
            setXML('Failed to fetch XML content.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([XML], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.xml';
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
                {XML ? (
                    <ReactXMLViewer collapsible={true} xml={XML} />
                ) : (
                    <p className="text-gray-500">XML preview will appear here</p>
                )}
            </div>
            {XML && (
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Download XML
                </button>
            )}
        </div>
    );
}

