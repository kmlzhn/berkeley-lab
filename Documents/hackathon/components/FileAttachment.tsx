'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Eye, Loader2 } from 'lucide-react';
import { FileAttachment as FileAttachmentType } from '@/types';
import { getFilePreview, formatPreviewForDisplay, FilePreviewData } from '@/utils/filePreview';

interface FileAttachmentProps {
  file: FileAttachmentType;
}

export default function FileAttachment({ file }: FileAttachmentProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [previewData, setPreviewData] = useState<FilePreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const getFileIcon = () => {
    switch (file.type) {
      case 'csv':
      case 'xlsx':
        return FileSpreadsheet;
      case 'txt':
        return FileText;
      default:
        return FileText;
    }
  };

  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  const loadPreview = async () => {
    if (previewData || isLoadingPreview) return;
    
    setIsLoadingPreview(true);
    setPreviewError(null);
    
    try {
      const preview = await getFilePreview(file.url, file.type);
      setPreviewData(preview);
      
      if (preview.error) {
        setPreviewError(preview.error);
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
      setPreviewError(error instanceof Error ? error.message : 'Failed to load preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    loadPreview();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const IconComponent = getFileIcon();

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 transition-all duration-200 cursor-pointer hover:bg-zinc-100 text-zinc-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleDownload}
      >
        <IconComponent className="w-4 h-4 flex-shrink-0 text-zinc-500" />
        <span className="text-sm font-medium truncate max-w-[200px]">
          {file.name}
        </span>
        {file.size && (
          <span className="text-xs text-zinc-500">
            ({(file.size / 1024).toFixed(1)} KB)
          </span>
        )}
        <Download className="w-3 h-3 text-zinc-400" />
      </div>

      {/* Preview Tooltip */}
      {isHovering && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-80 p-3 bg-white border border-zinc-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {isLoadingPreview ? (
              <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 text-zinc-500" />
            )}
            <span className="text-sm font-medium text-zinc-900">
              {isLoadingPreview ? 'Loading Preview...' : 'File Preview'}
            </span>
          </div>
          
          {isLoadingPreview ? (
            <div className="text-sm text-zinc-500">Reading file contents...</div>
          ) : previewError ? (
            <div className="text-sm text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-200">
              {previewError}
            </div>
          ) : previewData ? (
            <div className="space-y-2">
              {/* File Info */}
              <div className="text-xs text-zinc-500 border-b border-zinc-200 pb-2">
                {previewData.totalRows > 0 && (
                  <span>{previewData.totalRows} rows • </span>
                )}
                {previewData.headers.length > 0 && (
                  <span>{previewData.headers.length} columns</span>
                )}
              </div>
              
              {/* Data Preview */}
              <div className="text-xs text-zinc-700 font-mono bg-zinc-50 p-2 rounded max-h-40 overflow-auto">
                {formatPreviewForDisplay(previewData)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-500">No preview available</div>
          )}
          
          <div className="mt-2 text-xs text-zinc-500 border-t border-zinc-200 pt-2">
            Click to download • {file.type.toUpperCase()} file
          </div>
        </div>
      )}
    </div>
  );
}
