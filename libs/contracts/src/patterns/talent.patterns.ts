export const TALENT_PATTERNS = {
  CREATE_PROFILE: 'talent.create_profile',
  GET_PROFILE:    'talent.get_profile',
  UPDATE_PROFILE: 'talent.update_profile',
  LIST_PROFILES:  'talent.list_profiles',
  SUBMIT_PROFILE: 'talent.submit_profile',
} as const;

export type TalentPattern = typeof TALENT_PATTERNS[keyof typeof TALENT_PATTERNS];