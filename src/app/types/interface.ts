
type coreDataMapper = {
  client: object;
  tableName: string;
  columns: string;

  createFunctionName: string;
  updateFunctionName: string;
}

type locationType = {
  label: string,
  address: string,
  street_number: number,
  zipcode: number,
  city: string,
  lat: number,
  lon: number
}

export { coreDataMapper, locationType }