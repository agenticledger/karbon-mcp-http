/**
 * Karbon Practice Management API Client (v3)
 *
 * Base URL: https://api.karbonhq.com/v3
 * Auth: Dual header — AccessKey (JWT) + Authorization: Bearer (tenant key)
 * Filtering: OData-style ($filter, $select, $orderby, $top, $skip)
 * Responses: JSON
 */

const BASE_URL = 'https://api.karbonhq.com/v3';

export class KarbonClient {
  private accessKey: string;
  private bearerToken: string;

  constructor(accessKey: string, bearerToken: string) {
    this.accessKey = accessKey;
    this.bearerToken = bearerToken;
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: Record<string, any>;
      params?: Record<string, string | number | boolean | undefined>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params } = options;
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'AccessKey': this.accessKey,
      'Authorization': `Bearer ${this.bearerToken}`,
      'Accept': 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 204) return {} as T;

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Karbon API Error ${response.status}: ${text}`);
    }

    return response.json();
  }

  /**
   * Build OData query params from common filter options.
   */
  private buildODataParams(opts?: {
    top?: number;
    skip?: number;
    filter?: string;
    select?: string;
    orderby?: string;
    expand?: string;
  }): Record<string, string | number | undefined> {
    if (!opts) return {};
    return {
      $top: opts.top,
      $skip: opts.skip,
      $filter: opts.filter,
      $select: opts.select,
      $orderby: opts.orderby,
      $expand: opts.expand,
    };
  }

  // ──────────────────────────────────────────────────────
  // Client Groups
  // ──────────────────────────────────────────────────────

  async listClientGroups(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string }) {
    return this.request<any>('/ClientGroups', { params: this.buildODataParams(opts) });
  }

  async getClientGroup(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/ClientGroups/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  async createClientGroup(data: Record<string, any>) {
    return this.request<any>('/ClientGroups', { method: 'POST', body: data });
  }

  async updateClientGroup(key: string, data: Record<string, any>) {
    return this.request<any>(`/ClientGroups/${encodeURIComponent(key)}`, { method: 'PATCH', body: data });
  }

  // ──────────────────────────────────────────────────────
  // Contacts
  // ──────────────────────────────────────────────────────

  async listContacts(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string }) {
    return this.request<any>('/Contacts', { params: this.buildODataParams(opts) });
  }

  async getContact(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/Contacts/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  async createContact(data: Record<string, any>) {
    return this.request<any>('/Contacts', { method: 'POST', body: data });
  }

  async updateContact(key: string, data: Record<string, any>) {
    return this.request<any>(`/Contacts/${encodeURIComponent(key)}`, { method: 'PATCH', body: data });
  }

  // ──────────────────────────────────────────────────────
  // Organizations
  // ──────────────────────────────────────────────────────

  async listOrganizations(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string }) {
    return this.request<any>('/Organizations', { params: this.buildODataParams(opts) });
  }

  async getOrganization(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/Organizations/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  async createOrganization(data: Record<string, any>) {
    return this.request<any>('/Organizations', { method: 'POST', body: data });
  }

  async updateOrganization(key: string, data: Record<string, any>) {
    return this.request<any>(`/Organizations/${encodeURIComponent(key)}`, { method: 'PATCH', body: data });
  }

  // ──────────────────────────────────────────────────────
  // Work Items
  // ──────────────────────────────────────────────────────

  async listWorkItems(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string; expand?: string }) {
    return this.request<any>('/WorkItems', { params: this.buildODataParams(opts) });
  }

  async getWorkItem(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/WorkItems/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  async createWorkItem(data: Record<string, any>) {
    return this.request<any>('/WorkItems', { method: 'POST', body: data });
  }

  async updateWorkItem(key: string, data: Record<string, any>) {
    return this.request<any>(`/WorkItems/${encodeURIComponent(key)}`, { method: 'PATCH', body: data });
  }

  // ──────────────────────────────────────────────────────
  // Work Templates
  // ──────────────────────────────────────────────────────

  async listWorkTemplates(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string }) {
    return this.request<any>('/WorkTemplates', { params: this.buildODataParams(opts) });
  }

  async getWorkTemplate(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/WorkTemplates/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  // ──────────────────────────────────────────────────────
  // Work Schedules
  // ──────────────────────────────────────────────────────

  async getWorkSchedule(key: string, opts?: { select?: string; expand?: string }) {
    return this.request<any>(`/WorkSchedules/${encodeURIComponent(key)}`, { params: this.buildODataParams(opts) });
  }

  // ──────────────────────────────────────────────────────
  // Users
  // ──────────────────────────────────────────────────────

  async listUsers(opts?: { top?: number; skip?: number; select?: string }) {
    return this.request<any>('/Users', { params: this.buildODataParams(opts) });
  }

  async getUser(key: string) {
    return this.request<any>(`/Users/${encodeURIComponent(key)}`);
  }

  // ──────────────────────────────────────────────────────
  // Notes
  // ──────────────────────────────────────────────────────

  async createNote(data: Record<string, any>) {
    return this.request<any>('/Notes', { method: 'POST', body: data });
  }

  async getNote(key: string) {
    return this.request<any>(`/Notes/${encodeURIComponent(key)}`);
  }

  // ──────────────────────────────────────────────────────
  // Comments
  // ──────────────────────────────────────────────────────

  async getComment(key: string) {
    return this.request<any>(`/Comments/${encodeURIComponent(key)}`);
  }

  // ──────────────────────────────────────────────────────
  // Timesheets
  // ──────────────────────────────────────────────────────

  async listTimesheets(opts?: { top?: number; skip?: number; filter?: string; select?: string; orderby?: string; expand?: string }) {
    return this.request<any>('/Timesheets', { params: this.buildODataParams(opts) });
  }

  // ──────────────────────────────────────────────────────
  // Files
  // ──────────────────────────────────────────────────────

  async listFiles(entityType: string, entityKey: string) {
    return this.request<any>(`/FileList/${encodeURIComponent(entityType)}`, {
      params: { EntityKey: entityKey },
    });
  }

  // ──────────────────────────────────────────────────────
  // Custom Fields
  // ──────────────────────────────────────────────────────

  async listCustomFields() {
    return this.request<any>('/CustomFields');
  }

  async createCustomField(data: Record<string, any>) {
    return this.request<any>('/CustomFields', { method: 'POST', body: data });
  }

  async deleteCustomField(key: string) {
    return this.request<any>(`/CustomFields/${encodeURIComponent(key)}`, { method: 'DELETE' });
  }

  async getCustomFieldValues(entityKey: string) {
    return this.request<any>(`/CustomFieldValues/${encodeURIComponent(entityKey)}`);
  }

  async updateCustomFieldValues(entityKey: string, data: Record<string, any>) {
    return this.request<any>(`/CustomFieldValues/${encodeURIComponent(entityKey)}`, { method: 'PUT', body: data });
  }

  // ──────────────────────────────────────────────────────
  // Tenant Settings
  // ──────────────────────────────────────────────────────

  async getTenantSettings() {
    return this.request<any>('/TenantSettings');
  }

  // ──────────────────────────────────────────────────────
  // Webhook Subscriptions
  // ──────────────────────────────────────────────────────

  async listWebhookSubscriptions() {
    return this.request<any>('/WebhookSubscriptions');
  }

  async createWebhookSubscription(data: Record<string, any>) {
    return this.request<any>('/WebhookSubscriptions', { method: 'POST', body: data });
  }

  async deleteWebhookSubscription(key: string) {
    return this.request<any>(`/WebhookSubscriptions/${encodeURIComponent(key)}`, { method: 'DELETE' });
  }
}
