export const reorderLayer = (images, id, direction) => {
  const sorted = [...images].sort((a, b) => a.zIndex - b.zIndex);
  const index = sorted.findIndex(img => img.id === id);

  if (
    (direction === 'up' && index === sorted.length - 1) ||
    (direction === 'down' && index === 0)
  ) {
    return images; // No change
  }

  const swapIndex = direction === 'up' ? index + 1 : index - 1;

  [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];

  return sorted.map((img, i) => ({
    ...img,
    zIndex: i + 1,
  }));
};
