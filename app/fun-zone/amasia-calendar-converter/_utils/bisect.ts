// [4, 199, 3213, 32144] and 203 => 1
export const bisect =
  (array: Array<number>) =>
  (nr: number): number => {
    let left = 0;
    let right = array.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (array[mid] <= nr) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return left - 1;
  };
