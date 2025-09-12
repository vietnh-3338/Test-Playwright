// UI text constants
export const UI_TEXT = {
  QUESTIONS: {
    STEP1: 'あなたは診断を受けたご本人ですか、それともご家族・支援者ですか？',
    STEP2: '診断を受けた方がお住まいの地域の郵便番号を入力し、「住所を検索」を押して下さい。',
    STEP3: '診断を受けた方のご年齢を教えて下さい。',
    STEP4: '希望する生活環境を教えて下さい。',
    STEP5: '要介護認定の取得状況を教えて下さい。',
    STEP6: '介護度を教えて下さい。',
    // Step 7 Review Questions
    STEP7_COMPLETION: 'おつかれさまでした！',
    STEP7_REVIEW_TITLE: '入力内容を確認して下さい。',
    STEP7_REVIEW_Q1: 'あなたは診断を受けたご本人ですか、それともご家族・支援者ですか？',
    STEP7_REVIEW_Q2: '診断を受けた方がお住まいの地域の郵便番号を教えて下さい。',
    STEP7_REVIEW_Q3: '診断を受けた方のご年齢を教えて下さい。',
    STEP7_REVIEW_Q4: '希望する生活環境を教えて下さい。',
    STEP7_REVIEW_Q5: '要介護認定の取得状況を教えて下さい。',
    STEP7_REVIEW_Q6: '介護度を教えて下さい。',
  },
  ANSWERS: {
    PERSONAL: 'ご本人',
    FAMILY: 'ご家族・支援者',
    HOME: '自宅',
    FACILITY: '施設等への入居を検討している',
    // Step 5 answers
    NOT_APPLIED: '未申請または申請中',
    APPROVED: '取得済',
    // Step 6 care level answers
    CARE_LEVEL_1: '要支援1',
    CARE_LEVEL_2: '要支援2',
    NURSING_CARE_1: '要介護1',
    NURSING_CARE_2: '要介護2',
    NURSING_CARE_3: '要介護3',
    NURSING_CARE_4: '要介護4',
    NURSING_CARE_5: '要介護5',
  },
  BUTTONS: {
    NEXT: '次へ進む',
    RESET: '最初からやりなおす',
    SEARCH: '住所を検索',
    CONFIRM: '入力内容確認に進む',
    RESULT: '結果を表示する',
    PDF_SAVE_PC: 'まとめて印刷用に保存',
    PDF_SAVE_MOBILE: '保存',
  },
  PLACEHOLDERS: {
    POSTAL_CODE: '例)0000000（ハイフン不要）',
    ADDRESS_DISPLAY: 'ここに住所が表示されます',
  },
  MESSAGES: {
    AGE_UNDER_40: '(3)本サービスは、介護認定申請の対象年齢を想定したものです。40歳未満の場合の手続きは、こちらをご参照ください。（外部サイトに遷移します）',
    AGE_ZERO_ERROR: '年齢は0から始まる数値を入力できません。',
    POSTAL_CODE_ERROR_SHORT: '7桁で入力してください',
    POSTAL_CODE_ERROR_UNSUPPORTED: '大変申し訳ありませんが、現在サービス未対応地域です',
  },
  EXTERNAL_LINKS: {
    SUPPORT_LINK: 'https://y-ninchisyotel.net/support/',
    SUPPORT_LINK_TEXT: 'こちら',
  },
  // PDF related text
  PDF: {
    SUGGESTED_FILENAME: 'shindango-results.pdf',
  }
} as const;

// CSS selectors and class names
export const SELECTORS = {
  CSS_CLASSES: {
    DISABLED_CURSOR: 'cursor-not-allowed',
  }
} as const;
