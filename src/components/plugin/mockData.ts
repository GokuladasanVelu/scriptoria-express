// Avivo Word Plugin - Mock Data

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  selectedText?: string;
}

export interface Clause {
  id: string;
  title: string;
  category: string;
  contractType: string;
  riskLevel: 'low' | 'medium' | 'high';
  text: string;
  description: string;
  marketStandard: number; // percentage
  tags: string[];
  variables?: string[];
}

export interface ReviewFinding {
  id: string;
  type: 'language' | 'risk' | 'obligation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  clause?: string;
  suggestion?: string;
  party?: string;
  deadline?: string;
  reviewed?: boolean;
}

export interface PlaybookCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed';
  description: string;
  impact: string;
  remediation?: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  category: string;
  checks: number;
}

// -- Mock Clauses --
export const mockClauses: Clause[] = [
  {
    id: 'c1',
    title: 'Standard Liability Cap',
    category: 'Liability',
    contractType: 'MSA',
    riskLevel: 'low',
    text: 'The total aggregate liability of either Party under this Agreement shall not exceed the total fees paid or payable by Client to Provider in the twelve (12) month period immediately preceding the event giving rise to such liability.',
    description: 'Caps total liability at 12 months of fees paid. Industry standard approach.',
    marketStandard: 85,
    tags: ['Liability Cap', 'Limitation'],
    variables: ['[PERIOD]', '[MULTIPLIER]'],
  },
  {
    id: 'c2',
    title: 'Mutual Indemnification',
    category: 'Indemnification',
    contractType: 'MSA',
    riskLevel: 'medium',
    text: 'Each Party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other Party (the "Indemnified Party") from and against any third-party claims, damages, losses, and expenses arising from: (a) the Indemnifying Party\'s breach of this Agreement; (b) the Indemnifying Party\'s negligence or willful misconduct; or (c) any violation of applicable law by the Indemnifying Party.',
    description: 'Balanced mutual indemnification covering breach, negligence, and legal violations.',
    marketStandard: 72,
    tags: ['Indemnification', 'Mutual'],
  },
  {
    id: 'c3',
    title: 'Termination for Convenience',
    category: 'Termination',
    contractType: 'SLA',
    riskLevel: 'low',
    text: 'Either Party may terminate this Agreement for convenience upon [NOTICE_PERIOD] days\' prior written notice to the other Party. Upon such termination, Client shall pay Provider for all Services performed and expenses incurred through the effective date of termination.',
    description: 'Allows either party to exit with notice period. Includes payment for work completed.',
    marketStandard: 90,
    tags: ['Termination', 'Convenience'],
    variables: ['[NOTICE_PERIOD]'],
  },
  {
    id: 'c4',
    title: 'Confidentiality with Carve-Outs',
    category: 'Confidentiality',
    contractType: 'NDA',
    riskLevel: 'low',
    text: 'The Receiving Party shall maintain the confidentiality of all Confidential Information and shall not disclose such information to any third party without the prior written consent of the Disclosing Party. This obligation shall not apply to information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was known to the Receiving Party prior to disclosure; (c) is independently developed without use of Confidential Information; or (d) is required to be disclosed by law or court order.',
    description: 'Standard confidentiality with four common carve-outs.',
    marketStandard: 95,
    tags: ['Confidentiality', 'NDA', 'Standard'],
  },
  {
    id: 'c5',
    title: 'Force Majeure',
    category: 'Miscellaneous',
    contractType: 'MSA',
    riskLevel: 'low',
    text: 'Neither Party shall be liable for any failure or delay in performance under this Agreement due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemics, war, terrorism, government actions, or failures of third-party telecommunications or power supply.',
    description: 'Standard force majeure clause covering common uncontrollable events.',
    marketStandard: 88,
    tags: ['Force Majeure', 'Boilerplate'],
  },
  {
    id: 'c6',
    title: 'Data Processing Agreement (DPA)',
    category: 'Data Protection',
    contractType: 'MSA',
    riskLevel: 'high',
    text: 'Provider shall process Personal Data only in accordance with Client\'s documented instructions and applicable Data Protection Laws. Provider shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, pseudonymization, and regular security testing.',
    description: 'GDPR-compliant data processing terms. Essential for any contract involving personal data.',
    marketStandard: 78,
    tags: ['GDPR', 'Data Protection', 'DPA'],
  },
];

// -- Mock Review Findings --
export const mockLanguageFindings: ReviewFinding[] = [
  { id: 'l1', type: 'language', severity: 'medium', title: 'Passive voice overuse', description: 'Section 3.2 uses excessive passive voice: "shall be provided by" → "Provider shall provide"', clause: 'Section 3.2', suggestion: 'Provider shall provide the Services in accordance with the Statement of Work.' },
  { id: 'l2', type: 'language', severity: 'low', title: 'Undefined term', description: '"Deliverables" is used in Section 4.1 but not defined in the Definitions section.', clause: 'Section 4.1', suggestion: 'Add "Deliverables" to Section 1 Definitions.' },
  { id: 'l3', type: 'language', severity: 'high', title: 'Ambiguous timeline', description: '"Reasonable time" in Section 5.3 is vague and could lead to disputes.', clause: 'Section 5.3', suggestion: 'Replace with specific timeframe: "within thirty (30) business days"' },
  { id: 'l4', type: 'language', severity: 'low', title: 'Inconsistent capitalization', description: '"agreement" appears lowercase in Section 7 but capitalized elsewhere.', clause: 'Section 7', suggestion: 'Capitalize "Agreement" consistently throughout.' },
  { id: 'l5', type: 'language', severity: 'medium', title: 'Run-on sentence', description: 'Section 8.1 contains a 78-word sentence that reduces readability.', clause: 'Section 8.1', suggestion: 'Break into two or three shorter sentences for clarity.' },
];

export const mockRiskFindings: ReviewFinding[] = [
  { id: 'r1', type: 'risk', severity: 'critical', title: 'Unlimited liability exposure', description: 'No limitation of liability clause found. Provider faces unlimited financial exposure.', clause: 'Missing', suggestion: 'Insert a Standard Liability Cap clause limiting aggregate liability to 12 months of fees.' },
  { id: 'r2', type: 'risk', severity: 'high', title: 'One-sided termination rights', description: 'Client can terminate for convenience with 15 days notice, but Provider requires 90 days.', clause: 'Section 9.2', suggestion: 'Negotiate equal termination notice periods (30-60 days) for both parties.' },
  { id: 'r3', type: 'risk', severity: 'high', title: 'Broad IP assignment', description: 'Section 6.1 assigns all work product IP to Client including pre-existing IP.', clause: 'Section 6.1', suggestion: 'Carve out pre-existing IP with a license-back provision.' },
  { id: 'r4', type: 'risk', severity: 'medium', title: 'Auto-renewal without cap', description: 'Agreement auto-renews annually with no maximum term specified.', clause: 'Section 9.1', suggestion: 'Add a maximum renewal term or sunset clause.' },
  { id: 'r5', type: 'risk', severity: 'medium', title: 'Uncapped indemnification', description: 'Indemnification obligations in Section 8 have no monetary cap.', clause: 'Section 8', suggestion: 'Subject indemnification to the overall liability cap.' },
];

export const mockObligationFindings: ReviewFinding[] = [
  { id: 'o1', type: 'obligation', severity: 'high', title: 'Monthly reporting requirement', description: 'Provider must deliver monthly performance reports within 5 business days of month-end.', clause: 'Section 3.4', party: 'Provider', deadline: '5 business days after month-end' },
  { id: 'o2', type: 'obligation', severity: 'medium', title: 'Insurance maintenance', description: 'Provider must maintain $2M professional liability insurance throughout the term.', clause: 'Section 10.2', party: 'Provider', deadline: 'Ongoing' },
  { id: 'o3', type: 'obligation', severity: 'high', title: 'Data breach notification', description: 'Provider must notify Client of any data breach within 24 hours of discovery.', clause: 'Section 7.3', party: 'Provider', deadline: '24 hours' },
  { id: 'o4', type: 'obligation', severity: 'low', title: 'Annual compliance audit', description: 'Client has the right to conduct one annual compliance audit with 30 days notice.', clause: 'Section 10.4', party: 'Client', deadline: 'Annual, 30 days notice' },
  { id: 'o5', type: 'obligation', severity: 'medium', title: 'Payment terms', description: 'Client shall pay all undisputed invoices within 30 days of receipt.', clause: 'Section 4.2', party: 'Client', deadline: 'Net 30' },
  { id: 'o6', type: 'obligation', severity: 'high', title: 'SLA response times', description: 'Provider must respond to critical issues within 1 hour during business hours.', clause: 'Section 3.5', party: 'Provider', deadline: '1 hour (critical)' },
];

// -- Mock Playbooks --
export const mockPlaybooks: Playbook[] = [
  { id: 'pb1', name: 'GDPR Data Protection Compliance', description: 'Validates contract against EU General Data Protection Regulation requirements including data processing terms, cross-border transfers, and data subject rights.', category: 'Compliance', checks: 12 },
  { id: 'pb2', name: 'Enterprise SLA Standards', description: 'Checks service level agreements against enterprise best practices including uptime guarantees, support tiers, and escalation procedures.', category: 'Quality', checks: 8 },
  { id: 'pb3', name: 'Risk Assessment Framework', description: 'Comprehensive risk analysis covering liability exposure, indemnification balance, IP ownership, and termination fairness.', category: 'Risk', checks: 15 },
  { id: 'pb4', name: 'NDA Best Practices', description: 'Validates non-disclosure agreements against standard market terms for scope, duration, and permitted disclosures.', category: 'Template', checks: 10 },
];

export const mockPlaybookResults: PlaybookCheck[] = [
  { id: 'pc1', name: 'Data Processing Agreement present', status: 'failed', description: 'Contract must include explicit data processing terms per GDPR Article 28.', impact: 'Non-compliance with GDPR; potential fines up to 4% of annual revenue.', remediation: 'Insert a Data Processing Agreement (DPA) clause from the Clause Library.' },
  { id: 'pc2', name: 'Lawful basis for processing specified', status: 'warning', description: 'The contract references data processing but does not specify the lawful basis.', impact: 'May be challenged by data protection authorities during an audit.', remediation: 'Add explicit reference to lawful basis (e.g., legitimate interest, consent, contractual necessity).' },
  { id: 'pc3', name: 'Data breach notification timeline', status: 'passed', description: 'Contract requires 24-hour breach notification, meeting the 72-hour GDPR requirement.', impact: 'Compliant with Article 33 notification requirements.' },
  { id: 'pc4', name: 'Sub-processor provisions', status: 'warning', description: 'Contract allows sub-processing but lacks prior written consent requirement.', impact: 'Risk of unauthorized data access by unknown third parties.', remediation: 'Add requirement for prior written consent before engaging sub-processors.' },
  { id: 'pc5', name: 'Cross-border transfer safeguards', status: 'passed', description: 'Standard contractual clauses are referenced for international data transfers.', impact: 'Compliant with Chapter V transfer requirements.' },
  { id: 'pc6', name: 'Data subject rights procedures', status: 'passed', description: 'Contract includes obligations to assist with data subject access requests.', impact: 'Compliant with Articles 15-22 requirements.' },
  { id: 'pc7', name: 'Data retention and deletion', status: 'warning', description: 'Retention period is stated but deletion procedures are not detailed.', impact: 'May not meet storage limitation principle requirements.', remediation: 'Add specific data deletion procedures and certification requirements upon contract termination.' },
  { id: 'pc8', name: 'Security measures specified', status: 'passed', description: 'Contract includes requirements for encryption, access controls, and regular testing.', impact: 'Meets Article 32 security requirements.' },
  { id: 'pc9', name: 'Data Protection Impact Assessment', status: 'passed', description: 'DPIA obligations are referenced for high-risk processing activities.', impact: 'Compliant with Article 35 requirements.' },
  { id: 'pc10', name: 'Records of processing activities', status: 'passed', description: 'Provider is required to maintain processing records per Article 30.', impact: 'Meets documentation requirements.' },
  { id: 'pc11', name: 'DPO contact information', status: 'passed', description: 'Data Protection Officer contact details are included in the contract.', impact: 'Meets Article 37-39 requirements.' },
  { id: 'pc12', name: 'Audit rights for data processing', status: 'passed', description: 'Client has the right to audit Provider\'s data processing activities.', impact: 'Compliant with Article 28(3)(h) audit requirements.' },
];

// -- Mock AI Responses --
export const mockAIResponses: Record<string, { answer: string; followUps: string[] }> = {
  default: {
    answer: 'Based on my analysis of the contract, I can help you understand this provision better. The clause establishes mutual obligations between the parties with specific conditions and timelines. Would you like me to break down any particular aspect?',
    followUps: ['What are the key risks?', 'What obligations does this create?', 'Is this market standard?'],
  },
  'payment terms': {
    answer: '**Payment Terms Analysis:**\n\nThe contract specifies Net 30 payment terms (Section 4.2). Key points:\n\n• **Invoice frequency:** Monthly, due within 30 days of receipt\n• **Late payment:** 1.5% monthly interest on overdue amounts\n• **Disputed invoices:** Must be raised within 15 days with written explanation\n• **Currency:** All payments in USD\n\n⚠️ **Note:** The late payment interest rate of 1.5%/month (18% annually) is above the typical market rate of 1%/month. Consider negotiating this down.',
    followUps: ['Can we negotiate the late payment rate?', 'What happens if we dispute an invoice?', 'Are there any hidden fees?'],
  },
  'breach': {
    answer: '**Breach Consequences Analysis:**\n\nIf this clause is breached, several consequences may apply:\n\n1. **Material Breach:** The non-breaching party may terminate the Agreement with 30 days written notice and cure period\n2. **Financial Exposure:** Without a liability cap, damages could be unlimited\n3. **Indemnification:** The breaching party must indemnify for third-party claims\n4. **Injunctive Relief:** Section 7.5 allows the non-breaching party to seek injunctive relief without posting bond\n\n🔴 **Critical Risk:** The absence of a liability cap means breach exposure is theoretically unlimited. This is a significant negotiation point.',
    followUps: ['How can we limit our exposure?', 'What is the cure period?', 'Should we add a liability cap?'],
  },
  'termination': {
    answer: '**Termination Provisions Summary:**\n\nThe contract includes three termination mechanisms:\n\n1. **For Convenience (Section 9.2):**\n   - Client: 15 days notice ✅\n   - Provider: 90 days notice ⚠️\n   - *Imbalanced — consider negotiating equal periods*\n\n2. **For Cause (Section 9.3):**\n   - 30-day cure period after written notice\n   - Applies to material breach by either party\n\n3. **Automatic Termination:**\n   - Insolvency or bankruptcy of either party\n   - Force majeure exceeding 90 days\n\n**Post-Termination:** Client must pay for all work performed through termination date. Confidentiality survives for 3 years.',
    followUps: ['Can we equalize the notice periods?', 'What survives termination?', 'Is the cure period sufficient?'],
  },
};

// -- Dummy Contract HTML --
export const dummyContractHTML = `<h1 style="text-align:center;font-size:18pt;font-weight:bold;margin-bottom:6pt">MASTER SERVICES AGREEMENT</h1>
<p style="text-align:center;font-size:10pt;color:#555;margin-bottom:18pt">Effective Date: January 15, 2025</p>

<p>This Master Services Agreement ("Agreement") is entered into as of the Effective Date by and between:</p>
<p><strong>Acme Corporation</strong>, a Delaware corporation with principal offices at 100 Innovation Drive, San Francisco, CA 94105 ("Client")</p>
<p>and</p>
<p><strong>TechServ Solutions Inc.</strong>, a California corporation with principal offices at 500 Market Street, Suite 300, San Francisco, CA 94103 ("Provider")</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">RECITALS</h2>
<p>WHEREAS, Client desires to engage Provider to provide certain professional services; and</p>
<p>WHEREAS, Provider has the expertise, personnel, and resources necessary to perform such services;</p>
<p>NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the parties agree as follows:</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">1. DEFINITIONS</h2>
<p>1.1 "Confidential Information" means any non-public information disclosed by either party to the other, whether orally, in writing, or in electronic form, that is designated as confidential or that reasonably should be understood to be confidential.</p>
<p>1.2 "Services" means the professional, technical, and consulting services to be provided by Provider as described in one or more Statements of Work.</p>
<p>1.3 "Statement of Work" or "SOW" means a written document executed by both parties that describes the specific Services, deliverables, timeline, and fees.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">2. SCOPE OF SERVICES</h2>
<p>2.1 Provider shall perform the Services as described in each SOW in a professional and workmanlike manner.</p>
<p>2.2 Provider shall assign qualified personnel with appropriate skills and experience to perform the Services.</p>
<p>2.3 All Services shall be provided in accordance with industry best practices and applicable laws and regulations.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">3. SERVICE LEVELS</h2>
<p>3.1 Provider shall maintain a minimum uptime of 99.5% for all hosted services, measured monthly.</p>
<p>3.2 Support services shall be provided by Provider during business hours (8:00 AM - 6:00 PM Pacific Time, Monday through Friday).</p>
<p>3.3 Response times for reported issues shall be as follows: Critical - 1 hour; High - 4 hours; Medium - 8 hours; Low - 24 hours.</p>
<p>3.4 Provider shall deliver monthly performance reports within 5 business days of each month-end.</p>
<p>3.5 In the event Provider fails to meet the service levels specified herein, Client shall be entitled to service credits equal to 5% of monthly fees for each percentage point below the guaranteed uptime.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">4. FEES AND PAYMENT</h2>
<p>4.1 Client shall pay Provider the fees specified in each SOW. All fees are in United States Dollars.</p>
<p>4.2 Provider shall invoice Client monthly. Client shall pay all undisputed invoices within thirty (30) days of receipt.</p>
<p>4.3 Late payments shall accrue interest at a rate of 1.5% per month, or the maximum rate permitted by applicable law, whichever is less.</p>
<p>4.4 Client may dispute any invoice in good faith by providing written notice within fifteen (15) days of receipt, specifying the nature and basis of the dispute.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">5. CONFIDENTIALITY</h2>
<p>5.1 Each party agrees to maintain the confidentiality of the other party's Confidential Information and to use such information solely for the purposes of this Agreement.</p>
<p>5.2 The obligations of confidentiality shall not apply to information that: (a) is or becomes publicly available; (b) was previously known to the receiving party; (c) is independently developed; or (d) is disclosed pursuant to legal requirement.</p>
<p>5.3 Upon termination of this Agreement, each party shall return or destroy all Confidential Information within a reasonable time.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">6. INTELLECTUAL PROPERTY</h2>
<p>6.1 All work product, inventions, and materials created by Provider in the performance of Services shall be the exclusive property of Client, including all intellectual property rights therein.</p>
<p>6.2 Provider hereby assigns to Client all right, title, and interest in and to such work product.</p>
<p>6.3 Provider retains no rights in any deliverables or work product created under this agreement.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">7. DATA PROTECTION</h2>
<p>7.1 Provider shall comply with all applicable data protection laws and regulations in the performance of Services.</p>
<p>7.2 Provider shall implement appropriate technical and organizational measures to protect personal data.</p>
<p>7.3 In the event of a data breach, Provider shall notify Client within twenty-four (24) hours of discovery and shall cooperate fully in any investigation and remediation efforts.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">8. INDEMNIFICATION</h2>
<p>8.1 Provider shall indemnify defend and hold harmless Client and its officers directors employees and agents from and against any and all claims damages losses costs and expenses including reasonable attorneys' fees arising out of or relating to Provider's breach of this Agreement negligence or willful misconduct or violation of applicable law.</p>
<p>8.2 Client shall indemnify Provider against claims arising from Client's use of deliverables in violation of applicable law.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">9. TERM AND TERMINATION</h2>
<p>9.1 This agreement shall commence on the Effective Date and shall continue for an initial term of twelve (12) months, automatically renewing for successive twelve-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.</p>
<p>9.2 Client may terminate this Agreement for convenience upon fifteen (15) days' prior written notice. Provider may terminate for convenience upon ninety (90) days' prior written notice.</p>
<p>9.3 Either party may terminate this Agreement for cause upon thirty (30) days' written notice if the other party materially breaches this Agreement and fails to cure such breach within the notice period.</p>

<h2 style="font-size:14pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt">10. MISCELLANEOUS</h2>
<p>10.1 This Agreement shall be governed by the laws of the State of California.</p>
<p>10.2 Provider shall maintain professional liability insurance coverage of no less than Two Million Dollars ($2,000,000) throughout the term of this agreement.</p>
<p>10.3 Any dispute arising under this Agreement shall be resolved through binding arbitration in San Francisco, California.</p>
<p>10.4 Client shall have the right to conduct one annual compliance audit of Provider's facilities and records, upon thirty (30) days' prior written notice.</p>

<p style="margin-top:24pt"><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the Effective Date.</p>

<table style="width:100%;margin-top:18pt">
<tr>
<td style="width:50%;padding:8pt"><strong>ACME CORPORATION</strong><br/><br/><br/>_________________________<br/>Name: Jane Smith<br/>Title: General Counsel<br/>Date: January 15, 2025</td>
<td style="width:50%;padding:8pt"><strong>TECHSERV SOLUTIONS INC.</strong><br/><br/><br/>_________________________<br/>Name: John Doe<br/>Title: CEO<br/>Date: January 15, 2025</td>
</tr>
</table>`;

// Suggested questions for assistant
export const suggestedQuestions = [
  'What are the payment terms?',
  'What happens if we breach this contract?',
  'Summarize the termination provisions',
  'What are our key obligations?',
  'Are there any missing standard clauses?',
  'What is the liability exposure?',
];
