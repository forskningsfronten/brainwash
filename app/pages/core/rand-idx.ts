export class RandIdx {
  private lastIdx: number = -1;

  getNum(max:number) {
    let x = Math.floor(Math.random() * max);
    while (x === this.lastIdx)
      x = Math.floor(Math.random() * max);
    return x;
  }
}
