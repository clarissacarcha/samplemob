import Models from "../models";
const { Driver, User, Person, Delivery } = Models;

export default async () => {
  const result = await Delivery.query().withGraphFetched({
    logs: true,
  });

  console.log(JSON.stringify(result, null, 4));
};
