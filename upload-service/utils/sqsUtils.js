import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqs } from "../config/awsConfig.js";

export const sendToQueue = async (messageBody) => {
  const params = {
    QueueUrl: process.env.AWS_SQS_QUEUE_URL,
    MessageBody: JSON.stringify(messageBody),
  };

  const command = new SendMessageCommand(params);

  try {
    const result = await sqs.send(command);
    console.log("Message sent to queue:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Error sending message to SQS:", err);
    throw err;
  }
};
