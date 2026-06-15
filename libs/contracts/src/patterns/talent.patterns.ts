export const TALENT_PATTERNS = {
  CREATE_PROFILE:   'talent.create_profile',
  GET_PROFILE:      'talent.get_profile',
  GET_MY_PROFILE:   'talent.get_my_profile',
  UPDATE_PROFILE:   'talent.update_profile',
  SUBMIT_PROFILE:   'talent.submit_profile',
  UPDATE_SKILLS:    'talent.update_skills',
  UPDATE_PROJECTS:  'talent.update_projects',
  LIST_PROFILES:    'talent.list_profiles',
} as const;

export type TalentPattern = typeof TALENT_PATTERNS[keyof typeof TALENT_PATTERNS];