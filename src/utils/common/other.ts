export const getInstanceName = (name: string) => {
  const index = name.indexOf('管理');
  if (index === -1) {
    return name;
  }
  return name.slice(0, index);
};
