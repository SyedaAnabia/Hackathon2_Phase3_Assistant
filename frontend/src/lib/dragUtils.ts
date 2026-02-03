// frontend/src/lib/dragUtils.ts

/**
 * Utility functions for drag and drop functionality
 */

export interface DraggableItem {
  id: string;
  position: number;
}

export const reorder = <T extends DraggableItem>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update positions after reordering
  return result.map((item, index) => ({
    ...item,
    position: index
  }));
};

export const move = <T extends DraggableItem>(
  fromList: T[],
  toList: T[],
  fromIndex: number,
  toIndex: number
): { fromList: T[]; toList: T[] } => {
  const newFromList = Array.from(fromList);
  const [movedItem] = newFromList.splice(fromIndex, 1);

  const newToList = Array.from(toList);
  newToList.splice(toIndex, 0, movedItem);

  // Update positions
  const updatedFromList = newFromList.map((item, index) => ({
    ...item,
    position: index
  }));

  const updatedToList = newToList.map((item, index) => ({
    ...item,
    position: index
  }));

  return {
    fromList: updatedFromList,
    toList: updatedToList
  };
};