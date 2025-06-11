import React, { useState } from 'react';
import { Camera, Bug, Save, Download, Zap } from 'lucide-react';
import ImagePreview from './components/ImagePreview';
import BugForm from './components/BugForm';
import Header from './components/Header';

interface BugData {
  title: string;
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
}

interface CaptureResponse {
  dataUrl: string;
  filename: string;
  pageInfo: {
    url: string;
    title: string;
    generatedSteps: string;
  };
}

function BugCatcherApp() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bugData, setBugData] = useState<BugData>({
    title: '',
    stepsToReproduce: '',
    actualResult: '',
    expectedResult: ''
  });

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const response = await new Promise<CaptureResponse>((resolve, reject) => {
        chrome.runtime.sendMessage(
          { action: 'captureScreenshot' },
          (response: CaptureResponse) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          }
        );
      });

      setCapturedImage(response.dataUrl);
      
      // Auto-populate form with generated data
      setBugData(prev => ({
        ...prev,
        stepsToReproduce: response.pageInfo.generatedSteps || '',
        title: `Bug found on: ${response.pageInfo.title || 'Unknown Page'}`
      }));
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleBugDataChange = (field: keyof BugData, value: string) => {
    setBugData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveBugReport = () => {
    const report = {
      ...bugData,
      timestamp: new Date().toISOString(),
      screenshot: capturedImage
    };
    
    // Save to Chrome storage
    chrome.storage.local.set({
      [`bug_report_${Date.now()}`]: report
    });
    
    // Create downloadable bug report
    const reportText = `
BUG REPORT
==========
Title: ${bugData.title}
Timestamp: ${new Date().toLocaleString()}

Steps to Reproduce:
${bugData.stepsToReproduce}

Actual Result:
${bugData.actualResult}

Expected Result:
${bugData.expectedResult}
    `.trim();
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    chrome.downloads.download({
      url: url,
      filename: `bug-report-${timestamp}.txt`,
      saveAs: false
    });
    
    alert('Bug report saved successfully!');
  };

  const resetForm = () => {
    setCapturedImage(null);
    setBugData({
      title: '',
      stepsToReproduce: '',
      actualResult: '',
      expectedResult: ''
    });
  };

  if (!capturedImage) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Bug className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Ready to Catch Bugs</h2>
            <p className="text-gray-600 max-w-md">
              Click the button below to capture a screenshot of the current page and start documenting the bug.
            </p>
          </div>
          
          <button
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-3 shadow-lg"
          >
            {isCapturing ? (
              <>
                <Zap className="w-5 h-5 animate-spin" />
                <span>Capturing...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Capture Bug</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 border-r border-gray-200">
          <ImagePreview imageUrl={capturedImage} />
        </div>
        <div className="w-1/2 flex flex-col">
          <BugForm
            bugData={bugData}
            onBugDataChange={handleBugDataChange}
          />
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
            <button
              onClick={saveBugReport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 flex-1"
            >
              <Save className="w-4 h-4" />
              <span>Save Report</span>
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BugCatcherApp;