// Test data scenarios for comprehensive Step 7 review testing
export interface TestScenario {
  scenarioName: string;
  step1Selection: 'personal' | 'family';
  step1Expected: string;
  step2PostalCode: string;
  step2Expected: string;
  step3Age: string;
  step3Expected: string;
  step4Selection: 'home' | 'facility';
  step4Expected: string;
  step5Selection: 'approved' | 'notApplied';
  step5Expected: string;
  step6CareLevel: string;
  step6Expected: string;
  description: string;
}

export const TEST_SCENARIOS: TestScenario[] = [
  {
    scenarioName: 'Personal User - Hokkaido Kita - Middle Age - Home Care',
    step1Selection: 'personal',
    step1Expected: 'ご本人',
    step2PostalCode: '0010012',
    step2Expected: '001‑0012（北海道札幌市北区 北十二条西（１〜４丁目））',
    step3Age: '45',
    step3Expected: '45',
    step4Selection: 'home',
    step4Expected: '自宅',
    step5Selection: 'approved',
    step5Expected: '取得済',
    step6CareLevel: '要介護1',
    step6Expected: '要介護1',
    description: 'Personal user from Hokkaido Kita, middle-aged, wants home care with 要介護1'
  },
  {
    scenarioName: 'Family Member - Hokkaido Taihei - Senior - Home Care',
    step1Selection: 'family',
    step1Expected: 'ご家族・支援者',
    step2PostalCode: '0028006',
    step2Expected: '002‑8006（北海道札幌市北区 太平六条）',
    step3Age: '75',
    step3Expected: '75',
    step4Selection: 'home',
    step4Expected: '自宅',
    step5Selection: 'approved',
    step5Expected: '取得済',
    step6CareLevel: '要介護3',
    step6Expected: '要介護3',
    description: 'Family member from Hokkaido Taihei, senior citizen, wants home care with 要介護3'
  },
  {
    scenarioName: 'Personal User - Hokkaido Chuo - Young Senior - Facility Care',
    step1Selection: 'personal',
    step1Expected: 'ご本人',
    step2PostalCode: '0640802',
    step2Expected: '064‑0802（北海道札幌市中央区 南二条西（２０〜２８丁目））',
    step3Age: '68',
    step3Expected: '68',
    step4Selection: 'facility',
    step4Expected: '施設',
    step5Selection: 'approved',
    step5Expected: '取得済',
    step6CareLevel: '要支援2',
    step6Expected: '要支援2',
    description: 'Personal user from Hokkaido Chuo, young senior, wants facility care with 要支援2'
  },
  {
    scenarioName: 'Family Member - Hokkaido Higashi - Elder - High Care Level',
    step1Selection: 'family',
    step1Expected: 'ご家族・支援者',
    step2PostalCode: '0070894',
    step2Expected: '007‑0894（北海道札幌市東区 中沼西四条）',
    step3Age: '85',
    step3Expected: '85',
    step4Selection: 'home',
    step4Expected: '自宅',
    step5Selection: 'approved',
    step5Expected: '取得済',
    step6CareLevel: '要介護5',
    step6Expected: '要介護5',
    description: 'Family member from Hokkaido Higashi, elderly person, home care with highest care level'
  },
  {
    scenarioName: 'Personal User - Hokkaido Minami - Mid Senior - Not Applied Yet',
    step1Selection: 'personal',
    step1Expected: 'ご本人',
    step2PostalCode: '0050865',
    step2Expected: '005‑0865（北海道札幌市南区 常盤（１〜１３１番地））',
    step3Age: '72',
    step3Expected: '72',
    step4Selection: 'home',
    step4Expected: '自宅',
    step5Selection: 'notApplied',
    step5Expected: '未申請または申請中',
    step6CareLevel: '', // No step 6 when not applied
    step6Expected: '',
    description: 'Personal user from Hokkaido Minami, has not applied for care certification yet'
  }
];

// Helper function to get scenario by name
export function getScenarioByName(name: string): TestScenario | undefined {
  return TEST_SCENARIOS.find(scenario => scenario.scenarioName === name);
}

// Helper function to get scenarios by criteria
export function getScenariosByCriteria(criteria: Partial<TestScenario>): TestScenario[] {
  return TEST_SCENARIOS.filter(scenario => {
    return Object.entries(criteria).every(([key, value]) => 
      scenario[key as keyof TestScenario] === value
    );
  });
}

// Helper to get all approved scenarios (that reach step 6)
export function getApprovedScenarios(): TestScenario[] {
  return TEST_SCENARIOS.filter(scenario => scenario.step5Selection === 'approved');
}

// Helper to get all not-applied scenarios (that end at step 5)
export function getNotAppliedScenarios(): TestScenario[] {
  return TEST_SCENARIOS.filter(scenario => scenario.step5Selection === 'notApplied');
}
