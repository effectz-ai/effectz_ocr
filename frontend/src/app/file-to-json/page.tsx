"use client"
import FileUploader from "@/components/FileUploader";
import JSONViewer from "@/components/JSONViewer";
import {useState} from "react";
import Header from "@/components/Header";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionModelType, setConversionModelType] = useState<string>('ollama');

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleApiCall = async (): Promise<string> => {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversionModelType', conversionModelType);

    try {
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/file_to_json`, formData);
      return data.json;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to fetch the result.');
    }
  };

  return (
      <div className="min-h-screen bg-gray-100">
        <Header/>
        <main className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-green-950">File Uploader</h2>
              <div className="mt-4 w-full mb-2 text-center">
                <label htmlFor="conversionModelType" className="block text-sm font-bold text-gray-700 mb-2">
                  Model Type
                </label>
                <select
                    id="conversionModelType"
                    value={conversionModelType}
                    onChange={(e) => setConversionModelType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                >
                  <option value="ollama">Ollama: llama3.2-vision</option>
                  <option value="openai">OpenAI: gpt-4o-mini</option>
                </select>
              </div>
              <FileUploader onFileChange={handleFileChange}/>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-green-950">JSON Viewer</h2>
              <JSONViewer onApiCall={handleApiCall}/>
            </div>
          </div>
        </main>
      </div>
  );
}
