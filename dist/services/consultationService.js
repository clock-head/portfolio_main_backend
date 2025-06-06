"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function cancelActiveConsultation(consultation) {
    consultation.resolutionStatus = 'cancelled';
    await consultation.save();
    return consultation;
}
async function lockUserOut(user, duration) {
    return user.update({
        lockedUntil: duration,
    });
}
async function verifyTwoCancelled(recentConsultations) {
    if (recentConsultations.length < 2)
        return false;
    const [first, second] = recentConsultations;
    return (first.resolutionStatus === 'cancelled' &&
        second.resolutionStatus === 'cancelled');
}
async function verifyTwoUnresolved(recentConsultations) {
    if (recentConsultations.length < 2)
        return false;
    const [first, second] = recentConsultations;
    return (first.resolutionStatus === 'open' && second.resolutionStatus === 'open');
}
async function verifyThreeUnresolved(recentConsultations) {
    if (recentConsultations.length < 3)
        return false;
    const [first, second, third] = recentConsultations;
    return (first.resolutionStatus === 'open' &&
        second.resolutionStatus === 'open' &&
        third.resolutionStatus === 'open');
}
async function verifyFourCancelled(recentConsultations) {
    if (recentConsultations.length < 4)
        return false;
    const [first, second, third, fourth] = recentConsultations;
    return (first.resolutionStatus === 'cancelled' &&
        second.resolutionStatus === 'cancelled' &&
        third.resolutionStatus === 'cancelled' &&
        fourth.resolutionStatus === 'cancelled');
}
async function verifyFourUnresolved(recentConsultations) {
    if (recentConsultations.length < 4)
        return false;
    const [first, second, third, fourth] = recentConsultations;
    return (first.resolutionStatus === 'open' &&
        second.resolutionStatus === 'open' &&
        third.resolutionStatus === 'open' &&
        fourth.resolutionStatus === 'open');
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
