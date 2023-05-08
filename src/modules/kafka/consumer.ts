import { KafkaConsumer, ConsumerConfig } from "@dinedrop/shared";
import { restaurantService } from "../restaurant";

const consumerConfig: ConsumerConfig = {
  brokers: ["my-cluster-kafka-bootstrap.kafka:9092"],
  groupId: "100",
};

const consumer = new KafkaConsumer(consumerConfig);

consumer.on("restaurant-registered", async (result) => {
  const value = result.value?.toString();
  if (value === undefined || value == "{}") return;
  try {
    const restaurant = JSON.parse(value);
    const newRestaurant = await restaurantService.createRestaurant(restaurant);
    console.log("new restaurant created: ", newRestaurant);
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe(["restaurant-registered"]);
  await consumer.run();
}

export default runConsumer;
