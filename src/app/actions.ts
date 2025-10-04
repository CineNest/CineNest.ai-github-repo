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
  scriptBreakdown,
  type ScriptBreakdownInput,
} from '@/ai/flows/script-breakdown-flow';
import {
  generateSchedule,
  type GenerateScheduleInput,
} from '@/ai/flows/generate-schedule-flow';
import {
  suggestCrew,
  type SuggestCrewInput,
} from '@/ai/flows/suggest-crew-flow';

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

export async function scriptBreakdownAction(input: ScriptBreakdownInput) {
  try {
    const result = await scriptBreakdown(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in scriptBreakdownAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function generateScheduleAction(input: GenerateScheduleInput) {
  try {
    const result = await generateSchedule(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in generateScheduleAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function suggestCrewAction(input: SuggestCrewInput) {
  try {
    const result = await suggestCrew(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in suggestCrewAction:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}