export const TALENT_EVENTS = {
  APPROVED:  'talent.approved',
  REJECTED:  'talent.rejected',
  SUBMITTED: 'talent.submitted',
} as const;

export interface TalentApprovedEvent {
  talent_id: string;
  user_id: string;
  email: string;
  full_name: string;
  approved_by: string;
  approved_at: Date;
}

export interface TalentRejectedEvent {
  talent_id: string;
  user_id: string;
  email: string;
  full_name: string;
  rejected_by: string;
  reason: string;
}