import axios from 'axios';
import { CreateTemplatePayload, CreateTemplateResponse, GetAllTemplatesResponse } from '@workspace/ui-template-management/types/templateTypes';
import PayloadTransformer from '@workspace/ui-template-management/lib/payloadTransformer';
import { createMetaUploadService } from '@workspace/ui-template-management/lib/metaFileUploadService';

const BASE_URL = 'https://graph.facebook.com/v23.0';
const WhatsappBusinessAccountId = "105131965978087";
const WhatsappAppId = "413460000639062";
const facebookAccessToken = "EAAF4Cih3iFYBPvdZCy7FXe0LXiwxAy6mrbowld7SZBM4EQTYPEoTUohZBg0T5d7H7PeombfIaVTR169kJiL4s9AbZA8qwVaIt3AnheWZBNnubK5JurZBQePddIoaeHnfKlWpKIFRIKx0DV63CXhTBaigYzttEZCnsgpNnbDuwX8ZBTMZAXpIFU3aHbWMTygVNzd4Bc4TlM4ET8pvEBtoxbDgkd4oEmpZCTz3Il6kdhV8vKbqhKwQZDZD";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${facebookAccessToken}`,
    'Content-Type': 'application/json',
  },
});

// Create Meta upload service instance
const metaUploadService = createMetaUploadService(WhatsappAppId, facebookAccessToken);

export const templateApi = {
  get_MessageTemplates: async (): Promise<GetAllTemplatesResponse> => {
    if (!WhatsappBusinessAccountId || !facebookAccessToken) {
      console.error("Missing Facebook API credentials in template-management.");
      throw new Error("Missing Facebook API credentials.");
    }
    const res = await client.get<GetAllTemplatesResponse>(
      `/${WhatsappBusinessAccountId}/message_templates`,
      {
        params: {
          fields: 'name,category,status,id,language,components',
          limit: 100
        }
      }
    );
    return res.data;
  },

  create_MessageTemplate: async (templateData: CreateTemplatePayload): Promise<CreateTemplateResponse> => {
    // Transform payload to Meta format
    const metaPayload = PayloadTransformer.transformToMeta(templateData);
    
    const res = await client.post<CreateTemplateResponse>(
      `/${WhatsappBusinessAccountId}/message_templates`,
      metaPayload
    );
    return res.data;
  },

  delete_MessageTemplate: async (templateName: string, templateId: string): Promise<{ success: boolean }> => {
    const res = await client.delete<{ success: boolean }>(
      `/${WhatsappBusinessAccountId}/message_templates`,
      {
        params: {
          name: templateName,
          hsm_id: templateId,
        },
      }
    );
    return res.data;
  },

  // File upload using Meta's Resumable Upload API
  uploadFile: async (file: File): Promise<{ success: boolean; fileHandle?: string; error?: string }> => {
    try {
      if (!WhatsappAppId || !facebookAccessToken) {
        return {
          success: false,
          error: 'Missing Meta App ID or Access Token for file upload',
        };
      }

      const result = await metaUploadService.uploadFile(file);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during upload',
      };
    }
  },
};
