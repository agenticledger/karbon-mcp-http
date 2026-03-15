import { z } from 'zod';
import { KarbonClient } from './api-client.js';

/**
 * Karbon MCP Tool Definitions
 *
 * 30 tools covering: Client Groups, Contacts, Organizations,
 * Work Items, Work Templates, Work Schedules, Users, Notes,
 * Comments, Timesheets, Files, Custom Fields, Tenant Settings,
 * Webhook Subscriptions
 */

interface ToolDef {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (client: KarbonClient, args: any) => Promise<any>;
}

// Reusable OData pagination/filter params
const odataParams = {
  top: z.number().optional().describe('max results (OData $top)'),
  skip: z.number().optional().describe('offset (OData $skip)'),
  filter: z.string().optional().describe('OData $filter expression'),
  select: z.string().optional().describe('fields to return ($select)'),
  orderby: z.string().optional().describe('sort ($orderby)'),
};

export const tools: ToolDef[] = [
  // --- Client Groups (4) ---
  {
    name: 'client_groups_list',
    description: 'List client groups',
    inputSchema: z.object({ ...odataParams }),
    handler: async (client: KarbonClient, args: any) =>
      client.listClientGroups(args),
  },
  {
    name: 'client_group_get',
    description: 'Get client group by key',
    inputSchema: z.object({
      key: z.string().describe('client group key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getClientGroup(args.key, args),
  },
  {
    name: 'client_group_create',
    description: 'Create a client group',
    inputSchema: z.object({
      Name: z.string().describe('group name'),
      Description: z.string().optional().describe('description'),
      data: z.string().optional().describe('full JSON body override'),
    }),
    handler: async (client: KarbonClient, args: any) => {
      const body = args.data ? JSON.parse(args.data) : { Name: args.Name, Description: args.Description };
      return client.createClientGroup(body);
    },
  },
  {
    name: 'client_group_update',
    description: 'Update a client group',
    inputSchema: z.object({
      key: z.string().describe('client group key'),
      data: z.string().describe('JSON fields to update'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.updateClientGroup(args.key, JSON.parse(args.data)),
  },

  // --- Contacts (4) ---
  {
    name: 'contacts_list',
    description: 'List contacts',
    inputSchema: z.object({ ...odataParams }),
    handler: async (client: KarbonClient, args: any) =>
      client.listContacts(args),
  },
  {
    name: 'contact_get',
    description: 'Get contact by key',
    inputSchema: z.object({
      key: z.string().describe('contact key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getContact(args.key, args),
  },
  {
    name: 'contact_create',
    description: 'Create a contact',
    inputSchema: z.object({
      FirstName: z.string().describe('first name'),
      LastName: z.string().describe('last name'),
      EmailAddress: z.string().optional().describe('email'),
      PhoneNumber: z.string().optional().describe('phone'),
      data: z.string().optional().describe('full JSON body override'),
    }),
    handler: async (client: KarbonClient, args: any) => {
      const body = args.data ? JSON.parse(args.data) : {
        FirstName: args.FirstName, LastName: args.LastName,
        EmailAddress: args.EmailAddress, PhoneNumber: args.PhoneNumber,
      };
      return client.createContact(body);
    },
  },
  {
    name: 'contact_update',
    description: 'Update a contact',
    inputSchema: z.object({
      key: z.string().describe('contact key'),
      data: z.string().describe('JSON fields to update'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.updateContact(args.key, JSON.parse(args.data)),
  },

  // --- Organizations (4) ---
  {
    name: 'organizations_list',
    description: 'List organizations',
    inputSchema: z.object({ ...odataParams }),
    handler: async (client: KarbonClient, args: any) =>
      client.listOrganizations(args),
  },
  {
    name: 'organization_get',
    description: 'Get organization by key',
    inputSchema: z.object({
      key: z.string().describe('organization key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getOrganization(args.key, args),
  },
  {
    name: 'organization_create',
    description: 'Create an organization',
    inputSchema: z.object({
      Name: z.string().describe('organization name'),
      data: z.string().optional().describe('full JSON body override'),
    }),
    handler: async (client: KarbonClient, args: any) => {
      const body = args.data ? JSON.parse(args.data) : { Name: args.Name };
      return client.createOrganization(body);
    },
  },
  {
    name: 'organization_update',
    description: 'Update an organization',
    inputSchema: z.object({
      key: z.string().describe('organization key'),
      data: z.string().describe('JSON fields to update'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.updateOrganization(args.key, JSON.parse(args.data)),
  },

  // --- Work Items (4) ---
  {
    name: 'work_items_list',
    description: 'List work items',
    inputSchema: z.object({
      ...odataParams,
      expand: z.string().optional().describe('expand related (e.g. Todos)'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.listWorkItems(args),
  },
  {
    name: 'work_item_get',
    description: 'Get work item by key',
    inputSchema: z.object({
      key: z.string().describe('work item key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getWorkItem(args.key, args),
  },
  {
    name: 'work_item_create',
    description: 'Create a work item',
    inputSchema: z.object({
      Title: z.string().describe('work item title'),
      WorkTypeKey: z.string().optional().describe('work type key'),
      ClientGroupKey: z.string().optional().describe('client group key'),
      data: z.string().optional().describe('full JSON body override'),
    }),
    handler: async (client: KarbonClient, args: any) => {
      const body = args.data ? JSON.parse(args.data) : {
        Title: args.Title, WorkTypeKey: args.WorkTypeKey,
        ClientGroupKey: args.ClientGroupKey,
      };
      return client.createWorkItem(body);
    },
  },
  {
    name: 'work_item_update',
    description: 'Update a work item',
    inputSchema: z.object({
      key: z.string().describe('work item key'),
      data: z.string().describe('JSON fields to update'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.updateWorkItem(args.key, JSON.parse(args.data)),
  },

  // --- Work Templates (2) ---
  {
    name: 'work_templates_list',
    description: 'List work templates',
    inputSchema: z.object({ ...odataParams }),
    handler: async (client: KarbonClient, args: any) =>
      client.listWorkTemplates(args),
  },
  {
    name: 'work_template_get',
    description: 'Get work template by key',
    inputSchema: z.object({
      key: z.string().describe('work template key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getWorkTemplate(args.key, args),
  },

  // --- Work Schedules (1) ---
  {
    name: 'work_schedule_get',
    description: 'Get work schedule by key',
    inputSchema: z.object({
      key: z.string().describe('work schedule key'),
      select: z.string().optional().describe('fields to return'),
      expand: z.string().optional().describe('related entities'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getWorkSchedule(args.key, args),
  },

  // --- Users (2) ---
  {
    name: 'users_list',
    description: 'List users',
    inputSchema: z.object({
      top: z.number().optional().describe('max results'),
      skip: z.number().optional().describe('offset'),
      select: z.string().optional().describe('fields to return'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.listUsers(args),
  },
  {
    name: 'user_get',
    description: 'Get user by key',
    inputSchema: z.object({
      key: z.string().describe('user key'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getUser(args.key),
  },

  // --- Notes (2) ---
  {
    name: 'note_create',
    description: 'Create a note',
    inputSchema: z.object({
      Subject: z.string().describe('note subject'),
      Body: z.string().optional().describe('note body (HTML)'),
      data: z.string().optional().describe('full JSON body override'),
    }),
    handler: async (client: KarbonClient, args: any) => {
      const body = args.data ? JSON.parse(args.data) : { Subject: args.Subject, Body: args.Body };
      return client.createNote(body);
    },
  },
  {
    name: 'note_get',
    description: 'Get note by key',
    inputSchema: z.object({
      key: z.string().describe('note key'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getNote(args.key),
  },

  // --- Timesheets (1) ---
  {
    name: 'timesheets_list',
    description: 'List timesheets with time entries',
    inputSchema: z.object({
      ...odataParams,
      expand: z.string().optional().describe('expand TimeEntries'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.listTimesheets(args),
  },

  // --- Files (1) ---
  {
    name: 'files_list',
    description: 'List files for an entity',
    inputSchema: z.object({
      entityType: z.enum(['WorkItem', 'Contact', 'Organization']).describe('entity type'),
      entityKey: z.string().describe('entity key'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.listFiles(args.entityType, args.entityKey),
  },

  // --- Custom Fields (3) ---
  {
    name: 'custom_fields_list',
    description: 'List custom field definitions',
    inputSchema: z.object({}),
    handler: async (client: KarbonClient) =>
      client.listCustomFields(),
  },
  {
    name: 'custom_field_values_get',
    description: 'Get custom field values for an entity',
    inputSchema: z.object({
      entityKey: z.string().describe('entity key'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.getCustomFieldValues(args.entityKey),
  },
  {
    name: 'custom_field_values_update',
    description: 'Update custom field values for an entity',
    inputSchema: z.object({
      entityKey: z.string().describe('entity key'),
      data: z.string().describe('JSON custom field values'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.updateCustomFieldValues(args.entityKey, JSON.parse(args.data)),
  },

  // --- Tenant Settings (1) ---
  {
    name: 'tenant_settings_get',
    description: 'Get account settings (work types, statuses)',
    inputSchema: z.object({}),
    handler: async (client: KarbonClient) =>
      client.getTenantSettings(),
  },

  // --- Webhook Subscriptions (2) ---
  {
    name: 'webhooks_list',
    description: 'List webhook subscriptions',
    inputSchema: z.object({}),
    handler: async (client: KarbonClient) =>
      client.listWebhookSubscriptions(),
  },
  {
    name: 'webhook_create',
    description: 'Create a webhook subscription',
    inputSchema: z.object({
      TargetUrl: z.string().describe('HTTPS callback URL'),
      WebhookType: z.enum([
        'Contact', 'Organization', 'ClientGroup', 'WorkItem',
        'User', 'Note', 'Invoice', 'EstimateSummary',
      ]).describe('event type to subscribe'),
      SigningKey: z.string().optional().describe('HMAC signing key'),
    }),
    handler: async (client: KarbonClient, args: any) =>
      client.createWebhookSubscription(args),
  },
];
