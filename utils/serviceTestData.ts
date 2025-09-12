/**
 * Test data for service verification on results page
 * Contains expected service details for different care levels and living environments
 */

export interface ServiceData {
  service: string;
  category: string;
  overviewSnippet: string;
  priceSnippet: string;
  referenceText: string;
  referenceHrefContains: string;
}

export interface ServiceTestConfig {
  careLevel: string;
  livingEnvironment: 'home' | 'facility'; // Câu 4: 自宅 hoặc 施設
  expectedServices: ServiceData[];
  description: string;
}

/**
 * Expected services data for different care levels and environments
 */

// 要介護5 + 自宅 (highest care level at home - certification is always approved)
export const CARE_LEVEL_5_HOME: ServiceData[] = [
  {
    service: '訪問介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、訪問介護員（ホームヘルパー）が利用者の自宅を訪問し、食事・排泄・入浴などの介護（身体介護）や、掃除・洗濯・買い物・調理などの生活の支援（生活援助）をします',
    priceSnippet: '339円 / 回',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '定期巡回・随時対応型訪問看護介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、定期的な巡回や随時通報への対応など、利用者の心身の状況に応じて、24時間365日必要なサービスを必要なタイミングで柔軟に提供します',
    priceSnippet: '30,909円/ 月',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '通所介護',
    category: '通所介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、デイサービスセンターに通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います',
    priceSnippet: '1,167円 / 回',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '認知症対応型通所介護',
    category: '通所介護',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスで、利用者が可能な限り自宅で自立した日常生活を送ることができるよう、認知症の利用者がデイサービスセンターに通い',
    priceSnippet: '1,496円 / 回',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '短期入所生活介護',
    category: 'ショートステイ',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、短期間施設等に宿泊して、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います',
    priceSnippet: '1,120円 / 回',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '小規模多機能型居宅介護',
    category: '訪問、通い、短期宿泊組合わせ',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、利用者の選択に応じて、施設への「通い」を中心として、短期間の「宿泊」や利用者の自宅への「訪問」を組合せ',
    priceSnippet: '32,626円/ 月',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  }
];

// 要介護5 + 施設 (highest care level at facility)
export const CARE_LEVEL_5_FACILITY: ServiceData[] = [
  {
    service: '特別養護老人ホーム',
    category: '',
    overviewSnippet: '入所者が可能な限り在宅復帰できることを念頭に、常に介護が必要な方の入所を受け入れ、入浴や食事などの日常生活上の支援や、機能訓練、療養上の世話などを提供します',
    priceSnippet: '31,672円/ 月',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/types-of-nursing-facility'
  },
  {
    service: '介護老人保険施設',
    category: '',
    overviewSnippet: '在宅復帰を目指している方の入所を受け入れ、入所者が可能な限り自立した日常生活を送ることができるよう、リハビリテーションや必要な医療、介護などを提供します',
    priceSnippet: '35,139円/ 月',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/types-of-nursing-facility'
  },
  {
    service: '介護医療院',
    category: '',
    overviewSnippet: '長期にわたって療養が必要である方の入所を受け入れ、利用者が可能な限り自立した日常生活を送ることができるよう、療養上の管理、看護、介護、機能訓練、その他必要な医療と日常生活に必要なサービスなどを提供します',
    priceSnippet: '42,948円/ 月',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/types-of-nursing-facility'
  },
  {
    service: '特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '27,351円/ 月',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/types-of-nursing-facility'
  },
  {
    service: '認知症対応型共同生活介護',
    category: '',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスです。利用者が可能な限り自立した日常生活を送ることができるよう、認知症の利用者が、グループホームに入居し、家庭的な環境と地域住民との交流の下で',
    priceSnippet: '30,312円/ 月',
    referenceText: 'グループホーム（認知症対応型共同生活介護施設）とは？',
    referenceHrefContains: 'https://theotol.soudan-e65.com/care/group-home'
  },
  {
    service: '地域密着型介護老人福祉施設入所者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、入所定員30人未満の介護老人福祉施設（特別養護老人ホーム）が、常に介護が必要な方の入所を受け入れ',
    priceSnippet: '33,928円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '地域密着型特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた入居定員30人未満の有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '26,883円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// 要介護4 + 自宅
export const CARE_LEVEL_4_HOME: ServiceData[] = [
  {
    service: '訪問介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、訪問介護員（ホームヘルパー）が利用者の自宅を訪問し、食事・排泄・入浴などの介護（身体介護）や、掃除・洗濯・買い物・調理などの生活の支援（生活援助）をします。通院などを目的とした乗車・降車・移動の介助サービスを提供する事業所もあります。',
    priceSnippet: '317円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '定期巡回・随時対応型訪問看護介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、定期的な巡回や随時通報への対応など、利用者の心身の状況に応じて、24時間365日必要なサービスを必要なタイミングで柔軟に提供します。',
    priceSnippet: '25,718円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '通所介護',
    category: '通所介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、デイサービスセンターに通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います。心身機能の維持や家族の介護の負担軽減などを目的として実施します。',
    priceSnippet: '1,056円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '認知症対応型通所介護',
    category: '通所介護',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスで、利用者が可能な限り自宅で自立した日常生活を送ることができるよう、認知症の利用者がデイサービスセンターに通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います。心身機能の維持や家族の介護の負担軽減などを目的として実施します。',
    priceSnippet: '1,374円 / 回',
    referenceText: '認知症対応型通所介護（認知症デイサービス）の特徴と利用方法を解説します',
    referenceHrefContains: 'https://theotol.soudan-e65.com/support/day-service'
  },
  {
    service: '短期入所生活介護',
    category: 'ショートステイ',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、短期間施設等に宿泊して、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います。心身機能の維持や家族の介護の負担軽減などを目的として実施します。',
    priceSnippet: '1,027円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '小規模多機能型居宅介護',
    category: '訪問、通い、短期宿泊組合わせ',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、利用者の選択に応じて、施設への「通い」を中心として、短期間の「宿泊」や利用者の自宅への「訪問」を組合せ、家庭的な環境と地域住民との交流の下で日常生活上の支援や機能訓練を行います。',
    priceSnippet: '29,770円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// 要介護4 + 施設
export const CARE_LEVEL_4_FACILITY: ServiceData[] = [
  {
    service: '特別養護老人ホーム',
    category: '',
    overviewSnippet: '入所者が可能な限り在宅復帰できることを念頭に、常に介護が必要な方の入所を受け入れ、入浴や食事などの日常生活上の支援や、機能訓練、療養上の世話などを提供します',
    priceSnippet: '29,517円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '介護老人保険施設',
    category: '',
    overviewSnippet: '在宅復帰を目指している方の入所を受け入れ、入所者が可能な限り自立した日常生活を送ることができるよう、リハビリテーションや必要な医療、介護などを提供します',
    priceSnippet: '33,418円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '介護医療院',
    category: '',
    overviewSnippet: '長期にわたって療養が必要である方の入所を受け入れ、利用者が可能な限り自立した日常生活を送ることができるよう、療養上の管理、看護、介護、機能訓練、その他必要な医療と日常生活に必要なサービスなどを提供します',
    priceSnippet: '40,053円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '25,050円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '認知症対応型共同生活介護',
    category: '',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスです。利用者が可能な限り自立した日常生活を送ることができるよう、認知症の利用者が、グループホームに入居し、家庭的な環境と地域住民との交流の下で',
    priceSnippet: '29,633円',
    referenceText: 'グループホーム（認知症対応型共同生活介護施設）とは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '地域密着型介護老人福祉施設入所者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、入所定員30人未満の介護老人福祉施設（特別養護老人ホーム）が、常に介護が必要な方の入所を受け入れ',
    priceSnippet: '31,543円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '地域密着型特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた入居定員30人未満の有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '24,664円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// 要介護3 + 自宅
export const CARE_LEVEL_3_HOME: ServiceData[] = [
  {
    service: '訪問介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、訪問介護員（ホームヘルパー）が利用者の自宅を訪問し、食事・排泄・入浴などの介護（身体介護）や、掃除・洗濯・買い物・調理などの生活の支援（生活援助）をします',
    priceSnippet: '323円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '定期巡回・随時対応型訪問看護介護',
    category: '訪問介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、定期的な巡回や随時通報への対応など、利用者の心身の状況に応じて、24時間365日必要なサービスを必要なタイミングで柔軟に提供します',
    priceSnippet: '20,634円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '通所介護',
    category: '通所介護',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、デイサービスセンターに通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います',
    priceSnippet: '961円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '認知症対応型通所介護',
    category: '通所介護',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスで、利用者が可能な限り自宅で自立した日常生活を送ることができるよう、認知症の利用者がデイサービスセンターに通い',
    priceSnippet: '1,268円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '短期入所生活介護',
    category: 'ショートステイ',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、短期間施設等に宿泊して、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います',
    priceSnippet: '951円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '小規模多機能型居宅介護',
    category: '訪問、通い、短期宿泊組合わせ',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、利用者の選択に応じて、施設への「通い」を中心として、短期間の「宿泊」や利用者の自宅への「訪問」を組合せ',
    priceSnippet: '27,572円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// 要介護3 + 施設
export const CARE_LEVEL_3_FACILITY: ServiceData[] = [
  {
    service: '特別養護老人ホーム',
    category: '',
    overviewSnippet: '入所者が可能な限り在宅復帰できることを念頭に、常に介護が必要な方の入所を受け入れ、入浴や食事などの日常生活上の支援や、機能訓練、療養上の世話などを提供します',
    priceSnippet: '27,415円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '介護老人保険施設',
    category: '',
    overviewSnippet: '在宅復帰を目指している方の入所を受け入れ、入所者が可能な限り自立した日常生活を送ることができるよう、リハビリテーションや必要な医療、介護などを提供します',
    priceSnippet: '31,640円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '介護医療院',
    category: '',
    overviewSnippet: '長期にわたって療養が必要である方の入所を受け入れ、利用者が可能な限り自立した日常生活を送ることができるよう、療養上の管理、看護、介護、機能訓練、その他必要な医療と日常生活に必要なサービスなどを提供します',
    priceSnippet: '36,373円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '22,973円',
    referenceText: '介護施設の種類や特徴を解説：大切なご家族のための施設選びのポイントとは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '認知症対応型共同生活介護',
    category: '',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスです。利用者が可能な限り自立した日常生活を送ることができるよう、認知症の利用者が、グループホームに入居し、家庭的な環境と地域住民との交流の下で',
    priceSnippet: '29,236円',
    referenceText: 'グループホーム（認知症対応型共同生活介護施設）とは？',
    referenceHrefContains: 'theotol.soudan-e65.com'
  },
  {
    service: '地域密着型介護老人福祉施設入所者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、入所定員30人未満の介護老人福祉施設（特別養護老人ホーム）が、常に介護が必要な方の入所を受け入れ',
    priceSnippet: '29,127円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '地域密着型特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた入居定員30人未満の有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '22,687円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Level 2 + Home Environment (要介護2 + 自宅)
export const CARE_LEVEL_2_HOME: ServiceData[] = [
  {
    service: '訪問介護',
    category: '',
    overviewSnippet: '要介護者の自宅にホームヘルパーが訪問し、身体介護（入浴、排せつ、食事の介助等）や生活援助（調理、洗濯、掃除等の家事）などの日常生活上の世話を行います',
    priceSnippet: '22,687円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '訪問看護',
    category: '',
    overviewSnippet: '主治医の指示に基づいて、看護師が要介護者の自宅を訪問し、療養上の世話や診療の補助を行います',
    priceSnippet: '11,343円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '訪問リハビリテーション',
    category: '',
    overviewSnippet: '要介護者の自宅において、主治医の指示に基づいて理学療法士や作業療法士、言語聴覚士が訪問し、リハビリテーションを行います',
    priceSnippet: '5,105円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'デイサービス（通所介護）',
    category: '',
    overviewSnippet: 'デイサービスセンターなどで、日常生活上の支援や機能訓練を日帰りで提供します',
    priceSnippet: '12,734円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'デイケア（通所リハビリテーション）',
    category: '',
    overviewSnippet: '介護老人保健施設、病院、診療所において、日常生活上の支援や生活機能の維持向上のための機能訓練や口腔機能向上サービスなどを日帰りで提供します',
    priceSnippet: '12,734円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'ショートステイ（短期入所生活介護）',
    category: '',
    overviewSnippet: '介護老人福祉施設などが、常に介護が必要な方の短期間の入所を受け入れ、入浴や食事などの日常生活上の支援や機能訓練などを提供します',
    priceSnippet: '11,343円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'ショートステイ（短期入所療養介護）',
    category: '',
    overviewSnippet: '介護老人保健施設などが要介護者の短期間の入所を受け入れ、医学的管理の下での介護や機能訓練、その他必要な医療と日常生活上の世話を提供します',
    priceSnippet: '14,119円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '福祉用具貸与',
    category: '',
    overviewSnippet: '要介護者の日常生活の自立を助けるための福祉用具を貸与します',
    priceSnippet: '22,687円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '特定福祉用具購入費',
    category: '',
    overviewSnippet: '貸与になじまない福祉用具（腰掛便座、入浴補助用具等）の購入費を支給します',
    priceSnippet: '113,434円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '住宅改修費',
    category: '',
    overviewSnippet: '要介護者が自宅で生活しやすいように手すりの取付けや段差解消などの住宅改修を行う際、改修費を支給します',
    priceSnippet: '226,868円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '居宅介護支援',
    category: '',
    overviewSnippet: '要介護者が自宅で適切にサービスを利用できるように、心身の状況や生活環境に応じてケアプランを作成し、サービス事業者との連絡調整などを行います',
    priceSnippet: '22,687円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Level 1 + Home Environment (要介護1 + 自宅)
export const CARE_LEVEL_1_HOME: ServiceData[] = [
  {
    service: '訪問介護',
    category: '',
    overviewSnippet: '要介護者の自宅にホームヘルパーが訪問し、身体介護（入浴、排せつ、食事の介助等）や生活援助（調理、洗濯、掃除等の家事）などの日常生活上の世話を行います',
    priceSnippet: '16,765円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '訪問看護',
    category: '',
    overviewSnippet: '主治医の指示に基づいて、看護師が要介護者の自宅を訪問し、療養上の世話や診療の補助を行います',
    priceSnippet: '8,382円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '訪問リハビリテーション',
    category: '',
    overviewSnippet: '要介護者の自宅において、主治医の指示に基づいて理学療法士や作業療法士、言語聴覚士が訪問し、リハビリテーションを行います',
    priceSnippet: '3,773円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'デイサービス（通所介護）',
    category: '',
    overviewSnippet: 'デイサービスセンターなどで、日常生活上の支援や機能訓練を日帰りで提供します',
    priceSnippet: '9,412円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'デイケア（通所リハビリテーション）',
    category: '',
    overviewSnippet: '介護老人保健施設、病院、診療所において、日常生活上の支援や生活機能の維持向上のための機能訓練や口腔機能向上サービスなどを日帰りで提供します',
    priceSnippet: '9,412円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'ショートステイ（短期入所生活介護）',
    category: '',
    overviewSnippet: '介護老人福祉施設などが、常に介護が必要な方の短期間の入所を受け入れ、入浴や食事などの日常生活上の支援や機能訓練などを提供します',
    priceSnippet: '8,382円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: 'ショートステイ（短期入所療養介護）',
    category: '',
    overviewSnippet: '介護老人保健施設などが要介護者の短期間の入所を受け入れ、医学的管理の下での介護や機能訓練、その他必要な医療と日常生活上の世話を提供します',
    priceSnippet: '10,432円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '福祉用具貸与',
    category: '',
    overviewSnippet: '要介護者の日常生活の自立を助けるための福祉用具を貸与します',
    priceSnippet: '16,765円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '特定福祉用具購入費',
    category: '',
    overviewSnippet: '貸与になじまない福祉用具（腰掛便座、入浴補助用具等）の購入費を支給します',
    priceSnippet: '83,824円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '住宅改修費',
    category: '',
    overviewSnippet: '要介護者が自宅で生活しやすいように手すりの取付けや段差解消などの住宅改修を行う際、改修費を支給します',
    priceSnippet: '167,647円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '居宅介護支援',
    category: '',
    overviewSnippet: '要介護者が自宅で適切にサービスを利用できるように、心身の状況や生活環境に応じてケアプランを作成し、サービス事業者との連絡調整などを行います',
    priceSnippet: '16,765円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Support Level 2 + Home Environment (要支援2 + 自宅)
export const CARE_SUPPORT_2_HOME: ServiceData[] = [
  {
    service: '介護予防訪問介護',
    category: '',
    overviewSnippet: '要支援者が自立した生活を送れるよう、ホームヘルパーが自宅を訪問し、身体介護や生活援助のサービスを提供します',
    priceSnippet: '10,473円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防訪問看護',
    category: '',
    overviewSnippet: '主治医の指示に基づいて、看護師が要支援者の自宅を訪問し、介護予防を目的とした療養上の世話や診療の補助を行います',
    priceSnippet: '5,236円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防訪問リハビリテーション',
    category: '',
    overviewSnippet: '要支援者の自宅において、主治医の指示に基づいて理学療法士や作業療法士、言語聴覚士が訪問し、介護予防を目的としたリハビリテーションを行います',
    priceSnippet: '2,355円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防通所介護',
    category: '',
    overviewSnippet: 'デイサービスセンターなどで、要支援者に対して介護予防を目的とした日常生活上の支援や機能訓練を日帰りで提供します',
    priceSnippet: '5,888円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防通所リハビリテーション',
    category: '',
    overviewSnippet: '介護老人保健施設、病院、診療所において、要支援者に対して介護予防を目的とした日常生活上の支援や生活機能の維持向上のための機能訓練などを日帰りで提供します',
    priceSnippet: '5,888円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防短期入所生活介護',
    category: '',
    overviewSnippet: '介護老人福祉施設などが要支援者の短期間の入所を受け入れ、介護予防を目的とした日常生活上の支援や機能訓練などを提供します',
    priceSnippet: '5,236円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防短期入所療養介護',
    category: '',
    overviewSnippet: '介護老人保健施設などが要支援者の短期間の入所を受け入れ、介護予防を目的とした医学的管理の下での介護や機能訓練、その他必要な医療と日常生活上の世話を提供します',
    priceSnippet: '6,518円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防福祉用具貸与',
    category: '',
    overviewSnippet: '要支援者の介護予防と日常生活の自立を助けるための福祉用具を貸与します',
    priceSnippet: '10,473円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '特定介護予防福祉用具購入費',
    category: '',
    overviewSnippet: '貸与になじまない福祉用具（腰掛便座、入浴補助用具等）の購入費を支給します',
    priceSnippet: '52,365円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防住宅改修費',
    category: '',
    overviewSnippet: '要支援者が自宅で自立した生活を送れるよう手すりの取付けや段差解消などの住宅改修を行う際、改修費を支給します',
    priceSnippet: '104,730円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防支援',
    category: '',
    overviewSnippet: '要支援者が自宅で適切に介護予防サービスを利用できるように、心身の状況や生活環境に応じて介護予防ケアプランを作成し、サービス事業者との連絡調整などを行います',
    priceSnippet: '10,473円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Support Level 1 + Home Environment (要支援1 + 自宅)
export const CARE_SUPPORT_1_HOME: ServiceData[] = [
  {
    service: '介護予防訪問看護',
    category: '訪問介護​',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、利用者の心身機能の維持回復などを目的として、看護師などが利用者の自宅を訪問し、主治医の指示に基づいて療養上の世話や診療の補助を行います。',
    priceSnippet: '452円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防通所リハビリテーション',
    category: '通所介護​',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、利用者が通所リハビリテーションの施設（老人保健施設、病院、診療所など）に通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練や口腔機能向上サービスなどを日帰りで受けることができます。',
    priceSnippet: '2,522円 / 月',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防認知症対応型通所介護',
    category: '通所介護​',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスで、利用者が可能な限り自宅で自立した日常生活を送ることができるよう、認知症の利用者がデイサービスセンターに通い、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います。心身機能の維持や家族の介護の負担軽減などを目的として実施します。',
    priceSnippet: '819円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防短期入所生活介護',
    category: 'ショート​ステイ​',
    overviewSnippet: '利用者が可能な限り自宅で自立した日常生活を送ることができるよう、短期間施設等に宿泊して、食事や入浴などの日常生活上の支援や、生活機能向上のための機能訓練を行います。心身機能の維持や家族の介護の負担軽減などを目的として実施します。',
    priceSnippet: '552円 / 回',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防小規模多機能型居宅',
    category: '訪問、通い、​短期宿泊​組合わせ',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、利用者の選択に応じて、施設への「通い」を中心として、短期間の「宿泊」や利用者の自宅への「訪問」を組合せ、家庭的な環境と地域住民との交流の下で日常生活上の支援や機能訓練を行います。',
    priceSnippet: '5,302円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Support Level 2 + Facility Environment (要支援2 + 施設)
export const CARE_SUPPORT_2_FACILITY: ServiceData[] = [
  {
    service: '介護予防特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '10,845円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防認知症対応型共同生活介護',
    category: '',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスです。利用者が可能な限り自立した日常生活を送ることができるよう、認知症の利用者が、グループホームに入居し、家庭的な環境と地域住民との交流の下で、食事や入浴などの日常生活上の支援や、機能訓練などのサービスを受けます',
    priceSnippet: '25,376円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Support Level 1 + Facility Environment (要支援1 + 施設)
export const CARE_SUPPORT_1_FACILITY: ServiceData[] = [
  {
    service: '介護予防特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '6,616円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Level 2 + Facility Environment (要介護2 + 施設)
export const CARE_LEVEL_2_FACILITY: ServiceData[] = [
  {
    service: '介護予防特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します。',
    priceSnippet: '10,845円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護予防認知症対応型共同生活介護',
    category: '',
    overviewSnippet: '認知症の利用者を対象にした専門的なケアを提供するサービスです。利用者が可能な限り自立した日常生活を送ることができるよう、認知症の利用者が、グループホームに入居し、家庭的な環境と地域住民との交流の下で、食事や入浴などの日常生活上の支援や、機能訓練などのサービスを受けます。',
    priceSnippet: '25,376円/ 月',
    referenceText: '',
    referenceHrefContains: ''
  }
];

// Care Level 1 + Facility Environment (要介護1 + 施設)
export const CARE_LEVEL_1_FACILITY: ServiceData[] = [
  {
    service: '介護老人福祉施設',
    category: '',
    overviewSnippet: '常に介護が必要で、自宅での生活が困難な方が入所します。食事や入浴などの日常生活上の支援や、機能訓練、健康管理、療養上の世話などを行います',
    priceSnippet: '167,650円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護老人保健施設',
    category: '',
    overviewSnippet: '病状が安定し、リハビリテーションに重点をおいた介護が必要な方が入所します。医学的管理の下で介護や看護、リハビリテーションを行います',
    priceSnippet: '174,431円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '介護療養型医療施設',
    category: '',
    overviewSnippet: '急性期の治療は終わったものの、医学的管理の下で長期間の療養が必要な方のための医療機関の病床です',
    priceSnippet: '196,812円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた入居定員30人以上の有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '125,741円',
    referenceText: '',
    referenceHrefContains: ''
  },
  {
    service: '地域密着型特定施設入居者生活介護',
    category: '',
    overviewSnippet: '利用者が可能な限り自立した日常生活を送ることができるよう、指定を受けた入居定員30人未満の有料老人ホームや軽費老人ホームなどが、食事や入浴などの日常生活上の支援や、機能訓練などを提供します',
    priceSnippet: '125,741円',
    referenceText: '',
    referenceHrefContains: ''
  }
];

/**
 * Service test configurations for different scenarios
 * Based on combination of: Care Level (câu 6) + Living Environment (câu 4)
 * Note: Certification Status (câu 5) is always 'approved' (取得済) for result page testing
 */
export const SERVICE_TEST_CONFIGS: ServiceTestConfig[] = [
  // Care Level 5 (要介護5) combinations
  {
    careLevel: '要介護5',
    livingEnvironment: 'home',
    expectedServices: CARE_LEVEL_5_HOME,
    description: '要介護5 - 自宅での生活 (Highest care level at home)'
  },
  {
    careLevel: '要介護5',
    livingEnvironment: 'facility',
    expectedServices: CARE_LEVEL_5_FACILITY,
    description: '要介護5 - 施設での生活 (Highest care level at facility)'
  },
  
  // Care Level 4 (要介護4) combinations  
  {
    careLevel: '要介護4',
    livingEnvironment: 'home',
    expectedServices: CARE_LEVEL_4_HOME,
    description: '要介護4 - 自宅での生活 (High care level at home)'
  },
  {
    careLevel: '要介護4',
    livingEnvironment: 'facility',
    expectedServices: CARE_LEVEL_4_FACILITY,
    description: '要介護4 - 施設での生活 (High care level at facility)'
  },
  
  // Care Level 3 (要介護3) combinations
  {
    careLevel: '要介護3',
    livingEnvironment: 'home',
    expectedServices: CARE_LEVEL_3_HOME,
    description: '要介護3 - 自宅での生活 (Medium care level at home)'
  },
  {
    careLevel: '要介護3',
    livingEnvironment: 'facility',
    expectedServices: CARE_LEVEL_3_FACILITY,
    description: '要介護3 - 施設での生活 (Medium care level at facility)'
  },
  
  // Care Level 2 (要介護2) combinations
  {
    careLevel: '要介護2',
    livingEnvironment: 'home',
    expectedServices: CARE_LEVEL_2_HOME,
    description: '要介護2 - 自宅での生活 (Low-medium care level at home)'
  },
  {
    careLevel: '要介護2',
    livingEnvironment: 'facility',
    expectedServices: CARE_LEVEL_2_FACILITY,
    description: '要介護2 - 施設での生活 (Low-medium care level at facility)'
  },
  
  // Care Level 1 (要介護1) combinations
  {
    careLevel: '要介護1',
    livingEnvironment: 'home',
    expectedServices: CARE_LEVEL_1_HOME,
    description: '要介護1 - 自宅での生活 (Low care level at home)'
  },
  {
    careLevel: '要介護1',
    livingEnvironment: 'facility',
    expectedServices: CARE_LEVEL_1_FACILITY,
    description: '要介護1 - 施設での生活 (Low care level at facility)'
  },
  
  // Care Support Level 2 (要支援2) combinations
  {
    careLevel: '要支援2',
    livingEnvironment: 'home',
    expectedServices: CARE_SUPPORT_2_HOME,
    description: '要支援2 - 自宅での生活 (Support level 2 at home)'
  },
  {
    careLevel: '要支援2',
    livingEnvironment: 'facility',
    expectedServices: CARE_SUPPORT_2_FACILITY,
    description: '要支援2 - 施設での生活 (Support level 2 at facility)'
  },
  
  // Care Support Level 1 (要支援1) combinations
  {
    careLevel: '要支援1',
    livingEnvironment: 'home',
    expectedServices: CARE_SUPPORT_1_HOME,
    description: '要支援1 - 自宅での生活 (Support level 1 at home)'
  },
  {
    careLevel: '要支援1',
    livingEnvironment: 'facility',
    expectedServices: CARE_SUPPORT_1_FACILITY,
    description: '要支援1 - 施設での生活 (Support level 1 at facility)'
  }
];

/**
 * Get service data for a specific care scenario
 * @param careLevel - Care level from step 6 (要介護1, 要介護3, 要介護5, 要支援2, etc.)
 * @param livingEnvironment - Living environment from step 4 ('home' for 自宅, 'facility' for 施設)
 * Note: Certification status is always 'approved' (取得済) for result page testing
 */
export function getServiceData(
  careLevel: string, 
  livingEnvironment: 'home' | 'facility' = 'home'
): ServiceData[] {
  const config = SERVICE_TEST_CONFIGS.find(
    c => c.careLevel === careLevel && 
         c.livingEnvironment === livingEnvironment
  );
  
  if (!config) {
    throw new Error(
      `No service data found for: Care Level: ${careLevel}, Environment: ${livingEnvironment}\n` +
      `Available configurations: ${SERVICE_TEST_CONFIGS.map(c => `${c.careLevel}-${c.livingEnvironment}`).join(', ')}`
    );
  }
  
  return config.expectedServices;
}

/**
 * Get all available test configurations
 */
export function getAvailableConfigurations(): string[] {
  return SERVICE_TEST_CONFIGS.map(config => 
    `${config.careLevel} + ${config.livingEnvironment}: ${config.description}`
  );
}

/**
 * Helper function to create a test scenario description
 */
export function createScenarioDescription(
  careLevel: string,
  livingEnvironment: 'home' | 'facility'
): string {
  const envText = livingEnvironment === 'home' ? '自宅' : '施設';
  return `${careLevel} - ${envText}での生活`;
}

/**
 * Validate if a service data configuration exists
 */
export function hasServiceData(
  careLevel: string, 
  livingEnvironment: 'home' | 'facility' = 'home'
): boolean {
  return SERVICE_TEST_CONFIGS.some(
    c => c.careLevel === careLevel && 
         c.livingEnvironment === livingEnvironment
  );
}
