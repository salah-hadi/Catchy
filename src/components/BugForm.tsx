import React from 'react';
import { FileText, List, AlertTriangle, CheckCircle } from 'lucide-react';

interface BugData {
  title: string;
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
}

interface BugFormProps {
  bugData: BugData;
  onBugDataChange: (field: keyof BugData, value: string) => void;
}

function BugForm({ bugData, onBugDataChange }: BugFormProps) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-6">
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <FileText className="w-4 h-4" />
          <span>Bug Title</span>
        </label>
        <input
          type="text"
          value={bugData.title}
          onChange={(e) => onBugDataChange('title', e.target.value)}
          placeholder="Enter a descriptive title for the bug..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <List className="w-4 h-4" />
          <span>Steps to Reproduce</span>
        </label>
        <textarea
          value={bugData.stepsToReproduce}
          onChange={(e) => onBugDataChange('stepsToReproduce', e.target.value)}
          placeholder="1. Navigate to...&#10;2. Click on...&#10;3. Enter...&#10;4. Observe..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Actual Result</span>
        </label>
        <textarea
          value={bugData.actualResult}
          onChange={(e) => onBugDataChange('actualResult', e.target.value)}
          placeholder="Describe what actually happened..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Expected Result</span>
        </label>
        <textarea
          value={bugData.expectedResult}
          onChange={(e) => onBugDataChange('expectedResult', e.target.value)}
          placeholder="Describe what should have happened..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

export default BugForm;