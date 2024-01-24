function getLastMonth(endTime = Date.now(), monthSpan = 1) {
  const startTime = new Date(endTime);
  startTime.setMonth(startTime.getMonth() - monthSpan);
  return [+startTime, +endTime];
}
