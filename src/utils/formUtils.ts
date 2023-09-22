import { Timestamp } from '@firebase/firestore';

export const isFormExpired = (
  submissionLimit: Timestamp | undefined
): boolean => {
  if (!submissionLimit) {
    return false;
  }
  return new Date() > submissionLimit.toDate();
};
