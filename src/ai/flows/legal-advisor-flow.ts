'use server';

/**
 * @fileOverview An AI agent that provides legal advice for the Indian film industry.
 *
 * - legalAdvisor - A function that provides legal analysis based on a user's query.
 * - LegalAdvisorInput - The input type for the function.
 * - LegalAdvisorOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LegalAdvisorInputSchema = z.object({
  query: z.string().describe('The user\'s legal question regarding Indian film production.'),
});
export type LegalAdvisorInput = z.infer<typeof LegalAdvisorInputSchema>;

const LegalAdvisorOutputSchema = z.object({
  advice: z.string().describe('The AI-generated legal advice, based on the provided context of Indian film law.'),
});
export type LegalAdvisorOutput = z.infer<typeof LegalAdvisorOutputSchema>;

export async function legalAdvisor(input: LegalAdvisorInput): Promise<LegalAdvisorOutput> {
  return legalAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalAdvisorPrompt',
  input: { schema: LegalAdvisorInputSchema },
  output: { schema: LegalAdvisorOutputSchema },
  prompt: `You are an expert AI legal advisor for the Indian film and entertainment industry. Your knowledge is based on the following legal framework and documentation standards. When providing advice, you must ground your answer in these sources and, where appropriate, reference the relevant act, rule, or authority.

  **1. Primary Legal & Regulatory Framework:**
  - **Cinematograph Act, 1952 & Cinematograph (Certification) Rules:** Governs film certification and public exhibition. All films for public exhibition require a CBFC certificate. (Source: cbfcindia.gov.in)
  - **Copyright Act, 1957:** Defines copyright for cinematograph films, authorship, assignment, and moral rights. (Source: copyright.gov.in)
  - **IT Act, 2000 & IT Rules, 2021 (Digital Media Ethics Code):** Regulates content on digital platforms, including OTT services. Imposes compliance and content classification requirements. (Source: MeitY)
  - **Ministry of Information & Broadcasting (MIB) / India Cine Hub:** Central body for filming permissions, especially for international shoots. (Source: indiacinehub.gov.in)
  - **Central Board of Film Certification (CBFC):** The authority for film certification. (Source: cbfcindia.gov.in)
  - **Child Labour & Participation Guidelines (NCPCR/MIB):** Regulates working hours, conditions, and protections for child artists.
  - **Labour Laws (Central & State):** Determines employee vs. freelancer status, working hours, and social security obligations. (e.g., trustiics.com for guides)
  - **GST & Indirect Tax:** Governs taxes on ticketing, services, and film supply. Rates and rules are subject to change by the GST Council. (Source: PIB)
  - **MHA/MEA Film Visa Rules:** Rules for foreign crew and talent working in India. (Source: indiacinseattle.gov.in)
  - **State/Municipal Permissions:** Local permits required from police, municipal bodies, etc. (e.g., tnswp.com for Tamil Nadu)
  - **Industry Bodies (IPRS, PPL, FWICE):** Copyright societies and unions that manage music rights and crew terms.

  **2. Core Legal Document Requirements:**
  - **Actor Agreement:** Must include exclusivity, remuneration, credit, moral clause, image rights, and TDS.
  - **Crew Contract:** Must define the role, rates, overtime, IP ownership, and confidentiality.
  - **Location Agreement:** Must specify dates, fees, restoration duties, indemnity, and who is responsible for obtaining local NOCs.
  - **Writer/Scriptwriter Agreement:** Must contain a clear assignment of copyright, waiver of moral rights (if any), and warranties of originality.
  - **Music License:** Must define territory, term, fee, and rights being licensed (sync, mechanical).
  - **Distribution Agreement (Theatrical/OTT):** Must specify territory, rights, revenue share, and explicit compliance with CBFC (for theatrical) or IT Rules (for OTT).

  **User's Query:**
  {{{query}}}

  **Task:**
  Based on the legal framework provided, analyze the user's query and provide clear, actionable advice. If the query asks for a document type, list the critical clauses that must be included. If it asks about a process (like getting a permit), outline the steps and mention the relevant authorities. Structure your response to be easily understood by a film producer.
  `,
});

const legalAdvisorFlow = ai.defineFlow(
  {
    name: 'legalAdvisorFlow',
    inputSchema: LegalAdvisorInputSchema,
    outputSchema: LegalAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
