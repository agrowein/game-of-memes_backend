
export  const checkReady = (ready: any) => {
  return !ready.some((record) => record.ready === false);
};