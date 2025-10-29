import axios from 'axios';
import { CreateTemplatePayload, CreateTemplateResponse, GetAllTemplatesResponse, MessageTemplate } from '@workspace/ui-template-management/types/templateTypes';
import { PaginationInfo } from '@workspace/ui-template-management/components/TemplateManager';
import PayloadTransformer from '@workspace/ui-template-management/lib/payloadTransformer';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://graph.facebook.com/v23.0/';
const WhatsappBusinessAccountId = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_ACCOUNT_ID;
const facebookAccessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${facebookAccessToken}`,
    'Content-Type': 'application/json',
  },
});


interface ApiResponse {
  statuscode: number;
  response: string;
  data: false | MessageTemplate[];
  paging?: PaginationInfo;
}

const getWabaId = (): string => {
  if (!WhatsappBusinessAccountId) {
    console.error("Missing WhatsApp Business Account ID in template-management.");
    throw new Error("No WABA account available. Please ensure you have a WABA account configured.");
  }
  return WhatsappBusinessAccountId;
};

export const templateApi = {
  get_MessageTemplates: async (cursor?: string, limit?: number, direction: 'forward' | 'backward' = 'forward'): Promise<GetAllTemplatesResponse | ApiResponse> => {
    if (!WhatsappBusinessAccountId || !facebookAccessToken) {
      console.error("Missing Facebook API credentials in template-management.");
      throw new Error("Missing Facebook API credentials.");
    }
    
    try {
      // Build query parameters
      const params: any = {
        fields: 'name,category,status,id,language,components',
        limit: limit || 50
      };
      
      if (cursor) {
        // Use 'before' for backward pagination, 'after' for forward pagination
        if (direction === 'backward') {
          params.before = cursor;
        } else {
          params.after = cursor;
        }
      }
      
      const response = await client.get(`/${WhatsappBusinessAccountId}/message_templates`, { params });
      
      // Safely extract data with fallbacks for different response structures
      const templates = response.data?.data?.data || response.data?.data || [];
      const paging = response.data?.data?.paging || response.data?.paging;
      
      // Return ApiResponse format for pagination support
      return {
        statuscode: response.status,
        response: response.data?.message || "Success",
        data: Array.isArray(templates) ? templates : [],
        paging: paging
      };
    } catch (error: any) {
      // Extract error details for better logging
      const errorDetails = {
        message: error?.message || String(error),
        code: error?.code,
        response: error?.response?.data,
        status: error?.response?.status,
        requestUrl: error?.config?.url,
      };
      
      console.error("Error fetching templates via axios:", errorDetails);
      throw error;
    }
  },

  create_MessageTemplate: async (templateData: CreateTemplatePayload): Promise<CreateTemplateResponse | ApiResponse> => {
    try {
      const wabaId = getWabaId();
      // Transform payload to Meta format
      const metaPayload = PayloadTransformer.transformToMeta(templateData);
      
      const response = await client.post(`/${wabaId}/message_templates`, metaPayload);
      return {
        statuscode: response.status,
        response: response.data?.message || "Success",
        data: response.data?.data
      };
    } catch (error: any) {
      console.error("Error creating template via axios:", {
        message: error?.message || String(error),
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },


  delete_MessageTemplate: async (templateName: string, templateId: string): Promise<{ success: boolean } | ApiResponse> => {
    try {
      const wabaId = getWabaId();
      const response = await client.delete(`/${wabaId}/message_templates`, {
        params: {
          name: templateName,
          hsm_id: templateId,
        }
      });
      return {
        statuscode: response.status,
        response: response.data?.message || "Success",
        data: response.data?.data
      };
    } catch (error: any) {
      console.error("Error deleting template via axios:", {
        message: error?.message || String(error),
        response: error?.response?.data,
        status: error?.response?.status
      });
      throw error;
    }
  },

};
