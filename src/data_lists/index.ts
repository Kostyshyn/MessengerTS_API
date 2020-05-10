export const showFields = <T>(data: T, dataList: string[]): T => {
	return Object.assign({}, ...dataList.map(prop => ({[prop]: data[prop]})));
};