// Application constants
export const APP_CONFIG = {
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 15000,
    EXTRA_LONG: 60000, // Tăng timeout cho networkidle
  },
  WAIT_TIMES: {
    PAGE_LOAD: 1000, // Giảm wait time hơn nữa
    UI_UPDATE: 500,
    SEARCH_RESPONSE: 1000,
    NAVIGATION: 500,
  }
} as const;

// Test data constants
export const TEST_DATA = {
  POSTAL_CODES: {
    VALID: '0010011',
    INVALID_SHORT: '12345',
    UNSUPPORTED_REGION: '7390144',
  },
  AGES: {
    UNDER_40: '35',
    ZERO: '0',
    VALID_OVER_40: '65',
  },
  EXPECTED_RESULTS: {
    VALID_ADDRESS: '北海道札幌市北区 北十一条西（１〜４丁目）',
    ERROR_SHORT_POSTAL: '7桁で入力してください',
    ERROR_UNSUPPORTED_REGION: '大変申し訳ありませんが、現在サービス未対応地域です',
    AGE_UNDER_40_MESSAGE: '(3)本サービスは、介護認定申請の対象年齢を想定したものです。40歳未満の場合の手続きは、こちらをご参照ください。（外部サイトに遷移します）',
    AGE_ZERO_ERROR: '年齢は0から始まる数値を入力できません。',
    STEP4_QUESTION: '希望する生活環境を教えて下さい。',
    STEP5_QUESTION: '要介護認定の取得状況を教えて下さい。',
    STEP6_QUESTION: '介護度を教えて下さい。',
    STEP7_COMPLETION: 'おつかれさまでした！',
  }
} as const;
// CSS selectors and class names
export const SELECTORS = {
  CSS_CLASSES: {
    DISABLED_CURSOR: 'cursor-not-allowed',
  }
} as const;