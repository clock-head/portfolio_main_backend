async function cancelActiveConsultation(consultation) {
  consultation.status = 'cancelled';
  await consultation.save();
  return consultation;
}

async function lockUserOut(user, duration) {
  return user.update({
    lockedUntil: duration,
  });
}

async function verifyTwoCancelled(recentConsultations) {
  if (recentConsultations.length < 2) return false;
  const [first, second] = recentConsultations;
  return first.status === 'cancelled' && second.status === 'cancelled';
}

async function verifyTwoUnresolved(recentConsultations) {
  if (recentConsultations.length < 2) return false;
  const [first, second] = recentConsultations;
  return (
    first.resolution_status === 'open' && second.resolution_status === 'open'
  );
}

async function verifyThreeUnresolved(recentConsultations) {
  if (recentConsultations.length < 3) return false;
  const [first, second, third] = recentConsultations;
  return (
    first.resolution_status === 'open' &&
    second.resolution_status === 'open' &&
    third.resolution_status === 'open'
  );
}

async function verifyFourCancelled(recentConsultations) {
  if (recentConsultations.length < 4) return false;
  const [first, second, third, fourth] = recentConsultations;
  return (
    first.status === 'cancelled' &&
    second.status === 'cancelled' &&
    third.status === 'cancelled' &&
    fourth.status === 'cancelled'
  );
}

async function verifyFourUnresolved(recentConsultations) {
  if (recentConsultations.length < 4) return false;
  const [first, second, third, fourth] = recentConsultations;
  return (
    first.resolution_status === 'open' &&
    second.resolution_status === 'open' &&
    third.resolution_status === 'open' &&
    fourth.resolution_status === 'open'
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
