"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import TemplateManager from "@workspace/ui-template-management/components/TemplateManager";
import { ErrorDetails } from "@workspace/ui-template-management/components/TemplateErrorUI";
import { CreateTemplatePayload, MessageTemplate, ResponseBodyComponent } from "@workspace/ui-template-management/types/templateTypes";
import { PaginationInfo } from "@workspace/ui-template-management/components/TemplateManager";
import { templateApi } from "../lib/api/TemplateService";

const getErrorDetails = (error: string): ErrorDetails => {
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('unauthorized') || 
        errorLower.includes('401') || 
        errorLower.includes('access denied') ||
        errorLower.includes('invalid token') ||
        errorLower.includes('input string was not in a correct format')) {
      return {
        type: 'unauthorized',
        message: error
      };
    }
    
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
    
    if (errorLower.includes('validation') || 
        errorLower.includes('invalid') ||
        errorLower.includes('bad request')) {
      return {
        type: 'validation',
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
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined)
  const [cursorHistory, setCursorHistory] = useState<string[]>([])
  const [totalTemplatesCount, setTotalTemplatesCount] = useState(0)
  const cursorHistoryRef = useRef<string[]>([]) // Ref to track history without causing re-renders

  // Keep ref in sync with state
  useEffect(() => {
    cursorHistoryRef.current = cursorHistory;
  }, [cursorHistory])

  const loadTemplates = useCallback(async (cursor?: string, append: boolean = false, direction: 'forward' | 'backward' = 'forward') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await templateApi.get_MessageTemplates(cursor, 50, direction) as any;

      let templates: MessageTemplate[] = [];
      let paginationInfo: PaginationInfo | undefined = undefined;
      
      if (response.data && Array.isArray(response.data)) {
        templates = response.data;
        paginationInfo = {...response.paging, hasNextPage: Boolean(response.paging?.next || response.paging?.cursors?.after), hasPreviousPage: Boolean(response.paging?.previous || response.paging?.cursors?.before)} as PaginationInfo;
      } else {
        const apiResponse = response as any;
        if (apiResponse.data?.data && Array.isArray(apiResponse.data.data)) {
            templates = apiResponse.data.data;
            paginationInfo = {...apiResponse.data.paging, hasNextPage: Boolean(response.paging?.next || response.paging?.cursors?.after), hasPreviousPage: Boolean(response.paging?.previous || response.paging?.cursors?.before)} as PaginationInfo;
        } else if (apiResponse.data?.data?.data && Array.isArray(apiResponse.data.data.data)) {
            templates = apiResponse.data.data.data;
            paginationInfo = {...apiResponse.data.data.paging, hasNextPage: Boolean(response.paging?.next || response.paging?.cursors?.after), hasPreviousPage: Boolean(response.paging?.previous || response.paging?.cursors?.before)} as PaginationInfo;
        }
      }

      // Process pagination info - use previous and next keys from API to determine pagination availability
      if (paginationInfo) {
        // Use the previous and next keys from API response to determine if pages exist
        // These keys are at the same level as cursors and indicate actual page availability
        const apiResponse = paginationInfo as any;
        const hasNext = paginationInfo.next && paginationInfo.next?.trim() !== '' ? true : false;
        const hasPrevious = paginationInfo.previous && paginationInfo.previous?.trim() !== '' ? true : false;
        
        const processedPagination: PaginationInfo = {
          cursors: paginationInfo.cursors,
          previous: paginationInfo.previous,
          next: paginationInfo.next,
          hasNextPage: hasNext,
          hasPreviousPage: hasPrevious
        };
        setPagination(processedPagination);
        
      }

      if (append) {
        setAllTemplates(prev => [...prev, ...templates]);
      } else {
        setAllTemplates(templates);
        setTotalTemplatesCount(templates.length);
      }
      
      setCurrentCursor(cursor);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error loading templates:", {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      });
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredBySearch = useMemo(() => {
    if (!searchQuery && selectedCategory === 'all' && selectedStatus === 'all') {
        return allTemplates;
    }

    return allTemplates.filter((template) => {
        const bodyComponent = template.components?.find(c => c.type === 'BODY') as ResponseBodyComponent | undefined;
        const bodyText = bodyComponent?.text || '';

        const matchesSearch =
          !searchQuery ||
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bodyText.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory
        const matchesStatus = selectedStatus === "all" || template.status.toLowerCase() === selectedStatus
    
        return matchesSearch && matchesCategory && matchesStatus
      })
  }, [allTemplates, searchQuery, selectedCategory, selectedStatus]);

  const finalFilteredTemplates = useMemo(() => {
    if (filterStatus === 'all') {
      return filteredBySearch;
    }
    return filteredBySearch.filter(t => t.status.toLowerCase() === filterStatus);
  }, [filteredBySearch, filterStatus]);

  const stats = useMemo<{
    total: number | string;
    approved: number;
    pending: number;
    rejected: number;
  }>(() => {
    const total = allTemplates.length;
    const hasMore = !pagination?.hasNextPage && !pagination?.hasPreviousPage ? true : pagination?.hasNextPage ?? false;
    // const displayTotal = hasMore ? `${total}+` : total;
    const displayTotal = total;
    
    return {
      total: displayTotal,
      approved: allTemplates.filter(t => t.status.toLowerCase() === 'approved').length,
      pending: allTemplates.filter(t => t.status.toLowerCase() === 'pending').length,
      rejected: allTemplates.filter(t => t.status.toLowerCase() === 'rejected').length
    };
  }, [allTemplates, pagination?.hasNextPage, pagination?.hasPreviousPage]);

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
  }

  const handleRetry = () => {
    loadTemplates()
  }

  const handleSyncTemplates = async () => {
    loadTemplates()
  }
  
  const handleNextPage = () => {
    // Only proceed if API indicates there's a next page and we have a cursor
    if (pagination?.hasNextPage && pagination?.cursors?.after) {
      // Save current cursor to history before navigating forward
      // This ensures we can go back exactly one page at a time
      setCursorHistory(prev => (currentCursor ? [...prev, currentCursor] : prev));
      loadTemplates(pagination.cursors.after, false, 'forward');
    }
    if(!pagination?.hasNextPage && !pagination?.hasPreviousPage && allTemplates.length === 50){
      loadTemplates(pagination?.cursors?.after, false, 'forward');
    }
  }

  const handlePreviousPage = () => {
    if (!pagination?.hasPreviousPage) return;
    
    // Prioritize using cursor history for precise one-page-at-a-time navigation
    if (cursorHistory.length > 0) {
      // Use the cursor from history - this is the cursor that was used to load current page
      const previousCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory(prev => prev.slice(0, -1));
      // Use undefined direction (defaults to forward) since we're using the exact cursor
      loadTemplates(previousCursor, false, 'forward');
    } else if (pagination?.cursors?.before) {
      // Fallback: use cursors.before if no history available (e.g., first backward navigation)
      loadTemplates(pagination.cursors.before, false, 'backward');
    }
  }

  const handleCreateTemplate = async (payload: CreateTemplatePayload) => {
    try {
      setCreatingTemplate(true);
      console.log("Submitting template:", payload);
      await templateApi.create_MessageTemplate(payload);
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the template");
      console.error("Error creating template:", err);
    } finally {
      setCreatingTemplate(false);
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
      const response = await templateApi.delete_MessageTemplate(template.name, template.id) as any;
      if (response.statuscode >= 200 && response.statuscode < 300) {
        setAllTemplates(prevTemplates => prevTemplates.filter(t => t.id !== template.id));
      } else {
        setError(response.response || "Failed to delete the template.");
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
        templates={finalFilteredTemplates}
        stats={stats}
        loading={loading}
        error={error}
        errorDetails={error ? getErrorDetails(error) : undefined}
        totalTemplates={totalTemplatesCount}
        deletingTemplateId={deletingTemplateId}
        creatingTemplate={creatingTemplate}
        currentFilter={filterStatus}
        pagination={pagination}
        onRetry={handleRetry}
        onSync={handleSyncTemplates}
        onCreate={handleCreateTemplate}
        onFilterChange={(filter: string) => handleFilterChange(filter as FilterStatus)}
        onPreview={handlePreviewTemplate}
        onEdit={handleEditTemplate}
        onCopy={handleCopyTemplate}
        onDelete={(templateId) => {
          const template = allTemplates.find(t => t.id === templateId);
          if (template) {
            handleDeleteTemplate(template);
          }
        }}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
    />
  )
}

export default TemplateClient

