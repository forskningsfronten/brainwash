export class CancelablePromise {

  private hasCanceled_ = false;

  constructor(public promise) {

    this.promise = new Promise((resolve, reject) => {
        promise.then((val) =>
        this.hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
      );
      promise.catch((error) =>
        this.hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
      );
    });
  }

  cancel() {
    this.hasCanceled_ = true;
  }
}

export function timeOutPromise(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
