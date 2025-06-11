import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
}

function ImagePreview({ imageUrl }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);
  
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `bug-screenshot-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Screenshot Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button
            onClick={downloadImage}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Download Image"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-center min-h-full">
          <img
            src={imageUrl}
            alt="Bug Screenshot"
            className="max-w-none border border-gray-300 rounded-lg shadow-md"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;