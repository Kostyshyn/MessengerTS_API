import image from '@data_lists/image';
import user from '@data_lists/user';
import origin from '@data_lists/origin';
import request from '@data_lists/request';

export interface Dictionary<T> {
  [key: string]: T;
}

export class Select {

  constructor(private lists: Dictionary<string[]>) {
  }

  public fields(type: string): string[] {
    const list = this.lists[type];
    if (list) {
      return list;
    }
    throw new Error(`The list: '${type}' is not found`);
  }

  public string(type: string): string {
    return this.fields(type).join(' ');
  }

  public project(type: string, inclusion = 1): object {
    return this.fields(type).reduce((o, key) => ({ ...o, [key]: inclusion }), {});
  }

  public showFields = <T>(data: T, dataList: string[]): T => {
    return Object.assign({}, ...dataList.map(prop => ({[prop]: data[prop]})));
  }
}

export default new Select({
  ...user,
  ...image,
  ...origin,
  ...request
});

