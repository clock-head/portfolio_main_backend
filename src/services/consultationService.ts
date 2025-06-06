import { Consultation } from '../models/consultation.model';
import { User } from '../models/user.model';

async function cancelActiveConsultation(consultation: Consultation) {
  consultation.resolutionStatus = 'cancelled';
  await consultation.save();
  return consultation;
}

async function lockUserOut(user: User, duration: Date) {
  return user.update({
    lockedUntil: duration,
  });
}

async function verifyTwoCancelled(recentConsultations: Array<Consultation>) {
  if (recentConsultations.length < 2) return false;
  const [first, second] = recentConsultations;

  return (
    first.resolutionStatus === 'cancelled' &&
    second.resolutionStatus === 'cancelled'
  );
}

async function verifyTwoUnresolved(recentConsultations: Array<Consultation>) {
  console.log(recentConsultations);
  if (recentConsultations.length < 2) return false;
  const [first, second] = recentConsultations;
  return (
    first.resolutionStatus === 'open' && second.resolutionStatus === 'open'
  );
}

async function verifyThreeUnresolved(recentConsultations: Array<Consultation>) {
  if (recentConsultations.length < 3) return false;
  const [first, second, third] = recentConsultations;

  return (
    first.resolutionStatus === 'open' &&
    second.resolutionStatus === 'open' &&
    third.resolutionStatus === 'open'
  );
}

async function verifyFourCancelled(recentConsultations: Array<Consultation>) {
  if (recentConsultations.length < 4) return false;
  const [first, second, third, fourth] = recentConsultations;

  return (
    first.resolutionStatus === 'cancelled' &&
    second.resolutionStatus === 'cancelled' &&
    third.resolutionStatus === 'cancelled' &&
    fourth.resolutionStatus === 'cancelled'
  );
}

async function verifyFourUnresolved(recentConsultations: Array<Consultation>) {
  if (recentConsultations.length < 4) return false;
  const [first, second, third, fourth] = recentConsultations;

  return (
    first.resolutionStatus === 'open' &&
    second.resolutionStatus === 'open' &&
    third.resolutionStatus === 'open' &&
    fourth.resolutionStatus === 'open'
  );
}

module.exports = {
  verifyTwoCancelled,
  verifyTwoUnresolved,
  verifyThreeUnresolved,
  verifyFourCancelled,
  verifyFourUnresolved,
  cancelActiveConsultation,
  lockUserOut,
};
