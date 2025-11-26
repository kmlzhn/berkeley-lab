"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, X, FileText, FileSpreadsheet, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { uploadFiles } from "@/utils/uploadthing";
import { WORKSTREAMS, WorkStream } from "@/lib/workstreams";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatInputProps {
  onSendMessage: (message: string, fileUrls?: string[], workflowId?: string) => void;
  isLoading: boolean;
}

interface SelectedFile {
  file: File;
  name: string;
  type: string;
}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

// Helper functions
const getFileIcon = (fileType: string) => {
  if (fileType.includes('csv') || fileType === 'text/csv') return FileSpreadsheet;
  if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('sheet')) return FileSpreadsheet;
  if (fileType.includes('text') || fileType === 'text/plain') return FileText;
  return FileText;
};

export default function ChatInput({ 
  onSendMessage, 
  isLoading
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkStream | null>(null);
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isWorkflowDropdownOpen, setWorkflowDropdownOpen } = useChatContext();
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  const filteredWorkflows = WORKSTREAMS.filter(ws =>
    ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ws.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkflowSelect = (workflow: WorkStream) => {
    setSelectedWorkflow(workflow);
    setValue(workflow.prompt);
    setWorkflowDropdownOpen(false);
    setExpandedWorkflowId(null);
    setSearchTerm("");
    adjustHeight();
  };

  const toggleWorkflowExpand = (workflowId: string) => {
    setExpandedWorkflowId(expandedWorkflowId === workflowId ? null : workflowId);
  };

  const handleSubmit = async () => {
    if ((value.trim() || selectedFiles.length > 0) && !isLoading && !isUploading) {
      let fileUrls: string[] = [];
      
      // Upload files first if any (but don't block message display)
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const files = selectedFiles.map(sf => sf.file);
          const uploadResults = await uploadFiles("documentUploader", { files });
          fileUrls = uploadResults.map(file => file.url);
        } catch (error) {
          console.error('Upload failed during send:', error);
          setIsUploading(false);
          return; // Don't send message if upload fails
        }
        setIsUploading(false);
      }
      
      // Send message with real file URLs (or empty array)
      onSendMessage(value, fileUrls, selectedWorkflow?.id);
      setValue("");
      setSelectedFiles([]);
      setSelectedWorkflow(null);
      adjustHeight(true);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => {
    console.log('Triggering file input...');
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log('Files selected:', files.map(f => f.name));

    // Just store files locally, don't upload yet
    const newSelectedFiles: SelectedFile[] = files.map(file => ({
      file,
      name: file.name,
      type: file.type
    }));

    setSelectedFiles(prev => [...prev, ...newSelectedFiles]);
    
    // Clear the input
    e.target.value = '';
  };


  return (
    <>
      <div className="p-4">
        <div className="relative max-w-3xl w-full mx-auto">
          {/* Main Input Container */}
          <div className="relative border border-zinc-200 rounded-xl bg-white overflow-hidden">
            {/* Selected Workflow Badge */}
            <AnimatePresence>
              {selectedWorkflow && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="px-4 pt-3 border-b border-zinc-100"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg text-sm mb-3">
                    <span className="font-medium text-zinc-900">{selectedWorkflow.title}</span>
                    <motion.button
                      onClick={() => setSelectedWorkflow(null)}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="text-zinc-500 hover:text-zinc-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File List */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="px-4 pt-3 border-b border-zinc-100"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedFiles.map((selectedFile, index) => {
                      const IconComponent = getFileIcon(selectedFile.type);
                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg text-sm"
                        >
                          <IconComponent className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-700 max-w-[120px] truncate">
                            {selectedFile.name}
                          </span>
                          <motion.button
                            onClick={() => removeFile(index)}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="text-zinc-400 hover:text-red-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Textarea */}
            <div className="relative">
              <Textarea
                value={value}
                placeholder="Ask anything..."
                className="w-full px-4 py-4 bg-transparent border-none text-zinc-900 resize-none focus-visible:ring-0 leading-relaxed min-h-[56px] placeholder:text-zinc-400"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                disabled={isLoading}
                style={{ maxHeight: `${MAX_HEIGHT}px` }}
              />
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-100">
              {/* Left Actions */}
              <div className="flex items-center gap-1">
                {/* Workflow Selector */}
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setWorkflowDropdownOpen(!isWorkflowDropdownOpen)}
                    disabled={isLoading || isUploading}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isWorkflowDropdownOpen
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                      (isLoading || isUploading) && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <Workflow className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Workflow Dropdown Popover */}
                  <AnimatePresence>
                    {isWorkflowDropdownOpen && (
                      <>
                        {/* Backdrop with Blur Effect */}
                        <motion.div 
                          initial={{ backdropFilter: "blur(0px)" }}
                          animate={{ backdropFilter: "blur(8px)" }}
                          exit={{ backdropFilter: "blur(0px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="fixed inset-0 bg-zinc-900/5 z-40"
                          onClick={() => {
                            setWorkflowDropdownOpen(false);
                            setExpandedWorkflowId(null);
                            setSearchTerm("");
                          }}
                        />
                        
                        {/* Dropdown Popover - Fixed Positioning */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(8px)" }}
                          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(8px)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-96 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 max-h-[400px] flex flex-col overflow-hidden"
                        >
                          {/* Search Input - Sticky */}
                          <div className="sticky top-0 bg-white z-10 p-3 border-b border-zinc-100">
                            <input
                              type="text"
                              placeholder="Search workflows..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              autoFocus
                              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
                            />
                          </div>

                          {/* Workflows List - Scrollable */}
                          <div className="flex-1 overflow-y-auto">
                            {filteredWorkflows.length > 0 ? (
                              <div className="p-2">
                                {/* Section Header */}
                                <div className="px-3 py-2">
                                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                                    My Workflows
                                  </h4>
                                </div>

                                {/* Workflow Items */}
                                {filteredWorkflows.map((workflow) => (
                                  <div key={workflow.id} className="mb-1">
                                    {/* Workflow Header - Clickable */}
                                    <motion.button
                                      onClick={() => toggleWorkflowExpand(workflow.id)}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                      className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between gap-2",
                                        expandedWorkflowId === workflow.id
                                          ? "bg-zinc-100 border-l-2 border-zinc-900"
                                          : "hover:bg-zinc-50"
                                      )}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-zinc-900 truncate">
                                          {workflow.title}
                                        </h4>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                          {workflow.taskCount} tasks
                                        </p>
                                      </div>
                                      <motion.div
                                        animate={{ rotate: expandedWorkflowId === workflow.id ? 90 : 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="text-zinc-400"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </motion.div>
                                    </motion.button>

                                    {/* Expanded Tasks Section */}
                                    <AnimatePresence>
                                      {expandedWorkflowId === workflow.id && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="pl-6 pr-3 py-2 space-y-1">
                                            {/* Description */}
                                            <p className="text-xs text-zinc-600 leading-relaxed mb-2">
                                              {workflow.description}
                                            </p>

                                            {/* Tasks with Stagger */}
                                            <div className="space-y-1 mb-2">
                                              {workflow.tasks.map((task, index) => (
                                                <motion.div
                                                  key={task.id}
                                                  initial={{ opacity: 0, x: -8 }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{ 
                                                    type: "spring", 
                                                    stiffness: 400, 
                                                    damping: 25,
                                                    delay: index * 0.05 
                                                  }}
                                                  className="flex items-start gap-2 py-1.5"
                                                >
                                                  <span className="text-xs text-zinc-400 font-medium mt-0.5">
                                                    #{task.id}
                                                  </span>
                                                  <span className="text-sm text-zinc-600 flex-1">
                                                    {task.title}
                                                  </span>
                                                </motion.div>
                                              ))}
                                            </div>

                                            {/* Use Workflow Button */}
                                            <motion.button
                                              onClick={() => handleWorkflowSelect(workflow)}
                                              whileTap={{ scale: 0.98 }}
                                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                              className="w-full mt-2 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium text-sm hover:bg-zinc-800"
                                            >
                                              Use this workflow
                                            </motion.button>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500">No workflows found</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* File Upload */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.txt"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <motion.button
                    type="button"
                    onClick={triggerUpload}
                    disabled={isLoading || isUploading}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isUploading 
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                      (isLoading || isUploading) && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <Upload className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Send Button */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isUploading || (!value.trim() && selectedFiles.length === 0)}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "px-4 py-1.5 rounded-lg font-medium text-sm transition-colors",
                  (value.trim() || selectedFiles.length > 0) && !isLoading && !isUploading
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                    Sending
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}