import { connection, database, sendMemorie } from "./config";

export function queryAsync(sql: any) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

//* When the user talk to us for the first time, we need put 1 intent
export async function firstIntent(senderId: string) {
  queryAsync(
    `INSERT INTO ${database}.intents (intent, sender) values ('1','${senderId}')`
  );
}

export async function readIntent(senderId: string) {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM ${database}.intents WHERE sender= '${senderId}'`,
      (error, result) => {
        if (!error) {
          if (typeof result[0] != "undefined") {
            const intent = result[0].intent;
            //console.log(intent);
            resolve(intent);
          } else {
            firstIntent(senderId);
            resolve(1);
          }
        }
      }
    );
  });
}

export async function loopMemories(senderId: string, message: string) {
  const result = await queryAsync(
    `SELECT * FROM ${database}.intents WHERE sender = ${senderId}`
  );

  if (result[0]) {
    const mem2 = result[0].variable_temporal1;
    const mem3 = result[0].variable_temporal2;

    await sendMemorie(senderId, 1, mem2);
    await sendMemorie(senderId, 2, mem3);
    await sendMemorie(senderId, 3, message);
  }
}
export async function loopMemoriesGpt(senderId: string, response: string) {
  const result = await queryAsync(
    `SELECT * FROM intents WHERE sender = ${senderId}`
  );

  if (result[0]) {
    const mem2 = result[0].gpt_temporal1;
    const mem3 = result[0].gpt_temporal2;

    await sendMemoryGpt(senderId, 1, mem2);
    await sendMemoryGpt(senderId, 2, mem3);
    await sendMemoryGpt(senderId, 3, response);
  }
}

export async function getMemory(senderId: string, memory?: any) {
  const result = await queryAsync(
    `SELECT * FROM ${database}.intents WHERE sender = '${senderId}'`
  );

  if (result[0]) {
    const mem1 = result[0].variable_temporal;
    const mem2 = result[0].variable_temporal1;
    const mem3 = result[0].variable_temporal2;

    const resultado =
      (memory >= 1 ? mem1 + "\n" : "") +
      (memory >= 2 ? mem2 + "\n" : "") +
      (memory >= 3 ? mem3 + "\n" : "");
    console.log("la memoria de usuario es : " + resultado);

    return resultado;
  }
}

//esta función quita el espacio entre parrafos de un string
export async function removeSpaces(message: string) {
  return message.replace(/\n/g, " ");
}

export async function convertQuotes(str) {
  if (typeof str === "string") {
    return str.replace(/"/g, "'");
  }
}

export async function sendMemory(
  senderId: string,
  numMemory: number,
  message: string
) {
  if (message != undefined) {
    message = message.trim();
  }
  const sanitizeData = await convertQuotes(message);

  switch (numMemory) {
    case 1:
      await queryAsync(
        `UPDATE ${database}.intents SET variable_temporal = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
    case 2:
      await queryAsync(
        `UPDATE ${database}.intents SET variable_temporal1 = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
    case 3:
      await queryAsync(
        `UPDATE ${database}.intents SET variable_temporal2 = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
  }
}

export async function sendMemoryGpt(
  senderId: string,
  numMemory: number,
  message: string
) {
  if (message != undefined) {
    message = message.trim();
  }
  const sanitizeData = await convertQuotes(message);

  switch (numMemory) {
    case 1:
      await queryAsync(
        `UPDATE ${database}.intents SET gpt_temporal = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
    case 2:
      await queryAsync(
        `UPDATE ${database}.intents SET gpt_temporal1 = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
    case 3:
      await queryAsync(
        `UPDATE ${database}.intents SET gpt_temporal2 = "${sanitizeData}" WHERE sender= '${senderId}'`
      );
      break;
  }
}

export async function changeIntent(senderId: string, intent: string | number) {
  await queryAsync(
    `UPDATE ${database}.intents SET intent = '${intent}' WHERE sender= '${senderId}'`
  );
}
