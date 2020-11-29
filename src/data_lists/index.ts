import image from '@data_lists/image';
import user from '@data_lists/user';
import origin from '@data_lists/origin';

export interface Dictionary<T> {
  [key: string]: T;
}

export class Select {

  constructor(private lists: Dictionary<string[]>) {
  }

  public fields(type: string): string[] {
    const list = this.lists[type];
    if (list) {
      return this.lists[type];
    }
    throw new Error(`The list: '${type}' is not found`);
  }

  public string(type: string): string {
    return this.fields(type).join(' ');
  }

  public showFields = <T>(data: T, dataList: string[]): T => {
    return Object.assign({}, ...dataList.map(prop => ({[prop]: data[prop]})));
  }
}

export default new Select({
  ...user,
  ...image,
  ...origin
});

