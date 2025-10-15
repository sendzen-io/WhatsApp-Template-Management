"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import TemplateManager from "@workspace/ui-template-management/components/TemplateManager";
import { ErrorDetails } from "@workspace/ui-template-management/components/TemplateErrorUI";
import { CreateTemplatePayload, MessageTemplate, ResponseBodyComponent } from "@workspace/ui-template-management/types/templateTypes";
import { templateApi } from "../lib/api/TemplateService";

const getErrorDetails = (error: string): ErrorDetails => {
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('network') || 
        errorLower.includes('fetch') || 
        errorLower.includes('connection') ||
        errorLower.includes('timeout')) {
      return {
        type: 'network',
        message: error
      };
    }
    
    if (errorLower.includes('500') || 
        errorLower.includes('server error') ||
        errorLower.includes('internal error')) {
      return {
        type: 'server',
        message: error
      };
    }
    
    return {
      type: 'unknown',
      message: error
    };
  };

type FilterStatus = 'all' | 'approved' | 'pending' | 'rejected';

const TemplateClient: React.FC = () => {
  const [allTemplates, setAllTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await templateApi.get_MessageTemplates();
      setAllTemplates(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error loading templates:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const filteredTemplates = useMemo(() => {
    if (filterStatus === 'all') {
      return allTemplates;
    }
    return allTemplates.filter(t => t.status.toLowerCase() === filterStatus);
  }, [allTemplates, filterStatus]);

  const stats = useMemo(() => ({
    total: allTemplates.length,
    approved: allTemplates.filter(t => t.status.toLowerCase() === 'approved').length,
    pending: allTemplates.filter(t => t.status.toLowerCase() === 'pending').length,
    rejected: allTemplates.filter(t => t.status.toLowerCase() === 'rejected').length,
    withMedia: allTemplates.filter(t => t.components?.some(c => c.type === 'HEADER' && 'format' in c && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(c.format as string))).length,
  }), [allTemplates]);

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
  }

  const handleRetry = () => {
    loadTemplates()
  }

  const handleSyncTemplates = async () => {
    loadTemplates()
  }
  
  const handleCreateTemplate = async (payload: CreateTemplatePayload) => {
    try {
      console.log("Submitting template:", payload);
      await templateApi.create_MessageTemplate(payload);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the template");
      console.error("Error creating template:", err);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      console.log("Uploading file via Meta API:", file.name);
      const result = await templateApi.uploadFile(file);
      
      if (result.success && result.fileHandle) {
        console.log("File uploaded successfully via Meta API, handle:", result.fileHandle);
        return result.fileHandle;
      } else {
        throw new Error(result.error || "Meta API upload failed");
      }
    } catch (error) {
      console.error("Meta API file upload error:", error);
      throw error;
    }
  };

  const handlePreviewTemplate = (templateId: string) => {
    console.log("Preview template:", templateId)
  }

  const handleEditTemplate = (templateId: string) => {
    console.log("Edit template:", templateId)
  }

  const handleCopyTemplate = async (templateBody: string) => {
    try {
      await navigator.clipboard.writeText(templateBody)
    } catch (error) {
      console.error("Failed to copy template:", error)
    }
  }

  const handleDeleteTemplate = async (template: MessageTemplate) => {
    setDeletingTemplateId(template.id);
    try {
      const { success } = await templateApi.delete_MessageTemplate(template.name, template.id);
      if (success) {
        setAllTemplates(prevTemplates => prevTemplates.filter(t => t.id !== template.id));
      } else {
        setError("Failed to delete the template.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the template.");
      console.error("Error deleting template:", err);
    } finally {
      setDeletingTemplateId(null);
    }
  }

  return (
    <TemplateManager
        templates={filteredTemplates}
        stats={stats}
        loading={loading}
        error={error}
        totalTemplates={allTemplates.length}
        errorDetails={error ? getErrorDetails(error) : undefined}
        deletingTemplateId={deletingTemplateId}
        currentFilter={filterStatus}
        onRetry={handleRetry}
        onSync={handleSyncTemplates}
        onCreate={handleCreateTemplate}
        onFilterChange={handleFilterChange}
        onPreview={handlePreviewTemplate}
        onEdit={handleEditTemplate}
        onCopy={handleCopyTemplate}
        onDelete={(templateId) => {
          const template = allTemplates.find(t => t.id === templateId);
          if (template) {
            handleDeleteTemplate(template);
          }
        }}
        onFileUpload={handleFileUpload}
    />
  )
}

export default TemplateClient

