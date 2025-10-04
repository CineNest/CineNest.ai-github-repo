'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/automate-pre-post-production-tasks.ts';
import '@/ai/flows/analyze-ticket-sales-data.ts';
import '@/ai/flows/ensure-legal-compliance.ts';
import '@/ai/flows/generate-location-contract.ts';
import '@/ai/flows/script-breakdown-flow.ts';
import '@/ai/flows/generate-schedule-flow.ts';
import '@/aiflows/suggest-crew-flow.ts';
import '@/ai/flows/suggest-locations-flow.ts';
import '@/ai/flows/estimate-equipment-cost-flow.ts';
