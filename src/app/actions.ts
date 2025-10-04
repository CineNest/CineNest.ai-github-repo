'use server';

import {
  automatePrePostProductionTasks,
  type AutomatePrePostProductionTasksInput,
} from '@/ai/flows/automate-pre-post-production-tasks';
import {
  analyzeTicketSalesData,
  type AnalyzeTicketSalesDataInput,
} from '@/ai/flows/analyze-ticket-sales-data';
import {
  ensureLegalCompliance,
  type EnsureLegalComplianceInput,
} from '@/ai/flows/ensure-legal-compliance';
import {
  generateLocationContract,
  type GenerateLocationContractInput,
} from '@/ai/flows/generate-location-contract';
import {
  processUploadedScript,
  type ProcessUploadedScriptInput,
} from '@/ai/flows/process-uploaded-script';

export async function generateContractAction(input: GenerateLocationContractInput) {
  try {
    const result = await generateLocationContract(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in generateContractAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function automateTaskAction(input: AutomatePrePostProductionTasksInput) {
  try {
    const result = await automatePrePostProductionTasks(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in automateTaskAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function analyzeSalesAction(input: AnalyzeTicketSalesDataInput) {
  try {
    const result = await analyzeTicketSalesData(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in analyzeSalesAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function checkComplianceAction(input: EnsureLegalComplianceInput) {
  try {
    const result = await ensureLegalCompliance(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in checkComplianceAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function processScriptAction(input: ProcessUploadedScriptInput) {
  try {
    const result = await processUploadedScript(input);
    // Note: The prompt asks for a 'success' status, but the Genkit flow returns the summary directly.
    // We will wrap it here to match the expected output structure.
    return { success: true, data: { status: 'success', summary: result.summary } };
  } catch (error: any) {
    console.error('Error in processScriptAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
