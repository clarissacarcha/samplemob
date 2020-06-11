import Models from "../models";
const { Driver, User, Person, Delivery } = Models;

export default async () => {
  const result = await User.query()
    .findOne({
      username: "9667682812",
    })
    .withGraphFetched({
      driver: true,
      person: true,
      consumer: true,
    });

  console.log(JSON.stringify(result, null, 4));
};
