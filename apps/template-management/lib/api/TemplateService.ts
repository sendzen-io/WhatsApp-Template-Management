import axios from 'axios';
import { CreateTemplatePayload, CreateTemplateResponse, GetAllTemplatesResponse } from '@workspace/ui-template-management/types/templateTypes';

const BASE_URL = 'https://graph.facebook.com/v23.0';
const WhatsappBusinessAccountId = process.env.NEXT_PUBLIC_BUSINESS_ACCOUNT_ID;
const facebookAccessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${facebookAccessToken}`,
    'Content-Type': 'application/json',
  },
});

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
    const res = await client.post<CreateTemplateResponse>(
      `/${WhatsappBusinessAccountId}/message_templates`,
      templateData
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
};
